import { Box, Typography } from "@mui/material";
import { useEffect, useRef } from "react";
import CustomCard from "../../../common/components/Card/CustomCard";
import AttachmentCard from "./AttachmentCard";
import SectionEditor from "./SectionEditor";
import { useInfoPortal } from "../../../store/hooks/useInfoPortal";
import type { PageResponse } from "../../../store/types/InfoPortal/PageResponse";

interface PageContentProps {
  page?: PageResponse;
}

const PageContent = ({ page }: PageContentProps) => {
  const { currentPage, getPageById, updatePageSections, loading } = useInfoPortal();
  const lastFetchedPageId = useRef<string | null>(null);

  useEffect(() => {
    // Only fetch if page ID exists, is different from last fetched, and different from current page
    if (page?.id && page.id !== lastFetchedPageId.current && page.id !== currentPage?.id) {
      lastFetchedPageId.current = page.id;
      getPageById(page.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page?.id, currentPage?.id]);
  
  // Reset ref when page changes to a different ID
  useEffect(() => {
    if (!page?.id) {
      lastFetchedPageId.current = null;
    }
  }, [page?.id]);

  // Handle case when page is not provided
  if (!page) {
    return (
      <CustomCard
        sx={{
          minHeight: "801px",
          padding: "0",
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: "24px", padding: "40px" }}>
          <Typography
            variant="h2"
            sx={{
              fontWeight: 700,
              fontSize: "22px",
              lineHeight: 1.364,
              color: "#0A1629",
              marginBottom: "10px",
            }}
          >
            No page selected
          </Typography>
          <Typography
            sx={{
              fontSize: "16px",
              fontWeight: 400,
              lineHeight: 1.5,
              color: "#0A1629",
              opacity: 0.7,
            }}
          >
            Select a page from the sidebar to view its content.
          </Typography>
        </Box>
      </CustomCard>
    );
  }

  // Use API data if available, otherwise show loading/empty state
  const pageContent = currentPage
    ? {
        title: currentPage.title,
        sections: currentPage.sections || [],
        attachments: currentPage.attachments || [],
      }
    : {
        title: page?.title || "Loading...",
        sections: [],
        attachments: [],
      };

  return (
    <CustomCard
      sx={{
        minHeight: "801px",
        padding: "0",
      }}
    >
      <Box sx={{ display: "flex", flexDirection: "column", gap: "24px", padding: "40px" }}>
        {/* Page Title */}
        <Typography
          variant="h2"
          sx={{
            fontWeight: 700,
            fontSize: "22px",
            lineHeight: 1.364,
            color: "#0A1629",
            marginBottom: "10px",
          }}
        >
          {pageContent.title}
        </Typography>

        {/* Sections Editor */}
        {page?.id && (
          <SectionEditor
            sections={pageContent.sections}
            onSave={(sections) => {
              if (page.id) {
                updatePageSections(
                  page.id,
                  { sections },
                  () => {
                    // Refresh page data after save
                    getPageById(page.id);
                  }
                );
              }
            }}
            loading={loading}
          />
        )}

        {/* Attachments */}
        {pageContent.attachments.length > 0 && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "8px" }}>
            <Box sx={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
              {pageContent.attachments.map((attachment) => (
                <AttachmentCard key={attachment.id} attachment={attachment} />
              ))}
            </Box>
          </Box>
        )}
      </Box>
    </CustomCard>
  );
};

export default PageContent;
