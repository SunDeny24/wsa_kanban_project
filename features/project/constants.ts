// 공통 사용값

import { ProjectStatus } from "./types";

export const statusLabel: Record<ProjectStatus, string> = {
    QUOTATION: "견적중",
    ACTIVE: "진행중",
    ARCHIVED: "보관",
};

export const statusClassName: Record<ProjectStatus, string> = {
    QUOTATION: "bg-blue-50 text-blue-700",
    ACTIVE: "bg-green-50 text-green-700",
    ARCHIVED: "bg-gray-100 text-gray-600",
};