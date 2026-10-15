import { Navigate, Outlet, useParams } from 'react-router-dom';

export interface BankConfig {
  bankCode: string;
  bankName: string;
  welcomeMessage: string;
}

export function BankApplicationLayout() {
  const { bankCode } = useParams<{ bankCode: string }>();

  if (!bankCode) {
    return <Navigate to="/" replace />;
  }

  const bank: BankConfig = {
    bankCode,
    bankName: bankCode.toUpperCase(),
    welcomeMessage: `Explore financial solutions tailored for ${bankCode.toUpperCase()} customers.`,
  };

  return <Outlet context={{ bank }} />;
}
