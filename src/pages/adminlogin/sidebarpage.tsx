import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuthContext } from "@/contexts/AuthContext";
import { useLogout } from "@/hooks/useAuth";
import {
  Users,
  Shield,
  Anchor,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function AdminSidebar() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { user } = useAuthContext();
  const logoutMutation = useLogout();
  const { tab } = useParams<{ tab?: string }>();
  const navigate = useNavigate();

  const activeTab = useMemo(() => {
    const t = tab?.toLowerCase();
    if (t === "user" || t === "admin" || t === "anchor" || t === "anchors") {
      return t === "anchors" ? "anchor" : (t as "user" | "admin" | "anchor");
    }
    return "user";
  }, [tab]);

  const handleTabChange = (targetTab: "user" | "admin" | "anchor") => {
    const isCapital = window.location.pathname.startsWith("/Admins");
    const tabSegment = targetTab === "anchor" ? "anchors" : targetTab;
    const targetUrl = `${isCapital ? "/Admins" : "/admins"}/${tabSegment}`;
    navigate(targetUrl);
  };

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <aside
      className={`relative flex flex-col h-full bg-[#000080] text-white transition-all duration-300 ease-in-out shadow-2xl shrink-0 ${
        sidebarCollapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Toggle Button */}
      <button
        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
        className="absolute -right-3 top-8 z-50 flex h-6 w-6 items-center justify-center rounded-full bg-white border-2 border-[#000080] text-[#000080] shadow-md hover:shadow-lg transition-all duration-200 hover:scale-110"
        aria-label="Toggle sidebar"
      >
        {sidebarCollapsed ? (
          <ChevronRight className="h-3 w-3" />
        ) : (
          <ChevronLeft className="h-3 w-3" />
        )}
      </button>

      {/* Sidebar Header */}
      <div className="flex items-center justify-between p-6 border-b border-white/10 bg-white/5">
        <div className={`flex items-center gap-3 overflow-hidden ${sidebarCollapsed ? "justify-center w-full" : ""}`}>
          <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center font-black text-lg text-[#000080] shadow-md shrink-0 transform hover:scale-[1.02] transition-transform">
            R1
          </div>
          {!sidebarCollapsed && (
            <div className="flex flex-col">
              <span className="font-extrabold text-sm tracking-widest text-white uppercase">
                R1Xchange
              </span>
              <span className="text-[9px] font-bold text-blue-200 uppercase tracking-widest leading-none mt-0.5">
                Underwriting
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Navigation items */}
      <nav className="flex-1 px-4 py-6 space-y-1.5">
        <button
          onClick={() => handleTabChange("user")}
          className={`group relative flex items-center w-full gap-3.5 px-4 py-3 rounded-xl font-bold transition-all duration-150 ${
            activeTab === "user"
              ? "bg-white shadow-lg shadow-blue-950/20"
              : "text-blue-100 hover:bg-white/10 hover:text-white border border-transparent"
          }`}
          style={{ color: activeTab === "user" ? "#000080" : "" }}
        >
          <div
            className={`absolute left-0 top-[30%] bottom-[30%] w-1 rounded-full transition-all duration-150 ${
              activeTab === "user" ? "h-2/5" : "h-0 bg-transparent"
            }`}
            style={{ backgroundColor: activeTab === "user" ? "#000080" : "" }}
          />
          <Users
            className={`h-5 w-5 shrink-0 transition-colors ${
              activeTab === "user" ? "" : "text-blue-200 group-hover:text-white"
            }`}
            style={{ color: activeTab === "user" ? "#000080" : "" }}
          />
          {!sidebarCollapsed && <span className="text-sm">Users</span>}
        </button>

        <button
          onClick={() => handleTabChange("admin")}
          className={`group relative flex items-center w-full gap-3.5 px-4 py-3 rounded-xl font-bold transition-all duration-150 ${
            activeTab === "admin"
              ? "bg-white shadow-lg shadow-blue-950/20"
              : "text-blue-100 hover:bg-white/10 hover:text-white border border-transparent"
          }`}
          style={{ color: activeTab === "admin" ? "#000080" : "" }}
        >
          <div
            className={`absolute left-0 top-[30%] bottom-[30%] w-1 rounded-full transition-all duration-150 ${
              activeTab === "admin" ? "h-2/5" : "h-0 bg-transparent"
            }`}
            style={{ backgroundColor: activeTab === "admin" ? "#000080" : "" }}
          />
          <Shield
            className={`h-5 w-5 shrink-0 transition-colors ${
              activeTab === "admin" ? "" : "text-blue-200 group-hover:text-white"
            }`}
            style={{ color: activeTab === "admin" ? "#000080" : "" }}
          />
          {!sidebarCollapsed && <span className="text-sm">Admins</span>}
        </button>

        <button
          onClick={() => handleTabChange("anchor")}
          className={`group relative flex items-center w-full gap-3.5 px-4 py-3 rounded-xl font-bold transition-all duration-150 ${
            activeTab === "anchor"
              ? "bg-white shadow-lg shadow-blue-950/20"
              : "text-blue-100 hover:bg-white/10 hover:text-white border border-transparent"
          }`}
          style={{ color: activeTab === "anchor" ? "#000080" : "" }}
        >
          <div
            className={`absolute left-0 top-[30%] bottom-[30%] w-1 rounded-full transition-all duration-150 ${
              activeTab === "anchor" ? "h-2/5" : "h-0 bg-transparent"
            }`}
            style={{ backgroundColor: activeTab === "anchor" ? "#000080" : "" }}
          />
          <Anchor
            className={`h-5 w-5 shrink-0 transition-colors ${
              activeTab === "anchor" ? "" : "text-blue-200 group-hover:text-white"
            }`}
            style={{ color: activeTab === "anchor" ? "#000080" : "" }}
          />
          {!sidebarCollapsed && <span className="text-sm">Anchors</span>}
        </button>
      </nav>

      <div className="p-4 border-t border-white/10 bg-white/5 space-y-3.5">
        {!sidebarCollapsed && (
          <div className="flex items-center gap-3 bg-white/10 border border-white/10 p-3 rounded-2xl shadow-inner overflow-hidden">
            <div className="relative shrink-0">
              <div className="h-9 w-9 rounded-xl bg-white flex items-center justify-center font-bold text-[#000080] text-xs shadow-sm">
                {String(user?.role || "").charAt(0).toUpperCase()}
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-400 border-2 border-[#000080] flex items-center justify-center">
                <span className="absolute h-2 w-2 rounded-full bg-emerald-400 animate-ping opacity-75" />
              </div>
            </div>
            <div className="overflow-hidden text-left">
              <p className="text-sm font-bold text-white truncate uppercase">
                {String(user?.role || "ADMIN").replace("_", " ")}
              </p>
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="flex items-center justify-center w-full gap-2.5 px-4 py-2.5 rounded-xl border border-white/15 bg-white/5 hover:bg-red-500/20 hover:border-red-500/30 text-white hover:text-red-200 font-bold text-sm transition-all duration-150"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          {!sidebarCollapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}