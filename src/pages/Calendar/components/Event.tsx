import { Box, Typography } from "@mui/material";
import type { CalendarResponse } from "../../../store/types/Calendar/CalendarResponse";

type EventProps = {
  event: CalendarResponse;
  onClick?: (event: CalendarResponse) => void;
};

const Event = ({ event, onClick }: EventProps) => {

  const getCategoryColor = (category: string | undefined) => {
    if (!category) return "#DE92EB";
    
    switch (category.toLowerCase()) {
      case "work":
        return "#4ECDC4";
      case "personal":
        return "#45B7D1";
      case "meeting":
        return "#96CEB4";
      case "appointment":
        return "#FFEAA7";
      default:
        return "#DE92EB";
    }
  };

  const formatTime = (time: string | undefined) => {
    if (!time) return "00:00";
    return time.substring(0, 5); // Extract HH:MM from time string
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onClick) {
      onClick(event);
    }
  };

  return (
    <Box
      sx={(theme) => ({
        padding: "6px",
        backgroundColor: theme.palette.grey[50],
        borderRadius: "14px",
        display: "flex",
        overflow: "hidden",
        width: "100%",
        cursor: onClick ? "pointer" : "default",
        marginBottom: "2px",
        "&:hover": onClick ? {
          backgroundColor: theme.palette.primary.light,
          transform: "scale(1.02)",
          transition: "all 0.2s ease-in-out"
        } : {}
      })}
      onClick={handleClick}
    >
      <Box 
        sx={{ 
          borderLeft: `3px solid ${getCategoryColor(event.category)}`,
          paddingLeft: "4px",
          width: "100%"
        }}
      >
        <Typography 
          fontSize={"12px"} 
          fontWeight="600"
          sx={(theme) => ({ 
            color: theme.palette.text.primary,
            lineHeight: 1.2,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap"
          })}
        >
          {event.title || "Untitled Event"}
        </Typography>
        <Typography 
          fontSize={"10px"} 
          sx={(theme) => ({ 
            color: theme.palette.text.secondary,
            lineHeight: 1.2
          })}
        >
          {formatTime(event.time)}
        </Typography>
      </Box>
    </Box>
  );
};

export default Event;
