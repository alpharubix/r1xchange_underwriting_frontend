export const renderYearlyTable = (title: string, dataArray: any[]) => {
  if (!dataArray || dataArray.length === 0) return null;

  const years = Array.from(
    new Set(dataArray.map((d: any) => d.Year))
  )
    .filter(Boolean)
    .sort() as string[];

  const allKeys = Array.from(
    new Set(dataArray.flatMap((d: any) => Object.keys(d)))
  ).filter((k) => k !== "Year");

  const isHighlighted = (key: string) =>
    key.toLowerCase().includes("total") ||
    key.toLowerCase().includes("net ") ||
    key.toLowerCase().includes("gross ") ||
    key.toLowerCase().includes("profit") ||
    key.toLowerCase().includes("ebitda");

  return (
    <div className="mb-6 overflow-x-auto rounded-2xl border border-slate-100 bg-white shadow-sm animate-in fade-in duration-500">
      <div className="bg-[#002366] px-4 py-3 text-center text-lg font-semibold tracking-wide text-white">
        {title}
      </div>

      <table className="w-full border-collapse text-sm">
        <thead className="bg-[#002366] text-white">
          <tr>
            <th className="border border-blue-900/30 px-4 py-3 text-left font-semibold">
              Particulars
            </th>

            {years.map((y) => (
              <th
                key={y}
                className="min-w-[120px] border border-blue-900/30 px-4 py-3 text-right font-semibold"
              >
                {y}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {allKeys.map((key, idx) => (
            <tr
              key={idx}
              className="transition-colors duration-300 hover:bg-slate-50/80"
            >
              <td
                className={`border border-slate-200 px-4 py-3 ${
                  isHighlighted(key)
                    ? "font-semibold text-slate-900"
                    : "text-slate-700"
                }`}
              >
                {key}
              </td>

              {years.map((y) => {
                const yearData = dataArray.find((d: any) => d.Year === y);
                let val = yearData ? yearData[key] : "";

                const rawVal = val;
                const isNegative =
                  typeof rawVal === "number"
                    ? rawVal < 0
                    : typeof rawVal === "string" &&
                      rawVal.trim().startsWith("-");

                if (val !== "" && val !== null && !isNaN(Number(val))) {
                  val = Number(val).toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  });
                }

                return (
                  <td
                    key={y}
                    className={`border border-slate-200 px-4 py-3 text-right ${
                      isNegative
                        ? "font-semibold text-red-600"
                        : "font-medium text-slate-800"
                    }`}
                  >
                    {val || "-"}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export const renderDataTable = (title: string, dataArray: any[]) => {
  if (!dataArray || dataArray.length === 0) return null;

  const allKeys = Array.from(
    new Set(dataArray.flatMap((d: any) => Object.keys(d)))
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 mb-6 overflow-x-auto animate-in fade-in duration-500">
      <div className="bg-[#002366] text-white px-4 py-2.5 text-center font-semibold border-b border-blue-900/30">
        {title}
      </div>

      <table className="w-full text-sm text-left border-collapse">
        <thead className="bg-slate-50">
          <tr>
            {allKeys.map((key) => (
              <th
                key={key}
                className="px-4 py-2.5 border border-slate-200 font-semibold text-slate-800"
              >
                {key}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {dataArray.map((row, idx) => (
            <tr key={idx} className="hover:bg-gray-50 transition-colors">
              {allKeys.map((key) => {
                let val = row[key];
                const rawVal = val;

                const isNegative =
                  typeof rawVal === "number"
                    ? rawVal < 0
                    : typeof rawVal === "string" &&
                      rawVal.trim().startsWith("-");

                if (
                  val !== "" &&
                  val !== null &&
                  typeof val === "number"
                ) {
                  val = Number(val).toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  });
                }

                return (
                  <td
                    key={key}
                    className={`px-4 py-2 border border-gray-200 text-gray-700 ${
                      isNegative ? "text-red-600 font-medium" : ""
                    }`}
                  >
                    {val || "-"}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};