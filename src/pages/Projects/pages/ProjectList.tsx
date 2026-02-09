import { Box, Button, SvgIcon, Typography, type Theme, useMediaQuery, useTheme, FormControl, Select, MenuItem, OutlinedInput, InputLabel, TextField, InputAdornment } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import SearchIcon from "@mui/icons-material/Search";
import type { SelectChangeEvent } from "@mui/material";
import Modal from "../../../common/components/Modal/Modal";
import PageHeader from "../../../common/components/PageHeader/PageHeader";
import PlusIcon from "../../../assets/icons/general/plus.svg?react";

import ListView from "../components/ListView";
import { useEffect, useState, useRef } from "react";
import TileView from "../components/TileView";
import TimelineView from "../components/TimelineView";
import TaskForm from "../components/TaskForm";
import DrawingTaskForm from "../components/DrawingTaskForm";
import Filter from "../components/Filter";
import { useNavigate } from "react-router";
import {
  useAppDispatch,
  useAppSelector,
  type RootState,
} from "../../../store/store";
import { updateSelectedProjectId } from "../../../store/features/projects/projectSlice";
import { applyProjectSearchFilterAction } from "../../../store/features/projects/projectAction";
import { ViewButtonOptions } from "../constants/project.contants";
import TaskHeader from "../components/TaskHeader";
import { getTaskListAction, getTaskStatusesAction } from "../../../store/features/task/projectAction";
import { getProjectListAction } from "../../../store/features/projects/projectAction";
import NoTaskMessage from "../components/NoTaskMessage";
import { usePermissions } from "../../../store/hooks/usePermissions";
import { setFilteredTasks } from "../../../store/features/task/taskSlice";
import type { FilterState } from "../components/Filter";
import type { TaskResponse } from "../../../store/types/Task/TaskResponse";
import type { UserResponse } from "../../../store/types/User/UserResponse";

const getActiveCardStyles = (theme: Theme) => ({
  borderLeft: `4px solid ${theme.palette.primary.main}`,
  background: theme.palette.grey[50],
  padding: { xs: "12px 16px", sm: "12px 20px" },
});

const ProjectList = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [currentView, setCurrentView] = useState(ViewButtonOptions[0].key);
  const [showModal, setShowModal] = useState(false);
  const [showDrawingModal, setShowDrawingModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showProjectSidebarDrawer, setShowProjectSidebarDrawer] = useState(false);

  const projectListState = useAppSelector(
    (state: RootState) => state.projectListReducer
  );

  // Get search query from Redux
  const projectSearchQuery = projectListState.common.searchQuery;

  // Get projects from Redux (already filtered by role and search)
  const projects = projectListState.api.data?.filteredProjects !== undefined
    ? projectListState.api.data.filteredProjects 
    : (projectListState.api.data?.projects || []);

  // Handle search query change
  const handleSearchChange = (query: string) => {
    dispatch(applyProjectSearchFilterAction(query));
  };

  const taskListState = useAppSelector(
    (state: RootState) => state.taskListReducer.api
  );

  const taskStatuses = useAppSelector(
    (state: RootState) => state.taskListReducer.api.data.taskStatuses
  );

  const dispatch = useAppDispatch();
  const lastFetchedProjectRef = useRef<string | null>(null);
  const projectsFetchedRef = useRef<boolean>(false);
  const { checkPermission, isAdmin } = usePermissions();

  const navigate = useNavigate();

  const handleAddProject = () => {
    navigate("/app/projects/add-project");
  };

  const hasProjectWritePermission = checkPermission("projects:write");

  const AddButton = (
    <Button
      variant="contained"
      startIcon={<SvgIcon component={PlusIcon} />}
      onClick={handleAddProject}
      disabled={!hasProjectWritePermission}
      size={isMobile ? "small" : "medium"}
      sx={{
        fontSize: { xs: "12px", sm: "14px" },
      }}
    >
      Add Project
    </Button>
  );

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleShowDrawingModal = () => {
    setShowDrawingModal(true);
  };

  const handleCloseDrawingModal = () => {
    setShowDrawingModal(false);
  };

  const handleCloseFilterModal = () => {
    setShowFilterModal(false);
  };

  const handleShowFilterModal = () => {
    setShowFilterModal(true);
  };

  // Function to apply filters to tasks
  const applyFilters = (filters: FilterState) => {
    const tasks = taskListState.data.tasks;
    
    // Check if any filters are actually applied
    const hasStatusFilter = filters.selectedStatuses.length > 0 && filters.selectedStatuses.length < (taskStatuses?.length || 0);
    const hasAssigneeFilter = filters.selectedAssignees.length > 0;
    const hasDateFilter = filters.dateRange.startDate !== null || filters.dateRange.endDate !== null;
    
    // If no filters are applied, show all tasks (clear filteredTasks)
    if (!hasStatusFilter && !hasAssigneeFilter && !hasDateFilter) {
      dispatch(setFilteredTasks([]));
      return;
    }
    
    const filtered = tasks.filter((task: TaskResponse) => {
      // Filter by status - compare task.status with selected status values
      if (hasStatusFilter && !filters.selectedStatuses.includes(task.status)) {
        return false;
      }

      // Filter by assignee
      if (hasAssigneeFilter) {
        const taskAssigneeIds: string[] = [];
        if (task.assignTo) {
          taskAssigneeIds.push(task.assignTo.id);
        }
        if (task.assignDetails && Array.isArray(task.assignDetails)) {
          task.assignDetails.forEach((user: UserResponse) => {
            if (!taskAssigneeIds.includes(user.id)) {
              taskAssigneeIds.push(user.id);
            }
          });
        }
        
        const hasMatchingAssignee = taskAssigneeIds.some((id) =>
          filters.selectedAssignees.includes(id)
        );
        if (!hasMatchingAssignee) {
          return false;
        }
      }

      // Filter by date range
      if (hasDateFilter) {
        if (!task.deadline) {
          return false;
        }
        const taskDate = new Date(task.deadline);
        if (filters.dateRange.startDate && taskDate < filters.dateRange.startDate) {
          return false;
        }
        if (filters.dateRange.endDate && taskDate > filters.dateRange.endDate) {
          return false;
        }
      }

      return true;
    });

    dispatch(setFilteredTasks(filtered));
  };

  const handleOnClickDetails = (projectId: string) => {
    navigate(`/app/projects/info/${projectId}`);
  };

  const handleSelectCurrentProjectId = (projectId: string) => {
    dispatch(updateSelectedProjectId(projectId));
  };

  const handleProjectSelectChange = (event: SelectChangeEvent<string>) => {
    const projectId = event.target.value;
    if (projectId) {
      handleSelectCurrentProjectId(projectId);
    }
  };

  // Auto-select first project if none is selected
  useEffect(() => {
    const selectedProjectId = projectListState.common.selectedProjectId;
    
    // If no project is selected and there are projects available, select the first one
    if (!selectedProjectId && projects.length > 0) {
      dispatch(updateSelectedProjectId(projects[0].id));
    }
  }, [dispatch, projects, projectListState.common.selectedProjectId]);

  // Fetch tasks when project changes, but prevent duplicate fetches
  useEffect(() => {
    const project_id = projectListState.common.selectedProjectId;
    
    // Only fetch if:
    // 1. Project ID exists
    // 2. Project ID changed from last fetch
    // 3. Not already loading (allow fetch if this is initial selection - lastFetchedProjectRef is null)
    if (
      project_id && 
      project_id !== lastFetchedProjectRef.current
    ) {
      // If this is the initial fetch (no previous project), always fetch
      // Otherwise, only fetch if not currently loading
      const isInitialFetch = lastFetchedProjectRef.current === null;
      if (isInitialFetch || !taskListState.loading) {
        lastFetchedProjectRef.current = project_id;
        dispatch(getTaskListAction(project_id));
        // Reset filters when project changes
        dispatch(setFilteredTasks([]));
      }
    }
    
    // Reset ref when project is cleared
    if (!project_id) {
      lastFetchedProjectRef.current = null;
      dispatch(setFilteredTasks([]));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, projectListState.common.selectedProjectId]);

  // Fetch projects on component mount
  useEffect(() => {
    // Fetch projects on mount if not already fetched
    if (!projectsFetchedRef.current && !projectListState.api.loading) {
      projectsFetchedRef.current = true;
      dispatch(getProjectListAction());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch task statuses if not already loaded
  useEffect(() => {
    if (taskStatuses.length === 0) {
      dispatch(getTaskStatusesAction());
    }
  }, [dispatch, taskStatuses.length]);

  // Force list view on mobile
  useEffect(() => {
    if (isMobile && currentView !== "list") {
      setCurrentView("list");
    }
  }, [isMobile, currentView]);

  const ProjectSidebar = (
    <Box
      sx={{
        width: { xs: "100%", sm: "100%", md: "265px", lg: "265px" },
        background: "#FFFFFF",
        borderRadius: "24px",
        boxShadow: "0px 6px 58px rgba(196, 203, 214, 0.1)",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        minHeight: 0,
        overflow: "hidden",
        cursor: "pointer",
        alignSelf: "stretch",
      }}
    >
      <Box sx={{ 
        padding: { xs: "16px", sm: "20px 22px" }, 
        borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}>
        <Typography sx={{ fontWeight: "bold", fontSize: { xs: "16px", sm: "18px" } }}>
          Current Projects
        </Typography>
        <ExpandMoreIcon sx={{ fontSize: "20px", color: "text.secondary" }} />
      </Box>
      <Box sx={{ 
        padding: { xs: "12px 16px", sm: "16px 20px" }, 
        borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
      }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Search projects..."
          value={projectSearchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ fontSize: "20px", color: "text.secondary" }} />
              </InputAdornment>
            ),
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "12px",
              backgroundColor: "background.paper",
              fontSize: { xs: "12px", sm: "14px" },
            },
          }}
        />
      </Box>
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          overflowX: "hidden",
          scrollBehavior: "smooth",
          WebkitOverflowScrolling: "touch",
          "&::-webkit-scrollbar": {
            width: "3px",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "#e1dcdc",
            borderRadius: "10px",
          },
          "&::-webkit-scrollbar-track": {
            background: "transparent",
          },
        }}
      >
        {projects.length === 0 ? (
          <Box sx={{ padding: { xs: "16px", sm: "20px" }, textAlign: "center" }}>
            <Typography
              color="secondary"
              sx={{
                fontSize: { xs: "14px", sm: "16px" },
                lineHeight: 1.6,
              }}
            >
              {projectSearchQuery.trim()
                ? "No projects found matching your search."
                : isAdmin()
                ? "No projects available. Please add a project to get started."
                : "No projects assigned to you."}
            </Typography>
          </Box>
        ) : (
          projects.map((project) => (
            <Box
              onClick={() => {
                handleSelectCurrentProjectId(project.id);
                // Close drawer on mobile/tablet when project is selected
                if (showProjectSidebarDrawer) {
                  setShowProjectSidebarDrawer(false);
                }
              }}
              key={project.id}
              sx={(theme) => ({
                ...(projectListState.common.selectedProjectId === project.id
                  ? getActiveCardStyles(theme)
                  : { 
                      padding: { xs: "12px 16px", sm: "12px 20px" },
                    }),
                // Only show border for selected project, not between unselected ones
                ...(projectListState.common.selectedProjectId === project.id && {
                  borderBottom: `1px solid ${theme.palette.divider}`,
                }),
              })}
            >
              <Typography 
                color="text.secondary" 
                sx={{ 
                  fontSize: { xs: "12px", sm: "14px" },
                  mb: "4px",
                }}
              >
                {project.title || "No title"}
              </Typography>
              <Typography 
                variant="subtitle1" 
                sx={{ 
                  fontWeight: "bold", 
                  fontSize: { xs: "14px", sm: "16px" },
                  mb: projectListState.common.selectedProjectId === project.id ? "8px" : 0,
                  color: "text.primary",
                }}
              >
                {project.code}
              </Typography>
              {projectListState.common.selectedProjectId === project.id && (
                <Typography
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOnClickDetails(project.id);
                    // Close drawer on mobile/tablet when viewing details
                    if (showProjectSidebarDrawer) {
                      setShowProjectSidebarDrawer(false);
                    }
                  }}
                  color="primary"
                  sx={{
                    fontWeight: "600",
                    cursor: "pointer",
                    width: "fit-content",
                    fontSize: { xs: "12px", sm: "14px" },
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    "&:hover": { textDecoration: "underline" },
                  }}
                >
                  View details
                  <ChevronRightIcon sx={{ fontSize: "16px" }} />
                </Typography>
              )}
            </Box>
          ))
        )}
      </Box>
    </Box>
  );

  return (
    <Box sx={{ 
      height: "100%", 
      display: "flex", 
      flexDirection: "column",
      minHeight: 0,
      overflow: "hidden",
    }}>
      <Box sx={{ flexShrink: 0 }}>
        <PageHeader title="Projects" endElement={AddButton} />
      </Box>
        <Box
        sx={{
          paddingTop: { xs: "16px", sm: "20px", md: "24px", lg: "28px" },
          display: "flex",
          gap: { xs: "16px", sm: "20px", md: "24px", lg: "28px" },
          flex: 1,
          minHeight: 0,
          alignItems: "stretch",
          flexDirection: { xs: "column", sm: "column", md: "row", lg: "row" },
          overflow: "hidden",
        }}
      >
        {/* Desktop Sidebar */}
        {!isMobile && ProjectSidebar}

        {/* Main Content Area */}
        <Box sx={{ 
          width: { xs: "100%", sm: "100%", md: "78%", lg: "80%" }, 
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minHeight: 0,
          overflow: "hidden",
        }}>
          {projects.length === 0 ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "60px 20px",
                textAlign: "center",
                height: "100%",
                minHeight: "400px",
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  fontWeight: "bold",
                  color: "text.primary",
                  marginBottom: "8px",
                }}
              >
                {isAdmin() ? "No Projects Available" : "No Projects Assigned"}
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: "text.secondary",
                  maxWidth: "500px",
                  lineHeight: 1.6,
                }}
              >
                {isAdmin()
                  ? "Get started by creating your first project. Click the 'Add Project' button above to begin."
                  : "You don't have any projects assigned to you yet. Please contact your administrator to get assigned to a project."}
              </Typography>
            </Box>
          ) : (
            <>
              {/* Mobile: Show project selector dropdown */}
              {isMobile && (
                <Box sx={{ mb: 2, flexShrink: 0 }}>
                  <FormControl fullWidth>
                    <InputLabel>Select Project</InputLabel>
                    <Select
                      value={projectListState.common.selectedProjectId || ""}
                      onChange={handleProjectSelectChange}
                      input={<OutlinedInput label="Select Project" />}
                      sx={{
                        borderRadius: "14px",
                        backgroundColor: "background.paper",
                      }}
                    >
                      {projects.map((project) => (
                        <MenuItem key={project.id} value={project.id}>
                          {project.title}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              )}
              <Box sx={{ flexShrink: 0 }}>
                <TaskHeader
                  currentViewOption={currentView}
                  onChangeViewOptions={(view) => {
                    // Prevent changing to tile/timeline on mobile
                    if (isMobile && view !== "list") return;
                    setCurrentView(view);
                  }}
                  onClickAddButton={handleShowModal}
                  onClickAddDrawing={handleShowDrawingModal}
                  onClickFilterShow={handleShowFilterModal}
                />
              </Box>
              <Box sx={{ 
                paddingTop: { xs: "12px", sm: "5px" },
                flex: 1,
                minHeight: 0,
                overflowY: "auto",
                overflowX: "hidden",
                "&::-webkit-scrollbar": {
                  width: "8px",
                },
                "&::-webkit-scrollbar-track": {
                  backgroundColor: "transparent",
                },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: "rgba(0,0,0,0.2)",
                  borderRadius: "4px",
                  "&:hover": {
                    backgroundColor: "rgba(0,0,0,0.3)",
                  },
                },
              }}>
                {projectListState.common.selectedProjectId && 
                 (!taskListState?.data?.tasks || taskListState.data.tasks.length === 0) ? (
                  <NoTaskMessage />
                ) : (
                  <>
                    {currentView === "list" && (
                      <ListView 
                        tasks={
                          taskListState?.data?.filteredTasks.length > 0
                            ? taskListState.data.filteredTasks
                            : taskListState?.data?.tasks || []
                        } 
                      />
                    )}
                    {!isMobile && currentView === "tile" && <TileView />}
                    {!isMobile && currentView === "time" && <TimelineView />}
                  </>
                )}
              </Box>
            </>
          )}
        </Box>
      </Box>
      <Modal show={showModal} onClose={handleCloseModal}>
        <Box
          onClick={(e) => e.stopPropagation()}
          sx={{
            backgroundColor: "background.paper",
            borderRadius: "24px",
            padding: "24px",
            maxWidth: "90vw",
            maxHeight: "90vh",
            overflow: "auto",
          }}
        >
          <TaskForm onClose={handleCloseModal} />
        </Box>
      </Modal>
      <Modal show={showDrawingModal} onClose={handleCloseDrawingModal}>
        <Box
          onClick={(e) => e.stopPropagation()}
          sx={{
            backgroundColor: "background.paper",
            borderRadius: "24px",
            padding: "24px",
            maxWidth: "90vw",
            maxHeight: "90vh",
            overflow: "auto",
          }}
        >
          <DrawingTaskForm onClose={handleCloseDrawingModal} />
        </Box>
      </Modal>
      {showFilterModal && (
        <Filter
          onClose={handleCloseFilterModal}
          tasks={taskListState?.data?.tasks || []}
          taskStatuses={taskStatuses || []}
          onApplyFilters={applyFilters}
        />
      )}
    </Box>
  );
};

export default ProjectList;
