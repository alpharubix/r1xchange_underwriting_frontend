import { useState, useMemo} from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CreditCard,
  Filter,
  RotateCw,
  X,
  Copy,
  Check,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Eye,
  CheckCircle2,
  Clock,
  AlertCircle,
  Layers,
  ShieldCheck,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  getAdminPayments,
  type AdminPaymentRecord,
  type AdminPaymentsFilterParams,
} from '@/api/adminPayments';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// ─── HELPER FORMATTERS ────────────────────────────────────────────────────────

const formatCurrency = (amount?: number): string => {
  if (amount === undefined || amount === null || isNaN(amount)) return '₹ 0.00';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount/100);
};

const formatDate = (isoStr?: string): string => {
  if (!isoStr) return '-';
  try {
    const d = new Date(isoStr);
    if (isNaN(d.getTime())) return isoStr;
    const day = String(d.getDate()).padStart(2, '0');
    const month = d.toLocaleString('en-US', { month: 'short' });
    const year = d.getFullYear();
    let hours = d.getHours();
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    const strHours = String(hours).padStart(2, '0');
    return `${day} ${month} ${year}, ${strHours}:${minutes} ${ampm}`;
  } catch {
    return isoStr;
  }
};

const getServiceColor = (service?: string) => {
  const s = service?.toUpperCase();
  switch (s) {
    case 'BSA':
      return {
        badge: 'bg-blue-50 text-blue-700 border-blue-200/80',
        dot: 'bg-blue-600',
      };
    case 'GST':
      return {
        badge: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
        dot: 'bg-emerald-600',
      };
    case 'ITR':
      return {
        badge: 'bg-indigo-50 text-indigo-700 border-indigo-200/80',
        dot: 'bg-indigo-600',
      };
    case 'CIBIL':
      return {
        badge: 'bg-amber-50 text-amber-700 border-amber-200/80',
        dot: 'bg-amber-600',
      };
    default:
      return {
        badge: 'bg-slate-100 text-slate-700 border-slate-200',
        dot: 'bg-slate-500',
      };
  }
};

const getServiceBreakupItems = (
  serviceBreakup: AdminPaymentRecord['service_breakup']
): Array<{ service: string; quantity: string }> => {
  if (!serviceBreakup) return [];
  console.log("Service breakup - ",serviceBreakup)
  const items = Array.isArray(serviceBreakup)
    ? serviceBreakup.map(({ service, qty }) => ({
        service,
        quantity: qty === undefined || qty === null ? '0' : String(qty),
      }))
    : Object.entries(serviceBreakup).map(([service, value]) => {
        if (typeof value === 'number' || typeof value === 'string') {
          return { service, quantity: String(value) };
        }
        if (value && typeof value === 'object') {
          const item = value as { service?: unknown; qty?: unknown };
          return {
            service: typeof item.service === 'string' ? item.service : service,
            quantity:
              typeof item.qty === 'number' || typeof item.qty === 'string'
                ? String(item.qty)
                : '0',
          };
        }
        return { service, quantity: '0' };
      });

  return items.filter((item) => item.service);
};

const ServiceBreakupList = ({
  serviceBreakup,
}: {
  serviceBreakup: AdminPaymentRecord['service_breakup'];
}) => {
  const items = getServiceBreakupItems(serviceBreakup);

  if (items.length === 0) {
    return (
      <span className="inline-flex rounded border border-slate-200 bg-slate-100 px-2 py-1 text-[11px] font-medium text-slate-600">
        UNKNOWN
      </span>
    );
  }

  const serviceOrder = ['BSA', 'GST', 'ITR', 'CIBIL'];
  const orderedItems = [...items].sort((a, b) => {
    const aIndex = serviceOrder.indexOf(a.service.toUpperCase());
    const bIndex = serviceOrder.indexOf(b.service.toUpperCase());
    return (aIndex === -1 ? serviceOrder.length : aIndex) -
      (bIndex === -1 ? serviceOrder.length : bIndex);
  });

  return (
    <div className="grid grid-cols-2 gap-x-2 gap-y-1">
      {orderedItems.map(({ service, quantity }, index) => {
        const colors = getServiceColor(service);
        return (
          <span
            key={`${service}-${index}`}
            className={`whitespace-nowrap odd:border-r odd:border-slate-300 odd:pr-2 even:pl-2 text-[11px] font-semibold ${
              colors.badge.split(' ').find((className) => className.startsWith('text-'))
            }`}
          >
            {service.toUpperCase()}{quantity ? ` - ${quantity}` : ''}
          </span>
        );
      })}
    </div>
  );
};

const getStatusBadge = (statusVal?: string, _type: 'wallet' | 'service' | 'upstream' = 'wallet') => {
  const s = statusVal?.toUpperCase() || 'UNKNOWN';

  if (s === 'SUCCESS' || s === 'CONSUMED' || s === 'COMPLETED' || s === 'CAPTURED') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/80">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
        {s}
      </span>
    );
  }

  if (
    s === 'PENDING' ||
    s === 'PROCESSING' ||
    s === 'RESERVED' ||
    s === 'CREATED' ||
    s === 'ACCEPTED' ||
    s === 'AUTHORIZED'
  ) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium bg-amber-50 text-amber-700 border border-amber-200/80">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse shrink-0" />
        {s}
      </span>
    );
  }

  if (s === 'FAILED' || s === 'CANCELLED' || s === 'REFUNDED') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium bg-rose-50 text-rose-700 border border-rose-200/80">
        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
        {s}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
      <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0" />
      {s}
    </span>
  );
};

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

export default function PaymentDashboard() {
  // Pagination State
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  // Filters State
  const [filterRazorpayPaymentId, setFilterRazorpayPaymentId] = useState('');
  const [filterRazorpayOrderId, setFilterRazorpayOrderId] = useState('');
  const [filterRazorpaySignature, setFilterRazorpaySignature] = useState('');
  const [filterUserId, setFilterUserId] = useState('');
  const [filterServiceBreakup, setFilterServiceBreakup] = useState('');
  const [filterCurrency, setFilterCurrency] = useState('');
  const [filterWalletStatus, setFilterWalletStatus] = useState('all');
  const [filterPaymentStatus, setFilterPaymentStatus] = useState('all');
  const [filterSignatureVerified, setFilterSignatureVerified] = useState('all');
  const [filterAmount, setFilterAmount] = useState('');
  const [filterCreatedAt, setFilterCreatedAt] = useState('');
  const [filterUpdatedAt, setFilterUpdatedAt] = useState('');

  // UI States
  const [isFiltersOpen, setIsFiltersOpen] = useState(true);
  const [inspectedRecord, setInspectedRecord] = useState<AdminPaymentRecord | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Build Query Params adhering strictly to VALID_FILTERS in backend
  const queryParams = useMemo<AdminPaymentsFilterParams>(() => {
    return {
      page: currentPage,
      limit: pageSize,
      razorpay_payment_id: filterRazorpayPaymentId.trim() || undefined,
      razorpay_order_id: filterRazorpayOrderId.trim() || undefined,
      razorpay_signature: filterRazorpaySignature.trim() || undefined,
      user_id: filterUserId.trim() || undefined,
      service_breakup: filterServiceBreakup.trim() || undefined,
      currency: filterCurrency.trim() || undefined,
      wallet_status: filterWalletStatus !== 'all' ? filterWalletStatus : undefined,
      payment_status: filterPaymentStatus !== 'all' ? filterPaymentStatus : undefined,
      signature_verified:
        filterSignatureVerified !== 'all' ? filterSignatureVerified : undefined,
      amount: filterAmount.trim() ? filterAmount.trim() : undefined,
      created_at: filterCreatedAt || undefined,
      updated_at: filterUpdatedAt || undefined,
    };
  }, [
    currentPage,
    pageSize,
    filterRazorpayPaymentId,
    filterRazorpayOrderId,
    filterRazorpaySignature,
    filterUserId,
    filterServiceBreakup,
    filterCurrency,
    filterWalletStatus,
    filterPaymentStatus,
    filterSignatureVerified,
    filterAmount,
    filterCreatedAt,
    filterUpdatedAt,
  ]);

;
  // Fetch payments
  const { data, isLoading, isFetching, error, refetch } = useQuery({
    queryKey: ['admin', 'payments', queryParams],
    queryFn: () => getAdminPayments(queryParams),
    placeholderData: (previousData) => previousData,
    staleTime: 10000,
  });


  
  const payments = useMemo(() => data?.data || [], [data?.data]);
  const pagination = data?.pagination || {
    page: currentPage,
    limit: pageSize,
    total_records: payments.length,
    total_pages: Math.max(1, Math.ceil(payments.length / pageSize)),
  };

  // Compute metrics from current dataset
  const metrics = useMemo(() => {
    const totalRecords = pagination.total_records || payments.length;
    let totalAmt = 0;
    let successCount = 0;
    let pendingCount = 0;
    let failedCount = 0;

    payments.forEach((p) => {
      if (typeof p.amount === 'number') totalAmt += p.amount;
      const ws = p.wallet_status?.toUpperCase();
      if (ws === 'SUCCESS' || ws === 'CONSUMED') successCount++;
      else if (ws === 'FAILED' || ws === 'REFUNDED') failedCount++;
      else pendingCount++;
    });

    return { totalRecords, totalAmt, successCount, pendingCount, failedCount };
  }, [payments, pagination.total_records]);

  const handleCopy = (text: string, keyName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(keyName);
    toast.success('Copied to clipboard');
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleResetFilters = () => {
    setFilterRazorpayPaymentId('');
    setFilterRazorpayOrderId('');
    setFilterRazorpaySignature('');
    setFilterUserId('');
    setFilterServiceBreakup('');
    setFilterCurrency('');
    setFilterWalletStatus('all');
    setFilterPaymentStatus('all');
    setFilterSignatureVerified('all');
    setFilterAmount('');
    setFilterCreatedAt('');
    setFilterUpdatedAt('');
    setCurrentPage(1);
    toast.info('Filters reset to default');
  };

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filterRazorpayPaymentId) count++;
    if (filterRazorpayOrderId) count++;
    if (filterRazorpaySignature) count++;
    if (filterUserId) count++;
    if (filterServiceBreakup) count++;
    if (filterCurrency) count++;
    if (filterWalletStatus !== 'all') count++;
    if (filterPaymentStatus !== 'all') count++;
    if (filterSignatureVerified !== 'all') count++;
    if (filterAmount) count++;
    if (filterCreatedAt) count++;
    if (filterUpdatedAt) count++;
    return count;
  }, [
    filterRazorpayPaymentId,
    filterRazorpayOrderId,
    filterRazorpaySignature,
    filterUserId,
    filterServiceBreakup,
    filterCurrency,
    filterWalletStatus,
    filterPaymentStatus,
    filterSignatureVerified,
    filterAmount,
    filterCreatedAt,
    filterUpdatedAt,
  ]);

  const textFilterFields = [
    {
      label: 'Razorpay Payment ID',
      placeholder: 'Filter by payment ID',
      value: filterRazorpayPaymentId,
      onChange: setFilterRazorpayPaymentId,
    },
    {
      label: 'Razorpay Order ID',
      placeholder: 'Filter by order ID',
      value: filterRazorpayOrderId,
      onChange: setFilterRazorpayOrderId,
    },
    {
      label: 'Razorpay Signature',
      placeholder: 'Filter by signature',
      value: filterRazorpaySignature,
      onChange: setFilterRazorpaySignature,
    },
    {
      label: 'User / Customer ID',
      placeholder: 'Filter by user ID',
      value: filterUserId,
      onChange: setFilterUserId,
    },
    {
      label: 'Service Breakup',
      placeholder: 'Filter by service breakup',
      value: filterServiceBreakup,
      onChange: setFilterServiceBreakup,
    },
    {
      label: 'Amount',
      placeholder: 'Filter by amount',
      value: filterAmount,
      onChange: setFilterAmount,
    },
    {
      label: 'Currency',
      placeholder: 'e.g. INR',
      value: filterCurrency,
      onChange: setFilterCurrency,
    },
    {
      label: 'Created At',
      placeholder: '',
      type: 'date',
      value: filterCreatedAt,
      onChange: setFilterCreatedAt,
    },
    {
      label: 'Updated At',
      placeholder: '',
      type: 'date',
      value: filterUpdatedAt,
      onChange: setFilterUpdatedAt,
    },
  ];

  return (
    <main className="flex-1 flex flex-col h-full overflow-hidden bg-[#f8fafc] text-slate-800 antialiased font-montserrat">
      {/* ─── TOP HEADER ─── */}
      <header className="flex items-center justify-between bg-slate-100/90 border-b border-slate-200 px-8 py-4 shrink-0 shadow-xs">
        <div className="flex items-center gap-3.5">
          <div className="h-10 w-10 rounded-lg bg-white border border-slate-200/90 shadow-xs flex items-center justify-center text-[#002366] shrink-0">
            <CreditCard className="w-5 h-5 text-[#002366]" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-lg font-bold text-slate-900 tracking-tight">
                Payment Transactions & Audit Ledger
              </h1>
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-semibold bg-white text-slate-700 border border-slate-200/90 shadow-xs tracking-wider uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Audit Trail
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Track wallet balance debits, verify transaction references, and audit upstream provider fulfillment.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            onClick={() => refetch()}
            disabled={isFetching}
            variant="outline"
            className="border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-semibold h-8.5 px-3.5 rounded-lg text-xs shadow-xs transition-all cursor-pointer"
          >
            <RotateCw className={`w-3.5 h-3.5 mr-1.5 text-slate-500 ${isFetching ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </header>

      {/* ─── SCROLLABLE CONTENT BODY ─── */}
      <div className="flex-1 overflow-y-auto px-8 py-6 space-y-5">
        {/* ─── KPI METRIC SUMMARY CARDS ─── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Total Transactions */}
          <div className="bg-white rounded-lg border border-slate-200/90 p-4 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                Total Transactions
              </span>
              <span className="p-1 rounded bg-slate-100 text-slate-500 border border-slate-200/60">
                <Layers className="w-3.5 h-3.5" />
              </span>
            </div>
            <div className="mt-2.5">
              <span className="text-2xl font-bold text-slate-900 tracking-tight font-mono">
                {pagination.total_records.toLocaleString()}
              </span>
            </div>
            <p className="mt-1 text-[11px] text-slate-400 font-normal">
              Total requests logged in ledger
            </p>
          </div>

          {/* Card 2: Gross Page Volume */}
          <div className="bg-white rounded-lg border border-slate-200/90 p-4 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                Gross Page Volume
              </span>
              <span className="p-1 rounded bg-slate-100 text-slate-500 border border-slate-200/60">
                <CreditCard className="w-3.5 h-3.5" />
              </span>
            </div>
            <div className="mt-2.5">
              <span className="text-3xl font-bold text-slate-900 ">
                {formatCurrency(metrics.totalAmt)}
              </span>
            </div>
            <p className="mt-1 text-[11px] text-slate-400 font-normal">
              Deductions on current {pageSize} records
            </p>
          </div>

          {/* Card 3: Settled Transactions */}
          <div className="bg-white rounded-lg border border-slate-200/90 p-4 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                Settled (Page)
              </span>
              <span className="p-1 rounded bg-emerald-50 text-emerald-600 border border-emerald-100">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </span>
            </div>
            <div className="mt-2.5 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900 tracking-tight font-mono">
                {metrics.successCount}
              </span>
              {payments.length > 0 && (
                <span className="text-xs font-semibold text-emerald-700">
                  {Math.round((metrics.successCount / payments.length) * 100)}%
                </span>
              )}
            </div>
            <p className="mt-1 text-[11px] text-slate-400 font-normal">
              Wallet debited & fulfilled
            </p>
          </div>

          {/* Card 4: Pending / Attention */}
          <div className="bg-white rounded-lg border border-slate-200/90 p-4 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                Pending / Exceptions
              </span>
              <span className="p-1 rounded bg-amber-50 text-amber-600 border border-amber-100">
                <Clock className="w-3.5 h-3.5" />
              </span>
            </div>
            <div className="mt-2.5 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900 tracking-tight font-mono">
                {metrics.pendingCount + metrics.failedCount}
              </span>
              {metrics.failedCount > 0 && (
                <span className="text-xs font-semibold text-rose-600">
                  ({metrics.failedCount} failed)
                </span>
              )}
            </div>
            <p className="mt-1 text-[11px] text-slate-400 font-normal">
              In-flight or gateway timeouts
            </p>
          </div>
        </div>

        {/* ─── FILTERS CARD ─── */}
        <div className="bg-white rounded-lg border border-slate-200/90 shadow-xs p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3.5">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-600" />
              <h2 className="text-xs font-semibold text-slate-800 uppercase tracking-wider">
                Filter Ledger Records
              </h2>
              {activeFiltersCount > 0 && (
                <span className="bg-slate-100 text-slate-700 text-[10px] font-semibold px-2 py-0.5 rounded border border-slate-200 ml-1">
                  {activeFiltersCount} applied
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {activeFiltersCount > 0 && (
                <Button
                  onClick={handleResetFilters}
                  variant="ghost"
                  className="text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 font-medium h-8 px-2.5 rounded-md"
                >
                  Reset Filters
                </Button>
              )}
              <Button
                onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                variant="ghost"
                className="text-xs text-slate-600 hover:text-slate-900 h-8 px-2.5 rounded-md font-medium"
              >
                {isFiltersOpen ? 'Hide Filters' : 'Show Filters'}
              </Button>
            </div>
          </div>

          <AnimatePresence>
            {isFiltersOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5 pt-1"
              >
                {textFilterFields.map(({ label, placeholder, type = 'text', value, onChange }) => (
                  <div className="space-y-1" key={label}>
                    <Label className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
                      {label}
                    </Label>
                    <Input
                      type={type}
                      placeholder={placeholder}
                      value={value}
                      onChange={(event) => {
                        onChange(event.target.value);
                        setCurrentPage(1);
                      }}
                      className="h-9 rounded-md border-slate-300 text-xs font-normal focus:border-[#002366] focus:ring-1 focus:ring-[#002366]"
                    />
                  </div>
                ))}

                <div className="space-y-1">
                  <Label className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
                    Wallet Status
                  </Label>
                  <Select
                    value={filterWalletStatus}
                    onValueChange={(value) => {
                      setFilterWalletStatus(value);
                      setCurrentPage(1);
                    }}
                  >
                    <SelectTrigger className="h-9 rounded-md border-slate-300 text-xs font-medium bg-white text-slate-800">
                      <SelectValue placeholder="All Wallet Statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Wallet Statuses</SelectItem>
                      <SelectItem value="PENDING">PENDING</SelectItem>
                      <SelectItem value="SUCCESS">SUCCESS</SelectItem>
                      <SelectItem value="FAILED">FAILED</SelectItem>
                      <SelectItem value="RESERVED">RESERVED</SelectItem>
                      <SelectItem value="FINALIZING">FINALIZING</SelectItem>
                      <SelectItem value="CONSUMED">CONSUMED</SelectItem>
                      <SelectItem value="RELEASED">RELEASED</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <Label className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
                    Payment Status
                  </Label>
                  <Select
                    value={filterPaymentStatus}
                    onValueChange={(value) => {
                      setFilterPaymentStatus(value);
                      setCurrentPage(1);
                    }}
                  >
                    <SelectTrigger className="h-9 rounded-md border-slate-300 text-xs font-medium bg-white text-slate-800">
                      <SelectValue placeholder="All Payment Statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Payment Statuses</SelectItem>
                      <SelectItem value="PENDING">PENDING</SelectItem>
                      <SelectItem value="AUTHORIZED">AUTHORIZED</SelectItem>
                      <SelectItem value="CAPTURED">CAPTURED</SelectItem>
                      <SelectItem value="FAILED">FAILED</SelectItem>
                      <SelectItem value="REFUNDED">REFUNDED</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <Label className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
                    Signature Verified
                  </Label>
                  <Select
                    value={filterSignatureVerified}
                    onValueChange={(value) => {
                      setFilterSignatureVerified(value);
                      setCurrentPage(1);
                    }}
                  >
                    <SelectTrigger className="h-9 rounded-md border-slate-300 text-xs font-medium bg-white text-slate-800">
                      <SelectValue placeholder="All Verification States" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Verification States</SelectItem>
                      <SelectItem value="true">Verified</SelectItem>
                      <SelectItem value="false">Not Verified</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ─── DATA TABLE CARD ─── */}
        <div className="bg-white rounded-lg border border-slate-200/90 shadow-xs overflow-hidden flex flex-col">
          {/* Table Toolbar */}
          <div className="px-5 py-3 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50/60">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Transaction Records
              </span>
              <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-slate-200/70 text-slate-700">
                {pagination.total_records.toLocaleString()} total
              </span>
            </div>

            <div className="flex items-center gap-2.5">
              <span className="text-xs font-medium text-slate-500">Rows per page:</span>
              <Select
                value={String(pageSize)}
                onValueChange={(val) => {
                  setPageSize(Number(val));
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="h-8 w-18 rounded-md border-slate-300 text-xs font-medium bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Table view */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-semibold uppercase tracking-wider text-slate-600">
                  <th className="py-3 px-5">Razorpay Payment ID</th>
                  <th className="py-3 px-5">User / Customer ID</th>
                  <th className="py-3 px-9">Service Breakup</th>
                  <th className="py-3 px-5">Amount</th>
                  <th className="py-3 px-5">Wallet Status</th>
                  <th className="py-3 px-5">Payment Status</th>
                  <th className="py-3 px-5">Requester Role</th>
                  <th className="py-3 px-5">Timestamp</th>
                  <th className="py-3 px-5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {isLoading ? (
                  // Loading skeletons
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="py-3 px-5"><div className="h-3.5 w-28 bg-slate-200 rounded" /></td>
                      <td className="py-3 px-5"><div className="h-3.5 w-24 bg-slate-200 rounded" /></td>
                      <td className="py-3 px-5"><div className="h-5 w-16 bg-slate-200 rounded" /></td>
                      <td className="py-3 px-5"><div className="h-3.5 w-16 bg-slate-200 rounded" /></td>
                      <td className="py-3 px-5"><div className="h-5 w-20 bg-slate-200 rounded" /></td>
                      <td className="py-3 px-5"><div className="h-5 w-20 bg-slate-200 rounded" /></td>
                      <td className="py-3 px-5"><div className="h-3.5 w-16 bg-slate-200 rounded" /></td>
                      <td className="py-3 px-5"><div className="h-3.5 w-28 bg-slate-200 rounded" /></td>
                      <td className="py-3 px-5 text-right"><div className="h-7 w-16 bg-slate-200 rounded ml-auto" /></td>
                    </tr>
                  ))
                ) : error ? (
                  <tr>
                    <td colSpan={9} className="py-12 text-center">
                      <div className="max-w-md mx-auto flex flex-col items-center">
                        <div className="h-10 w-10 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mb-2.5">
                          <AlertCircle className="w-5 h-5" />
                        </div>
                        <h4 className="text-sm font-semibold text-slate-800">Failed to load payment records</h4>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {(error as any)?.response?.data?.message || (error as Error)?.message || 'An error occurred while fetching payments.'}
                        </p>
                        <Button
                          onClick={() => refetch()}
                          className="mt-3.5 bg-[#002366] hover:bg-[#001845] text-white rounded-md text-xs font-medium h-8 px-4"
                        >
                          Retry Request
                        </Button>
                      </div>
                    </td>
                  </tr>
                ) : payments.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-14 text-center">
                      <div className="max-w-md mx-auto flex flex-col items-center">
                        <div className="h-12 w-12 rounded-lg bg-slate-100 text-slate-400 flex items-center justify-center mb-3">
                          <Layers className="w-6 h-6" />
                        </div>
                        <h4 className="text-sm font-semibold text-slate-800">No Payment Records Found</h4>
                        <p className="text-xs text-slate-500 mt-1 max-w-sm">
                          {activeFiltersCount > 0
                            ? 'No transactions matched your current filters. Try resetting or adjusting your search criteria.'
                            : 'There are currently no recorded service requests or payment transactions in the system.'}
                        </p>
                        {activeFiltersCount > 0 && (
                          <Button
                            onClick={handleResetFilters}
                            variant="outline"
                            className="mt-3.5 border-slate-300 text-slate-700 text-xs font-medium rounded-md h-8 px-3"
                          >
                            Reset All Filters
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  payments.map((row) => {
                    const referenceId = row.razorpay_payment_id || row.reference_id || row._id;
                    return (
                      <tr
                        key={row._id}
                        className="hover:bg-slate-50/70 transition-colors border-b border-slate-100 group"
                      >
                        {/* Reference ID */}
                        <td className="min-w-[180px] py-3 px-5">
                          <div className="flex items-start gap-2">
                            <span className="min-w-0 break-all font-mono text-xs font-medium tracking-tight text-[#002366]">
                              {referenceId}
                            </span>
                            <button
                              onClick={() => handleCopy(referenceId, `ref-${row._id}`)}
                              className="shrink-0 rounded p-0.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 cursor-pointer"
                              title="Copy Reference ID"
                              aria-label="Copy Reference ID"
                            >
                              {copiedKey === `ref-${row._id}` ? (
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        </td>

                        {/* User / Customer ID */}
                        <td className="min-w-[200px] py-3 px-5">
                          <div className="flex items-start gap-1.5 text-xs text-slate-700">
                            <span className="min-w-0 break-all font-mono" title={row.user_id}>
                              {row.user_id || 'N/A'}
                            </span>
                            {row.user_id && (
                              <button
                                onClick={() => handleCopy(row.user_id!, `user-${row._id}`)}
                                className="shrink-0 rounded p-0.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 cursor-pointer"
                                title="Copy User ID"
                                aria-label="Copy User ID"
                              >
                                {copiedKey === `user-${row._id}` ? (
                                  <Check className="w-3 h-3 text-emerald-600" />
                                ) : (
                                  <Copy className="w-3 h-3" />
                                )}
                              </button>
                            )}
                          </div>
                        </td>

                        {/* Service */}
                        <td className="min-w-[150px] py-3 px-5">
                          <ServiceBreakupList serviceBreakup={row.service_breakup} />
                        </td>

                        {/* Amount */}
                        <td className="py-3 px-5">
                          <span className="font-semibold text-slate-900 text-s">
                            {formatCurrency(row.amount)}
                          </span>
                        </td>

                        {/* Wallet Status */}
                        <td className="py-3 px-5">
                          {getStatusBadge(row.wallet_status, 'wallet')}
                        </td>

                        {/* Payment Status */}
                        <td className="py-3 px-5">
                          {getStatusBadge(row.payment_status, 'service')}
                        </td>

                        {/* Requester Role */}
                        <td className="py-3 px-5">
                          <div className="flex flex-col">
                            <span className="text-xs font-medium text-slate-700">
                              {row.requested_by_role || 'USER'}
                            </span>
                            {row.requested_by && row.requested_by !== row.user_id && (
                              <span className="text-[10px] text-slate-400 font-mono truncate max-w-[100px]" title={row.requested_by}>
                                by {row.requested_by}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Timestamp */}
                        <td className="py-3 px-5 whitespace-nowrap text-xs text-slate-500 font-normal">
                          {formatDate(row.created_at)}
                        </td>

                        {/* Actions */}
                        <td className="py-3 px-5 text-right whitespace-nowrap">
                          <Button
                            onClick={() => setInspectedRecord(row)}
                            variant="outline"
                            size="sm"
                            className="border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 rounded-md text-xs font-medium h-7 px-2.5 shadow-none transition-colors"
                          >
                            <Eye className="w-3 h-3 mr-1 text-slate-500" />
                            View Audit
                          </Button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer with Pagination */}
          <div className="px-5 py-3 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50/50">
            <span className="text-xs font-normal text-slate-500">
              Showing page <strong className="font-semibold text-slate-800">{pagination.page}</strong> of{' '}
              <strong className="font-semibold text-slate-800">{pagination.total_pages || 1}</strong> ({pagination.total_records} total records)
            </span>

            <div className="flex items-center gap-1">
              <Button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage <= 1 || isLoading}
                variant="outline"
                size="sm"
                className="h-7.5 w-7.5 p-0 rounded-md border-slate-300 text-slate-700"
                title="First Page"
              >
                <ChevronsLeft className="w-3.5 h-3.5" />
              </Button>
              <Button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage <= 1 || isLoading}
                variant="outline"
                size="sm"
                className="h-7.5 w-7.5 p-0 rounded-md border-slate-300 text-slate-700"
                title="Previous Page"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </Button>

              <span className="px-2.5 py-1 text-xs font-semibold bg-[#002366] text-white rounded-md">
                {currentPage}
              </span>

              <Button
                onClick={() => setCurrentPage((p) => Math.min(pagination.total_pages, p + 1))}
                disabled={currentPage >= pagination.total_pages || isLoading}
                variant="outline"
                size="sm"
                className="h-7.5 w-7.5 p-0 rounded-md border-slate-300 text-slate-700"
                title="Next Page"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </Button>
              <Button
                onClick={() => setCurrentPage(pagination.total_pages)}
                disabled={currentPage >= pagination.total_pages || isLoading}
                variant="outline"
                size="sm"
                className="h-7.5 w-7.5 p-0 rounded-md border-slate-300 text-slate-700"
                title="Last Page"
              >
                <ChevronsRight className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* ─── DETAIL INSPECTOR MODAL ─── */}
      <AnimatePresence>
        {inspectedRecord && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.98, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 8 }}
              transition={{ duration: 0.15 }}
              className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Modal Header */}
              <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-md bg-[#002366]/10 text-[#002366] flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                      Transaction Audit Record
                    </h3>
                    <p className="text-[11px] text-slate-500 font-normal">
                      MongoDB ID: <span className="font-mono text-slate-700">{inspectedRecord._id}</span>
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setInspectedRecord(null)}
                  className="h-7 w-7 rounded-md hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto space-y-5 text-xs">
                {/* Highlights bar */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3.5 rounded-lg border border-slate-200">
                  <div>
                    <span className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                      Amount
                    </span>
                    <span className="text-base font-bold text-slate-900 font-mono mt-0.5 block">
                      {formatCurrency(inspectedRecord.amount)}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                      Service Breakup
                    </span>
                    <div className="mt-1">
                      <ServiceBreakupList serviceBreakup={inspectedRecord.service_breakup} />
                    </div>
                  </div>
                  <div>
                    <span className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                      Wallet Status
                    </span>
                    <div className="mt-1">
                      {getStatusBadge(inspectedRecord.wallet_status, 'wallet')}
                    </div>
                  </div>
                  <div>
                    <span className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                      Payment Status
                    </span>
                    <div className="mt-1">
                      {getStatusBadge(inspectedRecord.payment_status, 'service')}
                    </div>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-1 bg-white p-3 rounded-lg border border-slate-200">
                    <span className="font-semibold text-slate-500 uppercase tracking-wider text-[10px]">
                      Razorpay Payment ID
                    </span>
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs text-slate-800 break-all select-all font-medium">
                        {inspectedRecord.razorpay_payment_id || inspectedRecord.reference_id || 'N/A'}
                      </span>
                      {(inspectedRecord.razorpay_payment_id || inspectedRecord.reference_id) && (
                        <button
                          onClick={() =>
                            handleCopy(
                              inspectedRecord.razorpay_payment_id || inspectedRecord.reference_id || '',
                              'modal-ref'
                            )
                          }
                          className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer shrink-0 ml-2"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1 bg-white p-3 rounded-lg border border-slate-200">
                    <span className="font-semibold text-slate-500 uppercase tracking-wider text-[10px]">
                      Customer / User ID
                    </span>
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs text-slate-800 break-all select-all font-medium">
                        {inspectedRecord.user_id || 'N/A'}
                      </span>
                      {inspectedRecord.user_id && (
                        <button
                          onClick={() => handleCopy(inspectedRecord.user_id!, 'modal-user')}
                          className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer shrink-0 ml-2"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1 bg-white p-3 rounded-lg border border-slate-200">
                    <span className="font-semibold text-slate-500 uppercase tracking-wider text-[10px]">
                      Requested By (Actor ID)
                    </span>
                    <span className="font-mono text-xs text-slate-800 block">
                      {inspectedRecord.requested_by || 'N/A'}
                    </span>
                  </div>

                  <div className="space-y-1 bg-white p-3 rounded-lg border border-slate-200">
                    <span className="font-semibold text-slate-500 uppercase tracking-wider text-[10px]">
                      Requester Role
                    </span>
                    <span className="text-xs font-medium text-slate-800 block">
                      {inspectedRecord.requested_by_role || 'N/A'}
                    </span>
                  </div>

                  <div className="space-y-1 bg-white p-3 rounded-lg border border-slate-200">
                    <span className="font-semibold text-slate-500 uppercase tracking-wider text-[10px]">
                      Upstream Provider Status
                    </span>
                    <div className="mt-1">
                      {getStatusBadge(inspectedRecord.upstream_status, 'upstream')}
                    </div>
                  </div>

                  <div className="space-y-1 bg-white p-3 rounded-lg border border-slate-200">
                    <span className="font-semibold text-slate-500 uppercase tracking-wider text-[10px]">
                      Created Timestamp
                    </span>
                    <span className="text-xs font-normal text-slate-700 block">
                      {formatDate(inspectedRecord.created_at)}
                    </span>
                  </div>

                  {inspectedRecord.updated_at && (
                    <div className="space-y-1 bg-white p-3 rounded-lg border border-slate-200 md:col-span-2">
                      <span className="font-semibold text-slate-500 uppercase tracking-wider text-[10px]">
                        Last Updated Timestamp
                      </span>
                      <span className="text-xs font-normal text-slate-700 block">
                        {formatDate(inspectedRecord.updated_at)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Raw JSON View */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                      Raw Audit Payload
                    </span>
                    <Button
                      onClick={() => handleCopy(JSON.stringify(inspectedRecord, null, 2), 'raw-json')}
                      variant="ghost"
                      size="sm"
                      className="text-[11px] text-slate-600 h-6 px-2 font-medium"
                    >
                      {copiedKey === 'raw-json' ? (
                        <>
                          <Check className="w-3 h-3 mr-1 text-emerald-600" /> Copied
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3 mr-1" /> Copy JSON
                        </>
                      )}
                    </Button>
                  </div>
                  <pre className="p-3.5 rounded-lg bg-[#0f172a] text-slate-200 font-mono text-[11px] overflow-x-auto max-h-52 leading-relaxed border border-slate-800">
                    {JSON.stringify(inspectedRecord, null, 2)}
                  </pre>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-end">
                <Button
                  onClick={() => setInspectedRecord(null)}
                  className="bg-[#002366] hover:bg-[#001845] text-white rounded-md font-medium px-4 h-8 text-xs shadow-xs"
                >
                  Close Audit View
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
