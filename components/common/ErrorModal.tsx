import React, { useEffect } from 'react';

interface ErrorModalProps {
  /** 모달 표시 여부 */
  open: boolean;
  /** 서버에서 반환된 에러 메시지 */
  message?: string;
  /** HTTP 상태 코드 */
  status?: number;
  /** 다시 시도 버튼 클릭 시 실행할 콜백 */
  onRetry?: () => void;
  /** 닫기 버튼 클릭 시 실행할 콜백 */
  onClose: () => void;
}

/**
 * 공통 API 에러 모달 컴포넌트
 *
 * - ErrorResponse의 message, status를 받아 사용자에게 표시한다.
 * - fieldErrors는 이 모달에서 처리하지 않는다. (Form 레벨에서 별도 처리)
 * - open prop으로 표시 여부를 제어한다.
 *
 * @example
 * <ErrorModal
 *   open={!!error}
 *   message={error?.message}
 *   status={error?.status}
 *   onRetry={refetch}
 *   onClose={() => setError(null)}
 * />
 */
export const ErrorModal = ({
  open,
  message,
  status,
  onRetry,
  onClose,
}: ErrorModalProps) => {
  // ESC 키로 닫기
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  // 스크롤 잠금
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!open) return null;

  return (
    /* Backdrop */
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="error-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      {/* Dimmed overlay */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal panel */}
      <div className="relative w-full max-w-sm rounded-xl border border-gray-200 bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-start gap-3 border-b border-gray-100 px-6 py-5">
          {/* Error icon */}
          <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-100">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-4 w-4 text-red-600"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm-1-9a1 1 0 0 1 2 0v3a1 1 0 0 1-2 0V9zm1 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"
                clipRule="evenodd"
              />
            </svg>
          </span>

          <div className="flex-1 min-w-0">
            <h2
              id="error-modal-title"
              className="text-base font-semibold text-gray-900"
            >
              오류가 발생했습니다
            </h2>
            {status !== undefined && (
              <span className="mt-0.5 inline-block text-xs text-gray-400">
                오류 코드: {status}
              </span>
            )}
          </div>

          {/* Close (X) button */}
          <button
            type="button"
            id="error-modal-close-x"
            onClick={onClose}
            className="ml-2 shrink-0 rounded-md p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-black"
            aria-label="닫기"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-4 w-4"
              aria-hidden="true"
            >
              <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22z" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-3">
          {message && (
            <p className="text-sm text-gray-700 break-words">{message}</p>
          )}
          <p className="text-xs text-gray-400">잠시 후 다시 시도해주세요.</p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 border-t border-gray-100 px-6 py-4">
          <button
            type="button"
            id="error-modal-close"
            onClick={onClose}
            className="h-9 rounded-md border border-gray-300 px-4 text-sm font-medium text-gray-700 transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black"
          >
            닫기
          </button>

          {onRetry && (
            <button
              type="button"
              id="error-modal-retry"
              onClick={onRetry}
              className="h-9 rounded-md bg-black px-4 text-sm font-medium text-white transition hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-1"
            >
              다시 시도
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorModal;
