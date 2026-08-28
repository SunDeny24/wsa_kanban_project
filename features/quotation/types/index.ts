import type { BaseTimeEntity } from "@/types/api";

// 백엔드 견적 상태 명세와 동일한 문자열 유니온입니다.
export type QuotationStatus =
    "DRAFT" | "SENT" | "CONFIRMED" | "REJECTED" | "SUPERSEDED";

// GET /projects/{projectId}/quotations 응답의 견적 리비전입니다.
export interface Quotation extends BaseTimeEntity {
    id: string;
    projectId: string;
    revision: number;
    status: QuotationStatus;
    amount: number;
    description: string | null;
    issuedAt: string | null;
    validUntil: string | null;
    confirmedAt: string | null;
}

// 생성 시 서버가 자동으로 정하는 필드는 요청 본문에서 제외합니다.
export interface QuotationCreateRequest {
    amount: number;
    description?: string;
    issuedAt?: string;
    validUntil?: string;
}
