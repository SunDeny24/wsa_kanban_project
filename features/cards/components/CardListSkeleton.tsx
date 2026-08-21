const SkeletonBar = ({ className = "" }: { className?: string }) => (
    <div className={`animate-pulse rounded bg-zinc-200 ${className}`} />
);

const MobileCardSkeleton = () => (
    <div className="rounded-xl border border-zinc-200 bg-white p-4">
        <SkeletonBar className="h-4 w-2/3" />
        <SkeletonBar className="mt-3 h-3 w-full" />
        <SkeletonBar className="mt-2 h-3 w-1/2" />
        <div className="mt-4 flex gap-2">
            <SkeletonBar className="h-5 w-14 rounded-full" />
            <SkeletonBar className="h-5 w-16 rounded-full" />
        </div>
    </div>
);

const ColumnSkeleton = () => (
    <div className="min-h-[620px] rounded-2xl border border-zinc-200 bg-white">
        <div className="flex h-12 items-center gap-2 border-b border-zinc-100 px-4">
            <SkeletonBar className="h-2 w-2 rounded-full" />
            <SkeletonBar className="h-3 w-16" />
            <SkeletonBar className="h-5 w-6 rounded-full" />
        </div>
        <div className="space-y-3 p-5">
            {Array.from({ length: 3 }).map((_, index) => (
                <div
                    key={index}
                    className="rounded-xl border border-zinc-100 p-4">
                    <SkeletonBar className="h-4 w-3/4" />
                    <SkeletonBar className="mt-3 h-3 w-full" />
                    <SkeletonBar className="mt-2 h-3 w-1/2" />
                    <div className="mt-4 flex gap-2">
                        <SkeletonBar className="h-5 w-12 rounded-full" />
                        <SkeletonBar className="h-5 w-14 rounded-full" />
                    </div>
                </div>
            ))}
        </div>
    </div>
);

export const CardListSkeleton = () => (
    <div role="status" aria-label="카드 목록을 불러오는 중">
        {/* 모바일: 상태 탭과 세로 카드 목록 형태 */}
        <div className="md:hidden">
            <div className="mb-4 flex gap-5 overflow-hidden border-b border-zinc-200 pb-3">
                {Array.from({ length: 4 }).map((_, index) => (
                    <SkeletonBar key={index} className="h-4 w-14 shrink-0" />
                ))}
            </div>
            <div className="mb-3 flex items-center justify-between">
                <SkeletonBar className="h-4 w-16" />
                <SkeletonBar className="h-3 w-8" />
            </div>
            <div className="space-y-2">
                {Array.from({ length: 4 }).map((_, index) => (
                    <MobileCardSkeleton key={index} />
                ))}
            </div>
        </div>

        {/* 태블릿/PC: 4열 칸반 컬럼 형태 */}
        <div className="hidden grid-cols-4 gap-2 md:grid lg:gap-3">
            {Array.from({ length: 4 }).map((_, index) => (
                <ColumnSkeleton key={index} />
            ))}
        </div>

        <span className="sr-only">카드를 불러오는 중...</span>
    </div>
);

export default CardListSkeleton;
