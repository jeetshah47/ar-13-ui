import { Box, Typography } from "@mui/material";
import { useImageWithAuth } from "../../../utils/useImageWithAuth";
import type { FileAttachment } from "../../../store/types/Task/TaskTypes";
import { useEffect, useRef, useState } from "react";

interface FileAttachmentThumbnailProps {
  attachment: FileAttachment;
  isImage: boolean;
  imageUrl: string | undefined;
  onImagePreview: (attachment: FileAttachment) => void;
}

export function FileAttachmentThumbnail({
  attachment,
  isImage,
  imageUrl,
  onImagePreview,
}: FileAttachmentThumbnailProps) {
  const [isInView, setIsInView] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Use lazy loading - only load image when it's in viewport
  useEffect(() => {
    if (!isImage || !imageUrl || !containerRef.current) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: "50px", // Start loading 50px before entering viewport
      }
    );

    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
    };
  }, [isImage, imageUrl]);

  // Only load image if it's in view
  const { blobUrl, loading } = useImageWithAuth(isInView ? imageUrl : undefined);

  return (
    <Box
      ref={containerRef}
      onClick={() => isImage && imageUrl && onImagePreview(attachment)}
      sx={{
        width: { xs: "calc(50% - 6px)", sm: "156px" },
        maxWidth: { xs: "calc(50% - 6px)", sm: "156px" },
        minWidth: 0,
        height: { xs: "120px", sm: "144px" },
        position: "relative",
        borderRadius: { xs: "12px", sm: "14px" },
        backgroundColor: "#F5F8FC",
        cursor: isImage && imageUrl ? "pointer" : "default",
        transition: "all 0.2s ease",
        boxSizing: "border-box",
        flexShrink: 0,
        overflow: "hidden",
        ...(isImage &&
          imageUrl && {
            "&:hover": {
              transform: "scale(1.02)",
              boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.15)",
            },
          }),
      }}
    >
      {isImage && imageUrl && (
        <>
          {loading ? (
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#F5F8FC",
              }}
            >
              <Typography fontSize="12px" color="text.secondary">
                Loading...
              </Typography>
            </Box>
          ) : blobUrl ? (
            <Box
              component="img"
              src={blobUrl}
              alt={attachment.originalName}
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          ) : null}
        </>
      )}
      {/* Rest of the thumbnail UI (attachment icon, file name, etc.) will be added by parent */}
    </Box>
  );
}

