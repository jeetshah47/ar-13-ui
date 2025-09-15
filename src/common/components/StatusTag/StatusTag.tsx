import { Box } from "@mui/material";

type StatusTagProps = {
  status: "To Do" | "In Progress" | "Review" | "Done" | "progress" | "success" | "pending" | "review";
};

const StatusTag = ({ status }: StatusTagProps) => {
  const colorMaps = {
    // New status values
    "To Do": { bg: "rgba(125,133,146,14%)", text: "#7D8592" },
    "In Progress": { bg: "rgba(63,140,255,11.99%)", text: "#3F8CFF" },
    "Review": { bg: "rgba(196,24,230,11%)", text: "#C418E6" },
    "Done": { bg: "#E0F9F2", text: "#00D097" },
    // Legacy status values (for backward compatibility)
    success: { bg: "#E0F9F2", text: "#00D097" },
    pending: { bg: "rgba(125,133,146,14%)", text: "#7D8592" },
    progress: { bg: "rgba(63,140,255,11.99%)", text: "#3F8CFF" },
    review: { bg: "rgba(196,24,230,11%)", text: "#C418E6" },
  };

  const getStatusText = () => {
    switch (status) {
      // New status values
      case "To Do":
        return "To Do";
      case "In Progress":
        return "In Progress";
      case "Review":
        return "Review";
      case "Done":
        return "Done";
      // Legacy status values (for backward compatibility)
      case "pending":
        return "Pending";
      case "progress":
        return "In Progress";
      case "success":
        return "Success";
      case "review":
        return "Review";
      default:
        return status; // Fallback to the original status value
    }
  };

  // Get color mapping with fallback for unknown status
  const colorMapping = colorMaps[status] || { bg: "rgba(125,133,146,14%)", text: "#7D8592" };

  return (
    <Box
      sx={{
        padding: "7px 14px",
        backgroundColor: colorMapping.bg,
        color: colorMapping.text,
        borderRadius: "8px",
        fontWeight: "700"
      }}
    >
      {getStatusText()}
    </Box>
  );
};

export default StatusTag;
