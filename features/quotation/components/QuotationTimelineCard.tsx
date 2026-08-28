import { CalendarDays } from "lucide-react";
import {
    quotationStatusClassName,
    quotationStatusLabel,
} from "@/features/quotation/constants";
import type { Quotation } from "@/features/quotation/types";

interface QuotationTimelineCardProps {
    quotation: Quotation;
    isLatest: boolean;
    pendingAction?: "send" | "confirm" | "reject";
    onSend: (quotation: Quotation) => void;
    onConfirm: (quotation: Quotation) => void;
    onReject: (quotation: Quotation) => void;
    isQuotation: boolean;
}

const formatAmount = (amount: number) =>
    new Intl.NumberFormat("ko-KR", { maximumFractionDigits: 20 }).format(
        amount
    );

const formatDate = (date: string | null) => date || "미지정";

const primaryButtonClass =
    "shrink-0 whitespace-nowrap rounded-lg bg-zinc-900 px-2 py-1 text-xs font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50 sm:px-3 sm:text-sm";
const dangerButtonClass =
    "shrink-0 whitespace-nowrap rounded-lg border border-red-500 bg-white px-2 py-1 text-xs font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 sm:px-3 sm:text-sm";

export const QuotationTimelineCard = ({
    quotation,
    isLatest,
    pendingAction,
    onSend,
    onConfirm,
    onReject,
    isQuotation,
}: QuotationTimelineCardProps) => {
    const isPending = pendingAction !== undefined;

    return (
        <article className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm sm:p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-semibold text-zinc-900">
                        Revision {quotation.revision}
                    </h2>
                    {isLatest && (
                        <span className="rounded-full bg-blue-600 px-2 py-0.5 text-[11px] font-semibold text-white">
                            최신
                        </span>
                    )}
                    <span
                        className={`rounded-full border px-2.5 py-1 text-xs font-medium ${quotationStatusClassName[quotation.status]}`}>
                        {quotationStatusLabel[quotation.status]}
                    </span>
                </div>
                <p className="text-lg font-semibold tabular-nums text-zinc-900">
                    {formatAmount(quotation.amount)}
                </p>
            </div>

            <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-6 text-zinc-600">
                {quotation.description || "설명이 없습니다."}
            </p>

            <div className="mt-4 flex items-center justify-between gap-2 border-t border-zinc-100 pt-3">
                <dl className="flex min-w-0 flex-wrap gap-x-6 gap-y-2 text-xs text-zinc-500">
                    <div className="flex items-center gap-1.5">
                        <CalendarDays
                            className="h-3.5 w-3.5 shrink-0"
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

                {/* 상태 변경 액션은 날짜 행의 오른쪽에만 노출합니다. */}
                <div className="flex shrink-0 items-center gap-1.5">
                    {/* 상태가 작성중일 경우 발송버튼*/}
                    {isQuotation && quotation.status === "DRAFT" && (
                        <button
                            type="button"
                            onClick={() => onSend(quotation)}
                            disabled={isPending}
                            className={primaryButtonClass}>
                            {pendingAction === "send" ? "발송 중..." : "발송"}
                        </button>
                    )}
                    {/* 상태가 발송일 경우 확정이랑 반려버튼 */}
                    {isQuotation && quotation.status === "SENT" && (
                        <>
                            <button
                                type="button"
                                onClick={() => onConfirm(quotation)}
                                disabled={isPending}
                                className={primaryButtonClass}>
                                {pendingAction === "confirm"
                                    ? "확정 중..."
                                    : "확정"}
                            </button>
                            <button
                                type="button"
                                onClick={() => onReject(quotation)}
                                disabled={isPending}
                                className={dangerButtonClass}>
                                {pendingAction === "reject"
                                    ? "반려 중..."
                                    : "반려"}
                            </button>
                        </>
                    )}
                </div>
            </div>
        </article>
    );
};
