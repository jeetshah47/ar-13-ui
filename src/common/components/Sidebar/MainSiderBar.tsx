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
import { useLocation, useNavigate } from "react-router";
import { RequireAdmin } from "../RBAC/RequirePermission";
import { usePermissions } from "../../../store/hooks/usePermissions";
import BarChartIcon from "@mui/icons-material/BarChart";
import DescriptionIcon from "@mui/icons-material/Description";
import HistoryIcon from "@mui/icons-material/History";

interface ItemProps {
  active?: boolean;
}

interface MainSiderBarProps {
  onNavigate?: () => void;
}

const MainSiderBar = ({ onNavigate }: MainSiderBarProps = {}) => {
  const { checkPermission } = usePermissions();
  
  const Item = styled(Paper, {
    shouldForwardProp: (prop) => prop !== "active",
  })<ItemProps>(({ theme, active }) => ({
    backgroundColor: active
      ? alpha(theme.palette.primary.main, 0.12)
      : undefined,
    ...theme.typography.body2,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    paddingTop: theme.spacing(0.75),
    paddingBottom: theme.spacing(0.75),
    textAlign: "center",
    color: (theme.vars ?? theme).palette.text.secondary,
    flexGrow: 1,
    display: "flex",
    alignContent: "center",
    gap: "8px",
    fontSize: "12px",
    [theme.breakpoints.up("sm")]: {
      paddingLeft: theme.spacing(4),
      paddingRight: theme.spacing(4),
      paddingTop: theme.spacing(1),
      paddingBottom: theme.spacing(1),
      gap: "12px",
      fontSize: "14px",
    },
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
    // Close drawer on mobile after navigation
    if (onNavigate) {
      onNavigate();
    }
  };

  const checkActiveStatus = (path: string) => {
    return location.pathname.includes(path);
  };

  return (
    <Box
      sx={{
        backgroundColor: "background.paper",
        height: "100%",
        width: { xs: "100%", sm: "200px" },
        display: "flex",
        flexDirection: "column",
        boxShadow: (theme) => theme.shadows[1],
        borderRadius: { xs: "0px", sm: "24px" },
        paddingX: { xs: "8px", sm: "12px" },
      }}
    >
      <Box sx={{ width: { xs: "40px", sm: "50px" }, paddingTop: { xs: "16px", sm: "24px" } }}>
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
      <Box sx={{ flex: 1, overflowY: "auto" }}>
        <Stack gap={{ xs: 0.5, sm: 1 }}>
          {checkPermission("dashboard:read") && (
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
          )}
          {checkPermission("projects:read") && (
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
          )}
          {checkPermission("calendar:read") && (
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
          )}
          {checkPermission("employees:read") && (
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
          )}
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
          {checkPermission("infoPortal:read") && (
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
          )}
          {/* Drawing List sidebar - Only visible to users with drawingList:read permission */}
          {checkPermission("drawingList:read") && (
            <Item
              onClick={() => handleNavigation("/app/drawing-list")}
              active={checkActiveStatus("drawing-list")}
              elevation={0}
            >
              <SvgIcon
                component={DescriptionIcon}
                color={checkActiveStatus("drawing-list") ? "primary" : "secondary"}
              />
              <Typography
                color={checkActiveStatus("drawing-list") ? "primary" : "secondary"}
              >
                Drawing List
              </Typography>
            </Item>
          )}
          {/* Metrics sidebar - Only visible to Admin users */}
          <RequireAdmin>
            <Item
              onClick={() => handleNavigation("/app/metrics")}
              active={checkActiveStatus("metrics")}
              elevation={0}
            >
              <SvgIcon
                component={BarChartIcon}
                color={checkActiveStatus("metrics") ? "primary" : "secondary"}
              />
              <Typography
                color={checkActiveStatus("metrics") ? "primary" : "secondary"}
              >
                Metrics
              </Typography>
            </Item>
          </RequireAdmin>
          {/* Audit Logs sidebar - Only visible to Admin users */}
          <RequireAdmin>
            <Item
              onClick={() => handleNavigation("/app/audit-logs")}
              active={checkActiveStatus("audit-logs")}
              elevation={0}
            >
              <SvgIcon
                component={HistoryIcon}
                color={checkActiveStatus("audit-logs") ? "primary" : "secondary"}
              />
              <Typography
                color={checkActiveStatus("audit-logs") ? "primary" : "secondary"}
              >
                Audit Logs
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
