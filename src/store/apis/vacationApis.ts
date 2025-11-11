import { http } from "../../config/http";
import { API_BASE_URL } from "../../config/api";
import type { VacationRequest } from "../types/Vacation/VacationTypes";
import type { 
  CreateVacationRequestResponse, 
  GetAllVacationRequestsResponse,
  GetVacationStatsResponse 
} from "../types/Vacation/VacationResponse";

export async function createVacationRequest(
  request: VacationRequest
): Promise<CreateVacationRequestResponse> {
  const url = `${API_BASE_URL}/vacation/create`;
  const result = await http.post(url, request);
  return result.data;
}

export async function getAllVacationRequests(): Promise<GetAllVacationRequestsResponse> {
  const url = `${API_BASE_URL}/vacation/all`;
  const result = await http.get(url);
  return result.data;
}

export async function getVacationStats(): Promise<GetVacationStatsResponse> {
  const url = `${API_BASE_URL}/vacation/stats`;
  const result = await http.get(url);
  return result.data;
}

export async function updateVacationRequestStatus(
  requestId: string,
  status: "approved" | "rejected",
  reviewComments?: string
): Promise<{ message: string }> {
  const url = `${API_BASE_URL}/vacation/update-status/${requestId}`;
  const result = await http.put(url, { status, reviewComments });
  return result.data;
}
