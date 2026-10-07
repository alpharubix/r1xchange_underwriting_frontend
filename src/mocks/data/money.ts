export const MOCK_SAVE_MONEY_REPORTS = {
  reference_id: 'REF-SAVE-2026-901',
  accounts: [
    {
      lender_name: 'HDFC Bank Ltd',
      account_number: '50100284754582',
      opened_date: '2022-04-10',
      current_balance: '₹6,45,000',
      check_box: true,
      check_box_initial: true,
    },
    {
      lender_name: 'State Bank of India',
      account_number: '39482710582',
      opened_date: '2023-01-15',
      current_balance: '₹3,80,000',
      check_box: false,
      check_box_initial: false,
    },
  ],
};

export const MOCK_RECTIFY_MONEY_REPORTS = {
  reference_id: 'REF-RECTIFY-2026-902',
  accounts: [
    {
      lender_name: 'HDFC Bank Ltd (Commercial Vehicle Loan)',
      account_number: 'XXXX XXXX 4582',
      opened_date: '2022-04-10',
      overdue_amount: 0,
      average_dpd: 0,
      check_box: false,
      check_box_initial: false,
    },
    {
      lender_name: 'State Bank of India (Overdraft)',
      account_number: 'XXXX XXXX 0582',
      opened_date: '2023-01-15',
      overdue_amount: 0,
      average_dpd: 0,
      check_box: false,
      check_box_initial: false,
    },
  ],
};
