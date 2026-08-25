// 카드 상세보기

"use client";

import { useEntityQuery, useDeleteEntity } from "@/lib/hooks/useEntity";
import type { Card } from "@/features/cards/types";
import { formatDateTime } from "@/lib/utils/dateFormat";
import {
    priorityLabel,
    supportTypeLabel,
    priorityStyle,
} from "@/features/cards/constants";
import { useEffect, useRef, useState } from "react";
import { CardEditForm } from "@/features/cards/components/CardEditForm";
import { ConfirmModal } from "@/components/common/ConfirmModal";
import { CardProcessForm } from "@/features/cards/components/CardProcessForm";
import { MoreHorizontal, Pencil, Trash2, X } from "lucide-react";
import { CardStatusSelect } from "@/features/cards/components/CardStatusSelect";
import { CardDetailSkeleton } from "@/features/cards/components/CardDetailSkeleton";
import CardErrorToast from "@/features/cards/components/CardErrorToast";
import { getErrorResponse } from "@/lib/api/error";
import { AlertCircle, RefreshCw } from "lucide-react";

interface CardDetailProps {
    cardId: string;
    projectId: string;
    onClose: () => void;
    onCardUnavailable: () => void;
}

interface DetailItemProps {
    label: string;
    value: React.ReactNode;
}

export const CardDetail = ({
    cardId,
    projectId,
    onClose,
    onCardUnavailable,
}: CardDetailProps) => {
    const [isEditing, setIsEditing] = useState(false); // 편집 모드 상태
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // 삭제 모달 상태
    // 더보기 메뉴
    const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
    // 처리 정보가 수정 중인지 여부
    const [isProcessDirty, setIsProcessDirty] = useState(false);
    // 더보기 메뉴 ref
    const moreMenuRef = useRef<HTMLDivElement>(null);

    /* 단건 조회 API 호출 */
    const {
        data: card,
        isLoading,
        error: queryError,
        refetch,
        isFetching,
    } = useEntityQuery<Card>("/cards", cardId);
    const queryErrorResponse = queryError ? getErrorResponse(queryError) : null;

    /* 카드 삭제 API */
    const deleteCard = useDeleteEntity<void>("/cards", {
        invalidateEndpoint: false, // 단건 조회시 다시 호출 방지
        invalidateKeys: [[`/projects/${projectId}/cards`]], // 갱신이 필요한 카드 리스트 무효화
        onSuccessCallback: () => {
            //모달 닫기
            setIsDeleteModalOpen(false);
            onClose();
        },
    });

    /* 카드 삭제 함수 */
    const handleDelete = () => {
        // 삭제 중 중복 요청 방지
        if (deleteCard.isPending) return;
        deleteCard.mutate(cardId);
    };

    const handleOpenDeleteModal = () => {
        setIsMoreMenuOpen(false);
        setIsDeleteModalOpen(true);
    };

    const handleStartEdit = () => {
        // 처리 정보를 작성 중이라면
        // 기본 정보 수정으로 넘어가지 않도록 막음
        if (isProcessDirty) {
            return;
        }

        setIsEditing(true);
        setIsMoreMenuOpen(false);
    };

    /*
     * 더보기 메뉴 바깥 클릭 / ESC 처리
     */
    useEffect(() => {
        if (!isMoreMenuOpen) return;

        const handleClickOutside = (event: MouseEvent) => {
            if (
                moreMenuRef.current &&
                !moreMenuRef.current.contains(event.target as Node)
            ) {
                setIsMoreMenuOpen(false);
            }
        };

        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setIsMoreMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleEscape);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleEscape);
        };
    }, [isMoreMenuOpen]);

    // 상세 조회 또는 DELETE 404 처리
    useEffect(() => {
        // 삭제요청 실패시
        const deleteErrorResponse = deleteCard.error
            ? getErrorResponse(deleteCard.error)
            : null;
        // 카드상세조회, 삭제요청 404 실패시 반환
        const isMissingCard =
            queryErrorResponse?.status === 404 ||
            deleteErrorResponse?.status === 404;
        if (!isMissingCard) return;

        setIsDeleteModalOpen(false); // 삭제 모달 닫기
        onCardUnavailable();
    }, [queryErrorResponse?.status, deleteCard.error, onCardUnavailable]);

    // 확인용 log
    // console.log("[CardDetail] 요청 cardId:", cardId);

    // 상세 조회 중에도 기존 모달 프레임 유지
    if (isLoading) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                <div className="relative max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-xl">
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="닫기"
                        className="absolute right-4 top-4 z-10 inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500">
                        <X className="h-4 w-4" />
                    </button>
                    <CardDetailSkeleton />
                </div>
            </div>
        );
    }

    // 500/Network 상세 조회 실패는 모달 안에서 GET 재시도 제공
    if (queryErrorResponse && queryErrorResponse.status !== 404) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                <div className="relative flex min-h-72 w-full max-w-2xl flex-col items-center justify-center rounded-2xl bg-white px-6 text-center shadow-xl">
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="닫기"
                        className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500">
                        <X className="h-4 w-4" />
                    </button>
                    <AlertCircle
                        className="h-7 w-7 text-red-500"
                        aria-hidden="true"
                    />
                    <p className="mt-3 text-sm font-medium text-gray-900">
                        카드를 불러오지 못했습니다.
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                        잠시 후 다시 시도해주세요.
                    </p>
                    <button
                        type="button"
                        onClick={() => void refetch()}
                        disabled={isFetching}
                        className="mt-4 inline-flex h-9 items-center gap-2 rounded-lg border border-gray-300 px-3 text-sm font-medium text-gray-700 disabled:opacity-50">
                        <RefreshCw
                            className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
                            aria-hidden="true"
                        />
                        {isFetching ? "다시 불러오는 중..." : "다시 시도"}
                    </button>
                </div>
            </div>
        );
    }

    if (!card) return null;

    const priorityClassName = priorityStyle[card.priorityType];

    // 카드 상세 정보 항목 컴포넌트
    const DetailItem = ({ label, value }: DetailItemProps) => {
        return (
            <div>
                <p className="mb-1 text-xs font-medium text-gray-500">
                    {label}
                </p>

                <p className="text-sm font-medium text-gray-900">{value}</p>
            </div>
        );
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 ">
            <div className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-xl">
                {/* Header - 수정버튼, 삭제버튼, 닫기버튼 */}

                <header className="shrink-0 border-b border-gray-100 px-4 py-4 sm:px-6">
                    <div className="flex items-start gap-3">
                        {/* 제목 + 상태 */}
                        <div className="min-w-0 flex-1">
                            <h2
                                className="
                                    break-words
                                    text-lg font-semibold
                                    leading-7 text-gray-900
                                    sm:text-xl
                                ">
                                {card.title}
                            </h2>

                            {!isEditing && (
                                <div className="mt-2">
                                    <CardStatusSelect
                                        cardId={card.id}
                                        projectId={card.projectId}
                                        status={card.status}
                                    />
                                </div>
                            )}
                        </div>

                        {/* 우측 액션 */}
                        <div className="flex shrink-0 items-center gap-1">
                            {!isEditing && (
                                <>
                                    {/* 기본 정보 수정 */}
                                    <button
                                        type="button"
                                        onClick={handleStartEdit}
                                        disabled={isProcessDirty}
                                        aria-label="기본 정보 수정"
                                        title={
                                            isProcessDirty
                                                ? "처리 정보를 저장하거나 취소한 후 수정할 수 있습니다."
                                                : "기본 정보 수정"
                                        }
                                        className={`
                                            inline-flex h-9 items-center
                                            justify-center gap-1.5
                                            rounded-lg
                                            px-2.5
                                            text-sm font-medium
                                            transition
                                            sm:px-3

                                            ${
                                                isProcessDirty
                                                    ? `
                                                        cursor-not-allowed
                                                        bg-gray-50
                                                        text-gray-300
                                                    `
                                                    : `
                                                        bg-blue-50
                                                        text-blue-600
                                                        hover:bg-blue-100
                                                    `
                                            }
                                        `}>
                                        <Pencil className="h-4 w-4" />

                                        <span className="hidden sm:inline">
                                            기본 정보 수정
                                        </span>
                                    </button>

                                    {/* 더보기 */}
                                    <div ref={moreMenuRef} className="relative">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setIsMoreMenuOpen(
                                                    (prev) => !prev
                                                )
                                            }
                                            aria-label="더보기"
                                            aria-haspopup="menu"
                                            aria-expanded={isMoreMenuOpen}
                                            className="
                                                inline-flex h-9 w-9
                                                items-center justify-center
                                                rounded-lg
                                                border border-gray-200
                                                bg-white
                                                text-gray-500
                                                transition
                                                hover:bg-gray-50
                                                hover:text-gray-700
                                            ">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </button>

                                        {isMoreMenuOpen && (
                                            <div
                                                role="menu"
                                                className="
                                                    absolute right-0 top-11
                                                    z-50
                                                    w-36
                                                    overflow-hidden
                                                    rounded-xl
                                                    border border-gray-200
                                                    bg-white
                                                    p-1
                                                    shadow-lg
                                                ">
                                                <button
                                                    type="button"
                                                    role="menuitem"
                                                    onClick={
                                                        handleOpenDeleteModal
                                                    }
                                                    className="
                                                        flex w-full
                                                        items-center gap-2
                                                        rounded-lg
                                                        px-3 py-2
                                                        text-left text-sm
                                                        font-medium
                                                        text-red-600
                                                        transition
                                                        hover:bg-red-50
                                                    ">
                                                    <Trash2 className="h-4 w-4" />
                                                    카드 삭제
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}

                            {/* 닫기 */}
                            <button
                                type="button"
                                onClick={onClose}
                                aria-label="닫기"
                                className="
                                    inline-flex h-9 w-9
                                    items-center justify-center
                                    rounded-lg
                                    border border-gray-200
                                    bg-white
                                    text-gray-500
                                    transition
                                    hover:bg-gray-50
                                    hover:text-gray-700
                                ">
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </header>
                {/* Content */}
                {isEditing ? (
                    <CardEditForm
                        card={card}
                        projectId={projectId}
                        onCancel={() => setIsEditing(false)}
                        onSuccess={() => setIsEditing(false)}
                        onCardUnavailable={onCardUnavailable}
                    />
                ) : (
                    <div className="min-h-0 flex-1 overflow-y-auto space-y-7 px-6 py-6">
                        {/* 기본 정보 - 지원유형, 우선순위, 요청자, 담당자, 이슈발생일시 */}
                        <section>
                            <h3 className="mb-4 text-sm font-semibold text-gray-900">
                                기본 정보
                            </h3>

                            <div className="grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2">
                                <DetailItem
                                    label="지원 유형"
                                    value={
                                        card.supportType
                                            ? supportTypeLabel[card.supportType]
                                            : "-"
                                    }
                                />

                                <div>
                                    <p className="mb-1 text-xs font-medium text-gray-500">
                                        우선순위
                                    </p>
                                    <span
                                        className={`shrink-0 rounded-full px-2 py-0.5 text-sm font-medium border
                                                ${priorityClassName.background} 
                                                ${priorityClassName.text}
                                                ${priorityClassName.border}
                                                `}>
                                        {card.priorityType
                                            ? priorityLabel[card.priorityType]
                                            : "-"}
                                    </span>
                                </div>

                                <DetailItem
                                    label="요청자"
                                    value={card.assigner ?? "-"}
                                />

                                <DetailItem
                                    label="담당자"
                                    value={card.assignee ?? "-"}
                                />

                                <DetailItem
                                    label="이슈 발생일시"
                                    value={
                                        card.occurredAt
                                            ? formatDateTime(card.occurredAt)
                                            : "-"
                                    }
                                />
                            </div>
                        </section>

                        {/* 상세 설명 */}
                        <section>
                            <h3 className="mb-2 text-sm font-semibold text-gray-900">
                                상세 설명
                            </h3>

                            <div className="min-h-24 whitespace-pre-wrap rounded-xl bg-gray-50 p-4 text-sm leading-6 text-gray-700">
                                {card.description ??
                                    "등록된 상세 설명이 없습니다."}
                            </div>
                        </section>

                        {/* 처리 정보 */}
                        <section>
                            <CardProcessForm
                                card={card}
                                projectId={projectId}
                                onDirtyChange={setIsProcessDirty}
                                onCardUnavailable={onCardUnavailable}
                            />
                        </section>
                    </div>
                )}
            </div>

            {/* 공통 팝업 */}
            <ConfirmModal
                isOpen={isDeleteModalOpen}
                title="카드를 삭제하시겠습니까?"
                description={`카드와 관련된 모든 데이터가 함께 삭제됩니다.
                        삭제된 데이터는 복구할 수 없습니다.`}
                confirmText="삭제"
                cancelText="취소"
                variant="danger"
                isLoading={deleteCard.isPending}
                onConfirm={handleDelete}
                onCancel={() => {
                    if (!deleteCard.isPending) setIsDeleteModalOpen(false);
                }}
            />

            {/* 카드 삭제 실패시(500,Network오류) 상세유지하며 재시도하게 */}
            {deleteCard.error &&
                getErrorResponse(deleteCard.error).status !== 404 && (
                    <CardErrorToast
                        title="카드 삭제 실패"
                        message="카드를 삭제하지 못했습니다."
                        isRetrying={deleteCard.isPending}
                        onRetry={
                            getErrorResponse(deleteCard.error).status >= 500
                                ? handleDelete
                                : undefined
                        }
                        onClose={() => deleteCard.reset()}
                    />
                )}
        </div>
    );
};

export default CardDetail;
