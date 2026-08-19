// 카드 상세보기

"use client";

import { useEntityQuery, useDeleteEntity } from "@/lib/hooks/useEntity";
import type { Card } from "@/features/cards/types";
import { formatDateTime } from "@/lib/utils/dateFormat";
import {
    cardStatusLabel,
    priorityLabel,
    supportTypeLabel,
    priorityStyle,
    statusStyle,
} from "@/features/cards/constants";
import { useState } from "react";
import { CardEditForm } from "@/features/cards/components/CardEditForm";
import { ConfirmModal } from "@/components/common/ConfirmModal";

interface CardDetailProps {
    cardId: string;
    projectId: string;
    onClose: () => void;
}

interface DetailItemProps {
    label: string;
    value: React.ReactNode;
}

export const CardDetail = ({ cardId, projectId, onClose }: CardDetailProps) => {
    const [isEditing, setIsEditing] = useState(false); // 편집 모드 상태
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // 삭제 모달 상태

    /* 단건 조회 API 호출 */
    const {
        data: card,
        isLoading,
        isError,
    } = useEntityQuery<Card>("/cards", cardId);

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
        deleteCard.mutate(cardId);
    };

    // 확인용 log
    // console.log("[CardDetail] 요청 cardId:", cardId);

    if (isLoading) {
        return <div>카드를 불러오는 중...</div>;
    }
    if (isError) {
        return <div>카드를 불러오지 못했습니다.</div>;
    }

    if (!card) return null;

    const statusClassName = statusStyle[card.status];
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
            {/*<div className="w-full max-w-2xl rounded-2xl bg-white shadow-xl">*/}
            <div className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-xl">
                {/* Header - 제목, 상태, 수정버튼, 닫기버튼 */}
                <div className="flex shrink-0 items-center justify-between border-b border-gray-100 px-6 py-5">
                    <div className="flex items-center gap-3">
                        <h2 className="text-xl font-semibold text-gray-900">
                            {card.title}
                        </h2>

                        <span
                            className={`rounded-full px-2.5 py-1 text-sm font-medium ${statusClassName.background} ${statusClassName.title}`}>
                            {cardStatusLabel[card.status]}
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        {!isEditing && (
                            <div className={"flex gap-2"}>
                                <button
                                    type="button"
                                    onClick={() => setIsEditing(true)}
                                    className="rounded-lg bg-blue-100 px-4 py-2 text-sm font-medium text-blue-600">
                                    수정
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setIsDeleteModalOpen(true)}
                                    className="rounded-lg px-4 py-2 text-sm font-medium bg-red-100 text-red-600">
                                    삭제
                                </button>
                            </div>
                        )}
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
                            닫기
                        </button>
                    </div>
                </div>

                {/* Content */}
                {isEditing ? (
                    <CardEditForm
                        card={card}
                        onCancel={() => setIsEditing(false)}
                        onSuccess={() => setIsEditing(false)}
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
                            <h3 className="mb-4 text-sm font-semibold text-gray-900">
                                처리 정보
                            </h3>

                            <div className="grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2">
                                <DetailItem
                                    label="공수"
                                    value={
                                        card.workHours != null
                                            ? `${card.workHours}시간`
                                            : "-"
                                    }
                                />

                                {card.status === "DONE" && (
                                    <DetailItem
                                        label="해결일시"
                                        value={
                                            card.resolvedAt
                                                ? formatDateTime(
                                                      card.resolvedAt
                                                  )
                                                : "-"
                                        }
                                    />
                                )}
                            </div>

                            <div className="mt-5">
                                <p className="mb-2 text-xs font-medium text-gray-500">
                                    처리 내용
                                </p>

                                <div className="min-h-24 whitespace-pre-wrap rounded-xl bg-gray-50 p-4 text-sm leading-6 text-gray-700">
                                    {card.resolutionNote ??
                                        "등록된 처리 내용이 없습니다."}
                                </div>
                            </div>
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
                onConfirm={handleDelete}
                onCancel={() => setIsDeleteModalOpen(false)}
            />
        </div>
    );
};

export default CardDetail;
