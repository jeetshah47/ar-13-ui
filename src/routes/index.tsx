import AuthSuccess from "../pages/Auth/AuthSuccess";
import SignIn from "../pages/Auth/SignIn";
import SignUp from "../pages/Auth/SignUp";
import CalendarPage from "../pages/Calendar/CalendarPage";
import DashboardPage from "../pages/Dashboard/DashboardPage";
import EmployeesPage from "../pages/Employees/EmployeesPage";
import ProfilePage from "../pages/Profile/ProfilePage";
import ProjectPage from "../pages/Projects/ProjectPage";
import VacationPage from "../pages/Vacations/VacationPage";

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
    component: <VacationPage />,
  },
  {
    path: "/employees/*",
    component: <EmployeesPage />,
  },
  {
    path: "/profile/*",
    component: <ProfilePage />,
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
];

export { authRoutes, publicRoutes };
