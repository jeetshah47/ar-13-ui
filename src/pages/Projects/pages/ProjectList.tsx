import { Box, Button, Modal, SvgIcon, Typography } from "@mui/material";
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

const activeCardStyles = {
  borderRight: "4px solid #3F8CFF",
  borderRadius: "2px",
  background: "#F4F9FD",
  padding: "8px",
};

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
          sx={{
            width: "15%",
            background: "#FFFFFF",
            borderRadius: "24px",
            boxShadow: "0px 6px 58px rgba(196, 203, 214, 0.103611)",
            overflow: "scroll",
            "::-webkit-scrollbar": {
              width: "3px",
            },
            "::-webkit-scrollbar-thumb": {
              background: "#e1dcdc",
              borderRadius: "10px",
            },
            cursor: "pointer",
          }}
        >
          <Box sx={{ padding: "20px 22px", borderBottom: "1px solid #E4E6E8" }}>
            <Typography sx={{ fontWeight: "bold" }}>
              Current Projects
            </Typography>
          </Box>
          <Box>
            {projectListState.api.data.projects.map((project) => (
              <Box
                onClick={() => handleSelectCurrentProjectId(project.id)}
                key={project.id}
                sx={
                  projectListState.common.selectedProjectId === project.id
                    ? activeCardStyles
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
      <Modal open={showModal} onClose={handleCloseModal}>
        <TaskForm onClose={handleCloseModal} />
      </Modal>
      <Modal open={showDrawingModal} onClose={handleCloseDrawingModal}>
        <DrawingTaskForm onClose={handleCloseDrawingModal} />
      </Modal>
      {showFilterModal && <Filter onClose={handleCloseFilterModal} />}
    </Box>
  );
};

export default ProjectList;
