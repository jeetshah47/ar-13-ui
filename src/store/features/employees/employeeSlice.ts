import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { EmployeeState } from "./employeeTypes";
import type { EmployeeResponse, EmployeeListResponse } from "../../types/Employee/EmployeeResponse";
import type { EmployeeStats } from "../../types/Employee/EmployeeStatsResponse";

const initialState: EmployeeState = {
  employees: [],
  selectedEmployee: null,
  totalEmployees: 0,
  loading: false,
  error: "",
  inviting: false,
  inviteError: "",
  stats: null,
  statsLoading: false,
  statsError: "",
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
    inviteEmployeeRequest(state) {
      state.inviting = true;
      state.inviteError = "";
    },
    inviteEmployeeSuccess(state) {
      state.inviting = false;
      state.inviteError = "";
    },
    inviteEmployeeFailed(state, action: PayloadAction<string>) {
      state.inviting = false;
      state.inviteError = action.payload;
    },
    getEmployeeStatsRequest(state) {
      state.statsLoading = true;
      state.statsError = "";
    },
    getEmployeeStatsSuccess(state, action: PayloadAction<EmployeeStats>) {
      state.statsLoading = false;
      state.stats = action.payload;
      state.statsError = "";
    },
    getEmployeeStatsFailed(state, action: PayloadAction<string>) {
      state.statsLoading = false;
      state.statsError = action.payload;
    },
    clearEmployeeStats(state) {
      state.stats = null;
      state.statsError = "";
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
  inviteEmployeeRequest,
  inviteEmployeeSuccess,
  inviteEmployeeFailed,
  getEmployeeStatsRequest,
  getEmployeeStatsSuccess,
  getEmployeeStatsFailed,
  clearEmployeeStats,
} = employeeSlice.actions;

export const employeeReducer = employeeSlice.reducer;
