import { Check } from 'lucide-react';
import type { LoanProduct } from '../types';

export function LoanProductCard({
  product,
  selected,
  onSelect,
}: {
  product: LoanProduct;
  selected: boolean;
  onSelect: () => void;
}) {
  const Icon = product.icon;

  return (
    <button
      type="button"
      className={`loan-product-card${selected ? ' is-selected' : ''}`}
      aria-pressed={selected}
      onClick={onSelect}
    >
      <span className="loan-product-icon">
        <Icon size={25} strokeWidth={1.8} aria-hidden="true" />
      </span>
      <span className="loan-product-card-copy">
        <span className="loan-product-title">{product.name}</span>
        <span className="loan-product-description">{product.description}</span>
      </span>
      <span className="loan-selection-indicator" aria-hidden="true">
        {selected && <Check size={16} strokeWidth={2.6} />}
      </span>
    </button>
  );
}
