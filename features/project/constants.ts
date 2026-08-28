// 프로젝트 공통 사용값

import { ProjectStatus } from "./types";

// 프로젝트 상태별 라벨
export const statusLabel: Record<ProjectStatus, string> = {
    QUOTATION: "견적중",
    ACTIVE: "진행중",
    ARCHIVED: "보관",
};

// 프로젝트 상태별 스타일
export const statusClassName: Record<ProjectStatus, string> = {
    QUOTATION: "bg-blue-50 text-blue-700",
    ACTIVE: "bg-green-50 text-green-700",
    ARCHIVED: "bg-gray-100 text-gray-600",
};
