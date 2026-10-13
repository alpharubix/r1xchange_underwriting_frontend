import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'react-router-dom';
import { getMe, type UserProfile } from '@/api/user';

export function useMe() {
  const { pathname } = useLocation();
  const storedRole = localStorage.getItem('user_role')?.toLowerCase();
  const isBankLoanJourney = pathname.toLowerCase().startsWith('/bank/');
  const isAdmin =
    storedRole === 'admin' ||
    storedRole === 'super_admin' ||
    storedRole === 'superadmin';
  return useQuery<UserProfile>({
    queryKey: ['user', 'me'],
    queryFn: async () => {
      try {
        return await getMe();
      } catch (err) {
        if (isAdmin) {
          return {
            email_id: 'admin@crisp.example',
            customer_name: 'Admin User',
            role: storedRole || 'admin',
          } as UserProfile;
        }
        throw err;
      }
    },
    staleTime: 1000 * 60 * 5,
    retry: false,
    enabled: !isBankLoanJourney,
  });
}
