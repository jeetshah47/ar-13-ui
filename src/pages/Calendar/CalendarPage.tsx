import { Box, Button, Grid, SvgIcon, Typography, CircularProgress, useMediaQuery, useTheme } from "@mui/material";
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const dispatch = useAppDispatch();
  const { events } = useAppSelector((state) => state.calendarReducer.api.data);
  const { loading } = useAppSelector((state) => state.calendarReducer.api);
  
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
      size={isMobile ? "small" : "medium"}
      sx={{
        fontSize: { xs: "12px", sm: "14px" },
        padding: { xs: "6px 12px", sm: "8px 16px" }
      }}
    >
      {isMobile ? "Add" : "Add Events"}
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
    // Open blank form for the selected date + 1 day
    if (date) {
      const nextDay = new Date(date);
      nextDay.setDate(nextDay.getDate() + 1);
      setSelectedCellDate(nextDay);
    } else {
      setSelectedCellDate(date);
    }
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

  // Get all events for the current month, grouped by date (for mobile view)
  const getEventsByDate = (): { date: Date; events: CalendarResponse[] }[] => {
    const year = dateState.getFullYear();
    const month = dateState.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const eventsByDate: { date: Date; events: CalendarResponse[] }[] = [];
    
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateEvents = getEventsForDate(date);
      if (dateEvents.length > 0) {
        eventsByDate.push({ date, events: dateEvents });
      }
    }
    
    return eventsByDate;
  };

  const formatDateForDisplay = (date: Date): string => {
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  };

  return (
    <Box sx={{ height: "100%" }}>
      <PageHeader title="Calendar" endElement={AddButton} />
      
      <Box
        sx={{
          paddingTop: { xs: "16px", sm: "28px" },
          display: "flex",
          gap: { xs: "16px", sm: "28px" },
          height: "100%",
          paddingX: { xs: "0px", sm: "0px" },
        }}
      >
        <Box
          sx={(theme) => ({
            width: "100%",
            background: theme.palette.background.paper,
            borderRadius: { xs: "16px", sm: "24px" },
            boxShadow: theme.shadows[1],
            height: "100%",
            position: "relative",
            padding: { xs: "0px", sm: "0px" },
            overflow: { xs: "visible", sm: "hidden" },
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
                borderRadius: { xs: "16px", sm: "24px" },
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
              gap: { xs: "12px", sm: "24px" },
              paddingY: { xs: "16px", sm: "20px" },
              paddingX: { xs: "20px", sm: "0px" },
            }}
          >
            <SvgIcon 
              onClick={handleOnClikPrev} 
              component={LeftIcon}
              sx={{ 
                fontSize: { xs: "24px", sm: "24px" },
                cursor: "pointer",
                width: { xs: "24px", sm: "24px" },
                height: { xs: "24px", sm: "24px" },
              }}
            />
            <Typography 
              variant="h6" 
              fontWeight={700}
              sx={{ 
                fontSize: { xs: "18px", sm: "20px" },
                lineHeight: { xs: "1.44", sm: "1.5" },
                textAlign: "center",
                minWidth: { xs: "144px", sm: "auto" },
              }}
            >
              {currentMonthandYear()}
            </Typography>
            <SvgIcon 
              onClick={handleOnClikNext} 
              component={RightIcon}
              sx={{ 
                fontSize: { xs: "24px", sm: "24px" },
                cursor: "pointer",
                width: { xs: "24px", sm: "24px" },
                height: { xs: "24px", sm: "24px" },
              }}
            />
          </Box>
          
          <Box
            sx={{
              paddingX: { xs: "20px", sm: "0px" },
              paddingBottom: { xs: "20px", sm: "0px" },
            }}
          >
            <Grid 
              container 
              columns={7}
              sx={{
                gap: { xs: "0px", sm: "0px" },
                width: "100%",
                "& > .MuiGrid-item": {
                  padding: { xs: "1px", sm: "0px" },
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                },
              }}
            >
              {getDaysInMonth(dateState).map((date, index) => (
                <Grid 
                  size={{ xs: 1, sm: 1 }} 
                  key={index}
                >
                  <Cell
                    date={date}
                    onClickCell={handleOnCellClick}
                    weekDay={index < 7 ? getWeekDayString(date) : ""}
                    events={getEventsForDate(date)}
                    onClickEvent={handleOnEventClick}
                    currentMonth={dateState}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* Mobile Events List - Show all events of the month below calendar */}
          {isMobile && (
            <Box
              sx={{
                paddingX: "20px",
                paddingTop: "20px",
                paddingBottom: "20px",
                display: "flex",
                flexDirection: "column",
                gap: "20px",
              }}
            >
              {getEventsByDate().map(({ date, events: dateEvents }) => (
                <Box key={date.toISOString()}>
                  <Typography
                    sx={{
                      fontSize: "16px",
                      fontWeight: 700,
                      lineHeight: "1.5",
                      color: theme.palette.text.primary,
                      marginBottom: "10px",
                    }}
                  >
                    {formatDateForDisplay(date)}
                  </Typography>
                  <Box
                    sx={{
                      width: "100%",
                      height: "1px",
                      backgroundColor: theme.palette.divider,
                      marginBottom: "10px",
                    }}
                  />
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "10px",
                    }}
                  >
                    {dateEvents.map((event) => (
                      <Box
                        key={event.id}
                        onClick={() => handleOnEventClick(event)}
                        sx={(theme) => ({
                          width: "100%",
                          height: "56px",
                          backgroundColor: "#F4F9FD",
                          border: "2px solid #FFFFFF",
                          borderRadius: "14px",
                          display: "flex",
                          alignItems: "center",
                          padding: "0px",
                          cursor: "pointer",
                          position: "relative",
                          overflow: "hidden",
                          "&:hover": {
                            backgroundColor: theme.palette.grey[50],
                          },
                        })}
                      >
                        {/* Event indicator bar */}
                        <Box
                          sx={{
                            width: "4px",
                            height: "40px",
                            backgroundColor: (() => {
                              if (!event.category) return "#DE92EB";
                              switch (event.category.toLowerCase()) {
                                case "work":
                                  return "#3F8CFF";
                                case "personal":
                                  return "#DE92EB";
                                case "meeting":
                                  return "#3F8CFF";
                                case "appointment":
                                  return "#6D5DD3";
                                default:
                                  return "#DE92EB";
                              }
                            })(),
                            borderRadius: "2px",
                            marginLeft: "4px",
                            marginRight: "18px",
                          }}
                        />
                        {/* Event content */}
                        <Box
                          sx={{
                            flex: 1,
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            paddingRight: "22px",
                          }}
                        >
                          <Typography
                            sx={{
                              fontSize: "14px",
                              fontWeight: 700,
                              lineHeight: "1.5",
                              color: theme.palette.text.primary,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {event.title || "Untitled Event"}
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: "12px",
                              fontWeight: 700,
                              lineHeight: "1.33",
                              color: theme.palette.text.secondary,
                              marginTop: "2px",
                            }}
                          >
                            {event.duration ? `${event.duration}h` : "0h"}
                          </Typography>
                        </Box>
                        {/* Priority icon placeholder */}
                        <Box
                          sx={{
                            width: "24px",
                            height: "24px",
                            marginRight: "22px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          {/* Priority icon would go here if available */}
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </Box>
              ))}
            </Box>
          )}
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
            key={selectedEventId || (selectedCellDate ? selectedCellDate.toISOString() : 'new')}
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

