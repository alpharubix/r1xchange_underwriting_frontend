import { useState, useEffect } from 'react';
import { useLendingEligibility } from '@/hooks/useLendingEligibility';
import { LenderCard, LenderCardSkeleton } from '@/components/lending';
import { Button } from '@/components/ui/button';
import { RefreshCw, AlertCircle } from 'lucide-react';

export default function EligibilityDashboard() {
  const { data, isLoading, isError, refetch, isRefetching } = useLendingEligibility();

  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isLoading || isRefetching) {
      interval = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    } else {
      setElapsedTime(0);
    }
    return () => clearInterval(interval);
  }, [isLoading, isRefetching]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const eligibleBanks = data?.eligible || [];
  const ineligibleBanks = data?.ineligible || [];
  const isEmpty = eligibleBanks.length === 0 && ineligibleBanks.length === 0;

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2 mb-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Lending Eligibility</h2>
          <p className="text-slate-500">
            View eligibility status and parameters across multiple lenders.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isLoading || isRefetching}
            className="hidden md:flex bg-white w-28 justify-center"
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isRefetching ? 'animate-spin' : ''}`} />
            {isRefetching ? formatTime(elapsedTime) : 'Refresh'}
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-center p-6 bg-white border border-slate-200 rounded-xl shadow-sm text-slate-700 animate-pulse">
            <RefreshCw className="mr-3 h-5 w-5 animate-spin text-emerald-500" />
            <span className="font-medium text-lg">Analyzing your profile across lenders...</span>
            <span className="ml-3 font-mono bg-slate-100 text-slate-600 px-3 py-1 rounded-md font-semibold text-lg border border-slate-200">
              {formatTime(elapsedTime)}
            </span>
          </div>
          <LenderCardSkeleton />
          <LenderCardSkeleton />
          <LenderCardSkeleton />
        </div>
      ) : isError ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-8 text-center flex flex-col items-center justify-center space-y-4">
          <div className="rounded-full bg-red-100 p-3">
            <AlertCircle className="h-6 w-6 text-red-600" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-semibold text-red-900">Failed to load eligibility data</h3>
            <p className="text-red-700 text-sm max-w-sm mx-auto">
              There was an error communicating with the server. Please check your connection and try again.
            </p>
          </div>
          <Button variant="outline" onClick={() => refetch()} className="mt-4 border-red-200 text-red-700 hover:bg-red-100">
            Try Again
          </Button>
        </div>
      ) : isEmpty ? (
        <div className="rounded-xl border border-slate-200 bg-white p-12 text-center flex flex-col items-center justify-center space-y-3">
          <div className="rounded-full bg-slate-100 p-4">
            <AlertCircle className="h-8 w-8 text-slate-400" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-semibold text-slate-900">No lenders found</h3>
            <p className="text-slate-500 text-sm">
              We couldn't find any eligibility data for the current profile.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-8 animate-in fade-in duration-500 ">
          {/* Summary Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 shadow-sm flex flex-col">
              <div className="flex items-center justify-between mb-4 border-b border-emerald-200/50 pb-4">
                <div>
                  <h3 className="text-emerald-800 text-lg font-semibold">Eligible Banks</h3>
                  <p className="text-emerald-600/80 text-sm mt-1">Lenders matching most criteria</p>
                </div>
                <span className="text-4xl font-bold text-emerald-600 drop-shadow-sm">{eligibleBanks.length}</span>
              </div>
              {eligibleBanks.length > 0 && (
                <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                  {eligibleBanks.map((bank, idx) => {
                    const elId = `lender-eligible-${bank.bank_id || idx}`;
                    return (
                      <div
                        key={`sum-elig-${bank.bank_id || idx}`}
                        className="flex items-center justify-between bg-white/60 p-2.5 rounded-lg border border-emerald-100 transition-colors hover:bg-emerald-100/50 cursor-pointer"
                        onClick={() => {
                          document.getElementById(elId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }}
                      >
                        <span className="text-sm font-medium text-emerald-900 truncate mr-2">{bank.bank_name}</span>
                        <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full shrink-0">
                          {bank.eligibility_score} / 100
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="bg-red-50 border border-red-200 rounded-xl p-6 shadow-sm flex flex-col">
              <div className="flex items-center justify-between mb-4 border-b border-red-200/50 pb-4">
                <div>
                  <h3 className="text-red-800 text-lg font-semibold">Ineligible Banks</h3>
                  <p className="text-red-600/80 text-sm mt-1">Lenders rejecting current profile</p>
                </div>
                <span className="text-4xl font-bold text-red-600 drop-shadow-sm">{ineligibleBanks.length}</span>
              </div>
              {ineligibleBanks.length > 0 && (
                <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                  {ineligibleBanks.map((bank, idx) => {
                    const elId = `lender-ineligible-${bank.bank_id || idx}`;
                    return (
                      <div
                        key={`sum-inelig-${bank.bank_id || idx}`}
                        className="flex items-center justify-between bg-white/60 p-2.5 rounded-lg border border-red-100 transition-colors hover:bg-red-100/50 cursor-pointer"
                        onClick={() => {
                          document.getElementById(elId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }}
                      >
                        <span className="text-sm font-medium text-red-900 truncate mr-2">{bank.bank_name}</span>
                        <span className="text-xs font-bold text-red-700 bg-red-100 px-2.5 py-1 rounded-full shrink-0">
                          {bank.eligibility_score} / 100
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Eligible Banks List */}
          {eligibleBanks.length > 0 && (
            <div >
              <h3 className="text-xl font-semibold text-slate-900 mb-4 border-b border-slate-200 pb-2 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                Eligible Lenders
              </h3>
              <div className="flex flex-col gap-6">
                {eligibleBanks.map((lender, index) => (
                  <div id={`lender-eligible-${lender.bank_id || index}`} key={`eligible-${lender.bank_id || index}`} className="scroll-mt-6">
                    <LenderCard data={lender} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Ineligible Banks List */}
          {ineligibleBanks.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold text-slate-900 mb-4 border-b border-slate-200 pb-2 flex items-center gap-2 mt-8">
                <span className="h-2 w-2 rounded-full bg-red-500"></span>
                Ineligible Lenders
              </h3>
              <div className="flex flex-col gap-6">
                {ineligibleBanks.map((lender, index) => (
                  <div id={`lender-ineligible-${lender.bank_id || index}`} key={`ineligible-${lender.bank_id || index}`} className="scroll-mt-6">
                    <LenderCard data={lender} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
