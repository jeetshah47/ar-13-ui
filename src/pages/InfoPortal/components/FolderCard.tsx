import { Box, Typography } from "@mui/material";
import { useNavigate } from "react-router";
import CustomCard from "../../../common/components/Card/CustomCard";
import FolderIcon from "../../../assets/icons/infoportal/folder.svg";

interface FolderCardProps {
  id?: string;
  name: string;
  pageCount: number;
  color?: string;
}

const FolderCard = ({ id, name, pageCount, color = "#FFF7E3" }: FolderCardProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (id) {
      navigate(`/app/info-portal/folder/${id}`);
    }
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
          <img
            src={FolderIcon}
            alt="Folder"
            style={{
              width: "44px",
              height: "39px",
              objectFit: "contain",
            }}
          />
        </Box>

        {/* Folder Name */}
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            fontSize: "18px",
            lineHeight: 1.44,
            color: "#0A1629",
          }}
        >
          {name}
        </Typography>

        {/* Page Count */}
        <Typography
          sx={{
            fontSize: "14px",
            fontWeight: 400,
            lineHeight: 1.364,
            color: "#91929E",
          }}
        >
          {pageCount} {pageCount === 1 ? "page" : "pages"}
        </Typography>
      </Box>
    </CustomCard>
  );
};

export default FolderCard;
