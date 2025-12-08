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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Alert,
  TextField,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import { useEffect, useState } from "react";
import PageHeader from "../../common/components/PageHeader/PageHeader";
import CustomCard from "../../common/components/Card/CustomCard";
import CardHeader from "../../common/components/Card/CardHeader";
import {
  getRecentAuditLogs,
  type AuditLog,
  type AuditLogFilters,
} from "../../store/apis/auditLogsApi";
import RefreshIcon from "@mui/icons-material/Refresh";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { format } from "date-fns";

const AuditLogsPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState<AuditLogFilters>({
    limit: 100,
  });
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);

  const fetchAuditLogs = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getRecentAuditLogs(filters);
      setAuditLogs(data.auditLogs);
      setTotal(data.total);
    } catch (err: any) {
      setError(err?.message || "Failed to fetch audit logs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuditLogs();
  }, [filters]);

  const handleFilterChange = (key: keyof AuditLogFilters, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value || undefined,
    }));
  };

  const getStatusColor = (statusCode: number) => {
    if (statusCode >= 200 && statusCode < 300) return "success";
    if (statusCode >= 300 && statusCode < 400) return "info";
    if (statusCode >= 400 && statusCode < 500) return "warning";
    if (statusCode >= 500) return "error";
    return "default";
  };

  const getMethodColor = (method: string) => {
    switch (method) {
      case "GET":
        return "primary";
      case "POST":
        return "success";
      case "PUT":
        return "warning";
      case "DELETE":
        return "error";
      case "PATCH":
        return "info";
      default:
        return "default";
    }
  };

  const formatDuration = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
  };

  const handleViewDetails = (log: AuditLog) => {
    setSelectedLog(log);
    setDetailDialogOpen(true);
  };

  return (
    <Box>
      <PageHeader title="Audit Logs" />

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Filters */}
      <CustomCard sx={{ mb: 3 }}>
        <CardHeader
          title="Filters"
          endElement={
            <IconButton onClick={fetchAuditLogs} color="primary">
              <RefreshIcon />
            </IconButton>
          }
        />
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, p: 2 }}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Method</InputLabel>
            <Select
              value={filters.method || ""}
              label="Method"
              onChange={(e) => handleFilterChange("method", e.target.value)}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="GET">GET</MenuItem>
              <MenuItem value="POST">POST</MenuItem>
              <MenuItem value="PUT">PUT</MenuItem>
              <MenuItem value="DELETE">DELETE</MenuItem>
              <MenuItem value="PATCH">PATCH</MenuItem>
            </Select>
          </FormControl>

          <TextField
            size="small"
            label="Path"
            value={filters.path || ""}
            onChange={(e) => handleFilterChange("path", e.target.value)}
            placeholder="/api/users"
            sx={{ minWidth: 200 }}
          />

          <TextField
            size="small"
            label="User ID"
            value={filters.userId || ""}
            onChange={(e) => handleFilterChange("userId", e.target.value)}
            placeholder="User ID"
            sx={{ minWidth: 150 }}
          />

          <TextField
            size="small"
            label="Status Code"
            type="number"
            value={filters.statusCode || ""}
            onChange={(e) =>
              handleFilterChange(
                "statusCode",
                e.target.value ? parseInt(e.target.value) : undefined
              )
            }
            placeholder="200"
            sx={{ minWidth: 120 }}
          />

          <TextField
            size="small"
            label="Start Date"
            type="date"
            value={filters.startDate || ""}
            onChange={(e) => handleFilterChange("startDate", e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{ minWidth: 150 }}
          />

          <TextField
            size="small"
            label="End Date"
            type="date"
            value={filters.endDate || ""}
            onChange={(e) => handleFilterChange("endDate", e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{ minWidth: 150 }}
          />

          <TextField
            size="small"
            label="Limit"
            type="number"
            value={filters.limit || 100}
            onChange={(e) =>
              handleFilterChange(
                "limit",
                e.target.value ? parseInt(e.target.value) : 100
              )
            }
            sx={{ minWidth: 100 }}
          />
        </Box>
      </CustomCard>

      {/* Summary */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Showing {auditLogs.length} of {total} audit logs
        </Typography>
      </Box>

      {/* Table */}
      <CustomCard>
        <CardHeader title="Audit Logs" />
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Time</TableCell>
                  <TableCell>Method</TableCell>
                  <TableCell>Path</TableCell>
                  <TableCell>User</TableCell>
                  <TableCell>IP Address</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Duration</TableCell>
                  <TableCell>Size</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {auditLogs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} align="center">
                      <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                        No audit logs found
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  auditLogs.map((log) => (
                    <TableRow key={log.id} hover>
                      <TableCell>
                        {format(new Date(log.requestTime), "MMM dd, yyyy HH:mm:ss")}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={log.method}
                          color={getMethodColor(log.method) as any}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          sx={{
                            maxWidth: 300,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {log.path}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {log.userEmail || log.userId || (
                          <Typography variant="body2" color="text.secondary">
                            Anonymous
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontFamily: "monospace" }}>
                          {log.ipAddress}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={log.statusCode}
                          color={getStatusColor(log.statusCode) as any}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{formatDuration(log.duration)}</TableCell>
                      <TableCell>{formatBytes(log.responseSize)}</TableCell>
                      <TableCell>
                        <Tooltip title="View Details">
                          <IconButton
                            size="small"
                            onClick={() => handleViewDetails(log)}
                          >
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </CustomCard>

      {/* Detail Dialog */}
      <Dialog
        open={detailDialogOpen}
        onClose={() => setDetailDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Audit Log Details</DialogTitle>
        <DialogContent>
          {selectedLog && (
            <Box sx={{ mt: 1 }}>
              <Typography variant="subtitle2" gutterBottom>
                Request Information
              </Typography>
              <Box sx={{ mb: 2, p: 1, bgcolor: "grey.100", borderRadius: 1 }}>
                <Typography variant="body2">
                  <strong>Method:</strong> {selectedLog.method}
                </Typography>
                <Typography variant="body2">
                  <strong>Path:</strong> {selectedLog.path}
                </Typography>
                <Typography variant="body2">
                  <strong>Time:</strong>{" "}
                  {format(new Date(selectedLog.requestTime), "PPpp")}
                </Typography>
                <Typography variant="body2">
                  <strong>Duration:</strong> {formatDuration(selectedLog.duration)}
                </Typography>
                <Typography variant="body2">
                  <strong>Status Code:</strong> {selectedLog.statusCode}
                </Typography>
                {selectedLog.error && (
                  <Typography variant="body2" color="error">
                    <strong>Error:</strong> {selectedLog.error}
                  </Typography>
                )}
              </Box>

              <Typography variant="subtitle2" gutterBottom>
                User Information
              </Typography>
              <Box sx={{ mb: 2, p: 1, bgcolor: "grey.100", borderRadius: 1 }}>
                <Typography variant="body2">
                  <strong>User ID:</strong> {selectedLog.userId || "N/A"}
                </Typography>
                <Typography variant="body2">
                  <strong>Email:</strong> {selectedLog.userEmail || "N/A"}
                </Typography>
                <Typography variant="body2">
                  <strong>IP Address:</strong> {selectedLog.ipAddress}
                </Typography>
                <Typography variant="body2">
                  <strong>User Agent:</strong> {selectedLog.userAgent}
                </Typography>
              </Box>

              {selectedLog.queryParams && Object.keys(selectedLog.queryParams).length > 0 && (
                <>
                  <Typography variant="subtitle2" gutterBottom>
                    Query Parameters
                  </Typography>
                  <Box sx={{ mb: 2, p: 1, bgcolor: "grey.100", borderRadius: 1 }}>
                    <pre style={{ margin: 0, fontSize: "0.875rem" }}>
                      {JSON.stringify(selectedLog.queryParams, null, 2)}
                    </pre>
                  </Box>
                </>
              )}

              {selectedLog.requestBody && Object.keys(selectedLog.requestBody).length > 0 && (
                <>
                  <Typography variant="subtitle2" gutterBottom>
                    Request Body
                  </Typography>
                  <Box sx={{ mb: 2, p: 1, bgcolor: "grey.100", borderRadius: 1 }}>
                    <pre style={{ margin: 0, fontSize: "0.875rem" }}>
                      {JSON.stringify(selectedLog.requestBody, null, 2)}
                    </pre>
                  </Box>
                </>
              )}

              <Typography variant="subtitle2" gutterBottom>
                Response Information
              </Typography>
              <Box sx={{ p: 1, bgcolor: "grey.100", borderRadius: 1 }}>
                <Typography variant="body2">
                  <strong>Response Size:</strong> {formatBytes(selectedLog.responseSize)}
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AuditLogsPage;

