import type { VacationResponse } from "./VacationTypes";

export interface GetAllVacationRequestsResponse {
  requests: VacationResponse[];
}

export interface CreateVacationRequestResponse {
  message: string;
  request: VacationResponse;
}

export interface GetVacationStatsResponse {
  stats: VacationStats;
}

export interface VacationStats {
  vacationDays: number;
  sickLeaveDays: number;
  remoteWorkDays: number;
  totalRequests: number;
}
