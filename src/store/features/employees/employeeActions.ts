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
} from "./employeeSlice";
import { getAllEmployees, getEmployeeById } from "../../apis/employeesApi";
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
    toast.error(errorMessage);
  }
};

export const getEmployeeByIdAction = (userId: string) => async (dispatch: AppDispatch) => {
  dispatch(getEmployeeByIdRequest());
  try {
    const response = await getEmployeeById(userId);
    dispatch(getEmployeeByIdSuccess(response.employee));
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
    toast.error(errorMessage);
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
    toast.error(errorMessage);
  }
};
