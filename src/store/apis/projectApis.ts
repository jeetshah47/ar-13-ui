import axios from "axios";
import type { ProjectResponse } from "../types/ProjectResponse";

const token = localStorage.getItem("authToken");
axios.interceptors.request.use((req) => {
  req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export async function getAllProjects(): Promise<ProjectResponse[]> {
  const url = `http://localhost:3000/api/project/all`;
//   const token = localStorage.getItem("authToken");
  const result = await axios.get(url);
  return result.data;
}
