import { Box, Button, SvgIcon, Typography, Chip, Divider, useMediaQuery, useTheme } from "@mui/material";
import CrossIcon from "../../../assets/icons/general/calendar-6.svg?react";
import type { CalendarResponse } from "../../../store/types/Calendar/CalendarResponse";
import { useAppSelector } from "../../../store/store";

type EventDetailsModalProps = {
  event: CalendarResponse;
  onClose: () => void;
  onEdit: () => void;
};

const EventDetailsModal = ({ event, onClose, onEdit }: EventDetailsModalProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { users } = useAppSelector((state) => state.userReducer);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Invalid Date";
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Invalid Time";
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDuration = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) return "N/A";
    const diffMs = endDate.getTime() - startDate.getTime();
    const diffMins = Math.round(diffMs / (1000 * 60));
    if (diffMins < 60) return `${diffMins} minutes`;
    const hours = Math.floor(diffMins / 60);
    const mins = diffMins % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  const getCategoryColor = (category: string | undefined) => {
    if (!category) return "#DE92EB";
    switch (category.toLowerCase()) {
      case "work":
        return "#4ECDC4";
      case "personal":
        return "#45B7D1";
      case "meeting":
        return "#96CEB4";
      case "appointment":
        return "#FFEAA7";
      default:
        return "#DE92EB";
    }
  };

  const getPriorityColor = (priority: string | undefined) => {
    if (!priority) return "default";
    switch (priority.toLowerCase()) {
      case "high":
        return "error";
      case "medium":
        return "warning";
      case "low":
        return "info";
      default:
        return "default";
    }
  };

  const getInvitedMemberNames = () => {
    if (!event.invitedMemberIds || event.invitedMemberIds.length === 0) return [];
    return event.invitedMemberIds
      .map((id) => users.find((user) => user.id === id)?.name)
      .filter((name): name is string => !!name);
  };

  return (
    <Box
      sx={(theme) => ({
        backgroundColor: theme.palette.background.paper,
        borderRadius: { xs: "16px", sm: "24px" },
        padding: { xs: "20px", sm: "28px" },
        width: { xs: "90vw", sm: "500px" },
        maxWidth: { xs: "400px", sm: "500px" },
        maxHeight: "90vh",
        overflow: "auto",
        boxShadow: theme.shadows[10],
      })}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "24px",
        }}
      >
        <Box sx={{ flex: 1 }}>
          <Typography
            fontWeight="bold"
            variant="h5"
            sx={{ marginBottom: "8px", wordBreak: "break-word" }}
          >
            {event.title || "Untitled Event"}
          </Typography>
          <Box sx={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "8px" }}>
            {event.category && (
              <Chip
                label={event.category}
                size="small"
                sx={{
                  backgroundColor: getCategoryColor(event.category),
                  color: "white",
                  fontWeight: 600,
                }}
              />
            )}
            {event.priority && (
              <Chip
                label={event.priority}
                size="small"
                color={getPriorityColor(event.priority)}
                sx={{ fontWeight: 600 }}
              />
            )}
            {event.eventType && (
              <Chip
                label={event.eventType === "online" ? "Online" : "Offline"}
                size="small"
                variant="outlined"
                sx={{ fontWeight: 600 }}
              />
            )}
          </Box>
        </Box>
        <Box
          sx={(theme) => ({
            background: theme.palette.grey[50],
            borderRadius: "14px",
            display: "flex",
            padding: "8px",
            cursor: "pointer",
            marginLeft: "16px",
          })}
        >
          <SvgIcon fontSize="small" component={CrossIcon} onClick={onClose} />
        </Box>
      </Box>

      <Divider sx={{ marginY: "20px" }} />

      {/* Date and Time */}
      <Box sx={{ marginBottom: "20px" }}>
        <Typography
          color="secondary"
          sx={{ fontWeight: "bold", fontSize: "14px", marginBottom: "8px" }}
        >
          Date & Time
        </Typography>
        <Typography sx={{ fontSize: "16px", marginBottom: "4px" }}>
          {formatDate(event.start)}
        </Typography>
        <Box sx={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
          <Typography sx={{ fontSize: "14px", color: "text.secondary" }}>
            <strong>Start:</strong> {formatTime(event.start)}
          </Typography>
          {event.end && (
            <Typography sx={{ fontSize: "14px", color: "text.secondary" }}>
              <strong>End:</strong> {formatTime(event.end)}
            </Typography>
          )}
          {event.duration && (
            <Typography sx={{ fontSize: "14px", color: "text.secondary" }}>
              <strong>Duration:</strong> {event.duration} minutes
            </Typography>
          )}
          {event.start && event.end && !event.duration && (
            <Typography sx={{ fontSize: "14px", color: "text.secondary" }}>
              <strong>Duration:</strong> {formatDuration(event.start, event.end)}
            </Typography>
          )}
        </Box>
      </Box>

      {/* Description */}
      {event.description && (
        <Box sx={{ marginBottom: "20px" }}>
          <Typography
            color="secondary"
            sx={{ fontWeight: "bold", fontSize: "14px", marginBottom: "8px" }}
          >
            Description
          </Typography>
          <Typography sx={{ fontSize: "14px", whiteSpace: "pre-wrap" }}>
            {event.description}
          </Typography>
        </Box>
      )}

      {/* Google Meet Link - Show for any event if available */}
      {event.googleMeetLink && (
        <Box sx={{ marginBottom: "20px" }}>
          <Typography
            color="secondary"
            sx={{ fontWeight: "bold", fontSize: "14px", marginBottom: "8px" }}
          >
            Google Meet Link
          </Typography>
          <Box
            component="a"
            href={event.googleMeetLink}
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              display: "inline-flex",
              alignItems: "center",
              color: "primary.main",
              textDecoration: "none",
              fontSize: "14px",
              wordBreak: "break-all",
              padding: "8px 12px",
              borderRadius: "8px",
              backgroundColor: (theme) => theme.palette.mode === "dark" 
                ? "rgba(25, 118, 210, 0.2)" 
                : "rgba(25, 118, 210, 0.08)",
              "&:hover": {
                textDecoration: "underline",
                backgroundColor: (theme) => theme.palette.mode === "dark"
                  ? "rgba(25, 118, 210, 0.3)"
                  : "rgba(25, 118, 210, 0.12)",
              },
            }}
          >
            {event.googleMeetLink}
          </Box>
        </Box>
      )}

      {/* Online Event Details */}
      {event.eventType === "online" && (
        <>
          {getInvitedMemberNames().length > 0 && (
            <Box sx={{ marginBottom: "20px" }}>
              <Typography
                color="secondary"
                sx={{ fontWeight: "bold", fontSize: "14px", marginBottom: "8px" }}
              >
                Invited Members
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {getInvitedMemberNames().map((name, index) => (
                  <Chip
                    key={index}
                    label={name}
                    size="small"
                    variant="outlined"
                  />
                ))}
              </Box>
            </Box>
          )}
        </>
      )}

      {/* Repeating Event Info */}
      {event.isRepeating && (
        <Box sx={{ marginBottom: "20px" }}>
          <Typography
            color="secondary"
            sx={{ fontWeight: "bold", fontSize: "14px", marginBottom: "8px" }}
          >
            Recurrence
          </Typography>
          <Typography sx={{ fontSize: "14px" }}>
            Repeats {event.repeatFrequency}
            {event.repeatDays && event.repeatDays.length > 0 && (
              <> on {event.repeatDays.join(", ")}</>
            )}
          </Typography>
        </Box>
      )}

      {/* Google Calendar Sync */}
      {event.addToGoogleCalendar && (
        <Box sx={{ marginBottom: "20px" }}>
          <Chip
            label="Synced with Google Calendar"
            size="small"
            color="success"
            sx={{ fontWeight: 600 }}
          />
        </Box>
      )}

      <Divider sx={{ marginY: "20px" }} />

      {/* Actions */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          gap: "12px",
        }}
      >
        <Button variant="outlined" onClick={onClose}>
          Close
        </Button>
        <Button variant="contained" onClick={onEdit}>
          Edit Event
        </Button>
      </Box>
    </Box>
  );
};

export default EventDetailsModal;

