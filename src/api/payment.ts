import apiClient from '@/lib/axios';
// import { string } from 'zod';

export interface WalletBalanceResponse {
  message: string;
  data: {
    user_id?: string;
    service: string;
    is_balance_available: boolean;
    available_balance: number ;
  };
}

export async function getWalletBalance(service: string, userId?: string): Promise<WalletBalanceResponse> {
  const payload = userId ? { user_id: userId, userId } : {};
  const response = await apiClient.post<WalletBalanceResponse>(`/wallet/balance/${encodeURIComponent(service)}`, payload);
  return response.data;
}

export interface ServiceBreakup {
  service: string;
  qty: number;
}

export interface CreateOrderPayload {
  user_id?: string;
  userId?: string;
  service: string;
  services_breakup: ServiceBreakup[];
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
  user_id?: string;
  role?: string;
  amount: number;
  currency?: string;
  service: string;
  created_at?: string;
  notes?:{
    user_id:string,
    services_breakup?:ServiceBreakup[]
  }
}

export interface PendingOrderResponse {
  pending_order: PendingPayment | null;
  is_pending_payment_found: boolean;
}

// interface PendingPaymentsApiResponse {
//   message?: string;
//   data?: PendingOrderResponse | PendingPayment[];
// }

export interface PendingPaymentsResponse {
  message: string;
  data: PendingOrderResponse;
}

export async function getPendingPayments(custId?: string): Promise<PendingPaymentsResponse> {
  // const params = new URLSearchParams({ service });
  const payload = custId ? { cust_id: custId } : {};

  const response = await apiClient.post<PendingPaymentsResponse >(
    `/payments/pending`,
    payload,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
  const data = response.data;
  console.log("Pending payment response : ",data);
  
  return response.data;
}