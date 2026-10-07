export interface MockBankAccount {
  account_id: string;
  accountId: string;
  entityName: string;
  entityType: string;
  accountNumber: string;
  account_number: string;
  accountType: string;
  account_type: string;
  bankCode: string;
  bank_name: string;
  ifsc_code: string;
  branch_name: string;
  from_date: string;
  to_date: string;
  created_at: string;
  opening_balance: number;
  current_balance: number;
  total_credits: number;
  total_debits: number;
}

export const MOCK_BANK_NAMES = [
  { srNo: 1, bankName: 'HDFC Bank', code: 'HDFC', bank_name: 'HDFC Bank', bank_code: 'HDFC' },
  { srNo: 2, bankName: 'State Bank of India', code: 'SBI', bank_name: 'State Bank of India', bank_code: 'SBI' },
  { srNo: 3, bankName: 'ICICI Bank', code: 'ICICI', bank_name: 'ICICI Bank', bank_code: 'ICICI' },
  { srNo: 4, bankName: 'Axis Bank', code: 'AXIS', bank_name: 'Axis Bank', bank_code: 'AXIS' },
  { srNo: 5, bankName: 'Kotak Mahindra Bank', code: 'KOTAK', bank_name: 'Kotak Mahindra Bank', bank_code: 'KOTAK' },
  { srNo: 6, bankName: 'Punjab National Bank', code: 'PNB', bank_name: 'Punjab National Bank', bank_code: 'PNB' },
  { srNo: 7, bankName: 'Bank of Baroda', code: 'BOB', bank_name: 'Bank of Baroda', bank_code: 'BOB' },
];

export const MOCK_BANK_ACCOUNTS: MockBankAccount[] = [
  {
    account_id: 'ACC_HDFC_501002',
    accountId: 'ACC_HDFC_501002',
    entityName: 'Sharma Trading & Logistics Co.',
    entityType: 'Private Limited',
    accountNumber: '50100284754582',
    account_number: '50100284754582',
    accountType: 'Current Account',
    account_type: 'Current Account',
    bankCode: 'HDFC',
    bank_name: 'HDFC Bank',
    ifsc_code: 'HDFC0000060',
    branch_name: 'Fort Branch, Mumbai',
    from_date: '2024-04-01',
    to_date: '2025-03-31',
    created_at: '2024-04-01T00:00:00Z',
    opening_balance: 450000,
    current_balance: 645000,
    total_credits: 4850000,
    total_debits: 3920000,
  },
  {
    account_id: 'ACC_SBI_394827',
    accountId: 'ACC_SBI_394827',
    entityName: 'Sharma Trading & Logistics Co.',
    entityType: 'Private Limited',
    accountNumber: '39482710582',
    account_number: '39482710582',
    accountType: 'Current Account',
    account_type: 'Current Account',
    bankCode: 'SBI',
    bank_name: 'State Bank of India',
    ifsc_code: 'SBIN0001124',
    branch_name: 'BKC Complex, Mumbai',
    from_date: '2024-04-01',
    to_date: '2025-03-31',
    created_at: '2024-04-01T00:00:00Z',
    opening_balance: 210000,
    current_balance: 380000,
    total_credits: 3200000,
    total_debits: 2840000,
  },
];

export const MOCK_BSA_MONTHLY_OVERVIEW = {
  summary: {
    total_credits: 4850000,
    total_debits: 3920000,
    net_cash_flow: 930000,
    avg_monthly_balance: 645000,
    total_transactions: 482,
    bounce_count: 0,
    salary_credits: 0,
    business_credits: 4850000,
  },
  months: [
    { month: 'Apr 2024', credits: 380000, debits: 310000, balance: 520000, count: 38 },
    { month: 'May 2024', credits: 410000, debits: 340000, balance: 590000, count: 42 },
    { month: 'Jun 2024', credits: 395000, debits: 325000, balance: 660000, count: 39 },
    { month: 'Jul 2024', credits: 420000, debits: 350000, balance: 730000, count: 44 },
    { month: 'Aug 2024', credits: 390000, debits: 315000, balance: 805000, count: 37 },
    { month: 'Sep 2024', credits: 440000, debits: 360000, balance: 885000, count: 46 },
    { month: 'Oct 2024', credits: 460000, debits: 380000, balance: 965000, count: 48 },
    { month: 'Nov 2024', credits: 370000, debits: 310000, balance: 1025000, count: 35 },
    { month: 'Dec 2024', credits: 410000, debits: 335000, balance: 1100000, count: 41 },
    { month: 'Jan 2025', credits: 385000, debits: 305000, balance: 1180000, count: 36 },
    { month: 'Feb 2025', credits: 395000, debits: 310000, balance: 1265000, count: 38 },
    { month: 'Mar 2025', credits: 395000, debits: 580000, balance: 645000, count: 38 },
  ],
  category_breakdown: {
    credits: [
      { category: 'Customer Payments / Inflow', amount: 3920000, percentage: 80.8 },
      { category: 'Vendor Refunds & Advances', amount: 580000, percentage: 11.9 },
      { category: 'Inter-account Transfer', amount: 350000, percentage: 7.3 },
    ],
    debits: [
      { category: 'Vendor Disbursements', amount: 2450000, percentage: 62.5 },
      { category: 'Employee Salaries & Wages', amount: 680000, percentage: 17.3 },
      { category: 'Loan EMI Payments', amount: 420000, percentage: 10.7 },
      { category: 'Utility & Office Expenses', amount: 220000, percentage: 5.6 },
      { category: 'Bank Charges & Taxes', amount: 150000, percentage: 3.8 },
    ],
  },
};

export const MOCK_BSA_CASH_FLOW = {
  account_number: '50100284754582',
  inflow_total: 4850000,
  outflow_total: 3920000,
  net_flow: 930000,
  inflow_categories: [
    { name: 'Operating Inflows', value: 3920000 },
    { name: 'Non-Operating Inflows', value: 930000 },
  ],
  outflow_categories: [
    { name: 'Operational Expenses', value: 2450000 },
    { name: 'Payroll & Salaries', value: 680000 },
    { name: 'Financing Outflows (EMIs)', value: 420000 },
    { name: 'Administrative Expenses', value: 370000 },
  ],
};

export const MOCK_BSA_EOD_ANALYSIS = {
  account_number: '50100284754582',
  min_balance: 240000,
  max_balance: 1265000,
  avg_balance: 645000,
  daily_balances: Array.from({ length: 30 }, (_, i) => ({
    date: `2025-03-${String(i + 1).padStart(2, '0')}`,
    balance: Math.floor(550000 + Math.sin(i / 3) * 200000 + (i * 12000)),
  })),
};

export const MOCK_BSA_LOAN_TRANSACTIONS = [
  {
    txn_id: 'TXN-L-9841',
    date: '2025-03-05',
    narration: 'ACH D/ HDFC BANK LOAN EMI',
    type: 'DEBIT',
    amount: 35000,
    category: 'Loan EMI',
    balance: 890000,
  },
  {
    txn_id: 'TXN-L-9812',
    date: '2025-02-05',
    narration: 'ACH D/ HDFC BANK LOAN EMI',
    type: 'DEBIT',
    amount: 35000,
    category: 'Loan EMI',
    balance: 855000,
  },
  {
    txn_id: 'TXN-L-9780',
    date: '2025-01-05',
    narration: 'ACH D/ HDFC BANK LOAN EMI',
    type: 'DEBIT',
    amount: 35000,
    category: 'Loan EMI',
    balance: 820000,
  },
];
