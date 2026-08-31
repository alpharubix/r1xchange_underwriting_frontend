import {
  ChevronRight,
  ChevronLeft,
  Anchor as AnchorIcon,
  Users,
  LogOut
} from 'lucide-react';

interface SidebarProps {
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  activeTab: "anchor" | "customer" | "reports";
  setActiveTab: (tab: "anchor" | "customer" | "reports") => void;
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
  return (
    <aside
      className={`relative flex flex-col h-full bg-[#F0F1F5] p-5 text-[#1D1E2C] transition-all duration-300 ease-in-out shrink-0 z-20 gap-3.5 ${
        sidebarCollapsed ? "w-20 p-3" : "w-72"
      }`}
    >
      {/* Toggle Button */}
      <button
        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
        className="absolute -right-3 top-8 z-50 flex h-6 w-6 items-center justify-center rounded-full bg-white border-2 border-[#1D1E2C] text-[#1D1E2C] shadow-md hover:shadow-lg transition-all duration-200 hover:scale-110"
        aria-label="Toggle sidebar"
      >
        {sidebarCollapsed ? (
          <ChevronRight className="h-3 w-3" />
        ) : (
          <ChevronLeft className="h-3 w-3" />
        )}
      </button>

      {/* Sidebar Header */}
      <div className="bg-white rounded-[18px] p-5 shadow-[0_1px_2px_rgba(20,20,30,0.04),0_8px_20px_rgba(20,20,30,0.04)]">
        <div className={`flex flex-col ${sidebarCollapsed ? "items-center" : ""}`}>
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-[#FF6B4A] to-[#FF8F6B] text-white flex items-center justify-center font-black text-sm shrink-0">
              C
            </div>
            {!sidebarCollapsed && (
              <span className="font-['Space_Grotesk'] text-lg font-bold text-[#1D1E2C]">
               CRISP
              </span>
            )}
          </div>
          {!sidebarCollapsed && (
            <>
              <span className="text-[10px] uppercase font-bold text-[#A0A3AD] tracking-[0.18em] leading-none mt-2 ml-12">
                Underwriting
              </span>
              <div className="flex">
                <span className="inline-flex items-center gap-1.5 mt-3 ml-12 text-[10.5px] font-extrabold text-[#FF6B4A] bg-[#FFF0EC] px-3 py-1.5 rounded-lg tracking-wider uppercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B4A]" />
                  {isSuperAnchor ? "Super Anchor" : "Anchor View"}
                </span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Navigation items */}
      <nav className="flex-1 space-y-2.5 overflow-y-auto">
        {isSuperAnchor && (
          <button
            onClick={() => setActiveTab("anchor")}
            className={`group relative flex items-center w-full gap-3 px-4 py-3.5 rounded-[16px] font-semibold transition-all duration-150 shadow-[0_1px_2px_rgba(20,20,30,0.04)] ${
              activeTab === "anchor"
                ? "bg-[#1D1E2C] text-white shadow-[0_8px_20px_rgba(29,30,44,0.28)]"
                : "bg-white text-[#6b6e78] hover:translate-x-0.5 hover:shadow-[0_2px_8px_rgba(20,20,30,0.08)]"
            } ${sidebarCollapsed ? "justify-center px-0" : ""}`}
          >
            <AnchorIcon className="h-[18px] w-[18px] shrink-0" />
            {!sidebarCollapsed && <span className="text-sm font-['Space_Grotesk'] font-bold">Anchors</span>}
          </button>
        )}

        {!isSuperAnchor && (
          <button
            onClick={() => setActiveTab("customer")}
            className={`group relative flex items-center w-full gap-3 px-4 py-3.5 rounded-[16px] font-semibold transition-all duration-150 shadow-[0_1px_2px_rgba(20,20,30,0.04)] ${
              activeTab === "customer"
                ? "bg-[#1D1E2C] text-white shadow-[0_8px_20px_rgba(29,30,44,0.28)]"
                : "bg-white text-[#6b6e78] hover:translate-x-0.5 hover:shadow-[0_2px_8px_rgba(20,20,30,0.08)]"
            } ${sidebarCollapsed ? "justify-center px-0" : ""}`}
          >
            <Users className="h-[18px] w-[18px] shrink-0" />
            {!sidebarCollapsed && <span className="text-sm font-['Space_Grotesk'] font-bold">Users</span>}
          </button>
        )}
      </nav>

      {/* Sidebar Footer */}
      <div className="bg-white rounded-[18px] p-4 shadow-[0_1px_2px_rgba(20,20,30,0.04)] flex flex-col gap-3.5">
        {!sidebarCollapsed && (
          <div className="profile flex items-center gap-3">
            <div className="avatar h-9 w-9 rounded-xl bg-[#FFF0EC] text-[#FF6B4A] flex items-center justify-center font-bold text-sm shrink-0">
              {String(userRole).charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden text-left leading-tight">
              <div className="pname font-bold text-[13px] text-[#1D1E2C] truncate">
                {user?.anchor_name || user?.customer_name || user?.login_id || "Enterprise Partner"}
              </div>
              <div className="prole text-[10.5px] text-[#A0A3AD] truncate">
                {userRole.replace("_", " ")}
              </div>
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="logout w-full bg-[#F6F6F8] hover:bg-[#FFF0EC] hover:text-[#FF6B4A] border-none text-[#6b6e78] py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all duration-150"
        >
          <LogOut className="h-[14px] w-[14px] shrink-0" />
          {!sidebarCollapsed && <span>Log out</span>}
        </button>
      </div>
    </aside>
  );
}
