import { Box, Button, IconButton, Typography, SvgIcon, Autocomplete, TextField } from "@mui/material";
import CloseIcon from "../../../assets/icons/general/close/blue.svg?react";
import Modal from "../../../common/components/Modal/Modal";
import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector, type RootState } from "../../../store/store";
import { getUsersAction } from "../../../store/features/user/userAction";
import type { UserResponse } from "../../../store/types/User/UserResponse";

interface TransferTaskModalProps {
  show: boolean;
  onClose: () => void;
  onTransfer: (userId: string) => void;
  isLoading?: boolean;
  currentAssigneeId?: string;
}

const TransferTaskModal = ({ 
  show, 
  onClose, 
  onTransfer, 
  isLoading = false,
  currentAssigneeId 
}: TransferTaskModalProps) => {
  const dispatch = useAppDispatch();
  const { users, loading: usersLoading } = useAppSelector((state: RootState) => state.userReducer);
  const [selectedUser, setSelectedUser] = useState<UserResponse | null>(null);

  // Fetch users if not already loaded
  useEffect(() => {
    if (users.length === 0 && !usersLoading) {
      dispatch(getUsersAction());
    }
  }, [dispatch, users.length, usersLoading]);

  // Filter out current assignee from the list
  const availableUsers = users.filter((user) => user.id !== currentAssigneeId);

  const handleTransfer = () => {
    if (selectedUser) {
      onTransfer(selectedUser.id);
    }
  };

  const handleClose = () => {
    setSelectedUser(null);
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
          padding: { xs: "20px", sm: "30px" },
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
        <Box sx={{ mb: "24px", mt: "8px" }}>
          <Typography
            sx={(theme) => ({
              fontWeight: 700,
              fontSize: "22px",
              lineHeight: 1.364,
              color: theme.palette.text.primary,
            })}
          >
            Transfer Task
          </Typography>
        </Box>

        {/* Description */}
        <Box sx={{ mb: "24px" }}>
          <Typography
            sx={(theme) => ({
              fontWeight: 400,
              fontSize: "16px",
              lineHeight: 1.5,
              color: theme.palette.text.primary,
              opacity: 0.7,
            })}
          >
            Select a user to transfer this task to. Only admins can transfer tasks.
          </Typography>
        </Box>

        {/* User Selection */}
        <Box sx={{ mb: "32px" }}>
          <Typography
            sx={(theme) => ({
              fontWeight: 600,
              fontSize: "14px",
              mb: "8px",
              color: theme.palette.text.primary,
            })}
          >
            Transfer To
          </Typography>
          <Autocomplete
            options={availableUsers}
            getOptionLabel={(option) => option.name}
            value={selectedUser}
            onChange={(_, newValue) => {
              setSelectedUser(newValue);
            }}
            loading={usersLoading}
            disabled={isLoading}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Select user"
                fullWidth
              />
            )}
            renderOption={(props, option) => (
              <Box component="li" {...props} key={option.id}>
                <Typography>{option.name}</Typography>
              </Box>
            )}
            sx={{ width: "100%" }}
          />
        </Box>

        {/* Buttons */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "16px",
            mt: "auto",
          }}
        >
          <Button
            variant="outlined"
            onClick={handleClose}
            disabled={isLoading}
            sx={{
              borderRadius: "14px",
              padding: "13px 20px",
              fontWeight: 700,
              fontSize: "16px",
              lineHeight: 1.364,
              minWidth: "120px",
              height: "48px",
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleTransfer}
            disabled={isLoading || !selectedUser}
            sx={(theme) => ({
              backgroundColor: theme.palette.primary.main,
              color: theme.palette.primary.contrastText,
              borderRadius: "14px",
              padding: "13px 20px",
              fontWeight: 700,
              fontSize: "16px",
              lineHeight: 1.364,
              minWidth: "120px",
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
            {isLoading ? "Transferring..." : "Transfer"}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default TransferTaskModal;

