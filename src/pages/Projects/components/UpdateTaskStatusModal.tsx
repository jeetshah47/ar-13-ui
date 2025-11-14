import { Box, Button, IconButton, Typography, TextField, SvgIcon } from "@mui/material";
import CloseIcon from "../../../assets/icons/general/close/blue.svg?react";
import Modal from "../../../common/components/Modal/Modal";
import { useState } from "react";
import { getStatusDisplayName, type TaskStatus } from "../constants/taskStatus.constants";

interface UpdateTaskStatusModalProps {
  show: boolean;
  onClose: () => void;
  onUpdate: (remark: string) => void;
  status: TaskStatus | string;
  isLoading?: boolean;
}

const UpdateTaskStatusModal = ({ 
  show, 
  onClose, 
  onUpdate, 
  status, 
  isLoading = false 
}: UpdateTaskStatusModalProps) => {
  const [remark, setRemark] = useState("");

  const handleUpdate = () => {
    onUpdate(remark);
    // Reset remark after update
    setRemark("");
  };

  const handleClose = () => {
    setRemark("");
    onClose();
  };

  const statusDisplayName = getStatusDisplayName(status as TaskStatus);

  return (
    <Modal show={show} onClose={handleClose}>
      <Box
        sx={(theme) => ({
          width: { xs: "90%", sm: "584px" },
          maxWidth: "584px",
          backgroundColor: theme.palette.background.paper,
          borderRadius: "24px",
          boxShadow: theme.shadows[6],
          position: "relative",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          padding: "60px",
        })}
      >
        {/* Close Button */}
        <Box
          sx={{
            position: "absolute",
            top: "30px",
            right: "30px",
            zIndex: 10,
          }}
        >
          <IconButton
            onClick={handleClose}
            disabled={isLoading}
            sx={(theme) => ({
              backgroundColor: theme.palette.grey[50],
              borderRadius: "14px",
              width: "44px",
              height: "44px",
              "&:hover": {
                backgroundColor: theme.palette.grey[100],
              },
            })}
          >
            <SvgIcon component={CloseIcon} />
          </IconButton>
        </Box>

        {/* Title */}
        <Box sx={{ mb: 4 }}>
          <Typography
            sx={(theme) => ({
              fontWeight: 700,
              fontSize: "22px",
              lineHeight: 1.364,
              color: theme.palette.text.primary,
              textAlign: "center",
            })}
          >
            Update Task Status
          </Typography>
        </Box>

        {/* Status Display */}
        <Box sx={{ mb: 3, textAlign: "center" }}>
          <Typography
            sx={(theme) => ({
              fontWeight: 400,
              fontSize: "16px",
              lineHeight: 1.5,
              color: theme.palette.text.secondary,
              mb: 1,
            })}
          >
            Changing status to:
          </Typography>
          <Typography
            sx={(theme) => ({
              fontWeight: 700,
              fontSize: "18px",
              lineHeight: 1.364,
              color: theme.palette.primary.main,
            })}
          >
            {statusDisplayName}
          </Typography>
        </Box>

        {/* Remark Text Field */}
        <Box sx={{ mb: 4 }}>
          <Typography
            sx={(theme) => ({
              fontWeight: 600,
              fontSize: "14px",
              lineHeight: 1.5,
              color: theme.palette.text.primary,
              mb: 1,
            })}
          >
            Remark <span style={{ color: "#d32f2f" }}>*</span>
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            value={remark}
            onChange={(e) => setRemark(e.target.value)}
            placeholder="Enter a remark for this status change..."
            disabled={isLoading}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "14px",
              },
            }}
            required
          />
        </Box>

        {/* Buttons */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: "30px",
          }}
        >
          <Button
            variant="outlined"
            onClick={handleClose}
            disabled={isLoading}
            sx={(theme) => ({
              borderColor: theme.palette.grey[300],
              color: theme.palette.text.primary,
              borderRadius: "14px",
              padding: "13px 20px",
              fontWeight: 700,
              fontSize: "16px",
              lineHeight: 1.364,
              minWidth: "141px",
              height: "48px",
              "&:hover": {
                borderColor: theme.palette.grey[400],
                backgroundColor: theme.palette.grey[50],
              },
              "&:disabled": {
                borderColor: theme.palette.action.disabled,
                color: theme.palette.action.disabled,
              },
            })}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleUpdate}
            disabled={isLoading || !remark.trim()}
            sx={(theme) => ({
              backgroundColor: theme.palette.primary.main,
              color: theme.palette.primary.contrastText,
              borderRadius: "14px",
              padding: "13px 20px",
              fontWeight: 700,
              fontSize: "16px",
              lineHeight: 1.364,
              minWidth: "141px",
              height: "48px",
              boxShadow: theme.shadows[4],
              "&:hover": {
                backgroundColor: theme.palette.primary.dark,
                boxShadow: theme.shadows[5],
              },
              "&:disabled": {
                backgroundColor: theme.palette.action.disabledBackground,
                color: theme.palette.action.disabled,
                boxShadow: "none",
              },
            })}
          >
            {isLoading ? "Updating..." : "Update Status"}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default UpdateTaskStatusModal;

