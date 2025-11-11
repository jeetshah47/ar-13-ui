import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import Event from "./Event";
import type { CalendarResponse } from "../../../store/types/Calendar/CalendarResponse";

type CellProps = {
  date: Date | null;
  weekDay: string;
  onClickCell: (date: Date | null) => void;
  events: CalendarResponse[];
  hasEvents: boolean;
  onClickEvent?: (event: CalendarResponse) => void;
};

const Cell = ({ date, weekDay, onClickCell, events, hasEvents, onClickEvent }: CellProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  
  return (
    <Box
      onClick={() => onClickCell(date)}
      sx={(theme) => ({
        border: `1px solid ${theme.palette.divider}`,
        display: "flex",
        height: { xs: "60px", sm: "128px" },
        minHeight: { xs: "60px", sm: "128px" },
        flexDirection: "column",
        alignItems: "center",
        padding: { xs: "4px", sm: "8px" },
        cursor: "pointer",
        position: "relative",
        backgroundColor: hasEvents 
          ? theme.palette.mode === "dark" ? theme.palette.grey[100] : "#F8F9FA"
          : "transparent",
        ":hover": {
          backgroundColor: theme.palette.grey[50]
        }
      })}
    >
      {weekDay && (
        <Box
          sx={(theme) => ({
            backgroundColor: theme.palette.grey[50],
            display: "flex",
            padding: { xs: "2px 4px", sm: "4px 8px" },
            color: theme.palette.text.secondary,
            borderRadius: { xs: "4px", sm: "8px" },
            fontSize: { xs: "10px", sm: "12px" },
          })}
        >
          {weekDay}
        </Box>
      )}
      <Typography fontSize={{ xs: "12px", sm: "14px" }}>{date?.getDate()}</Typography>
      
      {/* Events container */}
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
        {events.slice(0, isMobile ? 2 : 3).map((event) => (
          <Event key={event.id} event={event} onClick={onClickEvent} />
        ))}
        {events.length > (isMobile ? 2 : 3) && (
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
            +{events.length - (isMobile ? 2 : 3)} more
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Cell;
