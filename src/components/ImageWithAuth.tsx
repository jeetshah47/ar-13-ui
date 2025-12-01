import { Box, type SxProps, type Theme } from "@mui/material";
import { useImageWithAuth } from "../utils/useImageWithAuth";

interface ImageWithAuthProps {
  src: string | undefined;
  alt?: string;
  sx?: SxProps<Theme>;
  onError?: () => void;
}

/**
 * Component that loads an image with JWT authentication
 * Automatically handles fetching with Authorization header and creating blob URLs
 */
export function ImageWithAuth({ src, alt, sx, onError }: ImageWithAuthProps) {
  const { blobUrl, loading, error } = useImageWithAuth(src);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          ...sx,
        }}
      >
        Loading...
      </Box>
    );
  }

  if (error || !blobUrl) {
    if (onError) onError();
    return null;
  }

  return (
    <Box
      component="img"
      src={blobUrl}
      alt={alt}
      sx={sx}
      onError={onError}
    />
  );
}

