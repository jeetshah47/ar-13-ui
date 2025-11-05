import {
  alpha,
  Avatar,
  Button,
  Menu,
  MenuItem,
  styled,
  type MenuProps,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useState, type MouseEvent } from "react";
import defaultTheme from "../../../theme";
import { useAppDispatch, useAppSelector, type RootState } from "../../../store/store";
import { authLogout } from "../../../store/features/auth/authSlice";
import { useNavigate } from "react-router";

// Helper function to generate initials from name
const getInitials = (name: string | null): string => {
  if (!name) return "U";
  const parts = name.trim().split(" ");
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

const ProfileMenu = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  
  // Get user data from Redux store
  const userName = useAppSelector((state: RootState) => state.authReducer.user.name);
  const userEmail = useAppSelector((state: RootState) => state.authReducer.user.email);
  
  // Display name or email as fallback
  const displayName = userName || userEmail || "User";
  const initials = getInitials(userName);

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(authLogout());
    setAnchorEl(null);
  };

  const handleProfileClick = () => {
    setAnchorEl(null);
    navigate("/app/profile");
  };

  const StyledMenu = styled((props: MenuProps) => (
    <Menu
      elevation={0}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      {...props}
    />
  ))(({ theme }) => ({
    "& .MuiPaper-root": {
      borderRadius: 6,
      marginTop: theme.spacing(1),
      color: "rgb(55, 65, 81)",
      boxShadow:
        "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",

      "& .MuiMenu-list": {
        padding: "4px 0",
      },
      "& .MuiMenuItem-root": {
        "& .MuiSvgIcon-root": {
          fontSize: 18,
          color: theme.palette.text.secondary,
          marginRight: theme.spacing(1.5),
        },

        "&:active": {
          backgroundColor: alpha(
            theme.palette.secondary.main,
            theme.palette.action.selectedOpacity
          ),
        },
      },
      ...theme.applyStyles("dark", {
        color: theme.palette.grey[300],
      }),
    },
  }));

  return (
    <div>
      <Button
        id="demo-customized-button"
        aria-controls={open ? "demo-customized-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        variant="contained"
        sx={{
          backgroundColor: "#FFFFFF",
          color: "#000",
          "&:hover": {
            backgroundColor: alpha(defaultTheme.palette.secondary.main, 0.1),
          },
          boxShadow: "0px 6px 58px rgba(196, 203, 214, 0.103611)",
          fontSize: "12px",
        }}
        disableElevation
        onClick={handleClick}
        startIcon={
          <Avatar 
            sx={{ 
              width: "24px", 
              height: "24px",
              fontSize: "10px",
              bgcolor: defaultTheme.palette.primary.main,
            }}
          >
            {initials}
          </Avatar>
        }
        endIcon={<KeyboardArrowDownIcon />}
      >
        {displayName}
      </Button>
      <StyledMenu
        id="demo-customized-menu"
        slotProps={{
          list: {
            "aria-labelledby": "demo-customized-button",
          },
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem onClick={handleProfileClick} disableRipple>
          Profile
        </MenuItem>
        <MenuItem onClick={handleLogout} disableRipple>
          Logout
        </MenuItem>
      </StyledMenu>
    </div>
  );
};

export default ProfileMenu;
