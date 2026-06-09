import { useMemo } from "react";
import type { GroupMetric, SheetRow } from "@/lib/sheets-adapter";

const normalizeStatus = (value: string | undefined): "completed" | "inProgress" | "pending" => {
  const status = (value || "").toUpperCase().trim();

  if (status === "COMPLETO") return "completed";
  if (status === "PROCESO") return "inProgress";
  return "pending";
};

const getLocation = (row: SheetRow) =>
  (row.AREA || row["ÁREA"] || "Sin ubicación").trim() || "Sin ubicación";

const buildRowSegments = (rows: SheetRow[]) => {
  const segments = new Map<
    string,
    {
      name: string;
      total: number;
      completed: number;
      inProgress: number;
      pending: number;
      completionRate: number;
    }
  >();

  rows.forEach((row) => {
    const name = getLocation(row);
    const current =
      segments.get(name) ||
      {
        name,
        total: 0,
        completed: 0,
        inProgress: 0,
        pending: 0,
        completionRate: 0,
      };
    const status = normalizeStatus(row.ESTADO);

    current.total += 1;
    current[status] += 1;
    current.completionRate = current.total > 0 ? Math.round((current.completed / current.total) * 100) : 0;
    segments.set(name, current);
  });

  return [...segments.values()].sort((a, b) => b.total - a.total || b.completionRate - a.completionRate);
};

const buildGroupSegments = (groupMetrics: GroupMetric[]) =>
  groupMetrics
    .map((group) => ({
      name: group.name,
      total: group.total,
      completed: group.completed,
      inProgress: group.inProgress,
      pending: group.pending,
      completionRate: group.total > 0 ? Math.round((group.completed / group.total) * 100) : 0,
    }))
    .sort((a, b) => b.total - a.total || b.completionRate - a.completionRate);

export const useDashboardSummary = (groupMetrics: GroupMetric[], rawRows: SheetRow[] = []) =>
  useMemo(() => {
    if (!groupMetrics.length) {
      return {
        totalGroups: 0,
        totalEvaluated: 0,
        totalCompleted: 0,
        avgSystemScore: 0,
        genderData: [],
        companyData: [],
        statusTotals: {
          completo: 0,
          proceso: 0,
          falta: 0,
        },
        contractorData: [],
        locationData: [],
      };
    }

    const totalEvaluated = groupMetrics.reduce((acc, group) => acc + group.total, 0);
    const statusTotals = {
      completo: groupMetrics.reduce((acc, group) => acc + group.statusStats.completo, 0),
      proceso: groupMetrics.reduce((acc, group) => acc + group.statusStats.proceso, 0),
      falta: groupMetrics.reduce((acc, group) => acc + group.statusStats.falta, 0),
    };

    return {
      totalGroups: groupMetrics.length,
      totalEvaluated,
      totalCompleted: groupMetrics.reduce((acc, group) => acc + group.completed, 0),
      avgSystemScore: Math.round(groupMetrics.reduce((acc, group) => acc + group.avgScore, 0) / groupMetrics.length),
      genderData: [
        { name: "Hombre", value: groupMetrics.reduce((acc, group) => acc + group.genderData[0].value, 0), color: "hsl(var(--primary))" },
        { name: "Mujer", value: groupMetrics.reduce((acc, group) => acc + group.genderData[1].value, 0), color: "#10b981" },
      ],
      companyData: groupMetrics.map((group) => ({
        company: group.name,
        count: group.total,
        percentage: totalEvaluated > 0 ? ((group.total / totalEvaluated) * 100).toFixed(1) : 0,
      })),
      statusTotals,
      contractorData: buildGroupSegments(groupMetrics),
      locationData: buildRowSegments(rawRows),
    };
  }, [groupMetrics, rawRows]);
