import { Box, Button, Grid, SvgIcon, Typography, CircularProgress, Alert } from "@mui/material";
import PageHeader from "../../common/components/PageHeader/PageHeader";
import PlusIcon from "../../assets/icons/general/plus.svg?react";
import Cell from "./components/Cell";
import { useState, useEffect } from "react";
import LeftIcon from "../../assets/icons/general/left.svg?react";
import RightIcon from "../../assets/icons/general/calendar-14.svg?react";
import Modal from "../../common/components/Modal/Modal";
import EventForm from "./components/EventForm";
import EventDetailsModal from "./components/EventDetailsModal";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { fetchCalendarEvents } from "../../store/features/calendar/calendarAction";
import { getUsersAction } from "../../store/features/user/userAction";
import type { CalendarResponse } from "../../store/types/Calendar/CalendarResponse";

const CalendarPage = () => {
  const dispatch = useAppDispatch();
  const { events } = useAppSelector((state) => state.calendarReducer.api.data);
  const { loading, error } = useAppSelector((state) => state.calendarReducer.api);
  
  const [dateState, setDateState] = useState(new Date());
  const [showDateModal, setShowDateModal] = useState(false);
  const [showEventDetailsModal, setShowEventDetailsModal] = useState(false);
  const [selectedCellDate, setSelectedCellDate] = useState<Date | null>(null);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<CalendarResponse | null>(null);

  // Fetch calendar events when month changes
  useEffect(() => {
    const year = dateState.getFullYear();
    const month = dateState.getMonth() + 1; // getMonth() returns 0-11, so add 1
    dispatch(fetchCalendarEvents(year, month));
  }, [dispatch, dateState]);

  // Fetch users on mount
  useEffect(() => {
    dispatch(getUsersAction());
  }, [dispatch]);

  const handleAddEvent = () => {
    setSelectedCellDate(new Date());
    setSelectedEventId(null);
    setSelectedEvent(null);
    setShowEventDetailsModal(false);
    setShowDateModal(true);
  };

  const AddButton = (
    <Button 
      variant="contained" 
      startIcon={<SvgIcon component={PlusIcon} />}
      onClick={handleAddEvent}
    >
      Add Events
    </Button>
  );

  // Helper to format a Date as YYYY-MM-DD without calling toISOString on invalid dates
  const toYMD = (d: Date): string => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  // Helper function to get events for a specific date
  const getEventsForDate = (date: Date | null): CalendarResponse[] => {
    if (!date) return [];

    const dateString = toYMD(date);
    const currentMonth = dateState.getMonth();
    const currentYear = dateState.getFullYear();
    const dateMonth = date.getMonth();
    const dateYear = date.getFullYear();
    
    // Only show events for dates in the current month being viewed (not on grayed out previous/next month days)
    const isInCurrentMonth = dateMonth === currentMonth && dateYear === currentYear;

    return events.filter((event) => {
      if (!event.start) return false;
      const parsed = new Date(event.start);
      if (isNaN(parsed.getTime())) return false;
      
      const eventDateString = toYMD(parsed);
      
      // Check if it's a daily repeating event
      if (event.isRepeating && event.repeatFrequency === 'daily') {
        // For daily repeating events, show on all dates from start date onwards
        // but only within the current month being viewed
        if (!isInCurrentMonth) return false;
        
        // Check if the current date is on or after the event start date
        // This allows events that started in previous months to show in current month
        const eventDate = new Date(parsed);
        eventDate.setHours(0, 0, 0, 0);
        const currentDate = new Date(date);
        currentDate.setHours(0, 0, 0, 0);
        
        return currentDate >= eventDate;
      }
      
      // For non-repeating events, use exact date match
      return eventDateString === dateString;
    });
  };

  // Helper function to check if a date has events
  const hasEventsForDate = (date: Date | null): boolean => {
    return getEventsForDate(date).length > 0;
  };

  const getDaysInMonth = (date: Date): (Date | null)[] => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const lastMonth = month - 1;
    const lastMonthTotalDays = new Date(year, lastMonth + 1, 0).getDate();
    const diffFromDays = lastMonthTotalDays - startingDayOfWeek + 1;

    const nextMonth = month + 1;
    const lastDayMonth = lastDay.getDay();
    const additiondays = 6 - lastDayMonth;
    // Calculate additional days for next month

    const days: (Date | null)[] = [];

    for (let i = diffFromDays; i <= lastMonthTotalDays; i++) {
      days.push(new Date(year, lastMonth, i));
    }

    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    for (let i = 1; i <= additiondays; i++) {
      days.push(new Date(year, nextMonth, i));
    }

    return days;
  };

  const handleOnClikPrev = () => {
    dateState.setMonth(dateState.getMonth() - 1);
    const changedate = new Date(dateState);
    setDateState(changedate);
  };

  const handleOnClikNext = () => {
    dateState.setMonth(dateState.getMonth() + 1);
    const changedate = new Date(dateState);
    setDateState(changedate);
  };

  const currentMonthandYear = () =>
    `${dateState.toDateString().split(" ")[1]} ${
      dateState.toDateString().split(" ")[3]
    }`;

  const getWeekDayString = (date: Date | null) =>
    date?.toDateString().split(" ")[0] ?? "";

  const handleOnCellClick = (date: Date | null) => {
    // Open blank form for the selected date
    setSelectedCellDate(date);
    setSelectedEventId(null);
    setSelectedEvent(null);
    setShowEventDetailsModal(false);
    setShowDateModal(true);
  };

  const handleOnEventClick = (event: CalendarResponse) => {
    // Show event details modal first
    setSelectedEvent(event);
    setSelectedCellDate(new Date(event.start));
    setSelectedEventId(event.id);
    setShowEventDetailsModal(true);
  };

  const handleOnCrossClick = () => {
    setSelectedCellDate(null);
    setSelectedEventId(null);
    setSelectedEvent(null);
    setShowDateModal(false);
    setShowEventDetailsModal(false);
  };

  const handleEditEvent = () => {
    // Switch from details modal to form modal
    setShowEventDetailsModal(false);
    setShowDateModal(true);
  };

  return (
    <Box sx={{ height: "100%" }}>
      <PageHeader title="Calendar" endElement={AddButton} />
      
      {/* Error Display */}
      {error && (
        <Alert severity="error" sx={{ margin: "16px", borderRadius: "12px" }}>
          {error}
        </Alert>
      )}
      
      <Box
        sx={{
          paddingTop: "28px",
          display: "flex",
          gap: "28px",
          height: "100%",
        }}
      >
        <Box
          sx={(theme) => ({
            width: "100%",
            background: theme.palette.background.paper,
            borderRadius: "24px",
            boxShadow: theme.shadows[1],
            height: "100%",
            position: "relative",
          })}
        >
          {/* Loading Overlay */}
          {loading && (
            <Box
              sx={(theme) => ({
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: theme.palette.mode === "dark" 
                  ? "rgba(26, 35, 50, 0.8)" 
                  : "rgba(255, 255, 255, 0.8)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1000,
                borderRadius: "24px",
              })}
            >
              <CircularProgress />
            </Box>
          )}
          
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "24px",
              paddingY: "20px",
            }}
          >
            <SvgIcon onClick={handleOnClikPrev} component={LeftIcon} />
            <Typography variant="h6" fontWeight={700}>
              {currentMonthandYear()}
            </Typography>
            <SvgIcon onClick={handleOnClikNext} component={RightIcon} />
          </Box>
          
          <Grid container columns={7}>
            {getDaysInMonth(dateState).map((date, index) => (
              <Grid size={1} key={index}>
                <Cell
                  date={date}
                  onClickCell={handleOnCellClick}
                  weekDay={index < 7 ? getWeekDayString(date) : ""}
                  events={getEventsForDate(date)}
                  hasEvents={hasEventsForDate(date)}
                  onClickEvent={handleOnEventClick}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
        
        {/* Event Details Modal */}
        {selectedEvent && (
          <Modal show={showEventDetailsModal} onClose={handleOnCrossClick}>
            <EventDetailsModal
              event={selectedEvent}
              onClose={handleOnCrossClick}
              onEdit={handleEditEvent}
            />
          </Modal>
        )}

        {/* Event Form Modal */}
        <Modal show={showDateModal} onClose={handleOnCrossClick}>
          <EventForm 
            onClose={handleOnCrossClick} 
            date={selectedCellDate} 
            currentMonth={dateState}
            existingEvent={
              selectedEventId 
                ? events.find((e) => e.id === selectedEventId) ?? undefined 
                : undefined
            }
          />
        </Modal>
      </Box>
    </Box>
  );
};

export default CalendarPage;
