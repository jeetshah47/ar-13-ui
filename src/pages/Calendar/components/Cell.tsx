import { Box, Typography } from "@mui/material";
import Event from "./Event";
import type { CalendarResponse } from "../../../store/types/Calendar/CalendarResponse";

type CellProps = {
  date: Date | null;
  weekDay: string;
  onClickCell: (date: Date | null) => void;
  events: CalendarResponse[];
  hasEvents: boolean;
};

const Cell = ({ date, weekDay, onClickCell, events, hasEvents }: CellProps) => {
  return (
    <Box
      onClick={() => onClickCell(date)}
      sx={{
        border: "1px solid #E6EBF5",
        display: "flex",
        height: "128px",
        flexDirection: "column",
        alignItems: "center",
        padding: "8px",
        cursor: "pointer",
        position: "relative",
        backgroundColor: hasEvents ? "#F8F9FA" : "transparent",
        ":hover": {
          backgroundColor: "#F4F9FD"
        }
      }}
    >
      {weekDay && (
        <Box
          sx={{
            backgroundColor: "#F4F9FD",
            display: "flex",
            padding: "4px 8px",
            color: "#7D8592",
            borderRadius: "8px",
            fontSize: "12px",
          }}
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
          <Event key={event.id} event={event} />
        ))}
        {events.length > 3 && (
          <Box
            sx={{
              fontSize: "10px",
              color: "#7D8592",
              textAlign: "center",
              padding: "2px",
              backgroundColor: "#E8F4FD",
              borderRadius: "4px",
              marginTop: "1px"
            }}
          >
            +{events.length - 3} more
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Cell;
