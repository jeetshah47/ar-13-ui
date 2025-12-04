import { useState, useEffect, useCallback } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { addMultipleTasksAction, getTaskListAction } from "../../../store/features/task/projectAction";
import type { ITask } from "../../../store/types/Task/Task";
import toast from "react-hot-toast";
import {
  Box,
  IconButton,
  Typography,
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Paper,
  FormControl,
  Select,
  MenuItem,
  OutlinedInput,
  Autocomplete,
  TextField,
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
import { getCategoriesWithTypesAction } from "../../../store/features/drawingList/drawingListActions";

interface DrawingItem {
  name: string;
  description: string;
  key: string;
  type: string;
}

interface DrawingTaskFormProps {
  onClose?: () => void;
}

// Validation schema
const drawingTaskValidationSchema = Yup.object({
  status: Yup.string(),
  priority: Yup.string(),
  startDate: Yup.string().required("Start date is required"),
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
  assignTo: Yup.string().nullable(),
});

const DrawingTaskForm = ({ onClose }: DrawingTaskFormProps) => {
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("lg"));
  
  const [leftList, setLeftList] = useState<DrawingItem[]>([]);
  const [rightList, setRightList] = useState<DrawingItem[]>([]);

  const dispatch = useAppDispatch();
  const { users } = useAppSelector((state: RootState) => state.userReducer);
  const projectId = useAppSelector(
    (state: RootState) => state.projectListReducer.common.selectedProjectId
  );
  const { categories, types } = useAppSelector(
    (state: RootState) => state.drawingListReducer
  );

  useEffect(() => {
    dispatch(getUsersAction());
    dispatch(getCategoriesWithTypesAction());
  }, [dispatch]);

  // Helper function to build drawings list from Redux data
  const buildDrawingsList = useCallback((): DrawingItem[] => {
    const allDrawings: DrawingItem[] = [];
    categories
      .filter((category) => category.isActive)
      .forEach((category) => {
        const categoryTypes = types.filter((type) => type.categoryId === category.id && type.isActive);
        categoryTypes.forEach((type) => {
          allDrawings.push({
            name: type.name,
            description: type.description || "",
            key: type.id,
            type: category.name,
          });
        });
      });
    return allDrawings;
  }, [categories, types]);

  const formik = useFormik({
    initialValues: {
      status: "todo",
      priority: "high",
      startDate: "",
      endDate: "",
      deadline: "",
      assignTo: null as string | null,
    },
    validationSchema: drawingTaskValidationSchema,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values) => {
      if (!projectId) {
        toast.error("Please select a project first");
        return;
      }

      if (rightList.length === 0) {
        toast.error("Please select at least one drawing");
        return;
      }

      // Format dates to ISO strings
      const startDateISO = values.startDate ? new Date(values.startDate + "T00:00:00").toISOString() : "";
      const endDateISO = values.endDate ? new Date(values.endDate + "T23:59:59").toISOString() : "";
      const deadlineISO = values.deadline ? new Date(values.deadline + "T23:59:59").toISOString() : "";

      const tasks: ITask[] = rightList.map((drawing) => {
        // Find the drawing type and category from Redux store
        const drawingType = types.find((type) => type.id === drawing.key);
        const drawingCategory = drawingType 
          ? categories.find((category) => category.id === drawingType.categoryId)
          : null;

        return {
          subject: drawing.name,
          code: `DWG-${drawing.key.toUpperCase()}`,
          status: values.status || "todo",
          startDate: startDateISO,
          endDate: endDateISO,
          deadline: deadlineISO,
          priority: values.priority ? values.priority.toLowerCase() : "high",
          assignTo: values.assignTo,
          projectId,
          progress: 0,
          description: "",
          timeSpent: [],
          fileAttachments: [],
          activityLogs: [],
          drawingId: drawing.key, // Drawing type UUID
          drawingInfo: drawingType && drawingCategory ? {
            typeId: drawingType.id,
            typeName: drawingType.name,
            categoryId: drawingCategory.id,
            categoryName: drawingCategory.name,
          } : undefined,
        };
      });

      try {
        await dispatch(addMultipleTasksAction(tasks));
        
        // Refresh task list after successful addition
        if (projectId) {
          dispatch(getTaskListAction(projectId));
        }
        
        // Reset form and close modal
        formik.resetForm();
        setRightList([]);
        
        // Reinitialize left list from Redux
        setLeftList(buildDrawingsList());
        onClose?.();
      } catch {
        // Error is already handled in the action with toast
      }
    },
  });

  // Update deadline when endDate changes
  useEffect(() => {
    if (formik.values.endDate) {
      const end = new Date(formik.values.endDate + "T23:59:59");
      formik.setFieldValue("deadline", end.toISOString().split('T')[0], false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formik.values.endDate]);

  // Initialize left list with all drawing items from Redux
  useEffect(() => {
    if (categories.length === 0 && types.length === 0) {
      return;
    }

    setLeftList(buildDrawingsList());
    setRightList([]);
  }, [categories, types, buildDrawingsList]);

  const handleToggle = (item: DrawingItem) => () => {
    const currentIndex = rightList.findIndex((i) => i.key === item.key);
    const newRightList = [...rightList];

    if (currentIndex === -1) {
      // Move to right
      newRightList.push(item);
      setRightList(newRightList);
      setLeftList(leftList.filter((i) => i.key !== item.key));
    } else {
      // Move to left
      setRightList(newRightList.filter((i) => i.key !== item.key));
      setLeftList([...leftList, item]);
    }
  };

  const handleMoveAll = (direction: "right" | "left") => () => {
    if (direction === "right") {
      setRightList([...rightList, ...leftList]);
      setLeftList([]);
    } else {
      setLeftList([...leftList, ...rightList]);
      setRightList([]);
    }
  };

  const handleClose = () => {
    // Reset form when closing
    formik.resetForm();
    setRightList([]);
    
    // Reinitialize left list from Redux
    setLeftList(buildDrawingsList());
    onClose?.();
  };

  const selectedUser = users.find(user => user.id === formik.values.assignTo) || null;

  const customList = (items: DrawingItem[], title: string) => (
    <Paper
      variant="outlined"
      sx={(theme) => ({
        width: "100%",
        height: "400px",
        overflow: "auto",
        backgroundColor: theme.palette.grey[50],
      })}
    >
      <Typography
        variant="subtitle2"
        sx={(theme) => ({
          p: 2,
          fontWeight: "bold",
          backgroundColor: theme.palette.background.paper,
          borderBottom: `1px solid ${theme.palette.divider}`,
        })}
      >
        {title} ({items.length})
      </Typography>
      <List dense component="div" role="list">
        {items.map((item) => {
          const labelId = `transfer-list-item-${item.key}-label`;
          return (
            <ListItem key={item.key} disablePadding>
              <ListItemButton
                role="listitem"
                onClick={handleToggle(item)}
                sx={(theme) => ({
                  borderBottom: `1px solid ${theme.palette.divider}`,
                  "&:hover": {
                    backgroundColor: theme.palette.action.hover,
                  },
                })}
              >
                <ListItemText
                  id={labelId}
                  primary={item.name}
                  secondary={
                    <>
                      <Typography component="span" variant="caption" color="text.secondary" display="block">
                        {item.type}
                      </Typography>
                      <Typography component="span" variant="caption" color="text.secondary" display="block">
                        {item.description}
                      </Typography>
                    </>
                  }
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Paper>
  );

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
        width: { xs: "90%", sm: "90%", md: "85%", lg: "90%" },
        maxWidth: { xs: "100%", sm: "800px", md: "900px", lg: "1000px" },
        maxHeight: { xs: "90vh", sm: "85vh", md: "85vh", lg: "90vh" },
        overflow: "auto",
      })}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography sx={{ fontWeight: "bold", fontSize: "20px" }}>
          Add Drawing Tasks
        </Typography>
        <IconButton onClick={handleClose}>
          <Crossicon />
        </IconButton>
      </Box>

      <Box sx={{ mb: { xs: 2, sm: 2, md: 2, lg: 3 } }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "column", md: "row", lg: "row" },
            gap: { xs: 2, sm: 2, md: 2, lg: 2 },
            alignItems: { xs: "stretch", sm: "stretch", md: "center", lg: "center" },
          }}
        >
          <Box sx={{ flex: { xs: "1", sm: "1", md: "0 1 50%", lg: "0 1 50%" } }}>
            <Typography
              color="secondary"
              sx={{ fontWeight: "bold", fontSize: "14px", mb: 1 }}
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
          <Box sx={{ flex: { xs: "1", sm: "1", md: "0 1 50%", lg: "0 1 50%" } }}>
            <Typography
              color="secondary"
              sx={{ fontWeight: "bold", fontSize: "14px", mb: 1 }}
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
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "column", md: "row", lg: "row" },
            gap: { xs: 2, sm: 2, md: 2, lg: 2 },
            alignItems: { xs: "stretch", sm: "stretch", md: "center", lg: "center" },
            mt: 2,
          }}
        >
          <Box sx={{ flex: { xs: "1", sm: "1", md: "0 1 50%", lg: "0 1 50%" } }}>
            <Typography
              color="secondary"
              sx={{ fontWeight: "bold", fontSize: "14px", mb: 1 }}
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
          <Box sx={{ flex: { xs: "1", sm: "1", md: "0 1 50%", lg: "0 1 50%" } }}>
            <Typography
              color="secondary"
              sx={{ fontWeight: "bold", fontSize: "14px", mb: 1 }}
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
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "column", md: "row", lg: "row" },
            gap: { xs: 2, sm: 2, md: 2, lg: 2 },
            alignItems: { xs: "stretch", sm: "stretch", md: "center", lg: "center" },
            mt: 2,
          }}
        >
          <Box sx={{ flex: { xs: "1", sm: "1", md: "0 1 50%", lg: "0 1 50%" } }}>
            <Typography
              color="secondary"
              sx={{ fontWeight: "bold", fontSize: "14px", mb: 1 }}
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
          <Box sx={{ flex: { xs: "1", sm: "1", md: "0 1 50%", lg: "0 1 50%" } }}>
            <Typography
              color="secondary"
              sx={{ fontWeight: "bold", fontSize: "14px", mb: 1 }}
            >
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
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "column", md: "row", lg: "row" },
          gap: { xs: 2, sm: 2, md: 2, lg: 2 },
          alignItems: { xs: "stretch", sm: "stretch", md: "center", lg: "center" },
        }}
      >
        <Box sx={{ flex: { xs: "1", sm: "1", md: "0 1 45%", lg: "0 1 45%" } }}>
          {customList(leftList, "Available Drawings")}
        </Box>
        <Box
          sx={{
            flex: { xs: "0 0 auto", sm: "0 0 auto", md: "0 1 10%", lg: "0 1 10%" },
            display: "flex",
            flexDirection: { xs: "row", sm: "row", md: "column", lg: "column" },
            alignItems: "center",
            justifyContent: "center",
            gap: { xs: 1, sm: 1, md: 0.5, lg: 0.5 },
          }}
        >
          <Button
            sx={{ my: 0.5 }}
            variant="outlined"
            size="small"
            onClick={handleMoveAll("right")}
            disabled={leftList.length === 0}
            aria-label="move all right"
          >
            ≫
          </Button>
          <Button
            sx={{ my: 0.5 }}
            variant="outlined"
            size="small"
            onClick={handleMoveAll("left")}
            disabled={rightList.length === 0}
            aria-label="move all left"
          >
            ≪
          </Button>
        </Box>
        <Box sx={{ flex: { xs: "1", sm: "1", md: "0 1 45%", lg: "0 1 45%" } }}>
          {customList(rightList, "Selected Drawings")}
        </Box>
      </Box>

      <Box sx={{ display: "flex", justifyContent: { xs: "stretch", sm: "stretch", md: "flex-end", lg: "flex-end" }, flexDirection: { xs: "column", sm: "column", md: "row", lg: "row" }, mt: { xs: 2, sm: 2, md: 3, lg: 3 }, gap: 2 }}>
        <Button 
          variant="outlined" 
          onClick={handleClose}
          fullWidth={!isLargeScreen}
          sx={{ width: { xs: "100%", sm: "100%", md: "auto", lg: "auto" } }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={() => formik.handleSubmit()}
          disabled={rightList.length === 0 || !formik.values.startDate || !formik.values.endDate || !formik.values.deadline}
          fullWidth={!isLargeScreen}
          sx={{ width: { xs: "100%", sm: "100%", md: "auto", lg: "auto" } }}
        >
          Add {rightList.length > 0 ? `${rightList.length} ` : ""}Task
          {rightList.length !== 1 ? "s" : ""}
        </Button>
      </Box>
    </Box>
  );
};

export default DrawingTaskForm;
