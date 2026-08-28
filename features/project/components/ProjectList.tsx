"use client";

import React, { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ProjectTable } from "./ProjectListTable";
import { ProjectCreate } from "./ProjectCreate";
import { Project, ProjectStatus } from "../types";
import { ProjectListSkeleton } from "@/features/project/components/skeleton/ProjectListSkeleton";
import { useEntityListQuery, QueryParams } from "@/lib/hooks/useEntity";
import { getErrorResponse } from "@/lib/api/error";

// 프로젝트 검색/필터 폼 타입 정의
interface ProjectSearchParams extends QueryParams {
    customer?: string;
    name?: string;
    status?: ProjectStatus;
    sort: string;
    page: number;
}

interface ProjectListResponse {
    content: Project[];
    totalElements: number;
    totalPages?: number;
    page?: number;
    size?: number;
}

// URL의 status가 올바른 값인지 검사
const parseProjectStatus = (
    value: string | null
): ProjectStatus | undefined => {
    if (value === "QUOTATION" || value === "ACTIVE" || value === "ARCHIVED") {
        return value;
    }

    return undefined;
};

// URL의 page를 1 이상의 숫자로 변환
const parsePage = (value: string | null) => {
    const parsedPage = Number.parseInt(value ?? "1", 10);

    if (!Number.isFinite(parsedPage) || parsedPage < 1) {
        return 1;
    }

    return parsedPage;
};

export const ProjectList = () => {
    // URL 값 확인
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false); // 프로젝트 생성 모달 상태관리

    // 검색 조건과 정렬 상태 URL에서 가져오기
    const name = searchParams.get("name") ?? "";
    const customer = searchParams.get("customer") ?? "";
    const status = parseProjectStatus(searchParams.get("status"));
    const sort = searchParams.get("sort") ?? "createdAt,desc";

    const urlPage = parsePage(searchParams.get("page")); //URL page는 사용자가 보는 1부터 시작하는 값
    const apiPage = urlPage - 1; // API는 page가 0부터 시작

    // 검색 조건 초기화 - 고객사 검색이 있으면 customer, 프로젝트명 검색이 있으면 name, 둘 다 없으면 name으로 초기화
    const [searchType, setSearchType] = useState<"customer" | "name">(
        name ? "name" : customer ? "customer" : "name"
    );
    const [keyword, setKeyword] = useState(name || customer); // 입력되는 건 로컬 저장

    /**
     * URL 파라미터를 업데이트하는 함수
     * @param updates - 업데이트할 URL 파라미터 객체
     * */
    const updateSearchParams = useCallback(
        (
            updates: Partial<{
                name: string;
                customer: string;
                status: ProjectStatus;
                sort: string;
                page: number;
            }>
        ) => {
            // 현재 URL parameter를 복사
            const params = new URLSearchParams(searchParams.toString());

            Object.entries(updates).forEach(([key, value]) => {
                // 값이 없으면 복사한 URL에서 해당 파라미터 제거
                if (value === undefined || value === null || value === "") {
                    params.delete(key);
                    return;
                }

                params.set(key, String(value));
            });

            // 파라미터 문자열로 생성해서 URL 업데이트
            const queryString = params.toString();
            const nextUrl = queryString
                ? `${pathname}?${queryString}`
                : pathname;

            // URL 업데이트
            router.push(nextUrl, {
                //  scroll: false,
            });
        },
        [pathname, router, searchParams]
    );

    // URL이 뒤로가기/앞으로가기로 변경되면 검색창도 복원
    useEffect(() => {
        if (name) {
            setSearchType("name");
            setKeyword(name);
            return;
        }

        if (customer) {
            setSearchType("customer");
            setKeyword(customer);
            return;
        }

        setSearchType("name");
        setKeyword("");
    }, [name, customer]);

    // URL 값을 React Query 요청 조건으로 직접 사용
    const queryParams: ProjectSearchParams = {
        name: name || undefined,
        customer: customer || undefined,
        status,
        sort,
        page: apiPage,
    };

    // 프로젝트 리스트 조회 API 호출
    const {
        data,
        isLoading,
        isFetching,
        error: queryError,
        refetch,
    } = useEntityListQuery<ProjectListResponse>("/projects", queryParams);

    const error = queryError ? getErrorResponse(queryError) : null; //공통 에러처리

    // 검색 폼 제출 시 호출되는 함수
    const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const nextKeyword = keyword.trim();

        // 검색 조건이 프로젝트명, 고객사밖에 없으므로 이렇게 작성 - 선택한 대상에 맞게 업데이트함
        // 선택한 검색 대상만 API 필터에 남기고 반대쪽 조건은 제거합니다.
        if (searchType === "name") {
            updateSearchParams({
                name: nextKeyword,
                customer: "",
                page: 1,
            });
            return;
        }
        updateSearchParams({
            name: "",
            customer: nextKeyword,
            page: 1,
        });
    };

    // 검색 조건 초기화 시 호출되는 함수
    const handleReset = () => {
        setKeyword("");
        setSearchType("customer");

        // 상태와 정렬은 유지하면서 두 검색 조건만 제거합니다.
        updateSearchParams({
            name: "",
            customer: "",
            page: 1,
        });
    };
    // 상태 필터 변경 함수 - URL에 반영
    const handleStatusChange = (nextStatus?: ProjectStatus) => {
        updateSearchParams({
            status: nextStatus,
            page: 1,
        });
    };
    // 정렬 변경 함수
    const handleSortChange = (nextSort: string) => {
        updateSearchParams({
            sort: nextSort,
            page: 1,
        });
    };

    // 페이지 변경 함수
    // UI에서는 기존 코드처럼 0부터 시작하는 page 번호를 받음
    const handlePageChange = (nextZeroBasedPage: number) => {
        updateSearchParams({
            page: nextZeroBasedPage + 1,
        });
    };

    const currentPage = apiPage; // api page는 useQueryForm hook에서 state로 관리
    const totalPages = data?.totalPages ?? 1; // 전체 데이터는 api데이터

    return (
        <div className="flex min-h-full flex-col space-y-5 p-5 lg:p-6">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h1 className="text-xl font-bold text-gray-900 lg:text-2xl">
                        프로젝트 관리
                    </h1>
                    <span className="mt-1 text-sm text-gray-500">
                        프로젝트를 검색하고 관리할 수 있습니다.
                    </span>
                </div>

                <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(true)}
                    className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800">
                    + 프로젝트 생성
                </button>
            </div>

            {/* Status Tabs */}
            <div className="overflow-x-auto border-b">
                <div className="flex min-w-max gap-5">
                    <button
                        type="button"
                        onClick={() => handleStatusChange(undefined)}
                        className={`px-1 pb-3 text-sm ${
                            !status
                                ? "border-b-2 border-black font-semibold text-gray-900"
                                : "text-gray-500 hover:text-gray-900"
                        }`}>
                        전체보기
                    </button>

                    <button
                        type="button"
                        onClick={() => handleStatusChange("QUOTATION")}
                        className={`px-1 pb-3 text-sm ${
                            status === "QUOTATION"
                                ? "border-b-2 border-black font-semibold text-gray-900"
                                : "text-gray-500 hover:text-gray-900"
                        }`}>
                        견적중
                    </button>

                    <button
                        type="button"
                        onClick={() => handleStatusChange("ACTIVE")}
                        className={`px-1 pb-3 text-sm ${
                            status === "ACTIVE"
                                ? "border-b-2 border-black font-semibold text-gray-900"
                                : "text-gray-500 hover:text-gray-900"
                        }`}>
                        진행중
                    </button>

                    <button
                        type="button"
                        onClick={() => handleStatusChange("ARCHIVED")}
                        className={`px-1 pb-3 text-sm ${
                            status === "ARCHIVED"
                                ? "border-b-2 border-black font-semibold text-gray-900"
                                : "text-gray-500 hover:text-gray-900"
                        }`}>
                        보관
                    </button>
                </div>
            </div>

            {/* Search */}
            <form
                onSubmit={handleSearch}
                className="rounded-lg border bg-white p-4">
                <div className="flex min-w-0 flex-col gap-3 md:flex-row md:items-center">
                    {/* 검색 select, 검색창 input */}
                    <div className="flex min-w-0 flex-1 gap-2">
                        <label
                            htmlFor="project-search-type"
                            className="sr-only">
                            검색 대상
                        </label>
                        <select
                            id="project-search-type"
                            value={searchType}
                            onChange={(e) =>
                                setSearchType(
                                    e.target.value as "name" | "customer"
                                )
                            }
                            className="h-9 shrink-0 rounded-md border border-gray-300 bg-white px-3 text-sm outline-none focus:border-black focus:ring-1 focus:ring-black">
                            <option value="name">프로젝트명</option>
                            <option value="customer">고객사</option>
                        </select>

                        <label htmlFor="project-keyword" className="sr-only">
                            검색어
                        </label>
                        <input
                            id="project-keyword"
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            placeholder={
                                searchType === "name"
                                    ? "프로젝트명을 입력하세요"
                                    : "고객사명을 입력하세요"
                            }
                            className="h-9 min-w-0 flex-1 rounded-md border border-gray-300 px-3 text-sm outline-none transition focus:border-black focus:ring-1 focus:ring-black"
                        />
                    </div>

                    {/* 검색, 초기화 버튼 */}
                    <div className="flex w-full justify-end items-end gap-2 md:w-auto md:justify-start">
                        <button
                            type="submit"
                            className="h-9 rounded-md bg-black px-5 text-sm font-medium text-white transition hover:bg-gray-800">
                            검색
                        </button>

                        <button
                            type="button"
                            onClick={handleReset}
                            className="h-9 rounded-md border border-gray-300 px-5 text-sm font-medium text-gray-700 transition hover:bg-gray-50">
                            초기화
                        </button>
                    </div>
                </div>
            </form>

            <div className="flex items-center justify-between">
                {/* Total */}
                <p className="text-sm text-gray-500">
                    {isLoading
                        ? "프로젝트를 불러오는 중..."
                        : `총 ${data?.totalElements ?? 0}개`}
                </p>
                <div className="flex items-center gap-2">
                    <label htmlFor="project-sort" className="sr-only">
                        정렬
                    </label>
                    <select
                        id="project-sort"
                        value={sort}
                        onChange={(event) =>
                            handleSortChange(event.target.value)
                        }
                        className="h-9 shrink-0 rounded-md border border-gray-300 bg-white px-2 text-xs outline-none focus:border-black">
                        <option value="createdAt,desc">최신순</option>
                        <option value="createdAt,asc">오래된순</option>
                        <option value="name,asc">프로젝트명 ↑</option>
                        <option value="name,desc">프로젝트명 ↓</option>
                        <option value="customer,asc">고객사 ↑</option>
                        <option value="customer,desc">고객사 ↓</option>
                    </select>
                </div>
            </div>

            {/* Project Table */}
            <div className="flex-1">
                {isLoading ? (
                    <ProjectListSkeleton />
                ) : error ? (
                    <ProjectTable
                        projects={[]}
                        errorMessage={error.message}
                        onRetry={() => void refetch()}
                        isRetrying={isFetching}
                    />
                ) : (
                    <ProjectTable projects={data?.content ?? []} />
                )}
            </div>

            {/* Pagination */}
            {!isLoading && !error && (
                <div className="flex items-center justify-center border-t pt-4">
                    <div className="flex items-center gap-1">
                        {/* 이전 */}
                        <button
                            type="button"
                            disabled={currentPage === 0}
                            onClick={() => handlePageChange(currentPage - 1)}
                            className="flex h-8 min-w-8 items-center justify-center rounded-md border px-2 text-sm text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40">
                            이전
                        </button>

                        {/* 페이지 번호 */}
                        {Array.from(
                            { length: totalPages },
                            (_, index) => index
                        ).map((pageNumber) => (
                            <button
                                key={pageNumber}
                                type="button"
                                onClick={() => handlePageChange(pageNumber)}
                                className={`h-8 min-w-8 rounded-md px-2 text-sm ${
                                    pageNumber === currentPage
                                        ? "bg-black font-medium text-white"
                                        : "border text-gray-600 hover:bg-gray-50"
                                }`}>
                                {/* API page는 0부터 시작하므로 화면에는 +1 */}
                                {pageNumber + 1}
                            </button>
                        ))}

                        {/* 다음 */}
                        <button
                            type="button"
                            disabled={currentPage >= totalPages - 1}
                            onClick={() => handlePageChange(currentPage + 1)}
                            className="flex h-8 min-w-8 items-center justify-center rounded-md border px-2 text-sm text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40">
                            다음
                        </button>
                    </div>
                </div>
            )}

            {/* 목록의 검색 조건을 유지한 채 생성 폼을 모달로 표시합니다. */}
            <ProjectCreate
                open={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
            />
        </div>
    );
};

export default ProjectList;
