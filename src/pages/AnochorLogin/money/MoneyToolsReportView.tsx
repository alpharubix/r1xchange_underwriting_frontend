import { Card, CardContent } from "@/components/ui/card";
import { IndianRupee, ShieldCheck, CheckCircle2, History } from 'lucide-react';
import { format } from 'date-fns';
import { useQuery } from '@tanstack/react-query';
import { getMoneyToolsData } from '@/api/user';
import { Loader2 } from 'lucide-react';

export default function MoneyToolsReportView({ selectedCustomer }: { selectedCustomer: any }) {
  
  const { data: accessDataRaw, isLoading: isLoadingAccess } = useQuery({
    queryKey: ['money-tools', 'access_money', selectedCustomer.id],
    queryFn: () => getMoneyToolsData('access_money', selectedCustomer.id)
  });

  const { data: saveDataRaw, isLoading: isLoadingSave } = useQuery({
    queryKey: ['money-tools', 'save_money', selectedCustomer.id],
    queryFn: () => getMoneyToolsData('save_money', selectedCustomer.id)
  });

  const { data: rectifyDataRaw, isLoading: isLoadingRectify } = useQuery({
    queryKey: ['money-tools', 'rectify_money', selectedCustomer.id],
    queryFn: () => getMoneyToolsData('rectify_money', selectedCustomer.id)
  });

  const accessData = accessDataRaw?.data || [];
  const saveData = saveDataRaw?.data || [];
  const rectifyData = rectifyDataRaw?.data || [];

  const isLoading = isLoadingAccess || isLoadingSave || isLoadingRectify;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-slate-500">
        <Loader2 className="w-8 h-8 animate-spin mb-4 text-[#002366]" />
        <p>Loading Money Tools data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Money Tools</h2>
        <p className="text-xs text-slate-500 mt-0.5">Overview of submitted requests and selections</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Access Money Card */}
        <Card className="border border-slate-100 shadow-sm rounded-2xl overflow-hidden">
          <CardContent className="p-0">
            <div className="bg-[#002366] px-6 py-4">
              <h3 className="font-bold text-white flex items-center gap-2">
                <IndianRupee className="h-5 w-5" />
                Access Money Requests
              </h3>
            </div>
            <div className="p-6">
              {accessData.length === 0 ? (
                <p className="text-sm text-slate-500 text-center py-4">No loan requests submitted.</p>
              ) : (
                <ul className="space-y-4">
                  {accessData.map((req: any, idx: number) => (
                    <li key={idx} className="border-b border-slate-100 pb-3 last:border-0 last:pb-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold text-slate-800 text-sm">{req.loan_type}</p>
                          <p className="text-xs text-slate-400 mt-0.5">
                            {req.timestamp ? format(new Date(req.timestamp), 'dd MMM yyyy, hh:mm a') : 'N/A'}
                          </p>
                        </div>
                        <span className="font-bold text-[#002366] text-sm flex items-center">
                          <IndianRupee className="h-3 w-3 mr-0.5" />
                          {Number(req.amount).toLocaleString('en-IN')}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Save Money Card */}
        <Card className="border border-slate-100 shadow-sm rounded-2xl overflow-hidden">
          <CardContent className="p-0">
            <div className="bg-[#2E9B5C] px-6 py-4">
              <h3 className="font-bold text-white flex items-center gap-2">
                <ShieldCheck className="h-5 w-5" />
                Save Money Selections
              </h3>
            </div>
            <div className="p-6">
              {saveData.length === 0 ? (
                <p className="text-sm text-slate-500 text-center py-4">No accounts selected.</p>
              ) : (
                <ul className="space-y-4">
                  {saveData.map((acc: any, idx: number) => (
                    <li key={idx} className="border-b border-slate-100 pb-3 last:border-0 last:pb-0 flex gap-3 items-start">
                      <CheckCircle2 className="h-4 w-4 text-[#2E9B5C] mt-0.5 shrink-0" />
                      <div>
                        <p className="font-semibold text-slate-800 text-sm">{acc.lender_name}</p>
                        <p className="text-xs text-slate-500 font-mono mt-0.5">{acc.account_number}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Rectify Money Card */}
        <Card className="border border-slate-100 shadow-sm rounded-2xl overflow-hidden">
          <CardContent className="p-0">
            <div className="bg-[#FF6B4A] px-6 py-4">
              <h3 className="font-bold text-white flex items-center gap-2">
                <History className="h-5 w-5" />
                Rectify Money Selections
              </h3>
            </div>
            <div className="p-6">
              {rectifyData.length === 0 ? (
                <p className="text-sm text-slate-500 text-center py-4">No accounts selected.</p>
              ) : (
                <ul className="space-y-4">
                  {rectifyData.map((acc: any, idx: number) => (
                    <li key={idx} className="border-b border-slate-100 pb-3 last:border-0 last:pb-0 flex gap-3 items-start">
                      <CheckCircle2 className="h-4 w-4 text-[#FF6B4A] mt-0.5 shrink-0" />
                      <div>
                        <p className="font-semibold text-slate-800 text-sm">{acc.lender_name}</p>
                        <p className="text-xs text-slate-500 font-mono mt-0.5">{acc.account_number}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
