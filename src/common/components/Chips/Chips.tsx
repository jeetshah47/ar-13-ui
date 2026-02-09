import { Box, Chip } from "@mui/material";
import { TASK_STATUSES_ARRAY, getStatusDisplayName, TASK_STATUS, normalizeTaskStatus, type TaskStatus } from "../../../pages/Projects/constants/taskStatus.constants";

type ChipsProps = {
  selected: string;
  onChange: (status: TaskStatus) => void;
};

const Chips = ({ selected, onChange }: ChipsProps) => {
  const colorMaps: Record<TaskStatus, { bg: string; text: string }> = {
    [TASK_STATUS.PENDING]: { bg: "rgba(125,133,146,14%)", text: "#7D8592" },
    [TASK_STATUS.IN_PROGRESS]: { bg: "rgba(63,140,255,14%)", text: "#3F8CFF" },
    [TASK_STATUS.IN_REVIEW]: { bg: "rgba(196,24,230,11%)", text: "#C418E6" },
    [TASK_STATUS.COMPLETED]: { bg: "#E0F9F2", text: "#00D097" },
    [TASK_STATUS.ACCEPTED]: { bg: "#E0F9F2", text: "#00D097" },
    [TASK_STATUS.REJECTED]: { bg: "rgba(244,67,54,14%)", text: "#F44336" },
  };

  const handleChangeStatus = (status: TaskStatus) => {
    onChange(status);
  };

  const normalizedSelected = normalizeTaskStatus(selected);

  return (
    <Box sx={{ display: "flex", gap: "10px", alignItems: "center" }}>
      {TASK_STATUSES_ARRAY.map((status) => {
        const isSelected = normalizedSelected === status;
        const colorMap = colorMaps[status];
        return (
          <Chip
            key={status}
            label={getStatusDisplayName(status)}
            sx={{
              color: isSelected ? colorMap.text : "",
              backgroundColor: isSelected ? colorMap.bg : "",
            }}
            variant={isSelected ? "filled" : "outlined"}
            onClick={() => handleChangeStatus(status)}
          />
        );
      })}
    </Box>
  );
};

export default Chips;
