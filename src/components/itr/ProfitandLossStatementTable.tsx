import { useMemo } from 'react';

export interface PLItemDef {
  id: number;
  name: string;
  isTotal?: boolean;
  
}

export const PROFIT_AND_LOSS_ITEMS: PLItemDef[] = [
  { id: 1, name: 'Sale of Goods',  },
  { id: 2, name: 'Sale of Services', },
  { id: 3, name: 'Receipts from Profession',  },
  { id: 4, name: 'Other Operating Income', },
  { id: 5, name: 'Revenue from Operations', isTotal: true,  },
  { id: 6, name: 'Opening Inventories',  },
  { id: 7, name: 'Closing Inventories',  },
  { id: 8, name: 'Purchases',  },
  { id: 9, name: 'Factory Overheads',  },
  { id: 10, name: 'Direct Wages',  },
  { id: 11, name: 'Direct Expenses',  },
  { id: 12, name: 'Other Direct Costs', },
  { id: 13, name: 'Gross Profit', isTotal: true,  },    
  { id: 14, name: 'Freight Outward', },
  { id: 15, name: 'Consumption of Stores and Spare Parts',  },
  { id: 16, name: 'Power and Fuel', },
  { id: 17, name: 'Employee Benefit Expenses', },
  { id: 18, name: 'Selling, General and Administrative Expenses', },
  { id: 19, name: 'Selling, Promotional/Advertisement Expenses', },
  { id: 20, name: 'Other Expenses', },
  { id: 21, name: 'Total Expenses', isTotal: true, },
  { id: 22, name: 'EBITDA', isTotal: true },
  { id: 23, name: 'Depreciation and Amortization' },
  { id: 24, name: 'EBIT', isTotal: true },
  { id: 25, name: 'Finance Cost' },
  { id: 26, name: 'Profit after Interest and before Tax', isTotal: true },
  { id: 27, name: 'Other Non Operating Income' },
  { id: 28, name: 'Other Non Operating Expense' },
  { id: 29, name: 'Profit Before Tax', isTotal: true },
  { id: 30, name: 'Current Tax' },
  { id: 31, name: 'Deferred Tax' },
  { id: 32, name: 'Profit after Tax', isTotal: true },
  { id: 33, name: 'Retained Profit', isTotal: true }
];

// Helper to normalize keys for resilient matching with backend variations
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

interface ProfitandLossStatementTableProps {
  dataArray?: any[];
  profitAndLoss?: any;
  title?: string;
}

export default function ProfitandLossStatementTable({
  dataArray,
  profitAndLoss,
  title = 'Profit and Loss Statement',
}: ProfitandLossStatementTableProps) {
  // Resolve data if passed directly or inside a wrapper object
  const rowsData = useMemo(() => {
    if (Array.isArray(dataArray)) return dataArray;
    if (profitAndLoss && Array.isArray(profitAndLoss['Profit and Loss Statement'])) {
      return profitAndLoss['Profit and Loss Statement'];
    }
    if (Array.isArray(profitAndLoss)) return profitAndLoss;
    return [];
  }, [dataArray, profitAndLoss]);

  // Extract sorted financial years
  const years = useMemo(() => {
    if (!rowsData || rowsData.length === 0) return [];
    return Array.from(new Set(rowsData.map((d: any) => d.Year)))
      .filter(Boolean)
      .sort() as string[];
  }, [rowsData]);

  // Collect unmapped keys from backend so nothing is lost
  const unmappedRows = useMemo(() => {
    if (!rowsData || rowsData.length === 0) return [];
    const allBackendKeys = Array.from(
      new Set(rowsData.flatMap((d: any) => Object.keys(d)))
    ).filter((k) => k !== 'Year');

    const knownNormalized = new Set(PROFIT_AND_LOSS_ITEMS.map((i) => normalizeKey(i.name)));
    return allBackendKeys.filter((k) => !knownNormalized.has(normalizeKey(k)));
  }, [rowsData]);

  if (!rowsData || rowsData.length === 0) return null;

  return (
    <div className="mb-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300">
      {/* Table Header */}
      <div className="bg-[#002366] px-5 py-3.5 text-white flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-base sm:text-lg font-bold tracking-wide">{title}</h3>
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
            {PROFIT_AND_LOSS_ITEMS.map((row) => {
              const isTotal = !!row.isTotal;

              return (
                <tr
                  key={row.id}
                  className={`transition-colors duration-150 ${
                    isTotal
                      ? 'bg-slate-100 font-bold text-black border-y border-slate-300'
                      : 'bg-white hover:bg-slate-50/80 text-slate-700'
                  }`}
                >
                  {/* Row Number */}
                  <td
                    className={`border border-slate-200 px-2 py-2 text-center select-none ${
                      isTotal ? 'font-bold text-black bg-slate-200/60' : 'text-slate-500 font-medium'
                    }`}
                  >
                    {row.id}
                  </td>

                  {/* Particulars Label */}
                  <td
                    className={`border border-slate-200 px-4 py-2 ${
                      isTotal ? 'font-bold text-black' : 'font-normal text-slate-800'
                    }`}
                  >
                    <span>{row.name}</span>
                  </td>

                  {/* Yearly Value Columns */}
                  {years.map((y) => {
                    const yearData = rowsData.find((d: any) => d.Year === y);
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
            })}

            {/* Unmapped Backend Rows fallback */}
            {unmappedRows.map((extraKey, extraIdx) => (
              <tr
                key={extraKey}
                className="bg-amber-50/40 hover:bg-amber-50/80 text-slate-800 transition-colors"
              >
                <td className="border border-slate-200 px-2 py-2 text-center text-slate-500 font-medium">
                  {PROFIT_AND_LOSS_ITEMS.length + extraIdx + 1}
                </td>
                <td className="border border-slate-200 px-4 py-2 font-medium">
                  <span>{extraKey}</span>
                </td>
                {years.map((y) => {
                  const yearData = rowsData.find((d: any) => d.Year === y);
                  const rawVal = yearData ? yearData[extraKey] : '';
                  const isNeg = isValueNegative(rawVal);
                  return (
                    <td
                      key={y}
                      className={`border border-slate-200 px-4 py-2 text-right tabular-nums whitespace-nowrap ${
                        isNeg ? 'font-semibold text-rose-600' : 'text-slate-800'
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
