import { Box, Button, SvgIcon, Typography, useMediaQuery, useTheme } from "@mui/material";
import EditIcon from "../../../assets/icons/general/gear.svg?react";
import FilterIcon from "../../../assets/icons/general/calendar-5.svg?react";
import Chips from "../../../common/components/Chips/Chips";
import { useResourceAccess } from "../../../store/hooks/useResourceAccess";
import type { ProjectResponse } from "../../../store/types/Project/ProjectResponse";
import { RequirePermission } from "../../../common/components/RBAC/RequirePermission";

interface TaskDetailsHeaderProps {
  onEditClick: () => void;
}

const TaskDetailsHeader = ({ onEditClick }: TaskDetailsHeaderProps) => {
  // theme and useMediaQuery are used in TaskDetailsContent component below
  return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          pb: { xs: "10px", sm: "20px", md: "22px", lg: "24px" },
          flexShrink: 0,
          flexWrap: { xs: "wrap", sm: "wrap", md: "nowrap", lg: "nowrap" },
          gap: { xs: "8px", sm: "8px", md: 0, lg: 0 },
        }}
      >
      <Typography sx={{ 
        fontSize: { xs: "22px", sm: "20px", md: "20px", lg: "20px" }, 
        fontWeight: { xs: 700, sm: 400, md: 400, lg: 400 },
        lineHeight: { xs: "1.36", sm: "1.5", md: "1.5", lg: "1.5" },
      }}>
        Task Details
      </Typography>
      <Box sx={{ display: "flex", gap: { xs: "6px", sm: "8px" } }}>
        <RequirePermission permission="tasks:write">
          <Box
            onClick={onEditClick}
            sx={{
              backgroundColor: "#fff",
              display: "flex",
              padding: { xs: "8px", sm: "10px" },
              borderRadius: "14px",
              cursor: "pointer",
              transition: "all 0.2s ease",
              "&:hover": {
                backgroundColor: "#f5f5f5",
                transform: "scale(1.05)",
              },
            }}
          >
            <SvgIcon sx={{ fontSize: { xs: "20px", sm: "24px" } }} component={EditIcon} />
          </Box>
        </RequirePermission>
        <Box
          sx={{
            backgroundColor: "#fff",
            display: "flex",
            padding: { xs: "8px", sm: "10px" },
            borderRadius: "14px",
          }}
        >
          <SvgIcon sx={{ fontSize: { xs: "20px", sm: "24px" } }} component={FilterIcon} />
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { canClaimTask } = useResourceAccess();
  const showClaimButton = project ? canClaimTask(project) : false;

  return (
    <Box
      id="project-detail-content"
      sx={{
        backgroundColor: "#fff",
        flex: 1,
        borderRadius: { xs: "20px", sm: "20px", md: "24px", lg: "24px" },
        padding: { xs: "20px", sm: "24px", md: "26px", lg: "30px" },
        overflowY: { xs: "visible", sm: "visible", md: "auto", lg: "auto" },
        overflowX: "hidden",
        minHeight: { xs: "auto", sm: "auto", md: 0, lg: 0 },
        maxHeight: { xs: "none", sm: "none", md: "100%", lg: "100%" },
        maxWidth: "100%",
        width: "100%",
        minWidth: 0,
        boxSizing: "border-box",
        scrollBehavior: "smooth",
        WebkitOverflowScrolling: "touch",
        "@media (min-width: 1200px) and (max-width: 1600px)": {
          padding: "24px",
        },
      }}
    >
      <Typography 
        color="secondary.main"
        sx={{ fontSize: { xs: "12px", sm: "14px" } }}
      >
        {taskCode}
      </Typography>
        <Box
          sx={{
            paddingTop: "4px",
            display: "flex",
            alignItems: { xs: "flex-start", sm: "flex-start", md: "center", lg: "center" },
            justifyContent: "space-between",
            flexDirection: { xs: "column", sm: "column", md: "row", lg: "row" },
            gap: { xs: 2, sm: 2, md: 0, lg: 0 },
          }}
        >
        <Typography 
          variant="h6" 
          fontWeight={"700"}
          sx={{ 
            fontSize: { xs: "18px", sm: "19px", md: "19px", lg: "20px" },
            lineHeight: { xs: "1.4", sm: "1.45", md: "1.45", lg: "1.5" },
            width: { xs: "100%", sm: "100%", md: "auto", lg: "auto" },
            wordBreak: "break-word",
            overflowWrap: "break-word",
            maxWidth: "100%",
          }}
        >
          {taskSubject}
        </Typography>
        <Box sx={{ 
          display: "flex", 
          gap: { xs: "8px", sm: "12px", md: "14px", lg: "16px" }, 
          alignItems: "center",
          flexDirection: { xs: "column", sm: "column", md: "row", lg: "row" },
          width: { xs: "100%", sm: "100%", md: "auto", lg: "auto" },
        }}>
          <Box sx={{ width: { xs: "100%", sm: "100%", md: "auto", lg: "auto" } }}>
            <Chips selected={currentStatus} onChange={onStatusChange} />
          </Box>
          {showClaimButton && (
            <Button
              variant="contained"
              onClick={onClaimTaskClick}
              fullWidth={isMobile}
              sx={{
                backgroundColor: "#3F8CFF",
                color: "#FFFFFF",
                borderRadius: "14px",
                padding: { xs: "10px 16px", sm: "13px 20px" },
                fontWeight: 700,
                fontSize: { xs: "14px", sm: "16px" },
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
