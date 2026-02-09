import { Box, Link, SvgIcon, Typography, useMediaQuery, useTheme, Drawer, IconButton } from "@mui/material";
import LeftIcon from "../../../assets/icons/general/left.svg?react";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { useEffect, useState, useRef, useMemo } from "react";
import { useParams, useNavigate, useLocation } from "react-router";
import { useAppDispatch, useAppSelector, type RootState } from "../../../store/store";
import { fetchProjectDetailAction, updateTaskStatusAction } from "../../../store/features/projects/projectDetailAction";
import { claimTaskAction, transferTaskAction, getTaskStatusesAction } from "../../../store/features/task/projectAction";
import type { FileAttachment, ActivityLog } from "../../../store/types/Task/TaskTypes";
import FileUploadModal from "../components/FileUploadModal";
import FileBrowserModal from "../components/FileBrowserModal";
import TaskFormModal from "../components/TaskFormModal";
import ClaimTaskModal from "../components/ClaimTaskModal";
import TransferTaskModal from "../components/TransferTaskModal";
import UpdateTaskStatusModal from "../components/UpdateTaskStatusModal";
import TaskInfo from "../components/TaskInfo";
import ProjectInfoSidebar from "../components/ProjectInfoSidebar";
import TaskDetailsHeader, { TaskDetailsContent } from "../components/TaskDetailsHeader";
import FileAttachmentsSection from "../components/FileAttachmentsSection";
import ActivityLogsSection from "../components/ActivityLogsSection";
import ActivityLogThreadSidebar from "../components/ActivityLogThreadSidebar";
import Modal from "../../../common/components/Modal/Modal";
import { parseFirebaseTimestamp, isImageAttachment } from "../utils/taskUtils";
import { getActivityIcon } from "../utils/activityLogUtils";
import { getUsersAction } from "../../../store/features/user/userAction";
import { SERVER_BASE_URL } from "../../../config/api";
import type { ProjectResponse } from "../../../store/types/Project/ProjectResponse";
import { fetchActivityLogsByEntity } from "../../../store/features/activityLogs/activityLogsAction";
import { convertActivityLogItemsToLegacy } from "../utils/activityLogConverter";
import type { ActivityLogItem } from "../../../store/types/ActivityLogs/ActivityLog";
import { useNotifications } from "../../../contexts/NotificationContext";
import { linkFileAttachment } from "../../../store/apis/taskApis";
import type { StorageObject } from "../../../store/apis/storageApi";
import toast from "react-hot-toast";
import { useImageWithAuth } from "../../../utils/useImageWithAuth";
import { useUserPresence } from "../../../hooks/useUserPresence";
import { formatTime } from "../../../utils/timeFormatting";

const ProjectDetail = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { taskId, projectId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const activityLogsRef = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const projectDetailState = useAppSelector(
    (state: RootState) => state.projectDetailReducer
  );

  const activityLogsState = useAppSelector(
    (state: RootState) => state.activityLogsReducer.api
  );


  const taskListState = useAppSelector(
    (state: RootState) => state.taskListReducer.api
  );

  const userState = useAppSelector(
    (state: RootState) => state.userReducer
  );

  const taskStatuses = useAppSelector(
    (state: RootState) => state.taskListReducer.api.data.taskStatuses
  );

  const { taskDetails, projectDetails } = projectDetailState.api.data;
  const { loading, error } = projectDetailState.api;
  const { currentStatus } = projectDetailState.common;
  const { items: activityLogItems } = activityLogsState.data;
  const { loading: activityLogsLoading } = activityLogsState;
  const { loading: claimTaskLoading } = taskListState;
  const { users } = userState;

  // Get file attachments from task details
  const fileAttachments = taskDetails?.fileAttachments || [];
  
  // Debug: Log file attachments to see if previewUrl is present
  useEffect(() => {
    if (fileAttachments.length > 0) {
      console.log("File attachments received:", fileAttachments);
      fileAttachments.forEach((att, idx) => {
        console.log(`Attachment ${idx}:`, {
          fileName: att.fileName,
          fileUrl: att.fileUrl,
          previewUrl: att.previewUrl,
          downloadUrl: att.downloadUrl,
        });
      });
    }
  }, [fileAttachments]);


  // Modal states
  const [showFileUploadModal, setShowFileUploadModal] = useState(false);
  const [showFileBrowserModal, setShowFileBrowserModal] = useState(false);
  const [showEditTaskModal, setShowEditTaskModal] = useState(false);
  const [showClaimTaskModal, setShowClaimTaskModal] = useState(false);
  const [showTransferTaskModal, setShowTransferTaskModal] = useState(false);
  const [showUpdateStatusModal, setShowUpdateStatusModal] = useState(false);
  const [taskStatusRefreshKey, setTaskStatusRefreshKey] = useState(0);
  const [previewImage, setPreviewImage] = useState<FileAttachment | null>(null);
  const [projectActivityLogs, setProjectActivityLogs] = useState<ActivityLogItem[]>([]);
  const [selectedActivityLog, setSelectedActivityLog] = useState<ActivityLog | null>(null);
  const [showThreadSidebar, setShowThreadSidebar] = useState(false);
  const [showProjectInfoDrawer, setShowProjectInfoDrawer] = useState(false);
  const [showTaskInfoDrawer, setShowTaskInfoDrawer] = useState(false);
  
  const { onEvent, offEvent } = useNotifications();
  const { isUserOnline } = useUserPresence();


  // Fetch users if not already loaded
  useEffect(() => {
    if (users.length === 0 && !userState.loading) {
      dispatch(getUsersAction());
    }
  }, [dispatch, users.length, userState.loading]);

  // Fetch task statuses if not already loaded
  useEffect(() => {
    if (taskStatuses.length === 0) {
      dispatch(getTaskStatusesAction());
    }
  }, [dispatch, taskStatuses.length]);

  // Fetch project details
  useEffect(() => {
    if (taskId && projectId) {
      dispatch(fetchProjectDetailAction(taskId, projectId));
    }
  }, [taskId, projectId, dispatch]);

  // Fetch activity logs for the task using the new centralized API
  useEffect(() => {
    if (taskId) {
      dispatch(fetchActivityLogsByEntity("task", taskId));
    }
  }, [taskId, dispatch]);

  // Fetch activity logs for the project using Redux action
  // Note: We store in local state because activity logs reducer doesn't support multiple entities simultaneously
  // Task logs and project logs would overwrite each other in the shared state
  useEffect(() => {
    if (projectId) {
      (dispatch(fetchActivityLogsByEntity("project", projectId)) as Promise<{ items: ActivityLogItem[] }>)
        .then((data) => {
          setProjectActivityLogs(data?.items || []);
        })
        .catch(() => {
          setProjectActivityLogs([]);
        });
    }
  }, [projectId, dispatch]);

  // Listen for WebSocket events for new replies
  // Note: Replies are now handled entirely via WebSocket in ActivityLogThreadSidebar
  // This listener is kept for backward compatibility but may not be needed
  useEffect(() => {
    const handleReplyCreated = (data: { activityLogId?: string; reply?: any }) => {
      if (data.activityLogId && data.reply) {
        // Replies are handled in ActivityLogThreadSidebar component
        // This is just for logging
        console.log("[ProjectDetail] WebSocket reply created:", data);
      }
    };

    onEvent("activity-log:reply:created", handleReplyCreated);

    // Cleanup
    return () => {
      offEvent("activity-log:reply:created", handleReplyCreated);
    };
  }, [dispatch, onEvent, offEvent]);


  // Calculate time spent from activity logs (both project and task level)
  const calculateProjectTimeSpent = useMemo(() => {
    // First, try to get time spent from task activity logs (already fetched)
    let totalMinutes = 0;
    
    // Helper function to extract timeSpent from a log entry
    const getTimeSpentFromLog = (log: ActivityLogItem): number | null => {
      // Check fields.timeSpent first (primary location based on user's example)
      // The user's example shows: fields: { timeSpent: 540, ... }
      if (log.fields) {
        const timeSpent = log.fields.timeSpent;
        if (typeof timeSpent === "number" && timeSpent > 0) {
          return timeSpent;
        }
        // Also handle string numbers if they exist
        if (typeof timeSpent === "string" && !isNaN(Number(timeSpent))) {
          return Number(timeSpent);
        }
      }
      // Check metadata.timeSpent as fallback
      if (log.metadata) {
        const timeSpent = log.metadata.timeSpent;
        if (typeof timeSpent === "number" && timeSpent > 0) {
          return timeSpent;
        }
        if (typeof timeSpent === "string" && !isNaN(Number(timeSpent))) {
          return Number(timeSpent);
        }
      }
      return null;
    };
    
    // Check task activity logs
    if (activityLogItems && activityLogItems.length > 0) {
      activityLogItems.forEach((log) => {
        // Only process time_spent related actions
        if (log.action === "time_spent_added" || log.action === "time_spent_updated" || log.action === "time_spent_removed") {
          const timeSpentValue = getTimeSpentFromLog(log);

          if (timeSpentValue !== null && timeSpentValue > 0) {
            // Add for time_spent_added and time_spent_updated
            if (log.action === "time_spent_added" || log.action === "time_spent_updated") {
              totalMinutes += timeSpentValue;
            }
            // Subtract for time_spent_removed
            else if (log.action === "time_spent_removed") {
              totalMinutes -= timeSpentValue;
            }
          }
        }
      });
    }

    // Also check project activity logs (if any)
    if (projectActivityLogs && projectActivityLogs.length > 0) {
      projectActivityLogs.forEach((log) => {
        // Only process time_spent related actions
        if (log.action === "time_spent_added" || log.action === "time_spent_updated" || log.action === "time_spent_removed") {
          const timeSpentValue = getTimeSpentFromLog(log);

          if (timeSpentValue !== null && timeSpentValue > 0) {
            // Add for time_spent_added and time_spent_updated
            if (log.action === "time_spent_added" || log.action === "time_spent_updated") {
              totalMinutes += timeSpentValue;
            }
            // Subtract for time_spent_removed
            else if (log.action === "time_spent_removed") {
              totalMinutes -= timeSpentValue;
            }
          }
        }
      });
    }

    // If no time spent found in activity logs, try using taskDetails.timeSpent as fallback
    if (totalMinutes === 0 && taskDetails?.timeSpent && taskDetails.timeSpent.length > 0) {
      totalMinutes = taskDetails.timeSpent.reduce((sum, entry) => sum + (entry.timeSpent || 0), 0);
    }

    if (totalMinutes <= 0) {
      return null;
    }

    // Format time
    const days = Math.floor(totalMinutes / (24 * 60));
    const hours = Math.floor((totalMinutes % (24 * 60)) / 60);
    const minutes = totalMinutes % 60;
    
    const parts: string[] = [];
    if (days > 0) parts.push(`${days}d`);
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);
    if (parts.length === 0) return null;
    return `${parts.join(" ")} logged`;
  }, [activityLogItems, projectActivityLogs, taskDetails]);

  // Convert new ActivityLogItem format to legacy ActivityLog format for backward compatibility
  const mappedActivityLogs = useMemo(() => {
    console.log("[ProjectDetail] Activity log items:", activityLogItems);
    console.log("[ProjectDetail] Activity logs loading:", activityLogsLoading);
    
    if (!activityLogItems || activityLogItems.length === 0) {
      console.log("[ProjectDetail] No activity log items to convert");
      return [];
    }
    
    // Convert to legacy format
    const legacyLogs = convertActivityLogItemsToLegacy(activityLogItems);
    console.log("[ProjectDetail] Converted legacy logs:", legacyLogs);
    
    // Map with user names from store (for any missing user info)
    return legacyLogs.map((log: ActivityLog) => {
      // If userName is already a proper name (not a user ID), return as is
      if (log.userName && log.userName !== log.userId && log.userName !== "Unknown User") {
        return log;
      }
      
      // Otherwise, try to find user in store by userId
      const user = users.find((u) => u.id === log.userId);
      if (user) {
        return {
          ...log,
          userName: user.name || log.userName || "Unknown User",
        };
      }
      
      return log;
    });
  }, [activityLogItems, users]);

  // Get preview image URL (use previewUrl if available, otherwise fallback to fileUrl)
  // Only load image when modal is actually shown (lazy loading)
  const previewImageUrl = previewImage?.previewUrl 
    ? previewImage.previewUrl 
    : (previewImage?.fileUrl ? `${SERVER_BASE_URL}${previewImage.fileUrl}` : null);

  // Load image with JWT token using the utility hook - only when preview modal is shown
  const { blobUrl: previewImageBlobUrl, loading: previewImageLoading } = useImageWithAuth(
    previewImage ? (previewImageUrl || undefined) : undefined
  );

  // TODO: Replace with backend API polling or WebSocket for real-time activity logs
  // Real-time activity logs subscription removed (Firebase dependency)
  // Activity logs are now fetched via the backend API in fetchProjectDetailAction

  // Scroll to activity log when hash is present in URL
  useEffect(() => {
    if (!location.hash || !mappedActivityLogs || mappedActivityLogs.length === 0) return;

    const activityLogId = location.hash.replace("#activity-", "");

    let retryCount = 0;
    const maxRetries = 10;

    const scrollToActivity = () => {
      const scrollContainer = document.getElementById("project-detail-content");
      const elementById = document.getElementById(`activity-${activityLogId}`);
      const targetElement = activityLogsRef.current[activityLogId] || elementById;

      if (targetElement && scrollContainer) {
        const elementRect = targetElement.getBoundingClientRect();
        const containerRect = scrollContainer.getBoundingClientRect();
        const elementTop = elementRect.top - containerRect.top + scrollContainer.scrollTop;
        const elementHeight = elementRect.height;
        const containerHeight = scrollContainer.clientHeight;
        const scrollPosition = elementTop - (containerHeight / 2) + (elementHeight / 2);

        scrollContainer.scrollTo({
          top: Math.max(0, scrollPosition),
          behavior: "smooth",
        });

        // Highlight the element briefly
        targetElement.style.transition = "background-color 0.3s ease, box-shadow 0.3s ease, padding 0.3s ease";
        // Use theme-aware colors for highlighting
        const theme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
        const highlightColor = theme === 'dark' ? 'rgba(63, 140, 255, 0.2)' : '#E8F4FD';
        const shadowColor = theme === 'dark' ? 'rgba(63, 140, 255, 0.3)' : 'rgba(63, 140, 255, 0.2)';
        targetElement.style.backgroundColor = highlightColor;
        targetElement.style.boxShadow = `0 0 0 4px ${shadowColor}`;
        targetElement.style.padding = "8px";
        targetElement.style.borderRadius = "8px";
        targetElement.style.margin = "-8px";

        setTimeout(() => {
          targetElement.style.backgroundColor = "";
          targetElement.style.boxShadow = "";
          targetElement.style.padding = "";
          targetElement.style.borderRadius = "";
          targetElement.style.margin = "";
          setTimeout(() => {
            targetElement.style.transition = "";
          }, 300);
        }, 2000);
      } else if (retryCount < maxRetries) {
        retryCount++;
        setTimeout(scrollToActivity, 200);
      }
    };

    const timeoutId = setTimeout(scrollToActivity, 500);
    return () => clearTimeout(timeoutId);
  }, [location.hash, mappedActivityLogs]);

  // Close modal after successful claim
  useEffect(() => {
    if (!claimTaskLoading && showClaimTaskModal && taskId && projectId) {
      // Refresh task details and activity logs after successful claim
      dispatch(fetchProjectDetailAction(taskId, projectId));
      dispatch(fetchActivityLogsByEntity("task", taskId));
      setShowClaimTaskModal(false);
    }
  }, [claimTaskLoading, showClaimTaskModal, taskId, projectId, dispatch]);

  // Handlers
  const handleStatusChange = () => {
    // Just open the modal, status selection happens in the modal
    setShowUpdateStatusModal(true);
  };

  const handleStatusUpdate = async (newStatus: string, remark: string) => {
    if (!taskDetails || !taskId || !projectId || !newStatus) return;
    
    try {
      // Update task status with remark
      await dispatch(updateTaskStatusAction(taskId, newStatus, projectId, remark, taskDetails));
      
      // Close the modal
      setShowUpdateStatusModal(false);
      
      // Refresh task details and activity logs after status update
      if (taskId && projectId) {
        dispatch(fetchProjectDetailAction(taskId, projectId));
        dispatch(fetchActivityLogsByEntity("task", taskId));
      }
    } catch {
      // Error is already handled by the action with toast
    }
  };

  const handleCloseUpdateStatusModal = () => {
    setShowUpdateStatusModal(false);
  };


  const handleOpenFileUpload = () => setShowFileUploadModal(true);
  const handleCloseFileUpload = () => setShowFileUploadModal(false);
  const handleOpenFileBrowser = () => setShowFileBrowserModal(true);
  const handleCloseFileBrowser = () => setShowFileBrowserModal(false);
  
  const handleLinkFile = async (file: StorageObject) => {
    if (!projectId || !taskId) {
      toast.error("Project ID or Task ID is missing");
      return;
    }

    // Check if there's already a linked file
    // A linked file is identified by having a fileUrl that contains "/" (path separator)
    // and is longer than just a filename, suggesting it's a NAS path
    const hasLinkedFile = fileAttachments.some((att) => {
      return att.fileUrl && att.fileUrl.includes("/") && att.fileUrl.length > att.fileName.length + 5;
    });

    try {
      await linkFileAttachment(projectId, taskId, {
        fileName: file.name,
        originalName: file.name,
        fileSize: file.size,
        mimeType: file.contentType || "application/octet-stream",
        fileUrl: file.path,
      });
      
      if (hasLinkedFile) {
        toast.success("File linked successfully (replaced existing linked file)");
      } else {
        toast.success("File linked successfully");
      }
      
      // Refresh task details to show the new attachment
      if (taskId && projectId) {
        dispatch(fetchProjectDetailAction(taskId, projectId));
      }
      handleCloseFileBrowser();
    } catch (error: any) {
      console.error("Failed to link file:", error);
      toast.error(error?.message || "Failed to link file");
    }
  };
  const handleOpenEditTask = () => setShowEditTaskModal(true);
  const handleCloseEditTask = () => setShowEditTaskModal(false);
  const handleOpenClaimTask = () => setShowClaimTaskModal(true);
  const handleCloseClaimTask = () => setShowClaimTaskModal(false);
  const handleOpenTransferTask = () => setShowTransferTaskModal(true);
  const handleCloseTransferTask = () => setShowTransferTaskModal(false);

  const handleApproveClaim = () => {
    if (taskId && projectId) {
      dispatch(claimTaskAction(projectId, taskId));
    }
  };

  const handleRejectClaim = () => {
    // Just close the modal, no action needed
  };

  const handleTransferTask = async (userId: string) => {
    if (!taskId || !projectId) {
      return;
    }

    try {
      await dispatch(transferTaskAction(projectId, taskId, userId));
      
      // Close the modal
      setShowTransferTaskModal(false);
      
      // Refresh task details and activity logs after transfer
      if (taskId && projectId) {
        dispatch(fetchProjectDetailAction(taskId, projectId));
        dispatch(fetchActivityLogsByEntity("task", taskId));
      }
    } catch {
      // Error is already handled by the action with toast
    }
  };

  const handleOpenImagePreview = (attachment: FileAttachment) => {
    setPreviewImage(attachment);
  };

  const handleCloseImagePreview = () => {
    setPreviewImage(null);
  };

  const handleReplyClick = (activity: ActivityLog) => {
    setSelectedActivityLog(activity);
    setShowThreadSidebar(true);
  };

  const handleCloseThreadSidebar = () => {
    setShowThreadSidebar(false);
    setSelectedActivityLog(null);
  };

  // Calculate assignee ID and active status
  const assigneeId = useMemo(() => {
    // First, try to get from assignDetails (preferred - has full user details)
    if (taskDetails?.assignDetails && taskDetails.assignDetails.length > 0) {
      return taskDetails.assignDetails[0].id;
    }
    
    // Fallback to assignTo
    if (!taskDetails?.assignTo) return undefined;
    if (typeof taskDetails.assignTo === 'object' && taskDetails.assignTo !== null) {
      return taskDetails.assignTo.id;
    }
    if (typeof taskDetails.assignTo === 'string') {
      return taskDetails.assignTo;
    }
    return undefined;
  }, [taskDetails?.assignDetails, taskDetails?.assignTo]);

  // Map membersIds to assignes format for ProjectInfoSidebar
  const assignes = useMemo(() => {
    // First, check if assignes are already provided in projectDetails
    if (projectDetails?.assignes && Array.isArray(projectDetails.assignes) && projectDetails.assignes.length > 0) {
      return projectDetails.assignes;
    }
    
    // Otherwise, transform membersIds to assignes format
    if (!projectDetails?.membersIds || !users.length) return undefined;
    
    const mappedAssignes = projectDetails.membersIds
      .map((memberId) => {
        const user = users.find((u) => u.id === memberId);
        if (!user) return null;
        return {
          id: user.id,
          name: user.name || "Unknown User",
          avatar: "/api/placeholder/24/24",
        };
      })
      .filter((assigne): assigne is { id: string; name: string; avatar: string } => assigne !== null);
    
    // Return undefined if no assignees found, otherwise return the array
    return mappedAssignes.length > 0 ? mappedAssignes : undefined;
  }, [projectDetails?.assignes, projectDetails?.membersIds, users]);

  // Get assigned user for TaskInfo component
  const assignedUser = useMemo(() => {
    // First, try to get from assignDetails (preferred - has full user details)
    if (taskDetails?.assignDetails && taskDetails.assignDetails.length > 0) {
      const assignDetail = taskDetails.assignDetails[0];
      return {
        name: assignDetail.name || "Unknown Assignee",
        avatar: "/api/placeholder/24/24",
      };
    }
    
    // Fallback to assignTo if it's an object with name
    if (taskDetails?.assignTo && typeof taskDetails.assignTo === 'object' && taskDetails.assignTo !== null) {
      return {
        name: taskDetails.assignTo.name || "Unknown Assignee",
        avatar: "/api/placeholder/24/24",
      };
    }
    
    // Last resort: try to find user by ID from assignTo (if it's a string)
    if (taskDetails?.assignTo && typeof taskDetails.assignTo === 'string' && users.length > 0) {
      const assignToId = taskDetails.assignTo as string;
      const user = users.find((u) => u.id === assignToId);
      if (user) {
        return {
          name: user.name || "Unknown Assignee",
          avatar: "/api/placeholder/24/24",
        };
      }
    }
    
    return undefined;
  }, [taskDetails?.assignDetails, taskDetails?.assignTo, users]);


  // Loading state
  if (loading) {
    return (
      <Box sx={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Typography>Loading task details...</Typography>
      </Box>
    );
  }

  // Error state
  if (error || !taskDetails) {
    return (
      <Box sx={{ height: "100%" }}>
        <Link
          sx={{ alignItems: "center", display: "flex", cursor: "pointer" }}
          onClick={() => navigate("/app/projects")}
        >
          <SvgIcon component={LeftIcon} /> Back to Projects
        </Link>
        <Box sx={{ paddingTop: "28px", textAlign: "center" }}>
          <Typography color="error">{error || "Task not found"}</Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      height: { xs: "auto", sm: "100%" }, 
      padding: { xs: "12px", sm: "16px", md: 0 },
      minHeight: { xs: "100vh", sm: "auto" },
      pb: { xs: "20px", sm: 0 },
      width: "100%",
      maxWidth: "100%",
      overflowX: "hidden",
      boxSizing: "border-box",
    }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: { xs: "12px", sm: "16px", md: "20px" },
            gap: { xs: "12px", sm: "16px" },
          }}
        >
        <Link
          sx={{ 
            alignItems: "center", 
            display: "flex", 
            cursor: "pointer",
            fontSize: { xs: "14px", sm: "15px", md: "16px" },
            paddingLeft: { xs: 0, sm: 0 },
            color: "#3F8CFF",
            textDecoration: "none",
            flex: 1,
            "&:hover": {
              textDecoration: "underline",
            },
          }}
          onClick={() => navigate("/app/projects")}
        >
          <SvgIcon sx={{ fontSize: { xs: "20px", sm: "22px", md: "24px" }, mr: { xs: "6px", sm: "8px" } }} component={LeftIcon} /> Back to Projects
        </Link>
        
        {/* Drawer Toggle Buttons - Mobile only */}
        <Box sx={{ display: "flex", gap: "8px" }}>
          <IconButton
            onClick={() => setShowProjectInfoDrawer(true)}
            sx={{
              backgroundColor: "#F4F9FD",
              color: "#3F8CFF",
              "&:hover": {
                backgroundColor: "#E8F4FD",
              },
              display: { xs: "block", sm: "none" },
            }}
            size="small"
            title="Project Info"
          >
            <MenuIcon />
          </IconButton>
          <IconButton
            onClick={() => setShowTaskInfoDrawer(true)}
            sx={{
              backgroundColor: "#F4F9FD",
              color: "#3F8CFF",
              "&:hover": {
                backgroundColor: "#E8F4FD",
              },
              display: { xs: "block", sm: "none" },
            }}
            size="small"
            title="Task Info"
          >
            <MenuIcon />
          </IconButton>
        </Box>
      </Box>
      <Box
        sx={{
          paddingTop: { xs: "0px", sm: "20px", md: "20px", lg: "24px" },
          display: "flex",
          gap: { xs: "12px", sm: "16px", md: "20px", lg: "28px" },
          height: { xs: "auto", sm: "calc(100vh - 120px)", md: "calc(100vh - 120px)", lg: "calc(100vh - 100px)" },
          minHeight: { xs: "auto", sm: 0, md: 0, lg: 0 },
          flexDirection: { xs: "column", sm: "row", md: "row", lg: "row" },
          alignItems: { xs: "stretch", sm: "flex-start", md: "flex-start", lg: "flex-start" },
          width: "100%",
          "@media (min-width: 1200px) and (max-width: 1600px)": {
            gap: "20px",
            paddingTop: "24px",
          },
        }}
      >
        {/* Project Info Sidebar - Desktop/Tablet fixed, Mobile as drawer */}
        <Box
          sx={{
            width: { sm: "220px", md: "240px", lg: "265px" },
            flexShrink: 0,
            display: { xs: "none", sm: "block" },
            maxHeight: { sm: "100%", md: "100%" },
            overflowY: "auto",
          }}
        >
          <ProjectInfoSidebar
            projectTitle={projectDetails?.title}
            projectDescription={projectDetails?.description}
            reporter={
              projectDetails?.ownerId
                ? (() => {
                    const ownerUser = users.find((u) => u.id === projectDetails.ownerId);
                    return ownerUser
                      ? {
                          name: ownerUser.name || "Project Owner",
                        }
                      : undefined;
                  })()
                : undefined
            }
            assignes={assignes}
            priority={projectDetails?.priority}
            deadline={projectDetails?.deadline}
            timeSpent={calculateProjectTimeSpent}
          />
        </Box>

        {/* Project Info Drawer for Mobile only */}
        <Drawer
          anchor="left"
          open={showProjectInfoDrawer}
          onClose={() => setShowProjectInfoDrawer(false)}
          PaperProps={{
            sx: {
              width: "85%",
              maxWidth: "400px",
              padding: "16px",
            },
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>Project Info</Typography>
            <IconButton onClick={() => setShowProjectInfoDrawer(false)} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
          <ProjectInfoSidebar
            projectTitle={projectDetails?.title}
            projectDescription={projectDetails?.description}
            reporter={
              projectDetails?.ownerId
                ? (() => {
                    const ownerUser = users.find((u) => u.id === projectDetails.ownerId);
                    return ownerUser
                      ? {
                          name: ownerUser.name || "Project Owner",
                        }
                      : undefined;
                  })()
                : undefined
            }
            assignes={assignes}
            priority={projectDetails?.priority}
            deadline={projectDetails?.deadline}
            timeSpent={calculateProjectTimeSpent}
          />
        </Drawer>

        {/* Main Content Area */}
        <Box sx={{ 
          width: "100%", 
          maxWidth: "100%",
          minWidth: 0,
          display: "flex", 
          flexDirection: "column", 
          minHeight: 0, 
          flex: { xs: "1 1 100%", sm: "1 1 100%", md: "1 1 auto", lg: "1 1 auto" },
          overflowX: "hidden",
          boxSizing: "border-box",
          gap: { xs: "12px", sm: "16px", md: 0 },
        }}>
          <Box sx={{ mb: { xs: 0, sm: 0 }, width: "100%" }}>
            <TaskDetailsHeader 
              onEditClick={handleOpenEditTask} 
              onTransferClick={handleOpenTransferTask}
            />
          </Box>
          <TaskDetailsContent
            taskCode={taskDetails?.code}
            taskSubject={taskDetails?.drawingInfo?.typeName || taskDetails?.subject}
            currentStatus={currentStatus}
            onStatusChange={handleStatusChange}
            onClaimTaskClick={handleOpenClaimTask}
            refreshKey={taskStatusRefreshKey}
            project={projectDetails as ProjectResponse}
            taskStatuses={taskStatuses}
            projectId={projectId}
            taskId={taskId}
            assigneeId={assigneeId}
          >
            {/* File Attachments Section */}
            <FileAttachmentsSection
              fileAttachments={fileAttachments}
              loading={loading}
              onFileUploadClick={handleOpenFileUpload}
              onLinkFileClick={handleOpenFileBrowser}
              onImagePreview={handleOpenImagePreview}
              parseFirebaseTimestamp={parseFirebaseTimestamp}
              isImageAttachment={isImageAttachment}
            />


            {/* Activity Logs Section */}
            <ActivityLogsSection
              activityLogs={mappedActivityLogs}
              loading={activityLogsLoading}
              getActivityIcon={getActivityIcon}
              parseFirebaseTimestamp={parseFirebaseTimestamp}
              activityLogsRef={activityLogsRef}
              onReplyClick={handleReplyClick}
            />
          </TaskDetailsContent>
        </Box>

        {/* Task Info Sidebar - Desktop/Tablet fixed, Mobile as drawer */}
        <Box
          sx={{
            width: { sm: "220px", md: "240px", lg: "265px" },
            flexShrink: 0,
            display: { xs: "none", sm: "block" },
            maxHeight: { sm: "100%", md: "100%" },
            overflowY: "auto",
          }}
        >
          <TaskInfo
            reporter={
              projectDetails?.ownerId
                ? (() => {
                    const ownerUser = users.find((u) => u.id === projectDetails.ownerId);
                    return ownerUser
                      ? {
                          name: ownerUser.name || "Unknown Reporter",
                        }
                      : undefined;
                  })()
                : undefined
            }
            assigned={assignedUser}
            assignedUserId={assigneeId}
            isAssignedUserOnline={assigneeId ? isUserOnline(assigneeId) : false}
            priority={taskDetails?.priority}
            deadline={
              taskDetails?.deadline
                ? new Date(taskDetails.deadline).toLocaleDateString()
                : undefined
            }
            originalEstimate={undefined}
            projectId={projectId}
            taskId={taskId}
            task={taskDetails}
          />
        </Box>

        {/* Task Info Drawer for Mobile only */}
        <Drawer
          anchor="right"
          open={showTaskInfoDrawer}
          onClose={() => setShowTaskInfoDrawer(false)}
          PaperProps={{
            sx: {
              width: "85%",
              maxWidth: "400px",
              padding: "16px",
            },
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>Task Info</Typography>
            <IconButton onClick={() => setShowTaskInfoDrawer(false)} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
          <TaskInfo
            reporter={
              projectDetails?.ownerId
                ? (() => {
                    const ownerUser = users.find((u) => u.id === projectDetails.ownerId);
                    return ownerUser
                      ? {
                          name: ownerUser.name || "Unknown Reporter",
                        }
                      : undefined;
                  })()
                : undefined
            }
            assigned={assignedUser}
            assignedUserId={assigneeId}
            isAssignedUserOnline={assigneeId ? isUserOnline(assigneeId) : false}
            priority={taskDetails?.priority}
            deadline={
              taskDetails?.deadline
                ? new Date(taskDetails.deadline).toLocaleDateString()
                : undefined
            }
            originalEstimate={undefined}
            projectId={projectId}
            taskId={taskId}
            task={taskDetails}
          />
        </Drawer>
      </Box>

      {/* Modals */}
      {showFileUploadModal && (
        <FileUploadModal onClose={handleCloseFileUpload} projectId={projectId} taskId={taskId} />
      )}
      {showFileBrowserModal && (
        <FileBrowserModal
          isOpen={showFileBrowserModal}
          onClose={handleCloseFileBrowser}
          onSelectFile={handleLinkFile}
        />
      )}

      {showEditTaskModal && taskDetails && (
        <TaskFormModal
          show={showEditTaskModal}
          onClose={handleCloseEditTask}
          task={{
            id: taskDetails.id,
            subject: taskDetails.subject,
            code: taskDetails.code,
            status: taskDetails.status,
            startDate: ("startDate" in taskDetails && typeof taskDetails.startDate === "string") ? taskDetails.startDate : "",
            endDate: ("endDate" in taskDetails && typeof taskDetails.endDate === "string") ? taskDetails.endDate : "",
            deadline: taskDetails.deadline,
            priority: taskDetails.priority,
            assignTo: (typeof taskDetails.assignTo === 'object' && taskDetails.assignTo !== null) ? taskDetails.assignTo.id : (taskDetails.assignTo || null),
            projectId: taskDetails.projectId,
            progress: taskDetails.progress ?? 0,
            description: taskDetails.description || "",
            timeSpent: taskDetails.timeSpent || [],
            fileAttachments: taskDetails.fileAttachments || [],
            activityLogs: taskDetails.activityLogs || [],
            createdAt: taskDetails.created || new Date(),
            updatedAt: new Date(),
          }}
          isEditMode={true}
        />
      )}

      <ClaimTaskModal
        show={showClaimTaskModal}
        onClose={handleCloseClaimTask}
        onApprove={handleApproveClaim}
        onReject={handleRejectClaim}
        isLoading={claimTaskLoading}
      />

      <TransferTaskModal
        show={showTransferTaskModal}
        onClose={handleCloseTransferTask}
        onTransfer={handleTransferTask}
        isLoading={taskListState.loading}
        currentAssigneeId={
          taskDetails?.assignTo
            ? (typeof taskDetails.assignTo === 'object' && taskDetails.assignTo !== null
                ? taskDetails.assignTo.id
                : (typeof taskDetails.assignTo === 'string' ? taskDetails.assignTo : undefined))
            : undefined
        }
      />

      <UpdateTaskStatusModal
        show={showUpdateStatusModal}
        onClose={handleCloseUpdateStatusModal}
        onUpdate={handleStatusUpdate}
        currentStatus={currentStatus}
        taskStatuses={taskStatuses}
        isLoading={false}
      />


      {/* Activity Log Thread Sidebar */}
      {selectedActivityLog && (
        <ActivityLogThreadSidebar
          open={showThreadSidebar}
          onClose={handleCloseThreadSidebar}
          activityLog={selectedActivityLog}
        />
      )}

      {previewImage && previewImage.fileUrl && (
        <Modal show={!!previewImage} onClose={handleCloseImagePreview}>
          <Box
            sx={{
              position: "relative",
              maxWidth: "90vw",
              maxHeight: "90vh",
              backgroundColor: "background.paper",
              borderRadius: "24px",
              padding: "20px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <Box
              sx={{
                position: "absolute",
                top: "10px",
                right: "10px",
                cursor: "pointer",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                borderRadius: "50%",
                width: "32px",
                height: "32px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                "&:hover": {
                  backgroundColor: "rgba(0, 0, 0, 0.7)",
                },
              }}
              onClick={handleCloseImagePreview}
            >
              <Typography sx={{ fontSize: "20px", lineHeight: 1 }}>×</Typography>
            </Box>
            {previewImageLoading ? (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: "200px",
                  width: "100%",
                }}
              >
                <Typography>Loading image...</Typography>
              </Box>
            ) : !previewImageBlobUrl ? (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: "200px",
                  width: "100%",
                }}
              >
                <Typography color="error">No image URL available</Typography>
              </Box>
            ) : (
            <Box
              component="img"
                key={previewImageBlobUrl}
                src={previewImageBlobUrl}
              alt={previewImage.originalName}
              sx={{
                maxWidth: "100%",
                maxHeight: "80vh",
                objectFit: "contain",
                borderRadius: "12px",
              }}
                onError={() => {
                  console.error("Failed to load image");
                }}
            />
            )}
            <Typography
              sx={{
                marginTop: "16px",
                fontSize: "16px",
                fontWeight: 600,
                textAlign: "center",
              }}
            >
              {previewImage.originalName}
            </Typography>
          </Box>
        </Modal>
      )}
    </Box>
  );
};

export default ProjectDetail;