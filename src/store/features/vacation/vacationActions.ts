import type { AppDispatch } from "../../store";
import {
  createVacationRequestRequest,
  createVacationRequestSuccess,
  createVacationRequestFailed,
  getAllVacationRequestsRequest,
  getAllVacationRequestsSuccess,
  getAllVacationRequestsFailed,
  getVacationStatsRequest,
  getVacationStatsSuccess,
  getVacationStatsFailed,
  updateVacationRequestStatusRequest,
  updateVacationRequestStatusSuccess,
  updateVacationRequestStatusFailed,
} from "./vacationSlice";
import {
  createVacationRequest,
  getAllVacationRequests,
  getVacationStats,
  updateVacationRequestStatus,
} from "../../apis/vacationApis";
import type { VacationRequest } from "../../types/Vacation/VacationTypes";

// Create vacation request
export const createVacationRequestAction = (request: VacationRequest) => {
  return async (dispatch: AppDispatch) => {
    dispatch(createVacationRequestRequest());
    try {
      const response = await createVacationRequest(request);
      dispatch(createVacationRequestSuccess({ request: response.request }));
    } catch (error: unknown) {
      const errorMessage = error instanceof Error && 'response' in error 
        ? (error as { response?: { data?: { message?: string } } }).response?.data?.message 
        : "Failed to create vacation request";
      dispatch(createVacationRequestFailed({ 
        error: errorMessage || "Failed to create vacation request" 
      }));
    }
  };
};

// Get all vacation requests
export const getAllVacationRequestsAction = () => {
  return async (dispatch: AppDispatch) => {
    dispatch(getAllVacationRequestsRequest());
    try {
      const response = await getAllVacationRequests();
      dispatch(getAllVacationRequestsSuccess({ requests: response.requests }));
    } catch (error: unknown) {
      const errorMessage = error instanceof Error && 'response' in error 
        ? (error as { response?: { data?: { message?: string } } }).response?.data?.message 
        : "Failed to fetch vacation requests";
      dispatch(getAllVacationRequestsFailed({ 
        error: errorMessage || "Failed to fetch vacation requests" 
      }));
    }
  };
};

// Get vacation stats
export const getVacationStatsAction = () => {
  return async (dispatch: AppDispatch) => {
    dispatch(getVacationStatsRequest());
    try {
      const response = await getVacationStats();
      dispatch(getVacationStatsSuccess({ stats: response.stats }));
    } catch (error: unknown) {
      const errorMessage = error instanceof Error && 'response' in error 
        ? (error as { response?: { data?: { message?: string } } }).response?.data?.message 
        : "Failed to fetch vacation stats";
      dispatch(getVacationStatsFailed({ 
        error: errorMessage || "Failed to fetch vacation stats" 
      }));
    }
  };
};

// Update vacation request status
export const updateVacationRequestStatusAction = (
  requestId: string, 
  status: "approved" | "rejected",
  reviewComments?: string
) => {
  return async (dispatch: AppDispatch) => {
    dispatch(updateVacationRequestStatusRequest());
    try {
      await updateVacationRequestStatus(requestId, status, reviewComments);
      dispatch(updateVacationRequestStatusSuccess({ requestId, status }));
    } catch (error: unknown) {
      const errorMessage = error instanceof Error && 'response' in error 
        ? (error as { response?: { data?: { message?: string } } }).response?.data?.message 
        : "Failed to update request status";
      dispatch(updateVacationRequestStatusFailed({ 
        error: errorMessage || "Failed to update request status" 
      }));
    }
  };
};
