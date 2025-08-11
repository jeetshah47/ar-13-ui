import { Box, SvgIcon, TextField, Typography } from "@mui/material";
import CrossIcon from "../../../assets/icons/general/calendar-6.svg?react";

const EventForm = () => {
  return (
    <Box
      sx={{
        backgroundColor: "#fff",
        borderRadius: "24px",
        padding: "28px",
        width: "413px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "30px",
        }}
      >
        <Typography fontWeight={"bold"} variant="h6">
          Add Event
        </Typography>
        <Box
          sx={{
            background: "#F4F9FD",
            borderRadius: "14px",
            display: "flex",
            padding: "8px",
            cursor: "pointer",
          }}
          // onClick={(handleCrossClick)}
        >
          <SvgIcon fontSize="small" component={CrossIcon} />
        </Box>
      </Box>
      <Box>
        <Box sx={{ width: "100%", paddingTop: "16px" }}>
          <Typography
            color="secondary"
            sx={{ fontWeight: "bold", fontSize: "14px" }}
          >
            Task Name
          </Typography>
          <TextField sx={{ width: "100%" }} placeholder="Enter Project Name" />
        </Box>
      </Box>
    </Box>
  );
};

export default EventForm;
