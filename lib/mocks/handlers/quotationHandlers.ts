/** 견적 Mock API 핸들러 */

import type { Quotation } from '@/features/quotation/types';
import type { ErrorResponse } from '@/types/api';
import { mockProjectStore } from '@/lib/mocks/data/projects';
import { mockQuotationStore } from '@/lib/mocks/data/quotations';
import type { MockResponse } from './projectHandlers';

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
  const body: ErrorResponse = { timestamp: nowIso(), status, message, ...(fieldErrors ? { fieldErrors } : {}) };
  return { status, data: body };
}

export function handleGetProjectQuotations(projectId: string): MockResponse {
  if (!mockProjectStore.getById(projectId)) return errorResponse(404, `프로젝트를 찾을 수 없습니다. (id: ${projectId})`);
  return { status: 200, data: mockQuotationStore.getByProjectId(projectId) };
}

export interface CreateQuotationBody {
  amount?: unknown;
  description?: unknown;
  issuedAt?: unknown;
  validUntil?: unknown;
}

export function handleCreateQuotation(projectId: string, body: CreateQuotationBody | null): MockResponse {
  const project = mockProjectStore.getById(projectId);
  if (!project) return errorResponse(404, `프로젝트를 찾을 수 없습니다. (id: ${projectId})`);
  if (project.status !== 'QUOTATION') return errorResponse(400, '견적중인 프로젝트에만 새 견적을 생성할 수 있습니다.');

  const input = body ?? {};
  const fieldErrors: Record<string, string> = {};
  if (typeof input.amount !== 'number' || !Number.isFinite(input.amount) || input.amount < 0) fieldErrors.amount = '견적 금액은 0 이상의 숫자여야 합니다.';
  if (input.description != null && (typeof input.description !== 'string' || input.description.length > 2048)) fieldErrors.description = '설명은 2048자 이하의 문자열이어야 합니다.';
  if (input.issuedAt != null && typeof input.issuedAt !== 'string') fieldErrors.issuedAt = '발행일은 문자열이어야 합니다.';
  if (input.validUntil != null && typeof input.validUntil !== 'string') fieldErrors.validUntil = '유효기간은 문자열이어야 합니다.';
  if (Object.keys(fieldErrors).length) return errorResponse(400, '입력값이 올바르지 않습니다.', fieldErrors);

  const existing = mockQuotationStore.getByProjectId(projectId);
  const now = nowIso();

  // 새 리비전 생성 시 기존 최신 DRAFT/SENT는 서버 책임으로 대체 처리합니다.
  const latest = existing[0];
  if (latest && (latest.status === 'DRAFT' || latest.status === 'SENT')) {
    mockQuotationStore.update(latest.id, { ...latest, status: 'SUPERSEDED', updatedAt: now });
  }

  const quotation: Quotation = {
    id: generateUUID(), projectId, revision: (existing[0]?.revision ?? 0) + 1, status: 'DRAFT', amount: input.amount as number,
    description: input.description ? input.description as string : null,
    issuedAt: input.issuedAt ? input.issuedAt as string : null,
    validUntil: input.validUntil ? input.validUntil as string : null,
    confirmedAt: null, createdAt: now, updatedAt: now,
  };
  mockQuotationStore.create(quotation);
  return { status: 201, data: quotation };
}

export type QuotationAction = 'send' | 'confirm' | 'reject';

export function handleQuotationAction(id: string, action: QuotationAction): MockResponse {
  const quotation = mockQuotationStore.getById(id);
  if (!quotation) return errorResponse(404, `견적을 찾을 수 없습니다. (id: ${id})`);

  const expectedStatus = action === 'send' ? 'DRAFT' : 'SENT';
  if (quotation.status !== expectedStatus) {
    return errorResponse(409, '현재 견적 상태에서는 요청한 작업을 처리할 수 없습니다.');
  }

  const now = nowIso();
  const status = action === 'send' ? 'SENT' : action === 'confirm' ? 'CONFIRMED' : 'REJECTED';
  const updated = mockQuotationStore.update(id, {
    ...quotation,
    status,
    confirmedAt: action === 'confirm' ? now : quotation.confirmedAt,
    updatedAt: now,
  });

  if (action === 'confirm') {
    const project = mockProjectStore.getById(quotation.projectId);
    if (project) {
      mockProjectStore.update(project.id, { ...project, status: 'ACTIVE', updatedAt: now });
    }
  }

  return { status: 200, data: updated };
}
