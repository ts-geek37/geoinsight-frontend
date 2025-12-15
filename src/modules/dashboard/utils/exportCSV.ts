import { SimilarAreaResult } from "@/types";

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

export const onExport = (
  sortedAreas: SimilarAreaResult[],
  store: { name: string; city?: string; state?: string },
) => {
  const headers = [
    "Base Store Name",
    "Base Store City",
    "Base Store State",
    "Similarity Rank",
    "Similarity Score (%)",
    "Priority Score",

    "Area Name",
    "City",
    "State",

    "Population (1km)",
    "Population (3km)",
    "Population (5km)",

    "Literacy Rate (%)",
    "Age 25–55 (%)",
    "Income High (%)",

    "POI Total",
    "POI Normalized",
    "POI Activity Score",
    "Urban Score",
  ];

  const rows = sortedAreas.map(({ area, similarityScore, priorityScore }, index) => ({
    "Base Store Name": store.name,
    "Base Store City": store.city ?? "",
    "Base Store State": store.state ?? "",

    "Similarity Rank": index + 1,
    "Similarity Score (%)": similarityScore,
    "Priority Score": priorityScore,

    "Area Name": area.area_name ?? "",
    City: area.city ?? "",
    State: area.state ?? "",

    "Population (1km)": area.population_1km ?? 0,
    "Population (3km)": area.population_3km ?? 0,
    "Population (5km)": area.population_5km ?? 0,

    "Literacy Rate (%)": area.literacy_rate ?? 0,
    "Age 25–55 (%)": area.age_25_55_pct ?? 0,
    "Income High (%)": area.income_high_percentage ?? 0,

    "POI Total": area.poi_total ?? 0,
    "POI Normalized": area.poi_normalized ?? 0,
    "Urban Score": area.urban_score ?? 0,
  }));

  exportToCSV(`similar_areas_for_${store.name.replace(/\s+/g, "_").toLowerCase()}`, headers, rows);
};
