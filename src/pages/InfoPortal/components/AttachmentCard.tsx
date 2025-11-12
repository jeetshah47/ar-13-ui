import { Box, Typography } from "@mui/material";
import AttachmentIcon from "../../../assets/icons/general/attach/dark.svg?react";
import { SvgIcon } from "@mui/material";
import type { AttachmentResponse } from "../../../store/types/InfoPortal/AttachmentResponse";

interface AttachmentCardProps {
  attachment: AttachmentResponse;
}

const AttachmentCard = ({ attachment }: AttachmentCardProps) => {
  return (
    <Box
      sx={(theme) => ({
        position: "relative",
        width: "156px",
        height: "144px",
        borderRadius: "14px",
        border: `1px solid ${theme.palette.grey[300]}`,
        overflow: "hidden",
        cursor: "pointer",
      })}
    >
      {/* Image */}
      <Box
        sx={(theme) => ({
          position: "relative",
          width: "100%",
          height: "100%",
          backgroundColor: theme.palette.grey[50],
        })}
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
        sx={(theme) => ({
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: theme.palette.background.paper,
          borderRadius: "13px",
          padding: "12px",
          display: "flex",
          flexDirection: "column",
          gap: "4px",
        })}
      >
        <Typography
          sx={(theme) => ({
            fontSize: "14px",
            fontWeight: 700,
            lineHeight: 1.5,
            color: theme.palette.text.primary,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          })}
        >
          {attachment.name}
        </Typography>
        <Typography
          sx={(theme) => ({
            fontSize: "12px",
            fontWeight: 400,
            lineHeight: 1.364,
            color: theme.palette.text.secondary,
          })}
        >
          {attachment.date}
        </Typography>
      </Box>

      {/* Attachment Icon */}
      <Box
        sx={(theme) => ({
          position: "absolute",
          top: "5px",
          right: "5px",
          width: "44px",
          height: "44px",
          backgroundColor: theme.palette.grey[50],
          borderRadius: "14px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        })}
      >
        <SvgIcon
          component={AttachmentIcon}
          sx={(theme) => ({
            width: "24px",
            height: "24px",
            color: theme.palette.text.primary,
          })}
        />
      </Box>
    </Box>
  );
};

export default AttachmentCard;
