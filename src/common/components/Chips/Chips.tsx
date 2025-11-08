import { Box, Chip } from "@mui/material";
import { TASK_STATUSES_ARRAY, getStatusDisplayName, type TaskStatus } from "../../../pages/Projects/constants/taskStatus.constants";

type ChipsProps = {
  selected: string;
  onChange: (status: TaskStatus) => void;
};

const Chips = ({ selected, onChange }: ChipsProps) => {
  const colorMaps: Record<TaskStatus, { bg: string; text: string }> = {
    pending: { bg: "rgba(125,133,146,14%)", text: "#7D8592" },
    todo: { bg: "rgba(125,133,146,14%)", text: "#7D8592" },
    review: { bg: "rgba(196,24,230,11%)", text: "#C418E6" },
    completed: { bg: "#E0F9F2", text: "#00D097" },
  };

  const handleChangeStatus = (status: TaskStatus) => {
    onChange(status);
  };

  return (
    <Box sx={{ display: "flex", gap: "10px", alignItems: "center" }}>
      {TASK_STATUSES_ARRAY.map((status) => {
        const isSelected = selected === status;
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
