import apiClient from "@/lib/axios";

export interface LogRequest {
  method: string;
  path: string;
  request_id: string;
  trace_id: string;
  request_size_bytes?: number | null;
  headers?: Record<string, string>;
  query_params?: Record<string, any>;
  body_data?: any;
}

export interface LogResponse {
  status_code: number;
  response_size_bytes?: number | null;
}

export interface LogUser {
  role?: string | null;
  user_id?: string | null;
  organization_id?: string | null;
}

export interface LogClient {
  ip_address?: string | null;
  platform?: string | null;
  user_agent?: string | null;
}

export interface LogService {
  service_name?: string | null;
  revision?: string | null;
  environment?: string | null;
  git_commit?: string | null;
  [key: string]: any;
}

export interface LogError {
  occurred: boolean;
  type?: string | null;
  code?: string | number | null;
  message?: string | null;
}

export interface LogPerformance {
  duration_ms?: number | null;
}

export interface LogItem {
  _id: string;
  timestamp: string;
  status: "SUCCESS" | "FAILED" | string;
  request?: LogRequest;
  response?: LogResponse;
  user?: LogUser;
  client?: LogClient;
  service?: LogService;
  performance?: LogPerformance;
  error?: LogError;
  [key: string]: any;
}

export interface LogsResponse {
  page: number;
  limit: number;
  total_logs: number;
  total_pages: number;
  logs: LogItem[];
  "page-info"?: {
    page: number;
    limit: number;
    total_records: number;
    total_pages: number;
    logs: LogItem[];
  };
}

export interface LogFilters {
  page?: number;
  status_filter?: string;
  method?: string;
  status_code?: number | string;
  path?: string;
  role?: string;
  service?: string;
  user_id?: string;
}

export const getLogsList = async (
  pageOrFilters: number | LogFilters = 1
): Promise<LogsResponse> => {
  const params: Record<string, any> =
    typeof pageOrFilters === "number"
      ? { page: pageOrFilters }
      : { ...pageOrFilters };

  // Remove empty / undefined / null filters
  Object.keys(params).forEach((key) => {
    if (params[key] === undefined || params[key] === null || params[key] === "") {
      delete params[key];
    }
  });

  const response = await apiClient.get(`/logs/view`, { params });
  return response.data?.data ?? response.data;
};


