'use client';
import React from "react";
import { Project } from "@/features/project/types";

interface ProjectTableProps {
  projects: Project[];
}

export const ProjectTable = ({ projects }: ProjectTableProps) => {
  const statusLabel: Record<Project["status"], string> = {
    QUOTATION: "견적중",
    ACTIVE: "진행중",
    ARCHIVED: "보관",
  };

  return (
      <div className="min-h-[560px] overflow-hidden rounded-lg border bg-white">
        <div className="h-full overflow-x-auto">
          <table className="w-full min-w-[900px] table-fixed">
            <thead className="bg-gray-50">
            <tr className="border-b">
              <th className="w-[20%] px-4 py-2.5 text-center text-xs font-semibold text-gray-600">
                프로젝트명
              </th>

              <th className="w-[15%] px-4 py-2.5 text-center text-xs font-semibold text-gray-600">
                고객사
              </th>

              <th className="w-[25%] px-4 py-2.5 text-center text-xs font-semibold text-gray-600">
                설명
              </th>

              <th className="w-[12%] px-4 py-2.5 text-center text-xs font-semibold text-gray-600">
                상태
              </th>

              <th className="w-[15%] px-4 py-2.5 text-center text-xs font-semibold text-gray-600">
                시작일
              </th>

              <th className="w-[13%] px-4 py-2.5 text-center text-xs font-semibold text-gray-600">
                상세
              </th>
            </tr>
            </thead>

            <tbody>
            {projects.length === 0 ? (
                <tr>
                  <td
                      colSpan={6}
                      className="h-[500px] px-4 text-center text-sm text-gray-400"
                  >
                    조회된 프로젝트가 없습니다.
                  </td>
                </tr>
            ) : (
                projects.map((project) => (
                    <tr
                        key={project.id}
                        className="h-[40px] border-b last:border-b-0 hover:bg-gray-50"
                    >
                      {/* 프로젝트명 */}
                      <td className="px-4 py-2">
                        <p
                            className="truncate text-sm font-medium text-gray-900"
                            title={project.name}
                        >
                          {project.name}
                        </p>
                      </td>

                      {/* 고객사 */}
                      <td className="px-4 py-2">
                        <p
                            className="truncate text-sm text-gray-700"
                            title={project.customer}
                        >
                          {project.customer}
                        </p>
                      </td>

                      {/* 설명 */}
                      <td className="px-4 py-2">
                        <p
                            className="truncate text-sm text-gray-500"
                            title={project.description ?? ""}
                        >
                          {project.description ?? "-"}
                        </p>
                      </td>

                      {/* 상태 */}
                      <td className="px-4 py-2 text-center">
                    <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                            project.status === "QUOTATION"
                                ? "bg-yellow-50 text-yellow-700"
                                : project.status === "ACTIVE"
                                    ? "bg-green-50 text-green-700"
                                    : "bg-gray-100 text-gray-600"
                        }`}
                    >
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
                        <button
                            type="button"
                            className="rounded-md border border-gray-300 px-2.5 py-1 text-xs font-medium text-gray-700 transition hover:bg-gray-100"
                        >
                          상세 보기
                        </button>
                      </td>
                    </tr>
                ))
            )}
            </tbody>
          </table>
        </div>
      </div>
  );
}

export default ProjectTable;