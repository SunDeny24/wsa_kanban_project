import { CalendarDays, CircleUserRound } from "lucide-react";

import type { Card } from "@/features/cards/types";

import { formatDateTime } from "@/lib/utils/dateFormat";

import {
    priorityClassName,
    priorityLabel,
    supportTypeLabel,
} from "@/features/cards/constants";

interface KanbanCardProps {
    card: Card;
    onClick: () => void;
}

export const KanbanCard = ({ card, onClick }: KanbanCardProps) => {
    return (
        <button
            type="button"
            className="group w-full rounded-xl border border-black/[0.07] bg-white p-3 text-left
                       shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-all duration-150 hover:-translate-y-[1px] hover:shadow-[0_5px_15px_rgba(0,0,0,0.07)]"
            onClick={onClick}>
            {/* 제목 / 우선순위 */}
            <div className="flex items-start justify-between gap-3">
                <h3 className="line-clamp-2 text-sm font-medium leading-5 text-zinc-900 ">
                    {card.title}
                </h3>

                <span
                    className={` shrink-0 rounded-full border px-2 py-0.5 text-[9px] font-semibold ${priorityClassName[card.priorityType]} `}>
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
            <div className="mt-3 space-y-2 border-t border-zinc-100 pt-3">
                {/* 지원유형 / 담당자 */}
                <div className="flex min-w-0 flex-wrap items-center gap-2">
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
                    {card.supportType && card.supportType !== "NONE" && (
                        <span className=" inline-flex shrink-0 items-center rounded-md bg-zinc-100 px-2 py-1 text-[10px] font-medium text-zinc-600">
                            {supportTypeLabel[card.supportType]}
                        </span>
                    )}
                </div>

                {/* 발생일시 / 카드 ID */}
                <div className="flex min-w-0 items-center justify-between gap-2">
                    {card.occurredAt ? (
                        <div className="flex min-w-0 items-center gap-1">
                            <CalendarDays className="h-3.5 w-3.5 shrink-0 text-zinc-400" />

                            <span className="truncate text-[10px] text-zinc-400">
                                {formatDateTime(card.occurredAt)}
                            </span>
                        </div>
                    ) : (
                        <span />
                    )}

                    {/* 카드 ID */}
                    <span
                        className="shrink-0 font-mono text-[10px] text-zinc-400"
                        title={card.id}>
                        #{card.id.slice(0, 6)}
                    </span>
                </div>
            </div>
        </button>
    );
};

export default KanbanCard;
