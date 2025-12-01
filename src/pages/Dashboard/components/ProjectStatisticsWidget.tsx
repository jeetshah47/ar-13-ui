import {
  Box,
  Typography,
  Avatar,
  Chip,
  Grid,
} from "@mui/material";
import CustomCard from "../../../common/components/Card/CustomCard";
import type { ProjectWithStatistics } from "../../../store/types/Project/ProjectStatisticsResponse";
import { useTheme, alpha } from "@mui/material/styles";
import CompletionRateChart from "./CompletionRateChart";
import { formatTime } from "../../../utils/timeFormatting";

interface ProjectStatisticsWidgetProps {
  project: ProjectWithStatistics;
}

const ProjectStatisticsWidget = ({ project }: ProjectStatisticsWidgetProps) => {
  const theme = useTheme();
  const stats = project.statistics;

  const completionRate = stats.completionRate || 0;

  // Get priority breakdown
  const priorityEntries = Object.entries(stats.byPriority || {});
  const statusEntries = Object.entries(stats.byStatus || {});

  return (
    <CustomCard sx={{ paddingY: "20px", paddingX: "20px" }}>
      <Box sx={{ display: "flex", flexDirection: "column", gap: "14px" }}>
        {/* Header */}
        <Box sx={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <Avatar
            sx={{
              width: 40,
              height: 40,
              bgcolor: theme.palette.primary.main,
              fontSize: "16px",
              fontWeight: 700,
            }}
          >
            {project.title.charAt(0).toUpperCase()}
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              variant="h6"
              sx={{ 
                fontWeight: 700, 
                color: "text.primary",
                fontSize: "18px",
                lineHeight: 1.2,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap"
              }}
            >
              {project.title}
            </Typography>
            <Typography
              variant="body2"
              sx={{ 
                color: "text.secondary", 
                fontSize: "13px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap"
              }}
            >
              {project.description || "No description"}
            </Typography>
          </Box>
        </Box>

        {/* Completion Rate with Chart */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            padding: "12px",
            borderRadius: "12px",
            backgroundColor: alpha(theme.palette.primary.main, 0.03),
          }}
        >
          <CompletionRateChart 
            completionRate={completionRate} 
            size={90}
            showLabel={true}
          />
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="body2"
              sx={{ 
                fontWeight: 600, 
                color: "text.secondary",
                fontSize: "13px",
                marginBottom: "4px"
              }}
            >
              Completion Rate
            </Typography>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 500,
                fontSize: "12px",
                color: "text.secondary",
              }}
            >
              {stats.completedTasks} of {stats.totalTasks} tasks completed
            </Typography>
            <Box
              sx={{
                display: "flex",
                gap: "8px",
                marginTop: "6px",
              }}
            >
              <Box
                sx={{
                  flex: 1,
                  height: "4px",
                  borderRadius: "2px",
                  backgroundColor: alpha(theme.palette.success.main, 0.2),
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <Box
                  sx={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    height: "100%",
                    width: `${completionRate}%`,
                    backgroundColor: theme.palette.success.main,
                    borderRadius: "2px",
                    transition: "width 0.3s ease",
                  }}
                />
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Key Metrics Grid */}
        <Grid container spacing={1.5}>
          <Grid size={{ xs: 6 }}>
            <Box>
              <Typography
                variant="caption"
                sx={{ 
                  color: "text.secondary", 
                  fontSize: "13px",
                  fontWeight: 500,
                  display: "block",
                  marginBottom: "4px"
                }}
              >
                Total Tasks
              </Typography>
              <Typography
                variant="h5"
                sx={{ 
                  fontWeight: 700, 
                  color: "text.primary",
                  fontSize: "20px",
                  lineHeight: 1.2
                }}
              >
                {stats.totalTasks}
              </Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 6 }}>
            <Box>
              <Typography
                variant="caption"
                sx={{ 
                  color: "text.secondary", 
                  fontSize: "13px",
                  fontWeight: 500,
                  display: "block",
                  marginBottom: "4px"
                }}
              >
                Completed
              </Typography>
              <Typography
                variant="h5"
                sx={{ 
                  fontWeight: 700, 
                  color: "success.main",
                  fontSize: "20px",
                  lineHeight: 1.2
                }}
              >
                {stats.completedTasks}
              </Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 6 }}>
            <Box>
              <Typography
                variant="caption"
                sx={{ 
                  color: "text.secondary", 
                  fontSize: "13px",
                  fontWeight: 500,
                  display: "block",
                  marginBottom: "4px"
                }}
              >
                Active
              </Typography>
              <Typography
                variant="h5"
                sx={{ 
                  fontWeight: 700, 
                  color: "info.main",
                  fontSize: "20px",
                  lineHeight: 1.2
                }}
              >
                {stats.activeTasks}
              </Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 6 }}>
            <Box>
              <Typography
                variant="caption"
                sx={{ 
                  color: "text.secondary", 
                  fontSize: "13px",
                  fontWeight: 500,
                  display: "block",
                  marginBottom: "4px"
                }}
              >
                Time Spent
              </Typography>
              <Typography
                variant="h5"
                sx={{ 
                  fontWeight: 700, 
                  color: "text.primary",
                  fontSize: "20px",
                  lineHeight: 1.2
                }}
              >
                {formatTime(stats.totalTimeSpent)}
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {/* Status Breakdown */}
        {statusEntries.length > 0 && (
          <Box>
            <Typography
              variant="caption"
              sx={{
                color: "text.secondary",
                fontSize: "13px",
                fontWeight: 500,
                display: "block",
                marginBottom: "6px",
              }}
            >
              Tasks by Status
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {statusEntries.slice(0, 4).map(([status, count]) => (
                <Chip
                  key={status}
                  label={`${status}: ${count}`}
                  size="small"
                  sx={{
                    fontSize: "11px",
                    height: "26px",
                    fontWeight: 500,
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                    color: "text.primary",
                  }}
                />
              ))}
            </Box>
          </Box>
        )}

        {/* Priority Breakdown */}
        {priorityEntries.length > 0 && (
          <Box>
            <Typography
              variant="caption"
              sx={{
                color: "text.secondary",
                fontSize: "13px",
                fontWeight: 500,
                display: "block",
                marginBottom: "6px",
              }}
            >
              Tasks by Priority
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {priorityEntries.map(([priority, count]) => {
                const priorityColor =
                  priority.toLowerCase() === "high"
                    ? "error"
                    : priority.toLowerCase() === "medium"
                    ? "warning"
                    : "info";
                return (
                  <Chip
                    key={priority}
                    label={`${priority}: ${count}`}
                    size="small"
                    color={priorityColor as "error" | "warning" | "info"}
                    sx={{ 
                      fontSize: "11px", 
                      height: "26px",
                      fontWeight: 500
                    }}
                  />
                );
              })}
            </Box>
          </Box>
        )}

        {/* Team Members */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingTop: "10px",
            borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          }}
        >
          <Typography
            variant="body2"
            sx={{ 
              color: "text.secondary", 
              fontSize: "13px",
              fontWeight: 500
            }}
          >
            Team Members
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Typography
              variant="body1"
              sx={{ 
                fontWeight: 700, 
                color: "text.primary",
                fontSize: "16px"
              }}
            >
              {stats.assignedUsers}
            </Typography>
            <Avatar
              sx={{
                width: 28,
                height: 28,
                fontSize: "12px",
                bgcolor: theme.palette.primary.main,
              }}
            >
              {stats.assignedUsers}
            </Avatar>
          </Box>
        </Box>
      </Box>
    </CustomCard>
  );
};

export default ProjectStatisticsWidget;

