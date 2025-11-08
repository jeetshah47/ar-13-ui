import {
  Box,
  CircularProgress,
  Typography,
  type CircularProgressProps,
  Chip,
} from "@mui/material";
import { useAppSelector } from "../../../store/store";
import type { LeaveRequest } from "../../../store/types/Vacation/VacationTypes";

const VacationSection = () => {
  const { profile, profileLoading } = useAppSelector((s) => s.userReducer);
  const leaveRequests = profile?.leaveRequests || [];

  // Format Firestore timestamp to date string
  const formatDate = (timestamp: { _seconds: number; _nanoseconds?: number } | undefined): string => {
    if (!timestamp) return "N/A";
    try {
      const dateObj = new Date(timestamp._seconds * 1000 + (timestamp._nanoseconds || 0) / 1000000);
      if (isNaN(dateObj.getTime())) return "Invalid Date";
      return dateObj.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "Invalid Date";
    }
  };

  // Get request type label
  const getRequestTypeLabel = (type: string): string => {
    switch (type) {
      case "vacation":
        return "Vacation";
      case "sick_leave":
        return "Sick Leave";
      case "work_remotely":
        return "Work Remotely";
      default:
        return type;
    }
  };

  // Get status color for vacation statuses
  const getStatusColor = (status: string): { bg: string; text: string } => {
    switch (status.toLowerCase()) {
      case "approved":
        return { bg: "#4CAF50", text: "#FFFFFF" };
      case "rejected":
        return { bg: "#F44336", text: "#FFFFFF" };
      case "cancelled":
        return { bg: "#9E9E9E", text: "#FFFFFF" };
      case "pending":
      default:
        return { bg: "#FF9800", text: "#FFFFFF" };
    }
  };

  // Get status display name
  const getStatusDisplayName = (status: string): string => {
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  };

  // Calculate vacation stats
  const calculateStats = () => {
    if (!leaveRequests || leaveRequests.length === 0) {
      return { vacationDays: 0, sickLeaveDays: 0, remoteWorkDays: 0 };
    }

    return leaveRequests.reduce(
      (acc, request) => {
        if (request.status === "approved") {
          const days = request.durationType === "days" ? request.duration : Math.ceil(request.duration / 8);
          if (request.requestType === "vacation") {
            acc.vacationDays += days;
          } else if (request.requestType === "sick_leave") {
            acc.sickLeaveDays += days;
          } else if (request.requestType === "work_remotely") {
            acc.remoteWorkDays += days;
          }
        }
        return acc;
      },
      { vacationDays: 0, sickLeaveDays: 0, remoteWorkDays: 0 }
    );
  };

  const stats = calculateStats();

  const CircularProgressCust = (
    props: CircularProgressProps & { value: number }
  ) => (
    <Box sx={{ position: "relative", display: "inline-flex" }}>
      <CircularProgress variant="determinate" size={"72px"} {...props} />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: "absolute",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography
          variant="caption"
          component="div"
          sx={{ color: "text.secondary", fontWeight: 700 }}
        >
          {`${props.value}`}
        </Typography>
      </Box>
    </Box>
  );

  const RequestCard = ({ request }: { request: LeaveRequest }) => (
    <Box
      sx={{
        display: "flex",
        borderRadius: "24px",
        padding: "22px 28px",
        backgroundColor: "#fff",
        justifyContent: "space-between",
        marginTop: "10px",
        flexWrap: "wrap",
        gap: "16px",
      }}
    >
      <Box>
        <Typography fontSize={"14px"} color="secondary.main">
          Request Type
        </Typography>
        <Typography fontWeight={700}>{getRequestTypeLabel(request.requestType)}</Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          width: "70%",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        <Box>
          <Typography fontSize={"14px"} color="secondary.main">
            Duration
          </Typography>
          <Typography>
            {request.duration} {request.durationType === "days" ? "Days" : "Hours"}
          </Typography>
        </Box>
        <Box>
          <Typography fontSize={"14px"} color="secondary.main">
            Start Day
          </Typography>
          <Typography>{formatDate(request.startDate)}</Typography>
        </Box>
        <Box>
          <Typography fontSize={"14px"} color="secondary.main">
            End Day
          </Typography>
          <Typography>{formatDate(request.endDate)}</Typography>
        </Box>
        <Box>
          <Chip
            label={getStatusDisplayName(request.status)}
            sx={{
              backgroundColor: getStatusColor(request.status).bg,
              color: getStatusColor(request.status).text,
              fontWeight: 600,
              fontSize: "12px",
            }}
          />
        </Box>
      </Box>
    </Box>
  );

  if (profileLoading) {
    return (
      <Box sx={{ padding: "12px 0px", display: "flex", justifyContent: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ padding: "12px 0px" }}>
      <Box
        sx={{
          gap: "16px",
          display: "flex",
        }}
      >
        <Box
          sx={{
            backgroundColor: "#fff",
            borderRadius: "24px",
            padding: "24px",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <CircularProgressCust value={stats.vacationDays} />
          <Typography fontWeight={700}>Vacation</Typography>
          <Typography color="secondary.main">{stats.vacationDays} days used</Typography>
        </Box>
        <Box
          sx={{
            backgroundColor: "#fff",
            borderRadius: "24px",
            padding: "24px",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <CircularProgressCust value={stats.sickLeaveDays} />
          <Typography fontWeight={700}>Sick Leave</Typography>
          <Typography color="secondary.main">{stats.sickLeaveDays} days used</Typography>
        </Box>
        <Box
          sx={{
            backgroundColor: "#fff",
            borderRadius: "24px",
            padding: "24px",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <CircularProgressCust value={stats.remoteWorkDays} />
          <Typography fontWeight={700}>Remote Work</Typography>
          <Typography color="secondary.main">{stats.remoteWorkDays} days used</Typography>
        </Box>
      </Box>
      <Box sx={{ paddingY: "16px" }}>
        <Typography fontSize={"22px"} fontWeight={700} sx={{ marginBottom: "16px" }}>
          My Requests
        </Typography>
        {leaveRequests.length === 0 ? (
          <Box
            sx={{
              backgroundColor: "#fff",
              borderRadius: "24px",
              padding: "40px",
              textAlign: "center",
            }}
          >
            <Typography color="secondary.main">No leave requests found</Typography>
          </Box>
        ) : (
          leaveRequests.map((request) => (
            <RequestCard key={request.id} request={request} />
          ))
        )}
      </Box>
    </Box>
  );
};

export default VacationSection;

