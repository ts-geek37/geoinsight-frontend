export const exportToCSV = (
  filename: string,
  headers: string[],
  data: Array<Record<string, string | number | null | undefined>>,
): void => {
  if (typeof window === "undefined") return;
  if (!data.length) return;

  const escapeValue = (value: unknown): string => {
    if (value === null || value === undefined) return "";

    const str = String(value);
    const escaped = str.replace(/"/g, '""');

    return /[",\n]/.test(str) ? `"${escaped}"` : escaped;
  };

  const csvContent = [
    headers.join(","),
    ...data.map((row) => headers.map((header) => escapeValue(row[header])).join(",")),
  ].join("\n");

  const blob = new Blob([csvContent], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = `${filename}.csv`;
  link.style.display = "none";

  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

import { SimilarityResponseDTO } from "@/types";

export const onExport = (
  candidates: SimilarityResponseDTO["candidates"],
  store: { name: string },
) => {
  const baseHeaders = [
    "Base Store Name",
    "Similarity Rank",
    "Area Name",
    "City",
    "Similarity Score (%)",
  ];

  const metricLabels = candidates[0]?.metrics.map((m) => m.label) ?? [];

  const headers = [
    ...baseHeaders,
    ...metricLabels.map((l) => `Store - ${l}`),
    ...metricLabels.map((l) => `Candidate - ${l}`),
  ];

  const rows = candidates.map((item, index) => {
    const metricMap: Record<string, string> = {};

    item.metrics.forEach((m) => {
      metricMap[`Store - ${m.label}`] = m.store;
      metricMap[`Candidate - ${m.label}`] = m.candidate;
    });

    return {
      "Base Store Name": store.name,
      "Similarity Rank": index + 1,
      "Area Name": item.area.name,
      City: item.area.city,
      "Similarity Score (%)": item.similarityScore,
      ...metricMap,
    };
  });

  exportToCSV(`similar_areas_for_${store.name.replace(/\s+/g, "_").toLowerCase()}`, headers, rows);
};
