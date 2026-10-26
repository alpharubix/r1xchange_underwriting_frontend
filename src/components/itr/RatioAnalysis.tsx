import React, { useMemo } from 'react';

export interface RatioSectionDef {
  sectionTitle: string;
  items: string[];
}

export const RATIO_SECTIONS: RatioSectionDef[] = [
  {
    sectionTitle: 'Liquidity Analysis',
    items: [
      'Current Ratio',
      'Cash Ratio',
      'Quick Ratio',
      'Net Working Capital to Total Assets',
    ],
  },
  {
    sectionTitle: 'Asset Management',
    items: [
      'Inventory Turnover',
      'Inventory Turnover (in days)',
      'Trade Receivables Turnover Ratio',
      'Trade Receivables Turnover (in days)',
      'Trade Payables Turnover Ratio',
      'Trade Payables Turnover (in days)',
      'Cash Conversion (in days)',
      'Net Working Capital Turnover Ratio',
      'Fixed Assets Turnover Ratio',
      'Total Assets Turnover Ratio',
    ],
  },
  {
    sectionTitle: 'Leverage Ratios',
    items: [
      'Debt Ratio',
      'Debt Equity Ratio',
      'Free Reserves/Equity Ratio',
      'Total Outside Liability/Total Net Worth',
      'Debt/EBITDA',
    ],
  },
  {
    sectionTitle: 'Coverage Ratios',
    items: [
      'Interest Coverage Ratio',
      'Cash Interest Coverage Ratio',
    ],
  },
  {
    sectionTitle: 'Profitability Ratios',
    items: [
      'Operating Profit Margin',
      'Net Profit Margin',
      'EBIDTA Margin',
      'Return on Assets',
      'Return on Equity',
      'Gross Cash Accrual Margin',
      'Operating Cashflow Margin',
      'Return on Capital Employed',
    ],
  },
  {
    sectionTitle: 'Growth in Cashflow Margin',
    items: [
      'Growth in Operating Cashflow Margin',
      'Growth in Debt/Equity',
      'Gross Cash Accruals',
      'Profit after Tax Growth',
      'Sales Growth',
    ],
  },
];

// Key normalizer for flexible backend matching
const normalizeKey = (str: string): string =>
  str
    .toLowerCase()
    .replace(/>/g, 'gt')
    .replace(/</g, 'lt')
    .replace(/[^a-z0-9]/g, '');

const extractRowValue = (yearData: any, itemName: string) => {
  if (!yearData) return '';

  // Exact match
  if (yearData[itemName] !== undefined && yearData[itemName] !== null) {
    return yearData[itemName];
  }

  // Case-insensitive match
  const lowerItem = itemName.trim().toLowerCase();
  for (const k of Object.keys(yearData)) {
    if (k.trim().toLowerCase() === lowerItem) {
      return yearData[k];
    }
  }

  // Normalized alphanumeric match
  const normTarget = normalizeKey(itemName);
  for (const k of Object.keys(yearData)) {
    if (k === 'Year') continue;
    if (normalizeKey(k) === normTarget) {
      return yearData[k];
    }
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

const isValueNegative = (val: any) => {
  if (typeof val === 'number') return val < 0;
  if (typeof val === 'string') return val.trim().startsWith('-');
  return false;
};

interface RatioAnalysisTableProps {
  ratioAnalysis: Record<string, any[]>;
  title?: string;
}

export default function RatioAnalysisTable({
  ratioAnalysis,
  title = 'Ratios',
}: RatioAnalysisTableProps) {
  // Extract all unique financial years from all sections
  const years = useMemo(() => {
    if (!ratioAnalysis) return [];
    const allYears = Object.values(ratioAnalysis)
      .filter(Array.isArray)
      .flatMap((sectionRows) => sectionRows.map((d: any) => d.Year))
      .filter(Boolean);

    return Array.from(new Set(allYears)).sort() as string[];
  }, [ratioAnalysis]);

  if (!ratioAnalysis || Object.keys(ratioAnalysis).length === 0) return null;

  return (
    <div className="mb-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300">
      {/* Main Top Header matching screenshot */}
      <div className="bg-[#002366] px-5 py-3.5 text-center text-white">
        <h3 className="text-base sm:text-lg font-bold tracking-wide">{title}</h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-xs sm:text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
              <th className="border border-slate-200 px-4 py-2.5 text-left font-bold text-slate-800 min-w-[280px]">
                Particulars
              </th>
              {years.map((y) => (
                <th
                  key={y}
                  className="min-w-[130px] border border-slate-200 px-4 py-2.5 text-right font-bold text-slate-800 whitespace-nowrap"
                >
                  {String(y).replace(/,/g, '')}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {RATIO_SECTIONS.map((section) => {
              // Locate section data from backend
              const sectionData =
                ratioAnalysis[section.sectionTitle] ||
                ratioAnalysis[
                  Object.keys(ratioAnalysis).find(
                    (k) => normalizeKey(k) === normalizeKey(section.sectionTitle)
                  ) || ''
                ] ||
                [];

              return (
                <React.Fragment key={section.sectionTitle}>
                  {/* Dark Gray Section Header Bar */}
                  <tr className="bg-[#002366] text-white">
                    <td
                      colSpan={years.length + 1}
                      className="border border-slate-400/30 px-4 py-2 text-center font-bold tracking-wide text-xs sm:text-sm"
                    >
                      {section.sectionTitle}
                    </td>
                  </tr>

                  {/* Individual Ratio Rows */}
                  {section.items.map((itemName) => (
                    <tr
                      key={itemName}
                      className="bg-white hover:bg-slate-50/80 text-slate-700 transition-colors duration-150"
                    >
                      <td className="border border-slate-200 px-4 py-2 text-slate-800 font-medium">
                        {itemName}
                      </td>

                      {/* Year values */}
                      {years.map((y) => {
                        const yearData = sectionData.find((d: any) => d.Year === y);
                        const rawVal = extractRowValue(yearData, itemName);
                        const isNeg = isValueNegative(rawVal);
                        const formatted = formatValue(rawVal);

                        return (
                          <td
                            key={y}
                            className={`border border-slate-200 px-4 py-2 text-right tabular-nums whitespace-nowrap ${
                              isNeg
                                ? 'font-semibold text-rose-600'
                                : 'font-medium text-slate-800'
                            }`}
                          >
                            {formatted}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
