import { http } from "../../config/http";
import type { VacationRequest } from "../types/Vacation/VacationTypes";
import type { 
  CreateVacationRequestResponse, 
  GetAllVacationRequestsResponse,
  GetVacationStatsResponse 
} from "../types/Vacation/VacationResponse";

export async function createVacationRequest(
  request: VacationRequest
): Promise<CreateVacationRequestResponse> {
  const url = `http://localhost:3000/api/vacation/create-request`;
  const result = await http.post(url, request);
  return result.data;
}

export async function getAllVacationRequests(): Promise<GetAllVacationRequestsResponse> {
  const url = `http://localhost:3000/api/vacation/all-requests`;
  const result = await http.get(url);
  return result.data;
}

export async function getVacationStats(): Promise<GetVacationStatsResponse> {
  const url = `http://localhost:3000/api/vacation/stats`;
  const result = await http.get(url);
  return result.data;
}

export async function updateVacationRequestStatus(
  requestId: string,
  status: "approved" | "rejected"
): Promise<{ message: string }> {
  const url = `http://localhost:3000/api/vacation/requests/${requestId}/status`;
  const result = await http.patch(url, { status });
  return result.data;
}
