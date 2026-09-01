import CibilWorkflow from './index';

export default function CibilCustDataFetching() {

  const handleReports = () => {
    // Navigate to the reports page
    window.location.href = '/cibil/reports';
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">CIBIL Score</h1>
            <p className="text-gray-500 mt-1">
              Authenticate customer consent and process CIBIL report data
            </p>
            <button className="mt-4 px-4 py-2 bg-[#1106de] text-white rounded-xl hover:bg-[#0e05b5] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1106de] shadow-sm shadow-[#1106de]/20 cursor-pointer" onClick={handleReports}>
              View Previous Reports
            </button>
          </div>
        </div>

        <CibilWorkflow />
      </div>
    </div>
  );
}
