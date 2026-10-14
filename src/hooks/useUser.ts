import { useQuery } from '@tanstack/react-query';
import { getMe, type UserProfile } from '@/api/user';

export function useMe() {
  const storedRole = sessionStorage.getItem('user_role')?.toLowerCase();
  const hasStoredSession = Boolean(storedRole);

  return useQuery<UserProfile>({
    queryKey: ['user', 'me'],
    queryFn: getMe,
    staleTime: 1000 * 60 * 5,
    retry: false,
    enabled: hasStoredSession,
  });
}
