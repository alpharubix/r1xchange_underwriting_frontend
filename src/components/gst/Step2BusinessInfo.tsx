import { useState, useEffect, useMemo } from 'react';
import { useQuery, useMutation, useQueries } from '@tanstack/react-query';

import {
  fetchBasicInfo,
  submitGst,
  getGstin,
  addNewGstin,
} from '@/api/gst';

import { checkServiceConsent , giveServiceConsent} from '@/api/user';
import { toast } from 'sonner';
import GstTermsModal from '@/pages/gst/GstTerm&Condition';

interface Step2Props { 
  gstin: string;
  onSuccessSubmit: (gstReferenceId: string) => void;
  onRequiresAuth: (fromMonth: string, toMonth: string) => void;
  onBack: () => void;
  onGstinChange: (newGstin: string) => void;
  custId?: string;
  externalShowInstructions?: number;
}

const GSTIN_REGEX = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

export default function Step2BusinessInfo({
  gstin,
  onSuccessSubmit,
  onRequiresAuth,
  onGstinChange,
  custId,
  externalShowInstructions,
}: Step2Props) {
  const [fromMonth, setFromMonth] = useState('');
  const [toMonth, setToMonth] = useState('');
  const [needsAuth, setNeedsAuth] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newGstin, setNewGstin] = useState('');
  const [showInstructionsModal, setShowInstructionsModal] = useState(true);
  const [isGstTermsOpen, setIsGstTermsOpen] = useState(false);
  const [gstTermsAccepted, setGstTermsAccepted] = useState(false);
  const [isTermsDisabled, setIsTermsDisabled] = useState(false);

  useEffect(() => {
    if (externalShowInstructions) {
      setShowInstructionsModal(true);
    }
  }, [externalShowInstructions]);

  // Check Service Consent for 'gst' when component renders
  useEffect(() => {
    let isMounted = true;
    checkServiceConsent('gst', custId)
      .then((res) => {
        if (!isMounted) return;
        const resData = res?.data;
        const hasConsent =
          resData?.consent === true ||
          resData?.data?.consent === true ||
          (resData as any)?.is_consent_given === true;

        if (hasConsent) {
          setGstTermsAccepted(true);
          setIsTermsDisabled(true);
        } else {
          setGstTermsAccepted(false);
          setIsTermsDisabled(false);
        }
      })
      .catch((err) => {
        console.error('Error checking GST service consent:', err);
      });

    return () => {
      isMounted = false;
    };
  }, []);




  // Fetch list of GSTINs from the backend
  const {
    data: gstinData,
    isSuccess: isGstinLoaded,
    isFetching: isFetchingGstin,
  } = useQuery({
    queryKey: ['gstin', custId],
    queryFn: () => getGstin(custId),
  });

  const [shouldFetchBasicInfo, setShouldFetchBasicInfo] = useState(false);

  useEffect(() => {
    if (isGstinLoaded && !isFetchingGstin) {
      setShouldFetchBasicInfo(true);
    } else {
      setShouldFetchBasicInfo(false);
    }
  }, [isGstinLoaded, isFetchingGstin]);

  // Manage multiple GSTINs (normalized and filtered strictly to valid format)
  const [gstinList, setGstinList] = useState<string[]>(() => {
    let list: string[] = [];

    // Initialize from cached query data if already loaded/cached
    if (gstinData?.is_found && gstinData.gst_number) {
      const rawList = Array.isArray(gstinData.gst_number)
        ? gstinData.gst_number
        : typeof gstinData.gst_number === 'string'
          ? gstinData.gst_number
            .split(',')
            .map((g: string) => g.trim())
            .filter(Boolean)
          : [];
      list = rawList
        .map((g: any) =>
          String(g || '')
            .toUpperCase()
            .trim()
        )
        .filter((g: string) => GSTIN_REGEX.test(g));
    }

    const safePropGstin =
      typeof gstin === 'string' ? gstin : Array.isArray(gstin) ? gstin[0] : '';
    if (safePropGstin) {
      const normalizedGstin = String(safePropGstin).toUpperCase().trim();
      if (
        GSTIN_REGEX.test(normalizedGstin) &&
        !list.includes(normalizedGstin)
      ) {
        list.push(normalizedGstin);
      }
    }
    return list;
  });

  const [activeGstin, setActiveGstin] = useState<string>(() => {
    const safePropGstin =
      typeof gstin === 'string' ? gstin : Array.isArray(gstin) ? gstin[0] : '';
    return String(safePropGstin).toUpperCase().trim();
  });

  // Fetch basic info for all GSTINs using useQueries for automatic de-duplication, caching and loading states
  const basicInfoQueries = useQueries({
    queries: gstinList.map((gstinCode) => {
      const normalized = String(gstinCode || '')
        .toUpperCase()
        .trim();
      const isValid = GSTIN_REGEX.test(normalized);
      return {
        queryKey: ['gstinBasicInfo', normalized, custId],
        queryFn: () => fetchBasicInfo({ gstin: normalized }, custId),
        enabled: isValid && shouldFetchBasicInfo,
      };
    }),
  });

  const businessDataMap = useMemo(() => {
    const map: Record<string, any> = {};
    basicInfoQueries.forEach((q, idx) => {
      const gstinCode = gstinList[idx]?.toUpperCase().trim();
      if (!gstinCode) return;
      const raw = q.data?.data || q.data;
      const data = Array.isArray(raw) ? raw[0] : raw;
      if (data) {
        map[gstinCode] = data;
      }
    });
    return map;
  }, [basicInfoQueries, gstinList]);

  const loadingMap = useMemo(() => {
    const map: Record<string, boolean> = {};
    basicInfoQueries.forEach((q, idx) => {
      const gstinCode = gstinList[idx]?.toUpperCase().trim();
      if (gstinCode) {
        map[gstinCode] = q.isLoading;
      }
    });
    return map;
  }, [basicInfoQueries, gstinList]);

  // Synchronize list with backend response
  useEffect(() => {
    let list: string[] = [];
    if (gstinData?.is_found && gstinData.gst_number) {
      const rawList = Array.isArray(gstinData.gst_number)
        ? gstinData.gst_number
        : typeof gstinData.gst_number === 'string'
          ? gstinData.gst_number
            .split(',')
            .map((g: string) => g.trim())
            .filter(Boolean)
          : [];
      list = rawList
        .map((g: any) =>
          String(g || '')
            .toUpperCase()
            .trim()
        )
        .filter((g: string) => GSTIN_REGEX.test(g));
    }

    const safePropGstin =
      typeof gstin === 'string' ? gstin : Array.isArray(gstin) ? gstin[0] : '';

    setGstinList((prev) => {
      const mergedList = Array.from(
        new Set([
          ...prev.map((g) =>
            String(g || '')
              .toUpperCase()
              .trim()
          ),
          ...list,
          ...(safePropGstin &&
            GSTIN_REGEX.test(String(safePropGstin).toUpperCase().trim())
            ? [String(safePropGstin).toUpperCase().trim()]
            : []),
        ])
      ).filter((g: string) => GSTIN_REGEX.test(g));

      const isSame =
        prev.length === mergedList.length &&
        prev.every((val, index) => val === mergedList[index]);
      return isSame ? prev : mergedList;
    });
  }, [gstinData, gstin]);

  // Set active GSTIN
  useEffect(() => {
    const safePropGstin =
      typeof gstin === 'string' ? gstin : Array.isArray(gstin) ? gstin[0] : '';
    if (safePropGstin) {
      const normalized = String(safePropGstin).toUpperCase().trim();
      if (GSTIN_REGEX.test(normalized)) {
        setActiveGstin(normalized);
      }
    }
  }, [gstin]);

  const addNewGstinMutation = useMutation({
    mutationFn: (data: Parameters<typeof addNewGstin>[0]) =>
      addNewGstin(data, custId),
    onSuccess: (res) => {
      const updatedGstin = (
        res.data?.gstin ||
        (res as any).gstin ||
        res.data ||
        ''
      )
        .toUpperCase()
        .trim();
      if (!updatedGstin || !GSTIN_REGEX.test(updatedGstin)) return;
      toast.success('GSTIN added successfully.');
      setIsModalOpen(false);

      setGstinList((prev) => {
        if (!prev.includes(updatedGstin)) {
          return [...prev, updatedGstin];
        }
        return prev;
      });
      setActiveGstin(updatedGstin);
      onGstinChange(updatedGstin);
    },
  });

  const handleModalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const gstinToSave = newGstin.toUpperCase().trim();
    const gstRegex =
      /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

    if (gstinToSave.length !== 15) {
      toast.error('GSTIN must be exactly 15 characters long');
      return;
    }

    if (!gstRegex.test(gstinToSave)) {
      toast.error('Invalid GSTIN format');
      return;
    }

    addNewGstinMutation.mutate({ gstin: gstinToSave });
  };

  const submitMutation = useMutation({
    mutationFn: (data: Parameters<typeof submitGst>[0]) =>
      submitGst(data, custId),
    onSuccess: (res) => {
      toast.success('Analysis started successfully!');
      onSuccessSubmit(res.data.gst_reference_id);
    },
    onError: (error: any) => {
      const detail = error.response?.data?.detail;
      const responseCode = detail?.responseCode;

      if (responseCode === 'EOA048' || responseCode === 'EAE052') {
        setNeedsAuth(true);
      }
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // basic mmYYYY regex
    const dateRegex = /^(0[1-9]|1[0-2])\d{4}$/;
    if (!dateRegex.test(fromMonth) || !dateRegex.test(toMonth)) {
      toast.error('Date must be in MMYYYY format (e.g. 012024)');
      return;
    }

    if (!gstTermsAccepted) {
      setIsGstTermsOpen(true);
      return;
    }

    handleConfirmStartAnalysis();
  };

  const handleConfirmStartAnalysis = async () => {
    setGstTermsAccepted(true);
    try {
      await giveServiceConsent('gst');
    } catch (err) {
      console.error('Error giving GST service consent:', err);
    }
    submitMutation.mutate({
      gstin: activeGstin,
      from_month: fromMonth,
      to_month: toMonth,
    });
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-slate-800">Business Details</h2>
        <button
          type="button"
          onClick={() => {
            setNewGstin('');
            setIsModalOpen(true);
          }}
          className="px-4 py-2 text-sm font-semibold text-white bg-[#002366] hover:bg-[#001744] rounded-xl shadow-sm shadow-[#002366]/20 transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          Add new
        </button>
      </div>

      <div className="space-y-4 mb-6">
        {gstinList.map((itemGstin) => {
          const isSelected = itemGstin === activeGstin;
          const data = businessDataMap[itemGstin];
          const isLoading = loadingMap[itemGstin];

          return (
            <div
              key={itemGstin}
              className={`border-2 rounded-xl transition-all overflow-hidden ${isSelected ? 'border-[#002366] shadow-sm bg-white' : 'border-slate-100 hover:border-slate-300 bg-slate-50/20 cursor-pointer'}`}
              onClick={() => {
                if (!isSelected) {
                  setActiveGstin(itemGstin);
                  onGstinChange(itemGstin);
                }
              }}
            >
              {/* Card Header / Summary */}
              <div className="p-4 flex items-center justify-between hover:bg-slate-50/40 transition-colors">
                <div className="flex items-center gap-3">
                  {/* Selector Circle Indicator */}
                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${isSelected ? 'border-[#002366] bg-[#002366]' : 'border-slate-300 bg-white'}`}
                  >
                    {isSelected && (
                      <div className="w-2 h-2 rounded-full bg-white" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-800 tracking-wide uppercase">
                        {itemGstin}
                      </span>
                      {isLoading && (
                        <span className="h-3.5 w-3.5 rounded-full border-2 border-slate-300 border-t-[#002366] animate-spin" />
                      )}
                    </div>
                    {data && (
                      <span className="text-xs text-slate-500 font-medium">
                        {data.tradeName || data.legalNameOfBusiness}
                      </span>
                    )}
                  </div>
                </div>

                {data && (
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${data.gstinStatus.toLowerCase() === 'active' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}
                  >
                    {data.gstinStatus}
                  </span>
                )}
              </div>

              {/* Expanded details (only for selected card) */}
              {isSelected && (
                <div className="border-t border-slate-100 p-6 bg-white space-y-6">
                  {data ? (
                    <>
                      {/* Business Grid Card Details */}
                      <div className="bg-slate-50/60 p-5 rounded-xl grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 text-sm">
                        <div className="flex flex-col">
                          <span className="text-xs font-medium text-slate-400 mb-1">
                            Legal Name
                          </span>
                          <strong className="text-[14px] font-bold text-slate-900">
                            {data.legalNameOfBusiness}
                          </strong>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs font-medium text-slate-400 mb-1">
                            Trade Name
                          </span>
                          <strong className="text-[14px] font-bold text-slate-900">
                            {data.tradeName}
                          </strong>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs font-medium text-slate-400 mb-1">
                            Status
                          </span>
                          <div className="mt-1">
                            <span
                              className={`inline-flex items-center px-3 py-0.5 rounded-full text-xs font-semibold ${data.gstinStatus.toLowerCase() === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
                            >
                              {data.gstinStatus}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs font-medium text-slate-400 mb-1">
                            Taxpayer Type
                          </span>
                          <strong className="text-[14px] font-bold text-slate-900">
                            {data.taxpayerType}
                          </strong>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs font-medium text-slate-400 mb-1">
                            Date of Registration
                          </span>
                          <strong className="text-[14px] font-bold text-slate-900">
                            {data.dateOfRegistration}
                          </strong>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs font-medium text-slate-400 mb-1">
                            Constitution of Business
                          </span>
                          <strong className="text-[14px] font-bold text-slate-900">
                            {data.constitutionOfBusiness}
                          </strong>
                        </div>
                      </div>

                      {/* Select Duration Form */}
                      {data.gstinStatus.toLowerCase() !== 'active' ? (
                        <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
                          <p className="text-sm text-red-700">
                            Your GSTIN status is not Active. You cannot proceed
                            further.
                          </p>
                        </div>
                      ) : (
                        <form
                          onSubmit={handleSubmit}
                          className="border-t border-slate-100 pt-6"
                        >
                          <h3 className="text-lg font-semibold text-slate-800 mb-1">
                            Select Duration
                          </h3>
                          <p className="text-slate-400 text-sm mb-6">
                            Specify the period you would like to run the
                            analysis for.
                          </p>

                          <div className="grid grid-cols-2 gap-4 mb-6">
                            <div>
                              <label
                                htmlFor="fromMonth"
                                className="block text-sm font-semibold text-slate-700 mb-1.5"
                              >
                                From Month
                              </label>
                              <input
                                id="fromMonth"
                                type="text"
                                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#002366]/20 focus:border-[#002366] outline-none text-slate-800 placeholder-slate-300"
                                placeholder="MMYYYY"
                                value={fromMonth}
                                onChange={(e) => setFromMonth(e.target.value)}
                                required
                                maxLength={6}
                              />
                            </div>
                            <div>
                              <label
                                htmlFor="toMonth"
                                className="block text-sm font-semibold text-slate-700 mb-1.5"
                              >
                                To Month
                              </label>
                              <input
                                id="toMonth"
                                type="text"
                                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#002366]/20 focus:border-[#002366] outline-none text-slate-800 placeholder-slate-300"
                                placeholder="MMYYYY"
                                value={toMonth}
                                onChange={(e) => setToMonth(e.target.value)}
                                required
                                maxLength={6}
                              />
                            </div>
                            <div className="flex items-center gap-2 pt-2 col-span-2">
                              <input
                                id="gstTerms"
                                type="checkbox"
                                className="h-4 w-4 rounded border-gray-300 text-[#002366] focus:ring-[#002366] accent-[#002366] cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                                checked={gstTermsAccepted}
                                disabled={isTermsDisabled}
                                onChange={(event) =>
                                  setGstTermsAccepted(event.target.checked)
                                }
                                required={!isTermsDisabled}
                              />
                              <label
                                htmlFor="gstTerms"
                                className={`text-sm font-normal text-slate-700 ${isTermsDisabled ? 'cursor-not-allowed opacity-75' : 'cursor-pointer'}`}
                              >
                                I agree to the{' '}
                                <button
                                  type="button"
                                  disabled={isTermsDisabled}
                                  onClick={() => setIsGstTermsOpen(true)}
                                  className="text-blue-600 hover:underline font-medium focus:outline-none cursor-pointer disabled:no-underline disabled:cursor-not-allowed disabled:text-slate-500"
                                >
                                  GST terms and conditions
                                </button>
                              </label>
                            </div>
                          </div>

                          {needsAuth ? (
                            <div className="space-y-4">
                              <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-md">
                                <p className="text-sm text-amber-700 font-medium">
                                  Authentication required. Please complete the
                                  OTP verification with the GST Portal to
                                  proceed.
                                </p>
                              </div>
                              <button
                                type="button"
                                onClick={() =>
                                  onRequiresAuth(fromMonth, toMonth)
                                }
                                className="w-full bg-[#002366] hover:bg-[#001744] text-white font-medium py-3 px-6 rounded-xl shadow-sm shadow-[#002366]/20 transition-colors flex justify-center items-center cursor-pointer"
                              >
                                Authenticate with OTP
                              </button>
                            </div>
                          ) : (
                            <button
                              type="submit"
                              disabled={submitMutation.isPending}
                              className="bg-[#002366] hover:bg-[#001744] text-white font-semibold py-2.5 px-6 rounded-xl shadow-sm shadow-[#002366]/20 transition-colors disabled:opacity-70 flex justify-center items-center cursor-pointer"
                            >
                              {submitMutation.isPending ? (
                                <span className="h-4 w-4 rounded-full border-2 border-white/20 border-t-white animate-spin mr-2" />
                              ) : null}
                              {submitMutation.isPending
                                ? 'Starting Analysis...'
                                : 'Start Analysis'}
                            </button>
                          )}
                        </form>
                      )}
                    </>
                  ) : (
                    <div className="flex justify-center py-4">
                      {isLoading ? (
                        <div className="flex items-center gap-2 text-slate-500">
                          <span className="h-5 w-5 rounded-full border-2 border-slate-300 border-t-[#002366] animate-spin" />
                          <span>Fetching business details...</span>
                        </div>
                      ) : (
                        <p className="text-sm text-slate-500">
                          No details loaded. Click card to retry.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add New GSTIN Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl border border-gray-100 max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Add New GSTIN
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Enter the new Goods and Services Tax Identification Number (GSTIN)
              you would like to analyze.
            </p>

            <form onSubmit={handleModalSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="newGstin"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  GSTIN Number
                </label>
                <input
                  id="newGstin"
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#002366] focus:border-[#002366] uppercase"
                  placeholder="e.g. 27AAAPL1234C1Z5"
                  value={newGstin}
                  onChange={(e) => {
                    const clean = e.target.value
                      .replace(/[^A-Z0-9]/gi, '')
                      .toUpperCase()
                      .slice(0, 15);
                    setNewGstin(clean);
                  }}
                  required
                  maxLength={15}
                  autoFocus
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={addNewGstinMutation.isPending}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-300 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addNewGstinMutation.isPending}
                  className="bg-[#002366] hover:bg-[#001744] text-white text-sm font-medium py-2 px-4 rounded-xl shadow-sm shadow-[#002366]/20 transition-colors disabled:opacity-70 flex justify-center items-center cursor-pointer"
                >
                  {addNewGstinMutation.isPending ? (
                    <span className="h-4 w-4 rounded-full border-2 border-white/20 border-t-white animate-spin mr-2" />
                  ) : null}
                  {addNewGstinMutation.isPending ? 'Saving...' : 'Save GSTIN'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* GST General Instructions Modal (shows for 10 seconds on step 2 load) */}
      {showInstructionsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl border border-gray-100 max-w-xl w-full p-6 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-100">
              <h3 className="text-lg font-bold text-slate-700">
                GST - General Instructions
              </h3>
              <button
                type="button"
                onClick={() => setShowInstructionsModal(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg transition-colors cursor-pointer"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <ol className="space-y-3 text-sm text-slate-600 mb-6 leading-relaxed">
              <li className="flex gap-2">
                <span className="font-semibold text-slate-700 min-w-[20px]">
                  1.
                </span>
                <span>
                  Before you click on Provide Consent Button – Keep GST login
                  Username ready.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="font-semibold text-slate-700 min-w-[20px]">
                  2.
                </span>
                <span>Enter the OTP received on the given number.</span>
              </li>
              <li className="flex gap-2">
                <span className="font-semibold text-slate-700 min-w-[20px]">
                  3.
                </span>
                <span>
                  If the API access is not enabled on the GST Portal, Click on
                  &quot;Steps To Enable API&quot; Button and follow the steps to
                  enable it.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="font-semibold text-slate-700 min-w-[20px]">
                  4.
                </span>
                <span>
                  Our application/personnel DO NOT have access to your
                  credentials.
                </span>
              </li>
            </ol>

            <div className="flex items-center justify-end pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setShowInstructionsModal(false)}
                className="px-5 py-2 text-sm font-medium text-white bg-[#002366] hover:bg-[#001744] border border-gray-200 rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* GST Terms & Conditions Modal */}
      <GstTermsModal
        isOpen={isGstTermsOpen}
        onClose={() => setIsGstTermsOpen(false)}
        onAccept={handleConfirmStartAnalysis}
      />
    </div>
  );
}
