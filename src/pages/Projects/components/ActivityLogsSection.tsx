import { Box, Typography } from "@mui/material";
import ActivityLogItem from "./ActivityLogItem";
import type { ActivityLog } from "../../../store/types/Task/TaskTypes";

interface ActivityLogsSectionProps {
  activityLogs?: ActivityLog[];
  loading: boolean;
  getActivityIcon: (type: ActivityLog["type"]) => React.ComponentType;
  parseFirebaseTimestamp: (
    timestamp: string | { _seconds: number; _nanoseconds: number }
  ) => Date;
  activityLogsRef: React.RefObject<{ [key: string]: HTMLDivElement | null }>;
}

const ActivityLogsSection = ({
  activityLogs,
  loading,
  getActivityIcon,
  parseFirebaseTimestamp,
  activityLogsRef,
}: ActivityLogsSectionProps) => {
  return (
    <Box
      sx={{
        borderTop: "1px solid #E4E6E8",
        marginTop: { xs: "16px", sm: "16px" },
        paddingTop: { xs: "20px", sm: "28px" },
        width: "100%",
        maxWidth: "100%",
        overflowX: "hidden",
        boxSizing: "border-box",
      }}
    >
      <Typography 
        fontWeight={700}
        sx={{ 
          fontSize: { xs: "16px", sm: "18px" },
          mb: { xs: "12px", sm: "16px" },
        }}
      >
        Recent Activity
      </Typography>
      {activityLogs === undefined || (activityLogs.length === 0 && loading) ? (
        <Box sx={{ padding: { xs: "16px", sm: "20px" }, textAlign: "center" }}>
          <Typography sx={{ fontSize: { xs: "14px", sm: "16px" } }}>
            Loading activity logs...
          </Typography>
        </Box>
      ) : activityLogs && activityLogs.length > 0 ? (
        <Box>
          {activityLogs.map((activity: ActivityLog) => {
            const ActivityIcon = getActivityIcon(activity.type);
            const activityDate = parseFirebaseTimestamp(activity.timestamp);
            const formattedDate = activityDate.toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            });
            const formattedTime = activityDate.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            });

            return (
              <Box
                key={activity.id}
                id={`activity-${activity.id}`}
                ref={(el: HTMLDivElement | null) => {
                  if (activityLogsRef.current) {
                    activityLogsRef.current[activity.id] = el;
                  }
                }}
              >
                <ActivityLogItem
                  activity={activity}
                  activityIcon={ActivityIcon}
                  formattedDate={formattedDate}
                  formattedTime={formattedTime}
                />
              </Box>
            );
          })}
        </Box>
      ) : (
        <Box sx={{ padding: { xs: "16px", sm: "20px" }, textAlign: "center" }}>
          <Typography 
            color="secondary.main"
            sx={{ fontSize: { xs: "14px", sm: "16px" } }}
          >
            No recent activity
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default ActivityLogsSection;
