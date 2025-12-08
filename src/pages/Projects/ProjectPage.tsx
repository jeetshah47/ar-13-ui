import { Box } from "@mui/material";
import { Route, Routes, useLocation } from "react-router";
import AddProject from "./pages/AddProject";
import ProjectDetail from "./pages/ProjectDetail";
import ProjectList from "./pages/ProjectList";
import ProjectInfo from "./pages/ProjectInfo";
import { useAppDispatch } from "../../store/store";
import { useEffect } from "react";
import { getProjectListAction } from "../../store/features/projects/projectAction";
// import AnimatedPage from "../../common/components/AnimatedPage/AnimatedPage";

const ProjectPage = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();

  useEffect(() => {
    dispatch(getProjectListAction());
  }, [dispatch]);

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      {/* <AnimatedPage> */}
        <Routes location={location} key={location.pathname}>
          <Route key="/add-project" element={<AddProject />} path="/add-project" />
          <Route key="/details/:projectId/:taskId" element={<ProjectDetail />} path="/details/:projectId/:taskId" />
          <Route key="/info/:projectId" element={<ProjectInfo />} path="/info/:projectId" />
          <Route key="/" element={<ProjectList />} path="/" />
        </Routes>
      {/* </AnimatedPage> */}
    </Box>
  );
};

export default ProjectPage;
