import { useState } from 'react';
import {
  Banknote,
  IndianRupee,
  CheckCircle2,
  ArrowRight,
  Save,
  AlertTriangle,
  Send,
  Building2,
  Check,
} from 'lucide-react';

export interface MoneyScreenPreviewProps {
  stepIndex: number;
}

export function MoneyScreenPreview({ stepIndex }: MoneyScreenPreviewProps) {
  // Step 1: Save money account selections state
  const [saveAccounts, setSaveAccounts] = useState([
    {
      id: 'acc-1',
      lender: 'HDFC Bank Ltd',
      accountNumber: '••••••••4819',
      type: 'Personal Loan',
      openedDate: '15 Jan 2022',
      balance: 345000,
      selected: true,
    },
    {
      id: 'acc-2',
      lender: 'ICICI Bank',
      accountNumber: '••••••••9021',
      type: 'Auto Loan',
      openedDate: '10 Aug 2023',
      balance: 185000,
      selected: false,
    },
    {
      id: 'acc-3',
      lender: 'Axis Bank',
      accountNumber: '••••••••1104',
      type: 'Credit Card',
      openedDate: '02 Mar 2024',
      balance: 42000,
      selected: false,
    },
  ]);

  // Step 2: Rectify money selections state
  const [rectifyAccounts, setRectifyAccounts] = useState([
    {
      id: 'rec-1',
      lender: 'State Bank of India',
      accountNumber: '••••••••3312',
      overdueAmount: 18500,
      dpd: 45,
      status: 'Delayed 45 DPD',
      selected: true,
    },
    {
      id: 'rec-2',
      lender: 'Kotak Mahindra Bank',
      accountNumber: '••••••••7721',
      overdueAmount: 6200,
      dpd: 30,
      status: 'Delayed 30 DPD',
      selected: false,
    },
  ]);

  // Step 3: Access money form state
  const [loanType, setLoanType] = useState('Business Loan');
  const [amount, setAmount] = useState('15,00,000');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const toggleSaveAccount = (id: string) => {
    setSaveAccounts((prev) =>
      prev.map((acc) => (acc.id === id ? { ...acc, selected: !acc.selected } : acc))
    );
  };

  const toggleRectifyAccount = (id: string) => {
    setRectifyAccounts((prev) =>
      prev.map((acc) => (acc.id === id ? { ...acc, selected: !acc.selected } : acc))
    );
  };

  const progressLabels = ['Service Hub', 'Save Money', 'Rectify Money', 'Access Money'];

  const renderContent = () => {
    // Step 0: Customer Service Report Overview / Money Tools
    if (stepIndex === 0) {
      return (
        <div className="space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <div className="text-xs font-bold text-slate-800">Anchor Customer Services</div>
              <div className="text-[11px] text-slate-500">M/S Zenith Enterprises · Cust ID: CUST-88210</div>
            </div>
            <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200">
              Active Assessment
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="p-2.5 rounded-xl border border-sky-100 bg-sky-50/40">
              <div className="flex items-center gap-1 text-[11px] font-bold text-[#002366]">
                <Banknote size={12} />
                <span>Save Money</span>
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">3 eligible facilities</div>
              <div className="text-xs font-bold text-slate-900 mt-1">₹5,72,000</div>
              <div className="text-[9px] text-sky-700 font-medium mt-1">Save up to 3.5% ROI</div>
            </div>

            <div className="p-2.5 rounded-xl border border-amber-100 bg-amber-50/40">
              <div className="flex items-center gap-1 text-[11px] font-bold text-amber-800">
                <AlertTriangle size={12} />
                <span>Rectify Money</span>
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">2 overdue accounts</div>
              <div className="text-xs font-bold text-amber-700 mt-1">₹24,700</div>
              <div className="text-[9px] text-amber-700 font-medium mt-1">Avg 37.5 DPD delay</div>
            </div>

            <div className="p-2.5 rounded-xl border border-emerald-100 bg-emerald-50/40">
              <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-800">
                <IndianRupee size={12} />
                <span>Access Money</span>
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">Sanction Capacity</div>
              <div className="text-xs font-bold text-emerald-800 mt-1">₹25,00,000</div>
              <div className="text-[9px] text-emerald-700 font-medium mt-1">Ready for application</div>
            </div>
          </div>

          <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-slate-600">Select any tool above or proceed below to execute financial workflows.</span>
            <span className="font-semibold text-[#002366] flex items-center gap-1">
              Actions available <ArrowRight size={11} />
            </span>
          </div>
        </div>
      );
    }

    // Step 1: Save Money: Review & select accounts
    if (stepIndex === 1) {
      const totalSelectedBalance = saveAccounts
        .filter((a) => a.selected)
        .reduce((acc, curr) => acc + curr.balance, 0);

      return (
        <div className="space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <div className="text-xs font-bold text-slate-800">Save Money (Debt Consolidation / Takeover)</div>
              <div className="text-[11px] text-slate-500">Select accounts to initiate lower interest refinance</div>
            </div>
            <div className="text-right">
              <div className="text-[10px] text-slate-400">Total Selected</div>
              <div className="text-xs font-bold text-emerald-700">₹{totalSelectedBalance.toLocaleString('en-IN')}</div>
            </div>
          </div>

          <div className="space-y-1.5">
            {saveAccounts.map((account) => (
              <div
                key={account.id}
                onClick={() => toggleSaveAccount(account.id)}
                className={`flex items-center justify-between p-2.5 rounded-lg border text-xs cursor-pointer transition-colors ${
                  account.selected
                    ? 'border-emerald-300 bg-emerald-50/40 text-slate-900'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                      account.selected
                        ? 'bg-emerald-600 border-emerald-600 text-white'
                        : 'border-slate-300 bg-white'
                    }`}
                  >
                    {account.selected && <Check size={11} strokeWidth={3} />}
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900 text-xs flex items-center gap-1.5">
                      <Building2 size={12} className="text-slate-400" />
                      {account.lender}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {account.accountNumber} · Opened {account.openedDate} · {account.type}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-slate-800 text-xs">
                    ₹{account.balance.toLocaleString('en-IN')}
                  </div>
                  <span className="text-[9px] font-semibold text-emerald-700 bg-emerald-100/60 px-1.5 py-0.5 rounded">
                    Save ~2.8%
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] text-slate-500">
              {saveAccounts.filter((a) => a.selected).length} accounts selected
            </span>
            <button
              type="button"
              style={{
                height: '28px',
                minHeight: 'unset',
                padding: '2px 9px',
                lineHeight: '1',
                color: '#ffffff',
                backgroundColor: '#002366',
              }}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#002366] !text-white text-xs font-medium hover:bg-[#001b4e] transition-colors cursor-pointer"
            >
              <span className="inline-flex items-center gap-1.5" style={{ color: '#ffffff', fontSize: '11px', whiteSpace: 'nowrap' }}>
                <Save size={12} className="text-white" />
                <span>Submit Save Money Selections</span>
              </span>
            </button>
          </div>
        </div>
      );
    }

    // Step 2: Rectify Money: Review overdue accounts
    if (stepIndex === 2) {
      return (
        <div className="space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <div className="text-xs font-bold text-slate-800">Rectify Money (CIBIL Dispute / DPD Resolution)</div>
              <div className="text-[11px] text-slate-500">Select accounts showing delay to raise resolution with lenders</div>
            </div>
            <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-semibold">
              Action Required
            </span>
          </div>

          <div className="space-y-2">
            {rectifyAccounts.map((account) => (
              <div
                key={account.id}
                onClick={() => toggleRectifyAccount(account.id)}
                className={`p-2.5 rounded-lg border text-xs cursor-pointer transition-colors ${
                  account.selected
                    ? 'border-amber-300 bg-amber-50/40 text-slate-900'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                        account.selected
                          ? 'bg-amber-600 border-amber-600 text-white'
                          : 'border-slate-300 bg-white'
                      }`}
                    >
                      {account.selected && <Check size={11} strokeWidth={3} />}
                    </div>
                    <div>
                      <span className="font-semibold text-slate-900">{account.lender}</span>
                      <span className="text-[10px] text-slate-400 ml-2">{account.accountNumber}</span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-rose-600">
                    ₹{account.overdueAmount.toLocaleString('en-IN')} Overdue
                  </span>
                </div>

                <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-slate-100 text-[10px] text-slate-500">
                  <span className="flex items-center gap-1 text-amber-700 font-medium">
                    <AlertTriangle size={11} />
                    {account.status}
                  </span>
                  <span className="text-slate-400">Resolution SLA: ~7 business days</span>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] text-slate-500">
              {rectifyAccounts.filter((a) => a.selected).length} accounts selected for bureau rectification
            </span>
            <button
              type="button"
              style={{
                height: '28px',
                minHeight: 'unset',
                padding: '2px 9px',
                lineHeight: '1',
                color: '#ffffff',
                backgroundColor: '#d97706',
              }}
              className="inline-flex items-center gap-1.5 rounded-lg bg-amber-600 !text-white text-xs font-medium hover:bg-amber-700 transition-colors cursor-pointer"
            >
              <span className="inline-flex items-center gap-1.5" style={{ color: '#ffffff', fontSize: '11px', whiteSpace: 'nowrap' }}>
                <CheckCircle2 size={12} className="text-white" />
                <span>Submit Rectification Request</span>
              </span>
            </button>
          </div>
        </div>
      );
    }

    // Step 3: Access Money: Enter a loan request
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div>
            <div className="text-xs font-bold text-slate-800">Access Money (New Credit Facility)</div>
            <div className="text-[11px] text-slate-500">Directly submit sanctioned underwriting loan proposal</div>
          </div>
          <span className="text-[10px] bg-[#002366]/10 text-[#002366] px-2 py-0.5 rounded-full font-semibold">
            Anchor Express
          </span>
        </div>

        {isSubmitted ? (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
            <CheckCircle2 size={24} className="mx-auto text-emerald-600" />
            <div className="text-xs font-bold text-emerald-900">Loan Proposal Submitted Successfully!</div>
            <p className="text-[11px] text-emerald-700">
              Requested ₹{amount} for {loanType}. Underwriting docket dispatched to partner NBFCs.
            </p>
            <button
              onClick={() => setIsSubmitted(false)}
              className="text-[11px] font-semibold text-emerald-800 underline mt-1 inline-block"
            >
              Submit Another Request
            </button>
          </div>
        ) : (
          <div className="p-3 bg-slate-50/70 rounded-xl border border-slate-200 space-y-3">
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-700">Loan Facility Type</label>
              <select
                value={loanType}
                onChange={(e) => setLoanType(e.target.value)}
                className="w-full text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 font-medium focus:outline-none focus:ring-1 focus:ring-[#002366]"
              >
                <option value="Business Loan">Unsecured Business Loan</option>
                <option value="Working Capital">Working Capital / OD Facility</option>
                <option value="Invoice Discounting">Invoice Discounting / Factoring</option>
                <option value="Loan Against Property">Loan Against Property (LAP)</option>
                <option value="Equipment Finance">Equipment & Machinery Loan</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-700">Requested Amount (₹ INR)</label>
              <div className="relative">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 font-semibold text-xs">
                  ₹
                </span>
                <input
                  type="text"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="e.g. 15,00,000"
                  className="w-full text-xs pl-7 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-900 font-semibold focus:outline-none focus:ring-1 focus:ring-[#002366]"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[10px] text-slate-500">
                Pre-approved via GST + BSA algorithmic profile
              </span>
              <button
                type="button"
                onClick={() => setIsSubmitted(true)}
                style={{
                  height: '28px',
                  minHeight: 'unset',
                  padding: '2px 9px',
                  lineHeight: '1',
                  color: '#ffffff',
                  backgroundColor: '#002366',
                }}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#002366] !text-white text-xs font-semibold hover:bg-[#001b4e] transition-colors cursor-pointer"
              >
                <span className="inline-flex items-center gap-1.5" style={{ color: '#ffffff', fontSize: '11px', whiteSpace: 'nowrap' }}>
                  <Send size={12} className="text-white" />
                  <span>Submit Loan Request</span>
                </span>
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm mt-3">
      <div className="bg-slate-900 text-white px-3.5 py-2 flex items-center justify-between text-xs font-medium">
        <span className="flex items-center gap-2">
          <Banknote size={14} className="text-emerald-400" />
          Money Operations Hub
        </span>
        <span className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">Anchor Portal</span>
      </div>
      <div className="flex items-center border-b border-slate-100 bg-slate-50 px-3 py-1.5 overflow-x-auto gap-2">
        {progressLabels.map((label, idx) => (
          <span
            key={label}
            className={`text-[10px] font-medium whitespace-nowrap px-2 py-0.5 rounded-full flex items-center gap-1 ${
              idx === stepIndex
                ? 'bg-[#002366] text-white font-semibold'
                : 'text-slate-500 bg-white border border-slate-200'
            }`}
          >
            <span>{idx + 1}.</span> {label}
          </span>
        ))}
      </div>
      <div className="p-3.5">{renderContent()}</div>
    </div>
  );
}

export default MoneyScreenPreview;

