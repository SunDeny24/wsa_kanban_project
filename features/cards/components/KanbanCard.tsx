import { CircleUserRound } from "lucide-react";

import type { Card } from "@/features/cards/types";
import { useDraggable } from "@dnd-kit/react";
import {
    priorityStyle,
    priorityLabel,
    supportTypeLabel,
} from "@/features/cards/constants";

interface KanbanCardProps {
    card: Card;
    onClick: () => void;
}

export const KanbanCard = ({ card, onClick }: KanbanCardProps) => {
    // 드래그 훅 사용해서 드래그 가능하게 만들기
    const { ref, isDragging } = useDraggable({
        id: card.id,
        type: "CARD", //추후 구분 위해 타입 지정
        data: {
            status: card.status,
        },
    });

    return (
        <div
            ref={ref}
            role="button"
            tabIndex={0}
            className={` group relative w-full rounded-xl border border-black/[0.07] bg-white p-3 text-left select-none transition-all duration-200
                        ${
                            isDragging
                                ? `
                                    z-50 cursor-grabbing 
                                    scale-[1.025] rotate-[1deg]
                                    border-black/[0.08] shadow-[0_20px_45px_rgba(0,0,0,0.16),0_4px_12px_rgba(0,0,0,0.08)]
                                    ring-1 ring-black/[0.03]
                                  `
                                : `
                                    cursor-grab
                                    shadow-[0_2px_8px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)]
                                    hover:-translate-y-[2px]
                                    hover:border-black/[0.09]
                                    hover:shadow-[0_10px_25px_rgba(0,0,0,0.09),0_3px_8px_rgba(0,0,0,0.05)]
                                  `
                        }
                    `}
            onClick={() => {
                if (isDragging) return;
                onClick();
            }}>
            {/* 제목 / 우선순위 */}
            <div className="flex items-start justify-between gap-3">
                <h3 className="line-clamp-2 text-sm font-medium leading-5 text-zinc-900 ">
                    {card.title}
                </h3>
                <span
                    className={`shrink-0 rounded-full border px-2 py-0.5 text-[9px] font-semibold 
                            ${priorityStyle[card.priorityType].background} 
                            ${priorityStyle[card.priorityType].text}  
                            ${priorityStyle[card.priorityType].border}
                            `}>
                    {priorityLabel[card.priorityType]}
                </span>
            </div>

            {/* 설명 */}
            {card.description && (
                <p className=" mt-2 line-clamp-2 text-xs leading-5 text-zinc-500 ">
                    {card.description}
                </p>
            )}

            {/* 카드 하단 */}
            {(card.assignee ||
                (card.supportType && card.supportType !== "NONE")) && (
                <>
                    <div className="mt-3 space-y-2 border-t border-zinc-100 pt-3">
                        {/* 지원유형 / 담당자 */}
                        <div className="flex min-w-0 flex-wrap items-center justify-between gap-2">
                            {/* 담당자 */}
                            {card.assignee && (
                                <div className="flex min-w-0 items-center gap-1">
                                    <CircleUserRound className="h-4 w-4 shrink-0 text-zinc-400" />

                                    <span
                                        className="truncate text-[11px] font-medium text-zinc-600"
                                        title={card.assignee}>
                                        {card.assignee}
                                    </span>
                                </div>
                            )}

                            {/* 지원유형 */}
                            {card.supportType &&
                                card.supportType !== "NONE" && (
                                    <span className=" inline-flex shrink-0 items-center rounded-md bg-zinc-100 px-2 py-1 text-[10px] font-medium text-zinc-600">
                                        {supportTypeLabel[card.supportType]}
                                    </span>
                                )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default KanbanCard;
