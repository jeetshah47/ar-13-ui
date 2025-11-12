import React from "react";
import {
  Avatar,
  Box,
  Button,
  SvgIcon,
  Typography,
} from "@mui/material";
import CalendarIcon from "../../../assets/icons/sidebar/calendar/inactive.svg?react";
import YellowArrow from "../../../assets/icons/general/calendar-23.svg?react";
import LogTimeModal from "./LogTimeModal";
import { useResourceAccess } from "../../../store/hooks/useResourceAccess";
import type { TaskResponse } from "../../../store/types/Task/TaskResponse";

// Time icon matching the Figma design
const TimeIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" fill="white"/>
    <path d="M12 6v6l4 2" stroke="#3F8CFF" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

type TaskInfoProps = {
  reporter?: {
    name: string;
    avatar?: string;
  };
  assigned?: {
    name: string;
    avatar?: string;
  };
  priority?: string;
  deadline?: string;
  timeLogged?: string;
  originalEstimate?: string;
  projectId?: string;
  taskId?: string;
  task?: TaskResponse;
  onLogTime?: () => void;
};

const TaskInfo = ({
  reporter = { name: "Evan Yates" },
  assigned = { name: "Blake Silva" },
  priority = "Medium",
  deadline = "Feb 23, 2020",
  timeLogged = "1d 3h 25m logged",
  originalEstimate = "Original Estimate 3d 8h",
  projectId,
  taskId,
  task,
  onLogTime,
}: TaskInfoProps) => {
  const [showLogTimeModal, setShowLogTimeModal] = React.useState(false);
  const { canLogTime } = useResourceAccess();
  const canLogTimeForTask = task ? canLogTime(task) : false;

  const handleLogTimeClick = () => {
    setShowLogTimeModal(true);
    onLogTime?.();
  };

  const handleCloseLogTimeModal = () => {
    setShowLogTimeModal(false);
  };

  return (
    <Box
      sx={{
        width: "265px",
        background: "#FFFFFF",
        borderRadius: "24px",
        boxShadow: "0px 6px 58px rgba(196, 203, 214, 0.103611)",
        height: "100%",
        padding: "24px",
      }}
    >
      {/* Header */}
      <Typography
        sx={{
          fontWeight: 700,
          fontSize: "16px",
          lineHeight: "1.5",
          color: "#0A1629",
          marginBottom: "24px",
        }}
      >
        Task Info
      </Typography>

      {/* Reporter Section */}
      <Box sx={{ marginBottom: "24px" }}>
        <Typography
          sx={{
            fontWeight: 400,
            fontSize: "14px",
            lineHeight: "1.36",
            color: "#91929E",
            marginBottom: "8px",
          }}
        >
          Reporter
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <Avatar
            sx={{
              width: "24px",
              height: "24px",
              border: "2px solid #FFFFFF",
            }}
            src={reporter.avatar || "/api/placeholder/24/24"}
          />
          <Typography
            sx={{
              fontWeight: 400,
              fontSize: "16px",
              lineHeight: "1.5",
              color: "#0A1629",
            }}
          >
            {reporter.name}
          </Typography>
        </Box>
      </Box>

      {/* Assigned Section */}
      <Box sx={{ marginBottom: "24px" }}>
        <Typography
          sx={{
            fontWeight: 400,
            fontSize: "14px",
            lineHeight: "1.36",
            color: "#91929E",
            marginBottom: "8px",
          }}
        >
          Assigned
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <Avatar
            sx={{
              width: "24px",
              height: "24px",
              border: "2px solid #FFFFFF",
            }}
            src={assigned.avatar || "/api/placeholder/24/24"}
          />
          <Typography
            sx={{
              fontWeight: 400,
              fontSize: "16px",
              lineHeight: "1.5",
              color: "#0A1629",
            }}
          >
            {assigned.name}
          </Typography>
        </Box>
      </Box>

      {/* Priority Section */}
      <Box sx={{ marginBottom: "24px" }}>
        <Typography
          sx={{
            fontWeight: 400,
            fontSize: "14px",
            lineHeight: "1.36",
            color: "#91929E",
            marginBottom: "8px",
          }}
        >
          Priority
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <SvgIcon component={YellowArrow} />
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: "14px",
              lineHeight: "1.14",
              color: "#FFBD21",
            }}
          >
            {priority}
          </Typography>
        </Box>
      </Box>

      {/* Deadline Section */}
      <Box sx={{ marginBottom: "24px" }}>
        <Typography
          sx={{
            fontWeight: 400,
            fontSize: "14px",
            lineHeight: "1.36",
            color: "#91929E",
            marginBottom: "8px",
          }}
        >
          Dead Line
        </Typography>
        <Typography
          sx={{
            fontWeight: 400,
            fontSize: "16px",
            lineHeight: "1.5",
            color: "#0A1629",
          }}
        >
          {deadline}
        </Typography>
      </Box>

      {/* Time Tracking Section */}
      <Box
        sx={{
          backgroundColor: "#F4F9FD",
          borderRadius: "14px",
          padding: "16px",
          marginBottom: "24px",
        }}
      >
        <Typography
          sx={{
            fontWeight: 700,
            fontSize: "16px",
            lineHeight: "1.5",
            color: "#0A1629",
            marginBottom: "16px",
          }}
        >
          Time tracking
        </Typography>
        
        <Typography
          sx={{
            fontWeight: 400,
            fontSize: "16px",
            lineHeight: "1.5",
            color: "#0A1629",
            marginBottom: "4px",
          }}
        >
          {timeLogged}
        </Typography>
        
        {originalEstimate ? (
          <Typography
            sx={{
              fontWeight: 400,
              fontSize: "14px",
              lineHeight: "1.36",
              color: "#91929E",
            }}
          >
            {originalEstimate}
          </Typography>
        ) : (
          <Typography
            sx={{
              fontWeight: 400,
              fontSize: "14px",
              lineHeight: "1.36",
              color: "#91929E",
              fontStyle: "italic",
            }}
          >
            No estimate available
          </Typography>
        )}
      </Box>

      {/* Log Time Button - Only show if user can log time for this task */}
      {canLogTimeForTask && (
        <Button
          onClick={handleLogTimeClick}
          sx={{
            backgroundColor: "#3F8CFF",
            color: "#FFFFFF",
            borderRadius: "14px",
            padding: "12px 16px",
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontWeight: 700,
            fontSize: "16px",
            lineHeight: "1.36",
            textTransform: "none",
            boxShadow: "0px 6px 12px rgba(63, 140, 255, 0.26)",
            "&:hover": {
              backgroundColor: "#3F8CFF",
              opacity: 0.9,
            },
          }}
        >
          <TimeIcon />
          Log time
        </Button>
      )}

      {/* Created Date */}
      {task?.created && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            marginTop: "24px",
          }}
        >
          <SvgIcon component={CalendarIcon} />
          <Typography
            sx={{
              fontWeight: 600,
              fontSize: "14px",
              lineHeight: "1.14",
              color: "#7D8592",
            }}
          >
            Created {(() => {
              // Handle Firebase timestamp format
              if (typeof task.created === "object" && "_seconds" in task.created) {
                return new Date(task.created._seconds * 1000).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                });
              }
              // Handle ISO string format
              if (typeof task.created === "string") {
                return new Date(task.created).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                });
              }
              return "Unknown date";
            })()}
          </Typography>
        </Box>
      )}

      {/* Log Time Modal */}
      {showLogTimeModal && (
        <LogTimeModal
          onClose={handleCloseLogTimeModal}
          projectId={projectId}
          taskId={taskId}
          task={task}
        />
      )}
    </Box>
  );
};

export default TaskInfo;
