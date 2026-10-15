import { ArrowLeft, ShieldCheck } from 'lucide-react';
import { Link, useOutletContext } from 'react-router-dom';
import { GstEligibilityBuilder } from '../components/GstEligibilityBuilder';
import { useLoanApplication } from '../context/useLoanApplication';
import type { BankConfig } from '../types';

export function LoanDetailsPage() {
  const { bank } = useOutletContext<{ bank: BankConfig }>();
  const { application } = useLoanApplication();
  const hasPreviousStep = Boolean(
    application.productId && application.securityType
  );

  return (
    <section className="loan-flow-page loan-details-page gst-details-page">
      <GstEligibilityBuilder bankCode={bank.bankCode} />
      <div className="gst-details-footer">
        <div className="loan-policy-note">
          <ShieldCheck size={18} aria-hidden="true" />
          <span>
            Rules are saved only in this browser session. No eligibility
            decision or loan approval is made here.
          </span>
        </div>
        {hasPreviousStep && (
          <Link
            className="loan-button loan-button-secondary"
            to={`/bank/${bank.bankCode}/apply/security-type`}
          >
            <ArrowLeft size={17} aria-hidden="true" />
            Back to loan selections
          </Link>
        )}
      </div>
    </section>
  );
}
