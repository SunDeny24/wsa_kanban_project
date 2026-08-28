"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Pencil } from "lucide-react";
import { ErrorModal } from "@/components/common/ErrorModal";
import { ProjectForm } from "@/features/project/components/ProjectForm";
import type { Project, ProjectUpdateRequest } from "@/features/project/types";
import { useUpdateEntityForm } from "@/lib/hooks/useQueryForm";
import { ProjectOverviewSkeleton } from "@/features/project/components/skeleton/ProjectDetailSkeleton";

const PROJECTS_ENDPOINT = "/projects";

const toProjectUpdateRequest = (project: Project): ProjectUpdateRequest => ({
    name: project.name,
    customer: project.customer,
    description: project.description ?? undefined,
    startDate: project.startDate ?? undefined,
    endDate: project.endDate ?? undefined,
});

export const ProjectOverview = () => {
    const params = useParams<{ projectId: string }>();
    const projectId = params.projectId;
    const [isEditing, setIsEditing] = useState(false);
    const {
        data: project,
        isLoading,
        register,
        onSubmit,
        formState,
        isPending,
        errorResponse,
        clearErrorResponse,
        reset,
    } = useUpdateEntityForm<ProjectUpdateRequest, Project, Project>(
        PROJECTS_ENDPOINT,
        projectId,
        {
            mapQueryData: toProjectUpdateRequest,
            mutationOptions: {
                onSuccessCallback: () => setIsEditing(false),
            },
        }
    );

    const startEditing = () => {
        if (!project) return;
        clearErrorResponse();
        reset(toProjectUpdateRequest(project));
        setIsEditing(true);
    };

    const cancelEditing = () => {
        if (isPending || !project) return;
        clearErrorResponse();
        reset(toProjectUpdateRequest(project));
        setIsEditing(false);
    };

    return (
        <section aria-labelledby="project-overview-title">
            {/* 기본 정보 헤더 */}
            <header className="mb-5 flex items-start justify-between gap-3">
                <div>
                    <h1
                        id="project-overview-title"
                        className="text-lg font-semibold tracking-tight text-zinc-800">
                        기본 정보
                    </h1>

                    <p className="mt-1 text-sm text-zinc-500">
                        프로젝트의 기본 정보를 확인하고 수정합니다.
                    </p>
                </div>

                {/* 프로젝트 조회 성공 시에만 수정 버튼 노출 */}
                {!isEditing && project && (
                    <button
                        type="button"
                        onClick={startEditing}
                        aria-label="기본 정보 수정"
                        className="
                        inline-flex h-9 shrink-0 items-center gap-2
                        rounded-xl bg-blue-50 px-3
                        text-sm font-medium text-blue-600
                        transition
                        hover:bg-blue-100
                        active:scale-[0.98]
                        sm:px-4
                    ">
                        <Pencil className="h-4 w-4" aria-hidden="true" />

                        <span className="hidden sm:inline">기본 정보 수정</span>
                    </button>
                )}
            </header>

            {/* 기본 정보 내용 */}
            {isLoading ? (
                /* 조회 중 스켈레톤 */
                <ProjectOverviewSkeleton />
            ) : !project ? null : isEditing ? ( // 프로젝트 존재 여부와 조회 오류는 상위 Layout에서 처리
                <div className="rounded-2xl bg-white p-5 sm:p-6">
                    <ProjectForm
                        register={register}
                        errors={formState.errors}
                        onSubmit={onSubmit}
                        isPending={isPending}
                        onCancel={cancelEditing}
                        submitLabel="저장"
                        pendingLabel="저장 중..."
                    />
                </div>
            ) : (
                <div className="rounded-2xl bg-white p-5 sm:p-6">
                    <dl className="space-y-6">
                        {/* 프로젝트명 */}
                        <div className="grid gap-1.5 sm:grid-cols-[120px_1fr] sm:gap-6">
                            <dt className="text-sm font-medium text-zinc-500">
                                프로젝트명
                            </dt>

                            <dd className="break-words text-sm font-medium text-zinc-900">
                                {project.name}
                            </dd>
                        </div>

                        {/* 고객사 */}
                        <div className="grid gap-1.5 sm:grid-cols-[120px_1fr] sm:gap-6">
                            <dt className="text-sm font-medium text-zinc-500">
                                고객사
                            </dt>

                            <dd className="break-words text-sm text-zinc-900">
                                {project.customer}
                            </dd>
                        </div>

                        {/* 설명 */}
                        <div className="grid gap-1.5 sm:grid-cols-[120px_1fr] sm:gap-6">
                            <dt className="text-sm font-medium text-zinc-500">
                                설명
                            </dt>

                            <dd className="whitespace-pre-wrap break-words text-sm leading-6 text-zinc-900">
                                {project.description || "-"}
                            </dd>
                        </div>

                        {/* 시작일 */}
                        <div className="grid gap-1.5 sm:grid-cols-[120px_1fr] sm:gap-6">
                            <dt className="text-sm font-medium text-zinc-500">
                                시작일
                            </dt>

                            <dd className="text-sm text-zinc-900">
                                {project.startDate || "-"}
                            </dd>
                        </div>

                        {/* 종료일 */}
                        <div className="grid gap-1.5 sm:grid-cols-[120px_1fr] sm:gap-6">
                            <dt className="text-sm font-medium text-zinc-500">
                                종료일
                            </dt>

                            <dd className="text-sm text-zinc-900">
                                {project.endDate || "-"}
                            </dd>
                        </div>
                    </dl>
                </div>
            )}

            {/* 에러모달 - 프로젝트 수정 실패 */}
            <ErrorModal
                open={!!errorResponse}
                message={errorResponse?.message}
                status={errorResponse?.status}
                onClose={clearErrorResponse}
            />
        </section>
    );
};
