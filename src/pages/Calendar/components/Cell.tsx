import { Box, Typography } from "@mui/material";
import Event from "./Event";

type CellProps = {
  date: number | undefined;
  weekDay: string;
};

const Cell = ({ date, weekDay }: CellProps) => {
  return (
    <Box
      sx={{
        border: "1px solid #E6EBF5",
        // flex: 1,
        display: "flex",
        // width: "230px",
        height: "128px",
        // textAlign: "end",
        flexDirection: "column",
        alignItems: "center",
        padding: "8px",
        ":hover": {
          cursor: "pointer",
        },
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
      <Typography fontSize={"14px"}>{date}</Typography>
      {/* <Event /> */}
    </Box>
  );
};

export default Cell;
