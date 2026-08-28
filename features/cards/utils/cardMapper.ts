// 카드 단건 데이터를 카드 수정 요청 타입으로 변환
import { Card, CardUpdateForm } from "@/features/cards/types";

export const toCardUpdateRequest = (card: Card): CardUpdateForm => ({
    title: card.title,
    description: card.description ?? undefined,
    priorityType: card.priorityType,
    supportType: card.supportType ?? "NONE",
    assignee: card.assignee ?? undefined,
    workHours: card.workHours ?? undefined,
    resolutionNote: card.resolutionNote ?? undefined,
});
