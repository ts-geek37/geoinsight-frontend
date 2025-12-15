import { AreaProfile, Store } from "@/types";
import { generatePDF } from "../utils";

const useGenerateCombinedPDF = (stores: Store[], areas: AreaProfile[]) => {
  const downloadCombinedPDF = () => {
    const storesWithRevenue = stores.map((s) => {
      const totalRevenue = s.yearly_revenue?.reduce(
        (acc, yr) => acc + (yr.revenue_inr ?? 0),
        0
      );
      return { ...s, totalRevenue };
    });

    const topStores = storesWithRevenue
      .sort((a, b) => (b.totalRevenue ?? 0) - (a.totalRevenue ?? 0))
      .slice(0, 20);

    const storeSection = {
      title: "Top 20 Stores by Revenue",
      headers: ["Name", "City", "State", "Revenue", "RFM Score", "RFM Segment"],
      rows: topStores.map((s) => [
        s.name,
        s.city,
        s.state,
        s.totalRevenue?.toLocaleString("en-IN") ?? "0",
        s.rfm_score.toFixed(2),
        s.rfm_segment,
      ]),
    };

    const topAreas = areas
      .sort((a, b) => {
        const scoreA = a.priority_score ?? a.similarity_score ?? 0;
        const scoreB = b.priority_score ?? b.similarity_score ?? 0;
        return scoreB - scoreA;
      })
      .slice(0, 15);

    const areaSection = {
      title: "Top 15 Expansion Areas",
      headers: [
        "Area Name",
        "City",
        "State",
        "Total POIs",
        "Urban Score",
        "Road Connectivity",
      ],
      rows: topAreas.map((a) => [
        a.area_name ?? "",
        a.city ?? "",
        a.state ?? "",
        a.poi_total ?? 0,
        a.urban_score ?? "0.00",
        a.road_connectivity_score ?? "0.00",
      ]),
    };

    generatePDF({
      fileName: "Combined Stores and Areas",
      sections: [storeSection, areaSection],
    });
  };
  return { downloadCombinedPDF };
};

export default useGenerateCombinedPDF;
