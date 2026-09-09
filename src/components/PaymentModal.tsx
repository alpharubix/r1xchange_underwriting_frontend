import { useState } from 'react';
import { createPaymentOrder, validatePayment } from '@/api/payment';
import { Loader2, X, Wallet, CheckCircle2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { motion, AnimatePresence } from 'framer-motion';
import { logoBase64 } from "@/assets/logoBase64";

import { useAuthContext } from "@/contexts/AuthContext";
import { useEffect } from 'react';

export const getPricingDetails = (module: string, currentAmount: number) => {
  switch (module.toUpperCase()) {
    case 'BSA': return { base: 479, gst: 86, total: 565, period: '1 Year' };
    case 'GST': return { base: 475, gst: 86, total: 561, period: '1 Year' };
    case 'ITR': return { base: 445, gst: 80, total: 525, period: '2 Years' };
    case 'CIBIL': return { base: 545, gst: 98, total: 643, period: 'Latest Report' };
    default: return { base: currentAmount, gst: 0, total: currentAmount, period: 'N/A' };
  }
};

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

  useEffect(() => {
    if (!isOpen) {
      setIsProcessing(false);
    }
  }, [isOpen]);

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

  const getPricingDetails = (module: string, currentAmount: number) => {
    switch (module.toUpperCase()) {
      case 'BSA': return { base: 479, gst: 86, total: 565, period: '1 Year' };
      case 'GST': return { base: 475, gst: 86, total: 561, period: '1 Year' };
      case 'ITR': return { base: 445, gst: 80, total: 525, period: '2 Years' };
      case 'CIBIL': return { base: 545, gst: 98, total: 643, period: 'Latest Report' };
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

      const razorpayKey = import.meta.env.VITE_RAZOR_PAY_KEY_ID || import.meta.env.VITE_RAZORPAY_KEY_ID;
      if (!razorpayKey) {
        toast.error("Razorpay live key is not configured. Please contact system administration.");
        setIsProcessing(false);
        return;
      }

      const resolvedUserId = custId || localStorage.getItem('selected_cust_id') || user?._id || user?.id || user?.data?.user_id || user?.data?._id || localStorage.getItem('user_id');
      const orderPayload = {
        service: serviceId,
        amount: amount,
        currency: 'INR'
      } as Parameters<typeof createPaymentOrder>[0];

      // Customer payments use the authenticated request identity. Anchors must
      // include the selected customer's ID because they pay on the customer's behalf.
      if (custId && resolvedUserId) {
        orderPayload.user_id = resolvedUserId;
        orderPayload.userId = resolvedUserId;
      }

      const orderRes = await createPaymentOrder(orderPayload);

      const orderData = orderRes.data;

      const options = {
        key: razorpayKey,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "R1Xchange Underwriting",
        description: `Payment for ${moduleName} report`,
        image: logoBase64,
        order_id: orderData.order_id,
        handler: async function (response: any) {
          try {
            const validationPayload = {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature
            } as Parameters<typeof validatePayment>[0];

            if (custId && resolvedUserId) {
              validationPayload.user_id = resolvedUserId;
              validationPayload.userId = resolvedUserId;
            }

            await validatePayment(validationPayload);

            toast.success(`${moduleName} successfully unlocked!`);
            setIsProcessing(false);
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
          color: "#002366"
        }
      };

      const rzp = new (window as any).Razorpay(options);
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
            className="relative z-10 flex max-h-[calc(100dvh-2rem)] w-full max-w-md flex-col overflow-hidden rounded-3xl bg-white shadow-2xl"
          >
            <div className="relative shrink-0 bg-[#002366] p-6 pb-8 text-white">
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

            <div className="relative min-h-0 flex-1 overflow-y-auto bg-white p-6 pt-4 pb-6">

              <div className="w-full mb-6">
                <h3 className="text-sm font-bold text-slate-800 mb-3 uppercase tracking-wider">What's Included</h3>
                <ul className="space-y-2.5">
                  {features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <CheckCircle2 className="h-4 w-4 text-[#002366] mt-0.5 shrink-0" />
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
                  <span className="text-xl font-black text-[#002366]">₹{pricing.total}</span>
                </div>
              </div>

              <div className="sticky bottom-0 w-full bg-white pt-1">
                <Button
                  onClick={handlePay}
                  disabled={isProcessing}
                  className="w-full h-12 rounded-xl bg-[#002366] hover:bg-blue-700 text-white font-bold text-base shadow-sm shadow-[#002366]/20 cursor-pointer"
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
