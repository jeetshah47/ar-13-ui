import CardHeader from "../../../common/components/Card/CardHeader";
import CustomCard from "../../../common/components/Card/CustomCard";
import { Avatar, Box, CircularProgress, Typography } from "@mui/material";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector, type RootState } from "../../../store/store";
import { fetchRecentTaskActivityLogs } from "../../../store/features/activityLogs/activityLogsAction";

const ActivityCard = () => {
  const dispatch = useAppDispatch();
  const activityState = useAppSelector((state: RootState) => state.activityLogsReducer.api);

  useEffect(() => {
    dispatch(fetchRecentTaskActivityLogs(10));
  }, [dispatch]);

  const { loading, error, data } = activityState;
  const items = data.items || [];

  return (
    <CustomCard>
      <CardHeader
        title="Activity Stream"
        endElement={
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, pr: 1 }}>
            <Typography variant="body2" color="primary" sx={{ cursor: "default" }}>
              View more
            </Typography>
            <Box component="img" src="/illustration/figma-arrow-down.svg" alt="more" sx={{ width: 16, height: 16 }} />
          </Box>
        }
      />
      <Box sx={{ padding: "8px 0 0 0" }}>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", padding: "16px" }}>
            <CircularProgress size={20} />
          </Box>
        ) : error ? (
          <Typography color="error" sx={{ textAlign: "center", padding: "12px" }}>{error}</Typography>
        ) : items.length === 0 ? (
          <Typography color="secondary" sx={{ textAlign: "center", padding: "12px" }}>No recent activity</Typography>
        ) : (
          <Box sx={{ maxHeight: 360, overflowY: "auto", px: "24px", py: "12px" }}>
            {items.map((log, idx) => {
              const user = log.createdByUser;
              const userName = user?.name || "Unknown User";
              const userDesignation = user?.designation || user?.role || "";
              const primaryText = log.description || `${log.action} on ${log.entityType}`;
              
              // Get icon based on action
              const getActionIcon = () => {
                const a = (log.action || "").toLowerCase();
                if (a.includes("upload") || a.includes("status")) return "/illustration/figma-upload.svg";
                if (a.includes("attach") || a.includes("file")) return "/illustration/figma-attach.svg";
                return null;
              };

              return (
                <Box key={log.id} sx={{ mb: idx !== items.length - 1 ? "12px" : 0 }}>
                  {/* User Avatar and Info */}
                  <Box sx={{ display: "flex", alignItems: "flex-start", gap: "18px", mb: "16px" }}>
                    <Avatar
                      sx={{
                        width: 50,
                        height: 50,
                        bgcolor: "#E0E0E0",
                      }}
                    >
                      {userName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)}
                    </Avatar>
                    <Box sx={{ flex: 1, pt: "4px" }}>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: "#0A1629", mb: "4px" }}>
                        {userName}
                      </Typography>
                      {userDesignation && (
                        <Typography variant="caption" sx={{ color: "#91929E", fontSize: "14px" }}>
                          {userDesignation}
                        </Typography>
                      )}
                    </Box>
                  </Box>

                  {/* Action Card */}
                  <Box
                    sx={{
                      bgcolor: "#F4F9FD",
                      borderRadius: "14px",
                      p: "15px",
                      pl: "20px",
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "16px",
                    }}
                  >
                    {(() => {
                      const iconSrc = getActionIcon();
                      return iconSrc ? (
                        <Box
                          component="img"
                          src={iconSrc}
                          alt={log.action}
                          sx={{ width: 24, height: 24, mt: "2px", flexShrink: 0 }}
                        />
                      ) : null;
                    })()}
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#0A1629",
                        fontSize: "16px",
                        lineHeight: 1.5,
                        flex: 1,
                      }}
                    >
                      {primaryText}
                    </Typography>
                  </Box>
                </Box>
              );
            })}
          </Box>
        )}
      </Box>
    </CustomCard>
  );
};

export default ActivityCard;
