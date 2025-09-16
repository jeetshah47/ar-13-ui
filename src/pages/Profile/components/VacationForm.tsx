import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  SvgIcon,
  TextField,
  Typography,
  Alert,
  CircularProgress,
} from "@mui/material";
import CrossIcon from "../../../assets/icons/general/calendar-6.svg?react";
import Tab from "../../../common/components/Tab/Tab";
import { useState, useEffect } from "react";
import CalenderPicker from "../../../common/components/CalendarPicker/CalenderPicker";
import { useVacation } from "../../../store/hooks/useVacation";
import type { VacationRequest, RequestType, DurationType } from "../../../store/types/Vacation/VacationTypes";

type VacationFormProps = {
  onClose: () => void;
};

const tabList = ["Days", "Hours"];

const VacationForm = ({ onClose }: VacationFormProps) => {
  const { createRequest, loading, error } = useVacation();
  
  const [currentTab, setCurrentTab] = useState("Days");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [requestType, setRequestType] = useState<RequestType>("vacation");
  const [duration, setDuration] = useState<number>(1);
  const [comments, setComments] = useState<string>("");
  const [workingHours, setWorkingHours] = useState({ from: "9:00 AM", to: "5:00 PM" });
  const [formErrors, setFormErrors] = useState<string[]>([]);

  // Calculate duration based on selected dates
  useEffect(() => {
    if (startDate && endDate && currentTab === "Days") {
      const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      setDuration(diffDays);
    }
  }, [startDate, endDate, currentTab]);

  const validateForm = (): boolean => {
    const errors: string[] = [];
    
    if (!requestType) {
      errors.push("Please select a request type");
    }
    
    if (!startDate) {
      errors.push("Please select a start date");
    }
    
    if (requestType !== "work_remotely" && !endDate) {
      errors.push("Please select an end date");
    }
    
    if (duration <= 0) {
      errors.push("Duration must be greater than 0");
    }
    
    if (!comments.trim()) {
      errors.push("Please provide a reason for your request");
    }
    
    if (requestType === "work_remotely") {
      if (!workingHours.from || !workingHours.to) {
        errors.push("Please specify working hours for remote work");
      }
    }
    
    setFormErrors(errors);
    return errors.length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    const vacationRequest: VacationRequest = {
      requestType,
      startDate: startDate!.toISOString().split('T')[0],
      endDate: endDate ? endDate.toISOString().split('T')[0] : undefined,
      duration,
      durationType: currentTab.toLowerCase() as DurationType,
      workingHours: requestType === "work_remotely" ? workingHours : undefined,
      comments: comments.trim(),
    };

    try {
      await createRequest(vacationRequest);
      // Close the form on success
      onClose();
    } catch (err) {
      console.error("Failed to create vacation request:", err);
    }
  };

  const handleRequestTypeChange = (value: string) => {
    const typeMap: { [key: string]: RequestType } = {
      "Vacation": "vacation",
      "Sick Leave": "sick_leave", 
      "Work remotely": "work_remotely"
    };
    setRequestType(typeMap[value] || "vacation");
  };

  return (
    <Box
      sx={{
        background: "#FFFFFF",
        boxShadow: "0px 6px 58px rgba(121, 145, 173, 0.195504)",
        borderRadius: "24px",
        padding: "28px",
        overflow: "auto",
        height: "inherit",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingY: "30px",
          width: "584px",
        }}
      >
        <Typography fontWeight={"bold"} variant="h6">
          Add Vacation Request
        </Typography>
        <Box
          sx={{
            background: "#F4F9FD",
            borderRadius: "14px",
            display: "flex",
            padding: "8px",
            cursor: "pointer",
          }}
          onClick={onClose}
        >
          <SvgIcon fontSize="small" component={CrossIcon} onClick={onClose} />
        </Box>
      </Box>
      
      {/* Error Display */}
      {(error || formErrors.length > 0) && (
        <Box sx={{ marginBottom: "16px" }}>
          {error && (
            <Alert severity="error" sx={{ marginBottom: "8px" }}>
              {error}
            </Alert>
          )}
          {formErrors.map((errorMsg, index) => (
            <Alert key={index} severity="error" sx={{ marginBottom: "4px" }}>
              {errorMsg}
            </Alert>
          ))}
        </Box>
      )}

      <Box>
        <Typography fontSize={"14px"} color="secondary.main" fontWeight={700}>
          Request Type
        </Typography>
        <FormControl sx={{ width: "100%", padding: "12px 18px" }}>
          <RadioGroup
            row
            aria-labelledby="demo-row-radio-buttons-group-label"
            name="row-radio-buttons-group"
            sx={{ justifyContent: "space-between", display: "flex" }}
            value={requestType === "vacation" ? "Vacation" : requestType === "sick_leave" ? "Sick Leave" : "Work remotely"}
            onChange={(e) => handleRequestTypeChange(e.target.value)}
          >
            <FormControlLabel
              value="Vacation"
              control={<Radio />}
              label="Vacation"
              sx={{
                border: "1px solid #D8E0F0",
                borderRadius: "10px",
                paddingX: "18px",
              }}
            />
            <FormControlLabel
              value="Sick Leave"
              control={<Radio />}
              label="Sick Leave"
              sx={{
                border: "1px solid #D8E0F0",
                borderRadius: "10px",
                paddingX: "18px",
              }}
            />
            <FormControlLabel
              value="Work remotely"
              control={<Radio />}
              label="Work remotely"
              sx={{
                border: "1px solid #D8E0F0",
                borderRadius: "10px",
                paddingX: "18px",
              }}
            />
          </RadioGroup>
        </FormControl>
        <Tab
          tabList={tabList}
          currentTab={currentTab}
          onChangeTab={(tab) => setCurrentTab(tab)}
        />
        
        {/* Duration Input */}
        <Box sx={{ padding: "12px 0px" }}>
          <Typography fontSize={"14px"} color="secondary.main" fontWeight={700}>
            Duration ({currentTab})
          </Typography>
          <TextField
            sx={{ width: "100%", marginTop: "8px" }}
            type="number"
            value={duration}
            onChange={(e) => setDuration(parseInt(e.target.value) || 1)}
            inputProps={{ min: 1 }}
            disabled={currentTab === "Days" && startDate && endDate}
            helperText={currentTab === "Days" && startDate && endDate ? "Calculated from selected dates" : ""}
          />
        </Box>

        {/* Working Hours for Remote Work */}
        {requestType === "work_remotely" && (
          <Box sx={{ padding: "12px 0px" }}>
            <Typography fontSize={"14px"} color="secondary.main" fontWeight={700}>
              Working Hours
            </Typography>
            <Box sx={{ display: "flex", gap: "12px", marginTop: "8px" }}>
              <TextField
                label="From"
                value={workingHours.from}
                onChange={(e) => setWorkingHours({ ...workingHours, from: e.target.value })}
                sx={{ flex: 1 }}
                required
              />
              <TextField
                label="To"
                value={workingHours.to}
                onChange={(e) => setWorkingHours({ ...workingHours, to: e.target.value })}
                sx={{ flex: 1 }}
                required
              />
            </Box>
          </Box>
        )}

        <Box sx={{ padding: "12px 0px" }}>
          <CalenderPicker
            startDate={startDate}
            endDate={endDate}
            setEndDate={setEndDate}
            setStartDate={setStartDate}
          />
        </Box>
        
        <Box>
          <Typography fontSize={"14px"} color="secondary.main" fontWeight={700}>
            Reason
          </Typography>
          <TextField 
            sx={{ width: "100%", marginTop: "8px" }} 
            multiline
            rows={3}
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            placeholder="Please provide a reason for your request..."
          />
        </Box>
        <Box
          sx={{
            padding: "6px 0px",
            display: "flex",
            justifyContent: "end",
            gap: "12px",
          }}
        >
          <Button 
            variant="outlined" 
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={handleSubmit}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={16} /> : null}
          >
            {loading ? "Sending..." : "Send Request"}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default VacationForm;
