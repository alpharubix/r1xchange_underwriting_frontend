import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Plus, X, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/axios";
import { toast } from "sonner";


interface SuperAnchorProps {
  anchorsList: Array<{
    _id?: string;
    anchor_name: string;
    anchor_code: string;
    login_id: string;
    is_active: boolean;
    role: string;
    created_at: string;
    updated_at: string | null;
    created_by: string;
    updated_by: string | null;
  }>;
  onViewCustomers?: (anchorId: string) => void;
  onSelectAnchor?: (anchor: any) => void;
}

export default function SuperAnchor({ anchorsList, onViewCustomers, onSelectAnchor }: SuperAnchorProps) {
  const queryClient = useQueryClient();

  // Modal and form states
  const [isNewAnchorModalOpen, setIsNewAnchorModalOpen] = useState(false);
  const [showNewAnchorPassword, setShowNewAnchorPassword] = useState(false);
  const [newAnchorForm, setNewAnchorForm] = useState({
    name: "",
    phone: "",
    company_name: "",
    email_id: "",
    password: "",
  });

  // Mutation to register new Anchor
  const registerAnchorMutation = useMutation({
    mutationFn: (data: any) => apiClient.post("/auth/anchor/create", data),
    onSuccess: () => {
      toast.success("Anchor registered successfully!");
      queryClient.invalidateQueries({ queryKey: ["anchor", "anchors-list"] });
      setIsNewAnchorModalOpen(false);
      setNewAnchorForm({
        name: "",
        phone: "",
        company_name: "",
        email_id: "",
        password: "",
      });
    },
    onError: (err: any) => {
      const errMsg = err.response?.data?.message || err.response?.data?.error || "Failed to register anchor.";
      toast.error(errMsg);
    }
  });

  const handleCreateAnchor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnchorForm.name || !newAnchorForm.phone || !newAnchorForm.email_id || !newAnchorForm.password) {
      toast.error("Please fill in all required fields.");
      return;
    }

    registerAnchorMutation.mutate({
      anchor_name: newAnchorForm.name,
      company_name: newAnchorForm.company_name,
      phone_no: newAnchorForm.phone,
      email_id: newAnchorForm.email_id,
      password: newAnchorForm.password,
      site_code: "AcX01"
    });
  };

  // Filter input states
  const [filterName, setFilterName] = useState("");
  const [filterCode, setFilterCode] = useState("");
  const [filterLoginId, setFilterLoginId] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterCreatedBy, setFilterCreatedBy] = useState("");
  const [filterUpdatedBy, setFilterUpdatedBy] = useState("");

  // Memoized filtered anchors list
  const filteredAnchors = useMemo(() => {
    return anchorsList.filter((anc) => {
      const matchesName = !filterName || anc.anchor_name.toLowerCase().includes(filterName.toLowerCase());
      const matchesCode = !filterCode || anc.anchor_code.toLowerCase().includes(filterCode.toLowerCase());
      const matchesLoginId = !filterLoginId || anc.login_id.toLowerCase().includes(filterLoginId.toLowerCase());

      const statusStr = anc.is_active ? "active" : "inactive";
      const matchesStatus = !filterStatus || statusStr === filterStatus.toLowerCase();

      const matchesCreatedBy = !filterCreatedBy || (anc.created_by || "").toLowerCase().includes(filterCreatedBy.toLowerCase());
      const matchesUpdatedBy = !filterUpdatedBy || (anc.updated_by || "").toLowerCase().includes(filterUpdatedBy.toLowerCase());

      return matchesName && matchesCode && matchesLoginId && matchesStatus && matchesCreatedBy && matchesUpdatedBy;
    });
  }, [anchorsList, filterName, filterCode, filterLoginId, filterStatus, filterCreatedBy, filterUpdatedBy]);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-['Space_Grotesk'] text-2xl font-bold text-[#1D1E2C]">Users Directory</h1>
          <p className="text-sm text-[#8a8d97] font-medium mt-0.5">Manage and view all registered User organizations</p>
        </div>
        <button
          onClick={() => setIsNewAnchorModalOpen(true)}
          className="bg-[#002366] hover:bg-[#001744] text-white font-semibold transition-all rounded-xl h-11 px-5 flex items-center gap-2 shadow-[0_8px_20px_rgba(29,30,44,0.2)] border-none text-xs"
        >
          <Plus className="h-4 w-4 stroke-[3]" />
          Create User
        </button>
      </div>

      {/* Advanced Filters Block */}
      <div className="bg-[#F6F6F8] rounded-[18px] p-5 space-y-4">
        <div className="text-xs font-bold text-[#1D1E2C] tracking-wide uppercase pb-2 border-b border-[#F0F1F5]">
          Filter Users
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {/* Anchor Name */}
          <div className="space-y-1.5">
            <Label htmlFor="filter-name" className="text-xs font-semibold text-slate-600">User Name</Label>
            <Input
              id="filter-name"
              placeholder="Search Name..."
              value={filterName}
              onChange={(e) => setFilterName(e.target.value)}
              className="h-10 text-xs border-slate-200 focus:border-[#1D1E2C] focus:ring-[#1D1E2C] rounded-xl shadow-none bg-white"
            />
          </div>

          {/* Anchor Code */}
          <div className="space-y-1.5">
            <Label htmlFor="filter-code" className="text-xs font-semibold text-slate-600">User Code</Label>
            <Input
              id="filter-code"
              placeholder="Search Code..."
              value={filterCode}
              onChange={(e) => setFilterCode(e.target.value)}
              className="h-10 text-xs border-slate-200 focus:border-[#1D1E2C] focus:ring-[#1D1E2C] rounded-xl shadow-none bg-white"
            />
          </div>

          {/* Login ID */}
          <div className="space-y-1.5">
            <Label htmlFor="filter-loginid" className="text-xs font-semibold text-slate-600">Login ID</Label>
            <Input
              id="filter-loginid"
              placeholder="Search Login ID..."
              value={filterLoginId}
              onChange={(e) => setFilterLoginId(e.target.value)}
              className="h-10 text-xs border-slate-200 focus:border-[#1D1E2C] focus:ring-[#1D1E2C] rounded-xl shadow-none bg-white"
            />
          </div>

          {/* Status */}
          <div className="space-y-1.5">
            <Label htmlFor="filter-status" className="text-xs font-semibold text-slate-600">Status</Label>
            <Select
              value={filterStatus || "all"}
              onValueChange={(val) => setFilterStatus(val === "all" ? "" : val)}
            >
              <SelectTrigger className="w-full h-10 px-3 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 bg-white focus:ring-[#1D1E2C] outline-none shadow-none">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent className="z-[110] rounded-xl border-slate-200 shadow-xl overflow-hidden bg-white">
                <SelectItem value="all" className="text-xs font-medium cursor-pointer focus:bg-slate-50 focus:text-slate-900 transition-colors py-2.5">All Statuses</SelectItem>
                <SelectItem value="active" className="text-xs font-medium cursor-pointer focus:bg-slate-50 focus:text-slate-900 transition-colors py-2.5">Active</SelectItem>
                <SelectItem value="inactive" className="text-xs font-medium cursor-pointer focus:bg-slate-50 focus:text-slate-900 transition-colors py-2.5">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Created By */}
          <div className="space-y-1.5">
            <Label htmlFor="filter-createdby" className="text-xs font-semibold text-slate-600">Created By</Label>
            <Input
              id="filter-createdby"
              placeholder="Search Creator ID..."
              value={filterCreatedBy}
              onChange={(e) => setFilterCreatedBy(e.target.value)}
              className="h-10 text-xs border-slate-200 focus:border-[#1D1E2C] focus:ring-[#1D1E2C] rounded-xl shadow-none bg-white"
            />
          </div>

          {/* Updated By */}
          <div className="space-y-1.5">
            <Label htmlFor="filter-updatedby" className="text-xs font-semibold text-slate-600">Updated By</Label>
            <Input
              id="filter-updatedby"
              placeholder="Search Updater ID..."
              value={filterUpdatedBy}
              onChange={(e) => setFilterUpdatedBy(e.target.value)}
              className="h-10 text-xs border-slate-200 focus:border-[#1D1E2C] focus:ring-[#1D1E2C] rounded-xl shadow-none bg-white"
            />
          </div>
        </div>
      </div>




      <Card className="border-none bg-white shadow-[0_1px_2px_rgba(20,20,30,0.04),0_8px_24px_rgba(20,20,30,0.04)] rounded-[20px] overflow-hidden">
        <CardContent className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm whitespace-nowrap">
              <thead>
                <tr className="border-b border-[#F0F1F5] text-[#A0A3AD] font-bold text-[10.5px] uppercase tracking-wider bg-[#F6F6F8]/30">
                  <th className="py-3 px-4 font-bold text-[#A0A3AD]">User Name</th>
                  <th className="py-3 px-4 font-bold text-[#A0A3AD]">User Code</th>
                  <th className="py-3 px-4 font-bold text-[#A0A3AD]">Login ID</th>
                  <th className="py-3 px-4 font-bold text-[#A0A3AD]">Status</th>
                  <th className="py-3 px-4 font-bold text-[#A0A3AD]">Role</th>
                  <th className="py-3 px-4 font-bold text-[#A0A3AD]">Created At</th>
                  <th className="py-3 px-4 font-bold text-[#A0A3AD]">Updated At</th>
                  <th className="py-3 px-4 font-bold text-[#A0A3AD]">Created By</th>
                  <th className="py-3 px-4 font-bold text-[#A0A3AD]">Updated By</th>
                  <th className="py-3 px-4 font-bold text-center text-[#A0A3AD]">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F6F6F8] text-[13px] text-[#3A3C46]">
                {filteredAnchors.map((anc, idx) => (
                  <tr
                    key={idx}
                    onClick={() => onSelectAnchor?.(anc)}
                    className="hover:bg-[#F6F6F8] transition-colors cursor-pointer text-[#3A3C46]"
                  >
                    <td className="py-4 px-4 font-bold text-slate-900">{anc.anchor_name}</td>
                    <td className="py-4 px-4 font-mono font-bold text-[#002366]">{anc.anchor_code}</td>
                    <td className="py-4 px-4 font-mono">{anc.login_id}</td>
                    <td className="py-4 px-4">
                      {anc.is_active ? (
                        <span className="inline-flex bg-[#EAF9F0] text-[#2E9B5C] font-bold px-2.5 py-0.5 rounded-full text-xs">
                          • Active
                        </span>
                      ) : (
                        <span className="inline-flex bg-[#FDEEEE] text-[#E5484D] font-bold px-2.5 py-0.5 rounded-full text-xs">
                          • Inactive
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-xs font-semibold text-[#A0A3AD] uppercase">
                      {anc.role === "SUPER_ANCHOR" ? "Anchor" : anc.role === "ANCHOR" ? "Users" : anc.role}
                    </td>
                    <td className="py-4 px-4 text-[#3A3C46] text-xs">
                      {anc.created_at ? new Date(anc.created_at).toLocaleString() : "-"}
                    </td>
                    <td className="py-4 px-4 text-[#3A3C46] text-xs">
                      {anc.updated_at ? new Date(anc.updated_at).toLocaleString() : "-"}
                    </td>
                    <td className="py-4 px-4 text-[#3A3C46] text-xs truncate max-w-[120px]">{anc.created_by || "-"}</td>
                    <td className="py-4 px-4 text-[#3A3C46] text-xs truncate max-w-[120px]">{anc.updated_by || "-"}</td>
                    <td className="py-4 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => onViewCustomers?.(anc._id || anc.anchor_code)}
                        className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-[#002366] hover:border-[#002366] hover:bg-blue-50/50 transition-colors shadow-sm cursor-pointer"
                        title="View Customers"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* New Anchor Modal */}
      <AnimatePresence>
        {isNewAnchorModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsNewAnchorModalOpen(false)}
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
                  <h2 className="text-xl font-bold text-slate-900">Add new User</h2>
                  <p className="text-xs text-slate-400 mt-0.5 font-medium">Create a new user organization profile</p>
                </div>
                <button
                  onClick={() => setIsNewAnchorModalOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleCreateAnchor} className="space-y-4 mt-4" autoComplete="off">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label htmlFor="anc-name" className="text-xs font-semibold text-slate-600">
                      User Name *
                    </Label>
                    <Input
                      id="anc-name"
                      required
                      placeholder="E.g., Tata Group"
                      value={newAnchorForm.name}
                      onChange={(e) => setNewAnchorForm({ ...newAnchorForm, name: e.target.value })}
                      className="h-10 rounded-xl border-slate-200 focus:border-[#002366] focus:ring-[#002366] shadow-none"
                      autoComplete="off"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="anc-phone" className="text-xs font-semibold text-slate-600">
                      Mobile Number *
                    </Label>
                    <div className="relative">
                      <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        id="anc-phone"
                        required
                        placeholder="E.g., 9876543210"
                        value={newAnchorForm.phone}
                        onChange={(e) => setNewAnchorForm({ ...newAnchorForm, phone: e.target.value })}
                        className="h-10 pl-9 rounded-xl border-slate-200 focus:border-[#002366] focus:ring-[#002366] shadow-none"
                        autoComplete="off"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="anc-company" className="text-xs font-semibold text-slate-600">
                    Company Name
                  </Label>
                  <Input
                    id="anc-company"
                    placeholder="E.g., Tata Sons Private Limited"
                    value={newAnchorForm.company_name}
                    onChange={(e) => setNewAnchorForm({ ...newAnchorForm, company_name: e.target.value })}
                    className="h-10 rounded-xl border-slate-200 focus:border-[#002366] focus:ring-[#002366] shadow-none"
                    autoComplete="off"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label htmlFor="anc-email" className="text-xs font-semibold text-slate-600">
                      Email ID *
                    </Label>
                    <Input
                      id="anc-email"
                      type="email"
                      required
                      placeholder="E.g., admin@tata.com"
                      value={newAnchorForm.email_id}
                      onChange={(e) => setNewAnchorForm({ ...newAnchorForm, email_id: e.target.value })}
                      className="h-10 rounded-xl border-slate-200 focus:border-[#002366] focus:ring-[#002366] shadow-none"
                      autoComplete="new-email"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="anc-password" className="text-xs font-semibold text-slate-600">
                      Password *
                    </Label>
                    <div className="relative">
                      <Input
                        id="anc-password"
                        type={showNewAnchorPassword ? "text" : "password"}
                        required
                        placeholder="Enter account password"
                        value={newAnchorForm.password}
                        onChange={(e) => setNewAnchorForm({ ...newAnchorForm, password: e.target.value })}
                        className="h-10 pr-10 rounded-xl border-slate-200 focus:border-[#002366] focus:ring-[#002366] shadow-none"
                        autoComplete="new-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewAnchorPassword(!showNewAnchorPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                      >
                        {showNewAnchorPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsNewAnchorModalOpen(false)}
                    className="border-slate-200 rounded-xl hover:bg-slate-50 text-slate-600 h-10 shadow-none"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-[#002366] hover:bg-[#001744] text-white font-semibold transition-all rounded-xl h-11 px-5 flex items-center gap-2 shadow-sm shadow-[#002366]/20 cursor-pointer"
                  >
                    Create User
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
