import { useQuery } from '@tanstack/react-query';
import { getItrProfitAndLoss } from '@/api/itr';
import CustomerProfile from '@/components/itr/CustomerProfile';
import { renderYearlyTable } from '@/components/itr/ItrTableHelper';
import { Loader2 } from 'lucide-react';

interface ProfitAndLossStatementProps {
  custId?: string;
  reportId?: string;
}

export default function ProfitAndLossStatement({ custId, reportId }: ProfitAndLossStatementProps = {}) {
  const finalCustId = custId || localStorage.getItem("selected_cust_id");
  const finalReportId = reportId || localStorage.getItem("selected_itr_report_id");

  const { data, isLoading, isError } = useQuery({
    queryKey: ['itrProfitAndLoss', finalCustId, finalReportId],
    queryFn: () => getItrProfitAndLoss(finalCustId),
  });

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-[#002366]" />
      </div>
    );
  }

  if (isError || !data || !data.data) {
    return (
      <div className="mx-auto mt-8 flex max-w-4xl flex-col items-center justify-center rounded-2xl border border-red-200 bg-red-100 px-10 py-12 shadow-xl animate-pulse">
        <p className="text-lg font-large text-red-800">No Data to load Ratio Analysis.</p>
      </div>
    );
  }

  const { customer_profile, profit_and_loss_statement } = data.data;

  return (
    <div className="p-6 space-y-6">
      <CustomerProfile profile={customer_profile} />

      {profit_and_loss_statement["Profit and Loss Statement"] && renderYearlyTable("Profit and Loss Statement", profit_and_loss_statement["Profit and Loss Statement"])}
    </div>
  );
}
