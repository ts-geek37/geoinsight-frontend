import { useCallback } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useLazyGetStoreAreaSummaryQuery } from "@/api/similarityApi";
import { formatIndianNumber } from "@/utils/formatRevenue";

type RGB = [number, number, number];

const formatCr = (value: number) => `${(value / 1e7).toFixed(2)} Cr`;
const formatNumber = (value: number) =>
  new Intl.NumberFormat("en-IN", { maximumFractionDigits: 2 }).format(value);

const theme = {
  colors: {
    textPrimary: [17, 24, 39] as RGB,
    textMuted: [107, 114, 128] as RGB,
    border: [229, 231, 235] as RGB,
    headerBg: [31, 41, 55] as RGB,
    headerText: [255, 255, 255] as RGB,
    subHeaderBg: [229, 231, 235] as RGB,
    tableAltRow: [249, 250, 251] as RGB,
    tableAltRowDark: [243, 244, 246] as RGB,
  },
  font: {
    title: 18,
    section: 16,
    body: 11,
    small: 9,
  },
  marginX: 40,
};

const useStoreAreaSummaryPdf = () => {
  const [fetchSummary, { isFetching, isError }] = useLazyGetStoreAreaSummaryQuery();

  const createPdf = useCallback(async () => {
    const result = await fetchSummary().unwrap();
    if (!result) return;

    const doc = new jsPDF({ unit: "pt", format: "a4" });

    doc.setFontSize(theme.font.title);
    doc.setTextColor(
      theme.colors.textPrimary[0],
      theme.colors.textPrimary[1],
      theme.colors.textPrimary[2],
    );
    doc.text("Store Opportunity Summary", theme.marginX, 50);

    doc.setFontSize(theme.font.small);
    doc.setTextColor(
      theme.colors.textMuted[0],
      theme.colors.textMuted[1],
      theme.colors.textMuted[2],
    );
    doc.text(`Generated on: ${new Date(result.generated_at).toLocaleString()}`, theme.marginX, 70);

    autoTable(doc, {
      startY: 90,
      head: [["Rank", "Store", "City", "Revenue", "RFM Score", "Rank Score"]],
      body: result.results.map((r, i) => [
        i + 1,
        r.store.name,
        r.store.city,
        formatCr(r.store.revenue_latest_year),
        formatNumber(r.store.rfm_score),
        formatNumber(r.store.rank_score),
      ]),
      styles: {
        fontSize: theme.font.small,
        textColor: theme.colors.textPrimary,
        lineColor: theme.colors.border,
        lineWidth: 0.5,
      },
      headStyles: {
        fillColor: theme.colors.headerBg,
        textColor: theme.colors.headerText,
        fontStyle: "bold",
      },
      alternateRowStyles: {
        fillColor: theme.colors.tableAltRow,
      },
      columnStyles: {
        0: { halign: "center" },
        3: { halign: "right" },
        4: { halign: "right" },
        5: { halign: "right" },
      },
      margin: { left: theme.marginX, right: theme.marginX },
    });

    result.results.forEach((item) => {
      doc.addPage();
      let y = 50;

      doc.setFontSize(theme.font.section);
      doc.setTextColor(
        theme.colors.textPrimary[0],
        theme.colors.textPrimary[1],
        theme.colors.textPrimary[2],
      );
      doc.text(item.store.name, theme.marginX, y);
      y += 18;

      doc.setFontSize(theme.font.body);
      doc.setTextColor(
        theme.colors.textMuted[0],
        theme.colors.textMuted[1],
        theme.colors.textMuted[2],
      );
      doc.text(`${item.store.city}, ${item.store.state}`, theme.marginX, y);
      y += 20;

      autoTable(doc, {
        startY: y,
        head: [["Metric", "Value"]],
        body: [
          ["Revenue (Latest Year)", formatIndianNumber(item.store.revenue_latest_year)],
          ["RFM Score", formatNumber(item.store.rfm_score)],
          ["Rank Score", formatNumber(item.store.rank_score)],
          ["Base Area", `${item.baseArea.area_name} (${item.baseArea.city})`],
        ],
        styles: {
          fontSize: theme.font.body,
          textColor: theme.colors.textPrimary,
          lineColor: theme.colors.border,
        },
        headStyles: {
          fillColor: theme.colors.subHeaderBg,
          textColor: theme.colors.textPrimary,
          fontStyle: "bold",
        },
        alternateRowStyles: {
          fillColor: theme.colors.tableAltRow,
        },
        margin: { left: theme.marginX, right: theme.marginX },
      });

      autoTable(doc, {
        startY: (doc as any).lastAutoTable.finalY + 20,
        head: [["Rank", "Area", "City", "Similarity (%)", "Priority Score"]],
        body: item.areas.map((a, i) => [
          i + 1,
          a.area.area_name ?? "",
          a.area.city ?? "",
          formatNumber(a.similarityScore ?? 0),
          formatNumber(a.priorityScore ?? 0),
        ]),
        styles: {
          fontSize: theme.font.small,
          textColor: theme.colors.textPrimary,
          lineColor: theme.colors.border,
          lineWidth: 0.5,
        },
        headStyles: {
          fillColor: theme.colors.headerBg,
          textColor: theme.colors.headerText,
          fontStyle: "bold",
        },
        alternateRowStyles: {
          fillColor: theme.colors.tableAltRowDark,
        },
        columnStyles: {
          0: { halign: "center" },
          3: { halign: "right" },
          4: { halign: "right" },
        },
        margin: { left: theme.marginX, right: theme.marginX },
      });
    });

    doc.save("store_opportunity_summary.pdf");
  }, [fetchSummary]);

  return {
    createPdf,
    isLoading: isFetching,
    isError,
  };
};

export default useStoreAreaSummaryPdf;
