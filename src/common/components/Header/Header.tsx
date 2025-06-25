import { Box, Paper, SvgIcon } from "@mui/material";
import BellIcon from "../../../assets/icons/general/calendar-2.svg?react";
import ProfileMenu from "./ProfileMenu";

const Header = () => {
  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        justifyContent: "flex-end",
      }}
    >
      <Box
        sx={{
          display: "flex",
          gap: "24px",
          alignItems: "center",
          paddingRight: "36px",
        }}
      >
        <Paper
          elevation={0}
          sx={{
            padding: "6px",
            display: "flex",
            justifyContent: "center",
            alignContent: "center",
            boxShadow: "0px 6px 58px rgba(196, 203, 214, 0.103611)",
          }}
        >
          <SvgIcon component={BellIcon} />
        </Paper>
        <Paper elevation={0} sx={{ display: "flex"}}>
          <ProfileMenu />
        </Paper>
      </Box>
    </Box>
  );
};

export default Header;
