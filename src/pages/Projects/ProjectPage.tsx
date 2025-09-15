import { Box } from "@mui/material";
import { Route, Routes } from "react-router";
import AddProject from "./pages/AddProject";
import ProjectDetail from "./pages/ProjectDetail";
import ProjectList from "./pages/ProjectList";
import { useAppDispatch } from "../../store/store";
import { useEffect } from "react";
import { getProjectListAction } from "../../store/features/projects/projectAction";

const ProjectPage = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getProjectListAction());
  }, [dispatch]);

  return (
    <Box sx={{ height: "100%" }}>
      <Routes>
        <Route element={<AddProject />} path="/add-project" />
        <Route element={<ProjectDetail />} path="/details/:projectId/:taskId" />
        <Route element={<ProjectList />} path="/" />
      </Routes>
    </Box>
  );
};

export default ProjectPage;
