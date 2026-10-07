export const MOCK_CIBIL_REFERENCE_ID = 'CIBIL-REF-2026-88492';

export const MOCK_CIBIL_REPORTS_LIST = [
  {
    reference_id: MOCK_CIBIL_REFERENCE_ID,
    cibil_pulled_date: '2026-03-15T11:20:00Z',
    customer_name: 'Rajesh Sharma',
    score: 785,
  },
  {
    reference_id: 'CIBIL-REF-2025-44102',
    cibil_pulled_date: '2025-09-10T15:45:00Z',
    customer_name: 'Rajesh Sharma',
    score: 772,
  },
];

export const MOCK_CIBIL_OVERVIEW = {
  reference_id: MOCK_CIBIL_REFERENCE_ID,
  cibil_pulled_date: '2026-03-15T11:20:00Z',
  cibil_report: {
    EquifaxRetail: {
      BureauAnalysis: {
        Score: '785',
        ScoreName: 'EQUIFAX RISK SCORE 3.0',
        ScoreCardName: 'Commercial Credit Risk Assessment',
        ScoreDate: '15032026',
        ScoreCategory: 'LOW RISK (EXCELLENT)',
        TotalAccounts: 6,
        ActiveAccounts: 3,
        ClosedAccounts: 3,
        TotalBalance: 485000,
        TotalSanctionedAmount: 2300000,
        TotalMonthlyEMI: 48500,
        OverdueAccounts: 0,
        TotalOverdueAmount: 0,
        ZeroDPDAccounts: 6,
        EnquiriesInLast6Months: 1,
        CreditUtilizationPercent: 24,
      },
      generalInfo: {
        Name: 'RAJESH SHARMA',
        Company: 'SHARMA TRADING & LOGISTICS CO.',
        DOB: '15/06/1982',
        Gender: 'Male',
        PAN: 'AABCS1429B',
        MobileNo: '+919820154321',
        Address: '402, Trade Tower, Bandra Kurla Complex, Mumbai, Maharashtra 400051',
      },
    },
  },
};

export const MOCK_CIBIL_ACCOUNT_SUMMARY = {
  reference_id: MOCK_CIBIL_REFERENCE_ID,
  cibil_report: {
    EquifaxRetail: {
      accountSummary: [
        {
          account_id: 'ACC-CV-8821',
          lender_name: 'HDFC BANK LTD',
          account_type: 'COMMERCIAL VEHICLE LOAN',
          sanction_amount: 1500000,
          current_balance: 320000,
          overdue_amount: 0,
          monthly_emi: 35000,
          opened_date: '2022-04-10',
          last_payment_date: '2026-03-05',
          account_status: 'ACTIVE',
          repayment_tenure: 48,
          dpd: 0,
        },
        {
          account_id: 'ACC-OD-1092',
          lender_name: 'STATE BANK OF INDIA',
          account_type: 'BUSINESS OVERDRAFT / CASH CREDIT',
          sanction_amount: 500000,
          current_balance: 165000,
          overdue_amount: 0,
          monthly_emi: 13500,
          opened_date: '2023-01-15',
          last_payment_date: '2026-03-10',
          account_status: 'ACTIVE',
          repayment_tenure: 36,
          dpd: 0,
        },
        {
          account_id: 'ACC-CC-4481',
          lender_name: 'ICICI BANK LTD',
          account_type: 'CORPORATE CREDIT CARD',
          sanction_amount: 300000,
          current_balance: 0,
          overdue_amount: 0,
          monthly_emi: 0,
          opened_date: '2021-08-20',
          last_payment_date: '2026-02-28',
          account_status: 'ACTIVE',
          repayment_tenure: 0,
          dpd: 0,
        },
      ],
    },
  },
};

export const MOCK_CIBIL_PAYMENT_HISTORY = {
  reference_id: MOCK_CIBIL_REFERENCE_ID,
  cibil_report: {
    EquifaxRetail: {
      activeAccountRepaymentTrack: [
        {
          lender_name: 'HDFC BANK LTD (Commercial Vehicle Loan)',
          account_number: 'XXXX XXXX 4582',
          history: [
            { year: '2026', month: 'Feb', dpd: '000', status: 'ON_TIME' },
            { year: '2026', month: 'Jan', dpd: '000', status: 'ON_TIME' },
            { year: '2025', month: 'Dec', dpd: '000', status: 'ON_TIME' },
            { year: '2025', month: 'Nov', dpd: '000', status: 'ON_TIME' },
            { year: '2025', month: 'Oct', dpd: '000', status: 'ON_TIME' },
            { year: '2025', month: 'Sep', dpd: '000', status: 'ON_TIME' },
            { year: '2025', month: 'Aug', dpd: '000', status: 'ON_TIME' },
            { year: '2025', month: 'Jul', dpd: '000', status: 'ON_TIME' },
            { year: '2025', month: 'Jun', dpd: '000', status: 'ON_TIME' },
            { year: '2025', month: 'May', dpd: '000', status: 'ON_TIME' },
            { year: '2025', month: 'Apr', dpd: '000', status: 'ON_TIME' },
            { year: '2025', month: 'Mar', dpd: '000', status: 'ON_TIME' },
          ],
        },
        {
          lender_name: 'STATE BANK OF INDIA (Business Overdraft)',
          account_number: 'XXXX XXXX 0582',
          history: [
            { year: '2026', month: 'Feb', dpd: '000', status: 'ON_TIME' },
            { year: '2026', month: 'Jan', dpd: '000', status: 'ON_TIME' },
            { year: '2025', month: 'Dec', dpd: '000', status: 'ON_TIME' },
            { year: '2025', month: 'Nov', dpd: '000', status: 'ON_TIME' },
            { year: '2025', month: 'Oct', dpd: '000', status: 'ON_TIME' },
            { year: '2025', month: 'Sep', dpd: '000', status: 'ON_TIME' },
            { year: '2025', month: 'Aug', dpd: '000', status: 'ON_TIME' },
            { year: '2025', month: 'Jul', dpd: '000', status: 'ON_TIME' },
            { year: '2025', month: 'Jun', dpd: '000', status: 'ON_TIME' },
            { year: '2025', month: 'May', dpd: '000', status: 'ON_TIME' },
            { year: '2025', month: 'Apr', dpd: '000', status: 'ON_TIME' },
            { year: '2025', month: 'Mar', dpd: '000', status: 'ON_TIME' },
          ],
        },
      ],
      closedAccountRepaymentTrack: [
        {
          lender_name: 'ICICI BANK LTD (Personal Loan)',
          account_number: 'XXXX XXXX 8812',
          closed_date: '2024-05-10',
          status: 'CLOSED_NORMAL',
        },
      ],
    },
  },
};

export const MOCK_CIBIL_ANALYSIS = {
  reference_id: MOCK_CIBIL_REFERENCE_ID,
  cibil_report: {
    EquifaxRetail: {
      ScoremeAnalysis: {
        overall_risk_score: 785,
        risk_grade: 'Low Risk',
        key_positives: [
          'Zero default or overdue track record over 36 months',
          'Healthy mix of commercial vehicle loan and business credit',
          'Low credit utilization ratio of 24%',
        ],
        key_negatives: [],
        credit_bureau_recommendation: 'RECOMMENDED FOR APPROVAL',
      },
    },
  },
};
