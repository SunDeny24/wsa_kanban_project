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

// 3. POST /projects 요청 타입 (status는 서버에서 QUOTATION으로 설정)
export interface ProjectCreateRequest {
  name: string;
  customer: string;
  description?: string;
  startDate?: string;
  endDate?: string;
}

// 기존 이름을 참조하는 코드와의 호환을 유지합니다.
export type CreateProjectData = ProjectCreateRequest;

// 4. 프로젝트 수정 시 필요한 데이터 타입
export interface UpdateProjectData extends Partial<CreateProjectData> {}
