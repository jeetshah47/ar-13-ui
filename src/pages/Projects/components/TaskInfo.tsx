import React from "react";
import {
  Avatar,
  Box,
  SvgIcon,
  Typography,
} from "@mui/material";
import CalendarIcon from "../../../assets/icons/sidebar/calendar/inactive.svg?react";
import YellowArrow from "../../../assets/icons/general/calendar-23.svg?react";
import LogTimeModal from "./LogTimeModal";
import type { TaskResponse } from "../../../store/types/Task/TaskResponse";

type TaskInfoProps = {
  reporter?: {
    name: string;
    avatar?: string;
  };
  assigned?: {
    name: string;
    avatar?: string;
  };
  assignedUserId?: string;
  isAssignedUserOnline?: boolean;
  priority?: string;
  deadline?: string;
  timeLogged?: string;
  originalEstimate?: string;
  projectId?: string;
  taskId?: string;
  task?: TaskResponse;
};

const TaskInfo = ({
  reporter,
  assigned,
  assignedUserId,
  isAssignedUserOnline = false,
  priority,
  deadline,
  timeLogged,
  originalEstimate,
  projectId,
  taskId,
  task,
}: TaskInfoProps) => {
  const [showLogTimeModal, setShowLogTimeModal] = React.useState(false);

  const handleCloseLogTimeModal = () => {
    setShowLogTimeModal(false);
  };

  return (
    <Box
      sx={{
        width: { xs: "100%", sm: "100%", md: "240px", lg: "265px" },
        background: "#FFFFFF",
        borderRadius: { xs: "20px", sm: "20px", md: "24px", lg: "24px" },
        boxShadow: "0px 6px 58px rgba(196, 203, 214, 0.103611)",
        height: { xs: "auto", sm: "auto", md: "100%", lg: "100%" },
        padding: { xs: "16px", sm: "18px", md: "20px", lg: "24px" },
        flexShrink: 0,
        maxWidth: "100%",
        boxSizing: "border-box",
        "@media (min-width: 1200px) and (max-width: 1600px)": {
          width: "240px",
          padding: "20px",
        },
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
      {reporter && (
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
      )}

      {/* Assigned Section */}
      {assigned && (
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
            <Box sx={{ position: "relative", display: "inline-block" }}>
              <Avatar
                sx={{
                  width: "32px",
                  height: "32px",
                  border: "2px solid #FFFFFF",
                  backgroundColor: "#3F8CFF",
                  color: "#FFFFFF",
                  fontSize: "14px",
                  fontWeight: 600,
                }}
                src={assigned.avatar}
              >
                {assigned.name?.charAt(0).toUpperCase() || "U"}
              </Avatar>
              {/* Online/Offline Status Dot */}
              {assignedUserId && (
                <Box
                  sx={{
                    position: "absolute",
                    bottom: "0",
                    right: "0",
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    backgroundColor: isAssignedUserOnline ? "#10B981" : "#9CA3AF", // Green for online, gray for offline
                    border: "2px solid #FFFFFF",
                    boxShadow: "0 0 0 1px rgba(0, 0, 0, 0.1)",
                    transition: "background-color 0.3s ease",
                  }}
                />
              )}
            </Box>
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
      )}

      {/* Priority Section */}
      {priority && (
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
      )}

      {/* Deadline Section */}
      {deadline && (
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
      )}

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
        
        {timeLogged && (
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
        )}
        
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
