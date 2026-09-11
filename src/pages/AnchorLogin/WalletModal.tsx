import { useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { getPendingPayments, validatePayment, getWalletBalance } from "@/api/payment";
import type { PendingPayment } from "@/api/payment";
import PaymentModal from "@/components/PaymentModal";
import { getPricingDetails } from "@/lib/paymentUtils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  CreditCard,
  Loader2,
  IndianRupee,
  ArrowRight,
  FileText,
  PieChart,
  ShieldCheck,
  Building2,
  UserRound,
} from "lucide-react";
import { toast } from "sonner";
import r1xchangeLogoWhiteWebView from "@/assets/r1xchangeLogoWhiteWebView.svg";
import { useAuthContext } from "@/contexts/AuthContext";

interface Customer {
  id: string;
  name?: string;
  customer_name?: string;
  phone?: string;
  phone_no?: string;
  company_name?: string;
  gst_no?: string;
  status?: string;
  anchor_code?: string;
  anchor_id?: string;
}

interface WalletModalProps {
  selectedCustomer: Customer;
}

const modules = [
  { id: "BSA", label: "BSA", icon: Building2 },
  { id: "GST", label: "GST", icon: FileText },
  { id: "ITR", label: "ITR", icon: PieChart },
  { id: "CIBIL", label: "CIBIL", icon: ShieldCheck },
];

export default function WalletModal({ selectedCustomer }: WalletModalProps) {
  const { user } = useAuthContext();
  const [processingId, setProcessingId] = useState<string | null>(null);
  const razorpayRef = useRef<any>(null);
  const [isRequestedPaymentOpen, setIsRequestedPaymentOpen] = useState(false);
  const [requestedModule, setRequestedModule] = useState("");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartServicesBreakup, setCartServicesBreakup] = useState([
    { service: "BSA", qty: 1 },
    { service: "GST", qty: 1 },
    { service: "ITR", qty: 1 },
    { service: "CIBIL", qty: 1 },
  ]);


  const handleCartQtyChange = (service: string, change: number) => {
    setCartServicesBreakup((prev) =>
      prev.map((item) =>
        item.service === service
          ? { ...item, qty: Math.max(0, item.qty + change) }
          : item
      )
    );
  };

  const customerId = selectedCustomer.id;

  const resetPaymentProcessing = (closeCheckout = true) => {
    const razorpay = razorpayRef.current;
    razorpayRef.current = null;
    setProcessingId(null);
    if (closeCheckout) {
      razorpay?.close?.();
    }
  };

  const {
    data: walletBalances = {},
    isLoading: isWalletLoading,
    refetch: refetchWalletBalances,
  } = useQuery({
    queryKey: ["wallet-balances-customer", customerId],
    queryFn: async () => {
      const balances = await Promise.all(
        modules.map(async (module) => {
          const response = await getWalletBalance(module.id, customerId);
          return [module.id, response.data.available_balance ?? 0] as const;
        })
      );
      return Object.fromEntries(balances) as Record<string, number>;
    },
    enabled: Boolean(customerId),
  });

  const {
    data: paymentsRes,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["pending-payments-customer", customerId],
    queryFn: async () => {
      try {
        const res = await getPendingPayments(customerId);
        const order = res.data?.pending_order;
        return { data: order ? [order] : [] };
      } catch (err) {
        console.error("Error fetching pending payments:", err);
        return { data: [] };
      }
    },
    enabled: Boolean(customerId),
  });

  const pendingPayments = paymentsRes?.data || [];

  const handleCheckWalletBalance = async (service: string) => {
    try {
      const toastId = toast.loading(`Checking wallet balance for ${service}...`);
      const res = await getWalletBalance(service, customerId);
      toast.dismiss(toastId);
      await refetchWalletBalances();

      if (res.data?.is_balance_available) {
        toast.success(`${service} Balance Available: Rs.${res.data.available_balance}`);
      } else {
        toast.error(`Insufficient ${service} Balance: Rs.${res.data?.available_balance || 0}`);
      }
    } catch (err: any) {
      toast.dismiss();
      toast.error(`Failed to check ${service} wallet balance.`);
      console.error(err);
    }
  };

  const handleTopUp = (moduleId: string) => {
    setRequestedModule(moduleId);
    setIsRequestedPaymentOpen(true);
  };

  const handlePay = async (payment: PendingPayment) => {
    try {
      setProcessingId(payment.id);

      const razorpayKey =
        import.meta.env.VITE_RAZOR_PAY_KEY_ID ||
        import.meta.env.VITE_RAZORPAY_KEY_ID;
      if (!razorpayKey) {
        toast.error(
          "Razorpay live key is not configured. Please contact system administration."
        );
        resetPaymentProcessing();
        return;
      }

      const options = {
        key: razorpayKey,
        amount: payment.amount,
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
            refetchWalletBalances();
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
          contact: user?.mobile_number || "9999999999",
        },
        modal: {
          ondismiss: function () {
            resetPaymentProcessing(false);
            toast.info("Payment cancelled.");
          },
        },
        theme: { color: "#002366" },
      };

      const razorpay = new (window as any).Razorpay(options);
      razorpayRef.current = razorpay;
      razorpay.on("payment.failed", function (response: any) {
        console.error("Payment failed", response.error);
        toast.error(`Payment failed: ${response.error.description}`);
        resetPaymentProcessing(false);
      });

      razorpay.open();
    } catch (err: any) {
      console.error("Payment initiation failed", err);
      toast.error(err.response?.data?.detail || "Failed to initiate payment");
      resetPaymentProcessing();
    }
  };

  const customerDisplayName =
    selectedCustomer.customer_name ||
    selectedCustomer.name ||
    selectedCustomer.company_name ||
    "Customer";

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#002366]" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in pb-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 flex items-center gap-3">
          <CreditCard className="h-6 w-6 text-[#002366]" />
          Wallet Dashboard
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Wallet balances and pending payments for{" "}
          <span className="font-semibold text-[#002366]">{customerDisplayName}</span>
        </p>
      </div>
        <button
          onClick={() => {
            setCartServicesBreakup([
              { service: "BSA", qty: 1 },
              { service: "GST", qty: 1 },
              { service: "ITR", qty: 1 },
              { service: "CIBIL", qty: 1 },
            ]);
            setIsCartOpen(true);
          }}
          className="px-4 py-2 rounded-lg bg-[#002366] hover:bg-[#002366]/80 text-white shadow-md transition-all flex items-center justify-center gap-2 text-sm"
        >
          <CreditCard className="h-4 w-4" />
          Pay for {customerDisplayName}
        </button>
      {/* Wallet Balances */}
      <div>
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
          Wallet Balances
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {modules.map((mod) => (
            <div key={mod.id} className="relative group">
              <button
                onClick={() => handleCheckWalletBalance(mod.id)}
                className="w-full flex flex-col items-center justify-center p-4 rounded-2xl border-2 border-slate-100 hover:border-[#002366]/30 hover:shadow-lg transition-all"
              >
                <div className="h-11 w-11 rounded-full bg-slate-50 flex items-center justify-center mb-3 group-hover:bg-[#002366]/10 transition-colors">
                  <mod.icon className="h-5 w-5 text-slate-500 group-hover:text-[#002366]" />
                </div>
                <span className="font-semibold text-slate-700 text-sm">{mod.label}</span>
                <span className="mt-1.5 text-lg font-bold text-[#002366]">
                  {isWalletLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    `Rs.${walletBalances[mod.id] ?? 0}`
                  )}
                </span>
              </button>
              {/* <button
                onClick={() => handleTopUp(mod.id)}
                className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-[#002366] text-white text-xs flex items-center justify-center shadow hover:bg-[#002366]/80 transition-colors opacity-0 group-hover:opacity-100"
                title={`Top up ${mod.label}`}
              >
                +
              </button> */}
            </div>
          ))}
        </div>
      </div>

      {/* Pending Orders */}
      <div>
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
          Pending Orders
        </h3>
        {pendingPayments.length === 0 ? (
          <Card className="border-0 shadow-sm bg-slate-50">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <div className="h-14 w-14 bg-blue-50 text-[#002366] rounded-full flex items-center justify-center mb-3">
                <CreditCard className="h-7 w-7" />
              </div>
              <h4 className="text-base font-bold text-gray-900">No Pending Payments</h4>
              <p className="text-gray-500 max-w-sm mt-1 text-sm">
                All caught up! No pending payments for this customer.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pendingPayments.map((payment) => {
              const requestedByYou = Boolean(
                payment.user_id && String(payment.user_id) === String(customerId)
              );
              const requestedBy = payment.role?.trim()
                ? payment.role.trim().toLowerCase() === "customer" && requestedByYou
                  ? "Customer"
                  : payment.role.trim().charAt(0).toUpperCase() +
                    payment.role.trim().slice(1).toLowerCase()
                : requestedByYou
                ? "Customer"
                : "Anchor";

              const serviceBreakup = payment.notes?.services_breakup || [];

              return (
                <Card
                  key={payment.id}
                  className="overflow-hidden border-0 shadow-lg shadow-black/5 hover:shadow-xl hover:shadow-[#002366]/5 transition-all group"
                >
                  <div className="h-1.5 bg-[#002366]" />
                  <CardContent className="p-5 flex flex-col">
                    <div className="flex justify-between items-start mb-4">
                      <div className="text-xs font-bold text-[#002366] uppercase tracking-wider">
                        {payment.service} REPORT
                      </div>
                      <div className="h-8 w-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-[#002366]/10 transition-colors">
                        <IndianRupee className="h-4 w-4 text-gray-700 group-hover:text-[#002366]" />
                      </div>
                    </div>
                    <p className="ml-2 text-sm font-bold text-slate-600">
                      Service : {serviceBreakup[0]?.service}
                    </p>

                    <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-3 space-y-1.5 text-xs text-slate-600 mb-4">
                      <div className="flex items-center gap-2">
                        <UserRound className="h-3.5 w-3.5 text-[#002366]" />
                        <span>Requested by</span>
                        <span className="font-bold text-[#002366]">{requestedBy}</span>
                      </div>
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="font-semibold text-slate-500 shrink-0">User ID</span>
                        <span
                          className="font-mono text-[11px] truncate"
                          title={payment.user_id || "Unavailable"}
                        >
                          {payment.notes?.user_id || payment.user_id || "Unavailable"}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-baseline gap-1 mb-3">
                      <span className="text-2xl font-bold text-gray-900">
                        Rs.{(payment.amount / 100).toLocaleString("en-IN")}
                      </span>
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
                      className="w-full h-10 bg-[#002366] hover:bg-[#002366]/80 text-white rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-sm"
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
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Top-up Payment Modal (single module) */}
      {requestedModule && (
        <PaymentModal
          isOpen={isRequestedPaymentOpen}
          onClose={() => setIsRequestedPaymentOpen(false)}
          moduleName={requestedModule}
          serviceId={requestedModule}
          amount={getPricingDetails(requestedModule, 0).total}
          custId={customerId}
          onSuccess={() => {
            setIsRequestedPaymentOpen(false);
            refetchWalletBalances();
          }}
        />
      )}

      {/* Pay for Customer — Cart Modal (all modules) */}
      <PaymentModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        moduleName="Cart"
        serviceId="BSA"
        amount={0}
        custId={customerId}
        servicesBreakup={cartServicesBreakup}
        onQuantityChange={handleCartQtyChange}
        requestFromAnchor={true}
        onSuccess={() => {
          setIsCartOpen(false);
          refetchWalletBalances();
          refetch();
        }}
      />
    </div>
  );
}
