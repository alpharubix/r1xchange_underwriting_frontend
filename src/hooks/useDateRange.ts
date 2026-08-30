import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/axios';

export interface DateRange {
  from_date: string;
  to_date: string;
}

export function useDateRange(options?: { enabled?: boolean; custId?: string }) {
  return useQuery<DateRange>({
    queryKey: ['report-date-range', options?.custId],
    queryFn: async () => {
      let url = '/bsa/report-date-range';
      if (options?.custId) {
        url += `?cust_id=${encodeURIComponent(options.custId)}`;
      }
      const response = await apiClient.get(url);
      return response.data?.data as DateRange;
    },
    staleTime: 1000 * 60 * 5,
    retry: false,
    enabled: options?.enabled ?? true,
  });
}
