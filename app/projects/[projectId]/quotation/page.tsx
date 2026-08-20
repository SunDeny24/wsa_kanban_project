import { QuotationList } from "@/features/quotation/components/QuotationList";

interface ProjectQuotationPageProps {
    params: {
        projectId: string;
    };
}

// 프로젝트 견적 탭에서 해당 프로젝트의 전체 리비전을 조회합니다.
export default function ProjectQuotationPage({
    params,
}: ProjectQuotationPageProps) {
    return <QuotationList projectId={params.projectId} />;
}
