// 카드 타입 정의

export type CardStatus = "TODO" | "IN_PROGRESS" | "HOLD" | "DONE";

export const cardStatusList: CardStatus[] = [
    "TODO",
    "IN_PROGRESS",
    "HOLD",
    "DONE",
];

export type PriorityType = "HIGH" | "MEDIUM" | "LOW" | "URGENT";

export type SupportType = "REMOTE" | "ONSITE" | "PHONE" | "NONE";

// 카드 단건 데이터 타입 (API 응답 기준)
export interface Card {
    id: string; //카드 ID
    projectId: string; // 프로젝트 ID
    itemId?: string | null; // 관련 아이템 ID
    title: string; // 카드 제목
    description?: string | null; // 카드 설명

    status: CardStatus; // 카드 상태 (투두, 진행중, 보류, 완료)
    priorityType: PriorityType; // 카드 우선순위( LOW,MEDIUM,HIGH,URGENT )
    supportType?: SupportType; // 지원 유형(REMOTE, ONSITE, PHONE, NONE)

    assigner?: string | null; // 요청자
    assignee?: string | null; // 담당자

    occurredAt?: string | null; // 이슈 발생 일시
    resolvedAt?: string | null; // 이슈 해결 일시
    workHours?: number | null; //공수(시간)
    resolutionNote?: string | null; // 처리내용

    createdAt: string; // 카드 생성 일시
    updatedAt: string; // 카드 수정 일시
}

// 카드 생성 요청 타입 정의
export interface CardCreateRequest {
    itemId?: string;
    title: string;
    description?: string;
    priorityType: PriorityType; //우선순위
    supportType: SupportType; //지원유형
    assigner?: string; // 요청자
    assignee?: string; // 담당자
    occurredAt?: string; //이슈 발생일시
}

// 카드 수정 요청 타입 정의
export interface CardUpdateForm {
    title: string;
    description?: string;
    priorityType: Card["priorityType"];
    supportType: Card["supportType"];
    assignee?: string;
    workHours?: number;
    resolutionNote?: string;
}
