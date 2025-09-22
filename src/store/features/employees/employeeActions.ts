import type { AppDispatch } from "../../store";
import {
  getAllEmployeesRequest,
  getAllEmployeesSuccess,
  getAllEmployeesFailed,
  getEmployeeByIdRequest,
  getEmployeeByIdSuccess,
  getEmployeeByIdFailed,
} from "./employeeSlice";
import { getAllEmployees, getEmployeeById } from "../../apis/employeesApi";
import type { AxiosError } from "axios";
import type { EmployeeErrorResponse } from "../../types/Employee/EmployeeResponse";
import toast from "react-hot-toast";

export const getAllEmployeesAction = () => async (dispatch: AppDispatch) => {
  dispatch(getAllEmployeesRequest());
  try {
    const response = await getAllEmployees();
    dispatch(getAllEmployeesSuccess(response));
  } catch (error) {
    const axiosError = error as AxiosError<EmployeeErrorResponse>;
    const errorMessage = axiosError.response?.data?.message || "Failed to fetch employees";
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
    const axiosError = error as AxiosError<EmployeeErrorResponse>;
    const errorMessage = axiosError.response?.data?.message || "Failed to fetch employee details";
    dispatch(getEmployeeByIdFailed(errorMessage));
    toast.error(errorMessage);
  }
};
