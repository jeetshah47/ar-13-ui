import { createAsyncThunk } from "@reduxjs/toolkit";
import { getTimeSpentForDateRange } from "../../apis/timeTrackingApis";
import { getTimeTrackingDataRequest, getTimeTrackingDataSuccess, getTimeTrackingDataFailed } from "./timeTrackingSlice";

export const fetchTimeTrackingData = createAsyncThunk(
  "timeTracking/fetchTimeTrackingData",
  async (
    { projectId, startDate, endDate }: { projectId: string; startDate: string; endDate: string },
    { dispatch, rejectWithValue }
  ) => {
    try {
      dispatch(getTimeTrackingDataRequest());
      
      // For now, we'll simulate the API call since the backend endpoint might not exist yet
      // In a real implementation, you would call the actual API
      const response = await getTimeSpentForDateRange(projectId, startDate, endDate);
      
      dispatch(getTimeTrackingDataSuccess(response));
      return response;
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || "Failed to fetch time tracking data";
      dispatch(getTimeTrackingDataFailed({ error: errorMessage }));
      return rejectWithValue({ error: errorMessage });
    }
  }
);

export const fetchTimeTrackingDataForTasks = createAsyncThunk(
  "timeTracking/fetchTimeTrackingDataForTasks",
  async (
    { projectId: _projectId, taskIds: _taskIds, startDate: _startDate, endDate: _endDate }: { 
      projectId: string; 
      taskIds: string[]; 
      startDate: string; 
      endDate: string 
    },
    { dispatch, rejectWithValue }
  ) => {
    try {
      dispatch(getTimeTrackingDataRequest());
      
      // Aggregate time spent data for multiple tasks
      const timeTrackingData: any[] = [];
      
      // This would be replaced with actual API calls to get time spent for each task
      // For now, we'll return empty data
      const response = { timeTrackingData };
      
      dispatch(getTimeTrackingDataSuccess(response));
      return response;
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || "Failed to fetch time tracking data";
      dispatch(getTimeTrackingDataFailed({ error: errorMessage }));
      return rejectWithValue({ error: errorMessage });
    }
  }
);
