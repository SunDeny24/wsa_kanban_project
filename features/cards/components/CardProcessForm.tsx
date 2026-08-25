"use client";
// 처리정보 저장 폼

import { useEffect } from "react";

import type { Card, CardUpdateForm } from "@/features/cards/types";
import { useUpdateEntityForm } from "@/lib/hooks/useQueryForm";
import { toCardUpdateRequest } from "@/features/cards/utils/cardMapper";
import { formatDateTime } from "@/lib/utils/dateFormat";
import CardErrorToast from "@/features/cards/components/CardErrorToast";

interface CardProcessFormProps {
    card: Card;
    projectId: string;
    onDirtyChange?: (dirty: boolean) => void;
    onCardUnavailable: () => void;
}

export const CardProcessForm = ({
    card,
    projectId,
    onDirtyChange,
    onCardUnavailable,
}: CardProcessFormProps) => {
    // input 또는 textarea를 건드렸는지 여부

    const {
        register,
        onSubmit,
        reset,
        formState: { errors, isDirty },
        isPending,
        errorResponse,
        clearErrorResponse,
        mutation,
    } = useUpdateEntityForm<CardUpdateForm, Card, Card>("/cards", card.id, {
        // CardDetail에서 이미 조회했으므로 GET 중복 방지
        queryOptions: {
            enabled: false,
        },

        // PATCH 시 전체 CardUpdateForm이 필요하므로
        // 기존 카드 값을 전체 form 데이터로 넣음
        formOptions: {
            defaultValues: toCardUpdateRequest(card),
        },
        // disabled query가 캐시 데이터를 반환해도 전체 수정 payload 형식을 유지
        mapQueryData: toCardUpdateRequest,

        mutationOptions: {
            invalidateKeys: [[`/projects/${projectId}/cards`]],

            onSuccessCallback: (updatedCard) => {
                // 저장된 최신 데이터를 새로운 기준값으로 설정
                reset(toCardUpdateRequest(updatedCard));
            },
        },
    });

    // CardDetail의 card가 갱신되면 form도 최신 값으로 동기화
    useEffect(() => {
        if (isDirty) return;

        reset(toCardUpdateRequest(card));
    }, [card, reset, isDirty]);

    /*
     * 부모 CardDetail에게 처리 정보가 수정 중인지 전달
     */
    useEffect(() => {
        onDirtyChange?.(isDirty);

        return () => {
            onDirtyChange?.(false);
        };
    }, [isDirty, onDirtyChange]);

    // ✅ 수정: 처리 정보 PATCH 404 발생 시 stale 상세 종료
    useEffect(() => {
        if (errorResponse?.status === 404) onCardUnavailable();
    }, [errorResponse?.status, onCardUnavailable]);

    const handleCancel = () => {
        // 사용자가 수정한 값 버리고
        // 현재 조회된 card 값으로 되돌림
        reset(toCardUpdateRequest(card));
    };

    // ✅ 수정: 실패했던 전체 PATCH payload로 재시도
    const handleRetry = () => {
        if (!mutation.variables || mutation.isPending) return;
        clearErrorResponse();
        mutation.mutate(mutation.variables);
    };

    return (
        <form onSubmit={onSubmit} noValidate>
            <section>
                <h3 className="mb-4 text-sm font-semibold text-gray-900">
                    처리 정보
                </h3>

                <div className="grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2">
                    {/* 공수 */}
                    <div>
                        <label
                            htmlFor="workHours"
                            className="mb-1 block text-xs font-medium text-gray-500">
                            공수
                        </label>

                        <div className="relative">
                            <input
                                id="workHours"
                                type="number"
                                min={0}
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 pr-12 text-sm"
                                {...register("workHours", {
                                    setValueAs: (value) => {
                                        if (value === "") {
                                            return undefined;
                                        }

                                        return Number(value);
                                    },

                                    validate: (value) => {
                                        // optional이므로 빈 값 허용
                                        if (value === undefined) {
                                            return true;
                                        }

                                        // "ㄴ" → Number("ㄴ") → NaN
                                        if (Number.isNaN(value)) {
                                            return "공수는 숫자로 입력해주세요.";
                                        }

                                        if (!Number.isInteger(value)) {
                                            return "공수는 정수로 입력해주세요.";
                                        }

                                        if (value < 0) {
                                            return "공수는 0 이상이어야 합니다.";
                                        }

                                        return true;
                                    },
                                })}
                            />

                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                                시간
                            </span>
                        </div>

                        {errors.workHours?.message && (
                            <p className="mt-1 text-xs text-red-500">
                                {errors.workHours.message}
                            </p>
                        )}
                    </div>

                    {/* 해결일시 - 조회만 */}
                    {card.status === "DONE" && (
                        <div>
                            <p className="mb-1 text-xs font-medium text-gray-500">
                                해결일시
                            </p>

                            <div className="flex min-h-10 items-center rounded-lg bg-gray-50 px-3 text-sm text-gray-700">
                                {card.resolvedAt
                                    ? formatDateTime(card.resolvedAt)
                                    : "-"}
                            </div>
                        </div>
                    )}
                </div>

                {/* 처리 내용 */}
                <div className="mt-5">
                    <label
                        htmlFor="resolutionNote"
                        className="mb-2 block text-xs font-medium text-gray-500">
                        처리 내용
                    </label>

                    <textarea
                        id="resolutionNote"
                        rows={4}
                        className="min-h-24 w-full resize-none rounded-xl border border-gray-300 px-4 py-3 text-sm leading-6"
                        placeholder="처리 내용을 입력해주세요."
                        {...register("resolutionNote", {
                            maxLength: {
                                value: 4096,
                                message:
                                    "처리 내용은 4096자 이하로 입력해주세요.",
                            },
                        })}
                    />

                    {errors.resolutionNote?.message && (
                        <p className="mt-1 text-xs text-red-500">
                            {errors.resolutionNote.message}
                        </p>
                    )}
                </div>

                {/* 실제 값이 변경됐을 때만 버튼 노출 */}
                {isDirty && (
                    <div className="mt-4 flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={handleCancel}
                            disabled={isPending}
                            className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700">
                            취소
                        </button>

                        <button
                            type="submit"
                            disabled={isPending}
                            className="rounded-lg bg-gray-900 px-4 py-2 text-sm text-white">
                            {isPending ? "저장 중..." : "저장"}
                        </button>
                    </div>
                )}
            </section>

            {/* ✅ 수정: 400은 안내만, 500/Network는 PATCH 재시도 제공 */}
            {errorResponse && errorResponse.status !== 404 && (
                <CardErrorToast
                    title="처리 정보 저장 실패"
                    message="처리 정보를 저장하지 못했습니다."
                    isRetrying={isPending}
                    onRetry={
                        errorResponse.status >= 500 ? handleRetry : undefined
                    }
                    onClose={clearErrorResponse}
                />
            )}
        </form>
    );
};
