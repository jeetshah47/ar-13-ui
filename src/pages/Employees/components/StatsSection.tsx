import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Card,
  CardContent,
  Chip,
  LinearProgress,
  Paper,
  useTheme,
} from "@mui/material";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useAppDispatch, useAppSelector } from "../../../store/store";
import { getEmployeeStatsAction } from "../../../store/features/employees/employeeActions";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import TrendingFlatIcon from "@mui/icons-material/TrendingFlat";
import CustomCard from "../../../common/components/Card/CustomCard";

interface StatsSectionProps {
  userId: string;
}

const COLORS = {
  backlog: "#FF9800",
  inProgress: "#2196F3",
  inReview: "#4CAF50",
  pending: "#9E9E9E",
  completed: "#66BB6A",
};

const StatsSection: React.FC<StatsSectionProps> = ({ userId }) => {
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const { stats, statsLoading, statsError } = useAppSelector(
    (state) => state.employeeReducer
  );

  const [period, setPeriod] = useState<"month" | "quarter" | "year">("month");
  const [periodValue, setPeriodValue] = useState<string>("");

  // Initialize with current month
  useEffect(() => {
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    setPeriodValue(currentMonth);
  }, []);

  useEffect(() => {
    if (userId && periodValue) {
      dispatch(getEmployeeStatsAction(userId, period, periodValue));
    }
  }, [userId, period, periodValue, dispatch]);

  const handlePeriodChange = (newPeriod: "month" | "quarter" | "year") => {
    setPeriod(newPeriod);
    const now = new Date();
    if (newPeriod === "month") {
      setPeriodValue(`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`);
    } else if (newPeriod === "quarter") {
      const quarter = Math.floor(now.getMonth() / 3) + 1;
      setPeriodValue(`${now.getFullYear()}-Q${quarter}`);
    } else {
      setPeriodValue(String(now.getFullYear()));
    }
  };

  const formatTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  if (statsLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", padding: "40px" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (statsError) {
    return (
      <Alert severity="error" sx={{ margin: "20px 0", borderRadius: "12px" }}>
        {statsError}
      </Alert>
    );
  }

  if (!stats) {
    return (
      <Box sx={{ padding: "20px" }}>
        <Alert severity="info" sx={{ borderRadius: "12px" }}>
          Select a period to view statistics
        </Alert>
      </Box>
    );
  }

  const overall = stats.overall;

  // Prepare data for pie chart (task status distribution)
  const taskStatusData = [
    { name: "Completed", value: overall.completedTasks, color: COLORS.completed },
    { name: "In Progress", value: overall.tasksInProgress, color: COLORS.inProgress },
    { name: "To Do", value: overall.backlogTasks, color: COLORS.backlog },
    { name: "In Review", value: overall.tasksInReview, color: COLORS.inReview },
    { name: "Pending", value: overall.pendingTasks, color: COLORS.pending },
  ].filter((item) => item.value > 0);

  // Prepare data for project comparison bar chart
  const projectData = stats.byProject?.map((project) => ({
    name: project.projectName.length > 15 ? project.projectName.substring(0, 15) + "..." : project.projectName,
    fullName: project.projectName,
    completed: project.stats.completedTasks,
    total: project.stats.totalTasks,
    completionRate: project.stats.completionRate,
  })) || [];

  // Prepare data for time period trends (byTime)
  const timePeriodData = stats.byTime?.map((time) => ({
    period: time.periodLabel,
    completed: time.stats.completedTasks,
    total: time.stats.totalTasks,
    active: time.stats.activeTasks,
    completionRate: time.stats.completionRate,
    totalTimeSpent: time.stats.totalTimeSpent,
  })) || [];


  const getTrendIcon = () => {
    if (stats.analysis.productivityTrend === "increasing") {
      return <TrendingUpIcon sx={{ fontSize: 20 }} />;
    } else if (stats.analysis.productivityTrend === "decreasing") {
      return <TrendingDownIcon sx={{ fontSize: 20 }} />;
    }
    return <TrendingFlatIcon sx={{ fontSize: 20 }} />;
  };

  const getTrendColor = () => {
    if (stats.analysis.productivityTrend === "increasing") return "success.main";
    if (stats.analysis.productivityTrend === "decreasing") return "error.main";
    return "text.secondary";
  };

  return (
    <Box sx={{ padding: "20px 0" }}>
      {/* Period Selectors */}
      <Paper
        elevation={0}
        sx={{
          padding: "20px",
          marginBottom: "24px",
          borderRadius: "16px",
          background: (theme) =>
            theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.02)",
        }}
      >
        <Box sx={{ display: "flex", gap: "16px", flexWrap: "wrap", alignItems: "center" }}>
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel>Period Type</InputLabel>
            <Select
              value={period}
              label="Period Type"
              onChange={(e) => handlePeriodChange(e.target.value as "month" | "quarter" | "year")}
            >
              <MenuItem value="month">Month</MenuItem>
              <MenuItem value="quarter">Quarter</MenuItem>
              <MenuItem value="year">Year</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel>Period</InputLabel>
            <Select
              value={periodValue}
              label="Period"
              onChange={(e) => setPeriodValue(e.target.value)}
            >
              {period === "month" &&
                Array.from({ length: 12 }, (_, i) => {
                  const date = new Date();
                  date.setMonth(i);
                  const value = `${date.getFullYear()}-${String(i + 1).padStart(2, "0")}`;
                  const label = date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
                  return (
                    <MenuItem key={value} value={value}>
                      {label}
                    </MenuItem>
                  );
                })}
              {period === "quarter" &&
                Array.from({ length: 4 }, (_, i) => {
                  const year = new Date().getFullYear();
                  const value = `${year}-Q${i + 1}`;
                  return (
                    <MenuItem key={value} value={value}>
                      Q{i + 1} {year}
                    </MenuItem>
                  );
                })}
              {period === "year" &&
                Array.from({ length: 5 }, (_, i) => {
                  const year = new Date().getFullYear() - i;
                  return (
                    <MenuItem key={year} value={String(year)}>
                      {year}
                    </MenuItem>
                  );
                })}
            </Select>
          </FormControl>
        </Box>
      </Paper>

      {/* Key Metrics Cards - StatisticsCard Style */}
      <Grid container spacing={3} sx={{ marginBottom: "32px" }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <CustomCard>
            <Box sx={{ display: "flex", flexDirection: "column", gap: "8px", position: "relative", minHeight: "186px" }}>
              <Typography sx={{ fontSize: "14px", fontWeight: 700, color: "text.secondary" }}>
                Total Tasks
              </Typography>
              <Typography sx={{ fontSize: "54px", fontWeight: 700, lineHeight: 1.074, color: "text.primary" }}>
                {overall.totalTasks}
              </Typography>
              <Typography sx={{ fontSize: "12px", fontWeight: 400, color: "text.secondary", marginTop: "8px" }}>
                Tasks assigned in this period
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
                {overall.completedTasks}
              </Typography>
              <Typography sx={{ fontSize: "14px", fontWeight: 600, color: "success.main" }}>
                {overall.completionRate.toFixed(1)}% completion rate
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
                {overall.activeTasks}
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
                {overall.completionRate.toFixed(0)}%
              </Typography>
              <Typography sx={{ fontSize: "12px", fontWeight: 400, color: "text.secondary", marginTop: "8px" }}>
                {overall.completedTasks} of {overall.totalTasks} tasks completed
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
            </CardContent>
          </Card>
        </Grid>

        {/* Completion Rate Progress */}
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
                    {overall.completionRate.toFixed(1)}%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={overall.completionRate}
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
                      {formatTime(overall.totalTimeSpent)}
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ marginBottom: "4px" }}>
                      Avg Time/Task
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      {formatTime(Math.round(overall.averageTimePerTask))}
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ marginBottom: "4px" }}>
                      Avg Completion Time
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      {formatTime(Math.round(stats.analysis.averageCompletionTime))}
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ marginBottom: "4px" }}>
                      Productivity Trend
                    </Typography>
                    <Chip
                      icon={getTrendIcon()}
                      label={stats.analysis.productivityTrend.toUpperCase()}
                      color={
                        stats.analysis.productivityTrend === "increasing"
                          ? "success"
                          : stats.analysis.productivityTrend === "decreasing"
                          ? "error"
                          : "default"
                      }
                      sx={{ fontWeight: 600 }}
                    />
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Project Performance Bar Chart */}
      {projectData.length > 0 && (
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
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Project Performance Comparison
              </Typography>
              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Box sx={{ width: 16, height: 16, borderRadius: "4px", bgcolor: COLORS.completed }} />
                  <Typography variant="caption" fontSize="12px" fontWeight={500}>Completed</Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Box sx={{ width: 16, height: 16, borderRadius: "4px", bgcolor: COLORS.inProgress }} />
                  <Typography variant="caption" fontSize="12px" fontWeight={500}>Total</Typography>
                </Box>
              </Box>
            </Box>
            <ResponsiveContainer width="100%" height={450}>
              <BarChart
                data={projectData}
                margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
              >
                <defs>
                  <linearGradient id="completedBarGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={COLORS.completed} stopOpacity={1} />
                    <stop offset="100%" stopColor={COLORS.completed} stopOpacity={0.7} />
                  </linearGradient>
                  <linearGradient id="totalBarGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={COLORS.inProgress} stopOpacity={1} />
                    <stop offset="100%" stopColor={COLORS.inProgress} stopOpacity={0.7} />
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
                  formatter={(value: number, name: string) => {
                    if (name === "completed") return [`${value} tasks`, "Completed Tasks"];
                    if (name === "total") return [`${value} tasks`, "Total Tasks"];
                    return [value, name];
                  }}
                  cursor={{ fill: "rgba(0, 0, 0, 0.05)" }}
                />
                <Legend 
                  wrapperStyle={{ paddingTop: "30px" }}
                  iconType="rect"
                  iconSize={16}
                  formatter={(value) => <span style={{ fontSize: "13px", fontWeight: 500 }}>{value}</span>}
                />
                <Bar
                  dataKey="completed"
                  fill="url(#completedBarGradient)"
                  name="Completed Tasks"
                  radius={[8, 8, 0, 0]}
                  animationDuration={1000}
                  animationEasing="ease-in-out"
                />
                <Bar
                  dataKey="total"
                  fill="url(#totalBarGradient)"
                  name="Total Tasks"
                  radius={[8, 8, 0, 0]}
                  animationDuration={1000}
                  animationEasing="ease-in-out"
                />
              </BarChart>
            </ResponsiveContainer>
            <Box 
              sx={{ 
                marginTop: "20px", 
                padding: "14px 16px", 
                background: (theme) => 
                  theme.palette.mode === "dark" 
                    ? "rgba(255,255,255,0.05)" 
                    : "rgba(0,0,0,0.02)",
                borderRadius: "12px",
                border: (theme) =>
                  theme.palette.mode === "dark"
                    ? "1px solid rgba(255,255,255,0.1)"
                    : "1px solid rgba(0,0,0,0.05)",
              }}
            >
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: "12px", lineHeight: 1.6 }}>
                <strong>Tip:</strong> Hover over bars to see detailed metrics. Compare completed tasks (green) with total tasks (blue) across different projects.
              </Typography>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Time Period Trends Line Chart */}
      {timePeriodData.length > 0 && (
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
              Performance Trends Over Time
            </Typography>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart
                data={timePeriodData}
                margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
              >
                <defs>
                  <linearGradient id="completedLineGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLORS.completed} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={COLORS.completed} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="totalLineGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLORS.inProgress} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={COLORS.inProgress} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  stroke={theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.08)"}
                  vertical={false}
                />
                <XAxis
                  dataKey="period"
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  fontSize={11}
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
                <YAxis 
                  yAxisId="right" 
                  orientation="right"
                  domain={[0, 100]}
                  label={{ 
                    value: "Completion Rate (%)", 
                    angle: 90, 
                    position: "insideRight",
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
                  formatter={(value: number, name: string) => {
                    if (name === "completed") return [`${value} tasks`, "Completed Tasks"];
                    if (name === "total") return [`${value} tasks`, "Total Tasks"];
                    if (name === "active") return [`${value} tasks`, "Active Tasks"];
                    if (name === "completionRate") return [`${value.toFixed(1)}%`, "Completion Rate"];
                    return [value, name];
                  }}
                  cursor={{ stroke: theme.palette.primary.main, strokeWidth: 2, strokeDasharray: "5 5" }}
                />
                <Legend 
                  wrapperStyle={{ paddingTop: "30px" }}
                  iconType="line"
                  iconSize={16}
                  formatter={(value) => <span style={{ fontSize: "13px", fontWeight: 500 }}>{value}</span>}
                />
                <Line
                  type="monotone"
                  dataKey="completed"
                  stroke={COLORS.completed}
                  strokeWidth={3}
                  name="Completed Tasks"
                  dot={{ fill: COLORS.completed, r: 6, strokeWidth: 2, stroke: "#fff" }}
                  activeDot={{ r: 9, strokeWidth: 2, stroke: "#fff" }}
                  animationDuration={1000}
                  animationEasing="ease-in-out"
                />
                <Line
                  type="monotone"
                  dataKey="total"
                  stroke={COLORS.inProgress}
                  strokeWidth={3}
                  name="Total Tasks"
                  dot={{ fill: COLORS.inProgress, r: 6, strokeWidth: 2, stroke: "#fff" }}
                  activeDot={{ r: 9, strokeWidth: 2, stroke: "#fff" }}
                  animationDuration={1000}
                  animationEasing="ease-in-out"
                />
                <Line
                  type="monotone"
                  dataKey="active"
                  stroke="#FF9800"
                  strokeWidth={2.5}
                  name="Active Tasks"
                  dot={{ fill: "#FF9800", r: 5, strokeWidth: 2, stroke: "#fff" }}
                  activeDot={{ r: 8, strokeWidth: 2, stroke: "#fff" }}
                  animationDuration={1000}
                  animationEasing="ease-in-out"
                />
                <Line
                  type="monotone"
                  dataKey="completionRate"
                  stroke="#9C27B0"
                  strokeWidth={2.5}
                  strokeDasharray="6 6"
                  name="Completion Rate %"
                  dot={{ fill: "#9C27B0", r: 5, strokeWidth: 2, stroke: "#fff" }}
                  activeDot={{ r: 8, strokeWidth: 2, stroke: "#fff" }}
                  yAxisId="right"
                  animationDuration={1200}
                  animationEasing="ease-in-out"
                />
              </LineChart>
            </ResponsiveContainer>
            <Box 
              sx={{ 
                marginTop: "20px", 
                padding: "14px 16px", 
                background: (theme) => 
                  theme.palette.mode === "dark" 
                    ? "rgba(255,255,255,0.05)" 
                    : "rgba(0,0,0,0.02)",
                borderRadius: "12px",
                border: (theme) =>
                  theme.palette.mode === "dark"
                    ? "1px solid rgba(255,255,255,0.1)"
                    : "1px solid rgba(0,0,0,0.05)",
              }}
            >
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: "12px", lineHeight: 1.6 }}>
                <strong>Trend Analysis:</strong> This chart shows performance trends across different time periods. 
                Track how task completion and activity levels change over time to identify productivity patterns.
              </Typography>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Analysis Cards */}
      <Grid container spacing={3} sx={{ marginBottom: "32px" }}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card
            sx={{
              height: "100%",
              background: (theme) =>
                theme.palette.mode === "dark"
                  ? "linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(56, 142, 60, 0.1) 100%)"
                  : "linear-gradient(135deg, rgba(76, 175, 80, 0.05) 0%, rgba(56, 142, 60, 0.05) 100%)",
              boxShadow: 2,
            }}
          >
            <CardContent>
              <Typography color="text.secondary" fontSize="13px" sx={{ marginBottom: "8px" }}>
                Most Active Project
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 700, marginBottom: "8px" }}>
                {stats.analysis.mostActiveProject}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Project ID: {stats.analysis.mostActiveProjectId}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card
            sx={{
              height: "100%",
              background: (theme) =>
                theme.palette.mode === "dark"
                  ? "linear-gradient(135deg, rgba(33, 150, 243, 0.1) 0%, rgba(25, 118, 210, 0.1) 100%)"
                  : "linear-gradient(135deg, rgba(33, 150, 243, 0.05) 0%, rgba(25, 118, 210, 0.05) 100%)",
              boxShadow: 2,
            }}
          >
            <CardContent>
              <Typography color="text.secondary" fontSize="13px" sx={{ marginBottom: "8px" }}>
                Peak Productivity Period
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                {stats.analysis.peakProductivityMonth}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card
            sx={{
              height: "100%",
              background: (theme) =>
                theme.palette.mode === "dark"
                  ? `linear-gradient(135deg, rgba(${stats.analysis.productivityTrend === "increasing" ? "76, 175, 80" : stats.analysis.productivityTrend === "decreasing" ? "244, 67, 54" : "158, 158, 158"}, 0.1) 0%, rgba(${stats.analysis.productivityTrend === "increasing" ? "56, 142, 60" : stats.analysis.productivityTrend === "decreasing" ? "211, 47, 47" : "117, 117, 117"}, 0.1) 100%)`
                  : `linear-gradient(135deg, rgba(${stats.analysis.productivityTrend === "increasing" ? "76, 175, 80" : stats.analysis.productivityTrend === "decreasing" ? "244, 67, 54" : "158, 158, 158"}, 0.05) 0%, rgba(${stats.analysis.productivityTrend === "increasing" ? "56, 142, 60" : stats.analysis.productivityTrend === "decreasing" ? "211, 47, 47" : "117, 117, 117"}, 0.05) 100%)`,
              boxShadow: 2,
            }}
          >
            <CardContent>
              <Typography color="text.secondary" fontSize="13px" sx={{ marginBottom: "8px" }}>
                Productivity Trend
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                {getTrendIcon()}
                <Typography variant="h6" sx={{ fontWeight: 700, color: getTrendColor() }}>
                  {stats.analysis.productivityTrend.toUpperCase()}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Detailed Project Statistics */}
      {stats.byProject && stats.byProject.length > 0 && (
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700, marginBottom: "20px" }}>
            Detailed Project Statistics
          </Typography>
          <Grid container spacing={3}>
            {stats.byProject.map((project) => (
              <Grid size={{ xs: 12, md: 6 }} key={project.projectId}>
                <Card sx={{ boxShadow: 2, height: "100%" }}>
                  <CardContent>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, marginBottom: "16px" }}>
                      {project.projectName}
                    </Typography>
                    <Box sx={{ marginBottom: "16px" }}>
                      <Box sx={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                        <Typography fontSize="12px" color="text.secondary">
                          Completion Rate
                        </Typography>
                        <Typography fontWeight={600}>
                          {project.stats.completionRate.toFixed(1)}%
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={project.stats.completionRate}
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
                    </Box>
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 6 }}>
                        <Typography fontSize="12px" color="text.secondary">
                          Total Tasks
                        </Typography>
                        <Typography fontWeight={600} variant="h6">
                          {project.stats.totalTasks}
                        </Typography>
                      </Grid>
                      <Grid size={{ xs: 6 }}>
                        <Typography fontSize="12px" color="text.secondary">
                          Completed
                        </Typography>
                        <Typography fontWeight={600} variant="h6" color="success.main">
                          {project.stats.completedTasks}
                        </Typography>
                      </Grid>
                      <Grid size={{ xs: 6 }}>
                        <Typography fontSize="12px" color="text.secondary">
                          Active Tasks
                        </Typography>
                        <Typography fontWeight={600}>{project.stats.activeTasks}</Typography>
                      </Grid>
                      <Grid size={{ xs: 6 }}>
                        <Typography fontSize="12px" color="text.secondary">
                          Time Spent
                        </Typography>
                        <Typography fontWeight={600}>{formatTime(project.stats.totalTimeSpent)}</Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Box>
  );
};

export default StatsSection;
