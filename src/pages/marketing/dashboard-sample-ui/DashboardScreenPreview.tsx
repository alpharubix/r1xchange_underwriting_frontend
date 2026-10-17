import { useState } from 'react';
import {
  Building2,
  FileText,
  PieChart,
  ShieldCheck,
  CreditCard,
  HelpCircle,
  BriefcaseBusiness,
  Plus,
  Minus,
  ArrowRight,
  ShoppingCart,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export function DashboardScreenPreview() {
  const [quantities, setQuantities] = useState<Record<string, number>>({
    BSA: 1,
    GST: 2,
    ITR: 1,
    CIBIL: 1,
  });

  const [activeCard, setActiveCard] = useState<string | null>(null);

  const updateQuantity = (service: string, delta: number) => {
    setQuantities((prev) => ({
      ...prev,
      [service]: Math.min(10, Math.max(0, (prev[service] || 0) + delta)),
    }));
  };

  const services = [
    {
      id: 'BSA',
      title: 'Bank Statement Analysis',
      description: '12 month period for 1 Bank Acc.',
      basePrice: 479,
      icon: <Building2 className="h-6 w-6 text-[#002366]" />,
      hasQuantity: true,
      badge: 'BSA Module',
    },
    {
      id: 'GST',
      title: 'GSTR Analysis',
      description: '12 month period for 1 GST No.',
      basePrice: 475,
      icon: <FileText className="h-6 w-6 text-[#002366]" />,
      hasQuantity: true,
      badge: 'GST Intelligence',
    },
    {
      id: 'ITR',
      title: 'ITR',
      description: '2 Financial Years for 1 Business',
      basePrice: 445,
      icon: <PieChart className="h-6 w-6 text-[#002366]" />,
      hasQuantity: true,
      badge: 'Income Verification',
    },
    {
      id: 'KYC',
      title: 'KYC',
      description: 'Identity Verification (DigiLocker)',
      basePrice: 0,
      icon: <ShieldCheck className="h-6 w-6 text-[#002366]" />,
      hasQuantity: false,
      badge: 'Free with Assessment',
    },
    {
      id: 'CIBIL',
      title: 'CIBIL Score',
      description: 'Credit Bureau Records till date',
      basePrice: 545,
      icon: <CreditCard className="h-6 w-6 text-[#002366]" />,
      hasQuantity: true,
      badge: 'Credit Bureau',
    },
  ];

  // Calculate live subtotal & tax
  const subtotal = services.reduce((acc, s) => {
    if (!s.hasQuantity) return acc;
    return acc + s.basePrice * (quantities[s.id] || 0);
  }, 0);
  const igst = Number((subtotal * 0.18).toFixed(2));
  const total = Number((subtotal + igst).toFixed(2));

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 sm:p-7 space-y-6">
      {/* Dashboard Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xl sm:text-2xl font-black text-[#002366] tracking-tight">
              Dashboard
            </h3>
            <span className="px-2 py-0.5 rounded-full bg-blue-50 text-[#002366] font-bold text-[10px] tracking-wider uppercase border border-blue-200/60">
              Live Preview
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Access your financial documents and analysis tools
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            style={{
              height: '28px',
              minHeight: 'unset',
              lineHeight: '1',
              padding: '2px 10px',
            }}
            className="inline-flex items-center gap-1.5 font-semibold text-[#002366] bg-white border border-[#002366]/30 rounded-lg shadow-2xs hover:bg-blue-50/50 transition-colors cursor-pointer"
          >
            <HelpCircle size={13} className="text-[#002366]" /> 
            <span style={{ fontSize: '11px', color: '#002366', whiteSpace: 'nowrap' }}>Help Center</span>
          </button>
          <Link
            to="/login"
            style={{
              height: '28px',
              minHeight: 'unset',
              lineHeight: '1',
              padding: '2px 12px',
              color: '#ffffff',
              backgroundColor: '#002366',
            }}
            className="inline-flex items-center gap-1.5 text-xs font-bold !text-white bg-[#002366] rounded-lg hover:bg-[#001a4e] transition-colors shadow-2xs cursor-pointer whitespace-nowrap"
          >
            <span style={{ fontSize: '11px', color: '#ffffff', whiteSpace: 'nowrap' }}>Sign In to Explore</span>
            <ArrowRight size={12} className="text-white" />
          </Link>
        </div>
      </div>

      {/* User Welcome Chip matching real DashboardPage.tsx */}
      <div className="flex items-center gap-3 bg-slate-50/80 p-3 rounded-xl border border-slate-200/70">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white border border-[#002366]/15 shadow-2xs">
          <BriefcaseBusiness className="h-5 w-5 text-[#002366]" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Welcome back
          </p>
          <div className="flex items-center gap-2">
            <h4 className="truncate text-sm font-bold text-[#002366]">
              M/S Zenith Enterprises
            </h4>
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
        </div>
        <div className="text-right hidden sm:block">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
            Wallet Balance
          </span>
          <span className="text-xs font-bold text-slate-800 font-sans">
            ₹15,000.00
          </span>
        </div>
      </div>

      {/* 5 Service Cards Grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Available Assessment Services
          </span>
          <span className="text-[11px] text-slate-500">
            Adjust quantities or click any card to launch analysis
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {services.map((item) => {
            const isHovered = activeCard === item.id;
            const qty = quantities[item.id] || 0;

            return (
              <div
                key={item.id}
                onMouseEnter={() => setActiveCard(item.id)}
                onMouseLeave={() => setActiveCard(null)}
                className={`relative flex flex-col justify-between p-4 rounded-xl border bg-white transition-all duration-200 ${
                  isHovered
                    ? 'border-[#002366] shadow-md ring-1 ring-[#002366]/20 -translate-y-0.5'
                    : 'border-slate-200 hover:border-slate-300 shadow-2xs'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50/80 border border-blue-100">
                      {item.icon}
                    </div>
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                      {item.badge}
                    </span>
                  </div>

                  <h5 className="text-sm font-bold text-[#002366] leading-tight">
                    {item.title}
                  </h5>
                  <p className="mt-1 text-[11px] text-slate-500 leading-normal">
                    {item.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-[#002366] flex items-center gap-1 group cursor-pointer">
                    Click to proceed
                    <ArrowRight size={12} className="transition-transform group-hover:translate-x-0.5" />
                  </span>

                  {item.hasQuantity ? (
                    <div className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-1.5 py-0.5">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          updateQuantity(item.id, -1);
                        }}
                        className="h-5 w-5 rounded text-[#002366] hover:bg-slate-200 flex items-center justify-center transition-colors"
                      >
                        <Minus size={11} strokeWidth={2.5} />
                      </button>
                      <span className="min-w-4 text-center font-bold text-xs text-slate-800 font-mono">
                        {qty}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          updateQuantity(item.id, 1);
                        }}
                        className="h-5 w-5 rounded text-[#002366] hover:bg-slate-200 flex items-center justify-center transition-colors"
                      >
                        <Plus size={11} strokeWidth={2.5} />
                      </button>
                    </div>
                  ) : (
                    <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                      Free Included
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Cart Summary Strip matching the platform cart functionality */}
      <div className="bg-[#002366] text-white p-3.5 sm:p-4 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-blue-200">
            <ShoppingCart size={16} />
          </div>
          <div>
            <div className="text-xs font-bold">Cart Selection Summary</div>
            <div className="text-[11px] text-blue-200">
              {Object.values(quantities).reduce((a, b) => a + b, 0)} services selected · Base: ₹{subtotal.toLocaleString('en-IN')} + 18% IGST (₹{igst})
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
          <div className="text-right">
            <span className="text-[10px] text-blue-200 uppercase tracking-wider block">Estimated Total</span>
            <span className="text-base font-black text-white font-mono">
              ₹{total.toLocaleString('en-IN')}
            </span>
          </div>

          <Link
            to="/signup"
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 shadow"
          >
            Start Analysis <ArrowRight size={13} />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default DashboardScreenPreview;