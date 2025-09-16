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
        sx={{
          width: "584px",
          maxHeight: "90vh",
          backgroundColor: "white",
          boxShadow: "0px 6px 58px rgba(121, 145, 173, 0.2)",
          borderRadius: "24px",
          display: "flex",
          flexDirection: "column",
          overflow: "auto",
        }}
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
          sx={{
            fontWeight: 700,
            fontSize: "22px",
            lineHeight: "1.36",
            color: "#0A1629",
          }}
        >
          Time Tracking
        </Typography>
        <IconButton
          onClick={handleClose}
          sx={{
            backgroundColor: "#F4F9FD",
            borderRadius: "14px",
            width: "44px",
            height: "44px",
          }}
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
              sx={{
                fontWeight: 700,
                fontSize: "14px",
                lineHeight: "1.71",
                color: "#7D8592",
                marginBottom: "7px",
              }}
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
              sx={{
                fontWeight: 700,
                fontSize: "14px",
                lineHeight: "1.71",
                color: "#7D8592",
                marginBottom: "7px",
              }}
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
            sx={{
              fontWeight: 700,
              fontSize: "14px",
              lineHeight: "1.71",
              color: "#7D8592",
              marginBottom: "7px",
            }}
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
            sx={{
              fontWeight: 700,
              fontSize: "14px",
              lineHeight: "1.71",
              color: "#7D8592",
              marginBottom: "7px",
            }}
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
          sx={{
            backgroundColor: "#3F8CFF",
            color: "#FFFFFF",
            borderRadius: "14px",
            padding: "12px 20px",
            fontWeight: 700,
            fontSize: "16px",
            lineHeight: "1.36",
            textTransform: "none",
            boxShadow: "0px 6px 12px rgba(63, 140, 255, 0.26)",
            "&:hover": {
              backgroundColor: "#3F8CFF",
              opacity: 0.9,
            },
            "&:disabled": {
              backgroundColor: "#D8E0F0",
              color: "#7D8592",
            },
          }}
        >
          Save Task
        </Button>
      </Box>
      </Box>
    </Box>
  );
};

export default LogTimeModal;
