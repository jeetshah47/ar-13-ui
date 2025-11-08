import React, { useState, useEffect, useCallback, type DragEvent } from "react";
import { useNavigate } from "react-router";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
} from "@mui/material";
import { mapStatusToUnified } from "../constants/taskStatus.constants";
import { getAllTaskByProjectId, updateTaskStatus } from "../../../store/apis/taskApis";
import type { TaskResponse } from "../../../store/types/Task/TaskResponse";

interface TaskItem {
  id: string;
  title: string;
  code: string;
  priority: "Low" | "Medium" | "High";
  duration: string;
  assignee: {
    name: string;
    avatar: string;
  };
  status: string;
}

interface Column {
  id: string;
  title: string;
  items: TaskItem[];
  status: string;
}

interface ProjectBoardProps {
  projectId: string;
}

// Format duration from Date string to readable format
const formatDuration = (dateString: string): string => {
  if (!dateString) return "0h";

  try {
    const dateObj = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.abs(now.getTime() - dateObj.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return `${Math.round(diffInHours)}h`;
    } else {
      const days = Math.floor(diffInHours / 24);
      const hours = Math.round(diffInHours % 24);
      return hours > 0 ? `${days}d ${hours}h` : `${days}d`;
    }
  } catch {
    return "0h";
  }
};

const ProjectBoard: React.FC<ProjectBoardProps> = ({ projectId }) => {
  const navigate = useNavigate();
  const [columns, setColumns] = useState<Column[]>([
    {
      id: "pending",
      title: "Pending",
      items: [],
      status: "pending",
    },
    {
      id: "todo",
      title: "Todo",
      items: [],
      status: "todo",
    },
    {
      id: "review",
      title: "Review",
      items: [],
      status: "review",
    },
    {
      id: "completed",
      title: "Completed",
      items: [],
      status: "completed",
    },
  ]);

  const [draggedItem, setDraggedItem] = useState<TaskItem | null>(null);
  const [draggedFromColumn, setDraggedFromColumn] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);

  // Convert TaskResponse to TaskItem
  const convertTaskResponseToTaskItem = useCallback((task: TaskResponse): TaskItem => {
    const assigneeName = task.assignDetails && task.assignDetails.length > 0 
      ? task.assignDetails[0].name 
      : "Unassigned";
    const assigneeAvatar = "/api/placeholder/24/24";

    return {
      id: task.id,
      title: task.subject,
      code: task.code,
      priority: task.priority as "Low" | "Medium" | "High",
      duration: formatDuration(task.duration),
      assignee: {
        name: assigneeName,
        avatar: assigneeAvatar,
      },
      status: task.status,
    };
  }, []);

  // Fetch tasks from backend API
  useEffect(() => {
    if (!projectId) return;

    const fetchTasks = async () => {
      try {
        const response = await getAllTaskByProjectId(projectId);
        const taskItems = response.tasks.map(convertTaskResponseToTaskItem);
        setColumns(prevColumns => 
          prevColumns.map(column => ({
            ...column,
            items: taskItems.filter(task => {
              // Normalize task status to unified format for comparison
              const normalizedTaskStatus = mapStatusToUnified(task.status);
              return normalizedTaskStatus === column.status;
            })
          }))
        );
      } catch (error) {
        console.error("Failed to fetch tasks:", error);
      }
    };

    fetchTasks();
    
    // TODO: Replace with WebSocket or polling for real-time updates
    // Set up polling interval (every 5 seconds) as a temporary solution
    const intervalId = setInterval(fetchTasks, 5000);
    
    return () => clearInterval(intervalId);
  }, [projectId, convertTaskResponseToTaskItem]);

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
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setDragOverColumn(null);
    }
  };

  const handleDrop = async (
    e: DragEvent<HTMLDivElement>,
    targetColumnId: string
  ): Promise<void> => {
    e.preventDefault();

    if (draggedItem && draggedFromColumn) {
      if (draggedFromColumn === targetColumnId) {
        setDraggedItem(null);
        setDraggedFromColumn(null);
        setDragOverColumn(null);
        return;
      }

      // Find the target column status
      const targetColumn = columns.find(col => col.id === targetColumnId);
      if (!targetColumn) return;

      try {
        // Update the task status via backend API
        await updateTaskStatus(projectId, draggedItem.id, targetColumn.status);
        
        // Optimistically update the UI
        setColumns(prevColumns => 
          prevColumns.map(column => {
            if (column.id === draggedFromColumn) {
              return {
                ...column,
                items: column.items.filter(item => item.id !== draggedItem.id)
              };
            }
            if (column.id === targetColumnId) {
              return {
                ...column,
                items: [...column.items, { ...draggedItem, status: targetColumn.status }]
              };
            }
            return column;
          })
        );
      } catch (error) {
        console.error("Failed to update task status:", error);
        // TODO: Show toast notification for error
      }
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

  const handleTaskClick = (taskId: string): void => {
    navigate(`/app/projects/details/${projectId}/${taskId}`);
  };

  const getPriorityColor = (priority: TaskItem["priority"]): string => {
    switch (priority) {
      case "High":
        return "#FF6B6B";
      case "Medium":
        return "#FFBD21";
      case "Low":
        return "#0AC947";
      default:
        return "#D8D8D8";
    }
  };

  const getPriorityIcon = (priority: TaskItem["priority"]): string => {
    switch (priority) {
      case "High":
        return "🔴";
      case "Medium":
        return "🟡";
      case "Low":
        return "🟢";
      default:
        return "⚪";
    }
  };

  return (
    <Box
      sx={(theme) => ({
        display: "flex",
        gap: "16px",
        padding: "16px",
        backgroundColor: theme.palette.grey[50],
        minHeight: "100%",
        overflowX: "auto",
      })}
    >
      {columns.map((column) => (
        <Box
          key={column.id}
          sx={{
            minWidth: "200px",
            width: "200px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Column Header */}
          <Box
            sx={(theme) => ({
              backgroundColor: theme.palette.background.paper,
              borderRadius: "20px",
              padding: "12px 16px",
              marginBottom: "12px",
              boxShadow: theme.shadows[1],
              textAlign: "center",
            })}
          >
            <Typography
              sx={(theme) => ({
                fontFamily: "Nunito Sans",
                fontWeight: 700,
                fontSize: "14px",
                color: theme.palette.text.primary,
              })}
            >
              {column.title}
            </Typography>
          </Box>

          {/* Column Content */}
          <Box
            onDragOver={handleDragOver}
            onDragEnter={(e) => handleDragEnter(e, column.id)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, column.id)}
            sx={(theme) => ({
              minHeight: "300px",
              backgroundColor: dragOverColumn === column.id 
                ? theme.palette.primary.light 
                : "transparent",
              borderRadius: "12px",
              padding: "6px",
              transition: "background-color 0.2s ease",
            })}
          >
            {column.items.map((item) => (
              <Card
                key={item.id}
                draggable
                onDragStart={(e) => handleDragStart(e, item, column.id)}
                onDragEnd={handleDragEnd}
                onClick={(e) => {
                  // Prevent navigation when dragging
                  if (!draggedItem) {
                    e.preventDefault();
                    handleTaskClick(item.id);
                  }
                }}
                sx={(theme) => ({
                  backgroundColor: theme.palette.background.paper,
                  borderRadius: "20px",
                  marginBottom: "12px",
                  boxShadow: theme.shadows[1],
                  cursor: draggedItem ? "grabbing" : "pointer",
                  transform: draggedItem?.id === item.id ? "rotate(2deg)" : "none",
                  opacity: draggedItem?.id === item.id ? 0.8 : 1,
                  transition: "all 0.2s ease",
                  "&:hover": {
                    transform: draggedItem ? "none" : "translateY(-2px)",
                    boxShadow: draggedItem ? theme.shadows[1] : theme.shadows[2],
                  },
                  "&:active": {
                    cursor: "grabbing",
                  },
                })}
              >
                <CardContent sx={{ padding: "16px" }}>
                  {/* Task Code */}
                  <Typography
                    sx={(theme) => ({
                      fontFamily: "Nunito Sans",
                      fontWeight: 400,
                      fontSize: "11px",
                      color: theme.palette.text.secondary,
                      marginBottom: "2px",
                    })}
                  >
                    {item.code}
                  </Typography>

                  {/* Task Title */}
                  <Typography
                    sx={(theme) => ({
                      fontFamily: "Nunito Sans",
                      fontWeight: 400,
                      fontSize: "13px",
                      color: theme.palette.text.primary,
                      marginBottom: "12px",
                      lineHeight: 1.4,
                      whiteSpace: "pre-line",
                    })}
                  >
                    {item.title}
                  </Typography>

                  {/* Bottom Row */}
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    {/* Duration */}
                    <Box
                      sx={(theme) => ({
                        backgroundColor: theme.palette.grey[50],
                        borderRadius: "6px",
                        padding: "4px 8px",
                        display: "flex",
                        alignItems: "center",
                      })}
                    >
                      <Typography
                        sx={(theme) => ({
                          fontFamily: "Nunito Sans",
                          fontWeight: 700,
                          fontSize: "11px",
                          color: theme.palette.text.secondary,
                        })}
                      >
                        {item.duration}
                      </Typography>
                    </Box>

                    {/* Priority and Avatar */}
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      {/* Priority Indicator */}
                      <Box
                        sx={{
                          width: "20px",
                          height: "20px",
                          borderRadius: "50%",
                          backgroundColor: getPriorityColor(item.priority),
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "10px",
                        }}
                      >
                        {getPriorityIcon(item.priority)}
                      </Box>

                      {/* Avatar */}
                      <Avatar
                        sx={(theme) => ({
                          width: "20px",
                          height: "20px",
                          border: `2px solid ${theme.palette.background.paper}`,
                        })}
                        src={item.assignee.avatar}
                        alt={item.assignee.name}
                      />
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            ))}

            {/* Empty State */}
            {column.items.length === 0 && (
              <Box
                sx={(theme) => ({
                  backgroundColor: theme.palette.background.paper,
                  borderRadius: "20px",
                  padding: "30px 16px",
                  textAlign: "center",
                  boxShadow: theme.shadows[1],
                  border: `2px dashed ${theme.palette.divider}`,
                })}
              >
                <Typography
                  sx={(theme) => ({
                    fontFamily: "Nunito Sans",
                    fontWeight: 400,
                    fontSize: "13px",
                    color: theme.palette.text.secondary,
                  })}
                >
                  No tasks
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default ProjectBoard;
