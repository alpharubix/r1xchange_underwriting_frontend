import apiClient from '@/lib/axios';

export interface SaveMoneyAccount {
  lender_name: string;
  account_number: string;
  opened_date: string;
  current_balance: string;
  check_box: boolean;
}

export interface SaveMoneyResponse {
  reference_id: string;
  accounts: SaveMoneyAccount[];
}

export interface RectifyMoneyAccount {
  lender_name: string;
  account_number: string;
  opened_date: string;
  overdue_amount: number;
  average_dpd: number;
  check_box: boolean;
}

export interface RectifyMoneyResponse {
  reference_id: string;
  accounts: RectifyMoneyAccount[];
}

export async function getSaveMoneyReports(custId: string, referenceId: string): Promise<SaveMoneyResponse> {
  const response = await apiClient.get<SaveMoneyResponse>(`/save-money/${encodeURIComponent(custId)}`, {
    params: { reference_id: referenceId }
  });
  return response.data;
}

export async function getRectifyMoneyReports(custId: string, referenceId: string): Promise<RectifyMoneyResponse> {
  const response = await apiClient.get<RectifyMoneyResponse>(`/rectify/${encodeURIComponent(custId)}`, {
    params: { reference_id: referenceId }
  });
  return response.data;
}

export interface SelectedAccount {
  account_number: string;
  lender_name: string;
}

export interface SubmitSelectionsPayload {
  reference_id: string;
  selected_accounts: SelectedAccount[];
}

export async function submitSaveMoneySelections(custId: string, data: SubmitSelectionsPayload): Promise<{ message: string }> {
  const response = await apiClient.post<{ message: string }>(`/save-money/${encodeURIComponent(custId)}/submit-selections`, data);
  return response.data;
}

export async function submitRectifyMoneySelections(custId: string, data: SubmitSelectionsPayload): Promise<{ message: string }> {
  const response = await apiClient.post<{ message: string }>(`/rectify/${encodeURIComponent(custId)}/submit-selections`, data);
  return response.data;
}
