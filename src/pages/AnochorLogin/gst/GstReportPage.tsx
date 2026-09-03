import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeft, FileText } from "lucide-react";
import GstOverviewTab from "@/components/gst-reports/GstOverviewTab";
import TopSuppliersCustomersTab from "@/components/gst-reports/TopSuppliersCustomersTab";
import MonthlySummaryTab from "@/components/gst-reports/MonthlySummaryTab";

interface GstReportPageProps {
  gstReferenceId?: string;
  onBack?: () => void;
}

export default function GstReportPage({ gstReferenceId, onBack }: GstReportPageProps) {
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
        <div className="flex items-center space-x-4 mb-4 border-b border-slate-100 pb-4">
          {onBack && (
            <button
              onClick={onBack}
              className="p-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors shadow-sm cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600 hover:text-[#002366]" />
            </button>
          )}
          <div>
            <h1 className="text-2xl font-bold text-gray-950">GSTR Report</h1>
            <p className="text-xs text-gray-500 mt-0.5">Ref ID: {gstReferenceId}</p>
          </div>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6 bg-slate-100/50 p-1 rounded-xl h-11 border border-slate-100">
            <TabsTrigger value="overview" className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-[#002366] data-[state=active]:shadow-sm text-xs font-bold cursor-pointer">
              GSTR Overview
            </TabsTrigger>
            <TabsTrigger value="suppliers-customers" className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-[#002366] data-[state=active]:shadow-sm text-xs font-bold cursor-pointer">
              Top Suppliers & Customers
            </TabsTrigger>
            <TabsTrigger value="monthly-summary" className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-[#002366] data-[state=active]:shadow-sm text-xs font-bold cursor-pointer">
              Monthly Summary
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="outline-none focus:outline-none">
            <GstOverviewTab gstReferenceId={gstReferenceId} />
          </TabsContent>

          <TabsContent value="suppliers-customers" className="outline-none focus:outline-none">
            <TopSuppliersCustomersTab gstReferenceId={gstReferenceId} />
          </TabsContent>

          <TabsContent value="monthly-summary" className="outline-none focus:outline-none">
            <MonthlySummaryTab gstReferenceId={gstReferenceId} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
