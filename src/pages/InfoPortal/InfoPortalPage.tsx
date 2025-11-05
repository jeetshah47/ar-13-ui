import { Box, Button, SvgIcon } from "@mui/material";
import { Routes, Route, useLocation } from "react-router";
import { useState, useEffect } from "react";
import PageHeader from "../../common/components/PageHeader/PageHeader";
import Banner from "./components/Banner";
import StatisticsCard from "./components/StatisticsCard";
import FolderCard from "./components/FolderCard";
import FolderDetailPage from "./pages/FolderDetailPage";
import AddFolderForm from "./components/AddFolderForm";
import Modal from "../../common/components/Modal/Modal";
import PlusIcon from "../../assets/icons/general/plus.svg?react";
import AnimatedPage from "../../common/components/AnimatedPage/AnimatedPage";
import { useInfoPortal } from "../../store/hooks/useInfoPortal";

const InfoPortalList = () => {
  const [showAddFolderModal, setShowAddFolderModal] = useState(false);
  const { folders, statistics, getFolders, createFolder, getStatistics } = useInfoPortal();

  useEffect(() => {
    getFolders();
    getStatistics();
  }, [getFolders, getStatistics]);

  const handleAddFolder = () => {
    setShowAddFolderModal(true);
  };

  const handleCloseModal = () => {
    setShowAddFolderModal(false);
  };

  const handleFolderCreated = (name: string, color: string) => {
    createFolder({ name, color }, () => {
      setShowAddFolderModal(false);
    });
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        backgroundColor: "#F4F9FD",
        minHeight: "100vh",
      }}
    >
      <PageHeader
        title="Info Portal"
        endElement={
          <Button
            variant="contained"
            onClick={handleAddFolder}
            startIcon={
              <SvgIcon
                component={PlusIcon}
                sx={{
                  width: "24px",
                  height: "24px",
                  fill: "white",
                }}
              />
            }
            sx={{
              borderRadius: "14px",
              padding: "11px 16px",
              boxShadow: "0px 6px 12px 0px rgba(63, 140, 255, 0.26)",
            }}
          >
            Add Folder
          </Button>
        }
      />

      <Box sx={{ padding: "28px 0px", display: "flex", flexDirection: "column", gap: "30px" }}>
        {/* Banner and Statistics Row */}
        <Box sx={{ display: "flex", gap: "30px" }}>
          <Box sx={{ flex: "1", maxWidth: "855px" }}>
            <Banner />
          </Box>
          <Box sx={{ width: "265px", flexShrink: 0 }}>
            <StatisticsCard
              title="Current Projects"
              value={statistics?.currentProjects || 0}
              subtitle={`Ongoing projects last month - ${statistics?.ongoingProjectsLastMonth || 0}`}
              growth={`Growth +${statistics?.growth || 0}`}
              growthColor="#0AC947"
            />
          </Box>
        </Box>

        {/* Folders Grid */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)",
              lg: "repeat(4, 1fr)",
            },
            gap: "30px",
          }}
        >
          {folders.map((folder) => (
            <FolderCard
              key={folder.id}
              id={folder.id}
              name={folder.name}
              pageCount={folder.pageCount}
              color={folder.color}
            />
          ))}
        </Box>
      </Box>

      {/* Add Folder Modal */}
      <Modal show={showAddFolderModal} onClose={handleCloseModal}>
        <Box
          onClick={(e) => e.stopPropagation()}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <AddFolderForm
            onClose={handleCloseModal}
            onAddFolder={handleFolderCreated}
          />
        </Box>
      </Modal>
    </Box>
  );
};

const InfoPortalPage = () => {
  const location = useLocation();

  return (
    <Box
      sx={{
        height: "100%",
        width: "100%",
        backgroundColor: "#F4F9FD",
      }}
    >
      <AnimatedPage>
        <Routes location={location} key={location.pathname}>
          <Route key="/folder/:folderId" element={<FolderDetailPage />} path="/folder/:folderId" />
          <Route key="/" element={<InfoPortalList />} path="/" />
        </Routes>
      </AnimatedPage>
    </Box>
  );
};

export default InfoPortalPage;
