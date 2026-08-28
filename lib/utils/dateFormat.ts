// lib/utils/date.ts

// DateTime 문자열을 "YYYY-MM-DD HH:mm" 형식으로 변환합니다.
export const formatDateTime = (dateTime?: string | null) => {
    if (!dateTime) return '-';

    return dateTime.slice(0, 16).replace('T', ' ');
};