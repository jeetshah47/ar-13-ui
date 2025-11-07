import { useState, useEffect } from "react";
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
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  Chip,
} from "@mui/material";
import Crossicon from "../../../assets/icons/general/close/blue.svg?react";
import {
  useAppDispatch,
  useAppSelector,
  type RootState,
} from "../../../store/store";
import { getUsersAction } from "../../../store/features/user/userAction";
import type { SelectChangeEvent } from "@mui/material";
import { DRAWING_LIST } from "../constants/task.constants";

interface DrawingItem {
  name: string;
  description: string;
  key: string;
  type: string;
}

interface DrawingTaskFormProps {
  onClose?: () => void;
}

const DrawingTaskForm = ({ onClose }: DrawingTaskFormProps) => {
  const [leftList, setLeftList] = useState<DrawingItem[]>([]);
  const [rightList, setRightList] = useState<DrawingItem[]>([]);
  const [status, setStatus] = useState("");
  const [duration, setDuration] = useState("");
  const [priority, setPriority] = useState("");
  const [membersIds, setMembersIds] = useState<string[]>([]);

  const dispatch = useAppDispatch();
  const { users } = useAppSelector((state: RootState) => state.userReducer);
  const projectId = useAppSelector(
    (state: RootState) => state.projectListReducer.common.selectedProjectId
  );

  useEffect(() => {
    dispatch(getUsersAction());
  }, [dispatch]);

  // Initialize left list with all drawing items
  useEffect(() => {
    const allDrawings: DrawingItem[] = [];
    DRAWING_LIST.forEach((category) => {
      category.items.forEach((item) => {
        allDrawings.push({
          ...item,
          type: category.type,
        });
      });
    });
    setLeftList(allDrawings);
    setRightList([]);
  }, []);

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

  const handlePriorityChange = (event: SelectChangeEvent) => {
    setPriority(event.target.value);
  };

  const handleStatusChange = (event: SelectChangeEvent) => {
    setStatus(event.target.value);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    if (name === "duration") {
      setDuration(value);
    }
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
      typeof value === "string" ? value.split(",") : value
    );
  };

  const handleSubmit = async () => {
    if (!projectId) {
      toast.error("Please select a project first");
      return;
    }

    if (rightList.length === 0) {
      toast.error("Please select at least one drawing");
      return;
    }

    const tasks: ITask[] = rightList.map((drawing) => ({
      id: "",
      subject: drawing.name,
      code: `DWG-${drawing.key.toUpperCase()}`,
      status: status || "To Do",
      duration: duration ? new Date(duration) : new Date(),
      priority: priority || "Medium",
      assignTo: membersIds,
      projectId,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    try {
      await dispatch(addMultipleTasksAction(tasks));
      
      // Refresh task list after successful addition
      if (projectId) {
        dispatch(getTaskListAction(projectId));
      }
      
      // Reset form and close modal
      setStatus("");
      setDuration("");
      setPriority("");
      setMembersIds([]);
      setRightList([]);
      
      // Reinitialize left list
      const allDrawings: DrawingItem[] = [];
      DRAWING_LIST.forEach((category) => {
        category.items.forEach((item) => {
          allDrawings.push({
            ...item,
            type: category.type,
          });
        });
      });
      setLeftList(allDrawings);
      onClose?.();
    } catch {
      // Error is already handled in the action with toast
    }
  };

  const handleClose = () => {
    // Reset form when closing
    setStatus("");
    setDuration("");
    setPriority("");
    setMembersIds([]);
    setRightList([]);
    
    // Reinitialize left list
    const allDrawings: DrawingItem[] = [];
    DRAWING_LIST.forEach((category) => {
      category.items.forEach((item) => {
        allDrawings.push({
          ...item,
          type: category.type,
        });
      });
    });
    setLeftList(allDrawings);
    onClose?.();
  };

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
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        {item.type}
                      </Typography>
                      <br />
                      <Typography variant="caption" color="text.secondary">
                        {item.description}
                      </Typography>
                    </Box>
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
        p: 4,
        boxShadow: theme.shadows[6],
        borderRadius: "24px",
        width: "90%",
        maxWidth: "1000px",
        maxHeight: "90vh",
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

      <Box sx={{ mb: 3 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: 2,
            alignItems: { xs: "stretch", sm: "center" },
          }}
        >
          <Box sx={{ flex: { xs: "1", sm: "0 1 50%" } }}>
            <Typography
              color="secondary"
              sx={{ fontWeight: "bold", fontSize: "14px", mb: 1 }}
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
          <Box sx={{ flex: { xs: "1", sm: "0 1 50%" } }}>
            <Typography
              color="secondary"
              sx={{ fontWeight: "bold", fontSize: "14px", mb: 1 }}
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
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: 2,
            alignItems: { xs: "stretch", sm: "center" },
            mt: 2,
          }}
        >
          <Box sx={{ flex: { xs: "1", sm: "0 1 50%" } }}>
            <Typography
              color="secondary"
              sx={{ fontWeight: "bold", fontSize: "14px", mb: 1 }}
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
          <Box sx={{ flex: { xs: "1", sm: "0 1 50%" } }}>
            <Typography
              color="secondary"
              sx={{ fontWeight: "bold", fontSize: "14px", mb: 1 }}
            >
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
              >
                {users.map((user) => (
                  <MenuItem key={user.id} value={user.id}>
                    {user.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          gap: 2,
          alignItems: { xs: "stretch", sm: "center" },
        }}
      >
        <Box sx={{ flex: { xs: "1", sm: "0 1 45%" } }}>
          {customList(leftList, "Available Drawings")}
        </Box>
        <Box
          sx={{
            flex: { xs: "0 0 auto", sm: "0 1 10%" },
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
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
        <Box sx={{ flex: { xs: "1", sm: "0 1 45%" } }}>
          {customList(rightList, "Selected Drawings")}
        </Box>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3, gap: 2 }}>
        <Button variant="outlined" onClick={handleClose}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={rightList.length === 0}
        >
          Add {rightList.length > 0 ? `${rightList.length} ` : ""}Task
          {rightList.length !== 1 ? "s" : ""}
        </Button>
      </Box>
    </Box>
  );
};

export default DrawingTaskForm;
