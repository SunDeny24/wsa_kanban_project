import { LoaderCircle } from "lucide-react";

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

// useSearchParams가 준비되기 전 Suspense에서 사용하는 프로젝트 목록 전체 화면입니다.
// 실제 ProjectList와 같은 영역을 유지해 hydration 전후 레이아웃 이동을 줄입니다.
export const ProjectListPageSkeleton = () => (
    <div
        aria-busy="true"
        className="flex min-h-full flex-col space-y-5 p-5 lg:p-6">
        {/* Header: API 응답과 무관한 고정 UI */}
        <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
                <h1 className="text-xl font-bold text-gray-900 lg:text-2xl">
                    프로젝트 관리
                </h1>
                <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                    <span className="text-sm text-gray-500">
                        프로젝트를 검색하고 관리할 수 있습니다.
                    </span>
                    <span
                        role="status"
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-600">
                        <LoaderCircle
                            className="h-3.5 w-3.5 animate-spin"
                            aria-hidden="true"
                        />
                        프로젝트 화면을 준비하는 중...
                    </span>
                </div>
            </div>

            <button
                type="button"
                disabled
                className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white opacity-70">
                + 프로젝트 생성
            </button>
        </div>

        {/* Status Tabs: 상수이므로 실제 라벨 유지 */}
        <div className="overflow-x-auto border-b">
            <div className="flex min-w-max gap-5">
                {[
                    { label: "전체보기", active: true },
                    { label: "견적중", active: false },
                    { label: "진행중", active: false },
                    { label: "보관", active: false },
                ].map((tab) => (
                    <span
                        key={tab.label}
                        className={`px-1 pb-3 text-sm ${
                            tab.active
                                ? "border-b-2 border-black font-semibold text-gray-900"
                                : "text-gray-500"
                        }`}>
                        {tab.label}
                    </span>
                ))}
            </div>
        </div>

        {/* Search: 실제 레이아웃을 유지하되 hydration 전에는 비활성화 */}
        <div className="rounded-lg border bg-white p-4">
            <div className="flex min-w-0 flex-col gap-3 md:flex-row md:items-center">
                <div className="flex min-w-0 flex-1 gap-2">
                    <select
                        disabled
                        aria-label="검색 대상"
                        className="h-9 shrink-0 rounded-md border border-gray-300 bg-white px-3 text-sm opacity-70">
                        <option>프로젝트명</option>
                    </select>
                    <input
                        disabled
                        aria-label="검색어"
                        placeholder="프로젝트명을 입력하세요"
                        className="h-9 min-w-0 flex-1 rounded-md border border-gray-300 px-3 text-sm opacity-70"
                    />
                </div>

                <div className="flex w-full items-end justify-end gap-2 md:w-auto md:justify-start">
                    <button
                        type="button"
                        disabled
                        className="h-9 rounded-md bg-black px-5 text-sm font-medium text-white opacity-70">
                        검색
                    </button>
                    <button
                        type="button"
                        disabled
                        className="h-9 rounded-md border border-gray-300 px-5 text-sm font-medium text-gray-700 opacity-70">
                        초기화
                    </button>
                </div>
            </div>
        </div>

        <div className="flex items-center justify-between">
            <div className="h-4 w-32 animate-pulse rounded bg-gray-200" />
            <select
                disabled
                aria-label="정렬"
                className="h-9 shrink-0 rounded-md border border-gray-300 bg-white px-2 text-xs opacity-70">
                <option>최신순</option>
            </select>
        </div>

        <div className="flex-1">
            <ProjectListSkeleton />
        </div>
    </div>
);

export default ProjectListSkeleton;
