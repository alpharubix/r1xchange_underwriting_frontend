import { PricingSection } from './MarketingSite';
import React, { useEffect, useState} from 'react';
import { 
  Eye,ShieldCheck,Building,CheckCircle2,Clock,TrendingUp,User,ChevronLeft,RefreshCw,Filter,Calendar,PieChart,ArrowRightLeft,Activity,ArrowLeftRight,BarChart2,Download} from 'lucide-react';
  import { CreditCard,UploadCloud,Smartphone } from 'lucide-react';
import { Menu, X, ChevronDown,ChevronRight, ArrowUpRight as ArrowUpRightIcon} from 'lucide-react';
import crispLogoBlack from '@/assets/crispLogoRedesignFirstVersion.png';

import { Link, useLocation } from 'react-router-dom';
import { 
  IndianRupee,
  ArrowRight, 
  Users, 
  Wallet, 
  Network, 
  Landmark,
  FileText,
  FileSearch,
  Fingerprint,
  FileCheck2,
  Check
} from 'lucide-react';
import { ActionLink } from './MarketingSite';
import './anchor-marketing.css'
function AnchorDashboardMontage() {
  return (
    <div className="group flex h-[250px] w-full bg-slate-50 overflow-hidden rounded-xl border shadow-sm text-left hover:animatio">
      <div className="transition-all duration-300 group-hover:translate-x-[-40px] w-16 bg-[#002366] shrink-0 flex flex-col items-center py-4 gap-4">
        <div className="w-8 h-8 bg-white/20 rounded-md" />
        <div className="w-6 h-6 bg-white/10 rounded-full mt-4" />
        <div className="w-6 h-6 bg-white/10 rounded-full" />
      </div>
      <div className="flex-1 p-4 flex flex-col gap-4 transition-transform duration-300 group-hover:translate-x-[-20px] group-hover:bg-blue-50">
        <div className="flex justify-between items-center border-b pb-2">
          <div className="font-bold text-slate-800 text-sm">Customer Dashboard</div>
          <div className="bg-[#002366] text-white text-[10px] px-2 py-1 rounded">Add Customer</div>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-[10px] text-slate-500 font-semibold px-2">
            <span>NAME</span>
            <span>BSA</span>
            <span>GST</span>
            <span>ITR</span>
            <span>CIBIL</span>
            <span>Save<br/> money</span>
            <span>Acess<br/> Money</span>
            <span>Rectify<br/> Money</span>
            <span>Wallet</span>
          </div>
          {[1,2,3].map(i => (
            <div key={i} className="flex justify-between items-center bg-white p-2 border rounded shadow-sm text-xs">
              <span className="font-medium">Cust {i}</span>
              <span className="text-green-600 font-bold">?</span>
              <span className="text-green-600 font-bold">?</span>
              <span className="text-green-600 font-bold">?</span>
              <span className="text-slate-300 font-bold">-</span>
              <span className="text-green-600 font-bold">?</span>
              <span className="text-green-600 font-bold">?</span>
              <span className="text-green-600 font-bold">?</span>
              <span className="text-green-600 font-bold">?</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function WalletMontage() {
  const services = [
    "BSA Report",
    "GST Analysis",
    "ITR Returns",
    "CIBIL Score",
  ];

  return (
    <div className="flex h-full w-full items-center justify-center rounded-xl border bg-slate-50 p-4 shadow-sm">
      <div className="relative flex w-[700px] items-center justify-center">

        {/* LEFT BAR */}
        <div
          className="
            absolute
            left-[20px]
            top-[145px]
            z-10
            h-[90px]
            w-[190px]
            rounded-l-[18px]
            bg-[#4a6fa8]
            shadow-lg
          "
          style={{
            transform: "skewY(-5deg)",
          }}
        >
          <div
            className="flex h-full items-center justify-end pr-6 text-white"
            style={{
              transform: "skewY(5deg)",
            }}
          >
            <div className="text-right">
              <div className="text-sm font-bold">
                Secure
              </div>
              <div className="text-xs opacity-80">
                Wallet
              </div>
            </div>
          </div>
        </div>


        {/* RIGHT BAR */}
        <div
          className="
            absolute
            right-[20px]
            top-[145px]
            z-10
            h-[90px]
            w-[190px]
            rounded-r-[18px]
            bg-[#4a6fa8]
            shadow-lg
          "
          style={{
            transform: "skewY(-5deg)",
          }}
        >
          <div
            className="flex h-full items-center pl-6 text-white"
            style={{
              transform: "skewY(5deg)",
            }}
          >
            <div>
              <div className="text-sm font-bold">
                You can pay
              </div>

              <div className="text-xs opacity-80">
                Assign Customer
              </div>
            </div>
          </div>
        </div>


        {/* WALLET */}
        <div className="relative z-20 w-[360px] overflow-hidden rounded-2xl border bg-white shadow-xl">

          {/* Header */}
          <div className="flex items-center justify-between bg-[#002366] p-5 text-white">

            <div>
              <div className="text-base font-bold">
                Individual Wallet
              </div>

              <div className="text-xs opacity-80">
                Available Balance
              </div>
            </div>

            <div className="text-3xl font-bold">
              ₹5,000
            </div>

          </div>


          {/* Services */}
          <div className="space-y-4 p-5">

            <div className="text-xs font-bold text-slate-500">
              ASSIGN SERVICES
            </div>

            {services.map((mod) => (
              <div
                key={mod}
                className="
                  flex
                  items-center
                  justify-between
                  rounded-lg
                  border
                  border-slate-200
                  px-3
                  py-3
                  text-sm
                  text-slate-700
                "
              >
                <span>{mod}</span>

                <span className={`font-medium ${mod=="BSA Report" ? "text-green":"text-red-500 "}`}>
                 ₹ {mod== "BSA Report" ? 565 :0}
                </span>
              </div>
            ))}

            <button
              className="
                w-full
                rounded-lg
                py-2.5
                text-xs
                font-bold
                text-white
              "
            >
              Recharge Wallet
            </button>

          </div>
        </div>

      </div>
    </div>
  );
}


function HierarchyMontage() {
  return (
    <div className="flex h-[400px] w-full bg-slate-50 overflow-hidden rounded-xl border shadow-sm text-left p-4">
      <div className="flex-1 bg-white border rounded shadow-sm p-3">
        <div className="text-sm font-bold text-[#002366] mb-3 border-b pb-2">User Management</div>
        <div className="space-y-3 pl-2 border-l-2 border-[#002366]/20">
          <div className="relative">
            <div className="absolute -left-3.5 top-1.5 w-3 h-0.5 bg-[#002366]/20" />
            <div className="bg-slate-50 border p-2 rounded text-xs font-medium">User 1 -  <span className='font-thinner text-[#002366]/45 italic'>View Customers under User 1</span>  </div>
          </div>
          <div className="relative">
            <div className="absolute -left-3.5 top-1.5 w-3 h-0.5 bg-[#002366]/20" />
            <div className="bg-slate-50 border p-2 rounded text-xs font-medium">User 2 - <span className='font-thinner text-[#002366]/45 italic'>View Customers under User 2</span></div>
          </div>
          <div className='relative -top-5'>
            .
          </div>
          <div className='relative -top-12'>
            .
          </div>
          <div className='relative -top-20'>
            .
          </div>
        </div>
        <div className="-mt- bg-slate-100 border border-dashed border-slate-300 text-slate-500 text-[10px] font-bold text-center py-1.5 rounded w-full">+ Create User</div>
      </div>
    </div>
  );
}



function Brand() {
  const [isLaunching, setIsLaunching] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    if (window.scrollY < 50) {
      e.preventDefault();
      if (!isLaunching) {
        setIsLaunching(true);
        setTimeout(() => setIsLaunching(false), 1200);
      }
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <Link className="brand" to="/anchors" aria-label="CRISP Anchor Home" onClick={handleClick}>
      <img 
        src={crispLogoBlack} 
        alt="CRISP" 
        className={isLaunching ? "logo-blast" : ""}
        style={{ height: '67px' }} 
      />
    </Link>
  );
}

  function AnchorNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMobileOpen(false);
    setServicesOpen(false);
  }, [location.pathname]);

  const services = [
    {
      name: "BSA",
      subtitle: "Bank Statement Analysis",
      description:
        "Analyze each available bank account with Overview, EOD Analysis, Loan Transactions, Summary of Debit and Credit, Cash Flow, or Monthly Overview.",
      icon: <Landmark size={23} />,
    },
    {
      name: "GST",
      subtitle: "Goods and Services Tax",
      description:
        "Run GSTIN analysis, check submission history, and open or export completed GSTR reports.",
      icon: <FileText size={23} />,
    },
    {
      name: "ITR",
      subtitle: "Income Tax Return",
      description:
        "View and export Tax Calculation, Balance Sheet, Profit and Loss, and Ratio Analysis reports.",
      icon: <FileSearch size={23} />,
    },
    {
      name: "CIBIL",
      subtitle: "Credit Information Bureau India Limited",
      description:
        "Submit identity details, verify by OTP, then view or export CIBIL report sections.",
      icon: <Fingerprint size={23} />,
    },
    {
      name: "Money",
      subtitle: "Financial Offerings",
      description: " Rectify Money\n Save Money\n Access Money",
      icon: <IndianRupee size={23} />,
    },
    {
      name: "Pricing",
        subtitle: "Clear Service Pricing",
        description: "Choose by service, know the covered period, and see the full total before checkout.",
      icon: <Wallet size={23} />,
    }
  ];

  return (
    <header className="site-header">
      <div className="nav-shell">
        <Brand />

        <nav className="desktop-nav" aria-label="Main navigation">
          <Link
            to="/anchors"
            className="nav-link"
            onClick={() =>
              window.scrollTo({ top: 0, behavior: "smooth" })
            }
          >
            Home
          </Link>

          <div
            className="services-nav-wrapper"
            
          >
            <button
              type="button"
              className="nav-link services-trigger" style={{ fontSize: '15px', fontWeight: 600, fontFamily: 'inherit', color: 'inherit' }}
              
              onClick={() => setServicesOpen(!servicesOpen)}
            >
              Services
              <ChevronDown
                size={14}
                className={servicesOpen ? "rotate-180" : ""}
              />
            </button>

            {servicesOpen && (
              <div className="services-mega-menu">
                <div className="services-mega-inner">

                  <div className="services-intro">
                    <div className="services-intro-title">
                      THE CRISP
                      <br />
                      PLATFORM
                    </div>

                    <h2>
                      More signal.
                      <br />
                      Less
                      <br />
                      guesswork.
                    </h2>

                    <p>
                      Financial intelligence for thoughtful underwriting.
                    </p>
                  </div>

                  <div className="services-grid">
                    {services.map((service) => (
                      <a href={service.name === "BSA" ? "#view-bsa" : service.name === "GST" ? "#view-gst" : service.name === "CIBIL" ? "#view-cibil" : service.name === "ITR" ? "#view-itr" : service.name.includes("Money") || service.name === "Wallet Dashboard" ? "#view-money" : "#how-to-use"} key={service.name} className="service-mega-item cursor-pointer !no-underline !text-inherit" onClick={() => setServicesOpen(false)}>
                        <div className="service-icon">
                          {service.icon}
                        </div>

                        <div className="service-content">
                          <h3>{service.name}</h3>
                          <h4>{service.subtitle}</h4>
                          <p style={{ whiteSpace: "pre-line", lineHeight: "1.6" }}>{service.description}</p>
                          </div>
                        </a>
                    ))}
                  </div>

                </div>
              </div>
            )}
          </div>

          <a className="nav-link" href="#pricings">Pricing</a>

          <a className="nav-link" href="#hierarchy">
            Hierarchy
          </a>

          <a className="nav-link" href="#reports">
            Reports
          </a>
        </nav>

        <div className="nav-actions">
          <Link className="login-link" to="/anchors/login">
            Anchor Login
          </Link>

          <Link className="nav-cta" to="/contact">
            Contact Sales
            <ArrowUpRightIcon size={15} />
          </Link>
        </div>

        <button
          className="mobile-menu-toggle"
          aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={21} /> : <Menu size={21} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="mobile-nav">
          <a
            className="mobile-nav-row"
            href="#services"
            onClick={() => setMobileOpen(false)}
          >
            Services
          </a>

          <a
            className="mobile-nav-row"
            href="#wallet"
            onClick={() => setMobileOpen(false)}
          >
            Wallet
          </a>

          <a
            className="mobile-nav-row"
            href="#hierarchy"
            onClick={() => setMobileOpen(false)}
          >
            Hierarchy
          </a>

          <a
            className="mobile-nav-row"
            href="#reports"
            onClick={() => setMobileOpen(false)}
          >
            Reports
          </a>

          <div className="mobile-actions">
            <Link
              className="button button-secondary"
              to="/anchors/login"
            >
              Anchor Login
              <ArrowUpRightIcon size={16} />
            </Link>

            <ActionLink to="/contact">
              Contact Sales
            </ActionLink>
          </div>
        </div>
      )}
    </header>
  );
}
function AnchorFooter() {
  const groups = [
    { title: 'Platform', links: [{ label: 'Customer Management', to: '#customers' }, { label: 'Wallet', to: '#wallet' }, { label: 'Hierarchy', to: '#hierarchy' }, { label: 'Service Reports', to: '#reports' }] },
    { title: 'Company', links: [{ label: 'About', to: '#company' }, { label: 'Contact', to: 'mailto:support@checkcrisp.com' }] },
    { title: 'Resources', links: [{ label: 'Documentation', to: '#resources' }, { label: 'FAQs', to: '#resources' }] },
    { title: 'Legal', links: [{ label: 'Privacy policy', to: '#privacy' }, { label: 'Terms & conditions', to: '#terms' }] },
  ];
  return (
    <footer className="site-footer" id="company">
      <div className="footer-top-anchor">
        <div className="footer-brand-block">
          <Brand /><p>Command your underwriting ecosystem.</p><a href="mailto:support@checkcrisp.com" className='spacing-2'>support@checkcrsip.com 
            <ArrowUpRightIcon size={14}/></a>
        </div>

        {groups.map((group) => <div className="footer-group" key={group.title}><h3>{group.title}</h3>{group.links.map((item) => item.to.startsWith('/') ? <Link to={item.to} key={item.label}>{item.label}</Link> : <a href={item.to} key={item.label}>{item.label}</a>)}</div>)}
      </div>
      <div className="footer-bottom"><span> {new Date().getFullYear()} AlphaRubix Info Tech</span><span>Developed by CRISP tech team</span></div>
    </footer>
  );
}

function AnchorMarketingLayout({ children }: { children: React.ReactNode }) {
  return <div className="marketing-site"><AnchorNavbar />{children}<AnchorFooter /></div>;
}

function ReportsMontage() {
  return (
    <div className="flex h-full w-full bg-slate-50 overflow-hidden rounded-xl border shadow-sm text-left p-4">
      <div className="flex-1 bg-white border rounded shadow-sm p-3 flex flex-col">
        <div className="text-sm font-bold text-[#002366] mb-3 border-b pb-2 flex justify-between items-center">
          <span>Service Reports</span>
          <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-1 rounded">Company 1</span>
        </div>
        <div className="grid grid-cols-2 gap-2 flex-1">
          {['BSA', 'GST', 'ITR', 'CIBIL'].map(mod => (
            <div key={mod} className="border rounded p-2 flex flex-col justify-center items-center text-center hover:border-[#002366] transition-colors cursor-pointer bg-slate-50 hover:bg-[#002366]/5">
              <span className="text-xs font-bold text-[#002366]">{mod} Report</span>
              <span className="text-[9px] text-slate-400 mt-1">View Details ?</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


function AnchorHeroMontage() {
  return (
    <div className="relative -mt-[55px] npxw-full max-w-[1200px] overflow-hidden rounded-[2rem]  p-8 shadow-2xl reveal is-visible bg-gradient-to-br from-blue-50 via-sky-50 to-blue-100 shadow-[inset_0_0_50px_rgba(59,130,246,0.22)] animate-breathe" style={{ minHeight: '600px' }}>
      
      {/* Search Filters Row */}
      <div className="flex gap-4 mb-8">
        <div className="flex-1">
          <label className="mb-2 block text-sm text-slate-500 text-left">Account ID</label>
          <div className="rounded-full bg-[#e8e8e8] px-6 py-3 text-sm text-slate-500 text-left w-full shadow-inner">
            Search Account ID.....
          </div>
        </div>
        <div className="flex-1">
          <label className="mb-2 block text-sm text-slate-500 text-left">Customer Name</label>
          <div className="rounded-full bg-[#e8e8e8] px-6 py-3 text-sm text-slate-500 text-left w-full shadow-inner">
            Search Customer Name.....
          </div>
        </div>
        <div className="flex-1">
          <label className="mb-2 block text-sm text-slate-500 text-left">Mobile Number</label>
          <div className="rounded-full bg-[#e8e8e8] px-6 py-3 text-sm text-slate-500 text-left w-full shadow-inner">
            Search Mobile number......
          </div>
        </div>
        <div className="flex-1">
          <label className="mb-2 block text-sm text-slate-500 text-left">GST Number</label>
          <div className="rounded-full bg-[#e8e8e8] px-6 py-3 text-sm text-slate-500 text-left w-full shadow-inner">
            Search GST number......
          </div>
        </div>
      </div>

      <div className="flex gap-4 mb-16 relative">
        <div className="w-[300px]">
          <label className="mb-2 block text-sm text-slate-500 text-left">Status</label>
          <div className="rounded-full bg-[#e8e8e8] px-6 py-3 text-sm text-slate-800 text-left w-full shadow-inner relative">
            Search by Statuses ...
            <div className="absolute right-[-40px] top-[15px] w-0 h-0 border-t-[8px] border-b-[8px] border-l-[40px] border-transparent border-l-[#f4f4f4] drop-shadow-md z-10 hidden sm:block animate-pulse"></div>
          </div>
        </div>

        {/* Floating Animated Status Box */}
        <div className="absolute left-[310px] top-[-10px] w-[180px] rounded-2xl bg-[#f4f4f4] shadow-xl py-4 flex flex-col justify-center items-center transform -rotate-6 montage-float z-20" style={{ border: '1px solid #e0e0e0' }}>
          <div className="text-lg font-bold text-[#333] tracking-wide mb-2">ACTIVE</div>
          <div className="w-full h-px bg-slate-300"></div>
          <div className="text-lg font-bold text-[#a0aabf] tracking-wide mt-2 opacity-60">INACTIVE</div>
        </div>
      </div>

      {/* Data Table */}
      <div className="w-full overflow-hidden rounded-lg bg-white shadow-sm border border-slate-200">
        <table className="w-full text-left text-[11px] text-slate-500 font-medium">
          <thead className="bg-[#4b4b4b] text-white text-[9px] uppercase tracking-wider">
            <tr>
              <th className="py-3 px-4">Account ID</th>
              <th className="py-3 px-4">Customer Name</th>
              <th className="py-3 px-4">Mobile Number</th>
              <th className="py-3 px-4">Company Name</th>
              <th className="py-3 px-4">GST NO</th>
              <th className="py-3 px-4 text-center">Status</th>
              <th className="py-3 px-4 text-center">BSA</th>
              <th className="py-3 px-4 text-center">GST</th>
              <th className="py-3 px-4 text-center">ITR</th>
              <th className="py-3 px-4 text-center">CIBIL</th>
              <th className="py-3 px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-slate-100 transition-all hover:bg-slate-50 montage-row-1">
              <td className="py-4 px-4 font-bold text-[#64748b]">12345</td>
              <td className="py-4 px-4 font-bold text-[#64748b]">JOHN</td>
              <td className="py-4 px-4 text-[#94a3b8]">783XXXXXXX</td>
              <td className="py-4 px-4 text-[#94a3b8]">ABC Enterprises</td>
              <td className="py-4 px-4 text-[#94a3b8]">22AB2XXXXXXX</td>
              <td className="py-4 px-4 text-center font-bold text-[#94a3b8]">INACTIVE</td>
              <td className="py-4 px-4 text-center text-green-500"><svg className="w-5 h-5 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg></td>
              <td className="py-4 px-4 text-center text-red-500"><svg className="w-5 h-5 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg></td>
              <td className="py-4 px-4 text-center text-green-500"><svg className="w-5 h-5 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg></td>
              <td className="py-4 px-4 text-center text-green-500"><svg className="w-5 h-5 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg></td>
              <td className="py-4 px-4 text-center text-slate-800"><svg className="w-5 h-5 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg></td>
            </tr>
            <tr className="transition-all hover:bg-slate-50 montage-row-2">
              <td className="py-4 px-4 font-bold text-[#64748b]">98765</td>
              <td className="py-4 px-4 font-bold text-[#64748b]">RAMESH</td>
              <td className="py-4 px-4 text-[#94a3b8]">982XXXXXXX</td>
              <td className="py-4 px-4 text-[#94a3b8]">Ramesh Pvt Ltd</td>
              <td className="py-4 px-4 text-[#94a3b8]">23JHWEXXXXXXX</td>
              <td className="py-4 px-4 text-center font-bold text-[#94a3b8]">ACTIVE</td>
              <td className="py-4 px-4 text-center text-green-500"><svg className="w-5 h-5 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg></td>
              <td className="py-4 px-4 text-center text-green-500"><svg className="w-5 h-5 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg></td>
              <td className="py-4 px-4 text-center text-green-500"><svg className="w-5 h-5 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg></td>
              <td className="py-4 px-4 text-center text-red-500"><svg className="w-5 h-5 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg></td>
              <td className="py-4 px-4 text-center text-slate-800"><svg className="w-5 h-5 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function AnchorMarketingSite() {
  useEffect(() => {
    // Add scroll reveal effect matching MarketingSite
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <AnchorMarketingLayout>
      <main className="anchor-marketing">
        {/* Anchor Hero */}
        <section className="site-hero relative overflow-hidden" style={{ paddingTop: '160px', paddingBottom: '160px', textAlign: 'center', minHeight: '85vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          {/* Background Montage */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] opacity-[0.25] pointer-events-none z-0 transform scale-110">
            <AnchorHeroMontage />
          </div>
          <div className="hero-content reveal relative z-10 mx-auto max-w-[800px] bg-white/40 backdrop-blur-md border border-white/50 p-12 rounded-[3rem] shadow-2xl -translate-y-16">
            <h1 style={{ fontSize: '3rem', fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.1, color: '#002366', marginBottom: '1.5rem' }}>
              Command Your <br />
              <span style={{ color: '#0056D2' }}>Underwriting Ecosystem.</span>
            </h1>
            <p style={{ fontSize: '1.25rem', color: '#475569', maxWidth: '600px', margin: '0 auto 2rem auto', lineHeight: 1.6 }}>
              A centralized hub for Anchors and Users to onboard customers, distribute services, manage Individual wallets, and oversee Users effortlessly.
            </p>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <ActionLink to="/anchors/login">Anchor Login</ActionLink>
              <ActionLink to="/contact" secondary>Contact Sales</ActionLink>
            </div>
            
            
          </div>
        </section>

        {/* Feature 1: Customer Management */}
        <section className="section-pad bg-slate-50" id="customers">
          <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center reveal">
            <div>
              <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#002366]/10 text-[#002366]">
                <Users size={24} />
              </div>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">One Dashboard, All Your Customers</h2>
              <p className="text-lg text-slate-600 mb-6">
                Streamline your onboarding process. Easily add new customers, track their business details, and monitor the real-time status of their BSA, GST, ITR, and CIBIL verifications from a single unified view.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2 text-slate-700"><Check size={18} className="text-green-500 mt-0.5" /> Customer Reports import capabilities</li>
                <li className="flex items-start gap-2 text-slate-700"><Check size={18} className="text-green-500 mt-0.5" /> Real-time verification status indicators</li>
                <li className="flex items-start gap-2 text-slate-700"><Check size={18} className="text-green-500 mt-0.5" /> Centralized customer repository</li>
              </ul>
            </div>
            <div className="h-[400px] w-full relative">
              <AnchorDashboardMontage />
            </div>
          </div>
        </section>

        {/* Feature 2: Wallet & Payments */}
        <section className="section-pad bg-white" id="wallet">
          <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center reveal">
            <div className="h-[400px] w-full relative order-2 md:order-1">
              <WalletMontage />
            </div>
            <div className="order-1 md:order-2">
              <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#002366]/10 text-[#002366]">
                <Wallet size={24} />
              </div>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Centralized Wallet & Payments</h2>
              <p className="text-lg text-slate-600 mb-6">
                Take control of your service expenditures. Recharge Individual wallet or seamlessly assign payment requests for BSA, GST, ITR or CIBIL services directly to your customers.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2 text-slate-700"><Check size={18} className="text-green-500 mt-0.5" /> Individual wallet balance management</li>
                <li className="flex items-start gap-2 text-slate-700"><Check size={18} className="text-green-500 mt-0.5" /> Instant service deductions</li>
                <li className="flex items-start gap-2 text-slate-700"><Check size={18} className="text-green-500 mt-0.5" /> Transparent transaction history</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Feature 3: Super Anchor Hierarchy */}
        <section className="section-pad bg-slate-50" id="hierarchy">
          <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center reveal">
            <div>
              <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#002366]/10 text-[#002366]">
                <Network size={24} />
              </div>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Built for Scale with Users</h2>
              <p className="text-lg text-slate-600 mb-6">
                Scale your operations securely. The Super Anchor hierarchy allows you to create and manage multiple Users (child accounts) for different branches, regions, or teams, each with their own isolated customer base.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2 text-slate-700"><Check size={18} className="text-green-500 mt-0.5" /> Multi-tier account hierarchy</li>
                <li className="flex items-start gap-2 text-slate-700"><Check size={18} className="text-green-500 mt-0.5" /> Independent Anchor access</li>
                <li className="flex items-start gap-2 text-slate-700"><Check size={18} className="text-green-500 mt-0.5" /> Global oversight from the top level</li>
              </ul>
            </div>
            <div className="h-[400px] w-full relative">
              <HierarchyMontage />
            </div>
          </div>
        </section>
        
        
        {/* Feature 4: Comprehensive Service Reports */}
        <section className="section-pad bg-white" id="reports">
          <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center reveal">
            <div className="h-[400px] w-full relative order-2 md:order-1">
              <ReportsMontage />
            </div>
            <div className="order-1 md:order-2">
              <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#002366]/10 text-[#002366]">
                <FileCheck2 size={24} />
              </div>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Comprehensive Verification Services</h2>
              <p className="text-lg text-slate-600 mb-6">
                Equip your underwriting team with a complete suite of verification tools. The Anchor portal provides instant access to detailed reports for BSA, GST, ITR, and CIBIL across all your managed customers.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2 text-slate-700"><Check size={18} className="text-green-500 mt-0.5" /> <strong>BSA:</strong> In-depth bank statement analysis</li>
                <li className="flex items-start gap-2 text-slate-700"><Check size={18} className="text-green-500 mt-0.5" /> <strong>GST & ITR:</strong> Complete tax and business intelligence</li>
                <li className="flex items-start gap-2 text-slate-700"><Check size={18} className="text-green-500 mt-0.5" /> <strong>CIBIL:</strong> Full credit history and scoring</li>
              </ul>
            </div>
          </div>
        </section>
        
        
        {/* Feature 5: How to Use Services */}
        <section className="section-pad bg-slate-50 border-t border-slate-200" id="how-to-use">
          <div className="max-w-6xl mx-auto px-6 reveal">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">How to Use CRISP Services</h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Our platform streamlines data collection and analysis. Access critical financial intelligence with just a few clicks.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* BSA */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow flex flex-col">
                {/* Mini UI Mockup */}
                <div className="w-full h-32 bg-slate-50 rounded-lg border border-slate-100 mb-6 overflow-hidden flex flex-col p-3 shadow-inner relative">
                  <div className="flex justify-between items-center mb-2">
                    <div className="h-2 w-16 bg-slate-200 rounded"></div>
                    <div className="h-2 w-8 bg-blue-200 rounded"></div>
                  </div>
                  <div className="space-y-1.5 flex-1">
                    <div className="flex justify-between items-center text-[10px] text-slate-500 bg-white p-1.5 rounded shadow-sm">
                      <span>Salary Credit</span><span className="text-green-500 font-medium">+?45,000</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] text-slate-500 bg-white p-1.5 rounded shadow-sm">
                      <span>EMI Payment</span><span className="text-red-500 font-medium">-?12,400</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] text-slate-500 bg-white p-1.5 rounded shadow-sm">
                      <span>UPI Transfer</span><span className="text-red-500 font-medium">-?850</span>
                    </div>
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-slate-900 mb-2 flex items-center gap-2"><Landmark size={20} className="text-blue-600"/> BSA</h3>
                <p className="text-slate-600 mb-4 text-sm font-medium">Bank Statement Analysis</p>
                <ul className="space-y-2 text-sm text-slate-500 flex-1">
                  <li className="flex items-start gap-2"><Check size={16} className="text-green-500 shrink-0 mt-0.5" /> Upload statement PDF or Fetch via Aggregator</li>
                  <li className="flex items-start gap-2"><Check size={16} className="text-green-500 shrink-0 mt-0.5" /> View EOD Analysis & Loan Transactions</li>
                  <li className="flex items-start gap-2"><Check size={16} className="text-green-500 shrink-0 mt-0.5" /> Generate Monthly Overview summaries</li>
                </ul>
              </div>

              {/* GST */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow flex flex-col">
                {/* Mini UI Mockup */}
                <div className="w-full h-32 bg-slate-50 rounded-lg border border-slate-100 mb-6 overflow-hidden flex flex-col p-3 shadow-inner relative">
                  <div className="flex gap-2 mb-3">
                    <div className="h-6 flex-1 bg-white border border-slate-200 rounded flex items-center px-2">
                      <span className="text-[9px] text-slate-400">Enter GSTIN...</span>
                    </div>
                    <div className="h-6 w-12 bg-[#002366] rounded flex items-center justify-center">
                      <span className="text-[9px] text-white">Verify</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center border-b border-slate-200 pb-1 mb-1">
                    <span className="text-[9px] font-semibold text-slate-600">GSTR-3B</span>
                    <span className="text-[9px] text-green-500 bg-green-50 px-1 rounded">Filed</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] font-semibold text-slate-600">GSTR-1</span>
                    <span className="text-[9px] text-green-500 bg-green-50 px-1 rounded">Filed</span>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-slate-900 mb-2 flex items-center gap-2"><FileText size={20} className="text-blue-600"/> GST</h3>
                <p className="text-slate-600 mb-4 text-sm font-medium">Goods and Services Tax</p>
                <ul className="space-y-2 text-sm text-slate-500 flex-1">
                  <li className="flex items-start gap-2"><Check size={16} className="text-green-500 shrink-0 mt-0.5" /> Run instant GSTIN verification</li>
                  <li className="flex items-start gap-2"><Check size={16} className="text-green-500 shrink-0 mt-0.5" /> Check return filing history & compliance</li>
                  <li className="flex items-start gap-2"><Check size={16} className="text-green-500 shrink-0 mt-0.5" /> Open or export completed GSTR reports</li>
                </ul>
              </div>

              {/* ITR */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow flex flex-col">
                {/* Mini UI Mockup */}
                <div className="w-full h-32 bg-slate-50 rounded-lg border border-slate-100 mb-6 overflow-hidden flex flex-col p-3 shadow-inner relative">
                  <div className="w-full bg-white rounded shadow-sm border border-slate-100 flex overflow-hidden h-full">
                    <div className="w-1/2 p-2 border-r border-slate-100 flex flex-col">
                      <div className="h-2 w-10 bg-slate-200 rounded mb-2"></div>
                      <div className="flex justify-between mb-1"><div className="h-1.5 w-12 bg-slate-100"></div><div className="h-1.5 w-6 bg-slate-200"></div></div>
                      <div className="flex justify-between"><div className="h-1.5 w-8 bg-slate-100"></div><div className="h-1.5 w-8 bg-slate-200"></div></div>
                    </div>
                    <div className="w-1/2 p-2 flex flex-col">
                      <div className="h-2 w-12 bg-slate-200 rounded mb-2"></div>
                      <div className="flex justify-between mb-1"><div className="h-1.5 w-10 bg-slate-100"></div><div className="h-1.5 w-8 bg-slate-200"></div></div>
                      <div className="flex justify-between"><div className="h-1.5 w-14 bg-slate-100"></div><div className="h-1.5 w-5 bg-slate-200"></div></div>
                    </div>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-slate-900 mb-2 flex items-center gap-2"><FileSearch size={20} className="text-blue-600"/> ITR</h3>
                <p className="text-slate-600 mb-4 text-sm font-medium">Income Tax Return</p>
                <ul className="space-y-2 text-sm text-slate-500 flex-1">
                  <li className="flex items-start gap-2"><Check size={16} className="text-green-500 shrink-0 mt-0.5" /> Upload ITR Acknowledgement or XML files</li>
                  <li className="flex items-start gap-2"><Check size={16} className="text-green-500 shrink-0 mt-0.5" /> View detailed Tax Calculations</li>
                  <li className="flex items-start gap-2"><Check size={16} className="text-green-500 shrink-0 mt-0.5" /> Access Balance Sheet & Ratio Analysis</li>
                </ul>
              </div>

              {/* CIBIL */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow flex flex-col">
                {/* Mini UI Mockup */}
                <div className="w-full h-32 bg-slate-50 rounded-lg border border-slate-100 mb-6 overflow-hidden flex flex-col items-center justify-center p-3 shadow-inner relative">
                  <div className="w-16 h-16 rounded-full border-4 border-[#002366] border-b-slate-200 flex flex-col items-center justify-center bg-white shadow-sm mb-2 transform -rotate-45">
                    <div className="transform rotate-45 flex flex-col items-center">
                      <span className="text-[12px] font-bold text-[#002366] leading-none">750</span>
                      <span className="text-[6px] text-slate-400">SCORE</span>
                    </div>
                  </div>
                  <div className="h-2 w-20 bg-slate-200 rounded"></div>
                </div>

                <h3 className="text-xl font-bold text-slate-900 mb-2 flex items-center gap-2"><Fingerprint size={20} className="text-blue-600"/> CIBIL</h3>
                <p className="text-slate-600 mb-4 text-sm font-medium">Credit Bureau Verification</p>
                <ul className="space-y-2 text-sm text-slate-500 flex-1">
                  <li className="flex items-start gap-2"><Check size={16} className="text-green-500 shrink-0 mt-0.5" /> Submit subject identity details</li>
                  <li className="flex items-start gap-2"><Check size={16} className="text-green-500 shrink-0 mt-0.5" /> Verify identity via seamless OTP</li>
                  <li className="flex items-start gap-2"><Check size={16} className="text-green-500 shrink-0 mt-0.5" /> Export full credit report sections</li>
                </ul>
              </div>

              {/* Money */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow flex flex-col">
                {/* Mini UI Mockup */}
                <div className="w-full h-32 bg-slate-50 rounded-lg border border-slate-100 mb-6 overflow-hidden flex flex-col gap-1.5 p-3 shadow-inner relative">
                  <div className="flex-1 bg-gradient-to-r from-blue-100 to-blue-50 rounded border border-blue-100 flex items-center px-2 shadow-sm">
                    <span className="text-[9px] font-semibold text-[#002366]">Rectify Money</span>
                  </div>
                  <div className="flex-1 bg-gradient-to-r from-emerald-100 to-emerald-50 rounded border border-emerald-100 flex items-center px-2 shadow-sm">
                    <span className="text-[9px] font-semibold text-emerald-800">Save Money</span>
                  </div>
                  <div className="flex-1 bg-gradient-to-r from-purple-100 to-purple-50 rounded border border-purple-100 flex items-center px-2 shadow-sm">
                    <span className="text-[9px] font-semibold text-purple-800">Access Money</span>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-slate-900 mb-2 flex items-center gap-2"><IndianRupee size={20} className="text-blue-600"/> Money</h3>
                <p className="text-slate-600 mb-4 text-sm font-medium">Financial Offerings</p>
                <ul className="space-y-2 text-sm text-slate-500 flex-1">
                  <li className="flex items-start gap-2"><Check size={16} className="text-green-500 shrink-0 mt-0.5" /> <strong>Rectify Money:</strong> Automated reconciliation</li>
                  <li className="flex items-start gap-2"><Check size={16} className="text-green-500 shrink-0 mt-0.5" /> <strong>Save Money:</strong> High-yield structures</li>
                  <li className="flex items-start gap-2"><Check size={16} className="text-green-500 shrink-0 mt-0.5" /> <strong>Access Money:</strong> Instant liquidity tools</li>
                </ul>
              </div>
            </div>
          </div>
        </section>


          
        
        {/* Users Directory Section */}
        <section className="section-pad bg-slate-50 border-t border-slate-200" id="view-users">
          <div className="max-w-7xl mx-auto px-6 reveal">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Manage User Organizations</h2>
              <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                Before analyzing individual customers, organize your hierarchy. Create, filter, and manage high-level User organizations seamlessly from your Anchor View dashboard.
              </p>
            </div>

            <div className="relative w-full mx-auto bg-slate-200/50 p-4 md:p-8 rounded-3xl overflow-x-auto">
              {/* Dashboard Mockup */}
              <div className="bg-[#f8fafc] rounded-2xl shadow-2xl overflow-hidden border border-slate-200 min-w-[900px]">
                {/* Header Navbar */}
                <div className="bg-white px-6 py-4 flex justify-between items-center border-b border-slate-200">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-[#001845] rounded-lg flex items-center justify-center font-bold text-white">C</div>
                      <span className="font-bold text-xl text-[#001845]">CRISP</span>
                    </div>
                    <div className="h-6 w-px bg-slate-200"></div>
                    <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-xs font-bold">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> Anchor View
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-xs font-bold text-slate-900">Himalaya</p>
                      <p className="text-[10px] text-slate-500">HWC-r1</p>
                    </div>
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-bold">H</div>
                  </div>
                </div>

                <div className="p-8">
                  {/* Page Header */}
                  <div className="flex justify-between items-end mb-8">
                    <div>
                      <h3 className="text-2xl font-bold text-slate-900 mb-1">Users Directory</h3>
                      <p className="text-sm text-slate-500">Manage and view all registered User organizations</p>
                    </div>
                    <div className="px-4 py-2 bg-[#001845] hover:bg-blue-900 transition-colors text-white rounded-lg text-xs font-bold flex items-center gap-2 shadow-sm cursor-pointer">
                      <span>+</span> Create User
                    </div>
                  </div>

                  {/* Filters */}
                  <div className="mb-6">
                    <h5 className="text-[10px] font-bold text-slate-900 uppercase tracking-widest mb-3">Filter Users</h5>
                    <div className="grid grid-cols-6 gap-3">
                      <div>
                        <label className="text-[10px] text-slate-600 mb-1 block">User Name</label>
                        <div className="bg-white border border-slate-200 rounded p-2 text-[10px] text-slate-400">Search Name...</div>
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-600 mb-1 block">User Code</label>
                        <div className="bg-white border border-slate-200 rounded p-2 text-[10px] text-slate-400">Search Code...</div>
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-600 mb-1 block">Login ID</label>
                        <div className="bg-white border border-slate-200 rounded p-2 text-[10px] text-slate-400">Search Login ID...</div>
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-600 mb-1 block">Status</label>
                        <div className="bg-white border border-slate-200 rounded p-2 text-[10px] text-slate-600 flex justify-between items-center">
                          <span>All Statuses</span>
                          <ChevronDown size={10} />
                        </div>
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-600 mb-1 block">Created By</label>
                        <div className="bg-white border border-slate-200 rounded p-2 text-[10px] text-slate-400">Search Creator ID...</div>
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-600 mb-1 block">Updated By</label>
                        <div className="bg-white border border-slate-200 rounded p-2 text-[10px] text-slate-400">Search Updater ID...</div>
                      </div>
                    </div>
                  </div>

                  {/* Table */}
                  <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead className="text-[9px] text-slate-400 font-bold uppercase tracking-widest border-b border-slate-100 bg-slate-50">
                        <tr>
                          <th className="py-4 px-6">User Name</th>
                          <th className="py-4 px-6">User Code</th>
                          <th className="py-4 px-6">Login ID</th>
                          <th className="py-4 px-6">Status</th>
                          <th className="py-4 px-6">Role</th>
                          <th className="py-4 px-6">Created At</th>
                          <th className="py-4 px-6">Created By</th>
                          <th className="py-4 px-6 text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody className="text-slate-800">
                        <tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                          <td className="py-4 px-6 font-bold text-slate-900">himalaya</td>
                          <td className="py-4 px-6 font-bold text-[#001845]">HWC-r1</td>
                          <td className="py-4 px-6 text-slate-500">12346</td>
                          <td className="py-4 px-6"><span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-full text-[9px] font-bold"><div className="w-1 h-1 rounded-full bg-emerald-500"></div> Active</span></td>
                          <td className="py-4 px-6 text-slate-500 text-[10px]">USERS</td>
                          <td className="py-4 px-6 text-slate-500 text-[10px]">8/18/2026, 3:22:41 PM</td>
                          <td className="py-4 px-6 text-slate-500 text-[10px]">6a830fd97ac...</td>
                          <td className="py-4 px-6 text-center text-slate-400"><Eye size={14} className="mx-auto cursor-pointer hover:text-slate-900"/></td>
                        </tr>
                        <tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                          <td className="py-4 px-6 font-bold text-slate-900">prathamesh</td>
                          <td className="py-4 px-6 font-bold text-[#001845]">HWC-r1</td>
                          <td className="py-4 px-6 text-slate-500">c7319</td>
                          <td className="py-4 px-6"><span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-full text-[9px] font-bold"><div className="w-1 h-1 rounded-full bg-emerald-500"></div> Active</span></td>
                          <td className="py-4 px-6 text-slate-500 text-[10px]">USERS</td>
                          <td className="py-4 px-6 text-slate-500 text-[10px]">8/21/2026, 4:26:48 PM</td>
                          <td className="py-4 px-6 text-slate-500 text-[10px]">6a840d97aca...</td>
                          <td className="py-4 px-6 text-center text-slate-400"><Eye size={14} className="mx-auto cursor-pointer hover:text-slate-900"/></td>
                        </tr>
                        <tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                          <td className="py-4 px-6 font-bold text-slate-900">admin-1</td>
                          <td className="py-4 px-6 font-bold text-[#001845]">HWC-r1</td>
                          <td className="py-4 px-6 text-slate-500">09bfc</td>
                          <td className="py-4 px-6"><span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-full text-[9px] font-bold"><div className="w-1 h-1 rounded-full bg-emerald-500"></div> Active</span></td>
                          <td className="py-4 px-6 text-slate-500 text-[10px]">USERS</td>
                          <td className="py-4 px-6 text-slate-500 text-[10px]">8/30/2026, 4:35:23 PM</td>
                          <td className="py-4 px-6 text-slate-500 text-[10px]">6a8748fba87...</td>
                          <td className="py-4 px-6 text-center text-slate-400"><Eye size={14} className="mx-auto cursor-pointer hover:text-slate-900"/></td>
                        </tr>
                        <tr className="hover:bg-slate-50 transition-colors">
                          <td className="py-4 px-6 font-bold text-slate-900">Ramakanth Gupta</td>
                          <td className="py-4 px-6 font-bold text-[#001845]">HWC-r1</td>
                          <td className="py-4 px-6 text-slate-500">3879b</td>
                          <td className="py-4 px-6"><span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-full text-[9px] font-bold"><div className="w-1 h-1 rounded-full bg-emerald-500"></div> Active</span></td>
                          <td className="py-4 px-6 text-slate-500 text-[10px]">USERS</td>
                          <td className="py-4 px-6 text-slate-500 text-[10px]">9/9/2026, 4:30:37 PM</td>
                          <td className="py-4 px-6 text-slate-500 text-[10px]">6a8748fba87...</td>
                          <td className="py-4 px-6 text-center text-slate-400"><Eye size={14} className="mx-auto cursor-pointer hover:text-slate-900"/></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

          {/* BSA Workflow Section */}
        <section className="section-pad bg-white border-t border-slate-200" id="view-bsa">
          <div className="max-w-6xl mx-auto px-6 reveal">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">How to Use BSA Services</h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                A simple three-step process to onboard customers and generate comprehensive bank statement analysis.
              </p>
            </div>

            <div className="space-y-24">
              {/* Step 1: Add Customer */}
              <div className="flex flex-col md:flex-row items-center gap-12">
                <div className="md:w-1/2 order-2 md:order-1">
                  <div className="relative w-full max-w-md mx-auto bg-slate-200/50 p-6 rounded-2xl">
                    {/* Add Customer Modal Mockup */}
                    <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-slate-200">
                      <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                        <div>
                          <h4 className="font-bold text-[#002366]">Add New Customer</h4>
                          <p className="text-[10px] text-slate-500">Create a new customer profile and allocate audit credits</p>
                        </div>
                        <div className="text-slate-400"></div>
                      </div>
                      <div className="p-5 space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="text-[9px] font-semibold text-slate-600">Customer Name *</label>
                            <div className="h-8 border border-slate-200 rounded px-2 flex items-center"><span className="text-[10px] text-slate-400">Enter Customer Name</span></div>
                          </div>
                          <div className="space-y-1">
                            <label className="text-[9px] font-semibold text-slate-600">Mobile Number *</label>
                            <div className="h-8 border border-slate-200 rounded px-2 flex items-center gap-2"><Smartphone size={10} className="text-slate-400"/><span className="text-[10px] text-slate-400">E.g., 9876543210</span></div>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-semibold text-slate-600">Company Name</label>
                          <div className="h-8 border border-slate-200 rounded px-2 flex items-center"><span className="text-[10px] text-slate-400">E.g., ABC Pvt Ltd</span></div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="text-[9px] font-semibold text-slate-600">Email ID *</label>
                            <div className="h-8 border border-slate-200 rounded px-2 flex items-center"><span className="text-[10px] text-slate-400">E.g., name@domain.com</span></div>
                          </div>
                          <div className="space-y-1">
                            <label className="text-[9px] font-semibold text-slate-600">Password *</label>
                            <div className="h-8 border border-slate-200 rounded px-2 flex items-center justify-between"><span className="text-[10px] text-slate-400">Enter account password</span><Eye size={10} className="text-slate-400"/></div>
                          </div>
                        </div>
                        <div className="flex justify-end gap-2 pt-2">
                          <div className="px-4 py-1.5 border border-slate-200 rounded text-[11px] font-medium text-slate-600">Cancel</div>
                          <div className="px-4 py-1.5 bg-[#002366] rounded text-[11px] font-medium text-white">Create Customer</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="md:w-1/2 order-1 md:order-2 space-y-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xl">1</div>
                  <h3 className="text-2xl font-bold text-slate-900">Add New Customer</h3>
                  <p className="text-slate-600 text-lg">
                    Begin by creating a dedicated profile for your customer. Enter their basic details like Name, Mobile, Email, and Company. This securely provisions their space in the CRISP ecosystem.
                  </p>
                </div>
              </div>

              {/* Step 2: Upload Statement */}
              <div className="flex flex-col md:flex-row items-center gap-12">
                <div className="md:w-1/2 space-y-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xl">2</div>
                  <h3 className="text-2xl font-bold text-slate-900">Upload Bank Statement</h3>
                  <p className="text-slate-600 text-lg">
                    Once the customer is created, easily upload their bank statements for analysis. Select the bank, specify the account type, and provide any required file passwords. Our engine will immediately begin processing.
                  </p>
                </div>
                <div className="md:w-1/2">
                  <div className="relative w-full max-w-md mx-auto bg-slate-200/50 p-6 rounded-2xl">
                    {/* Upload Modal Mockup */}
                    <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-slate-200">
                      <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <UploadCloud size={16} className="text-[#002366]" />
                          <h4 className="font-bold text-[#002366]">Upload Bank Statement</h4>
                        </div>
                        <div className="text-slate-400"></div>
                      </div>
                      <div className="p-5 space-y-3">
                        <div>
                          <p className="text-[10px] text-slate-500">Provide details and upload your bank statement for analysis</p>
                          <p className="text-[10px] font-semibold text-[#002366]">Creating for Customer: 69e539ec4a...</p>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="text-[9px] font-semibold text-[#002366]">Company Type *</label>
                            <div className="h-8 border border-slate-200 rounded px-2 flex items-center justify-between"><span className="text-[10px] text-slate-500">Select Company Type</span><ChevronDown size={10} className="text-slate-400"/></div>
                          </div>
                          <div className="space-y-1">
                            <label className="text-[9px] font-semibold text-[#002366]">Account Type *</label>
                            <div className="h-8 border border-slate-200 rounded px-2 flex items-center justify-between"><span className="text-[10px] text-slate-500">Select Account Type</span><ChevronDown size={10} className="text-slate-400"/></div>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-semibold text-[#002366]">Account Number *</label>
                          <div className="h-8 border border-slate-200 rounded px-2 flex items-center"><span className="text-[10px] text-slate-400">Enter account number</span></div>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-semibold text-[#002366]">Select Bank *</label>
                          <div className="h-8 border border-slate-200 rounded px-2 flex items-center justify-between"><span className="text-[10px] text-slate-400">Select a bank</span><ChevronDown size={10} className="text-slate-400"/></div>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-semibold text-[#002366]">File Password <span className="text-slate-400 font-normal">(Optional)</span></label>
                          <div className="h-8 border border-slate-200 rounded px-2 flex items-center"><span className="text-[10px] text-slate-400">Enter password if statement is protected</span></div>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-semibold text-[#002366]">Statement Files *</label>
                          <div className="h-8 border border-slate-200 rounded px-2 flex items-center gap-2">
                            <div className="bg-[#f0f4f8] text-[#002366] px-2 py-0.5 rounded text-[9px] font-medium border border-blue-100">Choose Files</div>
                            <span className="text-[10px] text-slate-400">No file chosen</span>
                          </div>
                        </div>
                        <div className="pt-2">
                          <div className="w-full py-2 bg-[#002366] rounded flex justify-center text-[11px] font-medium text-white">Upload & Analyze</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 3: View Reports */}
              <div className="flex flex-col md:flex-row items-center gap-12">
                <div className="md:w-1/2 order-2 md:order-1">
                  <div className="relative w-full max-w-md mx-auto bg-slate-200/50 p-6 rounded-2xl">
                    {/* BSA Reports Mockup */}
                    <div className="bg-[#f8fafc] rounded-xl shadow-xl overflow-hidden border border-slate-200 h-64 flex flex-col">
                      <div className="p-4 bg-white border-b border-slate-100 flex justify-between items-center">
                        <div>
                          <h4 className="font-bold text-[#002366] text-sm">BSA Reports</h4>
                          <p className="text-[9px] text-slate-500">Bank Statement Analysis Reports</p>
                        </div>
                        <div className="px-3 py-1.5 bg-[#002366] rounded text-[9px] font-medium text-white flex items-center gap-1">
                          <span>+</span> Create New BSA Report
                        </div>
                      </div>
                      <div className="p-4 flex-1 overflow-hidden">
                        <div className="bg-white rounded-lg border border-slate-200 h-full p-4 flex flex-col">
                          <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-2">
                            <h5 className="font-bold text-[#002366] text-xs">Accounts List</h5>
                            <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full text-[9px]">2 accounts</span>
                          </div>
                          <div className="flex gap-3 overflow-hidden">
                            {/* Account Card 1 */}
                            <div className="flex-1 border border-slate-200 rounded-lg p-3 relative">
                              <div className="absolute top-3 right-3 px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-full text-[8px] font-medium">Active</div>
                              <div className="w-8 h-8 bg-slate-100 rounded flex items-center justify-center mb-4">
                                <CreditCard size={14} className="text-[#002366]" />
                              </div>
                              <p className="text-[8px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Bank Name</p>
                              <p className="text-[11px] font-bold text-slate-900 mb-2 truncate">State Bank of India</p>
                              <div className="flex justify-between">
                                <div>
                                  <p className="text-[8px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Account Number</p>
                                  <p className="text-[9px] font-bold text-slate-900">41778636503</p>
                                </div>
                                <div className="text-right">
                                  <p className="text-[8px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Entity Type</p>
                                  <p className="text-[9px] font-bold text-slate-900">Individual</p>
                                </div>
                              </div>
                            </div>
                            {/* Account Card 2 */}
                            <div className="flex-1 border border-slate-200 rounded-lg p-3 relative">
                              <div className="absolute top-3 right-3 px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-full text-[8px] font-medium">Active</div>
                              <div className="w-8 h-8 bg-slate-100 rounded flex items-center justify-center mb-4">
                                <CreditCard size={14} className="text-[#002366]" />
                              </div>
                              <p className="text-[8px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Bank Name</p>
                              <p className="text-[11px] font-bold text-slate-900 mb-2 truncate">DBS Bank</p>
                              <div className="flex justify-between">
                                <div>
                                  <p className="text-[8px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Account Number</p>
                                  <p className="text-[9px] font-bold text-slate-900">820200286657</p>
                                </div>
                                <div className="text-right">
                                  <p className="text-[8px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Entity Type</p>
                                  <p className="text-[9px] font-bold text-slate-900">Partnership</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="md:w-1/2 order-1 md:order-2 space-y-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xl">3</div>
                  <h3 className="text-2xl font-bold text-slate-900">View Active Reports</h3>
                  <p className="text-slate-600 text-lg">
                    Access the generated BSA reports through a clean, unified dashboard. Track multiple accounts for a single customer, monitor their active status, and dive deep into their underwriting intelligence.
                  </p>
                </div>
              </div>

            
              {/* Step 4: Available Reports */}
              <div className="flex flex-col md:flex-row items-center gap-12">
                <div className="md:w-1/2 space-y-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xl">4</div>
                  <h3 className="text-2xl font-bold text-slate-900">Select Available Reports</h3>
                  <p className="text-slate-600 text-lg">
                    Dive into specific financial metrics by selecting from our comprehensive suite of reports, including EOD Analysis, Cash Flow, Loan Transactions, and Monthly Overviews.
                  </p>
                </div>
                <div className="md:w-1/2">
                  <div className="relative w-full max-w-lg mx-auto bg-slate-200/50 p-6 rounded-2xl">
                    {/* Available Reports Mockup */}
                    <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-slate-200 p-4">
                      <div className="flex gap-4">
                        {/* Left Column */}
                        <div className="flex-1 border border-slate-200 rounded-lg p-3">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h4 className="font-bold text-slate-900 text-[11px]">Available Reports</h4>
                              <p className="text-[8px] text-slate-500">Select a report to continue</p>
                            </div>
                            <div className="flex gap-1">
                              <div className="px-2 py-1 bg-[#002366] rounded text-[8px] text-white flex items-center gap-1"><Download size={8} /> Export</div>
                              <div className="px-2 py-1 bg-[#002366] rounded text-[8px] text-white">Back</div>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between p-2 bg-slate-50 border border-slate-100 rounded-lg cursor-pointer hover:bg-slate-100">
                              <div className="flex items-center gap-2"><div className="w-6 h-6 bg-slate-200/50 rounded flex items-center justify-center text-[#002366]"><FileText size={10} /></div><span className="text-[10px] font-medium text-slate-700">Overview</span></div>
                              <ChevronRight size={10} className="text-slate-400" />
                            </div>
                            <div className="flex items-center justify-between p-2 bg-slate-50 border border-slate-100 rounded-lg cursor-pointer hover:bg-slate-100">
                              <div className="flex items-center gap-2"><div className="w-6 h-6 bg-slate-200/50 rounded flex items-center justify-center text-[#002366]"><BarChart2 size={10} /></div><span className="text-[10px] font-medium text-slate-700">EOD Analysis</span></div>
                              <ChevronRight size={10} className="text-slate-400" />
                            </div>
                            <div className="flex items-center justify-between p-2 bg-slate-50 border border-slate-100 rounded-lg cursor-pointer hover:bg-slate-100">
                              <div className="flex items-center gap-2"><div className="w-6 h-6 bg-slate-200/50 rounded flex items-center justify-center text-[#002366]"><ArrowLeftRight size={10} /></div><span className="text-[10px] font-medium text-slate-700">Loan Transactions</span></div>
                              <ChevronRight size={10} className="text-slate-400" />
                            </div>
                          </div>
                        </div>
                        {/* Right Column */}
                        <div className="flex-1 border border-slate-200 rounded-lg p-3">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h4 className="font-bold text-slate-900 text-[11px]">Available Reports</h4>
                              <p className="text-[8px] text-slate-500">Select a report to continue</p>
                            </div>
                            <div className="flex gap-1">
                              <div className="px-2 py-1 bg-[#002366] rounded text-[8px] text-white flex items-center gap-1"><Download size={8} /> Export</div>
                              <div className="px-2 py-1 bg-[#002366] rounded text-[8px] text-white">Back</div>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between p-2 bg-slate-50 border border-slate-100 rounded-lg cursor-pointer hover:bg-slate-100">
                              <div className="flex items-center gap-2"><div className="w-6 h-6 bg-slate-200/50 rounded flex items-center justify-center text-[#002366]"><Activity size={10} /></div><span className="text-[10px] font-medium text-slate-700">Summary of Debit and Credit</span></div>
                              <ChevronRight size={10} className="text-slate-400" />
                            </div>
                            <div className="flex items-center justify-between p-2 bg-slate-50 border border-slate-100 rounded-lg cursor-pointer hover:bg-slate-100">
                              <div className="flex items-center gap-2"><div className="w-6 h-6 bg-slate-200/50 rounded flex items-center justify-center text-[#002366]"><ArrowRightLeft size={10} /></div><span className="text-[10px] font-medium text-slate-700">Cash Flow</span></div>
                              <ChevronRight size={10} className="text-slate-400" />
                            </div>
                            <div className="flex items-center justify-between p-2 bg-slate-50 border border-slate-100 rounded-lg cursor-pointer hover:bg-slate-100">
                              <div className="flex items-center gap-2"><div className="w-6 h-6 bg-slate-200/50 rounded flex items-center justify-center text-[#002366]"><PieChart size={10} /></div><span className="text-[10px] font-medium text-slate-700">Monthly Overview</span></div>
                              <ChevronRight size={10} className="text-slate-400" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 5: Filters */}
              <div className="flex flex-col md:flex-row items-center gap-12">
                <div className="md:w-1/2 order-2 md:order-1">
                  <div className="relative w-full max-w-lg mx-auto bg-slate-200/50 p-6 rounded-2xl">
                    {/* Filters Mockup */}
                    <div className="bg-white rounded-xl shadow-xl border border-slate-200 p-4">
                      <div className="flex items-end gap-3 mb-2">
                        <div className="flex-1 space-y-1">
                          <label className="text-[10px] font-semibold text-slate-700">From Date</label>
                          <div className="h-8 border border-slate-200 rounded-lg px-2 flex items-center gap-2">
                            <Calendar size={12} className="text-[#002366]" />
                            <span className="text-[11px] text-[#002366]">January 1st, 2026</span>
                          </div>
                        </div>
                        <div className="flex-1 space-y-1">
                          <label className="text-[10px] font-semibold text-slate-700">To Date</label>
                          <div className="h-8 border border-slate-200 rounded-lg px-2 flex items-center gap-2">
                            <Calendar size={12} className="text-[#002366]" />
                            <span className="text-[11px] text-[#002366]">August 4th, 2026</span>
                          </div>
                        </div>
                        <div className="h-8 px-4 bg-[#002366] rounded-lg text-[11px] font-medium text-white flex items-center justify-center gap-1.5 cursor-pointer">
                          <Filter size={10} /> Apply Filter
                        </div>
                        <div className="h-8 px-4 border border-slate-200 rounded-lg text-[11px] font-medium text-slate-700 flex items-center justify-center gap-1.5 cursor-pointer hover:bg-slate-50">
                          <X size={10} /> Clear
                        </div>
                      </div>
                      <p className="text-[8px] text-slate-400">* You can select a maximum date range of 12 months. Available data range: January 1st, 2026 to August 4th, 2026.</p>
                    </div>
                  </div>
                </div>
                <div className="md:w-1/2 order-1 md:order-2 space-y-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xl">5</div>
                  <h3 className="text-2xl font-bold text-slate-900">Apply Duration Filters</h3>
                  <p className="text-slate-600 text-lg">
                    Narrow down your analysis to exactly the time period you need. Instantly filter data between specific dates to track precise cash flow changes over time.
                  </p>
                </div>
              </div>

              {/* Step 6: Sample Report */}
              <div className="flex flex-col md:flex-row items-center gap-12">
                <div className="md:w-1/2 space-y-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xl">6</div>
                  <h3 className="text-2xl font-bold text-slate-900">Analyze Financial Data</h3>
                  <p className="text-slate-600 text-lg">
                    View beautifully structured, intelligent breakdowns of cash deposits, online receipts, and comprehensive category tracking, spread dynamically across your selected months.
                  </p>
                </div>
                <div className="md:w-1/2">
                  <div className="relative w-full max-w-xl mx-auto bg-slate-200/50 p-6 rounded-2xl overflow-x-auto">
                    {/* Table Mockup */}
                    <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-slate-200 min-w-[500px]">
                      <div className="p-3 border-b border-slate-100 flex justify-between items-center">
                        <div>
                          <h4 className="font-bold text-slate-900 text-xs">Summary of Debit and Credit</h4>
                          <p className="text-[9px] text-slate-500">From January 1st, 2026 To August 4th, 2026</p>
                        </div>
                        <div className="px-2 py-1 border border-slate-200 rounded text-[9px] text-slate-700 flex items-center gap-1">
                          <RefreshCw size={8} /> Refresh
                        </div>
                      </div>
                      <div className="w-full">
                        <table className="w-full text-[8px] text-right">
                          <thead>
                            <tr className="bg-[#001845] text-white">
                              <th className="py-1.5 px-2 text-left font-medium">Particulars</th>
                              <th className="py-1.5 px-2 font-medium">Overall/Total</th>
                              <th className="py-1.5 px-2 font-medium">Jan 2026</th>
                              <th className="py-1.5 px-2 font-medium">Feb 2026</th>
                              <th className="py-1.5 px-2 font-medium text-slate-400 font-normal">...</th>
                            </tr>
                          </thead>
                          <tbody className="text-slate-700">
                            <tr className="border-b border-slate-100">
                              <td className="py-1.5 px-2 text-left font-medium">Cash Deposit</td>
                              <td className="py-1.5 px-2 font-bold">?10,000.00</td>
                              <td className="py-1.5 px-2">?0.00</td>
                              <td className="py-1.5 px-2">?10,000.00</td>
                              <td className="py-1.5 px-2 text-slate-400">-</td>
                            </tr>
                            <tr className="border-b border-slate-100">
                              <td className="py-1.5 px-2 text-left font-medium">Online Receipts</td>
                              <td className="py-1.5 px-2 font-bold">?5,62,360.34</td>
                              <td className="py-1.5 px-2">?14,713.00</td>
                              <td className="py-1.5 px-2">?23,496.97</td>
                              <td className="py-1.5 px-2 text-slate-400">-</td>
                            </tr>
                            <tr className="border-b border-slate-100">
                              <td className="py-1.5 px-2 text-left font-medium">Other Receipts</td>
                              <td className="py-1.5 px-2 font-bold">?800.00</td>
                              <td className="py-1.5 px-2">?0.00</td>
                              <td className="py-1.5 px-2">?0.00</td>
                              <td className="py-1.5 px-2 text-slate-400">-</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

          
        {/* GST Workflow Section */}
        <section className="section-pad bg-slate-50 border-t border-slate-200" id="view-gst">
          <div className="max-w-6xl mx-auto px-6 reveal">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">How to Use GST Services</h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Instantly fetch, authenticate, and analyze GST data to measure compliance and trace business supply chains.
              </p>
            </div>

            <div className="space-y-24">
              {/* Step 1: Add GSTIN */}
              <div className="flex flex-col md:flex-row items-center gap-12">
                <div className="md:w-1/2 order-2 md:order-1">
                  <div className="relative w-full max-w-md mx-auto bg-slate-200/50 p-6 rounded-2xl">
                    {/* Add GSTIN Modal Mockup */}
                    <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-slate-200">
                      <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                        <h4 className="font-bold text-[#002366] text-lg">Add New GSTIN</h4>
                      </div>
                      <div className="p-5 space-y-4">
                        <p className="text-xs text-slate-500 leading-relaxed">
                          Enter the new Goods and Services Tax Identification Number (GSTIN) you would like to analyze.
                        </p>
                        <div className="space-y-2">
                          <label className="text-[11px] font-semibold text-[#002366]">GSTIN Number</label>
                          <div className="h-10 border-2 border-slate-900 rounded-lg px-3 flex items-center">
                            <span className="text-[12px] text-slate-400">E.G. 27AAAPL1234C1Z5</span>
                          </div>
                        </div>
                        <div className="flex justify-end gap-3 pt-4">
                          <div className="px-5 py-2 border border-slate-200 rounded-lg text-xs font-medium text-slate-600">Cancel</div>
                          <div className="px-5 py-2 bg-[#002366] rounded-lg text-xs font-medium text-white">Save GSTIN</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="md:w-1/2 order-1 md:order-2 space-y-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xl">1</div>
                  <h3 className="text-2xl font-bold text-slate-900">Add New GSTIN</h3>
                  <p className="text-slate-600 text-lg">
                    Begin the process by entering the customer's exact GSTIN. Our system instantly prepares to fetch data directly from government portals.
                  </p>
                </div>
              </div>

              {/* Step 2: Authenticate Business Details */}
              <div className="flex flex-col md:flex-row items-center gap-12">
                <div className="md:w-1/2 space-y-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xl">2</div>
                  <h3 className="text-2xl font-bold text-slate-900">Authenticate Business Details</h3>
                  <p className="text-slate-600 text-lg">
                    Verify the fetched profile information. Review the registered Legal Name, Trade Name, Taxpayer Type, and active status before proceeding with deep analysis.
                  </p>
                </div>
                <div className="md:w-1/2">
                  <div className="relative w-full max-w-lg mx-auto bg-slate-200/50 p-6 rounded-2xl">
                    {/* GST Analysis Modal Mockup */}
                    <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-slate-200">
                      <div className="p-4 border-b border-slate-100">
                        <div className="flex items-center gap-2 mb-1">
                          <FileText size={16} className="text-[#002366]" />
                          <h4 className="font-bold text-[#002366] text-lg">GST Analysis</h4>
                        </div>
                        <p className="text-[10px] text-slate-500 mb-1">Authenticate and process your GST data</p>
                        <p className="text-[10px] font-semibold text-[#002366]">Target Customer ID: 69e539ec4a...</p>
                        
                        {/* Stepper */}
                        <div className="flex justify-between items-center mt-6 px-4 relative">
                          <div className="absolute top-1/2 left-8 right-8 h-0.5 bg-slate-200 -translate-y-1/2 z-0"></div>
                          <div className="absolute top-1/2 left-8 right-[60%] h-0.5 bg-[#002366] -translate-y-1/2 z-0"></div>
                          
                          <div className="flex flex-col items-center gap-1 relative z-10">
                            <div className="w-6 h-6 rounded-full bg-[#002366] text-white flex items-center justify-center"><Check size={10} /></div>
                            <span className="text-[8px] font-bold text-[#002366]">GSTIN</span>
                          </div>
                          <div className="flex flex-col items-center gap-1 relative z-10">
                            <div className="w-6 h-6 rounded-full bg-[#002366] text-white flex items-center justify-center text-[10px]">2</div>
                            <span className="text-[8px] font-bold text-[#002366]">Business & Date</span>
                          </div>
                          <div className="flex flex-col items-center gap-1 relative z-10">
                            <div className="w-6 h-6 rounded-full bg-white border border-slate-300 text-slate-400 flex items-center justify-center text-[10px]">3</div>
                            <span className="text-[8px] text-slate-400">Authentication</span>
                          </div>
                          <div className="flex flex-col items-center gap-1 relative z-10">
                            <div className="w-6 h-6 rounded-full bg-white border border-slate-300 text-slate-400 flex items-center justify-center text-[10px]">4</div>
                            <span className="text-[8px] text-slate-400">Analysis</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-5 bg-[#f8fafc]">
                        <div className="flex justify-between items-center mb-3">
                          <h5 className="font-bold text-slate-900">Business Details</h5>
                          <div className="px-3 py-1.5 bg-[#002366] rounded-lg text-[9px] font-medium text-white flex items-center gap-1">
                            <span>+</span> Add new
                          </div>
                        </div>
                        
                        {/* Business Card */}
                        <div className="bg-white rounded-xl border border-[#002366] p-4">
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                              <div className="w-4 h-4 rounded-full border-4 border-[#002366]"></div>
                              <div>
                                <h6 className="font-bold text-slate-900 text-sm">ABCDEF000012</h6>
                                <p className="text-[10px] text-slate-500">Sample Limited</p>
                              </div>
                            </div>
                            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-full text-[9px] font-medium">Active</span>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-[9px] text-slate-400 mb-0.5">Legal Name</p>
                              <p className="text-[10px] font-bold text-slate-900">Sampler Limited</p>
                            </div>
                            <div>
                              <p className="text-[9px] text-slate-400 mb-0.5">Trade Name</p>
                              <p className="text-[10px] font-bold text-slate-900">Sampler   Limited</p>
                            </div>
                            <div>
                              <p className="text-[9px] text-slate-400 ">Status</p>
                              <span className="inline-block px-2  bg-emerald-50 text-emerald-600 rounded-full text-[9px] font-medium">Active</span>
                            </div>
                            <div>
                              <p className="text-[9px] text-slate-400 mb-0.5">Taxpayer Type</p>
                              <p className="text-[10px] font-bold text-slate-900">Regular</p>
                            </div>
                            <div>
                              <p className="text-[9px] text-slate-400 mb-0.5">Date of Registration</p>
                              <p className="text-[10px] font-bold text-slate-900">13/01/2026</p>
                            </div>
                            <div>
                              <p className="text-[9px] text-slate-400 mb-0.5">Constitution of Business</p>
                              <p className="text-[10px] font-bold text-slate-900">Public Limited Company</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 3: Analyze GSTR Reports */}
              <div className="flex flex-col md:flex-row items-center gap-12">
                <div className="md:w-1/2 order-2 md:order-1">
                  <div className="relative w-full max-w-xl mx-auto bg-slate-200/50 p-6 rounded-2xl overflow-x-auto">
                    {/* GSTR Report Mockup */}
                    <div className="bg-[#f8fafc] rounded-xl shadow-xl overflow-hidden border border-slate-200 min-w-[550px]">
                      <div className="p-4 flex justify-between items-center mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 border border-[#002366] rounded flex items-center justify-center text-[#002366]"><ChevronLeft size={12} /></div>
                          <div>
                            <h4 className="font-bold text-slate-900 text-sm">GSTR Report</h4>
                            <p className="text-[8px] text-slate-400">Ref ID: 043a6097-f9b4...</p>
                          </div>
                        </div>
                        <div className="px-3 py-1.5 bg-[#002366] rounded text-[9px] text-white flex items-center gap-1"><Download size={10} /> Export</div>
                      </div>
                      
                      {/* Nav Tabs */}
                      <div className="flex px-4 mb-4">
                        <div className="flex-1 py-1.5 bg-white rounded shadow-sm text-center text-[9px] font-bold text-[#002366]">GSTR Overview</div>
                        <div className="flex-1 py-1.5 text-center text-[9px] font-bold text-slate-500">Top Suppliers & Customers</div>
                        <div className="flex-1 py-1.5 text-center text-[9px] font-bold text-slate-500">Monthly Summary</div>
                      </div>

                      <div className="px-4 pb-4">
                        {/* Customer Profile Banner */}
                        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden mb-4 shadow-sm">
                          <div className="bg-[#001845] text-white text-center py-1.5 text-[10px] font-bold">Customer Profile</div>
                          <div className="grid grid-cols-4 gap-2 p-2">
                            <div className="text-center border border-slate-100 rounded py-1">
                              <p className="text-[8px] font-bold text-[#002366]">Company Name</p>
                              <p className="text-[8px] text-slate-500 uppercase">NEW SWADESH STORE</p>
                            </div>
                            <div className="text-center border border-slate-100 rounded py-1">
                              <p className="text-[8px] font-bold text-[#002366]">GSTIN</p>
                              <p className="text-[8px] text-slate-500 uppercase">10A01VPA0DG61Z5</p>
                            </div>
                            <div className="text-center border border-slate-100 rounded py-1">
                              <p className="text-[8px] font-bold text-[#002366]">PAN</p>
                              <p className="text-[8px] text-slate-500 uppercase">A601PA600D</p>
                            </div>
                            <div className="text-center border border-slate-100 rounded py-1">
                              <p className="text-[8px] font-bold text-[#002366]">State</p>
                              <p className="text-[8px] text-slate-500 capitalize">Karnataka</p>
                            </div>
                          </div>
                        </div>

                        {/* Two Tables */}
                        <div className="flex gap-4">
                          <div className="flex-1 bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
                            <div className="bg-[#001845] text-white px-3 py-1.5 text-[10px] font-bold">Overview of GST Returns</div>
                            <table className="w-full text-[8px]">
                              <thead className="bg-[#4a5f87] text-white">
                                <tr>
                                  <th className="py-1 px-2 text-left font-normal">Particulars</th>
                                  <th className="py-1 px-2 text-right font-normal">Taxable Value</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr><td colSpan={2} className="py-1 px-2 font-bold bg-slate-50">GSTR 1</td></tr>
                                <tr className="border-b border-slate-100">
                                  <td className="py-1 px-2 text-slate-600">Adjustments due to Amendments (D)</td>
                                  <td className="py-1 px-2 text-right font-bold text-slate-900">0.00</td>
                                </tr>
                                <tr>
                                  <td className="py-1 px-2 text-slate-600">Total Value of Debit Notes Issued (B)</td>
                                  <td className="py-1 px-2 text-right font-bold text-slate-900">0.00</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                          <div className="flex-1 bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
                            <div className="bg-[#001845] text-white px-3 py-1.5 text-[10px] font-bold">Comparison with GSTR 3B</div>
                            <table className="w-full text-[8px]">
                              <thead className="bg-[#4a5f87] text-white">
                                <tr>
                                  <th className="py-1 px-2 text-left font-normal">Particulars</th>
                                  <th className="py-1 px-2 text-right font-normal">Taxable Value</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr><td colSpan={2} className="py-1 text-center font-bold text-white bg-[#001845]">Total Outward Supply</td></tr>
                                <tr className="border-b border-slate-100">
                                  <td className="py-1 px-2 text-slate-600">% Variation</td>
                                  <td className="py-1 px-2 text-right font-bold text-slate-900">423.92</td>
                                </tr>
                                <tr>
                                  <td className="py-1 px-2 text-slate-600">As per GSTR 1</td>
                                  <td className="py-1 px-2 text-right font-bold text-slate-900">4394271.20</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>

                      </div>
                    </div>
                  </div>
                </div>
                <div className="md:w-1/2 order-1 md:order-2 space-y-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xl">3</div>
                  <h3 className="text-2xl font-bold text-slate-900">Analyze GSTR Reports</h3>
                  <p className="text-slate-600 text-lg">
                    Generate an exhaustive GSTR Overview. Compare GSTR-1 against GSTR-3B filings to detect variations instantly, and automatically compile profiles of top suppliers and customers.
                  </p>
                </div>
              </div>

            </div>
          </div>
        </section>

          
        

          
        {/* ITR Workflow Section */}
        <section className="section-pad bg-slate-50 border-t border-slate-200" id="view-itr">
          <div className="max-w-6xl mx-auto px-6 reveal">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">How to Use ITR Services</h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Securely fetch, analyze, and dissect your customers' Income Tax Returns for complete financial visibility and underwriting accuracy.
              </p>
            </div>

            <div className="space-y-24">
              {/* Step 1: Fetch ITR Data */}
              <div className="flex flex-col md:flex-row items-center gap-12">
                <div className="md:w-1/2 order-2 md:order-1">
                  <div className="relative w-full max-w-md mx-auto bg-slate-200/50 p-6 rounded-2xl">
                    {/* Fetch Modal Mockup */}
                    <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-slate-200">
                      <div className="p-4 border-b border-slate-100 flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <PieChart size={18} className="text-[#002366]" />
                            <h4 className="font-bold text-[#002366] text-xl">Income Tax Return</h4>
                          </div>
                          <p className="text-[11px] text-slate-500 mb-1">Fetch and analyze your ITR data securely</p>
                          <p className="text-[11px] font-semibold text-[#002366]">Creating for Customer: 69e539ec4a...</p>
                        </div>
                        <div className="text-slate-400"> </div>
                      </div>
                      
                      <div className="p-6">
                        <div className="space-y-2 mb-4">
                          <label className="text-xs font-bold text-[#002366]">Email Address</label>
                          <div className="h-10 border border-slate-300 rounded-lg px-3 flex items-center">
                            <span className="text-xs text-slate-400">Enter your email</span>
                          </div>
                        </div>
                        
                        <div className="w-full py-2.5 bg-[#8492a6] hover:bg-[#002366] transition-colors rounded-lg flex justify-center text-xs font-bold text-white cursor-pointer shadow-sm">
                          Generate Link
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="md:w-1/2 order-1 md:order-2 space-y-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xl">1</div>
                  <h3 className="text-2xl font-bold text-slate-900">Securely Fetch ITR Data</h3>
                  <p className="text-slate-600 text-lg">
                    Easily initiate the ITR fetching process by generating a secure consent link sent directly to the customer's email address.
                  </p>
                </div>
              </div>

              {/* Step 2: Review Tax Calculations */}
              <div className="flex flex-col md:flex-row items-center gap-12">
                <div className="md:w-1/2 space-y-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xl">2</div>
                  <h3 className="text-2xl font-bold text-slate-900">Review Tax Calculations</h3>
                  <p className="text-slate-600 text-lg">
                    Once imported, the ITR Report instantly builds a comprehensive Customer Profile. Review detailed year-over-year tax calculations across all income streams.
                  </p>
                </div>
                <div className="md:w-1/2">
                  <div className="relative w-full max-w-xl mx-auto bg-slate-200/50 p-6 rounded-2xl overflow-x-auto">
                    {/* Tax Calculation Mockup */}
                    <div className="bg-[#f8fafc] rounded-xl shadow-xl overflow-hidden border border-slate-200 min-w-[500px]">
                      <div className="p-3 border-b border-slate-200 flex items-center gap-3 bg-white">
                        <div className="w-6 h-6 border border-[#002366] rounded flex items-center justify-center text-[#002366]"><ChevronLeft size={12} /></div>
                        <div>
                          <h4 className="font-bold text-slate-900 text-xs">ITR Report</h4>
                          <p className="text-[8px] text-slate-400">Ref ID: 6cc45c11-3649-4bdb-a8f0...</p>
                        </div>
                      </div>
                      
                      {/* Nav Tabs */}
                      <div className="flex gap-2 px-4 pt-3 pb-2 border-b border-slate-200">
                        <div className="px-4 py-1.5 bg-white border border-slate-200 text-[#002366] rounded-full text-[8px] font-bold shadow-sm">Tax Calculation</div>
                        <div className="px-4 py-1.5 text-slate-500 rounded text-[8px] font-bold">Balance Sheet</div>
                        <div className="px-4 py-1.5 text-slate-500 rounded text-[8px] font-bold">Profit & Loss</div>
                        <div className="px-4 py-1.5 text-slate-500 rounded text-[8px] font-bold">Ratio Analysis</div>
                      </div>

                      <div className="p-4 space-y-4">
                        {/* Customer Profile Banner */}
                        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
                          <div className="bg-[#001845] text-white text-center py-1.5 text-[9px] font-bold">Customer Profile</div>
                          <div className="grid grid-cols-4 gap-2 p-2">
                            <div className="text-center border border-slate-100 rounded py-1.5">
                              <p className="text-[6px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">COMPANY NAME</p>
                              <p className="text-[7px] font-bold text-slate-800 uppercase">MILKLANE DAIRY SERVICES PVT...</p>
                            </div>
                            <div className="text-center border border-slate-100 rounded py-1.5">
                              <p className="text-[6px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">GSTIN</p>
                              <p className="text-[8px] text-slate-800 font-bold uppercase">29AAJCM9815D1Z6</p>
                            </div>
                            <div className="text-center border border-slate-100 rounded py-1.5">
                              <p className="text-[6px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">PHONE NUMBER</p>
                              <p className="text-[8px] text-slate-800 font-bold">919901444775</p>
                            </div>
                            <div className="text-center border border-slate-100 rounded py-1.5">
                              <p className="text-[6px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">PAN</p>
                              <p className="text-[8px] text-slate-800 font-bold uppercase">AAJCM9815D</p>
                            </div>
                          </div>
                        </div>

                        {/* Table */}
                        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
                          <div className="bg-[#001845] text-white text-center py-1.5 text-[9px] font-bold">Tax Calculation</div>
                          <table className="w-full text-[8px]">
                            <thead className="bg-[#0b2b6d] text-white">
                              <tr>
                                <th className="py-1.5 px-3 text-left font-bold border-r border-[#001845]">Particulars</th>
                                <th className="py-1.5 px-3 text-right font-bold border-r border-[#001845] w-24">2024</th>
                                <th className="py-1.5 px-3 text-right font-bold w-24"> 2026</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr className="border-b border-slate-100"><td className="py-1.5 px-3 text-slate-600 border-r border-slate-100">Income from Salary</td><td className="py-1.5 px-3 text-right border-r border-slate-100">-</td><td className="py-1.5 px-3 text-right">-</td></tr>
                              <tr className="border-b border-slate-100"><td className="py-1.5 px-3 text-slate-600 border-r border-slate-100">Income from Other Sources</td><td className="py-1.5 px-3 text-right font-bold border-r border-slate-100">62,07,785.00</td><td className="py-1.5 px-3 text-right font-bold">2,73,099.00</td></tr>
                              <tr className="border-b border-slate-100"><td className="py-1.5 px-3 text-slate-600 border-r border-slate-100">Aggregate Income</td><td className="py-1.5 px-3 text-right border-r border-slate-100">-</td><td className="py-1.5 px-3 text-right">-</td></tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 3: P&L and Balance Sheet */}
              <div className="flex flex-col md:flex-row items-center gap-12">
                <div className="md:w-1/2 order-2 md:order-1">
                  <div className="relative w-full max-w-xl mx-auto bg-slate-200/50 p-6 rounded-2xl overflow-x-auto">
                    {/* P&L Mockup */}
                    <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-slate-200 min-w-[500px]">
                      <div className="bg-[#001845] text-white text-center py-2 text-[10px] font-bold tracking-wide">Profit and Loss Statement</div>
                      <table className="w-full text-[8px]">
                        <thead className="bg-[#0b2b6d] text-white">
                          <tr>
                            <th className="py-2 px-3 text-left font-bold border-r border-[#001845]">Particulars</th>
                            <th className="py-2 px-3 text-right font-bold border-r border-[#001845] w-24">2024</th>
                            <th className="py-2 px-3 text-right font-bold w-24"> 2026</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b border-slate-100"><td className="py-2 px-3 text-slate-600 border-r border-slate-100">Direct Expenses</td><td className="py-2 px-3 text-right font-bold text-slate-800 border-r border-slate-100">16,87,03,858.00</td><td className="py-2 px-3 text-right font-bold text-slate-800">9,05,45,580.00</td></tr>
                          <tr className="border-b border-slate-100"><td className="py-2 px-3 text-slate-600 border-r border-slate-100">Other Non Operating Income</td><td className="py-2 px-3 text-right font-bold text-slate-800 border-r border-slate-100">99,48,801.00</td><td className="py-2 px-3 text-right font-bold text-slate-800">28,68,578.00</td></tr>
                          <tr className="border-b border-slate-100 bg-slate-50"><td className="py-2 px-3 font-bold text-slate-800 border-r border-slate-100">Profit Before Tax</td><td className="py-2 px-3 text-right font-bold text-red-500 border-r border-slate-100">-20,27,73,957.00</td><td className="py-2 px-3 text-right font-bold text-red-500">-6,78,05,896.00</td></tr>
                          <tr className="border-b border-slate-100"><td className="py-2 px-3 text-slate-600 border-r border-slate-100">Consumption of Stores and Spare Parts</td><td className="py-2 px-3 text-right font-bold text-slate-800 border-r border-slate-100">5,67,304.00</td><td className="py-2 px-3 text-right font-bold text-slate-800">-</td></tr>
                          <tr className="border-b border-slate-100 bg-slate-50"><td className="py-2 px-3 font-bold text-slate-800 border-r border-slate-100">EBITDA</td><td className="py-2 px-3 text-right font-bold text-red-500 border-r border-slate-100">-14,68,25,348.00</td><td className="py-2 px-3 text-right font-bold text-red-500">-1,32,60,956.00</td></tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                <div className="md:w-1/2 order-1 md:order-2 space-y-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xl">3</div>
                  <h3 className="text-2xl font-bold text-slate-900">Analyze P&L and Balance Sheets</h3>
                  <p className="text-slate-600 text-lg">
                    Instantly extract and structure Equity & Liabilities or Profit and Loss statements. Track EBITDA, Profit Before Tax, and direct expenses automatically without manual data entry.
                  </p>
                </div>
              </div>

              {/* Step 4: Ratio Analysis */}
              <div className="flex flex-col md:flex-row items-center gap-12">
                <div className="md:w-1/2 space-y-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xl">4</div>
                  <h3 className="text-2xl font-bold text-slate-900">Deep Dive Ratio Analysis</h3>
                  <p className="text-slate-600 text-lg">
                    Automatically generate complex Liquidity and Asset Management ratios (like Quick Ratio, Cash Ratio, and Inventory Turnover) across multiple fiscal years to measure business health.
                  </p>
                </div>
                <div className="md:w-1/2">
                  <div className="relative w-full max-w-xl mx-auto bg-slate-200/50 p-6 rounded-2xl overflow-x-auto">
                    {/* Ratios Mockup */}
                    <div className="bg-[#f8fafc] rounded-xl shadow-xl overflow-hidden border border-slate-200 min-w-[500px]">
                      {/* Liquidity Analysis */}
                      <div className="mb-4 bg-white">
                        <div className="bg-[#001845] text-white text-center py-1.5 text-[9px] font-bold tracking-wide">Liquidity Analysis</div>
                        <table className="w-full text-[8px]">
                          <thead className="bg-[#0b2b6d] text-white">
                            <tr>
                              <th className="py-1.5 px-3 text-left font-bold border-r border-[#001845]">Particulars</th>
                              <th className="py-1.5 px-3 text-right font-bold border-r border-[#001845] w-24">2024</th>
                              <th className="py-1.5 px-3 text-right font-bold w-24"> 2026</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="border-b border-slate-100"><td className="py-1.5 px-3 font-medium text-slate-800 border-r border-slate-100">Net Working Capital to Total Assets</td><td className="py-1.5 px-3 text-right text-slate-800 border-r border-slate-100">0.08</td><td className="py-1.5 px-3 text-right text-red-500 font-bold">-0.15</td></tr>
                            <tr className="border-b border-slate-100"><td className="py-1.5 px-3 font-medium text-slate-600 border-r border-slate-100">Quick Ratio</td><td className="py-1.5 px-3 text-right text-slate-800 border-r border-slate-100">0.97</td><td className="py-1.5 px-3 text-right text-slate-800">0.51</td></tr>
                            <tr className="border-b border-slate-100"><td className="py-1.5 px-3 font-medium text-slate-600 border-r border-slate-100">Current Ratio</td><td className="py-1.5 px-3 text-right text-slate-800 border-r border-slate-100">1.17</td><td className="py-1.5 px-3 text-right text-slate-800">0.82</td></tr>
                          </tbody>
                        </table>
                      </div>
                      
                      {/* Asset Management */}
                      <div className="bg-white">
                        <div className="bg-[#001845] text-white text-center py-1.5 text-[9px] font-bold tracking-wide">Asset Management</div>
                        <table className="w-full text-[8px]">
                          <thead className="bg-[#0b2b6d] text-white">
                            <tr>
                              <th className="py-1.5 px-3 text-left font-bold border-r border-[#001845]">Particulars</th>
                              <th className="py-1.5 px-3 text-right font-bold border-r border-[#001845] w-24">2024</th>
                              <th className="py-1.5 px-3 text-right font-bold w-24"> 2026</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="border-b border-slate-100"><td className="py-1.5 px-3 font-medium text-slate-600 border-r border-slate-100">Trade Receivables Turnover Ratio</td><td className="py-1.5 px-3 text-right text-slate-800 border-r border-slate-100">112.16</td><td className="py-1.5 px-3 text-right text-slate-800">29.94</td></tr>
                            <tr className="border-b border-slate-100"><td className="py-1.5 px-3 font-medium text-slate-600 border-r border-slate-100">Trade Receivables Turnover (in days)</td><td className="py-1.5 px-3 text-right text-slate-800 border-r border-slate-100">3.25</td><td className="py-1.5 px-3 text-right text-slate-800">12.19</td></tr>
                            <tr className="border-b border-slate-100"><td className="py-1.5 px-3 font-medium text-slate-600 border-r border-slate-100">Inventory Turnover (in days)</td><td className="py-1.5 px-3 text-right text-slate-800 border-r border-slate-100">3.09</td><td className="py-1.5 px-3 text-right text-slate-800">20.39</td></tr>
                          </tbody>
                        </table>
                      </div>

                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* CIBIL Workflow Section */}
        <section className="section-pad bg-white border-t border-slate-200" id="view-cibil">
          <div className="max-w-6xl mx-auto px-6 reveal">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">How to Use CIBIL Services</h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Authenticate customer identity to instantly pull deep credit bureau scores, payment histories, and comprehensive risk analysis.
              </p>
            </div>

            <div className="space-y-24">
              {/* Step 1: Submit Identity Details */}
              <div className="flex flex-col md:flex-row items-center gap-12">
                <div className="md:w-1/2 order-2 md:order-1">
                  <div className="relative w-full max-w-lg mx-auto bg-slate-200/50 p-6 rounded-2xl">
                    {/* Identity Details Mockup */}
                    <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-slate-200">
                      <div className="p-4 border-b border-slate-100 flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <FileText size={16} className="text-[#002366]" />
                            <h4 className="font-bold text-[#002366] text-lg">CIBIL Score</h4>
                          </div>
                          <p className="text-[10px] text-slate-500 mb-1">Authenticate customer consent and process CIBIL report data</p>
                          <p className="text-[10px] font-semibold text-[#002366]">Target Customer ID: 69e539ec4a...</p>
                        </div>
                        <div className="text-slate-400"></div>
                      </div>
                      
                      {/* Stepper */}
                      <div className="flex justify-between items-center mt-4 px-8 relative">
                        <div className="absolute top-1/2 left-10 right-10 h-0.5 bg-slate-200 -translate-y-1/2 z-0"></div>
                        
                        <div className="flex flex-col items-center gap-1 relative z-10">
                          <div className="w-6 h-6 rounded-full bg-[#002366] text-white flex items-center justify-center text-[10px]">1</div>
                          <span className="text-[8px] font-bold text-[#002366]">Identity</span>
                        </div>
                        <div className="flex flex-col items-center gap-1 relative z-10">
                          <div className="w-6 h-6 rounded-full bg-white border border-slate-300 text-slate-400 flex items-center justify-center text-[10px]">2</div>
                          <span className="text-[8px] text-slate-400">OTP</span>
                        </div>
                        <div className="flex flex-col items-center gap-1 relative z-10">
                          <div className="w-6 h-6 rounded-full bg-white border border-slate-300 text-slate-400 flex items-center justify-center text-[10px]">3</div>
                          <span className="text-[8px] text-slate-400">Status</span>
                        </div>
                        <div className="flex flex-col items-center gap-1 relative z-10">
                          <div className="w-6 h-6 rounded-full bg-white border border-slate-300 text-slate-400 flex items-center justify-center text-[10px]">4</div>
                          <span className="text-[8px] text-slate-400">Report</span>
                        </div>
                      </div>

                      <div className="p-5 mt-2">
                        <div className="border border-slate-200 rounded-lg p-4">
                          <h5 className="font-bold text-[#002366] mb-1">Identity Details</h5>
                          <p className="text-[9px] text-slate-500 mb-4">Enter the customer details required to initiate the CIBIL consent OTP.</p>
                          
                          <div className="grid grid-cols-3 gap-3 mb-3">
                            <div>
                              <label className="text-[9px] font-semibold text-slate-700">First Name</label>
                              <div className="h-7 border border-slate-200 rounded px-2 flex items-center"><span className="text-[10px] text-slate-400">Rahul</span></div>
                            </div>
                            <div>
                              <label className="text-[9px] font-semibold text-slate-700">Middle Name</label>
                              <div className="h-7 border border-slate-200 rounded px-2 flex items-center"><span className="text-[10px] text-slate-300">Optional</span></div>
                            </div>
                            <div>
                              <label className="text-[9px] font-semibold text-slate-700">Last Name</label>
                              <div className="h-7 border border-slate-200 rounded px-2 flex items-center"><span className="text-[10px] text-slate-400">Sharma</span></div>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-3 gap-3 mb-3">
                            <div>
                              <label className="text-[9px] font-semibold text-slate-700">Date of Birth</label>
                              <div className="h-7 border border-slate-200 rounded px-2 flex items-center justify-between"><span className="text-[10px] text-slate-600">13/05/2003</span><Calendar size={10} className="text-slate-500"/></div>
                            </div>
                            <div>
                              <label className="text-[9px] font-semibold text-slate-700">Gender</label>
                              <div className="h-7 border border-slate-200 rounded px-2 flex items-center justify-between"><span className="text-[10px] text-slate-600">Male</span><ChevronDown size={10} className="text-slate-500"/></div>
                            </div>
                            <div>
                              <label className="text-[9px] font-semibold text-slate-700">Mobile Number</label>
                              <div className="h-7 border border-slate-200 rounded px-2 flex items-center"><span className="text-[10px] text-slate-400">9876543210</span></div>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-3 mb-4">
                            <div>
                              <label className="text-[9px] font-semibold text-slate-700">ID Type</label>
                              <div className="h-7 border border-slate-200 rounded px-2 flex items-center justify-between"><span className="text-[10px] text-slate-600">PAN Card</span><ChevronDown size={10} className="text-slate-500"/></div>
                            </div>
                            <div>
                              <label className="text-[9px] font-semibold text-slate-700">ID Number</label>
                              <div className="h-7 border border-slate-200 rounded px-2 flex items-center"><span className="text-[10px] text-slate-400">ABCDE1234F</span></div>
                            </div>
                          </div>
                          
                          <div className="w-full py-2 bg-[#002366] rounded flex justify-center text-[11px] font-bold text-white cursor-pointer">
                            Continue to OTP
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="md:w-1/2 order-1 md:order-2 space-y-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xl">1</div>
                  <h3 className="text-2xl font-bold text-slate-900">Submit Identity Details</h3>
                  <p className="text-slate-600 text-lg">
                    Easily initiate a credit pull by entering basic KYC parameters including PAN, DOB, and Mobile Number to generate an instant OTP for customer consent.
                  </p>
                </div>
              </div>

              {/* Step 2: CIBIL Score Overview */}
              <div className="flex flex-col md:flex-row items-center gap-12">
                <div className="md:w-1/2 space-y-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xl">2</div>
                  <h3 className="text-2xl font-bold text-slate-900">View Comprehensive Score</h3>
                  <p className="text-slate-600 text-lg">
                    Once authenticated, instantly view the subject's exact Equifax/CIBIL Score alongside a snapshot of their active accounts, credit limits, and overdue debt balances.
                  </p>
                </div>
                <div className="md:w-1/2">
                  <div className="relative w-full max-w-2xl mx-auto bg-slate-200/50 p-6 rounded-2xl overflow-x-auto">
                    {/* Dashboard Mockup */}
                    <div className="bg-[#f8fafc] rounded-xl shadow-xl overflow-hidden border border-slate-200 min-w-[550px]">
                      <div className="p-3 border-b border-slate-200 flex items-center gap-3 bg-white">
                        <div className="w-6 h-6 border border-[#002366] rounded flex items-center justify-center text-[#002366]"><ChevronLeft size={12} /></div>
                        <div>
                          <h4 className="font-bold text-slate-900 text-xs">CIBIL Report</h4>
                          <p className="text-[8px] text-slate-400">Ref ID: 9fd8b63-ba1a...</p>
                        </div>
                      </div>
                      
                      {/* Tabs */}
                      <div className="flex gap-2 px-4 pt-3 pb-2">
                        <div className="px-3 py-1 bg-[#001845] text-white rounded text-[8px] font-bold">Overview</div>
                        <div className="px-3 py-1 text-slate-500 rounded text-[8px] font-bold">Account Summary</div>
                        <div className="px-3 py-1 text-slate-500 rounded text-[8px] font-bold">Payments History</div>
                        <div className="px-3 py-1 text-slate-500 rounded text-[8px] font-bold">Analysis</div>
                      </div>

                      <div className="p-4 space-y-3">
                        <div className="flex gap-3">
                          {/* Score Dial */}
                          <div className="w-1/3 bg-white border border-slate-200 rounded-lg p-3 flex flex-col items-center justify-center shadow-sm">
                            <p className="text-[7px] font-bold text-slate-400 mb-2 uppercase">Bureau Score</p>
                            <div className="w-20 h-10 border-t-4 border-l-4 border-r-4 border-emerald-500 rounded-t-full relative mb-1">
                              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 flex flex-col items-center bg-white px-2">
                                <span className="text-xl font-bold text-emerald-600 leading-none">729</span>
                                <span className="text-[6px] text-emerald-600 font-bold uppercase">Equifax Score</span>
                              </div>
                            </div>
                            <span className="text-[8px] font-bold text-emerald-500 bg-emerald-50 px-2 rounded-full mt-4">GOOD</span>
                            <p className="text-[6px] text-slate-400 mt-1">Healthy credit history. Very good loan approvals.</p>
                          </div>
                          
                          {/* Profile */}
                          <div className="flex-1 bg-white border border-slate-200 rounded-lg p-3 shadow-sm">
                            <p className="text-[8px] font-bold text-[#001845] mb-2 uppercase">Personal & Identification Profile</p>
                            <div className="grid grid-cols-3 gap-3">
                              <div className="flex gap-1.5">
                                <User size={10} className="text-slate-400 mt-0.5" />
                                <div><p className="text-[6px] text-slate-400">FULL NAME</p><p className="text-[8px] font-bold text-slate-800">C . Alex</p></div>
                              </div>
                              <div className="flex gap-1.5">
                                <Calendar size={10} className="text-slate-400 mt-0.5" />
                                <div><p className="text-[6px] text-slate-400">DATE OF BIRTH (AGE)</p><p className="text-[8px] font-bold text-slate-800">13-05-2003 (23 Yrs) | Male</p></div>
                              </div>
                              <div className="flex gap-1.5">
                                <FileText size={10} className="text-slate-400 mt-0.5" />
                                <div><p className="text-[6px] text-slate-400">PAN NUMBER</p><p className="text-[8px] font-bold text-slate-800">S23DKPS21D</p></div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Summary Metrics */}
                        <div className="flex gap-2">
                          <div className="flex-1 bg-white border border-slate-200 rounded-lg p-2 shadow-sm">
                            <p className="text-[6px] font-bold text-slate-400 uppercase">Total Accounts</p>
                            <p className="text-lg font-bold text-slate-800">1</p>
                          </div>
                          <div className="flex-1 bg-white border border-slate-200 rounded-lg p-2 shadow-sm relative">
                            <span className="absolute top-2 right-2 text-[6px] font-bold text-emerald-500">Active</span>
                            <p className="text-[6px] font-bold text-slate-400 uppercase">Active Accounts</p>
                            <p className="text-lg font-bold text-slate-800">1</p>
                          </div>
                          <div className="flex-1 bg-white border border-slate-200 rounded-lg p-2 shadow-sm relative">
                            <span className="absolute top-2 right-2 text-[6px] font-bold text-red-500">OVERDUE</span>
                            <p className="text-[6px] font-bold text-slate-400 uppercase">Overdue Accounts</p>
                            <p className="text-lg font-bold text-slate-800">0</p>
                          </div>
                          <div className="flex-1 bg-[#001845] rounded-lg p-2 shadow-sm text-white">
                            <p className="text-[6px] font-bold text-blue-200 uppercase mb-1">Outstanding Debt</p>
                            <p className="text-lg font-bold">7,839</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 3: Payments History Timeline */}
              <div className="flex flex-col md:flex-row items-center gap-12">
                <div className="md:w-1/2 order-2 md:order-1">
                  <div className="relative w-full max-w-2xl mx-auto bg-slate-200/50 p-6 rounded-2xl overflow-x-auto">
                    {/* Payments History Mockup */}
                    <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-slate-200 p-4 min-w-[550px]">
                      <div className="flex justify-center mb-4">
                        <div className="flex bg-slate-100 rounded-lg p-0.5">
                          <div className="px-4 py-1.5 bg-[#001845] text-white rounded-md text-[9px] font-bold shadow-sm">Active Timeline</div>
                          <div className="px-4 py-1.5 text-slate-500 text-[9px] font-bold">Closed Timeline</div>
                        </div>
                      </div>

                      <div className="border border-slate-200 rounded-lg p-3">
                        <div className="flex justify-between items-center mb-4">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-blue-50 rounded flex items-center justify-center text-[#002366]"><Landmark size={12} /></div>
                            <div>
                              <h5 className="text-[10px] font-bold text-slate-900">Personal Loan</h5>
                              <p className="text-[7px] text-slate-500">Acct No: XXXX6135</p>
                            </div>
                          </div>
                          <div className="text-[8px] text-slate-500 flex gap-2">
                            <span>Limit: <strong className="text-slate-800">?8,050</strong></span>
                            <span className="border-l border-slate-300 pl-2">Reported Date: 15-06-2026</span>
                          </div>
                        </div>

                        {/* Grid */}
                        <div className="w-full">
                          <div className="flex text-[7px] font-bold text-slate-400 mb-2">
                            <div className="w-8">YEAR</div>
                            <div className="flex-1 text-center">JAN</div><div className="flex-1 text-center">FEB</div><div className="flex-1 text-center">MAR</div><div className="flex-1 text-center">APR</div><div className="flex-1 text-center">MAY</div><div className="flex-1 text-center">JUN</div>
                          </div>
                          <div className="space-y-1.5">
                            {/* 2026 */}
                            <div className="flex items-center text-[7px]">
                              <div className="w-8 font-bold text-slate-800 flex items-center gap-1"><Calendar size={8} /> 2026</div>
                              <div className="flex-1 px-0.5"><div className="w-full py-1 bg-emerald-50 border border-emerald-200 text-emerald-600 rounded text-center font-medium text-[6px]">000/XXX</div></div>
                              <div className="flex-1 px-0.5"><div className="w-full py-1 bg-emerald-50 border border-emerald-200 text-emerald-600 rounded text-center font-medium text-[6px]">000/XXX</div></div>
                              <div className="flex-1 px-0.5"><div className="w-full py-1 bg-emerald-50 border border-emerald-200 text-emerald-600 rounded text-center font-medium text-[6px]">000/XXX</div></div>
                              <div className="flex-1 px-0.5"><div className="w-full py-1 bg-emerald-50 border border-emerald-200 text-emerald-600 rounded text-center font-medium text-[6px]">000/XXX</div></div>
                              <div className="flex-1 px-0.5"><div className="w-full py-1 bg-emerald-50 border border-emerald-200 text-emerald-600 rounded text-center font-medium text-[6px]">000/XXX</div></div>
                              <div className="flex-1 px-0.5"><div className="w-full py-1 bg-emerald-50 border border-emerald-200 text-emerald-600 rounded text-center font-medium text-[6px]">000/XXX</div></div>
                            </div>
                            {/*  2026 */}
                            <div className="flex items-center text-[7px]">
                              <div className="w-8 font-bold text-slate-800 flex items-center gap-1"><Calendar size={8} />  2026</div>
                              <div className="flex-1 px-0.5"><div className="w-full py-1 bg-emerald-50 border border-emerald-200 text-emerald-600 rounded text-center font-medium text-[6px]">000/XXX</div></div>
                              <div className="flex-1 px-0.5"><div className="w-full py-1 bg-emerald-50 border border-emerald-200 text-emerald-600 rounded text-center font-medium text-[6px]">000/XXX</div></div>
                              <div className="flex-1 px-0.5"><div className="w-full py-1 bg-emerald-50 border border-emerald-200 text-emerald-600 rounded text-center font-medium text-[6px]">000/XXX</div></div>
                              <div className="flex-1 px-0.5"><div className="w-full py-1 bg-emerald-50 border border-emerald-200 text-emerald-600 rounded text-center font-medium text-[6px]">000/XXX</div></div>
                              <div className="flex-1 px-0.5"><div className="w-full py-1 bg-emerald-50 border border-emerald-200 text-emerald-600 rounded text-center font-medium text-[6px]">000/XXX</div></div>
                              <div className="flex-1 px-0.5"><div className="w-full py-1 bg-emerald-50 border border-emerald-200 text-emerald-600 rounded text-center font-medium text-[6px]">000/XXX</div></div>
                            </div>
                            {/* 2024 */}
                            <div className="flex items-center text-[7px]">
                              <div className="w-8 font-bold text-slate-800 flex items-center gap-1"><Calendar size={8} /> 2024</div>
                              <div className="flex-1 px-0.5"><div className="w-full py-1 bg-emerald-50 border border-emerald-200 text-emerald-600 rounded text-center font-medium text-[6px]">000/XXX</div></div>
                              <div className="flex-1 px-0.5"><div className="w-full py-1 bg-emerald-50 border border-emerald-200 text-emerald-600 rounded text-center font-medium text-[6px]">000/XXX</div></div>
                              <div className="flex-1 px-0.5"><div className="w-full py-1 bg-slate-50 border border-slate-200 text-slate-400 rounded text-center font-medium text-[6px]">XXX/XXX</div></div>
                              <div className="flex-1 px-0.5"><div className="w-full py-1 bg-slate-50 border border-slate-200 text-slate-400 rounded text-center font-medium text-[6px]">XXX/XXX</div></div>
                              <div className="flex-1 px-0.5"><div className="w-full py-1 bg-emerald-50 border border-emerald-200 text-emerald-600 rounded text-center font-medium text-[6px]">000/XXX</div></div>
                              <div className="flex-1 px-0.5"><div className="w-full py-1 bg-emerald-50 border border-emerald-200 text-emerald-600 rounded text-center font-medium text-[6px]">000/XXX</div></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="md:w-1/2 order-1 md:order-2 space-y-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xl">3</div>
                  <h3 className="text-2xl font-bold text-slate-900">Analyze Payment History</h3>
                  <p className="text-slate-600 text-lg">
                    Visualize the customer's entire historical repayment footprint through our beautiful month-by-month DPD (Days Past Due) grid, easily highlighting active versus closed timelines.
                  </p>
                </div>
              </div>

              {/* Step 4: Facility Delays */}
              <div className="flex flex-col md:flex-row items-center gap-12">
                <div className="md:w-1/2 space-y-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xl">4</div>
                  <h3 className="text-2xl font-bold text-slate-900">Deep Dive Facility Delays</h3>
                  <p className="text-slate-600 text-lg">
                    Assess risk per loan type. The Facility & Delays Analysis breaks down payment percentages by asset classfrom Agriculture Loans to Credit Cardsgiving you a macro view of their default probabilities over 12 months.
                  </p>
                </div>
                <div className="md:w-1/2">
                  <div className="relative w-full max-w-xl mx-auto bg-slate-200/50 p-6 rounded-2xl overflow-x-auto">
                    {/* Delays Mockup */}
                    <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-slate-200 min-w-[500px]">
                      <div className="p-3 flex items-center gap-2 border-b border-slate-100">
                        <TrendingUp size={12} className="text-[#001845]" />
                        <h4 className="font-bold text-[#001845] text-[10px] uppercase tracking-wide">Credit Facility & Delays Analysis</h4>
                      </div>
                      <table className="w-full text-[8px] text-center">
                        <thead className="bg-slate-50 text-slate-500 font-bold">
                          <tr>
                            <th rowSpan={2} className="py-2 px-2 text-left border-b border-slate-200">LOAN TYPE</th>
                            <th rowSpan={2} className="py-2 px-2 border-b border-slate-200">TOTAL FACILITIES</th>
                            <th rowSpan={2} className="py-2 px-2 border-b border-slate-200">FACILITIES IN LAST 12M</th>
                            <th colSpan={4} className="py-1 px-2 border-b border-slate-200">DELAYED PAYMENT PERCENTAGE</th>
                            <th rowSpan={2} className="py-2 px-2 border-b border-slate-200">DEFAULT CHANGE LAST 12M</th>
                          </tr>
                          <tr>
                            <th className="py-1 px-1 bg-slate-100 border-b border-slate-200 text-[6px]">ACTIVE</th>
                            <th className="py-1 px-1 bg-slate-100 border-b border-slate-200 text-[6px]">CLOSED</th>
                            <th className="py-1 px-1 bg-slate-100 border-b border-slate-200 text-[6px]">TOTAL</th>
                            <th className="py-1 px-1 bg-slate-50 border-b border-slate-200 text-[6px]">LAST 12M</th>
                          </tr>
                        </thead>
                        <tbody className="text-slate-800">
                          <tr className="border-b border-slate-100"><td className="py-2 px-2 text-left font-medium">Agriculture Loan</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td></tr>
                          <tr className="border-b border-slate-100"><td className="py-2 px-2 text-left font-medium">Auto Loan</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td></tr>
                          <tr className="border-b border-slate-100"><td className="py-2 px-2 text-left font-medium">Business Loan</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td></tr>
                          <tr className="border-b border-slate-100"><td className="py-2 px-2 text-left font-medium">Consumer Loan</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td></tr>
                          <tr className="border-b border-slate-100"><td className="py-2 px-2 text-left font-medium">Credit Card</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td></tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>


          
        {/* Money & Wallet Workflow Section */}
        <section className="section-pad bg-white border-t border-slate-200" id="view-money">
          <div className="max-w-6xl mx-auto px-6 reveal">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">How to Manage Money & Wallet</h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                End-to-end financial remediation. Help customers rectify defaults, save money on existing loans, access new capital, and track your organizational wallet balance.
              </p>
            </div>

            <div className="space-y-24">
              {/* Step 1: Rectify Money */}
              <div className="flex flex-col md:flex-row items-center gap-12">
                <div className="md:w-1/2 order-2 md:order-1">
                  <div className="relative w-full max-w-xl mx-auto bg-slate-200/50 p-6 rounded-2xl overflow-x-auto">
                    {/* Rectify Mockup */}
                    <div className="bg-[#f8fafc] rounded-xl shadow-xl overflow-hidden border border-slate-200 min-w-[500px]">
                      <div className="p-4 border-b border-slate-200 flex items-center gap-3 bg-white">
                        <div className="w-6 h-6 border border-[#002366] rounded flex items-center justify-center text-[#002366]"><ChevronLeft size={12} /></div>
                        <div>
                          <h4 className="font-bold text-slate-900 text-sm">Rectify Money Report</h4>
                          <p className="text-[9px] text-slate-400">Reference ID: 9fe98b63-ba1a-4ce1...</p>
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
                          <table className="w-full text-[9px] text-left">
                            <thead className="text-slate-400 font-bold bg-slate-50 uppercase tracking-widest border-b border-slate-100">
                              <tr>
                                <th className="py-3 px-4">Lender Name</th>
                                <th className="py-3 px-4">Account Number</th>
                                <th className="py-3 px-4">Opened Date</th>
                                <th className="py-3 px-4 text-center">Overdue Amount</th>
                                <th className="py-3 px-4 text-center">Average DPD</th>
                                <th className="py-3 px-4 text-center">Select</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td className="py-4 px-4 font-bold text-slate-900">Slice Small Finance Bank Limited</td>
                                <td className="py-4 px-4 text-slate-600">XXXX6135</td>
                                <td className="py-4 px-4 text-slate-600">30 Nov 2021</td>
                                <td className="py-4 px-4 font-bold text-red-500 text-center">? 12</td>
                                <td className="py-4 px-4 text-center">
                                  <span className="inline-flex items-center gap-1 bg-orange-50 text-orange-600 px-2 py-0.5 rounded text-[8px] font-bold"><Clock size={8} /> 0 Days</span>
                                </td>
                                <td className="py-4 px-4 text-center">
                                  <div className="w-4 h-4 border border-slate-300 rounded-full mx-auto"></div>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                        <div className="flex justify-end mt-4">
                          <div className="px-5 py-2 bg-[#001845] text-white rounded font-medium text-[10px] flex items-center gap-2 shadow-sm"><CheckCircle2 size={12} /> Submit Selections</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="md:w-1/2 order-1 md:order-2 space-y-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xl">1</div>
                  <h3 className="text-2xl font-bold text-slate-900">Rectify Defaults</h3>
                  <p className="text-slate-600 text-lg">
                    Instantly identify problematic accounts directly from the credit report. Select active defaults and initiate a rectification process to clear overdue balances and improve their bureau score.
                  </p>
                </div>
              </div>

              {/* Step 2: Save Money */}
              <div className="flex flex-col md:flex-row items-center gap-12">
                <div className="md:w-1/2 space-y-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xl">2</div>
                  <h3 className="text-2xl font-bold text-slate-900">Save Money via Consolidation</h3>
                  <p className="text-slate-600 text-lg">
                    Help customers save on interest by selecting high-cost or underutilized credit lines to consolidate or close, optimizing their total outstanding debt profile.
                  </p>
                </div>
                <div className="md:w-1/2">
                  <div className="relative w-full max-w-xl mx-auto bg-slate-200/50 p-6 rounded-2xl overflow-x-auto">
                    {/* Save Mockup */}
                    <div className="bg-[#f8fafc] rounded-xl shadow-xl overflow-hidden border border-slate-200 min-w-[500px]">
                      <div className="p-4 border-b border-slate-200 flex items-center gap-3 bg-white">
                        <div className="w-6 h-6 border border-[#002366] rounded flex items-center justify-center text-[#002366]"><ChevronLeft size={12} /></div>
                        <div>
                          <h4 className="font-bold text-slate-900 text-sm">Save Money Report</h4>
                          <p className="text-[9px] text-slate-400">Reference ID: 9fe98b63-ba1a-4ce1...</p>
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
                          <table className="w-full text-[9px] text-left">
                            <thead className="text-slate-400 font-bold bg-slate-50 uppercase tracking-widest border-b border-slate-100">
                              <tr>
                                <th className="py-3 px-4">Lender Name</th>
                                <th className="py-3 px-4">Account Number</th>
                                <th className="py-3 px-4">Opened Date</th>
                                <th className="py-3 px-4 text-center">Current Balance</th>
                                <th className="py-3 px-4 text-center">Status</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td className="py-4 px-4 font-bold text-slate-900">Slice Small Finance Bank Limited</td>
                                <td className="py-4 px-4 text-slate-600">XXXX6135</td>
                                <td className="py-4 px-4 text-slate-600">30 Nov 2021</td>
                                <td className="py-4 px-4 font-bold text-slate-900 text-center">? 7,839</td>
                                <td className="py-4 px-4 text-center">
                                  <div className="w-4 h-4 border border-slate-300 rounded-full mx-auto"></div>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                        <div className="flex justify-end mt-4">
                          <div className="px-5 py-2 bg-[#8492a6] text-white rounded font-medium text-[10px] flex items-center gap-2 shadow-sm"><CheckCircle2 size={12} /> Submit Selections</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 3: Access Money */}
              <div className="flex flex-col md:flex-row items-center gap-12">
                <div className="md:w-1/2 order-2 md:order-1">
                  <div className="relative w-full max-w-lg mx-auto bg-slate-200/50 p-6 rounded-2xl">
                    {/* Access Mockup */}
                    <div className="bg-[#f8fafc] rounded-xl shadow-xl overflow-hidden border border-slate-200">
                      <div className="p-5 border-b border-slate-200 bg-white">
                        <h4 className="font-bold text-[#001845] text-lg">Access Money</h4>
                        <p className="text-[11px] text-slate-500">Request a loan or credit facility for this customer.</p>
                      </div>
                      
                      <div className="p-6">
                        <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm relative">
                          <div className="space-y-4">
                            <div>
                              <label className="text-[10px] font-bold text-[#001845] mb-1.5 block">Loan Type</label>
                              <div className="h-10 border border-[#001845] rounded-lg px-3 flex items-center justify-between cursor-pointer">
                                <span className="text-[11px] text-[#001845]">Anchor Channel Fin</span>
                                <ChevronDown size={14} className="text-[#001845]"/>
                              </div>
                            </div>
                            
                            {/* Dropdown Options Overlay */}
                            <div className="absolute top-20 left-5 right-5 bg-white border border-slate-200 rounded-lg shadow-xl z-10 p-1">
                              <div className="px-3 py-2 bg-[#e0e7ff] text-[#001845] rounded text-[11px] font-medium cursor-pointer">Anchor Channel Fin</div>
                              <div className="px-3 py-2 text-slate-700 rounded text-[11px] cursor-pointer hover:bg-slate-50">Open Channel Fin</div>
                              <div className="px-3 py-2 text-slate-700 rounded text-[11px] cursor-pointer hover:bg-slate-50">Unsecured OD</div>
                              <div className="px-3 py-2 text-slate-700 rounded text-[11px] cursor-pointer hover:bg-slate-50">Unsecured TL</div>
                              <div className="px-3 py-2 text-slate-700 rounded text-[11px] cursor-pointer hover:bg-slate-50">Vehicle Loan</div>
                            </div>

                            <div className="pt-24">
                              <label className="text-[10px] font-bold text-[#001845] mb-1.5 block">Amount</label>
                              <div className="h-10 border border-slate-200 rounded-lg px-3 flex items-center">
                                <span className="text-[11px] text-slate-400">Enter amount</span>
                              </div>
                            </div>

                            <div className="w-full py-3 mt-4 bg-[#001845] rounded-lg flex justify-center text-[11px] font-bold text-white cursor-pointer shadow-md hover:bg-blue-900 transition-colors">
                              Submit Request
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="md:w-1/2 order-1 md:order-2 space-y-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xl">3</div>
                  <h3 className="text-2xl font-bold text-slate-900">Access New Capital</h3>
                  <p className="text-slate-600 text-lg">
                    Once the profile is optimized, originate new credit seamlessly. Request diverse loan types from Unsecured ODs to Vehicle Loans with one click, mapping directly to your underwriting engines.
                  </p>
                </div>
              </div>

              {/* Step 4: Wallet Dashboard */}
              <div className="flex flex-col md:flex-row items-center gap-12">
                <div className="md:w-1/2 space-y-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xl">4</div>
                  <h3 className="text-2xl font-bold text-slate-900">Wallet Dashboard</h3>
                  <p className="text-slate-600 text-lg">
                    Stay fully aware of your organizational wallet balances. Track your prepaid funds dedicated to fetching BSA, GST, ITR, and CIBIL reports, ensuring zero downtime in your operations.
                  </p>
                </div>
                <div className="md:w-1/2">
                  <div className="relative w-full max-w-xl mx-auto bg-slate-200/50 p-6 rounded-2xl overflow-x-auto">
                    {/* Wallet Mockup */}
                    <div className="bg-[#f8fafc] rounded-xl shadow-xl overflow-hidden border border-slate-200 min-w-[500px]">
                      <div className="p-5 border-b border-slate-200 bg-white">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <Wallet size={18} className="text-[#001845]" />
                              <h4 className="font-bold text-[#001845] text-xl">Wallet Dashboard</h4>
                            </div>
                            <p className="text-[11px] text-slate-500">Wallet balances and pending payments for <strong className="text-[#001845]">ashok_traders</strong></p>
                          </div>
                        </div>
                        <div className="mt-4 px-4 py-2 bg-[#001845] text-white rounded-lg inline-flex items-center gap-2 text-[10px] font-bold shadow-md">
                          <CreditCard size={12} /> Pay for ashok_traders
                        </div>
                      </div>
                      
                      <div className="p-6">
                        <h5 className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-4">WALLET BALANCES</h5>
                        <div className="grid grid-cols-4 gap-3">
                          <div className="bg-white border border-slate-100 rounded-xl p-4 flex flex-col items-center shadow-sm">
                            <div className="w-6 h-6 border border-slate-200 rounded flex items-center justify-center text-slate-400 mb-2"><Building size={10} /></div>
                            <p className="text-[9px] font-bold text-slate-500 mb-1">BSA</p>
                            <p className="text-sm font-bold text-[#001845]">Rs.565</p>
                          </div>
                          <div className="bg-white border border-slate-100 rounded-xl p-4 flex flex-col items-center shadow-sm">
                            <div className="w-6 h-6 border border-slate-200 rounded flex items-center justify-center text-slate-400 mb-2"><FileText size={10} /></div>
                            <p className="text-[9px] font-bold text-slate-500 mb-1">GST</p>
                            <p className="text-sm font-bold text-[#001845]">Rs.561</p>
                          </div>
                          <div className="bg-white border border-slate-100 rounded-xl p-4 flex flex-col items-center shadow-sm">
                            <div className="w-6 h-6 border border-slate-200 rounded flex items-center justify-center text-slate-400 mb-2"><PieChart size={10} /></div>
                            <p className="text-[9px] font-bold text-slate-500 mb-1">ITR</p>
                            <p className="text-sm font-bold text-[#001845]">Rs.0</p>
                          </div>
                          <div className="bg-white border border-slate-100 rounded-xl p-4 flex flex-col items-center shadow-sm">                     <div className="w-6 h-6 border border-slate-200 rounded flex items-center justify-center text-slate-400 mb-2"><ShieldCheck size={10} /></div>
                            <p className="text-[9px] font-bold text-slate-500 mb-1">CIBIL</p>
                            <p className="text-sm font-bold text-[#001845]">Rs.643</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

          <div id="pricings"><PricingSection /></div>
        {/* Closing CTA */}
        <section className="closing-cta" style={{ background: '#002366', color: 'white', padding: '100px 20px', textAlign: 'center' }}>
          <div className="closing-content reveal">
            <h2 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '1rem',color:'whitesmoke' }}>Ready to empower your network?</h2>
            <p style={{ fontSize: '1.125rem', opacity: 0.9, maxWidth: '600px', margin: '0 auto 2.5rem auto' }}>
              Join the leading users and lenders managing their entire verification lifecycle through CRISP.
            </p>
            <Link to="/anchors/login" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'white', color: '#002366', padding: '12px 24px', borderRadius: '8px', fontWeight: 600 }}>
              Access Anchor Portal <ArrowRight size={18} />
            </Link>
          </div>
        </section>

      </main>
    </AnchorMarketingLayout>
  );
}
