import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import type { CalendarResponse } from "../../../store/types/Calendar/CalendarResponse";

type EventProps = {
  event: CalendarResponse;
  onClick?: (event: CalendarResponse) => void;
};

const Event = ({ event, onClick }: EventProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

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
        padding: { xs: "4px", sm: "6px" },
        backgroundColor: theme.palette.grey[50],
        borderRadius: { xs: "10px", sm: "14px" },
        display: "flex",
        overflow: "hidden",
        width: "100%",
        cursor: onClick ? "pointer" : "default",
        marginBottom: { xs: "1px", sm: "2px" },
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
          borderLeft: `${isMobile ? "2px" : "3px"} solid ${getCategoryColor(event.category)}`,
          paddingLeft: { xs: "3px", sm: "4px" },
          width: "100%"
        }}
      >
        <Typography 
          fontSize={{ xs: "10px", sm: "12px" }} 
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
          fontSize={{ xs: "8px", sm: "10px" }} 
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
