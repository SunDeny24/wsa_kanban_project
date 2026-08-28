// 프로젝트 상세화면의 공통 UI 레이아웃 컴포넌트
"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { type ReactNode, useState } from "react";
import { Archive, ArrowLeft, Play, Trash2 } from "lucide-react";
import {
    useEntityQuery,
    useDeleteEntity,
    usePatchEntity,
} from "@/lib/hooks/useEntity";
import type { Project } from "@/features/project/types";
import { statusLabel, statusClassName } from "@/features/project/constants";
import { ConfirmModal } from "@/components/common/ConfirmModal";
import { ErrorModal } from "@/components/common/ErrorModal";
import { getErrorResponse } from "@/lib/api/error";
import { ProjectHeaderSkeleton } from "@/features/project/components/skeleton/ProjectDetailSkeleton";
import {
    ProjectLoadErrorState,
    ProjectNotFoundState,
} from "@/features/project/components/ProjectNotFoundState";

interface ProjectDetailLayoutProps {
    projectId: string;
    children: ReactNode;
}

const tabs = [
    { label: "개요", path: "" },
    { label: "견적", path: "/quotation" },
    // { label: '아이템', path: '/item' }, 추후 예정
    { label: "보드", path: "/cards" },
];

export default function ProjectDetailLayout({
    projectId,
    children,
}: ProjectDetailLayoutProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const basePath = `/projects/${projectId}`;
    const fromParam = searchParams.get("from");
    const listUrl = fromParam?.startsWith("/projects")
        ? fromParam
        : "/projects";
    const fromQuery = new URLSearchParams({ from: listUrl }).toString();

    // 프로젝트 단건 조회 API 호출
    const {
        data: project,
        isLoading,
        error: queryError,
        refetch,
        isFetching,
    } = useEntityQuery<Project>("/projects", projectId);

    // 프로젝트 조회 오류는 상위 Layout에서 처리
    const queryErrorResponse = queryError ? getErrorResponse(queryError) : null;
    const isNotFound = queryErrorResponse?.status === 404;
    const isLoadError =
        (!!queryError && !isNotFound) ||
        (!isLoading && !queryError && !project);

    /* ----------------프로젝트 활성화 처리 --------------------- */
    // 삭제모달
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // 모달 상태관리

    // 프로젝트 삭제 API
    const deleteProject = useDeleteEntity<void>("/projects", {
        invalidateEndpoint: false, // 기본 엔드포인트 무효화 방지
        onSuccessCallback: () => {
            setIsDeleteModalOpen(false);
            router.push(listUrl);
        },
    });

    // 프로젝트 삭제 함수
    const handleDelete = () => {
        deleteProject.mutate(projectId);
    };

    /* ----------------프로젝트 보관 처리 --------------------- */
    // 보관 모달 상태관리
    const [isArchiveModalOpen, setIsArchiveModalOpen] = useState(false);
    // 프로젝트 보관처리 API 호출
    const archiveProject = usePatchEntity<void>(
        `/projects/${projectId}/archive`,
        {
            // 프로젝트 상세와 목록의 상태 배지를 함께 갱신합니다.
            invalidateKeys: [["/projects"]],
        }
    );
    // 프로젝트 보관처리 함수
    const handleArchive = () => {
        // 정책상 ACTIVE 프로젝트만 보관할 수 있습니다.
        if (project?.status !== "ACTIVE" || archiveProject.isPending) return;

        archiveProject.mutate(undefined, {
            onSuccess: () => setIsArchiveModalOpen(false),
        });
    };

    /* ----------------프로젝트 활성화 처리 --------------------- */
    // 활성화 모달 상태관리
    const [isActiveModalOpen, setIsActiveModalOpen] = useState(false);
    // 프로젝트 활성화 API 호출
    const activeProject = usePatchEntity<void>(
        `/projects/${projectId}/activate`,
        {
            // 프로젝트 상세와 목록의 상태 배지를 함께 갱신합니다.
            invalidateKeys: [["/projects"]],
        }
    );
    // 프로젝트 활성화 함수
    const handleActive = () => {
        // 정책상 QUOTATION 또는 ARCHIVED 프로젝트만 활성화할 수 있습니다.
        if (!project || project.status === "ACTIVE" || activeProject.isPending)
            return;

        activeProject.mutate(undefined, {
            onSuccess: () => setIsActiveModalOpen(false),
        });
    };

    /* 버튼 조건 */
    const canActivate =
        project?.status === "QUOTATION" || project?.status === "ARCHIVED"; // 활성화 : 견적중, 보관중인 데이터만 활성화 가능
    const canArchive = project?.status === "ACTIVE"; // 보관 : 진행중인 데이터만 보관가능 - 명세 변경시 수정바람

    const activateLabel =
        project?.status === "ARCHIVED" ? "재활성화" : "진행중으로 전환";

    // 프로젝트 활성화/보관 모달 내용 설정
    const activateDialog =
        project?.status === "ARCHIVED"
            ? {
                  title: "프로젝트를 재활성화하시겠습니까?",
                  description:
                      "보관된 프로젝트를 다시 진행중으로 전환합니다. 기존 견적과 카드 데이터는 그대로 유지됩니다.",
                  confirmText: "재활성화",
              }
            : {
                  title: "프로젝트를 진행중으로 전환하시겠습니까?",
                  description:
                      "견적 확정 여부와 관계없이 프로젝트만 진행중으로 전환합니다. 기존 견적 상태는 변경되지 않습니다.",
                  confirmText: "진행중으로 전환",
              };

    // 상태 전환 실패 응답은 기존 공통 에러 형식으로 표시합니다.
    const actionMutationError =
        archiveProject.error ?? activeProject.error ?? null;
    const actionErrorResponse = actionMutationError
        ? getErrorResponse(actionMutationError)
        : null;

    // 확인용 log
    // useEffect(() => {
    //     console.log("[ProjectDetail] projectId:", projectId);
    // }, [projectId]);

    return (
        <main className="min-h-screen bg-gray-50">
            <header className="border-b bg-white ">
                <div className="flex items-center justify-between px-5 py-4">
                    {/* 프로젝트 목록으로 돌아가기 버튼(뒤로가기) */}
                    <button
                        type="button"
                        onClick={() => router.push(listUrl)}
                        className="inline-flex items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
                        aria-label="프로젝트 목록으로 돌아가기">
                        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                        프로젝트 목록
                    </button>
                    {/* 프로젝트 상태변경 버튼, 삭제버튼 */}
                    {project && (
                        <div className="flex items-center gap-2">
                            {/* 프로젝트 활성화 버튼 */}
                            {canActivate && (
                                <button
                                    type="button"
                                    aria-label={activateLabel}
                                    onClick={() => setIsActiveModalOpen(true)}
                                    className="
                                    inline-flex h-8 items-center justify-center gap-1.5
                                    rounded-lg bg-green-50 px-2.5
                                    text-sm font-medium text-green-700
                                    transition-colors hover:text-green-800
                                ">
                                    <Play
                                        className="h-3.5 w-3.5"
                                        aria-hidden="true"
                                    />
                                    <span className="hidden sm:inline">
                                        {activateLabel}
                                    </span>
                                </button>
                            )}

                            {/* 프로젝트 보관 버튼: ACTIVE 상태에서만 노출 */}
                            {canArchive && (
                                <button
                                    type="button"
                                    aria-label="프로젝트 보관"
                                    onClick={() => setIsArchiveModalOpen(true)}
                                    className="
                                    inline-flex h-8 items-center justify-center gap-1.5
                                    rounded-lg bg-gray-100 px-2.5
                                    text-sm font-medium text-gray-500
                                    transition-colors hover:text-gray-600
                                ">
                                    <Archive
                                        className="h-3.5 w-3.5"
                                        aria-hidden="true"
                                    />
                                    <span className="hidden sm:inline">
                                        보관
                                    </span>
                                </button>
                            )}

                            {/* 프로젝트 삭제버튼(전체삭제) */}
                            <button
                                type="button"
                                aria-label="프로젝트 삭제"
                                onClick={() => setIsDeleteModalOpen(true)}
                                className="
                                inline-flex h-8 items-center justify-center gap-1.5
                                rounded-lg bg-red-50 px-2.5
                                text-sm font-medium text-red-500
                                transition-colors hover:text-red-600
                            ">
                                <Trash2
                                    className="h-3.5 w-3.5"
                                    aria-hidden="true"
                                />
                                <span className="hidden sm:inline">삭제</span>
                            </button>
                        </div>
                    )}
                </div>

                {/* 헤더 정보 - 프로젝트명, 상태, 고객사 */}
                {!isNotFound && !isLoadError && (
                    <div className="mx-auto max-w-7xl px-6 pt-3 ">
                        {/* 프로젝트 조회 중엔 헤더 스켈레톤 */}
                        {isLoading ? (
                            <ProjectHeaderSkeleton />
                        ) : project ? (
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                                {/* 프로젝트명 */}
                                <h1 className="text-2xl font-bold text-gray-900">
                                    {project.name}
                                </h1>
                                {/* 상태 */}
                                <span
                                    className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${
                                        statusClassName[project.status]
                                    }`}>
                                    {statusLabel[project.status]}
                                </span>
                                {/* 고객사명 */}
                                <span className="text-sm text-gray-500">
                                    고객사 : {project.customer}
                                </span>
                            </div>
                        ) : null}

                        {/* 프로젝트 상세 네비게이션(탭) 메뉴 */}
                        <nav
                            className="mt-8 flex gap-7"
                            aria-label="프로젝트 상세 메뉴">
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
                                                ? "border-blue-600 text-blue-600"
                                                : "border-transparent text-gray-500 hover:text-gray-900"
                                        }`}>
                                        {tab.label}
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>
                )}
            </header>

            {/* 탭 별 섹션부분 - 개요, 견적, 보드 */}
            <section className="mx-auto max-w-7xl px-6 py-8">
                {isNotFound ? (
                    // 404에서는 하위 children을 렌더링하지 않음
                    <ProjectNotFoundState backHref={listUrl} />
                ) : isLoadError ? (
                    // 404가 아닌 일시적인 조회 오류는 Layout에서 재시도 제공
                    <ProjectLoadErrorState
                        onRetry={() => void refetch()}
                        isRetrying={isFetching}
                    />
                ) : (
                    // Loading과 정상 조회에서만 하위 탭 내용을 렌더링
                    children
                )}
            </section>

            {/* ---------------------공통 팝업--------------------- */}
            {/* 삭제 팝업 */}
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
            {/* 보관 팝업 */}
            <ConfirmModal
                isOpen={isArchiveModalOpen}
                title="프로젝트를 보관하시겠습니까?"
                description="진행중인 프로젝트를 보관 상태로 전환합니다. 기존 견적과 카드 데이터는 유지됩니다."
                confirmText="보관"
                cancelText="취소"
                isLoading={archiveProject.isPending}
                onConfirm={handleArchive}
                onCancel={() => {
                    if (!archiveProject.isPending) setIsArchiveModalOpen(false);
                }}
            />

            {/* 활성화 팝업 */}
            <ConfirmModal
                isOpen={isActiveModalOpen}
                title={activateDialog.title}
                description={activateDialog.description}
                confirmText={activateDialog.confirmText}
                cancelText="취소"
                isLoading={activeProject.isPending}
                onConfirm={handleActive}
                onCancel={() => {
                    if (!activeProject.isPending) setIsActiveModalOpen(false);
                }}
            />

            {/* 공통 에러 모달 */}
            <ErrorModal
                open={!!actionErrorResponse}
                message={actionErrorResponse?.message}
                status={actionErrorResponse?.status}
                onClose={() => {
                    archiveProject.reset();
                    activeProject.reset();
                }}
            />
        </main>
    );
}
