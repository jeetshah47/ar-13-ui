import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Grid,
  IconButton,
  Tooltip,
} from "@mui/material";
import { useEffect, useState } from "react";
import PageHeader from "../../common/components/PageHeader/PageHeader";
import CustomCard from "../../common/components/Card/CustomCard";
import CardHeader from "../../common/components/Card/CardHeader";
import {
  getAllMetrics,
  getMetricsByService,
  getTopServices,
  resetMetrics,
  type ServiceMetrics,
  type TopServicesResponse,
} from "../../store/apis/metricsApi";
import RefreshIcon from "@mui/icons-material/Refresh";
import DeleteIcon from "@mui/icons-material/Delete";
import { formatBytes, formatDuration } from "./utils";

const MetricsPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [topServices, setTopServices] = useState<ServiceMetrics[]>([]);
  const [summary, setSummary] = useState<TopServicesResponse["summary"] | null>(null);
  const [sortBy, setSortBy] = useState<"requests" | "duration" | "bytes_in" | "bytes_out" | "total_bytes">("requests");
  const [limit, setLimit] = useState(10);
  const [viewMode, setViewMode] = useState<"top" | "by-service">("top");

  const fetchMetrics = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (viewMode === "top") {
        const data = await getTopServices(sortBy, limit);
        setTopServices(data.top_services);
        setSummary(data.summary);
      } else {
        const data = await getMetricsByService();
        // Sort by the selected criteria
        const sorted = [...data.services].sort((a, b) => {
          switch (sortBy) {
            case "requests":
              return b.request_count - a.request_count;
            case "duration":
              return b.total_duration_ms - a.total_duration_ms;
            case "bytes_in":
              return b.total_bytes_in - a.total_bytes_in;
            case "bytes_out":
              return b.total_bytes_out - a.total_bytes_out;
            case "total_bytes":
              return (b.total_bytes_in + b.total_bytes_out) - (a.total_bytes_in + a.total_bytes_out);
            default:
              return 0;
          }
        });
        setTopServices(sorted.slice(0, limit));
        // Calculate summary from all services
        const totalRequests = data.services.reduce((sum, s) => sum + s.request_count, 0);
        const totalDuration = data.services.reduce((sum, s) => sum + s.total_duration_ms, 0);
        const totalBytesIn = data.services.reduce((sum, s) => sum + s.total_bytes_in, 0);
        const totalBytesOut = data.services.reduce((sum, s) => sum + s.total_bytes_out, 0);
        setSummary({
          total_services: data.total_services,
          total_requests: totalRequests,
          total_duration_ms: totalDuration,
          total_bytes_in: totalBytesIn,
          total_bytes_out: totalBytesOut,
          total_bytes: totalBytesIn + totalBytesOut,
        });
      }
    } catch (err: any) {
      setError(err?.message || "Failed to fetch metrics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, [sortBy, limit, viewMode]);

  const handleReset = async () => {
    if (!window.confirm("Are you sure you want to reset all metrics? This action cannot be undone.")) {
      return;
    }
    try {
      await resetMetrics();
      await fetchMetrics();
    } catch (err: any) {
      setError(err?.message || "Failed to reset metrics");
    }
  };

  const getSortLabel = (sort: string) => {
    switch (sort) {
      case "requests":
        return "Request Count";
      case "duration":
        return "Total Duration";
      case "bytes_in":
        return "Bytes In";
      case "bytes_out":
        return "Bytes Out";
      case "total_bytes":
        return "Total Network Usage";
      default:
        return sort;
    }
  };

  return (
    <Box>
      <PageHeader
        title="System Metrics"
        subtitle="Monitor resource usage by service and endpoint"
      />

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Summary Cards */}
      {summary && (
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  Total Requests
                </Typography>
                <Typography variant="h5" fontWeight="bold">
                  {summary.total_requests.toLocaleString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  Total Duration
                </Typography>
                <Typography variant="h5" fontWeight="bold">
                  {formatDuration(summary.total_duration_ms)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  Total Bytes In
                </Typography>
                <Typography variant="h5" fontWeight="bold">
                  {formatBytes(summary.total_bytes_in)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  Total Bytes Out
                </Typography>
                <Typography variant="h5" fontWeight="bold">
                  {formatBytes(summary.total_bytes_out)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Controls */}
      <CustomCard>
        <CardHeader
          title="Service Metrics"
          action={
            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel>View Mode</InputLabel>
                <Select
                  value={viewMode}
                  label="View Mode"
                  onChange={(e) => setViewMode(e.target.value as "top" | "by-service")}
                >
                  <MenuItem value="top">Top Services</MenuItem>
                  <MenuItem value="by-service">All Services</MenuItem>
                </Select>
              </FormControl>
              <FormControl size="small" sx={{ minWidth: 180 }}>
                <InputLabel>Sort By</InputLabel>
                <Select
                  value={sortBy}
                  label="Sort By"
                  onChange={(e) =>
                    setSortBy(
                      e.target.value as
                        | "requests"
                        | "duration"
                        | "bytes_in"
                        | "bytes_out"
                        | "total_bytes"
                    )
                  }
                >
                  <MenuItem value="requests">Request Count</MenuItem>
                  <MenuItem value="duration">Total Duration</MenuItem>
                  <MenuItem value="bytes_in">Bytes In</MenuItem>
                  <MenuItem value="bytes_out">Bytes Out</MenuItem>
                  <MenuItem value="total_bytes">Total Network</MenuItem>
                </Select>
              </FormControl>
              <FormControl size="small" sx={{ minWidth: 100 }}>
                <InputLabel>Limit</InputLabel>
                <Select
                  value={limit}
                  label="Limit"
                  onChange={(e) => setLimit(Number(e.target.value))}
                >
                  <MenuItem value={5}>Top 5</MenuItem>
                  <MenuItem value={10}>Top 10</MenuItem>
                  <MenuItem value={20}>Top 20</MenuItem>
                  <MenuItem value={50}>Top 50</MenuItem>
                </Select>
              </FormControl>
              <Tooltip title="Refresh Metrics">
                <IconButton onClick={fetchMetrics} disabled={loading}>
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Reset Metrics">
                <IconButton onClick={handleReset} disabled={loading} color="error">
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </Box>
          }
        />
        <Box sx={{ p: 2 }}>
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
              <CircularProgress />
            </Box>
          ) : topServices.length === 0 ? (
            <Alert severity="info">No metrics data available. Start using the application to generate metrics.</Alert>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Service</TableCell>
                    <TableCell align="right">Requests</TableCell>
                    <TableCell align="right">Avg Duration</TableCell>
                    <TableCell align="right">Total Duration</TableCell>
                    <TableCell align="right">Bytes In</TableCell>
                    <TableCell align="right">Bytes Out</TableCell>
                    <TableCell align="right">Total Network</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {topServices.map((service) => (
                    <TableRow key={service.service} hover>
                      <TableCell>
                        <Chip
                          label={service.service}
                          color="primary"
                          variant="outlined"
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="right">
                        {service.request_count.toLocaleString()}
                      </TableCell>
                      <TableCell align="right">
                        {formatDuration(service.avg_duration_ms)}
                      </TableCell>
                      <TableCell align="right">
                        {formatDuration(service.total_duration_ms)}
                      </TableCell>
                      <TableCell align="right">
                        {formatBytes(service.total_bytes_in)}
                      </TableCell>
                      <TableCell align="right">
                        {formatBytes(service.total_bytes_out)}
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" fontWeight="bold">
                          {formatBytes(service.total_bytes_in + service.total_bytes_out)}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      </CustomCard>

      {/* Endpoint Details */}
      {!loading && topServices.length > 0 && (
        <CustomCard sx={{ mt: 3 }}>
          <CardHeader title="Endpoint Details" />
          <Box sx={{ p: 2 }}>
            {topServices.map((service) => (
              <Box key={service.service} sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ mb: 1 }}>
                  {service.service} ({service.endpoints.length} endpoints)
                </Typography>
                <TableContainer component={Paper} variant="outlined">
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Endpoint</TableCell>
                        <TableCell align="right">Requests</TableCell>
                        <TableCell align="right">Avg Duration</TableCell>
                        <TableCell align="right">Bytes In</TableCell>
                        <TableCell align="right">Bytes Out</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {service.endpoints
                        .sort((a, b) => b.request_count - a.request_count)
                        .slice(0, 5)
                        .map((endpoint) => (
                          <TableRow key={endpoint.endpoint}>
                            <TableCell>
                              <Typography variant="body2" fontFamily="monospace">
                                {endpoint.endpoint}
                              </Typography>
                            </TableCell>
                            <TableCell align="right">
                              {endpoint.request_count.toLocaleString()}
                            </TableCell>
                            <TableCell align="right">
                              {formatDuration(endpoint.avg_duration_ms)}
                            </TableCell>
                            <TableCell align="right">
                              {formatBytes(endpoint.total_bytes_in)}
                            </TableCell>
                            <TableCell align="right">
                              {formatBytes(endpoint.total_bytes_out)}
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                {service.endpoints.length > 5 && (
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block" }}>
                    Showing top 5 of {service.endpoints.length} endpoints
                  </Typography>
                )}
              </Box>
            ))}
          </Box>
        </CustomCard>
      )}
    </Box>
  );
};

export default MetricsPage;

