import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useMe } from "@/hooks/useUser";
import { updateProfile } from "@/api/user";
import { Pencil, X, Check, User, Building2, Phone, FileText, ShieldCheck } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface ProfileForm {
  customer_name: string;
  phone: string;
  company_name: string;
  gst_number: string;
  email_id: string;
}

function StatusBadge({ status }: { status: any }) {
  const map: Record<string, { bg: string; dot: string; text: string; label: string }> = {
    active: { bg: "bg-zinc-100 border border-zinc-300", dot: "bg-zinc-700", text: "text-zinc-800", label: "Active" },
    inactive: { bg: "bg-zinc-200 border border-zinc-300", dot: "bg-zinc-500", text: "text-zinc-700", label: "Inactive" },
    pending: { bg: "bg-zinc-50 border border-zinc-200", dot: "bg-zinc-400", text: "text-zinc-700", label: "Pending" },
  };
  const s = map[status] ?? map.active;
  return (
    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${s.bg} ${s.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot} animate-pulse`} />
      {s.label}
    </span>
  );
}

function InfoField({
  icon: Icon, label, value,
}: {
  icon: React.ElementType; label: string; value: string;
}) {
  return (
    <div className="group flex items-start gap-4 p-4 rounded-2xl bg-white border border-zinc-200 hover:border-zinc-400 hover:shadow-md transition-all duration-200">
      <div className="w-9 h-9 rounded-xl bg-zinc-100 flex items-center justify-center shrink-0 group-hover:bg-zinc-200 transition-colors">
        <Icon className="w-4 h-4 text-zinc-800" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-0.5">{label}</p>
        <p className="text-sm font-medium text-zinc-900 truncate">
          {value || <span className="text-zinc-400 italic font-normal">Not provided</span>}
        </p>
      </div>
    </div>
  );
}

function EditField({
  icon: Icon, label, value, onChange, type = "text", maxLength,
}: {
  icon: React.ElementType; label: string; value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string; maxLength?: number;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
        <Icon className="w-3 h-3" />
        {label}
      </label>
      <input
        className="input-field border-zinc-300 focus:border-zinc-900 focus:ring-zinc-900"
        type={type}
        inputMode={type === "tel" ? "numeric" : undefined}
        maxLength={maxLength}
        value={value}
        onChange={onChange}
        placeholder={`Enter ${label.toLowerCase()}`}
      />
    </div>
  );
}

export default function ProfileManagement() {
  const queryClient = useQueryClient();
  const { data: userData } = useMe();
  const [editMode, setEditMode] = useState(false);
  const [toast, setToast] = useState(false);

  const defaultForm: ProfileForm = {
    customer_name: "",
    phone: "",
    company_name: "",
    gst_number: "",
    email_id: "",
  };

  const [form, setForm] = useState<ProfileForm>(defaultForm);
  const [original, setOriginal] = useState<ProfileForm>(defaultForm);

  const name = userData?.customer_name || "User";
  const initials = name
    .trim()
    .split(/\s+/)
    .map((n: string) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const status = userData?.status;
  const safeUser = userData ?? {};

  const isGstValid = form.gst_number === "" || form.gst_number.length === 15;

  const hasChanges =
    form.customer_name !== (safeUser.customer_name ?? "") ||
    form.company_name !== (safeUser.company_name ?? "") ||
    form.phone !== (safeUser.phone ?? "") ||
    form.gst_number !== (safeUser.gst_number ?? "") ||
    form.email_id !== (safeUser.email_id ?? "");

  function handleStartEdit() {
    if (!userData) return;

    const safeData = {
      customer_name: userData.customer_name ?? "",
      phone: userData.phone ?? "",
      company_name: userData.company_name ?? "",
      gst_number: userData.gst_number ?? "",
      email_id: userData.email_id ?? "",
    };

    setForm(safeData);
    setOriginal(safeData);
    setEditMode(true);
  }

  function handleCancel() {
    setForm({ ...original });
    setEditMode(false);
  }

  async function handleSave() {
    if (form.phone !== "" && form.phone.length !== 10) {
      alert("Please enter a valid 10-digit phone number.");
      return;
    }

    try {
      const updatedUser = await updateProfile({
        customer_name: form.customer_name,
        company_name: form.company_name,
        phone: form.phone,
        email_id: form.email_id,
        gst_number: form.gst_number,
      });

      queryClient.setQueryData(["user", "me"], updatedUser);

      const safeData: ProfileForm = {
        customer_name: updatedUser.customer_name ?? "",
        company_name: updatedUser.company_name ?? "",
        phone: updatedUser.phone ?? "",
        email_id: updatedUser.email_id ?? "",
        gst_number: updatedUser.gst_number ?? "",
      };

      setOriginal(safeData);
      setForm(safeData);
      setEditMode(false);

      setToast(true);
      setTimeout(() => setToast(false), 3000);
    } catch (error) {
      console.error(error);
      alert("Profile update failed");
    }
  }

  return (
    <>
      {toast && (
        <div className="fixed bottom-6 right-6 flex items-center gap-3 bg-white border border-zinc-200 rounded-2xl px-5 py-3.5 shadow-2xl z-50 animate-fade-in">
          <div className="w-8 h-8 rounded-xl bg-zinc-100 flex items-center justify-center shrink-0">
            <Check className="w-4 h-4 text-zinc-800" />
          </div>
          <div>
            <p className="text-sm font-semibold text-zinc-900">Profile updated</p>
            <p className="text-xs text-zinc-500">Your changes have been saved.</p>
          </div>
        </div>
      )}

      <div className="max-w-full mx-auto px-5 py-8 pb-16 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">Account Info</h1>
          <p className="text-sm text-zinc-500 mt-1">Manage your personal and business details</p>
        </div>

        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-black to-zinc-800 p-8 text-white shadow-xl">
          <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/5 pointer-events-none" />
          <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-white/5 pointer-events-none" />

          <div className="relative flex items-center gap-6">
            <Avatar className="h-20 w-20 border-4 border-white/20">
              <AvatarFallback className="bg-zinc-700 text-white text-4xl font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold uppercase tracking-widest text-white/50 mb-1">Account Owner</p>
              <h2 className="text-2xl font-bold text-white truncate">{name}</h2>
              <div className="mt-3">
                <StatusBadge status={status} />
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {!editMode && (
                <button
                  onClick={handleStartEdit}
                  className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white text-sm font-medium px-4 py-2 rounded-xl border border-white/20 transition-all"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  Edit
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-zinc-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-zinc-900" />
              <h3 className="text-sm font-semibold text-zinc-900">
                {editMode ? "Edit Information" : "Account Information"}
              </h3>
            </div>
            {editMode && (
              <span className="text-xs text-zinc-500 bg-zinc-100 px-2.5 py-1 rounded-full">
                Editing mode
              </span>
            )}
          </div>

          <div className="p-6">
            {editMode ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <EditField
                  icon={User}
                  label="Customer Name"
                  value={form.customer_name}
                  onChange={e => setForm(f => ({ ...f, customer_name: e.target.value }))}
                />
                <EditField
                  icon={Building2}
                  label="Company Name"
                  value={form.company_name}
                  onChange={e => setForm(f => ({ ...f, company_name: e.target.value }))}
                />
                <EditField
                  icon={Phone}
                  label="Phone Number"
                  value={form.phone}
                  type="tel"
                  maxLength={10}
                  onChange={e => {
                    const val = e.target.value.replace(/[^0-9]/g, "").slice(0, 10);
                    setForm(f => ({ ...f, phone: val }));
                  }}
                />
                <EditField
                  icon={FileText}
                  label="GST Number"
                  value={form.gst_number}
                  maxLength={15}
                  onChange={(e) => {
                    const value = e.target.value
                      .toUpperCase()
                      .replace(/[^A-Z0-9]/g, "")
                      .slice(0, 15);
                    setForm(f => ({ ...f, gst_number: value }));
                  }}
                />
                <EditField
                  icon={FileText}
                  label="Email ID"
                  value={form.email_id}
                  onChange={e => setForm(f => ({ ...f, email_id: e.target.value }))}
                />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <InfoField icon={User} label="Customer Name" value={userData?.customer_name ?? "N/A"} />
                <InfoField icon={Building2} label="Company Name" value={userData?.company_name ?? "N/A"} />
                <InfoField icon={Phone} label="Phone Number" value={userData?.phone ?? "N/A"} />
                <InfoField icon={FileText} label="GST Number" value={userData?.gst_number ?? ""} />
                <InfoField icon={FileText} label="Email ID" value={userData?.email_id ?? "N/A"} />
              </div>
            )}

            {editMode && (
              <div className="flex justify-end gap-3 mt-6 pt-5 border-t border-zinc-200">
                <button
                  onClick={handleCancel}
                  className="flex items-center gap-1.5 border border-zinc-300 text-zinc-700 hover:bg-zinc-100 px-5 py-2.5 rounded-xl text-sm transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={!hasChanges || !isGstValid}
                  className="flex items-center gap-1.5 bg-zinc-900 text-white hover:bg-zinc-800 px-5 py-2.5 rounded-xl text-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Check className="w-3.5 h-3.5" />
                  Update Profile
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}