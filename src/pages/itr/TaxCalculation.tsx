import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getItrTaxCalculation } from '@/api/itr';
import CustomerProfile from '@/components/itr/CustomerProfile';
import { renderYearlyTable, renderDataTable } from '@/components/itr/ItrTableHelper';
import { Loader2 } from 'lucide-react';

export default function TaxCalculation() {
  const { data, isLoading, isError } = useQuery<any>({
    queryKey: ['itrTaxCalculation'],
    queryFn: () => getItrTaxCalculation(),
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
      <div className="mx-auto mt-8 flex max-w-4xl flex-col items-center justify-center rounded-2xl border-2 border-red-200 bg-red-100 px-10 py-12 shadow-xl animate-pulse">
        <p className="text-lg font-large text-red-800">No Data to load Ratio Analysis.</p>
      </div>
    );
  }

  const { customer_profile, tax_calculation } = data.data;

  return (
    <div className="p-6 space-y-6">
      <CustomerProfile profile={customer_profile} />

      {tax_calculation["Tax Calculation"] && renderYearlyTable("Tax Calculation", tax_calculation["Tax Calculation"])}
      {tax_calculation["Computation of Tax Liability on Total Income"] && renderYearlyTable("Computation of Tax Liability on Total Income", tax_calculation["Computation of Tax Liability on Total Income"])}

      {tax_calculation["Tax Deducted At Source"] && Object.keys(tax_calculation["Tax Deducted At Source"]).length > 0 && (
        <div className="bg-white rounded-md shadow-sm border border-gray-200 mb-6 overflow-hidden animate-in fade-in duration-500">
          <div className="bg-[#002366] text-white px-4 py-2 text-center rounded-t-md font-semibold">
            Tax Deducted At Source
          </div>
          <div className="p-0">
            {Object.entries(tax_calculation["Tax Deducted At Source"]).map(([key, val]) => (
              <React.Fragment key={key}>
                {renderDataTable(key, val as any[])}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}

      {tax_calculation["Tax Collected at Source"] && tax_calculation["Tax Collected at Source"].length > 0 && (
        <div className="bg-white rounded-md shadow-sm border border-gray-200 mb-6 overflow-hidden animate-in fade-in duration-500">
          {/* <div className="bg-[#e67e22] text-white px-4 py-2 text-center rounded-t-md font-semibold">
             Tax Collected at Source
           </div> */}
          <div className="p-0">
            {renderDataTable("Tax Collected at Source", tax_calculation["Tax Collected at Source"])}
          </div>
        </div>
      )}
    </div>
  );
}
