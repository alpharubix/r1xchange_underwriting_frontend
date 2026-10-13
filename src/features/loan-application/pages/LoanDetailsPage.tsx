import { ArrowLeft, FileText, ShieldCheck } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { Link, Navigate, useOutletContext } from 'react-router-dom';
import { ApplicationStepper } from '../components/ApplicationStepper';
import { useLoanApplication } from '../context/useLoanApplication';
import type { BankConfig } from '../types';

export function LoanDetailsPage() {
  const bank = useOutletContext<{ bank: BankConfig }>().bank;
  const { application } = useLoanApplication();
  const [submitted, setSubmitted] = useState(false);

  if (!application.productId) {
    return <Navigate to={`/bank/${bank.bankCode}/apply/products`} replace />;
  }
  if (!application.securityType) {
    return (
      <Navigate
        to={`/bank/${bank.bankCode}/apply/security-type`}
        replace
      />
    );
  }

  const product = bank.availableProducts.find(
    (item) => item.id === application.productId
  );
  if (!product || bank.bankCode !== application.bankCode) {
    return <Navigate to={`/bank/${bank.bankCode}/apply/products`} replace />;
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <section className="loan-flow-page loan-details-page">
      <ApplicationStepper currentStep={3} />
      <div className="loan-page-heading">
        <p className="loan-eyebrow">Step 3 of 3</p>
        <h1>Your application details</h1>
        <p>
          Enter your contact information and requested loan amount to complete
          this prototype application.
        </p>
      </div>
      <div className="loan-summary-card">
        <div className="loan-summary-icon">
          <FileText size={24} aria-hidden="true" />
        </div>
        <div>
          <p className="loan-eyebrow">Application summary</p>
          <h2>{bank.bankName}</h2>
          <dl>
            <div><dt>Loan product</dt><dd>{product.name}</dd></div>
            <div>
              <dt>Financing option</dt>
              <dd>{application.securityType === 'secured' ? 'Secured' : 'Unsecured'}</dd>
            </div>
          </dl>
        </div>
      </div>
      <div className="loan-policy-note">
        <ShieldCheck size={18} aria-hidden="true" />
        <span>
          This is an application journey prototype. No eligibility decision or
          loan approval has been made.
        </span>
      </div>
      <form className="loan-details-form" onSubmit={handleSubmit}>
        <label>
          Applicant name
          <input autoComplete="name" name="applicantName" required />
        </label>
        <label>
          Email address
          <input autoComplete="email" name="email" required type="email" />
        </label>
        <label>
          Phone number
          <input
            autoComplete="tel"
            maxLength={20}
            name="phone"
            pattern="[0-9]{7,15}"
            placeholder="Digits only, include country code"
            required
            type="tel"
          />
        </label>
        <label>
          Requested loan amount
          <input
            min="1"
            name="loanAmount"
            required
            step="0.01"
            type="number"
          />
        </label>
        <div className="loan-flow-actions">
          <Link
            className="loan-button loan-button-secondary"
            to={`/bank/${bank.bankCode}/apply/security-type`}
          >
            <ArrowLeft size={17} aria-hidden="true" />
            Back
          </Link>
          <button className="loan-button loan-button-primary" type="submit">
            Save details
          </button>
        </div>
        {submitted && (
          <p className="loan-selection-hint" role="status">
            Details were validated in this prototype only; nothing was submitted.
          </p>
        )}
      </form>
    </section>
  );
}
