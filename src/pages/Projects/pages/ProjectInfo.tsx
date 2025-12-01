import { Box, Link, SvgIcon, Typography, useMediaQuery, useTheme, CircularProgress, TextField, Button, Tabs, Tab } from "@mui/material";
import LeftIcon from "../../../assets/icons/general/left.svg?react";
import { useEffect, useMemo, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router";
import { useAppDispatch, useAppSelector, type RootState } from "../../../store/store";
import { getTaskListAction } from "../../../store/features/task/projectAction";
import { getUsersAction } from "../../../store/features/user/userAction";
import { fetchProjectInfoAction } from "../../../store/features/projects/projectDetailAction";
import { updateAgencyContactAction, archiveProjectAction } from "../../../store/features/projects/projectAction";
import { getSingleProjectStatisticsAction } from "../../../store/features/projects/projectStatisticsAction";
import { fetchActivityLogsByEntity } from "../../../store/features/activityLogs/activityLogsAction";
import { usePermissions } from "../../../store/hooks/usePermissions";
import ProjectInfoSidebar from "../components/ProjectInfoSidebar";
import ListView from "../components/ListView";
import NoTaskMessage from "../components/NoTaskMessage";
import ProjectStatsView from "../components/ProjectStatsView";
import ProjectActivityLogsView from "../components/ProjectActivityLogsView";
import ProjectFilesView from "../components/ProjectFilesView";
import Modal from "../../../common/components/Modal/Modal";
import type { AgencyContact } from "../../../store/types/Project/ProjectRequest";
import { useFormik } from "formik";
import * as Yup from "yup";

// Validation schema for agency contact form
const agencyContactValidationSchema = Yup.object({
  contact_name: Yup.string()
    .trim()
    .required("Contact name is required")
    .min(1, "Contact name cannot be empty"),
  contact_agency_type: Yup.string()
    .trim()
    .required("Agency type is required")
    .min(1, "Agency type cannot be empty"),
  phone_number: Yup.string()
    .trim()
    .optional(),
  firm_name: Yup.string()
    .trim()
    .optional(),
});

const ProjectInfo = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isAdmin } = usePermissions();
  const [showAgencyContactModal, setShowAgencyContactModal] = useState(false);
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const fetchedStatsProjectIdRef = useRef<string | null>(null);
  const fetchedActivityLogsProjectIdRef = useRef<string | null>(null);

  const taskListState = useAppSelector(
    (state: RootState) => state.taskListReducer.api
  );

  const userState = useAppSelector(
    (state: RootState) => state.userReducer
  );

  const projectDetailState = useAppSelector(
    (state: RootState) => state.projectDetailReducer
  );

  const projectStatisticsState = useAppSelector(
    (state: RootState) => state.projectStatisticsReducer.singleProject
  );

  const activityLogsState = useAppSelector(
    (state: RootState) => state.activityLogsReducer.api
  );

  const { users } = userState;
  const tasks = taskListState?.data?.tasks || [];
  const loading = taskListState?.loading || false;

  const { projectDetails } = projectDetailState.api.data;
  const { loading: projectLoading, error: projectError } = projectDetailState.api;

  // Fetch users if not already loaded
  useEffect(() => {
    if (users.length === 0 && !userState.loading) {
      dispatch(getUsersAction());
    }
  }, [dispatch, users.length, userState.loading]);

  // Fetch project details using Redux action
  useEffect(() => {
    if (projectId) {
      dispatch(fetchProjectInfoAction(projectId));
    }
  }, [dispatch, projectId]);

  // Redirect to project list if project is archived
  useEffect(() => {
    if (!projectLoading && projectDetails) {
      const isArchived = (projectDetails as typeof projectDetails & { isArchived?: boolean })?.isArchived;
      if (isArchived) {
        navigate("/app/projects");
      }
    }
  }, [projectDetails, projectLoading, navigate]);

  // Fetch tasks for the project
  useEffect(() => {
    if (projectId) {
      dispatch(getTaskListAction(projectId));
    }
  }, [dispatch, projectId]);

  // Fetch project statistics when Stats tab is active
  useEffect(() => {
    if (
      projectId && 
      activeTab === 1 && 
      !projectStatisticsState.loading && 
      !projectStatisticsState.data &&
      fetchedStatsProjectIdRef.current !== projectId
    ) {
      fetchedStatsProjectIdRef.current = projectId;
      dispatch(getSingleProjectStatisticsAction(projectId));
    }
  }, [dispatch, projectId, activeTab, projectStatisticsState.loading, projectStatisticsState.data]);

  // Reset stats ref when project changes
  useEffect(() => {
    if (fetchedStatsProjectIdRef.current !== projectId) {
      fetchedStatsProjectIdRef.current = null;
    }
  }, [projectId]);

  // Fetch activity logs when Activity Logs tab is active
  useEffect(() => {
    if (
      projectId && 
      activeTab === 2 && 
      !activityLogsState.loading &&
      fetchedActivityLogsProjectIdRef.current !== projectId
    ) {
      fetchedActivityLogsProjectIdRef.current = projectId;
      dispatch(fetchActivityLogsByEntity("project", projectId));
    }
  }, [dispatch, projectId, activeTab, activityLogsState.loading]);

  // Reset activity logs ref when project changes
  useEffect(() => {
    if (fetchedActivityLogsProjectIdRef.current !== projectId) {
      fetchedActivityLogsProjectIdRef.current = null;
    }
  }, [projectId]);

  // Map membersIds to assignes format for ProjectInfoSidebar
  const assignes = useMemo(() => {
    if (!projectDetails?.membersIds || !users.length) return undefined;
    
    return projectDetails.membersIds
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
  }, [projectDetails?.membersIds, users]);

  // Get reporter/owner info
  const reporter = useMemo(() => {
    if (!projectDetails?.ownerId || !users.length) return undefined;
    
    const ownerUser = users.find((u) => u.id === projectDetails.ownerId);
    if (!ownerUser) return undefined;
    
    return {
      name: ownerUser.name || "Project Owner",
      avatar: "/api/placeholder/24/24",
    };
  }, [projectDetails?.ownerId, users]);

  // Formik form for agency contact - must be before early returns
  const formik = useFormik({
    initialValues: {
      contact_name: (projectDetails as typeof projectDetails & { agencyContact?: AgencyContact })?.agencyContact?.contact_name || "",
      contact_agency_type: (projectDetails as typeof projectDetails & { agencyContact?: AgencyContact })?.agencyContact?.contact_agency_type || "",
      phone_number: (projectDetails as typeof projectDetails & { agencyContact?: AgencyContact })?.agencyContact?.phone_number || "",
      firm_name: (projectDetails as typeof projectDetails & { agencyContact?: AgencyContact })?.agencyContact?.firm_name || "",
    },
    validationSchema: agencyContactValidationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      if (!projectId || !projectDetails) return;

      const agencyContact = {
        contact_name: values.contact_name,
        contact_agency_type: values.contact_agency_type,
        phone_number: values.phone_number,
        firm_name: values.firm_name,
      };

      dispatch(
        updateAgencyContactAction(projectId, agencyContact, () => {
          setShowAgencyContactModal(false);
          formik.resetForm();
          // Refresh project details
          if (projectId) {
            dispatch(fetchProjectInfoAction(projectId));
          }
        })
      );
    },
  });

  const handleEditClick = () => {
    if (projectId && projectDetails) {
      // Navigate to AddProject with project data in state
      navigate("/app/projects/add", {
        state: {
          project: projectDetails,
          isEditMode: true,
        },
      });
    }
  };

  const handleOpenAgencyContactModal = () => {
    setShowAgencyContactModal(true);
  };

  const handleCloseAgencyContactModal = () => {
    setShowAgencyContactModal(false);
    formik.resetForm();
  };

  const handleOpenArchiveModal = () => {
    setShowArchiveModal(true);
  };

  const handleCloseArchiveModal = () => {
    setShowArchiveModal(false);
  };

  const handleConfirmArchive = () => {
    if (!projectId || !projectDetails) return;
    
    const isArchived = !(projectDetails as typeof projectDetails & { isArchived?: boolean })?.isArchived;
    
    dispatch(
      archiveProjectAction(projectId, isArchived, () => {
        setShowArchiveModal(false);
        // If archiving (not unarchiving), navigate to project list
        if (isArchived) {
          navigate("/app/projects");
        } else {
          // If unarchiving, refresh project details
          if (projectId) {
            dispatch(fetchProjectInfoAction(projectId));
          }
        }
      })
    );
  };

  // Loading state
  if (projectLoading) {
    return (
      <Box sx={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  // Error state - only show if not loading and there's an error or no project details
  if (!projectLoading && (projectError || !projectDetails)) {
    return (
      <Box sx={{ height: "100%" }}>
        <Link
          sx={{ alignItems: "center", display: "flex", cursor: "pointer" }}
          onClick={() => navigate("/app/projects")}
        >
          <SvgIcon component={LeftIcon} /> Back to Projects
        </Link>
        <Box sx={{ paddingTop: "28px", textAlign: "center" }}>
          <Typography color="error">{projectError || "Project not found"}</Typography>
        </Box>
      </Box>
    );
  }

  // If no project details after loading, return null (should be caught by error state above)
  if (!projectDetails) {
    return null;
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
            projectTitle={projectDetails.title}
            projectDescription={projectDetails.description}
            projectCode={projectDetails.code}
            productionDuration={projectDetails.productionDuration}
            siteDuration={projectDetails.siteDuration}
            reporter={reporter}
            assignes={assignes}
            priority={projectDetails.priority}
            deadline={projectDetails.deadline || projectDetails.deadLine}
            timeSpent={undefined}
            agencyContact={(projectDetails as typeof projectDetails & { agencyContact?: AgencyContact })?.agencyContact}
            created={projectDetails.created}
            updated={projectDetails.updated}
            isArchived={(projectDetails as typeof projectDetails & { isArchived?: boolean })?.isArchived}
            onEditClick={handleEditClick}
            onAddAgencyContact={handleOpenAgencyContactModal}
            onArchiveClick={handleOpenArchiveModal}
            showArchiveButton={isAdmin()}
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
                projectTitle={projectDetails.title}
                projectDescription={projectDetails.description}
                projectCode={projectDetails.code}
                productionDuration={projectDetails.productionDuration}
                siteDuration={projectDetails.siteDuration}
                reporter={reporter}
                assignes={assignes}
                priority={projectDetails.priority}
                deadline={projectDetails.deadline || projectDetails.deadLine}
                timeSpent={undefined}
                agencyContact={(projectDetails as typeof projectDetails & { agencyContact?: AgencyContact })?.agencyContact}
                created={projectDetails.created}
                updated={projectDetails.updated}
                isArchived={(projectDetails as typeof projectDetails & { isArchived?: boolean })?.isArchived}
                onEditClick={handleEditClick}
                onAddAgencyContact={handleOpenAgencyContactModal}
                onArchiveClick={handleOpenArchiveModal}
                showArchiveButton={isAdmin()}
              />
            </Box>
          )}

          {/* Tabs Section */}
          <Box sx={{ mb: { xs: "10px", sm: 0 } }}>
            <Tabs 
              value={activeTab} 
              onChange={(_, newValue) => setActiveTab(newValue)}
              sx={{ 
                borderBottom: 1, 
                borderColor: "divider",
                mb: 2
              }}
            >
              <Tab label="Tasks" />
              <Tab label="Stats" />
              <Tab label="Activity Logs" />
              <Tab label="Files" />
            </Tabs>

            {/* Tasks Tab */}
            {activeTab === 0 && (
              <Box sx={{ paddingTop: { xs: "12px", sm: "5px" } }}>
                {loading ? (
                  <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "200px" }}>
                    <CircularProgress />
                  </Box>
                ) : tasks.length === 0 ? (
                  <NoTaskMessage />
                ) : (
                  <ListView tasks={tasks} />
                )}
              </Box>
            )}

            {/* Stats Tab */}
            {activeTab === 1 && (
              <Box sx={{ paddingTop: { xs: "12px", sm: "5px" } }}>
                {projectStatisticsState.loading ? (
                  <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "200px" }}>
                    <CircularProgress />
                  </Box>
                ) : projectStatisticsState.error ? (
                  <Box sx={{ padding: "20px", textAlign: "center" }}>
                    <Typography color="error">{projectStatisticsState.error}</Typography>
                  </Box>
                ) : projectStatisticsState.data ? (
                  <ProjectStatsView statistics={projectStatisticsState.data} users={users} />
                ) : (
                  <Box sx={{ padding: "20px", textAlign: "center" }}>
                    <Typography color="secondary">No statistics available</Typography>
                  </Box>
                )}
              </Box>
            )}

            {/* Activity Logs Tab */}
            {activeTab === 2 && (
              <Box sx={{ paddingTop: { xs: "12px", sm: "5px" } }}>
                {activityLogsState.loading ? (
                  <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "200px" }}>
                    <CircularProgress />
                  </Box>
                ) : activityLogsState.error ? (
                  <Box sx={{ padding: "20px", textAlign: "center" }}>
                    <Typography color="error">{activityLogsState.error}</Typography>
                  </Box>
                ) : activityLogsState.data.items.length === 0 ? (
                  <Box sx={{ padding: "20px", textAlign: "center" }}>
                    <Typography color="secondary">No activity logs available</Typography>
                  </Box>
                ) : (
                  <ProjectActivityLogsView 
                    activityLogs={activityLogsState.data.items} 
                    users={users}
                  />
                )}
              </Box>
            )}

            {/* Files Tab */}
            {activeTab === 3 && (
              <Box sx={{ paddingTop: { xs: "12px", sm: "5px" } }}>
                {projectDetails.code ? (
                  <ProjectFilesView projectCode={projectDetails.code} />
                ) : (
                  <Box sx={{ padding: "20px", textAlign: "center" }}>
                    <Typography color="secondary">
                      No project code available. Project code is required to access files.
                    </Typography>
                  </Box>
                )}
              </Box>
            )}
          </Box>
        </Box>
      </Box>

      {/* Agency Contact Modal */}
      <Modal show={showAgencyContactModal} onClose={handleCloseAgencyContactModal}>
        <Box
          sx={{
            backgroundColor: "white",
            borderRadius: "24px",
            padding: { xs: "20px", sm: "24px", md: "28px" },
            width: { xs: "90%", sm: "500px", md: "600px" },
            maxWidth: "90vw",
            maxHeight: "90vh",
            overflow: "auto",
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: "bold", mb: 3 }}>
            {formik.values.contact_name ? "Edit Agency Contact" : "Add Agency Contact"}
          </Typography>
          <form onSubmit={formik.handleSubmit}>
            <TextField
              fullWidth
              label="Contact Name"
              name="contact_name"
              value={formik.values.contact_name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.contact_name && Boolean(formik.errors.contact_name)}
              helperText={formik.touched.contact_name && formik.errors.contact_name}
              sx={{ mb: 2 }}
              required
            />
            <TextField
              fullWidth
              label="Agency Type"
              name="contact_agency_type"
              value={formik.values.contact_agency_type}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.contact_agency_type && Boolean(formik.errors.contact_agency_type)}
              helperText={formik.touched.contact_agency_type && formik.errors.contact_agency_type}
              sx={{ mb: 2 }}
              required
            />
            <TextField
              fullWidth
              label="Phone Number"
              name="phone_number"
              value={formik.values.phone_number}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.phone_number && Boolean(formik.errors.phone_number)}
              helperText={formik.touched.phone_number && formik.errors.phone_number}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Firm Name"
              name="firm_name"
              value={formik.values.firm_name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.firm_name && Boolean(formik.errors.firm_name)}
              helperText={formik.touched.firm_name && formik.errors.firm_name}
              sx={{ mb: 3 }}
            />
            <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
              <Button
                variant="outlined"
                onClick={handleCloseAgencyContactModal}
                sx={{
                  borderRadius: "14px",
                  textTransform: "none",
                  px: 3,
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={formik.isSubmitting}
                sx={{
                  borderRadius: "14px",
                  textTransform: "none",
                  px: 3,
                }}
              >
                {formik.isSubmitting ? "Saving..." : "Save"}
              </Button>
            </Box>
          </form>
        </Box>
      </Modal>

      {/* Archive Confirmation Modal */}
      <Modal show={showArchiveModal} onClose={handleCloseArchiveModal}>
        <Box
          sx={{
            backgroundColor: "white",
            borderRadius: "24px",
            padding: { xs: "20px", sm: "24px", md: "28px" },
            width: { xs: "90%", sm: "500px", md: "500px" },
            maxWidth: "90vw",
            maxHeight: "90vh",
            overflow: "auto",
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
            {(projectDetails as typeof projectDetails & { isArchived?: boolean })?.isArchived
              ? "Unarchive Project"
              : "Archive Project"}
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, color: "text.secondary" }}>
            {(projectDetails as typeof projectDetails & { isArchived?: boolean })?.isArchived
              ? "Are you sure you want to unarchive this project? It will become visible in project lists again."
              : "Are you sure you want to archive this project? Archived projects will be hidden from project lists and are typically used for projects that are no longer active or have passed their deadline."}
          </Typography>
          {projectDetails && (
            <Box
              sx={{
                backgroundColor: "#F4F9FD",
                borderRadius: "12px",
                padding: "12px",
                mb: 3,
              }}
            >
              <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                Project:
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {projectDetails.title}
              </Typography>
            </Box>
          )}
          <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
            <Button
              variant="outlined"
              onClick={handleCloseArchiveModal}
              sx={{
                borderRadius: "14px",
                textTransform: "none",
                px: 3,
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color={(projectDetails as typeof projectDetails & { isArchived?: boolean })?.isArchived ? "success" : "warning"}
              onClick={handleConfirmArchive}
              sx={{
                borderRadius: "14px",
                textTransform: "none",
                px: 3,
              }}
            >
              {(projectDetails as typeof projectDetails & { isArchived?: boolean })?.isArchived
                ? "Unarchive"
                : "Archive"}
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default ProjectInfo;

