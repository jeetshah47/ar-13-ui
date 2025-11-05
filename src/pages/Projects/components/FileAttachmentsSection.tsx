import { Box, SvgIcon, Typography } from "@mui/material";
import AttachmentIcon from "../../../assets/icons/general/calendar-19.svg?react";
import FilesIcon from "../../../assets/icons/general/calendar-20.svg?react";
import type { FileAttachment } from "../../../store/types/Task/TaskTypes";

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
  return (
    <Box sx={{ paddingTop: "16px" }}>
      <Typography>
        Think over UX for Login and Registration, create a flow using wireframes.
        Upon completion, show the team and discuss. Attach the source to the task.
      </Typography>
      <Box
        sx={{
          paddingY: "15px",
          display: "flex",
          gap: "16px",
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
      <Typography color="secondary.main" fontWeight={"700"}>
        Task Attachment
      </Typography>
      {loading ? (
        <Box sx={{ padding: "20px", textAlign: "center" }}>
          <Typography>Loading attachments...</Typography>
        </Box>
      ) : fileAttachments && fileAttachments.length > 0 ? (
        <Box
          sx={{
            paddingTop: "8px",
            display: "flex",
            alignContent: "center",
            gap: "16px",
            flexWrap: "wrap",
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
              ? `http://localhost:3000${attachment.fileUrl}`
              : undefined;

            return (
              <Box
                key={attachment.fileName}
                onClick={() => isImage && imageUrl && onImagePreview(attachment)}
                sx={{
                  width: "156px",
                  height: "144px",
                  backgroundImage: imageUrl ? `url(${imageUrl})` : undefined,
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "cover",
                  borderRadius: "14px",
                  backgroundColor: imageUrl ? undefined : "#F5F8FC",
                  cursor: isImage && imageUrl ? "pointer" : "default",
                  transition: "all 0.2s ease",
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
                      padding: "10px",
                      borderRadius: "14px",
                      display: "flex",
                      position: "absolute",
                      margin: "5px",
                      top: 0,
                      right: 0,
                    }}
                  >
                    <SvgIcon component={AttachmentIcon} />
                  </Box>
                  <Box
                    sx={{
                      position: "absolute",
                      bottom: "1px",
                      left: 0,
                      backgroundColor: "#fff",
                      borderRadius: "12px",
                      width: "100%",
                      textAlign: "center",
                    }}
                  >
                    <Typography fontSize={"12px"} fontWeight={"700"}>
                      {attachment.originalName}
                    </Typography>
                    <Typography fontSize={"12px"} color="secondary.main">
                      {formattedDate} | {formattedTime}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            );
          })}
        </Box>
      ) : (
        <Box sx={{ padding: "20px", textAlign: "center" }}>
          <Typography color="secondary.main">No attachments found</Typography>
        </Box>
      )}
    </Box>
  );
};

export default FileAttachmentsSection;
