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
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PersonIcon from "@mui/icons-material/Person";
import LanguageIcon from "@mui/icons-material/Language";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import WarningIcon from "@mui/icons-material/Warning";
import InfoIcon from "@mui/icons-material/Info";
import { format, formatDistanceToNow } from "date-fns";

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

  // User-friendly status messages
  const getStatusMessage = (statusCode: number): string => {
    const statusMessages: Record<number, string> = {
      200: "Success",
      201: "Created",
      202: "Accepted",
      204: "No Content",
      301: "Moved Permanently",
      302: "Found",
      304: "Not Modified",
      400: "Bad Request",
      401: "Unauthorized",
      403: "Forbidden",
      404: "Not Found",
      409: "Conflict",
      422: "Validation Error",
      429: "Too Many Requests",
      500: "Server Error",
      502: "Bad Gateway",
      503: "Service Unavailable",
      504: "Gateway Timeout",
    };
    return statusMessages[statusCode] || `Status ${statusCode}`;
  };

  const getStatusColor = (statusCode: number) => {
    if (statusCode >= 200 && statusCode < 300) return "success";
    if (statusCode >= 300 && statusCode < 400) return "info";
    if (statusCode >= 400 && statusCode < 500) return "warning";
    if (statusCode >= 500) return "error";
    return "default";
  };

  // User-friendly method labels
  const getMethodLabel = (method: string): string => {
    const methodLabels: Record<string, string> = {
      GET: "View",
      POST: "Create",
      PUT: "Update",
      DELETE: "Delete",
      PATCH: "Modify",
    };
    return methodLabels[method] || method;
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

  // Format path to be more readable
  const formatPath = (path: string): string => {
    // Remove /api prefix if present for cleaner display
    const cleaned = path.replace(/^\/api/, "");
    // Extract meaningful parts
    const parts = cleaned.split("/").filter(Boolean);
    if (parts.length === 0) return path;
    // Capitalize first letter of each part
    return parts
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" / ");
  };

  // Format relative time
  const formatRelativeTime = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
      
      if (diffInHours < 1) {
        return formatDistanceToNow(date, { addSuffix: true });
      } else if (diffInHours < 24) {
        return format(date, "HH:mm:ss") + " (" + formatDistanceToNow(date, { addSuffix: true }) + ")";
      } else {
        return format(date, "MMM dd, yyyy HH:mm:ss");
      }
    } catch {
      return format(new Date(dateString), "MMM dd, yyyy HH:mm:ss");
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
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel>Action Type</InputLabel>
            <Select
              value={filters.method || ""}
              label="Action Type"
              onChange={(e) => handleFilterChange("method", e.target.value)}
            >
              <MenuItem value="">All Actions</MenuItem>
              <MenuItem value="GET">View</MenuItem>
              <MenuItem value="POST">Create</MenuItem>
              <MenuItem value="PUT">Update</MenuItem>
              <MenuItem value="DELETE">Delete</MenuItem>
              <MenuItem value="PATCH">Modify</MenuItem>
            </Select>
          </FormControl>

          <TextField
            size="small"
            label="Resource/Endpoint"
            value={filters.path || ""}
            onChange={(e) => handleFilterChange("path", e.target.value)}
            placeholder="e.g., /api/users"
            sx={{ minWidth: 200 }}
          />

          <TextField
            size="small"
            label="User Email or ID"
            value={filters.userId || ""}
            onChange={(e) => handleFilterChange("userId", e.target.value)}
            placeholder="Search by user"
            sx={{ minWidth: 180 }}
          />

          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Result Status</InputLabel>
            <Select
              value={filters.statusCode?.toString() || ""}
              label="Result Status"
              onChange={(e) =>
                handleFilterChange(
                  "statusCode",
                  e.target.value ? parseInt(e.target.value) : undefined
                )
              }
            >
              <MenuItem value="">All Statuses</MenuItem>
              <MenuItem value="200">Success (200)</MenuItem>
              <MenuItem value="201">Created (201)</MenuItem>
              <MenuItem value="400">Bad Request (400)</MenuItem>
              <MenuItem value="401">Unauthorized (401)</MenuItem>
              <MenuItem value="403">Forbidden (403)</MenuItem>
              <MenuItem value="404">Not Found (404)</MenuItem>
              <MenuItem value="500">Server Error (500)</MenuItem>
            </Select>
          </FormControl>

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
            label="Results per Page"
            type="number"
            value={filters.limit || 100}
            onChange={(e) =>
              handleFilterChange(
                "limit",
                e.target.value ? parseInt(e.target.value) : 100
              )
            }
            sx={{ minWidth: 140 }}
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
          <TableContainer 
            component={Paper} 
            variant="outlined"
            sx={{ maxHeight: "calc(100vh - 400px)", overflow: "auto" }}
          >
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                      <AccessTimeIcon fontSize="small" />
                      Time
                    </Box>
                  </TableCell>
                  <TableCell>Action</TableCell>
                  <TableCell>Resource</TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                      <PersonIcon fontSize="small" />
                      User
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                      <LanguageIcon fontSize="small" />
                      Location
                    </Box>
                  </TableCell>
                  <TableCell>Result</TableCell>
                  <TableCell>Response Time</TableCell>
                  <TableCell>Data Size</TableCell>
                  <TableCell>Details</TableCell>
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
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {format(new Date(log.requestTime), "MMM dd, yyyy")}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {formatRelativeTime(log.requestTime)}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={getMethodLabel(log.method)}
                          color={getMethodColor(log.method) as any}
                          size="small"
                          sx={{ fontWeight: 500 }}
                        />
                      </TableCell>
                      <TableCell>
                        <Tooltip title={log.path}>
                          <Typography
                            variant="body2"
                            sx={{
                              maxWidth: 300,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {formatPath(log.path)}
                          </Typography>
                        </Tooltip>
                      </TableCell>
                      <TableCell>
                        {log.userEmail ? (
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {log.userEmail}
                          </Typography>
                        ) : log.userId ? (
                          <Typography variant="body2" color="text.secondary">
                            User: {log.userId}
                          </Typography>
                        ) : (
                          <Typography variant="body2" color="text.secondary" sx={{ fontStyle: "italic" }}>
                            Anonymous
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontFamily: "monospace", fontSize: "0.85rem" }}>
                          {log.ipAddress}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={`${getStatusMessage(log.statusCode)} (${log.statusCode})`}
                          color={getStatusColor(log.statusCode) as any}
                          size="small"
                          icon={
                            log.statusCode >= 200 && log.statusCode < 300 ? (
                              <CheckCircleIcon fontSize="small" />
                            ) : log.statusCode >= 400 && log.statusCode < 500 ? (
                              <WarningIcon fontSize="small" />
                            ) : log.statusCode >= 500 ? (
                              <ErrorIcon fontSize="small" />
                            ) : (
                              <InfoIcon fontSize="small" />
                            )
                          }
                          sx={{ fontWeight: 500 }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {formatDuration(log.duration)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {formatBytes(log.responseSize)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Tooltip title="View Full Details">
                          <IconButton
                            size="small"
                            onClick={() => handleViewDetails(log)}
                            color="primary"
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
        <DialogTitle>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <InfoIcon color="primary" />
            Activity Details
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedLog && (
            <Box sx={{ mt: 1 }}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2, mb: 1 }}>
                What Happened?
              </Typography>
              <Box sx={{ mb: 3, p: 2, bgcolor: "grey.50", borderRadius: 2, border: "1px solid", borderColor: "grey.200" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                  <Chip
                    label={getMethodLabel(selectedLog.method)}
                    color={getMethodColor(selectedLog.method) as any}
                    size="small"
                    sx={{ fontWeight: 600 }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    action performed on
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {formatPath(selectedLog.path)}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                  <Chip
                    label={`${getStatusMessage(selectedLog.statusCode)} (${selectedLog.statusCode})`}
                    color={getStatusColor(selectedLog.statusCode) as any}
                    size="small"
                    icon={
                      selectedLog.statusCode >= 200 && selectedLog.statusCode < 300 ? (
                        <CheckCircleIcon fontSize="small" />
                      ) : selectedLog.statusCode >= 400 && selectedLog.statusCode < 500 ? (
                        <WarningIcon fontSize="small" />
                      ) : selectedLog.statusCode >= 500 ? (
                        <ErrorIcon fontSize="small" />
                      ) : (
                        <InfoIcon fontSize="small" />
                      )
                    }
                    sx={{ fontWeight: 500 }}
                  />
                </Box>
                {selectedLog.error && (
                  <Alert severity="error" sx={{ mt: 1 }}>
                    <strong>Error occurred:</strong> {selectedLog.error}
                  </Alert>
                )}
              </Box>

              <Typography variant="h6" gutterBottom sx={{ mt: 3, mb: 1 }}>
                When & How Long?
              </Typography>
              <Box sx={{ mb: 3, p: 2, bgcolor: "grey.50", borderRadius: 2, border: "1px solid", borderColor: "grey.200" }}>
                <Typography variant="body2" sx={{ mb: 0.5 }}>
                  <strong>Date & Time:</strong> {format(new Date(selectedLog.requestTime), "PPpp")}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {formatRelativeTime(selectedLog.requestTime)}
                </Typography>
                <Typography variant="body2">
                  <strong>Response Time:</strong> {formatDuration(selectedLog.duration)}
                </Typography>
                <Typography variant="body2">
                  <strong>Data Transferred:</strong> {formatBytes(selectedLog.responseSize)}
                </Typography>
              </Box>

              <Typography variant="h6" gutterBottom sx={{ mt: 3, mb: 1 }}>
                Who Did This?
              </Typography>
              <Box sx={{ mb: 3, p: 2, bgcolor: "grey.50", borderRadius: 2, border: "1px solid", borderColor: "grey.200" }}>
                {selectedLog.userEmail ? (
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>User Email:</strong> {selectedLog.userEmail}
                  </Typography>
                ) : selectedLog.userId ? (
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>User ID:</strong> {selectedLog.userId}
                  </Typography>
                ) : (
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontStyle: "italic" }}>
                    Anonymous user (not logged in)
                  </Typography>
                )}
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>IP Address:</strong> <span style={{ fontFamily: "monospace" }}>{selectedLog.ipAddress}</span>
                </Typography>
                <Typography variant="body2">
                  <strong>Browser/Device:</strong> {selectedLog.userAgent}
                </Typography>
              </Box>

              {selectedLog.queryParams && Object.keys(selectedLog.queryParams).length > 0 && (
                <>
                  <Typography variant="h6" gutterBottom sx={{ mt: 3, mb: 1 }}>
                    Search/Filter Parameters
                  </Typography>
                  <Box sx={{ mb: 3, p: 2, bgcolor: "grey.50", borderRadius: 2, border: "1px solid", borderColor: "grey.200" }}>
                    <Box
                      component="pre"
                      sx={{
                        margin: 0,
                        fontSize: "0.875rem",
                        fontFamily: "monospace",
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-word",
                        bgcolor: "white",
                        p: 1,
                        borderRadius: 1,
                      }}
                    >
                      {JSON.stringify(selectedLog.queryParams, null, 2)}
                    </Box>
                  </Box>
                </>
              )}

              {selectedLog.requestBody && Object.keys(selectedLog.requestBody).length > 0 && (
                <>
                  <Typography variant="h6" gutterBottom sx={{ mt: 3, mb: 1 }}>
                    Data Sent
                  </Typography>
                  <Box sx={{ mb: 3, p: 2, bgcolor: "grey.50", borderRadius: 2, border: "1px solid", borderColor: "grey.200" }}>
                    <Box
                      component="pre"
                      sx={{
                        margin: 0,
                        fontSize: "0.875rem",
                        fontFamily: "monospace",
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-word",
                        bgcolor: "white",
                        p: 1,
                        borderRadius: 1,
                      }}
                    >
                      {JSON.stringify(selectedLog.requestBody, null, 2)}
                    </Box>
                  </Box>
                </>
              )}

              <Typography variant="h6" gutterBottom sx={{ mt: 3, mb: 1 }}>
                Technical Details
              </Typography>
              <Box sx={{ mb: 2, p: 2, bgcolor: "grey.50", borderRadius: 2, border: "1px solid", borderColor: "grey.200" }}>
                <Typography variant="body2" sx={{ mb: 0.5 }}>
                  <strong>Full Endpoint:</strong> <span style={{ fontFamily: "monospace", fontSize: "0.85rem" }}>{selectedLog.path}</span>
                </Typography>
                <Typography variant="body2" sx={{ mb: 0.5 }}>
                  <strong>HTTP Method:</strong> {selectedLog.method}
                </Typography>
                <Typography variant="body2">
                  <strong>Status Code:</strong> {selectedLog.statusCode}
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailDialogOpen(false)} variant="contained">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AuditLogsPage;

