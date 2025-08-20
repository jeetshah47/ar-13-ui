import axios from "axios";
import type { ProjectResponse } from "../types/Project/ProjectResponse";

const token = localStorage.getItem("authToken");
axios.interceptors.request.use((req) => {
  req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export async function getAllProjects(): Promise<{
  projects: ProjectResponse[];
}> {
  const url = `http://localhost:3000/api/project/all`;
  //   const token = localStorage.getItem("authToken");
  const result = await axios.get(url);
  console.log("resul", result.data);
  return result.data;
}
