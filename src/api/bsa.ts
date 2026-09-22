import apiClient from '@/lib/axios';

export interface BsaBankAccount {
  account_id?: string | number | null;
  user_id?: string | null;
  from_date?: string | null;
  to_date?: string | null;
  created_at?: string | null;
  account_number?: string | null;
  account_type?: string | null;
}

export interface BankAccounts {
  account_id?: string | number | null;
  accountId?: string | number | null;
  entityName?: string | null;
  entityType?: string | null;
  accountNumber?: string | null;
  accountType?: string | null;
  bankCode?: string | null;
  bank_name?: string | null;
}

export interface DateRange {
  from_date?: string | null;
  to_date?: string | null;
}

export interface DateRangeResponse {
  data: DateRange;
}

export interface BankAccountsResponse {
  data: BankAccounts[];
}

export interface BsaBankAccountsResponse {
  message: string;
  data: BsaBankAccount[];
}

export async function getDateRange(accountNumber: string): Promise<DateRange> {
  const response = await apiClient.post<DateRangeResponse>(
    '/bsa/report-date-range',
    {
      account_number: accountNumber,
    },
    {
      errorMessage: 'Failed to fetch the date range. Please Try again !',
    }
  );
  return response.data.data;
}

export async function getBankAccounts(custId?: string): Promise<BankAccounts[]> {
  const response = await apiClient.get<BankAccountsResponse>(
    '/bsa/bank-accounts',
    {
      params: custId ? { cust_id: custId } : undefined,
      errorMessage:
        'Failed to fetch the bank Accounts . Please Try again !',
    }
  );
  return Array.isArray(response.data?.data) ? response.data.data : [];
}

export async function getBsaBankAccounts(): Promise<BsaBankAccount[]> {
  const response = await apiClient.get<BsaBankAccountsResponse>(
    '/crm/accounts-filter',
    {
      params: { module: 'bsa' },
      errorMessage: 'Failed to fetch bank accounts. Please try again.',
    }
  );

  return Array.isArray(response.data?.data) ? response.data.data : [];
}
