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

export const useCardStatus = (projectId: string) => {
    const queryClient = useQueryClient();

    return useMutation<Card, Error, CardStatusMutationVariables>({
        mutationFn: async ({ id, data }) => {
            console.log("상태 변경 요청:", id, data);

            // PATCH 요청으로 카드 상태 변경
            const response = await apiClient.patch(`/cards/${id}/status`, data);

            return response.data;
        },

        onSuccess: (_, variables) => {
            // 보드 목록 다시 조회
            queryClient.invalidateQueries({
                queryKey: [`/projects/${projectId}/cards`],
            });

            // 카드 상세 조회 캐시도 갱신
            queryClient.invalidateQueries({
                queryKey: ["/cards", variables.id],
            });
        },
    });
};
