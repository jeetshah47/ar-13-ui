import { useState, useEffect, useMemo } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  IconButton,
  Divider,
  TextField,
  InputAdornment,
  Paper,
  Toolbar,
  Link,
} from "@mui/material";
import DownloadProgressModal from "../../../common/components/DownloadProgressModal";
import {
  ArrowBack,
  ArrowForward,
  ArrowUpward,
  Refresh,
  Search,
  FolderOff,
  ChevronRight,
} from "@mui/icons-material";
import type { FileBrowserItem } from "../../../store/apis/storageApi";
import { browseNAS, downloadFile } from "../../../store/apis/storageApi";
import { openFileWithDefaultApp } from "../../../services/nas/nasService";
import FileExplorer from "../../InfoPortal/components/FileExplorer";
import toast from "react-hot-toast";

interface ProjectFilesViewProps {
  projectCode: string;
}

// Custom breadcrumb for project files
interface ProjectBreadcrumbProps {
  path: string;
  basePath: string;
  projectCode: string;
  onNavigate: (path: string) => void;
}

const ProjectBreadcrumb = ({ path, basePath, projectCode, onNavigate }: ProjectBreadcrumbProps) => {
  // Get the relative path from basePath
  const relativePath = path.startsWith(basePath) ? path.slice(basePath.length) : path;
  const pathParts = relativePath.split("/").filter((part) => part !== "");
  
  const breadcrumbItems = [
    { name: projectCode, path: basePath },
    ...pathParts.map((part, index) => ({
      name: part,
      path: basePath + "/" + pathParts.slice(0, index + 1).join("/"),
    })),
  ];

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: "4px",
        flexWrap: "wrap",
      }}
    >
      {breadcrumbItems.map((item, index) => (
        <Box key={item.path} sx={{ display: "flex", alignItems: "center", gap: "4px" }}>
          {index > 0 && (
            <ChevronRight
              sx={{
                fontSize: "16px",
                color: (theme) => theme.palette.text.secondary,
                marginX: "4px",
              }}
            />
          )}
          {index === breadcrumbItems.length - 1 ? (
            <Typography
              sx={{
                fontSize: "14px",
                fontWeight: 500,
                color: (theme) => theme.palette.text.primary,
              }}
            >
              {item.name}
            </Typography>
          ) : (
            <Link
              component="button"
              onClick={() => onNavigate(item.path)}
              sx={{
                fontSize: "14px",
                fontWeight: 400,
                color: (theme) => theme.palette.primary.main,
                textDecoration: "none",
                cursor: "pointer",
                "&:hover": {
                  textDecoration: "underline",
                },
              }}
            >
              {item.name}
            </Link>
          )}
        </Box>
      ))}
    </Box>
  );
};

const ProjectFilesView = ({ projectCode }: ProjectFilesViewProps) => {
  const basePath = `/${projectCode}`;
  const [currentPath, setCurrentPath] = useState<string>(basePath);
  const [items, setItems] = useState<FileBrowserItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [folderNotFound, setFolderNotFound] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [history, setHistory] = useState<string[]>([basePath]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);
  
  // Download progress state
  const [downloadProgressOpen, setDownloadProgressOpen] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [downloadingFilename, setDownloadingFilename] = useState<string>("");

  // Reset state when project code changes
  useEffect(() => {
    const newBasePath = `/${projectCode}`;
    setCurrentPath(newBasePath);
    setHistory([newBasePath]);
    setHistoryIndex(0);
    setFolderNotFound(false);
    setError(null);
    setSearchQuery("");
  }, [projectCode]);

  useEffect(() => {
    loadFolderContents(currentPath);
  }, [currentPath]);

  const loadFolderContents = async (path: string) => {
    setLoading(true);
    setError(null);
    setFolderNotFound(false);
    try {
      const response = await browseNAS(path);
      setItems(response.files);
    } catch (err: any) {
      console.error("Failed to load folder contents:", err);
      // Check if it's a 404 or folder not found error
      if (
        err.response?.status === 404 ||
        err.message?.toLowerCase().includes("not found") ||
        err.message?.toLowerCase().includes("no such file or directory")
      ) {
        setFolderNotFound(true);
        setItems([]);
      } else {
        setError(err.message || "Failed to load folder contents");
        setItems([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleNavigate = (path: string) => {
    // Ensure we don't navigate above the project folder
    if (!path.startsWith(basePath) && path !== basePath) {
      return;
    }
    setCurrentPath(path);
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(path);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const handleBack = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setCurrentPath(history[newIndex]);
    }
  };

  const handleForward = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setCurrentPath(history[newIndex]);
    }
  };

  const handleUp = () => {
    if (currentPath !== basePath) {
      const parentPath = currentPath.split("/").slice(0, -1).join("/") || basePath;
      // Don't go above project folder
      if (parentPath.startsWith(basePath) || parentPath === basePath) {
        handleNavigate(parentPath);
      } else {
        handleNavigate(basePath);
      }
    }
  };

  const handleItemClick = (item: FileBrowserItem) => {
    if (item.isFolder) {
      handleNavigate(item.path);
    }
  };

  const handleItemDoubleClick = async (item: FileBrowserItem) => {
    if (item.isFolder) {
      handleNavigate(item.path);
    } else {
      // Open file with default app (for Electron) or download (for web)
      try {
        // Check if running in Electron
        if (window.electronAPI) {
          // Use NAS mount to open file directly
          const result = await openFileWithDefaultApp(item.path, item.size);
          if (result.success) {
            toast.success(`Opening file: ${item.name}`);
          } else {
            toast.error(result.error || "Failed to open file");
            // Fallback to download if mount fails
            try {
              // Show download progress modal
              setDownloadingFilename(item.name);
              setDownloadProgress(0);
              setDownloadProgressOpen(true);
              
              await downloadFile(item.path, item.name, (progress) => {
                setDownloadProgress(progress);
              });
              
              // Close modal after a short delay to show completion
              setTimeout(() => {
                setDownloadProgressOpen(false);
                setDownloadProgress(0);
              }, 1000);
            } catch (downloadErr) {
              console.error("Failed to download file:", downloadErr);
              setDownloadProgressOpen(false);
              toast.error("Failed to download file");
            }
          }
        } else {
          // Web browser: download file
          // Show download progress modal
          setDownloadingFilename(item.name);
          setDownloadProgress(0);
          setDownloadProgressOpen(true);
          
          await downloadFile(item.path, item.name, (progress) => {
            setDownloadProgress(progress);
          });
          
          // Close modal after a short delay to show completion
          setTimeout(() => {
            setDownloadProgressOpen(false);
            setDownloadProgress(0);
          }, 1000);
        }
      } catch (err: any) {
        console.error("Failed to open/download file:", err);
        setDownloadProgressOpen(false);
        toast.error(err.message || "Failed to open/download file");
      }
    }
  };

  const handleBreadcrumbNavigate = (path: string) => {
    // Ensure we don't navigate above the project folder
    if (path.startsWith(basePath) || path === basePath) {
      handleNavigate(path);
    } else {
      handleNavigate(basePath);
    }
  };

  const filteredItems = useMemo(() => {
    if (!searchQuery) return items;
    const query = searchQuery.toLowerCase();
    return items.filter((item) => item.name.toLowerCase().includes(query));
  }, [items, searchQuery]);

  const folders = filteredItems.filter((item) => item.isFolder);
  const files = filteredItems.filter((item) => !item.isFolder);

  // Loading state
  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "300px",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // Folder not found state
  if (folderNotFound) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "300px",
          gap: 2,
          padding: 3,
        }}
      >
        <FolderOff sx={{ fontSize: 64, color: "text.secondary", opacity: 0.5 }} />
        <Typography
          variant="h6"
          sx={{
            color: "text.secondary",
            textAlign: "center",
          }}
        >
          No folder created in NAS
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: "text.secondary",
            textAlign: "center",
            maxWidth: 400,
          }}
        >
          The folder <strong>/{projectCode}</strong> does not exist in the NAS storage.
          Please create the folder to start managing project files.
        </Typography>
      </Box>
    );
  }

  // Error state
  if (error) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "300px",
          gap: 2,
          padding: 3,
        }}
      >
        <Typography color="error" variant="h6">
          Error loading files
        </Typography>
        <Typography color="error" variant="body2">
          {error}
        </Typography>
        <IconButton onClick={() => loadFolderContents(currentPath)} color="primary">
          <Refresh />
        </IconButton>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: { xs: "auto", md: "calc(100vh - 300px)" },
        minHeight: "400px",
        backgroundColor: "#f5f5f5",
        borderRadius: "8px",
        overflow: "hidden",
      }}
    >
      {/* Toolbar */}
      <Paper
        elevation={0}
        sx={{
          borderBottom: "1px solid #e0e0e0",
          backgroundColor: "#ffffff",
          padding: "4px 8px",
          borderRadius: "8px 8px 0 0",
        }}
      >
        <Toolbar
          disableGutters
          sx={{
            minHeight: "40px !important",
            gap: "4px",
          }}
        >
          <IconButton
            size="small"
            onClick={handleBack}
            disabled={historyIndex === 0}
            sx={{
              width: "32px",
              height: "32px",
              borderRadius: "4px",
              "&:hover": {
                backgroundColor: "#f0f0f0",
              },
            }}
          >
            <ArrowBack fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            onClick={handleForward}
            disabled={historyIndex >= history.length - 1}
            sx={{
              width: "32px",
              height: "32px",
              borderRadius: "4px",
              "&:hover": {
                backgroundColor: "#f0f0f0",
              },
            }}
          >
            <ArrowForward fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            onClick={handleUp}
            disabled={currentPath === basePath}
            sx={{
              width: "32px",
              height: "32px",
              borderRadius: "4px",
              "&:hover": {
                backgroundColor: "#f0f0f0",
              },
            }}
          >
            <ArrowUpward fontSize="small" />
          </IconButton>
          <Divider orientation="vertical" flexItem sx={{ marginX: "4px" }} />
          <IconButton
            size="small"
            onClick={() => loadFolderContents(currentPath)}
            sx={{
              width: "32px",
              height: "32px",
              borderRadius: "4px",
              "&:hover": {
                backgroundColor: "#f0f0f0",
              },
            }}
          >
            <Refresh fontSize="small" />
          </IconButton>
          <Divider orientation="vertical" flexItem sx={{ marginX: "4px" }} />
          <TextField
            size="small"
            placeholder="Search files..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search fontSize="small" />
                </InputAdornment>
              ),
            }}
            sx={{
              width: { xs: "150px", sm: "200px", md: "300px" },
              "& .MuiOutlinedInput-root": {
                height: "32px",
                fontSize: "13px",
                backgroundColor: "#ffffff",
                "& fieldset": {
                  borderColor: "#e0e0e0",
                },
                "&:hover fieldset": {
                  borderColor: "#b0b0b0",
                },
              },
            }}
          />
        </Toolbar>
      </Paper>

      {/* Breadcrumb */}
      <Paper
        elevation={0}
        sx={{
          borderBottom: "1px solid #e0e0e0",
          backgroundColor: "#ffffff",
          padding: "8px 16px",
        }}
      >
        <ProjectBreadcrumb 
          path={currentPath} 
          basePath={basePath}
          projectCode={projectCode}
          onNavigate={handleBreadcrumbNavigate} 
        />
      </Paper>

      {/* Main File List */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          backgroundColor: "#ffffff",
        }}
      >
        <Box sx={{ flex: 1, overflow: "auto" }}>
          <FileExplorer
            items={filteredItems}
            onItemClick={handleItemClick}
            onItemDoubleClick={handleItemDoubleClick}
          />
        </Box>
        {/* Status Bar */}
        <Paper
          elevation={0}
          sx={{
            borderTop: "1px solid #e0e0e0",
            backgroundColor: "#f5f5f5",
            padding: "4px 16px",
            display: "flex",
            alignItems: "center",
            gap: "16px",
            minHeight: "24px",
            borderRadius: "0 0 8px 8px",
          }}
        >
          <Typography
            sx={{
              fontSize: "12px",
              color: "#666",
            }}
          >
            {filteredItems.length} {filteredItems.length === 1 ? "item" : "items"}
            {searchQuery && ` (filtered)`}
          </Typography>
          {folders.length > 0 && (
            <Typography
              sx={{
                fontSize: "12px",
                color: "#666",
              }}
            >
              {folders.length} {folders.length === 1 ? "folder" : "folders"}
            </Typography>
          )}
          {files.length > 0 && (
            <Typography
              sx={{
                fontSize: "12px",
                color: "#666",
              }}
            >
              {files.length} {files.length === 1 ? "file" : "files"}
            </Typography>
          )}
        </Paper>
      </Box>

      {/* Download Progress Modal */}
      <DownloadProgressModal
        open={downloadProgressOpen}
        filename={downloadingFilename}
        progress={downloadProgress}
        onClose={() => {
          if (downloadProgress >= 100) {
            setDownloadProgressOpen(false);
            setDownloadProgress(0);
          }
        }}
      />
    </Box>
  );
};

export default ProjectFilesView;

