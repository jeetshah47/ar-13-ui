import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { TimeTrackingState, TimeTrackingData } from "../../types/Task/TimeTrackingTypes";
import type { ProjectErrorResponse } from "../../types/Project/ProjectErrorResponse";

const initialState: TimeTrackingState = {
  api: {
    data: {
      timeTrackingData: [],
      dailyTimeSpent: {},
    },
    loading: false,
    error: "",
  },
};

const timeTrackingSlice = createSlice({
  name: "timeTracking",
  initialState,
  reducers: {
    getTimeTrackingDataRequest(state) {
      state.api.loading = true;
      state.api.error = "";
      state.api.data.timeTrackingData = [];
      state.api.data.dailyTimeSpent = {};
    },
    getTimeTrackingDataSuccess(state, action: PayloadAction<{ timeTrackingData: TimeTrackingData[] }>) {
      state.api.loading = false;
      state.api.error = "";
      state.api.data.timeTrackingData = action.payload.timeTrackingData;
      
      // Calculate daily time spent totals
      const dailyTotals: Record<string, number> = {};
      action.payload.timeTrackingData.forEach(taskData => {
        if (!dailyTotals[taskData.date]) {
          dailyTotals[taskData.date] = 0;
        }
        dailyTotals[taskData.date] += taskData.totalMinutes;
      });
      state.api.data.dailyTimeSpent = dailyTotals;
    },
    getTimeTrackingDataFailed(state, action: PayloadAction<ProjectErrorResponse>) {
      state.api.loading = false;
      state.api.error = action.payload.error;
    },
    updateTimeTrackingData(state, action: PayloadAction<{ taskId: string; date: string; totalMinutes: number }>) {
      const { taskId, date, totalMinutes } = action.payload;
      
      // Update or add time tracking data for the task
      const existingIndex = state.api.data.timeTrackingData.findIndex(
        item => item.taskId === taskId && item.date === date
      );
      
      if (existingIndex >= 0) {
        state.api.data.timeTrackingData[existingIndex].totalMinutes = totalMinutes;
      } else {
        state.api.data.timeTrackingData.push({
          taskId,
          date,
          totalMinutes,
          entries: []
        });
      }
      
      // Recalculate daily totals
      const dailyTotals: Record<string, number> = {};
      state.api.data.timeTrackingData.forEach(taskData => {
        if (!dailyTotals[taskData.date]) {
          dailyTotals[taskData.date] = 0;
        }
        dailyTotals[taskData.date] += taskData.totalMinutes;
      });
      state.api.data.dailyTimeSpent = dailyTotals;
    },
  },
});

export const {
  getTimeTrackingDataRequest,
  getTimeTrackingDataSuccess,
  getTimeTrackingDataFailed,
  updateTimeTrackingData,
} = timeTrackingSlice.actions;

export const timeTrackingReducer = timeTrackingSlice.reducer;
