/**
 * 프로젝트 관련 타입 정의
 */

import { BaseTimeEntity } from '@/types/api';

// 1. 프로젝트 상태 Enum 
export type ProjectStatus = 'QUOTATION' | 'ACTIVE' | 'ARCHIVED';

// 2. 프로젝트 단건 데이터 타입 (API 응답 기준)
export interface Project extends BaseTimeEntity {
  id: string;            // UUID (백엔드 PK는 String/UUID)
  name: string;          // 프로젝트명
  description: string | null; // 설명
  customer: string;      // 고객사명
  status: ProjectStatus; // 상태
  startDate: string | null;   // 시작일
  endDate: string | null;     // 종료일
}

// 3. 프로젝트 생성 시 필요한 데이터 타입 (필수/선택 값 구분)
export interface CreateProjectData {
  name: string;
  customer: string;
  description?: string | null;
  startDate?: string | null;
  endDate?: string | null;
}

// 4. 프로젝트 수정 시 필요한 데이터 타입
export interface UpdateProjectData extends Partial<CreateProjectData> {}