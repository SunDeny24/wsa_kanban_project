import { CircleUserRound } from "lucide-react";

import type { Card } from "@/features/cards/types";

import { priorityClassName, priorityLabel } from "@/features/cards/constants";

interface MobileKanbanCardProps {
    card: Card;
    onClick?: () => void;
}

export const MobileKanbanCard = ({ card, onClick }: MobileKanbanCardProps) => {
    return (
        <button
            type="button"
            className="
                w-full rounded-xl
                border border-black/[0.07]
                bg-white
                px-3 py-3
                text-left
                shadow-[0_1px_2px_rgba(0,0,0,0.04)]
                transition
                active:scale-[0.99]
              "
            onClick={onClick}>
            {/* 제목 / 우선순위 */}
            <div className="flex items-start justify-between gap-3">
                <h3 className=" min-w-0 flex-1 truncate text-sm font-medium text-zinc-900 ">
                    {card.title}
                </h3>

                <span
                    className={` shrink-0 rounded-full border px-2 py-0.5 text-[9px] font-semibold
                    ${priorityClassName[card.priorityType]}
                  `}>
                    {priorityLabel[card.priorityType]}
                </span>
            </div>
            {/* 상세내용 */}
            {card.description && (
                <p className="mt-1 text-[11px] text-zinc-500 line-clamp-2">
                    {card.description}
                </p>
            )}

            {/* 담당자 */}
            {card.assignee && (
                <div className="mt-2 flex min-w-0 items-center gap-1.5">
                    <CircleUserRound className="h-3.5 w-3.5 shrink-0 text-zinc-400" />

                    <span className="truncate text-[11px] text-zinc-500">
                        {card.assignee}
                    </span>
                </div>
            )}
        </button>
    );
};

export default MobileKanbanCard;
