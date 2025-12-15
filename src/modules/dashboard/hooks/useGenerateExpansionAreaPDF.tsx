"use client";

import { AreaProfile } from "@/types";
import { generatePDF } from "../utils";

export const useGenerateExpansionAreasPDF = (areaProfiles: AreaProfile[]) => {
  const downloadTopExpansionAreasPDF = () => {
    const topAreas = areaProfiles
      .sort((a, b) => {
        const scoreA = a.priority_score ?? a.similarity_score ?? 0;
        const scoreB = b.priority_score ?? b.similarity_score ?? 0;
        return scoreB - scoreA;
      })
      .slice(0, 15);

    const headers = [
      "Area Name",
      "City",
      "State",
      "Total POIs",
      "Urban Score",
      "Road Connectivity Score",
    ];

    const rows = topAreas.map((a) => [
      a.area_name ?? "None",
      a.city ?? "",
      a.state ?? "",
      a.poi_total ?? 0,
      a.urban_score?.toFixed(2) ?? "0.00",
      a.road_connectivity_score?.toFixed(2) ?? "0.00",
    ]);

    generatePDF({
      sections: [{ title: "Top 15 Expansion Areas", headers, rows }],
      fileName: "Top 15 Expansion Areas",
    });
  };

  return { downloadTopExpansionAreasPDF };
};

export default useGenerateExpansionAreasPDF;
