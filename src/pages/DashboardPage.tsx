import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { BriefcaseBusiness } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

import {
  Building2,
  CreditCard,
  FileText,
  HelpCircle,
  Minus,
  PieChart,
  Plus,
  ShieldCheck,
  ShoppingCart,
} from 'lucide-react';

import { KycModal } from '@/components/KycModal';
import HomeIntro from '@/components/HomeIntro';
import BsaUploadModal from '@/components/BsaUploadModal';
import ItrUploadModal from '@/components/ItrUploadModal';
import PaymentModal, { getPricingDetails } from '@/components/PaymentModal';

import { getWalletBalance } from '@/api/payment';
import type { ServiceBreakup } from '@/api/payment';

import { toast } from 'sonner';

export default function DashboardPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [companyName, setCompanyName] = useState<string>('');
  const [isItrModalOpen, setIsItrModalOpen] = useState(false);
  const [isKycModalOpen, setIsKycModalOpen] = useState(false);
  const [isCheckingWallet, setIsCheckingWallet] = useState(false);
  // const [cartTouched, setCartTouched] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  const [quantities, setQuantities] = useState<Record<string, number>>({
    BSA: 1,
    GST: 1,
    ITR: 1,
    CIBIL: 1,
  });

  const [highlightedService, setHighlightedService] = useState<string | undefined>(undefined);
  const [showHomeIntro, setShowHomeIntro] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Quantity
  const updateQuantity = (service: string, change: number) => {
    //setCartTouched(true);

    setQuantities((current) => ({
      ...current,
      [service]: Math.min(10, Math.max(0, (current[service] || 0) + change)),
    }));
  };

  // Cart
  const cartItems = [
    {
      service: 'BSA',
      label: 'Bank Statement Analysis',
      pricing: getPricingDetails('BSA', 1),
    },
    {
      service: 'GST',
      label: 'Goods & Services Tax',
      pricing: getPricingDetails('GST', 1),
    },
    {
      service: 'ITR',
      label: 'Income Tax Returns',
      pricing: getPricingDetails('ITR', 1),
    },
    {
      service: 'CIBIL',
      label: 'CIBIL Credit Report',
      pricing: getPricingDetails('CIBIL', 1),
    },
  ].map((item) => ({
    ...item,
    qty: quantities[item.service] || 0,
  }));

  const selectedCartItems = cartItems.filter((item) => item.qty > 0);

  const cartSubtotal = selectedCartItems.reduce(
    (sum, item) => sum + item.pricing.base * item.qty,
    0
  );

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

  // Checkout
  const openCartPayment = () => {
    if (cartBreakup.length === 0) {
      toast.error('Select at least one service before checkout.');
      return;
    }

    setCheckoutOpen(true);
  };

  // Wallet Check
  const handleModuleClick = async (
    serviceId: string,
    onWalletAvailable: () => void
  ) => {
    try {
      // console.log('Cart touched ', cartTouched);

      setIsCheckingWallet(true);

      const response = await getWalletBalance(serviceId);

      if (response.data?.is_balance_available) {
        onWalletAvailable();
        return;
      }

      //setCartTouched(true);

      toast.info(`Please add credits to analyze the ${serviceId} reports`);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || 'Failed to check wallet balance.'
      );
    } finally {
      setIsCheckingWallet(false);
    }
  };

  // Company Name + Home Intro
  useEffect(() => {
    setCompanyName(sessionStorage.getItem('company_name') ?? '');

    const shouldShowIntro = sessionStorage.getItem('show_home_intro');

    if (shouldShowIntro === 'true') {
      setShowHomeIntro(true);
      sessionStorage.removeItem('show_home_intro');
    }
  }, []);

  // Highlight Service
  useEffect(() => {
    const service = location.state?.highlight as string | undefined;

    // console.log('Service is ', service);

    if (!service) {
      return;
    }

    setHighlightedService(service);

    const timer = setTimeout(() => {
      setHighlightedService(undefined);
    }, 3000);

    return () => clearTimeout(timer);
  }, [location.state]);

  // Escape Key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') {
        return;
      }

      if (isModalOpen) {
        setIsModalOpen(false);
      }

      if (isItrModalOpen) {
        setIsItrModalOpen(false);
      }

      if (isKycModalOpen) {
        setIsKycModalOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isModalOpen, isItrModalOpen, isKycModalOpen]);

  // Dashboard Items
  const dashboardItems = [
    {
      title: 'Bank Statement Analysis',
      description: '12 month period for 1 Bank Acc.',
      moduleId: 'BSA',
      icon: <Building2 className="h-7 w-7 text-[#002366]" />,
      onClick: () => {
        void handleModuleClick('BSA', () => setIsModalOpen(true));
      },
      disabled: false,
    },
    {
      title: 'GSTR Analysis',
      description: '12 month period for 1 GST No.',
      moduleId: 'GST',
      icon: <FileText className="h-7 w-7 text-[#002366]" />,
      onClick: () => {
        void handleModuleClick('GST', () => navigate('/gst/analysis'));
      },
      disabled: false,
    },
    {
      title: 'ITR',
      description: '2 Financial Years for 1 Business',
      moduleId: 'ITR',
      icon: <PieChart className="h-7 w-7 text-[#002366]" />,
      onClick: () => {
        void handleModuleClick('ITR', () => setIsItrModalOpen(true));
      },
      disabled: false,
    },
    {
      title: 'KYC',
      description: 'Identity Verification',
      icon: <ShieldCheck className="h-7 w-7 text-[#002366]" />,
      onClick: () => {
        setIsKycModalOpen(true);
      },
      disabled: false,
    },
    {
      title: 'CIBIL Score',
      description: 'Credit Bureau Records till date',
      moduleId: 'CIBIL',
      icon: <CreditCard className="h-7 w-7 text-[#002366]" />,
      onClick: () => {
        void handleModuleClick('CIBIL', () => navigate('/cibil'));
      },
      disabled: false,
    },
  ];

  return (
    <>
      {showHomeIntro && <HomeIntro />}

      <div className="relative flex min-h-screen flex-col p-7 pb-4 animate-fade-in">
        {/* Header */}
        <div className="mb-7 flex items-center justify-between">
          <div>
            <h1 className="mb-1 text-3xl font-bold text-[#002366]">
              Dashboard
            </h1>

            <p className="text-gray-600">
              Access your financial documents and analysis tools
            </p>
          </div>

          <Button
            onClick={() => navigate('/help-center')}
            variant="outline"
            className="flex items-center gap-2 border-[#002366]/30 px-4 py-2 font-semibold text-[#002366] shadow-sm hover:bg-[#002366]/5"
          >
            <HelpCircle className="h-4 w-4 text-[#002366]" />
            Help Center
          </Button>
        </div>
    <div className="mb-6 flex items-center gap-3  ">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#002366]/5 border border-[#002366]/10">
        <BriefcaseBusiness className="h-5 w-5 text-[#002366]" />
      </div>

      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
          Welcome back
        </p>
        <h2 className="truncate text-lg font-bold text-[#002366] animate-pulse">
          {companyName}
        </h2>
      </div>
    </div>
        {/* Service Cards */}
        <div className="w-full">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {dashboardItems.map((item, index) => {
              const isHighlighted =
                Boolean(highlightedService) &&
                highlightedService === item.moduleId;

              const shouldBlur =
                Boolean(highlightedService) && !isHighlighted;

              return (
                <Card
                  key={index}
                  onClick={!item.disabled ? item.onClick : undefined}
                  aria-busy={isCheckingWallet}
                  className={`h-[160px] min-h-0 overflow-hidden rounded-2xl border bg-white transition-all duration-500 ${
                    item.disabled
                      ? 'cursor-not-allowed border-gray-200 bg-gray-50 opacity-60'
                      : isHighlighted
                        ? 'relative z-20 cursor-pointer scale-[1.02] border-2 border-[#002366] bg-white shadow-[0_0_35px_rgba(0,35,102,0.65)]'
                        : shouldBlur
                          ? 'pointer-events-none cursor-default blur-sm opacity-35'
                          : 'cursor-pointer border-[#002366]/20 hover:-translate-y-1 hover:border-[#002366]/50 hover:shadow-lg'
                  }`}
                >
                  <div className="flex h-full min-h-0 flex-col">
                    {/* Card Top */}
                    <div className="flex items-start gap-4 p-5">
                      <div
                        className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${
                          item.disabled ? 'bg-gray-200' : 'bg-blue-50'
                        }`}
                      >
                        {item.icon}
                      </div>

                      <div className="min-w-0 pt-1">
                        <h3 className="text-xl font-bold leading-tight text-[#002366]">
                          {item.title}
                        </h3>

                        <p className="mt-1 text-xs leading-5 text-[#5c6590]">
                          {item.description}
                        </p>
                      </div>
                    </div>

                    {/* Card Bottom */}
                    <div className="mt-auto px-5 pb-2 ">
      
                      {!item.disabled && (
                        <div className="flex items-center justify-between gap-3 text-xs font-small text-[#002366] rounded-lg ">
                          <span className="whitespace-nowrap text-s">
                            Click to proceed
                            <span className="ml-3">→</span>
                          </span>

                          {item.moduleId && (
                            <div
                              className="flex h-7 bg-amber-100 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-1"
                              onClick={(event) => event.stopPropagation()}
                            >
                              <button
                                type="button"
                                aria-label={`Decrease ${item.moduleId} quantity`}
                                onClick={() =>
                                  updateQuantity(item.moduleId!, -1)
                                }
                                disabled={
                                  (quantities[item.moduleId] || 0) === 0
                                }
                                className="flex h-8 w-8 items-center justify-center rounded-lg text-[#002366]  disabled:cursor-not-allowed disabled:opacity-40"
                              >
                                <Minus className="h-4 w-4  hover:bg-[#002366]/5 rounded-full" />
                              </button>

                              <span className="min-w-5 text-center text-sm font-bold text-slate-700">
                                {quantities[item.moduleId] || 0}
                              </span>

                              <button
                                type="button"
                                aria-label={`Increase ${item.moduleId} quantity`}
                                onClick={() =>
                                  updateQuantity(item.moduleId!, 1)
                                }
                                disabled={
                                  (quantities[item.moduleId] || 0) === 10
                                }
                                className="flex h-8 w-8 items-center justify-center rounded-lg text-[#002366]   disabled:cursor-not-allowed disabled:opacity-40"
                              >
                                <Plus className="h-4 w-4 hover:bg-[#002366]/5 rounded-full" />
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Checkout */}
          <div className="mt-4 flex justify-end">
            <Button
              onClick={openCartPayment}
              disabled={selectedCartItems.length === 0}
              className="h-11 rounded-xl bg-[#002366] px-6 font-bold text-white hover:bg-[#002366]/90"
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              Go to Checkout
            </Button>
          </div>
        </div>

        {/* BSA Modal */}
        <BsaUploadModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />

        {/* ITR Modal */}
        <ItrUploadModal
          isOpen={isItrModalOpen}
          onClose={() => setIsItrModalOpen(false)}
        />

        {/* Payment Modal */}
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

            setQuantities({
              BSA: 1,
              GST: 1,
              ITR: 1,
              CIBIL: 1,
            });

            // setCartTouched(false);
          }}
        />

        {/* Footer */}
        <div className="mt-auto flex items-center justify-center gap-4 pt-8 pb-0 text-sm">
          <div className="h-px w-20 bg-[#002366]" />

          <span className="text-black">///</span>

          <span className="font-semibold text-gray-800">
            Fueling the Future of Lending
          </span>

          <div className="h-5 w-px bg-gray-300" />

          <span className="text-gray-500">
            Engineered in Bengaluru 🖤
          </span>

          <span className="text-black">///</span>

          <div className="h-px w-20 bg-[#002366]" />
        </div>

        {/* KYC Modal */}
        <KycModal
          isOpen={isKycModalOpen}
          onClose={() => setIsKycModalOpen(false)}
        />
      </div>
    </>
  );
}