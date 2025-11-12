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
import { PermissionRoute } from "../common/components/RBAC/PermissionRoute";
import { Navigate } from "react-router";

const authRoutes = [
  {
    path: "/dashboard",
    component: (
      <PermissionRoute permission="dashboard:read" redirectTo="/app/dashboard">
        <DashboardPage />
      </PermissionRoute>
    ),
  },
  {
    path: "/projects/*",
    component: (
      <PermissionRoute permission="projects:read" redirectTo="/app/dashboard">
        <ProjectPage />
      </PermissionRoute>
    ),
  },
  {
    path: "/calendar/*",
    component: (
      <PermissionRoute permission="calendar:read" redirectTo="/app/dashboard">
        <CalendarPage />
      </PermissionRoute>
    ),
  },
  {
    path: "/vacations/*",
    component: (
      <PermissionRoute 
        permission="vacation:read" 
        role="Admin"
        redirectTo="/app/dashboard"
      >
        <VacationPage />
      </PermissionRoute>
    ),
  },
  {
    path: "/employees",
    component: (
      <PermissionRoute permission="employees:read" redirectTo="/app/dashboard">
        <EmployeesPage />
      </PermissionRoute>
    ),
  },
  {
    path: "/employees/:userId",
    component: (
      <PermissionRoute permission="employees:read" redirectTo="/app/dashboard">
        <EmployeeProfilePage />
      </PermissionRoute>
    ),
  },
  {
    path: "/profile/*",
    component: (
      <PermissionRoute permission="users:profile" redirectTo="/app/dashboard">
        <ProfilePage />
      </PermissionRoute>
    ),
  },
  {
    path: "/info-portal/*",
    component: (
      <PermissionRoute permission="infoPortal:read" redirectTo="/app/dashboard">
        <InfoPortalPage />
      </PermissionRoute>
    ),
  },
  {
    path: "/backup",
    component: (
      <PermissionRoute 
        permission="backup:read"
        redirectTo="/app/dashboard"
      >
        <BackupPage />
      </PermissionRoute>
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
