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
import EmployeesIcon from "../../../assets/icons/sidebar/employees/inactive.svg?react";
import InfoPortalIcon from "../../../assets/icons/sidebar/infoportal/active.svg?react";
import GearIcon from "../../../assets/icons/general/gear.svg?react";
import { useLocation, useNavigate } from "react-router";
import { RequireAdmin } from "../RBAC/RequirePermission";

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
        backgroundColor: "background.paper",
        height: "100%",
        width: "200px",
        display: "flex",
        flexDirection: "column",
        // paddingBottom: "0px",
        boxShadow: (theme) => theme.shadows[1],
        borderRadius: "24px",
        paddingX: "12px",
      }}
    >
      {/* <Box sx={{ position: "absolute", width: "100%", top: 0}}> */}
      <Box sx={{ width: "50px", paddingTop: "24px" }}>
        <Box
          component="img"
          src={ARLOGO}
          sx={(theme) => ({
            width: "100%",
            filter: theme.palette.mode === "dark" 
              ? "brightness(0) invert(1)" 
              : "none",
          })}
        />
      </Box>
      <Box>
        <Stack gap={1}>
          <Item
            onClick={() => handleNavigation("/app/dashboard")}
            active={checkActiveStatus("dashboard")}
            elevation={0}
          >
            <SvgIcon
              component={DashIcon}
              color={checkActiveStatus("dashboard") ? "primary" : "secondary"}
            />
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
            <SvgIcon
              component={ProjectIcon}
              color={checkActiveStatus("projects") ? "primary" : "secondary"}
            />
            <Typography
              color={checkActiveStatus("projects") ? "primary" : "secondary"}
            >
              Project
            </Typography>
          </Item>
          <Item
            active={checkActiveStatus("calendar")}
            onClick={() => handleNavigation("/app/calendar")}
            elevation={0}
          >
            <SvgIcon
              component={CalenderIcon}
              color={checkActiveStatus("calendar") ? "primary" : "secondary"}
            />
            <Typography
              color={checkActiveStatus("calendar") ? "primary" : "secondary"}
            >
              Calender
            </Typography>
          </Item>
          <Item
            onClick={() => handleNavigation("/app/employees")}
            active={checkActiveStatus("employees")}
            elevation={0}
          >
            <SvgIcon
              component={EmployeesIcon}
              color={checkActiveStatus("employees") ? "primary" : "secondary"}
            />
            <Typography
              color={checkActiveStatus("employees") ? "primary" : "secondary"}
            >
              Employees
            </Typography>
          </Item>
          <RequireAdmin>
            <Item
              onClick={() => handleNavigation("/app/vacations")}
              active={checkActiveStatus("vacations")}
              elevation={0}
            >
              <SvgIcon
                component={VacationsIcon}
                color={checkActiveStatus("vacations") ? "primary" : "secondary"}
              />
              <Typography
                color={checkActiveStatus("vacations") ? "primary" : "secondary"}
              >
                Vacations
              </Typography>
            </Item>
          </RequireAdmin>
          <Item
            onClick={() => handleNavigation("/app/info-portal")}
            active={checkActiveStatus("info-portal")}
            elevation={0}
          >
            <SvgIcon
              component={InfoPortalIcon}
              color={checkActiveStatus("info-portal") ? "primary" : "secondary"}
            />
            <Typography
              color={checkActiveStatus("info-portal") ? "primary" : "secondary"}
            >
              Info Portal
            </Typography>
          </Item>
          <RequireAdmin>
            <Item
              onClick={() => handleNavigation("/app/backup")}
              active={checkActiveStatus("backup")}
              elevation={0}
            >
              <SvgIcon
                component={GearIcon}
                color={checkActiveStatus("backup") ? "primary" : "secondary"}
              />
              <Typography
                color={checkActiveStatus("backup") ? "primary" : "secondary"}
              >
                Backup
              </Typography>
            </Item>
          </RequireAdmin>
        </Stack>
      </Box>
    </Box>
    // </Box>
  );
};

export default MainSiderBar;
