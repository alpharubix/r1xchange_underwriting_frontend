import { useEffect, useState, type CSSProperties, type ReactNode } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  Banknote,
  ChartNoAxesCombined,
  Check,
  ChevronDown,
  ChevronRight,
  CircleDollarSign,
  FileChartColumnIncreasing,
  FileSearch,
  Fingerprint,
  Landmark,
  Menu,
  ShieldCheck,
  Sparkles,
  X,
  type LucideIcon,
} from 'lucide-react';
import { getPricingDetails } from '@/lib/paymentUtils';
import { clientLogos } from './clientLogos';
import bsaAccessFromDashboard from "@/assets/bsaAccessFromDashboard.png"
import bsaUploadScreenshot from '@/assets/UploadBankStatementPdf.png';
import './marketing.css';

type Product = {
  slug: string;
  acronym: string;
  name: string;
  fullName: string;
  description: string;
  headline: string;
  overview: string;
  icon: LucideIcon;
  capabilities: { title: string; description: string }[];
  benefits: string[];
  steps: { title: string; description: string }[];
};

type WorkflowStep = {
  title: string;
  description: string;
  screen: string;
  image?: string;
  imageAlt?: string;
};

type Workflow = {
  slug: string;
  acronym: string;
  name: string;
  purpose: string;
  steps: WorkflowStep[];
};

const products: Product[] = [
  {
    slug: 'bsa',
    acronym: 'BSA',
    name: 'Bank statement analysis',
    fullName: 'Bank Statement Analysis',
    description: 'Analyze each available bank account with Overview, EOD Analysis, Loan Transactions, Summary of Debit and Credit, Cash Flow, or Monthly Overview.',
    headline: 'Analyze multiple bank accounts, one account at a time.',
    overview: 'BSA Reports lists the bank accounts available for a customer so each can be selected and reviewed separately. Depending on the account workflow, Available Reports includes Overview, EOD Analysis, and Loan Transactions, or Summary of Debit and Credit, Cash Flow, and Monthly Overview. Summary of Debit and Credit shows a monthwise breakdown of inflows and outflows; Cash Flow shows monthwise cash flow statement analysis.',
    icon: Landmark,
    capabilities: [
      { title: 'Multiple Bank Accounts', description: 'View the bank accounts available for a customer and open reports for each selected account.' },
      { title: 'Overview, EOD Analysis, Loan Transactions', description: 'These reports appear in the individual-account Available Reports menu.' },
      { title: 'Summary of Debit and Credit', description: 'Review the monthwise breakdown of inflows and outflows for a selected account.' },
      { title: 'Cash Flow and Monthly Overview', description: 'Open the monthwise cash flow statement analysis and the Monthly Overview reports.' },
    ],
    benefits: ['Analyze the different bank accounts listed for a customer separately.', 'Open the reports available for each selected account.', 'Review monthly debit and credit, Cash Flow, and Monthly Overview reports.', 'Use Overview, EOD Analysis, and Loan Transactions in the individual-account workflow.'],
    steps: [
      { title: 'Review Bank Accounts', description: 'See the bank accounts available for the customer.' },
      { title: 'Select an account', description: 'Open the reports available for that specific account.' },
      { title: 'Choose a report', description: 'Open Overview, EOD Analysis, Loan Transactions, Summary of Debit and Credit, Cash Flow, or Monthly Overview as available.' },
    ],
  },
  {
    slug: 'gst',
    acronym: 'GST',
    name: 'GST intelligence',
    fullName: 'Goods and Services Tax',
    description: 'Run GSTIN analysis, check submission history, and open or export completed GSTR reports.',
    headline: 'Run GST analysis and review GSTR reports.',
    overview: 'Enter or update a GSTIN, provide business and date details, and complete OTP authentication when the workflow requires it. Track processing in GST Analysis History, then open a completed GSTR report or export it.',
    icon: FileChartColumnIncreasing,
    capabilities: [
      { title: 'GSTIN entry', description: 'Enter a 15-character GSTIN; the form checks its length and format before continuing.' },
      { title: 'Business and date details', description: 'Provide the business details and analysis period for the GST submission.' },
      { title: 'Authentication and processing', description: 'Complete OTP verification when required and follow the analysis status.' },
      { title: 'GSTR report and export', description: 'Open GSTR Overview, Top Suppliers & Customers, and Monthly Sales & Purchase Summary; export the report.' },
    ],
    benefits: ['Review submissions by GSTIN, reference ID, period, and status.', 'Open reports for completed submissions.', 'Start a new GST analysis or retry a failed analysis.', 'Export the Overview, Top Suppliers & Customers, and Monthly Summary report.'],
    steps: [
      { title: 'Enter the GSTIN', description: 'Provide the GSTIN to continue to the business and date steps.' },
      { title: 'Provide business and date details', description: 'Complete the submission details and authenticate by OTP when prompted.' },
      { title: 'Track and review', description: 'Follow processing in history, then view or export the completed GSTR report.' },
    ],
  },
  {
    slug: 'itr',
    acronym: 'ITR',
    name: 'Income verification',
    fullName: 'Income Tax Return',
    description: 'View and export Tax Calculation, Balance Sheet, Profit and Loss, and Ratio Analysis reports.',
    headline: 'Four ITR statements, available to review and export.',
    overview: 'The ITR area provides Tax Calculation, Balance Sheet, Profit and Loss Statement, and Ratio Analysis views. Export Full ITR Report downloads all four sections as one consolidated report.',
    icon: FileSearch,
    capabilities: [
      { title: 'Tax Calculation', description: 'View the tax-liability computation, TDS, TCS, and total income-tax breakdown.' },
      { title: 'Balance Sheet', description: 'Review assets, liabilities, and the capital account.' },
      { title: 'Profit and Loss Statement', description: 'Review the trading account, operating revenue, gross profit, and net profit.' },
      { title: 'Ratio Analysis', description: 'View Liquidity Analysis, Asset Management, Leverage Ratios, Coverage Ratios, Profitability Ratios, and Growth in Cashflow Margin.' },
    ],
    benefits: ['Open each of the four ITR report sections.', 'Review tax liability, TDS, TCS, and total income tax.', 'Review balance sheet and profit-and-loss figures.', 'Export all four sections in one consolidated ITR report.'],
    steps: [
      { title: 'Choose a report section', description: 'Open Tax Calculation, Balance Sheet, Profit and Loss Statement, or Ratio Analysis.' },
      { title: 'Review the report', description: 'View the available statement details and financial ratios.' },
      { title: 'Export the full report', description: 'Download the four ITR sections together as a consolidated report.' },
    ],
  },
  {
    slug: 'cibil',
    acronym: 'CIBIL',
    name: 'Credit intelligence',
    fullName: 'Credit Information Bureau India Limited',
    description: 'Submit identity details, verify by OTP, then view or export CIBIL report sections and previous reports.',
    headline: 'Fetch, review, and export CIBIL reports.',
    overview: 'Start a new CIBIL flow by entering identity and contact details, request and verify an OTP, then follow report status and open the report. Existing Reports lists available reports; each report includes Overview, Account Summary, Payments History, and Analysis sections.',
    icon: Fingerprint,
    capabilities: [
      { title: 'Identity details', description: 'Submit name, date of birth, gender, mobile, address, state, PIN code, and a supported identity document.' },
      { title: 'OTP verification', description: 'Request and validate the OTP sent to the submitted mobile number.' },
      { title: 'Report status and history', description: 'Follow the current report status or open a previously fetched CIBIL report.' },
      { title: 'CIBIL report sections', description: 'View Overview, Account Summary, Payments History, and Analysis; export the report.' },
    ],
    benefits: ['Use supported identity types including PAN, Aadhaar, Passport, Driving Licence, Voter ID, NREGA, Ration Card, CIN, and GSTIN.', 'Check existing reports and their pulled dates.', 'Review Overview, Account Summary, Payments History, and Analysis.', 'Export a CIBIL report or start a new CIBIL flow.'],
    steps: [
      { title: 'Enter identity details', description: 'Provide the customer details and select a supported identity type.' },
      { title: 'Verify the OTP', description: 'Request an OTP and submit it to continue the CIBIL flow.' },
      { title: 'View or export the report', description: 'Follow its status, then review the report sections or open an existing report.' },
    ],
  },
];

const pricingComparisons: { label: string; values: Record<string, string> }[] = [
  {
    label: 'Starting point',
    values: {
      bsa: 'Select a bank account',
      gst: 'Enter a GSTIN',
      itr: 'Open an ITR section',
      cibil: 'Enter customer identity details',
    },
  },
  {
    label: 'Reports and sections',
    values: {
      bsa: 'Debit and Credit, Cash Flow, Monthly Overview, EOD Analysis, Loan Transactions',
      gst: 'GSTR Overview, Top Suppliers & Customers, Monthly Sales & Purchase Summary',
      itr: 'Tax Calculation, Balance Sheet, Profit and Loss, Ratio Analysis',
      cibil: 'Overview, Account Summary, Payments History, Analysis',
    },
  },
  {
    label: 'History and status',
    values: {
      bsa: 'Account-based report views',
      gst: 'GST Analysis History and processing status',
      itr: 'Four report sections',
      cibil: 'Report status and Existing Reports',
    },
  },
  {
    label: 'Additional actions',
    values: {
      bsa: 'Date filters and report refresh',
      gst: 'New analysis and GSTR report export',
      itr: 'Consolidated ITR report export',
      cibil: 'Existing reports and CIBIL report export',
    },
  },
];

const workflows: Workflow[] = [
  {
    slug: 'bsa',
    acronym: 'BSA',
    name: 'Bank Statement Analysis',
    purpose: 'Upload a bank statement, provide the account details, and review the generated account-level analysis.',
    steps: [
      { title: 'Open Bank Statement Analysis', description: 'From the dashboard, choose Bank Statement Analysis to open the upload form.', screen: 'Dashboard -> Bank Statement Analysis',image:bsaAccessFromDashboard },
      { title: 'Upload the bank statement', description: 'Select one or more statement files. The platform accepts the uploaded files for processing.', screen: 'Upload Bank Statement', image: bsaUploadScreenshot, imageAlt: 'CRISP Upload Bank Statement page' },
      { title: 'Select the company type', description: 'Choose Individual, Company, Sole Proprietorship, Trust, or Partnership so the statement is analyzed in the right business context.', screen: 'Upload Bank Statement -> Company Type', image: "", imageAlt: 'Open Company Type dropdown on the CRISP BSA upload page' },
      { title: 'Select the account type', description: 'Choose Current, Savings, Over Draft (OD), or Cash Credit (CC) for the account being analyzed.', screen: 'Upload Bank Statement -> Account Type', image: bsaUploadScreenshot, imageAlt: 'Account Type field on the CRISP BSA upload page' },
      { title: 'Complete the account details and submit', description: 'Enter the account number, select the bank, and provide the file password when required. Submit the form to start processing.', screen: 'Upload Bank Statement -> Account Number, Bank, File Password' },
      { title: 'Open the generated reports', description: 'After processing, choose the customer account and open the available reports: Overview, EOD Analysis, Loan Transactions, Summary of Debit and Credit, Cash Flow, or Monthly Overview.', screen: 'BSA Reports -> Bank Accounts -> Available Reports' },
    ],
  },
  {
    slug: 'gst',
    acronym: 'GST',
    name: 'GST Intelligence',
    purpose: 'Submit a GSTIN and business period, complete authentication when required, and review the generated GSTR report.',
    steps: [
      { title: 'Open GST Analysis', description: 'Choose GST Analysis from the dashboard or the GST menu.', screen: 'Dashboard -> GST Analysis' },
      { title: 'Enter the GSTIN', description: 'Enter the 15-character GSTIN. The platform validates the value before moving forward.', screen: 'GST Analysis -> GSTIN' },
      { title: 'Provide business and date details', description: 'Complete the business information and select the period for the GST analysis.', screen: 'GST Analysis -> Business & Date' },
      { title: 'Complete OTP authentication when prompted', description: 'Some submissions require an OTP. Enter the OTP to authorize the GST data request.', screen: 'GST Analysis -> Authentication' },
      { title: 'Track processing in history', description: 'Follow the reference ID, period, and processing status in GST Analysis History.', screen: 'GST -> GST Analysis History' },
      { title: 'Review or export the GSTR report', description: 'Open completed reports across GSTR Overview, Top Suppliers & Customers, and Monthly Summary, then export the report.', screen: 'GST Reports -> GSTR Overview / Top Suppliers & Customers / Monthly Summary' },
    ],
  },
  {
    slug: 'itr',
    acronym: 'ITR',
    name: 'Income Tax Return',
    purpose: 'Connect the income-tax return data and review the four financial statement sections provided by the platform.',
    steps: [
      { title: 'Open ITR', description: 'Choose ITR from the dashboard to start the income-tax return workflow.', screen: 'Dashboard -> ITR' },
      { title: 'Enter the email address', description: 'Provide the email address used for the ITR connection. The platform sends a verification link.', screen: 'Income Tax Return -> Email Address' },
      { title: 'Complete the secure ITR link step', description: 'Open the verification link and submit the requested ITR credentials on the secure provider page.', screen: 'Income Tax Return -> Awaiting Credential Submission' },
      { title: 'Wait for processing to complete', description: 'The platform checks the link status and shows whether the request is processing, successful, timed out, or needs attention.', screen: 'Income Tax Return -> Processing / Success' },
      { title: 'Review the four report sections', description: 'Open Tax Calculation, Balance Sheet, Profit and Loss Statement, or Ratio Analysis from the ITR menu.', screen: 'ITR -> Tax Calculation / Balance Sheet / Profit and Loss / Ratio Analysis' },
      { title: 'Export the full ITR report', description: 'Use the ITR export action to download the four sections together as one report.', screen: 'ITR -> Export' },
    ],
  },
  {
    slug: 'cibil',
    acronym: 'CIBIL',
    name: 'CIBIL Credit Report',
    purpose: 'Submit identity details, verify the customer by OTP, and review the available credit report sections.',
    steps: [
      { title: 'Open CIBIL Score', description: 'Choose CIBIL Score and start a new report request, or open the existing reports list.', screen: 'Dashboard -> CIBIL Score' },
      { title: 'Enter identity details', description: 'Provide the customer name, date of birth, gender, mobile number, address, state, PIN code, and supported identity document.', screen: 'CIBIL Score -> Identity' },
      { title: 'Verify the OTP', description: 'Request the OTP sent to the submitted mobile number and enter it to continue.', screen: 'CIBIL Score -> OTP' },
      { title: 'Follow report status', description: 'Wait for the report request to complete, then choose View Report when it is ready.', screen: 'CIBIL Score -> Status' },
      { title: 'Review or export the report', description: 'Read Overview, Account Summary, Payments History, and Analysis, or open a previous report from Existing Reports.', screen: 'CIBIL Reports -> Overview / Account Summary / Payments History / Analysis' },
    ],
  },
  {
    slug: 'kyc',
    acronym: 'KYC',
    name: 'Identity Verification',
    purpose: 'Verify Aadhaar details and use DigiLocker consent to retrieve the customer documents available to the platform.',
    steps: [
      { title: 'Open KYC', description: 'Choose KYC from the dashboard to begin identity verification.', screen: 'Dashboard -> KYC' },
      { title: 'Enter Aadhaar details', description: 'For a new verification, enter the 12-digit Aadhaar number and request an OTP.', screen: 'KYC -> Aadhaar Number' },
      { title: 'Verify the Aadhaar OTP', description: 'Enter the six-digit OTP sent to the registered mobile number.', screen: 'KYC -> OTP Verification' },
      { title: 'Give DigiLocker consent', description: 'Open the DigiLocker session link and approve consent. The platform checks the session until it completes.', screen: 'KYC -> DigiLocker Consent' },
      { title: 'View available documents', description: 'Once consent is approved, review the documents returned by DigiLocker, such as Aadhaar Card or PAN Card.', screen: 'KYC -> Documents' },
    ],
  },
  {
    slug: 'money',
    acronym: 'MONEY',
    name: 'Money Workflows',
    purpose: 'For anchor users, review account opportunities, select the relevant accounts, or submit a loan request.',
    steps: [
      { title: 'Open the customer service report', description: 'Select a customer and choose the relevant money workflow from the customer report view.', screen: 'Anchor Dashboard -> Customer -> Service Report' },
      { title: 'Save Money: review and select accounts', description: 'Review lender, account number, opened date, and current balance, then select the accounts to save and submit the changes.', screen: 'Save Money Report' },
      { title: 'Rectify Money: review overdue accounts', description: 'Review overdue amount and average DPD, select the accounts to rectify, and submit the changes.', screen: 'Rectify Money Report' },
      { title: 'Access Money: enter a loan request', description: 'Choose a loan type, enter the requested amount, and submit the request for the customer.', screen: 'Access Money -> Loan Type, Amount -> Submit Request' },
    ],
  },
];

function Brand() {
  return (
    <Link className="brand" to="/" aria-label="CRISP home">
      {/* <span className="brand-mark"><Activity size={19} strokeWidth={2.5} /></span> */}
      <span>CRISP</span>
    </Link>
  );
}

function ActionLink({ to, children, secondary = false }: { to: string; children: ReactNode; secondary?: boolean }) {
  return (
    <Link className={secondary ? 'button button-secondary' : 'button button-primary'} to={to}>
      {children}<ArrowUpRight size={16} strokeWidth={2} />
    </Link>
  );
}

function Navbar() {
  const [productsOpen, setProductsOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setProductsOpen(false);
    setMobileOpen(false);
    setMobileProductsOpen(false);
  }, [location.pathname]);

  return (
    <header className="site-header">
      <div className="nav-shell">
        <Brand />

        <nav className="desktop-nav" aria-label="Main navigation">
          <div className="nav-products-wrap" onClick={() =>{ !productsOpen ? setProductsOpen(true) : setProductsOpen(false)}} >
            <button className={`nav-link ${productsOpen ? 'nav-link-active' : ''}`} aria-expanded={productsOpen} onClick={() => setProductsOpen(true)}>
              Services <ChevronDown size={14} />
            </button>
            {productsOpen && (
              <div className="mega-menu">
                <div className="mega-intro">
                  <span className="eyebrow">THE CRISP PLATFORM</span>
                  <strong>More signal.<br />Less guesswork.</strong>
                  <p>Financial intelligence for thoughtful underwriting.</p>
                </div>
                <div className="mega-products">
                  {products.map((product) => {
                    const Icon = product.icon;
                    return (
                      <Link className="mega-item" to={`/products/${product.slug}`} key={product.slug}>
                        <span className="mega-icon"><Icon size={18} /></span>
                        <span><strong>{product.acronym} <span>{product.fullName}</span></strong><small>{product.description}</small></span>
                        <ArrowUpRight className="mega-arrow" size={15} />
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
          <Link className="nav-link" to="/pricing">Pricing</Link>
          <a className="nav-link" href="#company">Company</a>
        </nav>
        <div className="nav-actions">
          <Link className="login-link" to="/login">Log in</Link>
          <Link className="nav-cta" to="/signup">Sign up <ArrowUpRight size={15} /></Link>
        </div>
        <button className="mobile-menu-toggle" aria-label={mobileOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={mobileOpen} onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X size={21} /> : <Menu size={21} />}
        </button>
      </div>
      {mobileOpen && (
        <div className="mobile-nav">
          <button className="mobile-nav-row" aria-expanded={mobileProductsOpen} onClick={() => setMobileProductsOpen(!mobileProductsOpen)}>Products <ChevronDown size={16} /></button>
          {mobileProductsOpen && <div className="mobile-product-list">{products.map((product) => <Link to={`/products/${product.slug}`} key={product.slug}><strong>{product.acronym}</strong><span>{product.fullName}</span><ChevronRight size={15} /></Link>)}</div>}
          <Link className="mobile-nav-row" to="/pricing">Pricing <ArrowUpRight size={15} /></Link>
          <a className="mobile-nav-row" href="#company" onClick={() => setMobileOpen(false)}>Company <ArrowUpRight size={15} /></a>
          <div className="mobile-actions"><Link className="button button-secondary" to="/login">Log in <ArrowUpRight size={16} /></Link><ActionLink to="/signup">Create account</ActionLink></div>
        </div>
      )}
    </header>
  );
}

function Footer() {
  const groups = [
    { title: 'Services', links: products.map((product) => ({ label: product.acronym, to: `/products/${product.slug}` })) },
    { title: 'Company', links: [{ label: 'About', to: '#company' }, { label: 'Contact', to: 'mailto:hello@crisp.example' }] },
    { title: 'Resources', links: [{ label: 'Documentation', to: '#resources' }, { label: 'Insights', to: '#resources' }, { label: 'FAQs', to: '#resources' }] },
    { title: 'Legal', links: [{ label: 'Privacy policy', to: '#privacy' }, { label: 'Terms & conditions', to: '#terms' }] },
  ];
  return (
    <footer className="site-footer" id="company">
      <div className="footer-top"><div className="footer-brand-block"><Brand /><p>Financial clarity for better-informed decisions.</p><a href="mailto:hello@crisp.example">hello@crisp.example <ArrowUpRight size={14} /></a></div>
        {groups.map((group) => <div className="footer-group" key={group.title}><h3>{group.title}</h3>{group.links.map((item) => item.to.startsWith('/') ? <Link to={item.to} key={item.label}>{item.label}</Link> : <a href={item.to} key={item.label}>{item.label}</a>)}</div>)}
      </div>
      <div className="footer-bottom"><span>© {new Date().getFullYear()} CRISP Financial Technologies</span><span>Developed by CRISP tech team</span></div>
    </footer>
  );
}

function MarketingLayout({ children }: { children: ReactNode }) {
  const location = useLocation();
  useEffect(() => {
    const nodes = document.querySelectorAll<HTMLElement>('.reveal:not(.is-visible)');
    if (!('IntersectionObserver' in window)) {
      nodes.forEach((node) => node.classList.add('is-visible'));
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [location.pathname]);
  return <div className="marketing-site"><Navbar />{children}<Footer /></div>;
}

function HeroVisual() {
  return (
    <div className="hero-visual" aria-label="Financial insights dashboard preview">
      <div className="visual-orbit orbit-one" /><div className="visual-orbit orbit-two" />
      <div className="dashboard-window">
        <div className="dash-topbar"><span className="dash-brand"><span className="dash-brand-mark"><Activity size={13} /></span> CRISP INTELLIGENCE</span><span className="dash-date">Portfolio overview <ChevronDown size={12} /></span><span className="dash-avatar">AM</span></div>
        <div className="dash-content">
          <div className="dash-heading"><div><small>FINANCIAL SNAPSHOT</small><strong>Assessment overview</strong></div><span className="dash-period">Last 6 months</span></div>
          <div className="metric-grid">
            <div className="metric-card"><span>Monthly inflow</span><strong>₹ 8.42L</strong><small className="metric-positive">↗ 12.8% <i>vs. prior period</i></small></div>
            <div className="metric-card"><span>Cash flow health</span><strong className="health-score">82 <em>/ 100</em></strong><small><span className="health-dot" /> Healthy profile</small></div>
          </div>
          <div className="chart-card"><div className="chart-head"><span>Cash flow trend</span><span><i className="legend-inflow" /> Inflow <i className="legend-outflow" /> Outflow</span></div>
            <div className="chart-area"><div className="chart-labels"><span>₹10L</span><span>₹7.5L</span><span>₹5L</span><span>₹2.5L</span></div><svg viewBox="0 0 470 125" preserveAspectRatio="none" role="img" aria-label="Cash flow trend rising steadily over six months"><defs><linearGradient id="chartFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#4b86c8" stopOpacity=".19" /><stop offset="1" stopColor="#4b86c8" stopOpacity="0" /></linearGradient></defs><path d="M0,97 C30,91 35,77 68,81 S113,57 145,69 S193,79 220,51 S270,64 296,43 S340,57 368,29 S420,36 470,13 L470,125 L0,125Z" fill="url(#chartFill)" /><path d="M0,97 C30,91 35,77 68,81 S113,57 145,69 S193,79 220,51 S270,64 296,43 S340,57 368,29 S420,36 470,13" fill="none" stroke="#052967" strokeWidth="2.5" vectorEffect="non-scaling-stroke" /><path d="M0,111 C30,108 40,93 68,101 S111,84 145,94 S194,90 220,79 S266,89 296,74 S344,82 368,62 S423,70 470,54" fill="none" stroke="#b5c7c3" strokeWidth="1.8" strokeDasharray="4 5" vectorEffect="non-scaling-stroke" /></svg></div>
            <div className="chart-months"><span>Oct</span><span>Nov</span><span>Dec</span><span>Jan</span><span>Feb</span><span>Mar</span></div>
          </div>
          <div className="dash-footer"><span><span className="secure-icon"><ShieldCheck size={14} /></span> Data encrypted and secure</span><span>Updated just now <span className="live-dot" /></span></div>
        </div>
      </div>
      <div className="floating-insight"><span className="floating-icon"><Sparkles size={15} /></span><span><small>INSIGHT DETECTED</small><strong>Income trend is stable</strong></span><span className="insight-check"><Check size={14} /></span></div>
      <div className="floating-score"><span className="score-ring"><ShieldCheck size={19} /></span><span><small>PROFILE SIGNAL</small><strong>Strong</strong></span></div>
      <span className="visual-caption"><span /> SIGNALS, MADE CLEAR</span>
    </div>
  );
}

function LogoMarquee() {
  return (
    <section className="logo-section" aria-label="Supply chain finance clients">
      <div className="logo-marquee"><div className="logo-track">{[0, 1].map((copy) => <div className="logo-group" key={copy} aria-hidden={copy === 1}>{clientLogos.map((client) => <span className="client-wordmark" key={`${copy}-${client.name}`}><img src={client.image} alt={copy === 1 ? '' : `${client.name} logo`} decoding="async" /></span>)}</div>)}</div></div>
    </section>
  );
}

function ProductCard({ product }: { product: Product }) {
  const Icon = product.icon;
  return <Link className="product-card reveal" to={`/products/${product.slug}`}><span className={`product-icon product-icon-${product.slug}`}><Icon size={21} strokeWidth={1.8} /></span><span className="card-kicker">{product.acronym}</span><h3>{product.name}</h3><p className="product-full-name">{product.fullName}</p><p className="product-description">{product.description}</p><span className="card-link">Explore {product.acronym}<ArrowRight size={15} /></span><span className="card-corner"><ArrowUpRight size={16} /></span></Link>;
}

function GstScreenPreview({ stepIndex }: { stepIndex: number }) {
  const progressLabels = ['GSTIN', 'Business & Date', 'Authentication', 'Analysis'];
  const renderContent = () => {
    if (stepIndex === 0) {
      return <><label>GSTIN</label><div className="gst-preview-input">Enter 15-character GSTIN</div><button>Continue <ArrowRight size={11} /></button></>;
    }
    if (stepIndex === 1) {
      return <><div className="gst-preview-fields"><span><label>GSTIN</label><b>29ABCDE1234F1Z5</b></span><span><label>Business Name</label><b>Demo Industries</b></span></div><div className="gst-preview-fields"><span><label>From Month</label><b>Jan 2026</b></span><span><label>To Month</label><b>Aug 2026</b></span></div><button>Submit details <ArrowRight size={11} /></button></>;
    }
    if (stepIndex === 2) {
      return <><div className="gst-preview-status"><span className="health-dot" /><strong>Authentication required</strong></div><label>OTP</label><div className="gst-preview-input gst-preview-otp">_ _ _ _ _ _</div><button>Verify OTP <ArrowRight size={11} /></button></>;
    }
    if (stepIndex === 3) {
      return <><div className="gst-preview-status gst-preview-processing"><span className="gst-preview-spinner" /><strong>Analysis in progress</strong></div><div className="gst-preview-progress"><span /></div><small>Checking GST data and preparing your report</small></>;
    }
    if (stepIndex === 4) {
      return <><div className="gst-preview-history-head"><strong>GST Analysis History</strong><button>New Analysis</button></div><div className="gst-preview-table"><span>GSTIN</span><span>Period</span><span>Status</span><b>29ABCDE1234F1Z5</b><b>Jan - Aug 2026</b><em>COMPLETED</em><b>27PQRSX5678K2Z6</b><b>Jan - Dec 2025</b><em>PROCESSING</em></div></>;
    }
    return <><div className="gst-preview-report-head"><strong>GSTR Report</strong><button><ArrowUpRight size={10} /> Export Report</button></div><div className="gst-preview-tabs"><b>GSTR Overview</b><span>Top Suppliers & Customers</span><span>Monthly Summary</span></div><div className="gst-preview-report-lines"><span /><span /><span /><span /><span /></div></>;
  };

  return <div className="gst-screen-preview"><div className="gst-preview-top"><span><FileChartColumnIncreasing size={14} /> GST Analysis</span><small>CRISP</small></div><div className="gst-preview-progress-steps">{progressLabels.map((label, index) => <span className={index <= stepIndex ? 'active' : ''} key={label}><i>{index < stepIndex ? '✓' : index + 1}</i>{label}</span>)}</div><div className="gst-preview-content">{renderContent()}</div></div>;
}

function CibilScreenPreview({ stepIndex }: { stepIndex: number }) {
  const progressLabels = ['Identity', 'OTP', 'Status', 'Report'];
  const [activeReportTab, setActiveReportTab] = useState<'overview' | 'account' | 'payments' | 'analysis'>('overview');
  const reportTabs = [{ key: 'overview', label: 'Overview' }, { key: 'account', label: 'Account Summary' }, { key: 'payments', label: 'Payments History' }, { key: 'analysis', label: 'Analysis' }] as const;
  const paymentYears = [
    { year: '2026', cells: ['000/XXX', '000/XXX', '000/XXX', '000/XXX', '000/XXX', '000/XXX', '-', '-', '-', '-', '-', '-'] },
    { year: '2025', cells: ['000/XXX', '000/XXX', '000/XXX', '000/XXX', '000/XXX', '000/XXX', '000/XXX', '000/XXX', '000/XXX', '000/XXX', '000/XXX', '000/XXX'] },
    { year: '2024', cells: ['000/XXX', '000/XXX', '000/XXX', '000/XXX', '000/XXX', '000/XXX', '000/XXX', '000/XXX', '000/XXX', '000/XXX', '000/XXX', '000/XXX'] },
    { year: '2023', cells: ['000/XXX', '000/XXX', 'XXX/XXX', 'XXX/XXX', '000/XXX', '000/XXX', '000/XXX', '000/XXX', '000/XXX', '000/XXX', '000/XXX', '000/XXX'] },
    { year: '2022', cells: ['-', '-', '-', '-', '-', '-', '000/XXX', '000/XXX', '000/XXX', '000/XXX', '000/XXX', '000/XXX'] },
  ];
  const analysisRows = ['Agriculture Loan', 'Auto Loan', 'Business Loan', 'Consumer Loan', 'Credit Card', 'Education Loan', 'Gold Loan', 'Housing Loan', 'Loan against Securities', 'Other', 'Overdraft & Cash Credit', 'Personal Loan', 'Property Loan', 'total'];
  const renderActiveReportPanel = () => {
    if (activeReportTab === 'overview') return null;
    if (activeReportTab === 'account') return <div className="cibil-tab-panel"><div className="cibil-tab-switch"><b>Active Accounts</b><span>Closed Accounts</span></div><div className="cibil-tab-summary"><span><small>TOTAL CREDIT LIMIT</small><strong>₹8,050</strong></span><span><small>CURRENT BALANCE</small><strong>₹7,839</strong></span><span><small>OVERDUE BALANCE</small><strong className="cibil-negative">₹12</strong></span></div><small className="cibil-tab-kicker">OTHER (1)</small><div className="cibil-account-row"><span className="cibil-account-icon"><Landmark size={14} /></span><span><strong>Slice Small Finance Bank Limited</strong><small>Acct: XXXX6135 · Opened: 30-11-2021</small></span><b>₹7,839 <em>₹12 overdue</em></b><ChevronDown size={13} /></div></div>;
    if (activeReportTab === 'payments') return <div className="cibil-tab-panel cibil-payments-panel"><div className="cibil-timeline-switch"><b>Active Timeline</b><span>Closed Timeline</span></div><div className="cibil-payment-account"><div><span className="cibil-account-icon"><Landmark size={14} /></span><strong>Personal Loan<small>Acct No: XXX X6135</small></strong></div><span>Limit: <b>₹8,050</b> <i /> Reported Date: <b>15-06-2026</b></span></div><div className="cibil-payment-grid"><div className="cibil-payment-months"><span>YEAR</span>{['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEPT', 'OCT', 'NOV', 'DEC'].map((month) => <span key={month}>{month}</span>)}</div>{paymentYears.map((row) => <div className="cibil-payment-year" key={row.year}><strong>▦ {row.year}</strong>{row.cells.map((cell, index) => <span className={cell === '-' ? 'empty' : cell.includes('XXX') && row.year === '2023' && (index === 2 || index === 3) ? 'muted' : ''} key={`${row.year}-${index}`}>{cell}</span>)}</div>)}</div><div className="cibil-payment-legend"><strong>CIBIL LEGEND & ABBREVIATIONS</strong><span><i className="legend-on-time" />000 <small>Payments are being timely made with zero days past due.</small></span><span><i className="legend-not-reported" />XXX <small>Payment information has not been reported to CIBIL.</small></span><span><i className="legend-standard" />STD <small>Payments are being made within 90 days of due date.</small></span></div></div>;
    return <div className="cibil-tab-panel cibil-analysis-panel"><div className="cibil-analysis-title"><ChartNoAxesCombined size={14} /><strong>CREDIT FACILITY &amp; DELAYS ANALYSIS</strong></div><div className="cibil-analysis-table"><div className="cibil-analysis-head"><span>LOAN TYPE</span><span>TOTAL FACILITIES</span><span>FACILITIES IN LAST 12M</span><span>DELAYED PAYMENT PERCENTAGE<br /><small>OVERALL TRACK &nbsp;&nbsp;&nbsp; LAST 12M</small></span><span>DEFAULT CHANGE LAST 12M</span></div>{analysisRows.map((row) => <div className={`cibil-analysis-row ${row === 'Personal Loan' ? 'highlight' : ''}`} key={row}><strong>{row}</strong><span>{row === 'Personal Loan' ? '1' : '-'}</span><span>-</span><span>{row === 'Personal Loan' ? '' : '-'}</span><span>-</span></div>)}</div></div>;
  };
  const renderContent = () => {
    if (stepIndex === 0) {
      return <><div className="cibil-preview-report-link">View Previous Reports</div><div className="cibil-preview-identity-heading"><strong>Identity Details</strong><span>Enter the customer details required to initiate the CIBIL consent OTP.</span></div><div className="cibil-preview-fields cibil-preview-three"><span><label>First Name</label><b>Rahul</b></span><span><label>Middle Name</label><b>Optional</b></span><span><label>Last Name</label><b>Sharma</b></span></div><div className="cibil-preview-fields cibil-preview-three"><span><label>Date of Birth</label><b>mm/dd/yyyy</b></span><span><label>Gender</label><b>Male</b></span><span><label>Mobile Number</label><b>9876543210</b></span></div><div className="cibil-preview-fields cibil-preview-one"><span><label>Address</label><b>123 Example Street</b></span></div><div className="cibil-preview-fields cibil-preview-one"><span><label>State</label><b>-- Select State --</b></span></div><div className="cibil-preview-fields cibil-preview-one"><span><label>Pincode</label><b>400001</b></span></div><div className="cibil-preview-divider" /><div className="cibil-preview-fields cibil-preview-id"><span><label>ID Type</label><b>--SELECT ID TYPE--</b></span><span><label>ID Number</label><b>ABCDE1234F</b></span></div><button className="cibil-preview-continue">Continue to OTP</button></>;
    }
    if (stepIndex === 1) {
      return <><div className="cibil-preview-status"><span className="health-dot" /><strong>OTP sent to the registered mobile number</strong></div><label>Enter OTP</label><div className="cibil-preview-otp">_ _ _ _ _ _</div><button>Verify OTP <ArrowRight size={11} /></button></>;
    }
    if (stepIndex === 2) {
      return <><div className="cibil-preview-status cibil-preview-processing"><span className="gst-preview-spinner" /><strong>Fetching CIBIL report</strong></div><div className="cibil-preview-progress"><span /></div><small>Checking report status. This may take a moment.</small><button className="cibil-preview-secondary">View Previous Reports <ArrowUpRight size={10} /></button></>;
    }
    return <><div className="cibil-preview-report-header"><div><small>CIBIL REPORT</small><strong>Report Sections</strong><span>Reference ID: <b>9fe98b63-ba1a-4ce1-9a4e-58cf0a3921f6</b></span></div><div className="cibil-preview-report-actions"><button><ArrowUpRight size={10} /> Export</button><button>Back</button><button className="cibil-preview-new">Start New CIBIL Flow</button></div></div><div className="cibil-preview-tabs">{reportTabs.map((tab) => <button type="button" className={activeReportTab === tab.key ? 'active' : ''} onClick={() => setActiveReportTab(tab.key)} key={tab.key}>{tab.label}</button>)}</div>{renderActiveReportPanel()}{activeReportTab === 'overview' && <><div className="cibil-report-overview"><div className="cibil-score-card"><small>BUREAU SCORE</small><strong>729</strong><em>EQUIFAX SCORE</em><b>GOOD</b><span>Healthy credit history. Very good loan approvals.</span></div><div className="cibil-profile-card"><strong>PERSONAL & IDENTIFICATION PROFILE</strong><div className="cibil-profile-grid"><span><small>FULL NAME</small><b>Mr. Crisp</b></span><span><small>DATE OF BIRTH (AGE)</small><b>13-05-2000 (26 Yrs) | Male</b></span><span><small>PAN NUMBER</small><b>AABBB1234D</b></span><span><small>EMAIL ADDRESS</small><b>crisp@gmail.com</b></span><span><small>OCCUPATION</small><b>Business Owner</b></span><span><small>ANNUAL INCOME</small><b>₹0</b></span></div></div></div><div className="cibil-metric-grid"><div><small>TOTAL ACCOUNTS</small><strong>1</strong><span>Accounts</span></div><div><small>ACTIVE ACCOUNTS</small><strong>1</strong><span className="cibil-positive">Active</span></div><div><small>OVERDUE ACCOUNTS</small><strong>0</strong><span className="cibil-negative">OVERDUE</span></div><div><small>TOTAL OVERDUE AMOUNT</small><strong>₹0</strong></div></div><div className="cibil-bottom-metrics"><div className="cibil-debt-card"><small>OUTSTANDING DEBT</small><strong>₹7,839</strong><span>TOTAL OUTSTANDING BALANCE</span></div><div><small>CREDIT LIMIT</small><strong>₹8,050</strong><span>MAXIMUM AMOUNT SANCTIONED</span></div><div className="cibil-date-card"><span><small>OLDEST OPEN DATE</small><b>30-11-2021</b></span><span><small>RECENT OPEN DATE</small><b>30-11-2021</b></span><em>Accounts as Guarantor <b>0</b></em></div></div></>}</>;
  };

  return <div className="cibil-screen-preview"><div className="cibil-preview-top"><span><Fingerprint size={14} /> CIBIL Score</span><small>CRISP</small></div><div className="cibil-preview-progress-steps">{progressLabels.map((label, index) => <span className={index <= stepIndex ? 'active' : ''} key={label}><i>{index < stepIndex ? '✓' : index + 1}</i>{label}</span>)}</div><div className={`cibil-preview-content ${stepIndex === 0 ? 'cibil-preview-identity' : ''}`}>{renderContent()}</div></div>;
}

function WorkflowGallery({ workflowsToShow = workflows }: { workflowsToShow?: Workflow[] }) {
  return (
    <section className="workflow-section section-pad" id="how-it-works">
      <div className="workflow-heading reveal">
        <div>
          <span className="eyebrow">HOW EACH SERVICE WORKS</span>
          <h2>See the steps<br /><span>inside the platform.</span></h2>
        </div>
        <p>Follow the actual user journey for every service, from the first form to the finished report or request.</p>
      </div>
      <div className="workflow-list">
        {workflowsToShow.map((workflow) => (
          <article className={`workflow-block workflow-block-${workflow.slug} reveal`} key={workflow.slug}>
            <div className="workflow-intro">
              <span className="workflow-acronym">{workflow.acronym}</span>
              <h3>{workflow.name}</h3>
              <p>{workflow.purpose}</p>
              <Link className="workflow-link" to={workflow.slug === 'money' || workflow.slug === 'kyc' ? '/login' : `/products/${workflow.slug}`}>
                {workflow.slug === 'money' || workflow.slug === 'kyc' ? 'Log in to use this service' : `Explore ${workflow.acronym}`} <ArrowUpRight size={15} />
              </Link>
            </div>
            <div className="workflow-steps">
              {workflow.steps.map((step, index) => (
                <div className="workflow-step" key={step.title}>
                  <div className="workflow-step-marker"><span>0{index + 1}</span></div>
                  <div className="workflow-step-copy">
                    <span className="workflow-step-screen">{step.screen}</span>
                    <h4>{step.title}</h4>
                    <p>{step.description}</p>
                    {step.image && (
                      <figure className="workflow-screenshot">
                        <img src={step.image} alt={step.imageAlt || `${workflow.name} platform screen`} />
                        <figcaption>Exact platform screenshot</figcaption>
                      </figure>
                    )}
                    {workflow.slug === 'gst' && <GstScreenPreview stepIndex={index} />}
                    {workflow.slug === 'cibil' && <CibilScreenPreview stepIndex={index} />}
                  </div>
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>
      <p className="workflow-note">The BSA upload screenshot shown above is the exact image currently stored in this project. Other platform screens are identified by their live page or component name because no corresponding screenshot asset is stored in the repository.</p>
    </section>
  );
}

const bsaPreviewRows = [
  ['Cash Deposit', '₹10,000.00', '₹0.00', '₹10,000.00', '₹0.00', '₹0.00', '₹0.00', '₹0.00', '₹0.00', '₹0.00'],
  ['Cheque Receipts', '₹0.00', '₹0.00', '₹0.00', '₹0.00', '₹0.00', '₹0.00', '₹0.00', '₹0.00', '₹0.00'],
  ['Online Receipts', '₹5,62,360.34', '₹14,713.00', '₹23,496.97', '₹91,281.00', '₹23,767.00', '₹50,052.00', '₹2,79,637.37', '₹70,333.00', '₹9,080.00'],
  ['Bank Instrument', '₹0.00', '-', '-', '-', '-', '-', '-', '-', '-'],
  ['Forex Remittance', '₹0.00', '-', '-', '-', '-', '-', '-', '-', '-'],
  ['Refund/Reversal', '₹0.00', '₹0.00', '₹0.00', '₹0.00', '₹0.00', '₹0.00', '₹0.00', '₹0.00', '₹0.00'],
  ['Other Receipts', '₹800.00', '₹0.00', '₹0.00', '₹500.00', '₹0.00', '₹300.00', '₹0.00', '₹0.00', '₹0.00'],
  ['Salary Income', '₹0.00', '₹0.00', '₹0.00', '₹0.00', '₹0.00', '₹0.00', '₹0.00', '₹0.00', '₹0.00'],
  ['Rent Income', '₹0.00', '₹0.00', '₹0.00', '₹0.00', '₹0.00', '₹0.00', '₹0.00', '₹0.00', '₹0.00'],
  ['Interest Income', '₹29.00', '₹0.00', '₹0.00', '₹10.00', '₹0.00', '₹0.00', '₹19.00', '₹0.00', '₹0.00'],
  ['Loan Received', '₹0.00', '₹0.00', '₹0.00', '₹0.00', '₹0.00', '₹0.00', '₹0.00', '₹0.00', '₹0.00'],
  ['Insurance', '₹0.00', '₹0.00', '₹0.00', '₹0.00', '₹0.00', '₹0.00', '₹0.00', '₹0.00', '₹0.00'],
  ['Investment Receipt', '₹0.00', '₹0.00', '₹0.00', '₹0.00', '₹0.00', '₹0.00', '₹0.00', '₹0.00', '₹0.00'],
  ['Total Receipts', '₹5,73,189.34', '-', '-', '-', '-', '-', '-', '-', '-'],
];

function BsaReportPreview() {
  const months = ['Jan 2026', 'Feb 2026', 'Mar 2026', 'Apr 2026', 'May 2026', 'Jun 2026', 'Jul 2026', 'Aug 2026'];
  return (
    <div className="bsa-report-preview" aria-label="BSA Overview report preview">
      <div className="bsa-report-toolbar">
        <div><strong>Overview Details</strong><span>From January 1st, 2026 To August 4th, 2026</span></div>
        <button type="button" aria-label="Refresh report"><Activity size={12} /> Refresh</button>
      </div>
      <div className="bsa-report-scroll">
        <table>
          <thead><tr><th>Particulars</th><th>Overall/Total</th>{months.map((month) => <th key={month}>{month}</th>)}</tr></thead>
          <tbody>{bsaPreviewRows.map((row, index) => <tr className={index === 7 || index === 10 || index === 13 ? 'bsa-report-divider' : ''} key={row[0]}>{row.map((cell, cellIndex) => cellIndex === 0 ? <th scope="row" key={`${row[0]}-${cellIndex}`}>{cell}</th> : <td className={cellIndex === 1 || row[0] === 'Total Receipts' ? 'bsa-report-total' : ''} key={`${row[0]}-${cellIndex}`}>{cell}</td>)}</tr>)}</tbody>
        </table>
      </div>
    </div>
  );
}

const bsaReportLayers = [
  { title: 'EOD Analysis', className: 'bsa-layer-eod', values: ['Opening Balance', 'Max EOD', 'Average EOD', 'Closing Balance'] },
  { title: 'Cash Flow Statement', className: 'bsa-layer-cashflow', values: ['Total Inflow (%)', 'Inflows/Revenue', 'OutFlows/Expenses', 'Gross Inflow/Profit'] },
  { title: 'Summary of Debit and Credit', className: 'bsa-layer-summary', values: ['Total Credits', 'Total Debits', 'Net Movement', 'Monthly Summary'] },
  { title: 'Loan Transactions', className: 'bsa-layer-loans', values: ['Lender Name', 'Loan Amount', 'EMI Payments', 'Outstanding'] },
  { title: 'Monthly Overview', className: 'bsa-layer-monthly', values: ['Monthly Inflow', 'Monthly Outflow', 'Balance Trend', 'Account Health'] },
];

function BsaReportMontage() {
  return (
    <div className="bsa-report-montage" aria-label="BSA reports montage">
      <div className="bsa-montage-backdrop" aria-hidden="true"><span /><span /><span /></div>
      {bsaReportLayers.map((layer) => (
        <div className={`bsa-montage-layer ${layer.className}`} key={layer.title}>
          <div className="bsa-layer-title"><span>{layer.title}</span><small>Refresh</small></div>
          <div className="bsa-layer-head"><span>Particulars</span><span>Overall/Total</span><span>Aug 2026</span></div>
          {layer.values.map((value, index) => <div className="bsa-layer-row" key={value}><span>{value}</span><strong>{index % 2 === 0 ? '₹2,260.78' : '₹0.00'}</strong><span>{index % 2 === 0 ? '₹5,73,189.34' : '-'}</span></div>)}
        </div>
      ))}
      <div className="bsa-montage-main"><BsaReportPreview /></div>
      
      <button type="button" className="bsa-montage-label" aria-label="Show all six BSA report views"><span className="health-dot" /> SIX REPORT VIEWS <ArrowUpRight size={12} /></button>
      <div className="bsa-montage-popover" aria-hidden="true">
        <span className="bsa-popover-kicker">AVAILABLE REPORTS</span>
        {bsaReportLayers.map((layer, index) => <span className="bsa-popover-item" style={{ '--item-delay': `${index * 55}ms` } as CSSProperties} key={layer.title}><i className={`legend-dot legend-dot-${layer.className.replace('bsa-layer-', '')}`} />{layer.title}<ArrowUpRight size={10} /></span>)}
      </div>
    </div>
  );
}

export function HomePage() {
  return (
    <MarketingLayout>
      <main>
        <section className="hero-section"><div className="hero-inner"><div className="hero-copy"><span className="hero-kicker"><span className="kicker-dot" /> FINANCIAL INTELLIGENCE, IN FOCUS</span><h1>See the full picture.<br /><span>Decide with clarity.</span></h1><p>One intelligent platform for financial analysis and underwriting. Bring better signals together, and move forward with confidence.</p><div className="hero-actions"><ActionLink to="/signup">Get started</ActionLink><a className="text-link" href="#platform">Discover the platform <ArrowRight size={16} /></a></div><div className="hero-proof"><div className="proof-avatars"><span>R</span><span>F</span><span>A</span><span>+</span></div><p><strong>Built for the people behind every decision.</strong><br />Clearer insights. More considered reviews.</p></div></div><HeroVisual /></div>
          <div className="hero-footnote"><span>01 / FINANCIAL CLARITY</span><span>ANALYSE <i /> UNDERWRITE <i /> ADVANCE</span></div>
        </section>
        <LogoMarquee />
        <section className="products-section section-pad" id="platform"><div className="section-heading reveal"><div><span className="eyebrow">ONE PLATFORM, FOUR LENSES</span><h2>Financial data,<br /><span>made decision-ready.</span></h2></div><p>Bring the right signals into one clear view. A connected toolkit for the information that shapes an underwriting decision.</p></div><div className="product-grid">{products.map((product) => <ProductCard product={product} key={product.slug} />)}</div></section>
        <WorkflowGallery />
        <section className="insight-section"><div className="insight-inner"><div className="insight-copy reveal"><span className="eyebrow eyebrow-light">A BETTER WAY TO REVIEW</span><h2>From scattered inputs<br />to a <span>clearer decision.</span></h2><p>Financial information deserves more than a quick glance. CRISP helps teams find the useful signals, see them in context, and focus on what matters.</p><ActionLink to="/products/bsa" secondary>Explore the platform</ActionLink></div><div className="insight-list reveal"><div className="insight-row"><span className="insight-number">01</span><span className="insight-row-icon"><ChartNoAxesCombined size={19} /></span><span><strong>See patterns sooner</strong><small>Turn raw financial activity into structured, readable insights.</small></span><ArrowUpRight size={16} /></div><div className="insight-row"><span className="insight-number">02</span><span className="insight-row-icon"><CircleDollarSign size={19} /></span><span><strong>Understand the whole picture</strong><small>Bring income, credit, and business signals together.</small></span><ArrowUpRight size={16} /></div><div className="insight-row"><span className="insight-number">03</span><span className="insight-row-icon"><ShieldCheck size={19} /></span><span><strong>Move forward with confidence</strong><small>Give every review a more consistent foundation.</small></span><ArrowUpRight size={16} /></div><div className="insight-stamp"><span>CRP</span><small>INTELLIGENCE<br />IN EVERY SIGNAL</small></div></div></div></section>
        <section className="closing-cta"><div className="closing-ornament" aria-hidden="true"><span /><span /><span /></div><div className="closing-content reveal"><span className="eyebrow">A CLEARER VIEW STARTS HERE</span><h2>Make your next decision<br /><span>a more informed one.</span></h2><p>Bring your financial assessment workflow into sharper focus.</p><ActionLink to="/signup">Get started with CRISP</ActionLink></div></section>
      </main>
    </MarketingLayout>
  );
}

export function ProductPage() {
  const { slug } = useParams();
  const product = products.find((item) => item.slug === slug);
  if (!product) return <MarketingLayout><main className="not-found"><span className="eyebrow">PRODUCT NOT FOUND</span><h1>Let’s find a clearer path.</h1><ActionLink to="/">Back to home</ActionLink></main></MarketingLayout>;
  const Icon = product.icon;
  return (
    <MarketingLayout>
      <main className="product-page">
        <section className={`product-hero product-hero-${product.slug}`}><div className="product-hero-inner"><div className="product-hero-copy"><div className="breadcrumbs"><Link to="/">Home</Link><ChevronRight size={13} /><span>{product.acronym}</span></div><span className="product-page-label"><Icon size={16} /> {product.acronym} · {product.fullName}</span><h1>{product.headline}</h1><p>{product.description}</p><div className="hero-actions"><ActionLink to="/signup">Get started</ActionLink><a className="text-link" href="#overview">Explore capabilities <ArrowRight size={16} /></a></div></div><div className="product-hero-art"><div className="product-art-grid" />{product.slug === 'bsa' ? <BsaReportMontage /> : <div className="product-art-core"><span className={`product-icon product-icon-${product.slug}`}><Icon size={27} /></span><small>{product.acronym} ANALYSIS</small><strong>Signals in<br />context.</strong><div className="art-signal"><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /></div><div className="art-secure"><ShieldCheck size={15} /> Structured insights</div></div>}<div className="art-note"><span className="health-dot" /> ANALYSIS READY <ArrowUpRight size={14} /></div></div></div></section>
        <section className="product-overview section-pad" id="overview"><div className="overview-copy reveal"><span className="eyebrow">THE OVERVIEW</span><h2>Useful context for<br /><span>better-informed reviews.</span></h2></div><div className="overview-detail reveal"><p>{product.overview}</p><div className="overview-stat"><span className="overview-stat-icon"><Sparkles size={17} /></span><span><strong>More than a document.</strong><small>A structured view of the signals that matter to your assessment.</small></span></div></div></section>
        <section className="capabilities-section section-pad">
          <div className="center-heading reveal">
            <span className="eyebrow">CAPABILITIES</span>
            <h2>Explore the reports and<br /><span>workflow steps.</span></h2>
          </div>
          <div className="capability-grid">
            {product.capabilities.map((capability, index) => (
              <article className="capability-card reveal" key={capability.title}>
                <span className="capability-index">0{index + 1}</span>
                <span className="capability-icon">
                  {index === 0 ? <ChartNoAxesCombined size={19} /> : index === 1 ? <FileSearch size={19} /> : index === 2 ? <Activity size={19} /> : <ShieldCheck size={19} />}
                </span>
                <h3>{capability.title}</h3>
                <p>{capability.description}</p>
                <ArrowUpRight className="capability-arrow" size={16} />
              </article>
            ))}
          </div>
        </section>
        <WorkflowGallery workflowsToShow={workflows.filter((workflow) => workflow.slug === product.slug)} />
        <section className="benefits-section"><div className="benefits-inner"><div className="benefits-title reveal"><span className="eyebrow eyebrow-light">IN THE WORKFLOW</span><h2>Clarity that<br /><span>moves work forward.</span></h2></div><div className="benefit-list reveal">{product.benefits.map((benefit, index) => <div className="benefit-row" key={benefit}><span>0{index + 1}</span><p>{benefit}</p><Check size={16} /></div>)}</div></div></section>
        <section className="process-section section-pad"><div className="center-heading reveal"><span className="eyebrow">HOW IT WORKS</span><h2>A thoughtful process.<br /><span>A clearer outcome.</span></h2></div><div className="process-grid">{product.steps.map((step, index) => <article className="process-step reveal" key={step.title}><span className="process-index">0{index + 1}<span /></span><h3>{step.title}</h3><p>{step.description}</p></article>)}</div></section>
        <section className="product-cta"><div className="product-cta-inner reveal"><span className="eyebrow">READY FOR A CLEARER VIEW?</span><h2>Bring better context<br />to your next decision.</h2><p>Start building a more informed financial assessment workflow.</p><ActionLink to="/signup">Get started with {product.acronym}</ActionLink></div></section>
      </main>
    </MarketingLayout>
  );
}

export function PricingPage() {
  const [priceDisplay, setPriceDisplay] = useState<'before-tax' | 'inclusive'>('inclusive');
  return (
    <MarketingLayout>
      <main className="pricing-page">
        <section className="pricing-hero">
          <span className="eyebrow">PRICING BY SERVICE</span>
          <h1>Choose the analysis<br /><span>your workflow needs.</span></h1>
          <p>See each service price, the 18% GST, and exactly what the price covers.</p>
          <div className={`billing-toggle ${priceDisplay === 'inclusive' ? 'billing-toggle-right' : ''}`} role="group" aria-label="Tax display">
            <button type="button" className={priceDisplay === 'before-tax' ? 'selected' : ''} aria-pressed={priceDisplay === 'before-tax'} onClick={() => setPriceDisplay('before-tax')}>Before GST</button>
            <button type="button" className={priceDisplay === 'inclusive' ? 'selected' : ''} aria-pressed={priceDisplay === 'inclusive'} onClick={() => setPriceDisplay('inclusive')}>Incl. 18% GST</button>
          </div>
        </section>
        <section className="plans-grid section-pad" aria-label="Service pricing">
          {products.map((product) => {
            const Icon = product.icon;
            const pricing = getPricingDetails(product.acronym, 0);
            const price = priceDisplay === 'inclusive' ? pricing.total : pricing.base;
            return (
              <article className="plan-card reveal" key={product.slug}>
                <span className="product-icon"><Icon size={20} /></span>
                <span className="plan-name">{product.acronym}</span>
                <p className="plan-audience">{product.fullName}</p>
                <div className="plan-price"><strong>₹{price}</strong></div>
                <p className="price-period">{priceDisplay === 'inclusive' ? `Includes ₹${pricing.gst} GST at 18%` : `₹${pricing.gst} GST at 18% added`} · {pricing.periodLabel}</p>
                <Link className="button button-primary plan-button" to="/signup">Get started <ArrowUpRight size={16} /></Link>
                <div className="plan-divider" />
                <span className="plan-includes">IN THIS SERVICE</span>
                <ul>{product.capabilities.map((capability) => <li key={capability.title}><Check size={15} />{capability.title}</li>)}</ul>
              </article>
            );
          })}
        </section>
        <section className="comparison-section section-pad">
          <div className="comparison-heading reveal">
            <div><span className="eyebrow">COMPARE SERVICES</span><h2>What each service includes.</h2></div>
            <p>Each column pairs a service with its report workflow, covered period, and price.</p>
          </div>
          <div className="comparison-wrap reveal">
            <table className="comparison-table">
              <thead><tr><th>Workflow</th>{products.map((product) => <th key={product.slug}>{product.acronym}<span>{product.fullName}</span></th>)}</tr></thead>
              <tbody>
                {pricingComparisons.map((row) => <tr key={row.label}><th scope="row">{row.label}</th>{products.map((product) => <td key={product.slug}>{row.values[product.slug]}</td>)}</tr>)}
                <tr><th scope="row">Service amount</th>{products.map((product) => <td key={product.slug}>₹{getPricingDetails(product.acronym, 0).base}</td>)}</tr>
                <tr><th scope="row">GST (18%)</th>{products.map((product) => <td key={product.slug}>₹{getPricingDetails(product.acronym, 0).gst}</td>)}</tr>
                <tr><th scope="row">Total amount</th>{products.map((product) => <td key={product.slug}>₹{getPricingDetails(product.acronym, 0).total}</td>)}</tr>
                <tr><th scope="row">Service period</th>{products.map((product) => <td key={product.slug}>{getPricingDetails(product.acronym, 0).periodLabel}</td>)}</tr>
              </tbody>
            </table>
          </div>
          <p className="pricing-note">Prices shown here match the service prices in the app.</p>
        </section>
        <section className="pricing-value-section section-pad">
          <div className="center-heading reveal">
            <span className="eyebrow">CLEAR SERVICE PRICING</span>
            <h2>Know what you are<br /><span>paying for.</span></h2>
          </div>
          <div className="pricing-value-grid">
            <article className="pricing-value-card reveal">
              <span className="pricing-value-icon"><CircleDollarSign size={20} /></span>
              <h3>Choose by service</h3>
              <p>Select BSA, GST, ITR, or CIBIL based on the report workflow you need.</p>
            </article>
            <article className="pricing-value-card reveal">
              <span className="pricing-value-icon"><FileChartColumnIncreasing size={20} /></span>
              <h3>Know the covered period</h3>
              <p>See the unit before you start: one bank account or GST number for 12 months, one business for two financial years, or CIBIL records to date.</p>
            </article>
            <article className="pricing-value-card reveal">
              <span className="pricing-value-icon"><ShieldCheck size={20} /></span>
              <h3>See the full total</h3>
              <p>Review the service amount, 18% GST, and GST-inclusive total before checkout.</p>
            </article>
          </div>
        </section>
        <section className="pricing-contact">
          <div className="pricing-contact-inner reveal">
            <span className="eyebrow eyebrow-light">QUESTIONS ABOUT A SERVICE?</span>
            <h2>Let’s talk BSA, GST,<br />ITR, or CIBIL.</h2>
            <p>Ask the CRISP team about the service workflow that fits your needs.</p>
            <a className="button button-secondary" href="mailto:ashok.m@r1xchange.com">Contact our team <ArrowUpRight size={16} /></a>
          </div>
          <div className="contact-mark"><Banknote size={34} /></div>
        </section>
      </main>
    </MarketingLayout>
  );
}
