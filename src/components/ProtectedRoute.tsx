import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthContext } from '@/contexts/AuthContext';

interface ProtectedRouteProps{
  requiredPortal :'user' | 'anchor';
}

export default function ProtectedRoute({requiredPortal}:ProtectedRouteProps) {
  const { isLoading, isAuthenticated ,user} = useAuthContext();
  const location = useLocation();
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <span className="h-10 w-10 rounded-full border-4 border-[#000080]/20 border-t-[#000080] animate-spin" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    
    const loginPath = requiredPortal === 'anchor' ? '/anchors/login' : '/login';
    return <Navigate to={loginPath} replace />;
  }
    
  if (user?.portal !== requiredPortal) {
    return <Navigate
      to={requiredPortal === 'anchor' ? '/anchors/login' : '/login'}
      replace
      state={{ from: location }}
    />;
  }

  return <Outlet />;
}
