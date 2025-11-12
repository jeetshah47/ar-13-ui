import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import Event from "./Event";
import type { CalendarResponse } from "../../../store/types/Calendar/CalendarResponse";

type CellProps = {
  date: Date | null;
  weekDay: string;
  onClickCell: (date: Date | null) => void;
  events: CalendarResponse[];
  onClickEvent?: (event: CalendarResponse) => void;
  currentMonth?: Date;
};

const Cell = ({ date, weekDay, onClickCell, events, onClickEvent, currentMonth }: CellProps) => {
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
  
  return (
    <Box
      onClick={() => onClickCell(date)}
      sx={(theme) => ({
        display: "flex",
        width: { xs: "46px", sm: "100%" },
        height: { xs: "46px", sm: "128px" },
        minWidth: { xs: "46px", sm: "auto" },
        minHeight: { xs: "46px", sm: "128px" },
        flexDirection: "column",
        alignItems: "center",
        justifyContent: { xs: "center", sm: "flex-start" },
        padding: { xs: "0px", sm: "8px" },
        cursor: "pointer",
        position: "relative",
        backgroundColor: "transparent",
        borderRadius: { xs: "7px", sm: "0px" },
        border: { xs: "none", sm: `1px solid ${theme.palette.divider}` },
        ":hover": {
          backgroundColor: isInactive 
            ? undefined 
            : theme.palette.grey[50]
        }
      })}
    >
      {weekDay && (
        <Box
          sx={(theme) => ({
            backgroundColor: theme.palette.grey[50],
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: { xs: "3px 9px", sm: "4px 8px" },
            color: theme.palette.text.secondary,
            borderRadius: { xs: "7px", sm: "8px" },
            fontSize: { xs: "14px", sm: "12px" },
            fontWeight: { xs: 600, sm: 400 },
            lineHeight: { xs: "1.57", sm: "1.5" },
            width: { xs: "46px", sm: "auto" },
            height: { xs: "28px", sm: "auto" },
            marginBottom: { xs: "0px", sm: "4px" },
          })}
        >
          {weekDay}
        </Box>
      )}
      <Typography 
        sx={{
          fontSize: { xs: "14px", sm: "14px" },
          lineHeight: { xs: "1.57", sm: "1.5" },
          color: isInactive 
            ? (theme.palette.mode === "dark" ? "rgba(55, 67, 135, 0.3)" : "rgba(55, 67, 135, 0.3)")
            : isToday
            ? theme.palette.primary.main
            : (theme.palette.mode === "dark" ? "#202860" : "#202860"),
          fontWeight: isToday ? 700 : 400,
          textAlign: "center",
          marginTop: { xs: "0px", sm: "4px" },
        }}
      >
        {date?.getDate()}
      </Typography>
      
      {/* Events container - mobile shows dots, desktop shows event cards */}
      {isMobile ? (
        // Mobile: Show event indicator dots
        <Box
          sx={{
            position: "absolute",
            bottom: { xs: "4px", sm: "4px" },
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            gap: { xs: "2px", sm: "4px" },
            alignItems: "center",
            justifyContent: "center",
            flexWrap: "wrap",
            maxWidth: "40px",
          }}
        >
          {events.slice(0, 3).map((event) => {
            const getCategoryColor = (category: string | undefined) => {
              if (!category) return "#DE92EB";
              switch (category.toLowerCase()) {
                case "work":
                  return "#3F8CFF";
                case "personal":
                  return "#DE92EB";
                case "meeting":
                  return "#3F8CFF";
                case "appointment":
                  return "#6D5DD3";
                default:
                  return "#DE92EB";
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
      ) : (
        // Desktop: Show event cards
        <Box
          sx={{
            position: "absolute",
            bottom: { xs: "2px", sm: "4px" },
            left: { xs: "2px", sm: "4px" },
            right: { xs: "2px", sm: "4px" },
            maxHeight: { xs: "30px", sm: "60px" },
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            gap: { xs: "0.5px", sm: "1px" }
          }}
        >
          {events.slice(0, 3).map((event) => (
            <Event key={event.id} event={event} onClick={onClickEvent} />
          ))}
          {events.length > 3 && (
            <Box
              sx={(theme) => ({
                fontSize: { xs: "8px", sm: "10px" },
                color: theme.palette.text.secondary,
                textAlign: "center",
                padding: { xs: "1px", sm: "2px" },
                backgroundColor: theme.palette.primary.light,
                borderRadius: { xs: "2px", sm: "4px" },
                marginTop: { xs: "0.5px", sm: "1px" }
              })}
            >
              +{events.length - 3} more
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};

export default Cell;
