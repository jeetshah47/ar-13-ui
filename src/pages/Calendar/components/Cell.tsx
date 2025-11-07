import { Box, Typography } from "@mui/material";
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
  return (
    <Box
      onClick={() => onClickCell(date)}
      sx={(theme) => ({
        border: `1px solid ${theme.palette.divider}`,
        display: "flex",
        height: "128px",
        flexDirection: "column",
        alignItems: "center",
        padding: "8px",
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
            padding: "4px 8px",
            color: theme.palette.text.secondary,
            borderRadius: "8px",
            fontSize: "12px",
          })}
        >
          {weekDay}
        </Box>
      )}
      <Typography fontSize={"14px"}>{date?.getDate()}</Typography>
      
      {/* Events container */}
      <Box
        sx={{
          position: "absolute",
          bottom: "4px",
          left: "4px",
          right: "4px",
          maxHeight: "60px",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          gap: "1px"
        }}
      >
        {events.slice(0, 3).map((event) => (
          <Event key={event.id} event={event} onClick={onClickEvent} />
        ))}
        {events.length > 3 && (
          <Box
            sx={(theme) => ({
              fontSize: "10px",
              color: theme.palette.text.secondary,
              textAlign: "center",
              padding: "2px",
              backgroundColor: theme.palette.primary.light,
              borderRadius: "4px",
              marginTop: "1px"
            })}
          >
            +{events.length - 3} more
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Cell;
