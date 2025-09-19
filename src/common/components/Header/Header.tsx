import { Box, Paper, SvgIcon, Badge } from "@mui/material";
import { useState } from "react";
import BellIcon from "../../../assets/icons/general/calendar-2.svg?react";
import ProfileMenu from "./ProfileMenu";
import NotificationModal from "../NotificationModal";
import { useNotificationCount } from "../../../contexts/NotificationContext";

const Header = () => {
  const [notificationOpen, setNotificationOpen] = useState(false);
  const { unread } = useNotificationCount();

  const handleNotificationClick = () => {
    setNotificationOpen(true);
  };

  const handleNotificationClose = () => {
    setNotificationOpen(false);
  };

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
            cursor: "pointer",
            "&:hover": {
              backgroundColor: "#F8FAFC",
            },
          }}
          onClick={handleNotificationClick}
        >
          <Badge
            badgeContent={unread > 0 ? unread : undefined}
            color="error"
            sx={{
              "& .MuiBadge-badge": {
                backgroundColor: "#EF4444",
                color: "white",
                fontSize: "10px",
                fontWeight: 600,
                minWidth: "18px",
                height: "18px",
                borderRadius: "9px",
              },
            }}
          >
            <SvgIcon component={BellIcon} />
          </Badge>
        </Paper>
        <Paper elevation={0} sx={{ display: "flex"}}>
          <ProfileMenu />
        </Paper>
      </Box>
      {notificationOpen && <NotificationModal onClose={handleNotificationClose} />}
    </Box>
  );
};

export default Header;
