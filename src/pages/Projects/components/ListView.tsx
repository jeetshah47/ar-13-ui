import {
  Avatar,
  Box,
  CircularProgress,
  Typography,
} from "@mui/material";
import StatusTag from "../../../common/components/StatusTag/StatusTag";
import { blurAnimation } from "../../../common/animation/cssAnimation";
import type {
  TaskResponse,
} from "../../../store/types/Task/TaskResponse";

type ListViewProps = {
  tasks: TaskResponse[];
};

type StatusType = "progress" | "success" | "review" | "pending";

const ListView = ({ tasks }: ListViewProps) => {
  const formatDuration = (duration: string) => {
    if (!duration) return "0d 0h";
    
    // Handle different duration formats
    // If it's already in "2d 4h" format, return as is
    if (typeof duration === 'string' && duration.includes('d') && duration.includes('h')) {
      return duration;
    }
    
    // If it's a number (hours), convert to days and hours
    const totalHours = parseInt(duration);
    if (!isNaN(totalHours)) {
      const days = Math.floor(totalHours / 8); // Assuming 8 hours per day
      const hours = totalHours % 8;
      return `${days}d ${hours}h`;
    }
    
    // If it's a date string, calculate difference
    try {
      const date1 = new Date(duration);
      const date2 = new Date();
      if (isNaN(date1.getTime())) return "0d 0h";
      
      const diffMs = Math.abs(date2.getTime() - date1.getTime());
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      const diffHours = Math.floor(
        (diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      return `${diffDays}d ${diffHours}h`;
    } catch {
      return "0d 0h";
    }
  };

  const calculateSpentTime = (timeSpentEntries: any[] | undefined) => {
    if (!timeSpentEntries || timeSpentEntries.length === 0) {
      return "0d 0h";
    }

    // Calculate total time spent in minutes
    const totalMinutes = timeSpentEntries.reduce((total, entry) => {
      return total + (entry.timeSpent || 0);
    }, 0);

    // Convert minutes to days and hours (assuming 8 hours per day)
    const totalHours = Math.floor(totalMinutes / 60);
    const days = Math.floor(totalHours / 8);
    const hours = totalHours % 8;

    return `${days}d ${hours}h`;
  };

  const TaskCard = (task: TaskResponse) => (
    <Box
      sx={{
        backgroundColor: "var(--color-white, #FFFFFF)",
        padding: "var(--spacing-lg, 22px) var(--spacing-xl, 30px)",
        borderRadius: "var(--border-radius-xl, 24px)",
        margin: "var(--spacing-md, 16px) 0",
        boxShadow: "var(--shadow-card, 0px 6px 58px 0px rgba(196, 203, 214, 0.1))",
        minHeight: "var(--card-height, 91px)",
        display: "grid",
        gridTemplateColumns: "minmax(200px, 1fr) repeat(4, minmax(100px, 120px)) minmax(80px, 100px) auto",
        gridTemplateRows: "auto auto",
        gridTemplateAreas: `
          "task-label estimate-label spent-label assignee-label priority-label status-label progress-label"
          "task-value estimate-value spent-value assignee-value priority-value status-value progress-value"
        `,
        gap: "var(--spacing-xs, 2px) var(--spacing-lg, 24px)",
        alignItems: "center",
        ...blurAnimation,
        "@media (max-width: 1200px)": {
          gridTemplateColumns: "1fr repeat(2, minmax(100px, 1fr)) auto",
          gridTemplateAreas: `
            "task-label task-label estimate-label spent-label"
            "task-value task-value estimate-value spent-value"
            "assignee-label priority-label status-label progress-label"
            "assignee-value priority-value status-value progress-value"
          `,
        },
        "@media (max-width: 768px)": {
          gridTemplateColumns: "1fr",
          gridTemplateAreas: `
            "task-label"
            "task-value"
            "estimate-label"
            "estimate-value"
            "spent-label"
            "spent-value"
            "assignee-label"
            "assignee-value"
            "priority-label"
            "priority-value"
            "status-label"
            "status-value"
            "progress-label"
            "progress-value"
          `,
          gap: "var(--spacing-xs, 8px)",
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
          {task.subject}
        </Typography>
      </Box>

      {/* Estimate */}
      <Box sx={{ gridArea: "estimate-label" }}>
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
          Estimate
        </Typography>
      </Box>
      <Box sx={{ gridArea: "estimate-value" }}>
        <Typography 
          sx={{ 
            fontSize: "var(--font-size-base, 15px)", 
            fontWeight: "var(--font-weight-normal, 400)", 
            lineHeight: "var(--line-height-base, 1.5)",
            color: "var(--color-text-primary, #0A1629)",
          }}
        >
          {formatDuration(task.duration)}
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
          {task.assignTo[0]?.charAt(0).toUpperCase() || "U"}
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
      <Box sx={{ gridArea: "priority-value", display: "flex", alignItems: "center", gap: "var(--spacing-xs, 6px)" }}>
        <Box
          sx={{
            width: "var(--icon-size, 24px)",
            height: "var(--icon-size, 24px)",
            borderRadius: "50%",
            backgroundColor: "var(--color-gray-light, #D8D8D8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Box
            sx={{
              width: "var(--priority-icon-width, 12px)",
              height: "var(--priority-icon-height, 16px)",
              backgroundColor: "var(--color-warning, #FFBD21)",
              borderRadius: "var(--border-radius-xs, 2px)"
            }}
          />
        </Box>
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
      <Box sx={{ gridArea: "status-value" }}>
        <StatusTag status={task.status as StatusType} />
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
          value={25} 
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
