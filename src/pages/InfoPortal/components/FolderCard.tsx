import { Box, Typography } from "@mui/material";
import { useNavigate } from "react-router";
import CustomCard from "../../../common/components/Card/CustomCard";
import FolderIcon from "./FolderIcon";

// FolderCard component for displaying NAS folder information

interface FolderCardProps {
  path: string;
  name: string;
  fileCount?: number;
  color?: string;
}

const FolderCard = ({ path, name, fileCount = 0, color = "#FFF7E3" }: FolderCardProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    // Navigate to folder detail page with path as parameter
    const encodedPath = encodeURIComponent(path);
    navigate(`/app/info-portal/folder?path=${encodedPath}`);
  };

  return (
    <CustomCard>
      <Box
        onClick={handleClick}
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          cursor: "pointer",
          "&:hover": {
            opacity: 0.8,
          },
        }}
      >
        {/* Folder Icon */}
        <Box
          sx={{
            width: "44px",
            height: "44px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            backgroundColor: color,
            borderRadius: "12px",
          }}
        >
          <FolderIcon
            sx={{
              width: "44px",
              height: "39px",
              fontSize: "44px",
            }}
          />
        </Box>

        {/* Folder Name */}
        <Typography
          variant="h4"
          sx={(theme) => ({
            fontWeight: 700,
            fontSize: "18px",
            lineHeight: 1.44,
            color: theme.palette.text.primary,
          })}
        >
          {name}
        </Typography>

        {/* File Count */}
        <Typography
          sx={(theme) => ({
            fontSize: "14px",
            fontWeight: 400,
            lineHeight: 1.364,
            color: theme.palette.text.secondary,
          })}
        >
          {fileCount} {fileCount === 1 ? "item" : "items"}
        </Typography>
      </Box>
    </CustomCard>
  );
};

export default FolderCard;
