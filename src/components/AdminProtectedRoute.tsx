import { Navigate, Outlet } from "react-router-dom";
import { useAuthContext } from "@/contexts/AuthContext";

export default function AdminProtectedRoute() {
  const { isLoading, isAuthenticated, user } = useAuthContext();

  console.log("AdminProtectedRoute debug:", { isLoading, isAuthenticated, user, storedRole: localStorage.getItem("user_role") });

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <span className="h-10 w-10 rounded-full border-4 border-[#7754f8]/20 border-t-[#7754f8] animate-spin" />
        </div>
      </div>
    );
  }

  const storedRole = localStorage.getItem("user_role")?.toLowerCase();
  const userRole = (user as any)?.role?.toLowerCase();
  const isAdmin = 
    userRole === "admin" || 
    userRole === "super_admin" || 
    userRole === "superadmin" || 
    storedRole === "admin" || 
    storedRole === "super_admin" || 
    storedRole === "superadmin";

  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/admins/login" replace />;
  }

  return <Outlet />;
}
