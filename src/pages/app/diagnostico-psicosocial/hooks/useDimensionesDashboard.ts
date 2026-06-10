import { useMemo } from "react";
import type { DimensionesDashboardData, DimensionesEntry } from "@/lib/sheets-adapter";
import { getTrafficConfig, scoreByType } from "../utils";

export const useDimensionesDashboard = (
  data: DimensionesDashboardData | undefined,
  search: string,
  selectedEntryId: number | null,
  filters?: {
    empresa?: string;
    area?: string;
    cargo?: string;
    nivel?: string;
    genero?: string;
  }
) => {
  const filteredEntries = useMemo(() => {
    if (!data?.entries) return [];
    const normalizeSearch = (value: unknown) =>
      String(value ?? "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toUpperCase()
        .trim();

    const searchClean = normalizeSearch(search);
    const filterValues = {
      empresa: normalizeSearch(filters?.empresa),
      area: normalizeSearch(filters?.area),
      cargo: normalizeSearch(filters?.cargo),
      nivel: normalizeSearch(filters?.nivel),
      genero: normalizeSearch(filters?.genero),
    };

    const searchAsDni = searchClean.replace(/O/g, "0");

    return data.entries.filter((entry) => {
      const matchesFilters =
        (!filterValues.empresa || normalizeSearch(entry.empresa) === filterValues.empresa) &&
        (!filterValues.area || normalizeSearch(entry.area) === filterValues.area) &&
        (!filterValues.cargo || normalizeSearch(entry.cargo) === filterValues.cargo) &&
        (!filterValues.nivel || normalizeSearch(entry.nivel) === filterValues.nivel) &&
        (!filterValues.genero || normalizeSearch(entry.genero) === filterValues.genero);

      if (!matchesFilters) return false;
      if (!searchClean) return true;

      const searchableText = [
        entry.nombre,
        entry.dni,
        entry.empresa,
        entry.area,
        entry.cargo,
        entry.ubicacion,
        entry.gradoInstruccion,
        entry.nivel,
        entry.nivelLiderazgo,
        entry.nivelPercepcion,
        entry.culturaReport?.tipo,
        entry.rolEquipoReport?.tipo,
        entry.comunicacionReport?.tipo,
        entry.percepcionReport?.tipo,
        entry.liderazgoReport?.tipo,
        entry.motivacionReport?.tipo,
      ]
        .map(normalizeSearch)
        .join(" ");

      return (
        searchableText.includes(searchClean) ||
        normalizeSearch(entry.dni).includes(searchAsDni)
      );
    });
  }, [data, search, filters]);

  const executiveSummary = useMemo(() => {
    const entries = data?.entries || [];
    const avg = (values: number[]) => values.length ? values.reduce((acc, value) => acc + value, 0) / values.length : 0;
    const dimensions = [
      { label: "Liderazgo", score: avg(entries.map((entry) => entry.puntuacionLiderazgo)) },
      { label: "Percepción", score: avg(entries.map((entry) => entry.puntuacionPercepcion)) },
      { label: "Cultura", score: avg(entries.map((entry) => scoreByType(entry.culturaReport?.tipo, "cultura"))) },
      { label: "Comunicación", score: avg(entries.map((entry) => scoreByType(entry.comunicacionReport?.tipo, "comunicacion"))) },
      { label: "Rol de equipo", score: avg(entries.map((entry) => scoreByType(entry.rolEquipoReport?.tipo, "rol"))) },
      { label: "Motivación", score: avg(entries.map((entry) => scoreByType(entry.motivacionReport?.tipo, "motivacion"))) },
    ];
    const sortedDimensions = [...dimensions].sort((a, b) => a.score - b.score);
    const high = entries.filter((entry) => entry.total >= 67).length;
    const medium = entries.filter((entry) => entry.total >= 34 && entry.total < 67).length;
    const low = entries.filter((entry) => entry.total < 34).length;
    const overall = avg(entries.map((entry) => entry.total));
    const traffic = getTrafficConfig(overall);

    return {
      total: entries.length,
      overall,
      high,
      medium,
      low,
      traffic,
      strongest: sortedDimensions[sortedDimensions.length - 1],
      weakest: sortedDimensions[0],
    };
  }, [data]);

  const heatmapData = useMemo(() => {
    const entries = data?.entries || [];
    const avg = (values: number[]) => values.length ? values.reduce((acc, value) => acc + value, 0) / values.length : 0;
    const buildRows = (groupKey: "area" | "empresa") => {
      const groups = new Map<string, DimensionesEntry[]>();
      entries.forEach((entry) => {
        const key = (entry[groupKey] || "No especificado").trim() || "No especificado";
        groups.set(key, [...(groups.get(key) || []), entry]);
      });

      return Array.from(groups.entries())
        .map(([name, groupEntries]) => {
          const metrics = [
            { key: "Liderazgo", score: avg(groupEntries.map((entry) => entry.puntuacionLiderazgo)) },
            { key: "Riesgos", score: avg(groupEntries.map((entry) => entry.puntuacionPercepcion)) },
            { key: "Cultura", score: avg(groupEntries.map((entry) => scoreByType(entry.culturaReport?.tipo, "cultura"))) },
            { key: "Comunic.", score: avg(groupEntries.map((entry) => scoreByType(entry.comunicacionReport?.tipo, "comunicacion"))) },
            { key: "Equipo", score: avg(groupEntries.map((entry) => scoreByType(entry.rolEquipoReport?.tipo, "rol"))) },
            { key: "Motiv.", score: avg(groupEntries.map((entry) => scoreByType(entry.motivacionReport?.tipo, "motivacion"))) },
          ];
          const overall = avg(metrics.map((metric) => metric.score));
          return {
            name,
            count: groupEntries.length,
            overall,
            metrics,
            weakest: [...metrics].sort((a, b) => a.score - b.score)[0],
          };
        })
        .sort((a, b) => a.overall - b.overall);
    };

    return {
      areas: buildRows("area"),
      empresas: buildRows("empresa"),
    };
  }, [data]);

  const selectedEntry = useMemo(() => {
    if (!data?.entries || selectedEntryId === null) return null;
    return data.entries.find((entry) => entry.id === selectedEntryId) || null;
  }, [data, selectedEntryId]);

  return {
    executiveSummary,
    filteredEntries,
    heatmapData,
    selectedEntry,
  };
};
