import { Box, SvgIcon, Typography } from "@mui/material";
import defaultTheme from "./../../../theme";
import YellowArrow from "../../../assets/icons/general/calendar-23.svg?react";
import ClockIcon from "../../../assets/icons/general/calendar-21.svg?react";
import type { CalendarResponse } from "../../../store/types/Calendar/CalendarResponse";

interface EventCardProps {
  event: CalendarResponse;
}

const EventCard = ({ event }: EventCardProps) => {
  // Format date and time
  const formatEventDateTime = (startDate: string, time?: string) => {
    const date = new Date(startDate);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const isToday = date.toDateString() === today.toDateString();
    const isTomorrow = date.toDateString() === tomorrow.toDateString();
    
    if (isToday) {
      return `Today | ${time || 'All day'}`;
    } else if (isTomorrow) {
      return `Tomorrow | ${time || 'All day'}`;
    } else {
      return `${date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      })} | ${time || 'All day'}`;
    }
  };

  // Calculate duration (mock calculation for now)
  const calculateDuration = () => {
    if (event.end && event.start) {
      const start = new Date(event.start);
      const end = new Date(event.end);
      const diffHours = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60));
      return `${diffHours}h`;
    }
    return '4h'; // Default duration
  };

  // Get priority color
  const getPriorityColor = (priority?: string) => {
    switch (priority?.toLowerCase()) {
      case 'high': return '#FF4444';
      case 'medium': return '#FFBD21';
      case 'low': return '#4CAF50';
      default: return '#FFBD21';
    }
  };
  return (
    <Box sx={{ display: "flex", gap: "16px", paddingTop: "24px" }}>
      <Box
        sx={{
          backgroundColor: defaultTheme.palette.primary.main,
          width: "4px",
          borderRadius: "2px",
        }}
      />
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          flexDirection: "column",
          flex: 1,
          gap: 2,
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography sx={{ fontSize: "14px", fontWeight: "500" }}>
            {event.title || 'Untitled Event'}
          </Typography>
          <SvgIcon 
            component={YellowArrow} 
            sx={{ color: getPriorityColor(event.priority) }}
          />
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography color="secondary" sx={{ fontSize: "12px" }}>
            {formatEventDateTime(event.start, event.time)}
          </Typography>
          <Box
            sx={{
              backgroundColor: (theme) => theme.palette.grey[50],
              padding: "8px 10px",
              display: "flex",
              justifyContent: "center",
              alignContent: "center",
              gap: "6px",
              borderRadius: "8px",
            }}
          >
            <SvgIcon component={ClockIcon} />
            <Typography color="secondary" sx={{ fontSize: "12px" }}>
              {calculateDuration()}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default EventCard;
