import { Box, Typography } from "@mui/material";

type CellProps = {
  date: Date | null;
  weekDay: string;
  onClickCell: (date: Date | null) => void;
};

const Cell = ({ date, weekDay, onClickCell }: CellProps) => {
  return (
    <Box
      onClick={() => onClickCell(date)}
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
        cursor: "pointer",
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
      {/* <Event /> */}
    </Box>
  );
};

export default Cell;
