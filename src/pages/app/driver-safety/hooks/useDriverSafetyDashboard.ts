import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchDriverSafetyData, type DriverSafetyEntry } from "@/lib/sheets-adapter";
import { SHEET_ID } from "../constants";
import { buildFilterOptions, normalizeFilterValue } from "../utils";

export const useDriverSafetyDashboard = () => {
  const [view, setView] = useState<"dashboard" | "list">("dashboard");
  const [search, setSearch] = useState("");
  const [conditionFilters, setConditionFilters] = useState<string[]>([]);
  const [companyFilters, setCompanyFilters] = useState<string[]>([]);
  const [areaFilters, setAreaFilters] = useState<string[]>([]);
  const [levelFilters, setLevelFilters] = useState<string[]>([]);
  const [positionFilters, setPositionFilters] = useState<string[]>([]);
  const [statusFilters, setStatusFilters] = useState<string[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<DriverSafetyEntry | null>(
    null,
  );
  const [sortBy, setSortBy] = useState<"id" | "risk" | "name">("id");
  const [tableOffsetX, setTableOffsetX] = useState(0);

  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ["driverSafety", SHEET_ID],
    queryFn: () => fetchDriverSafetyData(SHEET_ID),
    refetchInterval: 300000, // 5 minutes
  });

  // Extract unique values for filters
  const filterOptions = useMemo(() => {
    if (!data?.entries)
      return {
        companies: [],
        areas: [],
        levels: [],
        positions: [],
        statuses: [],
        conditions: ["RIESGO BAJO", "RIESGO MEDIO", "RIESGO ALTO"],
      };

    const companies = buildFilterOptions(data.entries.map((e) => e.company));
    const areas = buildFilterOptions(data.entries.map((e) => e.area));
    const levels = buildFilterOptions(data.entries.map((e) => e.level));
    const positions = buildFilterOptions(data.entries.map((e) => e.position));
    const statuses = buildFilterOptions(data.entries.map((e) => e.status));

    return {
      companies,
      areas,
      levels,
      positions,
      statuses,
      conditions: ["RIESGO BAJO", "RIESGO MEDIO", "RIESGO ALTO"],
    };
  }, [data]);
  const filteredEntries = useMemo(() => {
    if (!data?.entries) return [];
    const normalizedSearch = normalizeFilterValue(search);

    return data.entries
      .filter((entry) => {
        const searchableText = [
          entry.id,
          entry.name,
          entry.dni,
          entry.company,
          entry.area,
          entry.position,
          entry.level,
          entry.status,
          entry.result,
          entry.date,
          entry.line,
        ]
          .map(normalizeFilterValue)
          .join(" ");

        const matchesSearch =
          !normalizedSearch || searchableText.includes(normalizedSearch);

        const matchesCondition =
          conditionFilters.length === 0 ||
          conditionFilters.some(
            (condition) =>
              normalizeFilterValue(condition) === normalizeFilterValue(entry.result),
          );
        const matchesCompany =
          companyFilters.length === 0 ||
          companyFilters.some(
            (company) =>
              normalizeFilterValue(company) === normalizeFilterValue(entry.company),
          );
        const matchesArea =
          areaFilters.length === 0 ||
          areaFilters.some(
            (area) =>
              normalizeFilterValue(area) === normalizeFilterValue(entry.area),
          );
        const matchesLevel =
          levelFilters.length === 0 ||
          levelFilters.some(
            (level) =>
              normalizeFilterValue(level) === normalizeFilterValue(entry.level),
          );
        const matchesPosition =
          positionFilters.length === 0 ||
          positionFilters.some(
            (position) =>
              normalizeFilterValue(position) ===
              normalizeFilterValue(entry.position || ""),
          );
        const matchesStatus =
          statusFilters.length === 0 ||
          statusFilters.some(
            (status) =>
              normalizeFilterValue(status) === normalizeFilterValue(entry.status),
          );

        return (
          matchesSearch &&
          matchesCondition &&
          matchesCompany &&
          matchesArea &&
          matchesLevel &&
          matchesPosition &&
          matchesStatus
        );
      })
      .sort((a, b) => {
        if (sortBy === "risk") {
          const order: Record<string, number> = {
            "RIESGO BAJO": 1,
            "RIESGO MEDIO": 2,
            "RIESGO ALTO": 3,
            ERROR: 4,
          };
          const valA = order[a.result] || 99;
          const valB = order[b.result] || 99;
          if (valA !== valB) return valA - valB;
          return a.name.localeCompare(b.name);
        } else if (sortBy === "name") {
          return a.name.localeCompare(b.name);
        } else {
          // default: id / order number
          const numA = Number(a.id);
          const numB = Number(b.id);
          if (!isNaN(numA) && !isNaN(numB)) {
            return numA - numB;
          }
          return String(a.id).localeCompare(String(b.id));
        }
      });
  }, [
    data,
    search,
    conditionFilters,
    companyFilters,
    areaFilters,
    levelFilters,
    positionFilters,
    statusFilters,
    sortBy,
  ]);

  const filteredResultCounts = useMemo(() => {
    return filteredEntries.reduce(
      (acc, entry) => {
        if (entry.result === "RIESGO BAJO") acc.low += 1;
        else if (entry.result === "RIESGO MEDIO") acc.medium += 1;
        else if (entry.result === "RIESGO ALTO") acc.high += 1;
        else acc.review += 1;
        return acc;
      },
      { low: 0, medium: 0, high: 0, review: 0 },
    );
  }, [filteredEntries]);

  const stats = useMemo(() => {
    if (!filteredEntries.length)
      return {
        totalEvaluated: 0,
        avgInternal: 0,
        avgExternal: 0,
        riskDistribution: [
          { name: "RIESGO BAJO", value: 0 },
          { name: "RIESGO MEDIO", value: 0 },
          { name: "RIESGO ALTO", value: 0 },
        ],
      };

    const total = filteredEntries.length;
    const avgInternal =
      filteredEntries.reduce((acc, e) => acc + e.internalScore, 0) / total;
    const avgExternal =
      filteredEntries.reduce((acc, e) => acc + e.externalScore, 0) / total;

    const riskCounts = filteredEntries.reduce(
      (acc, e) => {
        acc[e.result] = (acc[e.result] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    const riskDistribution = [
      { name: "RIESGO BAJO", value: riskCounts["RIESGO BAJO"] || 0 },
      { name: "RIESGO MEDIO", value: riskCounts["RIESGO MEDIO"] || 0 },
      { name: "RIESGO ALTO", value: riskCounts["RIESGO ALTO"] || 0 },
    ];

    return {
      totalEvaluated: total,
      avgInternal,
      avgExternal,
      riskDistribution,
    };
  }, [filteredEntries]);

  return {
    view,
    setView,
    search,
    setSearch,
    conditionFilters,
    setConditionFilters,
    companyFilters,
    setCompanyFilters,
    areaFilters,
    setAreaFilters,
    levelFilters,
    setLevelFilters,
    positionFilters,
    setPositionFilters,
    statusFilters,
    setStatusFilters,
    selectedEntry,
    setSelectedEntry,
    sortBy,
    setSortBy,
    tableOffsetX,
    setTableOffsetX,
    data,
    isLoading,
    isError,
    refetch,
    isFetching,
    filterOptions,
    filteredEntries,
    filteredResultCounts,
    stats,
  };
};

