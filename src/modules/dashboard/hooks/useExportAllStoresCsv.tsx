import { Store } from "@/types";
import { useCallback } from "react";
import { exportToCSV } from "../utils";

type StoreCsvRow = {
  "Store Name": string;
  City: string;
  State: string;
  Pincode: string;
  Latitude: number;
  Longitude: number;
  "Store Type": string;
  "Store Size (sqft)": number;
  "Opening Date": string;
  "Revenue (INR)": number;
  "Avg Ticket Size (INR)": number;
  "Transaction Count": number;
  "RFM Score": number | null;
  "RFM Segment": string | null;
};

const useExportAllStoresCsv = (stores: Store[]) => {
  const exportStoresCsv = useCallback(() => {
    if (!stores?.length) return;

    const headers: (keyof StoreCsvRow)[] = [
      "Store Name",
      "City",
      "State",
      "Pincode",
      "Latitude",
      "Longitude",
      "Store Type",
      "Store Size (sqft)",
      "Opening Date",
      "Revenue (INR)",
      "Avg Ticket Size (INR)",
      "Transaction Count",
      "RFM Score",
      "RFM Segment",
    ];

    const rows: StoreCsvRow[] = stores.map((s) => {
      const latest = s.yearly_revenue?.at(-1);

      return {
        "Store Name": s.name ?? "",
        City: s.city ?? "",
        State: s.state ?? "",
        Pincode: s.pincode ?? "",
        Latitude: s.latitude,
        Longitude: s.longitude,
        "Store Type": s.store_type ?? "",
        "Store Size (sqft)": s.size_sqft ?? 0,
        "Opening Date": s.opening_date ?? "",
        "Revenue (INR)": latest?.revenue_inr ?? 0,
        "Avg Ticket Size (INR)": latest?.avg_ticket_size ?? 0,
        "Transaction Count": latest?.transaction_count ?? 0,
        "RFM Score": s.rfm_score ?? null,
        "RFM Segment": s.rfm_segment ?? null,
      };
    });

    exportToCSV("Stores Summary", headers, rows);
  }, [stores]);

  return { exportStoresCsv };
};

export default useExportAllStoresCsv;
