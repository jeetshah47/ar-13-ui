import AuthSuccess from "../pages/Auth/AuthSuccess";
import SignIn from "../pages/Auth/SignIn";
import SignUp from "../pages/Auth/SignUp";
import DashboardPage from "../pages/Dashboard/DashboardPage";
import ProjectPage from "../pages/Projects/ProjectPage";

const authRoutes = [
  {
    path: "/app/dashboard",
    component: <DashboardPage />,
  },
  {
    path: "/app/projects/*",
    component: <ProjectPage />,
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
