import {
  ChevronRight,
  ChevronLeft,
  Anchor as AnchorIcon,
  Users,
  LogOut,
} from 'lucide-react';
import { getAnchorBrand } from '@/lib/brandLogo';

interface SidebarProps {
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  activeTab: "anchor" | "customer" | string;
  setActiveTab: (tab: "anchor" | "customer") => void;
  isSuperAnchor: boolean;
  userRole: string;
  user: any;
  handleLogout: () => void;
}

export default function Sidebar({
  sidebarCollapsed,
  setSidebarCollapsed,
  activeTab,
  setActiveTab,
  isSuperAnchor,
  userRole,
  user,
  handleLogout
}: SidebarProps) {
  const brand = getAnchorBrand(user);
  const displayName = brand.name;
  const displayRole = userRole.replace("_", " ").toLowerCase();
  const initialLetter = brand.initial;

  return (
    <aside
      className={`relative flex flex-col h-full bg-[#f4f6fa] p-5 text-gray-800 transition-all duration-300 ease-in-out shrink-0 z-20 gap-4 ${
        sidebarCollapsed ? "w-20 p-3" : "w-72"
      }`}
    >
      {/* Toggle Button */}
      <button
        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
        className="absolute -right-3 top-8 z-50 flex h-6 w-6 items-center justify-center rounded-full bg-white border-2 border-[#1106de] text-[#1106de] shadow-md hover:shadow-lg transition-all duration-200 hover:scale-110 cursor-pointer"
        aria-label="Toggle sidebar"
      >
        {sidebarCollapsed ? (
          <ChevronRight className="h-3 w-3" />
        ) : (
          <ChevronLeft className="h-3 w-3" />
        )}
      </button>

      {/* Brand Header Card */}
      <div className="bg-white rounded-3xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-gray-100/80">
        <div className={`flex flex-col ${sidebarCollapsed ? "items-center" : ""}`}>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-[#1106de] text-white flex items-center justify-center font-black text-xl shadow-md shadow-[#1106de]/25 shrink-0">
              C
            </div>
            {!sidebarCollapsed && (
              <div className="leading-tight">
                <div className="font-['Space_Grotesk'] text-2xl font-black text-[#1106de] tracking-tight">
                  CRISP
                </div>
                <div className="text-[9.5px] uppercase font-bold text-gray-400 tracking-[0.2em] mt-0.5">
                  UNDERWRITING
                </div>
              </div>
            )}
          </div>
          {!sidebarCollapsed && (
            <div className="mt-3.5 flex justify-center w-full">
              <span className="inline-flex items-center justify-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold bg-[#eff6ff] text-[#1106de] w-full">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1106de]" />
                {isSuperAnchor ? "Super Anchor View" : "Anchor View"}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 space-y-3 overflow-y-auto">
        {isSuperAnchor && (
          <button
            onClick={() => setActiveTab("anchor")}
            className={`flex items-center w-full gap-3 px-5 py-3.5 rounded-2xl font-semibold text-sm transition-all cursor-pointer ${
              activeTab === "anchor"
                ? "bg-[#1106de] text-white shadow-md shadow-[#1106de]/25"
                : "bg-white text-gray-600 hover:text-gray-900 shadow-sm border border-gray-100/60 hover:bg-gray-50/80"
            } ${sidebarCollapsed ? "justify-center px-0" : ""}`}
            title="Anchors"
          >
            <AnchorIcon className="h-5 w-5 shrink-0" />
            {!sidebarCollapsed && <span>Users</span>}
          </button>
        )}

        {!isSuperAnchor && (
          <button
            onClick={() => setActiveTab("customer")}
            className={`flex items-center w-full gap-3 px-5 py-3.5 rounded-2xl font-semibold text-sm transition-all cursor-pointer ${
              activeTab === "customer"
                ? "bg-[#1106de] text-white shadow-md shadow-[#1106de]/25"
                : "bg-white text-gray-600 hover:text-gray-900 shadow-sm border border-gray-100/60 hover:bg-gray-50/80"
            } ${sidebarCollapsed ? "justify-center px-0" : ""}`}
            title="Customer"
          >
            <Users className="h-5 w-5 shrink-0" />
            {!sidebarCollapsed && <span>Customer</span>}
          </button>
        )}

      </nav>

      {/* Sidebar Footer - Profile Card */}
      <div className="bg-white rounded-3xl p-4 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-gray-100/80 mt-auto">
        {!sidebarCollapsed && (
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-white border border-gray-200/80 flex items-center justify-center font-bold text-sm shrink-0 overflow-hidden p-1 shadow-sm">
              {brand.logo ? (
                <img
                  src={brand.logo}
                  alt={displayName}
                  className="h-full w-full object-contain"
                />
              ) : (
                <div className="h-full w-full rounded-lg bg-[#eff6ff] text-[#1106de] flex items-center justify-center font-bold text-sm">
                  {initialLetter}
                </div>
              )}
            </div>
            <div className="overflow-hidden text-left leading-tight">
              <div className="font-bold text-sm text-[#0f172a] truncate capitalize">
                {displayName}
              </div>
              <div className="text-xs text-gray-400 font-medium truncate mt-0.5 capitalize">
                {displayRole}
              </div>
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="mt-3.5 w-full bg-[#f8fafc] hover:bg-gray-100 text-gray-600 hover:text-gray-900 py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <LogOut className="h-3.5 w-3.5 shrink-0 text-gray-500" />
          {!sidebarCollapsed && <span>Log out</span>}
        </button>
      </div>
    </aside>
  );
}
