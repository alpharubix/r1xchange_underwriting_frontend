import {
  BriefcaseBusiness,
  Coins,
  Factory,
  UserRound,
} from 'lucide-react';
import type { BankConfig, LoanProduct } from '../types';

const productCatalog: Record<LoanProduct['id'], LoanProduct> = {
  'business-loan': {
    id: 'business-loan',
    name: 'Business Loan',
    description:
      'Financing to support business growth and working capital requirements.',
    icon: BriefcaseBusiness,
    securityTypes: ['secured', 'unsecured'],
  },
  'supply-chain-finance': {
    id: 'supply-chain-finance',
    name: 'Supply Chain Finance',
    description:
      'Financing solutions designed for businesses, suppliers, and buyers.',
    icon: Factory,
    securityTypes: ['secured', 'unsecured'],
  },
  'gold-loan': {
    id: 'gold-loan',
    name: 'Gold Loan',
    description: 'Secure financing against eligible gold assets.',
    icon: Coins,
    securityTypes: ['secured'],
  },
  'silver-loan': {
    id: 'silver-loan',
    name: 'Silver Loan',
    description:
      'Financing against eligible silver assets, subject to bank policy.',
    icon: Coins,
    securityTypes: ['secured'],
  },
  'personal-loan': {
    id: 'personal-loan',
    name: 'Personal Loan',
    description: 'Financing for eligible personal expenses.',
    icon: UserRound,
    securityTypes: ['unsecured'],
  },
};

export const banks: Record<string, BankConfig> = {
  'northstar-bank': {
    bankCode: 'northstar-bank',
    bankName: 'Northstar Bank',
    primaryColor: '#174a8b',
    secondaryColor: '#e8f1fb',
    welcomeMessage:
      'Thoughtful financing to help you move forward with confidence.',
    availableProducts: [
      productCatalog['business-loan'],
      productCatalog['supply-chain-finance'],
      productCatalog['gold-loan'],
      productCatalog['personal-loan'],
    ],
  },
  'harborline-bank': {
    bankCode: 'harborline-bank',
    bankName: 'Harborline Bank',
    primaryColor: '#176b61',
    secondaryColor: '#e8f5f2',
    welcomeMessage:
      'A straightforward way to explore financing for what matters next.',
    availableProducts: [
      productCatalog['business-loan'],
      productCatalog['gold-loan'],
      productCatalog['silver-loan'],
      productCatalog['personal-loan'],
    ],
  },
};

export function getBankConfig(bankCode: string | undefined): BankConfig | null {
  if (!bankCode || bankCode.length > 64 || !/^[a-z0-9]+(?:[-_][a-z0-9]+)*$/i.test(bankCode)) {
    return null;
  }
  const configuredBank = banks[bankCode.toLowerCase()];
  if (configuredBank) return configuredBank;

  const bankName = bankCode
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return {
    bankCode,
    bankName,
    primaryColor: '#174a8b',
    secondaryColor: '#e8f1fb',
    welcomeMessage:
      'Explore a straightforward way to learn about loan options.',
    availableProducts: [
      productCatalog['business-loan'],
      productCatalog['supply-chain-finance'],
      productCatalog['gold-loan'],
      productCatalog['silver-loan'],
      productCatalog['personal-loan'],
    ],
  };
}
