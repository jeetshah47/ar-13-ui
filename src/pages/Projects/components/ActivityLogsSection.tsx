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
        marginTop: "16px",
        paddingTop: "28px",
      }}
    >
      <Typography fontWeight={700}>Recent Activity</Typography>
      {activityLogs === undefined || (activityLogs.length === 0 && loading) ? (
        <Box sx={{ padding: "20px", textAlign: "center" }}>
          <Typography>Loading activity logs...</Typography>
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
        <Box sx={{ padding: "20px", textAlign: "center" }}>
          <Typography color="secondary.main">No recent activity</Typography>
        </Box>
      )}
    </Box>
  );
};

export default ActivityLogsSection;
