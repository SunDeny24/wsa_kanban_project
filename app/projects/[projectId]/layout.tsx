// 프로젝트 상세페이지 공통 레이아웃

import ProjectDetailLayout from '@/features/project/components/ProjectDetailLayout';

interface LayoutProps {
  children: React.ReactNode;
  params: {
    projectId: string;
  };
}

export default function Layout({ children, params }: LayoutProps) {
  return (
    <ProjectDetailLayout projectId={params.projectId}>
      {children}
    </ProjectDetailLayout>
  );
}
