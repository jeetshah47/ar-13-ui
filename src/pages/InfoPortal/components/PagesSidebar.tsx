import { Box, Typography, Button, SvgIcon } from "@mui/material";
import CustomCard from "../../../common/components/Card/CustomCard";
import PlusIcon from "../../../assets/icons/general/plus.svg?react";
import type { PageResponse } from "../../../store/types/InfoPortal/PageResponse";

interface PagesSidebarProps {
  pages: PageResponse[];
  onAddPage: () => void;
  onPageClick?: (pageId: string) => void;
  selectedPageId?: string;
}

const PagesSidebar = ({
  pages,
  onAddPage,
  onPageClick,
  selectedPageId,
}: PagesSidebarProps) => {
  return (
    <CustomCard
      sx={{
        minHeight: "760px",
        "& .MuiCard-root": {
          padding: "0",
        },
        padding: "0",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "0px",
          position: "relative",
          padding: "24px 24px 24px 24px",
        }}
      >
        {/* Header */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <Typography
            sx={(theme) => ({
              fontSize: "16px",
              fontWeight: 700,
              lineHeight: 1.5,
              color: theme.palette.text.primary,
            })}
          >
            Pages
          </Typography>
          <Button
            variant="contained"
            onClick={onAddPage}
            sx={(theme) => ({
              minWidth: "44px",
              width: "44px",
              height: "44px",
              borderRadius: "14px",
              padding: 0,
              backgroundColor: theme.palette.primary.main,
              boxShadow: theme.shadows[4],
              "&:hover": {
                backgroundColor: theme.palette.primary.dark,
                boxShadow: theme.shadows[5],
              },
            })}
          >
            <SvgIcon
              component={PlusIcon}
              sx={{
                width: "24px",
                height: "24px",
                fill: "white",
              }}
            />
          </Button>
        </Box>

        {/* Divider */}
        <Box
          sx={(theme) => ({
            width: "100%",
            height: "1px",
            backgroundColor: theme.palette.divider,
            marginBottom: "16px",
          })}
        />

        {/* Pages List */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: "0px" }}>
          {pages.map((page) => {
            const isSelected = selectedPageId === page.id || page.isActive;
            return (
              <Box
                key={page.id}
                onClick={() => onPageClick?.(page.id)}
                sx={(theme) => ({
                  position: "relative",
                  padding: isSelected ? "12px 24px 12px 16px" : "12px 24px",
                  marginLeft: isSelected ? "-8px" : "0",
                  marginRight: isSelected ? "-8px" : "0",
                  borderRadius: isSelected ? "14px" : "0",
                  backgroundColor: isSelected ? theme.palette.grey[50] : "transparent",
                  cursor: "pointer",
                  "&:hover": {
                    backgroundColor: isSelected ? theme.palette.grey[50] : theme.palette.primary.light,
                    borderRadius: "14px",
                  },
                })}
              >
                {isSelected && (
                  <Box
                    sx={(theme) => ({
                      position: "absolute",
                      left: 0,
                      top: "50%",
                      transform: "translateY(-50%)",
                      width: "4px",
                      height: "80px",
                      backgroundColor: theme.palette.primary.main,
                      borderRadius: "2px",
                    })}
                  />
                )}
                <Typography
                  sx={(theme) => ({
                    fontSize: "16px",
                    fontWeight: 700,
                    lineHeight: 1.5,
                    color: theme.palette.text.primary,
                    marginBottom: "4px",
                  })}
                >
                  {page.title}
                </Typography>
                <Typography
                  sx={(theme) => ({
                    fontSize: "14px",
                    fontWeight: 400,
                    lineHeight: 1.364,
                    color: theme.palette.text.secondary,
                  })}
                >
                  Last modified {page.lastModified}
                </Typography>
              </Box>
            );
          })}
        </Box>
      </Box>
    </CustomCard>
  );
};

export default PagesSidebar;
