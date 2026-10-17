import { useState } from 'react';
import {
  FileChartColumnIncreasing,
  Download,
  Plus,
} from 'lucide-react';

export interface GstScreenPreviewProps {
  stepIndex: number;
}

export function GstScreenPreview({ stepIndex }: GstScreenPreviewProps) {
  // Step 1: GSTIN entry
  const [gstin, setGstin] = useState('27AABCS1429B1Z2');
  // Step 3: GST Portal username
  const [username, setUsername] = useState('sharma_trading');
  // Step 4: GSTR report active tab
  const [activeReportTab, setActiveReportTab] = useState<'overview' | 'suppliers' | 'monthly'>('overview');

  const progressSteps = [
    { num: 1, label: 'GSTIN' },
    { num: 2, label: 'Business & Date' },
    { num: 3, label: 'Authentication' },
    { num: 4, label: 'Analysis' },
  ];

  const renderContent = () => {
    // ══════════════════════════════════════════════════════════════════════════
    // STEP 0 / STEP 1: Enter GSTIN (Page 8 of PDF)
    // ══════════════════════════════════════════════════════════════════════════
    if (stepIndex === 0 || stepIndex === 1) {
      return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 max-w-md mx-auto space-y-4">
          <div>
            <h4 className="text-sm font-bold text-slate-900">Enter GSTIN</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Please provide your Goods and Services Tax Identification Number (GSTIN) to proceed.
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 block">
              GSTIN Number
            </label>
            <input
              type="text"
              value={gstin}
              onChange={(e) => setGstin(e.target.value.toUpperCase())}
              placeholder="e.g. 27AABCS1429B1Z2"
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs font-mono font-bold tracking-wider text-slate-900 uppercase focus:outline-none focus:ring-1 focus:ring-[#002366]"
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
            <span style={{ color: '#ffffff', fontSize: '12px', whiteSpace: 'nowrap' }}>Continue</span>
          </button>
        </div>
      );
    }

    // ══════════════════════════════════════════════════════════════════════════
    // STEP 2: View Your Business Details (Page 8 of PDF)
    // ══════════════════════════════════════════════════════════════════════════
    if (stepIndex === 2) {
      return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 max-w-lg mx-auto space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h4 className="text-sm font-bold text-slate-900">Business Details</h4>
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
              className="inline-flex items-center gap-1 text-[11px] font-semibold !text-white bg-[#002366] rounded-md hover:bg-[#001a4e] cursor-pointer shadow-2xs"
            >
              <span className="inline-flex items-center gap-1" style={{ color: '#ffffff', fontSize: '11px', whiteSpace: 'nowrap' }}>
                <Plus size={11} className="text-white" />
                <span>Add New</span>
              </span>
            </button>
          </div>

          {/* Exact inner card from Page 8 */}
          <div className="border border-slate-200 rounded-xl p-3 bg-slate-50/50 space-y-2.5 text-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-blue-100 text-[#002366] flex items-center justify-center font-bold text-[10px]">
                  ●
                </div>
                <div>
                  <strong className="text-xs font-bold text-slate-900">ABCDEF000012</strong>
                  <span className="text-[10px] text-slate-500 block">Sample Limited</span>
                </div>
              </div>
              <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold px-2 py-0.5 rounded-full">
                Active
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 border-t border-slate-200">
              <div>
                <span className="text-[9px] text-slate-400 uppercase tracking-wider block font-semibold">Legal Name</span>
                <span className="text-slate-800 font-medium">Sampler Limited</span>
              </div>
              <div>
                <span className="text-[9px] text-slate-400 uppercase tracking-wider block font-semibold">Trade Name</span>
                <span className="text-slate-800 font-medium">Sampler Limited</span>
              </div>
              <div>
                <span className="text-[9px] text-slate-400 uppercase tracking-wider block font-semibold">Center Jurisdiction</span>
                <span className="text-slate-700">State Jurisdiction</span>
              </div>
              <div>
                <span className="text-[9px] text-slate-400 uppercase tracking-wider block font-semibold">State</span>
                <span className="text-slate-700">Regular</span>
              </div>
              <div>
                <span className="text-[9px] text-slate-400 uppercase tracking-wider block font-semibold">Registration Date</span>
                <span className="text-slate-700 font-mono">13/01/2026</span>
              </div>
              <div>
                <span className="text-[9px] text-slate-400 uppercase tracking-wider block font-semibold">Entity</span>
                <span className="text-slate-700 font-medium">Public Limited Company</span>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // ══════════════════════════════════════════════════════════════════════════
    // STEP 3: Authentication (Page 8 of PDF)
    // ══════════════════════════════════════════════════════════════════════════
    if (stepIndex === 3) {
      return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 max-w-md mx-auto space-y-4">
          <div>
            <h4 className="text-sm font-bold text-slate-900">Authentication</h4>
            <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
              Please enter your username registered on the GST portal to trigger an OTP to your registered mobile number.
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 block">
              GST Portal Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter GST portal username"
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#002366]"
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
            <span style={{ color: '#ffffff', fontSize: '12px', whiteSpace: 'nowrap' }}>Generate OTP</span>
          </button>
        </div>
      );
    }

    // ══════════════════════════════════════════════════════════════════════════
    // STEP 4 / 5: View GST Reports (Page 8 of PDF)
    // ══════════════════════════════════════════════════════════════════════════
    return (
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden space-y-3 p-4">
        {/* Top action header from Page 8 */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 hover:text-slate-600 cursor-pointer text-xs">
              &lt;
            </span>
            <strong className="text-sm font-bold text-slate-900">GSTR Report</strong>
            <span className="text-[10px] text-slate-400 font-mono">
              Ref ID: 043a6097-f9b4-4daf-be2b-bb20d7c6fc3d
            </span>
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

        {/* 3 Tabs from Page 8 */}
        <div className="flex items-center gap-1.5 border-b border-slate-200 text-xs">
          <button
            type="button"
            onClick={() => setActiveReportTab('overview')}
            style={{
              height: '28px',
              minHeight: 'unset',
              padding: '2px 9px',
              lineHeight: '1',
            }}
            className={`font-bold transition-colors border-b-2 -mb-px inline-flex items-center justify-center cursor-pointer ${
              activeReportTab === 'overview'
                ? 'border-[#002366] text-[#002366]'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <span style={{ fontSize: '11px', whiteSpace: 'nowrap' }}>GSTR Overview</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveReportTab('suppliers')}
            style={{
              height: '28px',
              minHeight: 'unset',
              padding: '2px 9px',
              lineHeight: '1',
            }}
            className={`font-bold transition-colors border-b-2 -mb-px inline-flex items-center justify-center cursor-pointer ${
              activeReportTab === 'suppliers'
                ? 'border-[#002366] text-[#002366]'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <span style={{ fontSize: '11px', whiteSpace: 'nowrap' }}>Top Suppliers &amp; Customers</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveReportTab('monthly')}
            style={{
              height: '28px',
              minHeight: 'unset',
              padding: '2px 9px',
              lineHeight: '1',
            }}
            className={`font-bold transition-colors border-b-2 -mb-px inline-flex items-center justify-center cursor-pointer ${
              activeReportTab === 'monthly'
                ? 'border-[#002366] text-[#002366]'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <span style={{ fontSize: '11px', whiteSpace: 'nowrap' }}>Monthly Sales &amp; Purchase Summary</span>
          </button>
        </div>

        {/* Customer Profile Banner from Page 8 */}
        <div className="bg-[#002366] text-white rounded-lg p-3">
          <div className="text-[10px] font-bold uppercase tracking-wider text-blue-200 mb-2 border-b border-blue-400/30 pb-1 text-center">
            Customer Profile
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-center text-xs">
            <div>
              <span className="text-[9px] text-blue-200 uppercase tracking-wider block">Company Name</span>
              <strong className="text-white text-[11px]">NEW JANTA STORE</strong>
            </div>
            <div>
              <span className="text-[9px] text-blue-200 uppercase tracking-wider block">GSTIN</span>
              <span className="text-white font-mono text-[11px]">10AGYPA6010D1Z5</span>
            </div>
            <div>
              <span className="text-[9px] text-blue-200 uppercase tracking-wider block">PAN</span>
              <span className="text-white font-mono text-[11px]">AGYPA6010D</span>
            </div>
            <div>
              <span className="text-[9px] text-blue-200 uppercase tracking-wider block">State</span>
              <span className="text-white text-[11px]">Bihar</span>
            </div>
            <div>
              <span className="text-[9px] text-blue-200 uppercase tracking-wider block">Period From</span>
              <span className="text-white font-medium text-[11px]">Jan 2025</span>
            </div>
            <div>
              <span className="text-[9px] text-blue-200 uppercase tracking-wider block">Period To</span>
              <span className="text-white font-medium text-[11px]">Dec 2025</span>
            </div>
          </div>
        </div>

        {/* 2 Tables Grid from Page 8 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          {/* Left Table: Overview of GST Returns */}
          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <div className="bg-[#002366] text-white font-bold p-2 text-[11px] flex justify-between">
              <span>Overview of GST Returns</span>
              <span className="text-blue-200 font-normal">Taxable Value</span>
            </div>

            <table className="w-full text-left border-collapse text-[11px]">
              <tbody className="divide-y divide-slate-100">
                <tr className="bg-slate-100 font-bold text-slate-800">
                  <td colSpan={2} className="p-1.5 px-2">GSTR 1</td>
                </tr>
                <tr>
                  <td className="p-1.5 px-2 text-slate-700">Adjustments due to Amendments (D)</td>
                  <td className="p-1.5 px-2 text-right font-mono text-slate-900">0.00</td>
                </tr>
                <tr>
                  <td className="p-1.5 px-2 text-slate-700">Total Value of Debit Notes Issued (B)</td>
                  <td className="p-1.5 px-2 text-right font-mono text-slate-900">0.00</td>
                </tr>
                <tr>
                  <td className="p-1.5 px-2 text-slate-700">Total Value of Credit Notes Issued (C)</td>
                  <td className="p-1.5 px-2 text-right font-mono text-slate-900">560.02</td>
                </tr>
                <tr>
                  <td className="p-1.5 px-2 text-slate-700">Total Value of Sales (A)</td>
                  <td className="p-1.5 px-2 text-right font-mono text-slate-900">25879864.68</td>
                </tr>
                <tr className="bg-blue-50/50 font-bold text-slate-900">
                  <td className="p-1.5 px-2 text-[#002366]">Gross Sales (E=A+B-C+D)</td>
                  <td className="p-1.5 px-2 text-right font-mono text-[#002366]">25879304.66</td>
                </tr>

                <tr className="bg-slate-100 font-bold text-slate-800">
                  <td colSpan={2} className="p-1.5 px-2">GSTR 2</td>
                </tr>
                <tr>
                  <td className="p-1.5 px-2 text-slate-700">Total Value of Puchases (F)</td>
                  <td className="p-1.5 px-2 text-right font-mono text-slate-900">37911010.26</td>
                </tr>
                <tr>
                  <td className="p-1.5 px-2 text-slate-700">Total Value of Credit Notes Issued(H)</td>
                  <td className="p-1.5 px-2 text-right font-mono text-slate-900">1719691.02</td>
                </tr>
                <tr className="bg-blue-50/50 font-bold text-slate-900">
                  <td className="p-1.5 px-2 text-[#002366]">Gross Purchases (J=F-G+H+I)</td>
                  <td className="p-1.5 px-2 text-right font-mono text-[#002366]">39630701.28</td>
                </tr>
                <tr>
                  <td className="p-1.5 px-2 text-slate-700">Total Value of Debit Notes Issued (G)</td>
                  <td className="p-1.5 px-2 text-right font-mono text-slate-900">0.00</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Right Table: Comparison with GSTR 3B */}
          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <div className="bg-[#002366] text-white font-bold p-2 text-[11px] flex justify-between">
              <span>Comparison with GSTR 3B</span>
              <span className="text-blue-200 font-normal">Taxable Value</span>
            </div>

            <table className="w-full text-left border-collapse text-[11px]">
              <tbody className="divide-y divide-slate-100">
                <tr className="bg-[#002366]/90 text-white font-bold text-[10px]">
                  <td colSpan={2} className="p-1 px-2 uppercase">Total Outward Supply</td>
                </tr>
                <tr>
                  <td className="p-1.5 px-2 text-slate-700">% Variation</td>
                  <td className="p-1.5 px-2 text-right font-mono text-rose-600 font-bold">423.92</td>
                </tr>
                <tr>
                  <td className="p-1.5 px-2 text-slate-700">As per GSTR 1</td>
                  <td className="p-1.5 px-2 text-right font-mono text-slate-900">4394271.20</td>
                </tr>
                <tr>
                  <td className="p-1.5 px-2 text-slate-700">As per GSTR 3B</td>
                  <td className="p-1.5 px-2 text-right font-mono text-slate-900">23022472.24</td>
                </tr>

                <tr className="bg-[#002366]/90 text-white font-bold text-[10px]">
                  <td colSpan={2} className="p-1 px-2 uppercase">Export Value</td>
                </tr>
                <tr>
                  <td className="p-1.5 px-2 text-slate-700">% Variation</td>
                  <td className="p-1.5 px-2 text-right font-mono text-slate-900">0.00</td>
                </tr>
                <tr>
                  <td className="p-1.5 px-2 text-slate-700">As per GSTR 1</td>
                  <td className="p-1.5 px-2 text-right font-mono text-slate-900">0.00</td>
                </tr>
                <tr>
                  <td className="p-1.5 px-2 text-slate-700">As per GSTR 3B</td>
                  <td className="p-1.5 px-2 text-right font-mono text-slate-900">0.00</td>
                </tr>

                <tr className="bg-[#002366]/90 text-white font-bold text-[10px]">
                  <td colSpan={2} className="p-1 px-2 uppercase">NIL-Exempted-Non-Gst</td>
                </tr>
                <tr>
                  <td className="p-1.5 px-2 text-slate-700">% Variation</td>
                  <td className="p-1.5 px-2 text-right font-mono text-slate-900">0.00</td>
                </tr>
                <tr>
                  <td className="p-1.5 px-2 text-slate-700">As per GSTR 1</td>
                  <td className="p-1.5 px-2 text-right font-mono text-slate-900">1394965.60</td>
                </tr>
                <tr>
                  <td className="p-1.5 px-2 text-slate-700">As per GSTR 3B</td>
                  <td className="p-1.5 px-2 text-right font-mono text-slate-900">1394965.60</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm mt-3">
      {/* Platform Header */}
      <div className="bg-[#002366] text-white px-3.5 py-2 flex items-center justify-between text-xs font-medium">
        <span className="flex items-center gap-2">
          <FileChartColumnIncreasing size={14} className="text-blue-300" />
          CRISP · GST Intelligence
        </span>
        <span className="text-[10px] text-blue-200 uppercase tracking-wider font-mono">Platform UI</span>
      </div>

      {/* 4 Steps Progress Bar matching Page 8 */}
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

export default GstScreenPreview;
