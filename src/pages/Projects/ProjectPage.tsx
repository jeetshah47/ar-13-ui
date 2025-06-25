import { Box } from "@mui/material";
import { Route, Routes } from "react-router";
import AddProject from "./pages/AddProject";
import ProjectDetail from "./pages/ProjectDetail";

const ProjectPage = () => {
  return (
    <Box>
      <Routes>
        <Route element={<AddProject />} path="/add-project" />
        <Route element={<ProjectDetail />} path="/details" />
      </Routes>
    </Box>
  );
};

export default ProjectPage;
