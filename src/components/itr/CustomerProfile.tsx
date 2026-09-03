export default function CustomerProfile({ profile }: { profile: any }) {
  if (!profile) return null;

  return (
    <div className="mb-6 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm animate-in fade-in duration-500">
      <h3 className="bg-[#002366] px-4 py-3 text-center text-lg font-semibold text-white tracking-wide">
        Customer Profile
      </h3>

      <div className="grid grid-cols-1 gap-4 p-5 text-sm md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 text-center transition-all duration-300 hover:bg-[#002366] hover:text-white group">
          <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500 group-hover:text-white/80">
            Company Name
          </span>
          <span className="font-semibold">
            {profile.company_name || "N/A"}
          </span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 text-center transition-all duration-300 hover:bg-[#002366] hover:text-white group">
          <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500 group-hover:text-white/80">
            GSTIN
          </span>
          <span className="font-semibold">
            {profile.gstin || "N/A"}
          </span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 text-center transition-all duration-300 hover:bg-[#002366] hover:text-white group">
          <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500 group-hover:text-white/80">
            Phone Number
          </span>
          <span className="font-semibold">
            {profile.phone_number || "N/A"}
          </span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 text-center transition-all duration-300 hover:bg-[#002366] hover:text-white group">
          <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500 group-hover:text-white/80">
            PAN
          </span>
          <span className="font-semibold">
            {profile.pan || "N/A"}
          </span>
        </div>
      </div>
    </div>
  );
}