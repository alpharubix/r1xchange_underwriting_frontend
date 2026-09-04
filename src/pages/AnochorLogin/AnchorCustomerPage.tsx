import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  X,
  Eye,
  ChevronLeft,
  ChevronRight,
  Smartphone,
  ArrowLeft,
  Check,
  Users,
  EyeOff
} from 'lucide-react';
import { useAuthContext } from "@/contexts/AuthContext";
import { useLogout } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAssociatedAnchorsList, getAnchorUsers } from '@/api/user';
import apiClient from '@/lib/axios';
import { useSearchParams } from 'react-router-dom';
import Sidebar from "./Sidebar";
import SuperAnchor from "./SuperAnchor";
import ServiceReport from "./ServiceReport";
import { getAnchorBrand } from "@/lib/brandLogo";
import { Tooltip } from "@/components/ui/Tooltip";

// Mock customer type definition
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

export default function AnchorCustomerPage() {
  const { user: authUser } = useAuthContext();
  const user = authUser as any;
  const logoutMutation = useLogout();

  // Role detection: checks user.role and local storage
  const userRole = String(user?.role || localStorage.getItem("user_role") || "anchor").toLowerCase();
  const isSuperAnchor = userRole === "superanchor" || userRole === "super_anchor" || userRole === "super-anchor";
  const brand = getAnchorBrand(user);

  //filter data state
  const [filterUserId, setFilterUserId] = useState("");
  const [filterCustomerName, setFilterCustomerName] = useState("");
  const [filterPhoneNo, setFilterPhoneNo] = useState("");
  const [filterCompanyName, setFilterCompanyName] = useState("");
  const [filterGSTNo, setFilterGSTNo] = useState("");
  const [filterStatus, setFilterStatus] = useState("");



  // URL params and active tab states
  const [searchParams, setSearchParams] = useSearchParams();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const activeTabParam = searchParams.get("tab") as "anchor" | "customer" | "reports" | null;
  const activeTab = activeTabParam || (isSuperAnchor ? "anchor" : "customer");

  const setActiveTab = (tab: "anchor" | "customer" | "reports") => {
    setSearchParams(prev => {
      prev.set("tab", tab);
      return prev;
    }, { replace: false });
  };

  const customerIdParam = searchParams.get("customerId");

  // Redirect if they land on reports without a customer selected
  useEffect(() => {
    if (activeTab === "reports" && !customerIdParam) {
      setActiveTab("customer");
    }
  }, [activeTab, customerIdParam]);

  // We define selectedCustomer in a useMemo below, after customers is defined
  const [selectedAnchorFilter, setSelectedAnchorFilter] = useState<string | null>(null);
  const [selectedAnchor, setSelectedAnchor] = useState<any | null>(null);
  const [superAnchorViewMode, setSuperAnchorViewMode] = useState<"list" | "details">("list");

  // Initial customer list matching the mockup image
  const [customers, setCustomers] = useState<Customer[]>([]);

  const selectedCustomer = useMemo(() => {
    if (!customerIdParam) return null;
    return customers.find(c => String(c.id) === customerIdParam) || null;
  }, [customerIdParam, customers]);

  const setSelectedCustomer = (customer: Customer | null) => {
    setSearchParams(prev => {
      if (customer) {
        prev.set("customerId", String(customer.id));
      } else {
        prev.delete("customerId");
      }
      return prev;
    }, { replace: false });
  };

  // Fetch anchors list if super anchor
  const { data: fetchedAnchors } = useQuery({
    queryKey: ["anchor", "anchors-list"],
    queryFn: getAssociatedAnchorsList,
    enabled: isSuperAnchor,
  });

  const [anchorsList, setAnchorsList] = useState<any[]>([]);

  useEffect(() => {
    if (fetchedAnchors && fetchedAnchors.length > 0) {
      const mapped = fetchedAnchors.map((anchor: any) => ({
        _id: anchor._id || anchor.id || "",
        anchor_name: anchor.anchor_name || anchor.anchorName || anchor["anchor name"] || "",
        anchor_code: anchor.anchor_code || anchor.anchorCode || anchor["anchor code"] || "",
        login_id: anchor.login_id || anchor.loginid || "",
        is_active: typeof anchor.is_active === "boolean" ? anchor.is_active : anchor.is_active === "true" || anchor.is_active === 1 || anchor.is_active === "1",
        role: anchor.role || "ANCHOR",
        created_at: anchor.created_at || anchor.createat || "",
        updated_at: anchor.updated_at || anchor.updatedat || "",
        created_by: anchor.created_by || anchor.createby || "",
        updated_by: anchor.updated_by || anchor.updateby || "",
      }));
      setAnchorsList(mapped);
    } else {
      setAnchorsList([]);
    }
  }, [fetchedAnchors, isSuperAnchor]);


  const queryParam = isSuperAnchor
    ? (selectedAnchorFilter ?? undefined)
    : undefined;

  // Fetch users under anchor
  const { data: fetchedUsers, isLoading: isUsersLoading } = useQuery({
    queryKey: ["anchor", "users-list", queryParam],
    queryFn: () => getAnchorUsers(queryParam),
    enabled: !isSuperAnchor || !!selectedAnchorFilter,
  });

  const getFlagValue = (userObj: any, baseKey: string) => {
    if (!userObj) return null;
    const keys = Object.keys(userObj);
    const searchKey = baseKey.toLowerCase();

    const matchedKey = keys.find(k => {
      const lk = k.toLowerCase();
      return lk === searchKey ||
        lk === `is_${searchKey}` ||
        lk === `${searchKey}_status` ||
        lk === `${searchKey}status` ||
        lk === `is${searchKey}` ||
        lk === `${searchKey}_completed` ||
        lk === `is_${searchKey}_completed` ||
        lk === `${searchKey}_uploaded` ||
        lk === `is_${searchKey}_uploaded` ||
        lk === `${searchKey}uploaded`;
    });

    if (matchedKey !== undefined) {
      const val = userObj[matchedKey];
      if (typeof val === 'string') {
        const lowerVal = val.toLowerCase();
        if (lowerVal === 'true' || lowerVal === 'completed' || lowerVal === 'success' || lowerVal === 'active' || lowerVal === '1') {
          return true;
        }
        if (lowerVal === 'false' || lowerVal === 'failed' || lowerVal === 'pending' || lowerVal === '0') {
          return false;
        }
      }
      if (typeof val === 'number') {
        return val === 1;
      }
      if (typeof val === 'boolean') {
        return val;
      }
      return val;
    }
    return null;
  };

  useEffect(() => {
    if (fetchedUsers && fetchedUsers.length > 0) {
      console.log("Syncing fetchedUsers to customers state:", fetchedUsers);
      const mapped = fetchedUsers.map((user: any) => ({
        id: user._id || user.user_id || user.userId || user.id || user.account_id || user.accountId || user.accountid || "",
        name: user.customer_name || user.customerName || user.customername || user.name || user.username || user.userName || "",
        phone: user.phone_no || user.phoneNo || user.phone || user.phoneNumber || "",
        company_name: user.company_name || user.companyName || user.companyname || "",
        gst_no: user.gst_no || user.gstNo || user.gst_number || user.gstNumber || user.gstnumber || user.gst || "",
        status: user.status || user.Status || "Active",
        anchor_id: user.anchor_id || user.anchorId || user.anchorid || "",
        created_by: user.created_by || user.createdBy || user.createdBy || "",
        updated_by: user.updated_by || user.updatedBy || user.updatedBy || "",
        bsa: getFlagValue(user, "bsa"),
        gst: getFlagValue(user, "gst"),
        itr: getFlagValue(user, "itr"),
        cibil: getFlagValue(user, "cibil"),
      }));
      setCustomers(mapped);
    }
  }, [fetchedUsers]);

  // UI state variables
  const [isNewCustomerModalOpen, setIsNewCustomerModalOpen] = useState(false);
  const [showNewCustPassword, setShowNewCustPassword] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Form state for new customer creation
  const [newCustomerForm, setNewCustomerForm] = useState({
    name: '',
    phone: '',
    company_name: '',
    email_id: '',
    password: '',
    anchor_id: '',
  });

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const queryClient = useQueryClient();

  const registerMutation = useMutation({
    mutationFn: (data: any) => apiClient.post("/auth/register", data),
    onSuccess: () => {
      toast.success("User registered successfully!");
      queryClient.invalidateQueries({ queryKey: ["anchor", "users-list"] });
      setIsNewCustomerModalOpen(false);
      setNewCustomerForm({
        name: '',
        phone: '',
        company_name: '',
        email_id: '',
        password: '',
        anchor_id: '',
      });
    },
    onError: (err: any) => {
      const errMsg = err.response?.data?.message || err.response?.data?.error || "Registration failed.";
      toast.error(errMsg);
    }
  });

  const handleCreateCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomerForm.name || !newCustomerForm.phone || !newCustomerForm.email_id || !newCustomerForm.password) {
      toast.error("Please fill in all required fields (Name, Mobile, Email, Password).");
      return;
    }

    if (isSuperAnchor && !newCustomerForm.anchor_id) {
      toast.error("Please select an Anchor organization.");
      return;
    }

    const payload: any = {
      customer_name: newCustomerForm.name,
      company_name: newCustomerForm.company_name,
      phone_no: newCustomerForm.phone,
      email_id: newCustomerForm.email_id,
      password: newCustomerForm.password,
      site_code: "ACX01"
    };

    if (isSuperAnchor) {
      const chosenAnchor = anchorsList.find(a => a._id === newCustomerForm.anchor_id);
      payload.anchor_id = newCustomerForm.anchor_id;
      payload.anchor_code = chosenAnchor?.anchor_code || "";
    }

    registerMutation.mutate(payload);
  };

  // Filter customers by anchor code and field filters
  const filteredCustomers = useMemo(() => {
    const effectiveAnchorFilter = isSuperAnchor
      ? selectedAnchorFilter
      : (user?.anchor_code || user?.anchorCode || "ABFL01");

    return customers.filter(c => {
      // 3. User ID filter
      const matchesUserId = !filterUserId || c.id.toLowerCase().includes(filterUserId.toLowerCase());
      const matchesCustomerName = !filterCustomerName || (c.name || c.customer_name || "").toLowerCase().includes(filterCustomerName.toLowerCase());
      const matchesCustomerPhone = !filterPhoneNo || (c.phone || c.phone_no || "").toLowerCase().includes(filterPhoneNo.toLowerCase());
      const matchesCompanyName = !filterCompanyName || (c.company_name || "").toLowerCase().includes(filterCompanyName.toLowerCase());
      const matchesGstNo = !filterGSTNo || (c.gst_no || "").toLowerCase().includes(filterGSTNo.toLowerCase());
      const matchesStatus = !filterStatus || (c.status || "").toLowerCase().includes(filterStatus.toLowerCase());

      // 2. Anchor filter
      const matchesAnchor = !isSuperAnchor || !effectiveAnchorFilter || c.anchor_id === effectiveAnchorFilter || c.anchor_code === effectiveAnchorFilter;

      return (
        matchesUserId &&
        matchesCustomerName &&
        matchesCustomerPhone &&
        matchesCompanyName &&
        matchesGstNo &&
        matchesStatus &&
        matchesAnchor
      );
    });
  }, [
    customers,
    isSuperAnchor,
    selectedAnchorFilter,
    user,
    filterUserId,
    filterCustomerName,
    filterPhoneNo,
    filterCompanyName,
    filterGSTNo,
    filterStatus
  ]);

  const totalPages = useMemo(() => {
    return Math.ceil(filteredCustomers.length / itemsPerPage) || 1;
  }, [filteredCustomers.length, itemsPerPage]);

  const paginatedCustomers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredCustomers.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredCustomers, currentPage, itemsPerPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [
    selectedAnchorFilter,
    filterUserId,
    filterCustomerName,
    filterPhoneNo,
    filterCompanyName,
    filterGSTNo,
    filterStatus
  ]);

  const formatSimpleCurrency = (val: any) => {
    const num = Number(val);
    if (isNaN(num)) return val;
    return `₹ ${num.toLocaleString('en-IN')}`;
  };

  const renderStatusOrValue = (val: any) => {
    if (
      val === true || val === 'true' || val === 1 || val === '1' ||
      val === false || val === 'false' || val === 0 || val === '0'
    ) {
      const isTrue = val === true || val === 'true' || val === 1 || val === '1';
      return isTrue ? (
        <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-[#EAF9F0] text-[#2E9B5C]" title="Completed / True">
          <Check className="h-3.5 w-3.5 stroke-[2.5]" />
        </span>
      ) : (
        <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-[#FDEEEE] text-[#E5484D]" title="Pending / False">
          <X className="h-3.5 w-3.5 stroke-[2.5]" />
        </span>
      );
    }

    const num = Number(val);
    if (isNaN(num) || val === '' || val === null || val === undefined) {
      return (
        <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-[#FDEEEE] text-[#E5484D]" title="Pending / False">
          <X className="h-3.5 w-3.5 stroke-[2.5]" />
        </span>
      );
    }

    return (
      <span className={`font-bold ${num > 0 ? 'text-[#2E9B5C]' : 'text-[#E5484D]'}`}>
        {formatSimpleCurrency(val)}
      </span>
    );
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#F0F1F5] text-[#1D1E2C] font-sans antialiased animate-fade-in">
      {/* ─── SIDEBAR ─── */}
      <Sidebar
        sidebarCollapsed={sidebarCollapsed}
        setSidebarCollapsed={setSidebarCollapsed}
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          if (tab === "anchor") {
            setSuperAnchorViewMode("list");
          }
        }}
        isSuperAnchor={isSuperAnchor}
        userRole={userRole}
        user={user}
        handleLogout={handleLogout}
      />

      {/* ─── MAIN CONTENT AREA ─── */}
      <main className="flex-1 flex flex-col h-full overflow-hidden bg-[#f4f6fa]">
        {/* Top Header Block */}
        <header className="mx-6 mt-6 mb-2 bg-white rounded-3xl h-16 shrink-0 flex items-center justify-between px-6 z-10 shadow-sm border border-gray-100/80 transition-all">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-[#002366] text-white flex items-center justify-center font-black text-lg shadow-sm shrink-0">
              C
            </div>
            <span className="font-['Space_Grotesk'] text-2xl font-black text-[#002366] tracking-tight flex items-center">
              CRISP
            </span>
            <div className="h-6 w-[1px] bg-gray-200 mx-1"></div>
            <span className="text-xs font-semibold text-[#002366] bg-[#eff6ff] px-3.5 py-1.5 rounded-full flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4cd15b] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#4cd15b]"></span>
              </span>
              {isSuperAnchor ? "Anchor View" : "User View"}
            </span>
          </div>

          <div className="flex items-center gap-6">
            {/* Profile Menu */}
            <div className="flex items-center gap-3 cursor-pointer">
              <div className="h-10 w-10 rounded-full bg-white border border-gray-200 flex items-center justify-center font-bold text-sm shrink-0 shadow-sm overflow-hidden p-1">
                {brand.logo ? (
                  <img
                    src={brand.logo}
                    alt={brand.name}
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <div className="h-full w-full rounded-full bg-[#002366] text-white flex items-center justify-center font-bold text-sm">
                    {brand.initial}
                  </div>
                )}
              </div>
              <div className="hidden sm:flex flex-col items-start leading-tight">
                <span className="text-sm font-bold text-gray-900 capitalize">
                  {brand.name}
                </span>
                <span className="text-[11px] text-gray-400 font-medium mt-0.5">
                  {user?.anchor_code || user?.id || "12346"}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Body Container */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6">

          {/* ─── ANCHOR TAB (SUPERANCHOR ONLY) ─── */}
          {activeTab === "anchor" && isSuperAnchor && (
            <>
              {superAnchorViewMode === "list" ? (
                <SuperAnchor
                  anchorsList={anchorsList}
                  onSelectAnchor={(anchor) => {
                    setSelectedAnchor(anchor);
                    setSuperAnchorViewMode("details");
                  }}
                  onViewCustomers={(anchorId) => {
                    const anchorObj = anchorsList.find(a => a._id === anchorId || a.anchor_code === anchorId);
                    setSelectedAnchor(anchorObj || { _id: anchorId, anchor_name: anchorId });
                    setSelectedAnchorFilter(anchorId);
                    setActiveTab("customer");
                  }}
                />
              ) : (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      onClick={() => setSuperAnchorViewMode("list")}
                      className="p-2.5 h-10 w-10 border-2 border-[#002366] bg-white rounded-xl hover:bg-[#002366] hover:text-white text-[#002366] transition-all shadow-sm shadow-[#002366]/20"
                    >
                      <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div>
                      <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">{selectedAnchor?.anchor_name || "Anchor Details"}</h1>
                      <p className="text-sm text-slate-500 mt-0.5">Organization code: {selectedAnchor?.anchor_code}</p>
                    </div>
                  </div>

                  <Card className="border border-gray-100 bg-white shadow-sm rounded-3xl overflow-hidden max-w-3xl">
                    <CardContent className="p-8 space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">User Name --</span>
                          <span className="text-base font-bold text-slate-900 mt-1 block">{selectedAnchor?.anchor_name || "-"}</span>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">User Code</span>
                          <span className="text-base font-mono font-extrabold text-[#002366] mt-1 block">{selectedAnchor?.anchor_code || "-"}</span>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Login ID</span>
                          <span className="text-base font-mono font-medium text-slate-700 mt-1 block">{selectedAnchor?.login_id || "-"}</span>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Status</span>
                          <span className="mt-1 block">
                            {selectedAnchor?.is_active ? (
                              <span className="inline-flex bg-[#EAF9F0] text-[#2E9B5C] font-bold px-2.5 py-0.5 rounded-full text-xs">
                                • Active
                              </span>
                            ) : (
                              <span className="inline-flex bg-[#FDEEEE] text-[#E5484D] font-bold px-2.5 py-0.5 rounded-full text-xs">
                                • Inactive
                              </span>
                            )}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Created At</span>
                          <span className="text-sm text-slate-600 font-medium mt-1 block">
                            {selectedAnchor?.created_at ? new Date(selectedAnchor.created_at).toLocaleString() : "-"}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Updated At</span>
                          <span className="text-sm text-slate-600 font-medium mt-1 block">
                            {selectedAnchor?.updated_at ? new Date(selectedAnchor.updated_at).toLocaleString() : "-"}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Created By</span>
                          <span className="text-sm text-slate-600 font-medium mt-1 block">{selectedAnchor?.created_by || "-"}</span>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Updated By</span>
                          <span className="text-sm text-slate-600 font-medium mt-1 block">{selectedAnchor?.updated_by || "-"}</span>
                        </div>
                      </div>

                      <div className="pt-6 border-t border-slate-100 flex items-center justify-end">
                        <Button
                          onClick={() => {
                            setSelectedAnchorFilter(selectedAnchor?._id || selectedAnchor?.anchor_code || null);
                            setActiveTab("customer");
                          }}
                          className="bg-[#002366] hover:bg-[#001744] text-white font-semibold transition-all rounded-xl h-11 px-6 flex items-center gap-2 shadow-sm shadow-[#002366]/20 cursor-pointer"
                        >
                          <Eye className="h-5 w-5" />
                          View Customers under User
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </>
          )}

          {/* ─── CUSTOMER TAB ─── */}
          {activeTab === "customer" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Title Block */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  {isSuperAnchor && selectedAnchorFilter && (
                    <Button variant="outline" onClick={() => setActiveTab('anchor')} className="p-2.5 h-10 w-10 border-2 border-[#002366] bg-white rounded-xl hover:bg-[#002366] hover:text-white text-[#002366] transition-all shadow-sm shadow-[#002366]/20 shrink-0">
                      <ArrowLeft className="h-5 w-5" />
                    </Button>
                  )}
                  <div>
                    <h1 className="text-3xl font-bold text-[#0f172a] tracking-tight">Customer</h1>
                    <p className="text-sm text-gray-500 font-normal mt-1">Manage your Customers and their services</p>
                  </div>
                </div>

                <Tooltip content="Create New User">
                  <button
                    onClick={() => setIsNewCustomerModalOpen(true)}
                    className="bg-[#1D1E2C] hover:bg-[#1D1E2C]/90 text-white font-bold transition-all rounded-xl h-11 px-5 flex items-center gap-2 shadow-[0_8px_20px_rgba(29,30,44,0.2)] border-none text-xs"
                  >
                    <Plus className="h-4 w-4 stroke-[3]" />
                    New Customer
                  </button>
                </Tooltip>
              </div>

              {isSuperAnchor && !selectedAnchorFilter ? (
                <div className="flex flex-col items-center justify-center p-12 text-center bg-white border border-gray-100 rounded-3xl space-y-4 shadow-sm min-h-[350px]">
                  <div className="h-16 w-16 rounded-full bg-blue-50 flex items-center justify-center text-[#002366] shadow-inner">
                    <Users className="h-8 w-8 text-[#002366]" />
                  </div>
                  <div className="max-w-md space-y-2">
                    <h3 className="text-lg font-bold text-slate-900">No Anchor Selected</h3>
                    <p className="text-sm text-slate-500 font-medium">
                      Please select an Anchor organization from the Anchors tab to view their registered users.
                    </p>
                  </div>
                  <Button
                    onClick={() => setActiveTab("anchor")}
                    className="bg-[#002366] hover:bg-[#001744] text-white rounded-xl px-6 font-semibold shadow-md shadow-[#002366]/20"
                  >
                    Go to Anchors List
                  </Button>
                </div>
              ) : (
                /* Directory Card Block */
                <Card className="border border-gray-100/80 bg-white shadow-sm rounded-3xl overflow-hidden">
                  <CardContent className="p-6 lg:p-8 space-y-6">

                    {/* Filters Block */}
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {/* Account ID */}
                        <div className="space-y-1.5">
                          <Label htmlFor="filter-userid" className="text-xs font-semibold text-gray-700">Account ID</Label>
                          <Input
                            id="filter-userid"
                            placeholder="Search Account ID..."
                            value={filterUserId}
                            onChange={(e) => setFilterUserId(e.target.value)}
                            className="h-10 text-xs border border-gray-200/90 focus:border-[#002366] focus:ring-[#002366] rounded-xl shadow-none bg-white placeholder:text-gray-400"
                          />
                        </div>

                        {/* Customer Name */}
                        <div className="space-y-1.5">
                          <Label htmlFor="filter-custname" className="text-xs font-semibold text-gray-700">Customer Name</Label>
                          <Input
                            id="filter-custname"
                            placeholder="Search Customer Name..."
                            value={filterCustomerName}
                            onChange={(e) => setFilterCustomerName(e.target.value)}
                            className="h-10 text-xs border border-gray-200/90 focus:border-[#002366] focus:ring-[#002366] rounded-xl shadow-none bg-white placeholder:text-gray-400"
                          />
                        </div>

                        {/* Mobile Number */}
                        <div className="space-y-1.5">
                          <Label htmlFor="filter-phone" className="text-xs font-semibold text-gray-700">Mobile Number</Label>
                          <Input
                            id="filter-phone"
                            placeholder="Search Mobile Number..."
                            value={filterPhoneNo}
                            onChange={(e) => setFilterPhoneNo(e.target.value)}
                            className="h-10 text-xs border border-gray-200/90 focus:border-[#002366] focus:ring-[#002366] rounded-xl shadow-none bg-white placeholder:text-gray-400"
                          />
                        </div>

                        {/* Company Name */}
                        <div className="space-y-1.5">
                          <Label htmlFor="filter-company" className="text-xs font-semibold text-gray-700">Company Name</Label>
                          <Input
                            id="filter-company"
                            placeholder="Search Company..."
                            value={filterCompanyName}
                            onChange={(e) => setFilterCompanyName(e.target.value)}
                            className="h-10 text-xs border border-gray-200/90 focus:border-[#002366] focus:ring-[#002366] rounded-xl shadow-none bg-white placeholder:text-gray-400"
                          />
                        </div>

                        {/* GST No */}
                        <div className="space-y-1.5">
                          <Label htmlFor="filter-gst" className="text-xs font-semibold text-gray-700">GST No</Label>
                          <Input
                            id="filter-gst"
                            placeholder="Search GST No..."
                            value={filterGSTNo}
                            onChange={(e) => setFilterGSTNo(e.target.value)}
                            className="h-10 text-xs border border-gray-200/90 focus:border-[#002366] focus:ring-[#002366] rounded-xl shadow-none bg-white placeholder:text-gray-400"
                          />
                        </div>
                      </div>

                      {/* Status row */}
                      <div className="flex items-center justify-between">
                        <div className="w-48 space-y-1.5">
                          <Label htmlFor="filter-status" className="text-xs font-semibold text-gray-700">Status</Label>
                          <Select
                            value={filterStatus || "all"}
                            onValueChange={(val) => setFilterStatus(val === "all" ? "" : val)}
                          >
                            <SelectTrigger className="w-full h-10 px-3 border border-gray-200/90 rounded-xl text-xs font-medium text-gray-700 bg-white focus:ring-[#002366] outline-none shadow-none">
                              <SelectValue placeholder="All Statuses" />
                            </SelectTrigger>
                            <SelectContent className="z-[110] rounded-xl border-gray-100 shadow-xl overflow-hidden bg-white">
                              <SelectItem value="all" className="text-xs font-medium py-2.5">All Statuses</SelectItem>
                              <SelectItem value="active" className="text-xs font-medium py-2.5">Active</SelectItem>
                              <SelectItem value="inactive" className="text-xs font-medium py-2.5">Inactive</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Reset Button */}
                        {(filterUserId || filterCustomerName || filterPhoneNo || filterCompanyName || filterGSTNo || filterStatus) && (
                          <Button
                            variant="ghost"
                            onClick={() => {
                              setFilterUserId("");
                              setFilterCustomerName("");
                              setFilterPhoneNo("");
                              setFilterCompanyName("");
                              setFilterGSTNo("");
                              setFilterStatus("");
                            }}
                            className="h-8 px-3 rounded-lg text-xs font-semibold text-rose-500 hover:text-rose-600 hover:bg-rose-50/50 cursor-pointer self-end"
                          >
                            Clear Filters
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-gray-100 text-gray-400 font-bold text-[11px] uppercase tracking-wider">
                            <th className="py-3 px-4 font-bold text-gray-400">ACCOUNT ID</th>
                            <th className="py-3 px-4 font-bold text-gray-400">CUSTOMER NAME</th>
                            <th className="py-3 px-4 font-bold text-gray-400">MOBILE NUMBER</th>
                            <th className="py-3 px-4 font-bold text-gray-400">COMPANY NAME</th>
                            <th className="py-3 px-4 font-bold text-gray-400">GST NO</th>
                            <th className="py-3 px-4 font-bold text-gray-400">STATUS</th>
                            <th className="py-3 px-4 font-bold text-center text-gray-400">BSA</th>
                            <th className="py-3 px-4 font-bold text-center text-gray-400">GST</th>
                            <th className="py-3 px-4 font-bold text-center text-gray-400">ITR</th>
                            <th className="py-3 px-4 font-bold text-center text-gray-400">CIBIL</th>
                            <th className="py-3 px-4 font-bold text-center text-gray-400">ACTIONS</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-sm">
                          {isUsersLoading ? (
                            <tr>
                              <td colSpan={11} className="py-12 text-center text-gray-400 font-bold">
                                <div className="flex justify-center items-center gap-3">
                                  <span className="h-5 w-5 rounded-full border-2 border-slate-300 border-t-[#002366] animate-spin" />
                                  <span>Loading users list...</span>
                                </div>
                              </td>
                            </tr>
                          ) : paginatedCustomers.length > 0 ? (
                            paginatedCustomers.map((cust) => (
                              <tr
                                key={cust.id}
                                className="hover:bg-gray-50/70 transition-colors cursor-pointer text-gray-800"
                                onClick={() => {
                                  setSearchParams(prev => {
                                    prev.set("customerId", String(cust.id));
                                    prev.set("tab", "reports");
                                    return prev;
                                  });
                                  toast.info(`Viewing reports for ${cust.name}`);
                                }}
                              >
                                {/* ACCOUNT ID */}
                                <td className="py-4 px-4 font-mono text-xs text-gray-600">
                                  {cust.id}
                                </td>

                                {/* USER NAME */}
                                <td className="py-4 px-4 font-bold text-gray-900">
                                  {cust.name}
                                </td>

                                {/* MOBILE NUMBER */}
                                <td className="py-4 px-4 text-gray-700">
                                  {cust.phone}
                                </td>

                                {/* COMPANY NAME */}
                                <td className="py-4 px-4 text-gray-700">
                                  {cust.company_name}
                                </td>

                                {/* GST NO */}
                                <td className="py-4 px-4 text-gray-700 font-mono">
                                  {cust.gst_no}
                                </td>

                                {/* STATUS */}
                                <td className="py-4 px-4">
                                  {cust.status && String(cust.status).toLowerCase() === 'active' ? (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#EAF9F0] text-[#2E9B5C]">
                                      <span className="h-1.5 w-1.5 rounded-full bg-[#2E9B5C]" />
                                      Active
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#FDEEEE] text-[#E5484D]">
                                      <span className="h-1.5 w-1.5 rounded-full bg-[#E5484D]" />
                                      Inactive
                                    </span>
                                  )}
                                </td>

                                {/* BSA */}
                                <td className="py-4 px-4 text-center">
                                  {renderStatusOrValue(cust.bsa)}
                                </td>

                                {/* GST */}
                                <td className="py-4 px-4 text-center">
                                  {renderStatusOrValue(cust.gst)}
                                </td>

                                {/* ITR */}
                                <td className="py-4 px-4 text-center">
                                  {renderStatusOrValue(cust.itr)}
                                </td>

                                {/* CIBIL */}
                                <td className="py-4 px-4 text-center">
                                  {renderStatusOrValue(cust.cibil)}
                                </td>

                                {/* ACTIONS */}
                                <td className="py-4 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                                  <Tooltip content="View Customer Reports">
                                    <button
                                      onClick={() => {
                                        setSearchParams(prev => {
                                          prev.set("customerId", String(cust.id));
                                          prev.set("tab", "reports");
                                          return prev;
                                        });
                                        toast.info(`Viewing reports for ${cust.name}`);
                                      }}
                                      className="p-1.5 rounded-lg bg-[#FF6B4A]/10 text-[#FF6B4A] hover:bg-[#FF6B4A] hover:text-white transition-all shadow-sm group"
                                    >
                                      <Eye className="h-4 w-4" />
                                    </button>
                                  </Tooltip>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={11} className="py-12 text-center text-slate-400">
                                No users match your search criteria.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>

                    {/* Pagination block */}
                    <div className="flex items-center justify-center pt-4 border-t border-gray-100 gap-1.5">
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                        className="p-2 border border-gray-200 rounded-xl hover:bg-gray-50 text-gray-500 disabled:opacity-40 disabled:hover:bg-white transition-colors cursor-pointer"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </button>

                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`h-9 w-9 rounded-xl border text-sm font-semibold transition-all cursor-pointer ${currentPage === page
                            ? 'bg-[#002366] border-[#002366] text-white shadow-sm shadow-[#002366]/20'
                            : 'border-gray-200 hover:bg-gray-50 text-gray-600'
                            }`}
                        >
                          {page}
                        </button>
                      ))}

                      <button
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                        className="p-2 border border-gray-200 rounded-xl hover:bg-gray-50 text-gray-500 disabled:opacity-40 disabled:hover:bg-white transition-colors cursor-pointer"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>

                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* ─── REPORTS TAB ─── */}
          {activeTab === "reports" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {selectedCustomer && (
                <ServiceReport
                  selectedCustomer={selectedCustomer}
                  onBack={() => {
                    setSelectedCustomer(null);
                    setActiveTab("customer");
                  }}
                />
              )}
            </div>
          )}
        </div>
      </main>

      {/* New Customer Modal */}
      <AnimatePresence>
        {isNewCustomerModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div

              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsNewCustomerModalOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 overflow-hidden z-10"
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Add New Customer</h2>
                  <p className="text-xs text-slate-400 mt-0.5 font-medium">Create a new customer profile and allocate audit credits</p>
                </div>
                <Tooltip content="Close Dialog">
                  <button
                    onClick={() => setIsNewCustomerModalOpen(false)}
                    className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </Tooltip>
              </div>

              <form onSubmit={handleCreateCustomer} className="space-y-4 mt-4" autoComplete="off">
                {isSuperAnchor && (
                  <div className="space-y-1">
                    <Label htmlFor="cust-anchor" className="text-xs font-semibold text-slate-600">
                      Select User *
                    </Label>
                    <Select
                      value={newCustomerForm.anchor_id}
                      onValueChange={(val) => setNewCustomerForm({ ...newCustomerForm, anchor_id: val })}
                      required
                    >
                      <SelectTrigger id="cust-anchor" className="w-full h-10 px-3 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 bg-white focus:ring-[#002366] outline-none">
                        <SelectValue placeholder="Select User Organization" />
                      </SelectTrigger>
                      <SelectContent className="z-[110] rounded-xl border-slate-200 shadow-xl overflow-hidden bg-white">
                        {anchorsList.map((anc) => (
                          <SelectItem
                            key={anc._id}
                            value={anc._id}
                            className="text-xs font-medium cursor-pointer focus:bg-slate-50 focus:text-slate-900 transition-colors py-2.5"
                          >
                            {anc.anchor_name} ({anc.anchor_code})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label htmlFor="cust-name" className="text-xs font-semibold text-slate-600">
                      Customer Name *
                    </Label>
                    <Input
                      id="cust-name"
                      required
                      placeholder="Enter Customer Name"
                      value={newCustomerForm.name}
                      onChange={(e) => setNewCustomerForm({ ...newCustomerForm, name: e.target.value })}
                      className="h-10 rounded-xl border-slate-200 focus:border-[#002366] focus:ring-[#002366] shadow-none"
                      autoComplete="off"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="cust-phone" className="text-xs font-semibold text-slate-600">
                      Mobile Number *
                    </Label>
                    <div className="relative">
                      <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        id="cust-phone"
                        required
                        placeholder="E.g., 9876543210"
                        value={newCustomerForm.phone}
                        onChange={(e) => setNewCustomerForm({ ...newCustomerForm, phone: e.target.value })}
                        className="h-10 pl-9 rounded-xl border-slate-200 focus:border-[#002366] focus:ring-[#002366] shadow-none"
                        autoComplete="off"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="cust-company" className="text-xs font-semibold text-slate-600">
                    Company Name
                  </Label>
                  <Input
                    id="cust-company"
                    placeholder="E.g., ABC Pvt Ltd"
                    value={newCustomerForm.company_name}
                    onChange={(e) => setNewCustomerForm({ ...newCustomerForm, company_name: e.target.value })}
                    className="h-10 rounded-xl border-slate-200 focus:border-[#002366] focus:ring-[#002366] shadow-none"
                    autoComplete="off"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label htmlFor="cust-email" className="text-xs font-semibold text-slate-600">
                      Email ID *
                    </Label>
                    <Input
                      id="cust-email"
                      type="email"
                      required
                      placeholder="E.g., name@domain.com"
                      value={newCustomerForm.email_id}
                      onChange={(e) => setNewCustomerForm({ ...newCustomerForm, email_id: e.target.value })}
                      className="h-10 rounded-xl border-slate-200 focus:border-[#002366] focus:ring-[#002366] shadow-none"
                      autoComplete="new-email"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="cust-password" className="text-xs font-semibold text-slate-600">
                      Password *
                    </Label>
                    <div className="relative">
                      <Input
                        id="cust-password"
                        type={showNewCustPassword ? "text" : "password"}
                        required
                        placeholder="Enter account password"
                        value={newCustomerForm.password}
                        onChange={(e) => setNewCustomerForm({ ...newCustomerForm, password: e.target.value })}
                        className="h-10 pr-10 rounded-xl border-slate-200 focus:border-[#002366] focus:ring-[#002366] shadow-none"
                        autoComplete="new-password"
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center">
                        <Tooltip content={showNewCustPassword ? "Hide Password" : "Show Password"}>
                          <button
                            type="button"
                            onClick={() => setShowNewCustPassword(!showNewCustPassword)}
                            className="text-slate-400 hover:text-slate-600 focus:outline-none flex"
                          >
                            {showNewCustPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </Tooltip>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsNewCustomerModalOpen(false)}
                    className="border-slate-200 rounded-xl hover:bg-slate-50 text-slate-600 h-10 shadow-none"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={registerMutation.isPending}
                    className="bg-[#002366] hover:bg-[#001744] text-white rounded-xl px-5 h-10 shadow-md shadow-[#002366]/20 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {registerMutation.isPending ? (
                      <span className="flex items-center gap-2">
                        <span className="h-4 w-4 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                        Registering...
                      </span>
                    ) : (
                      "Create Customer"
                    )}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
