/**
 * lib/mocks/adapter.ts
 *
 * Axios Custom Adapter (Mock 엔진)
 *
 * Axios 요청을 가로채어 Mock 핸들러로 라우팅합니다.
 * axios의 기본 adapter 인터페이스를 그대로 구현하므로 외부 의존성이 없습니다.
 *
 * 지원 기능:
 *   - URL 패턴 매칭 → Mock 핸들러 라우팅
 *   - 응답 지연 (NEXT_PUBLIC_MOCK_DELAY, 기본 400ms)
 *   - 전역 에러 강제 (NEXT_PUBLIC_MOCK_ERROR=true → 500 에러 반환)
 *   - 성공/에러 응답을 Axios 내부 포맷으로 래핑
 */

import { AxiosAdapter, AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import type { MockResponse } from './handlers/projectHandlers';
import {
  handleGetProjects,
  handleGetProjectById,
  handleCreateProject,
  handleUpdateProject,
  handleDeleteProject,
} from './handlers/projectHandlers';

// ─── 응답 지연 유틸 ───────────────────────────────────────────────────────────

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ─── URL 파싱 유틸 ────────────────────────────────────────────────────────────

/**
 * 전체 URL에서 baseURL 이후의 경로만 추출합니다.
 * 예) "http://192.168.20.13:8080/api/projects?page=0" → "/projects"
 */
function extractPath(config: InternalAxiosRequestConfig): string {
  const fullUrl = config.url ?? '';

  // Axios가 baseURL을 붙이기 전 상태인 경우가 대부분이므로
  // url이 이미 상대 경로("/projects")인 경우를 처리
  if (fullUrl.startsWith('/')) return fullUrl.split('?')[0];

  // 절대 URL인 경우 pathname만 추출
  try {
    const url = new URL(fullUrl);
    return url.pathname;
  } catch {
    return fullUrl.split('?')[0];
  }
}

/**
 * config.params와 URL 쿼리스트링을 합쳐서 쿼리 파라미터 객체를 반환합니다.
 */
function extractParams(config: InternalAxiosRequestConfig): Record<string, string> {
  const result: Record<string, string> = {};

  // URL에 붙어 있는 쿼리스트링 파싱
  const fullUrl = config.url ?? '';
  const qIndex = fullUrl.indexOf('?');
  if (qIndex !== -1) {
    const qs = new URLSearchParams(fullUrl.slice(qIndex + 1));
    qs.forEach((value, key) => { result[key] = value; });
  }

  // config.params (Axios가 별도로 관리하는 파라미터)
  if (config.params && typeof config.params === 'object') {
    for (const [key, value] of Object.entries(config.params)) {
      if (value !== undefined && value !== null && value !== '') {
        result[key] = String(value);
      }
    }
  }

  return result;
}

// ─── Axios 응답 빌더 ──────────────────────────────────────────────────────────

function buildAxiosResponse(
  mockRes: MockResponse,
  config: InternalAxiosRequestConfig,
): AxiosResponse {
  return {
    data: mockRes.data,
    status: mockRes.status,
    statusText: mockRes.status === 200 ? 'OK'
      : mockRes.status === 201 ? 'Created'
      : mockRes.status === 204 ? 'No Content'
      : 'Error',
    headers: { 'content-type': 'application/json' },
    config,
  };
}

function buildAxiosError(
  mockRes: MockResponse,
  config: InternalAxiosRequestConfig,
): AxiosError {
  const response = buildAxiosResponse(mockRes, config);
  const error = new AxiosError(
    `Request failed with status code ${mockRes.status}`,
    String(mockRes.status),
    config,
    null,
    response as AxiosResponse,
  );
  return error;
}

// ─── Mock 라우터 ──────────────────────────────────────────────────────────────

/**
 * HTTP Method + 경로를 기준으로 올바른 핸들러를 호출하고 MockResponse를 반환합니다.
 *
 * 라우팅 우선순위 (구체적인 경로가 먼저):
 *   PATCH /projects/:id/activate  (미구현, 명세 수신 후 추가)
 *   PATCH /projects/:id/archive   (미구현, 명세 수신 후 추가)
 *   GET    /projects
 *   POST   /projects
 *   GET    /projects/:id
 *   PATCH  /projects/:id
 *   DELETE /projects/:id
 */
async function route(
  method: string,
  path: string,
  params: Record<string, string>,
  body: unknown,
): Promise<MockResponse> {
  const m = method.toUpperCase();

  // /projects/:id/activate
  const activateMatch = path.match(/^\/projects\/([^/]+)\/activate$/);
  if (activateMatch && m === 'PATCH') {
    // 명세 수신 후 구현 예정
    return { status: 501, data: { timestamp: new Date().toISOString(), status: 501, message: '아직 구현되지 않은 기능입니다. (activate 명세 확인 중)' } };
  }

  // /projects/:id/archive
  const archiveMatch = path.match(/^\/projects\/([^/]+)\/archive$/);
  if (archiveMatch && m === 'PATCH') {
    // 명세 수신 후 구현 예정
    return { status: 501, data: { timestamp: new Date().toISOString(), status: 501, message: '아직 구현되지 않은 기능입니다. (archive 명세 확인 중)' } };
  }

  // /projects (목록 / 생성)
  if (path === '/projects') {
    if (m === 'GET') return handleGetProjects(params);
    if (m === 'POST') return handleCreateProject(body as Parameters<typeof handleCreateProject>[0]);
  }

  // /projects/:id (단건 / 수정 / 삭제)
  const projectIdMatch = path.match(/^\/projects\/([^/]+)$/);
  if (projectIdMatch) {
    const id = projectIdMatch[1];
    if (m === 'GET')    return handleGetProjectById(id);
    if (m === 'PATCH')  return handleUpdateProject(id, body as Parameters<typeof handleUpdateProject>[1]);
    if (m === 'DELETE') return handleDeleteProject(id);
  }

  // 매칭되지 않은 경로
  return {
    status: 404,
    data: {
      timestamp: new Date().toISOString(),
      status: 404,
      message: `Mock 핸들러를 찾을 수 없습니다: ${m} ${path}`,
    },
  };
}

// ─── Mock Adapter 팩토리 ──────────────────────────────────────────────────────

export function createMockAdapter(): AxiosAdapter {
  return async (config: InternalAxiosRequestConfig): Promise<AxiosResponse> => {
    const delayMs = Number(process.env.NEXT_PUBLIC_MOCK_DELAY ?? 400);
    const forceError = process.env.NEXT_PUBLIC_MOCK_ERROR === 'true';

    // 응답 지연 시뮬레이션
    await delay(delayMs);

    // 전역 에러 강제 모드
    if (forceError) {
      const errRes: MockResponse = {
        status: 500,
        data: {
          timestamp: new Date().toISOString(),
          status: 500,
          message: 'Internal Server Error (Mock 에러 강제 모드)',
        },
      };
      throw buildAxiosError(errRes, config);
    }

    const path = extractPath(config);
    const params = extractParams(config);
    const method = config.method ?? 'GET';

    // request body 파싱
    let body: unknown = null;
    if (config.data) {
      try {
        body = typeof config.data === 'string' ? JSON.parse(config.data) : config.data;
      } catch {
        body = config.data;
      }
    }

    const mockRes = await route(method, path, params, body);

    // 4xx / 5xx → AxiosError로 throw (실제 Axios 동작과 동일)
    if (mockRes.status >= 400) {
      throw buildAxiosError(mockRes, config);
    }

    return buildAxiosResponse(mockRes, config);
  };
}
