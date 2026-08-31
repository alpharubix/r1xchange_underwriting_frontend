import apiClient from '@/lib/axios';

export const getItrTaxCalculation = async (custId?: string | null) => {
  const queryStr = custId ? `?cust_id=${encodeURIComponent(custId)}` : '';
  const response = await apiClient.get(`/itr/tax-calculation${queryStr}`);
  return response.data;
};

export const getItrBalanceSheet = async (custId?: string | null) => {
  const queryStr = custId ? `?cust_id=${encodeURIComponent(custId)}` : '';
  const response = await apiClient.get(`/itr/balance_sheet${queryStr}`);
  return response.data;
};

export const getItrProfitAndLoss = async (custId?: string | null) => {
  const queryStr = custId ? `?cust_id=${encodeURIComponent(custId)}` : '';
  const response = await apiClient.get(`/itr/profit-and-loss-statement${queryStr}`);
  return response.data;
};

export const getItrRatioAnalysis = async (custId?: string | null) => {
  const queryStr = custId ? `?cust_id=${encodeURIComponent(custId)}` : '';
  const response = await apiClient.get(`/itr/ratio-analysis${queryStr}`);
  return response.data;
};
