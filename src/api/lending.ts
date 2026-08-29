import type { AxiosRequestConfig } from 'axios';
import apiClient from '@/lib/axios';

export interface LendingFailureReason {
  parameter: string;
  reason?: string;
  customer_value?: string | number | null;
  expected?: string;
}

export interface LendingPassedParameter {
  parameter: string;
  customer_value?: string | number | null;
  expected?: string;
}

export interface LendingEligibilityData {
  bank_id: string;
  bank_name: string;
  eligibility: string;
  eligibility_score: number;
  passed: number;
  failed: number;
  passed_parameters: LendingPassedParameter[];
  failed_parameters: LendingFailureReason[];
}

export interface LendingEligibilityResponse {
  eligible_banks: LendingEligibilityData[];
  rejected_banks: LendingEligibilityData[];
}

type RequestOptions = Pick<AxiosRequestConfig, 'signal'>;

export async function checkLendingEligibility(options?: RequestOptions): Promise<{ eligible: LendingEligibilityData[], ineligible: LendingEligibilityData[] }> {
  const response = await apiClient.get<any>('/lending/check-eligibility', {
    signal: options?.signal,
  });

  const resData = response.data;

  const mapBank = (bank: any): LendingEligibilityData => ({
    bank_id: bank.bank_code || '',
    bank_name: bank.bank_name || '',
    eligibility: bank.eligibility || '',
    eligibility_score: bank.eligibility_score || 0,
    passed: bank.no_passed_parameters || 0,
    failed: bank.no_failed_parameters || 0,
    passed_parameters: (bank.passed_parameters || []).map((p: any) => ({ parameter: p })),
    failed_parameters: (bank.reason || []).map((r: any) => ({
      parameter: r.parameter_key,
      reason: r.reason,
      customer_value: r.cust_val,
      expected: r.lender_val !== undefined && r.lender_val !== null ? `${r.operator} ${r.lender_val}` : undefined,
    }))
  });

  if (Array.isArray(resData)) {
    const mapped = resData.map(mapBank);
    return {
      eligible: mapped.filter(b => b.eligibility_score > 50).sort((a: any, b: any) => b.eligibility_score - a.eligibility_score),
      ineligible: mapped.filter(b => b.eligibility_score <= 50).sort((a: any, b: any) => b.eligibility_score - a.eligibility_score)
    };
  } else if (resData && Array.isArray(resData.eligible_banks) && Array.isArray(resData.rejected_banks)) {
    return {
      eligible: resData.eligible_banks.map(mapBank).sort((a: any, b: any) => b.eligibility_score - a.eligibility_score),
      ineligible: resData.rejected_banks.map(mapBank).sort((a: any, b: any) => b.eligibility_score - a.eligibility_score)
    };
  }

  return { eligible: [], ineligible: [] };
}
