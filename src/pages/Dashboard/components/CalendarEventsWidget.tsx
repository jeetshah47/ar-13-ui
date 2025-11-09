import { Box, Typography, SvgIcon, Select, MenuItem, FormControl } from "@mui/material";
import CalenderIcon from "../../../assets/icons/general/calendar.svg?react";
import type { CalendarResponse } from "../../../store/types/Calendar/CalendarResponse";

interface CalendarEventsWidgetProps {
  events: CalendarResponse[];
  selectedMonth: Date;
  onMonthChange: (month: Date) => void;
}

const CalendarEventsWidget = ({ events, selectedMonth, onMonthChange }: CalendarEventsWidgetProps) => {

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const handleMonthChange = (monthIndex: number) => {
    const newMonth = new Date(selectedMonth);
    newMonth.setMonth(monthIndex);
    onMonthChange(newMonth);
  };

  // Get events count for the selected month
  const getMonthEventsCount = (): number => {
    const currentMonthIndex = selectedMonth.getMonth();
    const currentYear = selectedMonth.getFullYear();

    return events.filter((event) => {
      if (!event.start) return false;
      const parsed = new Date(event.start);
      if (isNaN(parsed.getTime())) return false;
      
      const eventMonth = parsed.getMonth();
      const eventYear = parsed.getFullYear();
      
      return eventMonth === currentMonthIndex && eventYear === currentYear;
    }).length;
  };

  const monthEventsCount = getMonthEventsCount();

  return (
    <Box
      sx={(theme) => ({
        display: "flex",
        alignItems: "center",
        gap: "10px",
        padding: "10px 18px",
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: "12px",
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[1],
        transition: "all 0.2s ease-in-out",
        "&:hover": {
          boxShadow: theme.shadows[2],
          borderColor: theme.palette.primary.light,
        },
      })}
    >
      <Box
        sx={(theme) => ({
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "36px",
          height: "36px",
          borderRadius: "8px",
          backgroundColor: theme.palette.primary.light,
          color: theme.palette.primary.main,
        })}
      >
        <SvgIcon component={CalenderIcon} sx={{ fontSize: "20px" }} />
      </Box>
      
      <FormControl 
        size="small" 
        sx={{ 
          minWidth: 150,
          "& .MuiOutlinedInput-root": {
            borderRadius: "8px",
            backgroundColor: "background.default",
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "primary.main",
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "primary.main",
              borderWidth: "1.5px",
            },
          },
        }}
      >
        <Select
          value={selectedMonth.getMonth()}
          onChange={(e) => handleMonthChange(Number(e.target.value))}
          sx={{
            fontSize: "14px",
            fontWeight: 500,
            "& .MuiSelect-select": {
              padding: "8px 14px",
              paddingRight: "32px",
            },
          }}
        >
          {monthNames.map((month, index) => (
            <MenuItem key={month} value={index}>
              {month}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Typography 
        variant="body2" 
        sx={{ 
          fontSize: "14px",
          fontWeight: 500,
          color: "text.secondary",
          whiteSpace: "nowrap",
        }}
      >
        {selectedMonth.getFullYear()}
      </Typography>

      {monthEventsCount > 0 && (
        <Box
          sx={(theme) => ({
            display: "flex",
            alignItems: "center",
            padding: "6px 12px",
            borderRadius: "8px",
            backgroundColor: theme.palette.primary.light,
            border: `1px solid ${theme.palette.primary.main}20`,
          })}
        >
          <Typography 
            variant="caption" 
            sx={{ 
              fontSize: "12px", 
              fontWeight: 600,
              color: "primary.main", 
              whiteSpace: "nowrap",
            }}
          >
            {monthEventsCount} event{monthEventsCount > 1 ? 's' : ''}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default CalendarEventsWidget;

