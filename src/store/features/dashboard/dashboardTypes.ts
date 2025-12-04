import type { DashboardResponse } from "../../types/Dashboard/DashboardResponse";

export interface DashboardState {
  api: {
    data: { datas: DashboardResponse };
    loading: boolean;
    error: string;
  };
}
