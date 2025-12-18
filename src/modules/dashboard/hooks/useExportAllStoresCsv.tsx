import { StoreMapItemDTO } from "@/types";
import { useCallback } from "react";
import { exportToCSV } from "../utils";

const useExportAllStoresCsv = (stores: StoreMapItemDTO[]) => {
  const exportStoresCsv = useCallback(() => {
    if (!stores.length) return;

    const headers: string[] = [
      "Store Name",
      "City",
      "State",
      "Latitude",
      "Longitude",
      "Revenue (INR)",
      "RFM Score",
      "RFM Segment",
    ];

    const rows = stores.map((s) => ({
      "Store Name": s.name,
      City: s.city,
      State: s.state,
      Latitude: s.latitude,
      Longitude: s.longitude,
      "Revenue (INR)": s.latestRevenue,
      "RFM Score": s.rfmScore,
      "RFM Segment": s.rfmSegment,
    }));

    exportToCSV("stores_summary", headers, rows);
  }, [stores]);

  return { exportStoresCsv };
};

export default useExportAllStoresCsv;
