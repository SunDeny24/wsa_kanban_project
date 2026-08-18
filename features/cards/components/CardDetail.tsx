// 카드 상세보기

"use client";

import { useEntityQuery } from "@/lib/hooks/useEntity";
import type { Card } from "@/features/cards/types";
import { useEffect } from "react";

interface CardDetailProps {
    cardId: string;
    onClose: () => void;
}

export const CardDetail = ({ cardId, onClose }: CardDetailProps) => {
    // 단건 조회 API 호출
    const {
        data: card,
        isLoading,
        isError,
    } = useEntityQuery<Card>("/cards", cardId);

    // 확인용 log
    useEffect(() => {
        console.log("[CardDetail] cardId:", cardId);
    }, [cardId]);

    if (isLoading) {
        return <div>카드를 불러오는 중...</div>;
    }

    if (isError) {
        return <div>카드를 불러오지 못했습니다.</div>;
    }

    if (!card) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">{card.title}</h2>

                    <button
                        type="button"
                        onClick={onClose}
                        className="text-sm text-zinc-500 hover:text-zinc-900">
                        닫기
                    </button>
                </div>

                <div className="mt-5 space-y-2 text-sm">
                    <p>설명: {card.description ?? "-"}</p>
                    <p>상태: {card.status}</p>
                    <p>우선순위: {card.priorityType}</p>
                    <p>지원유형: {card.supportType}</p>
                    <p>요청자: {card.assigner ?? "-"}</p>
                    <p>담당자: {card.assignee ?? "-"}</p>
                    <p>공수: {card.workHours ?? "-"}시간</p>
                    <p>처리내용: {card.resolutionNote ?? "-"}</p>
                </div>
            </div>
        </div>
    );
};

export default CardDetail;
