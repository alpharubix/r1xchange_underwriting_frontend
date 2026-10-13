import { ArrowLeft, ArrowRight, Info } from 'lucide-react';
import { useEffect } from 'react';
import {
  Link,
  Navigate,
  useNavigate,
  useOutletContext,
} from 'react-router-dom';
import { ApplicationStepper } from '../components/ApplicationStepper';
import { SecurityTypeCard } from '../components/SecurityTypeCard';
import { useLoanApplication } from '../context/useLoanApplication';
import type { BankConfig, SecurityType } from '../types';

export function SecurityTypePage() {
  const bank = useOutletContext<{ bank: BankConfig }>().bank;
  const { application, selectSecurityType } = useLoanApplication();
  const navigate = useNavigate();
  const product = bank.availableProducts.find(
    (item) => item.id === application.productId
  );

  useEffect(() => {
    if (product?.securityTypes.length === 1) {
      selectSecurityType(product.securityTypes[0]);
    }
  }, [product, selectSecurityType]);

  if (!application.productId || !product) {
    return (
      <Navigate to={`/bank/${bank.bankCode}/apply/products`} replace />
    );
  }

  const availableTypes = product.securityTypes;
  const selectedType: SecurityType | null =
    application.securityType &&
    availableTypes.includes(application.securityType)
    ? application.securityType
    : availableTypes.length === 1
      ? availableTypes[0]
      : null;

  const handleContinue = () => {
    if (!selectedType) return;
    selectSecurityType(selectedType);
    navigate(`/bank/${bank.bankCode}/apply/details`);
  };

  return (
    <section className="loan-flow-page">
      <ApplicationStepper currentStep={2} />
      <div className="loan-page-heading">
        <p className="loan-eyebrow">Step 2 of 3 · {product.name}</p>
        <h1>How Would You Like to Secure Your Loan?</h1>
        <p>Choose the financing option that matches your requirements.</p>
      </div>
      {availableTypes.length === 1 && (
        <div className="loan-policy-note" role="status">
          <Info size={18} aria-hidden="true" />
          <span>
            {product.name} is offered as a {availableTypes[0]} loan in this
            bank&apos;s current configuration.
          </span>
        </div>
      )}
      <div
        className={`loan-security-grid${availableTypes.length === 1 ? ' is-single-option' : ''}`}
        role="group"
        aria-label="Loan security type"
      >
        {availableTypes.map((securityType) => (
          <SecurityTypeCard
            key={securityType}
            securityType={securityType}
            selected={selectedType === securityType}
            onSelect={() => selectSecurityType(securityType)}
          />
        ))}
      </div>
      <div className="loan-flow-actions">
        <Link
          className="loan-button loan-button-secondary"
          to={`/bank/${bank.bankCode}/apply/products`}
        >
          <ArrowLeft size={17} aria-hidden="true" />
          Back
        </Link>
        <button
          className="loan-button loan-button-primary"
          disabled={!selectedType}
          onClick={handleContinue}
          type="button"
        >
          Continue
          <ArrowRight size={17} aria-hidden="true" />
        </button>
      </div>
    </section>
  );
}
