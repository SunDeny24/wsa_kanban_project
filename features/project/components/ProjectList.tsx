'use client';
import React, { useState } from "react";
import { ProjectTable } from "./ProjectListTable";
import { ProjectCreate } from "./ProjectCreate";
import { ProjectStatus } from "../types";
import { useListEntityForm } from "@/lib/hooks/useQueryForm";

// TODO: 상태필터시 전체보기, 견적중, 진행중, 보관 각 갯수 추후에 API에서 받아와서 표시하도록 수정 필요

// 프로젝트 검색/필터 폼 타입 정의
interface ProjectSearchForm {
  customer?: string;
  name?: string;
  status?: ProjectStatus;
  sort?: string;
}

interface ProjectListResponse {
  content: any[];
  totalElements: number;
  totalPages?: number;
  page?: number;
  size?: number;
}


export const ProjectList = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const {
    register,
    onSearch,
    onReset,
    setFilter,
    appliedFilters,
    page,
    onPageChange,
    data,
    isLoading,
    error,
  } = useListEntityForm<ProjectListResponse, ProjectSearchForm>(
    "/projects",
    {
      formOptions: {
        defaultValues: {
          customer: "",
          name: "",
          status: undefined,
          sort: "createdAt,desc",
        },
      },
    },
  );

  // 현재 필터 상태와 정렬 상태를 가져옵니다.
  const currentStatus = appliedFilters.status;
  const currentSort = appliedFilters.sort ?? "createdAt,desc";

  const currentPage = page; // api page는 useQueryForm hook에서 state로 관리
  const totalPages = data?.totalPages ?? 1; // 전체 데이터는 api데이터

  if (isLoading) {
    return <div>프로젝트를 불러오는 중...</div>;
  }

  if (error) {
    return (
        <div className="flex min-h-full items-center justify-center p-5">
          <div className="rounded-lg border border-red-200 bg-red-50 px-6 py-5 text-center">
            <p className="text-sm font-medium text-red-700">
              프로젝트를 불러오지 못했습니다.
            </p>

            <p className="mt-1 text-sm text-red-600">
              {error.message}
            </p>
          </div>
        </div>
    );
  }

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
              className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800"
          >
            + 프로젝트 생성
          </button>
        </div>

        {/* Status Tabs */}
        <div className="overflow-x-auto border-b">
          <div className="flex min-w-max gap-5">
            <button
                type="button"
                onClick={() => setFilter("status", undefined)}
                className={`px-1 pb-3 text-sm ${
                    !currentStatus
                        ? "border-b-2 border-black font-semibold text-gray-900"
                        : "text-gray-500 hover:text-gray-900"
                }`}
            >
              전체보기
            </button>

            <button
                type="button"
                onClick={() => setFilter("status", "QUOTATION")}
                className={`px-1 pb-3 text-sm ${
                    currentStatus === "QUOTATION"
                        ? "border-b-2 border-black font-semibold text-gray-900"
                        : "text-gray-500 hover:text-gray-900"
                }`}
            >
              견적중
            </button>

            <button
                type="button"
                onClick={() => setFilter("status", "ACTIVE")}
                className={`px-1 pb-3 text-sm ${
                    currentStatus === "ACTIVE"
                        ? "border-b-2 border-black font-semibold text-gray-900"
                        : "text-gray-500 hover:text-gray-900"
                }`}
            >
              진행중
            </button>

            <button
                type="button"
                onClick={() => setFilter("status", "ARCHIVED")}
                className={`px-1 pb-3 text-sm ${
                    currentStatus === "ARCHIVED"
                        ? "border-b-2 border-black font-semibold text-gray-900"
                        : "text-gray-500 hover:text-gray-900"
                }`}
            >
              보관
            </button>
          </div>
        </div>

        {/* Search */}
        <form
            onSubmit={onSearch}
            className="rounded-lg border bg-white p-4"
        >
          <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_1fr_auto_auto] md:items-end">
            {/* 고객사 */}
            <div>
              <label
                  htmlFor="customer"
                  className="mb-1.5 block text-xs font-medium text-gray-600"
              >
                고객사
              </label>

              <input
                  id="customer"
                  {...register("customer")}
                  placeholder="고객사명 검색"
                  className="h-9 w-full rounded-md border border-gray-300 px-3 text-sm outline-none transition focus:border-black focus:ring-1 focus:ring-black"
              />
            </div>

            {/* 프로젝트명 */}
            <div>
              <label
                  htmlFor="name"
                  className="mb-1.5 block text-xs font-medium text-gray-600"
              >
                프로젝트명
              </label>

              <input
                  id="name"
                  {...register("name")}
                  placeholder="프로젝트명 검색"
                  className="h-9 w-full rounded-md border border-gray-300 px-3 text-sm outline-none transition focus:border-black focus:ring-1 focus:ring-black"
              />
            </div>

            {/* 검색 */}
            <button
                type="submit"
                className="h-9 rounded-md bg-black px-5 text-sm font-medium text-white transition hover:bg-gray-800"
            >
              검색
            </button>

            {/* 초기화 */}
            <button
                type="button"
                onClick={onReset}
                className="h-9 rounded-md border border-gray-300 px-5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              초기화
            </button>
          </div>
        </form>

        {/* Sort */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            총 {data?.totalElements ?? 0}개
          </p>

          <div className="flex items-center gap-2">
            <label
                htmlFor="project-sort"
                className="text-xs font-medium text-gray-600"
            >
              정렬
            </label>

            <select
                id="project-sort"
                value={currentSort}
                onChange={(e) =>
                    setFilter("sort", e.target.value)
                }
                className="h-8 rounded-md border border-gray-300 bg-white px-2 text-xs outline-none focus:border-black"
            >
              <option value="createdAt,desc">최신순</option>
              <option value="createdAt,asc">오래된순</option>
              <option value="name,asc">프로젝트명 오름차순</option>
              <option value="name,desc">프로젝트명 내림차순</option>
              <option value="customer,asc">고객사 오름차순</option>
              <option value="customer,desc">고객사 내림차순</option>
            </select>
          </div>
        </div>

        {/* Project Table */}
        <div className="flex-1">
          <ProjectTable projects={data?.content ?? []} />
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-center border-t pt-4">
          <div className="flex items-center gap-1">
            {/* 이전 */}
            <button
                type="button"
                disabled={currentPage === 0}
                onClick={()=>onPageChange(currentPage - 1)}
                className="flex h-8 min-w-8 items-center justify-center rounded-md border px-2 text-sm text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              이전
            </button>

            {/* 페이지 번호 */}
            {Array.from(
                { length: totalPages },
                (_, index) => index,
            ).map((pageNumber) => (
                <button
                    key={pageNumber}
                    type="button"
                    onClick={()=>onPageChange(pageNumber)}
                    className={`h-8 min-w-8 rounded-md px-2 text-sm ${
                        pageNumber === currentPage
                            ? "bg-black font-medium text-white"
                            : "border text-gray-600 hover:bg-gray-50"
                    }`}
                >
                  {/* API page는 0부터 시작하므로 화면에는 +1 */}
                  {pageNumber + 1}
                </button>
            ))}

            {/* 다음 */}
            <button
                type="button"
                disabled={currentPage >= totalPages - 1}
                onClick={()=>onPageChange(currentPage + 1)}
                className="flex h-8 min-w-8 items-center justify-center rounded-md border px-2 text-sm text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              다음
            </button>
          </div>
        </div>

        {/* 목록의 검색 조건을 유지한 채 생성 폼을 모달로 표시합니다. */}
        <ProjectCreate
          open={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
        />
      </div>
  );
};

export default ProjectList;
