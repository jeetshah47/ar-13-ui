import { Box, SvgIcon, Typography, useMediaQuery, useTheme } from "@mui/material";
import AttachmentIcon from "../../../assets/icons/general/calendar-19.svg?react";
import FilesIcon from "../../../assets/icons/general/calendar-20.svg?react";
import type { FileAttachment } from "../../../store/types/Task/TaskTypes";
import { SERVER_BASE_URL } from "../../../config/api";

interface FileAttachmentsSectionProps {
  fileAttachments: FileAttachment[];
  loading: boolean;
  onFileUploadClick: () => void;
  onImagePreview: (attachment: FileAttachment) => void;
  parseFirebaseTimestamp: (
    timestamp: string | { _seconds: number; _nanoseconds: number }
  ) => Date;
  isImageAttachment: (attachment: FileAttachment) => boolean;
}

const FileAttachmentsSection = ({
  fileAttachments,
  loading,
  onFileUploadClick,
  onImagePreview,
  parseFirebaseTimestamp,
  isImageAttachment,
}: FileAttachmentsSectionProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box sx={{ 
      paddingTop: { xs: "16px", sm: "16px" },
      width: "100%",
      maxWidth: "100%",
      overflowX: "hidden",
      boxSizing: "border-box",
    }}>
      <Typography sx={{ 
        fontSize: { xs: "14px", sm: "16px" },
        lineHeight: { xs: "1.5", sm: "1.6" },
        color: "#0A1629",
        mb: { xs: "12px", sm: "15px" },
        wordBreak: "break-word",
        overflowWrap: "break-word",
        maxWidth: "100%",
      }}>
        Think over UX for Login and Registration, create a flow using wireframes.
        Upon completion, show the team and discuss. Attach the source to the task.
      </Typography>
      <Box
        sx={{
          paddingY: { xs: "0px", sm: "15px" },
          display: "flex",
          gap: { xs: "12px", sm: "16px" },
          mb: { xs: "16px", sm: 0 },
        }}
      >
        <Box
          onClick={onFileUploadClick}
          sx={{
            backgroundColor: "#6D5DD315",
            padding: "10px",
            borderRadius: "14px",
            display: "flex",
            cursor: "pointer",
            transition: "all 0.2s ease",
            "&:hover": {
              backgroundColor: "#6D5DD330",
              transform: "scale(1.05)",
            },
          }}
        >
          <SvgIcon component={AttachmentIcon} />
        </Box>
        <Box
          onClick={onFileUploadClick}
          sx={{
            backgroundColor: "#6D5DD315",
            padding: "10px",
            borderRadius: "14px",
            display: "flex",
            cursor: "pointer",
            transition: "all 0.2s ease",
            "&:hover": {
              backgroundColor: "#6D5DD330",
              transform: "scale(1.05)",
            },
          }}
        >
          <SvgIcon component={FilesIcon} />
        </Box>
      </Box>
      <Typography 
        color="secondary.main" 
        fontWeight={"700"}
        sx={{ 
          fontSize: { xs: "14px", sm: "16px" },
          mb: { xs: "8px", sm: "8px" },
        }}
      >
        Task Attachment
      </Typography>
      {loading ? (
        <Box sx={{ padding: { xs: "16px", sm: "20px" }, textAlign: "center" }}>
          <Typography sx={{ fontSize: { xs: "14px", sm: "16px" } }}>
            Loading attachments...
          </Typography>
        </Box>
      ) : fileAttachments && fileAttachments.length > 0 ? (
        <Box
          sx={{
            paddingTop: { xs: "8px", sm: "8px" },
            display: "flex",
            alignContent: "center",
            gap: { xs: "12px", sm: "16px" },
            flexWrap: "wrap",
            width: "100%",
            maxWidth: "100%",
            boxSizing: "border-box",
          }}
        >
          {fileAttachments.map((attachment: FileAttachment) => {
            const uploadDate = parseFirebaseTimestamp(attachment.uploadDate);
            const formattedDate = uploadDate.toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            });
            const formattedTime = uploadDate.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            });

            const isImage = isImageAttachment(attachment);
            const imageUrl = attachment.fileUrl
              ? `${SERVER_BASE_URL}${attachment.fileUrl}`
              : undefined;

            return (
              <Box
                key={attachment.fileName}
                onClick={() => isImage && imageUrl && onImagePreview(attachment)}
                sx={{
                  width: { xs: "calc(50% - 6px)", sm: "156px" },
                  maxWidth: { xs: "calc(50% - 6px)", sm: "156px" },
                  minWidth: 0,
                  height: { xs: "120px", sm: "144px" },
                  backgroundImage: imageUrl ? `url(${imageUrl})` : undefined,
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "cover",
                  borderRadius: { xs: "12px", sm: "14px" },
                  backgroundColor: imageUrl ? undefined : "#F5F8FC",
                  cursor: isImage && imageUrl ? "pointer" : "default",
                  transition: "all 0.2s ease",
                  boxSizing: "border-box",
                  flexShrink: 0,
                  ...(isImage &&
                    imageUrl && {
                      "&:hover": {
                        transform: "scale(1.02)",
                        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.15)",
                      },
                    }),
                }}
              >
                <Box
                  sx={{
                    backgroundColor: "#2155A316",
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    position: "relative",
                    borderRadius: "14px",
                  }}
                >
                  <Box
                    sx={{
                      backgroundColor: "#F5F8FC",
                      padding: { xs: "8px", sm: "10px" },
                      borderRadius: { xs: "12px", sm: "14px" },
                      display: "flex",
                      position: "absolute",
                      margin: { xs: "4px", sm: "5px" },
                      top: 0,
                      right: 0,
                    }}
                  >
                    <SvgIcon sx={{ fontSize: { xs: "16px", sm: "20px" } }} component={AttachmentIcon} />
                  </Box>
                  <Box
                    sx={{
                      position: "absolute",
                      bottom: "1px",
                      left: 0,
                      backgroundColor: "#fff",
                      borderRadius: { xs: "10px", sm: "12px" },
                      width: "100%",
                      textAlign: "center",
                      padding: { xs: "4px", sm: "6px" },
                    }}
                  >
                    <Typography 
                      fontSize={{ xs: "10px", sm: "12px" }} 
                      fontWeight={"700"}
                      sx={{ 
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        px: 0.5,
                      }}
                    >
                      {attachment.originalName}
                    </Typography>
                    <Typography 
                      fontSize={{ xs: "10px", sm: "12px" }} 
                      color="secondary.main"
                    >
                      {formattedDate} | {formattedTime}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            );
          })}
        </Box>
      ) : (
        <Box sx={{ padding: { xs: "16px", sm: "20px" }, textAlign: "center" }}>
          <Typography 
            color="secondary.main"
            sx={{ fontSize: { xs: "14px", sm: "16px" } }}
          >
            No attachments found
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default FileAttachmentsSection;
