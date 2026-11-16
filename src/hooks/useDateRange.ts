import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/axios';

export interface DateRange {
  from_date: string;
  to_date: string;
}

export const getDateRangeQueryKey = (
  accountNumber?: string,
  custId?: string
) => ['report-date-range', custId, accountNumber] as const;

export async function fetchDateRange(options?: {
  custId?: string;
  accountNumber?: string;
}): Promise<DateRange> {
  let url = '/bsa/report-date-range';
  if (options?.custId) {
    url += `?cust_id=${encodeURIComponent(options.custId)}`;
  }
  const response = await apiClient.post(url, {
    account_number: options?.accountNumber,
  });
  return response.data?.data as DateRange;
}

export function useDateRange(options?: {
  enabled?: boolean;
  custId?: string;
  accountNumber?: string;
}) {
  return useQuery<DateRange>({
    queryKey: getDateRangeQueryKey(options?.accountNumber, options?.custId),
    queryFn: () =>
      fetchDateRange({
        custId: options?.custId,
        accountNumber: options?.accountNumber,
      }),
    staleTime: 1000 * 60 * 5,
    retry: false,
    enabled: (options?.enabled ?? true) && !!options?.accountNumber,
  });
}
