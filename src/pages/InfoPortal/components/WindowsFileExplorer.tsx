import { useState, useEffect, useMemo } from "react";
import {
  Box,
  Typography,
  IconButton,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  TextField,
  InputAdornment,
  Paper,
} from "@mui/material";
import {
  ArrowBack,
  ArrowForward,
  ArrowUpward,
  Refresh,
  Search,
} from "@mui/icons-material";
import FileExplorer from "./FileExplorer";
import Breadcrumb from "./Breadcrumb";
import FolderIcon from "./FolderIcon";
import type { FileBrowserItem } from "../../../store/apis/storageApi";
import { browseNAS } from "../../../store/apis/storageApi";

interface WindowsFileExplorerProps {
  initialPath?: string;
  onNavigate?: (path: string) => void;
}

interface FolderTreeNode {
  path: string;
  name: string;
  isExpanded: boolean;
  children: FolderTreeNode[];
  loaded: boolean;
}

const WindowsFileExplorer = ({ initialPath = "/", onNavigate }: WindowsFileExplorerProps) => {
  const [currentPath, setCurrentPath] = useState<string>(initialPath);
  const [items, setItems] = useState<FileBrowserItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [history, setHistory] = useState<string[]>(["/"]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);
  const [folderTree, setFolderTree] = useState<FolderTreeNode[]>([]);

  useEffect(() => {
    loadFolderContents(currentPath);
    loadFolderTree();
  }, [currentPath]);

  const loadFolderContents = async (path: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await browseNAS(path);
      setItems(response.files);
    } catch (err: any) {
      console.error("Failed to load folder contents:", err);
      setError(err.message || "Failed to load folder contents");
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const loadFolderTree = async () => {
    try {
      const response = await browseNAS("/");
      const folders = response.files.filter((item) => item.isFolder);
      const tree: FolderTreeNode[] = folders.map((folder) => ({
        path: folder.path,
        name: folder.name,
        isExpanded: false,
        children: [],
        loaded: false,
      }));
      setFolderTree(tree);
    } catch (err) {
      console.error("Failed to load folder tree:", err);
    }
  };

  const handleNavigate = (path: string) => {
    setCurrentPath(path);
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(path);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    if (onNavigate) {
      onNavigate(path);
    }
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
    if (currentPath !== "/") {
      const parentPath = currentPath.split("/").slice(0, -1).join("/") || "/";
      handleNavigate(parentPath);
    }
  };

  const handleItemClick = (item: FileBrowserItem) => {
    if (item.isFolder) {
      handleNavigate(item.path);
    }
  };

  const handleItemDoubleClick = (item: FileBrowserItem) => {
    if (item.isFolder) {
      handleNavigate(item.path);
    }
  };

  const handleBreadcrumbNavigate = (path: string) => {
    handleNavigate(path);
  };

  const handleNewItem = () => {
    // TODO: Implement new item creation
    console.log("New item");
  };

  const handleRename = (items: FileBrowserItem[]) => {
    // TODO: Implement rename
    console.log("Rename", items);
  };

  const handleMove = (items: FileBrowserItem[]) => {
    // TODO: Implement move
    console.log("Move", items);
  };

  const handleCompress = (items: FileBrowserItem[]) => {
    // TODO: Implement compress
    console.log("Compress", items);
  };

  const handleShare = (items: FileBrowserItem[]) => {
    // TODO: Implement share
    console.log("Share", items);
  };

  const handleProperties = (items: FileBrowserItem[]) => {
    // TODO: Implement properties
    console.log("Properties", items);
  };

  const handleDelete = (items: FileBrowserItem[]) => {
    // TODO: Implement delete
    console.log("Delete", items);
  };

  const filteredItems = useMemo(() => {
    if (!searchQuery) return items;
    const query = searchQuery.toLowerCase();
    return items.filter((item) => item.name.toLowerCase().includes(query));
  }, [items, searchQuery]);

  const folders = filteredItems.filter((item) => item.isFolder);
  const files = filteredItems.filter((item) => !item.isFolder);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        backgroundColor: "#f5f5f5",
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
            disabled={currentPath === "/"}
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
            placeholder="Search..."
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
              width: "300px",
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
        <Breadcrumb path={currentPath} onNavigate={handleBreadcrumbNavigate} />
      </Paper>

      {/* Main Content Area */}
      <Box sx={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* Left Sidebar - Folder Tree */}
        <Paper
          elevation={0}
          sx={{
            width: "250px",
            borderRight: "1px solid #e0e0e0",
            backgroundColor: "#ffffff",
            overflowY: "auto",
            flexShrink: 0,
          }}
        >
          <Box sx={{ padding: "8px" }}>
            <Typography
              sx={{
                fontSize: "11px",
                fontWeight: 600,
                color: "#666",
                textTransform: "uppercase",
                padding: "8px 12px",
                letterSpacing: "0.5px",
              }}
            >
              Folders
            </Typography>
            <List dense sx={{ padding: 0 }}>
              <ListItem disablePadding>
                <ListItemButton
                  selected={currentPath === "/"}
                  onClick={() => handleNavigate("/")}
                  sx={{
                    minHeight: "32px",
                    borderRadius: "4px",
                    "&.Mui-selected": {
                      backgroundColor: "#e3f2fd",
                      "&:hover": {
                        backgroundColor: "#bbdefb",
                      },
                    },
                    "&:hover": {
                      backgroundColor: "#f5f5f5",
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: "32px" }}>
                    <FolderIcon
                      sx={{
                        fontSize: "20px",
                        opacity: currentPath === "/" ? 1 : 0.7,
                      }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary="This PC"
                    primaryTypographyProps={{
                      fontSize: "13px",
                      fontWeight: currentPath === "/" ? 500 : 400,
                    }}
                  />
                </ListItemButton>
              </ListItem>
              {folderTree.map((folder) => (
                <ListItem key={folder.path} disablePadding>
                  <ListItemButton
                    selected={currentPath === folder.path}
                    onClick={() => handleNavigate(folder.path)}
                    sx={{
                      minHeight: "32px",
                      borderRadius: "4px",
                      "&.Mui-selected": {
                        backgroundColor: "#e3f2fd",
                        "&:hover": {
                          backgroundColor: "#bbdefb",
                        },
                      },
                      "&:hover": {
                        backgroundColor: "#f5f5f5",
                      },
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: "32px" }}>
                      <FolderIcon
                        sx={{
                          fontSize: "20px",
                          opacity: currentPath === folder.path ? 1 : 0.7,
                        }}
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary={folder.name}
                      primaryTypographyProps={{
                        fontSize: "13px",
                        fontWeight: currentPath === folder.path ? 500 : 400,
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Box>
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
          {loading ? (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flex: 1,
              }}
            >
              <Typography>Loading...</Typography>
            </Box>
          ) : error ? (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flex: 1,
                flexDirection: "column",
                gap: "16px",
              }}
            >
              <Typography color="error">{error}</Typography>
            </Box>
          ) : (
            <>
              <Box sx={{ flex: 1, overflow: "auto" }}>
                <FileExplorer
                  items={filteredItems}
                  onItemClick={handleItemClick}
                  onItemDoubleClick={handleItemDoubleClick}
                  onNewItem={handleNewItem}
                  onRename={handleRename}
                  onMove={handleMove}
                  onCompress={handleCompress}
                  onShare={handleShare}
                  onProperties={handleProperties}
                  onDelete={handleDelete}
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
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default WindowsFileExplorer;

