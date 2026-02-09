import React, { useState, useEffect, useCallback, useRef, type DragEvent } from "react";
import { useNavigate } from "react-router";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
} from "@mui/material";
import { normalizeTaskStatus } from "../constants/taskStatus.constants";
import { useAppDispatch, useAppSelector, type RootState } from "../../../store/store";
import { getTaskStatusesAction } from "../../../store/features/task/projectAction";
import type { TaskResponse } from "../../../store/types/Task/TaskResponse";
import { useNotifications } from "../../../contexts/NotificationContext";
import type { TaskStatus } from "../../../store/types/Task/TaskTypes";
import { updateTaskStatus } from "../../../store/apis/taskApis";

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
  const dispatch = useAppDispatch();
  const taskListState = useAppSelector((state: RootState) => state.taskListReducer.api);
  const taskStatuses = useAppSelector((state: RootState) => state.taskListReducer.api.data.taskStatuses);
  const { onEvent, offEvent, isConnected } = useNotifications();
  
  // Initialize columns from API task statuses, fallback to default if not loaded
  const getInitialColumns = useCallback((): Column[] => {
    if (taskStatuses.length > 0) {
      // Create a copy of the array before sorting (Redux state is read-only)
      return [...taskStatuses]  
        .sort((a, b) => {
          // First, sort by order field if available (from API response)
          if (a.order !== undefined && b.order !== undefined) {
            return a.order - b.order;
          }
          if (a.order !== undefined) return -1;
          if (b.order !== undefined) return 1;
          
          // Fallback: Sort by category: active first, then completed, then final
          const categoryOrder: Record<string, number> = { active: 0, completed: 1, final: 2 };
          const categoryDiff = (categoryOrder[a.category] || 99) - (categoryOrder[b.category] || 99);
          if (categoryDiff !== 0) return categoryDiff;
          // Within same category, active statuses first
          if (a.isActive !== b.isActive) return a.isActive ? -1 : 1;
          return 0;
        })
        .map((status: TaskStatus) => ({
          id: status.value,
          title: status.displayName,
          items: [],
          status: status.value,
        }));
    }
    // Fallback to default columns if API statuses not loaded yet
    return [
      {
        id: "pending",
        title: "Pending",
        items: [],
        status: "pending",
      },
      {
        id: "in_progress",
        title: "In Progress",
        items: [],
        status: "in_progress",
      },
      {
        id: "in_review",
        title: "In Review",
        items: [],
        status: "in_review",
      },
      {
        id: "completed",
        title: "Completed",
        items: [],
        status: "completed",
      },
      {
        id: "accepted",
        title: "Accepted",
        items: [],
        status: "accepted",
      },
      {
        id: "rejected",
        title: "Rejected",
        items: [],
        status: "rejected",
      },
    ];
  }, [taskStatuses]);

  const [columns, setColumns] = useState<Column[]>(getInitialColumns());

  const [draggedItem, setDraggedItem] = useState<TaskItem | null>(null);
  const [draggedFromColumn, setDraggedFromColumn] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);
  const pendingUpdatesRef = useRef<Map<string, { fromColumn: string; toColumn: string; task: TaskItem }>>(new Map());

  // Fetch task statuses if not already loaded
  useEffect(() => {
    if (taskStatuses.length === 0) {
      dispatch(getTaskStatusesAction());
    }
  }, [dispatch, taskStatuses.length]);

  // Update columns when task statuses are loaded
  useEffect(() => {
    if (taskStatuses.length > 0) {
      // Create a copy of the array before sorting (Redux state is read-only)
      // Create columns from API task statuses, ordered by order field from API response
      const newColumns = [...taskStatuses]
        .sort((a, b) => {
          // First, sort by order field if available (from API response)
          if (a.order !== undefined && b.order !== undefined) {
            return a.order - b.order;
          }
          if (a.order !== undefined) return -1;
          if (b.order !== undefined) return 1;
          
          // Fallback: Sort by category: active first, then completed, then final
          const categoryOrder: Record<string, number> = { active: 0, completed: 1, final: 2 };
          const categoryDiff = (categoryOrder[a.category] || 99) - (categoryOrder[b.category] || 99);
          if (categoryDiff !== 0) return categoryDiff;
          // Within same category, active statuses first
          if (a.isActive !== b.isActive) return a.isActive ? -1 : 1;
          return 0;
        })
        .map((status: TaskStatus) => ({
          id: status.value,
          title: status.displayName,
          items: [],
          status: status.value,
        }));
      
      setColumns(prevColumns => {
        // Preserve items when updating columns structure
        return newColumns.map(newCol => {
          const prevCol = prevColumns.find(col => col.id === newCol.id || col.status === newCol.status);
          return {
            ...newCol,
            items: prevCol?.items || [],
          };
        });
      });
    }
  }, [taskStatuses]);

  // Convert TaskResponse to TaskItem
  const convertTaskResponseToTaskItem = useCallback((task: TaskResponse): TaskItem => {
    const assigneeName = task.assignDetails && task.assignDetails.length > 0 
      ? task.assignDetails[0].name 
      : (task.assignTo?.name || "Unassigned");
    const assigneeAvatar = "/api/placeholder/24/24";

    // Use drawing type name if available, otherwise fall back to subject
    const taskTitle = task.drawingInfo?.typeName || task.subject;

    return {
      id: task.id,
      title: taskTitle,
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

  // Note: Tasks are fetched by ProjectList component when projectId changes
  // ProjectBoard just reads from Redux state, no need to fetch here

  // Update columns when tasks are loaded from Redux state
  useEffect(() => {
    if (taskListState?.data?.tasks && projectId && !taskListState.loading) {
      const taskItems = taskListState.data.tasks.map(convertTaskResponseToTaskItem);
      setColumns(prevColumns => {
        // Initialize all columns with empty items
        const newColumns = prevColumns.map(column => ({
          ...column,
          items: [] as TaskItem[],
        }));
        
        // Assign each task to exactly one column (the first matching one)
        taskItems.forEach(task => {
          if (!task.status) return;
          
          const taskStatus = task.status.trim();
          
          // Find the first matching column for this task
          for (const column of newColumns) {
            const columnStatus = column.status.trim();
            const columnId = column.id.trim();
            
            // Try direct exact match first (most reliable)
            if (taskStatus === columnStatus || taskStatus === columnId) {
              column.items.push(task);
              return; // Task assigned, move to next task
            }
            
            // Try case-insensitive match
            if (taskStatus.toLowerCase() === columnStatus.toLowerCase() || 
                taskStatus.toLowerCase() === columnId.toLowerCase()) {
              column.items.push(task);
              return; // Task assigned, move to next task
            }
          }
          
          // If no direct match found, try normalized matching as fallback
          const normalizedTaskStatus = normalizeTaskStatus(task.status);
          for (const column of newColumns) {
            const normalizedColumnStatus = normalizeTaskStatus(column.status);
            if (normalizedTaskStatus === normalizedColumnStatus) {
              column.items.push(task);
              return; // Task assigned, move to next task
            }
          }
          
          // If no match found at all, task won't appear in any column
        });
        
        // Only update if columns actually changed
        const hasChanged = prevColumns.some((prevCol, index) => {
          const newCol = newColumns[index];
          return prevCol.items.length !== newCol.items.length ||
            prevCol.items.some((item, itemIndex) => 
              !newCol.items[itemIndex] || newCol.items[itemIndex].id !== item.id
            );
        });
        
        return hasChanged ? newColumns : prevColumns;
      });
    }
  }, [taskListState?.data?.tasks, taskListState.loading, projectId, convertTaskResponseToTaskItem]);

  // Listen for task status updates from SSE
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

      console.log('Task status updated via SSE:', messageData);

      // If we have a pending update for this task, remove it (server confirmed)
      pendingUpdatesRef.current.delete(messageData.taskId);

      // Update the task in the columns
      setColumns(prevColumns => {
        const updatedColumns = prevColumns.map(column => {
          // Remove task from all columns first
          const filteredItems = column.items.filter(item => item.id !== messageData.taskId);
          
          // If this column matches the new status, add the task
          // Use direct matching first, then fallback to unified mapping
          const newStatus = messageData.status.trim();
          const columnStatus = column.status.trim();
          const columnId = column.id.trim();
          
          const statusMatches = 
            newStatus === columnStatus || 
            newStatus === columnId ||
            newStatus.toLowerCase() === columnStatus.toLowerCase() ||
            newStatus.toLowerCase() === columnId.toLowerCase() ||
            normalizeTaskStatus(messageData.status) === normalizeTaskStatus(column.status);
          
          if (statusMatches) {
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

    // Register event listeners
    onEvent('task:status-updated', handleTaskStatusUpdated);
    onEvent('task:update-status:success', handleUpdateSuccess);

    // Cleanup
    return () => {
      offEvent('task:status-updated', handleTaskStatusUpdated);
      offEvent('task:update-status:success', handleUpdateSuccess);
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

      // Update task status via REST API (SSE is unidirectional)
      updateTaskStatus(projectId, draggedItem.id, targetColumn.status, '')
        .then(() => {
          console.log('Task status update API call successful:', {
            projectId: projectId,
            taskId: draggedItem.id,
            status: targetColumn.status,
          });
          // The SSE event will be received separately to update the UI
        })
        .catch((error) => {
          console.error('Task status update failed:', error);
          
          // Revert the optimistic update
          const pendingUpdate = pendingUpdatesRef.current.get(draggedItem.id);
          if (pendingUpdate) {
            setColumns(prevColumns => 
              prevColumns.map(column => {
                if (column.id === pendingUpdate.toColumn) {
                  return {
                    ...column,
                    items: column.items.filter(item => item.id !== draggedItem.id)
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
            pendingUpdatesRef.current.delete(draggedItem.id);
          }

          // Show error notification
          const errorMessage = error instanceof Error ? error.message : 'Failed to update task status';
          alert(`Failed to update task status: ${errorMessage}`);
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
