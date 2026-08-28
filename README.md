# WSA Kanban Project

프로젝트, 견적 리비전, 업무 카드를 관리하는 프론트엔드 웹 애플리케이션입니다.

프로젝트 CRUD와 상태 관리, 견적 상태 전이, Kanban 카드 관리 기능을 제공합니다. 서버 상태는 TanStack React Query로 관리하며, 반복되는 API와 Form 처리는 공통 Hook으로 구성했습니다.

## 주요 기능

### 프로젝트 관리

- 프로젝트 목록 조회, 생성, 상세, 수정, 삭제
- 상태별 필터: 견적중, 진행중, 보관
- 고객사·프로젝트명 검색과 정렬
- 0-based API 페이지네이션과 1-based UI 연동
- 프로젝트 활성화, 재활성화, 보관
- 목록 검색 조건과 페이지 URL 유지

### Kanban 카드 관리

- `TODO`, `IN_PROGRESS`, `HOLD`, `DONE` 4개 상태 관리
- 카드 생성, 상세 조회, 수정, 삭제
- Desktop 4열 Kanban Board
- Mobile 상태별 탭 UI
- Drag & Drop 카드 상태 변경
- Optimistic Update와 실패 시 Rollback

### 견적 관리

- 프로젝트별 견적 Revision 조회와 생성
- `DRAFT`, `SENT`, `CONFIRMED`, `REJECTED`, `SUPERSEDED` 상태 표시
- 견적 발송, 확정, 반려
- 견적 확정 후 프로젝트 상태 및 관련 Query 갱신

### 공통 처리

- Axios 공통 Client
- React Query 기반 Entity Query/Mutation Hook
- React Hook Form과 API Mutation 연계
- 서버 필드 오류와 일반 API 오류 분리
- 공통 Error/Confirm Modal
- 환경변수로 실제 API와 Mock API 전환

## 기술 스택

| 구분 | 기술 |
| --- | --- |
| Framework | Next.js 14 App Router, React 18 |
| Language | TypeScript |
| Server State | TanStack React Query |
| HTTP | Axios |
| Form | React Hook Form |
| Styling | Tailwind CSS |
| Drag & Drop | `@dnd-kit/react` |
| Icon | lucide-react |

## 프로젝트 구조

```text
app/                     # App Router 페이지와 레이아웃
features/
├─ project/              # 프로젝트 목록·상세·CRUD
├─ cards/                # Kanban과 카드 CRUD
└─ quotation/            # 견적 Revision과 상태 액션
components/
├─ common/               # 공통 Modal과 상태 UI
└─ ui/                   # 공통 UI 요소
lib/
├─ axios/                # Axios instance
├─ hooks/                # 공통 Entity/Form Hook
├─ api/                  # 공통 에러 처리
├─ react-query/          # QueryClient와 Provider
└─ mocks/                # Axios Custom Adapter 기반 Mock API
types/                   # 공통 API 타입
```

데이터 요청은 다음 구조로 처리합니다.

```text
Feature Component
  → Form Hook / Domain Hook
  → Common Entity Hook
  → Axios Client
  → Backend API 또는 Mock Adapter
```

## 시작하기

### 1. 요구 환경

- Node.js 18 이상
- npm

### 2. 패키지 설치

```bash
npm install
```

### 3. 환경변수 설정

`.env.local`은 개인·환경별 설정 파일이므로 Git에 포함되지 않습니다. 저장소에 포함된
`.env.example`을 복사해서 사용합니다.

Windows PowerShell:

```powershell
Copy-Item .env.example .env.local
```

macOS/Linux:

```bash
cp .env.example .env.local
```

#### 실제 Backend API 사용

생성한 `.env.local`에 실행 환경의 Backend API 주소를 입력하고 Mock 기능을 끕니다.

```dotenv
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api
NEXT_PUBLIC_USE_MOCK_API=false
```

#### Backend 없이 Mock API로 테스트

저장소에 `lib/mocks`가 포함되어 있다면 다음과 같이 설정합니다.

```dotenv
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api
NEXT_PUBLIC_USE_MOCK_API=true
NEXT_PUBLIC_MOCK_DELAY=400
NEXT_PUBLIC_MOCK_ERROR=false
```

API 오류 화면을 확인하려면 `NEXT_PUBLIC_MOCK_ERROR=true`로 변경합니다.

> `lib/mocks`가 없는 배포본이나 사내 소스에서는 `NEXT_PUBLIC_USE_MOCK_API=true`를
> 사용하면 빌드에 실패할 수 있습니다. 이 경우 반드시 `false`로 설정하고 실제 Backend
> API 주소를 지정하세요.

환경변수를 변경했다면 개발 서버를 다시 시작해야 합니다. 배포 환경에서는 환경변수를
설정한 뒤 Production build를 다시 생성합니다.

> Mock 모드에서는 프로젝트 activate/archive와 카드 DELETE가 아직 지원되지 않습니다.

### 4. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 엽니다. 루트 경로는 `/projects`로 이동합니다.

## 명령어

| 명령어 | 설명 |
| --- | --- |
| `npm run dev` | 개발 서버 실행 |
| `npm run build` | Production build 및 타입 검사 |
| `npm run start` | Production 서버 실행 |
| `npm run lint` | ESLint 검사 |

## 주요 라우트

| 경로 | 화면 |
| --- | --- |
| `/projects` | 프로젝트 목록 |
| `/projects/{projectId}` | 프로젝트 개요 |
| `/projects/{projectId}/quotation` | 견적 Revision |
| `/projects/{projectId}/cards` | Kanban Board |

## 구현 범위 참고

- Item 화면은 placeholder만 존재하며 현재 상세 탭에서는 노출하지 않습니다.
- Layout, Card Comment, 인증·권한, Report 기능은 현재 구현 범위에 포함되지 않습니다.
- 자동화 테스트는 아직 구성되어 있지 않습니다.
- Mock API의 프로젝트 상태 액션과 카드 삭제는 후속 구현이 필요합니다.
