import { useState, useMemo } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
} from "@mui/material";
import CustomCard from "../../../common/components/Card/CustomCard";
import FolderIcon from "./FolderIcon";
// import ContextMenu from "./ContextMenu";
import type { FileBrowserItem } from "../../../store/apis/storageApi";

interface FileExplorerProps {
  items: FileBrowserItem[];
  onItemClick: (item: FileBrowserItem) => void;
  onItemDoubleClick?: (item: FileBrowserItem) => void;
  // onNewItem?: () => void;
  // onRename?: (items: FileBrowserItem[]) => void;
  // onMove?: (items: FileBrowserItem[]) => void;
  // onCompress?: (items: FileBrowserItem[]) => void;
  // onShare?: (items: FileBrowserItem[]) => void;
  // onProperties?: (items: FileBrowserItem[]) => void;
  // onDelete?: (items: FileBrowserItem[]) => void;
}

type SortField = "name" | "modified" | "size" | "type";
type SortDirection = "asc" | "desc";

const FileExplorer = ({
  items,
  onItemClick,
  onItemDoubleClick,
  // onNewItem,
  // onRename,
  // onMove,
  // onCompress,
  // onShare,
  // onProperties,
  // onDelete,
}: FileExplorerProps) => {
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  // const [contextMenu, setContextMenu] = useState<{
  //   mouseX: number;
  //   mouseY: number;
  // } | null>(null);
  const [selectedItems, setSelectedItems] = useState<FileBrowserItem[]>([]);

  // Separate folders and files, then sort
  const sortedItems = useMemo(() => {
    const folders = items.filter((item) => item.isFolder);
    const files = items.filter((item) => !item.isFolder);

    const sortItems = (itemsToSort: FileBrowserItem[]) => {
      return [...itemsToSort].sort((a, b) => {
        let comparison = 0;

        switch (sortField) {
          case "name":
            comparison = a.name.localeCompare(b.name);
            break;
          case "modified":
            comparison =
              new Date(a.modified).getTime() - new Date(b.modified).getTime();
            break;
          case "size":
            comparison = a.size - b.size;
            break;
          case "type": {
            const aType = a.isFolder ? "Folder" : a.mimeType || "File";
            const bType = b.isFolder ? "Folder" : b.mimeType || "File";
            comparison = aType.localeCompare(bType);
            break;
          }
        }

        return sortDirection === "asc" ? comparison : -comparison;
      });
    };

    return [...sortItems(folders), ...sortItems(files)];
  }, [items, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "—";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    if (bytes < 1024 * 1024 * 1024)
      return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
  };

  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  const getFileType = (item: FileBrowserItem): string => {
    if (item.isFolder) return "File folder";
    if (item.mimeType) {
      const parts = item.mimeType.split("/");
      if (parts.length > 1) {
        return parts[1].toUpperCase() + " File";
      }
      return item.mimeType;
    }
    const ext = item.name.split(".").pop()?.toUpperCase();
    return ext ? `${ext} File` : "File";
  };

  // const handleContextMenu = (
  //   event: React.MouseEvent,
  //   item: FileBrowserItem
  // ) => {
  //   event.preventDefault();
  //   event.stopPropagation();

  //   // Check if item is already selected
  //   const isSelected = selectedItems.some(
  //     (selected) => selected.path === item.path
  //   );

  //   if (!isSelected) {
  //     // If Ctrl/Cmd is not pressed, select only this item
  //     if (!event.ctrlKey && !event.metaKey) {
  //       setSelectedItems([item]);
  //     } else {
  //       // Add to selection
  //       setSelectedItems([...selectedItems, item]);
  //     }
  //   }

  //   setContextMenu(
  //     contextMenu === null
  //       ? {
  //           mouseX: event.clientX + 2,
  //           mouseY: event.clientY - 6,
  //         }
  //       : null
  //   );
  // };

  // const handleCloseContextMenu = () => {
  //   setContextMenu(null);
  // };

  const handleRowClick = (event: React.MouseEvent, item: FileBrowserItem) => {
    if (event.ctrlKey || event.metaKey) {
      // Multi-select
      const isSelected = selectedItems.some(
        (selected) => selected.path === item.path
      );
      if (isSelected) {
        setSelectedItems(
          selectedItems.filter((selected) => selected.path !== item.path)
        );
      } else {
        setSelectedItems([...selectedItems, item]);
      }
    } else {
      // Single select
      setSelectedItems([item]);
      onItemClick(item);
    }
  };

  // const handleContextMenuAction = (action: string) => {
  //   if (selectedItems.length === 0) return;

  //   switch (action) {
  //     case "rename":
  //       onRename?.(selectedItems);
  //       break;
  //     case "move":
  //       onMove?.(selectedItems);
  //       break;
  //     case "compress":
  //       onCompress?.(selectedItems);
  //       break;
  //     case "share":
  //       onShare?.(selectedItems);
  //       break;
  //     case "properties":
  //       onProperties?.(selectedItems);
  //       break;
  //     case "delete":
  //       onDelete?.(selectedItems);
  //       break;
  //   }
  //   setSelectedItems([]);
  // };

  const handleTableClick = (e: React.MouseEvent) => {
    // Deselect if clicking on table background (not on a row)
    if (
      e.target === e.currentTarget ||
      (e.target as HTMLElement).tagName === "TABLE"
    ) {
      setSelectedItems([]);
    }
  };

  // const handleTableContextMenu = (e: React.MouseEvent) => {
  //   // Show context menu on empty space with no selection
  //   if (selectedItems.length === 0) {
  //     e.preventDefault();
  //     setContextMenu({
  //       mouseX: e.clientX + 2,
  //       mouseY: e.clientY - 6,
  //     });
  //   }
  // };

  return (
    <Box onClick={handleTableClick}>
      <CustomCard sx={{ padding: 0, overflow: "hidden" }}>
        <TableContainer>
          <Table sx={{ minWidth: 650 }} size="small">
            <TableHead>
              <TableRow
                sx={{
                  backgroundColor: (theme) => theme.palette.grey[100],
                  "& th": {
                    borderBottom: "1px solid",
                    borderColor: (theme) => theme.palette.divider,
                    padding: "8px 16px",
                    fontWeight: 600,
                    fontSize: "13px",
                    color: (theme) => theme.palette.text.secondary,
                  },
                }}
              >
                <TableCell
                  sx={{ width: "40px", padding: "8px !important" }}
                ></TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortField === "name"}
                    direction={sortField === "name" ? sortDirection : "asc"}
                    onClick={() => handleSort("name")}
                    sx={{
                      "& .MuiTableSortLabel-icon": {
                        fontSize: "16px",
                      },
                    }}
                  >
                    Name
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortField === "type"}
                    direction={sortField === "type" ? sortDirection : "asc"}
                    onClick={() => handleSort("type")}
                    sx={{
                      "& .MuiTableSortLabel-icon": {
                        fontSize: "16px",
                      },
                    }}
                  >
                    Type
                  </TableSortLabel>
                </TableCell>
                <TableCell align="right">
                  <TableSortLabel
                    active={sortField === "size"}
                    direction={sortField === "size" ? sortDirection : "asc"}
                    onClick={() => handleSort("size")}
                    sx={{
                      "& .MuiTableSortLabel-icon": {
                        fontSize: "16px",
                      },
                    }}
                  >
                    Size
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortField === "modified"}
                    direction={sortField === "modified" ? sortDirection : "asc"}
                    onClick={() => handleSort("modified")}
                    sx={{
                      "& .MuiTableSortLabel-icon": {
                        fontSize: "16px",
                      },
                    }}
                  >
                    Date Modified
                  </TableSortLabel>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedItems.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    align="center"
                    sx={{ padding: "40px" }}
                  >
                    <Typography
                      sx={(theme) => ({
                        fontSize: "14px",
                        color: theme.palette.text.secondary,
                      })}
                    >
                      This folder is empty
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                sortedItems.map((item) => {
                  const isSelected = selectedItems.some(
                    (selected) => selected.path === item.path
                  );
                  return (
                     <TableRow
                       key={item.path}
                       onClick={(e) => handleRowClick(e, item)}
                       onDoubleClick={() => onItemDoubleClick?.(item)}
                       sx={{
                        cursor: "pointer",
                        backgroundColor: isSelected
                          ? (theme) => theme.palette.action.selected
                          : "transparent",
                        "&:hover": {
                          backgroundColor: (theme) =>
                            theme.palette.action.hover,
                        },
                        "& td": {
                          borderBottom: "1px solid",
                          borderColor: (theme) => theme.palette.divider,
                          padding: "4px 16px",
                          fontSize: "14px",
                        },
                      }}
                    >
                      <TableCell
                        sx={{ width: "40px", padding: "4px 8px !important" }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: "24px",
                            height: "24px",
                          }}
                        >
                          {item.isFolder ? (
                            <FolderIcon
                              sx={{
                                fontSize: "20px",
                              }}
                            />
                          ) : (
                            <Box
                              sx={{
                                width: "16px",
                                height: "16px",
                                borderRadius: "2px",
                                backgroundColor: (theme) =>
                                  theme.palette.primary.light,
                                opacity: 0.6,
                              }}
                            />
                          )}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography
                          sx={{
                            fontSize: "14px",
                            fontWeight: item.isFolder ? 500 : 400,
                            color: (theme) => theme.palette.text.primary,
                          }}
                        >
                          {item.name}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography
                          sx={{
                            fontSize: "13px",
                            color: (theme) => theme.palette.text.secondary,
                          }}
                        >
                          {getFileType(item)}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography
                          sx={{
                            fontSize: "13px",
                            color: (theme) => theme.palette.text.secondary,
                          }}
                        >
                          {item.isFolder ? "—" : formatFileSize(item.size)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography
                          sx={{
                            fontSize: "13px",
                            color: (theme) => theme.palette.text.secondary,
                          }}
                        >
                          {formatDate(item.modified)}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
        {/* <ContextMenu
          open={contextMenu !== null}
          anchorPosition={
            contextMenu !== null
              ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
              : null
          }
          selectedItems={selectedItems}
          onClose={handleCloseContextMenu}
          onNewItem={onNewItem}
          onRename={() => handleContextMenuAction("rename")}
          onMove={() => handleContextMenuAction("move")}
          onCompress={() => handleContextMenuAction("compress")}
          onShare={() => handleContextMenuAction("share")}
          onProperties={() => handleContextMenuAction("properties")}
          onDelete={() => handleContextMenuAction("delete")}
        /> */}
      </CustomCard>
    </Box>
  );
};

export default FileExplorer;
