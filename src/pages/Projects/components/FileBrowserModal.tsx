import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  Box,
  IconButton,
  Typography,
  Button,
  CircularProgress,
  useMediaQuery,
  useTheme,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Breadcrumbs,
  Link,
} from "@mui/material";
import Crossicon from "../../../assets/icons/general/close/blue.svg?react";
import FolderIcon from "@mui/icons-material/Folder";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { SvgIcon } from "@mui/material";
import { listFiles, type StorageObject } from "../../../store/apis/storageApi";
import toast from "react-hot-toast";

interface FileBrowserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectFile: (file: StorageObject) => void;
}

const FileBrowserModal: React.FC<FileBrowserModalProps> = ({
  isOpen,
  onClose,
  onSelectFile,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [currentPath, setCurrentPath] = useState("");
  const [files, setFiles] = useState<StorageObject[]>([]);
  const [loading, setLoading] = useState(false);
  const [pathHistory, setPathHistory] = useState<string[]>([]);

  useEffect(() => {
    if (isOpen) {
      loadFiles(currentPath);
    } else {
      // Reset state when modal closes
      setCurrentPath("");
      setPathHistory([]);
      setFiles([]);
    }
  }, [isOpen, currentPath]);

  const loadFiles = async (path: string) => {
    setLoading(true);
    try {
      const response = await listFiles(path);
      // Sort: folders first, then files, both alphabetically
      const sorted = response.files.sort((a, b) => {
        if (a.isFolder && !b.isFolder) return -1;
        if (!a.isFolder && b.isFolder) return 1;
        return a.name.localeCompare(b.name);
      });
      setFiles(sorted);
    } catch (error: any) {
      console.error("Failed to load files:", error);
      toast.error(error?.message || "Failed to load files from NAS");
    } finally {
      setLoading(false);
    }
  };

  const handleFolderClick = (folder: StorageObject) => {
    setPathHistory([...pathHistory, currentPath]);
    setCurrentPath(folder.path);
  };

  const handleFileClick = (file: StorageObject) => {
    onSelectFile(file);
    onClose();
  };

  const handleBack = () => {
    if (pathHistory.length > 0) {
      const newHistory = [...pathHistory];
      const previousPath = newHistory.pop() || "";
      setPathHistory(newHistory);
      setCurrentPath(previousPath);
    } else {
      setCurrentPath("");
    }
  };

  const handleBreadcrumbClick = (index: number) => {
    // Navigate to the clicked breadcrumb level
    const newHistory = pathHistory.slice(0, index);
    const newPath = index === 0 ? "" : pathHistory[index - 1] || "";
    setPathHistory(newHistory);
    setCurrentPath(newPath);
  };

  // Build breadcrumb paths
  const breadcrumbs = [
    { name: "Root", path: "" },
    ...pathHistory.map((path) => ({
      name: path.split("/").filter(Boolean).pop() || "Root",
      path,
    })),
    ...(currentPath
      ? [
          {
            name: currentPath.split("/").filter(Boolean).pop() || "Root",
            path: currentPath,
          },
        ]
      : []),
  ];

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const modalContent = (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1300,
        padding: isMobile ? "16px" : "24px",
      }}
      onClick={onClose}
    >
      <Box
        sx={{
          backgroundColor: "white",
          borderRadius: "24px",
          width: isMobile ? "100%" : "600px",
          maxWidth: "90vw",
          maxHeight: "80vh",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0px 6px 58px rgba(196, 203, 214, 0.103611)",
          overflow: "hidden",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "24px",
            borderBottom: "1px solid #E5E7EB",
          }}
        >
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: "20px",
              lineHeight: "1.5",
              color: "#0A1629",
            }}
          >
            Browse NAS Files
          </Typography>
          <IconButton
            onClick={onClose}
            sx={{
              width: "32px",
              height: "32px",
              padding: 0,
            }}
          >
            <SvgIcon
              component={Crossicon}
              sx={{
                width: "24px",
                height: "24px",
              }}
            />
          </IconButton>
        </Box>

        {/* Breadcrumb Navigation */}
        <Box
          sx={{
            padding: "16px 24px",
            borderBottom: "1px solid #E5E7EB",
            backgroundColor: "#F9FAFB",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={handleBack}
              disabled={pathHistory.length === 0 && currentPath === ""}
              sx={{
                minWidth: "auto",
                padding: "4px 8px",
                textTransform: "none",
                color: "#3F8CFF",
              }}
            >
              Back
            </Button>
            <Breadcrumbs separator="›" sx={{ flex: 1 }}>
              {breadcrumbs.map((crumb, index) => (
                <Link
                  key={index}
                  component="button"
                  variant="body2"
                  onClick={() => handleBreadcrumbClick(index)}
                  sx={{
                    color: index === breadcrumbs.length - 1 ? "#0A1629" : "#3F8CFF",
                    textDecoration: "none",
                    cursor: "pointer",
                    "&:hover": {
                      textDecoration: "underline",
                    },
                  }}
                >
                  {crumb.name}
                </Link>
              ))}
            </Breadcrumbs>
          </Box>
        </Box>

        {/* File List */}
        <Box
          sx={{
            flex: 1,
            overflow: "auto",
            padding: "16px",
          }}
        >
          {loading ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "200px",
              }}
            >
              <CircularProgress />
            </Box>
          ) : files.length === 0 ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "200px",
                color: "#6B7280",
              }}
            >
              <Typography>No files or folders found</Typography>
            </Box>
          ) : (
            <List>
              {files.map((item, index) => (
                <React.Fragment key={item.path}>
                  <ListItem disablePadding>
                    <ListItemButton
                      onClick={() =>
                        item.isFolder
                          ? handleFolderClick(item)
                          : handleFileClick(item)
                      }
                      sx={{
                        borderRadius: "8px",
                        "&:hover": {
                          backgroundColor: "#F3F4F6",
                        },
                      }}
                    >
                      <ListItemIcon>
                        {item.isFolder ? (
                          <FolderIcon sx={{ color: "#3F8CFF" }} />
                        ) : (
                          <InsertDriveFileIcon sx={{ color: "#6B7280" }} />
                        )}
                      </ListItemIcon>
                      <ListItemText
                        primary={item.name}
                        secondary={
                          !item.isFolder
                            ? `${(item.size / 1024).toFixed(2)} KB`
                            : "Folder"
                        }
                      />
                    </ListItemButton>
                  </ListItem>
                  {index < files.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          )}
        </Box>
      </Box>
    </Box>
  );

  return createPortal(modalContent, document.body);
};

export default FileBrowserModal;

