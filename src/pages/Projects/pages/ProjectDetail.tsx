import { Box, Link, SvgIcon, Typography, useMediaQuery, useTheme } from "@mui/material";
import LeftIcon from "../../../assets/icons/general/left.svg?react";
import { useEffect, useState, useRef, useMemo } from "react";
import { useParams, useNavigate, useLocation } from "react-router";
import { useAppDispatch, useAppSelector, type RootState } from "../../../store/store";
import { fetchProjectDetailAction, updateTaskStatusAction } from "../../../store/features/projects/projectDetailAction";
import { claimTaskAction, getTaskStatusesAction } from "../../../store/features/task/projectAction";
import type { FileAttachment, ActivityLog } from "../../../store/types/Task/TaskTypes";
import FileUploadModal from "../components/FileUploadModal";
import TaskFormModal from "../components/TaskFormModal";
import ClaimTaskModal from "../components/ClaimTaskModal";
import UpdateTaskStatusModal from "../components/UpdateTaskStatusModal";
import TaskInfo from "../components/TaskInfo";
import ProjectInfoSidebar from "../components/ProjectInfoSidebar";
import TaskDetailsHeader, { TaskDetailsContent } from "../components/TaskDetailsHeader";
import FileAttachmentsSection from "../components/FileAttachmentsSection";
import ActivityLogsSection from "../components/ActivityLogsSection";
import TimeTrackingSection from "../components/TimeTrackingSection";
import Modal from "../../../common/components/Modal/Modal";
import { parseFirebaseTimestamp, isImageAttachment } from "../utils/taskUtils";
import { getActivityIcon } from "../utils/activityLogUtils";
import { getUsersAction } from "../../../store/features/user/userAction";
import { SERVER_BASE_URL } from "../../../config/api";
import type { ProjectResponse } from "../../../store/types/Project/ProjectResponse";
import { fetchActivityLogsByEntity } from "../../../store/features/activityLogs/activityLogsAction";
import { convertActivityLogItemsToLegacy } from "../utils/activityLogConverter";
import type { ActivityLogItem } from "../../../store/types/ActivityLogs/ActivityLog";

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

  // Calculate time logged from timeSpent entries
  const calculateTimeLogged = (timeSpent?: Array<{ timeSpent: number }>) => {
    if (!timeSpent || timeSpent.length === 0) {
      return "0h 0m logged";
    }
    const totalMinutes = timeSpent.reduce((sum, entry) => sum + (entry.timeSpent || 0), 0);
    const days = Math.floor(totalMinutes / (24 * 60));
    const hours = Math.floor((totalMinutes % (24 * 60)) / 60);
    const minutes = totalMinutes % 60;
    
    const parts: string[] = [];
    if (days > 0) parts.push(`${days}d`);
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);
    if (parts.length === 0) return "0h 0m logged";
    return `${parts.join(" ")} logged`;
  };

  const timeLogged = calculateTimeLogged(taskDetails?.timeSpent);

  // Modal states
  const [showFileUploadModal, setShowFileUploadModal] = useState(false);
  const [showEditTaskModal, setShowEditTaskModal] = useState(false);
  const [showClaimTaskModal, setShowClaimTaskModal] = useState(false);
  const [showUpdateStatusModal, setShowUpdateStatusModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<FileAttachment | null>(null);
  const [projectActivityLogs, setProjectActivityLogs] = useState<ActivityLogItem[]>([]);


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
    if (!activityLogItems || activityLogItems.length === 0) return [];
    
    // Convert to legacy format
    const legacyLogs = convertActivityLogItemsToLegacy(activityLogItems);
    
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
  const handleStatusChange = (newStatus: string) => {
    // Store the selected status and show the modal
    setSelectedStatus(newStatus);
    setShowUpdateStatusModal(true);
  };

  const handleStatusUpdate = async (remark: string) => {
    if (!taskDetails || !taskId || !projectId || !selectedStatus) return;
    
    try {
      // Update task status with remark
      await dispatch(updateTaskStatusAction(taskId, selectedStatus, projectId, remark, taskDetails));
      
      // Close the modal
      setShowUpdateStatusModal(false);
      setSelectedStatus(null);
      
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
    setSelectedStatus(null);
  };

  const handleOpenFileUpload = () => setShowFileUploadModal(true);
  const handleCloseFileUpload = () => setShowFileUploadModal(false);
  const handleOpenEditTask = () => setShowEditTaskModal(true);
  const handleCloseEditTask = () => setShowEditTaskModal(false);
  const handleOpenClaimTask = () => setShowClaimTaskModal(true);
  const handleCloseClaimTask = () => setShowClaimTaskModal(false);

  const handleApproveClaim = () => {
    if (taskId && projectId) {
      dispatch(claimTaskAction(projectId, taskId));
    }
  };

  const handleRejectClaim = () => {
    // Just close the modal, no action needed
  };

  const handleOpenImagePreview = (attachment: FileAttachment) => {
    setPreviewImage(attachment);
  };

  const handleCloseImagePreview = () => {
    setPreviewImage(null);
  };


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
      padding: { xs: "10px", sm: 0 },
      minHeight: { xs: "100vh", sm: "auto" },
      pb: { xs: "20px", sm: 0 },
      width: "100%",
      maxWidth: "100%",
      overflowX: "hidden",
      boxSizing: "border-box",
    }}>
      <Link
        sx={{ 
          alignItems: "center", 
          display: "flex", 
          cursor: "pointer",
          fontSize: { xs: "14px", sm: "16px" },
          mb: { xs: "14px", sm: 0 },
          paddingLeft: { xs: "10px", sm: 0 },
        }}
        onClick={() => navigate("/app/projects")}
      >
        <SvgIcon sx={{ fontSize: { xs: "20px", sm: "24px" }, mr: { xs: "8px", sm: "4px" } }} component={LeftIcon} /> Back to Projects
      </Link>
      <Box
        sx={{
          paddingTop: { xs: "0px", sm: "20px", md: "24px", lg: "28px" },
          display: "flex",
          gap: { xs: "10px", sm: "16px", md: "20px", lg: "28px" },
          height: { xs: "auto", sm: "auto", md: "calc(100vh - 100px)", lg: "calc(100vh - 100px)" },
          minHeight: { xs: "auto", sm: "auto", md: 0, lg: 0 },
          flexDirection: { xs: "column", sm: "column", md: "row", lg: "row" },
          alignItems: { xs: "stretch", sm: "stretch", md: "flex-start", lg: "flex-start" },
          "@media (min-width: 1200px) and (max-width: 1600px)": {
            gap: "20px",
            paddingTop: "24px",
          },
        }}
      >
        {/* Project Info Sidebar */}
        {!isMobile && (
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
            assignes={projectDetails?.assignes}
            priority={projectDetails?.priority}
            deadline={projectDetails?.deadline}
            timeSpent={calculateProjectTimeSpent}
          />
        )}

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
        }}>
          {/* Mobile: Show Project Info at top */}
          {isMobile && (
            <Box sx={{ mb: "10px" }}>
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
                assignes={projectDetails?.assignes}
                priority={projectDetails?.priority}
                deadline={projectDetails?.deadline}
                timeSpent={calculateProjectTimeSpent}
              />
            </Box>
          )}
          <Box sx={{ mb: { xs: "10px", sm: 0 } }}>
            <TaskDetailsHeader onEditClick={handleOpenEditTask} />
          </Box>
          <TaskDetailsContent
            taskCode={taskDetails?.code}
            taskSubject={taskDetails?.subject}
            currentStatus={currentStatus}
            onStatusChange={handleStatusChange}
            onClaimTaskClick={handleOpenClaimTask}
            project={projectDetails as ProjectResponse}
          >
            {/* File Attachments Section */}
            <FileAttachmentsSection
              fileAttachments={fileAttachments}
              loading={loading}
              onFileUploadClick={handleOpenFileUpload}
              onImagePreview={handleOpenImagePreview}
              parseFirebaseTimestamp={parseFirebaseTimestamp}
              isImageAttachment={isImageAttachment}
            />

            {/* Time Tracking Section - Mobile only */}
            {isMobile && (
              <TimeTrackingSection
                timeLogged={timeLogged}
                originalEstimate="Original Estimate 3d 8h"
                projectId={projectId}
                taskId={taskId}
                task={taskDetails}
                progress={taskDetails?.progress ?? null}
              />
            )}

            {/* Activity Logs Section */}
            <ActivityLogsSection
              activityLogs={mappedActivityLogs}
              loading={activityLogsLoading}
              getActivityIcon={getActivityIcon}
              parseFirebaseTimestamp={parseFirebaseTimestamp}
              activityLogsRef={activityLogsRef}
            />
          </TaskDetailsContent>
        </Box>

        {/* Task Info Sidebar */}
        {!isMobile && (
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
            assigned={
              taskDetails?.assignDetails && taskDetails.assignDetails.length > 0
                ? {
                    name: taskDetails.assignDetails[0].name || "Unknown Assignee",
                  }
                : undefined
            }
            priority={taskDetails?.priority}
            deadline={
              taskDetails?.deadline
                ? new Date(taskDetails.deadline).toLocaleDateString()
                : undefined
            }
            timeLogged={timeLogged}
            originalEstimate={undefined}
            projectId={projectId}
            taskId={taskId}
            task={taskDetails}
            onLogTime={() => {
              // TODO: Implement log time functionality
            }}
          />
        )}
      </Box>

      {/* Modals */}
      {showFileUploadModal && (
        <FileUploadModal onClose={handleCloseFileUpload} projectId={projectId} taskId={taskId} />
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

      {selectedStatus && (
        <UpdateTaskStatusModal
          show={showUpdateStatusModal}
          onClose={handleCloseUpdateStatusModal}
          onUpdate={handleStatusUpdate}
          status={selectedStatus}
          isLoading={false}
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
            <Box
              component="img"
              src={`${SERVER_BASE_URL}${previewImage.fileUrl}`}
              alt={previewImage.originalName}
              sx={{
                maxWidth: "100%",
                maxHeight: "80vh",
                objectFit: "contain",
                borderRadius: "12px",
              }}
            />
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