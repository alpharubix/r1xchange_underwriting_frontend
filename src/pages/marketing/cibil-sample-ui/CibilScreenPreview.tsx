import { useState } from 'react';
import {
  Fingerprint,
  ArrowLeft,
  Landmark,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
} from 'lucide-react';

export interface CibilScreenPreviewProps {
  stepIndex: number;
}

export function CibilScreenPreview({ stepIndex }: CibilScreenPreviewProps) {
  // Step 1: Identity fields
  const [firstName, setFirstName] = useState('Rahul');
  const [lastName, setLastName] = useState('Sharma');
  const [dob, setDob] = useState('13/05/2003');
  const [gender, setGender] = useState('Male');
  const [mobile, setMobile] = useState('9876543210');
  const [idType, setIdType] = useState('PAN Card');
  const [idNumber, setIdNumber] = useState('ABCDE1234F');

  // Step 2: OTP
  const [otp, setOtp] = useState('');

  // Report view tabs & accordion
  const [activeAccountTab, setActiveAccountTab] = useState<'active' | 'closed'>('active');
  const [isAccordionOpen, setIsAccordionOpen] = useState(true);

  const progressSteps = [
    { num: 1, label: 'Identity' },
    { num: 2, label: 'OTP' },
    { num: 3, label: 'Status' },
    { num: 4, label: 'Report' },
  ];

  const renderContent = () => {
    // ══════════════════════════════════════════════════════════════════════════
    // STEP 0 / 1: Fill the Information (Page 10 of PDF)
    // ══════════════════════════════════════════════════════════════════════════
    if (stepIndex === 0 || stepIndex === 1) {
      return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 max-w-lg mx-auto space-y-4">
          <div className="flex items-start justify-between pb-2 border-b border-slate-100">
            <div>
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Fingerprint size={16} className="text-[#002366]" />
                CIBIL Score
              </h4>
              <p className="text-[11px] text-slate-500">
                Authenticate customer consent and process CIBIL report data
              </p>
            </div>
            <span className="text-[10px] font-mono text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
              Target ID: 69e539ec4a...
            </span>
          </div>

          <div className="bg-slate-50/70 p-3 rounded-lg border border-slate-200 space-y-3">
            <div>
              <strong className="text-xs text-slate-800 block">Identity Details</strong>
              <span className="text-[10px] text-slate-500">
                Enter the customer details required to initiate the CIBIL consent OTP.
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs">
              <div>
                <label className="text-[10px] font-semibold text-slate-600 block mb-0.5">First Name</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full border border-slate-300 rounded px-2 py-1 text-xs text-slate-800 bg-white"
                />
              </div>
              <div>
                <label className="text-[10px] font-semibold text-slate-600 block mb-0.5">Middle Name</label>
                <input
                  type="text"
                  placeholder="Optional"
                  className="w-full border border-slate-300 rounded px-2 py-1 text-xs text-slate-400 bg-white"
                />
              </div>
              <div>
                <label className="text-[10px] font-semibold text-slate-600 block mb-0.5">Last Name</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full border border-slate-300 rounded px-2 py-1 text-xs text-slate-800 bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs">
              <div>
                <label className="text-[10px] font-semibold text-slate-600 block mb-0.5">Date of Birth</label>
                <input
                  type="text"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full border border-slate-300 rounded px-2 py-1 text-xs text-slate-800 bg-white font-mono"
                />
              </div>
              <div>
                <label className="text-[10px] font-semibold text-slate-600 block mb-0.5">Gender</label>
                <input
                  type="text"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full border border-slate-300 rounded px-2 py-1 text-xs text-slate-800 bg-white"
                />
              </div>
              <div>
                <label className="text-[10px] font-semibold text-slate-600 block mb-0.5">Mobile Number</label>
                <input
                  type="text"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="w-full border border-slate-300 rounded px-2 py-1 text-xs text-slate-800 bg-white font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-slate-200">
              <div>
                <label className="text-[10px] font-semibold text-slate-600 block mb-0.5">ID Type</label>
                <input
                  type="text"
                  value={idType}
                  onChange={(e) => setIdType(e.target.value)}
                  className="w-full border border-slate-300 rounded px-2 py-1 text-xs text-slate-800 bg-white font-semibold"
                />
              </div>
              <div>
                <label className="text-[10px] font-semibold text-slate-600 block mb-0.5">ID Number</label>
                <input
                  type="text"
                  value={idNumber}
                  onChange={(e) => setIdNumber(e.target.value.toUpperCase())}
                  className="w-full border border-slate-300 rounded px-2 py-1 text-xs text-slate-800 bg-white font-mono uppercase"
                />
              </div>
            </div>

            <button
              type="button"
              style={{
                color: '#ffffff',
                backgroundColor: '#002366',
                height: '34px',
                minHeight: 'unset',
                lineHeight: '1',
              }}
              className="w-full bg-[#002366] !text-white text-xs font-bold rounded-lg hover:bg-[#001a4e] transition-colors flex items-center justify-center cursor-pointer shadow-2xs"
            >
              <span style={{ color: '#ffffff', fontSize: '12px', whiteSpace: 'nowrap' }}>Continue to OTP</span>
            </button>
          </div>
        </div>
      );
    }

    // ══════════════════════════════════════════════════════════════════════════
    // STEP 2: OTP Verification (Page 10 of PDF)
    // ══════════════════════════════════════════════════════════════════════════
    if (stepIndex === 2) {
      return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 max-w-sm mx-auto space-y-4">
          <div className="flex items-center gap-2 text-xs text-slate-500 cursor-pointer hover:text-slate-800">
            <ArrowLeft size={13} />
            <strong className="text-slate-900 text-sm">OTP Verification</strong>
          </div>

          <p className="text-[11px] text-slate-500 leading-relaxed">
            Enter the OTP sent to the customer's mobile number <b className="text-slate-800 font-mono">6381485870</b>.
          </p>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 block">
              One-Time Password
            </label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 tracking-widest font-mono text-center focus:outline-none focus:ring-1 focus:ring-[#002366]"
            />
          </div>

          <button
            type="button"
            style={{
              color: '#ffffff',
              backgroundColor: '#002366',
              height: '34px',
              minHeight: 'unset',
              lineHeight: '1',
            }}
            className="w-full bg-[#002366] !text-white text-xs font-bold rounded-lg hover:bg-[#001a4e] transition-colors flex items-center justify-center cursor-pointer shadow-2xs"
          >
            <span style={{ color: '#ffffff', fontSize: '12px', whiteSpace: 'nowrap' }}>Verify OTP</span>
          </button>

          <div className="text-center text-[10px] text-slate-400">
            Resend OTP in <span className="font-semibold text-[#002366]">27s</span>
          </div>
        </div>
      );
    }

    // ══════════════════════════════════════════════════════════════════════════
    // STEP 3 / 4: Full Bureau Report & Accounts Breakdown (Page 10 of PDF)
    // ══════════════════════════════════════════════════════════════════════════
    return (
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden p-4 space-y-4">
        {/* Top Cards: Bureau Score Gauge & Personal Profile */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Circular Bureau Score Card from Page 10 */}
          <div className="border border-slate-200 rounded-xl p-3.5 bg-white flex flex-col items-center justify-center text-center shadow-2xs">
            <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold block mb-1">
              BUREAU SCORE
            </span>

            {/* Semicircle radial gauge representation */}
            <div className="relative w-28 h-16 flex items-end justify-center">
              <svg className="w-28 h-16" viewBox="0 0 100 50">
                <path
                  d="M 10,50 A 40,40 0 0,1 90,50"
                  fill="none"
                  stroke="#e2e8f0"
                  strokeWidth="8"
                  strokeLinecap="round"
                />
                <path
                  d="M 10,50 A 40,40 0 0,1 78,22"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="8"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-end">
                <span className="text-2xl font-black text-slate-900 leading-none">729</span>
                <span className="text-[8px] font-bold text-slate-400 tracking-wider">EQUIFAX SCORE</span>
              </div>
            </div>

            <div className="mt-2">
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full uppercase">
                GOOD
              </span>
              <p className="text-[10px] text-slate-500 mt-1">
                Healthy credit history. Very good loan approvals.
              </p>
            </div>
          </div>

          {/* Personal Profile from Page 10 */}
          <div className="md:col-span-2 border border-slate-200 rounded-xl p-3.5 bg-white shadow-2xs">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-1 mb-2">
              PERSONAL &amp; IDENTIFICATION PROFILE
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
              <div>
                <span className="text-[9px] text-slate-400 uppercase tracking-wider block">FULL NAME</span>
                <strong className="text-slate-900 text-[11px]">SARAN D</strong>
              </div>
              <div>
                <span className="text-[9px] text-slate-400 uppercase tracking-wider block">DATE OF BIRTH (AGE)</span>
                <span className="text-slate-700 text-[11px]">13-05-2003 (23 Yrs) | Male</span>
              </div>
              <div>
                <span className="text-[9px] text-slate-400 uppercase tracking-wider block">PAN NUMBER</span>
                <span className="text-slate-900 font-mono text-[11px] font-bold">SDAKE2123D</span>
              </div>
              <div>
                <span className="text-[9px] text-slate-400 uppercase tracking-wider block">EMAIL ADDRESS</span>
                <span className="text-slate-700 text-[11px]">STIVENSARAN@GMAIL.COM</span>
              </div>
              <div>
                <span className="text-[9px] text-slate-400 uppercase tracking-wider block">OCCUPATION</span>
                <span className="text-slate-700 text-[11px]">Professional</span>
              </div>
              <div>
                <span className="text-[9px] text-slate-400 uppercase tracking-wider block">ANNUAL INCOME</span>
                <span className="text-slate-900 font-bold text-[11px]">₹ 70</span>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Metrics Row from Page 10 */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          <div className="border border-slate-200 rounded-lg p-2.5 bg-slate-50/50">
            <span className="text-[9px] uppercase tracking-wider text-slate-400 block font-semibold">TOTAL ACCOUNTS</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-base font-bold text-slate-900">1</span>
              <span className="text-[10px] text-slate-400">Accounts</span>
            </div>
          </div>

          <div className="border border-slate-200 rounded-lg p-2.5 bg-slate-50/50">
            <span className="text-[9px] uppercase tracking-wider text-slate-400 block font-semibold">ACTIVE ACCOUNTS</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-base font-bold text-slate-900">1</span>
              <span className="text-[10px] text-emerald-600 font-bold">Active</span>
            </div>
          </div>

          <div className="border border-slate-200 rounded-lg p-2.5 bg-slate-50/50">
            <span className="text-[9px] uppercase tracking-wider text-slate-400 block font-semibold">OVERDUE ACCOUNTS</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-base font-bold text-slate-900">0</span>
              <span className="text-[10px] text-slate-400">OVERDUE</span>
            </div>
          </div>

          <div className="border border-slate-200 rounded-lg p-2.5 bg-slate-50/50">
            <span className="text-[9px] uppercase tracking-wider text-slate-400 block font-semibold">TOTAL OVERDUE AMOUNT</span>
            <div className="text-base font-bold text-slate-900 mt-0.5">
              ₹0
            </div>
          </div>
        </div>

        {/* Financial Debt Row from Page 10 */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs">
          {/* Outstanding Debt - Dark Blue Card */}
          <div className="bg-[#002366] text-white rounded-lg p-3">
            <span className="text-[9px] text-blue-200 uppercase tracking-wider block">OUTSTANDING DEBT</span>
            <div className="text-lg font-black text-white mt-0.5">₹7,839</div>
            <span className="text-[9px] text-blue-200 mt-0.5 block">TOTAL OUTSTANDING BALANCE</span>
          </div>

          <div className="border border-slate-200 rounded-lg p-3 bg-white">
            <span className="text-[9px] text-slate-400 uppercase tracking-wider block">CREDIT LIMIT</span>
            <div className="text-lg font-bold text-slate-900 mt-0.5">₹8,050</div>
            <span className="text-[9px] text-slate-400 mt-0.5 block">MAXIMUM AMOUNT SANCTIONED</span>
          </div>

          <div className="border border-slate-200 rounded-lg p-3 bg-white">
            <span className="text-[9px] text-slate-400 uppercase tracking-wider block">OLDEST OPEN DATE</span>
            <div className="text-xs font-bold text-slate-900 mt-1">30-11-2021</div>
            <span className="text-[9px] text-slate-400 mt-1 block">
              Recent Open: <b className="text-slate-700">30-11-2021</b>
            </span>
          </div>

          <div className="border border-slate-200 rounded-lg p-3 bg-white">
            <span className="text-[9px] text-slate-400 uppercase tracking-wider block">Accounts as Guarantor</span>
            <div className="text-base font-bold text-slate-900 mt-1">0</div>
          </div>
        </div>

        {/* Lender Distribution & Repayments Cards from Page 10 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="border border-slate-200 rounded-lg p-3 bg-slate-50/50">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
              <Landmark size={12} /> LENDER DISTRIBUTION
            </div>
            <div className="flex items-center justify-between text-xs py-1 border-b border-slate-200">
              <strong className="text-slate-800">Slice Small Finance Bank Limited</strong>
              <div className="text-right">
                <span className="text-slate-500 text-[10px] mr-2">1 Account</span>
                <strong className="text-[#002366]">₹8,050</strong>
              </div>
            </div>
          </div>

          <div className="border border-slate-200 rounded-lg p-3 bg-slate-50/50">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
              <AlertTriangle size={12} /> REPAYMENT &amp; OBLIGATIONS
            </div>
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div>
                <span className="text-[9px] text-slate-400 block">DPDS RECORDED</span>
                <strong className="text-slate-800">0</strong>
              </div>
              <div>
                <span className="text-[9px] text-slate-400 block">ACTIVE DPDS</span>
                <strong className="text-slate-800">0</strong>
              </div>
              <div>
                <span className="text-[9px] text-slate-400 block">HIGHEST DPD</span>
                <strong className="text-emerald-700 font-mono">000</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Active Accounts / Closed Accounts with Detailed Breakdown from Page 10 */}
        <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
          {/* Tabs */}
          <div className="flex items-center border-b border-slate-200 bg-slate-100/70 px-3 pt-2 gap-2">
            <button
              type="button"
              onClick={() => setActiveAccountTab('active')}
              style={{
                height: '28px',
                minHeight: 'unset',
                padding: '2px 9px',
                lineHeight: '1',
              }}
              className={`font-bold rounded-t-lg transition-colors inline-flex items-center justify-center cursor-pointer ${
                activeAccountTab === 'active'
                  ? 'bg-white text-[#002366] border-t border-x border-slate-200 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <span style={{ fontSize: '11px', whiteSpace: 'nowrap' }}>Active Accounts</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveAccountTab('closed')}
              style={{
                height: '28px',
                minHeight: 'unset',
                padding: '2px 9px',
                lineHeight: '1',
              }}
              className={`font-bold rounded-t-lg transition-colors inline-flex items-center justify-center cursor-pointer ${
                activeAccountTab === 'closed'
                  ? 'bg-white text-[#002366] border-t border-x border-slate-200 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <span style={{ fontSize: '11px', whiteSpace: 'nowrap' }}>Closed Accounts</span>
            </button>
          </div>

          <div className="p-3 bg-white space-y-3">
            {/* Summary figures */}
            <div className="grid grid-cols-3 gap-2 p-2 bg-slate-50 rounded-lg border border-slate-200 text-center">
              <div>
                <span className="text-[9px] text-slate-400 uppercase tracking-wider block">TOTAL CREDIT LIMIT</span>
                <strong className="text-slate-900 text-xs">₹8,050</strong>
              </div>
              <div>
                <span className="text-[9px] text-slate-400 uppercase tracking-wider block">CURRENT BALANCE</span>
                <strong className="text-slate-900 text-xs">₹7,839</strong>
              </div>
              <div>
                <span className="text-[9px] text-slate-400 uppercase tracking-wider block">OVERDUE BALANCE</span>
                <strong className="text-rose-600 text-xs">₹12</strong>
              </div>
            </div>

            {/* Accordion Card for Slice Small Finance Bank */}
            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <div
                onClick={() => setIsAccordionOpen(!isAccordionOpen)}
                className="p-2.5 bg-slate-50/70 flex items-center justify-between cursor-pointer hover:bg-slate-100/70"
              >
                <div className="flex items-center gap-2">
                  <Landmark size={14} className="text-[#002366]" />
                  <div>
                    <strong className="text-xs text-slate-900">Slice Small Finance Bank Limited</strong>
                    <span className="text-[10px] text-slate-500 block">
                      Acct: XXXX6135 · Opened: 30-11-2021
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block">CURRENT / OVERDUE</span>
                    <span className="font-bold text-slate-800 text-xs">₹7,839</span>{' '}
                    <span className="text-rose-600 font-bold text-xs">₹12</span>
                  </div>
                  {isAccordionOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </div>
              </div>

              {isAccordionOpen && (
                <div className="p-3 border-t border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white text-[11px]">
                  {/* Financials column */}
                  <div>
                    <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                      FINANCIALS
                    </span>
                    <div className="space-y-1 text-slate-600">
                      <div>Sanctioned: <b className="text-slate-800">₹8,050</b></div>
                      <div>EMI: <span className="text-slate-500">N/A</span></div>
                      <div>Interest Rate: <span className="text-slate-500">N/A</span></div>
                      <div>Repayment: <b className="text-slate-800">Monthly</b></div>
                    </div>
                  </div>

                  {/* Tenure & Dates column */}
                  <div>
                    <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                      TENURE &amp; DATES
                    </span>
                    <div className="space-y-1 text-slate-600">
                      <div>Repayment Tenure: <span className="text-slate-500">N/A</span></div>
                      <div>Last Payment: <span className="text-slate-500">N/A</span></div>
                      <div>Reported Date: <b className="text-slate-800">15-06-2026</b></div>
                    </div>
                  </div>

                  {/* Delay Track column */}
                  <div>
                    <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                      DELAY TRACK
                    </span>
                    <div className="space-y-1 text-slate-600">
                      <div>Ownership Type: <b className="text-slate-800">Individual</b></div>
                      <div>Count of Delays: <b className="text-emerald-700">0</b></div>
                    </div>
                  </div>

                  {/* Resolution Details column */}
                  <div>
                    <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                      RESOLUTION DETAILS
                    </span>
                    <div className="space-y-1 text-slate-600">
                      <div>Written-Off Amt: <span className="text-slate-500">N/A</span></div>
                      <div>Settlement Amt: <span className="text-slate-500">N/A</span></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm mt-3">
      <div className="bg-[#002366] text-white px-3.5 py-2 flex items-center justify-between text-xs font-medium">
        <span className="flex items-center gap-2">
          <Fingerprint size={14} className="text-blue-300" />
          CRISP · CIBIL Credit Intelligence
        </span>
        <span className="text-[10px] text-blue-200 uppercase tracking-wider font-mono">Platform UI</span>
      </div>

      <div className="flex items-center justify-center border-b border-slate-100 bg-slate-50/80 px-4 py-2 gap-6 overflow-x-auto">
        {progressSteps.map((s, idx) => (
          <div key={s.num} className="flex items-center gap-2">
            <span
              className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                idx <= stepIndex
                  ? 'bg-[#002366] text-white shadow-2xs'
                  : 'bg-white text-slate-400 border border-slate-300'
              }`}
            >
              {s.num}
            </span>
            <span
              className={`text-xs ${
                idx <= stepIndex ? 'font-bold text-[#002366]' : 'text-slate-400'
              }`}
            >
              {s.label}
            </span>
            {idx < progressSteps.length - 1 && (
              <span className="w-8 h-px bg-slate-300 ml-2 hidden sm:block" />
            )}
          </div>
        ))}
      </div>

      <div className="p-3.5 bg-slate-50/40">{renderContent()}</div>
    </div>
  );
}

export default CibilScreenPreview;
