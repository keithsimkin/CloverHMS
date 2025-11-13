import { Button } from '@/components/ui/button';
import { Download, FileText } from 'lucide-react';
import { downloadCSV, downloadPDF, generateHTMLTable } from '@/lib/exportUtils';

interface ExportButtonsProps {
  data: any[];
  filename: string;
  headers?: string[];
  title?: string;
  onExport?: (format: 'csv' | 'pdf') => void;
}

export function ExportButtons({
  data,
  filename,
  headers,
  title,
  onExport,
}: ExportButtonsProps) {
  const handleCSVExport = () => {
    downloadCSV(data, filename, headers);
    onExport?.('csv');
  };

  const handlePDFExport = () => {
    const htmlContent = generateHTMLTable(data, headers, title);
    downloadPDF(htmlContent, filename);
    onExport?.('pdf');
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={handleCSVExport}
        className="gap-2"
      >
        <Download className="h-4 w-4" />
        Export CSV
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={handlePDFExport}
        className="gap-2"
      >
        <FileText className="h-4 w-4" />
        Export PDF
      </Button>
    </div>
  );
}
