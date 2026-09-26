import { useEffect, useState, type ReactNode } from 'react';
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
          <div className="dash-heading"><div><small>FINANCIAL SNAPSHOT</small><strong>Assessment overview</strong></div><span className="dash-period">Last 6 months⌄</span></div>
          <div className="metric-grid">
            <div className="metric-card"><span>Monthly inflow</span><strong>₹ 8.42L</strong><small className="metric-positive">↗ 12.8% <i>vs. prior period</i></small></div>
            <div className="metric-card"><span>Cash flow health</span><strong className="health-score">82 <em>/ 100</em></strong><small><span className="health-dot" /> Healthy profile</small></div>
          </div>
          <div className="chart-card"><div className="chart-head"><span>Cash flow trend</span><span><i className="legend-inflow" /> Inflow <i className="legend-outflow" /> Outflow</span></div>
            <div className="chart-area"><div className="chart-labels"><span>₹10L</span><span>₹7.5L</span><span>₹5L</span><span>₹2.5L</span></div><svg viewBox="0 0 470 125" preserveAspectRatio="none" role="img" aria-label="Cash flow trend rising steadily over six months"><defs><linearGradient id="chartFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#4b86c8" stopOpacity=".19" /><stop offset="1" stopColor="#4b86c8" stopOpacity="0" /></linearGradient></defs><path d="M0,97 C30,91 35,77 68,81 S113,57 145,69 S193,79 220,51 S270,64 296,43 S340,57 368,29 S420,36 470,13 L470,125 L0,125Z" fill="url(#chartFill)" /><path d="M0,97 C30,91 35,77 68,81 S113,57 145,69 S193,79 220,51 S270,64 296,43 S340,57 368,29 S420,36 470,13" fill="none" stroke="#2866b2" strokeWidth="2.5" vectorEffect="non-scaling-stroke" /><path d="M0,111 C30,108 40,93 68,101 S111,84 145,94 S194,90 220,79 S266,89 296,74 S344,82 368,62 S423,70 470,54" fill="none" stroke="#b5c7c3" strokeWidth="1.8" strokeDasharray="4 5" vectorEffect="non-scaling-stroke" /></svg></div>
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
      <div className="logo-section-heading"><span className="eyebrow">BUILT FOR FINANCIAL TEAMS</span><p>Supply chain finance clients</p></div>
      <div className="logo-marquee"><div className="logo-track">{[0, 1].map((copy) => <div className="logo-group" key={copy} aria-hidden={copy === 1}>{clientLogos.map((client) => <span className="client-wordmark" key={`${copy}-${client.name}`}><img src={client.image} alt={copy === 1 ? '' : `${client.name} logo`} decoding="async" /></span>)}</div>)}</div></div>
    </section>
  );
}

function ProductCard({ product }: { product: Product }) {
  const Icon = product.icon;
  return <Link className="product-card reveal" to={`/products/${product.slug}`}><span className={`product-icon product-icon-${product.slug}`}><Icon size={21} strokeWidth={1.8} /></span><span className="card-kicker">{product.acronym}</span><h3>{product.name}</h3><p className="product-full-name">{product.fullName}</p><p className="product-description">{product.description}</p><span className="card-link">Explore {product.acronym}<ArrowRight size={15} /></span><span className="card-corner"><ArrowUpRight size={16} /></span></Link>;
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
        <section className={`product-hero product-hero-${product.slug}`}><div className="product-hero-inner"><div className="product-hero-copy"><div className="breadcrumbs"><Link to="/">Home</Link><ChevronRight size={13} /><span>{product.acronym}</span></div><span className="product-page-label"><Icon size={16} /> {product.acronym} · {product.fullName}</span><h1>{product.headline}</h1><p>{product.description}</p><div className="hero-actions"><ActionLink to="/signup">Get started</ActionLink><a className="text-link" href="#overview">Explore capabilities <ArrowRight size={16} /></a></div></div><div className="product-hero-art"><div className="product-art-grid" /><div className="product-art-core"><span className={`product-icon product-icon-${product.slug}`}><Icon size={27} /></span><small>{product.acronym} ANALYSIS</small><strong>Signals in<br />context.</strong><div className="art-signal"><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /></div><div className="art-secure"><ShieldCheck size={15} /> Structured insights</div></div><div className="art-note"><span className="health-dot" /> ANALYSIS READY <ArrowUpRight size={14} /></div></div></div></section>
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
