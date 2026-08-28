"use client";
import React from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Project } from "@/features/project/types";
import { statusLabel } from "@/features/project/constants";
import { AlertCircle, RefreshCw } from "lucide-react";

interface ProjectTableProps {
    projects: Project[];
    errorMessage?: string;
    onRetry?: () => void;
    isRetrying?: boolean;
}

export const ProjectTable = ({
    projects,
    errorMessage,
    onRetry,
    isRetrying = false,
}: ProjectTableProps) => {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const listUrl = `${pathname}${searchParams.size ? `?${searchParams.toString()}` : ""}`;

    return (
        <div className="h-[560px] max-w-full overflow-hidden rounded-lg border bg-white">
            <div className="h-full max-w-full overflow-auto">
                <table className="w-full min-w-[900px] table-fixed">
                    <thead className="sticky top-0 z-10 bg-gray-50">
                        <tr className="border-b">
                            <th className="w-[20%] bg-gray-50 px-4 py-2.5 text-center text-xs font-semibold text-gray-600">
                                프로젝트명
                            </th>

                            <th className="w-[15%] bg-gray-50 px-4 py-2.5 text-center text-xs font-semibold text-gray-600">
                                고객사
                            </th>

                            <th className="w-[25%] bg-gray-50 px-4 py-2.5 text-center text-xs font-semibold text-gray-600">
                                설명
                            </th>

                            <th className="w-[12%] bg-gray-50 px-4 py-2.5 text-center text-xs font-semibold text-gray-600">
                                상태
                            </th>

                            <th className="w-[15%] bg-gray-50 px-4 py-2.5 text-center text-xs font-semibold text-gray-600">
                                시작일
                            </th>

                            <th className="w-[13%] bg-gray-50 px-4 py-2.5 text-center text-xs font-semibold text-gray-600">
                                상세
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {errorMessage ? (
                            <tr>
                                <td colSpan={6} className="h-[500px] px-4">
                                    <div
                                        role="alert"
                                        className="flex flex-col items-center justify-center text-center">
                                        <AlertCircle
                                            aria-hidden="true"
                                            className="h-7 w-7 text-red-500"
                                        />
                                        <p className="mt-3 text-sm font-medium text-gray-800">
                                            프로젝트를 불러오지 못했습니다.
                                        </p>
                                        <p className="mt-1 max-w-md text-xs text-gray-500">
                                            {errorMessage}
                                        </p>
                                        {onRetry && (
                                            <button
                                                type="button"
                                                onClick={onRetry}
                                                disabled={isRetrying}
                                                className="mt-4 inline-flex h-9 items-center gap-2 rounded-md border border-gray-300 bg-white px-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50">
                                                <RefreshCw
                                                    aria-hidden="true"
                                                    className={`h-4 w-4 ${isRetrying ? "animate-spin" : ""}`}
                                                />
                                                {isRetrying
                                                    ? "다시 불러오는 중..."
                                                    : "다시 시도"}
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ) : projects.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={6}
                                    className="h-[500px] px-4 text-center text-sm text-gray-400">
                                    조회된 프로젝트가 없습니다.
                                </td>
                            </tr>
                        ) : (
                            projects.map((project) => {
                                const detailHref = `/projects/${project.id}?${new URLSearchParams(
                                    {
                                        from: listUrl,
                                    }
                                ).toString()}`;

                                return (
                                    <tr
                                        key={project.id}
                                        className="h-[40px] border-b last:border-b-0 hover:bg-gray-50">
                                        {/* 프로젝트명 */}
                                        <td className="px-4 py-2">
                                            <Link
                                                href={detailHref}
                                                className="block truncate text-sm font-medium text-gray-900 hover:underline focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2"
                                                title={project.name}>
                                                {project.name}
                                            </Link>
                                        </td>

                                        {/* 고객사 */}
                                        <td className="px-4 py-2">
                                            <p
                                                className="truncate text-sm text-gray-700"
                                                title={project.customer}>
                                                {project.customer}
                                            </p>
                                        </td>

                                        {/* 설명 */}
                                        <td className="px-4 py-2">
                                            <p
                                                className="truncate text-sm text-gray-500"
                                                title={
                                                    project.description ?? ""
                                                }>
                                                {project.description ?? "-"}
                                            </p>
                                        </td>

                                        {/* 상태 */}
                                        <td className="px-4 py-2 text-center">
                                            <span
                                                className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                                                    project.status ===
                                                    "QUOTATION"
                                                        ? "bg-blue-50 text-blue-700"
                                                        : project.status ===
                                                            "ACTIVE"
                                                          ? "bg-green-50 text-green-700"
                                                          : "bg-gray-100 text-gray-600"
                                                }`}>
                                                {statusLabel[project.status]}
                                            </span>
                                        </td>

                                        {/* 시작일 */}
                                        <td className="px-4 py-2 text-center">
                                            <span className="text-sm text-gray-600">
                                                {project.startDate ?? "-"}
                                            </span>
                                        </td>

                                        {/* 상세 */}
                                        <td className="px-4 py-2 text-center">
                                            <Link
                                                href={detailHref}
                                                className="rounded-md border border-gray-300 px-2.5 py-1 text-xs font-medium text-gray-700 transition hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2">
                                                상세 보기
                                            </Link>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ProjectTable;
