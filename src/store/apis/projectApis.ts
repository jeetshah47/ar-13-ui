import type { ProjectResponse } from "../types/Project/ProjectResponse";
import { http } from "../../config/http";


export async function getAllProjects(): Promise<{
  projects: ProjectResponse[];
}> {
  const url = `http://localhost:3000/api/project/all`;
  //   const token = localStorage.getItem("authToken");
  const result = await http.get(url);
  console.log("resul", result.data);
  return result.data;
}
