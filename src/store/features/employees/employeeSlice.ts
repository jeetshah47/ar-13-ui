import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { EmployeeState } from "./employeeTypes";
import type { EmployeeResponse, EmployeeListResponse } from "../../types/Employee/EmployeeResponse";

const initialState: EmployeeState = {
  employees: [],
  selectedEmployee: null,
  totalEmployees: 0,
  loading: false,
  error: "",
};

const employeeSlice = createSlice({
  name: "employees",
  initialState,
  reducers: {
    getAllEmployeesRequest(state) {
      state.loading = true;
      state.error = "";
    },
    getAllEmployeesSuccess(state, action: PayloadAction<EmployeeListResponse>) {
      state.loading = false;
      state.employees = action.payload.employees;
      state.totalEmployees = action.payload.totalEmployees;
      state.error = "";
    },
    getAllEmployeesFailed(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    getEmployeeByIdRequest(state) {
      state.loading = true;
      state.error = "";
    },
    getEmployeeByIdSuccess(state, action: PayloadAction<EmployeeResponse>) {
      state.loading = false;
      state.selectedEmployee = action.payload;
      state.error = "";
    },
    getEmployeeByIdFailed(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    clearSelectedEmployee(state) {
      state.selectedEmployee = null;
    },
    clearEmployeeError(state) {
      state.error = "";
    },
  },
});

export const {
  getAllEmployeesRequest,
  getAllEmployeesSuccess,
  getAllEmployeesFailed,
  getEmployeeByIdRequest,
  getEmployeeByIdSuccess,
  getEmployeeByIdFailed,
  clearSelectedEmployee,
  clearEmployeeError,
} = employeeSlice.actions;

export const employeeReducer = employeeSlice.reducer;
