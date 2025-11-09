import React, { useState, useEffect, useCallback, useRef, type DragEvent } from "react";
import { useNavigate } from "react-router";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
} from "@mui/material";
import { mapStatusToUnified } from "../constants/taskStatus.constants";
import { getAllTaskByProjectId } from "../../../store/apis/taskApis";
import type { TaskResponse } from "../../../store/types/Task/TaskResponse";
import { useNotifications } from "../../../contexts/NotificationContext";

interface TaskItem {
  id: string;
  title: string;
  code: string;
  priority: "Low" | "Medium" | "High";
  deadline: string; // Deadline in readable format
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
  const { emit, onEvent, offEvent, isConnected } = useNotifications();
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
  const pendingUpdatesRef = useRef<Map<string, { fromColumn: string; toColumn: string; task: TaskItem }>>(new Map());

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
      deadline: formatDuration(task.deadline),
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
  }, [projectId, convertTaskResponseToTaskItem]);

  // Listen for task status updates from WebSocket
  useEffect(() => {
    if (!isConnected || !projectId) return;

    // Listen for task status updates from other users
    const handleTaskStatusUpdated = (messageData: {
      projectId: string;
      taskId: string;
      status: string;
      updatedBy?: string;
      task?: TaskResponse;
    }) => {
      // Only process updates for this project
      if (messageData.projectId !== projectId) return;

      console.log('Task status updated via WebSocket:', messageData);

      // If we have a pending update for this task, remove it (server confirmed)
      pendingUpdatesRef.current.delete(messageData.taskId);

      // Update the task in the columns
      setColumns(prevColumns => {
        const updatedColumns = prevColumns.map(column => {
          // Remove task from all columns first
          const filteredItems = column.items.filter(item => item.id !== messageData.taskId);
          
          // If this column matches the new status, add the task
          const normalizedStatus = mapStatusToUnified(messageData.status);
          if (normalizedStatus === column.status) {
            // Find the task in any column to get its details
            let taskToMove: TaskItem | null = null;
            prevColumns.forEach(col => {
              const found = col.items.find(item => item.id === messageData.taskId);
              if (found) {
                taskToMove = { ...found, status: messageData.status };
              }
            });

            // If task not found in any column, convert from TaskResponse if provided
            if (!taskToMove && messageData.task) {
              taskToMove = convertTaskResponseToTaskItem(messageData.task);
            }

            if (taskToMove) {
              return {
                ...column,
                items: [...filteredItems, taskToMove]
              };
            }
          }

          return {
            ...column,
            items: filteredItems
          };
        });

        return updatedColumns;
      });
    };

    // Listen for success response to our own updates
    const handleUpdateSuccess = (messageData: {
      projectId: string;
      taskId: string;
      status: string;
      updatedBy?: string;
      task?: TaskResponse;
    }) => {
      // Only process updates for this project
      if (messageData.projectId !== projectId) return;

      console.log('Task status update successful:', messageData);
      
      // Remove from pending updates
      pendingUpdatesRef.current.delete(messageData.taskId);
    };

    // Listen for error response to our own updates
    const handleUpdateError = (errorData: {
      projectId: string;
      taskId: string;
      error: string;
    }) => {
      // Only process errors for this project
      if (errorData.projectId !== projectId) return;

      console.error('Task status update failed:', errorData);

      // Revert the optimistic update
      const pendingUpdate = pendingUpdatesRef.current.get(errorData.taskId);
      if (pendingUpdate) {
        setColumns(prevColumns => 
          prevColumns.map(column => {
            if (column.id === pendingUpdate.toColumn) {
              return {
                ...column,
                items: column.items.filter(item => item.id !== errorData.taskId)
              };
            }
            if (column.id === pendingUpdate.fromColumn) {
              return {
                ...column,
                items: [...column.items, pendingUpdate.task]
              };
            }
            return column;
          })
        );
        pendingUpdatesRef.current.delete(errorData.taskId);
      }

      // Show error notification (you can add a toast here)
      alert(`Failed to update task status: ${errorData.error}`);
    };

    // Register event listeners
    onEvent('task:status-updated', handleTaskStatusUpdated);
    onEvent('task:update-status:success', handleUpdateSuccess);
    onEvent('task:update-status:error', handleUpdateError);

    // Cleanup
    return () => {
      offEvent('task:status-updated', handleTaskStatusUpdated);
      offEvent('task:update-status:success', handleUpdateSuccess);
      offEvent('task:update-status:error', handleUpdateError);
    };
  }, [isConnected, projectId, onEvent, offEvent, convertTaskResponseToTaskItem]);

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

  const handleDrop = (
    e: DragEvent<HTMLDivElement>,
    targetColumnId: string
  ): void => {
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

      // Check if WebSocket is connected
      if (!isConnected) {
        console.error("WebSocket not connected. Cannot update task status.");
        alert("WebSocket not connected. Please refresh the page.");
        return;
      }

      // Store the original state for potential rollback
      const originalTask = { ...draggedItem };
      pendingUpdatesRef.current.set(draggedItem.id, {
        fromColumn: draggedFromColumn,
        toColumn: targetColumnId,
        task: originalTask,
      });

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

      // Emit WebSocket event to update task status
      emit('task:update-status', {
        projectId: projectId,
        taskId: draggedItem.id,
        status: targetColumn.status,
      });

      console.log('Emitted task:update-status event:', {
        projectId: projectId,
        taskId: draggedItem.id,
        status: targetColumn.status,
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
                        {item.deadline}
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
