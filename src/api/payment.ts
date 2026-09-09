import apiClient from '@/lib/axios';

export interface WalletBalanceResponse {
  message: string;
  data: {
    user_id?: string;
    service: string;
    is_balance_available: boolean;
    available_balance: number;
  };
}

export async function getWalletBalance(service: string, userId?: string): Promise<WalletBalanceResponse> {
  const payload = userId ? { user_id: userId, userId } : {};
  const response = await apiClient.post<WalletBalanceResponse>(`/wallet/balance/${encodeURIComponent(service)}`, payload);
  return response.data;
}

export interface CreateOrderPayload {
  user_id?: string;
  userId?: string;
  service: string;
  amount: number;
  currency: string;
}

export interface CreateOrderResponse {
  message: string;
  data: {
    user_id: string;
    order_id: string;
    amount: number;
    currency: string;
    service: string;
  };
}

export async function createPaymentOrder(payload: CreateOrderPayload): Promise<CreateOrderResponse> {
  const response = await apiClient.post<CreateOrderResponse>(`/payments/create-order`, payload);
  return response.data;
}

export interface ValidatePaymentPayload {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
  user_id?: string | undefined;
  userId?: string;
}

export interface ValidatePaymentResponse {
  message: string;
  data: {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    payment_status: string;
  };
}

export async function validatePayment(payload: ValidatePaymentPayload): Promise<ValidatePaymentResponse> {
  const response = await apiClient.post<ValidatePaymentResponse>(`/payments/validate-payment`, payload);
  return response.data;
}

export interface PendingPayment {
  _id: string;
  id: string;
  amount: number;
  currency?: string;
  service: string;
  created_at: string;
}

export interface PendingOrderResponse {
  pending_order: PendingPayment | null;
  pending_orders: PendingPayment[];
  is_pending_payment_found: boolean;
}

interface PendingPaymentsApiResponse {
  message?: string;
  data?: PendingOrderResponse | PendingPayment[];
}

export interface PendingPaymentsResponse {
  message: string;
  data: PendingOrderResponse;
}

export async function getPendingPayments(service: string, custId?: string): Promise<PendingPaymentsResponse> {
  const payload = { service, custId };
  const url = `/payments/pending`;
  const response = await apiClient.post<PendingPaymentsApiResponse | PendingPayment[]>(url, payload);
  const data = response.data;
  const orders = Array.isArray(data)
    ? data
    : Array.isArray(data.data)
      ? data.data
      : data.data?.pending_orders || (data.data?.pending_order ? [data.data.pending_order] : []);

  return {
    message: Array.isArray(data) ? 'Pending orders retrieved successfully' : data.message || 'Pending orders retrieved successfully',
    data: {
      pending_order: orders[0] || null,
      pending_orders: orders,
      is_pending_payment_found: orders.length > 0,
    },
  };
}
