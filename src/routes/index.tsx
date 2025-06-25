import DashboardPage from "../pages/Dashboard/DashboardPage";
import ProjectPage from "../pages/Projects/ProjectPage";

const authRoutes = [
  {
    path: "/dashboard",
    component: <DashboardPage />,
  },
  {
    path: "/projects/*",
    component: <ProjectPage />,
  },
];

export { authRoutes };
