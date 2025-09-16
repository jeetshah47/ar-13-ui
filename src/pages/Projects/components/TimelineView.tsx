import React, { useEffect } from "react";
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
import { useAppSelector, type RootState } from "../../../store/store";
import { getAllTaskByProjectId } from "../../../store/apis/taskApis";
import type { TaskResponse } from "../../../store/types/Task/TaskResponse";
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
    backgroundColor: "white",
    color: "rgba(0, 0, 0, 0.87)",
    maxWidth: 120,
    fontSize: theme.typography.pxToRem(12),
    boxShadow: "0px 6px 40px rgba(121, 145, 173, 0.3)",
    borderRadius: "14px",
  },
}));

const TaskTimelineFlex: React.FC = () => {
  const projectListState = useAppSelector((state: RootState) => state.projectListReducer);
  
  const [tasks, setTasks] = React.useState<TaskResponse[]>([]);
  const [loading, setLoading] = React.useState(false);

  // Fetch tasks when project changes
  useEffect(() => {
    const fetchTasks = async () => {
      if (projectListState.common.selectedProjectId) {
        setLoading(true);
        try {
          const response = await getAllTaskByProjectId(projectListState.common.selectedProjectId);
          setTasks(response.tasks);
        } catch {
          // Handle error silently or show user-friendly message
        } finally {
          setLoading(false);
        }
      }
    };

    fetchTasks();
  }, [projectListState.common.selectedProjectId]);

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
      <Paper sx={{ p: 2 }}>
        <Box sx={{ display: "flex" }}>
          {/* Fixed Task Name Sidebar */}
          <Box sx={{ minWidth: "215px", borderRight: "1px solid #E6EBF5", flexShrink: 0 }}>
            <Box height={"78px"} sx={{ borderBottom: "1px solid #E6EBF5" }}>
              <Typography variant="subtitle2" sx={{ p: 1 }}>
                Task Name
              </Typography>
            </Box>
            {tasks.map((task) => (
              <Box
                key={task.id}
                sx={{
                  color: "#222",
                  height: "52px",
                  borderBottom: "1px solid #E6EBF5",
                  display: "flex",
                  alignItems: "center",
                  px: 1,
                }}
              >
                <Typography sx={{ fontSize: "14px" }}>{task.subject}</Typography>
              </Box>
            ))}
          </Box>
          
          {/* Scrollable Time Spent Section */}
          <Box sx={{ overflowX: "auto", flex: 1 }}>
            <Box height={"78px"} sx={{ borderBottom: "1px solid #E6EBF5" }}>
              <Typography variant="subtitle2" sx={{ p: 1 }}>
                Time Spent (Current Month)
              </Typography>
              <Box sx={{ display: "flex", gap: "4px", px: 1, minWidth: "fit-content" }}>
                {days.map((day) => (
                  <Box
                    key={day}
                    sx={{
                      width: "28px",
                      height: "28px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#7D8593",
                      fontWeight: 700,
                      backgroundColor: "#F4F9FD",
                      fontSize: "13px",
                      borderRadius: "7px",
                      flexShrink: 0,
                    }}
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
                      sx={{
                        width: "28px",
                        height: "44px",
                        borderRadius: "7px",
                        backgroundColor: "#F4F9FD",
                        margin: "0 2px",
                        transition: "all 0.2s ease",
                        position: "relative",
                        flexShrink: 0,
                        overflow: "hidden",
                      }}
                    >
                      <HtmlTooltip
                        title={
                          <Box>
                            <Typography color="inherit" variant="subtitle2">
                              {task.subject}
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
