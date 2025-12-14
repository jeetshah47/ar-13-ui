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
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
} from "@mui/material";
import DownloadProgressModal from "../../../common/components/DownloadProgressModal";
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
import {
  browseNAS,
  renameItem,
  deleteItem,
  createFolder,
  moveItem,
  downloadFile,
} from "../../../store/apis/storageApi";
import { openFileWithDefaultApp } from "../../../services/nas/nasService";
import toast from "react-hot-toast";

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
  
  // Modal states
  const [renameModalOpen, setRenameModalOpen] = useState(false);
  const [renameItemState, setRenameItemState] = useState<FileBrowserItem | null>(null);
  const [renameValue, setRenameValue] = useState<string>("");
  
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteItems, setDeleteItems] = useState<FileBrowserItem[]>([]);
  
  const [createFolderModalOpen, setCreateFolderModalOpen] = useState(false);
  const [createFolderValue, setCreateFolderValue] = useState<string>("");
  
  const [moveModalOpen, setMoveModalOpen] = useState(false);
  const [moveItemState, setMoveItemState] = useState<FileBrowserItem | null>(null);
  const [moveValue, setMoveValue] = useState<string>("");
  
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  
  const [notImplementedModalOpen, setNotImplementedModalOpen] = useState(false);
  const [notImplementedMessage, setNotImplementedMessage] = useState<string>("");
  
  // Download progress state
  const [downloadProgressOpen, setDownloadProgressOpen] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [downloadingFilename, setDownloadingFilename] = useState<string>("");

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

  const handleItemDoubleClick = async (item: FileBrowserItem) => {
    if (item.isFolder) {
      handleNavigate(item.path);
    } else {
      // Handle file download/opening
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
    handleNavigate(path);
  };

  const handleNewItem = () => {
    setCreateFolderValue("New Folder");
    setCreateFolderModalOpen(true);
  };

  const handleCreateFolderConfirm = async () => {
    if (!createFolderValue || createFolderValue.trim() === "") {
      return;
    }

    try {
      await createFolder(currentPath, createFolderValue.trim());
      setCreateFolderModalOpen(false);
      setCreateFolderValue("");
      // Refresh the current folder
      loadFolderContents(currentPath);
    } catch (error: any) {
      console.error("Failed to create folder:", error);
      setErrorMessage(`Failed to create folder: ${error.message || "Unknown error"}`);
      setErrorModalOpen(true);
      setCreateFolderModalOpen(false);
    }
  };

  const handleRename = (items: FileBrowserItem[]) => {
    if (items.length === 0) return;

    const item = items[0]; // Handle single item rename
    setRenameItemState(item);
    setRenameValue(item.name);
    setRenameModalOpen(true);
  };

  const handleRenameConfirm = async () => {
    if (!renameItemState || !renameValue || renameValue.trim() === "" || renameValue === renameItemState.name) {
      return;
    }

    try {
      await renameItem(renameItemState.path, renameValue.trim());
      setRenameModalOpen(false);
      setRenameItemState(null);
      setRenameValue("");
      // Refresh the current folder
      loadFolderContents(currentPath);
    } catch (error: any) {
      console.error("Failed to rename item:", error);
      setErrorMessage(`Failed to rename: ${error.message || "Unknown error"}`);
      setErrorModalOpen(true);
      setRenameModalOpen(false);
    }
  };

  const handleMove = (items: FileBrowserItem[]) => {
    if (items.length === 0) return;

    const item = items[0]; // Handle single item move
    setMoveItemState(item);
    setMoveValue(currentPath);
    setMoveModalOpen(true);
  };

  const handleMoveConfirm = async () => {
    if (!moveItemState || !moveValue || moveValue.trim() === "") {
      return;
    }

    try {
      // Build full destination path
      const destPath = moveValue.trim().endsWith("/")
        ? moveValue.trim() + moveItemState.name
        : moveValue.trim() + "/" + moveItemState.name;

      await moveItem(moveItemState.path, destPath);
      setMoveModalOpen(false);
      setMoveItemState(null);
      setMoveValue("");
      // Refresh the current folder
      loadFolderContents(currentPath);
    } catch (error: any) {
      console.error("Failed to move item:", error);
      setErrorMessage(`Failed to move: ${error.message || "Unknown error"}`);
      setErrorModalOpen(true);
      setMoveModalOpen(false);
    }
  };

  const handleCompress = (items: FileBrowserItem[]) => {
    // TODO: Implement compress
    console.log("Compress", items);
    setNotImplementedMessage("Compress feature is not yet implemented");
    setNotImplementedModalOpen(true);
  };

  const handleShare = (items: FileBrowserItem[]) => {
    // TODO: Implement share
    console.log("Share", items);
    setNotImplementedMessage("Share feature is not yet implemented");
    setNotImplementedModalOpen(true);
  };

  const handleProperties = (items: FileBrowserItem[]) => {
    // TODO: Implement properties
    console.log("Properties", items);
    setNotImplementedMessage("Properties feature is not yet implemented");
    setNotImplementedModalOpen(true);
  };

  const handleDelete = (items: FileBrowserItem[]) => {
    if (items.length === 0) return;
    setDeleteItems(items);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (deleteItems.length === 0) return;

    try {
      // Delete all selected items
      await Promise.all(deleteItems.map((item) => deleteItem(item.path)));
      setDeleteModalOpen(false);
      setDeleteItems([]);
      // Refresh the current folder
      loadFolderContents(currentPath);
    } catch (error: any) {
      console.error("Failed to delete items:", error);
      setErrorMessage(`Failed to delete: ${error.message || "Unknown error"}`);
      setErrorModalOpen(true);
      setDeleteModalOpen(false);
    }
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

      {/* Rename Modal */}
      <Dialog open={renameModalOpen} onClose={() => setRenameModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Rename</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="New Name"
            fullWidth
            variant="outlined"
            value={renameValue}
            onChange={(e) => setRenameValue(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleRenameConfirm();
              }
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRenameModalOpen(false)}>Cancel</Button>
          <Button
            onClick={handleRenameConfirm}
            variant="contained"
            disabled={!renameValue || renameValue.trim() === "" || renameValue === renameItemState?.name}
          >
            Rename
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Delete Confirmation</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {deleteItems.length === 1
              ? `Are you sure you want to delete "${deleteItems[0].name}"? This action cannot be undone.`
              : `Are you sure you want to delete ${deleteItems.length} items? This action cannot be undone.\n\nItems: ${deleteItems.map((item) => item.name).join(", ")}`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteModalOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} variant="contained" color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Create Folder Modal */}
      <Dialog open={createFolderModalOpen} onClose={() => setCreateFolderModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Folder</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Folder Name"
            fullWidth
            variant="outlined"
            value={createFolderValue}
            onChange={(e) => setCreateFolderValue(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleCreateFolderConfirm();
              }
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateFolderModalOpen(false)}>Cancel</Button>
          <Button
            onClick={handleCreateFolderConfirm}
            variant="contained"
            disabled={!createFolderValue || createFolderValue.trim() === ""}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>

      {/* Move Modal */}
      <Dialog open={moveModalOpen} onClose={() => setMoveModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Move Item</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Move "{moveItemState?.name}" to:
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Destination Path"
            fullWidth
            variant="outlined"
            value={moveValue}
            onChange={(e) => setMoveValue(e.target.value)}
            placeholder="/path/to/destination"
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleMoveConfirm();
              }
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setMoveModalOpen(false)}>Cancel</Button>
          <Button
            onClick={handleMoveConfirm}
            variant="contained"
            disabled={!moveValue || moveValue.trim() === ""}
          >
            Move
          </Button>
        </DialogActions>
      </Dialog>

      {/* Error Modal */}
      <Dialog open={errorModalOpen} onClose={() => setErrorModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Error</DialogTitle>
        <DialogContent>
          <DialogContentText>{errorMessage}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setErrorModalOpen(false)} variant="contained">
            OK
          </Button>
        </DialogActions>
      </Dialog>

      {/* Not Implemented Modal */}
      <Dialog open={notImplementedModalOpen} onClose={() => setNotImplementedModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Feature Not Available</DialogTitle>
        <DialogContent>
          <DialogContentText>{notImplementedMessage}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNotImplementedModalOpen(false)} variant="contained">
            OK
          </Button>
        </DialogActions>
      </Dialog>

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

export default WindowsFileExplorer;

