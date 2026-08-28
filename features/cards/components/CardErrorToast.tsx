import { AlertCircle, RefreshCw, X } from "lucide-react";

interface CardErrorToastProps {
    title: string;
    message: string;
    isRetrying: boolean;
    onRetry?: () => void;
    onClose: () => void;
}

export const CardErrorToast = ({
    title,
    message,
    isRetrying,
    onRetry,
    onClose,
}: CardErrorToastProps) => {
    return (
        <div
            role="alert"
            aria-live="assertive"
            className="
                fixed bottom-4 left-4 right-4 z-50
                flex items-start gap-3
                rounded-xl border border-red-200
                bg-white p-4
                shadow-lg

                sm:left-auto
                sm:right-5
                sm:bottom-5
                sm:w-full
                sm:max-w-sm
            ">
            {/* 오류 아이콘 */}
            <AlertCircle
                aria-hidden="true"
                className="
                    mt-0.5 h-5 w-5 shrink-0
                    text-red-500
                "
            />

            {/* Toast 내용 */}
            <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-zinc-800">{title}</p>

                <p className="mt-1 text-xs leading-5 text-zinc-500">
                    {message}
                </p>

                {/*
                 * 재시도 버튼
                 * 500 / Network → 재시도 O
                 * 400 / 404     → 재시도 X
                 */}
                {onRetry && (
                    <button
                        type="button"
                        onClick={onRetry}
                        disabled={isRetrying}
                        className="
                            mt-3 inline-flex h-8 items-center gap-1.5
                            rounded-lg border border-zinc-300
                            bg-white px-2.5
                            text-xs font-medium text-zinc-700
                            transition
                            hover:bg-zinc-50
                            disabled:cursor-not-allowed
                            disabled:opacity-50
                        ">
                        <RefreshCw
                            aria-hidden="true"
                            className={`h-3.5 w-3.5 ${
                                isRetrying ? "animate-spin" : ""
                            }`}
                        />

                        {isRetrying ? "재시도 중..." : "재시도"}
                    </button>
                )}
            </div>

            {/* Toast 닫기 버튼 */}
            <button
                type="button"
                onClick={onClose}
                disabled={isRetrying}
                aria-label="오류 알림 닫기"
                className="
                    shrink-0 rounded-md p-1
                    text-zinc-400 transition
                    hover:bg-zinc-100
                    hover:text-zinc-600
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                ">
                <X className="h-4 w-4" />
            </button>
        </div>
    );
};

export default CardErrorToast;
