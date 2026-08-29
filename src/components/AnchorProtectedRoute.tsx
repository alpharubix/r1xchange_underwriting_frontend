import { Navigate, Outlet } from "react-router-dom";
import { useAuthContext } from "@/contexts/AuthContext";

export default function AnchorProtectedRoute() {
  const { isLoading, isAuthenticated, user } = useAuthContext();

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background animate-pulse">
        <div className="flex flex-col items-center gap-4">
          <span className="h-10 w-10 rounded-full border-4 border-[#7754f8]/20 border-t-[#7754f8] animate-spin" />
        </div>
      </div>
    );
  }

  const storedRole = localStorage.getItem("user_role")?.toLowerCase();
  const userRole = (user as any)?.role?.toLowerCase();
  const isAnchor =
    userRole === "anchor" ||
    userRole === "super_anchor" ||
    userRole === "superanchor" ||
    userRole === "super-anchor" ||
    storedRole === "anchor" ||
    storedRole === "super_anchor" ||
    storedRole === "superanchor" ||
    storedRole === "super-anchor";

  if (!isAuthenticated || !isAnchor) {
    return <Navigate to="/anchors/login" replace />;
  }

  return <Outlet />;
}
