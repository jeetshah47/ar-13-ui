import { useEffect } from "react";
import * as React from "react";
import { useParams } from "react-router";
import { useFormik } from "formik";
import * as Yup from "yup";
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
  OutlinedInput,
  Button,
  Autocomplete,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import Crossicon from "../../../assets/icons/general/close/blue.svg?react";
import {
  useAppDispatch,
  useAppSelector,
  type RootState,
} from "../../../store/store";
import { getUsersAction } from "../../../store/features/user/userAction";
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

// Validation schema
const taskValidationSchema = Yup.object({
  subject: Yup.string()
    .trim()
    .required("Task name is required")
    .min(1, "Task name cannot be empty"),
  code: Yup.string()
    .trim()
    .required("Task code is required")
    .min(1, "Task code cannot be empty"),
  startDate: Yup.string()
    .required("Start date is required"),
  endDate: Yup.string()
    .required("End date is required")
    .test(
      "is-after-start",
      "End date must be after start date",
      function (value) {
        const { startDate } = this.parent;
        if (!startDate || !value) return true;
        const start = new Date(startDate + "T00:00:00");
        const end = new Date(value + "T23:59:59");
        return end >= start;
      }
    ),
  deadline: Yup.string()
    .required("Deadline is required")
    .test(
      "is-after-start",
      "Deadline must be after start date",
      function (value) {
        const { startDate } = this.parent;
        if (!startDate || !value) return true;
        const start = new Date(startDate + "T00:00:00");
        const deadlineDate = new Date(value + "T23:59:59");
        return deadlineDate >= start;
      }
    ),
  status: Yup.string(),
  priority: Yup.string(),
  description: Yup.string(),
  assignTo: Yup.string().nullable(),
});

const TaskForm = ({ onClose, task, isEditMode = false }: TaskFormProps) => {
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("lg"));

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

  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const formik = useFormik({
    initialValues: {
      subject: isEditMode && task ? task.subject || "" : "",
      code: isEditMode && task ? task.code || "" : "",
      status: isEditMode && task ? task.status || "" : "todo",
      startDate: isEditMode && task && task.startDate 
        ? (typeof task.startDate === 'string' ? task.startDate.split('T')[0] : new Date(task.startDate).toISOString().split('T')[0])
        : "",
      endDate: isEditMode && task && task.endDate
        ? (typeof task.endDate === 'string' ? task.endDate.split('T')[0] : new Date(task.endDate).toISOString().split('T')[0])
        : "",
      deadline: isEditMode && task && task.deadline
        ? (typeof task.deadline === 'string' ? task.deadline.split('T')[0] : parseFirebaseTimestamp(task.deadline).toISOString().split('T')[0])
        : "",
      priority: isEditMode && task ? task.priority || "" : "high",
      description: isEditMode && task ? task.description || "" : "",
      assignTo: isEditMode && task ? (typeof task.assignTo === 'object' && task.assignTo !== null ? task.assignTo.id : task.assignTo) || null : null,
    },
    validationSchema: taskValidationSchema,
    validateOnChange: true,
    validateOnBlur: true,
    enableReinitialize: true,
    onSubmit: async (values) => {
      if (isSubmitting) return;
      
      if (!projectId) {
        toast.error(MSG_PROJECT_ID_REQUIRED);
        return;
      }

      // Permission checks - Admins have full access, skip checks for them
      if (!isAdmin()) {
        if (isEditMode && task) {
          // For editing: user must be assigned to the task
          const taskResponse: TaskResponse = {
            id: task.id || "",
            subject: task.subject,
            code: task.code,
            status: task.status,
            deadline: typeof task.deadline === 'string' 
              ? task.deadline 
              : (task.deadline && typeof task.deadline === 'object' && 'toISOString' in task.deadline
                  ? (task.deadline as Date).toISOString() 
                  : parseFirebaseTimestamp(task.deadline as string | { _seconds: number; _nanoseconds: number }).toISOString()),
            priority: task.priority,
            assignTo: typeof task.assignTo === 'object' && task.assignTo !== null ? task.assignTo : null,
            assignDetails: [],
            projectId: task.projectId,
            description: task.description || '',
            fileAttachments: task.fileAttachments || [],
            activityLogs: task.activityLogs || [],
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

      setIsSubmitting(true);

      // Format dates to ISO strings
      const startDateISO = values.startDate ? new Date(values.startDate + "T00:00:00").toISOString() : "";
      const endDateISO = values.endDate ? new Date(values.endDate + "T23:59:59").toISOString() : "";
      const deadlineISO = values.deadline ? new Date(values.deadline + "T23:59:59").toISOString() : "";

      const taskData: ITask = {
        id: isEditMode && task ? task.id : undefined,
        subject: values.subject.trim(),
        code: values.code.trim(),
        status: values.status || "todo",
        startDate: startDateISO,
        endDate: endDateISO,
        deadline: deadlineISO,
        priority: values.priority ? values.priority.toLowerCase() : "high",
        projectId,
        progress: isEditMode && task && task.progress !== undefined ? task.progress : 0,
        assignTo: values.assignTo,
        description: values.description.trim(),
        timeSpent: isEditMode && task && task.timeSpent ? task.timeSpent : [],
        fileAttachments: isEditMode && task && task.fileAttachments ? task.fileAttachments : [],
        activityLogs: isEditMode && task && task.activityLogs ? task.activityLogs : [],
      };

      try {
        if (isEditMode) {
          await dispatch(updateTaskAction(taskData));
        } else {
          await dispatch(addTaskAction(taskData));
        }
        
        formik.resetForm();
        onClose?.();
      } catch {
        // Error is already handled by the action with toast
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const handleClose = () => {
    formik.resetForm();
    onClose?.();
  };

  const selectedUser = users.find(user => user.id === formik.values.assignTo) || null;

  return (
    <Box
      sx={(theme) => ({
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        backgroundColor: theme.palette.background.paper,
        p: { xs: 2, sm: 3, md: 3, lg: 4 },
        boxShadow: theme.shadows[6],
        borderRadius: "24px",
        width: { xs: "90%", sm: "85%", md: "80%", lg: "auto" },
        maxWidth: { xs: "100%", sm: "600px", md: "700px", lg: "800px" },
        maxHeight: { xs: "90vh", sm: "85vh", md: "85vh", lg: "90vh" },
        overflow: "auto",
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
          height: { xs: "auto", sm: "75%", md: "75%", lg: "80%" },
          maxHeight: { xs: "none", sm: "70vh", md: "70vh", lg: "75vh" },
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
              value={formik.values.subject}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={Boolean(formik.touched.subject && formik.errors.subject)}
              helperText={formik.touched.subject && formik.errors.subject}
              required
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
              value={formik.values.code}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={Boolean(formik.touched.code && formik.errors.code)}
              helperText={formik.touched.code && formik.errors.code}
              required
            />
          </Box>
          <Box sx={{ width: "100%", paddingTop: "16px" }}>
            <Typography
              color="secondary"
              sx={{ fontWeight: "bold", fontSize: "14px" }}
            >
              Description
            </Typography>
            <TextField
              sx={{ width: "100%" }}
              placeholder="Enter Task Description"
              name="description"
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              multiline
              rows={4}
            />
          </Box>
        </Box>
        <Box sx={{ display: "flex", gap: { xs: "12px", sm: "14px", md: "14px", lg: "16px" }, flexWrap: "wrap" }}>
          <Box sx={{ width: { xs: "100%", sm: "100%", md: "calc(50% - 7px)", lg: "calc(33.333% - 11px)" }, minWidth: { xs: "100%", sm: "100%", md: "200px", lg: "200px" }, flex: { xs: "1 1 100%", sm: "1 1 100%", md: "1 1 calc(50% - 7px)", lg: 1 }, paddingTop: "16px" }}>
            <Typography
              color="secondary"
              sx={{ fontWeight: "bold", fontSize: "14px" }}
            >
              Start Date
            </Typography>
            <TextField
              sx={{ width: "100%" }}
              type="date"
              name="startDate"
              value={formik.values.startDate}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={Boolean(formik.touched.startDate && formik.errors.startDate)}
              helperText={formik.touched.startDate && formik.errors.startDate}
              required
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Box>
          <Box sx={{ width: { xs: "100%", sm: "100%", md: "calc(50% - 7px)", lg: "calc(33.333% - 11px)" }, minWidth: { xs: "100%", sm: "100%", md: "200px", lg: "200px" }, flex: { xs: "1 1 100%", sm: "1 1 100%", md: "1 1 calc(50% - 7px)", lg: 1 }, paddingTop: "16px" }}>
            <Typography
              color="secondary"
              sx={{ fontWeight: "bold", fontSize: "14px" }}
            >
              End Date
            </Typography>
            <TextField
              sx={{ width: "100%" }}
              type="date"
              name="endDate"
              value={formik.values.endDate}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={Boolean(formik.touched.endDate && formik.errors.endDate)}
              helperText={formik.touched.endDate && formik.errors.endDate}
              required
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{
                min: formik.values.startDate || undefined,
              }}
            />
          </Box>
          <Box sx={{ width: { xs: "100%", sm: "100%", md: "calc(50% - 7px)", lg: "calc(33.333% - 11px)" }, minWidth: { xs: "100%", sm: "100%", md: "200px", lg: "200px" }, flex: { xs: "1 1 100%", sm: "1 1 100%", md: "1 1 calc(50% - 7px)", lg: 1 }, paddingTop: "16px" }}>
            <Typography
              color="secondary"
              sx={{ fontWeight: "bold", fontSize: "14px" }}
            >
              Deadline
            </Typography>
            <TextField
              sx={{ width: "100%" }}
              type="date"
              name="deadline"
              value={formik.values.deadline}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={Boolean(formik.touched.deadline && formik.errors.deadline)}
              helperText={formik.touched.deadline && formik.errors.deadline}
              required
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{
                min: formik.values.startDate || undefined,
              }}
            />
          </Box>
        </Box>
        <Box sx={{ display: "flex", gap: { xs: "12px", sm: "14px", md: "14px", lg: "16px" }, flexWrap: { xs: "wrap", sm: "wrap", md: "nowrap", lg: "nowrap" } }}>
          <Box sx={{ width: { xs: "100%", sm: "100%", md: "50%", lg: "50%" }, paddingTop: "16px" }}>
            <Typography
              color="secondary"
              sx={{ fontWeight: "bold", fontSize: "14px" }}
            >
              Priority
            </Typography>
            <FormControl sx={{ width: "100%" }}>
              <Select
                name="priority"
                value={formik.values.priority}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                displayEmpty
                input={<OutlinedInput />}
                sx={{ width: "100%" }}
              >
                <MenuItem value="">
                  <em>Select Priority</em>
                </MenuItem>
                <MenuItem value="low">Low</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="high">High</MenuItem>
                <MenuItem value="critical">Critical</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>
        <Box sx={{ display: "flex", gap: { xs: "0", sm: "0", md: "16px", lg: "16px" }, flexWrap: { xs: "wrap", sm: "wrap", md: "nowrap", lg: "nowrap" } }}>
          <Box sx={{ width: { xs: "100%", sm: "100%", md: "50%", lg: "50%" }, paddingTop: "16px" }}>
            <Typography
              color="secondary"
              sx={{ fontWeight: "bold", fontSize: "14px" }}
            >
              Status
            </Typography>
            <FormControl sx={{ width: "100%" }}>
              <Select
                name="status"
                value={formik.values.status}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                displayEmpty
                input={<OutlinedInput />}
                sx={{ width: "100%" }}
              >
                <MenuItem value="">
                  <em>Select Status</em>
                </MenuItem>
                <MenuItem value="todo">Todo</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="review">Review</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Box sx={{ width: { xs: "100%", sm: "100%", md: "50%", lg: "50%" }, paddingTop: "16px" }}>
            <Typography color="secondary" sx={{ fontWeight: "bold" }}>
              Assign To
            </Typography>
            <Autocomplete
              options={users}
              getOptionLabel={(option) => option.name}
              value={selectedUser}
              onChange={(_, newValue) => {
                formik.setFieldValue("assignTo", newValue?.id || null);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Select user to assign"
                  onBlur={formik.handleBlur}
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
          <Box sx={{ width: { xs: "100%", sm: "100%", md: "100%", lg: "100%" }, paddingTop: "16px" }}>
            <Button 
              variant="contained" 
              onClick={() => formik.handleSubmit()}
              disabled={isSubmitting || !formik.values.subject.trim() || !formik.values.code.trim() || !formik.values.startDate || !formik.values.endDate || !formik.values.deadline}
              fullWidth={!isLargeScreen}
              sx={{ 
                width: { xs: "100%", sm: "100%", md: "100%", lg: "auto" },
                minWidth: { lg: "150px" }
              }}
            >
              {isSubmitting ? "Submitting..." : isEditMode ? "Update Task" : "Add Task"}
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
/* elm/card/main */

export default TaskForm;
