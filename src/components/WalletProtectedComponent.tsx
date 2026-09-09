import { cloneElement } from "react";
import type { ReactElement, ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { Navigate, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { getWalletBalance } from "@/api/payment";

interface WalletProtectedComponentProps {
  service: string;
  children: ReactNode;
}

export default function WalletProtectedComponent({ service, children }: WalletProtectedComponentProps) {
  const location = useLocation();
  const returnTo = `${location.pathname}${location.search}`;
  const { data, isLoading, isError } = useQuery({
    queryKey: ["wallet-access", service],
    queryFn: () => getWalletBalance(service),
    staleTime: 0,
    refetchOnMount: "always",
  });

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#002366]" />
      </div>
    );
  }

  if (isError || !data?.data?.is_balance_available) {
    const params = new URLSearchParams({ service, returnTo });
    return <Navigate to={`/payments?${params.toString()}`} replace />;
  }

  const child = children as ReactElement<{ isBalanceAvailable?: boolean }>;
  return cloneElement(child, { isBalanceAvailable: true });
}
