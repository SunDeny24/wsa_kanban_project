import Link from "next/link";
import { AlertCircle, ArrowLeft, FolderX, RefreshCw } from "lucide-react";

interface ProjectNotFoundStateProps {
    backHref?: string;
}
/**
 * 프로젝트 404 상태 오류를 나타내는 컴포넌트
 * */
export const ProjectNotFoundState = ({
    backHref = "/projects",
}: ProjectNotFoundStateProps) => {
    return (
        <div className="flex min-h-64 flex-col items-center justify-center rounded-2xl bg-white px-6 py-12 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100">
                <FolderX className="h-6 w-6 text-zinc-500" aria-hidden="true" />
            </div>

            <h2 className="mt-4 text-base font-semibold text-zinc-900">
                프로젝트를 찾을 수 없습니다.
            </h2>

            <p className="mt-1 max-w-sm text-sm leading-6 text-zinc-500">
                삭제되었거나 존재하지 않는 프로젝트입니다.
            </p>

            <Link
                href={backHref}
                className="
                    mt-5 inline-flex h-9 items-center gap-2
                    rounded-lg border border-zinc-200
                    bg-white px-3
                    text-sm font-medium text-zinc-700
                    transition
                    hover:bg-zinc-50
                ">
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                프로젝트 목록으로
            </Link>
        </div>
    );
};

interface ProjectLoadErrorStateProps {
    onRetry: () => void;
    isRetrying?: boolean;
}

/**
 * 프로젝트 404 오류가 아닌 500, 네트워크 오류 등 일시적인 프로젝트 조회 실패 상태를 나타내는 컴포넌트
 * */
export const ProjectLoadErrorState = ({
    onRetry,
    isRetrying = false,
}: ProjectLoadErrorStateProps) => {
    return (
        <div className="flex min-h-64 flex-col items-center justify-center rounded-2xl bg-white px-6 py-12 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
                <AlertCircle
                    className="h-6 w-6 text-red-500"
                    aria-hidden="true"
                />
            </div>

            <h2 className="mt-4 text-base font-semibold text-zinc-900">
                프로젝트 정보를 불러오지 못했습니다.
            </h2>

            <p className="mt-1 text-sm text-zinc-500">
                잠시 후 다시 시도해주세요.
            </p>

            <button
                type="button"
                onClick={onRetry}
                disabled={isRetrying}
                className="mt-5 inline-flex h-9 items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50">
                <RefreshCw
                    className={`h-4 w-4 ${isRetrying ? "animate-spin" : ""}`}
                    aria-hidden="true"
                />
                {isRetrying ? "다시 불러오는 중..." : "다시 시도"}
            </button>
        </div>
    );
};
