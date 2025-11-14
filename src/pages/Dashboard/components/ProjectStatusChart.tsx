import { Box, useMediaQuery, Pagination } from "@mui/material";
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
import { useEffect, useState, useRef, useMemo } from "react";

const ProjectStatusChart = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const [isReady, setIsReady] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const statisticsState = useAppSelector(
    (state: RootState) => state.projectStatisticsReducer.api
  );

  const { data, loading } = statisticsState;

  // Calculate items per page based on screen size
  const itemsPerPage = isMobile ? 5 : isTablet ? 8 : 10;

  // Calculate responsive chart height
  const chartHeight = isMobile ? 250 : isTablet ? 280 : 300;
  const pieRadius = isMobile ? 60 : isTablet ? 80 : 100;

  // Prepare all project completion data (must be before early returns)
  const allProjectCompletionData = useMemo(() => {
    if (!data?.projects) return [];
    return data.projects.map((project) => ({
      name: project.title.length > 15 
        ? project.title.substring(0, 15) + "..." 
        : project.title,
      fullName: project.title,
      completion: project.statistics.completionRate,
      tasks: project.statistics.totalTasks,
    }));
  }, [data?.projects]);

  // Calculate pagination
  const totalPages = Math.ceil(allProjectCompletionData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const projectCompletionData = allProjectCompletionData.slice(startIndex, endIndex);

  // Reset to page 1 when items per page changes (e.g., on resize)
  useEffect(() => {
    setCurrentPage(1);
  }, [itemsPerPage]);

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

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
  };

  if (loading || !data || !data.projects || data.projects.length === 0) {
    return null;
  }

  // Show loading state while waiting for container dimensions
  if (!isReady) {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", gap: { xs: "16px", sm: "20px", md: "24px" } }}>
        <CustomCard>
          <CardHeader title="Project Status Charts" />
          <Box sx={{ padding: { xs: "16px", sm: "24px", md: "40px" }, display: "flex", flexDirection: "column", gap: "20px" }}>
            <Box sx={{ width: "100%", height: `${chartHeight}px`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Box sx={{ color: "text.secondary", fontSize: { xs: "12px", sm: "14px" } }}>Loading charts...</Box>
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

  return (
    <Box ref={containerRef} sx={{ display: "flex", flexDirection: "column", gap: { xs: "16px", sm: "20px", md: "24px" } }}>
      {/* Status Distribution Bar Chart */}
      {statusData.length > 0 && isReady && (
        <CustomCard>
          <CardHeader title="Tasks by Status" />
          <Box 
            sx={{ 
              width: "100%", 
              height: `${chartHeight}px`, 
              marginTop: { xs: "12px", sm: "16px", md: "20px" }, 
              minWidth: 0, 
              minHeight: chartHeight,
              padding: { xs: "8px", sm: "12px", md: 0 }
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={statusData}
                margin={{ top: 5, right: isMobile ? 5 : 20, left: isMobile ? -10 : 0, bottom: isMobile ? 0 : 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke={alpha(theme.palette.divider, 0.5)} />
                <XAxis
                  dataKey="status"
                  tick={{ fill: theme.palette.text.secondary, fontSize: isMobile ? 10 : 12 }}
                  angle={isMobile ? -45 : 0}
                  textAnchor={isMobile ? "end" : "middle"}
                  height={isMobile ? 60 : 40}
                />
                <YAxis 
                  tick={{ fill: theme.palette.text.secondary, fontSize: isMobile ? 10 : 12 }}
                  width={isMobile ? 40 : 60}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: theme.palette.background.paper,
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: "8px",
                    fontSize: isMobile ? "11px" : "12px",
                  }}
                />
                {!isMobile && <Legend />}
                <Bar
                  dataKey="count"
                  fill={theme.palette.primary.main}
                  radius={[8, 8, 0, 0]}
                  barSize={isMobile ? 20 : 40}
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
          <Box 
            sx={{ 
              width: "100%", 
              height: `${chartHeight}px`, 
              marginTop: { xs: "12px", sm: "16px", md: "20px" }, 
              minWidth: 0, 
              minHeight: chartHeight,
              padding: { xs: "8px", sm: "12px", md: 0 }
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={priorityData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(props: PieLabelRenderProps) => {
                    if (isMobile) return ""; // Hide labels on mobile for cleaner look
                    const percent = typeof props.percent === 'number' ? props.percent : 0;
                    return `${props.name}: ${(percent * 100).toFixed(0)}%`;
                  }}
                  outerRadius={pieRadius}
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
                    fontSize: isMobile ? "11px" : "12px",
                  }}
                  formatter={(value: number, name: string) => [
                    `${value} (${((value / priorityData.reduce((sum, d) => sum + d.value, 0)) * 100).toFixed(0)}%)`,
                    name
                  ]}
                />
                {!isMobile && <Legend />}
              </PieChart>
            </ResponsiveContainer>
          </Box>
        </CustomCard>
      )}

      {/* Project Completion Comparison */}
      {allProjectCompletionData.length > 0 && isReady && (
        <CustomCard>
          <CardHeader title="Project Completion Rates" />
          <Box 
            sx={{ 
              width: "100%", 
              height: `${chartHeight}px`, 
              marginTop: { xs: "12px", sm: "16px", md: "20px" }, 
              minWidth: 0, 
              minHeight: chartHeight,
              padding: { xs: "8px", sm: "12px", md: 0 }
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={projectCompletionData} 
                layout="vertical"
                margin={{ top: 5, right: isMobile ? 5 : 20, left: isMobile ? 60 : 120, bottom: isMobile ? 0 : 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke={alpha(theme.palette.divider, 0.5)} />
                <XAxis
                  type="number"
                  domain={[0, 100]}
                  tick={{ fill: theme.palette.text.secondary, fontSize: isMobile ? 10 : 12 }}
                />
                <YAxis
                  dataKey="name"
                  type="category"
                  tick={{ fill: theme.palette.text.secondary, fontSize: isMobile ? 10 : 12 }}
                  width={isMobile ? 60 : 120}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: theme.palette.background.paper,
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: "8px",
                    fontSize: isMobile ? "11px" : "12px",
                  }}
                  formatter={(value: number, _name: string, props: { payload?: { fullName?: string } }) => [
                    `${value.toFixed(1)}%`,
                    props.payload?.fullName || ""
                  ]}
                />
                {!isMobile && <Legend />}
                <Bar
                  dataKey="completion"
                  fill={theme.palette.success.main}
                  radius={[0, 8, 8, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </Box>
          {/* Pagination Controls */}
          {totalPages > 1 && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: { xs: "16px", sm: "20px", md: "24px" },
                paddingTop: { xs: "8px", sm: "12px", md: "16px" },
                gap: "8px",
              }}
            >
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
                size={isMobile ? "small" : "medium"}
                siblingCount={isMobile ? 0 : 1}
                boundaryCount={isMobile ? 1 : 1}
                sx={{
                  "& .MuiPaginationItem-root": {
                    fontSize: isMobile ? "0.75rem" : "0.875rem",
                  },
                }}
              />
            </Box>
          )}
        </CustomCard>
      )}
    </Box>
  );
};

export default ProjectStatusChart;

