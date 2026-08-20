"use client";

import { useState } from "react";
import {
    AlertCircle,
    CalendarDays,
    FileText,
    Plus,
    RefreshCw,
} from "lucide-react";
import {
    quotationStatusClassName,
    quotationStatusLabel,
} from "@/features/quotation/constants";
import { QuotationCreate } from "@/features/quotation/components/QuotationCreate";
import type { Project } from "@/features/project/types";
import type { Quotation } from "@/features/quotation/types";
import { useEntityListQuery, useEntityQuery } from "@/lib/hooks/useEntity";

interface QuotationListProps {
    projectId: string;
}

const formatAmount = (amount: number) =>
    new Intl.NumberFormat("ko-KR", { maximumFractionDigits: 20 }).format(
        amount
    );

const formatDate = (date: string | null) => date || "미지정";

export const QuotationList = ({ projectId }: QuotationListProps) => {
    const quotationsEndpoint = `/projects/${projectId}/quotations`;
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

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

    if (isLoading) {
        return (
            <div className="flex min-h-64 items-center justify-center rounded-xl border border-zinc-200 bg-white">
                <p className="text-sm text-zinc-500">
                    견적 이력을 불러오는 중...
                </p>
            </div>
        );
    }

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
                            <article className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm sm:p-5">
                                <div className="flex flex-wrap items-start justify-between gap-3">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <h2 className="font-semibold text-zinc-900">
                                            Revision {quotation.revision}
                                        </h2>
                                        {index === 0 && (
                                            <span className="rounded-full bg-blue-600 px-2 py-0.5 text-[11px] font-semibold text-white">
                                                최신
                                            </span>
                                        )}
                                        <span
                                            className={`rounded-full border px-2.5 py-1 text-xs font-medium ${quotationStatusClassName[quotation.status]}`}>
                                            {
                                                quotationStatusLabel[
                                                    quotation.status
                                                ]
                                            }
                                        </span>
                                    </div>
                                    <p className="text-lg font-semibold tabular-nums text-zinc-900">
                                        {formatAmount(quotation.amount)}
                                    </p>
                                </div>

                                <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-6 text-zinc-600">
                                    {quotation.description ||
                                        "설명이 없습니다."}
                                </p>

                                <dl className="mt-4 flex flex-wrap gap-x-6 gap-y-2 border-t border-zinc-100 pt-3 text-xs text-zinc-500">
                                    <div className="flex items-center gap-1.5">
                                        <CalendarDays
                                            className="h-3.5 w-3.5"
                                            aria-hidden="true"
                                        />
                                        <dt>발행일</dt>
                                        <dd className="font-medium text-zinc-700">
                                            {formatDate(quotation.issuedAt)}
                                        </dd>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <dt>유효기간</dt>
                                        <dd className="font-medium text-zinc-700">
                                            {formatDate(quotation.validUntil)}
                                        </dd>
                                    </div>
                                </dl>
                            </article>
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
        </section>
    );
};

export default QuotationList;
