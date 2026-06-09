import { useMemo } from "react";
import { RauraEntry } from "@/lib/sheets-adapter";
import { toPercent } from "./dpmsRaura.utils";

const normalizeFilterText = (value: string | number | undefined | null) =>
  String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

export const useDpmsRauraDashboard = (
  entries: RauraEntry[] | undefined,
  search: string,
  selectedCompany: string,
) => {
  const companies = useMemo(() => {
    if (!entries) return [];
    return Array.from(
      new Set(entries.map((e) => e.empresa?.trim()).filter(Boolean)),
    ).sort((a, b) => a.localeCompare(b, "es"));
  }, [entries]);

  const filteredEntries = useMemo(() => {
    if (!entries) return [];
    const normalizedSearch = normalizeFilterText(search);
    const normalizedCompany = normalizeFilterText(selectedCompany);

    return entries
      .filter((e) => {
        const searchableText = [
          e.id,
          e.area,
          e.fecha,
          e.name,
          e.empresa,
          e.contrata,
          e.cargo,
          e.dni,
        ]
          .map(normalizeFilterText)
          .join(" ");

        const matchesSearch =
          !normalizedSearch || searchableText.includes(normalizedSearch);
        const matchesCompany =
          selectedCompany === "all" ||
          normalizeFilterText(e.empresa) === normalizedCompany;

        return matchesSearch && matchesCompany;
      })
      .sort((a, b) => a.id - b.id);
  }, [entries, search, selectedCompany]);

  const statsMetrix = useMemo(() => {
    if (!filteredEntries.length)
      return { avg: 0, categories: [], areas: [], voice: 0 };

    const avg = (arr: number[]) =>
      arr.length > 0 ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;

    const categories = [
      { name: "Liderazgo", value: toPercent(avg(filteredEntries.map((e) => e.dimensions.liderazgo.score))) },
      { name: "Percepción", value: toPercent(avg(filteredEntries.map((e) => e.dimensions.percepcion.score))) },
      { name: "Comunicación", value: toPercent(avg(filteredEntries.map((e) => e.dimensions.comunicacion.score))) },
      { name: "Rol Equipo", value: toPercent(avg(filteredEntries.map((e) => e.dimensions.rolEquipo.score))) },
      { name: "Cultura", value: toPercent(avg(filteredEntries.map((e) => e.dimensions.cultura.score))) },
      { name: "Motivación", value: toPercent(avg(filteredEntries.map((e) => e.dimensions.motivacion.score))) },
    ];

    const areaGroups: Record<string, number[]> = {};
    filteredEntries.forEach((e) => {
      const area = (e.area || "GENERAL").trim().toUpperCase();
      areaGroups[area] = areaGroups[area] || [];
      areaGroups[area].push(e.totalScore);
    });

    const areas = Object.keys(areaGroups)
      .map((name) => ({ name, score: toPercent(avg(areaGroups[name])) }))
      .sort((a, b) => b.score - a.score);

    return {
      avg: toPercent(avg(filteredEntries.map((e) => e.totalScore))),
      categories,
      areas,
      voice: filteredEntries.filter((e) => e.comentarios).length,
    };
  }, [filteredEntries]);

  const maturityData = useMemo(() => {
    if (!filteredEntries.length) return [];
    const levels = [
      {
        name: "Reactivo",
        value: 0,
        color: "#ef4444",
        desc: "Cultura basada en instinto y miedo. La seguridad es una carga delegada.",
      },
      {
        name: "Dependiente",
        value: 0,
        color: "#f59e0b",
        desc: "Cultura basada en supervisión y reglas. Se cumple por temor a la sanción.",
      },
      {
        name: "Independiente",
        value: 0,
        color: "#3b82f6",
        desc: "Cultura basada en autovigilancia. El individuo se cuida por conviccion.",
      },
      {
        name: "Interdependiente",
        value: 0,
        color: "#10b981",
        desc: 'Cultura colectiva. "Yo te cuido, tu me cuidas". Excelencia operacional.',
      },
    ];

    filteredEntries.forEach((e) => {
      const score = toPercent(e.totalScore);
      if (score <= 25) levels[0].value++;
      else if (score <= 50) levels[1].value++;
      else if (score <= 75) levels[2].value++;
      else levels[3].value++;
    });

    return levels.filter((level) => level.value > 0);
  }, [filteredEntries]);

  const cultureData = useMemo(() => {
    if (!filteredEntries.length)
      return { avg: 0, distribution: [], label: "N/A", color: "#cbd5e1" };
    const avgCulture = statsMetrix.categories[4]?.value || 0;

    const levels = [
      { name: "Reactivo", value: 0, color: "#ef4444", range: "0-25%" },
      { name: "Dependiente", value: 0, color: "#f59e0b", range: "26-50%" },
      { name: "Independiente", value: 0, color: "#3b82f6", range: "51-75%" },
      { name: "Interdependiente", value: 0, color: "#10b981", range: "76-100%" },
    ];

    filteredEntries.forEach((e) => {
      const score = toPercent(e.dimensions.cultura.score);
      if (score <= 25) levels[0].value++;
      else if (score <= 50) levels[1].value++;
      else if (score <= 75) levels[2].value++;
      else levels[3].value++;
    });

    const cultureScore = avgCulture;
    const current =
      cultureScore <= 25
        ? levels[0]
        : cultureScore <= 50
          ? levels[1]
          : cultureScore <= 75
            ? levels[2]
            : levels[3];

    return {
      avg: avgCulture,
      distribution: levels.filter((level) => level.value > 0),
      label: current.name,
      color: current.color,
    };
  }, [filteredEntries, statsMetrix]);

  const behaviorCategory = useMemo(() => {
    if (!filteredEntries.length) return { name: "N/A", color: "#cbd5e1" };
    const score = statsMetrix.avg;
    if (score <= 25) return { name: "Reactivo", color: "#ef4444" };
    if (score <= 50) return { name: "Dependiente", color: "#f59e0b" };
    if (score <= 75) return { name: "Independiente", color: "#3b82f6" };
    return { name: "Interdependiente", color: "#10b981" };
  }, [filteredEntries, statsMetrix]);

  return {
    companies,
    filteredEntries,
    statsMetrix,
    maturityData,
    cultureData,
    behaviorCategory,
  };
};
