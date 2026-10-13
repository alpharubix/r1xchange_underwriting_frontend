import { Landmark, ShieldCheck } from 'lucide-react';
import type { CSSProperties } from 'react';
import { Link, Outlet, useParams } from 'react-router-dom';
import { getBankConfig } from '../config/banks';
import { LoanApplicationProvider } from '../context/LoanApplicationContext';
import { NotFoundPage } from '../pages/NotFoundPage';

export function BankLoanLayout() {
  const { bankCode } = useParams();
  const bank = getBankConfig(bankCode);

  if (!bank) return <NotFoundPage />;

  return (
    <LoanApplicationProvider key={bank.bankCode} bankCode={bank.bankCode}>
      <div
        className="loan-portal"
        style={
          {
            '--bank-primary': bank.primaryColor,
            '--bank-secondary': bank.secondaryColor,
          } as CSSProperties
        }
      >
        <header className="loan-header">
          <Link
            aria-label={`${bank.bankName} home`}
            className="loan-brand"
            to={`/bank/${bank.bankCode}`}
          >
            {bank.logoUrl ? (
              <img className="loan-brand-logo" src={bank.logoUrl} alt="" />
            ) : (
              <span className="loan-brand-mark" aria-hidden="true">
                <Landmark size={23} strokeWidth={1.8} />
              </span>
            )}
            <span className="loan-brand-name">{bank.bankName}</span>
          </Link>
          <div className="loan-secure-label">
            <ShieldCheck size={17} aria-hidden="true" />
            <span>Secure application</span>
          </div>
        </header>

        <main className="loan-main">
          <Outlet context={{ bank }} />
        </main>

        <footer className="loan-footer">
          <span>© {new Date().getFullYear()} {bank.bankName}</span>
          <nav aria-label="Legal and contact links">
            <a href="mailto:privacy@example.com?subject=Privacy%20Policy">
              Privacy Policy
            </a>
            <a href="mailto:legal@example.com?subject=Terms%20and%20Conditions">
              Terms and Conditions
            </a>
            <a href="mailto:support@example.com">Contact Us</a>
          </nav>
        </footer>
      </div>
    </LoanApplicationProvider>
  );
}
