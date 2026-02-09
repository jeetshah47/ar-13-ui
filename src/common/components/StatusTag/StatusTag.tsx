import { Box } from "@mui/material";
import { normalizeTaskStatus, getStatusDisplayName, TASK_STATUS, type TaskStatus } from "../../../pages/Projects/constants/taskStatus.constants";

type StatusTagProps = {
  status: string; // Accept any string and normalize it
};

const StatusTag = ({ status }: StatusTagProps) => {
  // Normalize status to backend format
  const normalizedStatus = normalizeTaskStatus(status);
  
  const colorMaps: Record<TaskStatus, { bg: string; text: string }> = {
    [TASK_STATUS.PENDING]: { bg: "rgba(125,133,146,14%)", text: "#7D8592" },
    [TASK_STATUS.IN_PROGRESS]: { bg: "rgba(63,140,255,14%)", text: "#3F8CFF" },
    [TASK_STATUS.IN_REVIEW]: { bg: "rgba(196,24,230,11%)", text: "#C418E6" },
    [TASK_STATUS.COMPLETED]: { bg: "#E0F9F2", text: "#00D097" },
    [TASK_STATUS.ACCEPTED]: { bg: "#E0F9F2", text: "#00D097" },
    [TASK_STATUS.REJECTED]: { bg: "rgba(244,67,54,14%)", text: "#F44336" },
  };

  // Get color mapping with fallback for unknown status
  const colorMapping = colorMaps[normalizedStatus] || colorMaps[TASK_STATUS.PENDING];

  return (
    <Box
      sx={{
        padding: "6px 12px",
        backgroundColor: colorMapping.bg,
        color: colorMapping.text,
        borderRadius: "8px",
        fontWeight: 700,
        fontSize: "var(--font-size-sm, 13px)"
      }}
    >
      {getStatusDisplayName(normalizedStatus)}
    </Box>
  );
};

export default StatusTag;
