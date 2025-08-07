import React, { useState, type DragEvent } from "react";
import {
  Box,
  Paper,
  Typography,
  Card,
  CardContent,
  IconButton,
  Chip,
} from "@mui/material";
import Grid from "@mui/material/Grid";

import { DragIndicator, Delete, Add } from "@mui/icons-material";

interface TaskItem {
  id: number;
  title: string;
  description: string;
  priority: "High" | "Medium" | "Low";
}

interface Column {
  id: string;
  title: string;
  items: TaskItem[];
  color: string;
}

type PriorityColor = "error" | "warning" | "success" | "default";

const HorizontalDragDropComponent: React.FC = () => {
  const [columns, setColumns] = useState<Column[]>([
    {
      id: "todo",
      title: "To Do",
      color: "#f8f9fa",
      items: [
        {
          id: 1,
          title: "Task 1",
          description: "Complete project documentation",
          priority: "High",
        },
        {
          id: 2,
          title: "Task 2",
          description: "Review code changes",
          priority: "Medium",
        },
        {
          id: 3,
          title: "Task 3",
          description: "Update dependencies",
          priority: "Low",
        },
      ],
    },
    {
      id: "inprogress",
      title: "In Progress",
      color: "#e3f2fd",
      items: [
        {
          id: 4,
          title: "Task 4",
          description: "Write unit tests",
          priority: "High",
        },
        {
          id: 5,
          title: "Task 5",
          description: "Fix bug reports",
          priority: "Medium",
        },
      ],
    },
    {
      id: "review",
      title: "Review",
      color: "#fff3e0",
      items: [
        {
          id: 6,
          title: "Task 6",
          description: "Code review session",
          priority: "High",
        },
      ],
    },
    {
      id: "done",
      title: "Done",
      color: "#e8f5e8",
      items: [
        {
          id: 7,
          title: "Task 7",
          description: "Deploy to production",
          priority: "Low",
        },
        {
          id: 8,
          title: "Task 8",
          description: "Update documentation",
          priority: "Medium",
        },
      ],
    },
  ]);

  const [draggedItem, setDraggedItem] = useState<TaskItem | null>(null);
  const [draggedFromColumn, setDraggedFromColumn] = useState<string | null>(
    null
  );
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);

  const handleDragStart = (
    e: DragEvent<HTMLDivElement>,
    item: TaskItem,
    columnId: string
  ): void => {
    setDraggedItem(item);
    setDraggedFromColumn(columnId);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", JSON.stringify({ item, columnId }));
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDragEnter = (
    e: DragEvent<HTMLDivElement>,
    columnId: string
  ): void => {
    e.preventDefault();
    setDragOverColumn(columnId);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>): void => {
    // Only clear if we're leaving the column entirely
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setDragOverColumn(null);
    }
  };

  const handleDrop = (
    e: DragEvent<HTMLDivElement>,
    targetColumnId: string
  ): void => {
    e.preventDefault();

    if (draggedItem && draggedFromColumn) {
      // If dropping in the same column, just reorder
      if (draggedFromColumn === targetColumnId) {
        // For same column, we could implement reordering logic here
        // For now, we'll just reset the drag state
        setDraggedItem(null);
        setDraggedFromColumn(null);
        setDragOverColumn(null);
        return;
      }

      // Move item from source column to target column
      setColumns((prevColumns) => {
        const newColumns = [...prevColumns];

        // Find source and target columns
        const sourceColumnIndex = newColumns.findIndex(
          (col) => col.id === draggedFromColumn
        );
        const targetColumnIndex = newColumns.findIndex(
          (col) => col.id === targetColumnId
        );

        if (sourceColumnIndex !== -1 && targetColumnIndex !== -1) {
          // Remove item from source column
          const sourceColumn = { ...newColumns[sourceColumnIndex] };
          sourceColumn.items = sourceColumn.items.filter(
            (item) => item.id !== draggedItem.id
          );

          // Add item to target column
          const targetColumn = { ...newColumns[targetColumnIndex] };
          targetColumn.items = [...targetColumn.items, draggedItem];

          // Update the columns array
          newColumns[sourceColumnIndex] = sourceColumn;
          newColumns[targetColumnIndex] = targetColumn;
        }

        return newColumns;
      });
    }

    setDraggedItem(null);
    setDraggedFromColumn(null);
    setDragOverColumn(null);
  };

  const handleDragEnd = (): void => {
    setDraggedItem(null);
    setDraggedFromColumn(null);
    setDragOverColumn(null);
  };

  const handleDelete = (itemId: number, columnId: string): void => {
    setColumns((prevColumns) =>
      prevColumns.map((column) =>
        column.id === columnId
          ? {
              ...column,
              items: column.items.filter((item) => item.id !== itemId),
            }
          : column
      )
    );
  };

  const getPriorityColor = (priority: TaskItem["priority"]): PriorityColor => {
    switch (priority) {
      case "High":
        return "error";
      case "Medium":
        return "warning";
      case "Low":
        return "success";
      default:
        return "default";
    }
  };

  const addNewTask = (columnId: string): void => {
    const newId =
      Math.max(...columns.flatMap((col) => col.items.map((item) => item.id))) +
      1;
    const newTask: TaskItem = {
      id: newId,
      title: `New Task ${newId}`,
      description: "Add your task description here",
      priority: "Medium",
    };

    setColumns((prevColumns) =>
      prevColumns.map((column) =>
        column.id === columnId
          ? { ...column, items: [...column.items, newTask] }
          : column
      )
    );
  };

  return (
    <Box sx={{ p: 1, width: "100%" }}>
      <Grid
        container
        sx={{ backgroundColor: "#F4F9FD", width: "100%", }}
        spacing={2}
      >
        {columns.map((column) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={column.id}>
            <Paper
              elevation={0}
              onDragOver={handleDragOver}
              onDragEnter={(e) => handleDragEnter(e, column.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, column.id)}
              sx={{
                backgroundColor: "transparent",
                minHeight: "100%",
                border:
                  dragOverColumn === column.id
                    ? "2px dashed #1976d2"
                    : "2px solid transparent",
                transition: "all 0.3s ease",
              }}
            >
              <Box sx={{ p: 2 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                  }}
                >
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    {column.title} ({column.items.length})
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={() => addNewTask(column.id)}
                    sx={{ color: "#1976d2" }}
                  >
                    <Add fontSize="small" />
                  </IconButton>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    width: "190px",
                  }}
                >
                  {column.items.map((item) => (
                    <Card
                      key={item.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, item, column.id)}
                      onDragEnd={handleDragEnd}
                      sx={{
                        background: "#F4F9FD",
                        marginTop: "10px",
                        borderRadius: "8px",
                        cursor: "grab",
                        transform:
                          draggedItem?.id === item.id ? "rotate(5deg)" : "none",
                        opacity: draggedItem?.id === item.id ? 0.8 : 1,
                        transition: "all 0.2s ease",
                        "&:hover": {
                          boxShadow: 3,
                          transform: "translateY(-2px)",
                        },
                        "&:active": {
                          cursor: "grabbing",
                        },
                      }}
                    >
                      <CardContent sx={{ "&:last-child": { pb: 2 } }}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: 1,
                          }}
                        >
                          <DragIndicator
                            sx={{ color: "#666", mt: 0.5, fontSize: "1rem" }}
                          />

                          <Box sx={{ flex: 1 }}>
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "flex-start",
                                mb: 1,
                              }}
                            >
                              <Typography
                                variant="subtitle1"
                                sx={{ fontSize: "1rem", fontWeight: 600 }}
                              >
                                {item.title}
                              </Typography>
                              <IconButton
                                size="small"
                                onClick={() => handleDelete(item.id, column.id)}
                                sx={{ color: "#666", ml: 1 }}
                              >
                                <Delete fontSize="small" />
                              </IconButton>
                            </Box>

                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ mb: 1, fontSize: "0.85rem" }}
                            >
                              {item.description}
                            </Typography>

                            <Chip
                              label={item.priority}
                              color={getPriorityColor(item.priority)}
                              size="small"
                              sx={{ fontSize: "0.7rem" }}
                            />
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default HorizontalDragDropComponent;
