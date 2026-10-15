import { useState } from 'react';
import { ArrowLeft, ArrowRight, Coins, Landmark, Package, UserRound } from 'lucide-react';
import { Link, useNavigate, useOutletContext } from 'react-router-dom';
import type { BankConfig } from './BankApplicationLayout';
import './ProductSelectionPage.css';

const PRODUCTS = [
  { name: 'Gold Loan', description: 'Credit secured against eligible gold assets.', Icon: Coins },
  { name: 'Business Loan', description: 'Flexible financing for business needs.', Icon: Landmark },
  { name: 'Supply Chain Finance', description: 'Financing across buyers and suppliers.', Icon: Package },
  { name: 'Personal Loan', description: 'A loan product for individual borrowers.', Icon: UserRound },
];

const SECURITY_TYPES = ['Secured', 'Unsecured'] as const;

export default function ProductSelectionPage() {
  const { bank } = useOutletContext<{ bank: BankConfig }>();
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const navigate = useNavigate();

  const continueToParameters = (securityType: (typeof SECURITY_TYPES)[number]) => {
    if (!selectedProduct) return;

    const query = new URLSearchParams({
      product: selectedProduct,
      security: securityType,
    });
    navigate(`/bank/${bank.bankCode}/apply/details?${query.toString()}`);
  };

  return (
    <main className="loan-application-page product-selection-page">
      <div className="loan-breadcrumb">
        <Link to={`/bank/${bank.bankCode}/apply`}>{bank.bankName}</Link>
        <span aria-hidden="true">/</span>
        <span>Create credit model</span>
      </div>

      <header className="product-selection-heading">
        <p className="loan-eyebrow">New credit model</p>
        <h1>Choose a product</h1>
        <p>Select a product first, then choose whether the model is secured or unsecured.</p>
      </header>

      <section className="product-selection-grid" aria-label="Credit products">
        {PRODUCTS.map(({ name, description, Icon }) => (
          <button
            aria-pressed={selectedProduct === name}
            className={`product-choice-card${selectedProduct === name ? ' is-selected' : ''}`}
            key={name}
            onClick={() => setSelectedProduct(name)}
            type="button"
          >
            <span className="product-choice-icon"><Icon size={22} aria-hidden="true" /></span>
            <span className="product-choice-copy">
              <strong>{name}</strong>
              <small>{description}</small>
            </span>
            <ArrowRight size={18} aria-hidden="true" />
          </button>
        ))}
      </section>

      {selectedProduct && (
        <section className="security-choice-section" aria-labelledby="security-choice-title">
          <div>
            <p className="loan-eyebrow">Product selected</p>
            <h2 id="security-choice-title">{selectedProduct}</h2>
            <p>Choose the security type for this credit model.</p>
          </div>
          <div className="security-choice-actions">
            {SECURITY_TYPES.map((securityType) => (
              <button
                className={`loan-button ${securityType === 'Secured' ? 'loan-button-primary' : 'loan-button-secondary'}`}
                key={securityType}
                onClick={() => continueToParameters(securityType)}
                type="button"
              >
                {securityType}
                <ArrowRight size={17} aria-hidden="true" />
              </button>
            ))}
          </div>
        </section>
      )}

      <Link className="product-selection-back" to={`/bank/${bank.bankCode}/apply`}>
        <ArrowLeft size={16} aria-hidden="true" />
        Back to credit models
      </Link>
    </main>
  );
}
