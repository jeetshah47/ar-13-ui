import { Box, Typography, Grid, CircularProgress, Alert } from "@mui/material";
import CustomCard from "../../../common/components/Card/CustomCard";
import { useAppSelector, type RootState } from "../../../store/store";
import { formatTime } from "../../../utils/timeFormatting";

const ProjectStatisticsOverview = () => {
  const statisticsState = useAppSelector(
    (state: RootState) => state.projectStatisticsReducer.api
  );

  const { data, loading, error } = statisticsState;

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", padding: "40px" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ borderRadius: "12px" }}>
        {error}
      </Alert>
    );
  }

  if (!data || !data.projects || data.projects.length === 0) {
    return (
      <Alert severity="info" sx={{ borderRadius: "12px" }}>
        No project statistics available
      </Alert>
    );
  }

  // Calculate aggregated statistics
  const aggregatedStats = data.projects.reduce(
    (acc, project) => {
      const stats = project.statistics;
      return {
        totalProjects: acc.totalProjects + 1,
        totalTasks: acc.totalTasks + stats.totalTasks,
        completedTasks: acc.completedTasks + stats.completedTasks,
        activeTasks: acc.activeTasks + stats.activeTasks,
        totalTimeSpent: acc.totalTimeSpent + stats.totalTimeSpent,
        assignedUsers: acc.assignedUsers + stats.assignedUsers,
      };
    },
    {
      totalProjects: 0,
      totalTasks: 0,
      completedTasks: 0,
      activeTasks: 0,
      totalTimeSpent: 0,
      assignedUsers: 0,
    }
  );

  const overallCompletionRate =
    aggregatedStats.totalTasks > 0
      ? (aggregatedStats.completedTasks / aggregatedStats.totalTasks) * 100
      : 0;


  const statsCards = [
    {
      title: "Total Projects",
      value: aggregatedStats.totalProjects,
      subtitle: "Active projects in workspace",
      color: "primary.main",
    },
    {
      title: "Total Tasks",
      value: aggregatedStats.totalTasks,
      subtitle: "Tasks across all projects",
      color: "text.primary",
    },
    {
      title: "Completed Tasks",
      value: aggregatedStats.completedTasks,
      subtitle: `${overallCompletionRate.toFixed(1)}% completion rate`,
      color: "success.main",
      growth: `${overallCompletionRate.toFixed(1)}%`,
      growthColor: "#0AC947",
    },
    {
      title: "Active Tasks",
      value: aggregatedStats.activeTasks,
      subtitle: "Tasks currently in progress",
      color: "info.main",
    },
    {
      title: "Time Spent",
      value: formatTime(aggregatedStats.totalTimeSpent),
      subtitle: "Total time tracked",
      color: "text.primary",
    },
    {
      title: "Team Members",
      value: aggregatedStats.assignedUsers,
      subtitle: "Active assignees",
      color: "text.primary",
    },
  ];

  return (
    <Box>
      <Typography
        variant="h6"
        sx={{
          fontWeight: 700,
          marginBottom: "24px",
          color: "text.primary",
        }}
      >
        Project Statistics Overview
      </Typography>
      <Grid container spacing={2}>
        {statsCards.map((stat, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
            <CustomCard sx={{ paddingY: "20px", paddingX: "20px" }}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "6px",
                  position: "relative",
                  minHeight: "140px",
                }}
              >
                <Typography
                  sx={(theme) => ({
                    fontSize: "15px",
                    fontWeight: 700,
                    lineHeight: 1.4,
                    color: theme.palette.text.secondary,
                  })}
                >
                  {stat.title}
                </Typography>

                <Typography
                  sx={{
                    fontSize: "42px",
                    fontWeight: 700,
                    lineHeight: 1.1,
                    color: stat.color,
                  }}
                >
                  {stat.value}
                </Typography>

                {stat.growth && (
                  <Typography
                    sx={{
                      fontSize: "15px",
                      fontWeight: 600,
                      lineHeight: 1.3,
                      color: stat.growthColor,
                    }}
                  >
                    {stat.growth}
                  </Typography>
                )}

                <Typography
                  sx={(theme) => ({
                    fontSize: "13px",
                    fontWeight: 400,
                    lineHeight: 1.4,
                    color: theme.palette.text.secondary,
                    marginTop: "4px",
                  })}
                >
                  {stat.subtitle}
                </Typography>
              </Box>
            </CustomCard>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ProjectStatisticsOverview;

