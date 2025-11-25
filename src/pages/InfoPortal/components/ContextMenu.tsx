import { useState, useEffect } from "react";
import {
  Box,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  TextField,
  InputAdornment,
  IconButton,
  Typography,
} from "@mui/material";
import {
  Add,
  Edit,
  DriveFileMove,
  Archive,
  Share,
  Info,
  Delete,
  Search,
  ContentCopy,
  ContentCut,
  Star,
  ChevronRight,
} from "@mui/icons-material";
import type { FileBrowserItem } from "../../../store/apis/storageApi";

interface ContextMenuProps {
  open: boolean;
  anchorPosition: { top: number; left: number } | null;
  selectedItems: FileBrowserItem[];
  onClose: () => void;
  onNewItem?: () => void;
  onRename?: () => void;
  onMove?: () => void;
  onCompress?: () => void;
  onShare?: () => void;
  onProperties?: () => void;
  onDelete?: () => void;
  onSearch?: (query: string) => void;
}

const ContextMenu = ({
  open,
  anchorPosition,
  selectedItems,
  onClose,
  onNewItem,
  onRename,
  onMove,
  onCompress,
  onShare,
  onProperties,
  onDelete,
  onSearch,
}: ContextMenuProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      setSearchQuery("");
      setHoveredItem(null);
    }
  }, [open]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    if (onSearch) {
      onSearch(e.target.value);
    }
  };

  const selectedCount = selectedItems.length;
  const hasSelection = selectedCount > 0;
  const isMultiple = selectedCount > 1;

  const menuItems = [
    {
      id: "new",
      label: "New item inside",
      icon: <Add />,
      hasSubmenu: true,
      onClick: onNewItem,
      visible: !hasSelection,
    },
    {
      id: "rename",
      label: isMultiple ? `Rename ${selectedCount} files` : "Rename",
      icon: <Edit />,
      hasSubmenu: true,
      onClick: onRename,
      visible: hasSelection,
    },
    {
      id: "move",
      label: isMultiple ? `Move ${selectedCount} files` : "Move",
      icon: <DriveFileMove />,
      hasSubmenu: true,
      onClick: onMove,
      visible: hasSelection,
    },
    {
      id: "compress",
      label: isMultiple ? `Compress ${selectedCount} files` : "Compress",
      icon: <Archive />,
      hasSubmenu: true,
      onClick: onCompress,
      visible: hasSelection,
    },
    {
      id: "share",
      label: isMultiple ? `Share ${selectedCount} files` : "Share",
      icon: <Share />,
      hasSubmenu: true,
      onClick: onShare,
      visible: hasSelection,
    },
    {
      id: "properties",
      label: isMultiple ? "Multiple properties" : "Properties",
      icon: <Info />,
      hasSubmenu: true,
      onClick: onProperties,
      visible: hasSelection,
    },
    {
      id: "delete",
      label: isMultiple ? `Delete ${selectedCount} files` : "Delete",
      icon: <Delete />,
      hasSubmenu: false,
      onClick: onDelete,
      visible: hasSelection,
      isDestructive: true,
    },
  ].filter((item) => item.visible);

  return (
    <Menu
      open={open}
      onClose={onClose}
      anchorReference="anchorPosition"
      anchorPosition={anchorPosition || undefined}
      PaperProps={{
        sx: {
          backgroundColor: "#2d2d2d",
          color: "#ffffff",
          borderRadius: "8px",
          minWidth: "240px",
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.3)",
          "& .MuiMenuItem-root": {
            color: "#ffffff",
            fontSize: "13px",
            padding: "8px 16px",
            "&:hover": {
              backgroundColor: "#3d3d3d",
            },
          },
        },
      }}
      transformOrigin={{ horizontal: "left", vertical: "top" }}
    >
      {/* Top Toolbar */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          padding: "8px",
          borderBottom: "1px solid #404040",
          gap: "4px",
        }}
      >
        <IconButton
          size="small"
          sx={{
            color: "#ffffff",
            padding: "4px",
            "&:hover": { backgroundColor: "#3d3d3d" },
          }}
        >
          <Add fontSize="small" />
        </IconButton>
        <IconButton
          size="small"
          sx={{
            color: "#ffffff",
            padding: "4px",
            "&:hover": { backgroundColor: "#3d3d3d" },
          }}
        >
          <ContentCopy fontSize="small" />
        </IconButton>
        <IconButton
          size="small"
          sx={{
            color: "#ffffff",
            padding: "4px",
            "&:hover": { backgroundColor: "#3d3d3d" },
          }}
        >
          <ContentCut fontSize="small" />
        </IconButton>
        <IconButton
          size="small"
          sx={{
            color: "#ffffff",
            padding: "4px",
            "&:hover": { backgroundColor: "#3d3d3d" },
          }}
        >
          <Star fontSize="small" />
        </IconButton>
        <Box sx={{ flex: 1 }} />
        <Box sx={{ display: "flex", gap: "4px" }}>
          <Box
            sx={{
              width: "12px",
              height: "12px",
              borderRadius: "50%",
              backgroundColor: "#ff6b9d",
            }}
          />
          <Box
            sx={{
              width: "12px",
              height: "12px",
              borderRadius: "50%",
              backgroundColor: "#ffd93d",
            }}
          />
          <Box
            sx={{
              width: "12px",
              height: "12px",
              borderRadius: "50%",
              backgroundColor: "#6bcf7f",
            }}
          />
          <Box
            sx={{
              width: "12px",
              height: "12px",
              borderRadius: "50%",
              backgroundColor: "#4d9de0",
            }}
          />
        </Box>
      </Box>

      {/* Search Bar */}
      <Box sx={{ padding: "8px", borderBottom: "1px solid #404040" }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Search in folder"
          value={searchQuery}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search sx={{ color: "#999", fontSize: "18px" }} />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <ChevronRight sx={{ color: "#999", fontSize: "18px" }} />
              </InputAdornment>
            ),
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              backgroundColor: "#1a1a1a",
              color: "#ffffff",
              fontSize: "13px",
              "& fieldset": {
                borderColor: "#404040",
              },
              "&:hover fieldset": {
                borderColor: "#555",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#666",
              },
            },
            "& .MuiInputBase-input::placeholder": {
              color: "#999",
              opacity: 1,
            },
          }}
        />
      </Box>

      {/* Menu Items */}
      {menuItems.map((item, index) => (
        <MenuItem
          key={item.id}
          onClick={() => {
            if (item.onClick) {
              item.onClick();
            }
            onClose();
          }}
          onMouseEnter={() => setHoveredItem(item.id)}
          onMouseLeave={() => setHoveredItem(null)}
          sx={{
            backgroundColor:
              hoveredItem === item.id
                ? "#3d3d3d"
                : item.isDestructive
                ? "transparent"
                : "transparent",
            "&:hover": {
              backgroundColor: item.isDestructive ? "#5a1a1a" : "#3d3d3d",
            },
            ...(item.isDestructive && {
              backgroundColor: "#4a1a1a",
              "&:hover": {
                backgroundColor: "#5a1a1a",
              },
            }),
          }}
        >
          <ListItemIcon
            sx={{
              color: item.isDestructive ? "#ff4444" : "#ffffff",
              minWidth: "32px",
            }}
          >
            {item.icon}
          </ListItemIcon>
          <ListItemText
            primary={item.label}
            primaryTypographyProps={{
              fontSize: "13px",
              color: item.isDestructive ? "#ff4444" : "#ffffff",
            }}
          />
          {item.hasSubmenu && (
            <ChevronRight sx={{ color: "#999", fontSize: "18px" }} />
          )}
        </MenuItem>
      ))}

      {/* Bottom Info Bar */}
      {hasSelection && (
        <>
          <Divider sx={{ backgroundColor: "#404040", marginY: "4px" }} />
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "8px 16px",
              fontSize: "11px",
              color: "#999",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <Typography sx={{ fontSize: "11px", color: "#999" }}>
                185
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <Typography sx={{ fontSize: "11px", color: "#999" }}>
                308
              </Typography>
            </Box>
          </Box>
        </>
      )}
    </Menu>
  );
};

export default ContextMenu;

