import { Box, Button, SvgIcon, TextField, Typography, MenuItem } from "@mui/material";
import CrossIcon from "../../../assets/icons/general/calendar-6.svg?react";
import { IOSSwitch } from "../../../common/components/Switch/IOSswitch";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../store/store";
import { createCalendarEvent, fetchCalendarEvents } from "../../../store/features/calendar/calendarAction";
import type { CalendarRequest } from "../../../store/types/Calendar/CalendarRequest";
import toast from "react-hot-toast";

type EventFormProps = {
  date: Date | null;
  onClose: () => void;
  currentMonth?: Date;
};

const EventForm = ({ date, onClose, currentMonth }: EventFormProps) => {
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.calendarReducer.api);

  const [formData, setFormData] = useState<CalendarRequest>({
    title: "",
    category: "",
    priority: "",
    start: date ? date.toISOString().split('T')[0] : "",
    end: date ? date.toISOString().split('T')[0] : "",
    time: "",
    description: "",
    isRepeating: false,
    repeatFrequency: "daily",
    repeatDays: [],
    createdBy: "user123", // This should come from auth state
  });

  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [selectedFrequency, setSelectedFrequency] = useState<string>("daily");

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

    try {
      // Combine date and time for start and end
      const startDateTime = new Date(`${formData.start}T${formData.time}:00Z`);
      const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000); // Add 1 hour

      const eventData: CalendarRequest = {
        ...formData,
        start: startDateTime.toISOString(),
        end: endDateTime.toISOString(),
      };

      await dispatch(createCalendarEvent(eventData));
      toast.success("Event created successfully!");
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
          Add Event
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
          justifyContent: "end",
          paddingY: "12px",
          alignItems: "center",
        }}
      >
        <Button 
          variant="contained" 
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Event"}
        </Button>
      </Box>
    </Box>
  );
};

export default EventForm;
