export const ProjectListSkeleton = () => (
    <div
        role="status"
        aria-label="프로젝트 목록을 불러오는 중"
        className="min-h-[560px] overflow-hidden rounded-lg border bg-white">
        <div className="grid h-10 grid-cols-[20%_15%_25%_12%_15%_13%] items-center border-b bg-gray-50 px-4">
            {Array.from({ length: 6 }).map((_, index) => (
                <div
                    key={index}
                    className="mx-3 h-3 animate-pulse rounded bg-gray-200"
                />
            ))}
        </div>
        <div className="space-y-0">
            {Array.from({ length: 10 }).map((_, rowIndex) => (
                <div
                    key={rowIndex}
                    className="grid h-12 grid-cols-[20%_15%_25%_12%_15%_13%] items-center border-b px-4 last:border-b-0">
                    {Array.from({ length: 6 }).map((_, columnIndex) => (
                        <div
                            key={columnIndex}
                            className="mx-3 h-3 animate-pulse rounded bg-gray-100"
                        />
                    ))}
                </div>
            ))}
        </div>
        <span className="sr-only">프로젝트를 불러오는 중...</span>
    </div>
);

export default ProjectListSkeleton;
