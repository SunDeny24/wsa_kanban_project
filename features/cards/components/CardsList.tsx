// 카드 보드 조회화면
"use client";

import React, { useState } from "react";
import { AlertCircle, Plus } from "lucide-react";
import type { DragEndEvent } from "@dnd-kit/react";
import { useEntityListQuery } from "@/lib/hooks/useEntity";
import { Card, CardStatus, cardStatusList } from "@/features/cards/types";
import { cardStatusLabel, statusStyle } from "@/features/cards/constants";
import MobileKanbanCard from "@/features/cards/components/MobileKanbanCard";
import KanbanColumn from "@/features/cards/components/KanbanColumn";
import { CardsCreate } from "@/features/cards/components/CardsCreate";
import CardDetail from "@/features/cards/components/CardDetail";
import { DragDropProvider } from "@dnd-kit/react";
import { useCardStatus } from "@/features/cards/hooks/useCardStatus";
import { ErrorModal } from "@/components/common/ErrorModal";
import { getErrorResponse } from "@/lib/api/error";
import type { ErrorResponse } from "@/types/api";

interface KanbanBoardProps {
    projectId: string;
}
type CardListResponse = Card[];

const columns: CardStatus[] = ["TODO", "IN_PROGRESS", "HOLD", "DONE"];

export const CardList = ({ projectId }: KanbanBoardProps) => {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false); // 카드 생성 모달 상태
    const [selectedStatus, setSelectedStatus] = useState<CardStatus>("TODO"); // 선택된 카드 상태
    const [selectedCardId, setSelectedCardId] = useState<string | null>(null); // 선택된 카드 ID
    const [statusError, setStatusError] = useState<ErrorResponse | null>(null); // DND 상태 변경 오류
    // 카드 목록 조회
    const { data, isLoading, error } = useEntityListQuery<CardListResponse>(
        `/projects/${projectId}/cards`
    );

    // 상태 변경 API 호출
    const { mutate: changeStatus } = useCardStatus(projectId);

    /**
     * DND 종료
     */
    const handleDragEnd = (event: DragEndEvent) => {
        // ESC 등으로 drag가 취소된 경우
        if (event.canceled) return;

        const { source, target } = event.operation; // source: 드래그 시작, target: 드래그 종료
        if (!source || !target) return; // 컬럼이 아닌 곳에 Drop한 경우
        const cardId = String(source.id); // 움직인 카드 ID
        const nextStatus = String(target.id) as CardStatus; // Drop한 컬럼 ID

        // 타깃이 유효한 상태인지 확인
        if (!cardStatusList.includes(nextStatus)) {
            return;
        }
        // 기존 카드 찾기
        const card = cards?.find((card) => card.id === cardId);
        if (!card) return;
        // 같은 컬럼이면 API 호출하지 않음
        if (card.status === nextStatus) {
            return;
        }
        //console.log("DND 상태 변경:", card.status, "→", nextStatus);

        changeStatus(
            {
                id: cardId,
                data: {
                    status: nextStatus,
                },
            },
            {
                onError: (error) => {
                    // 공통 에러 응답으로 변환해 사용자에게 상태 변경 실패를 안내
                    setStatusError(getErrorResponse(error));
                },
            }
        );
    };

    if (isLoading) {
        return (
            <div className="flex min-h-[500px] items-center justify-center">
                <p className="text-sm text-zinc-500">카드를 불러오는 중...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex min-h-[500px] items-center justify-center">
                <div className="flex items-center gap-2 text-sm text-red-500">
                    <AlertCircle className="h-4 w-4" />
                    카드를 불러오지 못했습니다.
                </div>
            </div>
        );
    }

    const cards = data ?? [];

    // 모바일에서는 선택된 상태의 카드만 보여줍니다.
    const selectedCards = cards.filter(
        (card) => card.status === selectedStatus
    );

    return (
        <div className="flex min-h-full flex-col ">
            {/* 상단 */}
            <div className="mb-5 flex items-center justify-between gap-3">
                <div>
                    <h1 className="text-lg font-semibold tracking-tight text-zinc-800">
                        칸반 보드
                    </h1>

                    <p className="mt-1 text-sm text-zinc-500 sm:block">
                        프로젝트 작업 카드를 상태별로 관리합니다.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(true)}
                    className=" inline-flex h-9 shrink-0 items-center gap-2
                                rounded-xl bg-zinc-900 px-3
                                text-sm font-medium text-white
                                shadow-sm transition
                                hover:bg-zinc-800
                                active:scale-[0.98]
                                sm:px-4
                              ">
                    <Plus className="h-4 w-4" />
                    <span className="hidden sm:inline">카드 생성</span>
                </button>
            </div>

            {/* =====================칸반========================== */}
            {/* ---------------------모바일------------------------ */}
            <div className="md:hidden">
                {/* 상태 탭 */}
                <div className="mb-4 overflow-x-auto border-b border-zinc-200">
                    <div className="flex min-w-max gap-5">
                        {columns.map((status) => {
                            const isActive = selectedStatus === status;

                            const count = cards.filter(
                                (card) => card.status === status
                            ).length;

                            return (
                                <button
                                    key={status}
                                    type="button"
                                    onClick={() => setSelectedStatus(status)}
                                    className={` relative flex items-center gap-1.5 px-1 pb-3
                                                text-sm transition
                                                ${
                                                    isActive
                                                        ? `font-semibold ${statusStyle[status].title}`
                                                        : "text-zinc-400 hover:text-zinc-700"
                                                }
                                            `}>
                                    {cardStatusLabel[status]}
                                    <span
                                        className={`
                                            rounded-full px-1.5 py-0.5 text-[10px]
                                            ${
                                                isActive
                                                    ? statusStyle[status].count
                                                    : "bg-zinc-200 text-zinc-500"
                                            }
                                        `}>
                                        {count}
                                    </span>

                                    {/* 선택된 탭 밑줄 */}
                                    {isActive && (
                                        <span
                                            className={` absolute inset-x-0 bottom-0 h-0.5 rounded-full
                                                ${statusStyle[status].indicator}
                                            `}
                                        />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* 선택된 컬럼 정보 */}
                <div className="mb-3 flex items-center justify-between">
                    <h2 className="text-sm font-semibold text-zinc-800">
                        {cardStatusLabel[selectedStatus]}
                    </h2>

                    <span className="text-xs text-zinc-400">
                        {selectedCards.length}개
                    </span>
                </div>

                {/* 모바일 카드 목록 */}
                <div className="flex flex-col gap-2">
                    {selectedCards.map((card) => (
                        <MobileKanbanCard
                            key={card.id}
                            card={card}
                            onClick={() => setSelectedCardId(card.id)}
                        />
                    ))}

                    {selectedCards.length === 0 && (
                        <div
                            className="
                flex h-28 items-center justify-center
                rounded-xl
                border border-dashed border-zinc-200
                bg-zinc-50
                text-xs text-zinc-400
              ">
                            카드가 없습니다.
                        </div>
                    )}
                </div>
            </div>

            {/* ---------------------태블릿 / PC ------------------------ */}
            <DragDropProvider onDragEnd={handleDragEnd}>
                <div className="hidden md:block">
                    <div className="grid w-full grid-cols-4 gap-2 lg:gap-3 ">
                        {columns.map((status) => {
                            const columnCards = cards.filter(
                                (card) => card.status === status
                            );

                            return (
                                <KanbanColumn
                                    key={status}
                                    status={status}
                                    cards={columnCards}
                                    onCreateCard={() =>
                                        setIsCreateModalOpen(true)
                                    }
                                    onCardClick={setSelectedCardId}
                                />
                            );
                        })}
                    </div>
                </div>
            </DragDropProvider>

            {/* 목록의 검색 조건을 유지한 생성폼 모달 */}
            <CardsCreate
                projectId={projectId}
                open={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
            />
            {/* 카드 상세 정보 모달 */}
            {selectedCardId && (
                <CardDetail
                    cardId={selectedCardId}
                    projectId={projectId}
                    onClose={() => setSelectedCardId(null)}
                />
            )}

            <ErrorModal
                open={!!statusError}
                message={statusError?.message}
                status={statusError?.status}
                onClose={() => setStatusError(null)}
            />
        </div>
    );
};

export default CardList;
