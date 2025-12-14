import { http } from "../../config/http";
import { API_BASE_URL } from "../../config/api";

export interface AuditLog {
  id: string;
  method: string;
  path: string;
  userId?: string;
  userEmail?: string;
  ipAddress: string;
  userAgent: string;
  statusCode: number;
  requestTime: string;
  duration: number;
  requestBody?: Record<string, any>;
  queryParams?: Record<string, any>;
  error?: string;
  responseSize: number;
  created: string;
  updated?: string;
}

export interface AuditLogsResponse {
  auditLogs: AuditLog[];
  total: number;
}

export interface AuditLogFilters {
  limit?: number;
  userId?: string;
  method?: string;
  path?: string;
  statusCode?: number;
  startDate?: string; // YYYY-MM-DD
  endDate?: string; // YYYY-MM-DD
}

export async function getRecentAuditLogs(
  filters?: AuditLogFilters
): Promise<AuditLogsResponse> {
  const url = `${API_BASE_URL}/audit-logs/recent`;
  const params: Record<string, string> = {};
  
  if (filters?.limit) params.limit = filters.limit.toString();
  if (filters?.userId) params.userId = filters.userId;
  if (filters?.method) params.method = filters.method;
  if (filters?.path) params.path = filters.path;
  if (filters?.statusCode) params.statusCode = filters.statusCode.toString();
  if (filters?.startDate) params.startDate = filters.startDate;
  if (filters?.endDate) params.endDate = filters.endDate;

  const result = await http.get(url, { params });
  return result.data;
}

export async function getAuditLogsByUser(
  userId: string,
  limit?: number
): Promise<AuditLogsResponse> {
  const url = `${API_BASE_URL}/audit-logs/user/${userId}`;
  const params: Record<string, string> = {};
  if (limit) params.limit = limit.toString();

  const result = await http.get(url, { params });
  return result.data;
}

export async function getAuditLogsByPath(
  path: string,
  limit?: number
): Promise<AuditLogsResponse> {
  const url = `${API_BASE_URL}/audit-logs/path`;
  const params: Record<string, string> = { path };
  if (limit) params.limit = limit.toString();

  const result = await http.get(url, { params });
  return result.data;
}

export async function getAuditLogsByMethod(
  method: string,
  limit?: number
): Promise<AuditLogsResponse> {
  const url = `${API_BASE_URL}/audit-logs/method`;
  const params: Record<string, string> = { method };
  if (limit) params.limit = limit.toString();

  const result = await http.get(url, { params });
  return result.data;
}

export async function getAuditLogsByStatusCode(
  statusCode: number,
  limit?: number
): Promise<AuditLogsResponse> {
  const url = `${API_BASE_URL}/audit-logs/status/${statusCode}`;
  const params: Record<string, string> = {};
  if (limit) params.limit = limit.toString();

  const result = await http.get(url, { params });
  return result.data;
}

