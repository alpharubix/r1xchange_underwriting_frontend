import apiClient from '@/lib/axios';

export const getItrTaxCalculation = async (custId?: string | null) => {
  const queryStr = custId ? `?cust_id=${encodeURIComponent(custId)}` : '';
  const response = await apiClient.get(`/itr/tax-calculation${queryStr}`);
  return response.data;
};

export const getItrBalanceSheet = async (custId?: string | null) => {
  const queryStr = custId ? `?cust_id=${encodeURIComponent(custId)}` : '';
  const response = await apiClient.get(`/itr/balance_sheet${queryStr}`);
  return response.data;
};

export const getItrProfitAndLoss = async (custId?: string | null) => {
  const queryStr = custId ? `?cust_id=${encodeURIComponent(custId)}` : '';
  const response = await apiClient.get(
    `/itr/profit-and-loss-statement${queryStr}`
  );
  return response.data;
};

export const getItrRatioAnalysis = async (custId?: string | null) => {
  const queryStr = custId ? `?cust_id=${encodeURIComponent(custId)}` : '';
  const response = await apiClient.get(`/itr/ratio-analysis${queryStr}`);
  return response.data;
};

/**
 * Download ITR Excel/PDF report (Tax Calculation, Balance Sheet, Profit & Loss Statement, Ratio Analysis) from /itr/export-report
 */
export const downloadItrReport = async (
  custId?: string | null,
  reportId?: string | null
): Promise<void> => {
  const finalCustId =
    custId || localStorage.getItem('selected_cust_id') || undefined;
  const finalReportId =
    reportId || localStorage.getItem('selected_itr_report_id') || undefined;

  const params: Record<string, string> = {};
  if (finalCustId) params.cust_id = finalCustId;
  if (finalReportId) {
    params.report_id = finalReportId;
    params.itr_reference_id = finalReportId;
  }

  const payload = {
    cust_id: finalCustId,
    report_id: finalReportId,
    itr_reference_id: finalReportId,
  };

  const candidateEndpoints = [
    { method: 'post', url: '/itr/export-report' },
    { method: 'get', url: '/itr/export-report' },
    { method: 'post', url: '/itr/export_report' },
    { method: 'get', url: '/itr/export_report' },
    { method: 'post', url: '/itr/export' },
    { method: 'get', url: '/itr/export' },
    { method: 'post', url: '/itr/download-report' },
    { method: 'get', url: '/itr/download-report' },
  ];

  try {
    let response: any = null;
    let lastError: any = null;

    for (const candidate of candidateEndpoints) {
      try {
        if (candidate.method === 'post') {
          response = await apiClient.post(candidate.url, payload, {
            params,
            responseType: 'blob',
            skipErrorToast: true,
          });
        } else {
          response = await apiClient.get(candidate.url, {
            params,
            responseType: 'blob',
            skipErrorToast: true,
          });
        }
        if (response && response.status >= 200 && response.status < 300) {
          break;
        }
      } catch (err: any) {
        lastError = err;
        if (err.response?.status === 404 || err.response?.status === 405) {
          continue;
        }
        break;
      }
    }

    if (!response) {
      throw lastError || new Error('Failed to download ITR report');
    }

    let filename = `ITR_Report${finalCustId ? `_${finalCustId}` : ''}.xlsx`;
    const rawDisposition =
      response.headers?.['content-disposition'] ||
      response.headers?.['Content-Disposition'];
    const disposition =
      typeof rawDisposition === 'string' ? rawDisposition : undefined;

    if (disposition) {
      const match = disposition.match(/filename=["']?([^"';]+)["']?/);
      if (match && match[1]) {
        filename = match[1].trim();
      }
    }

    const contentType =
      typeof response.headers?.['content-type'] === 'string'
        ? response.headers['content-type']
        : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

    const blob = new Blob([response.data], { type: contentType });
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
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
          'Failed to download ITR report';
        throw new Error(
          typeof serverMsg === 'string' ? serverMsg : JSON.stringify(serverMsg)
        );
      } catch (parseErr: any) {
        if (parseErr.message && !parseErr.message.includes('JSON')) {
          throw parseErr;
        }
      }
    }
    const msg =
      error.response?.data?.detail?.message ||
      error.response?.data?.message ||
      error.message ||
      'Failed to download ITR report';
    throw new Error(msg);
  }
};

