import apiClient from '@/lib/axios';

export interface UserProfile {
  _id?: string;
  user_id?: string;
  customer_name?: string;
  company_name?: string;
  email_id?: string;
  phone?: string;
  gst_number?: string | null;
  [key: string]: unknown;
}

export const getMe = async (): Promise<UserProfile> => {
  const response = await apiClient.get('/user/me', {
    skipErrorToast: true,
  } as any);
  return response.data?.data ?? response.data;
};

export interface PageInfo {
  page: number;
  limit: number;
  total_pages: number;
  total_data?: number;
  total_records?: number;
  logs?: any[];
  [key: string]: any;
}

export interface PaginatedListResult<T = any> {
  items: T[];
  page_info?: PageInfo;
  total_pages: number;
  total_records: number;
  current_page: number;
  limit: number;
  is_server_paginated: boolean;
}

export const extractPaginatedData = <T = any>(
  rawResponse: any,
  fallbackPage: number = 1,
  fallbackLimit: number = 10
): PaginatedListResult<T> => {
  if (!rawResponse) {
    return {
      items: [],
      total_pages: 1,
      total_records: 0,
      current_page: fallbackPage,
      limit: fallbackLimit,
      is_server_paginated: false,
    };
  }

  // If rawResponse is directly an array
  if (Array.isArray(rawResponse)) {
    return {
      items: rawResponse,
      total_pages: Math.max(1, Math.ceil(rawResponse.length / fallbackLimit)),
      total_records: rawResponse.length,
      current_page: fallbackPage,
      limit: fallbackLimit,
      is_server_paginated: false,
    };
  }

  // Extract page_info (handle both page_info and page-info)
  const page_info: PageInfo | undefined =
    rawResponse.page_info ||
    rawResponse["page-info"] ||
    rawResponse.data?.page_info ||
    rawResponse.data?.["page-info"];

  // Extract items list from various possible response formats
  let items: T[] = [];
  if (Array.isArray(rawResponse.data)) {
    items = rawResponse.data;
  } else if (Array.isArray(rawResponse.users)) {
    items = rawResponse.users;
  } else if (Array.isArray(rawResponse.admins)) {
    items = rawResponse.admins;
  } else if (Array.isArray(rawResponse.anchors)) {
    items = rawResponse.anchors;
  } else if (Array.isArray(rawResponse.logs)) {
    items = rawResponse.logs;
  } else if (rawResponse.data && Array.isArray(rawResponse.data.users)) {
    items = rawResponse.data.users;
  } else if (rawResponse.data && Array.isArray(rawResponse.data.admins)) {
    items = rawResponse.data.admins;
  } else if (rawResponse.data && Array.isArray(rawResponse.data.anchors)) {
    items = rawResponse.data.anchors;
  } else if (rawResponse.data && Array.isArray(rawResponse.data.logs)) {
    items = rawResponse.data.logs;
  } else if (Array.isArray(page_info?.logs)) {
    items = page_info.logs as any;
  }

  const is_server_paginated = !!page_info?.total_pages;
  const total_pages = page_info?.total_pages || rawResponse.total_pages || Math.max(1, Math.ceil(items.length / fallbackLimit));
  const total_records = page_info?.total_data ?? page_info?.total_records ?? rawResponse.total_records ?? rawResponse.total_logs ?? items.length;
  const current_page = page_info?.page || rawResponse.page || fallbackPage;
  const limit = page_info?.limit || rawResponse.limit || fallbackLimit;

  return {
    items,
    page_info,
    total_pages,
    total_records,
    current_page,
    limit,
    is_server_paginated,
  };
};

export const getUsersList = async (params?: Record<string, any>): Promise<any> => {
  const response = await apiClient.get("/admin/users-list", { params });
  return response.data;
};

export const getAdminsList = async (params?: Record<string, any>): Promise<any> => {
  const response = await apiClient.get("/admin/admins-list", { params });
  return response.data;
};

export const getAnchorsList = async (params?: Record<string, any>): Promise<any> => {
  const response = await apiClient.get("/admin/anchors/anchor-list", { params });
  return response.data;
};

export const getAssociatedAnchorsList = async (): Promise<any[]> => {
  const response = await apiClient.get('/anchor/associated-anchors');
  const data = response.data?.data ?? response.data;
  return Array.isArray(data) ? data : data?.anchors || [];
};

export const getAnchorUsers = async (anchorId?: string, params?: Record<string, any>): Promise<any> => {
  const queryParams: Record<string, any> = { ...params };
  if (anchorId) {
    queryParams._id = anchorId;
  }
  const response = await apiClient.get("/anchor/users", { params: queryParams });
  console.log("getAnchorUsers response raw:", response.data);
  return response.data;
};

export const getUserBsaReports = async (id: string): Promise<any[]> => {
  const response = await apiClient.get(
    `/anchor/get-user-reports/bsa?cust_id=${encodeURIComponent(id)}`
  );
  return response.data?.data ?? response.data ?? [];
};

export const getUserGstReports = async (id: string): Promise<any[]> => {
  const response = await apiClient.get(
    `/anchor/get-user-reports/gst?cust_id=${encodeURIComponent(id)}`
  );
  return response.data?.data ?? response.data ?? [];
};

export const getUserItrReports = async (id: string): Promise<any[]> => {
  const response = await apiClient.get(
    `/anchor/get-user-reports/itr?cust_id=${encodeURIComponent(id)}`
  );
  return response.data?.data ?? response.data ?? [];
};

export const getCibilReportsMetadata = async (id: string) => {
  const response = await apiClient.get(
    `/anchor/get-user-reports/cibil?cust_id=${encodeURIComponent(id)}`
  );
  return response.data;
};

export const getMoneyToolsData = async (module: string, id: string) => {
  const response = await apiClient.get(
    `/anchor/money-tools/${encodeURIComponent(module)}/${encodeURIComponent(id)}`
  );
  return response.data;
};

export const getUserCibilReports = async (id: string): Promise<any[]> => {
  const response = await apiClient.get(
    `/anchor/get-user-reports/cibil?cust_id=${encodeURIComponent(id)}`
  );
  return response.data?.data ?? response.data ?? [];
};

export const updateProfile = async (data: Partial<UserProfile>) => {
  console.log('Updating profile with data:', data);
  const response = await apiClient.put('/user/me', data);
  return response.data?.data ?? response.data;
};
