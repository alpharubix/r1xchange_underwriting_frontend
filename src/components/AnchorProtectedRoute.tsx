import { Navigate, Outlet } from 'react-router-dom';
import { useAuthContext } from '@/contexts/AuthContext';
import AdminLoader from '@/components/AdminLoader';

export default function AnchorProtectedRoute() {
  const { isLoading, isAuthenticated, user } = useAuthContext();

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#f4f6f9]">
        <AdminLoader className="h-12 w-12 text-[#002366]" text="Verifying anchor access..." />
      </div>
    );
  }

  const storedRole = sessionStorage.getItem('user_role')?.toLowerCase();
  const userRole = (user as any)?.role?.toLowerCase();
  const isAnchor =
    userRole === 'anchor' ||
    userRole === 'super_anchor' ||
    storedRole === 'anchor' ||
    storedRole === 'super_anchor';

  if (!isAuthenticated || !isAnchor) {
    return <Navigate to="/anchors/login" replace />;
  }

  return <Outlet />;
}
