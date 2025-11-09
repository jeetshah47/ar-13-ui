import { Box, Button, SvgIcon, Typography } from "@mui/material";
import EditIcon from "../../../assets/icons/general/gear.svg?react";
import FilterIcon from "../../../assets/icons/general/calendar-5.svg?react";
import Chips from "../../../common/components/Chips/Chips";
import { useResourceAccess } from "../../../store/hooks/useResourceAccess";
import type { ProjectResponse } from "../../../store/types/Project/ProjectResponse";

interface TaskDetailsHeaderProps {
  onEditClick: () => void;
}

const TaskDetailsHeader = ({ onEditClick }: TaskDetailsHeaderProps) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        pb: "24px",
        flexShrink: 0,
      }}
    >
      <Typography>Task Details</Typography>
      <Box sx={{ display: "flex", gap: "8px" }}>
        <Box
          onClick={onEditClick}
          sx={{
            backgroundColor: "#fff",
            display: "flex",
            padding: "10px",
            borderRadius: "14px",
            cursor: "pointer",
            transition: "all 0.2s ease",
            "&:hover": {
              backgroundColor: "#f5f5f5",
              transform: "scale(1.05)",
            },
          }}
        >
          <SvgIcon component={EditIcon} />
        </Box>
        <Box
          sx={{
            backgroundColor: "#fff",
            display: "flex",
            padding: "10px",
            borderRadius: "14px",
          }}
        >
          <SvgIcon component={FilterIcon} />
        </Box>
      </Box>
    </Box>
  );
};

interface TaskDetailsContentProps {
  taskCode?: string;
  taskSubject?: string;
  currentStatus: string;
  onStatusChange: (status: string) => void;
  onClaimTaskClick: () => void;
  project?: ProjectResponse;
  children: React.ReactNode;
}

export const TaskDetailsContent = ({
  taskCode,
  taskSubject,
  currentStatus,
  onStatusChange,
  onClaimTaskClick,
  project,
  children,
}: TaskDetailsContentProps) => {
  const { canClaimTask } = useResourceAccess();
  const showClaimButton = project ? canClaimTask(project) : false;

  return (
    <Box
      id="project-detail-content"
      sx={{
        backgroundColor: "#fff",
        flex: 1,
        borderRadius: "24px",
        padding: "30px",
        overflowY: "auto",
        minHeight: 0,
        scrollBehavior: "smooth",
        WebkitOverflowScrolling: "touch",
      }}
    >
      <Typography color="secondary.main">{taskCode}</Typography>
      <Box
        sx={{
          paddingTop: "4px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="h6" fontWeight={"700"}>
          {taskSubject}
        </Typography>
        <Box sx={{ display: "flex", gap: "16px", alignItems: "center" }}>
          <Chips selected={currentStatus} onChange={onStatusChange} />
          {showClaimButton && (
            <Button
              variant="contained"
              onClick={onClaimTaskClick}
              sx={{
                backgroundColor: "#3F8CFF",
                color: "#FFFFFF",
                borderRadius: "14px",
                padding: "13px 20px",
                fontWeight: 700,
                fontSize: "16px",
                lineHeight: 1.364,
                boxShadow: "0px 6px 12px 0px rgba(63, 140, 255, 0.26)",
                "&:hover": {
                  backgroundColor: "#3A81EB",
                  boxShadow: "0px 6px 12px 0px rgba(63, 140, 255, 0.42)",
                },
              }}
            >
              Claim Task
            </Button>
          )}
        </Box>
      </Box>
      {children}
    </Box>
  );
};

export default TaskDetailsHeader;
