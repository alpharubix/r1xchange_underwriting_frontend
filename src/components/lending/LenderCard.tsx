import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, CheckCircle2, XCircle, Building2 } from 'lucide-react';
import { Badge } from './Badge';
import { ProgressBar } from './ProgressBar';
import type { LendingEligibilityData } from '@/api/lending';

function formatParameterName(str: string): string {
  if (typeof str !== 'string') return String(str || '');
  if (!str) return '';
  return str
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

function formatValueString(val: any): string {
  if (val === undefined || val === null) return 'N/A';
  const num = Number(val);

  const formatter = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2 });

  if (isNaN(num)) {
    if (typeof val === 'string') {
      // Find all standalone numbers and format them
      return val.replace(/-?\d+(?:\.\d+)?/g, (match) => {
        const mNum = Number(match);
        return isNaN(mNum) ? match : formatter.format(mNum);
      });
    }
    return String(val);
  }
  return formatter.format(num);
}

function ReasonDisplay({ reason }: { reason: string }) {
  if (!reason) return <span className="text-slate-700">Did not meet requirement</span>;

  const formattedReason = formatValueString(reason);
  const colonIdx = formattedReason.indexOf(': ');

  if (colonIdx > -1) {
    const key = formattedReason.substring(0, colonIdx);
    const rest = formattedReason.substring(colonIdx + 2);
    const subParts = rest.split(', ').map(s => s.trim());

    return (
      <div className="flex flex-col gap-1.5 w-full">
        <div className="font-semibold text-slate-800 border-b border-red-200/50 pb-0.5 text-[13px]">
          {formatParameterName(key)}
        </div>
        <div className="flex flex-wrap gap-1.5">
          {subParts.map((part, idx) => {
            const lastSpaceIdx = part.lastIndexOf(' ');
            const label = lastSpaceIdx > -1 ? part.substring(0, lastSpaceIdx) : '';
            const value = lastSpaceIdx > -1 ? part.substring(lastSpaceIdx + 1) : part;

            return (
              <div key={idx} className="bg-white/60 px-2 py-1 rounded border border-red-200 shadow-sm flex flex-col flex-auto min-w-0">
                {label && <span className="text-slate-500 font-medium text-[9px] uppercase tracking-wider truncate leading-tight">{label}</span>}
                <span className="font-mono text-slate-800 font-medium text-[11px] break-all leading-tight">{value}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return <span className="text-slate-700">{formattedReason}</span>;
}

interface LenderCardProps {
  data: LendingEligibilityData;
}

export function LenderCard({ data }: LenderCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const isEligible = data.eligibility_score > 50;

  return (
    <Card className={`relative transition-all duration-200 hover:shadow-md ${isEligible ? "border-slate-200 border-l-4 border-l-emerald-500 bg-white" : "border-slate-200 border-l-4 border-l-red-500 bg-red-50/30"}`}>
      <CardHeader className="pb-4 sticky top-0 z-20 bg-white/60 backdrop-blur-xl border-b border-slate-100 rounded-t-lg shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white border border-slate-200 shadow-sm">
              <Building2 className="h-5 w-5 text-slate-600" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold text-slate-900">{data.bank_name}</CardTitle>
              <p className="text-sm text-slate-500 font-mono mt-1">Bank - Id : {data.bank_id || data.bank_name.toLowerCase().replace(/\s+/g, '_')}</p>
            </div>
          </div>
          <Badge variant={isEligible ? 'success' : 'destructive'}>
            {isEligible ? 'Eligible' : 'Ineligible'}
          </Badge>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between text-sm mb-2 mt-5">
              <span className="font-medium text-slate-600">Eligibility Score</span>
              <span className="font-semibold text-slate-900">{data.eligibility_score}/100</span>
            </div>
            <ProgressBar
              value={data.eligibility_score}
              indicatorClassName={isEligible ? "bg-emerald-500" : "bg-red-500"}
            />
          </div>

          <div className="flex gap-4">
            <div className="flex items-center gap-1.5 text-sm text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100">
              <CheckCircle2 className="h-4 w-4" />
              <span className="font-medium">{data.passed} Passed</span>
            </div>

            <div className="flex items-center gap-1.5 text-sm text-red-700 bg-red-50 px-2.5 py-1 rounded-md border border-red-100">
              <XCircle className="h-4 w-4" />
              <span className="font-medium">{data.failed} Failed</span>
            </div>
          </div>

          <Button
            variant="ghost"
            className="w-full mt-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? (
              <>Hide Details <ChevronUp className="ml-2 h-4 w-4" /></>
            ) : (
              <>View Details <ChevronDown className="ml-2 h-4 w-4" /></>
            )}
          </Button>

          {isExpanded && (
            <div className="pt-4 mt-4 border-t border-slate-100 space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
              {data.passed_parameters && data.passed_parameters.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    Passed Parameters
                  </h4>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {data.passed_parameters.map((param, i) => (
                      <li key={i} className="text-sm text-slate-600 bg-slate-50 px-3 py-2 rounded-md border border-slate-100">
                        {formatParameterName(param.parameter)}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {data.failed_parameters && data.failed_parameters.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                    <XCircle className="h-4 w-4 text-red-500" />
                    Failure Reasons
                  </h4>
                  <div className="rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50/80 border-b border-slate-100 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                          <tr>
                            <th className="px-4 py-2.5">Parameter</th>
                            <th className="px-4 py-2.5 text-right">Your Value</th>
                            <th className="px-4 py-2.5 text-right">Expected</th>
                            <th className="px-4 py-2.5">Failure Reason</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white">
                          {data.failed_parameters.map((r, i) => (
                            <tr key={i} className="hover:bg-slate-50/60 transition-colors group">
                              <td className="px-4 py-2 font-medium text-slate-800">
                                {formatParameterName(r.parameter)}
                              </td>
                              <td className="px-4 py-2 text-slate-600 text-right font-mono text-sm whitespace-nowrap">
                                {formatValueString(r.customer_value)}
                              </td>
                              <td className="px-4 py-2 text-slate-600 text-right font-mono text-sm whitespace-nowrap">
                                {formatValueString(r.expected)}
                              </td>
                              <td className="px-4 py-2 text-slate-600 text-sm">
                                <div className="bg-red-50 text-red-800 p-2 rounded-md border border-red-100 text-xs leading-relaxed">
                                  <ReasonDisplay reason={r.reason || ''} />
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
