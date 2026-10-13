import { createContext } from 'react';
import type { LoanApplication, LoanProductId, SecurityType } from '../types';

export interface LoanApplicationContextValue {
  application: LoanApplication;
  selectProduct: (productId: LoanProductId) => void;
  selectSecurityType: (securityType: SecurityType) => void;
}

export const LoanApplicationContext =
  createContext<LoanApplicationContextValue | null>(null);
