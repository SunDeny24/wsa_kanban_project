"use client";

import { useState } from "react";
import { AlertCircle, FileText, Plus, RefreshCw } from "lucide-react";
import { ConfirmModal } from "@/components/common/ConfirmModal";
import { ErrorModal } from "@/components/common/ErrorModal";
import { QuotationCreate } from "@/features/quotation/components/QuotationCreate";
import { QuotationTimelineCard } from "@/features/quotation/components/QuotationTimelineCard";
import type { Project } from "@/features/project/types";
import type { Quotation } from "@/features/quotation/types";
import {
    useEntityListQuery,
    useEntityQuery,
    useUpdateEntity,
} from "@/lib/hooks/useEntity";
import { getErrorResponse } from "@/lib/api/error";
import type { ErrorResponse } from "@/types/api";

interface QuotationListProps {
    projectId: string;
}

type ConfirmAction = {
    type: "confirm" | "reject";
    quotation: Quotation;
};

export const QuotationList = ({ projectId }: QuotationListProps) => {
    const quotationsEndpoint = `/projects/${projectId}/quotations`;
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [confirmAction, setConfirmAction] = useState<ConfirmAction | null>(
        null
    );
    const [actionError, setActionError] = useState<ErrorResponse | null>(null);

    // 프로젝트가 견적중일 때만 새 리비전을 생성할 수 있습니다.
    const { data: project } = useEntityQuery<Project>("/projects", projectId, {
        enabled: Boolean(projectId),
    });
    const canCreateQuotation = project?.status === "QUOTATION";

    // 서버가 revision 내림차순으로 반환하므로 받은 배열을 그대로 표시합니다.
    const { data, isLoading, error, refetch, isFetching } = useEntityListQuery<
        Quotation[]
    >(quotationsEndpoint, undefined, {
        enabled: Boolean(projectId),
    });

    const commonMutationOptions = {
        invalidateKeys: [[quotationsEndpoint]],
        onErrorCallback: (mutationError: unknown) =>
            setActionError(getErrorResponse(mutationError)),
    };

    // 공통 PATCH 훅의 id에 상태 액션 경로를 포함해 동적 URL을 구성합니다.
    const sendMutation = useUpdateEntity<void, Quotation>(
        "/quotations",
        commonMutationOptions
    );
    const rejectMutation = useUpdateEntity<void, Quotation>(
        "/quotations",
        commonMutationOptions
    );
    const confirmMutation = useUpdateEntity<void, Quotation>("/quotations", {
        ...commonMutationOptions,
        // 확정 시 서버가 프로젝트 상태도 변경하므로 상세와 목록을 함께 갱신합니다.
        invalidateKeys: [
            [quotationsEndpoint],
            ["/projects", projectId],
            ["/projects"],
        ],
    });

    const handleSend = (quotation: Quotation) => {
        sendMutation.mutate({ id: `${quotation.id}/send`, data: undefined });
    };

    const handleConfirmAction = () => {
        if (!confirmAction) return;

        const { type, quotation } = confirmAction;
        const mutation = type === "confirm" ? confirmMutation : rejectMutation;
        mutation.mutate(
            { id: `${quotation.id}/${type}`, data: undefined },
            { onSuccess: () => setConfirmAction(null) }
        );
    };

    const pendingQuotationId = sendMutation.isPending
        ? sendMutation.variables?.id.split("/")[0]
        : confirmMutation.isPending
          ? confirmMutation.variables?.id.split("/")[0]
          : rejectMutation.isPending
            ? rejectMutation.variables?.id.split("/")[0]
            : undefined;
    const pendingAction = sendMutation.isPending
        ? "send"
        : confirmMutation.isPending
          ? "confirm"
          : rejectMutation.isPending
            ? "reject"
            : undefined;

    if (isLoading) {
        return (
            <div className="flex min-h-64 items-center justify-center rounded-xl border border-zinc-200 bg-white">
                <p className="text-sm text-zinc-500">
                    견적 이력을 불러오는 중...
                </p>
            </div>
        );
    }

    // 견적 이력 조회 실패 시, 프로젝트 정보와 네트워크 상태를 확인하도록 안내합니다.
    if (error) {
        return (
            <div className="flex min-h-64 flex-col items-center justify-center gap-3 rounded-xl border border-red-100 bg-white px-6 text-center">
                <AlertCircle
                    className="h-6 w-6 text-red-500"
                    aria-hidden="true"
                />
                <div>
                    <p className="text-sm font-medium text-zinc-800">
                        견적 이력을 불러오지 못했습니다.
                    </p>
                    <p className="mt-1 text-xs text-zinc-500">
                        프로젝트 정보와 네트워크 상태를 확인해주세요.
                    </p>
                </div>
                <button
                    type="button"
                    onClick={() => void refetch()}
                    disabled={isFetching}
                    className="inline-flex h-9 items-center gap-2 rounded-lg border border-zinc-300 px-3 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 disabled:opacity-50">
                    <RefreshCw
                        className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
                        aria-hidden="true"
                    />
                    다시 시도
                </button>
            </div>
        );
    }

    const quotations = data ?? [];

    return (
        <section aria-labelledby="quotation-list-title">
            <header className="mb-5 flex items-start justify-between gap-3">
                <div>
                    <div className="flex items-center gap-2">
                        <h1
                            id="quotation-list-title"
                            className="text-lg font-semibold tracking-tight text-zinc-800">
                            견적 리비전
                        </h1>
                        <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-600">
                            {quotations.length}
                        </span>
                    </div>
                    <p className="mt-1 text-sm text-zinc-500">
                        최신 리비전부터 전체 견적 이력을 확인합니다.
                    </p>
                </div>
                {canCreateQuotation && (
                    <button
                        type="button"
                        onClick={() => setIsCreateModalOpen(true)}
                        className="inline-flex h-9 shrink-0 items-center gap-2 rounded-xl bg-zinc-900 px-3 text-sm font-medium text-white shadow-sm transition hover:bg-zinc-800 active:scale-[0.98] sm:px-4">
                        <Plus className="h-4 w-4" aria-hidden="true" />
                        <span className="hidden sm:inline">견적 생성</span>
                    </button>
                )}
            </header>

            {quotations.length === 0 ? (
                <div className="flex min-h-64 flex-col items-center justify-center rounded-xl border border-dashed border-zinc-300 bg-white px-6 text-center">
                    <FileText
                        className="h-8 w-8 text-zinc-300"
                        aria-hidden="true"
                    />
                    <p className="mt-3 text-sm font-medium text-zinc-700">
                        등록된 견적이 없습니다.
                    </p>
                    <p className="mt-1 text-xs text-zinc-500">
                        새 견적이 생성되면 리비전 이력이 여기에 표시됩니다.
                    </p>
                </div>
            ) : (
                <ol className="relative space-y-4 before:absolute before:bottom-5 before:left-[11px] before:top-5 before:w-px before:bg-zinc-200">
                    {quotations.map((quotation, index) => (
                        <li key={quotation.id} className="relative pl-9">
                            <span
                                className={`absolute left-0 top-5 z-10 h-6 w-6 rounded-full border-4 border-white ${
                                    index === 0 ? "bg-blue-600" : "bg-zinc-300"
                                }`}
                                aria-hidden="true"
                            />
                            <QuotationTimelineCard
                                quotation={quotation}
                                isLatest={index === 0}
                                pendingAction={
                                    pendingQuotationId === quotation.id
                                        ? pendingAction
                                        : undefined
                                }
                                onSend={handleSend}
                                onConfirm={(item) =>
                                    setConfirmAction({
                                        type: "confirm",
                                        quotation: item,
                                    })
                                }
                                onReject={(item) =>
                                    setConfirmAction({
                                        type: "reject",
                                        quotation: item,
                                    })
                                }
                                isQuotation={canCreateQuotation}
                            />
                        </li>
                    ))}
                </ol>
            )}

            {canCreateQuotation && (
                <QuotationCreate
                    projectId={projectId}
                    open={isCreateModalOpen}
                    onClose={() => setIsCreateModalOpen(false)}
                />
            )}

            <ConfirmModal
                isOpen={confirmAction !== null}
                title={
                    confirmAction?.type === "confirm"
                        ? "견적을 확정하시겠습니까?"
                        : "견적을 반려하시겠습니까?"
                }
                description={
                    confirmAction?.type === "confirm"
                        ? "확정 시 프로젝트가 진행중 상태로 변경됩니다."
                        : "반려 후에는 새 견적 리비전을 생성해서 다시 진행해야 합니다."
                }
                confirmText={
                    confirmAction?.type === "confirm" ? "확정" : "반려"
                }
                variant={
                    confirmAction?.type === "reject" ? "danger" : "default"
                }
                isLoading={
                    confirmMutation.isPending || rejectMutation.isPending
                }
                onConfirm={handleConfirmAction}
                onCancel={() => setConfirmAction(null)}
            />

            <ErrorModal
                open={actionError !== null}
                message={actionError?.message}
                status={actionError?.status}
                onClose={() => setActionError(null)}
            />
        </section>
    );
};

export default QuotationList;
