import { Box, Button, SvgIcon, TextField, Typography, MenuItem, FormControl, InputLabel, Select, OutlinedInput, Chip, type SelectChangeEvent, Autocomplete } from "@mui/material";
import CrossIcon from "../../../assets/icons/general/calendar-6.svg?react";
import { IOSSwitch } from "../../../common/components/Switch/IOSswitch";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../store/store";
import { createCalendarEvent, editCalendarEvent, fetchCalendarEvents, removeCalendarEvent } from "../../../store/features/calendar/calendarAction";
import { getGoogleAccountStatusAction } from "../../../store/features/googleAccount/googleAccountActions";
import { getUsersAction } from "../../../store/features/user/userAction";
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
  const { linked: googleAccountLinked } = useAppSelector((state) => state.googleAccountReducer);
  const { users } = useAppSelector((state) => state.userReducer);

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
    eventType: "offline",
    invitedMemberIds: [],
    invites: [],
    duration: undefined,
  });

  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [selectedFrequency, setSelectedFrequency] = useState<string>("daily");
  const [externalInviteEmail, setExternalInviteEmail] = useState<string>("");
  const [errors, setErrors] = useState<{
    title?: string;
    category?: string;
    priority?: string;
    start?: string;
    time?: string;
    invitedMemberIds?: string;
    duration?: string;
  }>({});

  // Fetch Google account status and users on mount
  useEffect(() => {
    dispatch(getGoogleAccountStatusAction());
    dispatch(getUsersAction());
  }, [dispatch]);

  // Reset addToGoogleCalendar if account is not linked
  useEffect(() => {
    if (!googleAccountLinked && formData.addToGoogleCalendar) {
      setFormData(prev => ({
        ...prev,
        addToGoogleCalendar: false,
      }));
    }
  }, [googleAccountLinked, formData.addToGoogleCalendar]);

  // Update createdBy when uid becomes available
  useEffect(() => {
    if (uid && !existingEvent) {
      setFormData(prev => ({
        ...prev,
        createdBy: uid,
      }));
    }
  }, [uid, existingEvent]);

  // Reset form and auto-fill date when date prop changes (only for new events)
  useEffect(() => {
    if (existingEvent) return; // Don't reset if editing existing event
    
    const dateString = date ? date.toISOString().split('T')[0] : "";
    
    setFormData({
      title: "",
      category: "",
      priority: "",
      start: dateString,
      end: dateString,
      time: "",
      description: "",
      isRepeating: false,
      repeatFrequency: "daily",
      repeatDays: [],
      createdBy: uid || "",
      addToGoogleCalendar: false,
      eventType: "offline",
      invitedMemberIds: [],
      invites: [],
      duration: undefined,
    });
    setSelectedDays([]);
    setSelectedFrequency("daily");
    setExternalInviteEmail("");
  }, [date, existingEvent, uid]);

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

    const eventEndDate = existingEvent.end ? new Date(existingEvent.end) : null;
    const endDateStr = eventEndDate && !isNaN(eventEndDate.getTime())
      ? eventEndDate.toISOString().split('T')[0]
      : startDateStr;

    // Calculate duration if both start and end are available
    let calculatedDuration: number | undefined = undefined;
    if (existingEvent.start && existingEvent.end) {
      const start = new Date(existingEvent.start);
      const end = new Date(existingEvent.end);
      if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
        calculatedDuration = Math.round((end.getTime() - start.getTime()) / (1000 * 60)); // duration in minutes
      }
    }

    const next: CalendarRequest = {
      title: existingEvent.title ?? "",
      category: existingEvent.category ?? "",
      priority: existingEvent.priority ?? "",
      start: startDateStr,
      end: endDateStr,
      time: derivedTime,
      description: existingEvent.description ?? "",
      isRepeating: existingEvent.isRepeating ?? false,
      repeatFrequency: existingEvent.repeatFrequency ?? "daily",
      repeatDays: existingEvent.repeatDays ?? [],
      createdBy: existingEvent.createdBy ?? (uid || ""),
      addToGoogleCalendar: existingEvent.addToGoogleCalendar ?? false,
      eventType: existingEvent.eventType ?? "offline",
      invitedMemberIds: existingEvent.invitedMemberIds ?? [],
      invites: existingEvent.invites ?? [],
      duration: existingEvent.duration ?? calculatedDuration,
    };

    setFormData(next);
    setSelectedDays(next.repeatDays);
    setSelectedFrequency(next.repeatFrequency);
  }, [existingEvent, initialDateString, uid]);

  const handleInputChange = (field: keyof CalendarRequest, value: string | boolean | string[] | number | undefined) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing/changing
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [field as keyof typeof errors]: undefined }));
    }
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

  const handleEventTypeChange = (eventType: "offline" | "online") => {
    handleInputChange("eventType", eventType);
    // Reset invitedMemberIds and duration when switching to offline
    if (eventType === "offline") {
      handleInputChange("invitedMemberIds", []);
      handleInputChange("duration", undefined);
    }
  };

  const handleInvitedMembersChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value;
    handleInputChange("invitedMemberIds", typeof value === "string" ? value.split(",") : value);
  };

  const handleInvitesChange = (newEmails: string[]) => {
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const validEmails = newEmails.filter(email => emailRegex.test(email));
    
    if (validEmails.length !== newEmails.length) {
      toast.error("Please enter valid email addresses");
    }
    
    handleInputChange("invites", validEmails);
  };

  const handleAddExternalInvite = () => {
    if (!externalInviteEmail.trim()) {
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(externalInviteEmail.trim())) {
      toast.error("Please enter a valid email address");
      return;
    }

    const currentInvites = formData.invites || [];
    const emailToAdd = externalInviteEmail.trim().toLowerCase();
    
    // Check if email already exists
    if (currentInvites.includes(emailToAdd)) {
      toast.error("This email is already in the invite list");
      setExternalInviteEmail("");
      return;
    }

    // Add email to invites
    handleInputChange("invites", [...currentInvites, emailToAdd]);
    setExternalInviteEmail("");
  };

  const handleExternalInviteKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddExternalInvite();
    }
  };

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};
    
    if (!formData.title?.trim()) {
      newErrors.title = "Event name is required";
    }
    
    if (!formData.category) {
      newErrors.category = "Event category is required";
    }
    
    if (!formData.priority) {
      newErrors.priority = "Priority is required";
    }
    
    if (!formData.start) {
      newErrors.start = "Start date is required";
    }
    
    if (!formData.time) {
      newErrors.time = "Time is required";
    }
    
    // Validate online event requirements
    if (formData.eventType === "online") {
      if (!formData.invitedMemberIds || formData.invitedMemberIds.length === 0) {
        newErrors.invitedMemberIds = "Please select at least one member to invite for online events";
      }
      if (!formData.duration && !formData.end) {
        newErrors.duration = "Please provide either duration or end time for online events";
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    if (!uid) {
      toast.error("User not authenticated. Please log in again.");
      return;
    }

    try {
      // Combine date and time for start
      const startDateTime = new Date(`${formData.start}T${formData.time}:00Z`);
      
      // Calculate end time: use duration if provided, otherwise use end date/time, or default to 1 hour
      let endDateTime: Date;
      if (formData.duration) {
        endDateTime = new Date(startDateTime.getTime() + formData.duration * 60 * 1000);
      } else if (formData.end && formData.time) {
        endDateTime = new Date(`${formData.end}T${formData.time}:00Z`);
        // If end is same as start, add 1 hour
        if (endDateTime.getTime() <= startDateTime.getTime()) {
          endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000);
        }
      } else {
        endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000); // Default: 1 hour
      }

      // Build event data, conditionally including fields based on event type
      const eventData: CalendarRequest = {
        title: formData.title,
        category: formData.category,
        priority: formData.priority,
        start: startDateTime.toISOString(),
        time: formData.time,
        description: formData.description,
        isRepeating: formData.isRepeating,
        repeatFrequency: formData.repeatFrequency,
        repeatDays: formData.repeatDays,
        createdBy: uid,
        addToGoogleCalendar: formData.addToGoogleCalendar,
        eventType: formData.eventType,
        // Only include end if duration is not provided (API prefers duration for online events)
        ...(formData.duration ? {} : { end: endDateTime.toISOString() }),
        // Only include duration for online events
        ...(formData.eventType === "online" && formData.duration ? { duration: formData.duration } : {}),
        // Only include invitedMemberIds for online events
        ...(formData.eventType === "online" && formData.invitedMemberIds && formData.invitedMemberIds.length > 0 
          ? { invitedMemberIds: formData.invitedMemberIds } 
          : {}),
        // Include invites if provided
        ...(formData.invites && formData.invites.length > 0 
          ? { invites: formData.invites } 
          : {}),
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
      sx={(theme) => ({
        backgroundColor: theme.palette.background.paper,
        borderRadius: { xs: "16px", sm: "24px" },
        padding: { xs: "20px", sm: "28px" },
        width: { xs: "90vw", sm: "500px" },
        maxWidth: { xs: "400px", sm: "500px" },
        maxHeight: "90vh",
        overflow: "auto"
      })}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingY: { xs: "20px", sm: "30px" },
        }}
      >
        <Typography 
          fontWeight={"bold"} 
          variant="h6"
          sx={{ fontSize: { xs: "18px", sm: "20px" } }}
        >
          {existingEvent ? "Edit Event" : "Add Event"}
        </Typography>
        <Box
          sx={(theme) => ({
            background: theme.palette.grey[50],
            borderRadius: "14px",
            display: "flex",
            padding: "8px",
            cursor: "pointer",
          })}
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
            error={Boolean(errors.title)}
            helperText={errors.title}
            required
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
            error={Boolean(errors.category)}
            helperText={errors.category}
            required
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
            error={Boolean(errors.priority)}
            helperText={errors.priority}
            required
          >
            {priorities.map((priority) => (
              <MenuItem key={priority} value={priority}>
                {priority}
              </MenuItem>
            ))}
          </TextField>
        </Box>
      </Box>
      <Box sx={{ width: "100%", paddingTop: "10px" }}>
        <Typography
          color="secondary"
          sx={{ fontWeight: "bold", fontSize: "14px" }}
        >
          Event Type
        </Typography>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            paddingTop: "12px",
            gap: "16px",
          }}
        >
          {(["offline", "online"] as const).map((type) => (
            <Box
              key={type}
              sx={(theme) => ({
                paddingY: "12px",
                flex: 1,
                border: `1px solid ${theme.palette.grey[300]}`,
                borderRadius: "10px",
                backgroundColor: formData.eventType === type 
                  ? theme.palette.primary.main 
                  : "transparent",
                textAlign: "center",
                color: formData.eventType === type 
                  ? theme.palette.primary.contrastText 
                  : theme.palette.text.secondary,
                fontWeight: formData.eventType === type ? "600" : "normal",
                cursor: "pointer",
              })}
              onClick={() => handleEventTypeChange(type)}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </Box>
          ))}
        </Box>
      </Box>
      <Box sx={{ 
        display: "flex", 
        gap: { xs: "8px", sm: "16px" }, 
        alignItems: "center",
        flexDirection: { xs: "column", sm: "row" }
      }}>
        <Box sx={{ width: { xs: "100%", sm: "auto" }, flex: { xs: 1, sm: "none" } }}>
          <Box sx={{ width: "100%", paddingTop: "10px" }}>
            <Typography
              color="secondary"
              sx={{ fontWeight: "bold", fontSize: { xs: "12px", sm: "14px" } }}
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
                if (!formData.duration) {
                  handleInputChange("end", e.target.value);
                }
              }}
              error={Boolean(errors.start)}
              helperText={errors.start}
              required
            />
          </Box>
        </Box>
        <Box sx={{ width: { xs: "100%", sm: "auto" }, flex: { xs: 1, sm: "none" } }}>
          <Box sx={{ width: "100%", paddingTop: "10px" }}>
            <Typography
              color="secondary"
              sx={{ fontWeight: "bold", fontSize: { xs: "12px", sm: "14px" } }}
            >
              Time
            </Typography>
            <TextField
              sx={{ width: "100%", paddingTop: "7px" }}
              placeholder="Select Time"
              type="time"
              value={formData.time}
              onChange={(e) => handleInputChange("time", e.target.value)}
              error={Boolean(errors.time)}
              helperText={errors.time}
              required
            />
          </Box>
        </Box>
      </Box>
      {formData.eventType === "online" && (
        <>
          <Box sx={{ 
            display: "flex", 
            gap: { xs: "8px", sm: "16px" }, 
            alignItems: "center",
            flexDirection: { xs: "column", sm: "row" }
          }}>
            <Box sx={{ flex: 1, width: { xs: "100%", sm: "auto" } }}>
              <Box sx={{ width: "100%", paddingTop: "10px" }}>
                <Typography
                  color="secondary"
                  sx={{ fontWeight: "bold", fontSize: { xs: "12px", sm: "14px" } }}
                >
                  Duration (minutes)
                </Typography>
                <TextField
                  sx={{ width: "100%", paddingTop: "7px" }}
                  placeholder="e.g., 60"
                  type="number"
                  value={formData.duration || ""}
                  onChange={(e) => {
                    const value = e.target.value === "" ? undefined : parseInt(e.target.value, 10);
                    handleInputChange("duration", value);
                  }}
                  inputProps={{ min: 1 }}
                  error={Boolean(errors.duration)}
                  helperText={errors.duration}
                />
              </Box>
            </Box>
            {!formData.duration && (
              <Box sx={{ flex: 1, width: { xs: "100%", sm: "auto" } }}>
                <Box sx={{ width: "100%", paddingTop: "10px" }}>
                  <Typography
                    color="secondary"
                    sx={{ fontWeight: "bold", fontSize: { xs: "12px", sm: "14px" } }}
                  >
                    End Date
                  </Typography>
                  <TextField
                    sx={{ width: "100%", paddingTop: "7px" }}
                    placeholder="Select End Date"
                    type="date"
                    value={formData.end || ""}
                    onChange={(e) => handleInputChange("end", e.target.value)}
                  />
                </Box>
              </Box>
            )}
          </Box>
          <Box sx={{ width: "100%", paddingTop: "10px" }}>
            <Typography
              color="secondary"
              sx={{ fontWeight: "bold", fontSize: "14px" }}
            >
              Invite Members
            </Typography>
            <FormControl sx={{ width: "100%", paddingTop: "7px" }} error={Boolean(errors.invitedMemberIds)}>
              <InputLabel>Select Members</InputLabel>
              <Select
                multiple
                value={formData.invitedMemberIds || []}
                onChange={handleInvitedMembersChange}
                input={<OutlinedInput label="Select Members" />}
                renderValue={(selected) => (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip
                        key={value}
                        label={
                          users.find((user) => user.id === value)?.name ?? value
                        }
                        size="small"
                      />
                    ))}
                  </Box>
                )}
              >
                {users
                  .filter((user) => user.id !== uid) // Exclude current user
                  .map((user) => (
                    <MenuItem key={user.id} value={user.id}>
                      {user.name}
                    </MenuItem>
                  ))}
              </Select>
              {errors.invitedMemberIds && (
                <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.75 }}>
                  {errors.invitedMemberIds}
                </Typography>
              )}
            </FormControl>
          </Box>
        </>
      )}
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
      <Box sx={{ width: "100%", paddingTop: "10px" }}>
        <Typography
          color="secondary"
          sx={{ fontWeight: "bold", fontSize: "14px" }}
        >
          Invitees
        </Typography>
        <Autocomplete
          multiple
          freeSolo
          options={users
            .filter((user) => user.id !== uid)
            .map((user) => user.email)}
          value={formData.invites || []}
          onChange={(_, newValue) => {
            handleInvitesChange(newValue);
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder="Select or type email addresses"
              sx={{ width: "100%", paddingTop: "7px" }}
            />
          )}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip
                {...getTagProps({ index })}
                key={option}
                label={option}
                size="small"
              />
            ))
          }
        />
      </Box>
      <Box sx={{ width: "100%", paddingTop: "10px" }}>
        <Typography
          color="secondary"
          sx={{ fontWeight: "bold", fontSize: "14px" }}
        >
          External Invite
        </Typography>
        <Box sx={{ display: "flex", gap: "8px", paddingTop: "7px" }}>
          <TextField
            sx={{ flex: 1 }}
            placeholder="Enter email address"
            type="email"
            value={externalInviteEmail}
            onChange={(e) => setExternalInviteEmail(e.target.value)}
            onKeyPress={handleExternalInviteKeyPress}
          />
          <Button
            variant="contained"
            onClick={handleAddExternalInvite}
            disabled={!externalInviteEmail.trim()}
          >
            Add
          </Button>
        </Box>
      </Box>
      <Box
        sx={(theme) => ({
          backgroundColor: theme.palette.grey[50],
          borderRadius: "14px",
          padding: "16px 20px",
          marginTop: "20px",
        })}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography fontWeight={"700"}>Add to Google Calendar</Typography>
          <IOSSwitch 
            sx={{ m: 1 }} 
            checked={formData.addToGoogleCalendar ?? false}
            onChange={(e) => handleInputChange("addToGoogleCalendar", e.target.checked)}
            disabled={!googleAccountLinked}
          />
        </Box>
        {!googleAccountLinked && (
          <Typography
            sx={{
              fontSize: "12px",
              color: "text.secondary",
              marginTop: "8px",
            }}
          >
            Please link your google account
          </Typography>
        )}
      </Box>
      <Box
        sx={(theme) => ({
          backgroundColor: theme.palette.grey[50],
          borderRadius: "14px",
          padding: "16px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: "20px",
        })}
      >
        <Typography fontWeight={"700"}>Repeat Event</Typography>
        <IOSSwitch 
          sx={{ m: 1 }} 
          checked={formData.isRepeating}
          onChange={(e) => handleInputChange("isRepeating", e.target.checked)}
        />
      </Box>
      {formData.isRepeating && (
        <>
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
                sx={(theme) => ({
                  paddingY: "12px",
                  flex: 1,
                  border: `1px solid ${theme.palette.grey[300]}`,
                  borderRadius: "10px",
                  backgroundColor: selectedFrequency === frequency 
                    ? theme.palette.primary.main 
                    : "transparent",
                  textAlign: "center",
                  color: selectedFrequency === frequency 
                    ? theme.palette.primary.contrastText 
                    : theme.palette.text.secondary,
                  fontWeight: selectedFrequency === frequency ? "600" : "normal",
                  cursor: "pointer",
                })}
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
                  sx={(theme) => ({
                    paddingY: "12px",
                    flex: 1,
                    border: `1px solid ${theme.palette.grey[300]}`,
                    borderRadius: "10px",
                    backgroundColor: selectedDays.includes(day) 
                      ? theme.palette.primary.main 
                      : "transparent",
                    textAlign: "center",
                    color: selectedDays.includes(day) 
                      ? theme.palette.primary.contrastText 
                      : theme.palette.text.secondary,
                    fontWeight: selectedDays.includes(day) ? "600" : "normal",
                    cursor: "pointer",
                  })}
                  onClick={() => handleDayToggle(day)}
                >
                  {day}
                </Box>
              ))}
            </Box>
          </Box>
        </>
      )}
      <Box
        sx={{
          display: "flex",
          flex: 1,
          justifyContent: "space-between",
          paddingY: "12px",
          alignItems: "center",
          gap: "12px",
          flexDirection: { xs: "column", sm: "row" }
        }}
      >
        {existingEvent && (
          <Button 
            variant="outlined" 
            color="error"
            onClick={handleDeleteEvent}
            disabled={loading}
            sx={{ 
              minWidth: { xs: "100%", sm: "120px" },
              width: { xs: "100%", sm: "auto" }
            }}
          >
            Remove Event
          </Button>
        )}
        <Box sx={{ flex: { xs: 0, sm: 1 } }} />
        <Button 
          variant="contained" 
          onClick={handleSubmit}
          disabled={loading}
          sx={{ width: { xs: "100%", sm: "auto" } }}
        >
          {loading ? "Saving..." : existingEvent ? "Update Event" : "Save Event"}
        </Button>
      </Box>
    </Box>
  );
};

export default EventForm;
