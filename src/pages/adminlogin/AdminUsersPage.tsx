import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  X,
  Check,
  AlertTriangle,
} from "lucide-react";
import { useParams, useNavigate, } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getUsersList } from "@/api/user";
import AdminSidebar from "./sidebarpage";
import AdminAdminsPage from "./AdminAdminsPage";
import AdminAnchorsPage from "./AdminAnchorsPage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";


interface RecordItem {
  accountid: string;
  emailid: string;
  customername: string;
  emailverified: boolean;
  phone: string;
  phoneverified: boolean;
  companyname: string;
  gstnumber: string;
  status: "Active" | "Inactive";
  role: "USER" | "ADMIN" | "ANCHOR";
  createat: string;
  updatedat: string;
  lastloginat: string;
  secondarygstlist: string;
  anchor_id: string;
}

const findAccountId = (user: any, index: number): string => {
  const keys = Object.keys(user);
  for (const key of keys) {
    const lowerKey = key.toLowerCase();
    if (lowerKey.includes("account") && lowerKey.includes("id")) {
      const val = user[key];
      if (val !== null && val !== undefined && val !== "") return String(val);
    }
  }
  for (const key of keys) {
    const lowerKey = key.toLowerCase();
    if (lowerKey.includes("user") && lowerKey.includes("id")) {
      const val = user[key];
      if (val !== null && val !== undefined && val !== "") return String(val);
    }
  }
  if (user.id !== undefined && user.id !== null && user.id !== "") return String(user.id);
  if (user._id !== undefined && user._id !== null && user._id !== "") return String(user._id);

  for (const key of keys) {
    const lowerKey = key.toLowerCase();
    if (lowerKey.includes("id") && !lowerKey.includes("email") && !lowerKey.includes("anchor")) {
      const val = user[key];
      if (val !== null && val !== undefined && val !== "") return String(val);
    }
  }
  return `ACC-${100 + index}`;
};

const findLastLoginValue = (user: any): string => {
  const keys = Object.keys(user);
  for (const key of keys) {
    const lowerKey = key.toLowerCase();
    if ((lowerKey.includes("login") || lowerKey.includes("active")) &&
        (lowerKey.includes("at") || lowerKey.includes("time") || lowerKey.includes("date") || lowerKey.includes("dt") || lowerKey.includes("day"))) {
      const val = user[key];
      if (val !== null && val !== undefined && val !== "") return String(val);
    }
  }
  for (const key of keys) {
    const lowerKey = key.toLowerCase();
    if ((lowerKey.includes("login") || lowerKey.includes("active")) &&
        !lowerKey.includes("ip") && !lowerKey.includes("status")) {
      const val = user[key];
      if (val !== null && val !== undefined && val !== "") return String(val);
    }
  }
  return "-";
};

export default function AdminDashboardPage() {
  const { tab } = useParams<{ tab?: string }>();
  const navigate = useNavigate();

  const activeTab = useMemo(() => {
    const t = tab?.toLowerCase();
    if (t === "user" || t === "admin" || t === "anchor" || t === "anchors") {
      return t === "anchors" ? "anchor" : (t as "user" | "admin" | "anchor");
    }
    return "user";
  }, [tab]);

  console.log("RENDER - tab param:", tab, "activeTab derived:", activeTab);

  const handleTabChange = (targetTab: "user" | "admin" | "anchor") => {
    const isCapital = window.location.pathname.startsWith("/Admins");
    const tabSegment = targetTab === "anchor" ? "anchors" : targetTab;
    const targetUrl = `${isCapital ? "/Admins" : "/admins"}/${tabSegment}`;
    console.log("handleTabChange - targetTab:", targetTab, "navigating to:", targetUrl);
    navigate(targetUrl);
  };

  useEffect(() => {
    const t = tab?.toLowerCase();
    console.log("useEffect tab check - t:", t);
    if (!t || (t !== "user" && t !== "admin" && t !== "anchor" && t !== "anchors")) {
      console.log("Redirecting undefined/invalid tab to user");
      handleTabChange("user");
    }
  }, [tab]);

  const { data: fetchedUsers, isLoading } = useQuery({
    queryKey: ["admin", "users-list"],
    queryFn: getUsersList,
    enabled: activeTab === "user",
  });

  const [usersList, setUsersList] = useState<RecordItem[]>([]);

  useEffect(() => {
    if (fetchedUsers) {
      const mapped = fetchedUsers.map((user: any, index: number) => ({
        accountid: findAccountId(user, index),
        emailid: user.emailid || user.email_id || user.emailId || user.email || "",
        customername: user.customername || user.customer_name || user.customerName || user.name || "",
        emailverified: !!(user.emailverified ?? user.email_verified ?? user.emailVerified ?? false),
        phone: user.phone || user.phone_no || user.phoneNo || user.phoneNumber || "",
        phoneverified: !!(user.phoneverified ?? user.phone_verified ?? user.phoneVerified ?? false),
        companyname: user.companyname || user.company_name || user.companyName || "",
        gstnumber: user.gstnumber || user.gst_number || user.gstNumber || user.gst || "",
        status: user.status === "Active" || user.status === "Inactive" ? user.status : (user.status ? "Active" : "Inactive"),
        role: user.role || "USER",
        createat: user.createat || user.created_at || user.createAt || user.createdAt || "",
        updatedat: user.updatedat || user.updated_at || user.updatedAt || user.updatedAt || "",
        lastloginat: findLastLoginValue(user),
        secondarygstlist: Array.isArray(user.secondary_gst_list)
          ? user.secondary_gst_list.join(", ")
          : (user.secondarygstlist || user.secondary_gst_list || user.secondaryGstList || ""),
        anchor_id: user.anchor_id || user.anchorId || "",
      }));
      setUsersList(mapped);
    }
  }, [fetchedUsers]);

  // Filter input states
  const [filterAccId, setFilterAccId] = useState("");
  const [filterEmailId, setFilterEmailId] = useState("");
  const [filterCustomerName, setFilterCustomerName] = useState("");
  const [filterPhone, setFilterPhone] = useState("");
  const [filterCompanyName, setFilterCompanyName] = useState("");
  const [filterGstNumber, setFilterGstNumber] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterAnchorId, setFilterAnchorId] = useState("");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  // Modal states for inspecting
  const [inspectedRecord, setInspectedRecord] = useState<RecordItem | null>(null);

  // Selected tab list
  const currentList = usersList;

  // Apply filters logic (live filtering)
  const filteredList = useMemo(() => {
    return currentList.filter((item) => {
      const matchAccId = filterAccId ? item.accountid.toLowerCase().includes(filterAccId.toLowerCase()) : true;
      const matchEmail = filterEmailId ? item.emailid.toLowerCase().includes(filterEmailId.toLowerCase()) : true;
      const matchCustomerName = filterCustomerName ? item.customername.toLowerCase().includes(filterCustomerName.toLowerCase()) : true;
      const matchPhone = filterPhone ? item.phone.toLowerCase().includes(filterPhone.toLowerCase()) : true;
      const matchCompanyName = filterCompanyName ? item.companyname.toLowerCase().includes(filterCompanyName.toLowerCase()) : true;
      const matchGstNumber = filterGstNumber ? item.gstnumber.toLowerCase().includes(filterGstNumber.toLowerCase()) : true;
      const matchStatus = filterStatus !== "all" ? item.status.toLowerCase() === filterStatus.toLowerCase() : true;
      const matchAnchor = filterAnchorId ? item.anchor_id.toLowerCase().includes(filterAnchorId.toLowerCase()) : true;

      return matchAccId && matchEmail && matchCustomerName && matchPhone && matchCompanyName && matchGstNumber && matchStatus && matchAnchor;
    });
  }, [
    currentList,
    filterAccId,
    filterEmailId,
    filterCustomerName,
    filterPhone,
    filterCompanyName,
    filterGstNumber,
    filterStatus,
    filterAnchorId,
  ]);

  // Reset pagination on tab change or filters change
  useMemo(() => {
    setCurrentPage(1);
  }, [
    activeTab,
    filterAccId,
    filterEmailId,
    filterCustomerName,
    filterPhone,
    filterCompanyName,
    filterGstNumber,
    filterStatus,
    filterAnchorId,
  ]);

  // Paginated list
  const paginatedList = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredList.slice(startIndex, startIndex + pageSize);
  }, [filteredList, currentPage, pageSize]);

  const totalPages = Math.max(1, Math.ceil(filteredList.length / pageSize));



  console.log("activeTab", activeTab)

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#f4f6f9] text-slate-800 antialiased font-sans">
      <AdminSidebar />

      {activeTab === "admin" ? (
        <AdminAdminsPage />
      ) : activeTab === "anchor" ? (
        <AdminAnchorsPage />
      ) : (
        <>
          {/* ─── MAIN CONTENT AREA ─── */}
          <main className="flex-1 flex flex-col h-full overflow-hidden">
            {/* Top Header */}
            <header className="flex items-center justify-between bg-white px-8 py-5 border-b border-slate-200 shrink-0">
              <div>
                <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                  CRISP ADMIN DASHBOARD
                </h1>
                <p className="text-sm text-slate-500 font-semibold mt-0.5">
                  Manage and view all users records.
                </p>
              </div>

            </header>

            {/* Body Container */}
            {activeTab === "user" && (
              <div className="flex-1 overflow-y-auto px-8 py-8 space-y-6">
                {/* ─── INVOICE MASTER COMPONENT CARD ─── */}
                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <h2 className="text-lg font-black text-slate-900 tracking-tight">
                      {activeTab === "user" ? "User List Portal" : activeTab === "admin" ? "Admin List Portal" : "Anchor List Portal"}
                    </h2>
                  </div>

                  {/* ─── FILTERS ─── */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">

                    {/* Account ID Filter */}
                    <div className="space-y-1.5">
                      <Label htmlFor="facc" className="text-xs font-bold text-slate-500 uppercase tracking-wider">Account ID</Label>
                      <Input
                        id="facc"
                        placeholder="Enter Account ID"
                        value={filterAccId}
                        onChange={(e) => setFilterAccId(e.target.value)}
                        className="h-11 border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white rounded-xl text-sm"
                      />
                    </div>

                    {/* Email ID Filter */}
                    <div className="space-y-1.5">
                      <Label htmlFor="femail" className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email ID</Label>
                      <Input
                        id="femail"
                        placeholder="Enter Email"
                        value={filterEmailId}
                        onChange={(e) => setFilterEmailId(e.target.value)}
                        className="h-11 border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white rounded-xl text-sm"
                      />
                    </div>

                    {/* Customer Name Filter */}
                    <div className="space-y-1.5">
                      <Label htmlFor="fname" className="text-xs font-bold text-slate-500 uppercase tracking-wider">Customer Name</Label>
                      <Input
                        id="fname"
                        placeholder="Enter Name"
                        value={filterCustomerName}
                        onChange={(e) => setFilterCustomerName(e.target.value)}
                        className="h-11 border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white rounded-xl text-sm"
                      />
                    </div>

                    {/* Phone Filter */}
                    <div className="space-y-1.5">
                      <Label htmlFor="fphone" className="text-xs font-bold text-slate-500 uppercase tracking-wider">Phone</Label>
                      <Input
                        id="fphone"
                        placeholder="Enter Phone"
                        value={filterPhone}
                        onChange={(e) => setFilterPhone(e.target.value)}
                        className="h-11 border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white rounded-xl text-sm"
                      />
                    </div>

                    {/* Company Name Filter */}
                    <div className="space-y-1.5">
                      <Label htmlFor="fcompany" className="text-xs font-bold text-slate-500 uppercase tracking-wider">Company Name</Label>
                      <Input
                        id="fcompany"
                        placeholder="Enter Company"
                        value={filterCompanyName}
                        onChange={(e) => setFilterCompanyName(e.target.value)}
                        className="h-11 border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white rounded-xl text-sm"
                      />
                    </div>

                    {/* GST Number Filter */}
                    <div className="space-y-1.5">
                      <Label htmlFor="fgst" className="text-xs font-bold text-slate-500 uppercase tracking-wider">GST Number</Label>
                      <Input
                        id="fgst"
                        placeholder="Enter GST"
                        value={filterGstNumber}
                        onChange={(e) => setFilterGstNumber(e.target.value)}
                        className="h-11 border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white rounded-xl text-sm"
                      />
                    </div>

                    {/* Status Filter */}
                    <div className="space-y-1.5">
                      <Label htmlFor="fstatus" className="text-xs font-bold text-slate-500 uppercase tracking-wider">Status</Label>
                      <select
                        id="fstatus"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="h-11 w-full px-3 bg-slate-50/50 hover:bg-white focus:bg-white border border-slate-200 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded-xl text-sm outline-none font-semibold text-slate-700 transition-all"
                      >
                        <option value="all">Select Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>

                    {/* Anchor ID Filter */}
                    <div className="space-y-1.5">
                      <Label htmlFor="fanchor" className="text-xs font-bold text-slate-500 uppercase tracking-wider">Anchor ID</Label>
                      <Input
                        id="fanchor"
                        placeholder="Enter Anchor ID"
                        value={filterAnchorId}
                        onChange={(e) => setFilterAnchorId(e.target.value)}
                        className="h-11 border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white rounded-xl text-sm"
                      />
                    </div>
                  </div>

                  {/* ─── DATA TABLE ─── */}
                  <div className="border border-slate-200 rounded-2xl overflow-hidden flex flex-col bg-white">
                    <div className="overflow-x-auto w-full">
                      <table className="w-full border-collapse text-left text-xs whitespace-nowrap">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-200 text-slate-800 font-bold uppercase tracking-wider select-none">
                            <th className="py-4 px-6 min-w-[120px]">Account ID</th>
                            <th className="py-4 px-6 min-w-[200px]">Email ID</th>
                            <th className="py-4 px-6 min-w-[180px]">Customer Name</th>
                            <th className="py-4 px-6 min-w-[120px]">Email Verified</th>
                            <th className="py-4 px-6 min-w-[150px]">Phone</th>
                            <th className="py-4 px-6 min-w-[130px]">Phone Verified</th>
                            <th className="py-4 px-6 min-w-[180px]">Company Name</th>
                            <th className="py-4 px-6 min-w-[150px]">GST Number</th>
                            <th className="py-4 px-6 min-w-[100px]">Status</th>
                            <th className="py-4 px-6 min-w-[90px]">Role</th>
                            <th className="py-4 px-6 min-w-[180px]">Created At</th>
                            <th className="py-4 px-6 min-w-[180px]">Updated At</th>
                            <th className="py-4 px-6 min-w-[180px]">Last Login At</th>
                            <th className="py-4 px-6 min-w-[240px]">Secondary GST List</th>
                            <th className="py-4 px-6 min-w-[120px]">Anchor ID</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                          {isLoading ? (
                            <tr>
                              <td colSpan={17} className="py-16 text-center text-slate-400 font-bold">
                                <div className="flex justify-center items-center gap-3">
                                  <span className="h-5 w-5 rounded-full border-2 border-slate-300 border-t-blue-600 animate-spin" />
                                  <span>Loading users list...</span>
                                </div>
                              </td>
                            </tr>
                          ) : paginatedList.length > 0 ? (
                            paginatedList.map((item) => {
                              return (
                                <tr
                                  key={item.accountid}
                                  onClick={() => setInspectedRecord(item)}
                                  className="transition-colors hover:bg-slate-50/40 cursor-pointer"
                                >

                                  <td className="py-4 px-6 text-slate-900 font-bold">{item.accountid}</td>
                                  <td className="py-4 px-6 text-slate-600 font-normal">{item.emailid}</td>
                                  <td className="py-4 px-6 text-slate-950 font-bold">{item.customername}</td>
                                  <td className="py-4 px-6">
                                    {item.emailverified ? (
                                      <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 font-bold px-2 py-0.5 rounded-md text-[10px]">
                                        <Check className="h-3 w-3" /> VERIFIED
                                      </span>
                                    ) : (
                                      <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 font-bold px-2 py-0.5 rounded-md text-[10px]">
                                        <AlertTriangle className="h-3 w-3" /> UNVERIFIED
                                      </span>
                                    )}
                                  </td>
                                  <td className="py-4 px-6 text-slate-600">{item.phone}</td>
                                  <td className="py-4 px-6">
                                    {item.phoneverified ? (
                                      <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 font-bold px-2 py-0.5 rounded-md text-[10px]">
                                        <Check className="h-3 w-3" /> VERIFIED
                                      </span>
                                    ) : (
                                      <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 font-bold px-2 py-0.5 rounded-md text-[10px]">
                                        <AlertTriangle className="h-3 w-3" /> UNVERIFIED
                                      </span>
                                    )}
                                  </td>
                                  <td className="py-4 px-6 text-slate-700">{item.companyname}</td>
                                  <td className="py-4 px-6 text-slate-700 font-mono">{item.gstnumber}</td>
                                  <td className="py-4 px-6">
                                    {item.status === "Active" ? (
                                      <span className="inline-flex bg-green-100 text-green-700 font-bold px-2.5 py-0.5 rounded-full text-[10px] leading-5">
                                        Active
                                      </span>
                                    ) : (
                                      <span className="inline-flex bg-slate-100 text-slate-600 font-bold px-2.5 py-0.5 rounded-full text-[10px] leading-5">
                                        Inactive
                                      </span>
                                    )}
                                  </td>
                                  <td className="py-4 px-6 text-[10px] font-extrabold tracking-wider text-slate-500 uppercase">
                                    {item.role}
                                  </td>
                                  <td className="py-4 px-6 text-slate-500 font-semibold">{item.createat}</td>
                                  <td className="py-4 px-6 text-slate-500 font-semibold">{item.updatedat}</td>
                                  <td className="py-4 px-6 text-slate-500 font-semibold">{item.lastloginat}</td>
                                  <td className="py-4 px-6 text-slate-500 max-w-[200px] truncate">{item.secondarygstlist || "N/A"}</td>
                                  <td className="py-4 px-6 text-slate-900 font-bold">{item.anchor_id || "N/A"}</td>
                                </tr>
                              );
                            })
                          ) : (
                            <tr>
                              <td colSpan={17} className="py-16 text-center text-slate-400 font-bold">
                                No records match the applied filters.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>

                    {/* ─── PAGINATION ─── */}
                    <div className="flex flex-col sm:flex-row items-center justify-between border-t border-slate-200 bg-slate-50/50 px-6 py-4 gap-4">
                      <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">
                        Showing <span className="text-slate-800">{filteredList.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}</span> to{" "}
                        <span className="text-slate-800">{Math.min(currentPage * pageSize, filteredList.length)}</span> of{" "}
                        <span className="text-slate-800">{filteredList.length}</span> results
                      </div>

                      <div className="flex items-center gap-6">
                        {/* Page size dropdown */}
                        <div className="flex items-center gap-2">
                          <select
                          >
                            <option value={10}>10</option>
                          </select>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => setCurrentPage(1)}
                            disabled={currentPage === 1}
                            className="flex h-8 w-8 items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition-all shadow-sm"
                          >
                            <ChevronsLeft className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="flex h-8 w-8 items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition-all shadow-sm"
                          >
                            <ChevronLeft className="h-4 w-4" />
                          </button>

                          <span className="text-xs font-bold text-slate-700 px-2 min-w-[70px] text-center select-none">
                            Page {currentPage} of {totalPages}
                          </span>

                          <button
                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="flex h-8 w-8 items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition-all shadow-sm"
                          >
                            <ChevronRight className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => setCurrentPage(totalPages)}
                            disabled={currentPage === totalPages}
                            className="flex h-8 w-8 items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition-all shadow-sm"
                          >
                            <ChevronsRight className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </main>

          {/* ─── DETAILS INSPECTOR MODAL ─── */}
          <AnimatePresence>
            {inspectedRecord && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden max-h-[85vh] flex flex-col"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between px-8 py-6 border-b border-slate-100 bg-slate-50/50">
                    <div>
                      <h2 className="text-lg font-black text-slate-900">Record Details Inspector</h2>
                      <p className="text-[10px] text-slate-500 font-extrabold uppercase tracking-wider mt-0.5">
                        Viewing Record ID:
                      </p>
                    </div>
                    <button
                      onClick={() => setInspectedRecord(null)}
                      className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  {/* Record Content Grid */}
                  <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6">
                    {/* Profile Header */}
                    <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      <div>
                        <h3 className="text-lg font-bold text-slate-900">{inspectedRecord.customername}</h3>
                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{inspectedRecord.role}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">

                      <div>
                        <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Account ID</span>
                        <span className="font-bold text-slate-800">{inspectedRecord.accountid}</span>
                      </div>

                      <div>
                        <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Email ID</span>
                        <span className="font-semibold text-slate-800">{inspectedRecord.emailid}</span>
                      </div>

                      <div>
                        <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Email Verified</span>
                        <span className="font-bold text-slate-800">{inspectedRecord.emailverified ? "YES" : "NO"}</span>
                      </div>

                      <div>
                        <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Phone</span>
                        <span className="font-semibold text-slate-800">{inspectedRecord.phone}</span>
                      </div>

                      <div>
                        <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Phone Verified</span>
                        <span className="font-bold text-slate-800">{inspectedRecord.phoneverified ? "YES" : "NO"}</span>
                      </div>

                      <div>
                        <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Company Name</span>
                        <span className="font-semibold text-slate-800">{inspectedRecord.companyname}</span>
                      </div>

                      <div>
                        <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">GST Number</span>
                        <span className="font-mono font-bold text-slate-800">{inspectedRecord.gstnumber}</span>
                      </div>

                      <div>
                        <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Status</span>
                        <span className="font-bold text-slate-800">{inspectedRecord.status}</span>
                      </div>

                      <div>
                        <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Role</span>
                        <span className="font-bold text-slate-800">{inspectedRecord.role}</span>
                      </div>

                      <div>
                        <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Created At</span>
                        <span className="font-semibold text-slate-800">{inspectedRecord.createat}</span>
                      </div>

                      <div>
                        <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Updated At</span>
                        <span className="font-semibold text-slate-800">{inspectedRecord.updatedat}</span>
                      </div>

                      <div>
                        <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Last Login At</span>
                        <span className="font-semibold text-slate-800">{inspectedRecord.lastloginat}</span>
                      </div>

                      <div>
                        <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Anchor ID</span>
                        <span className="font-bold text-slate-800">{inspectedRecord.anchor_id || "N/A"}</span>
                      </div>

                      <div className="md:col-span-2">
                        <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Secondary GST List</span>
                        <span className="font-semibold text-slate-800 block bg-slate-50 p-2.5 rounded-xl border border-slate-100 max-h-24 overflow-y-auto">
                          {inspectedRecord.secondarygstlist || "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="px-8 py-5 bg-slate-50/50 border-t border-slate-100 flex justify-end">
                    <Button
                      onClick={() => setInspectedRecord(null)}
                      className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold px-6 h-10 shadow-md"
                    >
                      Close Inspector
                    </Button>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>


        </>
      )}
    </div>
  );
}
