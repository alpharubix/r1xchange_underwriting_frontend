import { useSearchParams } from 'react-router-dom';
import CibilWorkflow from './index';

export default function CibilCustDataFetching() {
  const [searchParams] = useSearchParams();
  const custId = searchParams.get('cust_id') || undefined;

  const handleReports = () => {
    // Navigate to the reports page
    const queryStr = custId ? `?cust_id=${custId}` : '';
    window.location.href = `/cibil/reports${queryStr}`;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#002366]">CIBIL Score</h1>
            <p className="text-gray-500 mt-1">
              Authenticate customer consent and process CIBIL report data
            </p>
            {custId && <p className="text-[#7754f8] mt-1 font-medium text-sm">Target Customer ID: {custId}</p>}
            <button className="mt-4 px-4 py-2 bg-[#002366] text-white rounded hover:bg-[#002366]/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#002366]" onClick={handleReports}>
              View Previous Reports
            </button>
          </div>
        </div>

        <CibilWorkflow custId={custId} />
      </div>
    </div>
  );
}
