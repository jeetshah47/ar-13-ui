import { Box } from "@mui/material";
import CustomCard from "../../../common/components/Card/CustomCard";
import CardHeader from "../../../common/components/Card/CardHeader";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  type PieLabelRenderProps,
} from "recharts";
import { useAppSelector, type RootState } from "../../../store/store";
import { useTheme, alpha } from "@mui/material/styles";
import { useEffect, useState, useRef } from "react";

const ProjectStatusChart = () => {
  const theme = useTheme();
  const [isReady, setIsReady] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const statisticsState = useAppSelector(
    (state: RootState) => state.projectStatisticsReducer.api
  );

  const { data, loading } = statisticsState;

  // Ensure component is mounted and container has dimensions before rendering charts
  useEffect(() => {
    if (!data || loading) return;

    // Check dimensions after a short delay to ensure DOM is ready
    const checkDimensions = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        if (width > 0 && height > 0) {
          setIsReady(true);
          return true;
        }
      }
      return false;
    };

    // Try immediately first
    if (checkDimensions()) return;

    // If not ready, try after a short delay
    const timer = setTimeout(() => {
      if (!checkDimensions()) {
        // Fallback: set ready anyway after delay (container might be in a flex layout)
        setIsReady(true);
      }
    }, 150);

    return () => clearTimeout(timer);
  }, [data, loading]);

  if (loading || !data || !data.projects || data.projects.length === 0) {
    return null;
  }

  // Show loading state while waiting for container dimensions
  if (!isReady) {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        <CustomCard>
          <CardHeader title="Project Status Charts" />
          <Box sx={{ padding: "40px", display: "flex", flexDirection: "column", gap: "20px" }}>
            <Box sx={{ width: "100%", height: "300px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Box sx={{ color: "text.secondary" }}>Loading charts...</Box>
            </Box>
          </Box>
        </CustomCard>
      </Box>
    );
  }

  // Aggregate status data across all projects
  const statusAggregation: Record<string, number> = {};
  const priorityAggregation: Record<string, number> = {};

  data.projects.forEach((project) => {
    const stats = project.statistics;
    
    // Aggregate by status
    Object.entries(stats.byStatus || {}).forEach(([status, count]) => {
      statusAggregation[status] = (statusAggregation[status] || 0) + count;
    });

    // Aggregate by priority
    Object.entries(stats.byPriority || {}).forEach(([priority, count]) => {
      priorityAggregation[priority] = (priorityAggregation[priority] || 0) + count;
    });
  });

  // Prepare data for status bar chart
  const statusData = Object.entries(statusAggregation).map(([status, count]) => ({
    status: status.charAt(0).toUpperCase() + status.slice(1).replace("-", " "),
    count,
  }));

  // Prepare data for priority pie chart
  const priorityData = Object.entries(priorityAggregation).map(([priority, count]) => ({
    name: priority.charAt(0).toUpperCase() + priority.slice(1),
    value: count,
  }));

  const COLORS = {
    high: theme.palette.error.main,
    medium: theme.palette.warning.main,
    low: theme.palette.info.main,
  };

  const getPriorityColor = (name: string) => {
    const lowerName = name.toLowerCase();
    return COLORS[lowerName as keyof typeof COLORS] || theme.palette.primary.main;
  };

  // Prepare project completion data
  const projectCompletionData = data.projects
    .slice(0, 10)
    .map((project) => ({
      name: project.title.length > 15 
        ? project.title.substring(0, 15) + "..." 
        : project.title,
      completion: project.statistics.completionRate,
      tasks: project.statistics.totalTasks,
    }));

  return (
    <Box ref={containerRef} sx={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Status Distribution Bar Chart */}
      {statusData.length > 0 && isReady && (
        <CustomCard>
          <CardHeader title="Tasks by Status" />
          <Box sx={{ width: "100%", height: "300px", marginTop: "20px", minWidth: 0, minHeight: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusData}>
                <CartesianGrid strokeDasharray="3 3" stroke={alpha(theme.palette.divider, 0.5)} />
                <XAxis
                  dataKey="status"
                  tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
                />
                <YAxis tick={{ fill: theme.palette.text.secondary, fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: theme.palette.background.paper,
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Bar
                  dataKey="count"
                  fill={theme.palette.primary.main}
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </CustomCard>
      )}

      {/* Priority Distribution Pie Chart */}
      {priorityData.length > 0 && isReady && (
        <CustomCard>
          <CardHeader title="Tasks by Priority" />
          <Box sx={{ width: "100%", height: "300px", marginTop: "20px", minWidth: 0, minHeight: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={priorityData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(props: PieLabelRenderProps) => {
                    const percent = typeof props.percent === 'number' ? props.percent : 0;
                    return `${props.name}: ${(percent * 100).toFixed(0)}%`;
                  }}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {priorityData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={getPriorityColor(entry.name)}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: theme.palette.background.paper,
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: "8px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </Box>
        </CustomCard>
      )}

      {/* Project Completion Comparison */}
      {projectCompletionData.length > 0 && isReady && (
        <CustomCard>
          <CardHeader title="Project Completion Rates" />
          <Box sx={{ width: "100%", height: "300px", marginTop: "20px", minWidth: 0, minHeight: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={projectCompletionData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke={alpha(theme.palette.divider, 0.5)} />
                <XAxis
                  type="number"
                  domain={[0, 100]}
                  tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
                />
                <YAxis
                  dataKey="name"
                  type="category"
                  tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
                  width={120}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: theme.palette.background.paper,
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: "8px",
                  }}
                  formatter={(value: number) => `${value.toFixed(1)}%`}
                />
                <Legend />
                <Bar
                  dataKey="completion"
                  fill={theme.palette.success.main}
                  radius={[0, 8, 8, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </CustomCard>
      )}
    </Box>
  );
};

export default ProjectStatusChart;

