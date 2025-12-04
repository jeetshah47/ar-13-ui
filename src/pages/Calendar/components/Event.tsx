import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import type { CalendarResponse } from "../../../store/types/Calendar/CalendarResponse";

type EventProps = {
  event: CalendarResponse;
  onClick?: (event: CalendarResponse) => void;
};

const Event = ({ event, onClick }: EventProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Get event color scheme based on category (using project theme colors)
  const getEventColors = (category: string | undefined) => {
    if (!category) {
      // Default neutral gray (using theme)
      return {
        bg: theme.palette.grey[50],
        border: theme.palette.divider,
        text: theme.palette.text.primary,
        time: theme.palette.text.secondary,
      };
    }
    
    const cat = category.toLowerCase();
    
    // Primary colors for meetings/appointments (using project primary)
    if (cat === "meeting" || cat === "appointment" || cat.includes("one-on-one") || cat.includes("coffee") || cat.includes("lunch") || cat.includes("dinner") || cat.includes("party") || cat.includes("team")) {
      return {
        bg: theme.palette.info.light || "rgba(63, 140, 255, 0.12)",
        border: theme.palette.primary.light || "#3A81EB",
        text: theme.palette.primary.dark || "#1F6DE0",
        time: theme.palette.primary.main || "#3F8CFF",
      };
    }
    
    // Primary/Info colors for work
    if (cat === "work" || cat === "deep work" || cat === "content" || cat === "product" || cat === "design sync" || cat === "seo") {
      return {
        bg: theme.palette.info.light || "rgba(63, 140, 255, 0.12)",
        border: theme.palette.info.main || "#3F8CFF",
        text: theme.palette.primary.dark || "#1F6DE0",
        time: theme.palette.primary.main || "#3F8CFF",
      };
    }
    
    // Secondary colors for design/planning
    if (cat === "design" || cat === "planning" || cat === "marketing") {
      return {
        bg: theme.palette.grey[50],
        border: theme.palette.divider,
        text: theme.palette.secondary.main,
        time: theme.palette.text.secondary,
      };
    }
    
    // Info colors for personal/social events
    if (cat === "personal" || cat.includes("lunch") || cat.includes("dinner") || cat.includes("team lunch") || cat.includes("team dinner")) {
      return {
        bg: theme.palette.info.light || "rgba(63, 140, 255, 0.12)",
        border: theme.palette.info.main || "#3F8CFF",
        text: theme.palette.info.main || "#3F8CFF",
        time: theme.palette.primary.main || "#3F8CFF",
      };
    }
    
    // Warning colors for reviews/inspections
    if (cat === "review" || cat === "inspection" || cat === "quarterly") {
      return {
        bg: "rgba(255, 189, 33, 0.12)",
        border: theme.palette.warning.main || "#FFBD21",
        text: theme.palette.warning.main || "#FFBD21",
        time: theme.palette.warning.main || "#FFBD21",
      };
    }
    
    // Success colors for completed/success events
    if (cat === "completed" || cat === "success" || cat.includes("marathon") || cat.includes("dinner with")) {
      return {
        bg: theme.palette.success.light || "#E0F9F2",
        border: theme.palette.success.main || "#00D097",
        text: theme.palette.success.main || "#00D097",
        time: theme.palette.success.main || "#00D097",
      };
    }
    
    // Error colors for reminders/important
    if (cat === "reminder" || cat === "important" || cat === "accountant") {
      return {
        bg: theme.palette.error.light || "rgba(246, 81, 96, 0.12)",
        border: theme.palette.error.main || "#F65160",
        text: theme.palette.error.main || "#F65160",
        time: theme.palette.error.main || "#F65160",
      };
    }
    
    // Default neutral gray (using theme)
    return {
      bg: theme.palette.grey[50],
      border: theme.palette.divider,
      text: theme.palette.text.primary,
      time: theme.palette.text.secondary,
    };
  };

  const formatTime = (time: string | undefined) => {
    if (!time) return "12:00 AM";
    try {
      const date = new Date(`2000-01-01T${time}`);
      if (isNaN(date.getTime())) return time.substring(0, 5);
      
      const hours = date.getHours();
      const minutes = date.getMinutes();
      const ampm = hours >= 12 ? "PM" : "AM";
      const displayHours = hours % 12 || 12;
      const displayMinutes = minutes.toString().padStart(2, "0");
      return `${displayHours}:${displayMinutes} ${ampm}`;
    } catch {
      return time.substring(0, 5);
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onClick) {
      onClick(event);
    }
  };

  const colors = getEventColors(event.category);

  return (
    <Box
      sx={{
        backgroundColor: colors.bg,
        border: `1px solid ${colors.border}`,
        borderRadius: "6px",
        display: "flex",
        gap: "4px",
        alignItems: "center",
        padding: "4px 8px",
        width: "100%",
        cursor: onClick ? "pointer" : "default",
        marginBottom: "4px",
        overflow: "hidden",
        minWidth: 0,
        "&:hover": onClick ? {
          opacity: 0.9,
          transition: "opacity 0.2s ease-in-out"
        } : {}
      }}
      onClick={handleClick}
    >
      <Box 
        sx={{ 
          display: "flex",
          flex: "1 0 0",
          gap: "2px",
          alignItems: "center",
          minWidth: 0,
          overflow: "hidden",
          width: "100%",
        }}
      >
        <Typography 
          sx={{ 
            fontSize: "12px",
            fontWeight: 600,
            fontFamily: "'Inter', sans-serif",
            color: colors.text,
            lineHeight: "18px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            flex: "1 0 0",
            minWidth: 0,
          }}
        >
          {event.title || "Untitled Event"}
        </Typography>
        <Typography 
          sx={{ 
            fontSize: "12px",
            fontWeight: 400,
            fontFamily: "'Inter', sans-serif",
            color: colors.time,
            lineHeight: "18px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            flexShrink: 0,
          }}
        >
          {formatTime(event.time)}
        </Typography>
      </Box>
    </Box>
  );
};

export default Event;
