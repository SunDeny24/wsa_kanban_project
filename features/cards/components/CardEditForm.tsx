// 카드 수정 폼

import type { Card, CardUpdateForm } from "@/features/cards/types";
import { useUpdateEntityForm } from "@/lib/hooks/useQueryForm";
import { priorityLabel, supportTypeLabel } from "@/features/cards/constants";
import { formatDateTime } from "@/lib/utils/dateFormat";

interface CardEditFormProps {
    card: Card;
    onCancel: () => void;
    onSuccess: () => void;
}

const toCardUpdateRequest = (card: Card): CardUpdateForm => ({
    title: card.title,
    description: card.description ?? undefined,
    priorityType: card.priorityType,
    supportType: card.supportType ?? "NONE",
    assignee: card.assignee ?? undefined,
    workHours: card.workHours ?? undefined,
    resolutionNote: card.resolutionNote ?? undefined,
});

export const CardEditForm = ({
    card,
    onCancel,
    onSuccess,
}: CardEditFormProps) => {
    const {
        data: queryCard,
        isLoading,
        register,
        onSubmit,
        formState: { errors },
        isPending,
    } = useUpdateEntityForm<CardUpdateForm, Card, Card>("/cards", card.id, {
        mapQueryData: toCardUpdateRequest,
        mutationOptions: {
            onSuccessCallback: () => {
                onSuccess();
            },
        },
    });

    if (isLoading) {
        return <div>카드를 불러오는 중...</div>;
    }
    if (!queryCard) {
        return <div>카드를 불러오지 못했습니다.</div>;
    }

    return (
        <form onSubmit={onSubmit} className="flex min-h-0 flex-1 flex-col">
            <div className="min-h-0 flex-1 space-y-7 overflow-y-auto px-6 py-6">
                {/* 제목 */}
                <section>
                    <label
                        htmlFor="title"
                        className="mb-2 block text-sm font-semibold text-gray-900">
                        제목
                    </label>

                    <input
                        id="title"
                        type="text"
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                        {...register("title", {
                            required: "제목을 입력해주세요.",
                            maxLength: {
                                value: 200,
                                message: "제목은 200자 이하로 입력해주세요.",
                            },
                        })}
                    />

                    {errors.title?.message && (
                        <p className="mt-1 text-xs text-red-500">
                            {errors.title.message}
                        </p>
                    )}
                </section>

                {/* 기본 정보 */}
                <section>
                    <h3 className="mb-4 text-sm font-semibold text-gray-900">
                        기본 정보
                    </h3>

                    <div className="grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2">
                        {/* 지원 유형 */}
                        <div>
                            <label
                                htmlFor="supportType"
                                className="mb-1 block text-xs font-medium text-gray-500">
                                지원 유형
                            </label>

                            <select
                                id="supportType"
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                                {...register("supportType", {
                                    required: true,
                                })}>
                                {Object.entries(supportTypeLabel).map(
                                    ([value, label]) => (
                                        <option key={value} value={value}>
                                            {label}
                                        </option>
                                    )
                                )}
                            </select>
                        </div>

                        {/* 우선순위 */}
                        <div>
                            <label
                                htmlFor="priorityType"
                                className="mb-1 block text-xs font-medium text-gray-500">
                                우선순위
                            </label>

                            <select
                                id="priorityType"
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                                {...register("priorityType", {
                                    required: true,
                                })}>
                                {Object.entries(priorityLabel).map(
                                    ([value, label]) => (
                                        <option key={value} value={value}>
                                            {label}
                                        </option>
                                    )
                                )}
                            </select>
                        </div>

                        {/* 요청자 - 수정 API 대상 아님 */}
                        <div>
                            <p className="mb-1 text-xs font-medium text-gray-500">
                                요청자
                            </p>

                            <div className="flex min-h-10 items-center rounded-lg bg-gray-50 px-3 text-sm text-gray-700">
                                {queryCard.assigner ?? "-"}
                            </div>
                        </div>

                        {/* 담당자 */}
                        <div>
                            <label
                                htmlFor="assignee"
                                className="mb-1 block text-xs font-medium text-gray-500">
                                담당자
                            </label>

                            <input
                                id="assignee"
                                type="text"
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                                {...register("assignee")}
                            />
                        </div>

                        {/* 이슈 발생일시 - 수정 API 대상 아님 */}
                        <div>
                            <p className="mb-1 text-xs font-medium text-gray-500">
                                이슈 발생일시
                            </p>

                            <div className="flex min-h-10 items-center rounded-lg bg-gray-50 px-3 text-sm text-gray-700">
                                {queryCard.occurredAt
                                    ? formatDateTime(queryCard.occurredAt)
                                    : "-"}
                            </div>
                        </div>
                    </div>
                </section>

                {/* 상세 설명 */}
                <section>
                    <h3 className="mb-2 text-sm font-semibold text-gray-900">
                        상세 설명
                    </h3>

                    <textarea
                        id="description"
                        rows={4}
                        className="min-h-24 w-full resize-none rounded-xl border border-gray-300 px-4 py-3 text-sm leading-6"
                        {...register("description", {
                            maxLength: {
                                value: 4096,
                                message:
                                    "상세 설명은 4096자 이하로 입력해주세요.",
                            },
                        })}
                    />

                    {errors.description?.message && (
                        <p className="mt-1 text-xs text-red-500">
                            {errors.description.message}
                        </p>
                    )}
                </section>

                {/* 처리 정보 */}
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
                                        min: {
                                            value: 0,
                                            message:
                                                "공수는 0 이상이어야 합니다.",
                                        },
                                        setValueAs: (value) =>
                                            value === ""
                                                ? undefined
                                                : Number(value),
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

                        {/* 해결일시 - 서버 자동 관리 */}
                        {queryCard.status === "DONE" && (
                            <div>
                                <p className="mb-1 text-xs font-medium text-gray-500">
                                    해결일시
                                </p>

                                <div className="flex min-h-10 items-center rounded-lg bg-gray-50 px-3 text-sm text-gray-700">
                                    {queryCard.resolvedAt
                                        ? formatDateTime(queryCard.resolvedAt)
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
                </section>
            </div>

            {/* 취소, 저장 버튼 */}
            <div className="flex shrink-0 justify-end gap-2 border-t border-gray-100 px-6 py-4">
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={isPending}
                    className="rounded-lg border border-gray-300 px-4 py-2 text-sm">
                    취소
                </button>

                <button
                    type="submit"
                    disabled={isPending}
                    className="rounded-lg bg-gray-900 px-4 py-2 text-sm text-white">
                    {isPending ? "저장 중..." : "저장"}
                </button>
            </div>
        </form>
    );
};
