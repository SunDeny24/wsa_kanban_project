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
    <div className="overflow-hidden rounded-lg border bg-white">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr className="border-b">
            <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
              프로젝트명
            </th>
            <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
              고객사
            </th>
            <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
              설명
            </th>
            <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
              상태
            </th>
            <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
              시작일
            </th>
            <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
              상세
            </th>
          </tr>
        </thead>

        <tbody>
          {projects.length === 0 ? (
            <tr>
              <td
                colSpan={6}
                className="px-6 py-12 text-center text-sm text-gray-500"
              >
                조회된 프로젝트가 없습니다.
              </td>
            </tr>
          ) : (
            projects.map((project) => (
              <tr
                key={project.id}
                className="border-b last:border-b-0 hover:bg-gray-50"
              >
                {/* 프로젝트명 */}
                <td className="px-6 py-4">
                  <span className="font-medium text-gray-900">
                    {project.name}
                  </span>
                </td>

                {/* 고객사 */}
                <td className="px-6 py-4 text-sm text-gray-700">
                  {project.customer}
                </td>

                {/* 설명 */}
                <td className="max-w-[300px] px-6 py-4 text-sm text-gray-500">
                  <p className="truncate">
                    {project.description ?? "-"}
                  </p>
                </td>

                {/* 상태 */}
                <td className="px-6 py-4 text-center">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${project.status === "QUOTATION"
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
                <td className="px-6 py-4 text-sm text-gray-600">
                  {project.startDate ?? "-"}
                </td>

                {/* 상세 */}
                <td className="px-6 py-4 text-center">
                  <button
                    type="button"
                    className="rounded-md border px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100"
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
  );
}

export default ProjectTable;