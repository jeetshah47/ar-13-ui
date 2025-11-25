import { Box } from "@mui/material";
import { useSearchParams, useNavigate } from "react-router";
import WindowsFileExplorer from "../components/WindowsFileExplorer";

const FolderDetailPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const folderPath = searchParams.get("path") || "/";

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
      <WindowsFileExplorer initialPath={folderPath} onNavigate={handleNavigate} />
    </Box>
  );
};

export default FolderDetailPage;
