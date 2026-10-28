import apiClient from '@/lib/axios';

export interface ServiceBreakupItem {
  service: string;
  qty: number;
  [key: string]: any;
}

export interface AdminPaymentRecord {
  _id: string;
  razorpay_payment_id?: string;
  razorpay_order_id?: string;
  razorpay_signature?: string;
  user_id?: string;
  service_breakup?: ServiceBreakupItem[] | Record<string, any>;
  amount?: number;
  currency?: string;
  payment_status?: 'PENDING' | 'AUTHORIZED' | 'CAPTURED' | 'FAILED' | 'REFUNDED' | string;
  signature_verified?: boolean;
  wallet_status?: 'PENDING' | 'SUCCESS' | 'FAILED' | 'RESERVED' | 'FINALIZING' | 'CONSUMED' | 'RELEASED' | string;
  created_at?: string;
  updated_at?: string;
  [key: string]: any;
}

export interface AdminPaymentsPagination {
  page: number;
  limit: number;
  total_records: number;
  total_pages: number;
}

export interface AdminPaymentsResponse {
  data: AdminPaymentRecord[];
  pagination: AdminPaymentsPagination;
  message?: string;
}

export interface AdminPaymentsFilterParams {
  page?: number;
  limit?: number;
  razorpay_payment_id?: string;
  razorpay_order_id?: string;
  razorpay_signature?: string;
  user_id?: string;
  service_breakup?: string;
  amount?: string | number;
  currency?: string;
  payment_status?: string;
  signature_verified?: string | boolean;
  wallet_status?: string;
  created_at?: string;
  updated_at?: string;
}

export async function getAdminPayments(
  filters: AdminPaymentsFilterParams = {}
): Promise<AdminPaymentsResponse> {
  const params: Record<string, any> = {
    page: filters.page ?? 1,
    limit: filters.limit ?? 10,
  };

  // Only pass filters that exist in backend VALID_FILTERS
  if (filters.razorpay_payment_id && filters.razorpay_payment_id.trim()) {
    params.razorpay_payment_id = filters.razorpay_payment_id.trim();
  }
  if (filters.razorpay_order_id && filters.razorpay_order_id.trim()) {
    params.razorpay_order_id = filters.razorpay_order_id.trim();
  }
  if (filters.razorpay_signature && filters.razorpay_signature.trim()) {
    params.razorpay_signature = filters.razorpay_signature.trim();
  }
  if (filters.user_id && filters.user_id.trim()) {
    params.user_id = filters.user_id.trim();
  }
  if (filters.service_breakup && filters.service_breakup.trim()) {
    params.service_breakup = filters.service_breakup.trim();
  }
  if (filters.payment_status && filters.payment_status !== 'all') {
    params.payment_status = filters.payment_status;
  }
  if (filters.wallet_status && filters.wallet_status !== 'all') {
    params.wallet_status = filters.wallet_status;
  }
  if (
    filters.signature_verified !== undefined &&
    filters.signature_verified !== 'all' &&
    filters.signature_verified !== ''
  ) {
    params.signature_verified = String(filters.signature_verified);
  }
  if (filters.amount !== undefined && filters.amount !== '' && filters.amount !== null) {
    params.amount = String(filters.amount).trim();
  }
  if (filters.currency && filters.currency !== 'all') {
    params.currency = filters.currency;
  }
  if (filters.created_at && filters.created_at.trim()) {
    params.created_at = filters.created_at.trim();
  }
  if (filters.updated_at && filters.updated_at.trim()) {
    params.updated_at = filters.updated_at.trim();
  }

  const response = await apiClient.get<AdminPaymentsResponse>('/admin/payments', {
    params,
  });

  return response.data;
}

export async function getAdminUserProfileInformation(userId: string): Promise<Record<string, any>> {
  const response = await apiClient.get('/admin/audit/user-profile-information', {
    params: { user_id: userId },
  });
  return response.data;
}
