/** 견적 Mock 데이터 (In-Memory DB) */

import type { Quotation } from '@/features/quotation/types';

const INITIAL_QUOTATIONS: Quotation[] = [
  {
    id: '4f400d03-1000-4b57-a975-5cc1d39fe701', projectId: '11111111-0000-0000-0000-000000000022', revision: 4, status: 'DRAFT', amount: 138000000,
    description: '보험금 자동 심사 규칙 고도화와 운영 대시보드 범위를 반영한 4차 견적입니다.', issuedAt: null, validUntil: null, confirmedAt: null,
    createdAt: '2026-08-18T10:00:00', updatedAt: '2026-08-18T10:00:00',
  },
  {
    id: '4f400d03-1000-4b57-a975-5cc1d39fe702', projectId: '11111111-0000-0000-0000-000000000022', revision: 3, status: 'SENT', amount: 132000000,
    description: '고객 요청에 따라 OCR 문서 분류와 이상 청구 탐지 기능을 추가했습니다.', issuedAt: '2026-08-10', validUntil: '2026-08-31', confirmedAt: null,
    createdAt: '2026-08-09T15:30:00', updatedAt: '2026-08-10T09:00:00',
  },
  {
    id: '4f400d03-1000-4b57-a975-5cc1d39fe703', projectId: '11111111-0000-0000-0000-000000000022', revision: 2, status: 'REJECTED', amount: 145000000,
    description: '초기 구축 범위가 예산을 초과하여 범위 조정을 요청받은 견적입니다.', issuedAt: '2026-07-28', validUntil: '2026-08-11', confirmedAt: null,
    createdAt: '2026-07-27T14:00:00', updatedAt: '2026-08-02T11:20:00',
  },
  {
    id: '4f400d03-1000-4b57-a975-5cc1d39fe704', projectId: '11111111-0000-0000-0000-000000000022', revision: 1, status: 'SUPERSEDED', amount: 120000000,
    description: '보험금 청구 접수와 기본 심사 자동화를 대상으로 산정한 최초 견적입니다.', issuedAt: '2026-07-15', validUntil: '2026-07-29', confirmedAt: null,
    createdAt: '2026-07-14T09:00:00', updatedAt: '2026-07-27T14:00:00',
  },
  {
    id: '4f400d03-1000-4b57-a975-5cc1d39fe705', projectId: '11111111-0000-0000-0000-000000000003', revision: 3, status: 'SENT', amount: 98000000,
    description: 'iOS·Android 앱과 관리자 웹 구축을 포함한 최종 제안 견적입니다.', issuedAt: '2026-08-12', validUntil: '2026-09-11', confirmedAt: null,
    createdAt: '2026-08-11T13:00:00', updatedAt: '2026-08-12T09:30:00',
  },
  {
    id: '4f400d03-1000-4b57-a975-5cc1d39fe706', projectId: '11111111-0000-0000-0000-000000000003', revision: 2, status: 'SUPERSEDED', amount: 105000000,
    description: '디자인 시스템 구축 범위를 포함한 2차 견적입니다.', issuedAt: '2026-07-30', validUntil: '2026-08-13', confirmedAt: null,
    createdAt: '2026-07-29T10:00:00', updatedAt: '2026-08-11T13:00:00',
  },
  {
    id: '4f400d03-1000-4b57-a975-5cc1d39fe707', projectId: '11111111-0000-0000-0000-000000000006', revision: 2, status: 'DRAFT', amount: 186500000,
    description: '상담 시나리오 확대 및 관리자 통계 기능을 반영하고 있습니다.', issuedAt: null, validUntil: null, confirmedAt: null,
    createdAt: '2026-08-17T16:00:00', updatedAt: '2026-08-17T16:00:00',
  },
  {
    id: '4f400d03-1000-4b57-a975-5cc1d39fe708', projectId: '11111111-0000-0000-0000-000000000008', revision: 2, status: 'CONFIRMED', amount: 215000000,
    description: 'B2B 상품·주문·정산 모듈과 1년 유지보수를 포함합니다.', issuedAt: '2026-08-01', validUntil: '2026-08-31', confirmedAt: '2026-08-09T14:20:00',
    createdAt: '2026-07-31T11:00:00', updatedAt: '2026-08-09T14:20:00',
  },
  {
    id: '4f400d03-1000-4b57-a975-5cc1d39fe709', projectId: '11111111-0000-0000-0000-000000000012', revision: 1, status: 'SENT', amount: 74000000,
    description: '인터넷뱅킹 반응형 UI 개편과 접근성 인증 지원 견적입니다.', issuedAt: '2026-08-14', validUntil: '2026-08-28', confirmedAt: null,
    createdAt: '2026-08-13T17:00:00', updatedAt: '2026-08-14T09:00:00',
  },
  {
    id: '4f400d03-1000-4b57-a975-5cc1d39fe710', projectId: '11111111-0000-0000-0000-000000000020', revision: 1, status: 'DRAFT', amount: 1250000000,
    description: '차세대 TMS 전환을 위한 분석·설계·구축·안정화 전체 범위의 초안입니다.', issuedAt: null, validUntil: null, confirmedAt: null,
    createdAt: '2026-08-19T09:00:00', updatedAt: '2026-08-19T09:00:00',
  },
];

let mockQuotationDb: Quotation[] = [...INITIAL_QUOTATIONS];

export const mockQuotationStore = {
  getByProjectId(projectId: string): Quotation[] {
    return mockQuotationDb
      .filter((quotation) => quotation.projectId === projectId)
      .sort((a, b) => b.revision - a.revision);
  },

  create(quotation: Quotation): Quotation {
    mockQuotationDb = [quotation, ...mockQuotationDb];
    return quotation;
  },

  getById(id: string): Quotation | undefined {
    return mockQuotationDb.find((quotation) => quotation.id === id);
  },

  update(id: string, updated: Quotation): Quotation {
    mockQuotationDb = mockQuotationDb.map((quotation) =>
      quotation.id === id ? updated : quotation
    );
    return updated;
  },
};
