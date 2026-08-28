export const CardDetailSkeleton = () => {
    return (
        <div
            aria-label="카드 상세 정보를 불러오는 중"
            className="animate-pulse">
            {/* 제목 */}
            <div className="px-6 py-4">
                <div className="h-6 w-52 rounded-md bg-zinc-200" />
            </div>

            <div className="space-y-7 px-6 py-6">
                {/* 기본 정보 */}
                <section>
                    <div className="mb-4 h-4 w-16 rounded bg-zinc-200" />

                    <div className="grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2">
                        {Array.from({ length: 5 }).map((_, index) => (
                            <div key={index}>
                                <div className="mb-2 h-3 w-14 rounded bg-zinc-200" />
                                <div className="h-5 w-28 rounded bg-zinc-100" />
                            </div>
                        ))}
                    </div>
                </section>

                {/* 상세 설명 */}
                <section>
                    <div className="mb-3 h-4 w-20 rounded bg-zinc-200" />

                    <div className="space-y-2 rounded-xl bg-zinc-50 p-4">
                        <div className="h-3 w-full rounded bg-zinc-200" />
                        <div className="h-3 w-5/6 rounded bg-zinc-200" />
                        <div className="h-3 w-3/5 rounded bg-zinc-200" />
                    </div>
                </section>

                {/* 처리 정보 */}
                <section>
                    <div className="mb-4 h-4 w-20 rounded bg-zinc-200" />

                    <div className="h-10 w-full rounded-lg bg-zinc-100" />
                    <div className="mt-4 h-24 w-full rounded-xl bg-zinc-100" />
                </section>
            </div>
        </div>
    );
};

export default CardDetailSkeleton;
