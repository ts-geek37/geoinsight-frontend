import { Sales, Store } from "@/types";
import { exportToCSV } from "../utils";

const useExportStorePerformanceCsv = (stores: Store[], records: Sales[]) => {
  const exportStorePerformance = () => {
    const headers = [
      "store_id",
      "store_name",
      "city",
      "state",
      "year",
      "month",
      "revenue_inr",
      "transaction_count",
      "avg_ticket_size",
    ];

    const rows = records.map((rec) => {
      const store = stores.find((st) => {
        return st.id === rec.store_id;
      });

      return {
        store_id: rec.store_id,
        store_name: store?.name ?? "",
        city: store?.city ?? "",
        state: store?.state ?? "",
        year: rec.year,
        month: rec.month,
        revenue_inr: rec.revenue_inr,
        transaction_count: rec.transaction_count,
        avg_ticket_size: rec.avg_ticket_size,
      };
    });

    exportToCSV("Store Performance", headers, rows);
  };

  return { exportStorePerformance };
};

export default useExportStorePerformanceCsv;
