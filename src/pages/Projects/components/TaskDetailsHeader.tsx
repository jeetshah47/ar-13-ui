import * as React from "react";
import { Box, Button, SvgIcon, Typography, useMediaQuery, useTheme } from "@mui/material";
import { SwapHoriz } from "@mui/icons-material";
import EditIcon from "../../../assets/icons/general/gear.svg?react";
import FilterIcon from "../../../assets/icons/general/calendar-5.svg?react";
import { useResourceAccess } from "../../../store/hooks/useResourceAccess";
import type { ProjectResponse } from "../../../store/types/Project/ProjectResponse";
import { RequirePermission } from "../../../common/components/RBAC/RequirePermission";
import { usePermissions } from "../../../store/hooks/usePermissions";
import type { TaskStatus } from "../../../store/types/Task/TaskTypes";
import { normalizeTaskStatus, TASK_STATUS } from "../../../pages/Projects/constants/taskStatus.constants";
import toast from "react-hot-toast";
import { useAppSelector } from "../../../store/store";

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
  onStatusChange: () => void; // Changed to just open modal, no parameter needed
  onClaimTaskClick: () => void;
  refreshKey?: number; // Key to trigger status refresh
  project?: ProjectResponse;
  taskStatuses?: TaskStatus[];
  projectId?: string;
  taskId?: string;
  assigneeId?: string; // ID of the user assigned to the task
  children: React.ReactNode;
}

export const TaskDetailsContent = ({
  taskCode,
  taskSubject,
  currentStatus,
  onStatusChange,
  onClaimTaskClick,
  refreshKey,
  project,
  taskStatuses = [],
  projectId,
  taskId,
  assigneeId,
  children,
}: TaskDetailsContentProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { canClaimTask } = useResourceAccess();
  const authState = useAppSelector((state) => state.authReducer);
  const currentUserId = authState.api.uid;
  
  // Check if user can claim task AND task is not already assigned to them
  const canShowClaimButton = project ? canClaimTask(project) : false;
  const isTaskAssignedToCurrentUser = assigneeId && currentUserId && assigneeId === currentUserId;
  const showClaimButton = canShowClaimButton && !isTaskAssignedToCurrentUser;

  // Check if task is in progress
  const normalizedCurrentStatus = currentStatus ? normalizeTaskStatus(currentStatus) : null;
  const isTaskInProgress = normalizedCurrentStatus === TASK_STATUS.IN_PROGRESS;

  // Handle End Task
  const handleEndTask = async () => {
    if (!projectId || !taskId) {
      toast.error("Project ID or Task ID is missing");
      return;
    }

    try {
      // Update status to pending
      onStatusChange(TASK_STATUS.PENDING);
      
      toast.success("Task ended successfully");
    } catch (error: any) {
      const errorMessage = error?.response?.data?.error || error?.message || "Failed to end task";
      toast.error(errorMessage);
    }
  };

  // Find the current status object by matching normalized status values for display
  const currentStatusObj = taskStatuses.find((status) => {
    if (!status.value) return false;
    const normalizedStatusValue = normalizeTaskStatus(status.value);
    return normalizedStatusValue === normalizedCurrentStatus;
  });

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
            gap: { xs: 2, sm: 2, md: 2, lg: 2 },
          }}
        >
        <Typography 
          variant="h6" 
          fontWeight={"700"}
          sx={{ 
            fontSize: { xs: "18px", sm: "19px", md: "19px", lg: "20px" },
            lineHeight: { xs: "1.4", sm: "1.45", md: "1.45", lg: "1.5" },
            width: { xs: "100%", sm: "100%", md: "auto", lg: "auto" },
            flex: { xs: "1 1 100%", sm: "1 1 100%", md: "1 1 auto", lg: "1 1 auto" },
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
          alignItems: { xs: "stretch", sm: "stretch", md: "center", lg: "center" },
          flexDirection: { xs: "column", sm: "column", md: "row", lg: "row" },
          width: { xs: "100%", sm: "100%", md: "auto", lg: "auto" },
          flexShrink: 0,
        }}>
          <Button
            variant="outlined"
            onClick={onStatusChange}
            fullWidth={isMobile}
            sx={{
              borderColor: "#E0E0E0",
              color: "#3F8CFF",
              borderRadius: "14px",
              padding: { xs: "10px 16px", sm: "12px 20px" },
              height: { xs: "40px", sm: "44px", md: "44px", lg: "44px" },
              fontWeight: 500,
              fontSize: { xs: "14px", sm: "16px" },
              whiteSpace: "nowrap",
              backgroundColor: "#fff",
              "&:hover": {
                borderColor: "#3F8CFF",
                backgroundColor: "#F4F9FD",
              },
            }}
          >
            {currentStatusObj?.displayName || currentStatus || "Change Status"}
          </Button>
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
                height: { xs: "40px", sm: "44px", md: "44px", lg: "44px" },
                fontWeight: 700,
                fontSize: { xs: "14px", sm: "16px" },
                lineHeight: 1.364,
                whiteSpace: "nowrap",
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
          {projectId && taskId && isTaskInProgress && (
            <Button
              variant="contained"
              onClick={handleEndTask}
              fullWidth={isMobile}
              sx={{
                backgroundColor: "#f44336",
                color: "#FFFFFF",
                borderRadius: "14px",
                padding: { xs: "10px 16px", sm: "13px 20px" },
                height: { xs: "40px", sm: "44px", md: "44px", lg: "44px" },
                fontWeight: 700,
                fontSize: { xs: "14px", sm: "16px" },
                lineHeight: 1.364,
                whiteSpace: "nowrap",
                boxShadow: "0px 6px 12px 0px rgba(244, 67, 54, 0.26)",
                "&:hover": {
                  backgroundColor: "#da190b",
                  boxShadow: "0px 6px 12px 0px rgba(244, 67, 54, 0.42)",
                },
              }}
            >
              End Task
            </Button>
          )}
        </Box>
      </Box>
      {children}
    </Box>
  );
};

export default TaskDetailsHeader;
