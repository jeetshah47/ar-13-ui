import { Box } from "@mui/material";
import { Routes, Route, useLocation, useNavigate } from "react-router";
import FolderDetailPage from "./pages/FolderDetailPage";
import WindowsFileExplorer from "./components/WindowsFileExplorer";

const InfoPortalList = () => {
  const navigate = useNavigate();

  const handleNavigate = (path: string) => {
    const encodedPath = encodeURIComponent(path);
    navigate(`/app/info-portal/folder?path=${encodedPath}`);
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <WindowsFileExplorer initialPath="/" onNavigate={handleNavigate} />
    </Box>
  );
};

const InfoPortalPage = () => {
  const location = useLocation();

  return (
    <Box
      sx={(theme) => ({
        height: "100%",
        width: "100%",
        backgroundColor: theme.palette.grey[50],
      })}
    >
      <Routes location={location} key={location.pathname}>
        <Route key="/folder" element={<FolderDetailPage />} path="/folder" />
        <Route key="/" element={<InfoPortalList />} path="/" />
      </Routes>
    </Box>
  );
};

export default InfoPortalPage;
