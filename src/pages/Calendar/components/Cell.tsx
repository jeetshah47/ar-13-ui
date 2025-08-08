import { Box, Typography } from "@mui/material";

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
        justifyContent: "space-between",
        padding: "8px",
      }}
    >
      <Box> {weekDay}</Box>
      <Typography>{date}</Typography>
    </Box>
  );
};

export default Cell;
