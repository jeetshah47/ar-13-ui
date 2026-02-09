import { Box, Button, IconButton, Typography, TextField, SvgIcon, Select, MenuItem, FormControl } from "@mui/material";
import CloseIcon from "../../../assets/icons/general/close/blue.svg?react";
import Modal from "../../../common/components/Modal/Modal";
import { useState, useEffect } from "react";
import { getStatusDisplayName, normalizeTaskStatus, type TaskStatus } from "../constants/taskStatus.constants";

interface UpdateTaskStatusModalProps {
  show: boolean;
  onClose: () => void;
  onUpdate: (status: string, remark: string) => void;
  currentStatus: string;
  taskStatuses?: Array<{ id?: string; value: string; displayName?: string; isActive?: boolean; order?: number }>;
  isLoading?: boolean;
}

const UpdateTaskStatusModal = ({ 
  show, 
  onClose, 
  onUpdate, 
  currentStatus,
  taskStatuses = [],
  isLoading = false 
}: UpdateTaskStatusModalProps) => {
  const [remark, setRemark] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>(currentStatus);

  // Update selectedStatus when currentStatus changes
  useEffect(() => {
    setSelectedStatus(currentStatus);
  }, [currentStatus]);

  // Find the current status object
  const normalizedCurrentStatus = currentStatus ? normalizeTaskStatus(currentStatus) : null;
  const currentStatusObj = taskStatuses.find((status) => {
    if (!status.value) return false;
    const normalizedStatusValue = normalizeTaskStatus(status.value);
    return normalizedStatusValue === normalizedCurrentStatus;
  });

  // Filter active statuses and sort by order if available
  const sortedStatuses = [...taskStatuses]
    .filter((status) => {
      // Filter out statuses without a value
      if (!status.value) return false;
      // Include statuses where isActive is true or undefined
      return status.isActive !== false;
    })
    .sort((a, b) => {
      if (a.order !== undefined && b.order !== undefined) {
        return a.order - b.order;
      }
      // If no order, maintain original order
      return 0;
    });

  // Get the selected value for the dropdown
  const selectedValue = selectedStatus || currentStatus || "";

  // Get display name for selected status
  const getSelectedStatusDisplayName = () => {
    if (!selectedValue) return "";
    const selectedStatusObj = sortedStatuses.find((status) => status.value === selectedValue);
    if (selectedStatusObj?.displayName) return selectedStatusObj.displayName;
    const normalized = normalizeTaskStatus(selectedValue);
    return getStatusDisplayName(normalized);
  };

  const handleUpdate = () => {
    onUpdate(selectedStatus, remark);
    // Reset remark after update
    setRemark("");
  };

  const handleClose = () => {
    setRemark("");
    setSelectedStatus(currentStatus);
    onClose();
  };

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

        {/* Status Dropdown */}
        <Box sx={{ mb: 3 }}>
          <Typography
            sx={(theme) => ({
              fontWeight: 600,
              fontSize: "14px",
              lineHeight: 1.5,
              color: theme.palette.text.primary,
              mb: 1,
            })}
          >
            Status <span style={{ color: "#d32f2f" }}>*</span>
          </Typography>
          <FormControl fullWidth>
            <Select
              value={selectedValue}
              onChange={(e) => setSelectedStatus(e.target.value)}
              displayEmpty
              disabled={isLoading || sortedStatuses.length === 0}
              renderValue={(value) => {
                if (!value) return "Select a status";
                const statusObj = sortedStatuses.find((status) => status.value === value);
                return statusObj?.displayName || getStatusDisplayName(normalizeTaskStatus(value)) || value;
              }}
              sx={{
                borderRadius: "14px",
                backgroundColor: "#fff",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#E0E0E0",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#3F8CFF",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#3F8CFF",
                },
                "& .MuiSelect-select": {
                  padding: "12px 20px",
                  fontSize: "16px",
                  fontWeight: 500,
                  display: "flex",
                  alignItems: "center",
                },
              }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    borderRadius: "14px",
                    marginTop: "8px",
                    boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
                    maxHeight: "300px",
                  },
                },
              }}
            >
              {sortedStatuses.length > 0 ? (
                sortedStatuses.map((status) => (
                  <MenuItem 
                    key={status.id || status.value} 
                    value={status.value}
                    sx={{
                      padding: "12px 20px",
                      fontSize: "16px",
                      "&:hover": {
                        backgroundColor: "#F4F9FD",
                      },
                      "&.Mui-selected": {
                        backgroundColor: "#E8F4FD",
                        "&:hover": {
                          backgroundColor: "#E8F4FD",
                        },
                      },
                    }}
                  >
                    {status.displayName || status.value}
                  </MenuItem>
                ))
              ) : (
                <MenuItem value="" disabled>
                  {currentStatusObj?.displayName || currentStatus || "No statuses available"}
                </MenuItem>
              )}
            </Select>
          </FormControl>
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
            disabled={isLoading || !remark.trim() || !selectedStatus}
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

