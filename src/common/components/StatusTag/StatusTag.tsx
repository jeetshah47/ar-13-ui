import { Box } from "@mui/material";
import { mapStatusToUnified, getStatusDisplayName, type TaskStatus } from "../../../pages/Projects/constants/taskStatus.constants";

type StatusTagProps = {
  status: string; // Accept any string and normalize it
};

const StatusTag = ({ status }: StatusTagProps) => {
  // Normalize status to unified format
  const unifiedStatus = mapStatusToUnified(status);
  
  const colorMaps: Record<TaskStatus, { bg: string; text: string }> = {
    pending: { bg: "rgba(125,133,146,14%)", text: "#7D8592" },
    todo: { bg: "rgba(125,133,146,14%)", text: "#7D8592" },
    review: { bg: "rgba(196,24,230,11%)", text: "#C418E6" },
    completed: { bg: "#E0F9F2", text: "#00D097" },
  };

  // Get color mapping with fallback for unknown status
  const colorMapping = colorMaps[unifiedStatus] || colorMaps.pending;

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
      {getStatusDisplayName(unifiedStatus)}
    </Box>
  );
};

export default StatusTag;
