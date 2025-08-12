import { useEffect, useRef, useState } from "react";
import {
  ActionButtons,
  ApplyButton,
  CalendarGrid,
  CalendarHeader,
  CalendarSection,
  ClearActionButton,
  ClearButton,
  Container,
  DayButton,
  DayCell,
  DayHeader,
  DayHeaders,
  DayHeaderText,
  MonthYearButton,
  NavButton,
  PickerContent,
  PickerDropdown,
  PresetButton,
  PresetList,
  PresetsSidebar,
  PresetTitle,
  TriggerButton,
  TriggerContent,
  TriggerText,
  YearButton,
  YearGrid,
  YearPicker,
  YearPickerTitle,
} from "./DateRangePicker.styled";
import CalenderIcon from "../../../assets/icons/general/calendar.svg?react";
import { SvgIcon } from "@mui/material";
interface DateRange {
  start: Date;
  end: Date;
}

interface Preset {
  label: string;
  value: string;
  getDates: () => DateRange;
}

type DateRangePickerProps = {
  prev?: boolean;
  startDate: Date | null;
  setStartDate: (startDate: Date | null) => void;
  endDate: Date | null;
  setEndDate: (endDate: Date | null) => void;
  calenderView?: boolean;
};

export const DateRangePicker = ({
  prev,
  setStartDate,
  setEndDate,
  endDate,
  startDate,
  calenderView,
}: DateRangePickerProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(calenderView ? true : false);
  const [hoverDate, setHoverDate] = useState<Date | null>(null);
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [selectingEnd, setSelectingEnd] = useState<boolean>(false);
  const [showYearPicker, setShowYearPicker] = useState<boolean>(false);
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const pickerRef = useRef<HTMLDivElement>(null);

  const prevPresets: Preset[] = [
    {
      label: "Last 30 days",
      value: "last30",
      getDates: (): DateRange => {
        const end = new Date();
        const start = new Date();
        start.setDate(end.getDate() - 30);
        return { start, end };
      },
    },
    {
      label: "Last 60 days",
      value: "last60",
      getDates: (): DateRange => {
        const end = new Date();
        const start = new Date();
        start.setDate(end.getDate() - 60);
        return { start, end };
      },
    },
    {
      label: "Last 90 days",
      value: "last90",
      getDates: (): DateRange => {
        const end = new Date();
        const start = new Date();
        start.setDate(end.getDate() - 90);
        return { start, end };
      },
    },
    {
      label: "Last month",
      value: "lastMonth",
      getDates: (): DateRange => {
        const now = new Date();
        const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const end = new Date(now.getFullYear(), now.getMonth(), 0);
        return { start, end };
      },
    },
    {
      label: "This month",
      value: "thisMonth",
      getDates: (): DateRange => {
        const now = new Date();
        const start = new Date(now.getFullYear(), now.getMonth(), 1);
        const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        return { start, end };
      },
    },
    {
      label: "This year",
      value: "thisYear",
      getDates: (): DateRange => {
        const now = new Date();
        const start = new Date(now.getFullYear(), 0, 1);
        const end = new Date(now.getFullYear(), 11, 31);
        return { start, end };
      },
    },
  ];

  const nextPresets: Preset[] = [
    {
      label: "Next 30 days",
      value: "next30",
      getDates: (): DateRange => {
        const start = new Date();
        const end = new Date();
        end.setDate(end.getDate() + 30);
        return { start, end };
      },
    },
    {
      label: "Next 60 days",
      value: "next60",
      getDates: (): DateRange => {
        const start = new Date();
        const end = new Date();
        end.setDate(end.getDate() + 60);
        return { start, end };
      },
    },
    {
      label: "Next 90 days",
      value: "next90",
      getDates: (): DateRange => {
        const start = new Date();
        const end = new Date();
        end.setDate(end.getDate() + 90);
        return { start, end };
      },
    },
    {
      label: "This month",
      value: "thisMonth",
      getDates: (): DateRange => {
        const now = new Date();
        const start = new Date(now.getFullYear(), now.getMonth(), 1);
        const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        return { start, end };
      },
    },
    {
      label: "Next month",
      value: "nextMonth",
      getDates: (): DateRange => {
        const now = new Date();
        const start = new Date(now.getFullYear(), now.getMonth() + 1, 1);
        const end = new Date(now.getFullYear(), now.getMonth() + 2, 0);
        return { start, end };
      },
    },
    {
      label: "This year",
      value: "thisYear",
      getDates: (): DateRange => {
        const now = new Date();
        const start = new Date(now.getFullYear(), 0, 1);
        const end = new Date(now.getFullYear(), 11, 31);
        return { start, end };
      },
    },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  const formatDate = (date: Date | null): string => {
    if (!date) return "";
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
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
    setSelectedPreset(null);

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

  const handlePresetClick = (preset: Preset): void => {
    const { start, end } = preset.getDates();
    setStartDate(start);
    setEndDate(end);
    setSelectingEnd(false);
    setSelectedPreset(preset.value);
  };

  const clearSelection = (): void => {
    setStartDate(null);
    setEndDate(null);
    setSelectingEnd(false);
    setHoverDate(null);
    setSelectedPreset(null);
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

  const displayText = (): string => {
    if (startDate && endDate) {
      return `${formatDate(startDate)} - ${formatDate(endDate)}`;
    } else if (startDate) {
      return `${formatDate(startDate)} - Select end date`;
    }
    return "Select date range";
  };

  const isToday = (date: Date): boolean => {
    const today = new Date();
    return isSameDay(date, today);
  };

  const handleOnSelectDate = () => {
    setIsOpen(false);
  };

  return (
    <Container ref={pickerRef}>
      {/* Trigger Button */}
      <TriggerButton onClick={() => setIsOpen(!isOpen)} hidden={calenderView}>
        <TriggerContent>
          {/* <TriggerIcon /> */}
          <SvgIcon component={CalenderIcon} />
          <TriggerText hasDate={!!startDate}>{displayText()}</TriggerText>
        </TriggerContent>
        {(startDate || endDate) && (
          <ClearButton
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation();
              clearSelection();
            }}
          >
            X
          </ClearButton>
        )}
      </TriggerButton>

      {/* Picker Dropdown */}
      {isOpen && (
        <PickerDropdown>
          <PickerContent>
            {/* Quick Presets Sidebar */}
            <PresetsSidebar>
              <PresetTitle>{/* <Clock size={16} /> */}Quick Select</PresetTitle>
              <PresetList>
                {prev
                  ? prevPresets.map((preset) => (
                      <PresetButton
                        key={preset.value}
                        onClick={() => handlePresetClick(preset)}
                        isSelected={selectedPreset === preset.value}
                      >
                        {preset.label}
                      </PresetButton>
                    ))
                  : nextPresets.map((preset) => (
                      <PresetButton
                        key={preset.value}
                        onClick={() => handlePresetClick(preset)}
                        isSelected={selectedPreset === preset.value}
                      >
                        {preset.label}
                      </PresetButton>
                    ))}
              </PresetList>
            </PresetsSidebar>

            {/* Calendar Section */}
            <CalendarSection>
              {/* Header */}
              <CalendarHeader>
                <NavButton onClick={() => navigateMonth(-1)}>{"<"}</NavButton>

                <MonthYearButton
                  onClick={() => setShowYearPicker(!showYearPicker)}
                >
                  {monthNames[currentMonth.getMonth()]}{" "}
                  {currentMonth.getFullYear()}
                </MonthYearButton>

                <NavButton onClick={() => navigateMonth(1)}>
                  {">"}
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

              {/* Action Buttons */}
              <ActionButtons>
                <ClearActionButton onClick={clearSelection}>
                  Clear
                </ClearActionButton>

                <ApplyButton
                  onClick={handleOnSelectDate}
                  disabled={!startDate || !endDate}
                >
                  Apply
                </ApplyButton>
              </ActionButtons>
            </CalendarSection>
          </PickerContent>
        </PickerDropdown>
      )}
    </Container>
  );
};
