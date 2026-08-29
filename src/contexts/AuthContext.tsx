import React, {
  createContext,
  useContext,
  useCallback,
  useEffect,
} from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useMe } from "@/hooks/useUser";
import { toast } from "sonner";

interface AuthUser {
  _id?: string;
  email_id?: string;
  customer_name?: string;
  anchor_name?: string;
  login_id?: string;
  role?: string;
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

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: user, isLoading, isError } = useMe();

  const setUser = useCallback((newUser: AuthUser) => {
    queryClient.setQueryData(["user", "me"], newUser);
  }, [queryClient]);

  const clearAuth = useCallback(() => {
    queryClient.clear();
    queryClient.setQueryData(["user", "me"], null);
    localStorage.removeItem("gst_reference_id");
    localStorage.removeItem("gstin_list");
    localStorage.removeItem("5pointcredit_tickets");
  }, [queryClient]);

  // Listen for 401 events dispatched by the axios interceptor
  useEffect(() => {
    const handle = () => {
      clearAuth();
      if (window.location.pathname.toLowerCase().includes("/anchors")) {
        navigate("/anchors/login");
      } else {
        navigate("/login");
      }
    };
    window.addEventListener("auth:unauthorized", handle);
    return () => window.removeEventListener("auth:unauthorized", handle);
  }, [clearAuth, navigate]);

  useEffect(() => {
    if (isError) {
      clearAuth();
    }
  }, [isError, clearAuth]);

    useEffect(() => {
    if (user) {
      const typedUser = user as AuthUser;
      console.log("User from me API:", typedUser);
      setUser(typedUser);
      
      const apiRole = typedUser.role || (typedUser as any).data?.role;
      const storedRole = localStorage.getItem("user_role");
      const finalRole = apiRole || storedRole || "anchor";
      (typedUser as any).role = finalRole;
      if (finalRole && !storedRole) {
        localStorage.setItem("user_role", String(finalRole));
      }
      
      const userRole = String((typedUser as any).role).toLowerCase();
      const isAdmin = userRole === "admin" || userRole === "super_admin" || userRole === "superadmin";
      
      const currentPath = window.location.pathname.toLowerCase();
      const isLoginOrAuthPage = 
        currentPath === "/" ||
        currentPath === "/login" ||
        currentPath === "/signup" ||
        currentPath === "/forgot-password" ||
        currentPath === "/admins/login" ||
        currentPath === "/anchors/login";

      if (isLoginOrAuthPage) {
        // Redirect after successful login
        const originalPath = localStorage.getItem("redirect_path");
        const userRole = String((typedUser as any).role).toLowerCase();
        const isAnchor = 
          userRole === "anchor" || 
          userRole === "superanchor" || 
          userRole === "super_anchor" || 
          userRole === "super-anchor";
         
        const redirectTo = originalPath || (isAdmin ? "/admins/user" : isAnchor ? "/anchors/dashboard" : "/home/dashboard");
        
        if (!isAdmin) {
          toast.success(`Welcome, ${typedUser.customer_name || (typedUser as any).anchor_name || (typedUser as any).login_id || "User"}!`);
        }
        localStorage.removeItem("redirect_path");
        navigate(redirectTo, { replace: true });
      }
    }
  }, [user, setUser, navigate]);

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
  if (!ctx) throw new Error("useAuthContext must be used within <AuthProvider>");
  return ctx;
}
