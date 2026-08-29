import { useQuery } from '@tanstack/react-query';
import { checkLendingEligibility } from '@/api/lending';

export function useLendingEligibility() {
  return useQuery({
    queryKey: ['lendingEligibility'],
    queryFn: ({ signal }) => checkLendingEligibility({ signal }),
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    retry: 1, // Only retry once on failure
  });
}
