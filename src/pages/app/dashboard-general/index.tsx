import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchSheetData, GroupMetric } from "@/lib/sheets-adapter";
import { SHEET_ID } from "./constants";
import { DashboardHeaderSection } from "./components/DashboardHeaderSection";
import { DetailView } from "./components/DetailView";
import { ErrorState } from "./components/ErrorState";
import { GroupBreakdown } from "./components/GroupBreakdown";
import { LoadingState } from "./components/LoadingState";
import { SummaryCharts } from "./components/SummaryCharts";
import { SummaryKpis } from "./components/SummaryKpis";
import { useDashboardSummary } from "./hooks/useDashboardSummary";

const DashboardPage = () => {
  const [selectedGroup, setSelectedGroup] = useState<GroupMetric | null>(null);
  const [view, setView] = useState<"grid" | "detail">("grid");

  const { data: groupMetrics = [], isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ["sheetData", SHEET_ID],
    queryFn: () => fetchSheetData(SHEET_ID),
  });

  const summaryData = useDashboardSummary(groupMetrics);

  const handleGroupClick = (group: GroupMetric) => {
    setSelectedGroup(group);
    setView("detail");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBack = () => {
    setView("grid");
    setSelectedGroup(null);
  };

  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState onRetry={() => refetch()} />;

  if (view === "detail" && selectedGroup) {
    return <DetailView selectedGroup={selectedGroup} onBack={handleBack} />;
  }

  return (
    <div className="space-y-6 md:space-y-8 pb-10 animate-in fade-in slide-in-from-left-4 duration-500 fill-mode-forwards px-4 md:px-0">
      <DashboardHeaderSection isFetching={isFetching} onRefresh={refetch} />
      <SummaryKpis totalEvaluated={summaryData.totalEvaluated} statusTotals={summaryData.statusTotals} />
      <SummaryCharts companyData={summaryData.companyData} statusTotals={summaryData.statusTotals} />
      <GroupBreakdown groupMetrics={groupMetrics} onGroupClick={handleGroupClick} />
    </div>
  );
};

export default DashboardPage;
