/**
 * 카드 Mock 데이터 (In-Memory DB)
 * - 개발 서버 재시작 시 초기 데이터로 리셋됨
 * - PATCH 작업은 이 모듈의 mockCardDb 배열에 직접 반영됨
 */

import type { Card } from '@/features/cards/types';

const PROJECT_ID = '11111111-0000-0000-0000-000000000001';

const INITIAL_CARDS: Card[] = [
  {
    id: '3e300c02-0f0f-4a46-b864-4bb0c28fe621', projectId: PROJECT_ID, itemId: '22222222-0000-0000-0000-000000000001',
    title: '로그인 오류 확인', description: '간헐적으로 로그인 후 대시보드로 이동하지 않는 현상을 확인합니다.', status: 'TODO', priorityType: 'URGENT', supportType: 'REMOTE',
    assigner: '김민지', assignee: '박준호', occurredAt: '2026-08-17T09:20:00', resolvedAt: null, workHours: 0, resolutionNote: null,
    createdAt: '2026-08-17T09:30:00', updatedAt: '2026-08-17T09:30:00',
  },
  {
    id: '3e300c02-0f0f-4a46-b864-4bb0c28fe622', projectId: PROJECT_ID, itemId: null,
    title: '배포 환경 설정', description: '운영 환경의 환경 변수와 헬스 체크 경로를 점검합니다.', status: 'TODO', priorityType: 'HIGH', supportType: 'NONE',
    assigner: '이서연', assignee: '최현우', occurredAt: null, resolvedAt: null, workHours: 2, resolutionNote: null,
    createdAt: '2026-08-16T13:00:00', updatedAt: '2026-08-16T13:00:00',
  },
  {
    id: '3e300c02-0f0f-4a46-b864-4bb0c28fe623', projectId: PROJECT_ID, itemId: '22222222-0000-0000-0000-000000000003',
    title: '관리자 권한 확인', description: '신규 관리자 계정에서 메뉴 접근 권한이 누락되는지 확인합니다.', status: 'TODO', priorityType: 'MEDIUM', supportType: 'PHONE',
    assigner: '정수빈', assignee: null, occurredAt: '2026-08-18T10:10:00', resolvedAt: null, workHours: 0, resolutionNote: '',
    createdAt: '2026-08-18T10:20:00', updatedAt: '2026-08-18T10:20:00',
  },
  {
    id: '3e300c02-0f0f-4a46-b864-4bb0c28fe624', projectId: PROJECT_ID, itemId: null,
    title: '고객사 원격 지원', description: '메인 화면 설정 방법을 원격으로 안내하고 브라우저 환경을 확인합니다.', status: 'IN_PROGRESS', priorityType: 'HIGH', supportType: 'REMOTE',
    assigner: '한지훈', assignee: '김민지', occurredAt: '2026-08-18T14:00:00', resolvedAt: null, workHours: 1.5, resolutionNote: null,
    createdAt: '2026-08-18T14:10:00', updatedAt: '2026-08-19T09:00:00',
  },
  {
    id: '3e300c02-0f0f-4a46-b864-4bb0c28fe625', projectId: PROJECT_ID, itemId: '22222222-0000-0000-0000-000000000005',
    title: '데이터 조회 오류', description: '기간 검색 시 일부 데이터가 누락되는 쿼리를 분석합니다.', status: 'IN_PROGRESS', priorityType: 'URGENT', supportType: 'ONSITE',
    assigner: '오세훈', assignee: '최현우', occurredAt: '2026-08-15T11:30:00', resolvedAt: null, workHours: 4, resolutionNote: '재현 조건을 확인하고 쿼리 실행 계획을 분석 중입니다.',
    createdAt: '2026-08-15T11:40:00', updatedAt: '2026-08-19T08:30:00',
  },
  {
    id: '3e300c02-0f0f-4a46-b864-4bb0c28fe626', projectId: PROJECT_ID, itemId: null,
    title: '고객 요청사항 반영', description: '프로젝트 상세 화면에 계약 담당자 정보를 추가합니다.', status: 'IN_PROGRESS', priorityType: 'LOW', supportType: 'NONE',
    assigner: '이서연', assignee: '박준호', occurredAt: null, resolvedAt: null, workHours: 3, resolutionNote: '',
    createdAt: '2026-08-14T15:00:00', updatedAt: '2026-08-18T17:20:00',
  },
  {
    id: '3e300c02-0f0f-4a46-b864-4bb0c28fe627', projectId: PROJECT_ID, itemId: '22222222-0000-0000-0000-000000000007',
    title: '견적서 출력 오류', description: 'PDF 견적서에서 긴 품목명이 잘리는 문제의 디자인 확인이 필요합니다.', status: 'HOLD', priorityType: 'HIGH', supportType: 'PHONE',
    assigner: '정수빈', assignee: '김민지', occurredAt: '2026-08-12T16:00:00', resolvedAt: null, workHours: 2.5, resolutionNote: '고객사에서 수정 양식을 전달받은 뒤 진행 예정입니다.',
    createdAt: '2026-08-12T16:10:00', updatedAt: '2026-08-16T12:00:00',
  },
  {
    id: '3e300c02-0f0f-4a46-b864-4bb0c28fe628', projectId: PROJECT_ID, itemId: null,
    title: '외부 API 연동 일정 확인', description: '결제사 테스트 API 발급 일정이 확정될 때까지 보류합니다.', status: 'HOLD', priorityType: 'MEDIUM', supportType: 'NONE',
    assigner: '한지훈', assignee: null, occurredAt: null, resolvedAt: null, workHours: 1, resolutionNote: null,
    createdAt: '2026-08-11T09:00:00', updatedAt: '2026-08-13T10:30:00',
  },
  {
    id: '3e300c02-0f0f-4a46-b864-4bb0c28fe629', projectId: PROJECT_ID, itemId: '22222222-0000-0000-0000-000000000009',
    title: '모바일 레이아웃 검토', description: '태블릿 해상도 시안 확정 대기 중입니다.', status: 'HOLD', priorityType: 'LOW', supportType: 'ONSITE',
    assigner: '오세훈', assignee: '박준호', occurredAt: '2026-08-10T13:30:00', resolvedAt: null, workHours: 1.5, resolutionNote: '',
    createdAt: '2026-08-10T13:40:00', updatedAt: '2026-08-12T09:10:00',
  },
  {
    id: '3e300c02-0f0f-4a46-b864-4bb0c28fe630', projectId: PROJECT_ID, itemId: null,
    title: '검색 속도 개선', description: '프로젝트 목록 검색 쿼리에 인덱스를 적용했습니다.', status: 'DONE', priorityType: 'MEDIUM', supportType: 'REMOTE',
    assigner: '김민지', assignee: '최현우', occurredAt: '2026-08-05T10:00:00', resolvedAt: '2026-08-08T16:40:00', workHours: 6, resolutionNote: '복합 인덱스 적용 후 평균 응답 시간이 40% 감소했습니다.',
    createdAt: '2026-08-05T10:10:00', updatedAt: '2026-08-08T16:40:00',
  },
  {
    id: '3e300c02-0f0f-4a46-b864-4bb0c28fe631', projectId: PROJECT_ID, itemId: '22222222-0000-0000-0000-000000000011',
    title: '이메일 알림 문구 수정', description: '프로젝트 초대 메일의 안내 문구와 링크를 수정했습니다.', status: 'DONE', priorityType: 'LOW', supportType: 'NONE',
    assigner: '이서연', assignee: '박준호', occurredAt: null, resolvedAt: '2026-08-07T11:20:00', workHours: 1, resolutionNote: '기획 검수 후 운영 환경에 반영했습니다.',
    createdAt: '2026-08-06T09:00:00', updatedAt: '2026-08-07T11:20:00',
  },
  {
    id: '3e300c02-0f0f-4a46-b864-4bb0c28fe632', projectId: PROJECT_ID, itemId: null,
    title: '파일 업로드 제한 적용', description: '첨부 파일 크기와 확장자 검증을 추가했습니다.', status: 'DONE', priorityType: 'HIGH', supportType: 'PHONE',
    assigner: '정수빈', assignee: '김민지', occurredAt: '2026-08-03T14:00:00', resolvedAt: '2026-08-06T18:00:00', workHours: 5.5, resolutionNote: '',
    createdAt: '2026-08-03T14:10:00', updatedAt: '2026-08-06T18:00:00',
  },
];

let mockCardDb: Card[] = [...INITIAL_CARDS];

export const mockCardStore = {
  getAll(): Card[] {
    return mockCardDb;
  },

  getById(id: string): Card | undefined {
    return mockCardDb.find((card) => card.id === id);
  },

  create(card: Card): Card {
    mockCardDb = [card, ...mockCardDb];
    return card;
  },

  update(id: string, updated: Card): Card {
    mockCardDb = mockCardDb.map((card) => (card.id === id ? updated : card));
    return updated;
  },
};
