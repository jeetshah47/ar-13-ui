import { Box, Button, CircularProgress, Typography, useMediaQuery, useTheme } from "@mui/material";
import LogTimeModal from "./LogTimeModal";
import { useResourceAccess } from "../../../store/hooks/useResourceAccess";
import { useState } from "react";
import type { TaskResponse } from "../../../store/types/Task/TaskResponse";

interface TimeTrackingSectionProps {
  timeLogged?: string;
  originalEstimate?: string;
  projectId?: string;
  taskId?: string;
  task?: TaskResponse;
  progress?: number | null;
}

const TimeTrackingSection = ({
  timeLogged = "1d 3h 25m logged",
  originalEstimate = "Original Estimate 3d 8h",
  projectId,
  taskId,
  task,
  progress,
}: TimeTrackingSectionProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { canLogTime } = useResourceAccess();
  const [showLogTimeModal, setShowLogTimeModal] = useState(false);
  const canLogTimeForTask = task ? canLogTime(task) : false;

  const handleLogTimeClick = () => {
    setShowLogTimeModal(true);
  };

  const handleCloseLogTimeModal = () => {
    setShowLogTimeModal(false);
  };

  return (
    <Box
      sx={{
        borderTop: "1px solid #E4E6E8",
        marginTop: { xs: "16px", sm: "16px" },
        paddingTop: { xs: "20px", sm: "28px" },
        width: "100%",
        maxWidth: "100%",
        overflowX: "hidden",
        boxSizing: "border-box",
      }}
    >
      <Typography
        fontWeight={700}
        sx={{
          fontSize: { xs: "16px", sm: "18px" },
          mb: { xs: "16px", sm: "16px" },
          color: "#0A1629",
        }}
      >
        Time Tracking
      </Typography>

      <Box
        sx={{
          backgroundColor: "#F4F9FD",
          borderRadius: { xs: "14px", sm: "14px" },
          padding: { xs: "16px", sm: "16px" },
          marginBottom: { xs: "16px", sm: "16px" },
          display: "flex",
          flexDirection: "column",
          gap: { xs: "12px", sm: "16px" },
        }}
      >
        {/* Progress Circle */}
        {progress !== null && progress !== undefined && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              mb: { xs: "8px", sm: "8px" },
            }}
          >
            <Box sx={{ position: "relative", display: "inline-flex" }}>
              <CircularProgress
                variant="determinate"
                value={progress}
                size={isMobile ? 64 : 80}
                thickness={3}
                sx={{
                  color: "#3F8CFF",
                  "& .MuiCircularProgress-circle": {
                    strokeLinecap: "round",
                  },
                }}
              />
              <Box
                sx={{
                  top: 0,
                  left: 0,
                  bottom: 0,
                  right: 0,
                  position: "absolute",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography
                  variant="caption"
                  component="div"
                  sx={{
                    fontSize: { xs: "12px", sm: "14px" },
                    fontWeight: 700,
                    color: "#0A1629",
                  }}
                >
                  {`${Math.round(progress)}%`}
                </Typography>
              </Box>
            </Box>
          </Box>
        )}

        {/* Time Logged */}
        <Typography
          sx={{
            fontWeight: 400,
            fontSize: { xs: "16px", sm: "16px" },
            lineHeight: { xs: "1.5", sm: "1.5" },
            color: "#0A1629",
          }}
        >
          {timeLogged}
        </Typography>

        {/* Original Estimate */}
        <Typography
          sx={{
            fontWeight: 400,
            fontSize: { xs: "14px", sm: "14px" },
            lineHeight: { xs: "1.36", sm: "1.36" },
            color: "#91929E",
          }}
        >
          {originalEstimate}
        </Typography>
      </Box>

      {/* Log Time Button - Only show if user can log time for this task */}
      {canLogTimeForTask && (
        <Button
          onClick={handleLogTimeClick}
          sx={{
            backgroundColor: "#3F8CFF",
            color: "#FFFFFF",
            borderRadius: "14px",
            padding: { xs: "12px 16px", sm: "12px 16px" },
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            fontWeight: 700,
            fontSize: { xs: "16px", sm: "16px" },
            lineHeight: "1.36",
            textTransform: "none",
            boxShadow: "0px 6px 12px rgba(63, 140, 255, 0.26)",
            "&:hover": {
              backgroundColor: "#3A81EB",
              boxShadow: "0px 6px 12px rgba(63, 140, 255, 0.42)",
            },
          }}
        >
          <Box
            sx={{
              width: { xs: "20px", sm: "24px" },
              height: { xs: "20px", sm: "24px" },
              borderRadius: "50%",
              backgroundColor: "#FFFFFF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" fill="white"/>
              <path d="M12 6v6l4 2" stroke="#3F8CFF" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </Box>
          Log time
        </Button>
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

export default TimeTrackingSection;

