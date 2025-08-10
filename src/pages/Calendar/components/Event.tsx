import { Box, SvgIcon, Typography } from "@mui/material";
import DownArrowIcon from "../../../assets/icons/general/calendar-22.svg?react";

const Event = () => {
  return (
    <Box
      sx={{
        padding: "6px",
        backgroundColor: "#F4F9FD",
        borderRadius: "14px",
        display: "flex",
        flexDirection: "column",
        flex: 1,
      }}
    >
      <Box sx={{ borderLeft: "3px solid #DE92EB" , paddingLeft: "4px"}}>
        <Typography>Task Revision</Typography>
        <Box sx={{ display: "flex", gap: "6px", alignItems: "center" }}>
          <Typography variant="caption" color="secondary.main">
            3h
          </Typography>
          <SvgIcon component={DownArrowIcon} />
        </Box>
      </Box>
    </Box>
  );
};

export default Event;
