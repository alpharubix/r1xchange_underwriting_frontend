import { Navigate, Outlet } from 'react-router-dom';
import { useAuthContext } from '@/contexts/AuthContext';
import AdminLoader from '@/components/AdminLoader';

export default function AdminProtectedRoute() {
  const { isLoading, isAuthenticated, user } = useAuthContext();

  // console.log("AdminProtectedRoute debug:", { isLoading, isAuthenticated, user, storedRole: sessionStorage.getItem("user_role") });

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#f4f6f9]">
        <AdminLoader className="h-12 w-12 text-[#000080]" text="Verifying admin access..." />
      </div>
    );
  }

  const storedRole = sessionStorage.getItem('user_role')?.toLowerCase();
  const userRole = (user as any)?.role?.toLowerCase();
  const isAdmin =
    userRole === 'admin' ||
    userRole === 'super_admin' ||
    userRole === 'superadmin' ||
    storedRole === 'admin' ||
    storedRole === 'super_admin' ||
    storedRole === 'superadmin';

  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/admins/login" replace />;
  }

  return <Outlet />;
}
