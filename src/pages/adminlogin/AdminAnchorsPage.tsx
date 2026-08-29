import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { getAnchorsList } from "@/api/user";

interface RecordItem {
  anchor_name: string;
  anchor_code: string;
  loginid: string;
  is_active: boolean;
  role: string;
  createat: string;
  updatedat: string;
  createby: string;
  updateby: string;
}

export default function AdminAnchorsPage() {
  const [anchorsList, setAnchorsList] = useState<RecordItem[]>([]);

  // Fetch anchors list
  const { data: fetchedAnchors, isLoading } = useQuery({
    queryKey: ["admin", "anchors-list"],
    queryFn: getAnchorsList,
  });

  useEffect(() => {
    if (fetchedAnchors) {
      const mapped = fetchedAnchors.map((anchor: any) => ({
        anchor_name: anchor.anchor_name || anchor.anchorName || anchor["anchor name"] || "",
        anchor_code: anchor.anchor_code || anchor.anchorCode || anchor["anchor code"] || "",
        loginid: anchor.login_id || anchor.loginid || "",
        is_active: typeof anchor.is_active === "boolean" ? anchor.is_active : anchor.is_active === "true" || anchor.is_active === 1 || anchor.is_active === "1",
        role: anchor.role || "ANCHOR",
        createat: anchor.created_at || anchor.createat || "",
        updatedat: anchor.updated_at || anchor.updatedat || "",
        createby: anchor.created_by || anchor.createby || "",
        updateby: anchor.updated_by || anchor.updateby || "",
      }));
      setAnchorsList(mapped);
    }
  }, [fetchedAnchors]);

  // Filter input states
  const [filteranchorname, setFilteranchorname] = useState("");
  const [filteranchorcode, setFilteranchorcode] = useState("");
  const [filterloginid, setFilterloginid] = useState("");
  const [filterisactive, setFilterisactive] = useState("all");
  const [filterrole, setFilterrole] = useState("");
  const [filtercreateat, setFiltercreateat] = useState("");
  const [filterupdatedat, setFilterupdatedat] = useState("");
  const [filtercreateby, setFiltercreateby] = useState("");
  const [filterupdateby, setFilterupdateby] = useState("");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Modal states for inspecting/creating
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [inspectedRecord, setInspectedRecord] = useState<RecordItem | null>(null);

  const [newFormData, setNewFormData] = useState({
    anchor_name: "",
    anchor_code: "",
    loginid: "",
    is_active: true,
    role: "ANCHOR",
  });

  // Apply filters logic (live filtering)
  const filteredList = useMemo(() => {
    return anchorsList.filter((item) => {
      const matchAnchorName = filteranchorname ? item.anchor_name.toLowerCase().includes(filteranchorname.toLowerCase()) : true;
      const matchAnchorCode = filteranchorcode ? item.anchor_code.toLowerCase().includes(filteranchorcode.toLowerCase()) : true;
      const matchLoginId = filterloginid ? item.loginid.toLowerCase().includes(filterloginid.toLowerCase()) : true;
      const matchStatus = filterisactive !== "all"
        ? (filterisactive === "true" ? item.is_active === true : item.is_active === false)
        : true;
      const matchRole = filterrole !== ""
        ? (filterrole === "ANCHOR" ? item.role === "ANCHOR" :
          filterrole === "SUPER_ANCHOR" ? item.role === "SUPER_ANCHOR" : true) : true;

      const matchCreateAt = filtercreateat ? item.createat.toLowerCase().includes(filtercreateat.toLowerCase()) : true;
      const matchUpdateAt = filterupdatedat ? item.updatedat.toLowerCase().includes(filterupdatedat.toLowerCase()) : true;
      const matchCreateBy = filtercreateby ? item.createby.toLowerCase().includes(filtercreateby.toLowerCase()) : true;
      const matchUpdateBy = filterupdateby ? item.updateby.toLowerCase().includes(filterupdateby.toLowerCase()) : true;

      return (
        matchAnchorName &&
        matchAnchorCode &&
        matchLoginId &&
        matchStatus &&
        matchRole &&
        matchCreateAt &&
        matchUpdateAt &&
        matchCreateBy &&
        matchUpdateBy
      );
    });
  }, [
    anchorsList,
    filteranchorname,
    filteranchorcode,
    filterloginid,
    filterisactive,
    filterrole,
    filtercreateat,
    filterupdatedat,
    filtercreateby,
    filterupdateby,
  ]);

  // Reset pagination on filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [
    filteranchorname,
    filteranchorcode,
    filterloginid,
    filterisactive,
    filterrole,
    filtercreateat,
    filterupdatedat,
    filtercreateby,
    filterupdateby,
  ]);

  // Paginated list
  const paginatedList = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredList.slice(startIndex, startIndex + pageSize);
  }, [filteredList, currentPage]);

  const totalPages = Math.max(1, Math.ceil(filteredList.length / pageSize));

  // Create Submit
  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newFormData.anchor_name || !newFormData.anchor_code || !newFormData.loginid) {
      toast.error("Mandatory fields (Anchor Name, Anchor Code, Login ID) are missing.");
      return;
    }

    const formatDateTime = () => {
      const now = new Date();
      return now.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }) + " " + now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    };

    const newRecord: RecordItem = {
      anchor_name: newFormData.anchor_name,
      anchor_code: newFormData.anchor_code,
      loginid: newFormData.loginid,
      is_active: newFormData.is_active,
      role: newFormData.role,
      createat: formatDateTime(),
      updatedat: formatDateTime(),
      createby: "ADMIN",
      updateby: "ADMIN",
    };

    setAnchorsList((prev) => [newRecord, ...prev]);
    toast.success(`Anchor created successfully.`);
    setIsCreateModalOpen(false);
    setNewFormData({
      anchor_name: "",
      anchor_code: "",
      loginid: "",
      is_active: true,
      role: "ANCHOR",
    });
  };

  return (
    <main className="flex-1 flex flex-col h-full overflow-hidden">
      {/* Top Header */}
      <header className="flex items-center justify-between bg-white px-8 py-5 border-b border-slate-200 shrink-0">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            CRISP ADMIN PORTAL
          </h1>
          <p className="text-sm text-slate-500 font-semibold mt-0.5">
            Manage and view all anchors records.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 rounded-xl h-11 px-5 font-bold shadow-md transition-all duration-200 hover:scale-[1.02]"
          >
            <Plus className="h-4.5 w-4.5" />
            Create Anchor
          </Button>
        </div>
      </header>

      {/* Body Container */}
      <div className="flex-1 overflow-y-auto px-8 py-8 space-y-6">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-lg font-black text-slate-900 tracking-tight">
              Anchor List Portal
            </h2>
          </div>

          {/* ─── FILTERS ─── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {/* Anchor Name Filter */}
            <div className="space-y-1.5">
              <Label htmlFor="faname" className="text-xs font-bold text-slate-500 uppercase tracking-wider">Anchor Name</Label>
              <Input
                id="faname"
                placeholder="Enter Anchor Name"
                value={filteranchorname}
                onChange={(e) => setFilteranchorname(e.target.value)}
                className="h-11 border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white rounded-xl text-sm"
              />
            </div>

            {/* Anchor Code Filter */}
            <div className="space-y-1.5">
              <Label htmlFor="facode" className="text-xs font-bold text-slate-500 uppercase tracking-wider">Anchor Code</Label>
              <Input
                id="facode"
                placeholder="Enter Anchor Code"
                value={filteranchorcode}
                onChange={(e) => setFilteranchorcode(e.target.value)}
                className="h-11 border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white rounded-xl text-sm"
              />
            </div>

            {/* Login ID Filter */}
            <div className="space-y-1.5">
              <Label htmlFor="flogin" className="text-xs font-bold text-slate-500 uppercase tracking-wider">Login ID</Label>
              <Input
                id="flogin"
                placeholder="Enter Login ID"
                value={filterloginid}
                onChange={(e) => setFilterloginid(e.target.value)}
                className="h-11 border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white rounded-xl text-sm"
              />
            </div>

            {/* Status Filter */}
            <div className="space-y-1.5">
              <Label htmlFor="fstatus" className="text-xs font-bold text-slate-500 uppercase tracking-wider">Status</Label>
              <select
                id="fstatus"
                value={filterisactive}
                onChange={(e) => setFilterisactive(e.target.value)}
                className="h-11 w-full px-3 bg-slate-50/50 hover:bg-white focus:bg-white border border-slate-200 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded-xl text-sm outline-none font-semibold text-slate-700 transition-all"
              >
                <option value="all">Select Status</option>
                <option value="active">true</option>
                <option value="inactive">false</option>
              </select>
            </div>

            {/* Role Filter */}
            <div className="space-y-1.5">
              <Label htmlFor="frole" className="text-xs font-bold text-slate-500 uppercase tracking-wider">Role</Label>
              <select
                id="frole"
                value={filterrole}
                onChange={(e) => setFilterrole(e.target.value)}
                className="h-11 w-full px-3 bg-slate-50/50 hover:bg-white focus:bg-white border border-slate-200 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded-xl text-sm outline-none font-semibold text-slate-700 transition-all"
              >
                <option value="">Select Role</option>
                <option value="ANCHOR">ANCHOR</option>
                <option value="SUPER_ANCHOR">SUPER_ANCHOR</option>
              </select>
            </div>

            {/* Created At Filter */}
            <div className="space-y-1.5">
              <Label htmlFor="fcreate" className="text-xs font-bold text-slate-500 uppercase tracking-wider">Created At</Label>
              <Input
                id="fcreate"
                placeholder="Enter Created At"
                value={filtercreateat}
                onChange={(e) => setFiltercreateat(e.target.value)}
                className="h-11 border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white rounded-xl text-sm"
              />
            </div>

            {/* Updated At Filter */}
            <div className="space-y-1.5">
              <Label htmlFor="fupdate" className="text-xs font-bold text-slate-500 uppercase tracking-wider">Updated At</Label>
              <Input
                id="fupdate"
                placeholder="Enter Updated At"
                value={filterupdatedat}
                onChange={(e) => setFilterupdatedat(e.target.value)}
                className="h-11 border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white rounded-xl text-sm"
              />
            </div>

            {/* Created By Filter */}
            <div className="space-y-1.5">
              <Label htmlFor="fcreateby" className="text-xs font-bold text-slate-500 uppercase tracking-wider">Created By</Label>
              <Input
                id="fcreateby"
                placeholder="Enter Created By"
                value={filtercreateby}
                onChange={(e) => setFiltercreateby(e.target.value)}
                className="h-11 border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white rounded-xl text-sm"
              />
            </div>

            {/* Updated By Filter */}
            <div className="space-y-1.5">
              <Label htmlFor="fupdateby" className="text-xs font-bold text-slate-500 uppercase tracking-wider">Updated By</Label>
              <Input
                id="fupdateby"
                placeholder="Enter Updated By"
                value={filterupdateby}
                onChange={(e) => setFilterupdateby(e.target.value)}
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
                    <th className="py-4 px-6 min-w-[150px]">Anchor Name</th>
                    <th className="py-4 px-6 min-w-[130px]">Anchor Code</th>
                    <th className="py-4 px-6 min-w-[120px]">Login ID</th>
                    <th className="py-4 px-6 min-w-[100px]">Status</th>
                    <th className="py-4 px-6 min-w-[100px]">Role</th>
                    <th className="py-4 px-6 min-w-[150px]">Created At</th>
                    <th className="py-4 px-6 min-w-[150px]">Updated At</th>
                    <th className="py-4 px-6 min-w-[120px]">Created By</th>
                    <th className="py-4 px-6 min-w-[120px]">Updated By</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {isLoading ? (
                    <tr>
                      <td colSpan={9} className="py-16 text-center text-slate-400 font-bold">
                        Loading anchor records...
                      </td>
                    </tr>
                  ) : paginatedList.length > 0 ? (
                    paginatedList.map((item) => (
                      <tr
                        key={item.anchor_code + "-" + item.loginid}
                        onClick={() => setInspectedRecord(item)}
                        className="transition-colors hover:bg-slate-50/40 cursor-pointer"
                      >
                        <td className="py-4 px-6 text-slate-900 font-bold">{item.anchor_name}</td>
                        <td className="py-4 px-6 text-slate-700 font-semibold">{item.anchor_code}</td>
                        <td className="py-4 px-6 text-slate-600 font-normal">{item.loginid}</td>
                        <td className="py-4 px-6">
                          {item.is_active ? (
                            <span className="inline-flex  font-bold px-2.5 py-0.5 rounded-full text-[10px] leading-5">
                              true
                            </span>
                          ) : (
                            <span className="inline-flex  font-bold px-2.5 py-0.5 rounded-full text-[10px] leading-5">
                              false
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-6 text-[10px] font-extrabold tracking-wider text-slate-500 uppercase">{item.role}</td>
                        <td className="py-4 px-6 text-slate-500 font-semibold">{item.createat}</td>
                        <td className="py-4 px-6 text-slate-500 font-semibold">{item.updatedat}</td>
                        <td className="py-4 px-6 text-slate-500 font-semibold">{item.createby}</td>
                        <td className="py-4 px-6 text-slate-500 font-semibold">{item.updateby}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={9} className="py-16 text-center text-slate-400 font-bold">
                        No records match the applied filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between border-t border-slate-200 bg-slate-50/50 px-6 py-4 gap-4">
              <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">
                Showing <span className="text-slate-800">{filteredList.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}</span> to{" "}
                <span className="text-slate-800">{Math.min(currentPage * pageSize, filteredList.length)}</span> of{" "}
                <span className="text-slate-800">{filteredList.length}</span> results
              </div>

              <div className="flex items-center gap-6">
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
                    Viewing Record Login ID: {inspectedRecord.loginid}
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Anchor Name</span>
                    <span className="font-bold text-slate-800">{inspectedRecord.anchor_name}</span>
                  </div>

                  <div>
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Anchor Code</span>
                    <span className="font-bold text-slate-800">{inspectedRecord.anchor_code}</span>
                  </div>

                  <div>
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Login ID</span>
                    <span className="font-semibold text-slate-800">{inspectedRecord.loginid}</span>
                  </div>

                  <div>
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Status</span>
                    <span className="font-semibold text-slate-800">
                      {inspectedRecord.is_active ? "Active" : "Inactive"}
                    </span>
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
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Created By</span>
                    <span className="font-semibold text-slate-800">{inspectedRecord.createby}</span>
                  </div>

                  <div>
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Updated By</span>
                    <span className="font-semibold text-slate-800">{inspectedRecord.updateby}</span>
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

      {/* ─── CREATE MODAL ─── */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col"
            >
              <form onSubmit={handleCreateSubmit} className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between px-8 py-6 border-b border-slate-100 bg-slate-50/50">
                  <div>
                    <h2 className="text-lg font-black text-slate-900">Create New Anchor</h2>
                    <p className="text-[10px] text-slate-500 font-extrabold uppercase tracking-wider mt-0.5">
                      Fill in the details to insert a new anchor record
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Form Fields */}
                <div className="flex-1 overflow-y-auto px-8 py-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Anchor Name */}
                    <div className="space-y-1.5">
                      <Label htmlFor="nname" className="text-xs font-bold text-slate-500 uppercase tracking-wider">Anchor Name *</Label>
                      <Input
                        id="nname"
                        placeholder="e.g. Acme Anchor"
                        required
                        value={newFormData.anchor_name}
                        onChange={(e) => setNewFormData((prev) => ({ ...prev, anchor_name: e.target.value }))}
                        className="h-11 rounded-xl text-sm"
                      />
                    </div>

                    {/* Anchor Code */}
                    <div className="space-y-1.5">
                      <Label htmlFor="ncode" className="text-xs font-bold text-slate-500 uppercase tracking-wider">Anchor Code *</Label>
                      <Input
                        id="ncode"
                        placeholder="e.g. ANC01"
                        required
                        value={newFormData.anchor_code}
                        onChange={(e) => setNewFormData((prev) => ({ ...prev, anchor_code: e.target.value }))}
                        className="h-11 rounded-xl text-sm"
                      />
                    </div>

                    {/* Login ID */}
                    <div className="space-y-1.5">
                      <Label htmlFor="nlogin" className="text-xs font-bold text-slate-500 uppercase tracking-wider">Login ID *</Label>
                      <Input
                        id="nlogin"
                        placeholder="e.g. anchor_login"
                        required
                        value={newFormData.loginid}
                        onChange={(e) => setNewFormData((prev) => ({ ...prev, loginid: e.target.value }))}
                        className="h-11 rounded-xl text-sm"
                      />
                    </div>

                    {/* Status */}
                    <div className="space-y-1.5">
                      <Label htmlFor="nstatus" className="text-xs font-bold text-slate-500 uppercase tracking-wider">Status</Label>
                      <select
                        id="nstatus"
                        value={newFormData.is_active ? "Active" : "Inactive"}
                        onChange={(e) => setNewFormData((prev) => ({ ...prev, is_active: e.target.value === "Active" }))}
                        className="h-11 w-full px-3 bg-white border border-slate-200 rounded-xl text-sm outline-none font-semibold text-slate-700"
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>

                    {/* Role */}
                    <div className="space-y-1.5">
                      <Label htmlFor="nrole" className="text-xs font-bold text-slate-500 uppercase tracking-wider">Role</Label>
                      <select
                        id="nrole"
                        value={newFormData.role}
                        onChange={(e) => setNewFormData((prev) => ({ ...prev, role: e.target.value }))}
                        className="h-11 w-full px-3 bg-white border border-slate-200 rounded-xl text-sm outline-none font-semibold text-slate-700"
                      >
                        <option value="ANCHOR">ANCHOR</option>
                        <option value="SUPER_ANCHOR">SUPER_ANCHOR</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="px-8 py-5 bg-slate-50/50 border-t border-slate-100 flex justify-end gap-3 shrink-0">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="rounded-xl font-bold px-6 h-11 border-slate-200 hover:bg-slate-50"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold px-6 h-11 shadow-md"
                  >
                    Create Record
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
