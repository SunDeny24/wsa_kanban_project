'use client';

import { useEffect } from 'react';
import { ErrorModal } from '@/components/common/ErrorModal';
import { ProjectForm } from '@/features/project/components/ProjectForm';
import {
  type Project,
  type ProjectCreateRequest,
} from '@/features/project/types';
import { useCreateEntityForm } from '@/lib/hooks/useQueryForm';

const PROJECTS_ENDPOINT = '/projects';

interface ProjectCreateProps {
  open: boolean;
  onClose: () => void;
}

export const ProjectCreate = ({ open, onClose }: ProjectCreateProps) => {

  const {
    register,
    onSubmit,
    formState,
    isPending,
    errorResponse,
    clearErrorResponse,
    reset,
  } = useCreateEntityForm<ProjectCreateRequest, Project>(PROJECTS_ENDPOINT, {
    formOptions: {
      defaultValues: {
        name: '',
        customer: '',
      },
    },
    mutationOptions: {
      // 목록 query는 공통 mutation이 갱신하므로 성공 시 모달만 닫습니다.
      onSuccessCallback: () => {
        reset();
        onClose();
      },
    },
  });

  useEffect(() => {
    if (!open) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !isPending && !errorResponse) onClose();
    };

    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [open, isPending, errorResponse, onClose]);

  if (!open) return null;

  const closeModal = () => {
    if (isPending) return;
    clearErrorResponse();
    reset();
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-create-title"
      className="fixed inset-0 z-40 flex items-center justify-center overflow-y-auto p-4 sm:p-6"
    >
      <button
        type="button"
        aria-label="프로젝트 생성 모달 닫기"
        onClick={closeModal}
        className="absolute inset-0 h-full w-full bg-black/40"
      />

      <section className="relative my-auto w-full max-w-2xl overflow-hidden rounded-lg border border-gray-200 bg-white shadow-xl">
        <header className="flex items-center justify-between border-b border-gray-200 px-5 py-4 sm:px-6">
          <h1 id="project-create-title" className="text-xl font-bold text-gray-900">프로젝트 생성</h1>
          <button
            type="button"
            onClick={closeModal}
            disabled={isPending}
            aria-label="프로젝트 생성 모달 닫기"
            className="rounded-md p-1.5 text-xl leading-none text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
          >
            ×
          </button>
        </header>

        <div className="p-5 sm:p-6">
          <ProjectForm
            register={register}
            errors={formState.errors}
            onSubmit={onSubmit}
            isPending={isPending}
            onCancel={closeModal}
          />
        </div>
      </section>

      <ErrorModal
        open={!!errorResponse}
        message={errorResponse?.message}
        status={errorResponse?.status}
        onClose={clearErrorResponse}
      />
    </div>
  );
};
