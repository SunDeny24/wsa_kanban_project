'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { Pencil } from 'lucide-react';
import { ErrorModal } from '@/components/common/ErrorModal';
import { ProjectForm } from '@/features/project/components/ProjectForm';
import type { Project, ProjectUpdateRequest } from '@/features/project/types';
import { getErrorResponse } from '@/lib/api/error';
import { useUpdateEntityForm } from '@/lib/hooks/useQueryForm';

const PROJECTS_ENDPOINT = '/projects';

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
  const [isQueryErrorDismissed, setIsQueryErrorDismissed] = useState(false);
  const {
    data: project,
    isLoading,
    queryError,
    register,
    onSubmit,
    formState,
    isPending,
    errorResponse,
    clearErrorResponse,
    reset,
    query,
  } = useUpdateEntityForm<ProjectUpdateRequest, Project, Project>(
    PROJECTS_ENDPOINT,
    projectId,
    {
      mapQueryData: toProjectUpdateRequest,
      mutationOptions: {
        onSuccessCallback: () => setIsEditing(false),
      },
    },
  );
  const queryErrorResponse = queryError ? getErrorResponse(queryError) : null;

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
    <section className="w-full">
      <div className="py-4 sm:py-5">
        {isLoading ? (
          <p className="text-sm text-gray-500">
            프로젝트 정보를 불러오는 중...
          </p>
        ) : !project ? (
          <p className="text-sm text-red-600">
            프로젝트 정보를 불러오지 못했습니다.
          </p>
        ) : isEditing ? (
          <ProjectForm
            register={register}
            errors={formState.errors}
            onSubmit={onSubmit}
            isPending={isPending}
            onCancel={cancelEditing}
            submitLabel="저장"
            pendingLabel="저장 중..."
            stacked
          />
        ) : (
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-medium text-gray-500">프로젝트명</p>
                <button
                  type="button"
                  onClick={startEditing}
                  aria-label="프로젝트 수정"
                  className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-gray-300 bg-white text-gray-700 transition hover:bg-gray-50 sm:w-auto sm:gap-1.5 sm:px-3"
                >
                  <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                  <span className="hidden sm:inline">수정</span>
                </button>
              </div>
              <p className="mt-2 break-words text-sm text-gray-900">
                {project.name}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500">고객사</p>
              <p className="mt-2 break-words text-sm text-gray-900">
                {project.customer}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500">설명</p>
              <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-gray-900">
                {project.description || '-'}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500">시작일</p>
              <p className="mt-2 text-sm text-gray-900">
                {project.startDate || '-'}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500">종료일</p>
              <p className="mt-2 text-sm text-gray-900">
                {project.endDate || '-'}
              </p>
            </div>
          </div>
        )}
      </div>

      <ErrorModal
        open={!!queryErrorResponse && !isQueryErrorDismissed}
        message={queryErrorResponse?.message}
        status={queryErrorResponse?.status}
        onRetry={() => {
          setIsQueryErrorDismissed(false);
          void query.refetch();
        }}
        onClose={() => setIsQueryErrorDismissed(true)}
      />

      <ErrorModal
        open={!!errorResponse}
        message={errorResponse?.message}
        status={errorResponse?.status}
        onClose={clearErrorResponse}
      />
    </section>
  );
};
