import { FileCheck2, ShieldCheck } from 'lucide-react';
import type { SecurityType } from '../types';

const options: Record<
  SecurityType,
  { title: string; description: string; examples: string[] }
> = {
  secured: {
    title: 'Secured Loan',
    description:
      "A loan backed by eligible collateral or an asset, subject to the bank's lending policies.",
    examples: [
      'Gold or silver assets',
      'Property',
      'Eligible business assets',
      'Other accepted collateral',
    ],
  },
  unsecured: {
    title: 'Unsecured Loan',
    description:
      "A loan that does not require pledged collateral. Eligibility is assessed using the bank's lending criteria.",
    examples: [
      'Eligible personal loans',
      'Eligible business loans',
      'Other qualifying credit products',
    ],
  },
};

export function SecurityTypeCard({
  securityType,
  selected,
  onSelect,
}: {
  securityType: SecurityType;
  selected: boolean;
  onSelect: () => void;
}) {
  const option = options[securityType];
  const Icon = securityType === 'secured' ? ShieldCheck : FileCheck2;

  return (
    <button
      type="button"
      className={`loan-security-card${selected ? ' is-selected' : ''}`}
      aria-pressed={selected}
      onClick={onSelect}
    >
      <span className="loan-security-card-top">
        <span className="loan-security-icon">
          <Icon size={27} strokeWidth={1.8} aria-hidden="true" />
        </span>
        <span className="loan-selection-indicator" aria-hidden="true">
          {selected && <span className="loan-radio-dot" />}
        </span>
      </span>
      <span className="loan-security-title">{option.title}</span>
      <span className="loan-security-description">{option.description}</span>
      <span className="loan-examples-label">Examples</span>
      <span className="loan-examples">
        {option.examples.map((example) => (
          <span className="loan-example" key={example}>
            {example}
          </span>
        ))}
      </span>
    </button>
  );
}
