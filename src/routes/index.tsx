import AuthSuccess from "../pages/Auth/AuthSuccess";
import AccountLinked from "../pages/Auth/AccountLinked";
import SignIn from "../pages/Auth/SignIn";
import SignUp from "../pages/Auth/SignUp";
import CalendarPage from "../pages/Calendar/CalendarPage";
import DashboardPage from "../pages/Dashboard/DashboardPage";
import EmployeesPage from "../pages/Employees/EmployeesPage";
import EmployeeProfilePage from "../pages/Employees/EmployeeProfilePage";
import ProfilePage from "../pages/Profile/ProfilePage";
import ProjectPage from "../pages/Projects/ProjectPage";
import VacationPage from "../pages/Vacations/VacationPage";
import InfoPortalPage from "../pages/InfoPortal/InfoPortalPage";
import BackupPage from "../pages/Backup/BackupPage";
import { RequireAdmin } from "../common/components/RBAC/RequirePermission";
import { Navigate } from "react-router";

const authRoutes = [
  {
    path: "/dashboard",
    component: <DashboardPage />,
  },
  {
    path: "/projects/*",
    component: <ProjectPage />,
  },
  {
    path: "/calendar/*",
    component: <CalendarPage />,
  },
  {
    path: "/vacations/*",
    component: (
      <RequireAdmin fallback={<Navigate to="/dashboard" replace />}>
        <VacationPage />
      </RequireAdmin>
    ),
  },
  {
    path: "/employees",
    component: <EmployeesPage />,
  },
  {
    path: "/employees/:userId",
    component: <EmployeeProfilePage />,
  },
  {
    path: "/profile/*",
    component: <ProfilePage />,
  },
  {
    path: "/info-portal/*",
    component: <InfoPortalPage />,
  },
  {
    path: "/backup",
    component: (
      <RequireAdmin fallback={<Navigate to="/dashboard" replace />}>
        <BackupPage />
      </RequireAdmin>
    ),
  },
];

const publicRoutes = [
  {
    path: "/auth/register",
    component: <SignUp />,
  },
  {
    path: "/auth/login",
    component: <SignIn />,
  },
  {
    path: "/auth/get-started",
    component: <AuthSuccess />,
  },
  {
    path: "/account/linked",
    component: <AccountLinked />,
  },
];

export { authRoutes, publicRoutes };
