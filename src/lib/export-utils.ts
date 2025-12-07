/**
 * Utilidades de exportación para CSV, Excel y PDF
 * Generación client-side con datos mock
 */

// ============================================
// TIPOS
// ============================================

export interface ExportColumn {
  key: string;
  header: string;
  width?: number; // Para Excel/PDF
  formatter?: (value: unknown) => string;
}

export interface ExportOptions {
  filename: string;
  title?: string;
  columns: ExportColumn[];
  data: Record<string, unknown>[];
}

// ============================================
// FORMATTERS COMUNES
// ============================================

export const formatters = {
  date: (value: unknown): string => {
    if (!value) return '-';
    if (value instanceof Date) {
      return value.toLocaleDateString('ca-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
    }
    return String(value);
  },
  
  dateTime: (value: unknown): string => {
    if (!value) return '-';
    if (value instanceof Date) {
      return value.toLocaleString('ca-ES', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
    return String(value);
  },
  
  number: (value: unknown): string => {
    if (value === null || value === undefined) return '-';
    return Number(value).toLocaleString('ca-ES');
  },
  
  currency: (value: unknown): string => {
    if (value === null || value === undefined) return '-';
    return Number(value).toLocaleString('ca-ES', { style: 'currency', currency: 'EUR' });
  },
  
  boolean: (value: unknown): string => {
    return value ? 'Sí' : 'No';
  },
  
  default: (value: unknown): string => {
    if (value === null || value === undefined) return '-';
    if (value instanceof Date) return formatters.date(value);
    return String(value);
  }
};

// ============================================
// EXPORT CSV
// ============================================

export function exportToCSV(options: ExportOptions): void {
  const { filename, columns, data } = options;
  
  // Header row
  const headers = columns.map(col => `"${col.header}"`).join(';');
  
  // Data rows
  const rows = data.map(row => {
    return columns.map(col => {
      const value = row[col.key];
      const formatted = col.formatter ? col.formatter(value) : formatters.default(value);
      // Escape quotes and wrap in quotes
      return `"${String(formatted).replace(/"/g, '""')}"`;
    }).join(';');
  });
  
  // Combine with BOM for Excel compatibility
  const BOM = '\uFEFF';
  const csv = BOM + [headers, ...rows].join('\n');
  
  // Download
  downloadFile(csv, `${filename}.csv`, 'text/csv;charset=utf-8');
}

// ============================================
// EXPORT EXCEL (Simple XLSX via CSV with Excel mime)
// Using a simple HTML table approach for basic Excel support
// ============================================

export function exportToExcel(options: ExportOptions): void {
  const { filename, title, columns, data } = options;
  
  // Create HTML table that Excel can open
  let html = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" 
          xmlns:x="urn:schemas-microsoft-com:office:excel" 
          xmlns="http://www.w3.org/TR/REC-html40">
    <head>
      <meta charset="UTF-8">
      <!--[if gte mso 9]>
      <xml>
        <x:ExcelWorkbook>
          <x:ExcelWorksheets>
            <x:ExcelWorksheet>
              <x:Name>${title || filename}</x:Name>
              <x:WorksheetOptions>
                <x:DisplayGridlines/>
              </x:WorksheetOptions>
            </x:ExcelWorksheet>
          </x:ExcelWorksheets>
        </x:ExcelWorkbook>
      </xml>
      <![endif]-->
      <style>
        table { border-collapse: collapse; }
        th { background-color: #4472C4; color: white; font-weight: bold; padding: 8px; border: 1px solid #999; }
        td { padding: 6px; border: 1px solid #ccc; }
        tr:nth-child(even) { background-color: #f2f2f2; }
        .title { font-size: 16px; font-weight: bold; margin-bottom: 10px; }
        .date { font-size: 12px; color: #666; margin-bottom: 20px; }
      </style>
    </head>
    <body>
  `;
  
  if (title) {
    html += `<div class="title">${title}</div>`;
  }
  html += `<div class="date">Generat: ${new Date().toLocaleString('ca-ES')}</div>`;
  
  html += '<table>';
  
  // Header
  html += '<thead><tr>';
  columns.forEach(col => {
    html += `<th>${col.header}</th>`;
  });
  html += '</tr></thead>';
  
  // Body
  html += '<tbody>';
  data.forEach(row => {
    html += '<tr>';
    columns.forEach(col => {
      const value = row[col.key];
      const formatted = col.formatter ? col.formatter(value) : formatters.default(value);
      html += `<td>${formatted}</td>`;
    });
    html += '</tr>';
  });
  html += '</tbody></table>';
  
  html += '</body></html>';
  
  // Download as .xls (Excel will open it correctly)
  const blob = new Blob([html], { type: 'application/vnd.ms-excel;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}.xls`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// ============================================
// EXPORT PDF (Using HTML to print-friendly page)
// ============================================

export function exportToPDF(options: ExportOptions): void {
  const { filename, title, columns, data } = options;
  
  // Create a printable HTML page
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>${title || filename}</title>
      <style>
        @page { 
          size: A4 landscape; 
          margin: 15mm;
        }
        body { 
          font-family: Arial, sans-serif; 
          font-size: 10px;
          margin: 0;
          padding: 20px;
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          border-bottom: 2px solid #333;
          padding-bottom: 10px;
        }
        .title { 
          font-size: 18px; 
          font-weight: bold; 
          color: #333;
        }
        .subtitle {
          font-size: 12px;
          color: #666;
        }
        .date { 
          font-size: 11px; 
          color: #666; 
        }
        table { 
          width: 100%; 
          border-collapse: collapse; 
          margin-top: 10px;
        }
        th { 
          background-color: #2563eb; 
          color: white; 
          font-weight: bold; 
          padding: 8px 6px; 
          text-align: left;
          font-size: 9px;
          text-transform: uppercase;
        }
        td { 
          padding: 6px; 
          border-bottom: 1px solid #ddd; 
          font-size: 9px;
        }
        tr:nth-child(even) { 
          background-color: #f8f9fa; 
        }
        tr:hover {
          background-color: #e9ecef;
        }
        .footer {
          margin-top: 20px;
          padding-top: 10px;
          border-top: 1px solid #ddd;
          font-size: 9px;
          color: #666;
          display: flex;
          justify-content: space-between;
        }
        @media print {
          body { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div>
          <div class="title">${title || filename}</div>
          <div class="subtitle">Contracte C-5/2025 - BusEmbarCAT</div>
        </div>
        <div class="date">
          Generat: ${new Date().toLocaleString('ca-ES')}<br>
          Total registres: ${data.length}
        </div>
      </div>
      
      <table>
        <thead>
          <tr>
            ${columns.map(col => `<th>${col.header}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          ${data.map(row => `
            <tr>
              ${columns.map(col => {
                const value = row[col.key];
                const formatted = col.formatter ? col.formatter(value) : formatters.default(value);
                return `<td>${formatted}</td>`;
              }).join('')}
            </tr>
          `).join('')}
        </tbody>
      </table>
      
      <div class="footer">
        <span>Document generat automàticament - BusEmbarCAT</span>
        <span>Pàgina 1</span>
      </div>
      
      <script>
        window.onload = function() {
          window.print();
          setTimeout(function() { window.close(); }, 500);
        };
      </script>
    </body>
    </html>
  `;
  
  // Open in new window for printing
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();
  }
}

// ============================================
// HELPER FUNCTIONS
// ============================================

function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// ============================================
// PREDEFINED EXPORT CONFIGURATIONS
// ============================================

export const exportConfigs = {
  inventario: {
    columns: [
      { key: 'sku', header: 'SKU' },
      { key: 'nombre', header: 'Producte' },
      { key: 'categoria', header: 'Categoria' },
      { key: 'stockActual', header: 'Stock Actual', formatter: formatters.number },
      { key: 'stockMinimo', header: 'Stock Mínim', formatter: formatters.number },
      { key: 'stockReservado', header: 'Reservat', formatter: formatters.number },
      { key: 'stockRecambio', header: 'Recambi', formatter: formatters.number },
    ] as ExportColumn[],
  },
  
  movimientos: {
    columns: [
      { key: 'fecha', header: 'Data', formatter: formatters.dateTime },
      { key: 'tipo', header: 'Tipus' },
      { key: 'productoNombre', header: 'Producte' },
      { key: 'numeroSerie', header: 'Nº Sèrie' },
      { key: 'cantidad', header: 'Quantitat', formatter: formatters.number },
      { key: 'ubicacionOrigen', header: 'Origen' },
      { key: 'ubicacionDestino', header: 'Destí' },
      { key: 'referencia', header: 'Referència' },
      { key: 'usuario', header: 'Usuari' },
    ] as ExportColumn[],
  },
  
  rma: {
    columns: [
      { key: 'codigo', header: 'Codi RMA' },
      { key: 'productoNombre', header: 'Producte' },
      { key: 'numeroSerie', header: 'Nº Sèrie' },
      { key: 'tipoIncidencia', header: 'Tipus' },
      { key: 'descripcion', header: 'Descripció' },
      { key: 'estado', header: 'Estat' },
      { key: 'operadorNombre', header: 'Operador' },
      { key: 'fechaReporte', header: 'Data Report', formatter: formatters.date },
      { key: 'fechaLimiteSLA', header: 'Límit SLA', formatter: formatters.date },
      { key: 'slaDias', header: 'SLA Dies', formatter: formatters.number },
      { key: 'cumpleSLA', header: 'Compleix SLA', formatter: formatters.boolean },
    ] as ExportColumn[],
  },
  
  pedidos: {
    columns: [
      { key: 'codigo', header: 'Codi Comanda' },
      { key: 'estado', header: 'Estat' },
      { key: 'operadorNombre', header: 'Operador' },
      { key: 'fechaCreacion', header: 'Data Creació', formatter: formatters.date },
      { key: 'fechaEntregaLimite', header: 'Data Límit', formatter: formatters.date },
      { key: 'fechaEntregaReal', header: 'Data Entrega', formatter: formatters.date },
      { key: 'totalUnidades', header: 'Total Unitats', formatter: formatters.number },
      { key: 'prioridad', header: 'Prioritat' },
    ] as ExportColumn[],
  },
  
  series: {
    columns: [
      { key: 'numeroSerie', header: 'Nº Sèrie' },
      { key: 'productoNombre', header: 'Producte' },
      { key: 'sku', header: 'SKU' },
      { key: 'estado', header: 'Estat' },
      { key: 'ubicacion', header: 'Ubicació' },
      { key: 'operadorNombre', header: 'Operador' },
      { key: 'vehiculoCalca', header: 'Vehicle' },
      { key: 'fechaEntrada', header: 'Data Entrada', formatter: formatters.date },
      { key: 'fechaInstalacion', header: 'Data Instal·lació', formatter: formatters.date },
    ] as ExportColumn[],
  },
  
  garantias: {
    columns: [
      { key: 'productoNombre', header: 'Producte' },
      { key: 'numeroSerie', header: 'Nº Sèrie' },
      { key: 'operadorNombre', header: 'Operador' },
      { key: 'vehiculoInstalado', header: 'Vehicle' },
      { key: 'fechaEntrega', header: 'Data Entrega', formatter: formatters.date },
      { key: 'fechaFinGarantia', header: 'Fi Garantia', formatter: formatters.date },
      { key: 'estado', header: 'Estat' },
    ] as ExportColumn[],
  },
};
