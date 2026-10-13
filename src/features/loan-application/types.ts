import type { LucideIcon } from 'lucide-react';

export type SecurityType = 'secured' | 'unsecured';

export type LoanProductId =
  | 'business-loan'
  | 'supply-chain-finance'
  | 'gold-loan'
  | 'silver-loan'
  | 'personal-loan';

export interface LoanProduct {
  id: LoanProductId;
  name: string;
  description: string;
  icon: LucideIcon;
  securityTypes: SecurityType[];
}

export interface BankConfig {
  bankCode: string;
  bankName: string;
  logoUrl?: string;
  primaryColor: string;
  secondaryColor: string;
  welcomeMessage: string;
  availableProducts: LoanProduct[];
}

export interface LoanApplication {
  bankCode: string;
  productId: LoanProductId | null;
  securityType: SecurityType | null;
}
