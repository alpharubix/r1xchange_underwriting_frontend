import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import apiClient, { extractErrorMessage } from '@/lib/axios';
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
  Select,
  SelectTrigger,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectValue,
} from '@/components/ui/select';
import {
  UploadCloud,
  X,
  FileCheck2,
  FileText,
  CalendarDays,
  CheckCircle2,
  Loader2,
} from 'lucide-react';

interface Bank {
  bankName: string;
  code: string;
}

interface UploadFileInfo {
  starting_date: string;
  ending_date: string;
}

interface UploadResponse {
  data: {
    upload_ref_id: string;
    [fileName: string]: any;
  };
}

interface ParsedUploadResult {
  upload_ref_id: string;
  files: {
    name: string;
    starting_date: string;
    ending_date: string;
  }[];
}

function parseUploadResponse(raw: UploadResponse['data']): ParsedUploadResult {
  const { upload_ref_id, ...fileEntries } = raw;
  const files = Object.entries(fileEntries).map(([name, info]) => ({
    name,
    starting_date: (info as UploadFileInfo).starting_date,
    ending_date: (info as UploadFileInfo).ending_date,
  }));
  return { upload_ref_id, files };
}

type ModalStep = 'form' | 'confirmation';

interface BsaUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  custId?: string;
}

export default function BsaUploadModal({ isOpen, onClose, custId }: BsaUploadModalProps) {
  const [modalStep, setModalStep] = useState<ModalStep>('form');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadResult, setUploadResult] = useState<ParsedUploadResult | null>(null);

  const [formData, setFormData] = useState({
    entityName: '',
    companyType: '',
    accountNumber: '',
    accountType: '',
    bankCode: '',
  });

  const { data: banks, isLoading: isLoadingBanks } = useQuery({
    queryKey: ['banks'],
    queryFn: async () => {
      const response = await apiClient.get('/bsa/get-bank-names');
      return response.data?.data as Bank[];
    },
    enabled: isOpen,
  });

  const uploadMutation = useMutation({
    mutationFn: async (uploadData: FormData) => {
      const config = custId ? { params: { cust_id: custId } } : {};
      const response = await apiClient.post('/bsa/upload', uploadData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        skipErrorToast: true,
        ...config,
      });
      return response.data as UploadResponse;
    },
    onSuccess: (data) => {
      const parsed = parseUploadResponse(data.data);
      setUploadResult(parsed);
      setModalStep('confirmation');
    },
    onError: (error: any) => {
      const msg = extractErrorMessage(error) || 'Failed to upload bank statement';
      toast.error(msg);
    },
  });

  const confirmMutation = useMutation({
    mutationFn: async (upload_ref_id: string) => {
      const config = custId ? { params: { cust_id: custId } } : {};
      const response = await apiClient.post('/bsa/upload_ref_id', {
        upload_ref_id,
      }, {
        skipErrorToast: true,
        ...config,
      });
      return response.data;
    },
    onSuccess: (data: any) => {
      toast.success(data?.message ?? 'Statement confirmed successfully!');
      handleCloseModal();
    },
    onError: (error: any) => {
      const msg = extractErrorMessage(error) || 'Failed to confirm statement';
      toast.error(msg);
    },
  });

  const handleCloseModal = () => {
    setModalStep('form');
    setUploadResult(null);
    setSelectedFiles([]);
    setFormData({
      entityName: '',
      companyType: '',
      accountNumber: '',
      accountType: '',
      bankCode: '',
    });
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFiles.length === 0) {
      toast.error('Please select at least one file to upload');
      return;
    }
    if (!formData.bankCode) {
      toast.error('Please select a bank');
      return;
    }

    const formPayload = new FormData();
    const jsonString = JSON.stringify({
      entityName: formData.entityName,
      entityType: formData.companyType,
      accountNumber: formData.accountNumber,
      accountType: formData.accountType,
      bankCode: formData.bankCode,
    });
    formPayload.append('data', jsonString);
    selectedFiles.forEach((file) => {
      formPayload.append('files', file);
    });

    uploadMutation.mutate(formPayload);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isOpen) handleCloseModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur"
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Card className="w-full max-w-lg shadow-2xl relative animate-scale-in max-h-[90vh] overflow-y-auto">
        <button
          onClick={handleCloseModal}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {modalStep === 'form' && (
          <>
            <CardHeader>
              <CardTitle className="text-2xl text-slate-900 flex items-center gap-2">
                <UploadCloud className="h-6 w-6 text-[#1106de]" />
                Upload Bank Statement
              </CardTitle>
              <CardDescription>
                Provide details and upload your bank statement for analysis
                {custId && <span className="block mt-1 text-[#1106de] font-semibold">Creating for Customer: {custId}</span>}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="companyType">
                      Company Type <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formData.companyType}
                      onValueChange={(value) =>
                        setFormData({ ...formData, companyType: value })
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Company Type" />
                      </SelectTrigger>
                      <SelectContent className="z-[200]">
                        <SelectGroup>
                          <SelectLabel>Company Type</SelectLabel>
                          <SelectItem value="Individual">Individual</SelectItem>
                          <SelectItem value="Company">Company</SelectItem>
                          <SelectItem value="Sole_Proprietorship">
                            Sole Proprietorship
                          </SelectItem>
                          <SelectItem value="Trust">Trust</SelectItem>
                          <SelectItem value="Partnership">Partnership</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="accountType">
                      Account Type <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formData.accountType}
                      onValueChange={(value) =>
                        setFormData({ ...formData, accountType: value })
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Account Type" />
                      </SelectTrigger>
                      <SelectContent className="z-[200]">
                        <SelectGroup>
                          <SelectLabel>Account Type</SelectLabel>
                          <SelectItem value="CURRENT">CURRENT</SelectItem>
                          <SelectItem value="SAVINGS">SAVINGS</SelectItem>
                          <SelectItem value="OVER_DRAFT">Over Draft(OD)</SelectItem>
                          <SelectItem value="CASH_CREDIT">Cash Credit(CC)</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="accountNumber">
                    Account Number <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="accountNumber"
                    name="accountNumber"
                    placeholder="Enter account number"
                    value={formData.accountNumber}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bankCode">
                    Select Bank <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.bankCode}
                    onValueChange={(value) => setFormData({ ...formData, bankCode: value })}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={isLoadingBanks ? "Loading banks..." : "Select a bank"} />
                    </SelectTrigger>
                    <SelectContent className="z-[200]">
                      <SelectGroup>
                        <SelectLabel>Available Banks</SelectLabel>
                        {!isLoadingBanks && banks?.map((bank, idx) => (
                          <SelectItem key={idx} value={bank.code}>
                            {bank.bankName}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="file">
                    Statement Files <span className="text-red-500">*</span>
                  </Label>
                  <div className="flex flex-col gap-2 w-full">
                    <Input
                      id="file"
                      type="file"
                      multiple={true}
                      accept=".pdf"
                      onChange={(e) => {
                        if (e.target.files) {
                          const newFiles = Array.from(e.target.files);
                          setSelectedFiles((prev) => [...prev, ...newFiles]);
                          e.target.value = '';
                        }
                      }}
                      className="cursor-pointer file:cursor-pointer file:bg-[#eff6ff] file:text-[#1106de] file:font-semibold file:border-0 file:rounded-md file:mr-4 file:px-4 file:py-1 hover:file:bg-blue-100 transition-all"
                    />

                    {selectedFiles.length > 0 && (
                      <div className="mt-3 space-y-2 max-h-40 overflow-y-auto pr-2">
                        {selectedFiles.map((file, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-2 border rounded-md bg-blue-50/30"
                          >
                            <span
                              className="text-sm text-gray-700 truncate mr-2"
                              title={file.name}
                            >
                              {file.name}
                            </span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedFiles((prev) =>
                                  prev.filter((_, i) => i !== index)
                                );
                              }}
                              className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50 shrink-0"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-[#1106de] hover:bg-[#0e05b5] text-white shadow-sm shadow-[#1106de]/20 mt-6 cursor-pointer"
                  disabled={uploadMutation.isPending}
                >
                  {uploadMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    'Upload & Analyze'
                  )}
                </Button>
              </form>
            </CardContent>
          </>
        )}

        {modalStep === 'confirmation' && uploadResult && (
          <>
            <CardHeader>
              <CardTitle className="text-2xl text-slate-900 flex items-center gap-2">
                <FileCheck2 className="h-6 w-6 text-[#1106de]" />
                Confirm Statement Details
              </CardTitle>
              <CardDescription>
                Please review the extracted details before confirming
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {uploadResult.files.map((file, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-blue-100 bg-[#eff6ff]/40 p-4 space-y-3"
                >
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-[#1106de] shrink-0" />
                    <span className="text-sm font-semibold text-slate-900 truncate">
                      {file.name}
                    </span>
                  </div>

                  <div className="flex items-center gap-6 pl-1">
                    <div className="flex items-center gap-1.5 text-sm text-gray-600">
                      <CalendarDays className="h-4 w-4 text-[#1106de]/60 shrink-0" />
                      <span className="font-medium text-gray-500">From:</span>
                      <span className="font-semibold text-gray-800">
                        {file.starting_date}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-sm text-gray-600">
                      <CalendarDays className="h-4 w-4 text-[#1106de]/60 shrink-0" />
                      <span className="font-medium text-gray-500">To:</span>
                      <span className="font-semibold text-gray-800">
                        {file.ending_date}
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 border-slate-200 text-slate-700 hover:bg-slate-50 cursor-pointer"
                  onClick={() => setModalStep('form')}
                  disabled={confirmMutation.isPending}
                >
                  ← Go Back
                </Button>
                <Button
                  type="button"
                  className="flex-1 bg-[#1106de] hover:bg-[#0e05b5] text-white shadow-sm shadow-[#1106de]/20 cursor-pointer"
                  onClick={() => confirmMutation.mutate(uploadResult.upload_ref_id)}
                  disabled={confirmMutation.isPending}
                >
                  {confirmMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Confirming...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Confirm
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </>
        )}
      </Card>
    </motion.div>,
    document.body
  );
}
