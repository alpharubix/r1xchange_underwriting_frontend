import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type {
  LoanApplication,
  LoanProductId,
  SecurityType,
} from '../types';
import { LoanApplicationContext } from './loanApplicationStore';
import { getBankConfig } from '../config/banks';

const productIds: LoanProductId[] = [
  'business-loan',
  'supply-chain-finance',
  'gold-loan',
  'silver-loan',
  'personal-loan',
];

function readApplicationDraft(bankCode: string): LoanApplication {
  const initial: LoanApplication = {
    bankCode,
    productId: null,
    securityType: null,
  };

  try {
    const storedDraft = sessionStorage.getItem(`loan-application:${bankCode}`);
    if (!storedDraft) return initial;

    const parsed: unknown = JSON.parse(storedDraft);
    if (!parsed || typeof parsed !== 'object') return initial;
    const draft = parsed as Record<string, unknown>;
    const productId =
      typeof draft.productId === 'string'
        ? productIds.find((id) => id === draft.productId)
        : undefined;
    const bank = getBankConfig(bankCode);
    const product = bank?.availableProducts.find(
      (item) => item.id === productId
    );
    if (!product || !productId) return initial;

    const securityType =
      draft.securityType === 'secured' || draft.securityType === 'unsecured'
        ? draft.securityType
        : null;

    return {
      bankCode,
      productId: product.id,
      securityType:
        securityType && product.securityTypes.includes(securityType)
          ? securityType
          : null,
    };
  } catch (error) {
    console.warn('Unable to restore the loan application draft.', error);
    return initial;
  }
}

export function LoanApplicationProvider({
  bankCode,
  children,
}: {
  bankCode: string;
  children: ReactNode;
}) {
  const [application, setApplication] = useState<LoanApplication>(() =>
    readApplicationDraft(bankCode)
  );

  const selectProduct = useCallback((productId: LoanProductId) => {
    setApplication((current) => ({
      ...current,
      productId,
      securityType: null,
    }));
  }, []);

  const selectSecurityType = useCallback((securityType: SecurityType) => {
    setApplication((current) => ({ ...current, securityType }));
  }, []);

  useEffect(() => {
    try {
      sessionStorage.setItem(
        `loan-application:${bankCode}`,
        JSON.stringify(application)
      );
    } catch (error) {
      console.warn('Unable to save the loan application draft.', error);
    }
  }, [application, bankCode]);

  const value = useMemo(
    () => ({ application, selectProduct, selectSecurityType }),
    [application, selectProduct, selectSecurityType]
  );

  return (
    <LoanApplicationContext.Provider value={value}>
      {children}
    </LoanApplicationContext.Provider>
  );
}
