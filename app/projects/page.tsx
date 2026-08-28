// 프로젝트 목록 server component

import { Suspense } from "react";
import ProjectList from "@/features/project/components/ProjectList";
import { ProjectListPageSkeleton } from "@/features/project/components/skeleton/ProjectListSkeleton";

export default function ProjectsPage() {
    return (
        // useSearchParams를 사용하는 Client Component의 렌더링 경계입니다.
        // 프로젝트 API 로딩은 ProjectList 내부의 isLoading이 처리합니다.
        <Suspense fallback={<ProjectListPageSkeleton />}>
            <ProjectList />
        </Suspense>
    );
}
