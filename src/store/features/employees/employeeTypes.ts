import type { EmployeeResponse, EmployeeListResponse } from "../../types/Employee/EmployeeResponse";
import type { EmployeeStats } from "../../types/Employee/EmployeeStatsResponse";

export interface EmployeeState {
  employees: EmployeeResponse[];
  selectedEmployee: EmployeeResponse | null;
  totalEmployees: number;
  loading: boolean;
  error: string;
  inviting?: boolean;
  inviteError?: string;
  stats: EmployeeStats | null;
  statsLoading: boolean;
  statsError: string;
}

export interface EmployeeActionTypes {
  // Get all employees
  GET_ALL_EMPLOYEES_REQUEST: "GET_ALL_EMPLOYEES_REQUEST";
  GET_ALL_EMPLOYEES_SUCCESS: "GET_ALL_EMPLOYEES_SUCCESS";
  GET_ALL_EMPLOYEES_FAILED: "GET_ALL_EMPLOYEES_FAILED";
  
  // Get employee by ID
  GET_EMPLOYEE_BY_ID_REQUEST: "GET_EMPLOYEE_BY_ID_REQUEST";
  GET_EMPLOYEE_BY_ID_SUCCESS: "GET_EMPLOYEE_BY_ID_SUCCESS";
  GET_EMPLOYEE_BY_ID_FAILED: "GET_EMPLOYEE_BY_ID_FAILED";
  
  // Clear selected employee
  CLEAR_SELECTED_EMPLOYEE: "CLEAR_SELECTED_EMPLOYEE";
  
  // Clear error
  CLEAR_EMPLOYEE_ERROR: "CLEAR_EMPLOYEE_ERROR";
}

export interface GetAllEmployeesRequestAction {
  type: EmployeeActionTypes["GET_ALL_EMPLOYEES_REQUEST"];
}

export interface GetAllEmployeesSuccessAction {
  type: EmployeeActionTypes["GET_ALL_EMPLOYEES_SUCCESS"];
  payload: EmployeeListResponse;
}

export interface GetAllEmployeesFailedAction {
  type: EmployeeActionTypes["GET_ALL_EMPLOYEES_FAILED"];
  payload: string;
}

export interface GetEmployeeByIdRequestAction {
  type: EmployeeActionTypes["GET_EMPLOYEE_BY_ID_REQUEST"];
}

export interface GetEmployeeByIdSuccessAction {
  type: EmployeeActionTypes["GET_EMPLOYEE_BY_ID_SUCCESS"];
  payload: EmployeeResponse;
}

export interface GetEmployeeByIdFailedAction {
  type: EmployeeActionTypes["GET_EMPLOYEE_BY_ID_FAILED"];
  payload: string;
}

export interface ClearSelectedEmployeeAction {
  type: EmployeeActionTypes["CLEAR_SELECTED_EMPLOYEE"];
}

export interface ClearEmployeeErrorAction {
  type: EmployeeActionTypes["CLEAR_EMPLOYEE_ERROR"];
}

export type EmployeeAction =
  | GetAllEmployeesRequestAction
  | GetAllEmployeesSuccessAction
  | GetAllEmployeesFailedAction
  | GetEmployeeByIdRequestAction
  | GetEmployeeByIdSuccessAction
  | GetEmployeeByIdFailedAction
  | ClearSelectedEmployeeAction
  | ClearEmployeeErrorAction;
