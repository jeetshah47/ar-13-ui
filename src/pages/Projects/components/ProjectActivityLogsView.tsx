import { Box, Typography, Avatar, Chip } from "@mui/material";
import type { ActivityLogItem } from "../../../store/types/ActivityLogs/ActivityLog";

interface ProjectActivityLogsViewProps {
  activityLogs: ActivityLogItem[];
  users: Array<{ id: string; name: string; email?: string }>;
}

const ProjectActivityLogsView = ({ activityLogs, users }: ProjectActivityLogsViewProps) => {
  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  const getUserName = (userId: string): string => {
    return users.find((u) => u.id === userId)?.name || userId;
  };

  const getActionLabel = (action: string): string => {
    return action
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const getActionColor = (action: string): "default" | "primary" | "success" | "warning" | "error" => {
    if (action.includes("created")) return "success";
    if (action.includes("updated") || action.includes("changed")) return "primary";
    if (action.includes("deleted") || action.includes("removed")) return "error";
    return "default";
  };

  return (
    <Box sx={{ padding: { xs: "16px", sm: "24px" } }}>
      {activityLogs.length === 0 ? (
        <Box sx={{ padding: "20px", textAlign: "center" }}>
          <Typography color="text.secondary">No activity logs available</Typography>
        </Box>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {activityLogs.map((log) => (
            <Box
              key={log.id}
              sx={{
                display: "flex",
                gap: 2,
                padding: 2,
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2,
                backgroundColor: "background.paper",
              }}
            >
              <Avatar
                sx={{ width: 40, height: 40, bgcolor: "primary.main" }}
                src={log.createdByUser?.email ? undefined : "/api/placeholder/40/40"}
              >
                {log.createdByUser?.name?.charAt(0)?.toUpperCase() || "?"}
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1, flexWrap: "wrap" }}>
                  <Typography variant="body1" fontWeight="bold">
                    {log.createdByUser?.name || getUserName(log.createdBy)}
                  </Typography>
                  <Chip
                    label={getActionLabel(log.action)}
                    size="small"
                    color={getActionColor(log.action)}
                    sx={{ height: 20, fontSize: "0.7rem" }}
                  />
                </Box>
                {log.description && (
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {log.description}
                  </Typography>
                )}
                {log.fields && Object.keys(log.fields).length > 0 && (
                  <Box sx={{ mb: 1 }}>
                    {Object.entries(log.fields).map(([key, value]) => (
                      <Typography key={key} variant="caption" color="text.secondary" sx={{ display: "block" }}>
                        <strong>{key}:</strong> {String(value)}
                      </Typography>
                    ))}
                  </Box>
                )}
                <Typography variant="caption" color="text.secondary">
                  {formatDate(log.createdAt || log.created)}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default ProjectActivityLogsView;

