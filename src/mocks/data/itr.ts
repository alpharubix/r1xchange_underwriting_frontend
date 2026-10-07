export const MOCK_ITR_TAX_CALCULATION = {
  message: 'ITR Tax calculation data fetched successfully',
  data: {
    assessment_year: '2025-2026',
    financial_year: '2024-2025',
    pan_number: 'AABCS1429B',
    taxpayer_name: 'Sharma Trading & Logistics Co. Pvt Ltd',
    form_type: 'ITR-5 (Body of Individuals / Firm / Company)',
    filing_status: 'FILED_ON_TIME',
    filing_date: '2025-09-28',
    acknowledgement_number: 'ACK-883920194821',

    gross_income: {
      income_from_business_or_profession: 3950000,
      house_property_income: 180000,
      other_sources_income: 120000,
      capital_gains: 0,
      total_gross_income: 4250000,
    },
    deductions: {
      section_80c: 150000,
      section_80d: 50000,
      section_80tta: 10000,
      other_deductions: 40000,
      total_deductions: 250000,
    },
    tax_computation: {
      total_taxable_income: 4000000,
      gross_tax_payable: 936000,
      surcharge: 0,
      health_and_education_cess: 37440,
      total_tax_liability: 973440,
      tds_deducted: 850000,
      advance_tax_paid: 180000,
      total_taxes_paid: 1030000,
      net_tax_refundable: 56560,
      net_tax_payable: 0,
    },
  },
};

export const MOCK_ITR_BALANCE_SHEET = {
  message: 'Balance sheet fetched successfully',
  data: {
    assessment_year: '2025-2026',
    unit: 'INR',
    capital_and_liabilities: {
      proprietor_capital_or_share_capital: 11200000,
      reserves_and_surplus: 3840000,
      long_term_borrowings: 1500000,
      short_term_borrowings: 500000,
      trade_payables: 1200000,
      other_current_liabilities: 300000,
      provisions: 0,
      total_liabilities: 18540000,
    },
    assets: {
      fixed_assets: {
        tangible_assets: 7500000,
        intangible_assets: 750000,
        accumulated_depreciation: -1200000,
        net_fixed_assets: 7050000,
      },
      current_assets: {
        inventories: 4200000,
        trade_receivables: 3850000,
        cash_and_bank_balances: 2840000,
        short_term_loans_and_advances: 600000,
        total_current_assets: 11490000,
      },
      total_assets: 18540000,
    },
  },
};

export const MOCK_ITR_PROFIT_AND_LOSS = {
  message: 'Profit and loss statement fetched successfully',
  data: {
    assessment_year: '2025-2026',
    income: {
      revenue_from_operations: 18540000,
      other_operating_income: 450000,
      total_revenue: 18990000,
    },
    expenses: {
      cost_of_materials_consumed: 12600000,
      employee_benefits_expense: 1680000,
      finance_costs: 420000,
      depreciation_and_amortization: 350000,
      other_expenses: 610000,
      total_expenses: 15660000,
    },
    profit_summary: {
      profit_before_tax: 3330000,
      tax_expense: 973440,
      profit_after_tax: 2356560,
      gross_profit_margin_percent: 32.0,
      net_profit_margin_percent: 17.9,
    },
  },
};

export const MOCK_ITR_RATIO_ANALYSIS = {
  message: 'Ratio analysis fetched successfully',
  data: {
    liquidity_ratios: [
      { ratio_name: 'Current Ratio', value: 1.84, benchmark: '> 1.5', status: 'HEALTHY' },
      { ratio_name: 'Quick Ratio / Acid Test', value: 1.42, benchmark: '> 1.0', status: 'HEALTHY' },
      { ratio_name: 'Cash Ratio', value: 0.46, benchmark: '> 0.2', status: 'HEALTHY' },
    ],
    profitability_ratios: [
      { ratio_name: 'Gross Profit Margin', value: '32.0%', benchmark: '> 25.0%', status: 'EXCELLENT' },
      { ratio_name: 'Net Profit Margin', value: '17.9%', benchmark: '> 10.0%', status: 'EXCELLENT' },
      { ratio_name: 'Return on Equity (ROE)', value: '15.7%', benchmark: '> 12.0%', status: 'HEALTHY' },
      { ratio_name: 'Return on Capital Employed (ROCE)', value: '19.8%', benchmark: '> 15.0%', status: 'EXCELLENT' },
    ],
    leverage_and_solvency_ratios: [
      { ratio_name: 'Debt to Equity Ratio', value: 0.31, benchmark: '< 1.5', status: 'EXCELLENT' },
      { ratio_name: 'Interest Coverage Ratio', value: 6.84, benchmark: '> 3.0', status: 'EXCELLENT' },
    ],
    activity_ratios: [
      { ratio_name: 'Inventory Turnover Ratio', value: 4.41, benchmark: '> 3.0', status: 'HEALTHY' },
      { ratio_name: 'Debtors / Receivables Turnover', value: 4.81, benchmark: '> 4.0', status: 'HEALTHY' },
    ],
  },
};
