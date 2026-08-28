import { AlertCircle, RefreshCw } from "lucide-react";

interface CardListErrorStateProps {
    message: string;
    onRetry: () => void;
    isRetrying: boolean;
}
// 카드 목록 조회 실패 상태 - EmptyState와 유사하게 카드 목록 조회 실패 시 보여주는 컴포넌트
export const CardListErrorState = ({
    message,
    onRetry,
    isRetrying,
}: CardListErrorStateProps) => (
    <div
        role="alert"
        className="flex min-h-[320px] flex-col items-center justify-center rounded-xl border border-zinc-200 bg-white px-6 text-center md:min-h-[620px]">
        <AlertCircle aria-hidden="true" className="h-7 w-7 text-red-500" />
        <p className="mt-3 text-sm font-medium text-zinc-800">
            카드를 불러오지 못했습니다.
        </p>
        <p className="mt-1 max-w-md text-xs text-zinc-500">{message}</p>
        <button
            type="button"
            onClick={onRetry}
            disabled={isRetrying}
            className="mt-4 inline-flex h-9 items-center gap-2 rounded-lg border border-zinc-300 bg-white px-3 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50">
            <RefreshCw
                aria-hidden="true"
                className={`h-4 w-4 ${isRetrying ? "animate-spin" : ""}`}
            />
            {isRetrying ? "다시 불러오는 중..." : "다시 시도"}
        </button>
    </div>
);

export default CardListErrorState;
