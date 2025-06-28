import { Box } from "@mui/material";
import { Route, Routes } from "react-router";
import AddProject from "./pages/AddProject";
import ProjectDetail from "./pages/ProjectDetail";
import ProjectList from "./pages/ProjectList";

const ProjectPage = () => {
  return (
    <Box sx={{ height: "100%" }}>
      <Routes>
        <Route element={<AddProject />} path="/add-project" />
        <Route element={<ProjectDetail />} path="/details" />
        <Route element={<ProjectList />} path="/" />
      </Routes>
    </Box>
  );
};

export default ProjectPage;
