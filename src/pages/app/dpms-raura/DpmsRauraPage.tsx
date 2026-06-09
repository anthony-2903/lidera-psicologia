import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchRauraData, RauraEntry } from "@/lib/sheets-adapter";
import {
  Users,
  Activity,
  LayoutDashboard,
  MessageSquare,
  MousePointer2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { EntryPanel as RauraEntryPanel } from "./components/EntryPanel";
import {
  DpmsRauraErrorState,
  DpmsRauraLoadingState,
} from "./components/DpmsRauraStates";
import { GlobalSummaryView } from "./components/GlobalSummaryView";
import { IndividualResponsesView } from "./components/IndividualResponsesView";
import { VoiceTableView } from "./components/VoiceTableView";
import { SHEET_ID } from "./dpmsRaura.constants";
import { useDpmsRauraDashboard } from "./useDpmsRauraDashboard";

export default function DpmsRauraPage() {
  const [activeTab, setActiveTab] = useState<
    "general" | "individual" | "comments"
  >("general");
  const [search, setSearch] = useState("");
  const [selectedEntry, setSelectedEntry] = useState<RauraEntry | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<string>("all");
  const [tableOffsetX, setTableOffsetX] = useState(0);

  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ["rauraData", SHEET_ID],
    queryFn: () => fetchRauraData(SHEET_ID),
  });

  const {
    companies,
    filteredEntries,
    statsMetrix,
    maturityData,
    cultureData,
    behaviorCategory,
  } = useDpmsRauraDashboard(data?.entries, search, selectedCompany);

  if (isLoading) {
    return <DpmsRauraLoadingState />;
  }

  if (isError || !data) {
    return (
      <DpmsRauraErrorState
        isFetching={isFetching}
        onRefetch={() => refetch()}
      />
    );
  }


  return (
    <div className="relative min-h-[calc(100vh-100px)] flex flex-col selection:bg-primary/20 overflow-x-hidden p-4 md:p-8 space-y-12">
      <DashboardHeader
        title={
          <>
            DIAGNÓSTICO DE PERCEPCIÓN Y MADUREZ EN SEGURIDAD{" "}
            <span className="text-primary not-italic">Raura</span>
          </>
        }
        subtitle="Métricas de percepción y madurez en seguridad minera. Análisis de comportamiento y liderazgo visible."
        isFetching={isFetching}
        onRefresh={refetch}
        view={activeTab}
        onViewChange={setActiveTab}
        stats={{
          label: "Muestreo Total",
          value: data.totalRespondents,
          icon: Users,
        }}
        tabs={[
          { id: "general", icon: LayoutDashboard, label: "Resumen Global" },
          {
            id: "individual",
            icon: MousePointer2,
            label: "Explorar Respuestas",
          },
          { id: "comments", icon: MessageSquare, label: "Mesa de Voz" },
        ]}
        className={cn(selectedEntry ? "lg:pr-[450px]" : "")}
      />

      {/* --- CONTENT AREA --- */}

      <div
        className={cn(
          "flex-1 space-y-20 transition-all duration-1000 cubic-bezier(0.23, 1, 0.32, 1)",
          selectedEntry ? "lg:pr-[450px]" : "",
        )}
      >
        {activeTab === "general" && <GlobalSummaryView />}

        {activeTab === "individual" && (
          <IndividualResponsesView
            search={search}
            onSearchChange={setSearch}
            selectedCompany={selectedCompany}
            onCompanyChange={setSelectedCompany}
            companies={companies}
            filteredEntries={filteredEntries}
            selectedEntry={selectedEntry}
            onSelectEntry={setSelectedEntry}
            tableOffsetX={tableOffsetX}
            onTableOffsetXChange={setTableOffsetX}
          />
        )}

        {activeTab === "comments" && (
          <VoiceTableView entries={data.entries} />
        )}
      </div>

      {/* FLOATING ACTION PANEL */}
      {selectedEntry && (
        <>
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[90] lg:hidden animate-in fade-in duration-500"
            onClick={() => setSelectedEntry(null)}
          />
          <div className="fixed inset-y-0 right-0 w-full sm:w-[450px] lg:w-[500px] z-[100] animate-in slide-in-from-right duration-700 cubic-bezier(0.23, 1, 0.32, 1)">
            <RauraEntryPanel
              entry={selectedEntry}
              onClose={() => setSelectedEntry(null)}
            />
          </div>
        </>
      )}

      {/* DESIGN DECORATIONS */}
      <div className="fixed bottom-10 left-10 pointer-events-none opacity-20 hidden 2xl:block">
        <div className="flex items-center gap-4 text-primary font-black uppercase tracking-[1em] text-[10px] italic">
          <Activity className="w-4 h-4 animate-pulse" /> Diagnostic
          Protocol_Raura
        </div>
      </div>
    </div>
  );
}
