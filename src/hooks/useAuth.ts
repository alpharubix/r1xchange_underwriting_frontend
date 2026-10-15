import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
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
} from '@/api/auth';
import { getMe, type UserProfile } from '@/api/user';
import { useAuthContext } from '@/contexts/AuthContext';
import axios from 'axios';

async function loadProfileFromMe(
  queryClient: ReturnType<typeof useQueryClient>,
  authenticatedRole: string,
  portal: 'user' | 'anchor' | 'admin'
) {
  try {
    const userProfile = await queryClient.fetchQuery<UserProfile>({
      queryKey: ['user', 'me'],
      queryFn: getMe,
      retry: false,
      staleTime: 0,
    });
    const profile = { ...userProfile, role: authenticatedRole, portal };
    queryClient.setQueryData(['user', 'me'], profile);
    sessionStorage.setItem('user_role', authenticatedRole);
    return profile;
  } catch (error) {
    toast.error(`Could not load your profile: ${getApiError(error)}`);
    throw error;
  }
}

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
      (error.response?.status == 404 && 'User not found | Please register') ||
      (error.response?.status == 401 && 'Invalid Credentials') ||
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'Something went wrong. Please try again.'
    );
  }
  if (error instanceof Error) return error.message;
  return 'Something went wrong. Please try again.';
}

// ─── useRegister ─────────────────────────────────────────────────────────────
export function useRegister() {
  return useMutation({
    mutationFn: (data: RegisterPayload) => registerUser(data),
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
      const msg = data?.message || data?.data?.message || 'Login successful';

      const extractedRole = extractRoleFromMessage(msg);
      const effectiveRole = extractedRole || 'user';
      sessionStorage.setItem('user_role', effectiveRole);

      const loginUser = { role: effectiveRole, portal: 'user' as const };
      setUser(loginUser);
      queryClient.setQueryData(['user', 'me'], loginUser);
      toast.success(msg);

      sessionStorage.removeItem('home_intro_shown');
      navigate('/home/dashboard');
      void loadProfileFromMe(queryClient, effectiveRole, 'user')
        .then(setUser)
        .catch(() => undefined);
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
      const msg = data?.message || data?.data?.message || 'Login successful';

      const extractedRole = extractRoleFromMessage(msg);
      const rawRole =
        extractedRole ||
        data?.role ||
        data?.data?.role ||
        data?.user?.role ||
        data?.data?.user?.role ||
        'admin';
      sessionStorage.setItem('user_role', rawRole);
      const role = extractedRole || rawRole;
      const loginUser = { role, portal: 'admin' as const };
      setUser(loginUser);
      queryClient.setQueryData(['user', 'me'], loginUser);
      toast.success(msg);
      navigate('/admins/user');
      void loadProfileFromMe(queryClient, role, 'admin')
        .then(setUser)
        .catch(() => undefined);
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
      const msg = data?.message || data?.data?.message || 'Login successful';

      const extractedRole = extractRoleFromMessage(msg);
      const rawRole =
        extractedRole ||
        data?.role ||
        data?.data?.role ||
        data?.user?.role ||
        data?.data?.user?.role ||
        'anchor';
      sessionStorage.setItem('user_role', rawRole);
      const role = extractedRole || rawRole;
      const loginUser = { role, portal: 'anchor' as const };
      setUser(loginUser);
      queryClient.setQueryData(['user', 'me'], loginUser);
      toast.success(msg);
      console.log("Roles after anchor login:", { extractedRole, rawRole, role });
      sessionStorage.removeItem('anchor_intro_shown');
      navigate('/anchors/dashboard');
      void loadProfileFromMe(queryClient, role, 'anchor')
        .then(setUser)
        .catch(() => undefined);
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
      sessionStorage.removeItem('user_role');
      clearAuth();
      if (window.location.pathname.toLowerCase().includes('/anchors')) {
        navigate('/anchors/login');
      } else if (window.location.pathname.toLowerCase().includes('/admins')) {
        navigate('/admins/login');
      } else {
        navigate('/login');
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
      navigate('/login');
    },
  });
}

export { getApiError };
