import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  LinearProgress,
  Typography,
  IconButton,
} from "@mui/material";
import { Close } from "@mui/icons-material";

interface DownloadProgressModalProps {
  open: boolean;
  filename: string;
  progress: number; // 0-100
  onClose?: () => void;
}

const DownloadProgressModal = ({
  open,
  filename,
  progress,
  onClose,
}: DownloadProgressModalProps) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      disableEscapeKeyDown={progress < 100}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingRight: 2,
        }}
      >
        <Typography variant="h6" component="div">
          Downloading File
        </Typography>
        {progress >= 100 && onClose && (
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <Close />
          </IconButton>
        )}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ width: "100%", mb: 2 }}>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 1, wordBreak: "break-all" }}
          >
            {filename}
          </Typography>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 8,
              borderRadius: 4,
            }}
          />
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 1, textAlign: "right" }}
          >
            {Math.round(progress)}%
          </Typography>
        </Box>
        {progress >= 100 && (
          <Typography variant="body2" color="success.main" sx={{ mt: 1 }}>
            Download completed successfully!
          </Typography>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default DownloadProgressModal;
