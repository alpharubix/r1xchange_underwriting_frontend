import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import {
  Link,
  useNavigate,
  useOutletContext,
} from 'react-router-dom';
import { ApplicationStepper } from '../components/ApplicationStepper';
import { LoanProductCard } from '../components/LoanProductCard';
import { useLoanApplication } from '../context/useLoanApplication';
import type { BankConfig, LoanProductId } from '../types';

export function ProductSelectionPage() {
  const bank = useOutletContext<{ bank: BankConfig }>().bank;
  const { application, selectProduct } = useLoanApplication();
  const navigate = useNavigate();
  const [selectedProduct, setSelectedProduct] = useState<LoanProductId | null>(
    application.productId
  );

  const handleContinue = () => {
    if (!selectedProduct) return;
    selectProduct(selectedProduct);
    navigate(`/bank/${bank.bankCode}/apply/security-type`);
  };

  return (
    <section className="loan-flow-page">
      <ApplicationStepper currentStep={1} />
      <div className="loan-page-heading">
        <p className="loan-eyebrow">Step 1 of 3</p>
        <h1>Choose Your Loan Product</h1>
        <p>Select the type of loan that best suits your financial requirements.</p>
      </div>
      <div className="loan-product-grid" role="group" aria-label="Available loan products">
        {bank.availableProducts.map((product) => (
          <LoanProductCard
            key={product.id}
            product={product}
            selected={selectedProduct === product.id}
            onSelect={() => setSelectedProduct(product.id)}
          />
        ))}
      </div>
      <div className="loan-flow-actions">
        <Link className="loan-button loan-button-secondary" to={`/bank/${bank.bankCode}`}>
          <ArrowLeft size={17} aria-hidden="true" />
          Back
        </Link>
        <button
          className="loan-button loan-button-primary"
          disabled={!selectedProduct}
          onClick={handleContinue}
          type="button"
        >
          Continue
          <ArrowRight size={17} aria-hidden="true" />
        </button>
      </div>
      {!application.productId && (
        <p className="loan-selection-hint">Choose one product to continue.</p>
      )}
    </section>
  );
}
