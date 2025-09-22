import { http } from "../../config/http";
import type { EmployeeResponse, EmployeeListResponse } from "../types/Employee/EmployeeResponse";

export async function getAllEmployees(): Promise<EmployeeListResponse> {
  const url = `http://localhost:3000/api/employees/list`;
  const result = await http.get(url);
  return result.data;
}

export async function getEmployeeById(userId: string): Promise<{ employee: EmployeeResponse }> {
  const url = `http://localhost:3000/api/employees/list/${userId}`;
  const result = await http.get(url);
  return result.data;
}
