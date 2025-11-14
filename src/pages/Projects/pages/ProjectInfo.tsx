import { Box, Link, SvgIcon, Typography, useMediaQuery, useTheme, CircularProgress } from "@mui/material";
import LeftIcon from "../../../assets/icons/general/left.svg?react";
import { useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router";
import { useAppDispatch, useAppSelector, type RootState } from "../../../store/store";
import { getTaskListAction } from "../../../store/features/task/projectAction";
import { getUsersAction } from "../../../store/features/user/userAction";
import { fetchProjectInfoAction } from "../../../store/features/projects/projectDetailAction";
import ProjectInfoSidebar from "../components/ProjectInfoSidebar";
import ListView from "../components/ListView";
import NoTaskMessage from "../components/NoTaskMessage";

const ProjectInfo = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const taskListState = useAppSelector(
    (state: RootState) => state.taskListReducer.api
  );

  const userState = useAppSelector(
    (state: RootState) => state.userReducer
  );

  const projectDetailState = useAppSelector(
    (state: RootState) => state.projectDetailReducer
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

  // Fetch tasks for the project
  useEffect(() => {
    if (projectId) {
      dispatch(getTaskListAction(projectId));
    }
  }, [dispatch, projectId]);

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
            reporter={reporter}
            assignes={assignes}
            priority={projectDetails.priority}
            deadline={projectDetails.deadline || projectDetails.deadLine}
            timeSpent={undefined}
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
                reporter={reporter}
                assignes={assignes}
                priority={projectDetails.priority}
                deadline={projectDetails.deadline || projectDetails.deadLine}
                timeSpent={undefined}
              />
            </Box>
          )}

          {/* Task List Section */}
          <Box sx={{ mb: { xs: "10px", sm: 0 } }}>
            <Typography 
              variant="h5" 
              sx={{ 
                fontWeight: "bold", 
                mb: 2,
                fontSize: { xs: "18px", sm: "20px", md: "24px" }
              }}
            >
              Tasks
            </Typography>
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
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ProjectInfo;

