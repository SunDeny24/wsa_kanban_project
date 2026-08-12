/**
 * 공통 API 응답 타입
 */

// 페이지네이션 응답포맷
export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
}
// 공통 엔티티 타입 (생성/수정 시간 포함)
export interface BaseTimeEntity {
  createdAt: string;
  updatedAt: string;
}