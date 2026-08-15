// 프로젝트 목록 server component

import ProjectList from "@/features/project/components/ProjectList";
import { Suspense } from "react";

// 추후 스켈레톤이나 로딩 컴포넌트로 교체 가능
export default function ProjectsPage() {
  return (
    <Suspense fallback={<div>프로젝트를 불러오는 중...</div>}>
        <ProjectList/>
    </Suspense>
  );
}
