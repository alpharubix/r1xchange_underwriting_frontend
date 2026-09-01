import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeft, FileText } from "lucide-react";
import TaxCalculation from "./TaxCalculation";
import BalanceSheet from "./BalanceSheet";
import ProfitAndLossStatement from "./ProfitAndLossStatement";
import RatioAnalysis from "./RatioAnalysis";

interface ItrReportPageProps {
  itrReportId?: string;
  onBack?: () => void;
}

export default function ItrReportPage({ itrReportId, onBack }: ItrReportPageProps) {
  if (!itrReportId) {
    return (
      <div className="bg-gray-50 py-12 px-4 flex items-center justify-center">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-50 text-[#1106de] mb-4">
            <FileText className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            No Active Report Selected
          </h3>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 py-6 px-4 sm:px-6 lg:px-8 rounded-2xl border border-slate-100 shadow-sm animate-in fade-in duration-200">
      <div className="space-y-6">
        <div className="flex items-center space-x-4 mb-4 border-b border-slate-100 pb-4">
          {onBack && (
            <button
              onClick={onBack}
              className="p-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors shadow-sm cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600 hover:text-[#1106de]" />
            </button>
          )}
          <div>
            <h1 className="text-2xl font-bold text-gray-950">ITR Report</h1>
            <p className="text-xs text-gray-500 mt-0.5">Ref ID: {itrReportId}</p>
          </div>
        </div>

        <Tabs defaultValue="tax-calc" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6 bg-slate-100/50 p-1 rounded-xl h-11 border border-slate-100">
            <TabsTrigger value="tax-calc" className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-[#1106de] data-[state=active]:shadow-sm text-xs font-bold cursor-pointer">
              Tax Calculation
            </TabsTrigger>
            <TabsTrigger value="balance-sheet" className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-[#1106de] data-[state=active]:shadow-sm text-xs font-bold cursor-pointer">
              Balance Sheet
            </TabsTrigger>
            <TabsTrigger value="profit-loss" className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-[#1106de] data-[state=active]:shadow-sm text-xs font-bold cursor-pointer">
              Profit & Loss
            </TabsTrigger>
            <TabsTrigger value="ratio" className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-[#1106de] data-[state=active]:shadow-sm text-xs font-bold cursor-pointer">
              Ratio Analysis
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tax-calc" className="outline-none focus:outline-none">
            <TaxCalculation />
          </TabsContent>

          <TabsContent value="balance-sheet" className="outline-none focus:outline-none">
            <BalanceSheet />
          </TabsContent>

          <TabsContent value="profit-loss" className="outline-none focus:outline-none">
            <ProfitAndLossStatement />
          </TabsContent>

          <TabsContent value="ratio" className="outline-none focus:outline-none">
            <RatioAnalysis />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
