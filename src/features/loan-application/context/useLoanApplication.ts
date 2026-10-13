import { useContext } from 'react';
import { LoanApplicationContext } from './loanApplicationStore';

export function useLoanApplication() {
  const context = useContext(LoanApplicationContext);
  if (!context) {
    throw new Error(
      'useLoanApplication must be used inside LoanApplicationProvider'
    );
  }
  return context;
}
