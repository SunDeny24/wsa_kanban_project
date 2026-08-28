import axios from 'axios';

/**
 * Axios 인스턴스
 * - baseURL: 환경변수 NEXT_PUBLIC_API_BASE_URL
 */
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // 예시: config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor - 에러 처리
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  },
);

// ─── Mock API 설정 ────────────────────────────────────────────────────────────
// NEXT_PUBLIC_USE_MOCK_API=true 이면 Axios adapter를 Mock으로 교체합니다.
// false 또는 미설정이면 기존 실제 API를 그대로 사용합니다.
// 기존 baseURL / interceptors / timeout 설정에는 영향을 주지 않습니다.
if (process.env.NEXT_PUBLIC_USE_MOCK_API === 'true') {
  // 동적 import: Mock 코드가 실제 API 모드에서는 번들에 포함되지 않도록
  // Next.js 환경에서는 require()를 사용하여 조건부 로딩
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { setupMockAdapter } = require('@/lib/mocks');
  setupMockAdapter(apiClient);
}

export default apiClient;
