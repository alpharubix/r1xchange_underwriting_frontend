import apiClient from '@/lib/axios';

export interface AdminPaymentRecord {
  _id: string;
  reference_id?: string;
  user_id?: string;
  requested_by?: string;
  requested_by_role?: string;
  service?: 'BSA' | 'GST' | 'ITR' | 'CIBIL' | string;
  amount?: number;
  wallet_status?: 'PENDING' | 'SUCCESS' | 'FAILED' | 'RESERVED' | 'FINALIZING' | 'CONSUMED' | 'RELEASED' | string;
  service_status?: 'CREATED' | 'PROCESSING' | 'SUCCESS' | 'FAILED' | string;
  upstream_status?: 'PENDING' | 'ACCEPTED' | 'SUCCESS' | 'FAILED' | string;
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
  reference_id?: string;
  user_id?: string;
  requested_by?: string;
  requested_by_role?: string;
  service?: string;
  amount?: number | string;
  wallet_status?: string;
  service_status?: string;
  upstream_status?: string;
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

  if (filters.reference_id && filters.reference_id.trim()) {
    params.reference_id = filters.reference_id.trim();
  }
  if (filters.user_id && filters.user_id.trim()) {
    params.user_id = filters.user_id.trim();
  }
  if (filters.requested_by && filters.requested_by.trim()) {
    params.requested_by = filters.requested_by.trim();
  }
  if (filters.requested_by_role && filters.requested_by_role !== 'all') {
    params.requested_by_role = filters.requested_by_role;
  }
  if (filters.service && filters.service !== 'all') {
    params.service = filters.service;
  }
  if (filters.wallet_status && filters.wallet_status !== 'all') {
    params.wallet_status = filters.wallet_status;
  }
  if (filters.service_status && filters.service_status !== 'all') {
    params.service_status = filters.service_status;
  }
  if (filters.upstream_status && filters.upstream_status !== 'all') {
    params.upstream_status = filters.upstream_status;
  }
  if (filters.amount !== undefined && filters.amount !== '' && filters.amount !== null) {
    const num = Number(filters.amount);
    if (!isNaN(num)) {
      params.amount = num;
    }
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


