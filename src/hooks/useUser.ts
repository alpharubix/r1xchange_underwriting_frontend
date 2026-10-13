import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'react-router-dom';
import { getMe, type UserProfile } from '@/api/user';

export function useMe() {
  const { pathname } = useLocation();
  const storedRole = localStorage.getItem('user_role')?.toLowerCase();
  const hasStoredSession = Boolean(storedRole);
  const isAuthPage = [
    '/login',
    '/signup',
    '/forgot-password',
    '/anchors/login',
    '/admins/login',
  ].includes(pathname.toLowerCase());

  const shouldCheckSession = hasStoredSession && !isAuthPage;

  return useQuery<UserProfile>({
    queryKey: ['user', 'me'],
    queryFn: getMe,
    staleTime: 1000 * 60 * 5,
    retry: false,
    enabled: shouldCheckSession,
  });
}
