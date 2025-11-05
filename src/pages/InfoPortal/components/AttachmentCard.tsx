import { Box, Typography } from "@mui/material";
import AttachmentIcon from "../../../assets/icons/general/attach/dark.svg?react";
import { SvgIcon } from "@mui/material";

interface Attachment {
  id: string;
  name: string;
  date: string;
  imageUrl: string;
}

interface AttachmentCardProps {
  attachment: Attachment;
}

const AttachmentCard = ({ attachment }: AttachmentCardProps) => {
  return (
    <Box
      sx={{
        position: "relative",
        width: "156px",
        height: "144px",
        borderRadius: "14px",
        border: "1px solid #D8DDE5",
        overflow: "hidden",
        cursor: "pointer",
      }}
    >
      {/* Image */}
      <Box
        sx={{
          position: "relative",
          width: "100%",
          height: "100%",
          backgroundColor: "#F5F8FC",
        }}
      >
        <img
          src={attachment.imageUrl}
          alt={attachment.name}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
        {/* Overlay */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(33, 85, 163, 0.16)",
          }}
        />
      </Box>

      {/* Info Card */}
      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: "white",
          borderRadius: "13px",
          padding: "12px",
          display: "flex",
          flexDirection: "column",
          gap: "4px",
        }}
      >
        <Typography
          sx={{
            fontSize: "14px",
            fontWeight: 700,
            lineHeight: 1.5,
            color: "#0A1629",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {attachment.name}
        </Typography>
        <Typography
          sx={{
            fontSize: "12px",
            fontWeight: 400,
            lineHeight: 1.364,
            color: "#91929E",
          }}
        >
          {attachment.date}
        </Typography>
      </Box>

      {/* Attachment Icon */}
      <Box
        sx={{
          position: "absolute",
          top: "5px",
          right: "5px",
          width: "44px",
          height: "44px",
          backgroundColor: "#F5F8FC",
          borderRadius: "14px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <SvgIcon
          component={AttachmentIcon}
          sx={{
            width: "24px",
            height: "24px",
            color: "#0A1629",
          }}
        />
      </Box>
    </Box>
  );
};

export default AttachmentCard;
