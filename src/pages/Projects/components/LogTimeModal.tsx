import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  Box,
  IconButton,
  TextField,
  Typography,
  Button,
  InputAdornment,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import Crossicon from "../../../assets/icons/general/close/blue.svg?react";
import CalendarIcon from "../../../assets/icons/sidebar/calendar/inactive.svg?react";
import { SvgIcon } from "@mui/material";
import { useAppDispatch, useAppSelector, type RootState } from "../../../store/store";
import { addTimeSpentAction } from "../../../store/features/task/projectAction";
import { useResourceAccess } from "../../../store/hooks/useResourceAccess";
import { usePermissions } from "../../../store/hooks/usePermissions";
import type { TaskResponse } from "../../../store/types/Task/TaskResponse";
import toast from "react-hot-toast";
import { MSG_CANNOT_MODIFY_TIME_LOG } from "../../../constants/messages";

interface LogTimeModalProps {
  onClose?: () => void;
  projectId?: string;
  taskId?: string;
  task?: TaskResponse;
}


const LogTimeModal = ({ onClose, projectId, taskId, task }: LogTimeModalProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);

  const dispatch = useAppDispatch();
  const taskListState = useAppSelector((state: RootState) => state.taskListReducer);
  const { loading } = taskListState.api;
  const { canLogTime } = useResourceAccess();
  const { isAdmin } = usePermissions();

  const handleSave = async () => {
    if (!date || !description || (hours === 0 && minutes === 0) || !projectId || !taskId) {
      return;
    }

    // Permission check: Admins have full access, skip check for them
    // For other users: must be assigned to the task to log time
    if (!isAdmin() && task && !canLogTime(task)) {
      toast.error(MSG_CANNOT_MODIFY_TIME_LOG);
      return;
    }

    await dispatch(addTimeSpentAction(projectId, taskId, {
      date,
      hours,
      minutes,
      description,
    }));
    handleClose();
  };

  const handleClose = () => {
    setDate("");
    setDescription("");
    setHours(0);
    setMinutes(0);
    onClose?.();
  };

  // Prevent body scroll when modal is open (especially important for iOS)
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    const originalPosition = window.getComputedStyle(document.body).position;
    const scrollY = window.scrollY;

    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";

    return () => {
      document.body.style.overflow = originalStyle;
      document.body.style.position = originalPosition;
      document.body.style.top = "";
      document.body.style.width = "";
      window.scrollTo(0, scrollY);
    };
  }, []);

  const modalContent = (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: "100vw",
        height: { xs: "-webkit-fill-available", sm: "100vh" },
        minHeight: { xs: "-webkit-fill-available", sm: "100vh" },
        zIndex: 9999,
        backgroundColor: "rgba(33, 85, 163, 0.16)",
        display: "flex",
        justifyContent: "center",
        alignItems: { xs: "flex-end", sm: "center" },
        padding: { xs: 0, sm: "20px" },
        overflow: "hidden",
        WebkitOverflowScrolling: "touch",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          handleClose();
        }
      }}
    >
      <Box
        sx={(theme) => ({
          width: { xs: "100%", sm: "584px" },
          maxWidth: { xs: "100%", sm: "584px" },
          maxHeight: { xs: "90dvh", sm: "90vh" },
          height: { xs: "90dvh", sm: "auto" },
          backgroundColor: theme.palette.background.paper,
          boxShadow: { xs: "0px 6px 58px 0px rgba(121, 145, 173, 0.2)", sm: theme.shadows[6] },
          borderRadius: { xs: "24px 24px 0 0", sm: "24px" },
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          margin: 0,
          position: "relative",
          zIndex: 10000,
        })}
        onClick={(e) => e.stopPropagation()}
      >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: { xs: "20px 20px 16px 20px", sm: "30px 30px 0 30px" },
          borderBottom: { xs: "none", sm: "none" },
          flexShrink: 0,
        }}
      >
        <Typography
          sx={(theme) => ({
            fontWeight: 700,
            fontSize: { xs: "18px", sm: "22px" },
            lineHeight: { xs: "1.36", sm: "1.36" },
            color: theme.palette.text.primary,
          })}
        >
          Time Tracking
        </Typography>
        <IconButton
          onClick={handleClose}
          sx={(theme) => ({
            backgroundColor: theme.palette.grey[50],
            borderRadius: "14px",
            width: { xs: "32px", sm: "44px" },
            height: { xs: "32px", sm: "44px" },
            padding: 0,
            minWidth: { xs: "32px", sm: "44px" },
          })}
        >
          <SvgIcon sx={{ fontSize: { xs: "18px", sm: "24px" } }} component={Crossicon} />
        </IconButton>
      </Box>

      {/* Content */}
      <Box sx={{ 
        padding: { xs: "0 20px 20px 20px", sm: "30px" }, 
        flex: 1, 
        display: "flex", 
        flexDirection: "column", 
        gap: { xs: "16px", sm: "24px" },
        overflowX: "hidden",
        overflowY: "auto",
        WebkitOverflowScrolling: "touch",
        minHeight: 0,
      }}>
        {/* Time input fields */}
        <Box sx={{ 
          display: "flex", 
          gap: { xs: "12px", sm: "16px" },
          flexDirection: { xs: "column", sm: "row" },
        }}>
          <Box sx={{ flex: 1, width: { xs: "100%", sm: "auto" } }}>
            <Typography
              sx={(theme) => ({
                fontWeight: 700,
                fontSize: "14px",
                lineHeight: "1.71",
                color: theme.palette.text.secondary,
                marginBottom: "7px",
              })}
            >
              Hours
            </Typography>
            <TextField
              fullWidth
              type="number"
              value={hours}
              onChange={(e) => setHours(parseInt(e.target.value) || 0)}
              inputProps={{ min: 0, max: 24, inputMode: "numeric", pattern: "[0-9]*" }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "14px",
                  height: { xs: "48px", sm: "48px" },
                  "& fieldset": {
                    borderColor: "#D8E0F0",
                    borderWidth: "1px",
                  },
                  "&:hover fieldset": {
                    borderColor: "#D8E0F0",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#3F8CFF",
                  },
                  "& .MuiInputBase-input": {
                    color: "#7D8592",
                    fontSize: "14px",
                    lineHeight: "1.71",
                    padding: { xs: "0 14px", sm: "0 14px" },
                    height: "100%",
                    WebkitAppearance: "none",
                    MozAppearance: "textfield",
                    "&::-webkit-outer-spin-button, &::-webkit-inner-spin-button": {
                      WebkitAppearance: "none",
                      margin: 0,
                    },
                  },
                },
              }}
            />
          </Box>
          <Box sx={{ flex: 1, width: { xs: "100%", sm: "auto" } }}>
            <Typography
              sx={(theme) => ({
                fontWeight: 700,
                fontSize: "14px",
                lineHeight: "1.71",
                color: theme.palette.text.secondary,
                marginBottom: "7px",
              })}
            >
              Minutes
            </Typography>
            <TextField
              fullWidth
              type="number"
              value={minutes}
              onChange={(e) => setMinutes(parseInt(e.target.value) || 0)}
              inputProps={{ min: 0, max: 59, inputMode: "numeric", pattern: "[0-9]*" }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "14px",
                  height: { xs: "48px", sm: "48px" },
                  "& fieldset": {
                    borderColor: "#D8E0F0",
                    borderWidth: "1px",
                  },
                  "&:hover fieldset": {
                    borderColor: "#D8E0F0",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#3F8CFF",
                  },
                  "& .MuiInputBase-input": {
                    color: "#7D8592",
                    fontSize: "14px",
                    lineHeight: "1.71",
                    padding: { xs: "0 14px", sm: "0 14px" },
                    height: "100%",
                    WebkitAppearance: "none",
                    MozAppearance: "textfield",
                    "&::-webkit-outer-spin-button, &::-webkit-inner-spin-button": {
                      WebkitAppearance: "none",
                      margin: 0,
                    },
                  },
                },
              }}
            />
          </Box>
        </Box>

        {/* Date field */}
        <Box>
          <Typography
            sx={(theme) => ({
              fontWeight: 700,
              fontSize: "14px",
              lineHeight: "1.71",
              color: theme.palette.text.secondary,
              marginBottom: "7px",
            })}
          >
            Date
          </Typography>
          <TextField
            fullWidth
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <SvgIcon component={CalendarIcon} sx={{ color: "#7D8592", fontSize: "24px" }} />
                </InputAdornment>
              ),
            }}
            inputProps={{
              max: new Date().toISOString().split("T")[0],
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "14px",
                height: { xs: "48px", sm: "48px" },
                "& fieldset": {
                  borderColor: "#D8E0F0",
                  borderWidth: "1px",
                },
                "&:hover fieldset": {
                  borderColor: "#D8E0F0",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#3F8CFF",
                },
                "& .MuiInputBase-input": {
                  color: "#7D8592",
                  fontSize: "14px",
                  lineHeight: "1.71",
                  padding: { xs: "0 14px", sm: "0 14px" },
                  height: "100%",
                  WebkitAppearance: "none",
                },
              },
            }}
          />
        </Box>

        {/* Description field */}
        <Box sx={{ flex: 1 }}>
          <Typography
            sx={(theme) => ({
              fontWeight: 700,
              fontSize: "14px",
              lineHeight: "1.71",
              color: theme.palette.text.secondary,
              marginBottom: "7px",
            })}
          >
            Work Description
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={isMobile ? 4 : 6}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add some description of the task"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "14px",
                "& fieldset": {
                  borderColor: "#D8E0F0",
                  borderWidth: "1px",
                },
                "&:hover fieldset": {
                  borderColor: "#D8E0F0",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#3F8CFF",
                },
                "& .MuiInputBase-input": {
                  color: "#7D8592",
                  fontSize: "14px",
                  lineHeight: "1.71",
                  padding: { xs: "12px 14px", sm: "14px" },
                  "&::placeholder": {
                    color: "#7D8592",
                    opacity: 1,
                  },
                },
              },
            }}
          />
        </Box>

      </Box>

      {/* Footer */}
      <Box
        sx={{
          padding: { xs: "0 20px 20px 20px", sm: "0 30px 30px 30px" },
          paddingBottom: { xs: "max(20px, env(safe-area-inset-bottom))", sm: "30px" },
          display: "flex",
          justifyContent: { xs: "stretch", sm: "flex-end" },
          flexShrink: 0,
        }}
      >
        <Button
          onClick={handleSave}
          disabled={!date || !description || (hours === 0 && minutes === 0) || loading}
          fullWidth={isMobile}
          sx={(theme) => ({
            backgroundColor: "#3F8CFF",
            color: "#FFFFFF",
            borderRadius: "14px",
            padding: { xs: "12px 20px", sm: "12px 20px" },
            fontWeight: 700,
            fontSize: "16px",
            lineHeight: "1.36",
            textTransform: "none",
            boxShadow: "0px 6px 12px 0px rgba(63, 140, 255, 0.26)",
            "&:hover": {
              backgroundColor: "#3A81EB",
              boxShadow: "0px 6px 12px 0px rgba(63, 140, 255, 0.42)",
            },
            "&:disabled": {
              backgroundColor: theme.palette.action.disabledBackground,
              color: theme.palette.action.disabled,
              boxShadow: "none",
            },
          })}
        >
          Save
        </Button>
      </Box>
      </Box>
    </Box>
  );

  // Render modal using portal to ensure it appears above all content
  return createPortal(modalContent, document.body);
};

export default LogTimeModal;
