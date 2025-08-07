import { Box, SvgIcon, Typography } from "@mui/material";
import defaultTheme from "./../../../theme";
import YellowArrow from "../../../assets/icons/general/calendar-23.svg?react";
import ClockIcon from "../../../assets/icons/general/calendar-21.svg?react";

const EventCard = () => {
  return (
    <Box sx={{ display: "flex", gap: "16px", paddingTop: "24px" }}>
      <Box
        sx={{
          backgroundColor: defaultTheme.palette.primary.main,
          width: "4px",
          borderRadius: "2px",
        }}
      />
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          flexDirection: "column",
          flex: 1,
          gap: 2,
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography>Presentation of the new department</Typography>
          <SvgIcon component={YellowArrow} />
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography color="secondary">Today | 5:00 PM</Typography>
          <Box
            sx={{
              backgroundColor: "#F4F9FD",
              padding: "8px 10px",
              display: "flex",
              justifyContent: "center",
              alignContent: "center",
              gap: "6px",
              borderRadius: "8px",
            }}
          >
            <SvgIcon component={ClockIcon} />
            <Typography color="secondary">4h</Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default EventCard;
