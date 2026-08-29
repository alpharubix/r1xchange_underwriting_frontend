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
} from 'lucide-react';
import { KycModal } from '@/components/KycModal';
import HomeIntro from '@/components/HomeIntro';
import BsaUploadModal from '@/components/BsaUploadModal';
import ItrUploadModal from '@/components/ItrUploadModal';

export default function DashboardPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [companyName, setCompanyName] = useState<string>('');
  
  const [isItrModalOpen, setIsItrModalOpen] = useState(false);
  const [isKycModalOpen, setIsKycModalOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    console.log("Company name " + companyName)

    setCompanyName(sessionStorage.getItem('company_name') ?? '');
  }, [])

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
      description: 'Upload & Analysis',
      icon: <Building2 className="h-8 w-8 text-[#000000]" />,
      onClick: () => {
        setIsModalOpen(true);
      },
      disabled: false,
    },
    {
      title: 'GSTR Analysis',
      description: 'Analysis GSTR',
      icon: <FileText className="h-8 w-8 text-[#000000]" />,
      onClick: () => {
        navigate('/gst/analysis');
      },
      disabled: false,
    },
    {
      title: 'ITR',
      description: 'Income Tax Return',
      icon: <PieChart className="h-8 w-8 text-[#000000]" />,
      disabled: false,
      onClick: () => {
        setIsItrModalOpen(true);
      },
    },
    {
      title: 'KYC',
      description: 'Identity Verification',
      icon: <ShieldCheck className="h-8 w-8 text-[#000000]" />,
      disabled: false,
      onClick: () => {
        setIsKycModalOpen(true);
      },
    },
    {
      title: 'CIBIL Score',
      description: 'Credit Report',
      icon: <CreditCard className="h-8 w-8 text-[#000000]" />,
      disabled: false,
      onClick: () => {
        navigate('/cibil');
      }
    },

  ];

  return (

    <>

      {companyName && (
        <HomeIntro />
      )}
      <div className="p-8 pb-4 animate-fade-in relative min-h-screen flex flex-col">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#000000] mb-2">Dashboard</h1>
            <p className="text-gray-600">
              Access your financial documents and analysis tools
            </p>
          </div>
          <Button
            onClick={() => navigate('/help-center')}
            variant="outline"
            className="flex items-center gap-2 border-[#000000]/30 text-[#000000] hover:bg-[#000000]/5 px-4 py-2 font-semibold shadow-sm"
          >
            <HelpCircle className="h-4 w-4 text-[#000000]" />
            Help Center
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dashboardItems.map((item, index) => (
            <Card
              key={index}
              className={`transition-all duration-300 ${item.disabled
                ? 'opacity-60 cursor-not-allowed bg-gray-50'
                : 'hover:shadow-xl hover:-translate-y-1 cursor-pointer border-[#000000]/20 hover:border-[#000000]/50 bg-white'
                }`}
              onClick={!item.disabled ? item.onClick : undefined}
            >
              <CardHeader className="flex flex-row items-center gap-4 pb-2">
                <div
                  className={`p-3 rounded-xl ${item.disabled ? 'bg-gray-200' : 'bg-blue-50'}`}
                >
                  {item.icon}
                </div>
                <div>
                  <CardTitle className="text-xl">{item.title}</CardTitle>
                  <CardDescription>{item.description}</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                {!item.disabled && (
                  <div className="mt-4 flex items-center text-sm font-medium text-[#000000]">
                    Click to proceed <span className="ml-2">→</span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <BsaUploadModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        <ItrUploadModal isOpen={isItrModalOpen} onClose={() => setIsItrModalOpen(false)} />

        <div className="flex items-center justify-center gap-4 text-sm mt-auto pt-8 pb-0">
          <div className="w-20 h-px bg-black" />
          <span className="text-black">///</span>

          <span className="font-semibold text-gray-800">
            Fueling the Future of Lending
          </span>

          <div className="w-px h-5 bg-gray-300" />

          <span className="text-gray-500">
            Engineered in Bengaluru 🖤
          </span>

          <span className="text-black">///</span>
          <div className="w-20 h-px bg-black" />
        </div>
        {/* Kyc Modal */}
        <KycModal isOpen={isKycModalOpen} onClose={() => setIsKycModalOpen(false)} />
      </div>
    </>
  );
}
