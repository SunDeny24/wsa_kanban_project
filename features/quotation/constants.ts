import type { QuotationStatus } from "@/features/quotation/types";

export const quotationStatusLabel: Record<QuotationStatus, string> = {
    DRAFT: "작성 중",
    SENT: "발송됨",
    CONFIRMED: "확정",
    REJECTED: "반려",
    SUPERSEDED: "대체됨",
};

export const quotationStatusClassName: Record<QuotationStatus, string> = {
    DRAFT: "border-zinc-200 bg-zinc-100 text-zinc-700",
    SENT: "border-blue-200 bg-blue-50 text-blue-700",
    CONFIRMED: "border-emerald-200 bg-emerald-50 text-emerald-700",
    REJECTED: "border-red-200 bg-red-50 text-red-700",
    SUPERSEDED: "border-gray-200 bg-gray-50 text-gray-500",
};
