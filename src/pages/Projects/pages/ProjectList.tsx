import {
  Box,
  Button,
  IconButton,
  Modal,
  SvgIcon,
  Typography,
} from "@mui/material";
import PageHeader from "../../../common/components/PageHeader/PageHeader";
import PlusIcon from "../../../assets/icons/general/plus.svg?react";
import ListViewIcon from "../../../assets/icons/general/list-view.svg?react";
import CardViewIcon from "../../../assets/icons/general/card-view.svg?react";
import FilterIcon from "../../../assets/icons/general/calendar-1.svg?react";
import TimeLineViewIcon from "../../../assets/icons/general/timline-view.svg?react";
import ListView from "../components/ListView";
import { useState } from "react";
import TileView from "../components/TileView";
import TimelineView from "../components/TimelineView";
import TaskForm from "../components/TaskForm";
import Filter from "../components/Filter";
import { useNavigate } from "react-router";

const ViewButtonOptions = [
  { key: "list", icon: ListViewIcon },
  { key: "tile", icon: CardViewIcon },
  { key: "time", icon: TimeLineViewIcon },
];

const ProjectList = () => {
  const [currentView, setCurrentView] = useState(ViewButtonOptions[0].key);
  const [showModal, setShowModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);

  const navigate = useNavigate();

  const AddButton = (
    <Button variant="contained" startIcon={<SvgIcon component={PlusIcon} />}>
      Add Project
    </Button>
  );

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleShowModal = () => {
    setShowModal(true);
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
            height: "100%",
          }}
        >
          <Box sx={{ padding: "20px 22px", borderBottom: "1px solid #E4E6E8" }}>
            <Typography sx={{ fontWeight: "bold" }}>
              Current Projects
            </Typography>
          </Box>
          <Box>
            <Box
              sx={{
                padding: "8px",
                borderRight: "4px solid #3F8CFF",
                borderRadius: "2px",
                background: "#F4F9FD",
              }}
            >
              <Typography color="secondary">PN0001245</Typography>
              <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                New Site Project
              </Typography>
              <Typography onClick={handleOnClickDetails} color="primary" sx={{ fontWeight: "600",cursor: "pointer" }}>
                View Details
              </Typography>
            </Box>
            <Box
              sx={{
                padding: "8px",
              }}
            >
              <Typography color="secondary">PN0001245</Typography>
              <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                New Site Project
              </Typography>
            </Box>
          </Box>
        </Box>
        <Box sx={{ width: "80%" }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box sx={{ display: "flex", gap: "6px", alignItems: "center" }}>
              <Typography sx={{ fontWeight: "bold" }}>Tasks</Typography>
              <IconButton
                size="small"
                onClick={handleShowModal}
                sx={{
                  backgroundColor: "#3F8CFF",
                  ":hover": { backgroundColor: "#3F8CFF" },
                }}
              >
                <PlusIcon />
              </IconButton>
            </Box>
            <Box sx={{ display: "flex", gap: "16px" }}>
              {ViewButtonOptions.map((option) => (
                <Box
                  key={option.key}
                  onClick={() => setCurrentView(option.key)}
                  sx={{
                    backgroundColor: "white",
                    borderRadius: "14px",
                    padding: "12px",
                    display: "flex",
                    cursor: "pointer",
                  }}
                >
                  <SvgIcon
                    component={option.icon}
                    sx={{
                      color:
                        currentView === option.key ? "primary.main" : "black",
                    }}
                  />
                </Box>
              ))}
            </Box>
            <Box
              onClick={handleShowFilterModal}
              sx={{
                background: "#FFFFFF",
                boxShadow: "0px 6px 58px rgba(196, 203, 214, 0.103611)",
                borderRadius: "14px",
                padding: "12px",
                display: "flex",
                cursor: "pointer",
              }}
            >
              <SvgIcon component={FilterIcon} />
            </Box>
          </Box>
          <Box
            sx={{
              background: "#E6EDF5",
              borderRadius: "14px",
              padding: "10px",
              textAlign: "center",
              marginTop: "12px",
            }}
          >
            <Typography sx={{ fontWeight: "bold" }}>Active Task</Typography>
          </Box>
          <Box sx={{ paddingTop: "5px" }}>
            {currentView === "list" && <ListView />}
            {currentView === "tile" && <TileView />}
            {currentView === "time" && <TimelineView />}
          </Box>
        </Box>
      </Box>
      <Modal open={showModal} onClose={handleCloseModal}>
        <TaskForm />
      </Modal>
      {showFilterModal && <Filter onClose={handleCloseFilterModal} />}
    </Box>
  );
};

export default ProjectList;
