import { Box, Typography } from "@mui/material";

const Event = () => {
  return (
    <Box
      sx={{
        padding: "6px",
        backgroundColor: "#F4F9FD",
        borderRadius: "14px",
        display: "flex",
        overflow: "hidden",
        width: "100%",
      }}
    >
      <Box sx={{ borderLeft: "3px solid #DE92EB" , paddingLeft: "4px"}}>
        <Typography fontSize={"14px"}>Task Revision</Typography>
      </Box>
    </Box>
  );
};

export default Event;
