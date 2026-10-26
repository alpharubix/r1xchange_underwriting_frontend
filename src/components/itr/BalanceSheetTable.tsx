import { useMemo } from 'react';

export interface BalanceSheetItemDef {
  id: number;
  name: string;
  section: 'Equity & Liabilities' | 'Assets';
  isTotal?: boolean;
}

export const EQUITY_LIABILITIES_ITEMS: BalanceSheetItemDef[] = [
  { id: 1, name: "Share Capital /Proprietor's Capital", section: 'Equity & Liabilities' },
  { id: 2, name: 'Total Reserves and Surplus', section: 'Equity & Liabilities' },
  { id: 3, name: 'Retained Earnings', section: 'Equity & Liabilities' },
  { id: 4, name: 'Money Received against Share Warrants', section: 'Equity & Liabilities' },
  { id: 5, name: "Shareholder's Funds / Proprietor's Funds", section: 'Equity & Liabilities', isTotal: true },
  { id: 6, name: 'Share Application Money Pending Allotment', section: 'Equity & Liabilities' },
  { id: 7, name: 'Long Term Borrowings in Bonds/Debentures', section: 'Equity & Liabilities',  },
  { id: 8, name: 'Long Term Borrowings in Term Loans', section: 'Equity & Liabilities',  },
  { id: 9, name: 'Long Term Liabilities from Related Parties', section: 'Equity & Liabilities',  },
  { id: 10, name: 'Secured Loan from Banks/Others', section: 'Equity & Liabilities', },
  { id: 11, name: 'Secured Foreign Currency Loans', section: 'Equity & Liabilities', },
  { id: 12, name: 'Unsecured Loan from Banks/Others', section: 'Equity & Liabilities', },
  { id: 13, name: 'Unsecured Foreign Currency Loans', section: 'Equity & Liabilities',  },
  { id: 14, name: 'Trade Payables (>6 Months)', section: 'Equity & Liabilities',  },
  { id: 15, name: 'Deferred Tax Liabilities', section: 'Equity & Liabilities',  },
  { id: 16, name: 'Long Term Provisions', section: 'Equity & Liabilities',  },
  { id: 17, name: 'Long Term Loans and Advances', section: 'Equity & Liabilities',  },
  { id: 18, name: 'Other Long Term Liabilities', section: 'Equity & Liabilities',  },
  { id: 19, name: 'Total Non-Current Liabilities', section: 'Equity & Liabilities', isTotal: true },
  { id: 20, name: 'Loans Repayable on Demand from Banks/Other Parties', section: 'Equity & Liabilities',  },
  { id: 21, name: 'Short Term Liabilities from Related Parties', section: 'Equity & Liabilities',  },
  { id: 22, name: 'Current Maturities of Long Term Debt', section: 'Equity & Liabilities',  },
  { id: 23, name: 'Deferred Tax Liability', section: 'Equity & Liabilities',  },
  { id: 24, name: 'Current Tax Liabilities', section: 'Equity & Liabilities',  },
  { id: 25, name: 'Trade Payables (<6 Months)', section: 'Equity & Liabilities',  },
  { id: 26, name: 'Short Term Loans and Advances', section: 'Equity & Liabilities',  },
  { id: 27, name: 'Short Term Provisions', section: 'Equity & Liabilities',  },
  { id: 28, name: 'Other Current Liabilities', section: 'Equity & Liabilities',  },
  { id: 29, name: 'Total Current Liabilities', section: 'Equity & Liabilities', isTotal: true },
  { id: 30, name: 'Total Liabilities', section: 'Equity & Liabilities', isTotal: true },
  { id: 31, name: 'Total Equity and Liabilities', section: 'Equity & Liabilities', isTotal: true },
];

export const ASSETS_ITEMS: BalanceSheetItemDef[] = [
  { id: 32, name: 'Tangible Assets - Gross', section: 'Assets' },
  { id: 33, name: 'Intangible Assets - Gross', section: 'Assets' },
  { id: 34, name: 'Capital Work in Progress', section: 'Assets' },
  { id: 35, name: 'Intangible Assets under Development', section: 'Assets' },
  { id: 36, name: 'Total Gross Block', section: 'Assets', isTotal: true },
  { id: 37, name: 'Depreciation and Amortization', section: 'Assets' },
  { id: 38, name: 'Impairment Losses', section: 'Assets' },
  { id: 39, name: 'Total Fixed Assets', section: 'Assets', isTotal: true },
  { id: 40, name: 'Non-Current Investments', section: 'Assets' },
  { id: 41, name: 'Trade Receivables (>6 Months)', section: 'Assets' },
  { id: 42, name: 'Deferred Tax Assets', section: 'Assets' },
  { id: 43, name: 'Long Term Loans and Advances', section: 'Assets' },
  { id: 44, name: 'Other Non-Current Assets', section: 'Assets' },
  { id: 45, name: 'Total Non-current Assets', section: 'Assets', isTotal: true },
  { id: 46, name: 'Current Investments', section: 'Assets' },
  { id: 47, name: 'Inventories', section: 'Assets' },
  { id: 48, name: 'Trade Receivables (<6 Months)', section: 'Assets' },
  { id: 49, name: 'Cash and Cash Equivalents', section: 'Assets' },
  { id: 50, name: 'Short Term Loans and Advances', section: 'Assets' },
  { id: 51, name: 'Current Tax Assets', section: 'Assets' },
  { id: 52, name: 'Other Current Assets', section: 'Assets' },
  { id: 53, name: 'Total Current Assets', section: 'Assets', isTotal: true },
  { id: 54, name: 'Total Assets', section: 'Assets', isTotal: true },
  { id: 55, name: 'Net Worth', section: 'Assets', isTotal: true },
];

// Helper to normalize strings for matching
const normalizeKey = (str: string): string =>
  str
    .toLowerCase()
    .replace(/>/g, 'gt')
    .replace(/</g, 'lt')
    .replace(/[^a-z0-9]/g, '');

const extractRowValue = (yearData: any, itemName: string) => {
  if (!yearData) return '';

  // 1. Exact match
  if (yearData[itemName] !== undefined && yearData[itemName] !== null) {
    return yearData[itemName];
  }

  // 2. Case-insensitive trimmed match
  const lowerItem = itemName.trim().toLowerCase();
  for (const k of Object.keys(yearData)) {
    if (k.trim().toLowerCase() === lowerItem) {
      return yearData[k];
    }
  }

  // 3. Normalized alphanumeric match
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

interface BalanceSheetSectionProps {
  title: string;
  items: BalanceSheetItemDef[];
  dataArray: any[];
}

export function BalanceSheetSectionTable({
  title,
  items,
  dataArray,
}: BalanceSheetSectionProps) {

  // Extract years from dataArray
  const years = useMemo(() => {
    if (!dataArray || dataArray.length === 0) return [];
    return Array.from(new Set(dataArray.map((d: any) => d.Year)))
      .filter(Boolean)
      .sort() as string[];
  }, [dataArray]);

  // Collect any extra unmapped keys from backend to guarantee zero data loss
  const unmappedRows = useMemo(() => {
    if (!dataArray || dataArray.length === 0) return [];
    const allBackendKeys = Array.from(
      new Set(dataArray.flatMap((d: any) => Object.keys(d)))
    ).filter((k) => k !== 'Year');

    const knownNormalized = new Set(items.map((i) => normalizeKey(i.name)));
    return allBackendKeys.filter((k) => !knownNormalized.has(normalizeKey(k)));
  }, [dataArray, items]);

  return (
    <div className="mb-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300">
      {/* Section Header */}
      <div className="bg-[#002366] px-5 py-3.5 text-white flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-base sm:text-lg font-bold tracking-wide">
          {title}
        </h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-xs sm:text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
              <th className="w-14 border border-slate-200 px-3 py-2.5 text-center font-bold text-slate-800">
                #
              </th>
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
            {items.map((row, index) => {
              const isTotal = !!row.isTotal;

              return (
                <tr
                  key={row.id}
                  className={`transition-colors duration-150 ${isTotal
                      ? 'bg-slate-100 font-bold text-black border-y border-slate-300'
                      : 'bg-white hover:bg-slate-50/80 text-slate-700'
                    }`}
                >
                  {/* Number column */}
                  <td
                    className={`border border-slate-200 px-2 py-2 text-center select-none ${isTotal ? 'font-bold text-black bg-slate-200/60' : 'text-slate-500 font-medium'
                      }`}
                  >
                    {index + 1}
                  </td>

                  {/* Particulars column */}
                  <td
                    className={`border border-slate-200 px-4 py-2 ${isTotal ? 'font-bold text-black' : 'font-normal text-slate-800'
                      }`}
                  >
                    <span>{row.name}</span>
                  </td>

                  {/* Year value columns */}
                  {years.map((y) => {
                    const yearData = dataArray.find((d: any) => d.Year === y);
                    const rawVal = extractRowValue(yearData, row.name);
                    const isNeg = isValueNegative(rawVal);
                    const formatted = formatValue(rawVal);

                    return (
                      <td
                        key={y}
                        className={`border border-slate-200 px-4 py-2 text-right tabular-nums whitespace-nowrap ${isTotal
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
            })}

            {/* Extra rows from backend that didn't match standard 1-55 list */}
            {unmappedRows.map((extraKey, extraIdx) => (
              <tr
                key={extraKey}
                className="bg-amber-50/40 hover:bg-amber-50/80 text-slate-800 transition-colors"
              >
                <td className="border border-slate-200 px-2 py-2 text-center text-slate-500 font-medium">
                  {items.length + extraIdx + 1}
                </td>
                <td className="border border-slate-200 px-4 py-2 font-medium">
                  <span>{extraKey}</span>
                </td>
                {years.map((y) => {
                  const yearData = dataArray.find((d: any) => d.Year === y);
                  const rawVal = yearData ? yearData[extraKey] : '';
                  const isNeg = isValueNegative(rawVal);
                  return (
                    <td
                      key={y}
                      className={`border border-slate-200 px-4 py-2 text-right tabular-nums whitespace-nowrap ${isNeg ? 'font-semibold text-rose-600' : 'text-slate-800'
                        }`}
                    >
                      {formatValue(rawVal)}
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
}

interface BalanceSheetTableProps {
  balanceSheet: {
    'Equity & Liabilities'?: any[];
    Assets?: any[];
    [key: string]: any;
  };
}

export default function BalanceSheetTable({ balanceSheet }: BalanceSheetTableProps) {
  if (!balanceSheet) return null;

  const equityData = balanceSheet['Equity & Liabilities'] || [];
  const assetsData = balanceSheet['Assets'] || [];

  return (
    <div className="space-y-6">

      {/* Equity & Liabilities Table (Items 1 to 31) */}
      {equityData && equityData.length > 0 && (
        <BalanceSheetSectionTable
          title="Equity & Liabilities"
          items={EQUITY_LIABILITIES_ITEMS}
          dataArray={equityData}
        />
      )}

      {/* Assets Table (Items 32 to 55) */}
      {assetsData && assetsData.length > 0 && (
        <BalanceSheetSectionTable
          title="Assets"
          items={ASSETS_ITEMS}
          dataArray={assetsData}
        />
      )}
    </div>
  );
}
