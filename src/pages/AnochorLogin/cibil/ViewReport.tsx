import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CibilReportTabs from "@/components/cibil/CibilReportTabs";
import { ChevronLeft } from "lucide-react";

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
      <div className="bg-gray-50 py-12 px-4 flex items-center justify-center">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-50 text-[#002366] mb-4">
            Reference ID is missing.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 py-6 px-4 sm:px-6 lg:px-8 rounded-2xl border border-slate-100 shadow-sm animate-in fade-in duration-200">
      <div className="space-y-6">
        <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-4">
          <div className="flex items-center space-x-4">
            {onBack && (
              <button
                onClick={handleBack}
                className="p-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors shadow-sm cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600 hover:text-[#002366]" />
              </button>
            )}
            <div>
              <h1 className="text-2xl font-bold text-gray-950">CIBIL Report</h1>
              <p className="text-xs text-gray-500 mt-0.5">Ref ID: {referenceId}</p>
            </div>
          </div>

          {onStartNew && (
            <button
              type="button"
              onClick={handleStartNew}
              className="rounded-xl bg-[#002366] hover:bg-[#001744] px-4 py-2.5 text-xs font-bold text-white shadow-sm shadow-[#002366]/20 transition-colors cursor-pointer"
            >
              Start New CIBIL Flow
            </button>
          )}
        </div>

        <CibilReportTabs referenceId={referenceId} />
      </div>
    </div>
  );
}