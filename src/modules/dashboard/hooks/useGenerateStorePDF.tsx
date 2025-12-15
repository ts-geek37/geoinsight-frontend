import { Store } from "@/types";
import "jspdf-autotable";
import { generatePDF } from "../utils";

const useGenerateStorePDF = (stores: Store[]) => {
  const downloadTopStoresPDF = () => {
    const topStores = stores
      .filter(
        (s) =>
          s.yearly_revenue.at(-1)?.revenue_inr !== undefined &&
          s.yearly_revenue.at(-1)?.revenue_inr !== null,
      )
      .sort(
        (a, b) =>
          (b.yearly_revenue.at(-1)?.revenue_inr ?? 0) - (a.yearly_revenue.at(-1)?.revenue_inr ?? 0),
      )
      .slice(0, 20);

    const headers = ["Name", "City", "State", "Revenue", "RFM Score", "RFM Segment"];

    const rows = topStores.map((s) => [
      s.name,
      s.city,
      s.state,
      s.yearly_revenue.at(-1)?.revenue_inr?.toLocaleString("en-IN", { maximumFractionDigits: 0 }) ??
        "0",
      s.rfm_score.toFixed(2),
      s.rfm_segment,
    ]);

    generatePDF({
      sections: [{ title: "Top 20 Stores by Revenue", headers, rows }],
      fileName: "Top 20 Stores",
    });
  };
  return { downloadTopStoresPDF };
};

export default useGenerateStorePDF;
