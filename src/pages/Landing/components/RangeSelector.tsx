import { Box, SvgIcon, Typography } from "@mui/material";
import CalenderIcon from "../../../assets/icons/general/calendar.svg?react";

const RangeSelector = () => {
  return (
    <Box
      sx={{
        background: "#E6EDF5",
        borderRadius: "14px",
        padding: "12px 14px",
        display: "flex",
        gap: "14px",
        alignItems: "center",
      }}
    >
      <SvgIcon component={CalenderIcon} />
      <Typography>Nov 16, 2020 - Dec 16, 2020</Typography>
    </Box>
  );
};

export default RangeSelector;
