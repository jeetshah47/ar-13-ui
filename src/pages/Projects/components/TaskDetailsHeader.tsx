import * as React from "react";
import { Box, Button, SvgIcon, Typography, useMediaQuery, useTheme, Select, MenuItem, FormControl } from "@mui/material";
import { SwapHoriz } from "@mui/icons-material";
import EditIcon from "../../../assets/icons/general/gear.svg?react";
import FilterIcon from "../../../assets/icons/general/calendar-5.svg?react";
import { useResourceAccess } from "../../../store/hooks/useResourceAccess";
import type { ProjectResponse } from "../../../store/types/Project/ProjectResponse";
import { RequirePermission } from "../../../common/components/RBAC/RequirePermission";
import { usePermissions } from "../../../store/hooks/usePermissions";
import type { TaskStatus } from "../../../store/types/Task/TaskTypes";
import { mapStatusToUnified } from "../../../pages/Projects/constants/taskStatus.constants";
import { startTimeTracking, stopTimeTracking } from "../../../store/apis/taskApis";
import toast from "react-hot-toast";

interface TaskDetailsHeaderProps {
  onEditClick: () => void;
  onTransferClick: () => void;
}

const TaskDetailsHeader = ({ onEditClick, onTransferClick }: TaskDetailsHeaderProps) => {
  const { isAdmin } = usePermissions();
  
  // theme and useMediaQuery are used in TaskDetailsContent component below
  return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          pb: { xs: "10px", sm: "20px", md: "22px", lg: "24px" },
          flexShrink: 0,
          flexWrap: { xs: "wrap", sm: "wrap", md: "nowrap", lg: "nowrap" },
          gap: { xs: "8px", sm: "8px", md: 0, lg: 0 },
        }}
      >
      <Typography sx={{ 
        fontSize: { xs: "22px", sm: "20px", md: "20px", lg: "20px" }, 
        fontWeight: { xs: 700, sm: 400, md: 400, lg: 400 },
        lineHeight: { xs: "1.36", sm: "1.5", md: "1.5", lg: "1.5" },
      }}>
        Task Details
      </Typography>
      <Box sx={{ display: "flex", gap: { xs: "6px", sm: "8px" } }}>
        <RequirePermission permission="tasks:write">
          <Box
            onClick={onEditClick}
            sx={{
              backgroundColor: "#fff",
              display: "flex",
              padding: { xs: "8px", sm: "10px" },
              borderRadius: "14px",
              cursor: "pointer",
              transition: "all 0.2s ease",
              "&:hover": {
                backgroundColor: "#f5f5f5",
                transform: "scale(1.05)",
              },
            }}
          >
            <SvgIcon sx={{ fontSize: { xs: "20px", sm: "24px" } }} component={EditIcon} />
          </Box>
        </RequirePermission>
        {isAdmin() && (
          <Box
            onClick={onTransferClick}
            sx={{
              backgroundColor: "#fff",
              display: "flex",
              padding: { xs: "8px", sm: "10px" },
              borderRadius: "14px",
              cursor: "pointer",
              transition: "all 0.2s ease",
              "&:hover": {
                backgroundColor: "#f5f5f5",
                transform: "scale(1.05)",
              },
            }}
            title="Transfer Task"
          >
            <SwapHoriz sx={{ fontSize: { xs: "20px", sm: "24px" }, color: "text.primary" }} />
          </Box>
        )}
        <Box
          sx={{
            backgroundColor: "#fff",
            display: "flex",
            padding: { xs: "8px", sm: "10px" },
            borderRadius: "14px",
          }}
        >
          <SvgIcon sx={{ fontSize: { xs: "20px", sm: "24px" } }} component={FilterIcon} />
        </Box>
      </Box>
    </Box>
  );
};

interface TaskDetailsContentProps {
  taskCode?: string;
  taskSubject?: string;
  currentStatus: string;
  onStatusChange: (status: string) => void;
  onClaimTaskClick: () => void;
  project?: ProjectResponse;
  taskStatuses?: TaskStatus[];
  projectId?: string;
  taskId?: string;
  children: React.ReactNode;
}

export const TaskDetailsContent = ({
  taskCode,
  taskSubject,
  currentStatus,
  onStatusChange,
  onClaimTaskClick,
  project,
  taskStatuses = [],
  projectId,
  taskId,
  children,
}: TaskDetailsContentProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { canClaimTask } = useResourceAccess();
  const showClaimButton = project ? canClaimTask(project) : false;
  const [isStartingTask, setIsStartingTask] = React.useState(false);
  const [isEndingTask, setIsEndingTask] = React.useState(false);

  // Check if task is in progress
  const normalizedCurrentStatus = currentStatus ? mapStatusToUnified(currentStatus) : null;
  // mapStatusToUnified maps "in_progress" to "todo", so check for "todo"
  const isTaskInProgress = normalizedCurrentStatus === "todo";
  const isTaskPending = normalizedCurrentStatus === "pending" || !normalizedCurrentStatus;

  // Handle Start Task
  const handleStartTask = async () => {
    if (!projectId || !taskId) {
      toast.error("Project ID or Task ID is missing");
      return;
    }

    setIsStartingTask(true);
    try {
      // Start time tracking
      await startTimeTracking(projectId, taskId);
      
      // Update status to in_progress
      onStatusChange("in_progress");
      
      toast.success("Task started successfully");
    } catch (error: any) {
      const errorMessage = error?.response?.data?.error || error?.message || "Failed to start task";
      toast.error(errorMessage);
    } finally {
      setIsStartingTask(false);
    }
  };

  // Handle End Task
  const handleEndTask = async () => {
    if (!projectId || !taskId) {
      toast.error("Project ID or Task ID is missing");
      return;
    }

    setIsEndingTask(true);
    try {
      // Stop time tracking
      await stopTimeTracking(projectId, taskId);
      
      // Update status to pending
      onStatusChange("pending");
      
      toast.success("Task ended successfully");
    } catch (error: any) {
      const errorMessage = error?.response?.data?.error || error?.message || "Failed to end task";
      toast.error(errorMessage);
    } finally {
      setIsEndingTask(false);
    }
  };

  // Find the current status object by matching unified status values
  // Try to match by normalizing both the currentStatus and taskStatus values
  const currentStatusObj = taskStatuses.find((status) => {
    if (!status.value) return false;
    const normalizedStatusValue = mapStatusToUnified(status.value);
    return normalizedStatusValue === normalizedCurrentStatus;
  });

  // Filter active statuses and sort by order if available, otherwise keep original order
  const sortedStatuses = [...taskStatuses]
    .filter((status) => status.isActive !== false) // Include statuses where isActive is true or undefined
    .sort((a, b) => {
      if (a.order !== undefined && b.order !== undefined) {
        return a.order - b.order;
      }
      return 0;
    });

  // Get the selected value for the dropdown
  // Use the actual status value from taskStatuses if found, otherwise use currentStatus
  const selectedValue = currentStatusObj?.value || currentStatus || "";

  return (
    <Box
      id="project-detail-content"
      sx={{
        backgroundColor: "#fff",
        flex: 1,
        borderRadius: { xs: "20px", sm: "20px", md: "24px", lg: "24px" },
        padding: { xs: "20px", sm: "24px", md: "26px", lg: "30px" },
        overflowY: { xs: "visible", sm: "visible", md: "auto", lg: "auto" },
        overflowX: "hidden",
        minHeight: { xs: "auto", sm: "auto", md: 0, lg: 0 },
        maxHeight: { xs: "none", sm: "none", md: "100%", lg: "100%" },
        maxWidth: "100%",
        width: "100%",
        minWidth: 0,
        boxSizing: "border-box",
        scrollBehavior: "smooth",
        WebkitOverflowScrolling: "touch",
        "@media (min-width: 1200px) and (max-width: 1600px)": {
          padding: "24px",
        },
      }}
    >
      <Typography 
        color="secondary.main"
        sx={{ fontSize: { xs: "12px", sm: "14px" } }}
      >
        {taskCode}
      </Typography>
        <Box
          sx={{
            paddingTop: "4px",
            display: "flex",
            alignItems: { xs: "flex-start", sm: "flex-start", md: "center", lg: "center" },
            justifyContent: "space-between",
            flexDirection: { xs: "column", sm: "column", md: "row", lg: "row" },
            gap: { xs: 2, sm: 2, md: 0, lg: 0 },
          }}
        >
        <Typography 
          variant="h6" 
          fontWeight={"700"}
          sx={{ 
            fontSize: { xs: "18px", sm: "19px", md: "19px", lg: "20px" },
            lineHeight: { xs: "1.4", sm: "1.45", md: "1.45", lg: "1.5" },
            width: { xs: "100%", sm: "100%", md: "auto", lg: "auto" },
            wordBreak: "break-word",
            overflowWrap: "break-word",
            maxWidth: "100%",
          }}
        >
          {taskSubject}
        </Typography>
        <Box sx={{ 
          display: "flex", 
          gap: { xs: "8px", sm: "12px", md: "14px", lg: "16px" }, 
          alignItems: "center",
          flexDirection: { xs: "column", sm: "column", md: "row", lg: "row" },
          width: { xs: "100%", sm: "100%", md: "auto", lg: "auto" },
        }}>
          <Box sx={{ width: { xs: "100%", sm: "100%", md: "auto", lg: "auto" }, minWidth: { xs: "100%", sm: "100%", md: "200px", lg: "200px" } }}>
            <FormControl fullWidth={isMobile} sx={{ minWidth: { xs: "100%", sm: "100%", md: "200px", lg: "200px" } }}>
              <Select
                value={selectedValue}
                onChange={(e) => onStatusChange(e.target.value)}
                displayEmpty
                sx={{
                  borderRadius: "14px",
                  backgroundColor: "#fff",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#E0E0E0",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#3F8CFF",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#3F8CFF",
                  },
                  "& .MuiSelect-select": {
                    padding: { xs: "10px 16px", sm: "12px 20px" },
                    fontSize: { xs: "14px", sm: "16px" },
                    fontWeight: 500,
                  },
                }}
              >
                {sortedStatuses.length > 0 ? (
                  sortedStatuses.map((status) => (
                    <MenuItem key={status.id || status.value} value={status.value}>
                      {status.displayName || status.value}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem value={currentStatus} disabled>
                    {currentStatusObj?.displayName || currentStatus || "No status"}
                  </MenuItem>
                )}
              </Select>
            </FormControl>
          </Box>
          {showClaimButton && (
            <Button
              variant="contained"
              onClick={onClaimTaskClick}
              fullWidth={isMobile}
              sx={{
                backgroundColor: "#3F8CFF",
                color: "#FFFFFF",
                borderRadius: "14px",
                padding: { xs: "10px 16px", sm: "13px 20px" },
                fontWeight: 700,
                fontSize: { xs: "14px", sm: "16px" },
                lineHeight: 1.364,
                boxShadow: "0px 6px 12px 0px rgba(63, 140, 255, 0.26)",
                "&:hover": {
                  backgroundColor: "#3A81EB",
                  boxShadow: "0px 6px 12px 0px rgba(63, 140, 255, 0.42)",
                },
              }}
            >
              Claim Task
            </Button>
          )}
          {projectId && taskId && isTaskPending && (
            <Button
              variant="contained"
              onClick={handleStartTask}
              disabled={isStartingTask}
              fullWidth={isMobile}
              sx={{
                backgroundColor: "#4CAF50",
                color: "#FFFFFF",
                borderRadius: "14px",
                padding: { xs: "10px 16px", sm: "13px 20px" },
                fontWeight: 700,
                fontSize: { xs: "14px", sm: "16px" },
                lineHeight: 1.364,
                boxShadow: "0px 6px 12px 0px rgba(76, 175, 80, 0.26)",
                "&:hover": {
                  backgroundColor: "#45a049",
                  boxShadow: "0px 6px 12px 0px rgba(76, 175, 80, 0.42)",
                },
                "&:disabled": {
                  backgroundColor: "#81c784",
                  color: "#FFFFFF",
                },
              }}
            >
              {isStartingTask ? "Starting..." : "Start Task"}
            </Button>
          )}
          {projectId && taskId && isTaskInProgress && (
            <Button
              variant="contained"
              onClick={handleEndTask}
              disabled={isEndingTask}
              fullWidth={isMobile}
              sx={{
                backgroundColor: "#f44336",
                color: "#FFFFFF",
                borderRadius: "14px",
                padding: { xs: "10px 16px", sm: "13px 20px" },
                fontWeight: 700,
                fontSize: { xs: "14px", sm: "16px" },
                lineHeight: 1.364,
                boxShadow: "0px 6px 12px 0px rgba(244, 67, 54, 0.26)",
                "&:hover": {
                  backgroundColor: "#da190b",
                  boxShadow: "0px 6px 12px 0px rgba(244, 67, 54, 0.42)",
                },
                "&:disabled": {
                  backgroundColor: "#e57373",
                  color: "#FFFFFF",
                },
              }}
            >
              {isEndingTask ? "Ending..." : "End Task"}
            </Button>
          )}
        </Box>
      </Box>
      {children}
    </Box>
  );
};

export default TaskDetailsHeader;
