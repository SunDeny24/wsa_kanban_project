// 카드 공통 사용값

import type { CardStatus, PriorityType } from "./types";

// 카드 상태 라벨
export const cardStatusLabel: Record<CardStatus, string> = {
    TODO: "할 일",
    IN_PROGRESS: "진행 중",
    HOLD: "보류",
    DONE: "완료",
};

// 카드 우선순위 라벨
export const priorityLabel: Record<PriorityType, string> = {
    LOW: "낮음",
    MEDIUM: "보통",
    HIGH: "높음",
    URGENT: "긴급",
};

// 카드 지원유형 라벨
export const supportTypeLabel: Record<string, string> = {
    REMOTE: "원격 지원",
    ONSITE: "현장 지원",
    PHONE: "모바일 지원",
    NONE: "지원 없음",
};

// 카드 우선순위 스타일
export const priorityClassName: Record<PriorityType, string> = {
    HIGH: "bg-red-50 text-red-600 border-red-100",
    MEDIUM: "bg-orange-50 text-orange-600 border-orange-100",
    LOW: "bg-zinc-100 text-zinc-500 border-zinc-200",
    URGENT: "bg-red-50 text-red-600 border-red-600 border-red-100",
};
