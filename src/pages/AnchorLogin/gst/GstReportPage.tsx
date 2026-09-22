import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChevronLeft, FileText, Download, Loader2 } from 'lucide-react';
import GstOverviewTab from '@/components/gst-reports/GstOverviewTab';
import TopSuppliersCustomersTab from '@/components/gst-reports/TopSuppliersCustomersTab';
import MonthlySummaryTab from '@/components/gst-reports/MonthlySummaryTab';
import { downloadGstReport } from '@/api/gst';
import { toast } from 'sonner';

interface GstReportPageProps {
  gstReferenceId?: string;
  custId?: string;
  onBack?: () => void;
}

export default function GstReportPage({
  gstReferenceId,
  onBack,
}: GstReportPageProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    if (!gstReferenceId) {
      toast.error('GST reference ID is required for export');
      return;
    }

    try {
      setIsExporting(true);
      toast.loading(
        'Downloading GSTR Report (Overview, Top Suppliers & Customers, Monthly Summary)...',
        { id: 'gst-export' }
      );
      await downloadGstReport(gstReferenceId);
      toast.success('GSTR Report downloaded successfully!', {
        id: 'gst-export',
      });
    } catch (error: any) {
      toast.error(error?.message || 'Failed to download GSTR report', {
        id: 'gst-export',
      });
    } finally {
      setIsExporting(false);
    }
  };

  if (!gstReferenceId) {
    return (
      <div className="bg-gray-50 py-12 px-4 flex items-center justify-center">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-50 text-[#002366] mb-4">
            <FileText className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            No Active Report Selected
          </h3>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 py-6 px-4 sm:px-6 lg:px-8 rounded-2xl border border-slate-100 shadow-sm animate-in fade-in duration-200">
      <div className="space-y-6">
        <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-4">
          <div className="flex items-center space-x-4">
            {onBack && (
              <button
                onClick={onBack}
                className="p-2 border-2 border-[#002366] bg-white rounded-xl hover:bg-[#002366] hover:text-white text-[#002366] transition-all shadow-sm shadow-[#002366]/20 cursor-pointer flex items-center justify-center"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}
            <div>
              <h1 className="text-2xl font-bold text-gray-950">GSTR Report</h1>
              <p className="text-xs text-gray-500 mt-0.5">
                Ref ID: {gstReferenceId}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleExport}
            disabled={isExporting}
            className="inline-flex items-center gap-2 rounded-xl bg-[#002366] px-3.5 py-2 text-xs font-semibold text-white transition-all duration-200 hover:bg-[#001a4d] hover:shadow-sm cursor-pointer disabled:opacity-50"
            title="Download GSTR Report (Overview, Top Suppliers & Customers, Monthly Summary)"
          >
            {isExporting ? (
              <Loader2 className="h-4 w-4 animate-spin text-white" />
            ) : (
              <Download className="h-4 w-4 text-emerald-400" />
            )}
            <span>Export Report</span>
          </button>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6 bg-slate-100/50 p-1 rounded-xl h-11 border border-slate-100">
            <TabsTrigger
              value="overview"
              className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-[#002366] data-[state=active]:shadow-sm text-xs font-bold cursor-pointer"
            >
              GSTR Overview
            </TabsTrigger>
            <TabsTrigger
              value="suppliers-customers"
              className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-[#002366] data-[state=active]:shadow-sm text-xs font-bold cursor-pointer"
            >
              Top Suppliers & Customers
            </TabsTrigger>
            <TabsTrigger
              value="monthly-summary"
              className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-[#002366] data-[state=active]:shadow-sm text-xs font-bold cursor-pointer"
            >
              Monthly Summary
            </TabsTrigger>
          </TabsList>

          <TabsContent
            value="overview"
            className="outline-none focus:outline-none"
          >
            <GstOverviewTab gstReferenceId={gstReferenceId} />
          </TabsContent>

          <TabsContent
            value="suppliers-customers"
            className="outline-none focus:outline-none"
          >
            <TopSuppliersCustomersTab gstReferenceId={gstReferenceId} />
          </TabsContent>

          <TabsContent
            value="monthly-summary"
            className="outline-none focus:outline-none"
          >
            <MonthlySummaryTab gstReferenceId={gstReferenceId} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
