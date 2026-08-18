// 카드 보드 조회화면
"use client";

import React, { useState } from "react";
import { AlertCircle, Plus } from "lucide-react";
import { useEntityListQuery } from "@/lib/hooks/useEntity";
import type { Card, CardStatus } from "@/features/cards/types";
import { cardStatusLabel } from "@/features/cards/constants";
import MobileKanbanCard from "@/features/cards/components/MobileKanbanCard";
import KanbanColumn from "@/features/cards/components/KanbanColumn";
import { CardsCreate } from "@/features/cards/components/CardsCreate";

interface KanbanBoardProps {
    projectId: string;
}
type CardListResponse = Card[];

const columns: CardStatus[] = ["TODO", "IN_PROGRESS", "HOLD", "DONE"];

export const CardList = ({ projectId }: KanbanBoardProps) => {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false); // 카드 생성 모달 상태
    const [selectedStatus, setSelectedStatus] = useState<CardStatus>("TODO"); // 선택된 카드 상태
    const { data, isLoading, error } = useEntityListQuery<CardListResponse>(
        `/projects/${projectId}/cards`
    );

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
        <div className="flex min-h-full flex-col">
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
                                    className={` relative flex items-center gap-1.5 px-1 pb-3 text-sm transition
                                                ${
                                                    isActive
                                                        ? "font-semibold text-zinc-900"
                                                        : "text-zinc-400 hover:text-zinc-700"
                                                }
                                               `}>
                                    {cardStatusLabel[status]}
                                    <span
                                        className={` rounded-full px-1.5 py-0.5 text-[10px]
                                              ${
                                                  isActive
                                                      ? "bg-zinc-900 text-white"
                                                      : "bg-zinc-200 text-zinc-500"
                                              }
                                            `}>
                                        {count}
                                    </span>

                                    {/* 선택된 탭 밑줄 */}
                                    {isActive && (
                                        <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-zinc-900" />
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
                        <MobileKanbanCard key={card.id} card={card} />
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

            <div className="hidden md:block">
                <div className=" grid grid-cols-4 gap-2 lg:gap-3 ">
                    {columns.map((status) => {
                        const columnCards = cards.filter(
                            (card) => card.status === status
                        );

                        return (
                            <KanbanColumn
                                key={status}
                                status={status}
                                cards={columnCards}
                                onCreateCard={() => setIsCreateModalOpen(true)}
                            />
                        );
                    })}
                </div>
            </div>

            {/* 목록의 검색 조건을 유지한 채 생성 폼을 모달로 표시합니다. */}
            <CardsCreate
                projectId={projectId}
                open={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
            />
        </div>
    );
};

export default CardList;
