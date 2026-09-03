import apiClient from "@/lib/axios";

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
  const response = await apiClient.get("/user/me", { skipErrorToast: true } as any);
  return response.data?.data ?? response.data;

};

export const getUsersList = async (): Promise<any[]> => {
  const response = await apiClient.get("/admin/users-list");
  const data = response.data?.data ?? response.data;
  return Array.isArray(data) ? data : (data?.users || []);
};

export const getAdminsList = async (): Promise<any[]> => {
  const response = await apiClient.get("/admin/admins-list");
  const data = response.data?.data ?? response.data;
  return Array.isArray(data) ? data : (data?.admins || []);
};

export const getAnchorsList = async (): Promise<any[]> => {
  const response = await apiClient.get("/admin/anchors/anchor-list");
  const data = response.data?.data ?? response.data;
  return Array.isArray(data) ? data : (data?.anchors || []);
};

export const getAssociatedAnchorsList = async (): Promise<any[]> => {
  const response = await apiClient.get("/anchor/associated-anchors");
  const data = response.data?.data ?? response.data;
  return Array.isArray(data) ? data : (data?.anchors || []);
};

export const getAnchorUsers = async (anchorId?: string): Promise<any[]> => {
  const url = anchorId ? `/anchor/users?_id=${encodeURIComponent(anchorId)}` : "/anchor/users";
  const response = await apiClient.get(url);
  console.log("getAnchorUsers response raw:", response.data);
  const data = response.data?.data ?? response.data;
  return Array.isArray(data) ? data : (data?.users || data?.customers || []);
};

export const getUserBsaReports = async (id: string): Promise<any[]> => {
  const response = await apiClient.get(`/anchor/get-user-reports/bsa?cust_id=${encodeURIComponent(id)}`);
  return response.data?.data ?? response.data ?? [];
};

export const getUserGstReports = async (id: string): Promise<any[]> => {
  const response = await apiClient.get(`/anchor/get-user-reports/gst?cust_id=${encodeURIComponent(id)}`);
  return response.data?.data ?? response.data ?? [];
};

export const getUserItrReports = async (id: string): Promise<any[]> => {
  const response = await apiClient.get(`/anchor/get-user-reports/itr?cust_id=${encodeURIComponent(id)}`);
  return response.data?.data ?? response.data ?? [];
};

export const getCibilReportsMetadata = async (id: string) => {
  const response = await apiClient.get(`/anchor/get-user-reports/cibil?cust_id=${encodeURIComponent(id)}`);
  return response.data;
};

export const getMoneyToolsData = async (module: string, id: string) => {
  const response = await apiClient.get(`/anchor/money-tools/${encodeURIComponent(module)}/${encodeURIComponent(id)}`);
  return response.data;
};

export const getUserCibilReports = async (id: string): Promise<any[]> => {
  const response = await apiClient.get(`/anchor/get-user-reports/cibil?cust_id=${encodeURIComponent(id)}`);
  return response.data?.data ?? response.data ?? [];
};


export const updateProfile = async (data: Partial<UserProfile>) => {
  console.log("Updating profile with data:", data);
  const response = await apiClient.put("/user/me", data);
  return response.data?.data ?? response.data;
};