import { Avatar, Box, Typography, alpha, useTheme } from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  Cell,
} from "recharts";
import type { DashboardEmployeeResponse } from "../../../store/types/Dashboard/DashboardResponse";

interface EmployeeCardProps {
  employee: DashboardEmployeeResponse;
}

const COLORS = {
  backlog: "#FF9800",
  inProgress: "#2196F3",
  inReview: "#FFC107",
  pending: "#9E9E9E",
};

const EmployeeCard = ({ employee }: EmployeeCardProps) => {
  const theme = useTheme();

  // Generate initials from name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Prepare chart data with all workload stats
  const chartData = employee.workload ? [
    {
      name: "Backlog",
      value: employee.workload.backlogTasks,
      color: COLORS.backlog,
    },
    {
      name: "In Progress",
      value: employee.workload.tasksInProgress,
      color: COLORS.inProgress,
    },
    {
      name: "In Review",
      value: employee.workload.tasksInReview,
      color: COLORS.inReview,
    },
    {
      name: "Pending",
      value: employee.workload.pendingTasks,
      color: COLORS.pending,
    },
  ] : [];

  return (
    <Box
      sx={{
        backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.08),
        borderRadius: "24px",
        paddingY: "18px",
        paddingX: "24px",
        width: "200px",
        minHeight: "240px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        gap: "8px",
      }}
    >
      <Avatar 
        sx={{ 
          width: 48, 
          height: 48, 
          fontSize: "16px", 
          fontWeight: "bold",
          backgroundColor: (theme) => theme.palette.grey[300],
          color: (theme) => theme.palette.text.secondary
        }}
      >
        {getInitials(employee.name)}
      </Avatar>
      <Typography 
        variant="subtitle1" 
        sx={{ 
          fontWeight: "bold", 
          textAlign: "center",
          fontSize: "14px",
          lineHeight: 1.2,
          maxWidth: "100%",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          color: "text.primary"
        }}
      >
        {employee.name}
      </Typography>
      <Typography 
        variant="subtitle2" 
        sx={{ 
          textAlign: "center",
          fontSize: "12px",
          color: "text.secondary",
          lineHeight: 1.2,
          maxWidth: "100%",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          marginBottom: "8px"
        }}
      >
        {employee.designation || employee.role}
      </Typography>
      {employee.workload && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            width: "100%",
            marginTop: "4px",
            paddingTop: "8px",
            borderTop: (theme) => `1px solid ${alpha(theme.palette.divider, 0.1)}`
          }}
        >
          {/* Stats Summary */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              gap: "8px",
              marginBottom: "4px",
            }}
          >
            <Box sx={{ textAlign: "center", flex: 1 }}>
              <Typography variant="caption" sx={{ fontSize: "8px", color: "text.secondary", display: "block" }}>
                Total
              </Typography>
              <Typography variant="caption" sx={{ fontSize: "12px", fontWeight: "bold", color: "text.primary" }}>
                {employee.workload.totalTasks}
              </Typography>
            </Box>
            <Box sx={{ textAlign: "center", flex: 1 }}>
              <Typography variant="caption" sx={{ fontSize: "8px", color: "text.secondary", display: "block" }}>
                Active
              </Typography>
              <Typography variant="caption" sx={{ fontSize: "12px", fontWeight: "bold", color: "primary.main" }}>
                {employee.workload.activeTasks}
              </Typography>
            </Box>
          </Box>

          {/* Combined Chart */}
          <Box
            sx={{
              width: "100%",
              height: "160px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {chartData.length > 0 && chartData.some(item => item.value > 0) ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  layout="vertical"
                  margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
                >
                  <CartesianGrid 
                    strokeDasharray="3 3" 
                    stroke={theme.palette.mode === "dark" 
                      ? "rgba(255, 255, 255, 0.1)" 
                      : "rgba(0, 0, 0, 0.08)"}
                    horizontal={true}
                    vertical={false}
                  />
                  <XAxis 
                    type="number"
                    tick={{ fontSize: 9, fill: theme.palette.text.secondary }}
                    tickLine={{ stroke: theme.palette.text.secondary }}
                  />
                  <YAxis 
                    type="category"
                    dataKey="name"
                    tick={{ fontSize: 9, fill: theme.palette.text.secondary }}
                    tickLine={{ stroke: theme.palette.text.secondary }}
                    width={70}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: theme.palette.mode === "dark" 
                        ? theme.palette.grey[800] 
                        : theme.palette.grey[100],
                      border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
                      borderRadius: "8px",
                      fontSize: "11px",
                    }}
                    formatter={(value: number) => [value, "Tasks"]}
                  />
                  <Bar 
                    dataKey="value" 
                    radius={[0, 4, 4, 0]}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <Typography variant="caption" sx={{ color: "text.secondary", fontSize: "10px" }}>
                No task data available
              </Typography>
            )}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default EmployeeCard;
