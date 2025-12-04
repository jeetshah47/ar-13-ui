import React, { useEffect, useRef } from "react";
import {
  Box,
  Paper,
  styled,
  Tooltip,
  tooltipClasses,
  Typography,
  type TooltipProps,
} from "@mui/material";
import { blurAnimation } from "../../../common/animation/cssAnimation";
import { useAppDispatch, useAppSelector, type RootState } from "../../../store/store";
import { getTaskListAction } from "../../../store/features/task/projectAction";
import type { TimeSpentEntry } from "../../../store/types/Task/TaskTypes";

// Helper function to format time spent
const formatTimeSpent = (minutes: number): string => {
  if (minutes === 0) return "0h";
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
};

// Helper function to get time spent height for visualization (matching Figma design)
const getTimeSpentHeight = (minutes: number, maxMinutes: number = 480): string => {
  if (minutes === 0) return "0px";
  const percentage = Math.min(minutes / maxMinutes, 1);
  const height = Math.max(percentage * 44, 2); // Minimum 2px height for visibility
  return `${height}px`;
};

// Helper function to get time spent for a specific day
const getTimeSpentForDay = (timeSpentEntries: TimeSpentEntry[], day: number): number => {
  const currentDate = new Date();
  const targetDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
  const dateString = targetDate.toISOString().split('T')[0];
  
  return timeSpentEntries
    .filter(entry => entry.date === dateString)
    .reduce((total, entry) => total + entry.timeSpent, 0);
};

const days = Array.from({ length: 30 }, (_, i) => i + 1);


const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.primary,
    maxWidth: 120,
    fontSize: theme.typography.pxToRem(12),
    boxShadow: theme.shadows[6],
    borderRadius: "14px",
  },
}));

const TaskTimelineFlex: React.FC = () => {
  const dispatch = useAppDispatch();
  const selectedProjectId = useAppSelector((state: RootState) => state.projectListReducer.common.selectedProjectId);
  const taskListState = useAppSelector((state: RootState) => state.taskListReducer.api);
  const lastFetchedProjectRef = useRef<string | null>(null);

  // Fetch tasks using Redux action when project changes, but prevent duplicate fetches
  useEffect(() => {
    // Only fetch if:
    // 1. Project ID exists
    // 2. Project ID changed from last fetch
    // 3. Not already loading
    if (
      selectedProjectId && 
      selectedProjectId !== lastFetchedProjectRef.current &&
      !taskListState?.loading
    ) {
      lastFetchedProjectRef.current = selectedProjectId;
      dispatch(getTaskListAction(selectedProjectId));
    }
    
    // Reset ref when project is cleared
    if (!selectedProjectId) {
      lastFetchedProjectRef.current = null;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, selectedProjectId]); // Don't include loading to avoid loops

  const tasks = taskListState?.data?.tasks || [];
  const loading = taskListState?.loading || false;

  // Use a fixed maximum scale for better visualization (8 hours = 480 minutes)
  const maxTimeSpent = 480; // 8 hours in minutes

  if (loading) {
    return (
      <Box sx={{ p: 3, ...blurAnimation }}>
        <Typography variant="h6" gutterBottom>
          Loading tasks...
        </Typography>
      </Box>
    );
  }

  if (!tasks || tasks.length === 0) {
    return (
      <Box sx={{ p: 3, ...blurAnimation }}>
        <Typography variant="h6" gutterBottom>
          Tasks
        </Typography>
        <Typography>No tasks found for this project.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, ...blurAnimation }}>
      <Typography variant="h6" gutterBottom>
        Tasks Timeline
      </Typography>
      <Paper sx={{ p: 2, backgroundColor: "background.paper" }}>
        <Box sx={{ display: "flex" }}>
          {/* Fixed Task Name Sidebar */}
          <Box sx={(theme) => ({ minWidth: "215px", borderRight: `1px solid ${theme.palette.divider}`, flexShrink: 0 })}>
            <Box height={"78px"} sx={(theme) => ({ borderBottom: `1px solid ${theme.palette.divider}` })}>
              <Typography variant="subtitle2" sx={{ p: 1 }}>
                Task Name
              </Typography>
            </Box>
            {tasks.map((task) => (
              <Box
                key={task.id}
                sx={(theme) => ({
                  color: theme.palette.text.primary,
                  height: "52px",
                  borderBottom: `1px solid ${theme.palette.divider}`,
                  display: "flex",
                  alignItems: "center",
                  px: 1,
                })}
              >
                <Typography sx={{ fontSize: "14px" }}>
                  {task.drawingInfo?.typeName || task.subject}
                </Typography>
              </Box>
            ))}
          </Box>
          
          {/* Scrollable Time Spent Section */}
          <Box sx={{ overflowX: "auto", flex: 1 }}>
            <Box height={"78px"} sx={(theme) => ({ borderBottom: `1px solid ${theme.palette.divider}` })}>
              <Typography variant="subtitle2" sx={{ p: 1 }}>
                Time Spent (Current Month)
              </Typography>
              <Box sx={{ display: "flex", gap: "4px", px: 1, minWidth: "fit-content" }}>
                {days.map((day) => (
                  <Box
                    key={day}
                    sx={(theme) => ({
                      width: "28px",
                      height: "28px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: theme.palette.text.secondary,
                      fontWeight: 700,
                      backgroundColor: theme.palette.grey[50],
                      fontSize: "13px",
                      borderRadius: "7px",
                      flexShrink: 0,
                    })}
                  >
                    {day}
                  </Box>
                ))}
              </Box>
            </Box>
            {tasks.map((task) => (
              <Box
                key={task.id}
                sx={{ display: "flex", alignItems: "center", height: "52px", minWidth: "fit-content" }}
              >
                {days.map((day) => {
                  const timeSpent = getTimeSpentForDay(task.timeSpent || [], day);
                  const height = getTimeSpentHeight(timeSpent, maxTimeSpent);
                  
                  return (
                    <Box
                      key={day}
                      sx={(theme) => ({
                        width: "28px",
                        height: "44px",
                        borderRadius: "7px",
                        backgroundColor: theme.palette.grey[50],
                        margin: "0 2px",
                        transition: "all 0.2s ease",
                        position: "relative",
                        flexShrink: 0,
                        overflow: "hidden",
                      })}
                    >
                      <HtmlTooltip
                        title={
                          <Box>
                            <Typography color="inherit" variant="subtitle2">
                              {task.drawingInfo?.typeName || task.subject}
                            </Typography>
                            <Typography variant="body2">
                              Date: {day}/{new Date().getMonth() + 1}/{new Date().getFullYear()}
                            </Typography>
                            <Typography variant="body2">
                              Time Spent: {formatTimeSpent(timeSpent)}
                            </Typography>
                            {(task.timeSpent || [])
                              .filter(entry => {
                                const currentDate = new Date();
                                const targetDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
                                return entry.date === targetDate.toISOString().split('T')[0];
                              })
                              .map((entry, index) => (
                                <Typography key={index} variant="caption" display="block">
                                  {entry.description || 'No description'}
                                </Typography>
                              ))}
                          </Box>
                        }
                      >
                        <Box sx={{ width: "100%", height: "100%", position: "relative" }}>
                          {timeSpent > 0 && (
                            <Box
                              sx={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                width: "100%",
                                height: height,
                                backgroundColor: "#A7CAFF",
                                borderRadius: "7px",
                                transition: "all 0.2s ease",
                              }}
                            />
                          )}
                        </Box>
                      </HtmlTooltip>
                    </Box>
                  );
                })}
              </Box>
            ))}
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default TaskTimelineFlex;
