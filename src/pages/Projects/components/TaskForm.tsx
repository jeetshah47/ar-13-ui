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
import toast from "react-hot-toast";
import { useResourceAccess } from "../../../store/hooks/useResourceAccess";
import { usePermissions } from "../../../store/hooks/usePermissions";
import type { TaskResponse } from "../../../store/types/Task/TaskResponse";
import {
  MSG_CANNOT_MODIFY_TASK,
  MSG_CANNOT_MODIFY_PROJECT,
  MSG_PROJECT_ID_REQUIRED,
} from "../../../constants/messages";

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
  const [memberId, setMemberId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const dispatch = useAppDispatch();
  const { projectId: projectIdFromParams } = useParams<{ projectId: string }>();
  const { users } = useAppSelector((state: RootState) => state.userReducer);
  const projectIdFromRedux = useAppSelector(
    (state: RootState) => state.projectListReducer.common.selectedProjectId
  );
  const projects = useAppSelector((state: RootState) => state.projectListReducer.api.data.projects || []);
  const { canModifyProject, canModifyTask } = useResourceAccess();
  const { isAdmin } = usePermissions();
  
  // Use projectId from URL params if available, otherwise use Redux state
  const projectId = projectIdFromParams || projectIdFromRedux;
  
  // Get project details for permission checking
  const project = projects.find(p => p.id === projectId);

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
      setDuration(task.deadline ? parseFirebaseTimestamp(task.deadline).toISOString().split('T')[0] : "");
      setPriority(task.priority || "");
      setMemberId(task.assignTo || null);
    }
  }, [isEditMode, task]);

  const handleSubmitTask = async () => {
    if (isSubmitting) return; // Prevent double submission
    
    if (!projectId) {
      toast.error(MSG_PROJECT_ID_REQUIRED);
      return;
    }

    // Permission checks - Admins have full access, skip checks for them
    if (!isAdmin()) {
      if (isEditMode && task) {
        // For editing: user must be assigned to the task
        // Convert task to TaskResponse format for permission check
        const taskResponse: TaskResponse = {
          id: task.id,
          subject: task.subject,
          code: task.code,
          status: task.status,
          deadline: typeof task.deadline === 'string' 
            ? task.deadline 
            : (task.deadline instanceof Date 
                ? task.deadline.toISOString() 
                : parseFirebaseTimestamp(task.deadline).toISOString()),
          priority: task.priority,
          assignTo: task.assignTo,
          assignDetails: [],
          projectId: task.projectId,
          description: '',
          fileAttachments: [],
          activityLogs: [],
        };
        
        if (!canModifyTask(taskResponse)) {
          toast.error(MSG_CANNOT_MODIFY_TASK);
          return;
        }
      } else {
        // For creating: user must be a member of the project
        if (project && !canModifyProject(project)) {
          toast.error(MSG_CANNOT_MODIFY_PROJECT);
          return;
        }
      }
    }

    // Basic validation
    if (!subject.trim()) {
      toast.error("Please enter a task name");
      return;
    }

    if (!code.trim()) {
      toast.error("Please enter a task code");
      return;
    }

    setIsSubmitting(true);

    const taskData: ITask = {
      id: isEditMode && task ? task.id : "", // Use existing ID for edit mode
      subject: subject.trim(),
      code: code.trim(),
      status: status || "pending",
      deadline: duration ? new Date(duration) : new Date(),
      priority: priority || "Medium",
      assignTo: memberId,
      projectId,
      createdAt: isEditMode && task ? task.createdAt : new Date(),
      updatedAt: new Date(),
    };

    try {
      if (isEditMode) {
        await dispatch(updateTaskAction(taskData));
      } else {
        await dispatch(addTaskAction(taskData));
      }
      
      // Only reset form and close modal on success
      setSubject("");
      setCode("");
      setStatus("");
      setDuration("");
      setPriority("");
      setMemberId(null);
      onClose?.();
    } catch {
      // Error is already handled by the action with toast
      // Don't close modal on error so user can see the error message
    } finally {
      setIsSubmitting(false);
    }
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

  const handleMemberChange = (event: SelectChangeEvent<string>) => {
    const { value } = event.target;
    setMemberId(value || null);
  };

  const handleClose = () => {
    // Reset form when closing
    setSubject("");
    setCode("");
    setStatus("");
    setDuration("");
    setPriority("");
    setMemberId(null);
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
              Assign To
            </Typography>
            <FormControl sx={{ width: "100%" }}>
              <InputLabel>Assign To</InputLabel>
              <Select
                value={memberId || ""}
                onChange={handleMemberChange}
                displayEmpty
                input={<OutlinedInput label="Assign To" />}
                MenuProps={MenuProps}
                name="memberId"
              >
                <MenuItem value="">
                  <em>Unassigned</em>
                </MenuItem>
                {users.map((user) => (
                  <MenuItem key={user.id} value={user.id}>
                    {user.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <Button 
            variant="contained" 
            onClick={handleSubmitTask}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : isEditMode ? "Update Task" : "Add Task"}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};
/* elm/card/main */

export default TaskForm;
