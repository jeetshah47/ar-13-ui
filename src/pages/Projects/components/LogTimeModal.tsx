import { useState } from "react";
import {
  Box,
  IconButton,
  TextField,
  Typography,
  Button,
  InputAdornment,
} from "@mui/material";
import Crossicon from "../../../assets/icons/general/close/blue.svg?react";
import CalendarIcon from "../../../assets/icons/sidebar/calendar/inactive.svg?react";
import { SvgIcon } from "@mui/material";
import { useAppDispatch, useAppSelector, type RootState } from "../../../store/store";
import { addTimeSpentAction } from "../../../store/features/task/projectAction";

interface LogTimeModalProps {
  onClose?: () => void;
  projectId?: string;
  taskId?: string;
}


const LogTimeModal = ({ onClose, projectId, taskId }: LogTimeModalProps) => {
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);

  const dispatch = useAppDispatch();
  const taskListState = useAppSelector((state: RootState) => state.taskListReducer);
  const { loading } = taskListState.api;

  const handleSave = async () => {
    if (date && description && (hours > 0 || minutes > 0) && projectId && taskId) {
      await dispatch(addTimeSpentAction(projectId, taskId, {
        date,
        hours,
        minutes,
        description,
      }));
      handleClose();
    }
  };

  const handleClose = () => {
    setDate("");
    setDescription("");
    setHours(0);
    setMinutes(0);
    onClose?.();
  };

  return (
    <Box
      sx={{
        height: "100%",
        width: "100%",
        position: "fixed",
        zIndex: 50,
        backgroundColor: "#2155A316",
        justifyContent: "center",
        alignItems: "center",
        display: "flex",
        top: 0,
        left: 0,
      }}
    >
      <Box
        sx={(theme) => ({
          width: "584px",
          maxHeight: "90vh",
          backgroundColor: theme.palette.background.paper,
          boxShadow: theme.shadows[6],
          borderRadius: "24px",
          display: "flex",
          flexDirection: "column",
          overflow: "auto",
        })}
      >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "30px 30px 0 30px",
        }}
      >
        <Typography
          sx={(theme) => ({
            fontWeight: 700,
            fontSize: "22px",
            lineHeight: "1.36",
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
            width: "44px",
            height: "44px",
          })}
        >
          <Crossicon />
        </IconButton>
      </Box>

      {/* Content */}
      <Box sx={{ padding: "30px", flex: 1, display: "flex", flexDirection: "column", gap: "24px" }}>
        {/* Time input fields */}
        <Box sx={{ display: "flex", gap: "16px" }}>
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
              Hours
            </Typography>
            <TextField
              fullWidth
              type="number"
              value={hours}
              onChange={(e) => setHours(parseInt(e.target.value) || 0)}
              inputProps={{ min: 0, max: 24 }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "14px",
                  "& fieldset": {
                    borderColor: "#D8E0F0",
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
                  },
                },
              }}
            />
          </Box>
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
              Minutes
            </Typography>
            <TextField
              fullWidth
              type="number"
              value={minutes}
              onChange={(e) => setMinutes(parseInt(e.target.value) || 0)}
              inputProps={{ min: 0, max: 59 }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "14px",
                  "& fieldset": {
                    borderColor: "#D8E0F0",
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
                  <SvgIcon component={CalendarIcon} sx={{ color: "#7D8592" }} />
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "14px",
                "& fieldset": {
                  borderColor: "#D8E0F0",
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
            rows={6}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add some description of the task"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "14px",
                "& fieldset": {
                  borderColor: "#D8E0F0",
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
          padding: "0 30px 30px 30px",
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <Button
          onClick={handleSave}
          disabled={!date || !description || (hours === 0 && minutes === 0) || loading}
          sx={(theme) => ({
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
            borderRadius: "14px",
            padding: "12px 20px",
            fontWeight: 700,
            fontSize: "16px",
            lineHeight: "1.36",
            textTransform: "none",
            boxShadow: theme.shadows[4],
            "&:hover": {
              backgroundColor: theme.palette.primary.dark,
            },
            "&:disabled": {
              backgroundColor: theme.palette.action.disabledBackground,
              color: theme.palette.action.disabled,
            },
          })}
        >
          Save Task
        </Button>
      </Box>
      </Box>
    </Box>
  );
};

export default LogTimeModal;
