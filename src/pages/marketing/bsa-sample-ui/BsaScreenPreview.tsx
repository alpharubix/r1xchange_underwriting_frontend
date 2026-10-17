import { useState } from 'react';
import {
  UploadCloud,
  X,
  ChevronDown,
  Calendar,
  Filter,
  RefreshCw,
  Download,
  ChevronRight,
  TrendingUp,
  BarChart3,
  Repeat,
  FileText,
  Clock,
  Landmark,
  Check,
} from 'lucide-react';

export interface BsaScreenPreviewProps {
  stepIndex: number;
}

export function BsaScreenPreview({ stepIndex }: BsaScreenPreviewProps) {
  // Interactive state for the modal in steps 1, 2, 3, 4
  const [entityType, setEntityType] = useState<string>('Individual');
  const [accountType, setAccountType] = useState<string>('CURRENT');
  const [isEntityOpen, setIsEntityOpen] = useState<boolean>(stepIndex === 2);
  const [isAccountOpen, setIsAccountOpen] = useState<boolean>(stepIndex === 3);

  const [accountNumber, setAccountNumber] = useState<string>('41778636503');
  const [selectedBank] = useState<string>('State Bank of India');
  const [password, setPassword] = useState<string>('statement@2026');

  // Step 5 reports state
  const [activeReportSection, setActiveReportSection] = useState<'overview' | 'debitCredit' | 'eod' | 'accountsList'>('debitCredit');
  const [selectedAccountForReports, setSelectedAccountForReports] = useState<'sbi' | 'dbs'>('sbi');

  // Filter by period state
  const [fromDate, setFromDate] = useState<string>('2025-08-01');
  const [toDate, setToDate] = useState<string>('2025-08-30');
  const [appliedPeriod, setAppliedPeriod] = useState<{ from: string; to: string; label: string }>({
    from: '2025-08-01',
    to: '2025-08-30',
    label: 'August 1st, 2025 to August 30th, 2025',
  });
  const [activePreset, setActivePreset] = useState<string>('1M');

  const formatDisplayDate = (dateStr: string) => {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr + 'T00:00:00');
      if (isNaN(d.getTime())) return dateStr;
      const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];
      const day = d.getDate();
      const suffix =
        day === 1 || day === 21 || day === 31
          ? 'st'
          : day === 2 || day === 22
          ? 'nd'
          : day === 3 || day === 23
          ? 'rd'
          : 'th';
      return `${months[d.getMonth()]} ${day}${suffix}, ${d.getFullYear()}`;
    } catch {
      return dateStr;
    }
  };

  const filterPresets = [
    { id: '1M', label: '1 Month (Aug 2025)', from: '2025-08-01', to: '2025-08-30' },
    { id: '3M', label: 'Last 3 Months', from: '2026-05-01', to: '2026-08-04' },
    { id: '6M', label: 'Last 6 Months', from: '2026-02-01', to: '2026-08-04' },
    { id: '12M', label: 'Full Year (12M)', from: '2026-01-01', to: '2026-08-04' },
  ];

  const handlePresetClick = (preset: { id: string; label: string; from: string; to: string }) => {
    setFromDate(preset.from);
    setToDate(preset.to);
    setActivePreset(preset.id);
    setAppliedPeriod({
      from: preset.from,
      to: preset.to,
      label: `${formatDisplayDate(preset.from)} to ${formatDisplayDate(preset.to)}`,
    });
  };

  const handleApplyFilter = () => {
    setAppliedPeriod({
      from: fromDate,
      to: toDate,
      label: `${formatDisplayDate(fromDate)} to ${formatDisplayDate(toDate)}`,
    });
  };

  const handleClearFilter = () => {
    if (activeReportSection === 'debitCredit' || selectedAccountForReports === 'dbs') {
      setFromDate('2025-08-01');
      setToDate('2025-08-30');
      setAppliedPeriod({
        from: '2025-08-01',
        to: '2025-08-30',
        label: 'August 1st, 2025 to August 30th, 2025',
      });
      setActivePreset('1M');
    } else {
      setFromDate('2026-01-01');
      setToDate('2026-08-04');
      setAppliedPeriod({
        from: '2026-01-01',
        to: '2026-08-04',
        label: 'January 1st, 2026 to August 4th, 2026',
      });
      setActivePreset('12M');
    }
  };

  const entityOptions = [
    '--Entity Type--',
    'Individual',
    'Private Limited & LLP',
    'Sole Proprietorship',
    'Trust',
    'Partnership',
  ];

  const accountOptions = [
    'Account Type',
    'CURRENT',
    'SAVINGS',
    'Over Draft(OD)',
    'Cash Credit(CC)',
  ];

  const renderContent = () => {
    // ══════════════════════════════════════════════════════════════════════════
    // STEP 0: Dashboard Bank Accounts List (Page 4 of PDF)
    // ══════════════════════════════════════════════════════════════════════════
    if (stepIndex === 0) {
      return (
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h4 className="text-sm font-bold text-slate-900">Bank Accounts</h4>
              <p className="text-[11px] text-slate-500">BSA account details available for this customer.</p>
            </div>
            <button
              type="button"
              style={{
                color: '#475569',
                backgroundColor: '#ffffff',
                height: '26px',
                minHeight: 'unset',
                padding: '2px 8px',
                lineHeight: '1',
              }}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-md shadow-2xs hover:bg-slate-50 cursor-pointer whitespace-nowrap"
            >
              <span className="inline-flex items-center gap-1 text-slate-700" style={{ color: '#475569', fontSize: '11px', whiteSpace: 'nowrap' }}>
                <RefreshCw size={11} className="text-slate-500" />
                <span>Refresh</span>
              </span>
            </button>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-800">Accounts List</span>
            <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-semibold">
              2 accounts
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Account Card 1: State Bank of India */}
            <div className="border border-slate-200 rounded-xl p-3 bg-white hover:border-[#002366]/40 transition-all shadow-2xs">
              <div className="flex items-start justify-between">
                <div className="w-7 h-7 rounded-lg bg-blue-50 text-[#002366] flex items-center justify-center">
                  <Landmark size={14} />
                </div>
                <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                  Active
                </span>
              </div>
              <div className="grid grid-cols-2 gap-1.5 mt-2.5 text-[11px]">
                <div>
                  <span className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold block">BANK NAME</span>
                  <strong className="text-slate-800 text-xs">State Bank of India</strong>
                </div>
                <div>
                  <span className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold block">BANK CODE</span>
                  <span className="text-slate-600">FI00068</span>
                </div>
                <div className="mt-1">
                  <span className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold block">ACCOUNT NUMBER</span>
                  <span className="font-mono text-slate-800">41778636503</span>
                </div>
                <div className="mt-1">
                  <span className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold block">ENTITY TYPE</span>
                  <span className="text-slate-700">Individual</span>
                </div>
              </div>
              <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[9px] text-slate-400 block">BSA PERIOD</span>
                  <span className="text-[10px] font-medium text-slate-600">01 Jan 2026 -- 04 Aug 2026</span>
                </div>
                <button
                  type="button"
                  style={{
                    color: '#ffffff',
                    backgroundColor: '#002366',
                    height: '26px',
                    minHeight: 'unset',
                    padding: '2px 9px',
                    lineHeight: '1',
                  }}
                  className="inline-flex items-center justify-center bg-[#002366] !text-white rounded-md shadow-2xs hover:bg-[#001a4e] transition-colors cursor-pointer whitespace-nowrap"
                >
                  <span className="text-[11px] font-semibold !text-white" style={{ color: '#ffffff', fontSize: '11px', whiteSpace: 'nowrap' }}>
                    View Reports
                  </span>
                </button>
              </div>
            </div>

            {/* Account Card 2: DBS Bank */}
            <div className="border border-slate-200 rounded-xl p-3 bg-white hover:border-[#002366]/40 transition-all shadow-2xs">
              <div className="flex items-start justify-between">
                <div className="w-7 h-7 rounded-lg bg-blue-50 text-[#002366] flex items-center justify-center">
                  <Landmark size={14} />
                </div>
                <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                  Active
                </span>
              </div>
              <div className="grid grid-cols-2 gap-1.5 mt-2.5 text-[11px]">
                <div>
                  <span className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold block">BANK NAME</span>
                  <strong className="text-slate-800 text-xs">DBS Bank</strong>
                </div>
                <div>
                  <span className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold block">BANK CODE</span>
                  <span className="text-slate-600">FI00021</span>
                </div>
                <div className="mt-1">
                  <span className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold block">ACCOUNT NUMBER</span>
                  <span className="font-mono text-slate-800">820200286657</span>
                </div>
                <div className="mt-1">
                  <span className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold block">ENTITY TYPE</span>
                  <span className="text-slate-700">Partnership</span>
                </div>
              </div>
              <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[9px] text-slate-400 block">BSA PERIOD</span>
                  <span className="text-[10px] font-medium text-slate-600">01 Aug 2025 -- 30 Aug 2025</span>
                </div>
                <button
                  type="button"
                  style={{
                    color: '#ffffff',
                    backgroundColor: '#002366',
                    height: '26px',
                    minHeight: 'unset',
                    padding: '2px 9px',
                    lineHeight: '1',
                  }}
                  className="inline-flex items-center justify-center bg-[#002366] !text-white rounded-md shadow-2xs hover:bg-[#001a4e] transition-colors cursor-pointer whitespace-nowrap"
                >
                  <span className="text-[11px] font-semibold !text-white" style={{ color: '#ffffff', fontSize: '11px', whiteSpace: 'nowrap' }}>
                    View Reports
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // ══════════════════════════════════════════════════════════════════════════
    // STEPS 1, 2, 3, 4: Exact Upload Bank Statement Modal from User's Screenshots
    // ══════════════════════════════════════════════════════════════════════════
    if (stepIndex >= 1 && stepIndex <= 4) {
      // Step 1: Default/blank modal (Screenshot 1)
      // Step 2: Entity Type dropdown open (Screenshot 2)
      // Step 3: Account Type dropdown open (Screenshot 3)
      // Step 4: Fully filled form with chosen file ready to submit

      const showEntityDropdown = stepIndex === 2 || isEntityOpen;
      const showAccountDropdown = stepIndex === 3 || isAccountOpen;
      const isFilledForm = stepIndex === 4;

      return (
        <div className="bg-slate-900/50 p-3 sm:p-6 rounded-2xl flex items-center justify-center backdrop-blur-2xs">
          {/* Modal Box matching screenshots exactly */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl p-5 sm:p-7 max-w-[460px] w-full text-left relative">
            {/* Header: Icon + Title + Close Button */}
            <div className="flex items-start justify-between pb-1">
              <div className="flex items-center gap-2.5">
                <UploadCloud className="w-6 h-6 text-[#002366]" strokeWidth={2.5} />
                <h3 className="text-xl sm:text-2xl font-bold text-[#002366] tracking-tight">
                  Upload Bank Statement
                </h3>
              </div>
              <button
                type="button"
                style={{
                  height: '28px',
                  width: '28px',
                  minHeight: 'unset',
                  padding: 0,
                  lineHeight: '1',
                }}
                className="text-slate-400 hover:text-slate-600 transition-colors inline-flex items-center justify-center rounded-md cursor-pointer"
                aria-label="Close modal"
              >
                <span className="inline-flex items-center justify-center">
                  <X size={18} />
                </span>
              </button>
            </div>

            {/* Subtitle */}
            <p className="text-xs sm:text-sm text-[#5c6590] mt-1 font-normal">
              Provide details and upload your bank statement for analysis
            </p>

            {/* Form Fields */}
            <div className="space-y-3.5 sm:space-y-4 mt-5 text-sm">
              {/* Row 1: Entity Type & Account Type */}
              <div className="grid grid-cols-2 gap-3 sm:gap-3.5">
                {/* Entity Type Selector */}
                <div className="relative">
                  <label className="block text-xs sm:text-sm font-bold text-[#002366] mb-1.5">
                    Entity Type <span className="text-rose-500">*</span>
                  </label>
                  <div
                    onClick={() => {
                      setIsEntityOpen(!isEntityOpen);
                      setIsAccountOpen(false);
                    }}
                    className="w-full border border-slate-300 rounded-xl px-3 sm:px-3.5 py-2 text-xs sm:text-sm text-slate-700 bg-white flex items-center justify-between shadow-2xs cursor-pointer hover:border-slate-400 transition-colors"
                  >
                    <span className={isFilledForm ? 'font-medium text-slate-800' : 'text-[#5c6590]'}>
                      {isFilledForm ? entityType : (stepIndex === 2 ? 'Select Entity Type' : 'Select Entity Type')}
                    </span>
                    <ChevronDown size={16} className="text-slate-400" />
                  </div>

                  {/* Exact Entity Type Dropdown from Screenshot 2 */}
                  {showEntityDropdown && (
                    <div className="absolute left-0 top-full mt-1 w-full bg-white border border-slate-200 rounded-xl shadow-xl z-30 p-1 space-y-0.5 text-xs sm:text-sm">
                      {entityOptions.map((opt) => (
                        <div
                          key={opt}
                          onClick={() => {
                            if (opt !== '--Entity Type--') {
                              setEntityType(opt);
                              setIsEntityOpen(false);
                            }
                          }}
                          className={`px-3 py-1.5 transition-colors ${
                            opt === '--Entity Type--'
                              ? 'text-slate-700 font-bold select-none cursor-default'
                              : opt === 'Individual'
                              ? 'font-medium text-[#002366] bg-[#e0e7ff] rounded-lg cursor-pointer'
                              : 'text-slate-700 hover:bg-slate-50 rounded-lg cursor-pointer'
                          }`}
                        >
                          {opt}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Account Type Selector */}
                <div className="relative">
                  <label className="block text-xs sm:text-sm font-bold text-[#002366] mb-1.5">
                    Account Type <span className="text-rose-500">*</span>
                  </label>
                  <div
                    onClick={() => {
                      setIsAccountOpen(!isAccountOpen);
                      setIsEntityOpen(false);
                    }}
                    className="w-full border border-slate-300 rounded-xl px-3 sm:px-3.5 py-2 text-xs sm:text-sm text-slate-700 bg-white flex items-center justify-between shadow-2xs cursor-pointer hover:border-slate-400 transition-colors"
                  >
                    <span className={isFilledForm ? 'font-medium text-slate-800' : 'text-[#5c6590]'}>
                      {isFilledForm ? accountType : (stepIndex === 3 ? 'Select Account Type' : 'Select Account Type')}
                    </span>
                    <ChevronDown size={16} className="text-slate-400" />
                  </div>

                  {/* Exact Account Type Dropdown from Screenshot 3 */}
                  {showAccountDropdown && (
                    <div className="absolute left-0 top-full mt-1 w-full bg-white border border-slate-200 rounded-xl shadow-xl z-30 p-1 space-y-0.5 text-xs sm:text-sm">
                      {accountOptions.map((opt) => (
                        <div
                          key={opt}
                          onClick={() => {
                            if (opt !== 'Account Type') {
                              setAccountType(opt);
                              setIsAccountOpen(false);
                            }
                          }}
                          className={`px-3 py-1.5 transition-colors ${
                            opt === 'Account Type'
                              ? 'text-slate-900 font-bold select-none cursor-default'
                              : opt === 'CURRENT'
                              ? 'font-medium text-[#002366] bg-[#e0e7ff] rounded-lg cursor-pointer'
                              : 'text-slate-700 hover:bg-slate-50 rounded-lg cursor-pointer'
                          }`}
                        >
                          {opt}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Account Number */}
              <div>
                <label className="block text-xs sm:text-sm font-bold text-[#002366] mb-1.5">
                  Account Number <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={isFilledForm ? accountNumber : ''}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  placeholder="Enter account number"
                  className="w-full border border-slate-300 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 bg-white focus:outline-none focus:ring-1 focus:ring-[#002366]"
                />
              </div>

              {/* Select Bank */}
              <div>
                <label className="block text-xs sm:text-sm font-bold text-[#002366] mb-1.5">
                  Select Bank <span className="text-rose-500">*</span>
                </label>
                <div className="w-full border border-slate-300 rounded-xl px-3.5 py-2 text-xs sm:text-sm bg-white flex items-center justify-between shadow-2xs cursor-pointer hover:border-slate-400 transition-colors">
                  <span className={isFilledForm ? 'font-medium text-slate-800' : 'text-[#5c6590]'}>
                    {isFilledForm ? selectedBank : 'Select a bank'}
                  </span>
                  <ChevronDown size={16} className="text-slate-400" />
                </div>
              </div>

              {/* File Password */}
              <div>
                <label className="block text-xs sm:text-sm font-bold text-[#002366] mb-1.5">
                  File Password <span className="text-slate-400 font-normal text-xs ml-1">(Optional)</span>
                </label>
                <input
                  type={isFilledForm ? 'password' : 'text'}
                  value={isFilledForm ? password : ''}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password if statement is protected"
                  className="w-full border border-slate-300 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 bg-white focus:outline-none focus:ring-1 focus:ring-[#002366]"
                />
              </div>

              {/* Statement Files */}
              <div>
                <label className="block text-xs sm:text-sm font-bold text-[#002366] mb-1.5">
                  Statement Files <span className="text-rose-500">*</span>
                </label>
                <div className="border border-slate-300 rounded-xl p-1.5 sm:p-2 flex items-center gap-3 bg-white">
                  <button
                    type="button"
                    style={{
                      height: '28px',
                      minHeight: 'unset',
                      padding: '2px 10px',
                      lineHeight: '1',
                    }}
                    className="bg-[#f0f7ff] hover:bg-[#e0efff] text-[#002366] font-bold rounded-lg transition-colors cursor-pointer shrink-0 border border-[#b9d5ff]"
                  >
                    <span style={{ fontSize: '11px', lineHeight: '1', whiteSpace: 'nowrap' }}>
                      Choose Files
                    </span>
                  </button>
                  <span className="text-xs text-slate-700 truncate">
                    {isFilledForm ? 'SBI_Statement_Jan_Aug_2026.pdf' : 'No file chosen'}
                  </span>
                </div>
              </div>

              {/* Upload & Analyze Button */}
              <div className="pt-2">
                <button
                  type="button"
                  style={{
                    color: '#ffffff',
                    backgroundColor: '#002366',
                    height: '34px',
                    minHeight: 'unset',
                    lineHeight: '1',
                  }}
                  className="w-full bg-[#002366] hover:bg-[#001c52] !text-white font-bold rounded-xl transition-colors shadow flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span className="inline-flex items-center justify-center gap-1.5 !text-white" style={{ color: '#ffffff', fontSize: '12px', whiteSpace: 'nowrap' }}>
                    {isFilledForm && <Check size={15} strokeWidth={2.5} className="text-white" />}
                    <span>Upload &amp; Analyze</span>
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // ══════════════════════════════════════════════════════════════════════════
    // STEP 5: Generated Reports (Pages 4, 6, 7 of PDF)
    // ══════════════════════════════════════════════════════════════════════════
    return (
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden space-y-4 p-4">
        {/* Navigation Tabs for Reports */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-slate-100">
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              type="button"
              onClick={() => {
                setActiveReportSection('overview');
                if (activePreset === '1M' && fromDate === '2025-08-01') {
                  setFromDate('2026-01-01');
                  setToDate('2026-08-04');
                  setAppliedPeriod({
                    from: '2026-01-01',
                    to: '2026-08-04',
                    label: 'January 1st, 2026 to August 4th, 2026',
                  });
                  setActivePreset('12M');
                }
              }}
              style={{
                backgroundColor: activeReportSection === 'overview' ? '#002366' : '#f1f5f9',
                color: activeReportSection === 'overview' ? '#ffffff' : '#334155',
                height: '28px',
                minHeight: 'unset',
                padding: '2px 9px',
                lineHeight: '1',
              }}
              className={`inline-flex items-center justify-center rounded-md font-semibold transition-all cursor-pointer whitespace-nowrap ${
                activeReportSection === 'overview'
                  ? 'bg-[#002366] !text-white shadow-2xs'
                  : 'text-slate-600 bg-slate-100 hover:bg-slate-200'
              }`}
            >
              <span
                style={{
                  color: activeReportSection === 'overview' ? '#ffffff' : '#334155',
                  fontSize: '11px',
                  lineHeight: '1',
                  whiteSpace: 'nowrap',
                }}
                className={activeReportSection === 'overview' ? '!text-white font-bold' : 'font-medium'}
              >
                Overview Details
              </span>
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveReportSection('debitCredit');
                setFromDate('2025-08-01');
                setToDate('2025-08-30');
                setAppliedPeriod({
                  from: '2025-08-01',
                  to: '2025-08-30',
                  label: 'August 1st, 2025 to August 30th, 2025',
                });
                setActivePreset('1M');
              }}
              style={{
                backgroundColor: activeReportSection === 'debitCredit' ? '#002366' : '#f1f5f9',
                color: activeReportSection === 'debitCredit' ? '#ffffff' : '#334155',
                height: '28px',
                minHeight: 'unset',
                padding: '2px 9px',
                lineHeight: '1',
              }}
              className={`inline-flex items-center justify-center rounded-md font-semibold transition-all cursor-pointer whitespace-nowrap ${
                activeReportSection === 'debitCredit'
                  ? 'bg-[#002366] !text-white shadow-2xs'
                  : 'text-slate-600 bg-slate-100 hover:bg-slate-200'
              }`}
            >
              <span
                style={{
                  color: activeReportSection === 'debitCredit' ? '#ffffff' : '#334155',
                  fontSize: '11px',
                  lineHeight: '1',
                  whiteSpace: 'nowrap',
                }}
                className={activeReportSection === 'debitCredit' ? '!text-white font-bold' : 'font-medium'}
              >
                Summary of Debit &amp; Credit
              </span>
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveReportSection('eod');
                if (fromDate === '2025-08-01') {
                  setFromDate('2026-01-01');
                  setToDate('2026-08-04');
                  setAppliedPeriod({
                    from: '2026-01-01',
                    to: '2026-08-04',
                    label: 'January 1st, 2026 to August 4th, 2026',
                  });
                  setActivePreset('12M');
                }
              }}
              style={{
                backgroundColor: activeReportSection === 'eod' ? '#002366' : '#f1f5f9',
                color: activeReportSection === 'eod' ? '#ffffff' : '#334155',
                height: '28px',
                minHeight: 'unset',
                padding: '2px 9px',
                lineHeight: '1',
              }}
              className={`inline-flex items-center justify-center rounded-md font-semibold transition-all cursor-pointer whitespace-nowrap ${
                activeReportSection === 'eod'
                  ? 'bg-[#002366] !text-white shadow-2xs'
                  : 'text-slate-600 bg-slate-100 hover:bg-slate-200'
              }`}
            >
              <span
                style={{
                  color: activeReportSection === 'eod' ? '#ffffff' : '#334155',
                  fontSize: '11px',
                  lineHeight: '1',
                  whiteSpace: 'nowrap',
                }}
                className={activeReportSection === 'eod' ? '!text-white font-bold' : 'font-medium'}
              >
                EOD Analysis
              </span>
            </button>
            <button
              type="button"
              onClick={() => setActiveReportSection('accountsList')}
              style={{
                backgroundColor: activeReportSection === 'accountsList' ? '#002366' : '#f1f5f9',
                color: activeReportSection === 'accountsList' ? '#ffffff' : '#334155',
                height: '28px',
                minHeight: 'unset',
                padding: '2px 9px',
                lineHeight: '1',
              }}
              className={`inline-flex items-center justify-center rounded-md font-semibold transition-all cursor-pointer whitespace-nowrap ${
                activeReportSection === 'accountsList'
                  ? 'bg-[#002366] !text-white shadow-2xs'
                  : 'text-slate-600 bg-slate-100 hover:bg-slate-200'
              }`}
            >
              <span
                style={{
                  color: activeReportSection === 'accountsList' ? '#ffffff' : '#334155',
                  fontSize: '11px',
                  lineHeight: '1',
                  whiteSpace: 'nowrap',
                }}
                className={activeReportSection === 'accountsList' ? '!text-white font-bold' : 'font-medium'}
              >
                Available Reports Menu
              </span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              style={{
                color: '#002366',
                backgroundColor: '#ffffff',
                height: '28px',
                minHeight: 'unset',
                padding: '2px 9px',
                lineHeight: '1',
              }}
              className="inline-flex items-center gap-1 bg-white border border-slate-200 rounded-md hover:bg-slate-50 shadow-2xs cursor-pointer whitespace-nowrap"
            >
              <span className="inline-flex items-center gap-1" style={{ fontSize: '11px', color: '#002366' }}>
                <Download size={11} className="text-[#002366]" />
                <span>Export</span>
              </span>
            </button>
          </div>
        </div>

        {/* ─── FILTER BY PERIOD CARD (Universal across all reports) ─────────── */}
        {activeReportSection !== 'accountsList' && (
          <div className="bg-slate-50/90 p-3.5 rounded-xl border border-slate-200 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <Filter size={13} className="text-[#002366]" />
                  <span className="text-xs font-bold text-slate-900">Filter by Period</span>
                  <span className="text-[10px] bg-blue-100 text-[#002366] font-semibold px-2 py-0.5 rounded-full border border-blue-200">
                    {activePreset === 'custom' ? 'Custom Range' : activePreset}
                  </span>
                </div>
                <span className="text-[11px] text-slate-500 block mt-0.5">
                  Select your preferred date range to generate a concise report across all statements.
                </span>
              </div>

              {/* Quick Preset Buttons */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mr-1">Presets:</span>
                {filterPresets.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handlePresetClick(preset)}
                    style={{
                      color: activePreset === preset.id ? '#ffffff' : '#334155',
                      backgroundColor: activePreset === preset.id ? '#002366' : '#ffffff',
                      height: '24px',
                      minHeight: 'unset',
                      padding: '2px 7px',
                      lineHeight: '1',
                    }}
                    className={`inline-flex items-center justify-center rounded border transition-all cursor-pointer whitespace-nowrap ${
                      activePreset === preset.id
                        ? 'bg-[#002366] !text-white border-[#002366] shadow-2xs'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <span style={{ color: activePreset === preset.id ? '#ffffff' : '#334155', fontSize: '10px', whiteSpace: 'nowrap' }}>
                      {preset.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
              {/* From Date Input */}
              <div className="flex items-center gap-1.5 bg-white border border-slate-300 rounded-md px-2 py-1 text-slate-700 shadow-2xs">
                <Calendar size={12} className="text-[#002366]" />
                <span className="text-[10px] font-medium text-slate-500">From Date:</span>
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => {
                    setFromDate(e.target.value);
                    setActivePreset('custom');
                  }}
                  className="text-xs font-bold text-slate-900 bg-transparent border-0 outline-none focus:ring-0 p-0 cursor-pointer"
                />
              </div>

              {/* To Date Input */}
              <div className="flex items-center gap-1.5 bg-white border border-slate-300 rounded-md px-2 py-1 text-slate-700 shadow-2xs">
                <Calendar size={12} className="text-[#002366]" />
                <span className="text-[10px] font-medium text-slate-500">To Date:</span>
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => {
                    setToDate(e.target.value);
                    setActivePreset('custom');
                  }}
                  className="text-xs font-bold text-slate-900 bg-transparent border-0 outline-none focus:ring-0 p-0 cursor-pointer"
                />
              </div>

              {/* Apply Filter Button */}
              <button
                type="button"
                onClick={handleApplyFilter}
                style={{
                  color: '#ffffff',
                  backgroundColor: '#002366',
                  height: '28px',
                  minHeight: 'unset',
                  padding: '2px 10px',
                  lineHeight: '1',
                }}
                className="inline-flex items-center justify-center gap-1 bg-[#002366] !text-white rounded-md font-bold hover:bg-[#001a4e] transition-all shadow-xs cursor-pointer whitespace-nowrap"
              >
                <span className="inline-flex items-center gap-1 !text-white font-bold" style={{ color: '#ffffff', fontSize: '11px', whiteSpace: 'nowrap' }}>
                  <Filter size={11} className="text-white" />
                  <span>Apply Filter</span>
                </span>
              </button>

              {/* Clear Button */}
              <button
                type="button"
                onClick={handleClearFilter}
                style={{
                  color: '#334155',
                  backgroundColor: '#ffffff',
                  height: '28px',
                  minHeight: 'unset',
                  padding: '2px 9px',
                  lineHeight: '1',
                }}
                className="inline-flex items-center justify-center gap-1 bg-white border border-slate-300 text-slate-700 rounded-md font-medium hover:bg-slate-100 transition-all cursor-pointer whitespace-nowrap"
              >
                <span className="inline-flex items-center gap-1 text-slate-700" style={{ color: '#334155', fontSize: '11px', whiteSpace: 'nowrap' }}>
                  <X size={11} className="text-slate-500" />
                  <span>Clear</span>
                </span>
              </button>

              {/* Filter Active Indicator Badge */}
              <div className="sm:ml-auto flex items-center gap-1.5 text-[11px] text-slate-500 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-100">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>
                  Filtered Period: <strong className="text-emerald-800">{formatDisplayDate(appliedPeriod.from)}</strong> to <strong className="text-emerald-800">{formatDisplayDate(appliedPeriod.to)}</strong>
                </span>
              </div>
            </div>

            <p className="text-[10px] text-slate-400 italic">
              * You can select a maximum date range of 12 months. Available data range:{' '}
              {activeReportSection === 'debitCredit'
                ? 'August 1st, 2025 to August 30th, 2025'
                : 'January 1st, 2026 to August 4th, 2026'}
              .
            </p>
          </div>
        )}

        {/* ─── TAB 1: Overview Details (Page 6 of PDF) ───────────────────────── */}
        {activeReportSection === 'overview' && (
          <div className="space-y-4">
            {/* Overview Details Table from Page 6 */}
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <div className="bg-slate-50 px-3 py-2 border-b border-slate-200 flex items-center justify-between">
                <div>
                  <h5 className="text-xs font-bold text-slate-900">Overview Details</h5>
                  <span className="text-[10px] text-slate-500">
                    From {formatDisplayDate(appliedPeriod.from)} To {formatDisplayDate(appliedPeriod.to)}
                  </span>
                </div>
                <button
                  type="button"
                  style={{
                    color: '#475569',
                    backgroundColor: '#ffffff',
                    height: '26px',
                    minHeight: 'unset',
                    padding: '2px 8px',
                    lineHeight: '1',
                  }}
                  className="inline-flex items-center gap-1 text-slate-600 bg-white border border-slate-200 rounded-md shadow-2xs hover:bg-slate-50 cursor-pointer whitespace-nowrap"
                >
                  <span className="inline-flex items-center gap-1 text-slate-600" style={{ color: '#475569', fontSize: '11px', whiteSpace: 'nowrap' }}>
                    <RefreshCw size={10} className="text-slate-500" /> 
                    <span>Refresh</span>
                  </span>
                </button>
              </div>

              <div className="overflow-x-auto text-xs">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#002366] text-white text-[11px] font-semibold">
                      <th className="p-2 border-r border-slate-700">Particulars</th>
                      <th className="p-2 border-r border-slate-700">Overall/Total</th>
                      <th className="p-2 border-r border-slate-700">Jan 2026</th>
                      <th className="p-2 border-r border-slate-700">Feb 2026</th>
                      <th className="p-2 border-r border-slate-700">Mar 2026</th>
                      <th className="p-2 border-r border-slate-700">Apr 2026</th>
                      <th className="p-2 border-r border-slate-700">May 2026</th>
                      <th className="p-2 border-r border-slate-700">Jun 2026</th>
                      <th className="p-2">Jul 2026</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-[11px] text-slate-700 font-mono">
                    <tr className="hover:bg-slate-50">
                      <td className="p-2 font-sans font-medium text-slate-900">Cash Deposit</td>
                      <td className="p-2 font-bold text-[#002366]">₹10,000.00</td>
                      <td className="p-2">₹0.00</td>
                      <td className="p-2">₹10,000.00</td>
                      <td className="p-2">₹0.00</td>
                      <td className="p-2">₹0.00</td>
                      <td className="p-2">₹0.00</td>
                      <td className="p-2">₹0.00</td>
                      <td className="p-2">-</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="p-2 font-sans font-medium text-slate-900">Cheque Receipts</td>
                      <td className="p-2 font-bold text-[#002366]">₹0.00</td>
                      <td className="p-2">₹0.00</td>
                      <td className="p-2">₹0.00</td>
                      <td className="p-2">₹0.00</td>
                      <td className="p-2">₹0.00</td>
                      <td className="p-2">₹0.00</td>
                      <td className="p-2">₹0.00</td>
                      <td className="p-2">-</td>
                    </tr>
                    <tr className="hover:bg-slate-50 bg-blue-50/20">
                      <td className="p-2 font-sans font-semibold text-slate-900">Online Receipts</td>
                      <td className="p-2 font-bold text-[#002366]">₹5,62,360.34</td>
                      <td className="p-2">₹14,713.00</td>
                      <td className="p-2">₹23,496.97</td>
                      <td className="p-2">₹91,281.00</td>
                      <td className="p-2">₹23,767.00</td>
                      <td className="p-2">₹50,052.00</td>
                      <td className="p-2">₹2,79,637.37</td>
                      <td className="p-2">₹70,333.00</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="p-2 font-sans font-medium text-slate-900">Bank Instrument</td>
                      <td className="p-2 font-bold text-[#002366]">₹0.00</td>
                      <td className="p-2 text-slate-400">-</td>
                      <td className="p-2 text-slate-400">-</td>
                      <td className="p-2 text-slate-400">-</td>
                      <td className="p-2 text-slate-400">-</td>
                      <td className="p-2 text-slate-400">-</td>
                      <td className="p-2 text-slate-400">-</td>
                      <td className="p-2 text-slate-400">-</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="p-2 font-sans font-medium text-slate-900">Forex Remittance</td>
                      <td className="p-2 font-bold text-[#002366]">₹0.00</td>
                      <td className="p-2 text-slate-400">-</td>
                      <td className="p-2 text-slate-400">-</td>
                      <td className="p-2 text-slate-400">-</td>
                      <td className="p-2 text-slate-400">-</td>
                      <td className="p-2 text-slate-400">-</td>
                      <td className="p-2 text-slate-400">-</td>
                      <td className="p-2 text-slate-400">-</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="p-2 font-sans font-medium text-slate-900">Refund/Reversal</td>
                      <td className="p-2 font-bold text-[#002366]">₹0.00</td>
                      <td className="p-2">₹0.00</td>
                      <td className="p-2">₹0.00</td>
                      <td className="p-2">₹0.00</td>
                      <td className="p-2">₹0.00</td>
                      <td className="p-2">₹0.00</td>
                      <td className="p-2">₹0.00</td>
                      <td className="p-2">-</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="p-2 font-sans font-medium text-slate-900">Other Receipts</td>
                      <td className="p-2 font-bold text-[#002366]">₹800.00</td>
                      <td className="p-2">₹0.00</td>
                      <td className="p-2">₹0.00</td>
                      <td className="p-2">₹500.00</td>
                      <td className="p-2">₹0.00</td>
                      <td className="p-2">₹300.00</td>
                      <td className="p-2">₹0.00</td>
                      <td className="p-2">-</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ─── TAB 2: Summary of Debit & Credit (Page 7 of PDF) ───────────────── */}
        {activeReportSection === 'debitCredit' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h5 className="text-xs font-bold text-slate-900">Summary of Debit &amp; Credit</h5>
                <span className="text-[10px] text-slate-500">
                  From {formatDisplayDate(appliedPeriod.from)} To {formatDisplayDate(appliedPeriod.to)}
                </span>
              </div>
              <button
                type="button"
                style={{
                  color: '#475569',
                  backgroundColor: '#ffffff',
                  height: '26px',
                  minHeight: 'unset',
                  padding: '2px 8px',
                  lineHeight: '1',
                }}
                className="inline-flex items-center gap-1 text-slate-600 bg-white border border-slate-200 rounded-md shadow-2xs hover:bg-slate-50 cursor-pointer whitespace-nowrap"
              >
                <span className="inline-flex items-center gap-1 text-slate-600" style={{ color: '#475569', fontSize: '11px', whiteSpace: 'nowrap' }}>
                  <RefreshCw size={10} className="text-slate-500" /> 
                  <span>Refresh</span>
                </span>
              </button>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#002366] text-white text-[11px]">
                    <th className="p-2">Months</th>
                    <th className="p-2">Total</th>
                    <th className="p-2">Aug 2025</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                  {/* Inflows (Value) banner from Page 7 */}
                  <tr className="bg-[#e8eefb] text-[#002366] font-bold font-sans">
                    <td colSpan={3} className="p-1.5 px-2">Inflows (Value)</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-sans font-medium">Cash Deposit</td>
                    <td className="p-2">₹0.00</td>
                    <td className="p-2">₹0.00</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-sans font-medium">Cheque Receipt</td>
                    <td className="p-2 text-rose-600">-₹45,079.00</td>
                    <td className="p-2 text-rose-600">-₹45,079.00</td>
                  </tr>
                  <tr className="bg-blue-50/40">
                    <td className="p-2 font-sans font-semibold text-slate-900">Online Receipt</td>
                    <td className="p-2 font-bold text-[#002366]">₹24,64,736.00</td>
                    <td className="p-2 font-bold text-[#002366]">₹24,64,736.00</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-sans font-medium">Other Receipt</td>
                    <td className="p-2">₹45,079.00</td>
                    <td className="p-2">₹45,079.00</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-sans font-medium">Inhouse Receipt</td>
                    <td className="p-2">₹0.00</td>
                    <td className="p-2">₹0.00</td>
                  </tr>
                  <tr className="bg-slate-100 font-bold font-sans text-slate-900 border-t-2 border-slate-300">
                    <td className="p-2">Total Receipt (Inflows)</td>
                    <td className="p-2 font-mono text-[#002366]">₹24,64,736.00</td>
                    <td className="p-2 font-mono text-[#002366]">₹24,64,736.00</td>
                  </tr>

                  {/* Inflows (No.) banner from Page 7 */}
                  <tr className="bg-[#e8eefb] text-[#002366] font-bold font-sans">
                    <td colSpan={3} className="p-1.5 px-2">Inflows (No.)</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-sans font-medium">Cash Deposit</td>
                    <td className="p-2">0</td>
                    <td className="p-2">0</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-sans font-medium">Cheque Receipt</td>
                    <td className="p-2">-4</td>
                    <td className="p-2">-4</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-sans font-medium">Online Receipt</td>
                    <td className="p-2 font-bold text-slate-900">175</td>
                    <td className="p-2 font-bold text-slate-900">175</td>
                  </tr>
                  <tr className="bg-slate-100 font-bold font-sans text-slate-900 border-t-2 border-slate-300">
                    <td className="p-2">Total Receipt (Inflows)</td>
                    <td className="p-2 font-mono">175</td>
                    <td className="p-2 font-mono">175</td>
                  </tr>

                  {/* Outflows banner */}
                  <tr className="bg-[#e8eefb] text-[#002366] font-bold font-sans">
                    <td colSpan={3} className="p-1.5 px-2">Outflows (Value)</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-sans font-medium">Cash Withdrawal</td>
                    <td className="p-2">₹0.00</td>
                    <td className="p-2">₹0.00</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ─── TAB 3: EOD Analysis (Page 7 of PDF) ─────────────────────────────── */}
        {activeReportSection === 'eod' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h5 className="text-xs font-bold text-slate-900">EOD Analysis</h5>
                <span className="text-[10px] text-slate-500">
                  From {formatDisplayDate(appliedPeriod.from)} To {formatDisplayDate(appliedPeriod.to)}
                </span>
              </div>
              <button
                type="button"
                style={{
                  color: '#475569',
                  backgroundColor: '#ffffff',
                  height: '26px',
                  minHeight: 'unset',
                  padding: '2px 8px',
                  lineHeight: '1',
                }}
                className="inline-flex items-center gap-1 text-slate-600 bg-white border border-slate-200 rounded-md shadow-2xs hover:bg-slate-50 cursor-pointer whitespace-nowrap"
              >
                <span className="inline-flex items-center gap-1 text-slate-600" style={{ color: '#475569', fontSize: '11px', whiteSpace: 'nowrap' }}>
                  <RefreshCw size={10} className="text-slate-500" />
                  <span>Refresh</span>
                </span>
              </button>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#002366] text-white text-[11px]">
                      <th className="p-2 border-r border-slate-700">Particulars</th>
                      <th className="p-2 border-r border-slate-700">Overall/Total</th>
                      <th className="p-2 border-r border-slate-700">Jan 2026</th>
                      <th className="p-2 border-r border-slate-700">Feb 2026</th>
                      <th className="p-2 border-r border-slate-700">Mar 2026</th>
                      <th className="p-2 border-r border-slate-700">Apr 2026</th>
                      <th className="p-2 border-r border-slate-700">May 2026</th>
                      <th className="p-2 border-r border-slate-700">Jun 2026</th>
                      <th className="p-2 border-r border-slate-700">Jul 2026</th>
                      <th className="p-2">Aug 2026</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono text-[11px] text-slate-700">
                    <tr>
                      <td className="p-2 font-sans font-medium text-slate-900">Opening Balance</td>
                      <td className="p-2 font-bold text-[#002366]">₹400.43</td>
                      <td className="p-2">₹400.43</td>
                      <td className="p-2">₹786.43</td>
                      <td className="p-2">₹5,386.40</td>
                      <td className="p-2">₹4,980.80</td>
                      <td className="p-2">₹851.20</td>
                      <td className="p-2">₹3,132.20</td>
                      <td className="p-2">₹4,203.97</td>
                      <td className="p-2">₹417.97</td>
                    </tr>
                    <tr className="bg-emerald-50/30">
                      <td className="p-2 font-sans font-semibold text-slate-900">Max EOD</td>
                      <td className="p-2 font-bold text-emerald-800">₹1,00,028.97</td>
                      <td className="p-2">₹2,990.43</td>
                      <td className="p-2">₹5,786.43</td>
                      <td className="p-2">₹15,911.40</td>
                      <td className="p-2">₹4,625.80</td>
                      <td className="p-2">₹6,769.20</td>
                      <td className="p-2">₹1,00,028.97</td>
                      <td className="p-2">₹6,041.97</td>
                      <td className="p-2">₹4,862.97</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-sans font-medium text-slate-500">Max EOD Date</td>
                      <td className="p-2">23-06-2026</td>
                      <td className="p-2">04-01-2026</td>
                      <td className="p-2">01-02-2026</td>
                      <td className="p-2">09-03-2026</td>
                      <td className="p-2">01-04-2026</td>
                      <td className="p-2">17-05-2026</td>
                      <td className="p-2">23-06-2026</td>
                      <td className="p-2">12-07-2026</td>
                      <td className="p-2">01-08-2026</td>
                    </tr>
                    <tr className="bg-rose-50/30">
                      <td className="p-2 font-sans font-semibold text-slate-900">Min EOD</td>
                      <td className="p-2 font-bold text-rose-700">₹0.43</td>
                      <td className="p-2">₹41.43</td>
                      <td className="p-2">₹0.43</td>
                      <td className="p-2">₹12.80</td>
                      <td className="p-2">₹28.80</td>
                      <td className="p-2">₹116.20</td>
                      <td className="p-2">₹19.20</td>
                      <td className="p-2">₹8.97</td>
                      <td className="p-2">₹582.97</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-sans font-medium text-slate-500">Min EOD Date</td>
                      <td className="p-2">16-02-2026</td>
                      <td className="p-2">08-01-2026</td>
                      <td className="p-2">16-02-2026</td>
                      <td className="p-2">25-03-2026</td>
                      <td className="p-2">02-04-2026</td>
                      <td className="p-2">23-05-2026</td>
                      <td className="p-2">05-06-2026</td>
                      <td className="p-2">18-07-2026</td>
                      <td className="p-2">04-08-2026</td>
                    </tr>
                    <tr className="bg-blue-50/30">
                      <td className="p-2 font-sans font-semibold text-[#002366]">Average EOD</td>
                      <td className="p-2 font-bold text-[#002366]">₹2,260.78</td>
                      <td className="p-2">₹964.91</td>
                      <td className="p-2">₹962.14</td>
                      <td className="p-2">₹3,212.86</td>
                      <td className="p-2">₹1,005.63</td>
                      <td className="p-2">₹2,153.30</td>
                      <td className="p-2">₹5,582.02</td>
                      <td className="p-2">₹1,910.91</td>
                      <td className="p-2">₹2,294.47</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-sans font-medium text-slate-900">Closing Balance</td>
                      <td className="p-2 font-bold text-slate-900">₹582.97</td>
                      <td className="p-2">₹786.43</td>
                      <td className="p-2">₹5,386.40</td>
                      <td className="p-2">₹4,980.80</td>
                      <td className="p-2">₹851.20</td>
                      <td className="p-2">₹3,132.20</td>
                      <td className="p-2">₹4,203.97</td>
                      <td className="p-2">₹417.97</td>
                      <td className="p-2">₹582.97</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-sans font-medium text-slate-700">1 EOD</td>
                      <td className="p-2">3,837.8</td>
                      <td className="p-2">1900.43</td>
                      <td className="p-2">5786.43</td>
                      <td className="p-2">4420.40</td>
                      <td className="p-2">4625.80</td>
                      <td className="p-2">4226.20</td>
                      <td className="p-2">176.20</td>
                      <td className="p-2">4703.97</td>
                      <td className="p-2">4862.97</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-sans font-medium text-slate-700">5 EOD</td>
                      <td className="p-2">539.43</td>
                      <td className="p-2">1540.43</td>
                      <td className="p-2">389.43</td>
                      <td className="p-2">1500.40</td>
                      <td className="p-2">29.80</td>
                      <td className="p-2">794.20</td>
                      <td className="p-2">19.20</td>
                      <td className="p-2">41.97</td>
                      <td className="p-2">0.00</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ─── TAB 4: Available Reports Menu from Page 4 ───────────────────────── */}
        {activeReportSection === 'accountsList' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-600">Select Customer Bank Account:</span>
              <button
                type="button"
                onClick={() => setSelectedAccountForReports('sbi')}
                style={{
                  backgroundColor: selectedAccountForReports === 'sbi' ? '#002366' : '#ffffff',
                  color: selectedAccountForReports === 'sbi' ? '#ffffff' : '#334155',
                  height: '28px',
                  minHeight: 'unset',
                  padding: '2px 9px',
                  lineHeight: '1',
                }}
                className={`inline-flex items-center justify-center rounded-md font-semibold border cursor-pointer whitespace-nowrap ${
                  selectedAccountForReports === 'sbi'
                    ? 'bg-[#002366] !text-white border-[#002366]'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <span style={{ color: selectedAccountForReports === 'sbi' ? '#ffffff' : '#334155', fontSize: '11px', whiteSpace: 'nowrap' }}>
                  State Bank of India (Individual)
                </span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedAccountForReports('dbs')}
                style={{
                  backgroundColor: selectedAccountForReports === 'dbs' ? '#002366' : '#ffffff',
                  color: selectedAccountForReports === 'dbs' ? '#ffffff' : '#334155',
                  height: '28px',
                  minHeight: 'unset',
                  padding: '2px 9px',
                  lineHeight: '1',
                }}
                className={`inline-flex items-center justify-center rounded-md font-semibold border cursor-pointer whitespace-nowrap ${
                  selectedAccountForReports === 'dbs'
                    ? 'bg-[#002366] !text-white border-[#002366]'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <span style={{ color: selectedAccountForReports === 'dbs' ? '#ffffff' : '#334155', fontSize: '11px', whiteSpace: 'nowrap' }}>
                  DBS Bank (Partnership)
                </span>
              </button>
            </div>

            {selectedAccountForReports === 'sbi' ? (
              /* Set 1 from Page 4 (SBI / Individual) */
              <div className="border border-slate-200 rounded-xl p-4 bg-white space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <div>
                    <h5 className="text-xs font-bold text-slate-900">Available Reports</h5>
                    <span className="text-[10px] text-slate-500">Select a report to continue</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      style={{
                        color: '#ffffff',
                        backgroundColor: '#002366',
                        height: '26px',
                        minHeight: 'unset',
                        padding: '2px 8px',
                        lineHeight: '1',
                      }}
                      className="inline-flex items-center gap-1 bg-[#002366] !text-white rounded-md shadow-2xs hover:bg-[#001a4e] cursor-pointer whitespace-nowrap"
                    >
                      <span className="inline-flex items-center gap-1" style={{ color: '#ffffff', fontSize: '11px' }}>
                        <Download size={11} className="text-white" />
                        <span>Export</span>
                      </span>
                    </button>
                    <button
                      type="button"
                      style={{
                        color: '#ffffff',
                        backgroundColor: '#0f172a',
                        height: '26px',
                        minHeight: 'unset',
                        padding: '2px 8px',
                        lineHeight: '1',
                      }}
                      className="inline-flex items-center justify-center bg-slate-900 !text-white rounded-md cursor-pointer whitespace-nowrap"
                    >
                      <span style={{ color: '#ffffff', fontSize: '11px' }}>Back</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <div
                    onClick={() => setActiveReportSection('overview')}
                    className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-slate-100/70 hover:border-slate-300 cursor-pointer transition-colors"
                  >
                    <span className="flex items-center gap-2 text-xs font-semibold text-slate-800">
                      <FileText size={14} className="text-[#002366]" />
                      Overview
                    </span>
                    <ChevronRight size={14} className="text-slate-400" />
                  </div>

                  <div
                    onClick={() => setActiveReportSection('eod')}
                    className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-slate-100/70 hover:border-slate-300 cursor-pointer transition-colors"
                  >
                    <span className="flex items-center gap-2 text-xs font-semibold text-slate-800">
                      <BarChart3 size={14} className="text-[#002366]" />
                      EOD Analysis
                    </span>
                    <ChevronRight size={14} className="text-slate-400" />
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-slate-100/70 hover:border-slate-300 cursor-pointer transition-colors">
                    <span className="flex items-center gap-2 text-xs font-semibold text-slate-800">
                      <Repeat size={14} className="text-[#002366]" />
                      Loan Transactions
                    </span>
                    <ChevronRight size={14} className="text-slate-400" />
                  </div>
                </div>
              </div>
            ) : (
              /* Set 2 from Page 4 (DBS / Partnership) */
              <div className="border border-slate-200 rounded-xl p-4 bg-white space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <div>
                    <h5 className="text-xs font-bold text-slate-900">Available Reports</h5>
                    <span className="text-[10px] text-slate-500">Select a report to continue</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      style={{
                        color: '#ffffff',
                        backgroundColor: '#002366',
                        height: '26px',
                        minHeight: 'unset',
                        padding: '2px 8px',
                        lineHeight: '1',
                      }}
                      className="inline-flex items-center gap-1 bg-[#002366] !text-white rounded-md shadow-2xs hover:bg-[#001a4e] cursor-pointer whitespace-nowrap"
                    >
                      <span className="inline-flex items-center gap-1" style={{ color: '#ffffff', fontSize: '11px' }}>
                        <Download size={11} className="text-white" />
                        <span>Export</span>
                      </span>
                    </button>
                    <button
                      type="button"
                      style={{
                        color: '#ffffff',
                        backgroundColor: '#0f172a',
                        height: '26px',
                        minHeight: 'unset',
                        padding: '2px 8px',
                        lineHeight: '1',
                      }}
                      className="inline-flex items-center justify-center bg-slate-900 !text-white rounded-md cursor-pointer whitespace-nowrap"
                    >
                      <span style={{ color: '#ffffff', fontSize: '11px' }}>Back</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <div
                    onClick={() => setActiveReportSection('debitCredit')}
                    className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-slate-100/70 hover:border-slate-300 cursor-pointer transition-colors"
                  >
                    <span className="flex items-center gap-2 text-xs font-semibold text-slate-800">
                      <TrendingUp size={14} className="text-[#002366]" />
                      Summary of Debit and Credit
                    </span>
                    <ChevronRight size={14} className="text-slate-400" />
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-slate-100/70 hover:border-slate-300 cursor-pointer transition-colors">
                    <span className="flex items-center gap-2 text-xs font-semibold text-slate-800">
                      <Repeat size={14} className="text-[#002366]" />
                      Cash Flow
                    </span>
                    <ChevronRight size={14} className="text-slate-400" />
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-slate-100/70 hover:border-slate-300 cursor-pointer transition-colors">
                    <span className="flex items-center gap-2 text-xs font-semibold text-slate-800">
                      <Clock size={14} className="text-[#002366]" />
                      Monthly Overview
                    </span>
                    <ChevronRight size={14} className="text-slate-400" />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm mt-3">
      <div className="p-3.5 bg-slate-50/40">{renderContent()}</div>
    </div>
  );
}

export default BsaScreenPreview;
