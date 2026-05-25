import { useMemo } from "react";
import type { GroupMetric } from "@/lib/sheets-adapter";

export const useDashboardSummary = (groupMetrics: GroupMetric[]) =>
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
    };
  }, [groupMetrics]);
