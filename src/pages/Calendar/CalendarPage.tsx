import { Box, Button, Grid, SvgIcon, Typography, CircularProgress, useMediaQuery, useTheme, IconButton, type Theme } from "@mui/material";
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
import { RequirePermission } from "../../common/components/RBAC/RequirePermission";
import SearchIcon from "@mui/icons-material/Search";

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


  // Helper to format a Date as YYYY-MM-DD without calling toISOString on invalid dates
  const toYMD = (d: Date): string => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  // Helper function to get events for a specific date
  const getEventsForDate = (date: Date | null): CalendarResponse[] => {
    if (!date) {
      return [];
    }

    const dateString = toYMD(date);
    const currentMonth = dateState.getMonth();
    const currentYear = dateState.getFullYear();
    const dateMonth = date.getMonth();
    const dateYear = date.getFullYear();
    
    // Only show events for dates in the current month being viewed (not on grayed out previous/next month days)
    const isInCurrentMonth = dateMonth === currentMonth && dateYear === currentYear;

    const filteredEvents = events.filter((event) => {
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

    return filteredEvents;
  };


  const getDaysInMonth = (date: Date): (Date | null)[] => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    // Convert Sunday (0) to 7, then adjust to Monday (1) as first day
    let startingDayOfWeek = firstDay.getDay();
    startingDayOfWeek = startingDayOfWeek === 0 ? 7 : startingDayOfWeek; // Sunday becomes 7
    startingDayOfWeek = startingDayOfWeek - 1; // Convert to Monday=0, Sunday=6

    const lastMonth = month - 1;
    const lastMonthTotalDays = new Date(year, lastMonth + 1, 0).getDate();
    const diffFromDays = lastMonthTotalDays - startingDayOfWeek;

    const nextMonth = month + 1;
    let lastDayMonth = lastDay.getDay();
    lastDayMonth = lastDayMonth === 0 ? 7 : lastDayMonth; // Sunday becomes 7
    lastDayMonth = lastDayMonth - 1; // Convert to Monday=0, Sunday=6
    const additiondays = 6 - lastDayMonth;

    const days: (Date | null)[] = [];

    // Add previous month days
    for (let i = diffFromDays; i < lastMonthTotalDays; i++) {
      days.push(new Date(year, lastMonth, i + 1));
    }

    // Add current month days
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    // Add next month days
    for (let i = 1; i <= additiondays; i++) {
      days.push(new Date(year, nextMonth, i));
    }

    return days;
  };

  const handleOnClikPrev = () => {
    setDateState((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setMonth(newDate.getMonth() - 1);
      return newDate;
    });
  };

  const handleOnClikNext = () => {
    setDateState((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setMonth(newDate.getMonth() + 1);
      return newDate;
    });
  };

  const currentMonthandYear = () =>
    `${dateState.toDateString().split(" ")[1]} ${
      dateState.toDateString().split(" ")[3]
    }`;


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

  // Get week number for the first day of the month
  const getWeekNumber = (date: Date): number => {
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    const startDate = new Date(firstDay.getFullYear(), 0, 1);
    const days = Math.floor((firstDay.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000));
    return Math.ceil((days + startDate.getDay() + 1) / 7);
  };

  // Format date range for month
  const getMonthDateRange = (): string => {
    const year = dateState.getFullYear();
    const month = dateState.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${months[firstDay.getMonth()]} ${firstDay.getDate()}, ${year} – ${months[lastDay.getMonth()]} ${lastDay.getDate()}, ${year}`;
  };

  // Get month abbreviation
  const getMonthAbbr = (date: Date): string => {
    const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    return months[date.getMonth()];
  };

  // Handle today button
  const handleToday = () => {
    setDateState(new Date());
  };


  return (
    <Box sx={{ height: "100%" }}>
      <PageHeader title="Calendar" />
      
      <Box
        sx={{
          paddingTop: { xs: "16px", sm: "20px", md: "24px", lg: "28px" },
          display: "flex",
          gap: { xs: "16px", sm: "20px", md: "24px", lg: "28px" },
          height: "100%",
          paddingX: { xs: "0px", sm: "0px", md: "0px", lg: "0px" },
        }}
      >
            <Box
              sx={(theme) => ({
                width: "100%",
                background: theme.palette.background.paper,
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: "12px",
                boxShadow: "none",
                height: "100%",
                position: "relative",
                padding: { xs: "0px", sm: "0px" },
                overflow: { xs: "visible", sm: "hidden" },
                display: "flex",
                flexDirection: "column",
                maxHeight: { xs: "none", sm: "calc(100vh - 200px)" },
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
                borderRadius: "12px",
              })}
            >
              <CircularProgress />
            </Box>
          )}
          
          {/* Calendar Header - Matching Figma Design */}
          <Box
            sx={(theme) => ({
              borderBottom: `1px solid ${theme.palette.divider}`,
              padding: "20px 24px",
              display: "flex",
              gap: "16px",
              alignItems: "center",
              flexWrap: { xs: "wrap", sm: "nowrap" },
            })}
          >
            {/* Date Icon and Text Section */}
            <Box
              sx={{
                display: "flex",
                gap: "12px",
                alignItems: "center",
                flex: { xs: "1 0 100%", sm: "1 0 0" },
              }}
            >
              {/* Date Icon */}
              <Box
                sx={(theme) => ({
                  width: "64px",
                  height: "64px",
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: "8px",
                  display: "flex",
                  flexDirection: "column",
                  overflow: "hidden",
                  flexShrink: 0,
                })}
              >
                {/* Month Section */}
                <Box
                  sx={(theme) => ({
                    backgroundColor: theme.palette.grey[50],
                    padding: "4px 8px 2px 8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  })}
                >
                  <Typography
                    sx={{
                      fontSize: "12px",
                      fontWeight: 600,
                      lineHeight: "18px",
                      color: theme.palette.text.secondary,
                    }}
                  >
                    {getMonthAbbr(dateState)}
                  </Typography>
                </Box>
                {/* Date Section */}
                <Box
                  sx={{
                    padding: "1px 8px 3px 8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flex: 1,
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "18px",
                      fontWeight: 700,
                      lineHeight: "28px",
                      fontFamily: "'Inter', sans-serif",
                      color: theme.palette.primary.main,
                    }}
                  >
                    {dateState.getDate()}
                  </Typography>
                </Box>
              </Box>

              {/* Text Section */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "2px",
                  justifyContent: "center",
                  flex: "1 0 0",
                  minWidth: 0,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    gap: "8px",
                    alignItems: "center",
                    flexWrap: "wrap",
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "18px",
                      fontWeight: 600,
                      lineHeight: "28px",
                      fontFamily: "'Inter', sans-serif",
                      color: theme.palette.text.primary,
                    }}
                  >
                    {currentMonthandYear()}
                  </Typography>
                  <Box
                    sx={{
                      backgroundColor: theme.palette.background.paper,
                      border: `1px solid ${theme.palette.divider}`,
                      borderRadius: "6px",
                      padding: "2px 6px",
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "12px",
                        fontWeight: 500,
                        lineHeight: "18px",
                        color: theme.palette.text.primary,
                        textAlign: "center",
                      }}
                    >
                      Week {getWeekNumber(dateState)}
                    </Typography>
                  </Box>
                </Box>
                <Typography
                  sx={{
                    fontSize: "14px",
                    fontWeight: 400,
                    lineHeight: "20px",
                    color: theme.palette.text.secondary,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {getMonthDateRange()}
                </Typography>
              </Box>
            </Box>

            {/* Actions Section */}
            <Box
              sx={{
                display: "flex",
                gap: "12px",
                alignItems: "center",
                flexShrink: 0,
              }}
            >
              {/* Search Button */}
              <IconButton
                sx={(theme) => ({
                  padding: "10px",
                  borderRadius: "8px",
                  "&:hover": {
                    backgroundColor: theme.palette.grey[50],
                  },
                })}
              >
                <SearchIcon sx={(theme) => ({ fontSize: "20px", color: theme.palette.text.secondary })} />
              </IconButton>

              {/* Navigation Button Group */}
              <Box
                sx={(theme) => ({
                  display: "flex",
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: "8px",
                  overflow: "hidden",
                })}
              >
                <IconButton
                  onClick={handleOnClikPrev}
                  sx={(theme) => ({
                    padding: "8px 12px",
                    minWidth: "40px",
                    height: "40px",
                    borderRight: `1px solid ${theme.palette.divider}`,
                    borderRadius: 0,
                    "&:hover": {
                      backgroundColor: theme.palette.grey[50],
                    },
                  })}
                >
                  <SvgIcon 
                    component={LeftIcon}
                    sx={(theme: Theme) => ({ 
                      fontSize: "20px",
                      color: theme.palette.text.secondary,
                    })}
                  />
                </IconButton>
                <Button
                  onClick={handleToday}
                  sx={(theme: Theme) => ({
                    padding: "8px 16px",
                    minWidth: "auto",
                    height: "40px",
                    borderRight: `1px solid ${theme.palette.divider}`,
                    borderRadius: 0,
                    fontSize: "14px",
                    fontWeight: 600,
                    color: theme.palette.text.primary,
                    textTransform: "none",
                    "&:hover": {
                      backgroundColor: theme.palette.grey[50],
                    },
                  })}
                >
                  Today
                </Button>
                <IconButton
                  onClick={handleOnClikNext}
                  sx={(theme: Theme) => ({
                    padding: "8px 12px",
                    minWidth: "40px",
                    height: "40px",
                    borderRadius: 0,
                    "&:hover": {
                      backgroundColor: theme.palette.grey[50],
                    },
                  })}
                >
                  <SvgIcon 
                    component={RightIcon}
                    sx={(theme: Theme) => ({ 
                      fontSize: "20px",
                      color: theme.palette.text.secondary,
                    })}
                  />
                </IconButton>
              </Box>

              {/* Add Event Button */}
              <RequirePermission permission="calendar:write">
                <Button
                  variant="contained"
                  startIcon={<SvgIcon component={PlusIcon} sx={{ fontSize: "20px", color: theme.palette.primary.contrastText }} />}
                  onClick={handleAddEvent}
                  sx={{
                    backgroundColor: theme.palette.primary.main,
                    border: "2px solid rgba(255, 255, 255, 0.12)",
                    borderRadius: "8px",
                    padding: "10px 14px",
                    fontSize: "14px",
                    fontWeight: 600,
                    fontFamily: "'Inter', sans-serif",
                    color: theme.palette.primary.contrastText,
                    textTransform: "none",
                    "&:hover": {
                      backgroundColor: theme.palette.primary.light,
                    },
                  }}
                >
                  Add event
                </Button>
              </RequirePermission>
            </Box>
          </Box>
          
          {/* Calendar Grid */}
          <Box
            sx={{ 
              flex: "1 0 0",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              minHeight: 0,
            }}
          >
            {/* Day Headers */}
            {!isMobile && (
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(7, 1fr)",
                  borderBottom: `1px solid ${theme.palette.divider}`,
                }}
              >
                {["Mon", "Tues", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                  <Box
                    key={day}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "8px",
                      color: theme.palette.text.secondary,
                      fontSize: "12px",
                      fontWeight: 500,
                      lineHeight: "18px",
                      fontFamily: "'Inter', sans-serif",
                      borderRight: `1px solid ${theme.palette.divider}`,
                      "&:last-child": {
                        borderRight: "none",
                      },
                    }}
                  >
                    {day}
                  </Box>
                ))}
              </Box>
            )}

            {/* Month Grid */}
            <Box
              sx={{
                flex: "1 0 0",
                overflow: "auto",
                minHeight: 0,
                "&::-webkit-scrollbar": {
                  width: "8px",
                },
                "&::-webkit-scrollbar-track": {
                  backgroundColor: "transparent",
                },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: (theme) => theme.palette.mode === "dark" 
                    ? "rgba(255, 255, 255, 0.2)" 
                    : "rgba(0, 0, 0, 0.2)",
                  borderRadius: "4px",
                  "&:hover": {
                    backgroundColor: (theme) => theme.palette.mode === "dark" 
                      ? "rgba(255, 255, 255, 0.3)" 
                      : "rgba(0, 0, 0, 0.3)",
                  },
                },
              }}
            >
              <Grid 
                container 
                columns={7}
                sx={{
                  width: "100%",
                  height: "100%",
                  "& > .MuiGrid-item": {
                    padding: 0,
                    display: "flex",
                    flexDirection: "column",
                    borderRight: (theme: Theme) => `1px solid ${theme.palette.divider}`,
                    borderBottom: (theme: Theme) => `1px solid ${theme.palette.divider}`,
                    "&:nth-of-type(7n)": {
                      borderRight: "none",
                    },
                  },
                }}
              >
                {getDaysInMonth(dateState).map((date, index) => {
                  const dateEvents = getEventsForDate(date);
                  
                  return (
                    <Grid 
                      size={{ xs: 1, sm: 1 }} 
                      key={index}
                      sx={{
                        minHeight: { xs: "46px", sm: "100px", md: "110px", lg: "120px" },
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        overflow: "hidden",
                      }}
                    >
                      <Cell
                        date={date}
                        onClickCell={handleOnCellClick}
                        events={dateEvents}
                        onClickEvent={handleOnEventClick}
                        currentMonth={dateState}
                      />
                    </Grid>
                  );
                })}
              </Grid>
            </Box>
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
                        sx={(theme: Theme) => ({
                          width: "100%",
                          height: "56px",
                          backgroundColor: theme.palette.grey[50],
                          border: `2px solid ${theme.palette.background.paper}`,
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
                              if (!event.category) return theme.palette.info.main;
                              switch (event.category.toLowerCase()) {
                                case "work":
                                  return theme.palette.primary.main;
                                case "personal":
                                  return theme.palette.info.main;
                                case "meeting":
                                  return theme.palette.primary.main;
                                case "appointment":
                                  return theme.palette.primary.dark;
                                default:
                                  return theme.palette.info.main;
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

