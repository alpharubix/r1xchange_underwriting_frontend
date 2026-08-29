import { useQuery } from "@tanstack/react-query";
import { getMe, type UserProfile } from "@/api/user";

export function useMe() {
  const storedRole = localStorage.getItem("user_role")?.toLowerCase();
  const isAdmin = storedRole === "admin" || storedRole === "super_admin" || storedRole === "superadmin";
  return useQuery<UserProfile>({
    queryKey: ["user", "me"],
    queryFn: async () => {
      try {
        return await getMe();
      } catch (err) {
        if (isAdmin) {
          return {
            email_id: "admin@r1xchange.com",
            customer_name: "Admin User",
            role: storedRole || "admin",
          } as UserProfile;
        }
        throw err;
      }
    },
    staleTime: 1000 * 60 * 5,
    retry: false,
  });
}
