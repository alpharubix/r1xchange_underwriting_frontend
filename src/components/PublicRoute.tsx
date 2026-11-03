import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthContext } from '@/contexts/AuthContext';
import AdminLoader from './AdminLoader';

export default function PublicRoute() {
  const { isAuthenticated, isLoading, user } = useAuthContext();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#002366]">
        <AdminLoader className="h-12 w-12 text-white" dotColor="#9fc3f1" />
      </div>
    );
  }


  if (isAuthenticated) {
    const storedRole = sessionStorage.getItem('user_role')?.toLowerCase();
    const userRole = (user as any)?.role?.toLowerCase() || storedRole || 'user';
    const isAnchor =
      userRole === 'anchor' ||
      userRole === 'super_anchor' ||
      userRole === 'superanchor' ||
      userRole === 'super-anchor';
    const isAdmin =
      userRole === 'admin' ||
      userRole === 'super_admin' ||
      userRole === 'superadmin';

    const isUserAuthPage =
      ['/login', '/signup', '/forgot-password'].includes(
        location.pathname.toLowerCase()
      );

    if (isUserAuthPage && isAnchor) {
      return <Outlet />;
    }

    if (isAdmin) {
      return <Navigate to="/admins/anchors" replace />;
    }
    if (isAnchor) {
      return <Navigate to="/anchors/dashboard" replace />;
    }
    return <Navigate to="/home/dashboard" replace />;
  }

  return <Outlet />;
}
