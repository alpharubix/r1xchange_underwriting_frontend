import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useRef } from "react";
import { getPendingPayments, validatePayment, getWalletBalance } from "@/api/payment";
import type { PendingPayment } from "@/api/payment";
import PaymentModal, { getPricingDetails } from "@/components/PaymentModal";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuthContext } from "@/contexts/AuthContext";
import { CreditCard, Loader2, IndianRupee, ArrowRight, FileText, PieChart, ShieldCheck, Building2, UserRound } from "lucide-react";
import { toast } from "sonner";
import r1xchangeLogoWhiteWebView from "@/assets/r1xchangeLogoWhiteWebView.svg";

export default function CustomerPaymentsPage() {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [processingId, setProcessingId] = useState<string | null>(null);
  const razorpayRef = useRef<any>(null);
  const requestedService = searchParams.get("service")?.toUpperCase() || "";
  const returnTo = searchParams.get("returnTo");
  const requestedModule = ["BSA", "GST", "ITR", "CIBIL"].includes(requestedService)
    ? requestedService
    : "";
  const [isRequestedPaymentOpen, setIsRequestedPaymentOpen] = useState(Boolean(requestedModule));

  useEffect(() => {
    if (requestedModule) {
      setIsRequestedPaymentOpen(true);
    }
  }, [requestedModule]);

  const resetPaymentProcessing = () => {
    razorpayRef.current?.close?.();
    razorpayRef.current = null;
    setProcessingId(null);
  };

  const modules = [
    { id: "BSA", label: "BSA", icon: Building2 },
    { id: "GST", label: "GST", icon: FileText },
    { id: "ITR", label: "ITR", icon: PieChart },
    { id: "CIBIL", label: "CIBIL", icon: ShieldCheck },
  ];

  const userId = user?.user_id || user?._id || user?.id || (user as any)?.data?.user_id || (user as any)?.data?._id || "";

  const {
    data: walletBalances = {},
    isLoading: isWalletLoading,
    refetch: refetchWalletBalances,
  } = useQuery({
    queryKey: ["wallet-balances", userId],
    queryFn: async () => {
      const balances = await Promise.all(
        modules.map(async (module) => {
          const response = await getWalletBalance(module.id, userId);
          return [module.id, response.data.available_balance] as const;
        })
      );

      return Object.fromEntries(balances) as Record<string, number>;
    },
    enabled: Boolean(userId),
  });

  const { data: paymentsRes, isLoading, refetch } = useQuery({
    queryKey: ["pending-payments-all"],
    queryFn: async () => {
      try {
        const [bsa, gst, itr, cibil] = await Promise.all([
          getPendingPayments("BSA"),
          getPendingPayments("GST"),
          getPendingPayments("ITR"),
          getPendingPayments("CIBIL")
        ]);
        return {
          data: [
            ...bsa.data.pending_orders,
            ...gst.data.pending_orders,
            ...itr.data.pending_orders,
            ...cibil.data.pending_orders
          ]
        };
      } catch (err) {
        console.error("Error fetching pending payments:", err);
        return { data: [] };
      }
    },
  });

  const pendingPayments = paymentsRes?.data || [];

  const handleCheckWalletBalance = async (service: string) => {
    try {
      const toastId = toast.loading(`Checking wallet balance for ${service}...`);

      const res = await getWalletBalance(service, userId);
      toast.dismiss(toastId);
      await refetchWalletBalances();

      if (res.data?.is_balance_available) {
        toast.success(`${service} Balance Available: ₹${res.data.available_balance}`);
      } else {
        toast.error(`Insufficient ${service} Balance: ₹${res.data?.available_balance || 0}`);
      }
    } catch (err: any) {
      toast.dismiss();
      toast.error(`Failed to check ${service} wallet balance.`);
      console.error(err);
    }
  };

  const handlePay = async (payment: PendingPayment) => {
    try {
      setProcessingId(payment.id);

      const razorpayKey = import.meta.env.VITE_RAZOR_PAY_KEY_ID || import.meta.env.VITE_RAZORPAY_KEY_ID;
      if (!razorpayKey) {
        toast.error("Razorpay live key is not configured. Please contact system administration.");
        resetPaymentProcessing();
        return;
      }

      const options = {
        key: razorpayKey,
        amount: Math.round(payment.amount * 100),
        currency: payment.currency || "INR",
        name: "R1Xchange Underwriting",
        description: `Payment for ${payment.service} report`,
        image: window.location.origin + r1xchangeLogoWhiteWebView,
        order_id: payment.id,
        handler: async function (response: any) {
          try {
            await validatePayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              user_id: ((user as any)?._id || (user as any)?.id) as string | undefined,
              userId: ((user as any)?._id || (user as any)?.id) as string | undefined,
            });

            toast.success("Payment successful!");
            resetPaymentProcessing();
            refetch();
          } catch (err: any) {
            console.error("Payment verification failed", err);
            toast.error(err.response?.data?.detail || "Payment verification failed");
          } finally {
            resetPaymentProcessing();
          }
        },
        prefill: {
          name: user?.name || "Customer",
          email: user?.email_id || "customer@example.com",
          contact: user?.mobile_number || "9999999999"
        },
        modal: {
          ondismiss: function () {
            resetPaymentProcessing();
            toast.info("Payment cancelled.");
          }
        },
        theme: {
          color: "#002366"
        }
      };

      const razorpay = new (window as any).Razorpay(options);
      razorpayRef.current = razorpay;
      razorpay.on('payment.failed', function (response: any) {
        console.error("Payment failed", response.error);
        toast.error(`Payment failed: ${response.error.description}`);
        resetPaymentProcessing();
      });

      razorpay.open();
    } catch (err: any) {
      console.error("Payment initiation failed", err);
      toast.error(err.response?.data?.detail || "Failed to initiate payment");
      resetPaymentProcessing();
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#002366]" />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-10 animate-fade-in pb-20">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 flex items-center gap-3">
          <CreditCard className="h-8 w-8 text-[#002366]" />
          Payments Dashboard
        </h1>
        <p className="mt-2 text-gray-500">
          Check your module balances and complete pending payments.
        </p>
      </div>

      {/* Module Wallet Checkers */}
      <div>
        <h2 className="text-lg font-bold text-gray-800 mb-4 uppercase tracking-wider text-sm">Wallet Balances</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {modules.map((mod) => (
            <button
              key={mod.id}
              onClick={() => handleCheckWalletBalance(mod.id)}
              className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl border-2 border-slate-100 hover:border-[#002366] hover:shadow-lg transition-all group"
            >
              <div className="h-12 w-12 rounded-full bg-slate-50 flex items-center justify-center mb-3 group-hover:bg-[#002366]/10 transition-colors">
                <mod.icon className="h-6 w-6 text-slate-500 group-hover:text-[#002366]" />
              </div>
              <span className="font-semibold text-slate-700">{mod.label}</span>
              <span className="mt-2 text-lg font-bold text-[#002366]">
                {isWalletLoading ? "Loading..." : `₹${walletBalances[mod.id] ?? 0}`}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-lg font-bold text-gray-800 mb-4 uppercase tracking-wider text-sm">Pending Orders</h2>
        {pendingPayments.length === 0 ? (
          <Card className="border-0 shadow-sm bg-slate-50 overflow-hidden">
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <div className="h-16 w-16 bg-blue-50 text-[#002366] rounded-full flex items-center justify-center mb-4">
                <CreditCard className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">No Pending Payments</h3>
              <p className="text-gray-500 max-w-md mt-2">
                You're all caught up! There are no pending payments requiring your attention at this time.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pendingPayments.map((payment) => {
              const requestedByYou = Boolean(payment.user_id && String(payment.user_id) === String(userId));
              const requestedBy = payment.role?.trim()
                ? payment.role.trim().toLowerCase() === "customer" && requestedByYou
                  ? "You"
                  : payment.role.trim().charAt(0).toUpperCase() + payment.role.trim().slice(1).toLowerCase()
                : requestedByYou
                  ? "You"
                  : "Anchor";

              return (
              <Card key={payment.id} className="overflow-hidden border-0 shadow-lg shadow-black/5 hover:shadow-xl hover:shadow-[#002366]/5 transition-all group">
                <div className="h-2 bg-[#002366]" />
                <CardContent className="p-6 flex flex-col h-full">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="text-xs font-bold text-[#002366] uppercase tracking-wider mb-1">
                        {payment.service} REPORT
                      </div>
            
                    </div>
                    <div className="h-10 w-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-[#002366]/10 transition-colors">
                      <IndianRupee className="h-5 w-5 text-gray-700 group-hover:text-[#002366]" />
                    </div>
                  </div>

                  <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-3 space-y-2 text-xs text-slate-600">
                    <div className="flex items-center gap-2">
                      <UserRound className="h-4 w-4 text-[#002366]" />
                      <span>Requested by</span>
                      
                      <span className="font-bold text-[#002366]">{requestedBy}</span>
                    </div>
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="font-semibold text-slate-500 shrink-0">User ID</span>
                      <span className="font-mono text-[11px] truncate" title={payment.user_id || "Unavailable"}>
                        {payment.user_id || "Unavailable"}
                      </span>
                    </div>
                   
                  </div>

                  <div className="mt-auto pt-6">
                    <div className="flex items-baseline gap-1 mb-4">
                      <span className="text-3xl font-bold text-gray-900">₹{(payment.amount / 100).toLocaleString('en-IN')}</span>
                    </div>
                    <Button
                      onClick={() => {
                        if (processingId === payment.id) {
                          resetPaymentProcessing();
                          return;
                        }
                        void handlePay(payment);
                      }}
                      disabled={processingId !== null && processingId !== payment.id}
                      className="w-full h-11 bg-[#002366] hover:bg-[#3f32a3]/80 hover:tracking-[0.05em] text-white rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                    >
                      {processingId === payment.id ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Cancel Payment
                        </>
                      ) : (
                        <>
                          Pay Now
                          <ArrowRight className="h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
              );
            })}
          </div>
        )}
      </div>

      {requestedModule && (
        <PaymentModal
          isOpen={isRequestedPaymentOpen}
          onClose={() => setIsRequestedPaymentOpen(false)}
          moduleName={requestedModule}
          serviceId={requestedModule}
          amount={getPricingDetails(requestedModule, 0).total}
          onSuccess={() => {
            setIsRequestedPaymentOpen(false);
            if (returnTo) {
              navigate(returnTo);
            }
          }}
        />
      )}
    </div>
  );
}
