import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2, ArrowLeft, Check, IndianRupee, Save } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { getSaveMoneyReports, submitSaveMoneySelections } from "@/api/money";
import { format } from "date-fns";
import { toast } from "sonner";

interface SaveMoneyReportViewProps {
  custId: string;
  referenceId: string;
  onBack: () => void;
}

const safeFormatDate = (dateStr: string) => {
  if (!dateStr) return "N/A";
  let dateObj = new Date(dateStr);
  if (isNaN(dateObj.getTime())) {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      dateObj = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
    }
  }
  if (isNaN(dateObj.getTime())) return dateStr;
  return format(dateObj, 'dd MMM yyyy');
};

export default function SaveMoneyReportView({ custId, referenceId, onBack }: SaveMoneyReportViewProps) {
  const queryClient = useQueryClient();

  const { data: report, isLoading, isError } = useQuery({
    queryKey: ["reports", "save_money", custId, referenceId],
    queryFn: () => getSaveMoneyReports(custId, referenceId),
  });

  const submitMutation = useMutation({
    mutationFn: (selectedAccounts: { account_number: string, lender_name: string }[]) => 
      submitSaveMoneySelections(custId, { reference_id: referenceId, selected_accounts: selectedAccounts }),
    onSuccess: () => {
      toast.success("Selections submitted successfully!");
      queryClient.invalidateQueries({ queryKey: ["reports", "save_money", custId, referenceId] });
    },
    onError: () => {
      toast.error("Failed to submit selections");
    }
  });

  const toggleCheckbox = (account: any) => {
    const isPermanentlyBlocked = account.check_box_initial;
    
    if (isPermanentlyBlocked) return;

    queryClient.setQueryData(["reports", "save_money", custId, referenceId], (old: any) => {
      if (!old || !old.accounts) return old;
      return {
        ...old,
        accounts: old.accounts.map((acc: any) => 
          (acc.account_number === account.account_number && acc.lender_name === account.lender_name) 
            ? { ...acc, check_box: !acc.check_box } 
            : acc
        )
      };
    });
  };

  const handleSubmit = () => {
    if (!report || !report.accounts) return;
    const selected = report.accounts
      .filter((acc: any) => acc.check_box)
      .map((acc: any) => ({ account_number: acc.account_number, lender_name: acc.lender_name }));
    submitMutation.mutate(selected);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={onBack}
          className="h-10 w-10 border-2 border-[#002366] bg-white rounded-xl hover:bg-[#002366] hover:text-white text-[#002366] transition-all shadow-sm shadow-[#002366]/20 shrink-0"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex flex-col">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold text-slate-900">Save Money Report</h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">Reference ID: {referenceId}</p>
        </div>
      </div>

      <div className="bg-white border border-slate-100 shadow-sm rounded-2xl overflow-hidden">
        {isLoading ? (
          <div className="py-24 flex flex-col items-center justify-center gap-4">
            <Loader2 className="h-8 w-8 text-[#FF6B4A] animate-spin" />
            <p className="text-slate-500 font-medium">Fetching accounts data...</p>
          </div>
        ) : isError ? (
          <div className="py-24 flex flex-col items-center justify-center gap-2">
            <p className="text-red-500 font-medium">Failed to load save money report.</p>
            <p className="text-sm text-slate-400">Please try again later.</p>
          </div>
        ) : !report?.accounts || report.accounts.length === 0 ? (
          <div className="py-24 text-center text-slate-500 font-medium">
            No active accounts found for this report.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-[#f1f5f9] text-slate-400 font-bold text-xs uppercase tracking-wider bg-slate-50/50">
                  <th className="py-4 px-6 font-semibold">Lender Name</th>
                  <th className="py-4 px-6 font-semibold">Account Number</th>
                  <th className="py-4 px-6 font-semibold">Opened Date</th>
                  <th className="py-4 px-6 font-semibold text-right">Current Balance</th>
                  <th className="py-4 px-6 font-semibold text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f1f5f9] font-medium text-slate-700">
                {report.accounts.map((account: any, idx: number) => {
                  const isBlocked = account.check_box_initial;
                  const isChecked = account.check_box || isBlocked;
                  return (
                  <tr key={idx} className="hover:bg-slate-50/20 transition-colors">
                    <td className="py-4 px-6 font-bold text-slate-900">{account.lender_name || "N/A"}</td>
                    <td className="py-4 px-6 text-slate-600">{account.account_number || "N/A"}</td>
                    <td className="py-4 px-6 text-slate-600">
                      {safeFormatDate(account.opened_date)}
                    </td>
                    <td className="py-4 px-6 text-right font-bold text-[#1D1E2C]">
                      {account.current_balance ? (
                        <span className="flex items-center justify-end gap-1">
                          <IndianRupee className="h-3 w-3" />
                          {Number(account.current_balance).toLocaleString('en-IN')}
                        </span>
                      ) : "N/A"}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <div className="flex justify-center">
                        <button 
                          onClick={() => toggleCheckbox(account)}
                          type="button"
                          disabled={isBlocked}
                          className={`h-6 w-6 rounded-md flex items-center justify-center transition-colors border shadow-sm ${isChecked ? (isBlocked ? 'bg-slate-400 border-slate-400 text-white cursor-not-allowed' : 'bg-[#2E9B5C] border-[#2E9B5C] text-white') : 'bg-white border-slate-300 text-transparent hover:border-slate-400'}`}
                        >
                          <Check className="h-4 w-4" strokeWidth={3} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )})}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {report?.accounts && report.accounts.length > 0 && (
        <div className="flex justify-end pt-2">
          <Button 
            onClick={handleSubmit} 
            disabled={submitMutation.isPending || !report.accounts.some((acc: any) => {
              const isBlocked = (acc as any).check_box_initial;
              return acc.check_box && !isBlocked;
            })}
            className="bg-[#FF6B4A] hover:bg-[#E55A39] text-white h-10 px-8 rounded-xl shadow-sm text-sm font-bold"
          >
            {submitMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Submit Selections
          </Button>
        </div>
      )}
    </div>
  );
}
