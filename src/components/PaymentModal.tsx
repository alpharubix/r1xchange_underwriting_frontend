import { useState } from 'react';
import { createPaymentOrder, validatePayment } from '@/api/payment';
import { Loader2, X, Wallet, CheckCircle2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { motion, AnimatePresence } from 'framer-motion';
import r1xchangeLogoWhiteWebView from "@/assets/r1xchangeLogoWhiteWebView.svg";

import { useAuthContext } from "@/contexts/AuthContext";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  moduleName: string;
  serviceId: string;
  amount: number;
  custId?: string;
  onSuccess: () => void;
}

export default function PaymentModal({ isOpen, onClose, moduleName, serviceId, amount, custId, onSuccess }: PaymentModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const { user } = useAuthContext() as any;

  const getFeatures = (module: string) => {
    switch (module.toUpperCase()) {
      case 'BSA':
        return [
          "Comprehensive Transaction Analysis",
          "Monthly Inflow & Outflow Trends",
          "Cash Flow Statements & Summaries",
          "Debit/Credit Ratios & Patterns",
          "Bounced Cheques & Overdrafts Identification"
        ];
      case 'GST':
        return [
          "GSTR-1 & GSTR-3B Return Status",
          "Sales and Purchase Analysis",
          "Tax Liability & ITC Computations",
          "Delay/Filing Compliance Tracking",
          "Monthly Trend Analysis"
        ];
      case 'ITR':
        return [
          "Detailed Income & Deductions Breakdown",
          "Profit & Loss Statement Extraction",
          "Balance Sheet & Asset/Liability Tracking",
          "Liquidity & Solvency Ratio Analysis",
          "Tax Paid & Refund History"
        ];
      case 'CIBIL':
        return [
          "Complete Credit Score & Bureau Report",
          "Overdue Accounts & DPD Tracking",
          "Active vs Closed Loan Account Details",
          "Recent Credit Enquiries & History",
          "Default & Delinquency Flags"
        ];
      default:
        return [
          "Comprehensive Data Analysis",
          "Detailed Financial Insights",
          "Customized Reporting & Visualizations",
          "Exportable PDF/Excel Formats"
        ];
    }
  };

  // const getPricingDetails = (module: string, currentAmount: number) => {
  //   switch (module.toUpperCase()) {
  //     case 'ITR': return { base: 445, gst: 80, total: 525, period: '1 Year' };
  //     case 'BSA': return { base: 479, gst: 86, total: 565, period: '1 Year' };
  //     case 'CIBIL': return { base: 545, gst: 98, total: 643, period: 'Latest Report' };
  //     case 'GST': return { base: 475, gst: 86, total: 561, period: '1 Year' };
  //     default: return { base: currentAmount, gst: 0, total: currentAmount, period: 'N/A' };
  //   }
  // };
  const getPricingDetails = (module: string, currentAmount: number) => {
    switch (module.toUpperCase()) {
      case 'ITR': return { base: 1, gst: 1, total: 1, period: '1 Year' };
      case 'BSA': return { base: 1, gst: 1, total: 1, period: '1 Year' };
      case 'CIBIL': return { base: 1, gst: 1, total: 1, period: 'Latest Report' };
      case 'GST': return { base: 1, gst: 1, total: 1, period: '1 Year' };
      default: return { base: currentAmount, gst: 0, total: currentAmount, period: 'N/A' };
    }
  };

  const pricing = getPricingDetails(moduleName, amount);

  const periodFeature = pricing.period !== 'N/A'
    ? pricing.period === 'Latest Report' ? 'Latest Report' : `${pricing.period} Analysis`
    : null;

  const baseFeatures = getFeatures(moduleName);
  const features = periodFeature ? [periodFeature, ...baseFeatures] : baseFeatures;

  const handlePay = async () => {
    try {
      setIsProcessing(true);

      const resolvedUserId = custId || localStorage.getItem('selected_cust_id') || user?._id || user?.id || localStorage.getItem('user_id');

      if (!resolvedUserId) {
        toast.error("User ID is missing. Cannot create payment order.");
        setIsProcessing(false);
        return;
      }

      const orderRes = await createPaymentOrder({
        user_id: resolvedUserId,
        userId: resolvedUserId,
        service: serviceId,
        amount: amount,
        currency: 'INR'
      });

      const orderData = orderRes.data;

      const options = {
        key: import.meta.env.VITE_RAZOR_PAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "R1Xchange Underwriting",
        description: `Payment for ${moduleName} report`,
        image: window.location.origin + r1xchangeLogoWhiteWebView,
        order_id: orderData.order_id,
        handler: async function (response: any) {
          try {
            await validatePayment({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              user_id: resolvedUserId,
              userId: resolvedUserId
            });

            toast.success(`${moduleName} successfully unlocked!`);
            onClose();
            onSuccess();
          } catch (err) {
            toast.error("Payment validation failed. Please contact support.");
          } finally {
            setIsProcessing(false);
          }
        },
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
            toast.info("Payment cancelled.");
          }
        },
        theme: {
          color: "#1106de"
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to initiate payment.");
      setIsProcessing(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => !isProcessing && onClose()}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />

          {/* Modal Box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden z-10"
          >
            <div className="bg-[#1106de] p-6 pb-8 text-white relative">
              <div
                className="absolute top-4 right-4 cursor-pointer opacity-70 hover:opacity-100 transition-opacity"
                onClick={() => !isProcessing && onClose()}
              >
                <X className="h-5 w-5" />
              </div>
              <div className="h-12 w-12 rounded-2xl bg-white/20 flex items-center justify-center mb-4 backdrop-blur-sm">
                <Wallet className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white tracking-tight">{moduleName} Payment</h2>
                <p className="text-blue-100 font-medium text-sm mt-1">
                  Unlock access to generate this report.
                </p>
              </div>
            </div>

            <div className="p-6 pb-8 -mt-4 bg-white rounded-t-3xl relative flex flex-col items-center">

              <div className="w-full mb-6">
                <h3 className="text-sm font-bold text-slate-800 mb-3 uppercase tracking-wider">What's Included</h3>
                <ul className="space-y-2.5">
                  {features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <CheckCircle2 className="h-4 w-4 text-[#1106de] mt-0.5 shrink-0" />
                      <span className="text-sm font-medium text-slate-600 leading-tight">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-5 mb-6 shadow-sm space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-medium text-slate-500">Service Amount</span>
                  <span className="font-semibold text-slate-700">₹{pricing.base}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="font-medium text-slate-500">GST (18%)</span>
                  <span className="font-semibold text-slate-700">₹{pricing.gst}</span>
                </div>
                <div className="h-px w-full bg-slate-200 my-1"></div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-slate-700 uppercase tracking-wider">Total Amount</span>
                  <span className="text-xl font-black text-[#1106de]">₹{pricing.total}</span>
                </div>
              </div>

              <div className="w-full flex flex-col gap-3">
                <Button
                  onClick={handlePay}
                  disabled={isProcessing}
                  className="w-full h-12 rounded-xl bg-[#1106de] hover:bg-blue-700 text-white font-bold text-base shadow-sm shadow-[#1106de]/20 cursor-pointer"
                >
                  {isProcessing ? (
                    <><Loader2 className="h-5 w-5 animate-spin mr-2" /> Processing...</>
                  ) : (
                    `Pay ₹${amount} Securely`
                  )}
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
