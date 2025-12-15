import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export interface PDFSection {
  title: string;
  headers: string[];
  rows: (string | number)[][];
}

export const generatePDF = ({
  sections,
  fileName,
}: {
  fileName: string;
  sections: PDFSection[];
}) => {
  const doc = new jsPDF("l", "mm", "a4");

  sections.forEach(({ title, headers, rows }, index) => {
    if (index > 0) {
      doc.addPage("l");
    }
    if (title) {
      doc.setFontSize(16);
      doc.text(title, 14, 15);
    }

    autoTable(doc, {
      startY: title ? 25 : 15,
      head: [headers],
      body: rows,
      theme: "striped",
      styles: { fontSize: 10 },
      headStyles: { fillColor: [40, 40, 40] },
    });
  });

  doc.save(`${fileName}.pdf`);
};
