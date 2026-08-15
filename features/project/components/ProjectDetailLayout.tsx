// 프로젝트 상세화면의 공통 UI 레이아웃 컴포넌트
'use client';

import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, type ReactNode } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useEntityQuery } from '@/lib/hooks/useEntity';
import type { Project, ProjectStatus } from '@/features/project/types';

interface ProjectDetailLayoutProps {
  projectId: string;
  children: ReactNode;
}

const statusLabel: Record<ProjectStatus, string> = {
  QUOTATION: '견적중',
  ACTIVE: '진행중',
  ARCHIVED: '보관',
};

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

  // 확인용 log
  useEffect(() => {
    console.log('[ProjectDetail] projectId:', projectId);
  }, [projectId]);

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="border-b bg-white ">
        <button
            type="button"
            onClick={() => router.push(listUrl)}
            className="inline-flex items-center gap-2 rounded-md px-2 py-1.5 m-5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
            aria-label="프로젝트 목록으로 돌아가기"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          프로젝트 목록
        </button>
        <div className="mx-auto max-w-7xl px-6 pt-8 ">
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
              <h1 className="text-2xl font-bold text-gray-900">{project.name}</h1>
              <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
                {statusLabel[project.status]}
              </span>
              <span className="text-sm text-gray-500">고객사: {project.customer}</span>
            </div>
          )}

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

      <section className="mx-auto max-w-7xl px-6 py-8">{children}</section>
    </main>
  );
}
