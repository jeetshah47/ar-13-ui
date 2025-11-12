import type { AppDispatch } from "../../store";
import {
  getAllEmployeesRequest,
  getAllEmployeesSuccess,
  getAllEmployeesFailed,
  getEmployeeByIdRequest,
  getEmployeeByIdSuccess,
  getEmployeeByIdFailed,
  inviteEmployeeRequest,
  inviteEmployeeSuccess,
  inviteEmployeeFailed,
  getEmployeeStatsRequest,
  getEmployeeStatsSuccess,
  getEmployeeStatsFailed,
} from "./employeeSlice";
import { getAllEmployees, getEmployeeTaskCounts, getEmployeeStats } from "../../apis/employeesApi";
import type { AxiosError } from "axios";
import type { EmployeeErrorResponse } from "../../types/Employee/EmployeeResponse";
import toast from "react-hot-toast";
import { inviteUser } from "../../apis/userApis";

export const getAllEmployeesAction = () => async (dispatch: AppDispatch) => {
  dispatch(getAllEmployeesRequest());
  try {
    const response = await getAllEmployees();
    dispatch(getAllEmployeesSuccess(response));
  } catch (error) {
    let errorMessage = "Failed to fetch employees";
    
    // Handle string errors (from HTTP interceptor)
    if (typeof error === "string") {
      errorMessage = error;
    }
    // Handle Error objects
    else if (error instanceof Error) {
      errorMessage = error.message || errorMessage;
    }
    // Handle AxiosError objects
    else if (error && typeof error === "object" && "response" in error) {
      const axiosError = error as AxiosError<EmployeeErrorResponse>;
      errorMessage = 
        axiosError.response?.data?.message || 
        axiosError.response?.data?.error || 
        axiosError.message || 
        errorMessage;
    }
    
    dispatch(getAllEmployeesFailed(errorMessage));
    
    // Don't show toast if it's an admin access error (handled globally in HTTP interceptor)
    if (!errorMessage.toLowerCase().includes("admin access required")) {
      toast.error(errorMessage);
    }
  }
};

export const getEmployeeByIdAction = (userId: string) => async (dispatch: AppDispatch) => {
  dispatch(getEmployeeByIdRequest());
  try {
    const response = await getEmployeeTaskCounts(userId);
    // API returns { employee: EmployeeResponse } according to EMPLOYEE_API.md
    if (response.employee) {
      dispatch(getEmployeeByIdSuccess(response.employee));
    } else {
      throw new Error("Invalid response structure: employee data not found");
    }
  } catch (error) {
    let errorMessage = "Failed to fetch employee details";
    
    // Handle string errors (from HTTP interceptor)
    if (typeof error === "string") {
      errorMessage = error;
    }
    // Handle Error objects
    else if (error instanceof Error) {
      errorMessage = error.message || errorMessage;
    }
    // Handle AxiosError objects
    else if (error && typeof error === "object" && "response" in error) {
      const axiosError = error as AxiosError<EmployeeErrorResponse>;
      errorMessage = 
        axiosError.response?.data?.message || 
        axiosError.response?.data?.error || 
        axiosError.message || 
        errorMessage;
    }
    
    dispatch(getEmployeeByIdFailed(errorMessage));
    
    // Don't show toast if it's an admin access error (handled globally in HTTP interceptor)
    if (!errorMessage.toLowerCase().includes("admin access required")) {
      toast.error(errorMessage);
    }
  }
};

export const inviteEmployeeAction = (email: string, cb?: () => void) => async (dispatch: AppDispatch) => {
  dispatch(inviteEmployeeRequest());
  try {
    const response = await inviteUser(email);
    dispatch(inviteEmployeeSuccess());
    toast.success(response?.message || "Invitation sent successfully");
    if (cb) cb();
  } catch (error) {
    let errorMessage = "Failed to send invitation";
    
    // Handle string errors (from HTTP interceptor)
    if (typeof error === "string") {
      errorMessage = error;
    }
    // Handle Error objects
    else if (error instanceof Error) {
      errorMessage = error.message || errorMessage;
    }
    // Handle AxiosError objects
    else if (error && typeof error === "object" && "response" in error) {
      const axiosError = error as AxiosError<{ message?: string; error?: string }>;
      errorMessage = 
        axiosError.response?.data?.message || 
        axiosError.response?.data?.error || 
        axiosError.message || 
        errorMessage;
    }
    
    dispatch(inviteEmployeeFailed(errorMessage));
    
    // Don't show toast if it's an admin access error (handled globally in HTTP interceptor)
    if (!errorMessage.toLowerCase().includes("admin access required")) {
      toast.error(errorMessage);
    }
  }
};

export const getEmployeeStatsAction = (
  userId: string,
  period: "month" | "quarter" | "year",
  periodValue: string,
  projectId?: string
) => async (dispatch: AppDispatch) => {
  dispatch(getEmployeeStatsRequest());
  try {
    const response = await getEmployeeStats(userId, period, periodValue, projectId);
    if (response.stats) {
      dispatch(getEmployeeStatsSuccess(response.stats));
    } else {
      throw new Error("Invalid response structure: stats data not found");
    }
  } catch (error) {
    let errorMessage = "Failed to fetch employee statistics";
    
    // Handle string errors (from HTTP interceptor)
    if (typeof error === "string") {
      errorMessage = error;
    }
    // Handle Error objects
    else if (error instanceof Error) {
      errorMessage = error.message || errorMessage;
    }
    // Handle AxiosError objects
    else if (error && typeof error === "object" && "response" in error) {
      const axiosError = error as AxiosError<{ message?: string; error?: string }>;
      errorMessage = 
        axiosError.response?.data?.message || 
        axiosError.response?.data?.error || 
        axiosError.message || 
        errorMessage;
    }
    
    dispatch(getEmployeeStatsFailed(errorMessage));
    
    // Don't show toast if it's an admin access error (handled globally in HTTP interceptor)
    if (!errorMessage.toLowerCase().includes("admin access required")) {
      toast.error(errorMessage);
    }
  }
};
