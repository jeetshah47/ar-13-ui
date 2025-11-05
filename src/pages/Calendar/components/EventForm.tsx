import { Box, Button, SvgIcon, TextField, Typography, MenuItem } from "@mui/material";
import CrossIcon from "../../../assets/icons/general/calendar-6.svg?react";
import { IOSSwitch } from "../../../common/components/Switch/IOSswitch";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../store/store";
import { createCalendarEvent, editCalendarEvent, fetchCalendarEvents, removeCalendarEvent } from "../../../store/features/calendar/calendarAction";
import type { CalendarRequest } from "../../../store/types/Calendar/CalendarRequest";
import toast from "react-hot-toast";
import type { CalendarResponse } from "../../../store/types/Calendar/CalendarResponse";

type EventFormProps = {
  date: Date | null;
  onClose: () => void;
  currentMonth?: Date;
  existingEvent?: CalendarResponse;
};

const EventForm = ({ date, onClose, currentMonth, existingEvent }: EventFormProps) => {
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.calendarReducer.api);
  const uid = useAppSelector((state) => state.authReducer.api.uid);

  const initialDateString = date ? date.toISOString().split('T')[0] : "";

  const [formData, setFormData] = useState<CalendarRequest>({
    title: "",
    category: "",
    priority: "",
    start: initialDateString,
    end: initialDateString,
    time: "",
    description: "",
    isRepeating: false,
    repeatFrequency: "daily",
    repeatDays: [],
    createdBy: uid || "",
    addToGoogleCalendar: false,
  });

  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [selectedFrequency, setSelectedFrequency] = useState<string>("daily");

  // Update createdBy when uid becomes available
  useEffect(() => {
    if (uid && !existingEvent) {
      setFormData(prev => ({
        ...prev,
        createdBy: uid,
      }));
    }
  }, [uid, existingEvent]);

  // Prefill when existingEvent is provided
  useEffect(() => {
    if (!existingEvent) return;

    const eventDate = new Date(existingEvent.start);
    const startDateStr = isNaN(eventDate.getTime())
      ? initialDateString
      : eventDate.toISOString().split('T')[0];

    const derivedTime = existingEvent.time
      ? existingEvent.time.substring(0, 5)
      : (() => {
          const iso = existingEvent.start;
          const d = new Date(iso);
          if (isNaN(d.getTime())) return "";
          const hh = String(d.getHours()).padStart(2, '0');
          const mm = String(d.getMinutes()).padStart(2, '0');
          return `${hh}:${mm}`;
        })();

    const next: CalendarRequest = {
      title: existingEvent.title ?? "",
      category: existingEvent.category ?? "",
      priority: existingEvent.priority ?? "",
      start: startDateStr,
      end: startDateStr,
      time: derivedTime,
      description: existingEvent.description ?? "",
      isRepeating: existingEvent.isRepeating ?? false,
      repeatFrequency: existingEvent.repeatFrequency ?? "daily",
      repeatDays: existingEvent.repeatDays ?? [],
      createdBy: existingEvent.createdBy ?? (uid || ""),
      addToGoogleCalendar: existingEvent.addToGoogleCalendar ?? false,
    };

    setFormData(next);
    setSelectedDays(next.repeatDays);
    setSelectedFrequency(next.repeatFrequency);
  }, [existingEvent, initialDateString, uid]);

  const handleInputChange = (field: keyof CalendarRequest, value: string | boolean | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDayToggle = (day: string) => {
    const newSelectedDays = selectedDays.includes(day)
      ? selectedDays.filter(d => d !== day)
      : [...selectedDays, day];
    
    setSelectedDays(newSelectedDays);
    handleInputChange("repeatDays", newSelectedDays);
  };

  const handleFrequencyChange = (frequency: string) => {
    setSelectedFrequency(frequency);
    handleInputChange("repeatFrequency", frequency);
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.category || !formData.priority || !formData.start || !formData.time) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!uid) {
      toast.error("User not authenticated. Please log in again.");
      return;
    }

    try {
      // Combine date and time for start and end
      const startDateTime = new Date(`${formData.start}T${formData.time}:00Z`);
      const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000); // Add 1 hour

      const eventData: CalendarRequest = {
        ...formData,
        createdBy: uid, // Ensure we use the current user ID
        start: startDateTime.toISOString(),
        end: endDateTime.toISOString(),
      };

      if (existingEvent?.id) {
        await dispatch(editCalendarEvent(existingEvent.id, eventData));
        toast.success("Event updated successfully!");
      } else {
        await dispatch(createCalendarEvent(eventData));
        toast.success("Event created successfully!");
      }
      // Refresh the events list for the current month
      if (currentMonth) {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth() + 1; // getMonth() returns 0-11, so add 1
        dispatch(fetchCalendarEvents(year, month));
      }
      onClose();
    } catch {
      toast.error("Failed to create event");
    }
  };

  const handleDeleteEvent = async () => {
    if (!existingEvent?.id) {
      return;
    }

    const confirmed = window.confirm("Are you sure you want to remove this event? This action cannot be undone.");
    if (!confirmed) {
      return;
    }

    try {
      await dispatch(removeCalendarEvent(existingEvent.id));
      toast.success("Event removed successfully!");
      
      // Refresh the events list for the current month
      if (currentMonth) {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth() + 1; // getMonth() returns 0-11, so add 1
        dispatch(fetchCalendarEvents(year, month));
      }
      onClose();
    } catch {
      toast.error("Failed to remove event");
    }
  };

  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const frequencies = ["daily", "weekly", "monthly"];
  const priorities = ["Low", "Medium", "High"];
  const categories = ["Work", "Personal", "Meeting", "Appointment", "Other"];

  return (
    <Box
      sx={{
        backgroundColor: "#fff",
        borderRadius: "24px",
        padding: "28px",
        width: "500px",
        height: "inherit",
        overflow: "auto"
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingY: "30px",
        }}
      >
        <Typography fontWeight={"bold"} variant="h6">
          {existingEvent ? "Edit Event" : "Add Event"}
        </Typography>
        <Box
          sx={{
            background: "#F4F9FD",
            borderRadius: "14px",
            display: "flex",
            padding: "8px",
            cursor: "pointer",
          }}
          // onClick={(handleCrossClick)}
        >
          <SvgIcon fontSize="small" component={CrossIcon} onClick={onClose} />
        </Box>
      </Box>
      <Box>
        <Box sx={{ width: "100%", paddingTop: "10px" }}>
          <Typography
            color="secondary"
            sx={{ fontWeight: "bold", fontSize: "14px" }}
          >
            Event Name
          </Typography>
          <TextField
            sx={{ width: "100%", paddingTop: "7px" }}
            placeholder="Enter Event Name"
            value={formData.title}
            onChange={(e) => handleInputChange("title", e.target.value)}
          />
        </Box>
      </Box>
      <Box>
        <Box sx={{ width: "100%", paddingTop: "10px" }}>
          <Typography
            color="secondary"
            sx={{ fontWeight: "bold", fontSize: "14px" }}
          >
            Event Category
          </Typography>
          <TextField
            sx={{ width: "100%", paddingTop: "7px" }}
            select
            value={formData.category}
            onChange={(e) => handleInputChange("category", e.target.value)}
          >
            {categories.map((category) => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </TextField>
        </Box>
      </Box>
      <Box>
        <Box sx={{ width: "100%", paddingTop: "10px" }}>
          <Typography
            color="secondary"
            sx={{ fontWeight: "bold", fontSize: "14px" }}
          >
            Priority
          </Typography>
          <TextField
            sx={{ width: "100%", paddingTop: "7px" }}
            select
            value={formData.priority}
            onChange={(e) => handleInputChange("priority", e.target.value)}
          >
            {priorities.map((priority) => (
              <MenuItem key={priority} value={priority}>
                {priority}
              </MenuItem>
            ))}
          </TextField>
        </Box>
      </Box>
      <Box sx={{ display: "flex", gap: "16px", alignItems: "center" }}>
        <Box>
          <Box sx={{ width: "100%", paddingTop: "10px" }}>
            <Typography
              color="secondary"
              sx={{ fontWeight: "bold", fontSize: "14px" }}
            >
              {date ? "Date" : "Start Date"}
            </Typography>
            <TextField
              sx={{ width: "100%", paddingTop: "7px" }}
              placeholder="Select Date"
              type="date"
              value={formData.start}
              onChange={(e) => {
                handleInputChange("start", e.target.value);
                handleInputChange("end", e.target.value);
              }}
            />
          </Box>
        </Box>
        <Box>
          <Box sx={{ width: "100%", paddingTop: "10px" }}>
            <Typography
              color="secondary"
              sx={{ fontWeight: "bold", fontSize: "14px" }}
            >
              Time
            </Typography>
            <TextField
              sx={{ width: "100%", paddingTop: "7px" }}
              placeholder="Select Time"
              type="time"
              value={formData.time}
              onChange={(e) => handleInputChange("time", e.target.value)}
            />
          </Box>
        </Box>
      </Box>
      <Box sx={{ width: "100%", paddingTop: "10px" }}>
        <Typography
          color="secondary"
          sx={{ fontWeight: "bold", fontSize: "14px" }}
        >
          Description
        </Typography>
        <TextField
          sx={{ width: "100%", paddingTop: "7px" }}
          placeholder="Enter Description"
          multiline
          rows={3}
          value={formData.description}
          onChange={(e) => handleInputChange("description", e.target.value)}
        />
      </Box>
      <Box
        sx={{
          backgroundColor: "#F4F9FD",
          borderRadius: "14px",
          padding: "16px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: "20px",
        }}
      >
        <Typography fontWeight={"700"}>Add to Google Calendar</Typography>
        <IOSSwitch 
          sx={{ m: 1 }} 
          checked={formData.addToGoogleCalendar ?? false}
          onChange={(e) => handleInputChange("addToGoogleCalendar", e.target.checked)}
        />
      </Box>
      <Box
        sx={{
          backgroundColor: "#F4F9FD",
          borderRadius: "14px",
          padding: "16px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: "20px",
        }}
      >
        <Typography fontWeight={"700"}>Repeat Event</Typography>
        <IOSSwitch 
          sx={{ m: 1 }} 
          checked={formData.isRepeating}
          onChange={(e) => handleInputChange("isRepeating", e.target.checked)}
        />
      </Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          paddingTop: "12px",
          gap: "16px",
        }}
      >
        {frequencies.map((frequency) => (
          <Box
            key={frequency}
            sx={{
              paddingY: "12px",
              flex: 1,
              border: "1px solid #D8E0F0",
              borderRadius: "10px",
              backgroundColor: selectedFrequency === frequency ? "primary.main" : "transparent",
              textAlign: "center",
              color: selectedFrequency === frequency ? "#fff" : "secondary.main",
              fontWeight: selectedFrequency === frequency ? "600" : "normal",
              cursor: "pointer",
            }}
            onClick={() => handleFrequencyChange(frequency)}
          >
            {frequency.charAt(0).toUpperCase() + frequency.slice(1)}
          </Box>
        ))}
      </Box>
      <Box>
        <Typography color="secondary.main" fontWeight={700}>
          On these days
        </Typography>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            paddingTop: "12px",
            gap: "12px",
          }}
        >
          {daysOfWeek.map((day) => (
            <Box
              key={day}
              sx={{
                paddingY: "12px",
                flex: 1,
                border: "1px solid #D8E0F0",
                borderRadius: "10px",
                backgroundColor: selectedDays.includes(day) ? "primary.main" : "transparent",
                textAlign: "center",
                color: selectedDays.includes(day) ? "#fff" : "secondary.main",
                fontWeight: selectedDays.includes(day) ? "600" : "normal",
                cursor: "pointer",
              }}
              onClick={() => handleDayToggle(day)}
            >
              {day}
            </Box>
          ))}
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          flex: 1,
          justifyContent: "space-between",
          paddingY: "12px",
          alignItems: "center",
          gap: "12px",
        }}
      >
        {existingEvent && (
          <Button 
            variant="outlined" 
            color="error"
            onClick={handleDeleteEvent}
            disabled={loading}
            sx={{ minWidth: "120px" }}
          >
            Remove Event
          </Button>
        )}
        <Box sx={{ flex: 1 }} />
        <Button 
          variant="contained" 
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Saving..." : existingEvent ? "Update Event" : "Save Event"}
        </Button>
      </Box>
    </Box>
  );
};

export default EventForm;
