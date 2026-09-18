import { useQuery } from "@tanstack/react-query";
import {
  Building2,
  CalendarDays,
  CreditCard,
  Loader2,
  RefreshCw,
} from "lucide-react";
import {
  getBankAccounts,
  type BankAccounts,
  getDateRange,
  type DateRange,
} from "@/api/bsa";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function formatDate(value?: string | null) {
  if (!value) return "-";

  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) return value;

  return parsed.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getAccountKey(account: BankAccounts, index: number) {
  return [
    account.accountNumber,
    account.bankCode,
    account.accountType,
    index,
  ]
    .filter(Boolean)
    .join("-");
}

export default function BankAccountsPage() {

  const navigate = useNavigate();
  /*
   * Controls whether reports are displayed
   * for each individual account.
   */
  const [showReports, setShowReports] = useState<Record<string, boolean>>({});

  /*
   * Determines which report/module set is available
   * for every account.
   */
  const [showModules, setShowModules] = useState<Record<string, boolean>>({});

  /*
   * Stores BSA date range for every account.
   */
  const [dateRanges, setDateRanges] = useState<
    Record<string, DateRange>
  >({});

  const {
    data: accounts = [],
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["bsa", "bank-accounts"],
    queryFn: getBankAccounts,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });

  /*
   * Fetch date range and determine available modules
   * for every account.
   */
  useEffect(() => {
    if (!accounts.length) return;

    const fetchAccountData = async () => {
      for (const account of accounts) {
        if (!account.accountNumber) continue;

        try {
          /*
           * Determine which module set is available
           * for this account.
           */
          const isIndividual =
            account.entityType?.toLowerCase() === "individual";

          setShowModules((prev) => ({
            ...prev,
            [account.accountNumber!]: isIndividual,
          }));

          /*
           * Fetch BSA date range.
           */
          const data = await getDateRange(account.accountNumber);

          setDateRanges((prev) => ({
            ...prev,
            [account.accountNumber!]: data,
          }));

          console.log(
            "Account Number:",
            account.accountNumber,
            "Date fetched:",
            data
          );
        } catch (error) {
          console.error(
            "Failed to fetch data for:",
            account.accountNumber,
            error
          );
        }
      }
    };

    fetchAccountData();
  }, [accounts]);

  return (
    <main className="min-h-full bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">

        {/* =========================
            PAGE HEADER
            ========================= */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-950">
              Bank Accounts
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              BSA account details available for this customer.
            </p>
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={() => refetch()}
            disabled={isFetching}
            className="w-full transition-all duration-200 hover:shadow-sm sm:w-auto"
          >
            {isFetching ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}

            Refresh
          </Button>
        </div>

        {/* =========================
            ACCOUNTS CONTAINER
            ========================= */}
        <Card className="rounded-lg border-slate-200 shadow-sm">
          <CardHeader className="flex-row items-center justify-between gap-4 border-b border-slate-100">
            <CardTitle className="text-lg">
              Accounts List
            </CardTitle>

            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
              {accounts.length}{" "}
              {accounts.length === 1 ? "account" : "accounts"}
            </span>
          </CardHeader>

          <CardContent className="p-0">

            {/* =========================
                LOADING
                ========================= */}
            {isLoading ? (
              <div className="flex min-h-72 flex-col items-center justify-center gap-3 text-slate-500">
                <Loader2 className="h-8 w-8 animate-spin text-[#002366]" />

                <p className="text-sm font-medium">
                  Fetching bank accounts...
                </p>
              </div>

            /* =========================
               ERROR
               ========================= */
            ) : isError ? (
              <div className="flex min-h-72 flex-col items-center justify-center gap-4 px-6 text-center">
                <CreditCard className="h-10 w-10 text-slate-300" />

                <div>
                  <p className="font-semibold text-slate-900">
                    Could not load bank accounts
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    Please refresh the list or try again later.
                  </p>
                </div>
              </div>

            /* =========================
               EMPTY
               ========================= */
            ) : accounts.length === 0 ? (
              <div className="flex min-h-72 flex-col items-center justify-center gap-4 px-6 text-center">
                <Building2 className="h-10 w-10 text-slate-300" />

                <div>
                  <p className="font-semibold text-slate-900">
                    No bank accounts found
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    Once BSA account details are available, they will
                    appear here.
                  </p>
                </div>
              </div>

            /* =========================
               ACCOUNTS
               ========================= */
            ) : (
              <div className="grid grid-cols-1 gap-5 p-5 sm:grid-cols-2 lg:grid-cols-3">
                {accounts.map((account, index) => {
                  const accountNumber =
                    account.accountNumber ?? "";

                  const modulesAvailable =
                    showModules[accountNumber];

                  const reportsVisible =
                    showReports[accountNumber];

                  return (
                    <div
                      key={getAccountKey(account, index)}
                      className="
                        group
                        relative
                        flex
                        flex-col
                        min-h-[420px]
                        overflow-hidden
                        rounded-xl
                        border
                        border-slate-200
                        bg-white
                        p-5
                        shadow-sm
                        transition-all
                        duration-300
                        ease-out
                        hover:-translate-y-1
                        hover:border-slate-300
                        hover:shadow-lg
                      "
                    >

                      {/* =========================
                          REPORTS VIEW
                          ========================= */}

                      {reportsVisible ? (
                        <div
                          className="
                            absolute
                            inset-0
                            z-20
                            rounded-xl
                            bg-white
                            p-5
                            animate-in
                            fade-in
                            duration-200
                          "
                        >
                          <div className="flex h-full flex-col">

                            {/* Reports Header */}
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <h3 className="text-lg font-semibold text-slate-900">
                                  Available Reports
                                </h3>

                                <p className="mt-1 text-xs text-slate-500">
                                  Select a report to continue
                                </p>
                              </div>

                              <button
                                type="button"
                                onClick={() =>
                                  setShowReports((prev) => ({
                                    ...prev,
                                    [accountNumber]: false,
                                  }))
                                }
                                className="
                                  rounded-md
                                  px-2
                                  py-1
                                  text-xs
                                  font-medium
                                  text-slate-500
                                  transition-all
                                  duration-200
                                  hover:bg-slate-100
                                  hover:text-slate-700
                                "
                              >
                                Back
                              </button>
                            </div>

                            {/* =========================
                                REPORT OPTIONS
                                ========================= */}

                            <div className="mt-5 space-y-2">

                              {modulesAvailable ? (
                                <>
                                  {/* Overview */}
                                  <button
                                    type="button"
                                    onClick={() => {
                                      sessionStorage.setItem("selected_bsa_account_number", accountNumber);
                                      navigate("/bsa/individual/overview", {
                                        state: { accountNumber },
                                      });
                                    }}
                                    className="
                                      w-full
                                      rounded-lg
                                      border
                                      border-slate-200
                                      bg-slate-50
                                      p-3
                                      text-left
                                      text-sm
                                      font-medium
                                      text-slate-700
                                      transition-all
                                      duration-200
                                      hover:-translate-y-0.5
                                      hover:border-[#002366]/20
                                      hover:bg-[#002366]/5
                                      hover:text-[#002366]
                                      hover:shadow-sm
                                    "
                                  >
                                    Overview
                                  </button>

                                  {/* EOD Analysis */}
                                  <button
                                    type="button"
                                    onClick={() => {
                                      sessionStorage.setItem("selected_bsa_account_number", accountNumber);
                                      navigate("/bsa/individual/eod-analysis", {
                                        state: { accountNumber },
                                      });
                                    }}
                                    className="
                                      w-full
                                      rounded-lg
                                      border
                                      border-slate-200
                                      bg-slate-50
                                      p-3
                                      text-left
                                      text-sm
                                      font-medium
                                      text-slate-700
                                      transition-all
                                      duration-200
                                      hover:-translate-y-0.5
                                      hover:border-[#002366]/20
                                      hover:bg-[#002366]/5
                                      hover:text-[#002366]
                                      hover:shadow-sm
                                    "
                                  >
                                    EOD Analysis
                                  </button>

                                  {/* Loan Transactions */}
                                  <button
                                    type="button"
                                    onClick={() => {
                                      sessionStorage.setItem("selected_bsa_account_number", accountNumber);
                                      navigate("/bsa/individual/loan-transactions", {
                                        state: { accountNumber },
                                      });
                                    }}
                                    className="
                                      w-full
                                      rounded-lg
                                      border
                                      border-slate-200
                                      bg-slate-50
                                      p-3
                                      text-left
                                      text-sm
                                      font-medium
                                      text-slate-700
                                      transition-all
                                      duration-200
                                      hover:-translate-y-0.5
                                      hover:border-[#002366]/20
                                      hover:bg-[#002366]/5
                                      hover:text-[#002366]
                                      hover:shadow-sm
                                    "
                                  >
                                    Loan Transactions
                                  </button>
                                </>
                              ) : (
                                <>
                                  {/* Summary of Debit and Credit */}
                                  <button
                                    type="button"
                                    className="
                                      w-full
                                      rounded-lg
                                      border
                                      border-slate-200
                                      bg-slate-50
                                      p-3
                                      text-left
                                      text-sm
                                      font-medium
                                      text-slate-700
                                      transition-all
                                      duration-200
                                      hover:-translate-y-0.5
                                      hover:border-[#002366]/20
                                      hover:bg-[#002366]/5
                                      hover:text-[#002366]
                                      hover:shadow-sm
                                    "
                                    onClick={()=>{
                                      sessionStorage.setItem(
                                        "selected_bsa_account_number",
                                        accountNumber
                                      );
                                      navigate("/bsa/summary-of-debit-and-credit", {
                                        state: { accountNumber },
                                      })
                                    }}
                                    disabled={!accountNumber}
                                  >
                                    Summary of Debit and Credit
                                  </button>

                                  {/* Cash Flow */}
                                  <button
                                    type="button"
                                    className="
                                      w-full
                                      rounded-lg
                                      border
                                      border-slate-200
                                      bg-slate-50
                                      p-3
                                      text-left
                                      text-sm
                                      font-medium
                                      text-slate-700
                                      transition-all
                                      duration-200
                                      hover:-translate-y-0.5
                                      hover:border-[#002366]/20
                                      hover:bg-[#002366]/5
                                      hover:text-[#002366]
                                      hover:shadow-sm
                                    "

                                    onClick={()=>{
                                      navigate("/bsa/cash-flow", {
                                        state: { accountNumber },
                                      })
                                    }}
                                  >
                                    Cash Flow
                                  </button>

                                  {/* Monthly Overview */}
                                  <button
                                    type="button"
                                    className="
                                      w-full
                                      rounded-lg
                                      border
                                      border-slate-200
                                      bg-slate-50
                                      p-3
                                      text-left
                                      text-sm
                                      font-medium
                                      text-slate-700
                                      transition-all
                                      duration-200
                                      hover:-translate-y-0.5
                                      hover:border-[#002366]/20
                                      hover:bg-[#002366]/5
                                      hover:text-[#002366]
                                      hover:shadow-sm
                                    "
                                    onClick={
                                      ()=>{
                                        navigate("/bsa/overview-monthly-wise")
                                      }
                                    }
                                  >
                                    Monthly Overview
                                  </button>
                                </>
                              )}

                            </div>
                          </div>
                        </div>
                      ) : (

                      /* =========================
                         NORMAL ACCOUNT CARD
                         ========================= */

                        <>
                          {/* Header */}
                          <div className="flex items-start justify-between">
                            <div
                              className="
                                flex
                                h-11
                                w-11
                                items-center
                                justify-center
                                rounded-lg
                                bg-[#002366]/10
                                transition-all
                                duration-300
                                group-hover:scale-105
                                group-hover:bg-[#002366]/15
                              "
                            >
                              <CreditCard className="h-5 w-5 text-[#002366]" />
                            </div>

                            <span
                              className="
                                rounded-full
                                bg-emerald-50
                                px-3
                                py-1
                                text-xs
                                font-semibold
                                text-emerald-700
                                transition-all
                                duration-300
                                group-hover:shadow-sm
                              "
                            >
                              Active
                            </span>
                          </div>

                          {/* Account Number */}
                          <div className="mt-6">
                            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                              Account Number
                            </p>

                            <p className="mt-1 truncate text-lg font-bold tracking-wide text-slate-950">
                              {account.accountNumber || "Unavailable"}
                            </p>
                          </div>

                          {/* Entity Type */}
                          <div className="mt-5">
                            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                              Entity Type
                            </p>

                            <p className="mt-1 text-sm font-semibold text-slate-700">
                              {account.entityType || "Unavailable"}
                            </p>
                          </div>

                          {/* =========================
                              BOTTOM DETAILS
                              ========================= */}

                          <div
                            className="
                              mt-auto
                              pt-5
                              space-y-3
                            "
                          >

                            {/* Bank Details */}
                            <div
                              className="
                                space-y-3
                                border-t
                                border-slate-100
                                pt-4
                              "
                            >
                              <div className="flex items-center gap-2">
                                <Building2 className="h-4 w-4 shrink-0 text-slate-400" />

                                <div className="min-w-0">
                                  <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                                    Bank Name
                                  </p>

                                  <p className="truncate text-xs font-semibold text-slate-700">
                                    {account.bank_name ?? "-"}
                                  </p>
                                </div>

                                <div className="ml-auto min-w-0">
                                  <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                                    Bank Code
                                  </p>

                                  <p className="truncate text-xs font-semibold text-slate-700">
                                    {account.bankCode ?? "-"}
                                  </p>
                                </div>
                              </div>

                              {/* BSA Period */}
                              <div className="flex items-center gap-2">
                                <CalendarDays className="h-4 w-4 shrink-0 text-slate-400" />

                                <div className="min-w-0">
                                  <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                                    BSA Period
                                  </p>

                                  <p className="truncate text-xs font-semibold text-slate-700">
                                    {dateRanges[accountNumber]
                                      ? `${formatDate(
                                          dateRanges[accountNumber]?.from_date
                                        )} → ${formatDate(
                                          dateRanges[accountNumber]?.to_date
                                        )}`
                                      : "Loading..."}
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* =========================
                                VIEW REPORTS BUTTON
                                ========================= */}

                            <Button
                              type="button"
                              onClick={() =>
                                setShowReports((prev) => ({
                                  ...prev,
                                  [accountNumber]: true,
                                }))
                              }
                              className="
                                w-full
                                rounded-lg
                                bg-[#002366]
                                text-white
                                transition-all
                                duration-200
                                hover:-translate-y-0.5
                                hover:bg-[#001a4d]
                                hover:shadow-md
                              "
                            >
                              View Reports
                            </Button>

                          </div>
                        </>
                      )}

                    </div>
                  );
                })}
              </div>
            )}

          </CardContent>
        </Card>
      </div>
    </main>
  );
}
