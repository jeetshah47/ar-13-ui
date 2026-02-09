import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import Event from "./Event";
import type { CalendarResponse } from "../../../store/types/Calendar/CalendarResponse";

type CellProps = {
  date: Date | null;
  onClickCell: (date: Date | null) => void;
  events: CalendarResponse[];
  onClickEvent?: (event: CalendarResponse) => void;
  currentMonth?: Date;
};

const Cell = ({ date, onClickCell, events, onClickEvent, currentMonth }: CellProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  
  // Check if date is in current month (for inactive styling)
  const isInactive = date === null || (currentMonth && date && (
    date.getMonth() !== currentMonth.getMonth() || 
    date.getFullYear() !== currentMonth.getFullYear()
  ));

  // Check if date is today
  const isToday = date !== null && (() => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  })();
  
  // Limit events shown (matching Figma design shows max 3-4 events)
  const maxVisibleEvents = 3;
  const visibleEvents = events.slice(0, maxVisibleEvents);
  const remainingCount = events.length - maxVisibleEvents;
  
  return (
    <Box
      onClick={() => onClickCell(date)}
      sx={{
        display: "flex",
        width: "100%",
        minHeight: { xs: "46px", sm: "100px", md: "110px", lg: "120px" },
        height: "100%",
        flexDirection: "column",
        alignItems: { xs: "center", sm: "flex-start" },
        justifyContent: { xs: "center", sm: "flex-start" },
        padding: { xs: "0px", sm: "8px" },
        cursor: "pointer",
        position: "relative",
        backgroundColor: isInactive ? theme.palette.grey[50] : theme.palette.background.paper,
        borderRadius: { xs: "7px", sm: "0px" },
        border: { 
          xs: "none", 
          sm: `1px solid ${theme.palette.divider}` 
        },
        borderRight: { sm: `1px solid ${theme.palette.divider}` },
        borderBottom: { sm: `1px solid ${theme.palette.divider}` },
        overflow: "hidden",
        "&:hover": {
          backgroundColor: isInactive 
            ? undefined 
            : theme.palette.grey[50]
        }
      }}
    >
      {/* Date number - Always show, even if no events */}
      {date ? (
        <Box
          sx={{
            position: "relative",
            width: "24px",
            height: "24px",
            borderRadius: "9999px",
            backgroundColor: isToday ? theme.palette.primary.main : (isInactive ? "transparent" : "transparent"),
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            marginTop: { xs: "0px", sm: "4px" },
            marginBottom: { xs: "0px", sm: "4px" },
            flexShrink: 0,
            paddingLeft: "4px",
          }}
        >
          <Typography 
            sx={{
              fontSize: "12px",
              lineHeight: "18px",
              fontFamily: "'Inter', sans-serif",
              color: isInactive 
                ? theme.palette.text.disabled
                : isToday
                ? theme.palette.primary.contrastText
                : theme.palette.text.primary,
              fontWeight: 600,
              textAlign: "left",
            }}
          >
            {date.getDate()}
          </Typography>
        </Box>
      ) : (
        <Box sx={{ minHeight: "24px", marginTop: { xs: "0px", sm: "4px" } }} />
      )}
      
      {/* Events container - desktop shows event cards */}
      {!isMobile && date && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "4px",
                width: "100%",
                marginTop: "4px",
                opacity: isInactive ? 0.6 : 1,
                overflow: "hidden",
                flex: "1 1 auto",
              }}
            >
          {visibleEvents.length > 0 && visibleEvents.map((event) => (
            <Event key={event.id} event={event} onClick={onClickEvent} />
          ))}
          {remainingCount > 0 && (
            <Box
              sx={{
                padding: "0px 8px",
                marginTop: "4px",
                opacity: isInactive ? 0.6 : 1,
              }}
            >
              <Typography
                sx={{
                  fontSize: "12px",
                  fontWeight: 600,
                  lineHeight: "18px",
                  fontFamily: "'Inter', sans-serif",
                  color: theme.palette.text.secondary,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {remainingCount} more...
              </Typography>
            </Box>
          )}
        </Box>
      )}
      
      {/* Mobile: Show event indicator dots */}
      {isMobile && date && events.length > 0 && (
        <Box
          sx={{
            position: "absolute",
            bottom: "4px",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            gap: "2px",
            alignItems: "center",
            justifyContent: "center",
            flexWrap: "wrap",
            maxWidth: "40px",
          }}
        >
          {events.slice(0, 3).map((event) => {
            const getCategoryColor = (category: string | undefined) => {
              if (!category) return theme.palette.info.main;
              switch (category.toLowerCase()) {
                case "work":
                  return theme.palette.primary.main;
                case "personal":
                  return theme.palette.info.main;
                case "meeting":
                  return theme.palette.primary.main;
                case "appointment":
                  return theme.palette.primary.dark;
                default:
                  return theme.palette.info.main;
              }
            };
            return (
              <Box
                key={event.id}
                onClick={(e) => {
                  e.stopPropagation();
                  if (onClickEvent) onClickEvent(event);
                }}
                sx={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "2px",
                  backgroundColor: getCategoryColor(event.category),
                  cursor: onClickEvent ? "pointer" : "default",
                }}
              />
            );
          })}
        </Box>
      )}
    </Box>
  );
};

export default Cell;
