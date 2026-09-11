import { cloneElement, useEffect, useRef, useState } from "react";
import type { ReactElement, ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { getWalletBalance } from "@/api/payment";
import r1xchangeLogoBlackWebView from "@/assets/r1xchangeLogoBlackWebView.svg";
import { useNavigate } from "react-router-dom";

interface WalletProtectedComponentProps {
  service: string;
  children: ReactNode;
}

export default function WalletProtectedComponent({
  service,
  children,
}: WalletProtectedComponentProps) {
  const navigate = useNavigate();
  const hasRedirected = useRef(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["wallet-access", service],
    queryFn: () => getWalletBalance(service),
    staleTime: 0,
    refetchOnMount: "always",
  });

  useEffect(() => {
    if (
      !isLoading &&
      (isError || !data?.data?.is_balance_available) &&
      !hasRedirected.current
    ) {
      hasRedirected.current = true;
      setIsRedirecting(true);
      

      const timer = setTimeout(() => {
        navigate(`/home/dashboard`, { replace: true ,state:{highlight:service}});
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, [
    isLoading,
    isError,
    data?.data?.is_balance_available,
    service,
    navigate,
  ]);

 if (isLoading || isRedirecting) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white">
      
      {/* Logo */}
      <div className="mb-8 flex items-center justify-center">
        <img
          src={r1xchangeLogoBlackWebView}
          alt="R1Xchange"
          className="h-30 w-auto animate-float"
        />
      </div>

      {/* Message */}
      <h1 className="rounded-lg  p-5 text-center text-xl font-semibold text-gray-700 ">
        Insufficient credits to analyze the {service} reports.
        Please add credits to continue.
      </h1>

      <p className="mt-2 text-md text-gray-500">
        Redirecting to payment page...
      </p>

      <Loader2 className="h-5 w-5 animate-spin text-gray-500" />
    </div>
  );
}

  const child = children as ReactElement<{
    isBalanceAvailable?: boolean;
  }>;

  return cloneElement(child, {
    isBalanceAvailable: data?.data?.is_balance_available ?? false,
  });
}