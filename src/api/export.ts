import apiClient from "@/lib/axios";

export interface ExportBsaParams {
  from_date: string;
  to_date: string;
  cust_id?: string;
}

/**
 * Download the consolidated BSA Excel report from /v1/export/bsa
 */
export const downloadBsaReport = async (params: ExportBsaParams): Promise<void> => {
  try {
    const response = await apiClient.get("/export/bsa", {
      params,
      responseType: "blob",
      skipErrorToast: true,
    });

    let filename = `BSA_Report_${params.from_date}_to_${params.to_date}.xlsx`;
    const disposition =
      response.headers?.["content-disposition"] ||
      response.headers?.["Content-Disposition"];

    if (disposition) {
      const match = disposition.match(/filename=["']?([^"';]+)["']?/);
      if (match && match[1]) {
        filename = match[1].trim();
      }
    }

    const blob = new Blob([response.data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();

    window.URL.revokeObjectURL(downloadUrl);
    document.body.removeChild(link);
  } catch (error: any) {
    if (error.response?.data instanceof Blob) {
      try {
        const text = await error.response.data.text();
        const json = JSON.parse(text);
        const serverMsg =
          json.detail?.message ||
          json.detail ||
          json.message ||
          "Failed to download BSA export";
        throw new Error(
          typeof serverMsg === "string" ? serverMsg : JSON.stringify(serverMsg)
        );
      } catch (parseErr: any) {
        if (parseErr.message && !parseErr.message.includes("JSON")) {
          throw parseErr;
        }
      }
    }
    const msg =
      error.response?.data?.detail?.message ||
      error.response?.data?.message ||
      error.message ||
      "Failed to download BSA report";
    throw new Error(msg);
  }
};
