import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import BsaUploadModal from '@/components/BsaUploadModal';
import ItrUploadModal from '@/components/ItrUploadModal';
import GstUploadModal from '@/components/GstUploadModal';
import CibilUploadModal from '@/components/CibilUploadModal';
import {
  Users,
  Eye,
  FileSpreadsheet,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';
import { getUserBsaReports, getUserGstReports , getUserItrReports, getUserCibilReports } from '@/api/user';


interface Customer {
  id: string;
  name: string;
  phone: string;
  customer_name?: string;
  phone_no?: string;
  company_name: string;
  gst_no: string;
  status: string;
  bsa?: any;
  gst?: any;
  itr?: any;
  cibil?: any;
  anchor_code?: string;
  anchor_id?: string;
  created_by?: string;
  updated_by?: string;
}

interface ServiceReportProps {
  selectedCustomer: Customer;
  onBack: () => void;
}

export default function ServiceReport({ selectedCustomer, onBack }: ServiceReportProps) {
  const [reportsSubTab, setReportsSubTab] = useState<"bsa" | "gst" | "itr" | "cibil">("bsa");
  const [isBsaModalOpen, setIsBsaModalOpen] = useState(false);
  const [isItrModalOpen, setIsItrModalOpen] = useState(false);
  const [isGstModalOpen, setIsGstModalOpen] = useState(false);
  const [isCibilModalOpen, setIsCibilModalOpen] = useState(false);

  // Fetch BSA reports using React Query and map keys defensively
  const { data: bsaReports = [], isLoading: isBsaLoading } = useQuery({
    queryKey: ["reports", "bsa", selectedCustomer.id],
    queryFn: async () => {
      const data = await getUserBsaReports(selectedCustomer.id);
      return data.map((item: any) => ({
        id: item._id || item.id || '',
        ReportId: item.report_id || item.reportId || item.reference_id || item.last_merged_reference_id || item.lastMergedReferenceId || item.id || '',
        bsaFromDate: item.bsa_from_date || item.bsaFromDate || item.from_date || '',
        bsaToDate: item.bsa_to_date || item.bsaToDate || item.to_date || '',
        tenure: item.tenure || '',
        generatedOn: item.created_at || item.generatedOn || item.generated_on || item.created_on || ''
      }));
    },
    enabled: !!selectedCustomer?.id && reportsSubTab === "bsa",
  });

  // Fetch GST reports using React Query and map keys defensively
  const { data: gstReports = [], isLoading: isGstLoading } = useQuery({
    queryKey: ["reports", "gst", selectedCustomer.id],
    queryFn: async () => {
      const data = await getUserGstReports(selectedCustomer.id);
      return data.map((item: any) => ({
        id: item._id || item.id || '',
        reportId: item.report_id || item.reportId || item.reference_id || item.gst_reference_id || '',
        gstn: item.gstin || item.gst_number || item.gstn || item.gst_no || selectedCustomer.gst_no || '',
        gstFromDate: item.gst_from_date || item.gstFromDate || item.from_date || item.from_month || '',
        gstToDate: item.gst_to_date || item.gstToDate || item.to_date || item.to_month || '',
        generatedOn: item.created_at || item.generatedOn || item.generated_on || item.created_on || '',
        status: item.status || item.report_status || 'Active',
        completed: item.completed !== undefined ? String(item.completed) : 'Yes'
      }));
    },
    enabled: !!selectedCustomer?.id && reportsSubTab === "gst",
  });

  // Fetch ITR reports using React Query and map keys defensively
  const { data: itrReports = [], isLoading: isItrLoading } = useQuery({
    queryKey: ["reports", "itr", selectedCustomer.id],
    queryFn: async () => {
      const data = await getUserItrReports(selectedCustomer.id);
      return data.map((item: any) => ({
        id: item._id || item.id || '',
        reportId: item.report_id || item.reportId || item.reference_id || item.itr_reference_id || '',
        itrFromDate: item.itr_from_date || item.itrFromDate || item.from_date || '',
        itrToDate: item.itr_to_date || item.itrToDate || item.to_date || '',
        generatedOn: item.created_at || item.generatedOn || item.generated_on || item.created_on || '',
        status: item.status || item.report_status || 'Active'
      }));
    },
    enabled: !!selectedCustomer?.id && reportsSubTab === "itr",
  });

  // Fetch CIBIL reports using React Query and map keys defensively
  const { data: cibilReports = [], isLoading: isCibilLoading } = useQuery({
    queryKey: ["reports", "cibil", selectedCustomer.id],
    queryFn: async () => {
      const data = await getUserCibilReports(selectedCustomer.id);
      return data.map((item: any) => ({
        id: item._id || item.id || '',
        reportId: item.report_id || item.reportId || item.reference_id || item.cibil_reference_id || '',
        cibilFromDate: item.cibil_from_date || item.cibilFromDate || item.from_date || '',
        cibilToDate: item.cibil_to_date || item.cibilToDate || item.to_date || '',
        generatedOn: item.created_at || item.generatedOn || item.generated_on || item.created_on || '',
        status: item.status || item.report_status || 'Active'
      }));
    },
    enabled: !!selectedCustomer?.id && reportsSubTab === "cibil",
  });


  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Title Block */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">Services & Reports</h1>
        <Button
          variant="outline"
          onClick={onBack}
          className="border-slate-200 rounded-xl hover:bg-slate-50 text-slate-600 h-10 shadow-none text-xs font-bold"
        >
          Back to Customers
        </Button>
      </div>

      {/* Selected Customer Header Block */}
      <div className="flex items-center gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div className="h-14 w-14 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-lg shadow-inner shrink-0">
          <Users className="h-7 w-7 text-[#7754f8]" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900">{selectedCustomer.name}</h2>
          <p className="text-xs text-slate-400 mt-1 font-semibold">
            ID: {selectedCustomer.id} • {selectedCustomer.phone}
          </p>
        </div>
      </div>

      {/* Sub-navigation tabs block */}
      <div className="flex border-b border-slate-100 gap-6">
        {(["bsa", "gst", "itr", "cibil"] as const).map((tab) => {
          const labels: Record<string, string> = {
            bsa: "BSA Report",
            gst: "GST Analysis",
            itr: "ITR Analysis",
            cibil: "CIBIL Report",
          };
          const isActive = reportsSubTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setReportsSubTab(tab)}
              className={`pb-3 text-sm font-bold transition-all relative ${isActive ? "text-[#7754f8]" : "text-slate-400 hover:text-slate-600"
                }`}
            >
              {labels[tab]}
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#7754f8] rounded-full animate-fade-in" />
              )}
            </button>
          );
        })}
      </div>

      {/* BSA Report Sub-Tab */}
      {reportsSubTab === "bsa" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900">BSA Reports</h3>
              <p className="text-xs text-slate-500 mt-0.5">Bank Statement Analysis Reports</p>
            </div>
            <Button 
              onClick={() => setIsBsaModalOpen(true)}
              className="bg-[#000000] hover:bg-[#000060] text-white"
            >
              + Create New BSA Report
            </Button>
          </div>

          <Card className="border border-slate-100 bg-white shadow-sm rounded-2xl overflow-hidden">
            <CardContent className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-[#f1f5f9] text-slate-400 font-bold text-xs uppercase tracking-wider bg-slate-50/50">
                      <th className="py-3 px-4 font-semibold text-slate-500">Report Id</th>
                      <th className="py-3 px-4 font-semibold text-slate-500">BSA From Date</th>
                      <th className="py-3 px-4 font-semibold text-slate-500">BSA To Date</th>
                      <th className="py-3 px-4 font-semibold text-slate-500">Tenure</th>
                      <th className="py-3 px-4 font-semibold text-slate-500">Generated On</th>
                      <th className="py-3 px-4 font-semibold text-center text-slate-500">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f1f5f9] font-medium text-slate-700">
                    {isBsaLoading ? (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-slate-400 font-semibold bg-slate-50/10">
                          <div className="flex flex-col items-center justify-center gap-2">
                            <Loader2 className="h-8 w-8 text-[#7754f8] animate-spin" />
                            <span>Loading reports...</span>
                          </div>
                        </td>
                      </tr>
                    ) : bsaReports.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-slate-400 font-semibold bg-slate-50/10">
                          <div className="flex flex-col items-center justify-center gap-2">
                            <FileSpreadsheet className="h-8 w-8 text-slate-300" />
                            <span>No reports generated yet</span>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      bsaReports.map((report) => (
                        <tr key={report.id} className="hover:bg-slate-50/20 transition-colors">
                          <td className="py-4 px-4 text-slate-500">{report.ReportId}</td>
                          <td className="py-4 px-4 font-bold text-slate-800">{report.bsaFromDate}</td>
                          <td className="py-4 px-4 text-slate-600">{report.bsaToDate}</td>
                          <td className="py-4 px-4 text-slate-500">{report.tenure}</td>
                          <td className="py-4 px-4 text-slate-800">{report.generatedOn}</td>
                          <td className="py-4 px-4 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                type="button"
                                onClick={() => toast.info(`Viewing details for report ${report.id}`)}
                                className="p-1.5 rounded-lg border border-slate-200 text-[#000080] hover:border-[#000080] hover:bg-[#000080]/5 transition-colors shadow-sm"
                                title="View Report"
                              >
                                <Eye className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* GST Report Sub-Tab */}
      {reportsSubTab === "gst" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900">GST Analysis</h3>
              <p className="text-xs text-slate-500 mt-0.5">Goods and Services Tax Reports & Filings</p>
            </div>
            <Button 
              onClick={() => setIsGstModalOpen(true)}
              className="bg-[#000000] hover:bg-[#000060] text-white"
            >
              + Create New GST Report
            </Button>
          </div>

          <Card className="border border-slate-100 bg-white shadow-sm rounded-2xl overflow-hidden">
            <CardContent className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-[#f1f5f9] text-slate-400 font-bold text-xs uppercase tracking-wider bg-slate-50/50">
                      <th className="py-3 px-4 font-semibold text-slate-500">Report ID</th>
                      <th className="py-3 px-4 font-semibold text-slate-500">GstIN</th>
                      <th className="py-3 px-4 font-semibold text-slate-500">GST From Date</th>
                      <th className="py-3 px-4 font-semibold text-slate-500">GST To Date</th>
                      <th className="py-3 px-4 font-semibold text-slate-500">Generated On</th>
                      <th className="py-3 px-4 font-semibold text-slate-500">Status</th>
                      <th className="py-3 px-4 font-semibold text-slate-500">Completed</th>
                      <th className="py-3 px-4 font-semibold text-center text-slate-500">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f1f5f9] font-medium text-slate-700">
                    {isGstLoading ? (
                      <tr>
                        <td colSpan={8} className="py-12 text-center text-slate-400 font-semibold bg-slate-50/10">
                          <div className="flex flex-col items-center justify-center gap-2">
                            <Loader2 className="h-8 w-8 text-[#7754f8] animate-spin" />
                            <span>Loading reports...</span>
                          </div>
                        </td>
                      </tr>
                    ) : gstReports.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-12 text-center text-slate-400 font-semibold bg-slate-50/10">
                          <div className="flex flex-col items-center justify-center gap-2">
                            <FileSpreadsheet className="h-8 w-8 text-slate-300" />
                            <span>No reports generated yet</span>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      gstReports.map((report) => (
                        <tr key={report.id} className="hover:bg-slate-50/20 transition-colors">
                          <td className="py-4 px-4 text-slate-500">{report.reportId}</td>
                          <td className="py-4 px-4 font-bold text-slate-800">{report.gstn}</td>
                          <td className="py-4 px-4 text-slate-600">{report.gstFromDate}</td>
                          <td className="py-4 px-4 text-slate-800">{report.gstToDate}</td>
                          <td className="py-4 px-4 text-slate-600">{report.generatedOn}</td>
                          <td className="py-4 px-4">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700">
                              {report.status}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-slate-600">{report.completed}</td>
                          <td className="py-4 px-4 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                type="button"
                                onClick={() => toast.info(`Viewing details for GST report ${report.id}`)}
                                className="p-1.5 rounded-lg border border-slate-200 text-[#000080] hover:border-[#000080] hover:bg-[#000080]/5 transition-colors shadow-sm"
                                title="View Report"
                              >
                                <Eye className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ITR Report Sub-Tab */}
      {reportsSubTab === "itr" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900">ITR Analysis</h3>
              <p className="text-xs text-slate-500 mt-0.5">Income Tax Return Statements</p>
            </div>
            <Button 
              onClick={() => setIsItrModalOpen(true)}
              className="bg-[#000000] hover:bg-[#000060] text-white"
            >
              + Create New ITR Report
            </Button>
          </div>

          <Card className="border border-slate-100 bg-white shadow-sm rounded-2xl overflow-hidden">
            <CardContent className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-[#f1f5f9] text-slate-400 font-bold text-xs uppercase tracking-wider bg-slate-50/50">
                      <th className="py-3 px-4 font-semibold text-slate-500">Report ID</th>
                      <th className="py-3 px-4 font-semibold text-slate-500">Generated On</th>
                      <th className="py-3 px-4 font-semibold text-slate-500">Status</th>
                      <th className="py-3 px-4 font-semibold text-slate-500">PERIOD</th>
                      <th className="py-3 px-4 font-semibold text-center text-slate-500">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f1f5f9] font-medium text-slate-700">
                    {isItrLoading ? (
                      <tr>
                        <td colSpan={5} className="py-12 text-center text-slate-400 font-semibold bg-slate-50/10">
                          <div className="flex flex-col items-center justify-center gap-2">
                            <Loader2 className="h-8 w-8 text-[#7754f8] animate-spin" />
                            <span>Loading reports...</span>
                          </div>
                        </td>
                      </tr>
                    ) : itrReports.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-12 text-center text-slate-400 font-semibold bg-slate-50/10">
                          <div className="flex flex-col items-center justify-center gap-2">
                            <FileSpreadsheet className="h-8 w-8 text-slate-300" />
                            <span>No reports generated yet</span>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      itrReports.map((report) => (
                        <tr key={report.id} className="hover:bg-slate-50/20 transition-colors">
                          <td className="py-4 px-4 text-slate-500">{report.reportId}</td>
                          <td className="py-4 px-4 font-bold text-slate-800">{report.generatedOn}</td>
                          <td className="py-4 px-4">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700">
                              {report.status}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-slate-600">
                            {report.itrFromDate && report.itrToDate ? `${report.itrFromDate} - ${report.itrToDate}` : 'N/A'}
                          </td>
                          <td className="py-4 px-4 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                type="button"
                                onClick={() => toast.info(`Viewing details for ITR report ${report.id}`)}
                                className="p-1.5 rounded-lg border border-slate-200 text-[#000080] hover:border-[#000080] hover:bg-[#000080]/5 transition-colors shadow-sm"
                                title="View Report"
                              >
                                <Eye className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* CIBIL Report Sub-Tab */}
      {reportsSubTab === "cibil" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900">CIBIL Report</h3>
              <p className="text-xs text-slate-500 mt-0.5">Credit Bureau Score & Report Details</p>
            </div>
            <Button 
              onClick={() => setIsCibilModalOpen(true)}
              className="bg-[#000000] hover:bg-[#000060] text-white"
            >
              + Create New CIBIL Report
            </Button>
          </div>

          <Card className="border border-slate-100 bg-white shadow-sm rounded-2xl overflow-hidden">
            <CardContent className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-[#f1f5f9] text-slate-400 font-bold text-xs uppercase tracking-wider bg-slate-50/50">
                      <th className="py-3 px-4 font-semibold text-slate-500">Report ID</th>
                      <th className="py-3 px-4 font-semibold text-slate-500">Generated On</th>
                      <th className="py-3 px-4 font-semibold text-slate-500">Status</th>
                      <th className="py-3 px-4 font-semibold text-center text-slate-500">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f1f5f9] font-medium text-slate-700">
                    {isCibilLoading ? (
                      <tr>
                        <td colSpan={4} className="py-12 text-center text-slate-400 font-semibold bg-slate-50/10">
                          <div className="flex flex-col items-center justify-center gap-2">
                            <Loader2 className="h-8 w-8 text-[#7754f8] animate-spin" />
                            <span>Loading reports...</span>
                          </div>
                        </td>
                      </tr>
                    ) : cibilReports.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="py-12 text-center text-slate-400 font-semibold bg-slate-50/10">
                          <div className="flex flex-col items-center justify-center gap-2">
                            <FileSpreadsheet className="h-8 w-8 text-slate-300" />
                            <span>No reports generated yet</span>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      cibilReports.map((report) => (
                        <tr key={report.id} className="hover:bg-slate-50/20 transition-colors">
                          <td className="py-4 px-4 text-slate-500">{report.reportId}</td>
                          <td className="py-4 px-4 font-bold text-slate-800">{report.generatedOn}</td>
                          <td className="py-4 px-4">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700">
                              {report.status}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                type="button"
                                onClick={() => toast.info(`Viewing details for CIBIL report ${report.id}`)}
                                className="p-1.5 rounded-lg border border-slate-200 text-[#000080] hover:border-[#000080] hover:bg-[#000080]/5 transition-colors shadow-sm"
                                title="View Report"
                              >
                                <Eye className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <BsaUploadModal 
        isOpen={isBsaModalOpen} 
        onClose={() => setIsBsaModalOpen(false)} 
        custId={selectedCustomer.id} 
      />
      <ItrUploadModal 
        isOpen={isItrModalOpen} 
        onClose={() => setIsItrModalOpen(false)} 
        custId={selectedCustomer.id} 
      />
      <GstUploadModal 
        isOpen={isGstModalOpen} 
        onClose={() => setIsGstModalOpen(false)} 
        custId={selectedCustomer.id} 
      />
      <CibilUploadModal 
        isOpen={isCibilModalOpen} 
        onClose={() => setIsCibilModalOpen(false)} 
        custId={selectedCustomer.id} 
      />
    </div>
  );
}
