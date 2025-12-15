import { Store } from "@/types";
import { exportToCSV } from "../utils";
import { getFormattedLatestRevenue } from "@/utils/formatRevenue";

const useExportAllStoresCsv = (stores: Store[]) => {
  const exportStoresCsv = () => {
    const headers = [
      "Store_Name",
      "City",
      "State",
      "Revenue",
      "RFM_score",
      "RFM_segment",
    ];

    const rows = stores.map((s) => ({
      name: s.name,
      city: s.city,
      state: s.state,
      revenue: s.yearly_revenue.at(-1)?.revenue_inr ?? 0,
      rfm_score: s.rfm_score,
      rfm_segment: s.rfm_segment,
    }));

    exportToCSV("All Stores Summary", headers, rows);
  };

  return { exportStoresCsv };
};

export default useExportAllStoresCsv;
