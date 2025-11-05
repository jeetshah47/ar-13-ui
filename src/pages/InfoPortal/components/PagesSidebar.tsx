import { Box, Typography, Button, SvgIcon } from "@mui/material";
import CustomCard from "../../../common/components/Card/CustomCard";
import PlusIcon from "../../../assets/icons/general/plus.svg?react";

interface Page {
  id: string;
  title: string;
  lastModified: string;
  isActive: boolean;
}

interface PagesSidebarProps {
  pages: Page[];
  folderColor: string;
  onAddPage: () => void;
  onPageClick?: (pageId: string) => void;
  selectedPageId?: string;
}

const PagesSidebar = ({
  pages,
  folderColor,
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
            sx={{
              fontSize: "16px",
              fontWeight: 700,
              lineHeight: 1.5,
              color: "#0A1629",
            }}
          >
            Pages
          </Typography>
          <Button
            variant="contained"
            onClick={onAddPage}
            sx={{
              minWidth: "44px",
              width: "44px",
              height: "44px",
              borderRadius: "14px",
              padding: 0,
              backgroundColor: "#3F8CFF",
              boxShadow: "0px 6px 12px 0px rgba(63, 140, 255, 0.26)",
              "&:hover": {
                backgroundColor: "#3A81EB",
                boxShadow: "0px 6px 12px 0px rgba(63, 140, 255, 0.42)",
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
          </Button>
        </Box>

        {/* Divider */}
        <Box
          sx={{
            width: "100%",
            height: "1px",
            backgroundColor: "#E4E6E8",
            marginBottom: "16px",
          }}
        />

        {/* Pages List */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: "0px" }}>
          {pages.map((page, index) => {
            const isSelected = selectedPageId === page.id || page.isActive;
            return (
              <Box
                key={page.id}
                onClick={() => onPageClick?.(page.id)}
                sx={{
                  position: "relative",
                  padding: isSelected ? "12px 24px 12px 16px" : "12px 24px",
                  marginLeft: isSelected ? "-8px" : "0",
                  marginRight: isSelected ? "-8px" : "0",
                  borderRadius: isSelected ? "14px" : "0",
                  backgroundColor: isSelected ? "#F4F9FD" : "transparent",
                  cursor: "pointer",
                  "&:hover": {
                    backgroundColor: isSelected ? "#F4F9FD" : "rgba(63, 140, 255, 0.04)",
                    borderRadius: "14px",
                  },
                }}
              >
                {isSelected && (
                  <Box
                    sx={{
                      position: "absolute",
                      left: 0,
                      top: "50%",
                      transform: "translateY(-50%)",
                      width: "4px",
                      height: "80px",
                      backgroundColor: "#3F8CFF",
                      borderRadius: "2px",
                    }}
                  />
                )}
                <Typography
                  sx={{
                    fontSize: "16px",
                    fontWeight: 700,
                    lineHeight: 1.5,
                    color: "#0A1629",
                    marginBottom: "4px",
                  }}
                >
                  {page.title}
                </Typography>
                <Typography
                  sx={{
                    fontSize: "14px",
                    fontWeight: 400,
                    lineHeight: 1.364,
                    color: "#91929E",
                  }}
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
