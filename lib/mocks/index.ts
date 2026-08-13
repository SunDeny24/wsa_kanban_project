/**
 * lib/mocks/index.ts
 *
 * Mock 시스템 진입점
 *
 * 사용법:
 *   import { setupMockAdapter } from '@/lib/mocks';
 *   setupMockAdapter(apiClient);
 *
 * NEXT_PUBLIC_USE_MOCK_API=true 일 때만 호출되어야 합니다.
 * 실제로는 lib/axios/instance.ts 에서 환경변수를 확인한 후 호출합니다.
 */

import { AxiosInstance } from 'axios';
import { createMockAdapter } from './adapter';

/**
 * Axios 인스턴스에 Mock Adapter를 설정합니다.
 * 기존 인스턴스를 직접 수정하므로 모든 요청에 적용됩니다.
 */
export function setupMockAdapter(instance: AxiosInstance): void {
  instance.defaults.adapter = createMockAdapter();

  // 개발자 편의를 위해 콘솔에 안내 메시지 출력
  if (process.env.NODE_ENV !== 'test') {
    console.info(
      '[Mock API] 활성화됨\n' +
      `  - 응답 지연: ${process.env.NEXT_PUBLIC_MOCK_DELAY ?? 400}ms\n` +
      `  - 에러 강제: ${process.env.NEXT_PUBLIC_MOCK_ERROR === 'true' ? '켜짐 (500 에러 반환)' : '꺼짐'}\n` +
      '  - 실제 API로 전환하려면 .env.local 에서 NEXT_PUBLIC_USE_MOCK_API=false 로 변경하세요.',
    );
  }
}
