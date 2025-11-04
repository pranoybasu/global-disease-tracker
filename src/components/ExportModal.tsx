import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Download, FileText, Image, Table, FileJson, Share2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface ExportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  disease: string;
  metric: string;
  data: any[];
}

type ExportFormat = 'pdf' | 'png' | 'csv' | 'json';

export function ExportModal({ open, onOpenChange, disease, metric, data }: ExportModalProps) {
  const [exporting, setExporting] = useState<ExportFormat | null>(null);

  const formatMetricName = (metric: string) => {
    return metric
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const formatDiseaseName = (disease: string) => {
    if (disease === 'covid19') return 'COVID-19';
    if (disease === 'monkeypox') return 'Monkeypox';
    if (disease === 'ebola') return 'Ebola';
    return disease;
  };

  const getFileName = (format: ExportFormat) => {
    const timestamp = new Date().toISOString().split('T')[0];
    const diseaseName = formatDiseaseName(disease).toLowerCase().replace(/[^a-z0-9]/g, '-');
    const metricName = metric.toLowerCase();
    return `${diseaseName}-${metricName}-${timestamp}.${format}`;
  };

  const exportToCSV = () => {
    setExporting('csv');
    try {
      const headers = ['Country', 'Continent', 'Value'];
      const rows = data.map(country => [
        country.country,
        country.continent || 'Unknown',
        country.value.toString(),
      ]);

      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.join(',')),
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = getFileName('csv');
      link.click();
      URL.revokeObjectURL(link.href);

      toast.success('CSV exported successfully');
    } catch (error) {
      console.error('CSV export error:', error);
      toast.error('Failed to export CSV');
    } finally {
      setExporting(null);
    }
  };

  const exportToJSON = () => {
    setExporting('json');
    try {
      const exportData = {
        disease: formatDiseaseName(disease),
        metric: formatMetricName(metric),
        exportDate: new Date().toISOString(),
        data: data.map(country => ({
          country: country.country,
          continent: country.continent || 'Unknown',
          value: country.value,
        })),
      };

      const jsonContent = JSON.stringify(exportData, null, 2);
      const blob = new Blob([jsonContent], { type: 'application/json' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = getFileName('json');
      link.click();
      URL.revokeObjectURL(link.href);

      toast.success('JSON exported successfully');
    } catch (error) {
      console.error('JSON export error:', error);
      toast.error('Failed to export JSON');
    } finally {
      setExporting(null);
    }
  };

  const exportToPNG = async () => {
    setExporting('png');
    try {
      const element = document.querySelector('[data-export-target]');
      if (!element) {
        toast.error('No content to export');
        setExporting(null);
        return;
      }

      const canvas = await html2canvas(element as HTMLElement, {
        backgroundColor: '#ffffff',
        scale: 2,
        logging: false,
      });

      canvas.toBlob((blob) => {
        if (blob) {
          const link = document.createElement('a');
          link.href = URL.createObjectURL(blob);
          link.download = getFileName('png');
          link.click();
          URL.revokeObjectURL(link.href);
          toast.success('PNG exported successfully');
        }
        setExporting(null);
      });
    } catch (error) {
      console.error('PNG export error:', error);
      toast.error('Failed to export PNG');
      setExporting(null);
    }
  };

  const exportToPDF = async () => {
    setExporting('pdf');
    try {
      const element = document.querySelector('[data-export-target]');
      if (!element) {
        toast.error('No content to export');
        setExporting(null);
        return;
      }

      const canvas = await html2canvas(element as HTMLElement, {
        backgroundColor: '#ffffff',
        scale: 2,
        logging: false,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: canvas.width > canvas.height ? 'landscape' : 'portrait',
        unit: 'mm',
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 10;

      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      
      // Add title
      pdf.setFontSize(16);
      pdf.text(`${formatDiseaseName(disease)} - ${formatMetricName(metric)}`, pdfWidth / 2, 5, {
        align: 'center',
      });

      pdf.save(getFileName('pdf'));
      toast.success('PDF exported successfully');
    } catch (error) {
      console.error('PDF export error:', error);
      toast.error('Failed to export PDF');
    } finally {
      setExporting(null);
    }
  };

  const copyShareableLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      toast.success('Link copied to clipboard');
    }).catch(() => {
      toast.error('Failed to copy link');
    });
  };

  const exportOptions = [
    {
      format: 'pdf' as ExportFormat,
      icon: FileText,
      title: 'Export as PDF',
      description: 'Download charts and data as PDF document',
      action: exportToPDF,
    },
    {
      format: 'png' as ExportFormat,
      icon: Image,
      title: 'Export as PNG',
      description: 'Download charts as high-quality image',
      action: exportToPNG,
    },
    {
      format: 'csv' as ExportFormat,
      icon: Table,
      title: 'Export as CSV',
      description: 'Download data table in CSV format',
      action: exportToCSV,
    },
    {
      format: 'json' as ExportFormat,
      icon: FileJson,
      title: 'Export as JSON',
      description: 'Download complete data in JSON format',
      action: exportToJSON,
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Export & Share</DialogTitle>
          <DialogDescription>
            Choose a format to export your data or share a link to this page.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Export Options */}
          <div className="space-y-3">
            {exportOptions.map((option) => {
              const Icon = option.icon;
              const isExporting = exporting === option.format;
              
              return (
                <Card
                  key={option.format}
                  className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  onClick={() => !exporting && option.action()}
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                      {isExporting ? (
                        <Loader2 className="h-5 w-5 text-blue-600 dark:text-blue-400 animate-spin" />
                      ) : (
                        <Icon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm text-slate-900 dark:text-slate-100">
                        {option.title}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        {option.description}
                      </p>
                    </div>
                    <Download className="h-4 w-4 text-slate-400 flex-shrink-0 mt-1" />
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Share Link */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
            <Button
              variant="outline"
              className="w-full"
              onClick={copyShareableLink}
              disabled={!!exporting}
            >
              <Share2 className="h-4 w-4 mr-2" />
              Copy Shareable Link
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}