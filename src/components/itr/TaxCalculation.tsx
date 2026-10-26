import { useMemo } from 'react';


export interface TaxCalculationRowDef {
  name: string;
  code: string;
  isTotal?: boolean;
}

export const HEADS_OF_INCOME_ITEMS: TaxCalculationRowDef[] = [
  { name: 'Income from Salary', code: '(A)' },
  { name: 'Income under House Property', code: '(B)' },
  { name: 'Profits and Gains from Business and Profession', code: '(C)' },
  { name: 'Income from Short Term Capital Gains as per Applicable Rates', code: '(D)' },
  { name: 'Income from Long Term Capital Gains as per Applicable Rates', code: '(E)' },
  { name: 'Income from Other Sources', code: '(F)' },
  { name: 'Total of Head-Wise Income', code: '(G=A+B+C+D+E+F)', isTotal: true },
  { name: 'Total Losses of Current Year and Brought Forward Losses Set Off', code: '(H)' },
  { name: 'Gross Total Income', code: '(I=G-H)', isTotal: true },
  { name: 'Total Deductions under Chapter VI-A', code: '(J)' },
  { name: 'Deductions under Section 10AA', code: '(K)' },
  { name: 'Income not Forming Part of Total Income (Section 10AA, 10(23FB), 10(23FC))', code: '(L)' },
  { name: 'Total Taxable Income', code: '(M=I-J-K-L)', isTotal: true },
  { name: 'Income Chargeable to Tax at Special Rates', code: '(N)' },
  { name: 'Net Agricultural Income', code: '(O)' },
  { name: 'Aggregate Income', code: '(P)' },
  { name: 'Deemed Income under Section 115JC/115JB', code: '(Q)' },
];

export const TAX_LIABILITY_ITEMS: TaxCalculationRowDef[] = [
  { name: 'Total Tax Payable on Deemed Total Income', code: '(R)' },
  { name: 'Tax Payable on Total Income', code: '(S)' },
  { name: 'Rebate under Section 87A', code: '(T)' },
  { name: 'Tax Payable after Rebate', code: '(U=S-T)', isTotal: true },
  { name: 'Total Surcharge', code: '(V)' },
  { name: 'Health and Education Cess @4%', code: '(W=.04*(U+V))', isTotal: true },
  { name: 'Gross Tax Liability', code: '(X=U+V+W)', isTotal: true },
  { name: 'Gross Tax Payable', code: '(Y=HIGHER OF R OR X)', isTotal: true },
  { name: 'Credit under Section 115JD/115JAA', code: '(Z)' },
  { name: 'Tax Payable after Credit under Section 115JD/115JAA', code: '(AA=Y-Z)', isTotal: true },
  { name: 'Relief under Section 89', code: '(AB)' },
  { name: 'Total Tax Relief', code: '(AC)' },
  { name: 'Net Tax liability', code: '(AD=AA-AB-AC)', isTotal: true },
  { name: 'Total Tax, Interest and Fee Payable', code: '(AE)' },
  { name: 'Aggregate Liability', code: '(AF=AD+AE)', isTotal: true },
  { name: 'Total TDS', code: '(AG)' },
  { name: 'Total Advance and Self Assessment Tax', code: '(AH)' },
  { name: 'Total TCS', code: '(AI)' },
  { name: 'Total Taxes Paid', code: '(AJ=AG+AH+AI)', isTotal: true },
  { name: 'Amount Payable', code: '(AK=HIGHER OF (AF-AJ,0))', isTotal: true },
  { name: 'Refund if AD>Z', code: '(AL=AJ-AF)', isTotal: true },
];

// Helper to normalize keys for resilient backend matching
const normalizeKey = (str: string): string =>
  str
    .toLowerCase()
    .replace(/>/g, 'gt')
    .replace(/</g, 'lt')
    .replace(/[^a-z0-9]/g, '');

const extractRowValue = (yearData: any, itemName: string) => {
  if (!yearData) return '';
  if (yearData[itemName] !== undefined && yearData[itemName] !== null) {
    return yearData[itemName];
  }

  const lower = itemName.trim().toLowerCase();
  for (const k of Object.keys(yearData)) {
    if (k.trim().toLowerCase() === lower) return yearData[k];
  }

  const normTarget = normalizeKey(itemName);
  for (const k of Object.keys(yearData)) {
    if (k === 'Year') continue;
    if (normalizeKey(k) === normTarget) return yearData[k];
  }
  return '';
};

const formatValue = (val: any) => {
  if (val === '' || val === null || val === undefined) return '-';
  const num = Number(val);
  if (!isNaN(num)) {
    return num.toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }
  return String(val);
};

const formatYear = (val: any) => {
  if (val === null || val === undefined || val === '') return '-';
  return String(val).replace(/,/g, '').trim();
};

const isValueNegative = (val: any) => {
  if (typeof val === 'number') return val < 0;
  if (typeof val === 'string') return val.trim().startsWith('-');
  return false;
};

interface TaxCalculationTableProps {
  taxCalculationData: {
    'Tax Calculation'?: any[];
    'Computation of Tax Liability on Total Income'?: any[];
    'Tax Deducted At Source'?: Record<string, any[]>;
    'Tax Deducted at Source'?: Record<string, any[]>;
    'Tax Collected at Source'?: any[];
    [key: string]: any;
  };
}

export default function TaxCalculationTable({ taxCalculationData }: TaxCalculationTableProps) {
  const headsData = taxCalculationData['Tax Calculation'] || [];
  const liabilityData = taxCalculationData['Computation of Tax Liability on Total Income'] || [];
  const tdsObj =
    taxCalculationData['Tax Deducted At Source'] ||
    taxCalculationData['Tax Deducted at Source'] ||
    {};
  const tcsArray = taxCalculationData['Tax Collected at Source'] || [];

  // Extract years across both calculation tables
  const years = useMemo(() => {
    const combined = [...headsData, ...liabilityData];
    if (combined.length === 0) return [];
    return Array.from(new Set(combined.map((d: any) => d.Year)))
      .filter(Boolean)
      .sort() as string[];
  }, [headsData, liabilityData]);

  const renderCalculationRows = (items: TaxCalculationRowDef[], sourceData: any[]) => {
    return items.map((row) => {
      const isTotal = !!row.isTotal;

      return (
        <tr
          key={row.code}
          className={`transition-colors duration-150 ${
            isTotal
              ? 'bg-slate-100 font-bold text-black border-y border-slate-300'
              : 'bg-white hover:bg-slate-50/80 text-slate-700'
          }`}
        >
          {/* Particulars with formula/letter code */}
          <td className={`border border-slate-200 px-4 py-2 ${isTotal ? 'font-bold text-black' : 'font-normal text-slate-800'}`}>
            <div className="flex items-center justify-between gap-3">
              <span>{row.name}</span>
              <span className={`font-mono text-sm ${isTotal ? 'font-bold text-black' : 'text-slate-500'}`}>
                {row.code}
              </span>
            </div>
          </td>

          {/* Yearly Values */}
          {years.map((y) => {
            const yearData = sourceData.find((d: any) => d.Year === y);
            const rawVal = extractRowValue(yearData, row.name);
            const isNeg = isValueNegative(rawVal);
            const formatted = formatValue(rawVal);

            return (
              <td
                key={y}
                className={`border border-slate-200 px-4 py-2 text-right tabular-nums whitespace-nowrap ${
                  isTotal
                    ? 'font-bold text-black bg-slate-100/50'
                    : isNeg
                    ? 'font-semibold text-rose-600'
                    : 'font-medium text-slate-800'
                }`}
              >
                {formatted}
              </td>
            );
          })}
        </tr>
      );
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* 1. Main Tax Calculation Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="bg-[#002366] px-5 py-3.5 text-center text-white">
          <h3 className="text-base sm:text-lg font-bold tracking-wide">Tax Calculation</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
                <th className="border border-slate-200 px-4 py-2.5 text-left font-bold text-slate-800 min-w-[320px]">
                  Particulars
                </th>
                {years.map((y) => (
                  <th
                    key={y}
                    className="min-w-[130px] border border-slate-200 px-4 py-2.5 text-right font-bold text-slate-800 whitespace-nowrap"
                  >
                    {formatYear(y)}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {/* Part 1: Heads of Income */}
              {renderCalculationRows(HEADS_OF_INCOME_ITEMS, headsData)}

              {/* Section Header Bar */}
              <tr className="bg-[#0f126b] text-white">
                <td
                  colSpan={years.length + 1}
                  className="border border-slate-400/30 px-4 py-2 text-center font-bold tracking-wide text-xs sm:text-sm"
                >
                  Computation of Tax Liability on Total Income
                </td>
              </tr>

              {/* Part 2: Computation of Tax Liability */}
              {renderCalculationRows(TAX_LIABILITY_ITEMS, liabilityData)}
            </tbody>
          </table>
        </div>
      </div>

      {/* 2. Tax Deducted at Source (TDS) Section */}
      {Object.keys(tdsObj).length > 0 && (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="bg-[#e67e22] px-5 py-3 text-center text-white font-bold text-base sm:text-lg tracking-wide">
            Tax Deducted at Source
          </div>

          <div className="p-4 space-y-6">
            {Object.entries(tdsObj).map(([subTitle, items]) => {
              if (!Array.isArray(items) || items.length === 0) return null;
              const allKeys = Array.from(new Set(items.flatMap((d: any) => Object.keys(d))));

              return (
                <div key={subTitle} className="overflow-hidden rounded-xl border border-slate-200">
                  <div className="bg-[#002366] px-4 py-2 text-center font-bold text-white text-xs sm:text-sm">
                    {subTitle}
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-xs sm:text-sm">
                      <thead className="bg-[#002366] text-white">
                        <tr>
                          {allKeys.map((k) => (
                            <th key={k} className="border border-blue-900/40 px-4 py-2.5 text-left font-semibold">
                              {k}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {items.map((rowItem, idx) => (
                          <tr key={idx} className="hover:bg-slate-50 border-b border-slate-200 text-slate-700">
                            {allKeys.map((k) => {
                              const isYear = k.toLowerCase().includes('year');
                              const val = rowItem[k];
                              const isAmount = !isYear && (k.toLowerCase().includes('tds') || typeof val === 'number');
                              return (
                                <td
                                  key={k}
                                  className={`border border-slate-200 px-4 py-2 ${
                                    isAmount ? 'text-right tabular-nums font-medium text-slate-900' : 'text-left'
                                  }`}
                                >
                                  {isYear ? formatYear(val) : isAmount ? formatValue(val) : val || '-'}
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. Tax Collected at Source (TCS) Section */}
      {Array.isArray(tcsArray) && tcsArray.length > 0 && (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="bg-[#e67e22] px-5 py-3 text-center text-white font-bold text-base sm:text-lg tracking-wide">
            Tax Collected at Source
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-xs sm:text-sm">
              <thead className="bg-[#002366] text-white">
                <tr>
                  <th className="border border-blue-900/40 px-4 py-2.5 text-left font-semibold">Year</th>
                  <th className="border border-blue-900/40 px-4 py-2.5 text-left font-semibold">
                    Tax Collection Account Number
                  </th>
                  <th className="border border-blue-900/40 px-4 py-2.5 text-left font-semibold">
                    Name of Collector
                  </th>
                  <th className="border border-blue-900/40 px-4 py-2.5 text-right font-semibold">TCS</th>
                </tr>
              </thead>
              <tbody>
                {tcsArray.map((rowItem: any, idx: number) => (
                  <tr key={idx} className="hover:bg-slate-50 border-b border-slate-200 text-slate-700">
                    <td className="border border-slate-200 px-4 py-2">{formatYear(rowItem['Year'])}</td>
                    <td className="border border-slate-200 px-4 py-2 font-mono">
                      {rowItem['Tax Collection Account Number'] || '-'}
                    </td>
                    <td className="border border-slate-200 px-4 py-2">{rowItem['Name of Collector'] || '-'}</td>
                    <td className="border border-slate-200 px-4 py-2 text-right font-medium text-slate-900 tabular-nums">
                      {formatValue(rowItem['TCS'])}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
