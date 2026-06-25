import { jsPDF } from "jspdf";
import type { DriverSafetyEntry } from "@/lib/sheets-adapter";
import { RECOMMENDATIONS, REPORT_ACTIONS } from "../constants";
import { getAnalysis } from "../utils";

type Html2Canvas = (
  element: HTMLElement | null,
  options: Record<string, unknown>,
) => Promise<HTMLCanvasElement>;

interface PrintFilteredReportOptions {
  filteredEntries: DriverSafetyEntry[];
  companyFilters: string[];
  areaFilters: string[];
  levelFilters: string[];
  positionFilters: string[];
  statusFilters: string[];
  conditionFilters: string[];
  mode?: "consolidated" | "byCompany";
  fileName?: string;
}

export type DriverSafetyExcelColumnKey =
  | "id"
  | "name"
  | "dni"
  | "company"
  | "area"
  | "level"
  | "position"
  | "line"
  | "date"
  | "status"
  | "internalScore"
  | "externalScore"
  | "totalScore"
  | "validation"
  | "result";

export interface DriverSafetyExcelColumn {
  key: DriverSafetyExcelColumnKey;
  label: string;
  width: number;
}

export const DRIVER_SAFETY_EXCEL_COLUMNS: DriverSafetyExcelColumn[] = [
  { key: "id", label: "ID", width: 12 },
  { key: "name", label: "Evaluado", width: 45 },
  { key: "dni", label: "DNI", width: 16 },
  { key: "company", label: "Empresa", width: 35 },
  { key: "area", label: "Area", width: 28 },
  { key: "level", label: "Trabajo Nivel", width: 22 },
  { key: "position", label: "Puesto", width: 28 },
  { key: "line", label: "Linea", width: 18 },
  { key: "date", label: "Fecha", width: 16 },
  { key: "status", label: "Estado", width: 18 },
  { key: "internalScore", label: "Interno", width: 14 },
  { key: "externalScore", label: "Externo", width: 14 },
  { key: "totalScore", label: "Total", width: 14 },
  { key: "validation", label: "Validacion", width: 18 },
  { key: "result", label: "Condicion", width: 22 },
];

export const downloadExcelDashboard = async (filteredEntries: DriverSafetyEntry[]) => {
    const excelWindow = window.open("", "_blank");
    if (!excelWindow) return;

    const browserWindow = window as Window & { html2canvas?: Html2Canvas };
    const h2c =
      browserWindow.html2canvas ||
      (await new Promise<Html2Canvas>((resolve) => {
        const script = document.createElement("script");
        script.src =
          "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js";
        script.onload = () => resolve(browserWindow.html2canvas as Html2Canvas);
        document.head.appendChild(script);
      }));

    const pieElement = document.getElementById("dashboard-pie-chart");
    const compElement = document.getElementById("dashboard-comparison-chart");

    const [pieCanvas, compCanvas] = await Promise.all([
      h2c(pieElement, { scale: 2, useCORS: true }),
      h2c(compElement, { scale: 2, useCORS: true }),
    ]);

    const pieImg = pieCanvas.toDataURL("image/png");
    const compImg = compCanvas.toDataURL("image/png");

    const excelData = filteredEntries.map((entry) => ({
      ID: `LOC-${entry.id}`,
      Nombre: entry.name,
      DNI: entry.dni,
      Empresa: entry.company,
      Area: entry.area,
      Fecha: entry.date,
      Puesto: entry.position,
      Linea: entry.line,
      Nivel: entry.level,
      "Puntaje Interno": entry.internalScore,
      "Puntaje Externo": entry.externalScore,
      Balance: entry.internalScore - entry.externalScore,
      Resultado: entry.result,
      Diagnóstico: getAnalysis(entry.result, entry.internalScore),
    }));

    const script = `
        <script src="https://cdn.jsdelivr.net/npm/exceljs/dist/exceljs.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js"></script>
        <script>
          window.onload = async () => {
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Dashboard Data');
            
            // Título
            worksheet.mergeCells('A1:L1');
            const titleCell = worksheet.getCell('A1');
            titleCell.value = 'REPORTE EJECUTIVO - DRIVER SAFETY';
            titleCell.font = { size: 16, bold: true, color: { argb: 'FFFFFFFF' } };
            titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E1B4B' } };
            titleCell.alignment = { horizontal: 'center' };

            // Gráficos
            let currentY = 3;
            const pieImgSource = ${JSON.stringify(pieImg)};
            if (pieImgSource && pieImgSource !== "null") {
              const imgId = workbook.addImage({ base64: pieImgSource, extension: 'png' });
              worksheet.addImage(imgId, {
                tl: { col: 0, row: currentY },
                ext: { width: 350, height: 300 }
              });
            }

            const compImgSource = ${JSON.stringify(compImg)};
            if (compImgSource && compImgSource !== "null") {
              const imgId = workbook.addImage({ base64: compImgSource, extension: 'png' });
              worksheet.addImage(imgId, {
                tl: { col: 4, row: currentY },
                ext: { width: 550, height: 300 }
              });
            }

            currentY += 18;

            // Tabla de Datos
            const headers = ['ID', 'Nombre', 'DNI', 'Empresa', 'Fecha', 'Puesto', 'Nivel', 'Interno', 'Externo', 'Balance', 'Resultado', 'Diagnóstico'];
            const headerRow = worksheet.getRow(currentY);
            headers.forEach((h, i) => {
              const cell = headerRow.getCell(i + 1);
              cell.value = h;
              cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
              cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF4F46E5' } };
            });

            const data = ${JSON.stringify(excelData)};
            data.forEach((item, idx) => {
              const row = worksheet.getRow(currentY + 1 + idx);
              row.getCell(1).value = item.ID;
              row.getCell(2).value = item.Nombre;
              row.getCell(3).value = item.DNI;
              row.getCell(4).value = item.Empresa;
              row.getCell(5).value = item.Fecha;
              row.getCell(6).value = item.Puesto;
              row.getCell(7).value = item.Nivel;
              row.getCell(8).value = item['Puntaje Interno'];
              row.getCell(9).value = item['Puntaje Externo'];
              row.getCell(10).value = item.Balance;
              row.getCell(11).value = item.Resultado;
              row.getCell(12).value = item.Diagnóstico;
              row.getCell(12).alignment = { wrapText: true, vertical: 'middle' };

              // Formato condicional colores
              const resCell = row.getCell(11);
              if (item.Resultado === 'RIESGO BAJO') {
                resCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD1FAE5' } };
                resCell.font = { color: { argb: 'FF059669' }, bold: true };
              } else if (item.Resultado === 'RIESGO MEDIO') {
                resCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFEF3C7' } };
                resCell.font = { color: { argb: 'FFD97706' }, bold: true };
              } else {
                resCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFEE2E2' } };
                resCell.font = { color: { argb: 'FFDC2626' }, bold: true };
              }
            });

            // Ajustes de ancho
            worksheet.getColumn(1).width = 12;
            worksheet.getColumn(2).width = 30;
            worksheet.getColumn(3).width = 14;
            worksheet.getColumn(4).width = 20;
            worksheet.getColumn(5).width = 25;
            worksheet.getColumn(10).width = 15;
            worksheet.getColumn(12).width = 50;

            const buffer = await workbook.xlsx.writeBuffer();
            saveAs(new Blob([buffer]), "Reporte_General_Driver_Safety.xlsx");
            setTimeout(() => window.close(), 1000);
          };
        </script>
    `;

    excelWindow.document.write(script);
    excelWindow.document.close();
};

export const printFilteredReport = ({
  filteredEntries,
  companyFilters,
  areaFilters,
  levelFilters,
  positionFilters,
  statusFilters,
  conditionFilters,
  mode = "consolidated",
  fileName,
}: PrintFilteredReportOptions) => {
    const activeFilters: string[] = [];
    if (companyFilters.length > 0)
      activeFilters.push(`${companyFilters.length} Emp.`);
    if (areaFilters.length > 0)
      activeFilters.push(`${areaFilters.length} Area`);
    if (levelFilters.length > 0)
      activeFilters.push(`${levelFilters.length} Niv.`);
    if (positionFilters.length > 0)
      activeFilters.push(`${positionFilters.length} Puesto`);
    if (statusFilters.length > 0)
      activeFilters.push(`${statusFilters.length} Est.`);
    if (conditionFilters.length > 0)
      activeFilters.push(conditionFilters.join(", "));

    const filterTitle =
      activeFilters.length > 0
        ? activeFilters.join(" - ")
        : "Consolidado General";
    const total = filteredEntries.length;
    const counts = {
      low: filteredEntries.filter((entry) => entry.result === "RIESGO BAJO")
        .length,
      medium: filteredEntries.filter(
        (entry) => entry.result === "RIESGO MEDIO",
      ).length,
      high: filteredEntries.filter((entry) => entry.result === "RIESGO ALTO")
        .length,
      review: filteredEntries.filter((entry) => entry.result === "ERROR")
        .length,
    };
    const groupedEntries = filteredEntries.reduce(
      (groups, entry) => {
        const company = (entry.company || "SIN EMPRESA").trim().toUpperCase();
        (groups[company] ??= []).push(entry);
        return groups;
      },
      {} as Record<string, DriverSafetyEntry[]>,
    );

    if (mode === "byCompany") {
      Object.keys(groupedEntries)
        .sort()
        .forEach((company, index) => {
          const safeCompany = company
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-zA-Z0-9_-]+/g, "_")
            .replace(/^_+|_+$/g, "");

          window.setTimeout(() => {
            printFilteredReport({
              filteredEntries: groupedEntries[company],
              companyFilters,
              areaFilters,
              levelFilters,
              positionFilters,
              statusFilters,
              conditionFilters,
              mode: "consolidated",
              fileName: `Informe_Driver_Safety_${safeCompany || "SIN_EMPRESA"}.pdf`,
            });
          }, index * 250);
        });
      return;
    }

    const pdf = new jsPDF("portrait", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 14;
    const contentWidth = pageWidth - margin * 2;
    const tableTop = 58;
    const bottomLimit = pageHeight - 16;
    const columns = [10, 55, 32, contentWidth - 97];
    let y = tableTop;

    const drawPageHeader = (company: string) => {
      pdf.setFillColor(30, 27, 75);
      pdf.rect(0, 0, pageWidth, 28, "F");
      pdf.setTextColor(255, 255, 255);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(15);
      pdf.text("INFORME DRIVER SAFETY", margin, 10);
      pdf.setFontSize(10);
      pdf.text(`EMPRESA: ${company}`, margin, 17);
      pdf.setFontSize(8);
      pdf.setFont("helvetica", "normal");
      pdf.text(`Filtros: ${filterTitle}`, margin, 23);
      pdf.text(
        `Registros empresa: ${groupedEntries[company].length} | Total: ${total}`,
        pageWidth - margin,
        23,
        {
          align: "right",
        },
      );

      const summary = [
        ["RIESGO BAJO", counts.low, [21, 128, 61]],
        ["RIESGO MEDIO", counts.medium, [180, 83, 9]],
        ["RIESGO ALTO", counts.high, [185, 28, 28]],
        ["REVISAR", counts.review, [71, 85, 105]],
      ] as const;
      const boxWidth = contentWidth / summary.length;
      summary.forEach(([label, value, color], index) => {
        const x = margin + index * boxWidth;
        pdf.setFillColor(color[0], color[1], color[2]);
        pdf.rect(x, 32, boxWidth - 2, 16, "F");
        pdf.setTextColor(255, 255, 255);
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(8);
        pdf.text(label, x + 3, 38);
        pdf.setFontSize(13);
        pdf.text(String(value), x + boxWidth - 5, 44, { align: "right" });
      });
    };

    const drawTableHeader = () => {
      const labels = ["N", "APELLIDOS Y NOMBRES", "RESULTADO", "ACCION RECOMENDADA"];
      let x = margin;
      pdf.setFillColor(30, 27, 75);
      pdf.setTextColor(255, 255, 255);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(7);
      labels.forEach((label, index) => {
        pdf.rect(x, y, columns[index], 8, "F");
        pdf.text(label, x + 2, y + 5);
        x += columns[index];
      });
      y += 8;
    };

    const addPage = (company: string) => {
      pdf.addPage();
      drawPageHeader(company);
      y = tableTop;
      drawTableHeader();
    };

    Object.keys(groupedEntries)
      .sort()
      .forEach((company, companyIndex) => {
        if (companyIndex > 0) pdf.addPage();
        drawPageHeader(company);
        y = tableTop;
        drawTableHeader();

        pdf.setFillColor(226, 232, 240);
        pdf.setTextColor(15, 23, 42);
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(8);
        pdf.rect(margin, y, contentWidth, 8, "F");
        pdf.text(
          `EMPRESA: ${company} (${groupedEntries[company].length} registros)`,
          margin + 2,
          y + 5,
        );
        y += 8;

        groupedEntries[company].forEach((entry, index) => {
          const action =
            REPORT_ACTIONS[entry.result as keyof typeof REPORT_ACTIONS] ??
            REPORT_ACTIONS.ERROR;
          const nameLines = pdf.splitTextToSize(entry.name || "-", columns[1] - 4);
          const resultLines = pdf.splitTextToSize(entry.result || "ERROR", columns[2] - 4);
          const actionLines = pdf.splitTextToSize(action, columns[3] - 4);
          const lineCount = Math.max(
            nameLines.length,
            resultLines.length,
            actionLines.length,
          );
          const rowHeight = Math.max(9, lineCount * 4 + 4);

          if (y + rowHeight > bottomLimit) addPage(company);

          let x = margin;
          pdf.setDrawColor(203, 213, 225);
          pdf.setLineWidth(0.15);
          columns.forEach((width) => {
            pdf.rect(x, y, width, rowHeight);
            x += width;
          });

          pdf.setFontSize(7);
          pdf.setTextColor(51, 65, 85);
          pdf.setFont("helvetica", "normal");
          pdf.text(String(index + 1), margin + columns[0] / 2, y + 5, {
            align: "center",
          });
          pdf.setFont("helvetica", "bold");
          pdf.text(nameLines, margin + columns[0] + 2, y + 5);

          const resultColor =
            entry.result === "RIESGO BAJO"
              ? [5, 150, 105]
              : entry.result === "RIESGO MEDIO"
                ? [217, 119, 6]
                : entry.result === "RIESGO ALTO"
                  ? [220, 38, 38]
                  : [100, 116, 139];
          pdf.setTextColor(resultColor[0], resultColor[1], resultColor[2]);
          pdf.text(resultLines, margin + columns[0] + columns[1] + 2, y + 5);
          pdf.setFont("helvetica", "normal");
          pdf.setTextColor(71, 85, 105);
          pdf.text(
            actionLines,
            margin + columns[0] + columns[1] + columns[2] + 2,
            y + 5,
          );
          y += rowHeight;
        });
      });

    const pageCount = pdf.getNumberOfPages();
    for (let page = 1; page <= pageCount; page += 1) {
      pdf.setPage(page);
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(7);
      pdf.setTextColor(100, 116, 139);
      pdf.text(`Pagina ${page} de ${pageCount}`, pageWidth - margin, pageHeight - 7, {
        align: "right",
      });
    }

    const safeFilterTitle = filterTitle
      .replace(/[^a-zA-Z0-9_-]+/g, "_")
      .replace(/^_+|_+$/g, "");
    pdf.save(
      fileName || `Informe_Driver_Safety_${safeFilterTitle || "General"}.pdf`,
    );
};

export const printDashboard = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    // Capturamos el contenido actual (Dashboard o Lista)
    const container = document.querySelector(".flex-1.space-y-12");
    if (!container) return;

    const contentHtml = container.innerHTML;

    const reportHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Dashboard Driver Safety</title>
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap" rel="stylesheet">
          <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            body { background: white; font-family: 'Inter', sans-serif; padding: 40px; }
            .no-print { display: none !important; }
            canvas, .recharts-responsive-container { min-height: 300px !important; }
          </style>
        </head>
        <body>
          <div id="print-area">
            ${contentHtml}
          </div>
          <script>
            window.onload = () => {
              // Limpiar elementos no deseados de la captura
              document.querySelectorAll('button').forEach(b => b.classList.add('no-print'));
              
              const element = document.getElementById('print-area');
              html2pdf().from(element).set({
                margin: 10,
                filename: 'Dashboard_Driver_Safety.pdf',
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 1.5, useCORS: true, logging: false },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' }
              }).save().then(() => {
                setTimeout(() => window.close(), 1000);
              });
            };
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(reportHtml);
    printWindow.document.close();
};

export const exportBulkExcel = async (
  filteredEntries: DriverSafetyEntry[],
  selectedColumnKeys: DriverSafetyExcelColumnKey[] = DRIVER_SAFETY_EXCEL_COLUMNS.map(
    (column) => column.key,
  ),
) => {
    const excelWindow = window.open("", "_blank");
    if (!excelWindow) return;

    const requestedColumns = DRIVER_SAFETY_EXCEL_COLUMNS.filter((column) =>
      selectedColumnKeys.includes(column.key),
    );
    const selectedColumns =
      requestedColumns.length > 0 ? requestedColumns : DRIVER_SAFETY_EXCEL_COLUMNS;

    excelWindow.document.write(`
      <html>
        <head>
          <title>Generando Excel...</title>
          <style>
            body { font-family: sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; background: #f8fafc; color: #1e293b; }
            .loader { border: 4px solid #e2e8f0; border-top: 4px solid #2563eb; border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; margin-bottom: 20px; }
            @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
            .status { font-weight: 800; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; }
          </style>
        </head>
        <body>
          <div class="loader"></div>
          <div id="status" class="status">Generando archivo Excel...</div>
          <script src="https://cdn.jsdelivr.net/npm/exceljs@4.4.0/dist/exceljs.min.js"></script>
          <script src="https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js"></script>
          <script>
            (async function() {
              try {
                let attempts = 0;
                while (!window.ExcelJS && attempts < 50) {
                  await new Promise(resolve => setTimeout(resolve, 100));
                  attempts++;
                }

                if (!window.ExcelJS) throw new Error("No se pudo cargar ExcelJS");

                const entries = ${JSON.stringify(filteredEntries)};
                const selectedColumns = ${JSON.stringify(selectedColumns)};
                const companyCounts = entries.reduce((counts, entry) => {
                  const company = entry.company || "Sin empresa";
                  counts[company] = (counts[company] || 0) + 1;
                  return counts;
                }, {});
                const sortedEntries = [...entries].sort((a, b) => {
                  const companyA = a.company || "Sin empresa";
                  const companyB = b.company || "Sin empresa";
                  const countDiff = (companyCounts[companyB] || 0) - (companyCounts[companyA] || 0);
                  if (countDiff !== 0) return countDiff;
                  const companyDiff = companyA.localeCompare(companyB, "es", { sensitivity: "base" });
                  if (companyDiff !== 0) return companyDiff;
                  return (a.name || "").localeCompare(b.name || "", "es", { sensitivity: "base" });
                });
                const valueByKey = {
                  id: (entry) => entry.id ? "#" + entry.id : "",
                  name: (entry) => entry.name || "",
                  dni: (entry) => entry.dni || "No registrado",
                  company: (entry) => entry.company || "Sin empresa",
                  area: (entry) => entry.area || "",
                  level: (entry) => entry.level || "",
                  position: (entry) => entry.position || "",
                  line: (entry) => entry.line || "",
                  date: (entry) => entry.date || "",
                  status: (entry) => entry.status || "",
                  internalScore: (entry) => entry.internalScore ?? "",
                  externalScore: (entry) => entry.externalScore ?? "",
                  totalScore: (entry) => typeof entry.totalScore === "number" ? entry.totalScore + "/23" : "",
                  validation: (entry) => entry.validation || "",
                  result: (entry) => entry.result || "",
                };
                const workbook = new ExcelJS.Workbook();
                workbook.creator = "LideraMina";
                workbook.created = new Date();

                const worksheet = workbook.addWorksheet("Evaluados");
                worksheet.columns = selectedColumns.map((column) => ({
                  header: column.label,
                  key: column.key,
                  width: column.width,
                }));

                worksheet.getRow(1).eachCell((cell) => {
                  cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
                  cell.fill = {
                    type: "pattern",
                    pattern: "solid",
                    fgColor: { argb: "FF1E293B" },
                  };
                  cell.alignment = { horizontal: "center" };
                  cell.border = {
                    top: { style: "thin" },
                    left: { style: "thin" },
                    bottom: { style: "thin" },
                    right: { style: "thin" },
                  };
                });

                sortedEntries.forEach((entry) => {
                  const row = {};
                  selectedColumns.forEach((column) => {
                    row[column.key] = valueByKey[column.key](entry);
                  });
                  worksheet.addRow(row);
                });

                worksheet.eachRow((row, rowNumber) => {
                  if (rowNumber === 1) return;
                  row.eachCell((cell) => {
                    cell.border = {
                      top: { style: "thin" },
                      left: { style: "thin" },
                      bottom: { style: "thin" },
                      right: { style: "thin" },
                    };
                    cell.alignment = { vertical: "middle" };
                    if (rowNumber > 1 && cell.value === "RIESGO BAJO") {
                      cell.font = { bold: true, color: { argb: "FF047857" } };
                    }
                    if (rowNumber > 1 && cell.value === "RIESGO MEDIO") {
                      cell.font = { bold: true, color: { argb: "FFD97706" } };
                    }
                    if (rowNumber > 1 && cell.value === "RIESGO ALTO") {
                      cell.font = { bold: true, color: { argb: "FFDC2626" } };
                    }
                  });
                });

                worksheet.autoFilter = {
                  from: { row: 1, column: 1 },
                  to: { row: 1, column: selectedColumns.length },
                };
                worksheet.views = [{ state: "frozen", ySplit: 1 }];

                const buffer = await workbook.xlsx.writeBuffer();
                saveAs(
                  new Blob([buffer], {
                    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                  }),
                  "Driver_Safety_Grupal.xlsx"
                );
                setTimeout(() => window.close(), 1200);
              } catch (err) {
                document.getElementById("status").innerHTML = "ERROR: " + err.message;
                console.error(err);
              }
            })();
          </script>
        </body>
      </html>
    `);
    return;

    excelWindow.document.write(`
      <html>
        <head>
          <title>Generando Base Completa...</title>
          <style>
            body { font-family: sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; background: #f8fafc; color: #1e293b; }
            .loader { border: 4px solid #f3f3f3; border-top: 4px solid #6366f1; border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; margin-bottom: 20px; }
            @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
            .status { font-weight: 800; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; }
          </style>
        </head>
        <body>
          <div class="loader"></div>
          <div id="status">Sincronizando ${filteredEntries.length} Participantes...</div>
          <script src="https://cdn.jsdelivr.net/npm/exceljs@4.4.0/dist/exceljs.min.js"></script>
          <script src="https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js"></script>
          <script>
            (async function() {
              try {
                // Wait for ExcelJS if it's not immediately available
                let attempts = 0;
                while (!window.ExcelJS && attempts < 50) {
                  await new Promise(resolve => setTimeout(resolve, 100));
                  attempts++;
                }

                if (!window.ExcelJS) throw new Error("ExcelJS focus timeout");

                const workbook = new ExcelJS.Workbook();
                const entries = ${JSON.stringify(filteredEntries)};
                const RECS = ${JSON.stringify(RECOMMENDATIONS)};
                
                const headerStyle = {
                  font: { bold: true, color: { argb: 'FFFFFFFF' } },
                  fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E293B' } },
                  alignment: { horizontal: 'center' },
                  border: { top: {style:'thin'}, left: {style:'thin'}, bottom: {style:'thin'}, right: {style:'thin'}}
                };

                const cellStyle = {
                  border: { top: {style:'thin'}, left: {style:'thin'}, bottom: {style:'thin'}, right: {style:'thin'}},
                  alignment: { horizontal: 'center' }
                };

                // --- NEW: CONSOLIDATED BASE SHEET ---
                const baseSheet = workbook.addWorksheet('BASE CONSOLIDADA');
                const baseHeaders = ['ID', 'APELLIDOS Y NOMBRES', 'DNI', 'EMPRESA', 'AREA', 'ESTADO', 'NIVEL', 'PUESTO', 'LINEA', 'FECHA', 'INTERNO', 'EXTERNO', 'DICTAMEN'];
                
                baseHeaders.forEach((h, i) => {
                  const cell = baseSheet.getCell(1, i + 1);
                  cell.value = h;
                  cell.style = headerStyle;
                  baseSheet.getColumn(i + 1).width = 25;
                });
                baseSheet.getColumn(2).width = 45; // Name
                
                entries.forEach((e, idx) => {
                  const rowNum = idx + 2;
                  baseSheet.getCell(rowNum, 1).value = e.id;
                  baseSheet.getCell(rowNum, 2).value = e.name;
                  baseSheet.getCell(rowNum, 3).value = e.dni;
                  baseSheet.getCell(rowNum, 4).value = e.company;
                  baseSheet.getCell(rowNum, 5).value = e.area;
                  baseSheet.getCell(rowNum, 6).value = e.status;
                  baseSheet.getCell(rowNum, 7).value = e.level;
                  baseSheet.getCell(rowNum, 8).value = e.position;
                  baseSheet.getCell(rowNum, 9).value = e.line;
                  baseSheet.getCell(rowNum, 10).value = e.date;
                  baseSheet.getCell(rowNum, 11).value = e.internalScore;
                  baseSheet.getCell(rowNum, 12).value = e.externalScore;
                  baseSheet.getCell(rowNum, 13).value = e.result;
                  
                  for(let i=1; i<=13; i++) {
                    baseSheet.getCell(rowNum, i).style = cellStyle;
                  }
                });
                // --- END CONSOLIDATED SHEET ---

                for (const entry of entries) {
                  const safeName = entry.name.substring(0, 31).replace(/[\\\\\\/\\?\\*\\:\\[\\]]/g, '') || 'Participante';
                  const worksheet = workbook.addWorksheet(safeName);
                
                worksheet.getColumn(1).width = 30;
                worksheet.getColumn(2).width = 90;
                worksheet.getColumn(3).width = 25;
                worksheet.getColumn(4).width = 25;
                worksheet.getColumn(5).width = 5;

                worksheet.getCell('A1').value = 'APELLIDOS Y NOMBRES';
                worksheet.getCell('A1').style = headerStyle;
                worksheet.getCell('A2').value = entry.name;
                worksheet.getCell('A2').font = { bold: true };
                worksheet.getCell('A2').border = cellStyle.border;

                worksheet.getCell('A3').value = 'EMPRESA / PUESTO / LINEA';
                worksheet.getCell('A3').style = headerStyle;
                worksheet.getCell('A4').value = entry.company + ' / ' + entry.position + ' / ' + entry.line;
                worksheet.getCell('A4').font = { size: 9, italic: true };
                worksheet.getCell('A4').border = cellStyle.border;

                worksheet.getCell('A5').value = 'FECHA DE EVALUACIÓN';
                worksheet.getCell('A5').style = headerStyle;
                worksheet.getCell('A6').value = entry.date;
                worksheet.getCell('A6').font = { size: 9 };
                worksheet.getCell('A6').border = cellStyle.border;

                worksheet.getCell('A7').value = 'NIVEL DE TRABAJO';
                worksheet.getCell('A7').style = headerStyle;
                worksheet.getCell('A8').value = entry.level;
                worksheet.getCell('A8').font = { size: 9, bold: true };
                worksheet.getCell('A8').border = cellStyle.border;

                worksheet.getCell('A9').value = 'ESTADO';
                worksheet.getCell('A9').style = headerStyle;
                worksheet.getCell('A10').value = entry.status;
                worksheet.getCell('A10').font = { size: 9, bold: true };
                worksheet.getCell('A10').border = cellStyle.border;

                worksheet.mergeCells('C1:D1');
                worksheet.getCell('C1').value = 'RESULTADOS';
                worksheet.getCell('C1').style = headerStyle;

                const resultColor = entry.result === 'RIESGO BAJO' ? 'FFD1FAE5' : (entry.result === 'RIESGO MEDIO' ? 'FFFEF3C7' : 'FFFEE2E2');
                const resultTextCol = entry.result === 'RIESGO BAJO' ? 'FF059669' : (entry.result === 'RIESGO MEDIO' ? 'FFD97706' : 'FFDC2626');

                const resultsData = [
                  ['INTERNO', entry.internalScore],
                  ['EXTERNO', entry.externalScore],
                  ['DRIVER SAFETY', entry.result]
                ];

                resultsData.forEach((row, i) => {
                  const rNum = i + 2;
                  worksheet.getCell('C' + rNum).value = row[0];
                  worksheet.getCell('D' + rNum).value = row[1];
                  worksheet.getCell('C' + rNum).style = {...cellStyle, font: {bold: true}};
                  worksheet.getCell('D' + rNum).style = cellStyle;
                  if (row[0] === 'DRIVER SAFETY') {
                    worksheet.getCell('D' + rNum).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: resultColor.replace('#', '') } };
                    worksheet.getCell('D' + rNum).font = { bold: true, color: { argb: resultTextCol.replace('#', '') } };
                  }
                });

                // DRAW CHART
                const canvas = document.createElement('canvas');
                canvas.width = 800;
                canvas.height = 160;
                const ctx = canvas.getContext('2d');
                ctx.fillStyle = '#FFFFFF';
                ctx.fillRect(0, 0, 800, 160);
                
                const barY = 70;
                const barH = 30;
                // Red segment
                ctx.fillStyle = '#fecaca'; // Red-200
                ctx.fillRect(50, barY, 700 * 0.543, barH);
                // Amber segment
                ctx.fillStyle = '#fef3c7'; // Amber-100
                ctx.fillRect(50 + 700 * 0.543, barY, 700 * 0.261, barH);
                // Green segment
                ctx.fillStyle = '#d1fae5'; // Emerald-100
                ctx.fillRect(50 + 700 * (0.543 + 0.261), barY, 700 * 0.196, barH);
                
                // Pointer
                const pX = 50 + (entry.internalScore / 23) * 700;
                const pColor = entry.result === 'RIESGO BAJO' ? '#10b981' : (entry.result === 'RIESGO MEDIO' ? '#d97706' : '#dc2626');
                ctx.fillStyle = pColor;
                ctx.fillRect(pX - 3, barY - 15, 6, barH + 30);
                
                // Text
                ctx.font = 'bold 18px Arial';
                ctx.textAlign = 'center';
                ctx.fillText(entry.result + ' (' + entry.internalScore + ' pts)', pX, barY - 25);
                
                // Legend
                ctx.font = '12px Arial';
                ctx.fillStyle = '#64748b';
                ctx.textAlign = 'left';
                ctx.fillText('EXTERNO (RIESGO)', 50, barY + barH + 20);
                ctx.textAlign = 'right';
                ctx.fillText('INTERNO (RIESGO BAJO)', 750, barY + barH + 20);

                const chartImgId = workbook.addImage({
                  base64: canvas.toDataURL('image/png'),
                  extension: 'png',
                });
                
                worksheet.addImage(chartImgId, {
                  tl: { col: 5.2, row: 1 },
                  ext: { width: 600, height: 120 }
                });

                let rR = 7;
                worksheet.mergeCells('A' + rR + ':B' + rR);
                worksheet.getCell('A' + rR).value = 'DIAGNÓSTICO Y RECOMENDACIONES';
                worksheet.getCell('A' + rR).style = headerStyle;
                rR++;

                const getAnalysisText = (internal) => {
                  if (internal >= 19) return "Perfil con dominancia interna sólida (Riesgo Bajo). El evaluado asume responsabilidad directa sobre sus acciones y resultados, mostrando un alto compromiso con la seguridad operativa y el cumplimiento de normas.";
                  if (internal >= 13) return "Perfil con control de riesgo medio. Si bien asume responsabilidad, aún existe una tendencia parcial a atribuir eventos a factores externos. Se recomienda reforzamiento en cultura de seguridad.";
                  return "SE SOLICITA APERSONARSE AL ÁREA DE GERENCIA PARA RECIBIR LAS INSTRUCCIONES Y DIRECTRICES CORRESPONDIENTES.";
                };

                if (entry.result !== 'RIESGO ALTO') {
                  worksheet.getCell('A' + rR).value = 'Situación:';
                  worksheet.getCell('B' + rR).value = getAnalysisText(entry.internalScore);
                  worksheet.getCell('A' + rR).font = { bold: true };
                  worksheet.getCell('B' + rR).alignment = { wrapText: true, vertical: 'middle' };
                  rR += 2;
                }

                const pRecs = RECS[entry.result];
                worksheet.getCell('A' + rR).value = entry.result === 'RIESGO ALTO' ? 'Instrucción Gerencial:' : 'Acciones Correctivas:';
                worksheet.getCell('A' + rR).font = { bold: true };
                rR++;
                if (entry.result === 'RIESGO ALTO') {
                  worksheet.getCell('A' + rR).value = 'Estimado(a) ' + entry.name.toUpperCase() + ', se le solicita formalmente apersonarse al área de Gerencia de la empresa ' + entry.company.toUpperCase() + ' para recibir las instrucciones y directrices correspondientes.';
                  worksheet.mergeCells('A' + rR + ':B' + rR);
                  worksheet.getCell('A' + rR).font = { bold: true, color: { argb: 'FFFF0000' } };
                  worksheet.getCell('A' + rR).alignment = { wrapText: true, vertical: 'middle', horizontal: 'left' };
                  rR++;
                } else {
                  pRecs.rec.forEach(r => {
                    worksheet.getCell('A' + rR).value = '• ' + r;
                    worksheet.mergeCells('A' + rR + ':B' + rR);
                    worksheet.getCell('A' + rR).alignment = { wrapText: true, vertical: 'middle', horizontal: 'left' };
                    rR++;
                  });
                }
                rR++;

                if (entry.result !== 'RIESGO ALTO') {
                  worksheet.getCell('A' + rR).value = 'Plan de Seguimiento:';
                  worksheet.getCell('B' + rR).value = pRecs.followUp;
                  worksheet.getCell('A' + rR).font = { bold: true };
                  worksheet.getCell('B' + rR).alignment = { wrapText: true, vertical: 'middle' };
                  worksheet.getCell('B' + rR).font = { bold: true, color: { argb: resultTextCol.replace('#', '') } };
                }
              }

              const buff = await workbook.xlsx.writeBuffer();
              saveAs(new Blob([buff]), "Base_Driver_Safety_Global.xlsx");
              setTimeout(() => window.close(), 1500);
              } catch (err) {
                document.getElementById('status').innerHTML = "ERROR: " + err.message;
                console.error(err);
              }
            })();
          </script>
        </body>
      </html>
    `);
};
