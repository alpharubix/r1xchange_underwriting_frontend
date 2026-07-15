import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import CibilReportTabs from "@/components/cibil/CibilReportTabs";

type ViewReportProps = {
  reference_id?: string;
  onBack?: () => void;
  onStartNew?: () => void;
};

export default function ViewReport({
  reference_id: propReferenceId,
  onBack,
  onStartNew,
}: ViewReportProps = {}) {
  const { reference_id: routeReferenceId } = useParams<{ reference_id: string }>();
  const navigate = useNavigate();
  const referenceId = propReferenceId || routeReferenceId;

  useEffect(() => {
    document.title = "View CIBIL Report";
  }, []);

  const handleBack = () => {
    if (onBack) {
      onBack();
      return;
    }

    navigate("/cibil/reports");
  };

  const handleStartNew = () => {
    if (onStartNew) {
      onStartNew();
      return;
    }

    navigate("/cibil");
  };

  if (!referenceId) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-10">
        <div className="mx-auto max-w-3xl rounded-md border border-red-200 bg-white p-6 text-red-700 shadow-sm">
          Reference ID is missing.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              CIBIL Report
            </p>
            <h1 className="mt-1 text-2xl font-bold text-slate-950 sm:text-3xl">
              Report Sections
            </h1>
            <p className="mt-2 max-w-3xl break-all text-sm text-slate-600">
              Reference ID: <span className="font-semibold text-slate-900">{referenceId}</span>
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleBack}
              className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-100"
            >
              Back
            </button>
            <button
              type="button"
              onClick={handleStartNew}
              className="rounded-md bg-black px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-black/80"
            >
              Start New CIBIL Flow
            </button>
          </div>
        </div>

        <CibilReportTabs referenceId={referenceId} />
      </div>
    </div>
  );
}