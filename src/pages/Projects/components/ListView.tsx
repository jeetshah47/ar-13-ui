import {
  Avatar,
  Box,
  CircularProgress,
  Typography,
  useMediaQuery,
  useTheme,
  SvgIcon,
} from "@mui/material";
import { useNavigate } from "react-router";
import StatusTag from "../../../common/components/StatusTag/StatusTag";
import { blurAnimation } from "../../../common/animation/cssAnimation";
import YellowArrow from "../../../assets/icons/general/calendar-23.svg?react";
import type {
  TaskResponse,
} from "../../../store/types/Task/TaskResponse";
import type { TimeSpentEntry } from "../../../store/types/Task/TaskTypes";

type ListViewProps = {
  tasks: TaskResponse[];
};

// StatusType removed - StatusTag now accepts any string and normalizes it

const ListView = ({ tasks }: ListViewProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();

  const handleTaskClick = (task: TaskResponse) => {
    if (task.projectId && task.id) {
      navigate(`/app/projects/details/${task.projectId}/${task.id}`);
    }
  };

  const calculateSpentTime = (timeSpentEntries: TimeSpentEntry[] | undefined) => {
    if (!timeSpentEntries || timeSpentEntries.length === 0) {
      return "0h";
    }

    // Calculate total time spent in minutes
    const totalMinutes = timeSpentEntries.reduce((total, entry) => {
      return total + (entry.timeSpent || 0);
    }, 0);

    // Convert minutes to days and hours (assuming 8 hours per day)
    const totalHours = Math.floor(totalMinutes / 60);
    const days = Math.floor(totalHours / 8);
    const hours = totalHours % 8;

    if (days > 0) {
      return `${days}d ${hours}h`;
    }
    return `${hours}h`;
  };

  const calculateEstimate = (_deadline?: string) => {
    // For now, return a placeholder. This should be calculated from task estimate if available
    return "2d 4h"; // Placeholder - should come from task data
  };

  const TaskCard = (task: TaskResponse) => {
    // Use drawing type name if available, otherwise fall back to subject
    const taskTitle = task.drawingInfo?.typeName || task.subject;

    if (isMobile) {
      // Mobile layout matching Figma design
      return (
        <Box
          onClick={() => handleTaskClick(task)}
          sx={{
            backgroundColor: "#FFFFFF",
            borderRadius: "24px",
            padding: "20px",
            margin: "20px 0",
            boxShadow: "0px 6px 58px 0px rgba(196, 203, 214, 0.1)",
            position: "relative",
            cursor: "pointer",
            transition: "transform 0.2s, box-shadow 0.2s",
            "&:hover": {
              transform: "translateY(-2px)",
              boxShadow: "0px 8px 64px 0px rgba(196, 203, 214, 0.15)",
            },
            ...blurAnimation,
          }}
        >
          {/* Progress indicator in top right */}
          <Box
            sx={{
              position: "absolute",
              top: "31px",
              right: "20px",
            }}
          >
            <CircularProgress 
              variant="determinate" 
              value={task.progress ?? 0} 
              size={24}
              thickness={2}
              sx={{ 
                color: "#3F8CFF",
                "& .MuiCircularProgress-circle": {
                  strokeLinecap: "round",
                }
              }}
            />
          </Box>

          {/* Task Name */}
          <Typography 
            sx={{ 
              fontSize: "16px",
              fontWeight: 400,
              lineHeight: "1.5em",
              color: "#0A1629",
              marginBottom: "20px",
              paddingRight: "40px", // Space for progress indicator
            }}
          >
            {taskTitle}
          </Typography>

          {/* Divider */}
          <Box
            sx={{
              width: "100%",
              height: "1px",
              backgroundColor: "#E4E6E8",
              marginBottom: "20px",
            }}
          />

          {/* Top Row: Estimate, Spent Time, Assignee */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: "20px",
              marginBottom: "20px",
            }}
          >
            {/* Estimate */}
            <Box>
              <Typography 
                sx={{ 
                  fontSize: "14px",
                  fontWeight: 400,
                  lineHeight: "1.36em",
                  color: "#91929E",
                  marginBottom: "4px",
                }}
              >
                Estimate
              </Typography>
              <Typography 
                sx={{ 
                  fontSize: "16px",
                  fontWeight: 400,
                  lineHeight: "1.5em",
                  color: "#0A1629",
                }}
              >
                {calculateEstimate(task.deadline)}
              </Typography>
            </Box>

            {/* Spent Time */}
            <Box>
              <Typography 
                sx={{ 
                  fontSize: "14px",
                  fontWeight: 400,
                  lineHeight: "1.36em",
                  color: "#91929E",
                  marginBottom: "4px",
                }}
              >
                Spent Time
              </Typography>
              <Typography 
                sx={{ 
                  fontSize: "16px",
                  fontWeight: 400,
                  lineHeight: "1.5em",
                  color: "#0A1629",
                }}
              >
                {calculateSpentTime(task.timeSpent)}
              </Typography>
            </Box>

            {/* Assignee */}
            <Box>
              <Typography 
                sx={{ 
                  fontSize: "14px",
                  fontWeight: 400,
                  lineHeight: "1.36em",
                  color: "#91929E",
                  marginBottom: "4px",
                }}
              >
                Assignee
              </Typography>
              <Avatar
                sx={{ 
                  width: "24px",
                  height: "24px",
                  border: "2px solid #FFFFFF",
                  fontSize: "11px",
                  backgroundColor: "#3F8CFF"
                }}
              >
                {task.assignTo?.name?.charAt(0).toUpperCase() || "U"}
              </Avatar>
            </Box>
          </Box>

          {/* Bottom Row: Priority and Status */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            {/* Priority */}
            <Box>
              <Typography 
                sx={{ 
                  fontSize: "14px",
                  fontWeight: 400,
                  lineHeight: "1.36em",
                  color: "#91929E",
                  marginBottom: "4px",
                }}
              >
                Priority
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: "4px" }}>
                <SvgIcon 
                  component={YellowArrow}
                  sx={{
                    fontSize: "20px",
                    width: "20px",
                    height: "20px",
                  }}
                />
                <Typography 
                  sx={{ 
                    fontSize: "14px",
                    fontWeight: 700,
                    lineHeight: "1.14em",
                    color: "#FFBD21"
                  }}
                >
                  {task.priority}
                </Typography>
              </Box>
            </Box>

            {/* Status */}
            <Box>
              <Typography 
                sx={{ 
                  fontSize: "14px",
                  fontWeight: 400,
                  lineHeight: "1.36em",
                  color: "#91929E",
                  marginBottom: "4px",
                }}
              >
                Status
              </Typography>
              <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
                <StatusTag status={task.status} />
              </Box>
            </Box>
          </Box>
        </Box>
      );
    }

    // Desktop layout (existing)
    return (
      <Box
        onClick={() => handleTaskClick(task)}
        sx={{
          backgroundColor: "var(--color-white, #FFFFFF)",
          padding: "var(--spacing-lg, 22px) var(--spacing-xl, 30px)",
          borderRadius: "var(--border-radius-xl, 24px)",
          margin: "var(--spacing-md, 16px) 0",
          boxShadow: "var(--shadow-card, 0px 6px 58px 0px rgba(196, 203, 214, 0.1))",
          minHeight: "var(--card-height, 91px)",
          display: "grid",
          gridTemplateColumns: "minmax(200px, 1fr) repeat(3, minmax(100px, 120px)) minmax(80px, 100px) auto",
          gridTemplateRows: "auto auto",
          gridTemplateAreas: `
            "task-label spent-label assignee-label priority-label status-label progress-label"
            "task-value spent-value assignee-value priority-value status-value progress-value"
          `,
          gap: "var(--spacing-xs, 2px) var(--spacing-lg, 24px)",
          alignItems: "center",
          cursor: "pointer",
          transition: "transform 0.2s, box-shadow 0.2s",
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: "0px 8px 64px 0px rgba(196, 203, 214, 0.15)",
          },
          ...blurAnimation,
          "@media (max-width: 1400px) and (min-width: 1201px)": {
            gridTemplateColumns: "minmax(180px, 1fr) repeat(2, minmax(90px, 110px)) minmax(70px, 90px) auto",
            gap: "var(--spacing-xs, 2px) var(--spacing-md, 16px)",
          },
          "@media (max-width: 1200px)": {
            gridTemplateColumns: "1fr repeat(2, minmax(100px, 1fr)) auto",
            gridTemplateAreas: `
              "task-label task-label spent-label assignee-label"
              "task-value task-value spent-value assignee-value"
              "priority-label status-label progress-label ."
              "priority-value status-value progress-value ."
            `,
          },
        }}
      >
        {/* Task Name */}
        <Box sx={{ gridArea: "task-label" }}>
          <Typography 
            component="label"
            sx={{ 
              fontSize: "var(--font-size-sm, 13px)", 
              fontWeight: "var(--font-weight-normal, 400)", 
              lineHeight: "var(--line-height-sm, 1.36)",
              color: "var(--color-text-secondary, #91929E)",
              display: "block",
            }}
          >
            Task Name
          </Typography>
        </Box>
        <Box sx={{ gridArea: "task-value" }}>
          <Typography 
            sx={{ 
              fontSize: "var(--font-size-base, 15px)", 
              fontWeight: "var(--font-weight-normal, 400)", 
              lineHeight: "var(--line-height-base, 1.5)",
              color: "var(--color-text-primary, #0A1629)",
            }}
          >
            {task.drawingInfo?.typeName || task.subject}
          </Typography>
        </Box>

        {/* Spent Time */}
        <Box sx={{ gridArea: "spent-label" }}>
          <Typography 
            component="label"
            sx={{ 
              fontSize: "var(--font-size-sm, 13px)", 
              fontWeight: "var(--font-weight-normal, 400)", 
              lineHeight: "var(--line-height-sm, 1.36)",
              color: "var(--color-text-secondary, #91929E)",
              display: "block",
            }}
          >
            Spent Time
          </Typography>
        </Box>
        <Box sx={{ gridArea: "spent-value" }}>
          <Typography 
            sx={{ 
              fontSize: "var(--font-size-base, 15px)", 
              fontWeight: "var(--font-weight-normal, 400)", 
              lineHeight: "var(--line-height-base, 1.5)",
              color: "var(--color-text-primary, #0A1629)",
            }}
          >
            {calculateSpentTime(task.timeSpent)}
          </Typography>
        </Box>

        {/* Assignee */}
        <Box sx={{ gridArea: "assignee-label" }}>
          <Typography 
            component="label"
            sx={{ 
              fontSize: "var(--font-size-sm, 13px)", 
              fontWeight: "var(--font-weight-normal, 400)", 
              lineHeight: "var(--line-height-sm, 1.36)",
              color: "var(--color-text-secondary, #91929E)",
              display: "block",
            }}
          >
            Assignee
          </Typography>
        </Box>
        <Box sx={{ gridArea: "assignee-value" }}>
          <Avatar
            sx={{ 
              width: "var(--avatar-size, 24px)", 
              height: "var(--avatar-size, 24px)",
              border: "2px solid var(--color-white, #FFFFFF)",
              fontSize: "var(--font-size-xs, 11px)",
              backgroundColor: "var(--color-primary, #3F8CFF)"
            }}
          >
            {task.assignTo?.name?.charAt(0).toUpperCase() || "U"}
          </Avatar>
        </Box>

        {/* Priority */}
        <Box sx={{ gridArea: "priority-label" }}>
          <Typography 
            component="label"
            sx={{ 
              fontSize: "var(--font-size-sm, 13px)", 
              fontWeight: "var(--font-weight-normal, 400)", 
              lineHeight: "var(--line-height-sm, 1.36)",
              color: "var(--color-text-secondary, #91929E)",
              display: "block",
            }}
          >
            Priority
          </Typography>
        </Box>
        <Box sx={{ gridArea: "priority-value", display: "flex", alignItems: "center", gap: "var(--spacing-xs, 4px)" }}>
          <SvgIcon 
            component={YellowArrow}
            sx={{
              fontSize: "20px",
              width: "20px",
              height: "20px",
            }}
          />
          <Typography 
            sx={{ 
              fontSize: "var(--font-size-sm, 13px)", 
              fontWeight: "var(--font-weight-bold, 700)", 
              lineHeight: "var(--line-height-sm, 1.36)",
              color: "var(--color-warning, #FFBD21)"
            }}
          >
            {task.priority}
          </Typography>
        </Box>

        {/* Status */}
        <Box sx={{ gridArea: "status-label" }}>
          <Typography 
            component="label"
            sx={{ 
              fontSize: "var(--font-size-sm, 13px)", 
              fontWeight: "var(--font-weight-normal, 400)", 
              lineHeight: "var(--line-height-sm, 1.36)",
              color: "var(--color-text-secondary, #91929E)",
              display: "block",
            }}
          >
            Status
          </Typography>
        </Box>
        <Box sx={{ gridArea: "status-value", display: "flex", alignItems: "center" }}>
          <StatusTag status={task.status} />
        </Box>

        {/* Progress Indicator */}
        <Box sx={{ gridArea: "progress-label" }}>
          <Typography 
            component="label"
            sx={{ 
              fontSize: "var(--font-size-sm, 13px)", 
              fontWeight: "var(--font-weight-normal, 400)", 
              lineHeight: "var(--line-height-sm, 1.36)",
              color: "var(--color-text-secondary, #91929E)",
              display: "block",
            }}
          >
            Progress
          </Typography>
        </Box>
        <Box sx={{ gridArea: "progress-value" }}>
          <CircularProgress 
            variant="determinate" 
            value={task.progress ?? 0} 
            size={24}
            thickness={2}
            sx={{ 
              color: "var(--color-primary, #3F8CFF)",
              "& .MuiCircularProgress-circle": {
                strokeLinecap: "round",
              }
            }}
          />
        </Box>
      </Box>
    );
  };

  return (
    <>
      <Box
        sx={{
          background: "var(--color-background-light, #E6EDF5)",
          borderRadius: "var(--border-radius-lg, 14px)",
          padding: "var(--spacing-xs, 8px)",
          textAlign: "center",
          marginTop: "var(--spacing-sm, 12px)",
        }}
      >
        <Typography sx={{ fontWeight: "var(--font-weight-bold, 700)" }}>Active Task</Typography>
      </Box>
      {tasks?.map((t) => (
        <TaskCard key={t.id} {...t} />
      ))}
    </>
  );
};

export default ListView;
