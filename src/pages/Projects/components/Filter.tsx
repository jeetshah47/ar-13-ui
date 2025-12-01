import {
  Avatar,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Typography,
  Portal,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { DateRangePicker } from "../../../common/components/DateRangePicker/DateRangePicker";
import { useState, useEffect, useMemo } from "react";
import type { TaskResponse } from "../../../store/types/Task/TaskResponse";
import type { TaskStatus } from "../../../store/types/Task/TaskTypes";
import type { UserResponse } from "../../../store/types/User/UserResponse";

type FilterProps = {
  onClose: () => void;
  tasks: TaskResponse[];
  taskStatuses: TaskStatus[];
  onApplyFilters: (filters: FilterState) => void;
};

export interface FilterState {
  selectedStatuses: string[];
  selectedAssignees: string[];
  dateRange: {
    startDate: Date | null;
    endDate: Date | null;
  };
}

const Filter = ({ onClose, tasks, taskStatuses, onApplyFilters }: FilterProps) => {
  // Extract unique assignees from tasks
  const uniqueAssignees = useMemo(() => {
    const assigneeMap = new Map<string, { id: string; name: string; avatar?: string }>();
    
    tasks.forEach((task) => {
      // Add assignTo if exists
      if (task.assignTo) {
        assigneeMap.set(task.assignTo.id, {
          id: task.assignTo.id,
          name: task.assignTo.name,
        });
      }
      
      // Add assignDetails if exists
      if (task.assignDetails && Array.isArray(task.assignDetails)) {
        task.assignDetails.forEach((user: UserResponse) => {
          if (!assigneeMap.has(user.id)) {
            assigneeMap.set(user.id, {
              id: user.id,
              name: user.name,
            });
          }
        });
      }
    });
    
    return Array.from(assigneeMap.values()).sort((a, b) => 
      a.name.localeCompare(b.name)
    );
  }, [tasks]);

  // Initialize task statuses state - all checked by default
  const [taskStatusState, setTaskStatusState] = useState<Array<{ value: string; checked: boolean; label: string }>>(() => {
    return taskStatuses.map((status) => ({
      value: status.value,
      checked: true,
      label: status.displayName,
    }));
  });

  // Initialize assignees state - all checked by default
  const [assigneesState, setAssigneesState] = useState<Array<{ id: string; checked: boolean; name: string }>>(() => {
    return uniqueAssignees.map((assignee) => ({
      id: assignee.id,
      checked: true,
      name: assignee.name,
    }));
  });

  // Date range state
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  // Update task statuses when they change
  useEffect(() => {
    setTaskStatusState(
      taskStatuses.map((status) => {
        const existing = taskStatusState.find((s) => s.value === status.value);
        return {
          value: status.value,
          checked: existing?.checked ?? true,
          label: status.displayName,
        };
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskStatuses]);

  // Update assignees when they change
  useEffect(() => {
    setAssigneesState(
      uniqueAssignees.map((assignee) => {
        const existing = assigneesState.find((a) => a.id === assignee.id);
        return {
          id: assignee.id,
          checked: existing?.checked ?? true,
          name: assignee.name,
        };
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uniqueAssignees]);

  const handleChangeStatusState = (statusValue: string) => {
    setTaskStatusState((prev) =>
      prev.map((status) =>
        status.value === statusValue
          ? { ...status, checked: !status.checked }
          : status
      )
    );
  };

  const handleChangeAssigneesState = (assigneeId: string) => {
    setAssigneesState((prev) =>
      prev.map((assignee) =>
        assignee.id === assigneeId
          ? { ...assignee, checked: !assignee.checked }
          : assignee
      )
    );
  };

  const handleSaveFilters = () => {
    // Only include statuses if not all are selected (to avoid unnecessary filtering)
    const allStatusesSelected = taskStatusState.every((status) => status.checked);
    const selectedStatusValues = allStatusesSelected
      ? []
      : taskStatusState
          .filter((status) => status.checked)
          .map((status) => status.value);
    
    // Only include assignees if not all are selected
    const allAssigneesSelected = assigneesState.every((assignee) => assignee.checked);
    const selectedAssigneeIds = allAssigneesSelected
      ? []
      : assigneesState
          .filter((assignee) => assignee.checked)
          .map((assignee) => assignee.id);

    onApplyFilters({
      selectedStatuses: selectedStatusValues,
      selectedAssignees: selectedAssigneeIds,
      dateRange: {
        startDate,
        endDate,
      },
    });

    onClose();
  };

  const handleCrossClick = () => {
    onClose();
  };

  // Calculate filtered count
  const filteredCount = useMemo(() => {
    const allStatusesSelected = taskStatusState.every((status) => status.checked);
    const selectedStatusValues = allStatusesSelected
      ? []
      : taskStatusState
          .filter((status) => status.checked)
          .map((status) => status.value);
    
    const allAssigneesSelected = assigneesState.every((assignee) => assignee.checked);
    const selectedAssigneeIds = allAssigneesSelected
      ? []
      : assigneesState
          .filter((assignee) => assignee.checked)
          .map((assignee) => assignee.id);

    return tasks.filter((task) => {
      // Filter by status - compare task.status with status.value
      if (selectedStatusValues.length > 0 && !selectedStatusValues.includes(task.status)) {
        return false;
      }

      // Filter by assignee
      if (selectedAssigneeIds.length > 0) {
        const taskAssigneeIds: string[] = [];
        if (task.assignTo) {
          taskAssigneeIds.push(task.assignTo.id);
        }
        if (task.assignDetails && Array.isArray(task.assignDetails)) {
          task.assignDetails.forEach((user: UserResponse) => {
            if (!taskAssigneeIds.includes(user.id)) {
              taskAssigneeIds.push(user.id);
            }
          });
        }
        
        const hasMatchingAssignee = taskAssigneeIds.some((id) =>
          selectedAssigneeIds.includes(id)
        );
        if (!hasMatchingAssignee) {
          return false;
        }
      }

      // Filter by date range
      if (startDate || endDate) {
        if (!task.deadline) {
          return false;
        }
        const taskDate = new Date(task.deadline);
        if (startDate && taskDate < startDate) {
          return false;
        }
        if (endDate && taskDate > endDate) {
          return false;
        }
      }

      return true;
    }).length;
  }, [tasks, taskStatusState, assigneesState, startDate, endDate]);

  return (
    <Portal>
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: "100vw",
          height: "100vh",
          minWidth: "100vw",
          minHeight: "100vh",
          maxWidth: "100vw",
          maxHeight: "100vh",
          zIndex: 1300,
          backgroundColor: "rgba(33, 85, 163, 0.16)",
          justifyContent: "flex-end",
          display: "flex",
          overflow: "hidden",
          margin: 0,
          padding: 0,
        }}
        onClick={handleCrossClick}
      >
        <Box
          onClick={(e) => e.stopPropagation()}
          sx={{
            width: { xs: "90%", sm: "413px" },
            maxWidth: "413px",
            backgroundColor: "#FFFFFF",
            boxShadow: "0px 6px 58px rgba(121, 145, 173, 0.2)",
            borderRadius: "24px",
            margin: 0,
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          {/* Header - Fixed */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "30px",
              flexShrink: 0,
            }}
          >
            <Typography fontWeight={"bold"} variant="h5">
              Filters
            </Typography>
            <Box
              onClick={handleCrossClick}
              sx={{
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "32px",
                height: "32px",
                borderRadius: "8px",
                "&:hover": {
                  backgroundColor: "rgba(0, 0, 0, 0.04)",
                },
              }}
            >
              <CloseIcon sx={{ fontSize: "20px", color: "text.primary" }} />
            </Box>
          </Box>
          
          {/* Scrollable Content Area */}
          <Box
            sx={{
              flex: 1,
              overflowY: "auto",
              overflowX: "hidden",
              "&::-webkit-scrollbar": {
                width: "6px",
              },
              "&::-webkit-scrollbar-thumb": {
                background: "#e1dcdc",
                borderRadius: "10px",
              },
              "&::-webkit-scrollbar-track": {
                background: "transparent",
              },
            }}
          >
          <Box
            sx={{
              padding: "22px 30px",
              borderBottom: "1px solid #E4E6E8",
              borderTop: "1px solid #E4E6E8",
            }}
          >
            <Box>
              <Typography fontWeight={"bold"} color="secondary.main" sx={{ mb: "10px" }}>
                Period
              </Typography>
              <DateRangePicker
                endDate={endDate}
                startDate={startDate}
                setEndDate={setEndDate}
                setStartDate={setStartDate}
              />
            </Box>
          </Box>
          <Box sx={{ padding: "22px 30px" }}>
            <Typography fontWeight={"bold"} color="secondary.main" sx={{ mb: "5px" }}>
              Task Group
            </Typography>
            <Box sx={{ paddingTop: "5px" }}>
              {taskStatusState.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  No task statuses available
                </Typography>
              ) : (
                taskStatusState.map((status) => (
                  <Box key={status.value}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={status.checked}
                          onChange={() => handleChangeStatusState(status.value)}
                        />
                      }
                      label={status.label}
                    />
                  </Box>
                ))
              )}
            </Box>
          </Box>
          <Box sx={{ padding: "22px 30px" }}>
            <Typography fontWeight={"bold"} color="secondary.main" sx={{ mb: "5px" }}>
              Assignees
            </Typography>
            <Box sx={{ paddingTop: "5px" }}>
              {assigneesState.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  No assignees available
                </Typography>
              ) : (
                assigneesState.map((assignee) => {
                  return (
                    <Box
                      key={assignee.id}
                      sx={{ display: "flex", alignItems: "center", gap: "6px", mb: "4px" }}
                    >
                      <Avatar
                        sx={{
                          width: "24px",
                          height: "24px",
                          fontSize: "12px",
                          bgcolor: "primary.main",
                        }}
                      >
                        {assignee.name.charAt(0).toUpperCase()}
                      </Avatar>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={assignee.checked}
                            onChange={() => handleChangeAssigneesState(assignee.id)}
                          />
                        }
                        label={assignee.name}
                        sx={{ margin: 0 }}
                      />
                    </Box>
                  );
                })
              )}
            </Box>
          </Box>
        </Box>
          
        {/* Footer - Fixed */}
        <Box
            sx={{
              padding: "22px 30px",
              flexShrink: 0,
              borderTop: "1px solid #E4E6E8",
            }}
          >
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            {filteredCount > 0 && (
              <Typography variant="body2" color="text.secondary">
                {filteredCount} {filteredCount === 1 ? "match" : "matches"} found
              </Typography>
            )}
            <Button
              variant="contained"
              onClick={handleSaveFilters}
              sx={{ ml: "auto" }}
            >
              Save Filters
            </Button>
          </Box>
        </Box>
      </Box>
      </Box>
    </Portal>
  );
};

export default Filter;
