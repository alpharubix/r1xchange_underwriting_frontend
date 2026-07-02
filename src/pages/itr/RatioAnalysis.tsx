import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getItrRatioAnalysis } from '@/api/itr';
import CustomerProfile from '@/components/itr/CustomerProfile';
import { renderYearlyTable } from '@/components/itr/ItrTableHelper';
import { Loader2 } from 'lucide-react';

export default function RatioAnalysis() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['itrRatioAnalysis'],
    queryFn: getItrRatioAnalysis,
  });

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-[#000000]" />
      </div>
    );
  }

  if (isError || !data || !data.data) {
    return (
      <div className="mx-auto mt-8 flex max-w-5xl flex-col items-center justify-center rounded-2xl border border-red-200 bg-red-100 px-10 py-12 shadow-xl animate-pulse">
       <p className="text-lg font-large text-red-800">No Data to load Ratio Analysis.</p> 
      </div>
    );
  }

  const { customer_profile, ratio_analysis } = data.data;

  // The order of sections based on the typical presentation or JSON structure
  const sections = [
    "Liquidity Analysis",
    "Asset Management",
    "Leverage Ratios",
    "Coverage Ratios",
    "Profitability Ratios",
    "Growth in Cashflow Margin"
  ];

  return (
    <div className="p-6 space-y-6">
      <CustomerProfile profile={customer_profile} />
      
      {sections.map(section => {
        if (ratio_analysis[section]) {
          return (
            <React.Fragment key={section}>
              {renderYearlyTable(section, ratio_analysis[section])}
            </React.Fragment>
          );
        }
        return null;
      })}
    </div>
  );
}
