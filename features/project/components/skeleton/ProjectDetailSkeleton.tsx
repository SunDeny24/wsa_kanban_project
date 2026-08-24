// 프로젝트 상세 화면 Skeleton

/*
 * 프로젝트 상세 상단 헤더 Skeleton
 * - 프로젝트명
 * - 상태
 * - 고객사
 */
export const ProjectHeaderSkeleton = () => {
    return (
        <div
            className="flex animate-pulse flex-wrap items-center gap-x-4 gap-y-2"
            aria-busy="true">
            <span className="sr-only">프로젝트 정보를 불러오는 중입니다.</span>

            {/* 프로젝트명 */}
            <div className="h-8 w-48 rounded-md bg-zinc-200" />

            {/* 상태 */}
            <div className="h-7 w-16 rounded-full bg-zinc-200" />

            {/* 고객사 */}
            <div className="h-5 w-32 rounded-md bg-zinc-200" />
        </div>
    );
};

/*
 * 프로젝트 기본 정보 Skeleton
 */
export const ProjectOverviewSkeleton = () => {
    return (
        <div className="rounded-2xl bg-white p-5 sm:p-6" aria-busy="true">
            <span className="sr-only">
                프로젝트 기본 정보를 불러오는 중입니다.
            </span>

            <dl className="animate-pulse space-y-6">
                {/* 프로젝트명 */}
                <div className="grid gap-1.5 sm:grid-cols-[120px_1fr] sm:gap-6">
                    <dt className="text-sm font-medium text-zinc-500">
                        프로젝트명
                    </dt>

                    <dd>
                        <div className="h-5 w-44 rounded-md bg-zinc-200" />
                    </dd>
                </div>

                {/* 고객사 */}
                <div className="grid gap-1.5 sm:grid-cols-[120px_1fr] sm:gap-6">
                    <dt className="text-sm font-medium text-zinc-500">
                        고객사
                    </dt>

                    <dd>
                        <div className="h-5 w-32 rounded-md bg-zinc-200" />
                    </dd>
                </div>

                {/* 설명 */}
                <div className="grid gap-1.5 sm:grid-cols-[120px_1fr] sm:gap-6">
                    <dt className="text-sm font-medium text-zinc-500">설명</dt>

                    <dd className="space-y-2">
                        <div className="h-4 w-full max-w-md rounded-md bg-zinc-200" />
                        <div className="h-4 w-2/3 max-w-sm rounded-md bg-zinc-200" />
                    </dd>
                </div>

                {/* 시작일 */}
                <div className="grid gap-1.5 sm:grid-cols-[120px_1fr] sm:gap-6">
                    <dt className="text-sm font-medium text-zinc-500">
                        시작일
                    </dt>

                    <dd>
                        <div className="h-5 w-24 rounded-md bg-zinc-200" />
                    </dd>
                </div>

                {/* 종료일 */}
                <div className="grid gap-1.5 sm:grid-cols-[120px_1fr] sm:gap-6">
                    <dt className="text-sm font-medium text-zinc-500">
                        종료일
                    </dt>

                    <dd>
                        <div className="h-5 w-24 rounded-md bg-zinc-200" />
                    </dd>
                </div>
            </dl>
        </div>
    );
};
