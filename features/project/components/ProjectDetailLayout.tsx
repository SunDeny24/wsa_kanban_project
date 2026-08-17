// 프로젝트 상세화면의 공통 UI 레이아웃 컴포넌트
'use client';

import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {useEffect, type ReactNode, useState} from 'react';
import {ArrowLeft, Trash2 } from 'lucide-react';
import { useEntityQuery, useDeleteEntity } from '@/lib/hooks/useEntity';
import type { Project } from '@/features/project/types';
import {statusLabel,statusClassName} from "@/features/project/constants";
import {ConfirmModal} from "@/components/common/ConfirmModal";

interface ProjectDetailLayoutProps {
  projectId: string;
  children: ReactNode;
}

const tabs = [
  { label: '개요', path: '' },
  { label: '견적', path: '/quotation' },
 // { label: '아이템', path: '/item' }, 추후 예정
  { label: '보드', path: '/board' },
];

export default function ProjectDetailLayout({
  projectId,
  children,
}: ProjectDetailLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const basePath = `/projects/${projectId}`;
  const fromParam = searchParams.get('from');
  const listUrl = fromParam?.startsWith('/projects') ? fromParam : '/projects';
  const fromQuery = new URLSearchParams({ from: listUrl }).toString();
  // 단건 조회 API 호출
  const { data: project, isLoading, isError } = useEntityQuery<Project>(
    '/projects',
    projectId,
  );

  /* 삭제모달 */
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // 모달 상태관리

  /* 프로젝트 삭제 API */
  const deleteProject = useDeleteEntity<void>('/projects', {
    onSuccessCallback: () => {
      setIsDeleteModalOpen(false);
      router.push(listUrl);
    },
  });

  /* 프로젝트 삭제 함수 */
  const handleDelete = () => {
    deleteProject.mutate(projectId);
  };

  // 확인용 log
  useEffect(() => {
    console.log('[ProjectDetail] projectId:', projectId);
  }, [projectId]);

  return (
    <main className="min-h-screen bg-gray-50">

      <header className="border-b bg-white ">
        <div className="flex items-center justify-between">
          {/* 프로젝트 목록으로 돌아가기 버튼(뒤로가기) */}
          <button
              type="button"
              onClick={() => router.push(listUrl)}
              className="inline-flex items-center gap-2 rounded-md px-2 py-1.5 mx-5 mt-5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
              aria-label="프로젝트 목록으로 돌아가기"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            프로젝트 목록
          </button>
          {/* 프로젝트 삭제버튼(전체삭제) */}
          <button
              type="button"
              aria-label="프로젝트 삭제"
              onClick={() => setIsDeleteModalOpen(true)}
              className="inline-flex h-8 w-8 shrink-0 items-center justify-center mx-5 mt-5 rounded-md border border-red-300 bg-white text-red-700 transition hover:bg-red-50 sm:w-auto sm:gap-1.5 sm:px-3"
          >
            <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
            <span className="hidden sm:inline">삭제</span>
          </button>
        </div>

        {/* 헤더 정보 - 프로젝트명, 상태, 고객사 */}
        <div className="mx-auto max-w-7xl px-6 pt-3 ">
          {isLoading ? (
            <p className="text-sm text-gray-500">프로젝트 정보를 불러오는 중...</p>
          ) : isError || !project ? (
            <div>
              <h1 className="text-2xl font-bold text-gray-900">프로젝트 상세</h1>
              <p className="mt-1 text-sm text-red-500">
                프로젝트 정보를 불러오지 못했습니다.
              </p>
            </div>
          ) : (
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              {/* 프로젝트명 */}
              <h1 className="text-2xl font-bold text-gray-900">{project.name}</h1>
              {/* 상태 */}
              <span
                  className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${
                      statusClassName[project.status]
                  }`}
              >
                {statusLabel[project.status]}
              </span>
              {/* 고객사명 */}
              <span className="text-sm text-gray-500">고객사 : {project.customer}</span>
            </div>
          )}

          {/* 프로젝트 상세 네비게이션(탭) 메뉴 */}
          <nav className="mt-8 flex gap-7" aria-label="프로젝트 상세 메뉴">
            {tabs.map((tab) => {
              const tabPath = `${basePath}${tab.path}`;
              const href = `${tabPath}?${fromQuery}`;
              const isActive = pathname === tabPath;

              return (
                <Link
                  key={tab.label}
                  href={href}
                  className={`border-b-2 px-1 pb-3 text-sm font-medium transition-colors ${
                    isActive
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-900'
                  }`}
                >
                  {tab.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      {/* 탭 별 섹션부분 - 개요, 견적, 보드 */}
      <section className="mx-auto max-w-7xl px-6 py-8">{children}</section>

      {/* 공통 팝업 */}
      <ConfirmModal
          isOpen={isDeleteModalOpen}
          title="프로젝트를 삭제하시겠습니까?"
          description={`프로젝트와 관련된 모든 데이터가 함께 삭제됩니다.
                        삭제된 데이터는 복구할 수 없습니다.`}
          confirmText="삭제"
          cancelText="취소"
          variant="danger"
          onConfirm={handleDelete}
          onCancel={() => setIsDeleteModalOpen(false)}
      />
    </main>
  );
}
