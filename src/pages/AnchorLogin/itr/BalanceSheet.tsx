import { useQuery } from '@tanstack/react-query';
import { getItrBalanceSheet } from '@/api/itr';
import CustomerProfile from '@/components/itr/CustomerProfile';
import { renderYearlyTable } from '@/components/itr/ItrTableHelper';
import { Loader2 } from 'lucide-react';

interface BalanceSheetProps {
  custId?: string;
  reportId?: string;
}

export default function BalanceSheet({ custId, reportId }: BalanceSheetProps = {}) {
  const finalCustId = custId || localStorage.getItem("selected_cust_id");
  const finalReportId = reportId || localStorage.getItem("selected_itr_report_id");

  const { data, isLoading, isError } = useQuery({
    queryKey: ['itrBalanceSheet', finalCustId, finalReportId],
    queryFn: () => getItrBalanceSheet(finalCustId),
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

  const { customer_profile, balance_sheet } = data.data;

  return (
    <div className="p-6 space-y-6">
      <CustomerProfile profile={customer_profile} />

      {balance_sheet["Equity & Liabilities"] && renderYearlyTable("Equity & Liabilities", balance_sheet["Equity & Liabilities"])}
      {balance_sheet["Assets"] && renderYearlyTable("Assets", balance_sheet["Assets"])}
    </div>
  );
}