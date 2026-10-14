import React, {
  createContext,
  useContext,
  useCallback,
  useEffect,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useMe } from '@/hooks/useUser';
import { toast } from 'sonner';

interface AuthUser {
  _id?: string;
  email_id?: string;
  customer_name?: string;
  anchor_name?: string;
  login_id?: string;
  role?: string;
  portal?: 'user' | 'anchor' | 'admin';
  [key: string]: unknown;
}

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: AuthUser) => void;
  clearAuth: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const normalizeRole = (role: unknown): string =>
  typeof role === 'string' ? role.trim().toLowerCase() : '';

const isAnchorRole = (role: string): boolean =>
  ['anchor', 'superanchor', 'super_anchor', 'super-anchor'].includes(role);

const isAdminRole = (role: string): boolean =>
  ['admin', 'super_admin', 'superadmin'].includes(role);

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: user, isLoading } = useMe();

  const setUser = useCallback(
    (newUser: AuthUser) => {
      queryClient.setQueryData(['user', 'me'], newUser);
    },
    [queryClient]
  );

  const clearAuth = useCallback(() => {
    queryClient.clear();
    queryClient.setQueryData(['user', 'me'], null);

    sessionStorage.removeItem('user_role');
    localStorage.removeItem('redirect_path');
    localStorage.removeItem('gst_reference_id');
    localStorage.removeItem('gstin_list');
    localStorage.removeItem('5pointcredit_tickets');
  }, [queryClient]);

  // Handle unauthorized API responses.
  useEffect(() => {
    const handleUnauthorized = () => {
      const path = window.location.pathname.toLowerCase();

      clearAuth();

      // Public pages do not need a login redirect.
      if (
        path === '/' ||
        path === '/pricing' ||
        path.startsWith('/products/') ||
        path === '/anchors'
      ) {
        return;
      }

      if (path.startsWith('/anchors/')) {
        navigate('/anchors/login', { replace: true });
      } else if (path.startsWith('/admins/')) {
        navigate('/admins/login', { replace: true });
      } else {
        navigate('/login', { replace: true });
      }
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);

    return () => {
      window.removeEventListener('auth:unauthorized', handleUnauthorized);
    };
  }, [clearAuth, navigate]);

  // Handle authenticated users and portal-specific login redirects.
  useEffect(() => {
    if (!user || isLoading) {
      return;
    }

    const typedUser = user as AuthUser;

    console.log('User from me API:', typedUser);

    const storedRole = sessionStorage.getItem('user_role');
    const userRole = normalizeRole(storedRole) || 'user';

    const isAnchor = isAnchorRole(userRole);
    const isAdmin = isAdminRole(userRole);
    const portal: 'user' | 'anchor' | 'admin' = isAnchor
      ? 'anchor'
      : isAdmin
        ? 'admin'
        : 'user';

    typedUser.role = userRole;
    typedUser.portal = portal;

    // Keep React Query data synchronized with the normalized role and portal.
    setUser(typedUser);

    sessionStorage.setItem('user_role', userRole);

    const currentPath = window.location.pathname.toLowerCase();

    const isAnchorPortal = currentPath.startsWith('/anchors/');
    const isAdminPortal = currentPath.startsWith('/admins/');

    const isLoginOrAuthPage =
      currentPath === '/login' ||
      currentPath === '/signup' ||
      currentPath === '/forgot-password' ||
      currentPath === '/admins/login' ||
      currentPath === '/anchors/login';

    if (!isLoginOrAuthPage) {
      return;
    }

    const isUserAuthPage =
      currentPath === '/login' ||
      currentPath === '/signup' ||
      currentPath === '/forgot-password';

    if (
      (isUserAuthPage && isAnchor) ||
      (currentPath === '/anchors/login' && !isAnchor && !isAdmin)
    ) {
      return;
    }

    // Determine the correct portal for this authenticated user.
    const defaultDestination = isAdmin
      ? '/admins/user'
      : isAnchor
        ? '/anchors/dashboard'
        : '/home/dashboard';

    // Never let a stale redirect path override portal selection.
    let redirectTo = defaultDestination;

    if (isAnchorPortal && !isAnchor && !isAdmin) {
      redirectTo = '/home/dashboard';
    } else if (isAdminPortal && !isAdmin) {
      redirectTo = isAnchor
        ? '/anchors/dashboard'
        : '/home/dashboard';
    } else if (!isAnchorPortal && !isAdminPortal && isAnchor) {
      redirectTo = '/anchors/dashboard';
    } else if (!isAnchorPortal && !isAdminPortal && isAdmin) {
      redirectTo = '/admins/user';
    } else if (
      isAnchorPortal &&
      isAnchor
    ) {
      const originalPath = localStorage.getItem('redirect_path');

      if (originalPath?.startsWith('/anchors/')) {
        redirectTo = originalPath;
      }
    } else if (
      isAdminPortal &&
      isAdmin
    ) {
      const originalPath = localStorage.getItem('redirect_path');

      if (originalPath?.startsWith('/admins/')) {
        redirectTo = originalPath;
      }
    } else if (
      !isAnchorPortal &&
      !isAdminPortal &&
      !isAnchor &&
      !isAdmin
    ) {
      const originalPath = localStorage.getItem('redirect_path');

      if (
        originalPath &&
        !originalPath.startsWith('/anchors/') &&
        !originalPath.startsWith('/admins/')
      ) {
        redirectTo = originalPath;
      }
    }

    if (!isAdmin) {
      toast.success(
        `Welcome, ${
          typedUser.customer_name ||
          typedUser.anchor_name ||
          typedUser.login_id ||
          'User'
        }!`
      );
    }

    localStorage.removeItem('redirect_path');

    navigate(redirectTo, { replace: true });
  }, [user, isLoading, setUser, navigate]);

  return (
    <AuthContext.Provider
      value={{
        user: (user as AuthUser) || null,
        isAuthenticated: !!user,
        isLoading,
        setUser,
        clearAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error(
      'useAuthContext must be used within <AuthProvider>'
    );
  }

  return ctx;
}
