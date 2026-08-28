// 카드 상태 변경 훅

// features/cards/hooks/useCardStatus.ts

import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/axios/instance";
import type { Card, CardStatus } from "@/features/cards/types";

interface CardStatusUpdateRequest {
    status: CardStatus;
    memo?: string;
}
interface CardStatusMutationVariables {
    id: string;
    data: CardStatusUpdateRequest;
}

interface CardStatusMutationContext {
    previousCards?: Card[];
}

export const useCardStatus = (projectId: string) => {
    const queryClient = useQueryClient();
    const boardQueryKey = [`/projects/${projectId}/cards`, undefined] as const;

    return useMutation<
        Card,
        Error,
        CardStatusMutationVariables,
        CardStatusMutationContext
    >({
        // 카드 상태 변경 API 요청
        mutationFn: async ({ id, data }) => {
            //console.log("카드 상태 변경 요청:", id, data);

            // PATCH 요청으로 카드 상태 변경
            const response = await apiClient.patch(`/cards/${id}/status`, data);

            return response.data;
        },

        // Optimistic Update: 카드 상태 변경 요청 전에 UI에서 상태를 먼저 변경
        onMutate: async (variables) => {
            // 상태 변경 실패 시 복구하기 위해 진행 중인 보드 재조회를 취소
            await queryClient.cancelQueries({ queryKey: boardQueryKey });

            // 상태 변경 실패 시 복구하기 위해 현재 보드 데이터를 백업
            const previousCards =
                queryClient.getQueryData<Card[]>(boardQueryKey);

            // API 응답 전에 UI에서 카드 상태를 먼저 변경 (Optimistic Update)
            queryClient.setQueryData<Card[]>(boardQueryKey, (currentCards) =>
                currentCards?.map((card) =>
                    card.id === variables.id
                        ? { ...card, status: variables.data.status }
                        : card
                )
            );

            return { previousCards };
        },

        // 상태 변경 API 요청 실패 시 이전 카드 목록으로 롤백
        onError: (_error, _variables, context) => {
            if (context?.previousCards) {
                queryClient.setQueryData(boardQueryKey, context.previousCards);
            }
        },

        // 상태 변경 API 요청 성공 시 캐시 갱신
        onSuccess: (_, variables) => {
            // 카드 상세 조회 캐시도 갱신
            queryClient.invalidateQueries({
                queryKey: ["/cards", variables.id],
            });
        },

        // 상태 변경 API 요청 성공/실패 이후 서버 데이터와 최종 동기화
        onSettled: () => {
            queryClient.invalidateQueries({
                queryKey: boardQueryKey,
            });
        },
    });
};
