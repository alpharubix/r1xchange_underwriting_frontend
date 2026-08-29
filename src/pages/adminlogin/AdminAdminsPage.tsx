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
import { getAdminsList } from "@/api/user";

interface RecordItem {
  loginid: string;
  adminstatus: string;
  role: string;
  createat: string;
  updatedat: string;
}

export default function AdminAdminsPage() {
  const [adminsList, setAdminsList] = useState<RecordItem[]>([]);

  // Fetch admin list
  const { data: fetchedAdmins, isLoading } = useQuery({
    queryKey: ["admin", "admins-list"],
    queryFn: getAdminsList,
  });

  useEffect(() => {
    if (fetchedAdmins) {
      const mapped = fetchedAdmins.map((admin: any) => ({
        loginid: admin.login_id || admin.loginid || "",
        adminstatus: admin.admin_status || admin.adminstatus || admin.status || "Active",
        role: admin.role || "ADMIN",
        createat: admin.created_at || admin.createat || "",
        updatedat: admin.updated_at || admin.updatedat || "",
      }));
      setAdminsList(mapped);
    }
  }, [fetchedAdmins]);

  // Filter input states
  const [filterloginid, setFilterloginid] = useState("");
  const [filteradminstatus, setFilteradminstatus] = useState("");
  const [filterrole, setFilterrole] = useState("");
  const [filtercreateat, setFiltercreateat] = useState("");
  const [filterupdatedat, setFilterupdatedat] = useState("");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Modal states for inspecting/creating
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [inspectedRecord, setInspectedRecord] = useState<RecordItem | null>(null);

  const [newFormData, setNewFormData] = useState({
    loginid: "",
    adminstatus: "Active",
    role: "ADMIN",
  });

  // Apply filters logic (live filtering)
  const filteredList = useMemo(() => {
    return adminsList.filter((item) => {
      const matchLoginId = filterloginid ? item.loginid.toLowerCase().includes(filterloginid.toLowerCase()) : true;
      const matchStatus = filteradminstatus ? item.adminstatus.toLowerCase() === filteradminstatus.toLowerCase() : true;
      const matchRole = filterrole ? item.role.toLowerCase() === filterrole.toLowerCase() : true;
      const matchCreateAt = filtercreateat ? item.createat.toLowerCase().includes(filtercreateat.toLowerCase()) : true;
      const matchUpdateAt = filterupdatedat ? item.updatedat.toLowerCase().includes(filterupdatedat.toLowerCase()) : true;

      return matchLoginId && matchStatus && matchRole && matchCreateAt && matchUpdateAt;
    });
  }, [
    adminsList,
    filterloginid,
    filteradminstatus,
    filterrole,
    filtercreateat,
    filterupdatedat,
  ]);

  // Reset pagination on filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [
    filterloginid,
    filteradminstatus,
    filterrole,
    filtercreateat,
    filterupdatedat,
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

    if (!newFormData.loginid || !newFormData.adminstatus || !newFormData.role) {
      toast.error("Mandatory fields (Login ID, Status, Role) are missing.");
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
      loginid: newFormData.loginid,
      adminstatus: newFormData.adminstatus,
      role: newFormData.role,
      createat: formatDateTime(),
      updatedat: formatDateTime(),
    };

    setAdminsList((prev) => [newRecord, ...prev]);
    toast.success(`Admin created successfully.`);
    setIsCreateModalOpen(false);
    setNewFormData({
      loginid: "",
      adminstatus: "Active",
      role: "ADMIN",
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
            Manage and view all admins records.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 rounded-xl h-11 px-5 font-bold shadow-md transition-all duration-200 hover:scale-[1.02]"
          >
            <Plus className="h-4.5 w-4.5" />
            Create Admin
          </Button>
        </div>
      </header>

      {/* Body Container */}
      <div className="flex-1 overflow-y-auto px-8 py-8 space-y-6">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-lg font-black text-slate-900 tracking-tight">
              Admin List Portal
            </h2>
          </div>

          {/* ─── FILTERS ─── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {/* Login ID Filter */}
            <div className="space-y-1.5">
              <Label htmlFor="flogin" className="text-xs font-bold text-slate-500 uppercase tracking-wider">LOGIN ID</Label>
              <Input
                id="flogin"
                placeholder="Enter Login ID"
                value={filterloginid}
                onChange={(e) => setFilterloginid(e.target.value)}
                className="h-11 border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white rounded-xl text-sm"
              />
            </div>

            {/* Admin Status Filter */}
            <div className="space-y-1.5">
              <Label htmlFor="fstatus" className="text-xs font-bold text-slate-500 uppercase tracking-wider">Admin Status</Label>
              <select
                id="fstatus"
                value={filteradminstatus}
                onChange={(e) => setFilteradminstatus(e.target.value)}
                className="h-11 w-full px-3 bg-slate-50/50 hover:bg-white focus:bg-white border border-slate-200 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded-xl text-sm outline-none font-semibold text-slate-700 transition-all"
              >
                <option value="">Select Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
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
                <option value="ADMIN">ADMIN</option>
                <option value="SUPER_ADMIN">SUPER_ADMIN</option>
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
          </div>

          {/* ─── DATA TABLE ─── */}
          <div className="border border-slate-200 rounded-2xl overflow-hidden flex flex-col bg-white">
            <div className="overflow-x-auto w-full">
              <table className="w-full border-collapse text-left text-xs whitespace-nowrap">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-800 font-bold uppercase tracking-wider select-none">
                    <th className="py-4 px-6 min-w-[120px]">LOGIN ID</th>
                    <th className="py-4 px-6 min-w-[200px]">ADMIN STATUS</th>
                    <th className="py-4 px-6 min-w-[180px]">Role</th>
                    <th className="py-4 px-6 min-w-[120px]">Created At</th>
                    <th className="py-4 px-6 min-w-[150px]">Updated At</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {isLoading ? (
                    <tr>
                      <td colSpan={5} className="py-16 text-center text-slate-400 font-bold">
                        Loading admin records...
                      </td>
                    </tr>
                  ) : paginatedList.length > 0 ? (
                    paginatedList.map((item) => (
                      <tr
                        key={item.loginid}
                        onClick={() => setInspectedRecord(item)}
                        className="transition-colors hover:bg-slate-50/40 cursor-pointer"
                      >
                        <td className="py-4 px-6 text-slate-900 font-bold">{item.loginid}</td>
                        <td className="py-4 px-6 text-slate-600 font-normal">{item.adminstatus}</td>
                        <td className="py-4 px-6 text-slate-950 font-bold">{item.role}</td>
                        <td className="py-4 px-6 text-slate-500 font-semibold">{item.createat}</td>
                        <td className="py-4 px-6 text-slate-500 font-semibold">{item.updatedat}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-16 text-center text-slate-400 font-bold">
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
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Login ID</span>
                    <span className="font-bold text-slate-800">{inspectedRecord.loginid}</span>
                  </div>

                  <div>
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Role</span>
                    <span className="font-bold text-slate-800">{inspectedRecord.role}</span>
                  </div>

                  <div>
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Admin Status</span>
                    <span className="font-semibold text-slate-800">{inspectedRecord.adminstatus}</span>
                  </div>

                  <div>
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Created At</span>
                    <span className="font-semibold text-slate-800">{inspectedRecord.createat}</span>
                  </div>

                  <div>
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Updated At</span>
                    <span className="font-semibold text-slate-800">{inspectedRecord.updatedat}</span>
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
                    <h2 className="text-lg font-black text-slate-900">Create New Admin</h2>
                    <p className="text-[10px] text-slate-500 font-extrabold uppercase tracking-wider mt-0.5">
                      Fill in the details to insert a new admin record
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
                    {/* Login ID */}
                    <div className="space-y-1.5">
                      <Label htmlFor="nlogin" className="text-xs font-bold text-slate-500 uppercase tracking-wider">Login ID</Label>
                      <Input
                        id="nlogin"
                        placeholder="e.g. ADM01"
                        value={newFormData.loginid}
                        onChange={(e) => setNewFormData((prev) => ({ ...prev, loginid: e.target.value }))}
                        className="h-11 rounded-xl text-sm"
                      />
                    </div>

                    {/* Status */}
                    <div className="space-y-1.5">
                      <Label htmlFor="nstatus" className="text-xs font-bold text-slate-500 uppercase tracking-wider">Admin Status</Label>
                      <select
                        id="nstatus"
                        value={newFormData.adminstatus}
                        onChange={(e) => setNewFormData((prev) => ({ ...prev, adminstatus: e.target.value }))}
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
                        <option value="ADMIN">ADMIN</option>
                        <option value="SUPER_ADMIN">SUPER_ADMIN</option>
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
