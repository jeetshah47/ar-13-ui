import { Box, Button, CircularProgress, Typography, useMediaQuery, useTheme, Accordion, AccordionSummary, AccordionDetails, Divider } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import LogTimeModal from "./LogTimeModal";
import { useResourceAccess } from "../../../store/hooks/useResourceAccess";
import { useState, useMemo } from "react";
import type { TaskResponse } from "../../../store/types/Task/TaskResponse";
import { useTimeTracking } from "../../../hooks/useTimeTracking";
import { formatTime, formatSeconds } from "../../../utils/timeFormatting";

interface TimeTrackingSectionProps {
  timeLogged?: string;
  originalEstimate?: string;
  projectId?: string;
  taskId?: string;
  task?: TaskResponse;
  progress?: number | null;
}

const TimeTrackingSection = ({
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

  // Use time tracking hook if projectId and taskId are available
  const isTaskInProgress = task?.status === "in_progress";
  const {
    isTracking,
    activeTime,
    session,
    startTracking,
    stopTracking,
  } = useTimeTracking({
    projectId: projectId || "",
    taskId: taskId || "",
    autoStart: isTaskInProgress,
    syncInterval: 2 * 60 * 1000, // 2 minutes
    activityUpdateInterval: 30 * 1000, // 30 seconds
    idleTimeout: 10, // 10 minutes
  });

  // Calculate total time including active session
  const getTotalTimeDisplay = () => {
    if (!task?.timeSpent) {
      if (isTracking && activeTime > 0) {
        return `${formatSeconds(activeTime)} logged`;
      }
      return "0h 0m logged";
    }

    const totalMinutes = task.timeSpent.reduce((sum, entry) => sum + (entry.timeSpent || 0), 0);
    
    // Add active session time if tracking
    let displayMinutes = totalMinutes;
    if (isTracking && session) {
      // Active time is in seconds, convert to minutes and add
      const activeMinutes = Math.floor(activeTime / 60);
      displayMinutes = totalMinutes + activeMinutes;
    }

    const formatted = formatTime(displayMinutes);
    return `${formatted} logged`;
  };

  const handleLogTimeClick = () => {
    setShowLogTimeModal(true);
  };

  const handleCloseLogTimeModal = () => {
    setShowLogTimeModal(false);
  };

  // Group time spent by date for daily breakdown
  const dailyBreakdown = useMemo(() => {
    if (!task?.timeSpent || task.timeSpent.length === 0) {
      return [];
    }

    const grouped = task.timeSpent.reduce((acc, entry) => {
      const date = entry.date || "Unknown";
      if (!acc[date]) {
        acc[date] = {
          date,
          totalMinutes: 0,
          entries: [],
        };
      }
      acc[date].totalMinutes += entry.timeSpent || 0;
      acc[date].entries.push(entry);
      return acc;
    }, {} as Record<string, { date: string; totalMinutes: number; entries: typeof task.timeSpent }>);

    // Sort by date (newest first)
    return Object.values(grouped).sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  }, [task]);

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
        <Box sx={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <Typography
            sx={{
              fontWeight: 400,
              fontSize: { xs: "16px", sm: "16px" },
              lineHeight: { xs: "1.5", sm: "1.5" },
              color: "#0A1629",
            }}
          >
            {getTotalTimeDisplay()}
          </Typography>
          
          {/* Active Session Time */}
          {isTracking && activeTime > 0 && (
            <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Box
                sx={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  backgroundColor: "#3F8CFF",
                  animation: "pulse 2s infinite",
                  "@keyframes pulse": {
                    "0%, 100%": {
                      opacity: 1,
                    },
                    "50%": {
                      opacity: 0.5,
                    },
                  },
                }}
              />
              <Typography
                sx={{
                  fontWeight: 400,
                  fontSize: { xs: "14px", sm: "14px" },
                  color: "#3F8CFF",
                }}
              >
                {formatSeconds(activeTime)} active
              </Typography>
            </Box>
          )}
        </Box>

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

      {/* Time Tracking Controls */}
      {projectId && taskId && (
        <Box sx={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {isTracking ? (
            <Button
              onClick={async () => {
                try {
                  await stopTracking();
                } catch (err) {
                  // Error handling - could show toast notification here
                  if (err instanceof Error) {
                    // Handle error silently or show user-friendly message
                  }
                }
              }}
              sx={{
                backgroundColor: "#FF6B6B",
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
                boxShadow: "0px 6px 12px rgba(255, 107, 107, 0.26)",
                "&:hover": {
                  backgroundColor: "#FF5252",
                  boxShadow: "0px 6px 12px rgba(255, 107, 107, 0.42)",
                },
              }}
            >
              Stop Tracking
            </Button>
          ) : isTaskInProgress ? (
            <Button
              onClick={async () => {
                try {
                  await startTracking();
                } catch (err) {
                  // Error handling - could show toast notification here
                  if (err instanceof Error) {
                    // Handle error silently or show user-friendly message
                  }
                }
              }}
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
              Start Tracking
            </Button>
          ) : null}
        </Box>
      )}

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

      {/* Daily Breakdown and History */}
      {dailyBreakdown.length > 0 && (
        <Accordion
          defaultExpanded={false}
          sx={{
            boxShadow: "none",
            border: "1px solid #E4E6E8",
            borderRadius: "14px",
            "&:before": {
              display: "none",
            },
            marginTop: { xs: "12px", sm: "16px" },
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon sx={{ color: "#0A1629" }} />}
            sx={{
              paddingX: { xs: "16px", sm: "20px" },
              paddingY: { xs: "12px", sm: "16px" },
              "& .MuiAccordionSummary-content": {
                margin: 0,
              },
            }}
          >
            <Typography
              sx={{
                fontWeight: 600,
                fontSize: { xs: "14px", sm: "16px" },
                color: "#0A1629",
              }}
            >
              Time History
            </Typography>
          </AccordionSummary>
          <AccordionDetails
            sx={{
              paddingX: { xs: "16px", sm: "20px" },
              paddingBottom: { xs: "16px", sm: "20px" },
            }}
          >
            <Box sx={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {dailyBreakdown.map((day, index) => (
                <Box key={day.date}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "8px",
                    }}
                  >
                    <Typography
                      sx={{
                        fontWeight: 600,
                        fontSize: { xs: "14px", sm: "15px" },
                        color: "#0A1629",
                      }}
                    >
                      {new Date(day.date).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </Typography>
                    <Typography
                      sx={{
                        fontWeight: 600,
                        fontSize: { xs: "14px", sm: "15px" },
                        color: "#3F8CFF",
                      }}
                    >
                      {formatTime(day.totalMinutes)}
                    </Typography>
                  </Box>
                  {day.entries.length > 1 && (
                    <Box sx={{ paddingLeft: "12px", marginTop: "4px" }}>
                      {day.entries.map((entry, entryIndex) => (
                        <Box
                          key={entryIndex}
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            fontSize: { xs: "12px", sm: "13px" },
                            color: "#91929E",
                            marginTop: "4px",
                          }}
                        >
                          <span>
                            {entry.description || "Time logged"}
                          </span>
                          <span>{formatTime(entry.timeSpent || 0)}</span>
                        </Box>
                      ))}
                    </Box>
                  )}
                  {index < dailyBreakdown.length - 1 && (
                    <Divider sx={{ marginTop: "12px" }} />
                  )}
                </Box>
              ))}
            </Box>
          </AccordionDetails>
        </Accordion>
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

