/**
 * lib/mocks/data/projects.ts
 *
 * 프로젝트 Mock 데이터 (In-Memory DB)
 * - 개발 서버 재시작 시 초기 데이터로 리셋됨
 * - CRUD 작업은 이 모듈의 mockProjectDb 배열에 직접 반영됨
 */

import { Project } from '@/features/project/types';

// ─── 초기 Mock 데이터 (25개) ─────────────────────────────────────────────────
//
// 다음 케이스를 골고루 포함:
//   - QUOTATION / ACTIVE / ARCHIVED 상태
//   - 동일 고객사의 여러 프로젝트
//   - 서로 다른 고객사
//   - 비슷한 프로젝트명 / 긴 프로젝트명
//   - description 없는 데이터 / 긴 description 데이터
//   - startDate/endDate 있는 것 / 없는 것
//   - createdAt이 서로 달라 정렬 테스트 가능

const INITIAL_PROJECTS: Project[] = [
  {
    id: '11111111-0000-0000-0000-000000000001',
    name: '웹사이트 리뉴얼 프로젝트',
    description: '기존 레거시 홈페이지를 Next.js 기반으로 전면 개편하고 디자인 시스템을 신규 구축하는 프로젝트입니다.',
    customer: '삼성전자',
    status: 'ACTIVE',
    startDate: '2026-01-15',
    endDate: '2026-06-30',
    createdAt: '2026-01-10T09:00:00',
    updatedAt: '2026-01-10T09:00:00',
  },
  {
    id: '11111111-0000-0000-0000-000000000002',
    name: 'ERP 시스템 고도화',
    description: null,
    customer: '삼성전자',
    status: 'ACTIVE',
    startDate: '2026-02-01',
    endDate: '2026-12-31',
    createdAt: '2026-01-20T10:00:00',
    updatedAt: '2026-01-20T10:00:00',
  },
  {
    id: '11111111-0000-0000-0000-000000000003',
    name: '모바일 앱 개발 - iOS/Android',
    description: '크로스플랫폼 기반의 모바일 앱을 React Native로 개발합니다. iOS 14 이상, Android 10 이상 지원.',
    customer: '카카오페이',
    status: 'QUOTATION',
    startDate: null,
    endDate: null,
    createdAt: '2026-02-05T11:00:00',
    updatedAt: '2026-02-05T11:00:00',
  },
  {
    id: '11111111-0000-0000-0000-000000000004',
    name: '데이터 분석 플랫폼 구축',
    description: '실시간 대용량 데이터 수집 및 시각화 플랫폼을 구축합니다. Kafka, Spark, Elasticsearch를 활용한 데이터 파이프라인 설계 포함.',
    customer: 'LG CNS',
    status: 'ACTIVE',
    startDate: '2025-10-01',
    endDate: '2026-03-31',
    createdAt: '2025-09-15T14:00:00',
    updatedAt: '2026-01-05T09:00:00',
  },
  {
    id: '11111111-0000-0000-0000-000000000005',
    name: '클라우드 인프라 마이그레이션',
    description: null,
    customer: 'LG CNS',
    status: 'ARCHIVED',
    startDate: '2024-06-01',
    endDate: '2025-02-28',
    createdAt: '2024-05-20T09:00:00',
    updatedAt: '2025-03-01T10:00:00',
  },
  {
    id: '11111111-0000-0000-0000-000000000006',
    name: 'AI 기반 고객 서비스 챗봇 개발',
    description: 'LLM API를 활용한 고객 서비스 자동화 챗봇을 개발합니다. 시나리오 설계, 모델 파인튜닝, 관리자 대시보드 포함.',
    customer: '현대자동차',
    status: 'QUOTATION',
    startDate: null,
    endDate: null,
    createdAt: '2026-03-01T09:00:00',
    updatedAt: '2026-03-01T09:00:00',
  },
  {
    id: '11111111-0000-0000-0000-000000000007',
    name: '스마트 공장 MES 시스템',
    description: '제조실행시스템(MES) 구축 프로젝트. 생산계획, 공정관리, 품질관리, 설비관리 모듈 포함.',
    customer: '현대자동차',
    status: 'ACTIVE',
    startDate: '2025-12-01',
    endDate: '2026-11-30',
    createdAt: '2025-11-10T10:00:00',
    updatedAt: '2025-12-05T11:00:00',
  },
  {
    id: '11111111-0000-0000-0000-000000000008',
    name: '전자상거래 플랫폼 개발',
    description: '중소기업 대상 B2B 전자상거래 플랫폼 신규 개발. 상품관리, 주문관리, 정산 시스템 포함.',
    customer: 'SK텔레콤',
    status: 'QUOTATION',
    startDate: null,
    endDate: null,
    createdAt: '2026-03-15T13:00:00',
    updatedAt: '2026-03-15T13:00:00',
  },
  {
    id: '11111111-0000-0000-0000-000000000009',
    name: '통합 관제 시스템 고도화 및 유지보수 계약',
    description: '기존 운영 중인 통합 관제 시스템의 성능 개선 및 신규 기능 추가. 24시간 365일 모니터링 대응 체계 포함.',
    customer: 'SK텔레콤',
    status: 'ACTIVE',
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    createdAt: '2025-12-20T09:00:00',
    updatedAt: '2026-01-02T10:00:00',
  },
  {
    id: '11111111-0000-0000-0000-000000000010',
    name: '핀테크 결제 모듈 개발',
    description: null,
    customer: '카카오페이',
    status: 'ARCHIVED',
    startDate: '2024-09-01',
    endDate: '2025-04-30',
    createdAt: '2024-08-01T09:00:00',
    updatedAt: '2025-05-10T14:00:00',
  },
  {
    id: '11111111-0000-0000-0000-000000000011',
    name: '웹 접근성 개선 프로젝트',
    description: 'WCAG 2.1 AA 기준에 맞춰 기존 서비스의 웹 접근성을 전면 개선합니다.',
    customer: '국민은행',
    status: 'ACTIVE',
    startDate: '2026-02-15',
    endDate: '2026-05-31',
    createdAt: '2026-02-01T09:00:00',
    updatedAt: '2026-02-10T11:00:00',
  },
  {
    id: '11111111-0000-0000-0000-000000000012',
    name: '인터넷뱅킹 UI/UX 리뉴얼',
    description: '모바일 우선 설계 기반으로 인터넷뱅킹 서비스의 UI/UX를 전면 개편합니다. 사용자 테스트 및 접근성 검수 포함.',
    customer: '국민은행',
    status: 'QUOTATION',
    startDate: null,
    endDate: null,
    createdAt: '2026-03-20T10:00:00',
    updatedAt: '2026-03-20T10:00:00',
  },
  {
    id: '11111111-0000-0000-0000-000000000013',
    name: 'SCM 공급망 관리 시스템',
    description: null,
    customer: 'LG CNS',
    status: 'QUOTATION',
    startDate: null,
    endDate: null,
    createdAt: '2026-04-01T09:00:00',
    updatedAt: '2026-04-01T09:00:00',
  },
  {
    id: '11111111-0000-0000-0000-000000000014',
    name: 'HR 인사관리 시스템 개발',
    description: '임직원 인사정보, 근태관리, 급여계산, 성과평가를 통합 관리하는 HR 시스템을 개발합니다.',
    customer: 'KT',
    status: 'ACTIVE',
    startDate: '2026-01-03',
    endDate: '2026-08-31',
    createdAt: '2025-12-15T10:00:00',
    updatedAt: '2026-01-05T09:00:00',
  },
  {
    id: '11111111-0000-0000-0000-000000000015',
    name: '5G 네트워크 운영 자동화 플랫폼',
    description: '5G 네트워크 장비 상태 모니터링 및 장애 자동 복구 플랫폼 개발. ML 기반 이상 탐지 기능 포함.',
    customer: 'KT',
    status: 'ACTIVE',
    startDate: '2025-11-01',
    endDate: '2026-10-31',
    createdAt: '2025-10-20T14:00:00',
    updatedAt: '2025-11-05T11:00:00',
  },
  {
    id: '11111111-0000-0000-0000-000000000016',
    name: '공공데이터 포털 개편',
    description: '기존 공공데이터 포털을 최신 기술 스택으로 전면 개편. API 허브, 데이터셋 검색, 활용사례 공유 기능 포함.',
    customer: '행정안전부',
    status: 'ARCHIVED',
    startDate: '2024-03-01',
    endDate: '2024-12-31',
    createdAt: '2024-02-10T09:00:00',
    updatedAt: '2025-01-15T10:00:00',
  },
  {
    id: '11111111-0000-0000-0000-000000000017',
    name: '디지털 헬스케어 앱 개발',
    description: null,
    customer: '삼성서울병원',
    status: 'QUOTATION',
    startDate: null,
    endDate: null,
    createdAt: '2026-04-05T11:00:00',
    updatedAt: '2026-04-05T11:00:00',
  },
  {
    id: '11111111-0000-0000-0000-000000000018',
    name: '전자의무기록(EMR) 시스템 고도화',
    description: '기존 EMR 시스템의 성능 개선 및 모바일 앱 연동 기능 추가. FHIR 표준 준수 API 개발 포함.',
    customer: '삼성서울병원',
    status: 'ACTIVE',
    startDate: '2026-02-01',
    endDate: '2026-12-31',
    createdAt: '2026-01-25T09:00:00',
    updatedAt: '2026-02-01T10:00:00',
  },
  {
    id: '11111111-0000-0000-0000-000000000019',
    name: '물류 배송 추적 시스템',
    description: '실시간 화물 추적 및 배송 현황 조회 시스템 개발. GPS 연동, 고객 알림, 관리자 대시보드 포함.',
    customer: 'CJ대한통운',
    status: 'ARCHIVED',
    startDate: '2024-07-01',
    endDate: '2025-01-31',
    createdAt: '2024-06-15T09:00:00',
    updatedAt: '2025-02-05T11:00:00',
  },
  {
    id: '11111111-0000-0000-0000-000000000020',
    name: 'CJ대한통운 차세대 TMS 플랫폼 구축 및 레거시 시스템 마이그레이션 프로젝트',
    description: '기존 수십 년간 운영된 레거시 운송관리시스템(TMS)을 클라우드 기반 마이크로서비스 아키텍처로 전환하는 대규모 차세대 전환 프로젝트입니다. 배차관리, 경로 최적화, 실시간 추적, 정산 자동화, 고객 포털 등 핵심 기능 전체를 신규 개발합니다.',
    customer: 'CJ대한통운',
    status: 'QUOTATION',
    startDate: null,
    endDate: null,
    createdAt: '2026-04-10T10:00:00',
    updatedAt: '2026-04-10T10:00:00',
  },
  {
    id: '11111111-0000-0000-0000-000000000021',
    name: '스마트 시티 통합 플랫폼',
    description: '교통, 환경, 안전, 에너지 등 도시 인프라를 통합 관제하는 스마트시티 플랫폼을 구축합니다.',
    customer: '행정안전부',
    status: 'ACTIVE',
    startDate: '2025-09-01',
    endDate: '2026-08-31',
    createdAt: '2025-08-15T09:00:00',
    updatedAt: '2025-09-01T10:00:00',
  },
  {
    id: '11111111-0000-0000-0000-000000000022',
    name: '보험금 자동 청구 심사 시스템',
    description: null,
    customer: '삼성생명',
    status: 'QUOTATION',
    startDate: null,
    endDate: null,
    createdAt: '2026-04-15T14:00:00',
    updatedAt: '2026-04-15T14:00:00',
  },
  {
    id: '11111111-0000-0000-0000-000000000023',
    name: '보험 계약 관리 시스템 개발',
    description: '신규 보험 상품 설계부터 계약 관리, 보험금 지급까지 전 주기를 관리하는 코어 보험 시스템을 개발합니다.',
    customer: '삼성생명',
    status: 'ACTIVE',
    startDate: '2025-07-01',
    endDate: '2026-06-30',
    createdAt: '2025-06-10T09:00:00',
    updatedAt: '2025-07-05T11:00:00',
  },
  {
    id: '11111111-0000-0000-0000-000000000024',
    name: '사내 포털 통합 개편',
    description: '사내 그룹웨어, 업무 포털, 사내 SNS를 단일 플랫폼으로 통합하는 차세대 사내 포털 구축.',
    customer: '삼성전자',
    status: 'ARCHIVED',
    startDate: '2023-10-01',
    endDate: '2024-09-30',
    createdAt: '2023-09-01T09:00:00',
    updatedAt: '2024-10-05T14:00:00',
  },
  {
    id: '11111111-0000-0000-0000-000000000025',
    name: '웹 보안 취약점 진단 및 개선',
    description: '서비스 전반에 대한 보안 취약점 진단 및 OWASP Top 10 기준의 보안 강화 작업.',
    customer: '국민은행',
    status: 'ACTIVE',
    startDate: '2026-03-01',
    endDate: '2026-05-31',
    createdAt: '2026-02-20T10:00:00',
    updatedAt: '2026-03-01T09:00:00',
  },
];

// ─── In-Memory Mock DB ────────────────────────────────────────────────────────
// 이 배열이 현재 Mock 데이터의 상태를 나타냄 (POST/PATCH/DELETE에 의해 변경됨)
let mockProjectDb: Project[] = [...INITIAL_PROJECTS];

// ─── Mock DB 접근 함수 ─────────────────────────────────────────────────────────

export const mockProjectStore = {
  /** 전체 목록 반환 */
  getAll(): Project[] {
    return mockProjectDb;
  },

  /** ID로 단건 조회 */
  getById(id: string): Project | undefined {
    return mockProjectDb.find((p) => p.id === id);
  },

  /** 새 프로젝트 추가 (생성) */
  create(project: Project): Project {
    mockProjectDb = [project, ...mockProjectDb];
    return project;
  },

  /** 프로젝트 업데이트 (수정) */
  update(id: string, updated: Project): Project {
    mockProjectDb = mockProjectDb.map((p) => (p.id === id ? updated : p));
    return updated;
  },

  /** 프로젝트 삭제 */
  delete(id: string): void {
    // 향후 관계 데이터(Item, Card, Comment 등) Mock이 추가되면 여기서 함께 삭제
    mockProjectDb = mockProjectDb.filter((p) => p.id !== id);
  },
};
