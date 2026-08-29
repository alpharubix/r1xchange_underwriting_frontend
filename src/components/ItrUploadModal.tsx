import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import apiClient from '@/lib/axios';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  PieChart,
  X,
  CheckCircle2,
  Loader2,
} from 'lucide-react';

type ITRState =
  | 'INITIALIZING'
  | 'EMAIL_INPUT'
  | 'AWAITING_CREDENTIAL_SUBMISSION'
  | 'PROCESSING'
  | 'SUCCESS'
  | 'TIMEOUT'
  | 'ERROR';

const mapResponseCodeToState = (code?: string): ITRState => {
  switch (code) {
    case 'ENC220':
      return 'AWAITING_CREDENTIAL_SUBMISSION';
    case 'RNP020':
      return 'PROCESSING';
    case 'SRC001':
      return 'SUCCESS';
    case 'ECR214':
      return 'TIMEOUT';
    case 'ENR029':
      return 'EMAIL_INPUT';
    case 'EBF017':
    case 'EIP018':
      return 'ERROR';
    default:
      return 'EMAIL_INPUT';
  }
};

interface ItrUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  custId?: string;
}

export default function ItrUploadModal({ isOpen, onClose, custId }: ItrUploadModalProps) {
  const [itrState, setItrState] = useState<ITRState>('INITIALIZING');
  const [itrEmail, setItrEmail] = useState('');
  const [itrReferenceId, setItrReferenceId] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleCloseItrModal = () => {
    onClose();
    setItrEmail('');
  };

  const { data: itrPrecheckData } = useQuery({
    queryKey: ['itr-data-precheck', custId],
    queryFn: async () => {
      const config = custId ? { params: { cust_id: custId } } : {};
      const response = await apiClient.get('/itr/link-precheck', config);
      return response.data;
    },
    enabled: isOpen,
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: 'always',
  });

  useEffect(() => {
    const payload = itrPrecheckData?.data;

    if (!payload) {
      setItrState('EMAIL_INPUT');
      return;
    }

    const { itr_reference_id, itr_link_response_code } = payload;

    setItrReferenceId(itr_reference_id ?? null);

    if (!itr_link_response_code) {
      setItrState('EMAIL_INPUT');
      return;
    }

    setItrState(mapResponseCodeToState(itr_link_response_code));
  }, [itrPrecheckData]);

  const { data: itrPollingData } = useQuery({
    queryKey: ['itr-polling', itrReferenceId, custId],
    queryFn: async () => {
      const config = custId ? { params: { cust_id: custId } } : {};
      const res = await apiClient.post('/itr/check-link-status', {
        itr_reference_id: itrReferenceId,
      }, config);
      return res.data;
    },
    enabled:
      isOpen &&
      !!itrReferenceId &&
      (itrState === 'AWAITING_CREDENTIAL_SUBMISSION' || itrState === 'PROCESSING'),
    refetchInterval: 15000,
  });

  useEffect(() => {
    if (!itrPollingData?.data) return;

    const code = itrPollingData.data.itr_link_response_code;
    setItrState(mapResponseCodeToState(code));

    if (code === 'ENR029') {
      setItrReferenceId(null);
      toast.error('Session not found');
    }

    if (code === 'EBF017' || code === 'EIP018') {
      toast.error('Invalid request');
    }
  }, [itrPollingData]);

  const generateItrLinkMutation = useMutation({
    mutationFn: async (email: string) => {
      const config = custId ? { params: { cust_id: custId } } : {};
      const res = await apiClient.post('/itr/generate-link', {
        email_id: email,
      }, config);
      return res.data;
    },
    onSuccess: (data) => {
      const refId = data.data?.itr_reference_id;

      if (refId) {
        setItrReferenceId(refId);
        setItrState('AWAITING_CREDENTIAL_SUBMISSION');
      }
      toast.success('Verification email sent successfully. Please check your inbox.');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail?.message || 'Failed to generate link');
    },
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleCloseItrModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <Card className="w-full max-w-md shadow-2xl relative animate-scale-in">
        <button
          onClick={handleCloseItrModal}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <CardHeader>
          <CardTitle className="text-2xl text-[#000000] flex items-center gap-2">
            <PieChart className="h-6 w-6" />
            Income Tax Return
          </CardTitle>
          <CardDescription>
            Fetch and analyze your ITR data securely
            {custId && <span className="block mt-1 text-[#7754f8] font-medium">Creating for Customer: {custId}</span>}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {itrState === 'INITIALIZING' && (
            <div className="flex flex-col items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-[#000000] mb-4" />
              <p className="text-gray-600">Checking ITR status...</p>
            </div>
          )}

          {itrState === 'EMAIL_INPUT' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="itrEmail">Email Address</Label>
                <Input
                  id="itrEmail"
                  type="email"
                  placeholder="Enter your email"
                  value={itrEmail}
                  onChange={(e) => setItrEmail(e.target.value)}
                />
              </div>
              <Button
                className="w-full bg-[#000000] hover:bg-[#000060]"
                onClick={() => generateItrLinkMutation.mutate(itrEmail)}
                disabled={generateItrLinkMutation.isPending || !itrEmail}
              >
                {generateItrLinkMutation.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Generate Link
              </Button>
            </div>
          )}

          {itrState === 'AWAITING_CREDENTIAL_SUBMISSION' && (
            <div className="flex flex-col items-center justify-center py-8 space-y-4">
              <div className="p-4 bg-blue-50 rounded-full mb-2">
                <Loader2 className="h-8 w-8 animate-spin text-[#000000]" />
              </div>
              <p className="text-center font-medium text-[#000000]">
                Verification email sent successfully.
              </p>
              <p className="text-center text-sm text-gray-500 mb-4">
                Please check your email and complete the verification process.
              </p>
            </div>
          )}

          {itrState === 'PROCESSING' && (
            <div className="flex flex-col items-center justify-center py-8 space-y-4">
              <div className="p-4 bg-blue-50 rounded-full mb-2">
                <Loader2 className="h-8 w-8 animate-spin text-[#000000]" />
              </div>
              <p className="text-center font-medium text-[#000000]">
                Analyzing your ITR data...
              </p>
              <p className="text-center text-sm text-gray-500">
                This may take a few moments. Please wait.
              </p>
            </div>
          )}

          {itrState === 'SUCCESS' && (
            <div className="flex flex-col items-center justify-center py-8 space-y-4">
              <div className="p-4 bg-green-50 rounded-full mb-2">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
              <p className="text-center font-medium text-green-700">
                ITR Analysis Report already exists!
              </p>
              <Button
                className="w-full bg-green-600 hover:bg-green-700 mt-4"
                onClick={() => {
                  onClose();
                  if (!custId) {
                    navigate('/itr/itr-tax-calculation');
                  } else {
                    toast.info("Report created successfully. Please refresh the list.");
                  }
                }}
              >
                {custId ? "Close" : "View ITR Analysis"}
              </Button>
            </div>
          )}

          {itrState === 'TIMEOUT' && (
            <div className="flex flex-col items-center justify-center py-8 space-y-4">
              <div className="p-4 bg-red-50 rounded-full mb-2">
                <X className="h-8 w-8 text-red-600" />
              </div>
              <p className="text-center font-medium text-red-700">
                Verification session expired
              </p>
              <Button
                onClick={() => {
                  setItrReferenceId(null);
                  setItrEmail('');
                  setItrState('EMAIL_INPUT');
                }}
              >
                Generate New Link
              </Button>
            </div>
          )}

          {itrState === 'ERROR' && (
            <div className="flex flex-col items-center justify-center py-8 space-y-4">
              <div className="p-4 bg-red-50 rounded-full mb-2">
                <X className="h-8 w-8 text-red-600" />
              </div>
              <p className="text-center font-medium text-red-700">
                Invalid request
              </p>
              <Button
                variant="outline"
                className="w-full mt-4"
                onClick={() => setItrState('EMAIL_INPUT')}
              >
                Go Back
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
