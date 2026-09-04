import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import BsaUploadModal from '@/components/BsaUploadModal';
import ItrUploadModal from '@/components/ItrUploadModal';
import GstUploadModal from '@/components/GstUploadModal';
import CibilUploadModal from '@/components/CibilUploadModal';
import {
  Eye,
  FileSpreadsheet,
  Loader2,
  ArrowLeft
} from 'lucide-react';
import OverviewMonthlyWise from "./bsa/OverviewMonthlyWise";
import SummeryOfDebitAndCredit from "./bsa/SummaryOfDebitAndCredit";
import CashFlow from "./bsa/cashFlow/CashFlow";
import GstReportPage from "./gst/GstReportPage";
import ItrReportPage from "./itr/ItrReportPage";
import CibilReportView from "./cibil/ViewReport";
import SaveMoneyReportView from "./money/SaveMoneyReportView";
import RectifyMoneyReportView from "./money/RectifyMoneyReportView";
import AccessMoneyReportView from "./money/AccessMoneyReportView";

import { getWalletBalance } from '@/api/payment';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';
import PaymentModal from "@/components/PaymentModal";
import PayerSelectionModal from '@/components/PayerSelectionModal';
import { createPaymentOrder } from '@/api/payment';
import { getUserBsaReports, getUserGstReports, getUserItrReports, getUserCibilReports } from '@/api/user';


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

const getCustomerInitials = (name?: string): string => {
  if (!name) return "U";
  const cleanName = name.trim();
  const parts = cleanName.split(/[\s_\-]+/).filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  if (parts.length === 1) {
    const single = parts[0];
    const upperMatches = single.match(/[A-Z]/g);
    if (upperMatches && upperMatches.length >= 2) {
      return (upperMatches[0] + upperMatches[1]).toUpperCase();
    }
    return single.slice(0, 2).toUpperCase();
  }
  return cleanName.slice(0, 2).toUpperCase();
};

const formatDateTime = (dateString: string) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;

  const formattedDate = date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const formattedTime = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return `${formattedDate}, ${formattedTime}`;
};

const formatDateOnly = (dateString: string) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;

  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const tabVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 30 : -30,
    opacity: 0,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 30 : -30,
    opacity: 0,
  }),
};

export default function ServiceReport({ selectedCustomer, onBack }: ServiceReportProps) {
  const [reportsSubTab, setReportsSubTab] = useState<"bsa" | "gst" | "itr" | "cibil" | "save_money" | "rectify_money" | "access_money">("bsa");
  const [slideDirection, setSlideDirection] = useState(0);
  const [isBsaModalOpen, setIsBsaModalOpen] = useState(false);
  const [isItrModalOpen, setIsItrModalOpen] = useState(false);
  const [isGstModalOpen, setIsGstModalOpen] = useState(false);
  const [isCibilModalOpen, setIsCibilModalOpen] = useState(false);

  const [viewingBsaReport, setViewingBsaReport] = useState<any | null>(null);
  const [bsaDetailTab, setBsaDetailTab] = useState<"overview" | "summary" | "cashflow">("overview");
  const [viewingGstReport, setViewingGstReport] = useState<any | null>(null);
  const [viewingItrReport, setViewingItrReport] = useState<any | null>(null);
  const [viewingCibilReport, setViewingCibilReport] = useState<any | null>(null);
  const [viewingSaveMoneyReport, setViewingSaveMoneyReport] = useState<any | null>(null);
  const [viewingRectifyMoneyReport, setViewingRectifyMoneyReport] = useState<any | null>(null);

  const [paymentModalConfig, setPaymentModalConfig] = useState<{
    isOpen: boolean;
    moduleName: string;
    serviceId: string;
    amount: number;
    onSuccess: () => void;
  }>({
    isOpen: false,
    moduleName: '',
    serviceId: '',
    amount: 0,
    onSuccess: () => { }
  });

  const [payerSelectionConfig, setPayerSelectionConfig] = useState<{
    isOpen: boolean;
    moduleName: string;
    serviceId: string;
    amount: number;
    onSuccess: () => void;
  }>({
    isOpen: false,
    moduleName: '',
    serviceId: '',
    amount: 0,
    onSuccess: () => { }
  });

  const [isCheckingWallet, setIsCheckingWallet] = useState(false);

  const handleCreateReport = async (moduleName: string, serviceId: string, amount: number, onSuccess: () => void) => {
    try {
      setIsCheckingWallet(true);
      const res = await getWalletBalance(serviceId, selectedCustomer.id);

      if (res.data.is_balance_available) {
        onSuccess();
      } else {
        setPayerSelectionConfig({
          isOpen: true,
          moduleName,
          serviceId,
          amount,
          onSuccess
        });
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to check wallet balance. Proceeding to payer selection.");
      setPayerSelectionConfig({
        isOpen: true,
        moduleName,
        serviceId,
        amount,
        onSuccess
      });
    } finally {
      setIsCheckingWallet(false);
    }
  };

  const handleCustomerPay = async () => {
    const config = payerSelectionConfig;
    try {
      await createPaymentOrder({
        user_id: selectedCustomer.id,
        userId: selectedCustomer.id,
        service: config.serviceId,
        amount: config.amount,
        currency: 'INR'
      });
      toast.success(`Payment order created. The customer can now pay for ${config.moduleName} from their dashboard.`);
      setPayerSelectionConfig(prev => ({ ...prev, isOpen: false }));
    } catch (error: any) {
      toast.error(error.response?.data?.detail || "Failed to create pending payment");
    }
  };
  useEffect(() => {
    if (selectedCustomer?.id) {
      localStorage.setItem("selected_cust_id", selectedCustomer.id);
      localStorage.setItem("is_service_report", "true");
    }
    return () => {
      localStorage.removeItem("selected_cust_id");
      localStorage.removeItem("selected_itr_report_id");
      localStorage.removeItem("is_service_report");
      localStorage.removeItem("selected_gst_from_date");
      localStorage.removeItem("selected_gst_to_date");
    };
  }, [selectedCustomer]);

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
        generatedOn: formatDateTime(item.created_at || item.generatedOn || item.generated_on || item.created_on || '')
      }));
    },
    enabled: !!selectedCustomer?.id && reportsSubTab === "bsa",
  });

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
        generatedOn: formatDateTime(item.created_at || item.generatedOn || item.generated_on || item.created_on || ''),
        status: item.status || item.report_status || 'Active',
        completed: item.completed !== undefined ? String(item.completed) : 'Yes'
      }));
    },
    enabled: !!selectedCustomer?.id && reportsSubTab === "gst",
  });

  const { data: itrReports = [], isLoading: isItrLoading } = useQuery({
    queryKey: ["reports", "itr", selectedCustomer.id],
    queryFn: async () => {
      const data = await getUserItrReports(selectedCustomer.id);
      return data.map((item: any) => ({
        id: item._id || item.id || '',
        reportId: item.report_id || item.reportId || item.reference_id || item.itr_reference_id || '',
        itrFromDate: item.itr_from_date || item.itrFromDate || item.from_date || '',
        itrToDate: item.itr_to_date || item.itrToDate || item.to_date || '',
        generatedOn: formatDateTime(item.created_at || item.generatedOn || item.generated_on || item.created_on || ''),
        status: item.status || item.report_status || 'Active'
      }));
    },
    enabled: !!selectedCustomer?.id && reportsSubTab === "itr",
  });

  const { data: cibilReports = [], isLoading: isCibilLoading } = useQuery({
    queryKey: ["reports", "cibil", selectedCustomer.id],
    queryFn: async () => {
      const data = await getUserCibilReports(selectedCustomer.id);
      return data.map((item: any) => ({
        id: item._id || item.id || '',
        reportId: item.report_id || item.reportId || item.reference_id || item.cibil_reference_id || '',
        cibilFromDate: item.cibil_from_date || item.cibilFromDate || item.from_date || '',
        cibilToDate: item.cibil_to_date || item.cibilToDate || item.to_date || '',
        generatedOn: formatDateTime(item.created_at || item.generatedOn || item.generated_on || item.created_on || ''),
        status: item.status || item.report_status || 'Active'
      }));
    },
    enabled: !!selectedCustomer?.id && (reportsSubTab === "cibil" || reportsSubTab === "save_money" || reportsSubTab === "rectify_money"),
  });


  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={onBack}
            className="p-2.5 h-10 w-10 border-2 border-[#002366] bg-white rounded-xl hover:bg-[#002366] hover:text-white text-[#002366] transition-all shadow-sm shadow-[#002366]/20 shrink-0"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="font-['Space_Grotesk'] text-2xl font-bold text-[#1D1E2C]">Services & Reports</h1>
            <p className="text-sm text-[#8a8d97] font-medium">Manage Customer services and view reports</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div className="h-14 w-14 rounded-full bg-[#eff6ff] text-[#002366] flex items-center justify-center font-bold text-xl shadow-inner border border-blue-100/80 shrink-0 tracking-wider">
          {getCustomerInitials(selectedCustomer.name || selectedCustomer.customer_name || selectedCustomer.company_name)}
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900">{selectedCustomer.name || selectedCustomer.customer_name || selectedCustomer.company_name}</h2>
          <p className="text-xs text-slate-400 mt-1 font-semibold">
            ID : {selectedCustomer.id} <span className="px-2 text-slate-300">|</span> Phone : {selectedCustomer.phone || selectedCustomer.phone_no}
          </p>
        </div>
      </div>

      <div className="flex border-b border-slate-100 gap-6">
        {(["bsa", "gst", "itr", "cibil", "access_money", "save_money", "rectify_money"] as const).map((tab) => {
          const tabLabels: Record<string, string> = {
            bsa: "BSA",
            gst: "GST",
            itr: "ITR",
            cibil: "CIBIL",
            access_money: "Access Money",
            save_money: "Save Money",
            rectify_money: "Rectify Money"
          };
          const isActive = reportsSubTab === tab;
          return (
            <button
              key={tab}
              onClick={() => {
                const tabsList = ["bsa", "gst", "itr", "cibil", "access_money", "save_money", "rectify_money"];
                const newIndex = tabsList.indexOf(tab);
                const oldIndex = tabsList.indexOf(reportsSubTab);
                setSlideDirection(newIndex > oldIndex ? 1 : -1);
                setReportsSubTab(tab);
                setViewingBsaReport(null);
                setViewingGstReport(null);
                setViewingItrReport(null);
                setViewingCibilReport(null);
                setViewingSaveMoneyReport(null);
                setViewingRectifyMoneyReport(null);
                localStorage.removeItem("selected_itr_report_id");
              }}
              className={`pb-3 text-sm font-bold transition-all relative cursor-pointer ${isActive ? "text-[#002366]" : "text-slate-400 hover:text-slate-600"
                }`}
            >
              {tabLabels[tab]}
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#002366] rounded-full animate-fade-in" />
              )}
            </button>
          );
        })}
      </div>


      <div className="relative overflow-hidden w-full">
        <AnimatePresence mode="wait" custom={slideDirection} initial={false}>
          <motion.div
            key={reportsSubTab}
            custom={slideDirection}
            variants={tabVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.25, ease: "easeInOut" }}
          >
      {reportsSubTab === "bsa" && (
        viewingBsaReport ? (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <Button
                variant="outline"
                onClick={() => setViewingBsaReport(null)}
                className="flex items-center gap-2 border-[#002366] text-[#002366] hover:bg-[#002366]/5 font-bold rounded-xl h-9 text-xs cursor-pointer"
              >
                <ArrowLeft className="h-4 w-4" /> Back to BSA Reports List
              </Button>
              <span className="text-xs font-semibold text-slate-500">
                Viewing Report: {viewingBsaReport.ReportId}
              </span>
            </div>

            <div className="flex border-b border-slate-100 gap-6">
              {(["overview", "summary", "cashflow"] as const).map((tab) => {
                const labels: Record<string, string> = {
                  overview: "Month-Wise Overview",
                  summary: "Summary of Debit & Credit",
                  cashflow: "Cash Flow",
                };
                const isActive = bsaDetailTab === tab;
                return (
                  <button
                    key={tab}
                    onClick={() => setBsaDetailTab(tab)}
                    className={`pb-2 text-xs font-bold transition-all relative cursor-pointer ${isActive ? "text-[#002366]" : "text-slate-400 hover:text-slate-600"
                      }`}
                  >
                    {labels[tab]}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#002366] rounded-full animate-fade-in" />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden p-6">
              {bsaDetailTab === "overview" && (
                <OverviewMonthlyWise
                  custId={selectedCustomer.id}
                  reportId={viewingBsaReport.id}
                  fromDate={viewingBsaReport.bsaFromDate}
                  toDate={viewingBsaReport.bsaToDate}
                />
              )}
              {bsaDetailTab === "summary" && (
                <SummeryOfDebitAndCredit
                  custId={selectedCustomer.id}
                  reportId={viewingBsaReport.id}
                  fromDate={viewingBsaReport.bsaFromDate}
                  toDate={viewingBsaReport.bsaToDate}
                />
              )}
              {bsaDetailTab === "cashflow" && (
                <CashFlow
                  custId={selectedCustomer.id}
                  reportId={viewingBsaReport.id}
                  fromDate={viewingBsaReport.bsaFromDate}
                  toDate={viewingBsaReport.bsaToDate}
                />
              )}
            </div>
            <Button
              onClick={() => handleCreateReport('BSA', 'BSA', 565, () => setIsBsaModalOpen(true))}
              disabled={isCheckingWallet}
              className="bg-[#002366] hover:bg-[#001744] text-white font-semibold rounded-xl shadow-sm shadow-[#002366]/20 cursor-pointer"
            >
              {isCheckingWallet ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              + Create New BSA Report
            </Button>
          </div>
        ) : (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">BSA Reports</h3>
                <p className="text-xs text-slate-500 mt-0.5">Bank Statement Analysis Reports</p>
              </div>
              <Button
                onClick={() => handleCreateReport('BSA', 'BSA', 565, () => setIsBsaModalOpen(true))}
                disabled={isCheckingWallet}
                className="bg-[#002366] hover:bg-[#001744] text-white font-semibold rounded-xl shadow-sm shadow-[#002366]/20 cursor-pointer"
              >
                {isCheckingWallet ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
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

                        <th className="py-3 px-4 font-semibold text-slate-500">Generated On</th>
                        <th className="py-3 px-4 font-semibold text-center text-slate-500">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#f1f5f9] font-medium text-slate-700">
                      {isBsaLoading ? (
                        <tr>
                          <td colSpan={6} className="py-12 text-center text-slate-400 font-semibold bg-slate-50/10">
                            <div className="flex flex-col items-center justify-center gap-2">
                              <Loader2 className="h-8 w-8 text-[#002366] animate-spin" />
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
                            <td className="py-4 px-4 font-bold text-slate-800">{formatDateOnly(report.bsaFromDate)}</td>
                            <td className="py-4 px-4 text-slate-600">{formatDateOnly(report.bsaToDate)}</td>

                            <td className="py-4 px-4 text-slate-800">{formatDateTime(report.generatedOn)}</td>
                            <td className="py-4 px-4 text-center">
                              <div className="flex items-center justify-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setViewingBsaReport(report);
                                  }}
                                  className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-[#002366] hover:border-[#002366] hover:bg-blue-50/50 transition-colors shadow-sm cursor-pointer"
                                  title="View Report"
                                >
                                  <Eye className="h-3.5 w-3.5" />
                                  View Report
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
        )
      )}

      {reportsSubTab === "gst" && (
        viewingGstReport ? (
          <GstReportPage
            gstReferenceId={viewingGstReport.reportId}
            onBack={() => setViewingGstReport(null)}
          />
        ) : (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">GST Analysis</h3>
                <p className="text-xs text-slate-500 mt-0.5">Goods and Services Tax Reports & Filings</p>
              </div>
              <Button
                onClick={() => handleCreateReport('GST', 'GST', 561, () => setIsGstModalOpen(true))}
                disabled={isCheckingWallet}
                className="bg-[#002366] hover:bg-[#001744] text-white font-semibold rounded-xl shadow-sm shadow-[#002366]/20 cursor-pointer"
              >
                {isCheckingWallet ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
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
                              <Loader2 className="h-8 w-8 text-[#002366] animate-spin" />
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
                            <td className="py-4 px-4 text-slate-600">{formatDateOnly(report.gstFromDate)}</td>
                            <td className="py-4 px-4 text-slate-800">{formatDateOnly(report.gstToDate)}</td>
                            <td className="py-4 px-4 text-slate-600">{formatDateTime(report.generatedOn)}</td>
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
                                  onClick={() => {
                                    setViewingGstReport(report);
                                    localStorage.setItem("selected_gst_from_date", report.gstFromDate || '');
                                    localStorage.setItem("selected_gst_to_date", report.gstToDate || '');
                                  }}
                                  className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-[#002366] hover:border-[#002366] hover:bg-blue-50/50 transition-colors shadow-sm cursor-pointer"
                                  title="View Report"
                                >
                                  <Eye className="h-3.5 w-3.5" />
                                  View Report
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
        )
      )}

      {reportsSubTab === "itr" && (
        viewingItrReport ? (
          <ItrReportPage
            itrReportId={viewingItrReport.reportId}
            onBack={() => {
              setViewingItrReport(null);
              localStorage.removeItem("selected_itr_report_id");
            }}
          />
        ) : (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">ITR Analysis</h3>
                <p className="text-xs text-slate-500 mt-0.5">Income Tax Return Statements</p>
              </div>
              <Button
                onClick={() => handleCreateReport('ITR', 'ITR', 525, () => setIsItrModalOpen(true))}
                disabled={isCheckingWallet}
                className="bg-[#002366] hover:bg-[#001744] text-white font-semibold rounded-xl shadow-sm shadow-[#002366]/20 cursor-pointer"
              >
                {isCheckingWallet ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
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
                              <Loader2 className="h-8 w-8 text-[#002366] animate-spin" />
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
                            <td className="py-4 px-4 font-bold text-slate-800">{formatDateTime(report.generatedOn)}</td>
                            <td className="py-4 px-4">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700">
                                {report.status}
                              </span>
                            </td>
                            <td className="py-4 px-4 text-slate-600">
                              2 Years
                            </td>
                            <td className="py-4 px-4 text-center">
                              <div className="flex items-center justify-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => {
                                    localStorage.setItem("selected_itr_report_id", report.reportId);
                                    setViewingItrReport(report);
                                  }}
                                  className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-[#002366] hover:border-[#002366] hover:bg-blue-50/50 transition-colors shadow-sm cursor-pointer"
                                  title="View Report"
                                >
                                  <Eye className="h-3.5 w-3.5" />
                                  View Report
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
        )
      )}

      {reportsSubTab === "cibil" && (
        viewingCibilReport ? (
          <CibilReportView
            reference_id={viewingCibilReport.reportId}
            onBack={() => setViewingCibilReport(null)}
          />
        ) : (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">CIBIL Report</h3>
                <p className="text-xs text-slate-500 mt-0.5">Credit Bureau Score & Report Details</p>
              </div>
              <Button
                onClick={() => handleCreateReport('CIBIL', 'CIBIL', 643, () => setIsCibilModalOpen(true))}
                disabled={isCheckingWallet}
                className="bg-[#002366] hover:bg-[#001744] text-white font-semibold rounded-xl shadow-sm shadow-[#002366]/20 cursor-pointer"
              >
                {isCheckingWallet ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
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
                              <Loader2 className="h-8 w-8 text-[#002366] animate-spin" />
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
                                  onClick={() => setViewingCibilReport(report)}
                                  className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-[#002366] hover:border-[#002366] hover:bg-blue-50/50 transition-colors shadow-sm cursor-pointer"
                                  title="View Report"
                                >
                                  <Eye className="h-3.5 w-3.5" />
                                  View Report
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
        )
      )}

      {reportsSubTab === "save_money" && (
        viewingSaveMoneyReport ? (
          <SaveMoneyReportView
            custId={selectedCustomer.id}
            referenceId={viewingSaveMoneyReport.reportId}
            onBack={() => setViewingSaveMoneyReport(null)}
          />
        ) : (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Save Money</h3>
                <p className="text-xs text-slate-500 mt-0.5">Select a CIBIL report to analyze active accounts for savings</p>
              </div>
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
                              <Loader2 className="h-8 w-8 text-[#FF6B4A] animate-spin" />
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
                                  onClick={() => setViewingSaveMoneyReport(report)}
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-200 text-xs font-semibold text-[#1D1E2C] hover:border-[#1D1E2C] hover:bg-[#1D1E2C]/5 transition-colors shadow-sm bg-white"
                                  title="View Save Money Report"
                                >
                                  <Eye className="h-3.5 w-3.5" />
                                  View
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
        )
      )}

      {reportsSubTab === "rectify_money" && (
        viewingRectifyMoneyReport ? (
          <RectifyMoneyReportView
            custId={selectedCustomer.id}
            referenceId={viewingRectifyMoneyReport.reportId}
            onBack={() => setViewingRectifyMoneyReport(null)}
          />
        ) : (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Rectify Money</h3>
                <p className="text-xs text-slate-500 mt-0.5">Select a CIBIL report to analyze overdue accounts and DPD</p>
              </div>
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
                              <Loader2 className="h-8 w-8 text-[#FF6B4A] animate-spin" />
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
                                  onClick={() => setViewingRectifyMoneyReport(report)}
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-200 text-xs font-semibold text-[#1D1E2C] hover:border-[#1D1E2C] hover:bg-[#1D1E2C]/5 transition-colors shadow-sm bg-white"
                                  title="View Rectify Money Report"
                                >
                                  <Eye className="h-3.5 w-3.5" />
                                  View
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
        )
      )}

      {reportsSubTab === "access_money" && (
        <AccessMoneyReportView
          selectedCustomer={selectedCustomer}
        />
      )}




          </motion.div>
        </AnimatePresence>
      </div>

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

      <PaymentModal
        isOpen={paymentModalConfig.isOpen}
        onClose={() => setPaymentModalConfig(prev => ({ ...prev, isOpen: false }))}
        moduleName={paymentModalConfig.moduleName}
        serviceId={paymentModalConfig.serviceId}
        amount={paymentModalConfig.amount}
        onSuccess={() => {
          setPaymentModalConfig(prev => ({ ...prev, isOpen: false }));
          paymentModalConfig.onSuccess();
        }}
        custId={selectedCustomer.id}
      />

      <PayerSelectionModal
        isOpen={payerSelectionConfig.isOpen}
        onClose={() => setPayerSelectionConfig(prev => ({ ...prev, isOpen: false }))}
        moduleName={payerSelectionConfig.moduleName}
        onUserPay={() => {
          setPayerSelectionConfig(prev => ({ ...prev, isOpen: false }));
          setPaymentModalConfig({
            ...payerSelectionConfig,
            isOpen: true
          });
        }}
        onCustomerPay={handleCustomerPay}
      />
    </div>
  );
}
