import { Box, Button, SvgIcon, Fab, Typography, CircularProgress } from "@mui/material";
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
import { RequirePermission } from "../../common/components/RBAC/RequirePermission";
import CustomCard from "../../common/components/Card/CustomCard";

const InfoPortalList = () => {
  const [showAddFolderModal, setShowAddFolderModal] = useState(false);
  const { folders, statistics, loading, getFolders, createFolder, getStatistics } = useInfoPortal();

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

  const AddButton = (
    <RequirePermission permission="infoPortal:write">
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
        sx={(theme) => ({
          borderRadius: "14px",
          padding: "11px 16px",
          boxShadow: theme.shadows[4],
          display: { xs: "none", sm: "flex" },
        })}
      >
        Add Folder
      </Button>
    </RequirePermission>
  );

  const FloatingActionButton = (
    <RequirePermission permission="infoPortal:write">
      <Fab
        onClick={handleAddFolder}
        color="primary"
        sx={{
          position: "fixed",
          bottom: { xs: "24px", sm: "32px" },
          right: { xs: "20px", sm: "32px" },
          display: { xs: "flex", sm: "none" },
          zIndex: (theme) => theme.zIndex.speedDial,
          width: "56px",
          height: "56px",
          boxShadow: "0px 6px 12px 0px rgba(63, 140, 255, 0.26)",
          "&:hover": {
            boxShadow: "0px 8px 16px 0px rgba(63, 140, 255, 0.35)",
          },
        }}
      >
        <SvgIcon
          component={PlusIcon}
          sx={{
            width: "24px",
            height: "24px",
            fill: "white",
          }}
        />
      </Fab>
    </RequirePermission>
  );

  return (
    <Box
      sx={(theme) => ({
        width: "100%",
        height: "100%",
        backgroundColor: theme.palette.grey[50],
        minHeight: "100vh",
        paddingBottom: { xs: "100px", sm: 0 }, // Add bottom padding on mobile for FAB
      })}
    >
      <PageHeader
        title="Info Portal"
        endElement={AddButton}
      />

      <Box
        sx={{
          padding: { xs: "10px", sm: "20px", md: "24px 0px", lg: "28px 0px" },
          display: "flex",
          flexDirection: "column",
          gap: { xs: "20px", sm: "24px", md: "28px", lg: "30px" },
        }}
      >
        {/* Banner and Statistics Row */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "column", md: "row", lg: "row" },
            gap: { xs: "20px", sm: "24px", md: "24px", lg: "30px" },
          }}
        >
          <Box sx={{ flex: { xs: "1", sm: "1", md: "1", lg: "1" }, maxWidth: { xs: "100%", sm: "100%", md: "855px", lg: "855px" } }}>
            <Banner />
          </Box>
          <Box
            sx={{
              width: { xs: "100%", sm: "100%", md: "280px", lg: "265px" },
              flexShrink: 0,
            }}
          >
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
        {loading ? (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "200px",
            }}
          >
            <CircularProgress />
          </Box>
        ) : folders.length === 0 ? (
          <CustomCard>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: "16px",
                padding: "40px",
                alignItems: "center",
                textAlign: "center",
              }}
            >
              <Typography
                variant="h2"
                sx={(theme) => ({
                  fontWeight: 700,
                  fontSize: "22px",
                  lineHeight: 1.364,
                  color: theme.palette.text.primary,
                })}
              >
                No folders yet
              </Typography>
              <Typography
                sx={(theme) => ({
                  fontSize: "16px",
                  fontWeight: 400,
                  lineHeight: 1.5,
                  color: theme.palette.text.primary,
                  opacity: 0.7,
                })}
              >
                Click the "+" button to create your first folder.
              </Typography>
            </Box>
          </CustomCard>
        ) : (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                md: "repeat(3, 1fr)",
                lg: "repeat(4, 1fr)",
              },
              gap: { xs: "20px", sm: "30px" },
              paddingX: { xs: 0, sm: 0 },
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
        )}
      </Box>

      {FloatingActionButton}

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
      sx={(theme) => ({
        height: "100%",
        width: "100%",
        backgroundColor: theme.palette.grey[50],
      })}
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
