import { useState } from 'react';
import {
  Clock,
  Download,
} from 'lucide-react';

export interface ItrScreenPreviewProps {
  stepIndex: number;
}

export function ItrScreenPreview({ stepIndex }: ItrScreenPreviewProps) {
  const [email, setEmail] = useState('ashok.m@r1xchange.com');
  const [activeItrTab, setActiveItrTab] = useState<
    'taxCalc' | 'balanceSheet' | 'pnl' | 'ratio'
  >('taxCalc');

  const renderContent = () => {
    // ══════════════════════════════════════════════════════════════════════════
    // STEP 0 / 1 / 2: Income Tax Return Link Generation (Page 9 of PDF)
    // ══════════════════════════════════════════════════════════════════════════
    if (stepIndex === 0 || stepIndex === 1 || stepIndex === 2) {
      return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 max-w-md mx-auto space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#002366] flex items-center justify-center shrink-0">
              <Clock size={18} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Income Tax Return</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Fetch and analyze your ITR data securely
              </p>
            </div>
          </div>

          <div className="space-y-1.5 pt-2">
            <label className="text-xs font-semibold text-slate-700 block">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#002366]"
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
            className="w-full bg-[#002366] !text-white text-xs font-bold rounded-lg hover:bg-[#001a4e] transition-colors shadow-2xs flex items-center justify-center cursor-pointer"
          >
            <span style={{ color: '#ffffff', fontSize: '12px', whiteSpace: 'nowrap' }}>
              Generate Link
            </span>
          </button>

          <p className="text-[10px] text-slate-400 text-center pt-1 leading-relaxed">
            Enter your email address and complete the verification. Once the email address is verified, the required reports will be generated automatically.
          </p>
        </div>
      );
    }

    // ══════════════════════════════════════════════════════════════════════════
    // STEP 3 / 4 / 5: 4 Financial Statements & Customer Profile (Page 9 of PDF)
    // ══════════════════════════════════════════════════════════════════════════
    return (
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden space-y-3 p-4">
        {/* 4 Report Tabs from Page 9 */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-1.5 text-xs overflow-x-auto">
            <button
              type="button"
              onClick={() => setActiveItrTab('taxCalc')}
              style={{
                backgroundColor: activeItrTab === 'taxCalc' ? '#002366' : '#f1f5f9',
                color: activeItrTab === 'taxCalc' ? '#ffffff' : '#334155',
                height: '28px',
                minHeight: 'unset',
                padding: '2px 9px',
                lineHeight: '1',
              }}
              className={`inline-flex items-center justify-center rounded-md font-semibold transition-all cursor-pointer whitespace-nowrap ${
                activeItrTab === 'taxCalc'
                  ? 'bg-[#002366] !text-white shadow-2xs'
                  : 'text-slate-600 bg-slate-100 hover:bg-slate-200'
              }`}
            >
              <span
                style={{
                  color: activeItrTab === 'taxCalc' ? '#ffffff' : '#334155',
                  fontSize: '11px',
                  lineHeight: '1',
                  whiteSpace: 'nowrap',
                }}
                className={activeItrTab === 'taxCalc' ? '!text-white font-bold' : 'font-medium'}
              >
                Tax Calculation
              </span>
            </button>
            <button
              type="button"
              onClick={() => setActiveItrTab('balanceSheet')}
              style={{
                backgroundColor: activeItrTab === 'balanceSheet' ? '#002366' : '#f1f5f9',
                color: activeItrTab === 'balanceSheet' ? '#ffffff' : '#334155',
                height: '28px',
                minHeight: 'unset',
                padding: '2px 9px',
                lineHeight: '1',
              }}
              className={`inline-flex items-center justify-center rounded-md font-semibold transition-all cursor-pointer whitespace-nowrap ${
                activeItrTab === 'balanceSheet'
                  ? 'bg-[#002366] !text-white shadow-2xs'
                  : 'text-slate-600 bg-slate-100 hover:bg-slate-200'
              }`}
            >
              <span
                style={{
                  color: activeItrTab === 'balanceSheet' ? '#ffffff' : '#334155',
                  fontSize: '11px',
                  lineHeight: '1',
                  whiteSpace: 'nowrap',
                }}
                className={activeItrTab === 'balanceSheet' ? '!text-white font-bold' : 'font-medium'}
              >
                Balance Sheet
              </span>
            </button>
            <button
              type="button"
              onClick={() => setActiveItrTab('pnl')}
              style={{
                backgroundColor: activeItrTab === 'pnl' ? '#002366' : '#f1f5f9',
                color: activeItrTab === 'pnl' ? '#ffffff' : '#334155',
                height: '28px',
                minHeight: 'unset',
                padding: '2px 9px',
                lineHeight: '1',
              }}
              className={`inline-flex items-center justify-center rounded-md font-semibold transition-all cursor-pointer whitespace-nowrap ${
                activeItrTab === 'pnl'
                  ? 'bg-[#002366] !text-white shadow-2xs'
                  : 'text-slate-600 bg-slate-100 hover:bg-slate-200'
              }`}
            >
              <span
                style={{
                  color: activeItrTab === 'pnl' ? '#ffffff' : '#334155',
                  fontSize: '11px',
                  lineHeight: '1',
                  whiteSpace: 'nowrap',
                }}
                className={activeItrTab === 'pnl' ? '!text-white font-bold' : 'font-medium'}
              >
                Profit &amp; Loss
              </span>
            </button>
            <button
              type="button"
              onClick={() => setActiveItrTab('ratio')}
              style={{
                backgroundColor: activeItrTab === 'ratio' ? '#002366' : '#f1f5f9',
                color: activeItrTab === 'ratio' ? '#ffffff' : '#334155',
                height: '28px',
                minHeight: 'unset',
                padding: '2px 9px',
                lineHeight: '1',
              }}
              className={`inline-flex items-center justify-center rounded-md font-semibold transition-all cursor-pointer whitespace-nowrap ${
                activeItrTab === 'ratio'
                  ? 'bg-[#002366] !text-white shadow-2xs'
                  : 'text-slate-600 bg-slate-100 hover:bg-slate-200'
              }`}
            >
              <span
                style={{
                  color: activeItrTab === 'ratio' ? '#ffffff' : '#334155',
                  fontSize: '11px',
                  lineHeight: '1',
                  whiteSpace: 'nowrap',
                }}
                className={activeItrTab === 'ratio' ? '!text-white font-bold' : 'font-medium'}
              >
                Ratio Analysis
              </span>
            </button>
          </div>

          <button
            type="button"
            style={{
              color: '#ffffff',
              backgroundColor: '#002366',
              height: '28px',
              minHeight: 'unset',
              padding: '2px 9px',
              lineHeight: '1',
            }}
            className="inline-flex items-center gap-1.5 bg-[#002366] !text-white text-xs font-semibold rounded-md hover:bg-[#001a4e] cursor-pointer whitespace-nowrap shadow-2xs"
          >
            <span className="inline-flex items-center gap-1" style={{ color: '#ffffff', fontSize: '11px', whiteSpace: 'nowrap' }}>
              <Download size={11} className="text-white" />
              <span>Export</span>
            </span>
          </button>
        </div>

        {/* Customer Profile Banner from Page 9 */}
        <div className="bg-[#002366] text-white rounded-lg p-3">
          <div className="text-[10px] font-bold uppercase tracking-wider text-blue-200 mb-2 border-b border-blue-400/30 pb-1 text-center">
            Customer Profile
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
            <div>
              <span className="text-[9px] text-blue-200 uppercase tracking-wider block">Company Name</span>
              <strong className="text-white text-[11px]">MILKLANE DAIRY SERVICES PRIVATE LIMITED</strong>
            </div>
            <div>
              <span className="text-[9px] text-blue-200 uppercase tracking-wider block">GSTIN</span>
              <span className="text-white font-mono text-[11px]">29AAJCM9815D1Z6</span>
            </div>
            <div>
              <span className="text-[9px] text-blue-200 uppercase tracking-wider block">Phone Number</span>
              <span className="text-white font-mono text-[11px]">919901444775</span>
            </div>
            <div>
              <span className="text-[9px] text-blue-200 uppercase tracking-wider block">PAN</span>
              <span className="text-white font-mono text-[11px]">AAJCM9815D</span>
            </div>
          </div>
        </div>

        {/* ─── TAB 1: Tax Calculation Table from Page 9 ─────────────────────────── */}
        {activeItrTab === 'taxCalc' && (
          <div className="border border-slate-200 rounded-lg overflow-hidden text-xs">
            <div className="bg-[#002366] text-white font-bold p-2 text-center text-[11px]">
              Tax Calculation
            </div>
            <table className="w-full text-left border-collapse text-[11px]">
              <thead>
                <tr className="bg-slate-100 font-semibold text-slate-700 border-b border-slate-200">
                  <th className="p-2 border-r border-slate-200">Particulars</th>
                  <th className="p-2 border-r border-slate-200 text-right w-32">2024</th>
                  <th className="p-2 text-right w-32">2025</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                <tr>
                  <td className="p-2 font-medium">Income under House Property</td>
                  <td className="p-2 text-right font-mono text-slate-400">-</td>
                  <td className="p-2 text-right font-mono text-slate-400">-</td>
                </tr>
                <tr>
                  <td className="p-2 font-medium">Income from Salary</td>
                  <td className="p-2 text-right font-mono text-slate-400">-</td>
                  <td className="p-2 text-right font-mono text-slate-400">-</td>
                </tr>
                <tr>
                  <td className="p-2 font-medium">Deductions under Section 10AA</td>
                  <td className="p-2 text-right font-mono text-slate-400">-</td>
                  <td className="p-2 text-right font-mono text-slate-400">-</td>
                </tr>
                <tr className="bg-blue-50/40">
                  <td className="p-2 font-semibold text-slate-900">Income from Other Sources</td>
                  <td className="p-2 text-right font-mono font-bold text-[#002366]">62,07,785.00</td>
                  <td className="p-2 text-right font-mono font-bold text-[#002366]">2,73,099.00</td>
                </tr>
                <tr>
                  <td className="p-2 font-medium">Aggregate Income</td>
                  <td className="p-2 text-right font-mono text-slate-400">-</td>
                  <td className="p-2 text-right font-mono text-slate-400">-</td>
                </tr>
                <tr>
                  <td className="p-2 font-medium">Income from Long Term Capital Gains as per applicable rates</td>
                  <td className="p-2 text-right font-mono text-slate-400">-</td>
                  <td className="p-2 text-right font-mono text-slate-400">-</td>
                </tr>
                <tr>
                  <td className="p-2 font-medium">Total Taxable Income</td>
                  <td className="p-2 text-right font-mono text-slate-400">-</td>
                  <td className="p-2 text-right font-mono text-slate-400">-</td>
                </tr>
                <tr className="bg-slate-50 font-semibold text-slate-900">
                  <td className="p-2">Gross Total Income</td>
                  <td className="p-2 text-right font-mono text-slate-400">-</td>
                  <td className="p-2 text-right font-mono text-slate-400">-</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* ─── TAB 2: Balance Sheet ─────────────────────────────────────────────── */}
        {activeItrTab === 'balanceSheet' && (
          <div className="border border-slate-200 rounded-lg overflow-hidden text-xs">
            <div className="bg-[#002366] text-white font-bold p-2 text-center text-[11px]">
              Balance Sheet
            </div>
            <table className="w-full text-left border-collapse text-[11px]">
              <thead>
                <tr className="bg-slate-100 font-semibold text-slate-700 border-b border-slate-200">
                  <th className="p-2 border-r border-slate-200">Liabilities &amp; Equity</th>
                  <th className="p-2 text-right w-32 border-r border-slate-200">2024 (₹)</th>
                  <th className="p-2 text-right w-32">2025 (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                <tr>
                  <td className="p-2 font-medium">Share Capital</td>
                  <td className="p-2 text-right font-mono">10,00,000</td>
                  <td className="p-2 text-right font-mono">10,00,000</td>
                </tr>
                <tr>
                  <td className="p-2 font-medium">Reserves &amp; Surplus</td>
                  <td className="p-2 text-right font-mono">48,22,400</td>
                  <td className="p-2 text-right font-mono">65,14,200</td>
                </tr>
                <tr>
                  <td className="p-2 font-medium">Long Term Borrowings</td>
                  <td className="p-2 text-right font-mono">25,00,000</td>
                  <td className="p-2 text-right font-mono">18,50,000</td>
                </tr>
                <tr className="bg-slate-50 font-bold text-slate-900">
                  <td className="p-2">Total Liabilities</td>
                  <td className="p-2 text-right font-mono text-[#002366]">83,22,400</td>
                  <td className="p-2 text-right font-mono text-[#002366]">93,64,200</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* ─── TAB 3: Profit & Loss ─────────────────────────────────────────────── */}
        {activeItrTab === 'pnl' && (
          <div className="border border-slate-200 rounded-lg overflow-hidden text-xs">
            <div className="bg-[#002366] text-white font-bold p-2 text-center text-[11px]">
              Profit &amp; Loss Statement
            </div>
            <table className="w-full text-left border-collapse text-[11px]">
              <thead>
                <tr className="bg-slate-100 font-semibold text-slate-700 border-b border-slate-200">
                  <th className="p-2 border-r border-slate-200">Particulars</th>
                  <th className="p-2 text-right w-32 border-r border-slate-200">2024 (₹)</th>
                  <th className="p-2 text-right w-32">2025 (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                <tr>
                  <td className="p-2 font-medium">Revenue from Operations</td>
                  <td className="p-2 text-right font-mono">1,84,50,000</td>
                  <td className="p-2 text-right font-mono">2,41,20,000</td>
                </tr>
                <tr>
                  <td className="p-2 font-medium">Cost of Materials Consumed</td>
                  <td className="p-2 text-right font-mono">1,12,00,000</td>
                  <td className="p-2 text-right font-mono">1,48,50,000</td>
                </tr>
                <tr className="bg-emerald-50/50 font-bold text-slate-900">
                  <td className="p-2 text-emerald-800">Net Profit Before Tax</td>
                  <td className="p-2 text-right font-mono text-emerald-800">24,30,000</td>
                  <td className="p-2 text-right font-mono text-emerald-800">32,80,000</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* ─── TAB 4: Ratio Analysis ────────────────────────────────────────────── */}
        {activeItrTab === 'ratio' && (
          <div className="border border-slate-200 rounded-lg overflow-hidden text-xs">
            <div className="bg-[#002366] text-white font-bold p-2 text-center text-[11px]">
              Ratio Analysis
            </div>
            <table className="w-full text-left border-collapse text-[11px]">
              <thead>
                <tr className="bg-slate-100 font-semibold text-slate-700 border-b border-slate-200">
                  <th className="p-2 border-r border-slate-200">Financial Ratio</th>
                  <th className="p-2 text-right w-32 border-r border-slate-200">2024</th>
                  <th className="p-2 text-right w-32">2025</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                <tr>
                  <td className="p-2 font-medium">Current Ratio (Liquidity)</td>
                  <td className="p-2 text-right font-mono font-bold text-[#002366]">1.85</td>
                  <td className="p-2 text-right font-mono font-bold text-[#002366]">2.10</td>
                </tr>
                <tr>
                  <td className="p-2 font-medium">Debt to Equity Ratio</td>
                  <td className="p-2 text-right font-mono">0.43</td>
                  <td className="p-2 text-right font-mono">0.25</td>
                </tr>
                <tr>
                  <td className="p-2 font-medium">Interest Coverage Ratio (ICR)</td>
                  <td className="p-2 text-right font-mono text-emerald-700 font-bold">5.4x</td>
                  <td className="p-2 text-right font-mono text-emerald-700 font-bold">6.8x</td>
                </tr>
                <tr>
                  <td className="p-2 font-medium">Net Profit Margin (%)</td>
                  <td className="p-2 text-right font-mono">13.17%</td>
                  <td className="p-2 text-right font-mono">13.60%</td>
                </tr>
              </tbody>
            </table>
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

export default ItrScreenPreview;
