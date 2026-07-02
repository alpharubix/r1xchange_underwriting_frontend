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
    <div className="mb-6 overflow-x-auto rounded-xl border border-gray-300 bg-white shadow-md animate-in fade-in duration-500">
      <div className="bg-black px-4 py-3 text-center text-lg font-semibold tracking-wide text-white">
        {title}
      </div>

      <table className="w-full border-collapse text-sm">
        <thead className="bg-black text-white">
          <tr>
            <th className="border border-gray-700 px-4 py-3 text-left">
              Particulars
            </th>

            {years.map((y) => (
              <th
                key={y}
                className="min-w-[120px] border border-gray-700 px-4 py-3 text-right"
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
              className="transition-colors duration-300 hover:bg-gray-100"
            >
              <td
                className={`border border-gray-300 px-4 py-3 ${
                  isHighlighted(key)
                    ? "font-semibold text-black"
                    : "text-gray-700"
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
                    className={`border border-gray-300 px-4 py-3 text-right ${
                      isNegative
                        ? "font-semibold text-red-600"
                        : "font-medium text-gray-800"
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
    <div className="bg-white rounded-md shadow-sm border border-gray-200 mb-6 overflow-x-auto animate-in fade-in duration-500">
      <div className="bg-[#000000] text-white px-4 py-2 text-center font-semibold opacity-90 border-b border-white/20">
        {title}
      </div>

      <table className="w-full text-sm text-left border-collapse">
        <thead className="bg-gray-100">
          <tr>
            {allKeys.map((key) => (
              <th
                key={key}
                className="px-4 py-2 border border-gray-200 font-semibold text-[#000000]"
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