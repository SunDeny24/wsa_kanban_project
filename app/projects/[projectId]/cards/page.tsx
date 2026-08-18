// 프로젝트 보드 탭
import {CardList} from "@/features/cards/components/CardsList";

interface BoardPageProps {
  params: {
    projectId: string;
  };
}
export default function ProjectBoardPage({ params }: BoardPageProps) {
  return (<div>
            <CardList
                projectId={params.projectId}
            />
          </div>);
}
