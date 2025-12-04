import { Box, Paper, SvgIcon, Badge } from "@mui/material";
import { useState } from "react";
import BellIcon from "../../../assets/icons/general/calendar-2.svg?react";
import ProfileMenu from "./ProfileMenu";
import NotificationModal from "../NotificationModal";
import { useNotificationCount } from "../../../contexts/NotificationContext";
import ThemeToggle from "../ThemeToggle/ThemeToggle";

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
        marginBottom: { xs: "8px", sm: "12px", md: "16px" },
      }}
    >
      <Box
        sx={{
          display: "flex",
          gap: { xs: "12px", sm: "16px", md: "24px" },
          alignItems: "center",
          paddingRight: { xs: "8px", sm: "16px", md: "36px" },
          flexWrap: "wrap",
        }}
      >
        <ThemeToggle />
        <Paper
          elevation={0}
          sx={{
            padding: { xs: "4px", sm: "6px" },
            display: "flex",
            justifyContent: "center",
            alignContent: "center",
            boxShadow: (theme) => theme.shadows[1],
            cursor: "pointer",
            backgroundColor: "background.paper",
            "&:hover": {
              backgroundColor: "action.hover",
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
                fontSize: { xs: "9px", sm: "10px" },
                fontWeight: 600,
                minWidth: { xs: "16px", sm: "18px" },
                height: { xs: "16px", sm: "18px" },
                borderRadius: { xs: "8px", sm: "9px" },
              },
            }}
          >
            <SvgIcon 
              component={BellIcon} 
              sx={{ fontSize: { xs: "20px", sm: "24px" } }}
            />
          </Badge>
        </Paper>
        <Paper 
          elevation={0} 
          sx={{ 
            display: "flex",
            "& > *": {
              fontSize: { xs: "12px", sm: "14px" }
            }
          }}
        >
          <ProfileMenu />
        </Paper>
      </Box>
      {notificationOpen && <NotificationModal onClose={handleNotificationClose} />}
    </Box>
  );
};

export default Header;
