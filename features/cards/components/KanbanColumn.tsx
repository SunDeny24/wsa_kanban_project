// 칸반 컬럼 컴포넌트

import { Plus } from "lucide-react";
import type { Card, CardStatus } from "@/features/cards/types";
import { KanbanCard } from "./KanbanCard";
import { cardStatusLabel } from "@/features/cards/constants";
import { statusStyle } from "@/features/cards/constants";

interface KanbanColumnProps {
    status: CardStatus;
    cards: Card[];
    onCreateCard: () => void;
    onCardClick: (cardId: string) => void;
}

export const KanbanColumn = ({
    status,
    cards,
    onCreateCard,
    onCardClick,
}: KanbanColumnProps) => {
    const style = statusStyle[status];

    return (
        <section
            className={`flex min-h-[620px] flex-col rounded-2xl border
            ${style.background}
            ${style.border}
          `}>
            {/* 컬럼 헤더 */}
            <div className="flex h-12 items-center gap-2 px-4">
                {/* 컬럼 제목 */}
                <h2 className={`text-xs font-semibold ${style.title}`}>
                    {cardStatusLabel[status]}
                </h2>
                {/* 카드 수 */}
                <span
                    className={` inline-flex min-w-6 items-center justify-center
                                 rounded-full px-2 py-0.5
                                 text-[11px] font-semibold
                    ${style.count}
                  `}>
                    {cards.length}
                </span>
            </div>

            {/* 카드 영역 */}
            <div className="flex flex-1 flex-col gap-2 px-2 pb-2">
                {cards.map((card) => (
                    <KanbanCard
                        key={card.id}
                        card={card}
                        onClick={() => onCardClick(card.id)}
                    />
                ))}

                {cards.length === 0 && (
                    <div
                        className="flex h-24 items-center justify-center rounded-xl
                                  border border-dashed border-black/10 bg-white/40
                                  text-xs text-zinc-400 ">
                        카드가 없습니다.
                    </div>
                )}

                {/* 생성 API는 항상 투두로 생성하므로 투두에서만 표시 */}
                {status === "TODO" && (
                    <button
                        type="button"
                        onClick={onCreateCard}
                        className="
                              flex h-10 items-center justify-center gap-1.5
                              rounded-xl border border-dashed border-black/10
                              bg-white/40
                              text-xs font-medium text-zinc-500
                              transition
                              hover:bg-white/70
                              hover:text-zinc-800
                            ">
                        <Plus className="h-3.5 w-3.5" />새 카드
                    </button>
                )}
            </div>
        </section>
    );
};

export default KanbanColumn;
