import {
  MOCK_CUSTOMER_USER,
  MOCK_ANCHOR_USER,
  MOCK_ADMIN_USER,
  MOCK_USERS_LIST,
  MOCK_ADMINS_LIST,
  MOCK_ANCHORS_LIST,
  MOCK_ASSOCIATED_ANCHORS,
  type MockUser,
} from '../data/users';
import {
  MOCK_BANK_NAMES,
  MOCK_BANK_ACCOUNTS,
  MOCK_BSA_MONTHLY_OVERVIEW,
  MOCK_BSA_CASH_FLOW,
  MOCK_BSA_EOD_ANALYSIS,
  MOCK_BSA_LOAN_TRANSACTIONS,
} from '../data/bsa';
import {
  MOCK_CIBIL_REPORTS_LIST,
  MOCK_CIBIL_OVERVIEW,
  MOCK_CIBIL_ACCOUNT_SUMMARY,
  MOCK_CIBIL_PAYMENT_HISTORY,
  MOCK_CIBIL_ANALYSIS,
} from '../data/cibil';
import {
  MOCK_GSTIN_NUMBER,
  MOCK_GST_REF_ID,
  MOCK_GSTIN_BASIC_INFO,
  MOCK_GST_HISTORY,
  MOCK_GST_OVERVIEW,
  MOCK_GST_TOP_SUPPLIERS_CUSTOMERS,
  MOCK_GST_MONTHLY_SUMMARY,
} from '../data/gst';
import {
  MOCK_ITR_TAX_CALCULATION,
  MOCK_ITR_BALANCE_SHEET,
  MOCK_ITR_PROFIT_AND_LOSS,
  MOCK_ITR_RATIO_ANALYSIS,
} from '../data/itr';
import { MOCK_LENDING_ELIGIBILITY } from '../data/lending';
import {
  MOCK_KYC_AADHAAR_OTP,
  MOCK_KYC_AADHAAR_DETAILS,
  MOCK_DIGILOCKER_SESSION,
  MOCK_DIGILOCKER_DOCUMENTS,
} from '../data/kyc';
import { MOCK_SYSTEM_LOGS } from '../data/logs';
import {
  MOCK_SAVE_MONEY_REPORTS,
  MOCK_RECTIFY_MONEY_REPORTS,
} from '../data/money';
import {
  MOCK_WALLET_BALANCE,
  MOCK_CREATE_ORDER_RESPONSE,
  MOCK_VALIDATE_PAYMENT_RESPONSE,
  MOCK_PENDING_PAYMENTS,
} from '../data/payments';

// Active session state for demo mode
let currentUser: MockUser = MOCK_CUSTOMER_USER;

export function getCurrentMockUser(): MockUser {
  const storedRole = localStorage.getItem('user_role')?.toLowerCase();
  if (storedRole === 'admin' || storedRole === 'super_admin' || storedRole === 'superadmin') {
    return MOCK_ADMIN_USER;
  }
  if (
    storedRole === 'anchor' ||
    storedRole === 'super_anchor' ||
    storedRole === 'superanchor' ||
    storedRole === 'super-anchor'
  ) {
    return MOCK_ANCHOR_USER;
  }
  return currentUser || MOCK_CUSTOMER_USER;
}

export function handleMockRoute(url: string, _method: string, _data: any, params: any): any {
  const cleanUrl = url.split('?')[0].replace(/^(https?:\/\/[^\/]+)?(\/v1)?/, '');

  // ─── AUTHENTICATION ────────────────────────────────────────────────────────
  if (cleanUrl === '/auth/login') {
    currentUser = { ...MOCK_CUSTOMER_USER, role: 'customer' };
    localStorage.setItem('user_role', 'customer');
    return {
      message: 'Login successful (role: customer)',
      token: 'demo_jwt_token_customer',
      user: currentUser,
      data: { message: 'Login successful (role: customer)', user: currentUser },
    };
  }

  if (cleanUrl === '/auth/anchor/login') {
    currentUser = { ...MOCK_ANCHOR_USER, role: 'anchor' };
    localStorage.setItem('user_role', 'anchor');
    return {
      message: 'Login successful (role: anchor)',
      token: 'demo_jwt_token_anchor',
      user: currentUser,
      data: { message: 'Login successful (role: anchor)', user: currentUser },
    };
  }

  if (cleanUrl === '/auth/admin/login') {
    currentUser = { ...MOCK_ADMIN_USER, role: 'admin' };
    localStorage.setItem('user_role', 'admin');
    return {
      message: 'Login successful (role: admin)',
      token: 'demo_jwt_token_admin',
      user: currentUser,
      data: { message: 'Login successful (role: admin)', user: currentUser },
    };
  }

  if (cleanUrl === '/auth/register' || cleanUrl === '/auth/anchor/create') {
    return {
      message: 'Registration successful! Demo account created.',
      data: { user: currentUser },
    };
  }

  if (cleanUrl === '/auth/logout') {
    localStorage.removeItem('user_role');
    return { message: "You've been logged out successfully." };
  }

  if (cleanUrl === '/auth/forgot_password') {
    return { message: 'OTP sent to your email address.', data: { otp_sent: true } };
  }

  if (cleanUrl === '/auth/validate-otp') {
    return { message: 'OTP verified successfully.', data: { is_valid: true } };
  }

  if (cleanUrl === '/auth/reset_password') {
    return { message: 'Password reset successfully. Please log in.' };
  }

  // ─── USER & CONSENT ────────────────────────────────────────────────────────
  if (cleanUrl === '/user/me') {
    const active = getCurrentMockUser();
    return {
      message: 'User profile retrieved successfully',
      data: active,
      user: active,
      ...active,
    };
  }

  if (cleanUrl.startsWith('/user/check-consent') || cleanUrl.startsWith('/user/give-consent')) {
    return {
      consent: true,
      status_code: 200,
      message: 'Consent verified successfully',
      data: { consent: true, status_code: 200 },
    };
  }

  // ─── ADMIN & ANCHOR MANAGEMENT ──────────────────────────────────────────────
  if (cleanUrl === '/admin/users-list') {
    return {
      users: MOCK_USERS_LIST,
      data: MOCK_USERS_LIST,
      page_info: {
        page: params?.page ? Number(params.page) : 1,
        limit: params?.limit ? Number(params.limit) : 10,
        total_pages: 1,
        total_data: MOCK_USERS_LIST.length,
        total_records: MOCK_USERS_LIST.length,
      },
    };
  }

  if (cleanUrl === '/admin/admins-list') {
    return {
      admins: MOCK_ADMINS_LIST,
      data: MOCK_ADMINS_LIST,
      page_info: {
        page: 1,
        limit: 10,
        total_pages: 1,
        total_data: MOCK_ADMINS_LIST.length,
      },
    };
  }

  if (cleanUrl === '/admin/anchors/anchor-list') {
    return {
      anchors: MOCK_ANCHORS_LIST,
      data: MOCK_ANCHORS_LIST,
      page_info: {
        page: 1,
        limit: 10,
        total_pages: 1,
        total_data: MOCK_ANCHORS_LIST.length,
      },
    };
  }

  if (cleanUrl === '/anchor/associated-anchors') {
    return {
      anchors: MOCK_ASSOCIATED_ANCHORS,
      data: MOCK_ASSOCIATED_ANCHORS,
    };
  }

  if (cleanUrl === '/anchor/users') {
    return {
      users: MOCK_USERS_LIST,
      data: MOCK_USERS_LIST,
      page_info: {
        page: 1,
        limit: 10,
        total_pages: 1,
        total_data: MOCK_USERS_LIST.length,
      },
    };
  }

  if (cleanUrl.startsWith('/anchor/get-user-reports/bsa')) {
    return { data: MOCK_BANK_ACCOUNTS };
  }
  if (cleanUrl.startsWith('/anchor/get-user-reports/gst')) {
    return { data: MOCK_GST_HISTORY.data };
  }
  if (cleanUrl.startsWith('/anchor/get-user-reports/itr')) {
    return { data: [MOCK_ITR_TAX_CALCULATION.data] };
  }
  if (cleanUrl.startsWith('/anchor/get-user-reports/cibil')) {
    return { data: MOCK_CIBIL_REPORTS_LIST };
  }

  // ─── BSA (BANK STATEMENT ANALYSIS) ──────────────────────────────────────────
  if (cleanUrl === '/bsa/get-bank-names') {
    return { data: MOCK_BANK_NAMES };
  }

  if (cleanUrl === '/bsa/upload') {
    return {
      message: 'Bank statement processed successfully',
      data: {
        account_number: '50100284754582',
        bank_name: 'HDFC Bank',
        total_transactions: 482,
        status: 'PROCESSED',
      },
    };
  }

  if (cleanUrl === '/bsa/bank-accounts' || cleanUrl === '/crm/accounts-filter') {
    return {
      message: 'Bank accounts fetched successfully',
      data: MOCK_BANK_ACCOUNTS,
    };
  }

  if (cleanUrl === '/bsa/report-date-range') {
    return {
      data: {
        from_date: '2024-04-01',
        to_date: '2025-03-31',
      },
    };
  }

  if (cleanUrl === '/bsa/account-details') {
    return {
      data: {
        account_number: '50100284754582',
        bank_name: 'HDFC Bank',
        average_monthly_balance: 645000,
        total_credit: 4850000,
        total_debit: 3920000,
      },
    };
  }

  if (cleanUrl === '/bsa/overview-monthly-wise') {
    return {
      message: 'Monthly BSA overview fetched successfully',
      data: MOCK_BSA_MONTHLY_OVERVIEW,
      ...MOCK_BSA_MONTHLY_OVERVIEW,
    };
  }

  if (cleanUrl === '/bsa/summary-of-debit-and-credit') {
    return {
      message: 'Debit and Credit summary fetched',
      data: MOCK_BSA_MONTHLY_OVERVIEW.category_breakdown,
      ...MOCK_BSA_MONTHLY_OVERVIEW.category_breakdown,
    };
  }

  if (cleanUrl === '/bsa/cash-flow') {
    return {
      message: 'Cash flow analysis fetched',
      data: MOCK_BSA_CASH_FLOW,
      ...MOCK_BSA_CASH_FLOW,
    };
  }

  if (cleanUrl === '/bsa/individual/overview') {
    return {
      message: 'Individual account overview fetched',
      data: MOCK_BSA_MONTHLY_OVERVIEW,
    };
  }

  if (cleanUrl === '/bsa/individual/eod-analysis') {
    return {
      message: 'EOD analysis fetched',
      data: MOCK_BSA_EOD_ANALYSIS,
    };
  }

  if (cleanUrl === '/bsa/individual/loan-transactions') {
    return {
      message: 'Loan transactions fetched',
      data: MOCK_BSA_LOAN_TRANSACTIONS,
    };
  }

  // ─── CIBIL ──────────────────────────────────────────────────────────────────
  if (cleanUrl === '/cibil/generate-otp') {
    return {
      message: 'CIBIL OTP sent to customer registered mobile number',
      data: { otp_flow_id: 'cibil_otp_flow_88492' },
      responseCode: '200',
    };
  }

  if (cleanUrl === '/cibil/validate-otp' || cleanUrl === '/cibil/resend-otp') {
    return {
      message: 'CIBIL OTP verified successfully',
      data: { otp_flow_id: 'cibil_otp_flow_88492' },
      responseCode: '200',
    };
  }

  if (cleanUrl === '/cibil/list-reports') {
    return {
      message: 'CIBIL reports list fetched',
      data: MOCK_CIBIL_REPORTS_LIST,
      responseCode: '200',
    };
  }

  if (cleanUrl.startsWith('/cibil/overview')) {
    return MOCK_CIBIL_OVERVIEW;
  }

  if (cleanUrl.startsWith('/cibil/account-summary')) {
    return MOCK_CIBIL_ACCOUNT_SUMMARY;
  }

  if (cleanUrl.startsWith('/cibil/payment-history')) {
    return MOCK_CIBIL_PAYMENT_HISTORY;
  }

  if (cleanUrl.startsWith('/cibil/analysis')) {
    return MOCK_CIBIL_ANALYSIS;
  }

  if (cleanUrl.startsWith('/cibil/webhook-status')) {
    return {
      message: 'CIBIL report status fetched',
      data: { webhook_status: 'SUCCESS' },
      responseCode: '200',
    };
  }

  // ─── GST ────────────────────────────────────────────────────────────────────
  if (cleanUrl === '/gst/gstin') {
    return {
      is_found: true,
      gst_number: [MOCK_GSTIN_NUMBER],
      data: [MOCK_GSTIN_NUMBER],
    };
  }

  if (cleanUrl === '/gst/gstin/add-new' || cleanUrl === '/gst/gstin') {
    return {
      message: 'GSTIN added / updated successfully',
      data: { gstin: MOCK_GSTIN_NUMBER },
    };
  }

  if (cleanUrl === '/gst/gstin-basic-info') {
    return MOCK_GSTIN_BASIC_INFO;
  }

  if (cleanUrl === '/gst/generate-otp') {
    return {
      data: { gstin: MOCK_GSTIN_NUMBER, otp_reference_id: 'gst_otp_ref_99128' },
    };
  }

  if (cleanUrl === '/gst/validate-otp') {
    return {
      data: { gstin: MOCK_GSTIN_NUMBER, is_otp_validated: true },
    };
  }

  if (cleanUrl === '/gst/post-gstin') {
    return {
      data: { gstin: MOCK_GSTIN_NUMBER, gst_reference_id: MOCK_GST_REF_ID },
    };
  }

  if (cleanUrl === '/gst/get-gst-ref-status') {
    return {
      data: {
        gst_reference_id_status: [
          { gst_reference_id: MOCK_GST_REF_ID, gst_reference_id_status: 'COMPLETED' },
        ],
      },
    };
  }

  if (cleanUrl === '/gst/users-ref-ids') {
    return MOCK_GST_HISTORY;
  }

  if (cleanUrl === '/gst/overview') {
    return MOCK_GST_OVERVIEW;
  }

  if (cleanUrl === '/gst/top-suppliers-and-customers') {
    return MOCK_GST_TOP_SUPPLIERS_CUSTOMERS;
  }

  if (cleanUrl === '/gst/monthly-sales-purchase-summary') {
    return MOCK_GST_MONTHLY_SUMMARY;
  }

  // ─── ITR ────────────────────────────────────────────────────────────────────
  if (cleanUrl === '/itr/link-precheck' || cleanUrl === '/itr/check-link-status') {
    return {
      message: 'ITR precheck successful',
      data: { is_linked: true, status: 'CONNECTED' },
    };
  }

  if (cleanUrl === '/itr/generate-link') {
    return {
      message: 'ITR details submitted successfully',
      data: { status: 'SUCCESS' },
    };
  }

  if (cleanUrl === '/itr/tax-calculation') {
    return MOCK_ITR_TAX_CALCULATION;
  }

  if (cleanUrl === '/itr/balance_sheet') {
    return MOCK_ITR_BALANCE_SHEET;
  }

  if (cleanUrl === '/itr/profit-and-loss-statement') {
    return MOCK_ITR_PROFIT_AND_LOSS;
  }

  if (cleanUrl === '/itr/ratio-analysis') {
    return MOCK_ITR_RATIO_ANALYSIS;
  }

  // ─── LENDING ────────────────────────────────────────────────────────────────
  if (cleanUrl === '/lending/check-eligibility') {
    return MOCK_LENDING_ELIGIBILITY;
  }

  // ─── KYC & DIGILOCKER ───────────────────────────────────────────────────────
  if (cleanUrl === '/kyc/aadhaar/generate-otp') {
    return { data: MOCK_KYC_AADHAAR_OTP };
  }

  if (cleanUrl === '/kyc/aadhaar/validate-otp' || cleanUrl === '/kyc/aadhaar/details') {
    return { data: MOCK_KYC_AADHAAR_DETAILS };
  }

  if (cleanUrl === '/kyc/digilocker/generate-url') {
    return { data: MOCK_DIGILOCKER_SESSION };
  }

  if (cleanUrl === '/kyc/digilocker/session-status' || cleanUrl === '/kyc/digilocker/current-status') {
    return { data: { ...MOCK_DIGILOCKER_SESSION, session_status: 'COMPLETED' } };
  }

  if (cleanUrl === '/kyc/digilocker/list-documents' || cleanUrl === '/kyc/digilocker/document-precheck') {
    return {
      data: {
        user_id: 'usr_demo_customer_101',
        kyc_flow_id: 'DIGI-FLOW-2026-99120',
        document_list: MOCK_DIGILOCKER_DOCUMENTS,
      },
    };
  }

  if (cleanUrl === '/kyc/digilocker/document-url') {
    return {
      data: { documentUrl: 'https://digilocker.gov.in/doc/preview.pdf' },
    };
  }

  // ─── MONEY TOOLS ────────────────────────────────────────────────────────────
  if (cleanUrl.includes('/save-money')) {
    if (cleanUrl.includes('submit-selections')) {
      return { message: 'Save Money selections saved successfully' };
    }
    return MOCK_SAVE_MONEY_REPORTS;
  }

  if (cleanUrl.includes('/rectify')) {
    if (cleanUrl.includes('submit-selections')) {
      return { message: 'Rectify Money selections saved successfully' };
    }
    return MOCK_RECTIFY_MONEY_REPORTS;
  }

  if (cleanUrl === '/access-money/loan-request') {
    return { message: 'Loan application submitted successfully. Financial advisor will reach out shortly.' };
  }

  // ─── WALLET & PAYMENTS ──────────────────────────────────────────────────────
  if (cleanUrl.startsWith('/wallet/balance')) {
    const parts = cleanUrl.split('/');
    const serviceName = parts[parts.length - 1] || 'BSA';
    return MOCK_WALLET_BALANCE(serviceName);
  }

  if (cleanUrl === '/payments/create-order') {
    return MOCK_CREATE_ORDER_RESPONSE;
  }

  if (cleanUrl === '/payments/validate-payment') {
    return MOCK_VALIDATE_PAYMENT_RESPONSE;
  }

  if (cleanUrl === '/payments/pending') {
    return MOCK_PENDING_PAYMENTS;
  }

  // ─── LOGS & TICKETS ─────────────────────────────────────────────────────────
  if (cleanUrl === '/logs/view') {
    return {
      logs: MOCK_SYSTEM_LOGS,
      data: MOCK_SYSTEM_LOGS,
      page: params?.page ? Number(params.page) : 1,
      limit: params?.limit ? Number(params.limit) : 10,
      total_logs: MOCK_SYSTEM_LOGS.length,
      total_pages: 1,
      page_info: {
        page: 1,
        limit: 10,
        total_data: MOCK_SYSTEM_LOGS.length,
        total_records: MOCK_SYSTEM_LOGS.length,
        total_pages: 1,
        logs: MOCK_SYSTEM_LOGS,
      },
    };
  }

  if (cleanUrl === '/ticket/history') {
    return {
      message: 'Ticket history retrieved',
      data: [
        {
          ticket_id: 'TCK-2026-001',
          subject: 'GST Report Generation Query',
          status: 'RESOLVED',
          created_at: '2026-03-01T10:00:00Z',
          priority: 'NORMAL',
        },
      ],
    };
  }

  // Fallback for any unmapped API route
  return {
    message: 'Operation completed successfully (Demo Mode)',
    status_code: 200,
    data: [],
  };
}
