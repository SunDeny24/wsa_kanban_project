/** 카드 Mock API 핸들러 */

import type { Card, CardStatus, PriorityType, SupportType } from '@/features/cards/types';
import type { ErrorResponse } from '@/types/api';
import { mockCardStore } from '@/lib/mocks/data/cards';
import { mockProjectStore } from '@/lib/mocks/data/projects';
import type { MockResponse } from './projectHandlers';

const CARD_STATUSES: CardStatus[] = ['TODO', 'IN_PROGRESS', 'HOLD', 'DONE'];
const PRIORITY_TYPES: PriorityType[] = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];
const SUPPORT_TYPES: SupportType[] = ['REMOTE', 'ONSITE', 'PHONE', 'NONE'];

function nowIso(): string {
  return new Date().toISOString();
}

function generateUUID(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (character) => {
    const random = (Math.random() * 16) | 0;
    const value = character === 'x' ? random : (random & 0x3) | 0x8;
    return value.toString(16);
  });
}

function errorResponse(status: number, message: string, fieldErrors?: Record<string, string>): MockResponse {
  const body: ErrorResponse = {
    timestamp: nowIso(),
    status,
    message,
    ...(fieldErrors ? { fieldErrors } : {}),
  };
  return { status, data: body };
}

export function handleGetProjectCards(projectId: string, status?: string): MockResponse {
  if (!mockProjectStore.getById(projectId)) {
    return errorResponse(404, `프로젝트를 찾을 수 없습니다. (id: ${projectId})`);
  }
  if (status && !CARD_STATUSES.includes(status as CardStatus)) {
    return errorResponse(400, `유효하지 않은 status 값입니다: ${status}`);
  }

  const cards = mockCardStore.getAll().filter((card) => (
    card.projectId === projectId && (!status || card.status === status)
  ));
  return { status: 200, data: cards };
}

export interface CreateCardBody {
  itemId?: unknown;
  title?: unknown;
  description?: unknown;
  priorityType?: unknown;
  supportType?: unknown;
  assigner?: unknown;
  assignee?: unknown;
  occurredAt?: unknown;
}

export function handleCreateCard(projectId: string, body: CreateCardBody | null): MockResponse {
  if (!mockProjectStore.getById(projectId)) {
    return errorResponse(404, `프로젝트를 찾을 수 없습니다. (id: ${projectId})`);
  }

  const input = body ?? {};
  const fieldErrors: Record<string, string> = {};
  if (typeof input.title !== 'string' || !input.title.trim()) fieldErrors.title = '카드 제목은 필수입니다.';
  else if (input.title.length > 200) fieldErrors.title = '카드 제목은 200자 이하여야 합니다.';
  if (input.description != null && (typeof input.description !== 'string' || input.description.length > 4096)) fieldErrors.description = '설명은 4096자 이하의 문자열이어야 합니다.';
  if (typeof input.priorityType !== 'string' || !PRIORITY_TYPES.includes(input.priorityType as PriorityType)) fieldErrors.priorityType = '유효한 우선순위는 LOW, MEDIUM, HIGH, URGENT입니다.';
  if (typeof input.supportType !== 'string' || !SUPPORT_TYPES.includes(input.supportType as SupportType)) fieldErrors.supportType = '유효한 지원 유형은 REMOTE, ONSITE, PHONE, NONE입니다.';
  if (input.itemId != null && typeof input.itemId !== 'string') fieldErrors.itemId = '관련 아이템 ID는 문자열이어야 합니다.';
  if (input.assigner != null && typeof input.assigner !== 'string') fieldErrors.assigner = '요청자는 문자열이어야 합니다.';
  if (input.assignee != null && typeof input.assignee !== 'string') fieldErrors.assignee = '담당자는 문자열이어야 합니다.';
  if (input.occurredAt != null && typeof input.occurredAt !== 'string') fieldErrors.occurredAt = '이슈 발생 일시는 문자열이어야 합니다.';
  if (Object.keys(fieldErrors).length) return errorResponse(400, '입력값이 올바르지 않습니다.', fieldErrors);

  const now = nowIso();
  const card: Card = {
    id: generateUUID(),
    projectId,
    itemId: input.itemId ? input.itemId as string : null,
    title: (input.title as string).trim(),
    description: input.description ? input.description as string : null,
    status: 'TODO',
    priorityType: input.priorityType as PriorityType,
    supportType: input.supportType as SupportType,
    assigner: input.assigner ? input.assigner as string : null,
    assignee: input.assignee ? input.assignee as string : null,
    occurredAt: input.occurredAt ? input.occurredAt as string : now,
    resolvedAt: null,
    workHours: 0,
    resolutionNote: null,
    createdAt: now,
    updatedAt: now,
  };
  mockCardStore.create(card);
  return { status: 201, data: card };
}

export function handleGetCardById(id: string): MockResponse {
  const card = mockCardStore.getById(id);
  return card
    ? { status: 200, data: card }
    : errorResponse(404, `카드를 찾을 수 없습니다. (id: ${id})`);
}

export interface UpdateCardBody {
  title?: unknown;
  description?: unknown;
  priorityType?: unknown;
  supportType?: unknown;
  assignee?: unknown;
  workHours?: unknown;
  resolutionNote?: unknown;
}

export function handleUpdateCard(id: string, body: UpdateCardBody | null): MockResponse {
  const existing = mockCardStore.getById(id);
  if (!existing) return errorResponse(404, `카드를 찾을 수 없습니다. (id: ${id})`);

  const input = body ?? {};
  const fieldErrors: Record<string, string> = {};
  if (typeof input.title !== 'string' || !input.title.trim()) fieldErrors.title = '카드 제목은 필수입니다.';
  else if (input.title.length > 200) fieldErrors.title = '카드 제목은 200자 이하여야 합니다.';
  if (input.description != null && (typeof input.description !== 'string' || input.description.length > 4096)) fieldErrors.description = '설명은 4096자 이하의 문자열이어야 합니다.';
  if (typeof input.priorityType !== 'string' || !PRIORITY_TYPES.includes(input.priorityType as PriorityType)) fieldErrors.priorityType = '유효한 우선순위는 LOW, MEDIUM, HIGH, URGENT입니다.';
  if (typeof input.supportType !== 'string' || !SUPPORT_TYPES.includes(input.supportType as SupportType)) fieldErrors.supportType = '유효한 지원 유형은 REMOTE, ONSITE, PHONE, NONE입니다.';
  if (input.assignee != null && typeof input.assignee !== 'string') fieldErrors.assignee = '담당자는 문자열이어야 합니다.';
  if (input.workHours != null && (typeof input.workHours !== 'number' || !Number.isFinite(input.workHours) || input.workHours < 0)) fieldErrors.workHours = '공수는 0 이상의 숫자여야 합니다.';
  if (input.resolutionNote != null && (typeof input.resolutionNote !== 'string' || input.resolutionNote.length > 4096)) fieldErrors.resolutionNote = '처리 내용은 4096자 이하의 문자열이어야 합니다.';
  if (Object.keys(fieldErrors).length) return errorResponse(400, '입력값이 올바르지 않습니다.', fieldErrors);

  const updated: Card = {
    ...existing,
    title: (input.title as string).trim(),
    description: input.description == null ? null : (input.description as string),
    priorityType: input.priorityType as PriorityType,
    supportType: input.supportType as SupportType,
    assignee: input.assignee == null ? null : (input.assignee as string),
    workHours: input.workHours == null ? null : (input.workHours as number),
    resolutionNote: input.resolutionNote == null ? null : (input.resolutionNote as string),
    updatedAt: nowIso(),
  };
  mockCardStore.update(id, updated);
  return { status: 200, data: updated };
}

export interface UpdateCardStatusBody {
  status?: unknown;
  memo?: unknown;
}

export function handleUpdateCardStatus(id: string, body: UpdateCardStatusBody | null): MockResponse {
  const existing = mockCardStore.getById(id);
  if (!existing) return errorResponse(404, `카드를 찾을 수 없습니다. (id: ${id})`);

  const status = body?.status;
  if (typeof status !== 'string' || !CARD_STATUSES.includes(status as CardStatus)) {
    return errorResponse(400, `유효하지 않은 status 값입니다: ${String(status)}`);
  }
  if (body?.memo != null && typeof body.memo !== 'string') {
    return errorResponse(400, '입력값이 올바르지 않습니다.', { memo: '메모는 문자열이어야 합니다.' });
  }
  if (existing.status === status) return { status: 200, data: existing };

  const updated: Card = {
    ...existing,
    status: status as CardStatus,
    resolvedAt: status === 'DONE' ? nowIso() : null,
    updatedAt: nowIso(),
  };
  mockCardStore.update(id, updated);
  return { status: 200, data: updated };
}
