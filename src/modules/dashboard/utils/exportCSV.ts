import { SimilarAreaResult } from "@/types";

export const exportToCSV = (
  filename: string,
  headers: string[],
  data: Array<Record<string, string | number | undefined>>
): void => {
  // Prevent running in SSR
  if (!window || typeof window === "undefined") return;

  const csvContent = [
    headers.join(","),
    ...data.map((row) =>
      headers
        .map((header) => {
          const value = row[header] ?? "";
          const escaped = String(value).replace(/"/g, '""');
          return typeof value === "string" &&
            (value.includes(",") || value.includes('"') || value.includes("\n"))
            ? `"${escaped}"`
            : escaped;
        })
        .join(",")
    ),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}.csv`);
  link.style.visibility = "hidden";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const onExport = (sortedAreas: SimilarAreaResult[]) => {
  const headers = [
    "Area Name",
    "City",
    "State",
    "Population 1km",
    "Population 3km",
    "Population 5km",
    "Literacy Rate",
    "Age 25-55 %",
    "POI Total",
    "POI Normalized",
    "Urban Score",
    "POI Activity Score",
    "Income High %",
  ];

  const rows = sortedAreas.map(({ area }) => ({
    "Area Name": area.area_name ?? "",
    City: area.city ?? "",
    State: area.state ?? "",
    "Population 1km": area.population_1km ?? 0,
    "Population 3km": area.population_3km ?? 0,
    "Population 5km": area.population_5km ?? 0,
    "Literacy Rate": area.literacy_rate ?? 0,
    "Age 25-55 %": area.age_25_55_pct ?? 0,
    "POI Total": area.poi_total ?? 0,
    "POI Normalized": area.poi_normalized ?? 0,
    "Urban Score": area.urban_score ?? 0,
    "POI Activity Score": area.poi_activity_score ?? 0,
    "Income High %": area.income_high_percentage ?? 0,
  }));

  exportToCSV("Similar Areas Summary", headers, rows);
};
