import { SvgIcon } from "@mui/material";
import {
  CalendarGrid,
  CalendarHeader,
  CalendarSection,
  Container,
  DayButton,
  DayCell,
  DayHeader,
  DayHeaders,
  DayHeaderText,
  MonthYearButton,
  NavButton,
  PickerContent,
  YearButton,
  YearGrid,
  YearPicker,
  YearPickerTitle,
} from "../DateRangePicker/DateRangePicker.styled";
import { useState } from "react";
import LeftIcon from "../../../assets/icons/general/left.svg?react";
import RightIcon from "../../../assets/icons/general/calendar-14.svg?react";

type CalenderPickerProps = {
  startDate: Date | null;
  setStartDate: (startDate: Date | null) => void;
  endDate: Date | null;
  setEndDate: (endDate: Date | null) => void;
};
const CalenderPicker = ({
  startDate,
  endDate,
  setEndDate,
  setStartDate,
}: CalenderPickerProps) => {
  const [hoverDate, setHoverDate] = useState<Date | null>(null);
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [selectingEnd, setSelectingEnd] = useState<boolean>(false);
  const [showYearPicker, setShowYearPicker] = useState<boolean>(false);
  const getDaysInMonth = (date: Date): (Date | null)[] => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: (Date | null)[] = [];

    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const isSameDay = (date1: Date | null, date2: Date | null): boolean => {
    if (!date1 || !date2) return false;
    return date1.toDateString() === date2.toDateString();
  };

  const isInRange = (date: Date): boolean => {
    if (!startDate || !date) return false;
    const compareDate = endDate || hoverDate;
    if (!compareDate) return false;

    const start = new Date(startDate);
    const end = new Date(compareDate);
    const current = new Date(date);

    return current >= start && current <= end;
  };

  const isRangeStart = (date: Date): boolean => {
    return startDate ? isSameDay(date, startDate) : false;
  };

  const isRangeEnd = (date: Date): boolean => {
    return endDate ? isSameDay(date, endDate) : false;
  };

  const handleDateClick = (date: Date): void => {
    if (!startDate || selectingEnd) {
      if (!startDate) {
        setStartDate(date);
        setSelectingEnd(true);
      } else {
        if (date >= startDate) {
          setEndDate(date);
          setSelectingEnd(false);
        } else {
          setStartDate(date);
          setEndDate(null);
        }
      }
    } else {
      setStartDate(date);
      setEndDate(null);
      setSelectingEnd(true);
    }
  };

  const navigateMonth = (direction: number): void => {
    setCurrentMonth((prev) => {
      const newMonth = new Date(prev);
      newMonth.setMonth(newMonth.getMonth() + direction);
      return newMonth;
    });
  };

  const handleYearSelect = (year: number): void => {
    setCurrentMonth((prev) => {
      const newMonth = new Date(prev);
      newMonth.setFullYear(year);
      return newMonth;
    });
    setShowYearPicker(false);
  };

  const getYearRange = (): number[] => {
    const currentYear = new Date().getFullYear();
    const years: number[] = [];
    for (let year = currentYear - 10; year <= currentYear + 10; year++) {
      years.push(year);
    }
    return years;
  };

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const isToday = (date: Date): boolean => {
    const today = new Date();
    return isSameDay(date, today);
  };

  return (
    <Container>
      <PickerContent>
        {/* Calendar Section */}
        <CalendarSection>
          {/* Header */}
          <CalendarHeader>
            <NavButton onClick={() => navigateMonth(-1)}>
              <SvgIcon component={LeftIcon} />
            </NavButton>

            <MonthYearButton onClick={() => setShowYearPicker(!showYearPicker)}>
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </MonthYearButton>

            <NavButton onClick={() => navigateMonth(1)}>
              <SvgIcon component={RightIcon} />
              {/* <ChevronRight size={20} color="#6b7280" /> > */}
            </NavButton>
          </CalendarHeader>

          {/* Year Picker */}
          {showYearPicker && (
            <YearPicker>
              <YearPickerTitle>Select Year</YearPickerTitle>
              <YearGrid>
                {getYearRange().map((year) => (
                  <YearButton
                    key={year}
                    onClick={() => handleYearSelect(year)}
                    isSelected={year === currentMonth.getFullYear()}
                  >
                    {year}
                  </YearButton>
                ))}
              </YearGrid>
            </YearPicker>
          )}

          {/* Day Headers */}
          <DayHeaders>
            {dayNames.map((day) => (
              <DayHeader key={day}>
                <DayHeaderText>{day}</DayHeaderText>
              </DayHeader>
            ))}
          </DayHeaders>

          {/* Calendar Grid */}
          <CalendarGrid>
            {getDaysInMonth(currentMonth).map((date, index) => (
              <DayCell key={index}>
                {date && (
                  <DayButton
                    onClick={() => handleDateClick(date)}
                    onMouseEnter={() => setHoverDate(date)}
                    onMouseLeave={() => setHoverDate(null)}
                    isRangeStart={isRangeStart(date)}
                    isRangeEnd={isRangeEnd(date)}
                    isInRange={isInRange(date)}
                    isToday={isToday(date)}
                  >
                    {date.getDate()}
                  </DayButton>
                )}
              </DayCell>
            ))}
          </CalendarGrid>
        </CalendarSection>
      </PickerContent>
    </Container>
  );
};

export default CalenderPicker;
