import React, { useState, useEffect, useCallback, type DragEvent } from "react";
import { useNavigate } from "react-router";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
} from "@mui/material";
import { subscribeToProjectTasks, updateTaskStatus, type FirebaseTask } from "../../../services/firebaseTaskService";
import { mapStatusToUnified } from "../constants/taskStatus.constants";

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

// Format duration from Date to string - moved outside component for performance
const formatDuration = (date: Date | { toDate: () => Date } | string): string => {
  if (!date) return "0h";

  let dateObj: Date;
  
  try {
    // Check if it's a Firestore timestamp object with toDate method
    if (typeof date === 'object' && date !== null && 'toDate' in date && typeof (date as { toDate: () => Date }).toDate === 'function') {
      dateObj = (date as { toDate: () => Date }).toDate();
    } else if (typeof date === 'string' || date instanceof Date) {
      // Handle string dates or regular Date objects
      dateObj = new Date(date as string | Date);
    } else {
      return "0h";
    }
    
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

  // Convert Firebase task to TaskItem
  const convertFirebaseTaskToTaskItem = useCallback((firebaseTask: FirebaseTask): TaskItem => {
    return {
      id: firebaseTask.id,
      title: firebaseTask.subject,
      code: firebaseTask.code,
      priority: firebaseTask.priority as "Low" | "Medium" | "High",
      duration: formatDuration(firebaseTask.duration),
      assignee: {
        name: "UI/UX Designer", // You can get this from assignTo array
        avatar: "/api/placeholder/24/24",
      },
      status: firebaseTask.status,
    };
  }, []);

  // Subscribe to real-time updates
  useEffect(() => {
    if (!projectId) return;

    const unsubscribe = subscribeToProjectTasks(projectId, (firebaseTasks: FirebaseTask[]) => {
      const taskItems = firebaseTasks.map(convertFirebaseTaskToTaskItem);
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
    });

    return () => unsubscribe();
  }, [projectId, convertFirebaseTaskToTaskItem]);

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
        // Update the task status in Firebase
        await updateTaskStatus(projectId, draggedItem.id, targetColumn.status);
        
        // The real-time listener will automatically update the UI
        // so we don't need to manually update the columns state
      } catch {
        // You might want to show a toast notification here
        // For now, we'll silently handle the error
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
      sx={{
        display: "flex",
        gap: "16px",
        padding: "16px",
        backgroundColor: "#F4F9FD",
        minHeight: "100%",
        overflowX: "auto",
      }}
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
            sx={{
              backgroundColor: "#FFFFFF",
              borderRadius: "20px",
              padding: "12px 16px",
              marginBottom: "12px",
              boxShadow: "0px 6px 58px 0px rgba(196, 203, 214, 0.1)",
              textAlign: "center",
            }}
          >
            <Typography
              sx={{
                fontFamily: "Nunito Sans",
                fontWeight: 700,
                fontSize: "14px",
                color: "#0A1629",
              }}
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
            sx={{
              minHeight: "300px",
              backgroundColor: dragOverColumn === column.id ? "#E8F2FF" : "transparent",
              borderRadius: "12px",
              padding: "6px",
              transition: "background-color 0.2s ease",
            }}
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
                sx={{
                  backgroundColor: "#FFFFFF",
                  borderRadius: "20px",
                  marginBottom: "12px",
                  boxShadow: "0px 6px 58px 0px rgba(196, 203, 214, 0.1)",
                  cursor: draggedItem ? "grabbing" : "pointer",
                  transform: draggedItem?.id === item.id ? "rotate(2deg)" : "none",
                  opacity: draggedItem?.id === item.id ? 0.8 : 1,
                  transition: "all 0.2s ease",
                  "&:hover": {
                    transform: draggedItem ? "none" : "translateY(-2px)",
                    boxShadow: draggedItem ? "0px 6px 58px 0px rgba(196, 203, 214, 0.1)" : "0px 8px 64px 0px rgba(196, 203, 214, 0.15)",
                  },
                  "&:active": {
                    cursor: "grabbing",
                  },
                }}
              >
                <CardContent sx={{ padding: "16px" }}>
                  {/* Task Code */}
                  <Typography
                    sx={{
                      fontFamily: "Nunito Sans",
                      fontWeight: 400,
                      fontSize: "11px",
                      color: "#91929E",
                      marginBottom: "2px",
                    }}
                  >
                    {item.code}
                  </Typography>

                  {/* Task Title */}
                  <Typography
                    sx={{
                      fontFamily: "Nunito Sans",
                      fontWeight: 400,
                      fontSize: "13px",
                      color: "#0A1629",
                      marginBottom: "12px",
                      lineHeight: 1.4,
                      whiteSpace: "pre-line",
                    }}
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
                      sx={{
                        backgroundColor: "#F4F9FD",
                        borderRadius: "6px",
                        padding: "4px 8px",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <Typography
                        sx={{
                          fontFamily: "Nunito Sans",
                          fontWeight: 700,
                          fontSize: "11px",
                          color: "#7D8592",
                        }}
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
                        sx={{
                          width: "20px",
                          height: "20px",
                          border: "2px solid #FFFFFF",
                        }}
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
                sx={{
                  backgroundColor: "#FFFFFF",
                  borderRadius: "20px",
                  padding: "30px 16px",
                  textAlign: "center",
                  boxShadow: "0px 6px 58px 0px rgba(196, 203, 214, 0.1)",
                  border: "2px dashed #E4E6E8",
                }}
              >
                <Typography
                  sx={{
                    fontFamily: "Nunito Sans",
                    fontWeight: 400,
                    fontSize: "13px",
                    color: "#7D8592",
                  }}
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
