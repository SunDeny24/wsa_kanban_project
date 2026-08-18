// 카드 보드 조회화면
'use client';

import {AlertCircle, Plus} from 'lucide-react';

import { useEntityListQuery } from '@/lib/hooks/useEntity';

import type { Card, CardStatus } from '@/features/cards/types';
import KanbanColumn from "@/features/cards/components/KanbanColumn";
import React, {useState} from "react";
import {CardsCreate} from "@/features/cards/components/CardsCreate";

interface KanbanBoardProps {
    projectId: string;
}

type CardListResponse = Card[];

const columns: CardStatus[] = [
    'TODO',
    'IN_PROGRESS',
    'HOLD',
    'DONE',
];



export const CardList = ({ projectId }: KanbanBoardProps) => {

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const {
        data,
        isLoading,
        error,
    } = useEntityListQuery<CardListResponse>(
        `/projects/${projectId}/cards`,
    );

    if (isLoading) {
        return (
            <div className="flex min-h-[500px] items-center justify-center">
                <p className="text-sm text-zinc-500">
                    카드를 불러오는 중...
                </p>
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

    return (
        <div className="flex min-h-full flex-col">
            {/* 상단 */}
            <div className="mb-5 flex items-center justify-between">
                <div>
                    <h1 className="text-lg font-semibold tracking-tight text-zinc-800">
                        칸반 보드
                    </h1>

                    <p className="mt-1 text-sm text-zinc-500">
                        프로젝트 작업 카드를 상태별로 관리합니다.
                    </p>
                </div>

                <button
                    type="button"
                    className="
            inline-flex h-9 items-center gap-2
            rounded-xl bg-zinc-900 px-4
            text-sm font-medium text-white
            shadow-sm
            transition
            hover:bg-zinc-800
            active:scale-[0.98]
          "
                    onClick={() => setIsCreateModalOpen(true)}
                >
                    <Plus className="h-4 w-4" />
                    카드 생성
                </button>
            </div>

            {/* 칸반 */}
            <div className="overflow-x-auto pb-3">
                <div className="grid min-w-[1100px] grid-cols-4 gap-3">
                    {columns.map((status) => {
                        const columnCards = cards.filter(
                            (card) => card.status === status,
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