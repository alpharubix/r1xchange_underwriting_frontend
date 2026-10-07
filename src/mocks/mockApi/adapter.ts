import type { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { handleMockRoute } from './handlers';

// Artificial delay helper to preserve UI loading spinners and skeletons
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function createMockBlob(url: string, data: any): Blob {
  let content = 'Report Type,Export Date,Status\n';
  content += `Financial Analysis Export,${new Date().toISOString()},SUCCESS\n\n`;

  if (url.includes('bsa')) {
    content += 'Bank Name,Account Number,Total Credits,Total Debits,Avg Balance\n';
    content += 'HDFC Bank,50100284754582,4850000,3920000,645000\n';
    content += 'State Bank of India,39482710582,3200000,2840000,380000\n';
  } else if (url.includes('gst')) {
    content += 'GSTIN,Legal Name,Turnover,Tax Paid,Status\n';
    content += '27AABCS1429B1Z2,Sharma Trading & Logistics Co.,18540000,3337200,Active\n';
  } else if (url.includes('cibil')) {
    content += 'Customer Name,CIBIL Score,Total Accounts,Active Accounts,Outstanding\n';
    content += 'Rajesh Sharma,785,6,3,485000\n';
  } else if (url.includes('itr')) {
    content += 'Financial Year,Gross Income,Taxable Income,Total Tax Paid,Refund\n';
    content += '2024-2025,4250000,4000000,1030000,56560\n';
  } else {
    content += JSON.stringify(data || {}, null, 2);
  }

  return new Blob([content], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
}

export async function mockAxiosAdapter(
  config: InternalAxiosRequestConfig
): Promise<AxiosResponse> {
  // Simulate network latency (250-400ms)
  await delay(250 + Math.floor(Math.random() * 150));

  const url = config.url || '';
  const method = config.method || 'GET';

  // Extract payload / params
  let parsedData: any = {};
  if (config.data) {
    if (typeof config.data === 'string') {
      try {
        parsedData = JSON.parse(config.data);
      } catch {
        parsedData = config.data;
      }
    } else {
      parsedData = config.data;
    }
  }

  const responseData = handleMockRoute(url, method, parsedData, config.params);
  const isBlobRequest = config.responseType === 'blob' || url.includes('export');

  const finalBody = isBlobRequest
    ? createMockBlob(url, responseData)
    : responseData;

  const mockResponse: AxiosResponse = {
    data: finalBody,
    status: 200,
    statusText: 'OK',
    headers: {
      'content-type': isBlobRequest
        ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        : 'application/json',
      'content-disposition': isBlobRequest
        ? `attachment; filename="Export_${Date.now()}.xlsx"`
        : undefined,
    },
    config,
  };

  return mockResponse;
}
