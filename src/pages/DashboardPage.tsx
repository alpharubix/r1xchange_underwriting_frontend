import { useState, useEffect } from 'react';

import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  FileText,
  Building2,
  CreditCard,
  PieChart,
  ShieldCheck,
  HelpCircle,
  Minus,
  Plus,
  ShoppingCart,
} from 'lucide-react';
import { KycModal } from '@/components/KycModal';
import HomeIntro from '@/components/HomeIntro';
import BsaUploadModal from '@/components/BsaUploadModal';
import ItrUploadModal from '@/components/ItrUploadModal';
import PaymentModal from '@/components/PaymentModal';
import { getPricingDetails } from '@/components/PaymentModal';
import { getWalletBalance } from '@/api/payment';
import type { ServiceBreakup } from '@/api/payment';
import { toast } from 'sonner';
import { useLocation } from 'react-router-dom';
export default function DashboardPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [companyName, setCompanyName] = useState<string>('');
  
  const [isItrModalOpen, setIsItrModalOpen] = useState(false);
  const [isKycModalOpen, setIsKycModalOpen] = useState(false);
  const [isCheckingWallet, setIsCheckingWallet] = useState(false);
  const [cartTouched, setCartTouched] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [quantities, setQuantities] = useState<Record<string, number>>({
    BSA: 1,
    GST: 1,
    ITR: 1,
    CIBIL: 1,
  });
  const navigate = useNavigate();

  const location = useLocation();

  const updateQuantity = (service: string, change: number) => {
    setCartTouched(true);
    setQuantities((current) => ({
      ...current,
      [service]: Math.min(10, Math.max(0, (current[service] || 0) + change)),
    }));
  };

  const cartItems = [
    { service: 'BSA', label: 'Bank Statement Analysis', pricing: getPricingDetails('BSA', 1) },
    { service: 'GST', label: 'Goods & Services Tax', pricing: getPricingDetails('GST', 1) },
    { service: 'ITR', label: 'Income Tax Returns', pricing: getPricingDetails('ITR', 1) },
    { service: 'CIBIL', label: 'CIBIL Credit Report', pricing: getPricingDetails('CIBIL', 1) },
  ].map((item) => ({
    ...item,
    qty: quantities[item.service] || 0,
  }));

  const [highlightedService, setHighlightedService] = useState<string | undefined>(undefined);
  const [showHomeIntro, setShowHomeIntro] = useState(false);
  const selectedCartItems = cartItems.filter((item) => item.qty > 0);
  const cartSubtotal = selectedCartItems.reduce((sum, item) => sum + item.pricing.base * item.qty, 0);
  const cartIgst = Number((cartSubtotal * 0.18).toFixed(2));
  const cartTotal = Number((cartSubtotal + cartIgst).toFixed(2));
  const cartSelection: ServiceBreakup[] = cartItems.map((item) => ({
    service: item.service,
    qty: item.qty,
  }));
  const cartBreakup: ServiceBreakup[] = selectedCartItems.map((item) => ({
    service: item.service,
    qty: item.qty,
  }));

  const openCartPayment = () => {
    if (cartBreakup.length === 0) {
      toast.error('Select at least one service before checkout.');
      return;
    }
    setCheckoutOpen(true);
  };

  const handleModuleClick = async (serviceId: string, onWalletAvailable: () => void) => {
    try {
      console.log("Cart touched ",cartTouched);
      setIsCheckingWallet(true);
      const response = await getWalletBalance(serviceId);

      if (response.data?.is_balance_available) {
        onWalletAvailable();
        return;
      }

      setCartTouched(true);
      toast.info(`Please add credits to analyze the ${serviceId} reports`);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to check wallet balance.');
    } finally {
      setIsCheckingWallet(false);
    }
  };

  useEffect(() => {
    setCompanyName(sessionStorage.getItem("company_name") ?? "");
    console.log("Welcome ",companyName);
    const shouldShowIntro = sessionStorage.getItem("show_home_intro");

    if (shouldShowIntro === "true") {
      setShowHomeIntro(true);

      // Consume the flag so it doesn't show again
      sessionStorage.removeItem("show_home_intro");
    }
  }, []);


    useEffect(() => {
      const service = location.state?.highlight as string ;
      console.log("Service is ",service);

      if (!service) return;

      setHighlightedService(service);

      const timer = setTimeout(() => {
        setHighlightedService(undefined);
      }, 2000);

      return () => clearTimeout(timer);
    }, [location.state]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isModalOpen) setIsModalOpen(false);
        if (isItrModalOpen) setIsItrModalOpen(false);
        if (isKycModalOpen) setIsKycModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen, isItrModalOpen, isKycModalOpen]);

  const dashboardItems = [
    {
      title: 'Bank Statement Analysis',
      description: '12 month period for 1 Bank Acc.',
      moduleId: 'BSA',
      icon: <Building2 className="h-8 w-8 text-[#002366]" />,
      onClick: () => {
        void handleModuleClick('BSA', () => setIsModalOpen(true));
      },
      disabled: false,
    },
    {
      title: 'GSTR Analysis',
      description: '12 month period for 1 GST No.',
      moduleId: 'GST',
      icon: <FileText className="h-8 w-8 text-[#002366]" />,
      onClick: () => {
        void handleModuleClick('GST', () => navigate('/gst/analysis'));
      },
      disabled: false,
    },
    {
      title: 'ITR',
      description: '2 Financial Years for 1 Business',
      moduleId: 'ITR',
      icon: <PieChart className="h-8 w-8 text-[#002366]" />,
      disabled: false,
      onClick: () => {
        void handleModuleClick('ITR', () => setIsItrModalOpen(true));
      },
    },
    {
      title: 'KYC',
      description: 'Identity Verification',
      icon: <ShieldCheck className="h-8 w-8 text-[#002366]" />,
      disabled: false,
      onClick: () => {
        setIsKycModalOpen(true);
      },
    },
    {
      title: 'CIBIL Score',
      description: 'Credit Bureau Records till date',
      moduleId: 'CIBIL',
      icon: <CreditCard className="h-8 w-8 text-[#002366]" />,
      disabled: false,
      onClick: () => {
        void handleModuleClick('CIBIL', () => navigate('/cibil'));
      },
    },

  ];

  return (

    <>

      {showHomeIntro && <HomeIntro />}
      <div className={`${highlightedService ? 'p-8 pb-4 animate-fade-in relative min-h-screen flex flex-col ' : 'p-8 pb-4 animate-fade-in relative min-h-screen flex flex-col '}`}>
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#002366] mb-2">Dashboard</h1>
            <p className="text-gray-600">
              Access your financial documents and analysis tools
            </p>
          </div>
          <Button
            onClick={() => navigate('/help-center')}
            variant="outline"
            className="flex items-center gap-2 border-[#002366]/30 text-[#002366] hover:bg-[#002366]/5 px-4 py-2 font-semibold shadow-sm"
          >
            <HelpCircle className="h-4 w-4 text-[#002366]" />
            Help Center
          </Button>
        </div>

        <div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {dashboardItems.map((item, index) => (
              <Card
                  key={index}
                  className={`transition-all duration-500 ${
                    item.disabled
                      ? 'opacity-60 cursor-not-allowed bg-gray-50'
                      : highlightedService
                        ? highlightedService === item.moduleId
                          ? 'relative z-20 cursor-pointer border-3 border-[#002366] bg-white shadow-[0_0_40px_rgba(0,35,102,0.85)] scale-[1.42]'
                          : 'blur-sm opacity-40 pointer-events-none'
                        : 'hover:shadow-xl hover:-translate-y-1 cursor-pointer border-[#002366]/20 hover:border-[#002366]/50 bg-white'
                  }`}
                onClick={!item.disabled ? item.onClick : undefined}
                aria-busy={isCheckingWallet}
              >
                <CardHeader className="flex flex-row items-center gap-4 pb-2">
                  <div className={`rounded-xl p-3 ${item.disabled ? 'bg-gray-200' : 'bg-blue-50'}`}>
                    {item.icon}
                  </div>
                  <div>
                    <CardTitle className="text-xl">{item.title}</CardTitle>
                  <CardDescription className="whitespace-pre-line">{item.description}</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  {!item.disabled && (
                    <div className="mt-4 flex items-center justify-between gap-3 text-sm font-medium text-[#002366]">
                      <span>Click to proceed <span className="ml-2">→</span></span>
                      {item.moduleId && (
                        <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 p-1" onClick={(event) => event.stopPropagation()}>
                          <button
                            type="button"
                            aria-label={`Decrease ${item.moduleId} quantity`}
                            onClick={() => updateQuantity(item.moduleId!, -1)}
                            disabled={(quantities[item.moduleId] || 0) === 0}
                            className="flex h-7 w-7 items-center justify-center rounded-md text-[#002366] hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="min-w-5 text-center text-sm font-bold text-slate-700">{quantities[item.moduleId] || 0}</span>
                          <button
                            type="button"
                            aria-label={`Increase ${item.moduleId} quantity`}
                            onClick={() => updateQuantity(item.moduleId!, 1)}
                            disabled={(quantities[item.moduleId] || 0) === 10}
                            className="flex h-7 w-7 items-center justify-center rounded-md text-[#002366] hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          
            <div className="mt-2 flex justify-end">
              <Button onClick={openCartPayment} disabled={selectedCartItems.length === 0} className="h-11 rounded-xl bg-[#002366] px-6 font-bold text-white hover:bg-[#002366]/90">
                <ShoppingCart className="mr-2 h-4 w-4" />
                Go to Checkout
              </Button>
            </div>
          
        </div>

        <BsaUploadModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        <ItrUploadModal isOpen={isItrModalOpen} onClose={() => setIsItrModalOpen(false)} />

        <PaymentModal
          isOpen={checkoutOpen}
          onClose={() => setCheckoutOpen(false)}
          moduleName="Checkout"
          serviceId="BSA"
          amount={cartTotal}
          servicesBreakup={cartSelection}
          onQuantityChange={updateQuantity}
          onSuccess={() => {
            setCheckoutOpen(false);
            setQuantities({ BSA: 1, GST: 1, ITR: 1, CIBIL: 1 });
            setCartTouched(false);
          }}
        />

        <div className="flex items-center justify-center gap-4 text-sm mt-auto pt-8 pb-0">
          <div className="w-20 h-px bg-[#002366]" />
          <span className="text-black">///</span>

          <span className="font-semibold text-gray-800">
            Fueling the Future of Lending
          </span>

          <div className="w-px h-5 bg-gray-300" />

          <span className="text-gray-500">
            Engineered in Bengaluru 🖤
          </span>

          <span className="text-black">///</span>
          <div className="w-20 h-px bg-[#002366]" />
        </div>
        {/* Kyc Modal */}
        <KycModal isOpen={isKycModalOpen} onClose={() => setIsKycModalOpen(false)} />
      </div>
    </>
  );
}
