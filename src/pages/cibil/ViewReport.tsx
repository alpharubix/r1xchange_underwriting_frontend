import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCibilOverview } from "@/api/cibil";



type ReportData = {
  reference_id: string;
  cibil_pulled_date?: string;
  status?: string;
  [key: string]: unknown;
};

export default function ViewReport() {
  const { reference_id } = useParams<{ reference_id: string }>();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reportData, setReportData] = useState<ReportData | null>(null);

  useEffect(() => {
    document.title = "View CIBIL Report";
  }, []);

  const fetchReport = async () => {
    if (!reference_id) {
      setError("Reference ID is missing.");
      setIsFetching(false);
      return;
    }

    try {
      setIsFetching(true);
      setError(null);

      const response = await getCibilOverview(reference_id);
      setReportData(response.data as ReportData);
    } catch (err) {
      console.error(err);
      setError("Unable to load the report.");
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [reference_id]);

  const handleViewReport = async () => {
    if (!reference_id) return;

    try {
      setIsLoading(true);
      setError(null);

      const response = await getCibilOverview(reference_id);
      setReportData(response.data as ReportData);
    } catch (err) {
      console.error(err);
      setError("Unable to load the report.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigate("/cibil/reports");
  };

  const handleStartNew = () => {
    navigate("/cibil");
  };

  if (isFetching) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-lg px-6 py-5 flex items-center gap-3 border border-slate-200">
          <div className="h-5 w-5 rounded-full border-2 border-slate-300 border-t-blue-600 animate-spin" />
          <p className="text-sm font-medium text-slate-700">Loading report...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
              View Report
            </h1>
            <p className="mt-2 text-slate-600">
              Reference ID: <span className="font-medium text-slate-900">{reference_id}</span>
            </p>
          </div>

          <button
            type="button"
            onClick={handleBack}
            className="rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm border border-slate-200 hover:bg-slate-50 transition-colors"
          >
            Back
          </button>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 sm:p-8">
            <div className="rounded-xl bg-slate-50 border border-slate-200 p-5 mb-6">
              <span className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
                Report Reference ID
              </span>
              <p className="mt-2 text-lg font-semibold text-slate-900 break-all">
                {reference_id}
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 border border-slate-200 p-5 mb-6">
              <span className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
                Report Details
              </span>

              {reportData ? (
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-lg bg-white border border-slate-200 p-4">
                    <p className="text-xs text-slate-500">Status</p>
                    <p className="mt-1 text-sm font-semibold text-slate-900">
                      {reportData.status ?? "N/A"}
                    </p>
                  </div>

                  <div className="rounded-lg bg-white border border-slate-200 p-4">
                    <p className="text-xs text-slate-500">Pulled Date</p>
                    <p className="mt-1 text-sm font-semibold text-slate-900">
                      {reportData.cibil_pulled_date ?? "N/A"}
                    </p>
                  </div>

                  <div className="sm:col-span-2 rounded-lg bg-white border border-slate-200 p-4">
                    <p className="text-xs text-slate-500 mb-2">Raw Response</p>
                    <pre className="overflow-auto text-xs text-slate-700 whitespace-pre-wrap">
                      {JSON.stringify(reportData, null, 2)}
                    </pre>
                  </div>
                </div>
              ) : (
                <p className="mt-4 text-sm text-slate-600">
                  No report data loaded yet.
                </p>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={handleViewReport}
                disabled={isLoading || !reference_id}
                className="rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white hover:bg-black/80 transition-colors disabled:opacity-70"
              >
                {isLoading ? "Refreshing..." : "View Report"}
              </button>

              <button
                type="button"
                onClick={handleStartNew}
                className="rounded-xl bg-slate-100 px-5 py-3 text-sm font-semibold text-slate-800 hover:bg-slate-200 transition-colors"
              >
                Start New CIBIL Flow
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}