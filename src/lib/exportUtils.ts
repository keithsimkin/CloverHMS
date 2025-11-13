/**
 * Utility functions for exporting reports to CSV and PDF formats
 */

/**
 * Convert data to CSV format
 */
export function convertToCSV(data: any[], headers?: string[]): string {
  if (data.length === 0) return '';

  // Get headers from first object if not provided
  const csvHeaders = headers || Object.keys(data[0]);

  // Create CSV header row
  const headerRow = csvHeaders.join(',');

  // Create CSV data rows
  const dataRows = data.map((row) => {
    return csvHeaders
      .map((header) => {
        const value = row[header];
        // Handle values that contain commas or quotes
        if (
          typeof value === 'string' &&
          (value.includes(',') || value.includes('"') || value.includes('\n'))
        ) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value ?? '';
      })
      .join(',');
  });

  return [headerRow, ...dataRows].join('\n');
}

/**
 * Download CSV file
 */
export function downloadCSV(data: any[], filename: string, headers?: string[]): void {
  const csv = convertToCSV(data, headers);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Generate PDF from HTML content
 * Note: This is a basic implementation. For production, consider using libraries like jsPDF or pdfmake
 */
export function downloadPDF(content: string, filename: string): void {
  // Create a printable HTML document
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Please allow popups to download PDF');
    return;
  }

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>${filename}</title>
        <style>
          body {
            font-family: 'Inter', sans-serif;
            padding: 20px;
            color: #0f131a;
            background: white;
          }
          h1, h2, h3 {
            font-family: 'Mona Sans', sans-serif;
            color: #0f131a;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
          }
          th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
          }
          th {
            background-color: #f2f2f2;
            font-weight: bold;
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #0f131a;
            padding-bottom: 10px;
          }
          .footer {
            margin-top: 30px;
            text-align: center;
            font-size: 12px;
            color: #666;
          }
          @media print {
            body {
              margin: 0;
            }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Hospital Management System</h1>
          <p>Generated on ${new Date().toLocaleString()}</p>
        </div>
        ${content}
        <div class="footer">
          <p>This is a computer-generated report from the Hospital Management System</p>
        </div>
      </body>
    </html>
  `;

  printWindow.document.write(htmlContent);
  printWindow.document.close();

  // Wait for content to load, then print
  printWindow.onload = () => {
    printWindow.print();
    // Close window after printing (optional)
    // printWindow.close();
  };
}

/**
 * Export table data to CSV
 */
export function exportTableToCSV(
  tableId: string,
  filename: string,
  includeHeaders: boolean = true
): void {
  const table = document.getElementById(tableId) as HTMLTableElement;
  if (!table) {
    console.error(`Table with id "${tableId}" not found`);
    return;
  }

  const rows: string[][] = [];

  // Get headers if needed
  if (includeHeaders) {
    const headerRow: string[] = [];
    const headers = table.querySelectorAll('thead th');
    headers.forEach((header) => {
      headerRow.push(header.textContent?.trim() || '');
    });
    if (headerRow.length > 0) {
      rows.push(headerRow);
    }
  }

  // Get data rows
  const dataRows = table.querySelectorAll('tbody tr');
  dataRows.forEach((row) => {
    const rowData: string[] = [];
    const cells = row.querySelectorAll('td');
    cells.forEach((cell) => {
      rowData.push(cell.textContent?.trim() || '');
    });
    if (rowData.length > 0) {
      rows.push(rowData);
    }
  });

  // Convert to CSV
  const csv = rows
    .map((row) =>
      row
        .map((cell) => {
          // Escape quotes and wrap in quotes if contains comma
          if (cell.includes(',') || cell.includes('"') || cell.includes('\n')) {
            return `"${cell.replace(/"/g, '""')}"`;
          }
          return cell;
        })
        .join(',')
    )
    .join('\n');

  // Download
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Format data for export
 */
export function formatDataForExport(data: any[]): any[] {
  return data.map((item) => {
    const formatted: any = {};
    Object.keys(item).forEach((key) => {
      const value = item[key];
      // Format dates
      if (value instanceof Date) {
        formatted[key] = value.toLocaleDateString();
      }
      // Format arrays
      else if (Array.isArray(value)) {
        formatted[key] = value.join('; ');
      }
      // Format objects
      else if (typeof value === 'object' && value !== null) {
        formatted[key] = JSON.stringify(value);
      }
      // Keep primitives as is
      else {
        formatted[key] = value;
      }
    });
    return formatted;
  });
}

/**
 * Generate HTML table from data
 */
export function generateHTMLTable(
  data: any[],
  headers?: string[],
  title?: string
): string {
  if (data.length === 0) return '<p>No data available</p>';

  const tableHeaders = headers || Object.keys(data[0]);

  let html = '';
  if (title) {
    html += `<h2>${title}</h2>`;
  }

  html += '<table>';
  html += '<thead><tr>';
  tableHeaders.forEach((header) => {
    html += `<th>${header}</th>`;
  });
  html += '</tr></thead>';

  html += '<tbody>';
  data.forEach((row) => {
    html += '<tr>';
    tableHeaders.forEach((header) => {
      const value = row[header];
      html += `<td>${value ?? ''}</td>`;
    });
    html += '</tr>';
  });
  html += '</tbody>';
  html += '</table>';

  return html;
}
