import { useEffect, useState } from "react";
import { Box, Link, Typography, SvgIcon } from "@mui/material";
import { useParams, useNavigate } from "react-router";
import PagesSidebar from "../components/PagesSidebar";
import PageContent from "../components/PageContent";
import CustomCard from "../../../common/components/Card/CustomCard";
import LeftArrowIcon from "../../../assets/icons/general/left.svg?react";
import { useInfoPortal } from "../../../store/hooks/useInfoPortal";

const FolderDetailPage = () => {
  const { folderId } = useParams<{ folderId: string }>();
  const navigate = useNavigate();
  const { currentFolder, loading, getFolderById, createPage, updatePage } = useInfoPortal();
  const [selectedPageId, setSelectedPageId] = useState<string | null>(null);

  useEffect(() => {
    if (folderId) {
      getFolderById(folderId);
    }
  }, [folderId, getFolderById]);

  // Set initial selected page when folder loads
  useEffect(() => {
    if (currentFolder?.pages && currentFolder.pages.length > 0 && !selectedPageId) {
      const activePage = currentFolder.pages.find((p) => p.isActive);
      setSelectedPageId(activePage?.id || currentFolder.pages[0].id);
    }
  }, [currentFolder, selectedPageId]);

  const handlePageClick = (pageId: string) => {
    setSelectedPageId(pageId);
    // Update page active state
    if (currentFolder?.pages) {
      const updatedPages = currentFolder.pages.map((p) => ({
        ...p,
        isActive: p.id === pageId,
      }));
      const page = updatedPages.find((p) => p.id === pageId);
      if (page) {
        updatePage(page.id, { isActive: true });
      }
    }
  };

  const handleBack = () => {
    navigate("/app/info-portal");
  };

  const handleAddPage = () => {
    // TODO: Implement add page modal
    if (folderId) {
      createPage(folderId, { title: "New Page" });
    }
  };

  if (loading || !currentFolder) {
    return (
      <Box
        sx={(theme) => ({
          width: "100%",
          height: "100%",
          backgroundColor: theme.palette.grey[50],
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        })}
      >
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  const folderData = {
    id: currentFolder.id,
    name: currentFolder.name,
    color: currentFolder.color,
    pages: currentFolder.pages || [],
  };

  return (
    <Box
      sx={(theme) => ({
        width: "100%",
        height: "100%",
        backgroundColor: theme.palette.grey[50],
        minHeight: "100vh",
      })}
    >
      {/* Back Button */}
      <Link
        sx={(theme) => ({
          alignItems: "center",
          display: "flex",
          cursor: "pointer",
          color: theme.palette.primary.main,
          textDecoration: "none",
          gap: "8px",
          marginBottom: "27px",
        })}
        onClick={handleBack}
      >
        <SvgIcon component={LeftArrowIcon} sx={{ width: "16px", height: "12px" }} />
        <Typography
          sx={{
            fontSize: "16px",
            fontWeight: 600,
            lineHeight: 1.364,
          }}
        >
          Back to Info Portal
        </Typography>
      </Link>

      {/* Folder Title */}
      <Typography
        variant="h1"
        sx={(theme) => ({
          fontWeight: 700,
          fontSize: "36px",
          lineHeight: 1.364,
          color: theme.palette.text.primary,
          marginBottom: "28px",
        })}
      >
        {folderData.name}
      </Typography>

      {/* Main Content */}
      <Box sx={{ display: "flex", gap: "30px", alignItems: "flex-start" }}>
        {/* Pages Sidebar */}
        <Box sx={{ width: "265px", flexShrink: 0 }}>
          <PagesSidebar
            pages={folderData.pages}
            folderColor={folderData.color}
            onAddPage={handleAddPage}
            onPageClick={handlePageClick}
            selectedPageId={selectedPageId || undefined}
          />
        </Box>

        {/* Page Content */}
        <Box sx={{ flex: 1 }}>
          {folderData.pages.length === 0 ? (
            <CustomCard
              sx={{
                minHeight: "801px",
                padding: "0",
              }}
            >
              <Box sx={{ display: "flex", flexDirection: "column", gap: "24px", padding: "40px" }}>
                <Typography
                  variant="h2"
                  sx={(theme) => ({
                    fontWeight: 700,
                    fontSize: "22px",
                    lineHeight: 1.364,
                    color: theme.palette.text.primary,
                    marginBottom: "10px",
                  })}
                >
                  No pages yet
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
                  Click the "+" button to add your first page to this folder.
                </Typography>
              </Box>
            </CustomCard>
          ) : selectedPageId ? (
            <PageContent
              page={folderData.pages.find((p) => p.id === selectedPageId) || folderData.pages[0]}
            />
          ) : null}
        </Box>
      </Box>
    </Box>
  );
};

export default FolderDetailPage;
