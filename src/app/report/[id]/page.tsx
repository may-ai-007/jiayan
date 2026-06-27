import { demoCases, getDemoCaseById } from "@/lib/demo-data";
import ReportClient from "./ReportClient";

export function generateStaticParams() {
  return demoCases.map((c) => ({ id: c.id }));
}

export default async function ReportPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const demoCase = getDemoCaseById(id);

  if (!demoCase) {
    return (
      <div className="min-h-screen flex items-center justify-center text-[var(--muted)]">
        报告未找到
      </div>
    );
  }

  return (
    <ReportClient
      report={demoCase.report}
      demoCaseType={demoCase.type}
      caseId={id}
    />
  );
}
