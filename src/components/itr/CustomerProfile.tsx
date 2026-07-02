export default function CustomerProfile({ profile }: { profile: any }) {
  if (!profile) return null;

  return (
    <div className="mb-6 overflow-hidden rounded-xl border border-gray-300 bg-white shadow-md animate-in fade-in duration-500">
      <h3 className="bg-black px-4 py-3 text-center text-lg font-semibold text-white tracking-wide">
        Customer Profile
      </h3>

      <div className="grid grid-cols-1 gap-4 p-5 text-sm md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-gray-300 bg-gray-50 p-4 text-center transition-all duration-300 hover:bg-black hover:text-white">
          <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-500">
            Company Name
          </span>
          <span className="font-medium">
            {profile.company_name || "N/A"}
          </span>
        </div>

        <div className="rounded-lg border border-gray-300 bg-gray-50 p-4 text-center transition-all duration-300 hover:bg-black hover:text-white">
          <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-500">
            GSTIN
          </span>
          <span className="font-medium">
            {profile.gstin || "N/A"}
          </span>
        </div>

        <div className="rounded-lg border border-gray-300 bg-gray-50 p-4 text-center transition-all duration-300 hover:bg-black hover:text-white">
          <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-500">
            Phone Number
          </span>
          <span className="font-medium">
            {profile.phone_number || "N/A"}
          </span>
        </div>

        <div className="rounded-lg border border-gray-300 bg-gray-50 p-4 text-center transition-all duration-300 hover:bg-black hover:text-white">
          <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-500">
            PAN
          </span>
          <span className="font-medium">
            {profile.pan || "N/A"}
          </span>
        </div>
      </div>
    </div>
  );
}