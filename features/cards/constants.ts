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
export const priorityStyle: Record<
    PriorityType,
    {
        background: string;
        border: string;
        text: string;
    }
> = {
    LOW: {
        background: "bg-zinc-100",
        border: "border-zinc-200",
        text: "text-zinc-500",
    },

    MEDIUM: {
        background: "bg-orange-50",
        border: "border-orange-100",
        text: "text-orange-600",
    },

    HIGH: {
        background: "bg-red-50",
        border: "border-red-100",
        text: "text-red-600",
    },

    URGENT: {
        background: "bg-red-100",
        border: "border-red-600",
        text: "text-red-600",
    },
};

// 컬럼별 스타일 정의
export const statusStyle: Record<
    CardStatus,
    {
        background: string;
        border: string;
        title: string;
        count: string;
    }
> = {
    TODO: {
        background: "bg-green-50",
        border: "border-green-100",
        title: "text-green-700",
        count: "bg-green-100 text-green-600",
    },

    IN_PROGRESS: {
        background: "bg-orange-50",
        border: "border-orange-100",
        title: "text-orange-700",
        count: "bg-orange-100 text-orange-600",
    },

    HOLD: {
        background: "bg-violet-50",
        border: "border-violet-100",
        title: "text-violet-700",
        count: "bg-violet-100 text-violet-600",
    },

    DONE: {
        background: "bg-rose-50",
        border: "border-rose-100",
        title: "text-rose-700",
        count: "bg-rose-100 text-rose-600",
    },
};
