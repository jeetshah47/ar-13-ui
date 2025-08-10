import {
  alpha,
  Box,
  Paper,
  Stack,
  styled,
  SvgIcon,
  Typography,
} from "@mui/material";
import ARLOGO from "../../../assets/logo/s.png";
import DashIcon from "../../../assets/icons/sidebar/dashboard/active.svg?react";
import ProjectIcon from "../../../assets/icons/sidebar/projects/inactive.svg?react";
import CalenderIcon from "../../../assets/icons/sidebar/calendar/inactive.svg?react";
import VacationsIcon from "../../../assets/icons/sidebar/vacations/inactive.svg?react";
import InfoPortalIcon from "../../../assets/icons/sidebar/employees/inactive.svg?react";
import { useLocation, useNavigate } from "react-router";

interface ItemProps {
  active?: boolean;
}

const MainSiderBar = () => {
  const Item = styled(Paper, {
    shouldForwardProp: (prop) => prop !== "active",
  })<ItemProps>(({ theme, active }) => ({
    backgroundColor: active
      ? alpha(theme.palette.primary.main, 0.12)
      : undefined,
    ...theme.typography.body2,
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    textAlign: "center",
    color: (theme.vars ?? theme).palette.text.secondary,
    flexGrow: 1,
    display: "flex",
    alignContent: "center",

    gap: "12px",
    // padding: "6px 0",
    // paddingInline: '24px',
    ":hover": {
      backgroundColor: alpha(theme.palette.primary.main, 0.12),
      color: (theme.vars ?? theme).palette.text.secondary,
      cursor: "pointer",
    },
  }));

  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const checkActiveStatus = (path: string) => {
    return location.pathname.includes(path);
  };

  return (
    <Box
      sx={{
        backgroundColor: "white",
        height: "100%",
        width: "200px",
        // paddingBottom: "0px",
        boxShadow: "0px 6px 58px rgba(196, 203, 214, 0.103611)",
        borderRadius: "24px",
        paddingX: "12px",
      }}
    >
      {/* <Box sx={{ position: "absolute", width: "100%", top: 0}}> */}
      <Box sx={{ width: "50px", paddingTop: "24px" }}>
        <img style={{ width: "100%" }} src={ARLOGO} />
      </Box>
      <Box>
        <Stack>
          <Item active={checkActiveStatus("dashboard")} elevation={0}>
            <SvgIcon component={DashIcon} />
            <Typography
              color={checkActiveStatus("dashboard") ? "primary" : "secondary"}
            >
              Dashboard
            </Typography>
          </Item>
          <Item
            active={checkActiveStatus("projects")}
            onClick={() => handleNavigation("/app/projects")}
            elevation={0}
          >
            <SvgIcon component={ProjectIcon} />
            <Typography
              color={checkActiveStatus("projects") ? "primary" : "secondary"}
            >
              Project
            </Typography>
          </Item>
          <Item
            active={checkActiveStatus("calender")}
            onClick={() => handleNavigation("/app/calendar")}
            elevation={0}
          >
            <SvgIcon component={CalenderIcon} />
            <Typography
              color={checkActiveStatus("calender") ? "primary" : "secondary"}
            >
              Calender
            </Typography>
          </Item>
          <Item active={checkActiveStatus("vacations")} elevation={0}>
            <SvgIcon component={VacationsIcon} />
            <Typography
              color={checkActiveStatus("vacations") ? "primary" : "secondary"}
            >
              Vacations
            </Typography>
          </Item>
          <Item active={checkActiveStatus("info-portal")} elevation={0}>
            <SvgIcon component={InfoPortalIcon} />
            <Typography
              color={checkActiveStatus("info-portal") ? "primary" : "secondary"}
            >
              Info Portal
            </Typography>
          </Item>
        </Stack>
      </Box>
    </Box>
    // </Box>
  );
};

export default MainSiderBar;
