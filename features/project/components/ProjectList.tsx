'use client';
import React from "react";
import { ProjectTable } from "./ProjectListTable";
import { ProjectStatus } from "../types";
import { useListEntityForm } from "@/lib/hooks/useQueryForm";

// TODO: 상태필터시 전체보기, 견적중, 진행중, 보관 각 갯수 추후에 API에서 받아와서 표시하도록 수정 필요


// 프로젝트 검색/필터 폼 타입 정의
interface ProjectSearchForm {
  customer: string;
  name: string;
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
  const {
    register,
    onSearch,
    onReset,
    setFilter,
    appliedFilters,
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

  if (isLoading) {
    return <div>프로젝트를 불러오는 중...</div>;
  }

  if (error) {
    return <div>프로젝트를 불러오지 못했습니다.</div>;
  }
  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">프로젝트 관리</h1>

        <button
          type="button"
          className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white"
        >
          + 프로젝트 생성
        </button>
      </div>

      {/* Status Tabs */}
      <div className="flex gap-6 border-b">
        <button
          type="button"
          onClick={() => setFilter("status", undefined)}
          className={
            !currentStatus
              ? "border-b-2 border-black pb-3 font-semibold"
              : "pb-3"
          }
        >
          전체보기 ({data?.totalElements ?? 0})
        </button>

        <button
          type="button"
          onClick={() => setFilter("status", "QUOTATION")}
          className={
            currentStatus === "QUOTATION"
              ? "border-b-2 border-black pb-3 font-semibold"
              : "pb-3"
          }
        >
          견적중
        </button>

        <button
          type="button"
          onClick={() => setFilter("status", "ACTIVE")}
          className={
            currentStatus === "ACTIVE"
              ? "border-b-2 border-black pb-3 font-semibold"
              : "pb-3"
          }
        >
          진행중
        </button>

        <button
          type="button"
          onClick={() => setFilter("status", "ARCHIVED")}
          className={
            currentStatus === "ARCHIVED"
              ? "border-b-2 border-black pb-3 font-semibold"
              : "pb-3"
          }
        >
          보관
        </button>
      </div>

      {/* Search */}
      <form
        onSubmit={onSearch}
        className="space-y-4 rounded-lg border p-5"
      >
        <div>
          <label className="mb-2 block text-sm font-medium">
            고객사
          </label>

          <input
            {...register("customer")}
            placeholder="고객사명 검색"
            className="w-full rounded-md border px-3 py-2"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            프로젝트명
          </label>

          <div className="flex gap-2">
            <input
              {...register("name")}
              placeholder="프로젝트명 검색"
              className="flex-1 rounded-md border px-3 py-2"
            />

            <button
              type="submit"
              className="rounded-md bg-black px-4 py-2 text-white"
            >
              검색
            </button>

            <button
              type="button"
              onClick={onReset}
              className="rounded-md border px-4 py-2"
            >
              초기화
            </button>
          </div>
        </div>
      </form>

      {/* Sort */}
      <div className="flex items-center justify-end gap-2">
        <label
          htmlFor="project-sort"
          className="text-sm font-medium"
        >
          정렬
        </label>

        <select
          id="project-sort"
          value={currentSort}
          onChange={(e) =>
            setFilter("sort", e.target.value)
          }
          className="rounded-md border px-3 py-2 text-sm"
        >
          <option value="createdAt,desc">최신순</option>
          <option value="createdAt,asc">오래된순</option>
          <option value="name,asc">프로젝트명 오름차순</option>
          <option value="name,desc">프로젝트명 내림차순</option>
          <option value="customer,asc">고객사 오름차순</option>
          <option value="customer,desc">고객사 내림차순</option>
        </select>
      </div>

      {/* Project List */}
      <ProjectTable projects={data?.content ?? []} />
    </div>
  );
};

export default ProjectList;