import {
  Avatar,
  AvatarGroup,
  Box,
  Button,
  Link,
  SvgIcon,
  Typography,
} from "@mui/material";
import LeftIcon from "../../../assets/icons/general/left.svg?react";
import FilterIcon from "../../../assets/icons/general/calendar-5.svg?react";
import EditIcon from "../../../assets/icons/general/gear.svg?react";
import YellowArrow from "../../../assets/icons/general/calendar-23.svg?react";
import CalendarIcon from "../../../assets/icons/sidebar/calendar/inactive.svg?react";
import AttachmentIcon from "../../../assets/icons/general/calendar-19.svg?react";
import FilesIcon from "../../../assets/icons/general/calendar-20.svg?react";
import UploadIcon from "../../../assets/icons/general/upload.svg?react";
import Chips from "../../../common/components/Chips/Chips";
import TaskInfo from "../components/TaskInfo";
import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router";
import { useAppDispatch, useAppSelector, type RootState } from "../../../store/store";
import { fetchProjectDetailAction, updateTaskStatusAction } from "../../../store/features/projects/projectDetailAction";
import { claimTaskAction } from "../../../store/features/task/projectAction";
import { getActivityLogsSuccess } from "../../../store/features/task/taskSlice";
import type { ActivityLog, FileAttachment } from "../../../store/types/Task/TaskTypes";
import FileUploadModal from "../components/FileUploadModal";
import TaskFormModal from "../components/TaskFormModal";
import ClaimTaskModal from "../components/ClaimTaskModal";
import ActivityLogItem from "../components/ActivityLogItem";
import { subscribeToTaskActivityLogs } from "../../../services/firebaseActivityLogService";
import Modal from "../../../common/components/Modal/Modal";

// Icon mapping for activity types
const getActivityIcon = (type: ActivityLog['type']) => {
  switch (type) {
    case 'time_spent_added':
      return CalendarIcon;
    case 'file_uploaded':
      return UploadIcon;
    case 'task_assigned':
      return AttachmentIcon;
    case 'status_changed':
      return FilterIcon;
    case 'task_created':
      return FilesIcon;
    default:
      return UploadIcon;
  }
};

// Utility function to handle Firebase timestamp conversion
const parseFirebaseTimestamp = (timestamp: string | { _seconds: number; _nanoseconds: number }): Date => {
  if (typeof timestamp === 'object' && timestamp._seconds) {
    return new Date(timestamp._seconds * 1000);
  }
  return new Date(timestamp as string);
};

const ProjectDetail = () => {
  const { taskId, projectId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const activityLogsRef = useRef<{ [key: string]: HTMLDivElement | null }>({});
  
  const projectDetailState = useAppSelector(
    (state: RootState) => state.projectDetailReducer
  );
  
  const taskListState = useAppSelector(
    (state: RootState) => state.taskListReducer.api
  );
  
  const { taskDetails, projectDetails } = projectDetailState.api.data;
  const { loading, error } = projectDetailState.api;
  const { currentStatus } = projectDetailState.common;
  const { activityLogs } = taskListState.data;
  const { loading: taskListLoading, error: claimTaskError } = taskListState;
  const claimTaskLoading = taskListState.loading;
  
  // Get file attachments from task details
  const fileAttachments = taskDetails?.fileAttachments || [];
  
  const [showFileUploadModal, setShowFileUploadModal] = useState(false);
  const [showEditTaskModal, setShowEditTaskModal] = useState(false);
  const [showClaimTaskModal, setShowClaimTaskModal] = useState(false);
  const [wasClaiming, setWasClaiming] = useState(false);
  const [previewImage, setPreviewImage] = useState<FileAttachment | null>(null);
  
  // Mock replies data (for UI purposes) - can be moved to API later
  const mockReplies: Record<string, Array<{
    id: string;
    userId: string;
    userName: string;
    message: string;
    timestamp: Date;
  }>> = {};

  // Fetch project details (file attachments are included in task details)
  useEffect(() => {
    if (taskId && projectId) {
      dispatch(fetchProjectDetailAction(taskId, projectId));
    }
  }, [taskId, projectId, dispatch]);

  // Subscribe to real-time activity logs
  useEffect(() => {
    if (!taskId || !projectId) return;

    // Don't dispatch getActivityLogsRequest here - it sets loading state which interferes with file attachments
    // The real-time subscription will update activity logs directly
    const unsubscribe = subscribeToTaskActivityLogs(projectId, taskId, (activityLogs) => {
      dispatch(getActivityLogsSuccess({ activityLogs }));
    });

    return () => unsubscribe();
  }, [taskId, projectId, dispatch]);

  // Scroll to activity log when hash is present in URL
  useEffect(() => {
    if (!location.hash || !activityLogs || activityLogs.length === 0) return;

    // Extract activity log ID from hash (format: #activity-{id})
    const activityLogId = location.hash.replace('#activity-', '');
    
    // Wait for DOM to be ready and activity logs to be rendered
    let retryCount = 0;
    const maxRetries = 10;
    
    const scrollToActivity = () => {
      // Find the scroll container (the Box with overflowY: auto)
      const scrollContainer = document.getElementById('project-detail-content');
      
      // Try to find element by ID
      const elementById = document.getElementById(`activity-${activityLogId}`);
      const targetElement = activityLogsRef.current[activityLogId] || elementById;
      
      if (targetElement && scrollContainer) {
        // Get the element's position relative to the scroll container
        const elementRect = targetElement.getBoundingClientRect();
        const containerRect = scrollContainer.getBoundingClientRect();
        
        // Calculate the scroll position needed to center the element
        const elementTop = elementRect.top - containerRect.top + scrollContainer.scrollTop;
        const elementHeight = elementRect.height;
        const containerHeight = scrollContainer.clientHeight;
        const scrollPosition = elementTop - (containerHeight / 2) + (elementHeight / 2);
        
        // Scroll to the calculated position
        scrollContainer.scrollTo({
          top: Math.max(0, scrollPosition),
          behavior: 'smooth'
        });
        
        // Highlight the element briefly
        targetElement.style.transition = 'background-color 0.3s ease, box-shadow 0.3s ease, padding 0.3s ease';
        targetElement.style.backgroundColor = '#E8F4FD';
        targetElement.style.boxShadow = '0 0 0 4px rgba(63, 140, 255, 0.2)';
        targetElement.style.padding = '8px';
        targetElement.style.borderRadius = '8px';
        targetElement.style.margin = '-8px';
        
        setTimeout(() => {
          targetElement.style.backgroundColor = '';
          targetElement.style.boxShadow = '';
          targetElement.style.padding = '';
          targetElement.style.borderRadius = '';
          targetElement.style.margin = '';
          setTimeout(() => {
            targetElement.style.transition = '';
          }, 300);
        }, 2000);
      } else if (retryCount < maxRetries) {
        // Retry after a short delay if element not found yet
        retryCount++;
        setTimeout(scrollToActivity, 200);
      }
    };

    // Initial delay to ensure DOM is ready
    const timeoutId = setTimeout(scrollToActivity, 500);
    
    return () => clearTimeout(timeoutId);
  }, [location.hash, activityLogs]);

  // Close modal after successful claim
  useEffect(() => {
    if (wasClaiming && !claimTaskLoading && !claimTaskError && showClaimTaskModal) {
      // Claim was successful, refresh data and close modal
      setWasClaiming(false);
      if (taskId && projectId) {
        dispatch(fetchProjectDetailAction(taskId, projectId));
        // Activity logs will update automatically via real-time listener
      }
      setShowClaimTaskModal(false);
    } else if (wasClaiming && !claimTaskLoading && claimTaskError) {
      // Claim failed, reset the flag but keep modal open
      setWasClaiming(false);
    }
  }, [claimTaskLoading, claimTaskError, wasClaiming, showClaimTaskModal, taskId, projectId, dispatch]);

  const handleStatusUpdate = async (newStatus: string) => {
    if (!taskDetails || !taskId || !projectId) return;
    
    dispatch(updateTaskStatusAction(taskId, newStatus, projectId, taskDetails));
  };

  const handleLogTime = () => {
    // TODO: Implement log time functionality
    // This would typically open a modal or navigate to a time logging page
  };

  const handleOpenFileUpload = () => {
    setShowFileUploadModal(true);
  };

  const handleCloseFileUpload = () => {
    setShowFileUploadModal(false);
  };

  const handleOpenEditTask = () => {
    setShowEditTaskModal(true);
  };

  const handleCloseEditTask = () => {
    setShowEditTaskModal(false);
  };

  const handleOpenClaimTask = () => {
    setShowClaimTaskModal(true);
  };

  const handleCloseClaimTask = () => {
    setShowClaimTaskModal(false);
  };

  const handleApproveClaim = () => {
    if (taskId && projectId) {
      setWasClaiming(true);
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

  const isImageAttachment = (attachment: FileAttachment): boolean => {
    if (attachment.mimeType) {
      return attachment.mimeType.startsWith('image/');
    }
    // Fallback: check file extension
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.svg'];
    const fileName = attachment.fileName.toLowerCase();
    return imageExtensions.some(ext => fileName.endsWith(ext));
  };

  // Handle reply submission (for future API integration)
  const handleReplySubmit = (activityId: string, message: string) => {
    // TODO: Add API call to save reply
    // Example: dispatch(addReplyAction(activityId, message));
    void activityId; // Placeholder for future API call
    void message; // Placeholder for future API call
  };

  // Get current user name
  const currentUserName = projectDetailState.api.data.projectDetails?.reporter?.name || "You";
  if (loading) {
    return (
      <Box sx={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Typography>Loading task details...</Typography>
      </Box>
    );
  }

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
    <Box sx={{ height: "100%" }}>
      <Link 
        sx={{ alignItems: "center", display: "flex", cursor: "pointer" }}
        onClick={() => navigate("/app/projects")}
      >
        <SvgIcon component={LeftIcon} /> Back to Projects
      </Link>
      <Box
        sx={{
          paddingTop: "28px",
          display: "flex",
          gap: "28px",
          height: "calc(100vh - 100px)",
          minHeight: 0,
        }}
      >
        <Box
          sx={{
            width: "265px",
            background: "#FFFFFF",
            borderRadius: "24px",
            boxShadow: "0px 6px 58px rgba(196, 203, 214, 0.103611)",
            height: "100%",
            padding: "18px",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography color="secondary">
              {projectDetails?.title || "Project"}
            </Typography>
            <Box
              sx={{
                backgroundColor: "#F4F9FD",
                display: "flex",
                padding: "10px",
              }}
            >
              <SvgIcon component={FilterIcon} />
            </Box>
          </Box>
          <Box sx={{ paddingTop: "24px" }}>
            <Typography variant="h6">Description</Typography>
            <Typography color="secondary.main">
              {projectDetails?.description || "No description available"}
            </Typography>
            <Box sx={{ paddingTop: "10px" }}>
              <Typography color="secondary.main" fontSize={"16px"}>
                Reporter
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <Avatar
                  sx={{ width: "24px", height: "24px" }}
                  src={projectDetails?.reporter?.avatar || "/api/placeholder/24/24"}
                />
                <Typography>{projectDetails?.reporter?.name || "Project Owner"}</Typography>
              </Box>
            </Box>
            <Box sx={{ paddingTop: "10px" }}>
              <Typography color="secondary.main">Assignes</Typography>
              <AvatarGroup sx={{ justifyContent: "start" }} spacing="medium">
                {projectDetails?.assignes?.map((assigne: { id: string; name: string; avatar: string }) => (
                  <Avatar
                    key={assigne.id}
                    sx={{ width: "24px", height: "24px" }}
                    alt={assigne.name}
                    src={assigne.avatar || "/api/placeholder/24/24"}
                  />
                ))}
              </AvatarGroup>
            </Box>
            <Box sx={{ paddingTop: "10px" }}>
              <Typography color="secondary.main">Priority</Typography>
              <Box sx={{ display: "flex", gap: "4px" }}>
                <SvgIcon component={YellowArrow} />
                <Typography color="#FFBD21">
                  {projectDetails?.priority || "Medium"}
                </Typography>
              </Box>
            </Box>
            <Box sx={{ paddingTop: "10px" }}>
              <Typography color="secondary.main">Dead Line</Typography>
              <Typography>
                {projectDetails?.deadline ? new Date(projectDetails.deadline).toLocaleDateString() : "No deadline set"}
              </Typography>
            </Box>
            <Box
              sx={{
                paddingTop: "10px",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <SvgIcon component={CalendarIcon} />
              <Typography variant="subtitle2" color="secondary.main">
                Created May 28, 2020
              </Typography>
            </Box>
            <Box
              sx={{
                paddingTop: "15px",
                display: "flex",
                gap: "16px",
              }}
            >
              <Box
                sx={{
                  backgroundColor: "#6D5DD315",
                  padding: "10px",
                  borderRadius: "14px",
                  display: "flex",
                }}
              >
                <SvgIcon component={AttachmentIcon} />
              </Box>
              <Box
                sx={{
                  backgroundColor: "#6D5DD315",
                  padding: "10px",
                  borderRadius: "14px",
                  display: "flex",
                }}
              >
                <SvgIcon component={FilesIcon} />
              </Box>
            </Box>
          </Box>
        </Box>
        <Box sx={{ width: "100%", display: "flex", flexDirection: "column", minHeight: 0 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              pb: "24px",
              flexShrink: 0,
            }}
          >
            <Typography>Task Details</Typography>
            <Box sx={{ display: "flex", gap: "8px" }}>
              <Box
                onClick={handleOpenEditTask}
                sx={{
                  backgroundColor: "#fff",
                  display: "flex",
                  padding: "10px",
                  borderRadius: "14px",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    backgroundColor: "#f5f5f5",
                    transform: "scale(1.05)",
                  },
                }}
              >
                <SvgIcon component={EditIcon} />
              </Box>
              <Box
                sx={{
                  backgroundColor: "#fff",
                  display: "flex",
                  padding: "10px",
                  borderRadius: "14px",
                }}
              >
                <SvgIcon component={FilterIcon} />
              </Box>
            </Box>
          </Box>
          <Box
            id="project-detail-content"
            sx={{
              backgroundColor: "#fff",
              flex: 1,
              borderRadius: "24px",
              padding: "30px",
              overflowY: "auto",
              minHeight: 0,
              scrollBehavior: "smooth",
              WebkitOverflowScrolling: "touch",
            }}
          >
            <Typography color="secondary.main">{taskDetails?.code}</Typography>
            <Box
              sx={{
                paddingTop: "4px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Typography variant="h6" fontWeight={"700"}>
                {taskDetails?.subject}
              </Typography>
              <Box sx={{ display: "flex", gap: "16px", alignItems: "center" }}>
                <Chips
                  selected={currentStatus}
                  onChange={(status) => handleStatusUpdate(status)}
                />
                <Button
                  variant="contained"
                  onClick={handleOpenClaimTask}
                  sx={{
                    backgroundColor: "#3F8CFF",
                    color: "#FFFFFF",
                    borderRadius: "14px",
                    padding: "13px 20px",
                    fontWeight: 700,
                    fontSize: "16px",
                    lineHeight: 1.364,
                    boxShadow: "0px 6px 12px 0px rgba(63, 140, 255, 0.26)",
                    "&:hover": {
                      backgroundColor: "#3A81EB",
                      boxShadow: "0px 6px 12px 0px rgba(63, 140, 255, 0.42)",
                    },
                  }}
                >
                  Claim Task
                </Button>
              </Box>
            </Box>
            <Box sx={{ paddingTop: "16px" }}>
              <Typography>
                Think over UX for Login and Registration, create a flow using
                wireframes. Upon completion, show the team and discuss. Attach
                the source to the task.
              </Typography>
               <Box
               sx={{
                 paddingY: "15px",
                 display: "flex",
                 gap: "16px",
               }}
             >
               <Box
                 onClick={handleOpenFileUpload}
                 sx={{
                   backgroundColor: "#6D5DD315",
                   padding: "10px",
                   borderRadius: "14px",
                   display: "flex",
                   cursor: "pointer",
                   transition: "all 0.2s ease",
                   "&:hover": {
                     backgroundColor: "#6D5DD330",
                     transform: "scale(1.05)",
                   },
                 }}
               >
                 <SvgIcon component={AttachmentIcon} />
               </Box>
               <Box
                 onClick={handleOpenFileUpload}
                 sx={{
                   backgroundColor: "#6D5DD315",
                   padding: "10px",
                   borderRadius: "14px",
                   display: "flex",
                   cursor: "pointer",
                   transition: "all 0.2s ease",
                   "&:hover": {
                     backgroundColor: "#6D5DD330",
                     transform: "scale(1.05)",
                   },
                 }}
               >
                 <SvgIcon component={FilesIcon} />
               </Box>
             </Box>
              <Typography color="secondary.main" fontWeight={"700"}>
                Task Attachment
              </Typography>
              {loading ? (
                <Box sx={{ padding: "20px", textAlign: "center" }}>
                  <Typography>Loading attachments...</Typography>
                </Box>
              ) : fileAttachments && fileAttachments.length > 0 ? (
                <Box
                  sx={{
                    paddingTop: "8px",
                    display: "flex",
                    alignContent: "center",
                    gap: "16px",
                    flexWrap: "wrap",
                  }}
                >
                  {fileAttachments.map((attachment: FileAttachment) => {
                    const uploadDate = parseFirebaseTimestamp(attachment.uploadDate);
                    const formattedDate = uploadDate.toLocaleDateString('en-GB', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric'
                    });
                    const formattedTime = uploadDate.toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    });
                    
                    const isImage = isImageAttachment(attachment);
                    const imageUrl = attachment.fileUrl ? `http://localhost:3000${attachment.fileUrl}` : undefined;
                    
                    return (
                      <Box
                        key={attachment.fileName}
                        onClick={() => isImage && imageUrl && handleOpenImagePreview(attachment)}
                        sx={{
                          width: "156px",
                          height: "144px",
                          backgroundImage: imageUrl ? `url(${imageUrl})` : undefined,
                          backgroundPosition: "center",
                          backgroundRepeat: "no-repeat",
                          backgroundSize: "cover",
                          borderRadius: "14px",
                          backgroundColor: imageUrl ? undefined : "#F5F8FC",
                          cursor: isImage && imageUrl ? "pointer" : "default",
                          transition: "all 0.2s ease",
                          ...(isImage && imageUrl && {
                            "&:hover": {
                              transform: "scale(1.02)",
                              boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.15)",
                            },
                          }),
                        }}
                      >
                        <Box
                          sx={{
                            backgroundColor: "#2155A316",
                            width: "100%",
                            height: "100%",
                            display: "flex",
                            position: "relative",
                            borderRadius: "14px",
                          }}
                        >
                          <Box
                            sx={{
                              backgroundColor: "#F5F8FC",
                              padding: "10px",
                              borderRadius: "14px",
                              display: "flex",
                              position: "absolute",
                              margin: "5px",
                              top: 0,
                              right: 0,
                            }}
                          >
                            <SvgIcon component={AttachmentIcon} />
                          </Box>
                          <Box
                            sx={{
                              position: "absolute",
                              bottom: "1px",
                              left: 0,
                              backgroundColor: "#fff",
                              borderRadius: "12px",
                              width: "100%",
                              textAlign: "center",
                            }}
                          >
                            <Typography fontSize={"12px"} fontWeight={"700"}>
                              {attachment.originalName}
                            </Typography>
                            <Typography fontSize={"12px"} color="secondary.main">
                              {formattedDate} | {formattedTime}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    );
                  })}
                </Box>
              ) : (
                <Box sx={{ padding: "20px", textAlign: "center" }}>
                  <Typography color="secondary.main">No attachments found</Typography>
                </Box>
              )}
            </Box>
            <Box
              sx={{
                borderTop: "1px solid #E4E6E8",
                marginTop: "16px",
                paddingTop: "28px",
              }}
            >
              <Typography fontWeight={700}>Recent Activity</Typography>
              {activityLogs === undefined || (activityLogs.length === 0 && taskListLoading) ? (
                <Box sx={{ padding: "20px", textAlign: "center" }}>
                  <Typography>Loading activity logs...</Typography>
                </Box>
              ) : activityLogs && activityLogs.length > 0 ? (
                <Box>
                  {activityLogs.map((activity: ActivityLog) => {
                    const ActivityIcon = getActivityIcon(activity.type);
                    const activityDate = parseFirebaseTimestamp(activity.timestamp);
                    const formattedDate = activityDate.toLocaleDateString('en-GB', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric'
                    });
                    const formattedTime = activityDate.toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    });
                    
                    const replies = mockReplies[activity.id] || [];
                    
                    return (
                      <Box
                        key={activity.id}
                        id={`activity-${activity.id}`}
                        ref={(el: HTMLDivElement | null) => {
                          activityLogsRef.current[activity.id] = el;
                        }}
                      >
                        <ActivityLogItem
                          activity={activity}
                          activityIcon={ActivityIcon}
                          formattedDate={formattedDate}
                          formattedTime={formattedTime}
                          replies={replies}
                          currentUserName={currentUserName}
                          onReplySubmit={handleReplySubmit}
                        />
                      </Box>
                    );
                  })}
                </Box>
              ) : (
                <Box sx={{ padding: "20px", textAlign: "center" }}>
                  <Typography color="secondary.main">No recent activity</Typography>
                </Box>
              )}
            </Box>
          </Box>
        </Box>
        <TaskInfo
          reporter={projectDetails?.reporter ? { 
            name: projectDetails.reporter.name || "Unknown Reporter",
            avatar: projectDetails.reporter.avatar 
          } : undefined}
          assigned={taskDetails?.assignDetails && taskDetails.assignDetails.length > 0 ? {
            name: taskDetails.assignDetails[0].name || "Unknown Assignee"
          } : undefined}
          priority={taskDetails?.priority || "Medium"}
          deadline={taskDetails?.duration ? new Date(taskDetails.duration).toLocaleDateString() : "No deadline set"}
          timeLogged="1d 3h 25m logged"
          originalEstimate="Original Estimate 3d 8h"
          projectId={projectId}
          taskId={taskId}
          onLogTime={handleLogTime}
        />
      </Box>

      {/* File Upload Modal */}
      {showFileUploadModal && (
        <FileUploadModal
          onClose={handleCloseFileUpload}
          projectId={projectId}
          taskId={taskId}
        />
      )}

      {/* Edit Task Modal */}
      {showEditTaskModal && taskDetails && (
        <TaskFormModal
          show={showEditTaskModal}
          onClose={handleCloseEditTask}
          task={{
            id: taskDetails.id,
            subject: taskDetails.subject,
            code: taskDetails.code,
            status: taskDetails.status,
            duration: taskDetails.duration, // Pass as string, TaskForm will handle conversion
            priority: taskDetails.priority,
            assignTo: taskDetails.assignTo || [],
            projectId: taskDetails.projectId,
            createdAt: taskDetails.created || new Date(),
            updatedAt: new Date(),
          }}
          isEditMode={true}
        />
      )}

      {/* Claim Task Modal */}
      <ClaimTaskModal
        show={showClaimTaskModal}
        onClose={handleCloseClaimTask}
        onApprove={handleApproveClaim}
        onReject={handleRejectClaim}
        isLoading={claimTaskLoading}
      />

      {/* Image Preview Modal */}
      {previewImage && previewImage.fileUrl && (
        <Modal show={!!previewImage} onClose={handleCloseImagePreview}>
          <Box
            sx={{
              position: "relative",
              maxWidth: "90vw",
              maxHeight: "90vh",
              backgroundColor: "#fff",
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
              src={`http://localhost:3000${previewImage.fileUrl}`}
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
