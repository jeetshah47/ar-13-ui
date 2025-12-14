import { http } from "../../config/http";
import { API_BASE_URL } from "../../config/api";

export interface EndpointMetrics {
  endpoint: string;
  service: string;
  request_count: number;
  total_duration_ms: number;
  avg_duration_ms: number;
  min_duration_ms: number;
  max_duration_ms: number;
  total_bytes_in: number;
  total_bytes_out: number;
  avg_bytes_in: number;
  avg_bytes_out: number;
  last_request_time: string;
}

export interface ServiceMetrics {
  service: string;
  request_count: number;
  total_duration_ms: number;
  avg_duration_ms: number;
  total_bytes_in: number;
  total_bytes_out: number;
  avg_bytes_in: number;
  avg_bytes_out: number;
  endpoints: EndpointMetrics[];
}

export interface AllMetricsResponse {
  endpoints: EndpointMetrics[];
  total_endpoints: number;
}

export interface ServiceMetricsResponse {
  services: ServiceMetrics[];
  total_services: number;
}

export interface TopServicesResponse {
  top_services: ServiceMetrics[];
  summary: {
    total_services: number;
    total_requests: number;
    total_duration_ms: number;
    total_bytes_in: number;
    total_bytes_out: number;
    total_bytes: number;
  };
  sort_by: string;
  limit: number;
}

export async function getAllMetrics(): Promise<AllMetricsResponse> {
  const url = `${API_BASE_URL}/metrics/all`;
  const result = await http.get(url);
  return result.data;
}

export async function getMetricsByService(): Promise<ServiceMetricsResponse> {
  const url = `${API_BASE_URL}/metrics/by-service`;
  const result = await http.get(url);
  return result.data;
}

export async function getTopServices(
  sortBy: "requests" | "duration" | "bytes_in" | "bytes_out" | "total_bytes" = "requests",
  limit: number = 10
): Promise<TopServicesResponse> {
  const url = `${API_BASE_URL}/metrics/top`;
  const result = await http.get(url, {
    params: { sort_by: sortBy, limit },
  });
  return result.data;
}

export async function resetMetrics(): Promise<{ message: string }> {
  const url = `${API_BASE_URL}/metrics/reset`;
  const result = await http.post(url);
  return result.data;
}

