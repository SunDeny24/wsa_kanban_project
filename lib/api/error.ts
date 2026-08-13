// 공통 에러 처리

import axios from "axios";
import { ErrorResponse } from "@/types/api";

const DEFAULT_ERROR_MESSAGE = "요청 처리 중 오류가 발생했습니다.";

// 서버에서 받은 에러 응답을 ErrorResponse 타입으로 변환
export const getErrorResponse = (
    error: unknown,
): ErrorResponse => {
    if (axios.isAxiosError(error)) {
        const data = error.response?.data;

        if (data?.message) {
            return {
                timestamp: data.timestamp ?? new Date().toISOString(),
                status: data.status ?? error.response?.status ?? 500,
                message: data.message,
                fieldErrors: data.fieldErrors,
            };
        }
    }

    return {
        timestamp: new Date().toISOString(),
        status: 500,
        message: DEFAULT_ERROR_MESSAGE,
    };
};