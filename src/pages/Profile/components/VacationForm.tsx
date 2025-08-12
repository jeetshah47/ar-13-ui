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
} from "@mui/material";
import CrossIcon from "../../../assets/icons/general/calendar-6.svg?react";
import Tab from "../../../common/components/Tab/Tab";
import { useState } from "react";
import CalenderPicker from "../../../common/components/CalendarPicker/CalenderPicker";

type VacationFormProps = {
  onClose: () => void;
};

const tabList = ["Days", "Hours"];

const VacationForm = ({ onClose }: VacationFormProps) => {
  const [currentTab, setCurrentTab] = useState("Days");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

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
          Add Employee
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
          <TextField sx={{ width: "100%" }} type="text" />
        </Box>
        <Box
          sx={{
            padding: "6px 0px",
            display: "flex",
            justifyContent: "end",
          }}
        >
          <Button variant="contained">Send Request</Button>
        </Box>
      </Box>
    </Box>
  );
};

export default VacationForm;
