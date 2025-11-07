import { Box, Button, SvgIcon, Typography, type Theme } from "@mui/material";
import Modal from "../../../common/components/Modal/Modal";
import PageHeader from "../../../common/components/PageHeader/PageHeader";
import PlusIcon from "../../../assets/icons/general/plus.svg?react";

import ListView from "../components/ListView";
import { useEffect, useState } from "react";
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
import { ViewButtonOptions } from "../constants/project.contants";
import TaskHeader from "../components/TaskHeader";
import { getTaskListAction } from "../../../store/features/task/projectAction";
import NoTaskMessage from "../components/NoTaskMessage";
import { RequirePermission } from "../../../common/components/RBAC";

const getActiveCardStyles = (theme: Theme) => ({
  borderRight: `4px solid ${theme.palette.primary.main}`,
  borderRadius: "2px",
  background: theme.palette.grey[50],
  padding: "8px",
});

const ProjectList = () => {
  const [currentView, setCurrentView] = useState(ViewButtonOptions[0].key);
  const [showModal, setShowModal] = useState(false);
  const [showDrawingModal, setShowDrawingModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);

  const projectListState = useAppSelector(
    (state: RootState) => state.projectListReducer
  );

  const taskListState = useAppSelector(
    (state: RootState) => state.taskListReducer.api
  );

  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const handleAddProject = () => {
    navigate("/app/projects/add-project");
  };

  const AddButton = (
    <RequirePermission permission="projects:write">
      <Button
        variant="contained"
        startIcon={<SvgIcon component={PlusIcon} />}
        onClick={handleAddProject}
      >
        Add Project
      </Button>
    </RequirePermission>
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

  const handleOnClickDetails = () => {
    navigate("/app/projects/details");
  };

  const handleSelectCurrentProjectId = (projectId: string) => {
    dispatch(updateSelectedProjectId(projectId));
  };

  // Auto-select first project if none is selected
  useEffect(() => {
    const projects = projectListState.api.data.projects;
    const selectedProjectId = projectListState.common.selectedProjectId;
    
    // If no project is selected and there are projects available, select the first one
    if (!selectedProjectId && projects.length > 0) {
      dispatch(updateSelectedProjectId(projects[0].id));
    }
  }, [dispatch, projectListState.api.data.projects, projectListState.common.selectedProjectId]);

  useEffect(() => {
    const project_id = projectListState.common.selectedProjectId;
    if (project_id) {
      dispatch(getTaskListAction(project_id));
    }
  }, [dispatch, projectListState.common.selectedProjectId]);

  return (
    <Box sx={{ height: "100%" }}>
      <PageHeader title="Projects" endElement={AddButton} />
      <Box
        sx={{
          paddingTop: "28px",
          display: "flex",
          gap: "28px",
          height: "100%",
        }}
      >
        <Box
          sx={(theme) => ({
            width: "15%",
            background: theme.palette.background.paper,
            borderRadius: "24px",
            boxShadow: theme.shadows[1],
            overflow: "auto",
            scrollBehavior: "smooth",
            WebkitOverflowScrolling: "touch",
            "::-webkit-scrollbar": {
              width: "3px",
            },
            "::-webkit-scrollbar-thumb": {
              background: theme.palette.mode === "dark" ? theme.palette.grey[500] : "#e1dcdc",
              borderRadius: "10px",
            },
            cursor: "pointer",
          })}
        >
          <Box sx={{ padding: "20px 22px", borderBottom: (theme) => `1px solid ${theme.palette.divider}` }}>
            <Typography sx={{ fontWeight: "bold" }}>
              Current Projects
            </Typography>
          </Box>
          <Box>
            {projectListState.api.data.projects.map((project) => (
              <Box
                onClick={() => handleSelectCurrentProjectId(project.id)}
                key={project.id}
                sx={(theme) =>
                  projectListState.common.selectedProjectId === project.id
                    ? getActiveCardStyles(theme)
                    : { padding: "8px" }
                }
              >
                <Typography color="secondary">PN0001245</Typography>
                <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                  {project.title}
                </Typography>
                <Typography
                  onClick={handleOnClickDetails}
                  color="primary"
                  sx={{
                    fontWeight: "600",
                    cursor: "pointer",
                    width: "fit-content",
                    ":hover": { textDecoration: "underline" },
                  }}
                >
                  View Details
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
        <Box sx={{ width: "80%" }}>
          <>
            <TaskHeader
              currentViewOption={currentView}
              onChangeViewOptions={(view) => setCurrentView(view)}
              onClickAddButton={handleShowModal}
              onClickAddDrawing={handleShowDrawingModal}
              onClickFilterShow={handleShowFilterModal}
            />
            <Box sx={{ paddingTop: "5px" }}>
              {projectListState.common.selectedProjectId && 
               (!taskListState?.data?.tasks || taskListState.data.tasks.length === 0) ? (
                <NoTaskMessage />
              ) : (
                <>
                  {currentView === "list" && (
                    <ListView tasks={taskListState?.data?.tasks} />
                  )}
                  {currentView === "tile" && <TileView />}
                  {currentView === "time" && <TimelineView />}
                </>
              )}
            </Box>
          </>
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
      {showFilterModal && <Filter onClose={handleCloseFilterModal} />}
    </Box>
  );
};

export default ProjectList;
