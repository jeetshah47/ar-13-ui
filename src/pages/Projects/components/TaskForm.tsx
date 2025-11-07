import { useState, useEffect } from "react";
import { useParams } from "react-router";
import { addTaskAction, updateTaskAction } from "../../../store/features/task/projectAction";
import type { ITask } from "../../../store/types/Task/Task";
import {
  Box,
  IconButton,
  TextField,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  OutlinedInput,
  Chip,
  Button,
} from "@mui/material";
import Crossicon from "../../../assets/icons/general/close/blue.svg?react";
import {
  useAppDispatch,
  useAppSelector,
  type RootState,
} from "../../../store/store";
import { getUsersAction } from "../../../store/features/user/userAction";
import type { SelectChangeEvent } from "@mui/material";

interface TaskFormProps {
  onClose?: () => void;
  task?: ITask; // Optional task for edit mode
  isEditMode?: boolean;
}

const TaskForm = ({ onClose, task, isEditMode = false }: TaskFormProps) => {
  const [subject, setSubject] = useState("");
  const [code, setCode] = useState("");
  const [status, setStatus] = useState("");
  const [duration, setDuration] = useState("");
  const [priority, setPriority] = useState("");
  const [membersIds, setMembersIds] = useState<string[]>([]);

  const dispatch = useAppDispatch();
  const { projectId } = useParams<{ projectId: string }>();
  const { users } = useAppSelector((state: RootState) => state.userReducer);

  useEffect(() => {
    dispatch(getUsersAction());
  }, [dispatch]);

  // Utility function to handle Firebase timestamp conversion
  const parseFirebaseTimestamp = (timestamp: Date | { _seconds: number; _nanoseconds: number } | string): Date => {
    if (typeof timestamp === 'object' && '_seconds' in timestamp) {
      return new Date(timestamp._seconds * 1000);
    }
    return new Date(timestamp as string);
  };

  // Initialize form with task data if in edit mode
  useEffect(() => {
    if (isEditMode && task) {
      setSubject(task.subject || "");
      setCode(task.code || "");
      setStatus(task.status || "");
      setDuration(task.duration ? parseFirebaseTimestamp(task.duration).toISOString().split('T')[0] : "");
      setPriority(task.priority || "");
      setMembersIds(task.assignTo || []);
    }
  }, [isEditMode, task]);

  const handleSubmitTask = () => {
    if (!projectId) {
      return;
    }

    const taskData: ITask = {
      id: isEditMode && task ? task.id : "", // Use existing ID for edit mode
      subject,
      code,
      status,
      duration: duration ? new Date(duration) : new Date(),
      priority,
      assignTo: membersIds,
      projectId,
      createdAt: isEditMode && task ? task.createdAt : new Date(),
      updatedAt: new Date(),
    };

    if (isEditMode) {
      dispatch(updateTaskAction(taskData));
    } else {
      dispatch(addTaskAction(taskData));
    }
    
    // Reset form and close modal
    setSubject("");
    setCode("");
    setStatus("");
    setDuration("");
    setPriority("");
    setMembersIds([]);
    onClose?.();
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    switch (name) {
      case "subject":
        setSubject(value);
        break;
      case "code":
        setCode(value);
        break;
      case "duration":
        setDuration(value);
        break;
      default:
        break;
    }
  };

  const handlePriorityChange = (event: SelectChangeEvent) => {
    setPriority(event.target.value);
  };

  const handleStatusChange = (event: SelectChangeEvent) => {
    setStatus(event.target.value);
  };

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 200,
      },
    },
  };

  const handleMembersChange = (event: SelectChangeEvent<typeof membersIds>) => {
    const { value } = event.target;
    setMembersIds(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  const handleClose = () => {
    // Reset form when closing
    setSubject("");
    setCode("");
    setStatus("");
    setDuration("");
    setPriority("");
    setMembersIds([]);
    onClose?.();
  };

  return (
    <Box
      sx={(theme) => ({
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        backgroundColor: theme.palette.background.paper,
        p: 4,
        boxShadow: theme.shadows[6],
        borderRadius: "24px",
      })}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography sx={{ fontWeight: "bold" }}>
          {isEditMode ? "Edit task" : "Add task"}
        </Typography>
        <IconButton onClick={handleClose}>
          <Crossicon />
        </IconButton>
      </Box>
      <Box
        sx={{
          height: "80%",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box>
          <Box sx={{ width: "100%", paddingTop: "16px" }}>
            <Typography
              color="secondary"
              sx={{ fontWeight: "bold", fontSize: "14px" }}
            >
              Task Name
            </Typography>
            <TextField
              sx={{ width: "100%" }}
              placeholder="Enter Task Name"
              name="subject"
              value={subject}
              onChange={handleChange}
            />
          </Box>
          <Box sx={{ width: "100%", paddingTop: "16px" }}>
            <Typography
              color="secondary"
              sx={{ fontWeight: "bold", fontSize: "14px" }}
            >
              Task Code
            </Typography>
            <TextField
              sx={{ width: "100%" }}
              placeholder="Enter Task Code"
              name="code"
              value={code}
              onChange={handleChange}
            />
          </Box>
        </Box>
        <Box sx={{ display: "flex", gap: "16px" }}>
          <Box sx={{ width: "100%", paddingTop: "16px" }}>
            <Typography
              color="secondary"
              sx={{ fontWeight: "bold", fontSize: "14px" }}
            >
              Time Spend
            </Typography>
            <Box
              component="input"
              type="datetime-local"
              name="duration"
              value={duration}
              onChange={handleChange}
              min={new Date().toISOString().slice(0, 16)}
              sx={(theme) => ({
                width: "100%",
                height: "56px",
                padding: "0 14px",
                border: `1px solid ${theme.palette.grey[300]}`,
                borderRadius: "14px",
                fontSize: "14px",
                fontFamily: '"Nunito Sans", sans-serif',
                color: theme.palette.text.primary,
                outline: "none",
                backgroundColor: theme.palette.background.paper,
                boxSizing: "border-box",
                margin: 0,
                "&:focus": {
                  borderColor: theme.palette.primary.main,
                },
                "&:hover": {
                  borderColor: theme.palette.grey[400],
                },
              })}
            />
          </Box>
          <Box sx={{ width: "100%", paddingTop: "16px" }}>
            <Typography
              color="secondary"
              sx={{ fontWeight: "bold", fontSize: "14px" }}
            >
              Priority
            </Typography>
            <FormControl sx={{ width: "100%" }}>
              <Select
                value={priority}
                onChange={handlePriorityChange}
                displayEmpty
                input={<OutlinedInput />}
                sx={{ width: "100%" }}
              >
                <MenuItem value="">
                  <em>Select Priority</em>
                </MenuItem>
                <MenuItem value="Low">Low</MenuItem>
                <MenuItem value="Medium">Medium</MenuItem>
                <MenuItem value="High">High</MenuItem>
                <MenuItem value="Critical">Critical</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>
        <Box>
          <Box sx={{ width: "100%", paddingTop: "16px" }}>
            <Typography
              color="secondary"
              sx={{ fontWeight: "bold", fontSize: "14px" }}
            >
              Status
            </Typography>
            <FormControl sx={{ width: "100%" }}>
              <Select
                value={status}
                onChange={handleStatusChange}
                displayEmpty
                input={<OutlinedInput />}
                sx={{ width: "100%" }}
              >
                <MenuItem value="">
                  <em>Select Status</em>
                </MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="todo">Todo</MenuItem>
                <MenuItem value="review">Review</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Box sx={{ width: "100%", paddingTop: "16px" }}>
            <Typography color="secondary" sx={{ fontWeight: "bold" }}>
              Team Members
            </Typography>
            <FormControl sx={{ width: "100%" }}>
              <InputLabel>Team Members</InputLabel>
              <Select
                multiple
                value={membersIds}
                onChange={handleMembersChange}
                input={<OutlinedInput label="Team Members" />}
                renderValue={(selected) => (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip
                        key={value}
                        label={
                          users.find((user) => user.id === value)?.name ?? ""
                        }
                      />
                    ))}
                  </Box>
                )}
                MenuProps={MenuProps}
                name="membersIds"
              >
                {users.map((user) => (
                  <MenuItem key={user.id} value={user.id}>
                    {user.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <Button variant="contained" onClick={handleSubmitTask}>
            {isEditMode ? "Update Task" : "Add Task"}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};
/* elm/card/main */

export default TaskForm;
