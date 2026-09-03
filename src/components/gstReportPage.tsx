import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeft, FileText, ArrowRight } from "lucide-react";
import GstOverviewTab from "./gst-reports/GstOverviewTab";
import TopSuppliersCustomersTab from "./gst-reports/TopSuppliersCustomersTab";
import MonthlySummaryTab from "./gst-reports/MonthlySummaryTab";
import { useQuery } from "@tanstack/react-query";
import { getGstHistory } from "@/api/gst";

export default function GstReportPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const custId = searchParams.get("cust_id") || undefined;
  const state = location.state as { gst_reference_id?: string };
  const stateRefId = state?.gst_reference_id;

  const { data: historyData, isLoading: isHistoryLoading } = useQuery({
    queryKey: ["gstHistory", custId],
    queryFn: () => getGstHistory(custId),
    enabled: !stateRefId,
  });

  const historyList = historyData?.data || [];
  const latestCompletedReport = historyList.find(
    (item: any) => item.gst_reference_id_status === "COMPLETED"
  );

  const gstReferenceId = stateRefId || latestCompletedReport?.reference_id;

  if (!gstReferenceId) {
    if (isHistoryLoading) {
      return (
        <div className="flex h-screen items-center justify-center bg-gray-50">
          <span className="h-10 w-10 rounded-full border-4 border-[#002366]/20 border-t-[#002366] animate-spin" />
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-50 text-[#002366] mb-4">
            <FileText className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            No Active Report Selected
          </h3>
          <p className="text-gray-500 mb-6 text-sm">
            Please run a new GSTR analysis or select an existing completed report from your history.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => navigate("/gst/history")}
              className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#002366]"
            >
              Go to History
            </button>
            <button
              onClick={() => navigate("/gst/analysis")}
              className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#002366] hover:bg-[#002366]/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#002366]"
            >
              Start New Analysis <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="space-y-6">
        <div className="flex items-center space-x-4 mb-8">
          <button
            onClick={() => navigate("/gst/history")}
            className="p-2 bg-white border border-gray-200 rounded-md hover:bg-gray-200 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600 hover:text-black " />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">GSTR Report</h1>
            <p className="text-gray-500 mt-1">Ref ID: {gstReferenceId}</p>
          </div>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8 bg-white border border-gray-100 p-1 rounded-lg h-auto shadow-sm">
            <TabsTrigger value="overview" className="py-2.5 data-[state=active]:bg-[#002366] data-[state=active]:text-white">
              GSTR Overview
            </TabsTrigger>
            <TabsTrigger value="suppliers-customers" className="py-2.5 data-[state=active]:bg-[#002366] data-[state=active]:text-white">
              Top Suppliers & Customers
            </TabsTrigger>
            <TabsTrigger value="monthly-summary" className="py-2.5 data-[state=active]:bg-[#002366] data-[state=active]:text-white">
              Monthly Sales & Purchase Summary
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
