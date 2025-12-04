import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  LinearProgress,
  useTheme,
} from "@mui/material";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import type { ProjectStatistics } from "../../../store/types/Project/ProjectStatisticsResponse";
import CustomCard from "../../../common/components/Card/CustomCard";

interface ProjectStatsViewProps {
  statistics: ProjectStatistics;
  users: Array<{ id: string; name: string }>;
}

const ProjectStatsView = ({ statistics, users }: ProjectStatsViewProps) => {
  const theme = useTheme();

  const formatTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const getUserName = (userId: string): string => {
    return users.find((u) => u.id === userId)?.name || userId;
  };

  const COLORS = {
    completed: "#66BB6A",
    inProgress: "#2196F3",
    inReview: "#4CAF50",
    pending: "#9E9E9E",
    backlog: "#FF9800",
    cancelled: "#F44336",
  };

  // Prepare completion chart data
  const taskStatusData = [
    { name: "Completed", value: statistics.completedTasks, color: COLORS.completed },
    { name: "In Progress", value: statistics.tasksInProgress, color: COLORS.inProgress },
    { name: "To Do", value: statistics.backlogTasks, color: COLORS.backlog },
    { name: "In Review", value: statistics.tasksInReview, color: COLORS.inReview },
    { name: "Pending", value: statistics.pendingTasks, color: COLORS.pending },
    { name: "Cancelled", value: statistics.cancelledTasks, color: COLORS.cancelled },
  ].filter((item) => item.value > 0);

  // Prepare status breakdown data for bar chart
  const statusData = Object.entries(statistics.byStatus).map(([status, count]) => ({
    name: status.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase()),
    value: count,
  }));

  // Prepare priority data for bar chart
  const priorityData = Object.entries(statistics.byPriority).map(([priority, count]) => ({
    name: priority.charAt(0).toUpperCase() + priority.slice(1),
    value: count,
  }));

  // Prepare employee workload data (completed vs assigned)
  const employeeWorkloadData = Object.entries(statistics.tasksByAssignee)
    .map(([userId, assignedCount]) => {
      const completedCount = statistics.completedTasksByAssignee?.[userId] || 0;
      const completionRate = assignedCount > 0 ? (completedCount / assignedCount) * 100 : 0;
      return {
        name: getUserName(userId),
        userId,
        assigned: assignedCount,
        completed: completedCount,
        completionRate,
      };
    })
    .sort((a, b) => b.assigned - a.assigned) // Sort by assigned tasks (workload)
    .slice(0, 10); // Top 10 employees

  return (
    <Box sx={{ padding: "20px 0" }}>
      {/* Key Metrics Cards */}
      <Grid container spacing={3} sx={{ marginBottom: "32px" }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <CustomCard>
            <Box sx={{ display: "flex", flexDirection: "column", gap: "8px", position: "relative", minHeight: "186px" }}>
              <Typography sx={{ fontSize: "14px", fontWeight: 700, color: "text.secondary" }}>
                Total Tasks
              </Typography>
              <Typography sx={{ fontSize: "54px", fontWeight: 700, lineHeight: 1.074, color: "text.primary" }}>
                {statistics.totalTasks}
              </Typography>
              <Typography sx={{ fontSize: "12px", fontWeight: 400, color: "text.secondary", marginTop: "8px" }}>
                All tasks in this project
              </Typography>
            </Box>
          </CustomCard>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <CustomCard>
            <Box sx={{ display: "flex", flexDirection: "column", gap: "8px", position: "relative", minHeight: "186px" }}>
              <Typography sx={{ fontSize: "14px", fontWeight: 700, color: "text.secondary" }}>
                Completed Tasks
              </Typography>
              <Typography sx={{ fontSize: "54px", fontWeight: 700, lineHeight: 1.074, color: "success.main" }}>
                {statistics.completedTasks}
              </Typography>
              <Typography sx={{ fontSize: "14px", fontWeight: 600, color: "success.main" }}>
                {statistics.completionRate.toFixed(1)}% completion rate
              </Typography>
              <Typography sx={{ fontSize: "12px", fontWeight: 400, color: "text.secondary", marginTop: "8px" }}>
                Successfully finished tasks
              </Typography>
            </Box>
          </CustomCard>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <CustomCard>
            <Box sx={{ display: "flex", flexDirection: "column", gap: "8px", position: "relative", minHeight: "186px" }}>
              <Typography sx={{ fontSize: "14px", fontWeight: 700, color: "text.secondary" }}>
                Active Tasks
              </Typography>
              <Typography sx={{ fontSize: "54px", fontWeight: 700, lineHeight: 1.074, color: "info.main" }}>
                {statistics.activeTasks}
              </Typography>
              <Typography sx={{ fontSize: "12px", fontWeight: 400, color: "text.secondary", marginTop: "8px" }}>
                Currently in progress
              </Typography>
            </Box>
          </CustomCard>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <CustomCard>
            <Box sx={{ display: "flex", flexDirection: "column", gap: "8px", position: "relative", minHeight: "186px" }}>
              <Typography sx={{ fontSize: "14px", fontWeight: 700, color: "text.secondary" }}>
                Completion Rate
              </Typography>
              <Typography sx={{ fontSize: "54px", fontWeight: 700, lineHeight: 1.074, color: "primary.main" }}>
                {statistics.completionRate.toFixed(0)}%
              </Typography>
              <Typography sx={{ fontSize: "12px", fontWeight: 400, color: "text.secondary", marginTop: "8px" }}>
                {statistics.completedTasks} of {statistics.totalTasks} tasks completed
              </Typography>
            </Box>
          </CustomCard>
        </Grid>
      </Grid>

      {/* Charts Row */}
      <Grid container spacing={3} sx={{ marginBottom: "32px" }}>
        {/* Task Status Distribution Pie Chart */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ height: "100%", boxShadow: 2 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700, marginBottom: "20px" }}>
                Task Status Distribution
              </Typography>
              {taskStatusData.length > 0 ? (
                <>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={taskStatusData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {taskStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, justifyContent: "center", marginTop: 2 }}>
                    {taskStatusData.map((item, index) => (
                      <Box key={index} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Box
                          sx={{
                            width: 12,
                            height: 12,
                            borderRadius: "50%",
                            bgcolor: item.color,
                          }}
                        />
                        <Typography variant="caption" fontSize="12px">
                          {item.name}: {item.value}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </>
              ) : (
                <Box sx={{ textAlign: "center", py: 4 }}>
                  <Typography color="text.secondary">No task data available</Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Performance Overview */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ height: "100%", boxShadow: 2 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700, marginBottom: "20px" }}>
                Performance Overview
              </Typography>
              <Box sx={{ marginBottom: "24px" }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                  <Typography variant="body2" color="text.secondary">
                    Completion Rate
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: "success.main" }}>
                    {statistics.completionRate.toFixed(1)}%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={statistics.completionRate}
                  sx={{
                    height: 12,
                    borderRadius: "6px",
                    bgcolor: (theme) => (theme.palette.mode === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"),
                    "& .MuiLinearProgress-bar": {
                      borderRadius: "6px",
                      bgcolor: "success.main",
                    },
                  }}
                />
              </Box>
              <Grid container spacing={2}>
                <Grid size={{ xs: 6 }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ marginBottom: "4px" }}>
                      Total Time Spent
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      {formatTime(statistics.totalTimeSpent)}
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ marginBottom: "4px" }}>
                      Assigned Users
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      {statistics.assignedUsers}
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ marginBottom: "4px" }}>
                      In Progress
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: "info.main" }}>
                      {statistics.tasksInProgress}
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ marginBottom: "4px" }}>
                      In Review
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: "success.main" }}>
                      {statistics.tasksInReview}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tasks by Status Bar Chart */}
      {statusData.length > 0 && (
        <Card 
          sx={{ 
            marginBottom: "32px", 
            boxShadow: 3,
            background: (theme) =>
              theme.palette.mode === "dark"
                ? "linear-gradient(135deg, rgba(30, 30, 30, 0.9) 0%, rgba(40, 40, 40, 0.9) 100%)"
                : "linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(250, 250, 250, 0.95) 100%)",
          }}
        >
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 700, marginBottom: "24px" }}>
              Tasks by Status
            </Typography>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart
                data={statusData}
                margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
              >
                <defs>
                  <linearGradient id="statusBarGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={theme.palette.primary.main} stopOpacity={1} />
                    <stop offset="100%" stopColor={theme.palette.primary.main} stopOpacity={0.7} />
                  </linearGradient>
                </defs>
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  stroke={theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.08)"}
                  vertical={false}
                />
                <XAxis
                  dataKey="name"
                  angle={-45}
                  textAnchor="end"
                  height={100}
                  fontSize={11}
                  interval={0}
                  tick={{ fill: theme.palette.text.secondary }}
                  stroke={theme.palette.text.secondary}
                />
                <YAxis 
                  label={{ 
                    value: "Number of Tasks", 
                    angle: -90, 
                    position: "insideLeft",
                    style: { textAnchor: "middle", fill: theme.palette.text.secondary }
                  }}
                  tick={{ fill: theme.palette.text.secondary }}
                  stroke={theme.palette.text.secondary}
                  tickLine={{ stroke: theme.palette.text.secondary }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: theme.palette.mode === "dark" 
                      ? "rgba(30, 30, 30, 0.95)" 
                      : "rgba(255, 255, 255, 0.98)",
                    border: theme.palette.mode === "dark" 
                      ? "1px solid rgba(255, 255, 255, 0.2)" 
                      : "1px solid rgba(0, 0, 0, 0.1)",
                    borderRadius: "12px",
                    boxShadow: "0 8px 16px rgba(0, 0, 0, 0.15)",
                    padding: "12px",
                  }}
                  labelStyle={{
                    fontWeight: 600,
                    marginBottom: "8px",
                    color: theme.palette.text.primary,
                  }}
                  itemStyle={{
                    padding: "4px 0",
                    color: theme.palette.text.primary,
                  }}
                  formatter={(value: number) => [`${value} tasks`, "Tasks"]}
                  cursor={{ fill: "rgba(0, 0, 0, 0.05)" }}
                />
                <Bar
                  dataKey="value"
                  fill="url(#statusBarGradient)"
                  radius={[8, 8, 0, 0]}
                  animationDuration={1000}
                  animationEasing="ease-in-out"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Tasks by Priority and Contributors Row */}
      <Grid container spacing={3} sx={{ marginBottom: "32px" }}>
        {/* Tasks by Priority Bar Chart */}
        {priorityData.length > 0 && (
          <Grid size={{ xs: 12, md: 6 }}>
            <Card sx={{ height: "100%", boxShadow: 2 }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 700, marginBottom: "20px" }}>
                  Tasks by Priority
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={priorityData}>
                    <CartesianGrid 
                      strokeDasharray="3 3" 
                      stroke={theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.08)"}
                      vertical={false}
                    />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fontSize: 12, fill: theme.palette.text.secondary }}
                      stroke={theme.palette.text.secondary}
                    />
                    <YAxis 
                      tick={{ fontSize: 12, fill: theme.palette.text.secondary }}
                      stroke={theme.palette.text.secondary}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: theme.palette.mode === "dark" 
                          ? "rgba(30, 30, 30, 0.95)" 
                          : "rgba(255, 255, 255, 0.98)",
                        border: theme.palette.mode === "dark" 
                          ? "1px solid rgba(255, 255, 255, 0.2)" 
                          : "1px solid rgba(0, 0, 0, 0.1)",
                        borderRadius: "12px",
                        padding: "12px",
                      }}
                      formatter={(value: number) => [`${value} tasks`, "Tasks"]}
                    />
                    <Bar 
                      dataKey="value" 
                      fill={COLORS.backlog} 
                      radius={[8, 8, 0, 0]}
                      animationDuration={1000}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Employee Workload */}
        {employeeWorkloadData.length > 0 && (
          <Grid size={{ xs: 12, md: 6 }}>
            <Card sx={{ height: "100%", boxShadow: 2 }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 700, marginBottom: "20px" }}>
                  Employee Workload
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
                  {employeeWorkloadData.map((item, index) => {
                    return (
                      <Box key={item.userId}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                          <Typography variant="body2" fontWeight={500}>
                            {index + 1}. {item.name}
                          </Typography>
                          <Typography variant="body2" fontWeight={700} color="success.main">
                            {item.completed} / {item.assigned}
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={item.completionRate}
                          sx={{
                            height: 8,
                            borderRadius: "4px",
                            bgcolor: (theme) =>
                              theme.palette.mode === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
                            "& .MuiLinearProgress-bar": {
                              borderRadius: "4px",
                              bgcolor: "success.main",
                            },
                          }}
                        />
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: "block" }}>
                          {item.completionRate.toFixed(1)}% completed
                        </Typography>
                      </Box>
                    );
                  })}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default ProjectStatsView;

