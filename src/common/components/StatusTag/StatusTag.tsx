import { Box } from "@mui/material";

type StatusTagProps = {
  status: "progress" | "success" | "pending" | "review";
};

const StatusTag = ({ status }: StatusTagProps) => {
  const colorMaps = {
    success: { bg: "#E0F9F2", text: "#00D097" },
    pending: { bg: "rgba(125,133,146,14%)", text: "#7D8592" },
    progress: { bg: "rgba(63,140,255,11.99%)", text: "#3F8CFF" },
    review: { bg: "rgba(196,24,230,11%)", text: "#C418E6" },
  };

  const getStatusText = () => {
    switch (status) {
      case "pending":
        return "Pending";
      case "progress":
        return "In Progress";
      case "success":
        return "Success";
      case "review":
        return "Review";
    }
  };

  return (
    <Box
      sx={{
        padding: "7px 14px",
        backgroundColor: colorMaps[status].bg,
        color: colorMaps[status].text,
        borderRadius: "8px",
        fontWeight: "700"
      }}
    >
      {getStatusText()}
    </Box>
  );
};

export default StatusTag;
