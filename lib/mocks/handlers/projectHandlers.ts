/**
 * lib/mocks/handlers/projectHandlers.ts
 *
 * 프로젝트 Mock API 핸들러
 *
 * 구현된 엔드포인트:
 *   GET    /projects          - 목록 조회 (필터 / 정렬 / 페이지네이션)
 *   GET    /projects/:id      - 단건 조회
 *   POST   /projects          - 생성
 *   PATCH  /projects/:id      - 수정 (전체 교체 방식)
 *   DELETE /projects/:id      - 삭제
 *
 * 미구현 (명세 수신 후 추가 예정):
 *   PATCH  /projects/:id/activate
 *   PATCH  /projects/:id/archive
 *
 * 반환 타입:
 *   - 목록: PageResponse<Project> (types/api.ts)
 *   - 단건/생성/수정: Project (features/project/types/index.ts)
 *   - 삭제: null (204 No Content)
 *   - 에러: ErrorResponse (types/api.ts)
 */

import { Project, ProjectStatus } from '@/features/project/types';
import { PageResponse, ErrorResponse } from '@/types/api';
import { mockProjectStore } from '@/lib/mocks/data/projects';

// ─── 내부 유틸리티 ────────────────────────────────────────────────────────────

/** UUID v4 생성 (crypto.randomUUID 미지원 환경 폴백 포함) */
function generateUUID(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // 폴백: RFC 4122 UUID v4 형식
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/** 현재 시각을 ISO 문자열로 반환 */
function nowIso(): string {
  return new Date().toISOString().replace('Z', '');
}

// ─── Mock 핸들러 반환 타입 ────────────────────────────────────────────────────
// data는 성공 응답 타입과 ErrorResponse 둘 다 가질 수 있으므로 unknown으로 처리

export interface MockResponse {
  status: number;
  data: unknown;
}

// ─── 에러 응답 생성 헬퍼 ─────────────────────────────────────────────────────

function errorResponse(status: number, message: string, fieldErrors?: Record<string, string>): MockResponse {
  const body: ErrorResponse = {
    timestamp: new Date().toISOString(),
    status,
    message,
    ...(fieldErrors ? { fieldErrors } : {}),
  };
  return { status, data: body };
}

// ─── 목록 조회: GET /projects ─────────────────────────────────────────────────

export interface ProjectListParams {
  status?: string;
  customer?: string;
  name?: string;
  page?: string | number;
  size?: string | number;
  sort?: string;
}

export function handleGetProjects(params: ProjectListParams): MockResponse {
  let items = mockProjectStore.getAll();

  // 1) 필터링 ──────────────────────────────────────────────────────────────────

  if (params.status) {
    const validStatuses: ProjectStatus[] = ['QUOTATION', 'ACTIVE', 'ARCHIVED'];
    if (!validStatuses.includes(params.status as ProjectStatus)) {
      return errorResponse(400, `유효하지 않은 status 값입니다: ${params.status}`);
    }
    items = items.filter((p) => p.status === params.status);
  }

  if (params.customer) {
    const keyword = params.customer.toLowerCase();
    items = items.filter((p) => p.customer.toLowerCase().includes(keyword));
  }

  if (params.name) {
    const keyword = params.name.toLowerCase();
    items = items.filter((p) => p.name.toLowerCase().includes(keyword));
  }

  // 2) 정렬 ────────────────────────────────────────────────────────────────────
  //    sort 값 형식: "field,direction" (예: "createdAt,desc", "name,asc")
  //    실제 API는 다중 sort 지원하나 Mock에서는 첫 번째 sort 조건만 적용

  const sortParam = (params.sort as string | undefined) ?? 'createdAt,desc';
  const [sortField, sortDir] = sortParam.split(',');
  const direction = sortDir?.toLowerCase() === 'asc' ? 1 : -1;

  items = [...items].sort((a, b) => {
    // Project 타입의 문자열 필드를 any로 접근
    const aVal = (a as unknown as Record<string, unknown>)[sortField] ?? '';
    const bVal = (b as unknown as Record<string, unknown>)[sortField] ?? '';

    if (typeof aVal === 'string' && typeof bVal === 'string') {
      return aVal.localeCompare(bVal) * direction;
    }
    if (aVal < bVal) return -1 * direction;
    if (aVal > bVal) return 1 * direction;
    return 0;
  });

  // 3) 페이지네이션 ─────────────────────────────────────────────────────────────
  //    page: 0-based (default 0)
  //    size: 페이지 크기 (default 20)
  //    size=0 → 전체 반환 (page=0, size=totalElements, totalPages=1, hasNext=false)

  const totalElements = items.length;
  const pageNum = Math.max(0, Number(params.page ?? 0));
  const rawSize = Number(params.size ?? 20);

  let content: Project[];
  let page: number;
  let size: number;
  let totalPages: number;
  let hasNext: boolean;

  if (rawSize === 0) {
    // size=0: 페이징 없이 전체 반환
    content = items;
    page = 0;
    size = totalElements;
    totalPages = 1;
    hasNext = false;
  } else {
    const safeSize = Math.max(1, rawSize);
    totalPages = Math.max(1, Math.ceil(totalElements / safeSize));
    const safePage = Math.min(pageNum, totalPages - 1);
    content = items.slice(safePage * safeSize, (safePage + 1) * safeSize);
    page = safePage;
    size = safeSize;
    hasNext = safePage < totalPages - 1;
  }

  const responseData: PageResponse<Project> = { content, page, size, totalElements, totalPages, hasNext };
  return { status: 200, data: responseData };
}

// ─── 단건 조회: GET /projects/:id ────────────────────────────────────────────

export function handleGetProjectById(id: string): MockResponse {
  const project = mockProjectStore.getById(id);
  if (!project) {
    return errorResponse(404, `프로젝트를 찾을 수 없습니다. (id: ${id})`);
  }
  return { status: 200, data: project };
}

// ─── 생성: POST /projects ─────────────────────────────────────────────────────

export interface CreateProjectBody {
  name?: string;
  description?: string | null;
  customer?: string;
  startDate?: string | null;
  endDate?: string | null;
}

export function handleCreateProject(body: CreateProjectBody): MockResponse {
  // 필수값 검증
  const fieldErrors: Record<string, string> = {};
  if (!body.name?.trim()) fieldErrors['name'] = '프로젝트명은 필수입니다.';
  if (!body.customer?.trim()) fieldErrors['customer'] = '고객사명은 필수입니다.';

  if (Object.keys(fieldErrors).length > 0) {
    return errorResponse(400, '입력값이 올바르지 않습니다.', fieldErrors);
  }

  const now = nowIso();
  const newProject: Project = {
    id: generateUUID(),
    name: body.name!.trim(),
    description: body.description?.trim() ?? null,
    customer: body.customer!.trim(),
    status: 'QUOTATION', // 신규 프로젝트는 반드시 QUOTATION으로 시작
    startDate: body.startDate ?? null,
    endDate: body.endDate ?? null,
    createdAt: now,
    updatedAt: now,
  };

  mockProjectStore.create(newProject);
  return { status: 201, data: newProject };
}

// ─── 수정: PATCH /projects/:id ───────────────────────────────────────────────
//
// 이 API는 PATCH지만 전체 교체 방식임:
//   - name, description, customer, startDate, endDate → 전달값으로 교체
//   - id, createdAt, status → 유지
//   - updatedAt → 현재 시각으로 갱신

export interface UpdateProjectBody {
  name?: string;
  description?: string | null;
  customer?: string;
  startDate?: string | null;
  endDate?: string | null;
}

export function handleUpdateProject(id: string, body: UpdateProjectBody): MockResponse {
  const existing = mockProjectStore.getById(id);
  if (!existing) {
    return errorResponse(404, `프로젝트를 찾을 수 없습니다. (id: ${id})`);
  }

  // 필수값 검증
  const fieldErrors: Record<string, string> = {};
  if (!body.name?.trim()) fieldErrors['name'] = '프로젝트명은 필수입니다.';
  if (!body.customer?.trim()) fieldErrors['customer'] = '고객사명은 필수입니다.';

  if (Object.keys(fieldErrors).length > 0) {
    return errorResponse(400, '입력값이 올바르지 않습니다.', fieldErrors);
  }

  const updated: Project = {
    ...existing,            // id, createdAt, status 유지
    name: body.name!.trim(),
    description: body.description?.trim() ?? null,
    customer: body.customer!.trim(),
    startDate: body.startDate ?? null,
    endDate: body.endDate ?? null,
    updatedAt: nowIso(),    // 수정 시각 갱신
  };

  mockProjectStore.update(id, updated);
  return { status: 200, data: updated };
}

// ─── 삭제: DELETE /projects/:id ──────────────────────────────────────────────
//
// 향후 관계 Entity(Item, Card 등) Mock이 추가되면 이 핸들러에서 함께 삭제 처리

export function handleDeleteProject(id: string): MockResponse {
  const existing = mockProjectStore.getById(id);
  if (!existing) {
    return errorResponse(404, `프로젝트를 찾을 수 없습니다. (id: ${id})`);
  }

  mockProjectStore.delete(id);
  return { status: 204, data: null };
}

// ─── 상태 변경 핸들러 (명세 수신 후 추가 예정) ───────────────────────────────
//
// PATCH /projects/:id/activate  → activate 명세 수신 후 구현
// PATCH /projects/:id/archive   → archive 명세 수신 후 구현
