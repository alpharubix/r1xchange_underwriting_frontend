import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  registerUser,
  loginUser,
  loginAdmin,
  loginAnchor,
  logoutUser,
  forgotPassword,
  validateOtp,
  resetPassword,
  type RegisterPayload,
  type LoginPayload,
  type AdminLoginPayload,
  type AnchorLoginPayload,
  type ForgotPasswordPayload,
  type ValidateOtpPayload,
  type ResetPasswordPayload,
} from "@/api/auth";
import { useAuthContext } from "@/contexts/AuthContext";
import { getMe } from "@/api/user";
import axios from "axios";

// Helper to extract role from message string
function extractRoleFromMessage(message?: string): string | null {
  if (!message) return null;
  const match = message.match(/role\s*:\s*([A-Za-z_0-9]+)/i);
  return match ? match[1].trim() : null;
}

// Helper to extract a readable error message from Axios errors
function getApiError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    return (
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Something went wrong. Please try again."
    );
  }
  if (error instanceof Error) return error.message;
  return "Something went wrong. Please try again.";
}

// ─── useRegister ─────────────────────────────────────────────────────────────
export function useRegister() {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: (data: RegisterPayload) => registerUser(data),
    onSuccess: () => {
      // Registration complete — send user to login to sign in
      navigate("/login");
    },
  });
}

// ─── useLogin ────────────────────────────────────────────────────────────────
export function useLogin() {
  const navigate = useNavigate();
  const { setUser } = useAuthContext();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: LoginPayload) => loginUser(data),
    onSuccess: async (data) => {
      const msg = data?.message || data?.data?.message || "Login successful";
      toast.success(msg);
      
      const extractedRole = extractRoleFromMessage(msg);
      if (extractedRole) {
        localStorage.setItem("user_role", extractedRole);
      }
      
      let role = extractedRole || "";
      try {
        const userProfile = await getMe();
        const finalProfile = { ...userProfile };
        if (extractedRole) {
          finalProfile.role = extractedRole;
        }
        setUser(finalProfile);
        queryClient.setQueryData(["user", "me"], finalProfile);
        role = finalProfile.role || role;
      } catch (err) {
        const user = data?.user || data?.data?.user || data?.data || {};
        const finalUser = { ...user };
        if (extractedRole) {
          finalUser.role = extractedRole;
        }
        setUser(finalUser);
        queryClient.setQueryData(["user", "me"], finalUser);
        role = finalUser.role || role;
      }

      if (window.location.pathname.toLowerCase().includes("/anchors") || role.toLowerCase() === "anchor") {
        navigate("/anchors/dashboard");
      } else {
        navigate("/home/dashboard");
      }
    },
  });
}

// ─── useAdminLogin ───────────────────────────────────────────────────────────
export function useAdminLogin() {
  const navigate = useNavigate();
  const { setUser } = useAuthContext();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: AdminLoginPayload) => loginAdmin(data),
    onSuccess: async (data) => {
      const msg = data?.message || data?.data?.message || "Login successful";
      toast.success(msg);
      
      const extractedRole = extractRoleFromMessage(msg);
      const rawRole = extractedRole || data?.role || data?.data?.role || data?.user?.role || data?.data?.user?.role || "admin";
      localStorage.setItem("user_role", rawRole);
      try {
        const userProfile = await getMe();
        const role = extractedRole || userProfile.role || rawRole;
        const fullUser = { ...userProfile, role };
        setUser(fullUser);
        queryClient.setQueryData(["user", "me"], fullUser);
        localStorage.setItem("user_role", role);
      } catch (err) {
        const user = data?.user || data?.data?.user || data?.data || {};
        const role = extractedRole || user.role || rawRole;
        const fullUser = { ...user, role };
        setUser(fullUser);
        queryClient.setQueryData(["user", "me"], fullUser);
        localStorage.setItem("user_role", role);
      }
      navigate("/admins/user");
    },
  });
}

// ─── useAnchorLogin ──────────────────────────────────────────────────────────
export function useAnchorLogin() {
  const navigate = useNavigate();
  const { setUser } = useAuthContext();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: AnchorLoginPayload) => loginAnchor(data),
    onSuccess: async (data) => {
      const msg = data?.message || data?.data?.message || "Login successful";
      toast.success(msg);
      
      const extractedRole = extractRoleFromMessage(msg);
      const rawRole = extractedRole || data?.role || data?.data?.role || data?.user?.role || data?.data?.user?.role || "anchor";
      localStorage.setItem("user_role", rawRole);
      try {
        const userProfile = await getMe();
        const role = extractedRole || userProfile.role || rawRole;
        const fullUser = { ...userProfile, role };
        setUser(fullUser);
        queryClient.setQueryData(["user", "me"], fullUser);
        localStorage.setItem("user_role", role);
      } catch (err) {
        const user = data?.user || data?.data?.user || data?.data || {};
        const role = extractedRole || user.role || rawRole;
        const fullUser = { ...user, role };
        setUser(fullUser);
        queryClient.setQueryData(["user", "me"], fullUser);
        localStorage.setItem("user_role", role);
      }
      navigate("/anchors/dashboard");
    },
  });
}

// ─── useLogout ───────────────────────────────────────────────────────────────
export function useLogout() {
  const navigate = useNavigate();
  const { clearAuth } = useAuthContext();
  return useMutation({
    mutationFn: () => logoutUser(),
    onSettled: () => {
      // Always clear local user cache regardless of API success/failure.
      // The server clears the HttpOnly cookie on its side.
      localStorage.removeItem("user_role");
      clearAuth();
      if (window.location.pathname.toLowerCase().includes("/anchors")) {
        navigate("/anchors/login");
      } else if (window.location.pathname.toLowerCase().includes("/admins")) {
        navigate("/admins/login");
      } else {
        navigate("/login");
      }
    },
  });
}

// ─── useForgotPassword ───────────────────────────────────────────────────────
export function useForgotPassword() {
  return useMutation({
    mutationFn: (data: ForgotPasswordPayload) => forgotPassword(data),
  });
}

// ─── useValidateOtp ──────────────────────────────────────────────────────────
export function useValidateOtp() {
  return useMutation({
    mutationFn: (data: ValidateOtpPayload) => validateOtp(data),
  });
}

// ─── useResetPassword ────────────────────────────────────────────────────────
export function useResetPassword() {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: (data: ResetPasswordPayload) => resetPassword(data),
    onSuccess: () => {
      navigate("/login");
    },
  });
}



export { getApiError };
