export const MOCK_GSTIN_NUMBER = '27AABCS1429B1Z2';
export const MOCK_GST_REF_ID = 'GST-REF-2026-77319';

export const MOCK_GSTIN_BASIC_INFO = {
  data: [
    {
      gstin: MOCK_GSTIN_NUMBER,
      legalNameOfBusiness: 'Sharma Trading & Logistics Company Private Limited',
      tradeName: 'Sharma Trading Co.',
      gstinStatus: 'Active',
      taxpayerType: 'Regular',
      constitutionOfBusiness: 'Private Limited Company',
      natureOfBusiness: ['Wholesale Trading', 'Transport & Logistics Services'],
      dateOfRegistration: '12/04/2018',
      principalPlaceAddress: '402, Trade Tower, Bandra Kurla Complex, Mumbai, Maharashtra 400051',
    },
  ],
};

export const MOCK_GST_HISTORY = {
  data: [
    {
      gstin: MOCK_GSTIN_NUMBER,
      reference_id: MOCK_GST_REF_ID,
      gst_reference_id_status: 'COMPLETED',
      from_month: 'Apr-2024',
      to_month: 'Mar-2025',
      created_at: '2025-04-02T10:00:00Z',
    },
  ],
};

export const MOCK_GST_OVERVIEW = {
  message: 'GST Overview retrieved successfully',
  data: [
    {
      gstin: MOCK_GSTIN_NUMBER,
      annual_turnover: 18540000,
      taxable_turnover: 15712000,
      exempted_turnover: 2828000,
      total_igst: 1414080,
      total_cgst: 961560,
      total_sgst: 961560,
      total_tax_paid: 3337200,
      gstr1_filing_rate: '100%',
      gstr3b_filing_rate: '100%',
      filing_compliance_status: 'COMPLIANT',
    },
  ],
};

export const MOCK_GST_TOP_SUPPLIERS_CUSTOMERS = {
  message: 'Top suppliers and customers fetched successfully',
  data: {
    top_customers: [
      {
        gstin: '27AABCT9981K1Z3',
        trade_name: 'Tata Steel Limited',
        legal_name: 'Tata Steel Limited',
        turnover: 4250000,
        percentage_share: 22.9,
        invoice_count: 18,
      },
      {
        gstin: '27AAACL4412M1Z8',
        trade_name: 'Larsen & Toubro Ltd',
        legal_name: 'Larsen & Toubro Limited',
        turnover: 3810000,
        percentage_share: 20.5,
        invoice_count: 14,
      },
      {
        gstin: '27AAACM8821N1Z1',
        trade_name: 'Mahindra Logistics Ltd',
        legal_name: 'Mahindra Logistics Limited',
        turnover: 2840000,
        percentage_share: 15.3,
        invoice_count: 12,
      },
      {
        gstin: '27AAACB3391P1Z5',
        trade_name: 'Blue Dart Express',
        legal_name: 'Blue Dart Express Limited',
        turnover: 1950000,
        percentage_share: 10.5,
        invoice_count: 9,
      },
    ],
    top_suppliers: [
      {
        gstin: '27AAACR7712Q1Z9',
        trade_name: 'Reliance Industries Ltd',
        legal_name: 'Reliance Industries Limited',
        turnover: 3450000,
        percentage_share: 26.2,
        invoice_count: 22,
      },
      {
        gstin: '27AAAC18821R1Z4',
        trade_name: 'Indian Oil Corporation',
        legal_name: 'Indian Oil Corporation Limited',
        turnover: 2890000,
        percentage_share: 21.9,
        invoice_count: 19,
      },
      {
        gstin: '27AAACG9912S1Z2',
        trade_name: 'Godrej & Boyce Mfg Co Ltd',
        legal_name: 'Godrej & Boyce Mfg Co Ltd',
        turnover: 1820000,
        percentage_share: 13.8,
        invoice_count: 11,
      },
    ],
  },
};

export const MOCK_GST_MONTHLY_SUMMARY = {
  message: 'Monthly sales and purchase summary fetched successfully',
  data: {
    monthly_trends: [
      { month: 'Apr 2024', sales_gstr1: 1420000, purchase_gstr2b: 1150000, tax_liability: 255600 },
      { month: 'May 2024', sales_gstr1: 1580000, purchase_gstr2b: 1280000, tax_liability: 284400 },
      { month: 'Jun 2024', sales_gstr1: 1490000, purchase_gstr2b: 1210000, tax_liability: 268200 },
      { month: 'Jul 2024', sales_gstr1: 1620000, purchase_gstr2b: 1310000, tax_liability: 291600 },
      { month: 'Aug 2024', sales_gstr1: 1510000, purchase_gstr2b: 1190000, tax_liability: 271800 },
      { month: 'Sep 2024', sales_gstr1: 1680000, purchase_gstr2b: 1340000, tax_liability: 302400 },
      { month: 'Oct 2024', sales_gstr1: 1750000, purchase_gstr2b: 1410000, tax_liability: 315000 },
      { month: 'Nov 2024', sales_gstr1: 1390000, purchase_gstr2b: 1120000, tax_liability: 250200 },
      { month: 'Dec 2024', sales_gstr1: 1560000, purchase_gstr2b: 1250000, tax_liability: 280800 },
      { month: 'Jan 2025', sales_gstr1: 1480000, purchase_gstr2b: 1180000, tax_liability: 266400 },
      { month: 'Feb 2025', sales_gstr1: 1520000, purchase_gstr2b: 1220000, tax_liability: 273600 },
      { month: 'Mar 2025', sales_gstr1: 1540000, purchase_gstr2b: 1230000, tax_liability: 277200 },
    ],
  },
};
