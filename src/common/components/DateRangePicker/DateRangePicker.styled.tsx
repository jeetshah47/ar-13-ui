import React from 'react';
import { 
  Box, 
  Button, 
  Paper,
  Typography,
  IconButton,
  type ButtonProps,
  type BoxProps,
  type PaperProps,
  type TypographyProps,
  type IconButtonProps
} from '@mui/material';
import { keyframes } from '@mui/material';

// Keyframe animation
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

// Base interface for common component props
interface BaseComponentProps {
  children?: React.ReactNode;
}

// Container Components
interface ContainerProps extends BoxProps, BaseComponentProps {}

export const Container: React.FC<ContainerProps> = ({ children, ...props }) => (
  <Box sx={{ position: 'relative' }} {...props}>
    {children}
  </Box>
);

// Trigger Button Components
interface TriggerButtonProps extends ButtonProps, BaseComponentProps {}

export const TriggerButton: React.FC<TriggerButtonProps> = ({ children, ...props }) => (
  <Button
    sx={{
      width: '100%',
      maxWidth: '28rem',
      padding: '6px 10px',
      background: 'white',
      border: '2px solid #E6EDF5',
      borderRadius: '0.75rem',
      boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      transition: 'all 0.2s ease',
      cursor: 'pointer',
      color: 'inherit',
      textTransform: 'none',
      '&:hover': {
        borderColor: '#93c5fd',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        background: 'white'
      },
      '&:focus': {
        outline: 'none'
      },
      '@media (max-width: 1280px)': {
        padding: '0.625rem 0.75rem'
      }
    }}
    {...props}
  >
    {children}
  </Button>
);

interface TriggerContentProps extends BoxProps, BaseComponentProps {}

export const TriggerContent: React.FC<TriggerContentProps> = ({ children, ...props }) => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem'
    }}
    {...props}
  >
    {children}
  </Box>
);

interface TriggerTextProps extends TypographyProps {
  hasDate: boolean;
  children: React.ReactNode;
}

export const TriggerText: React.FC<TriggerTextProps> = ({ hasDate, children, ...props }) => (
  <Typography
    component="span"
    sx={{
       fontSize: '14px',
      color: hasDate ? '#111827' : '#6b7280',
      fontWeight: 500,
      '@media (max-width: 1280px)': {
        fontSize: '12px'
      }
    }}
    {...props}
  >
    {children}
  </Typography>
);

interface ClearButtonProps extends IconButtonProps, BaseComponentProps {}

export const ClearButton: React.FC<ClearButtonProps> = ({ children, ...props }) => (
  <IconButton
    sx={{
      borderRadius: '9999px',
      transition: 'background-color 0.2s ease',
      border: 'none',
      background: 'transparent',
      fontSize:"14px",
      '&:hover': {
        backgroundColor: '#f3f4f6'
      }
    }}
    {...props}
  >
    {children}
  </IconButton>
);

// Dropdown Components
interface PickerDropdownProps extends PaperProps, BaseComponentProps {}

export const PickerDropdown: React.FC<PickerDropdownProps> = ({ children, ...props }) => (
  <Paper
    sx={{
      position: 'absolute',
      top: '100%',
      right: 0,
      marginTop: '0.5rem',
      background: 'white',
      border: '1px solid #e5e7eb',
      borderRadius: '1rem',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      zIndex: 50,
      animation: `${fadeIn} 0.2s ease`
    }}
    {...props}
  >
    {children}
  </Paper>
);

interface PickerContentProps extends BoxProps, BaseComponentProps {}

export const PickerContent: React.FC<PickerContentProps> = ({ children, ...props }) => (
  <Box sx={{ display: 'flex' }} {...props}>
    {children}
  </Box>
);

// Sidebar Components
interface PresetsSidebarProps extends BoxProps, BaseComponentProps {}

export const PresetsSidebar: React.FC<PresetsSidebarProps> = ({ children, ...props }) => (
  <Box
    sx={{
      width: '12rem',
      background: '#f9fafb',
      padding: '1rem',
      borderTopLeftRadius: '1rem',
      borderBottomLeftRadius: '1rem',
      borderRight: '1px solid #e5e7eb'
    }}
    {...props}
  >
    {children}
  </Box>
);

interface PresetTitleProps extends TypographyProps, BaseComponentProps {}

export const PresetTitle: React.FC<PresetTitleProps> = ({ children, ...props }) => (
  <Typography
    variant="h6"
    sx={{
      fontSize: '1rem',
      fontWeight: 600,
      color: '#374151',
      marginBottom: '0.75rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      '@media (max-width: 1280px)': {
        fontSize: '14px'
      }
    }}
    {...props}
  >
    {children}
  </Typography>
);

interface PresetListProps extends BoxProps, BaseComponentProps {}

export const PresetList: React.FC<PresetListProps> = ({ children, ...props }) => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      gap: '0.25rem'
    }}
    {...props}
  >
    {children}
  </Box>
);

interface PresetButtonProps extends ButtonProps {
  isSelected: boolean;
  children: React.ReactNode;
}

export const PresetButton: React.FC<PresetButtonProps> = ({ isSelected, children, ...props }) => (
  <Button
    sx={{
      width: '100%',
      textAlign: 'left',
      padding: '0.5rem 0.75rem',
      fontSize: '1rem',
      borderRadius: '0.5rem',
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      textTransform: 'none',
      justifyContent: 'flex-start',
      ...(isSelected
        ? {
            background: '#007bff',
            color: 'white',
            '&:hover': {
              background: '#007bff'
            }
          }
        : {
            background: 'transparent',
            color: '#374151',
            '&:hover': {
              background: '#f3f4f6'
            }
          }),
      '@media (max-width: 1280px)': {
        fontSize: '12px'
      }
    }}
    {...props}
  >
    {children}
  </Button>
);

// Calendar Components
interface CalendarSectionProps extends BoxProps, BaseComponentProps {}

export const CalendarSection: React.FC<CalendarSectionProps> = ({ children, ...props }) => (
  <Box
    sx={{
      flex: 1,
      padding: '1.5rem',
      '@media (max-width: 1280px)': {
        padding: '1rem'
      }
    }}
    {...props}
  >
    {children}
  </Box>
);

interface CalendarHeaderProps extends BoxProps, BaseComponentProps {}

export const CalendarHeader: React.FC<CalendarHeaderProps> = ({ children, ...props }) => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '1.5rem',
      '@media (max-width: 1280px)': {
        marginBottom: '0.825rem'
      }
    }}
    {...props}
  >
    {children}
  </Box>
);

interface NavButtonProps extends IconButtonProps, BaseComponentProps {}

export const NavButton: React.FC<NavButtonProps> = ({ children, ...props }) => (
  <IconButton
    sx={{
      padding: '0.5rem',
      borderRadius: '0.5rem',
      border: 'none',
      background: 'transparent',
      transition: 'background-color 0.2s ease',
      '&:hover': {
        background: '#f3f4f6'
      }
    }}
    {...props}
  >
    {children}
  </IconButton>
);

interface MonthYearButtonProps extends ButtonProps, BaseComponentProps {}

export const MonthYearButton: React.FC<MonthYearButtonProps> = ({ children, ...props }) => (
  <Button
    sx={{
      fontSize: '1.125rem',
      fontWeight: 600,
      color: '#111827',
      padding: '0.5rem 1rem',
      borderRadius: '0.5rem',
      border: 'none',
      background: 'transparent',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      textTransform: 'none',
      '&:hover': {
        color: '#2563eb',
        background: '#f9fafb'
      },
      '@media (max-width: 1280px)': {
        fontSize: '0.9rem'
      }
    }}
    {...props}
  >
    {children}
  </Button>
);

// Year Picker Components
interface YearPickerProps extends BoxProps, BaseComponentProps {}

export const YearPicker: React.FC<YearPickerProps> = ({ children, ...props }) => (
  <Box
    sx={{
      marginBottom: '1.5rem',
      padding: '1rem',
      background: '#f9fafb',
      borderRadius: '0.5rem',
      '@media (max-width: 1280px)': {
        marginBottom: '0.625rem'
      }
    }}
    {...props}
  >
    {children}
  </Box>
);

interface YearPickerTitleProps extends TypographyProps, BaseComponentProps {}

export const YearPickerTitle: React.FC<YearPickerTitleProps> = ({ children, ...props }) => (
  <Typography
    variant="h6"
    sx={{
      fontSize: '1rem',
      fontWeight: 500,
      color: '#374151',
      marginBottom: '0.75rem',
      '@media (max-width: 1280px)': {
        fontSize: '0.875rem'
      }
    }}
    {...props}
  >
    {children}
  </Typography>
);

interface YearGridProps extends BoxProps, BaseComponentProps {}

export const YearGrid: React.FC<YearGridProps> = ({ children, ...props }) => (
  <Box
    sx={{
      display: 'grid',
      gridTemplateColumns: 'repeat(5, 1fr)',
      gap: '0.5rem',
      maxHeight: '10rem',
      overflowY: 'auto'
    }}
    {...props}
  >
    {children}
  </Box>
);

interface YearButtonProps extends ButtonProps {
  isSelected: boolean;
  children: React.ReactNode;
}

export const YearButton: React.FC<YearButtonProps> = ({ isSelected, children, ...props }) => (
  <Button
    sx={{
      padding: '0.5rem',
      fontSize: '1rem',
      borderRadius: '0.5rem',
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      textTransform: 'none',
      minWidth: 'auto',
      ...(isSelected
        ? {
            background: '#007bff',
            color: 'white',
            '&:hover': {
              background: '#007bff'
            }
          }
        : {
            background: 'transparent',
            color: '#374151',
            '&:hover': {
              background: '#e5e7eb'
            }
          }),
      '@media (max-width: 1280px)': {
        fontSize: '0.875rem'
      }
    }}
    {...props}
  >
    {children}
  </Button>
);

// Day Components
interface DayHeadersProps extends BoxProps, BaseComponentProps {}

export const DayHeaders: React.FC<DayHeadersProps> = ({ children, ...props }) => (
  <Box
    sx={{
      display: 'grid',
      gridTemplateColumns: 'repeat(7, 1fr)',
      gap: '0.25rem',
      marginBottom: '0.5rem'
    }}
    {...props}
  >
    {children}
  </Box>
);

interface DayHeaderProps extends BoxProps, BaseComponentProps {}

export const DayHeader: React.FC<DayHeaderProps> = ({ children, ...props }) => (
  <Box
    sx={{
      height: '2.5rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}
    {...props}
  >
    {children}
  </Box>
);

interface DayHeaderTextProps extends TypographyProps, BaseComponentProps {}

export const DayHeaderText: React.FC<DayHeaderTextProps> = ({ children, ...props }) => (
  <Typography
    component="span"
    sx={{
      fontSize: '0.875rem',
      fontWeight: 500,
      color: '#6b7280',
      '@media (max-width: 1280px)': {
        fontSize: '0.75rem'
      }
    }}
    {...props}
  >
    {children}
  </Typography>
);

interface CalendarGridProps extends BoxProps, BaseComponentProps {}

export const CalendarGrid: React.FC<CalendarGridProps> = ({ children, ...props }) => (
  <Box
    sx={{
      display: 'grid',
      gridTemplateColumns: 'repeat(7, 1fr)',
      gap: '0.25rem',
      marginBottom: '1.5rem'
    }}
    {...props}
  >
    {children}
  </Box>
);

interface DayCellProps extends BoxProps, BaseComponentProps {}

export const DayCell: React.FC<DayCellProps> = ({ children, ...props }) => (
  <Box
    sx={{
      height: '2.5rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}
    {...props}
  >
    {children}
  </Box>
);

interface DayButtonProps extends ButtonProps {
  isRangeStart: boolean;
  isRangeEnd: boolean;
  isInRange: boolean;
  isToday: boolean;
  children: React.ReactNode;
}

export const DayButton: React.FC<DayButtonProps> = ({ 
  isRangeStart, 
  isRangeEnd, 
  isInRange, 
  isToday, 
  children, 
  ...props 
}) => {
  let buttonStyles = {};
  
  if (isRangeStart || isRangeEnd) {
    buttonStyles = {
      background: '#007bff',
      color: 'white',
      '&:hover': {
        background: '#2563eb'
      }
    };
  } else if (isInRange) {
    buttonStyles = {
      background: '#eff6ff',
      color: '#1d4ed8',
      '&:hover': {
        background: '#eff6ff'
      }
    };
  } else {
    buttonStyles = {
      background: 'transparent',
      color: '#374151',
      '&:hover': {
        background: '#dbeafe',
        color: '#2563eb'
      }
    };
  }

  return (
    <Button
      sx={{
        width: '2.5rem',
        height: '2.5rem',
        borderRadius: '0.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1rem',
        fontWeight: 500,
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        border: 'none',
        textTransform: 'none',
        minWidth: 'auto',
        ...buttonStyles,
        ...(isToday && {
          boxShadow: '0 0 0 2px #93c5fd'
        }),
        '@media (max-width: 1280px)': {
          fontSize: '0.75rem',
          width: '2rem',
          height: '2rem'
        }
      }}
      {...props}
    >
      {children}
    </Button>
  );
};

// Action Components
interface ActionButtonsProps extends BoxProps, BaseComponentProps {}

export const ActionButtons: React.FC<ActionButtonsProps> = ({ children, ...props }) => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingTop: '1rem',
      borderTop: '1px solid #f3f4f6'
    }}
    {...props}
  >
    {children}
  </Box>
);

interface ClearActionButtonProps extends ButtonProps, BaseComponentProps {}

export const ClearActionButton: React.FC<ClearActionButtonProps> = ({ children, ...props }) => (
  <Button
    sx={{
      padding: '0.5rem 1rem',
      fontSize: '1rem',
      fontWeight: 500,
      color: '#6b7280',
      border: 'none',
      background: 'transparent',
      borderRadius: '0.5rem',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      textTransform: 'none',
      '&:hover': {
        color: '#111827',
        background: '#f9fafb'
      },
      '@media (max-width: 1280px)': {
        fontSize: '0.75rem'
      }
    }}
    {...props}
  >
    {children}
  </Button>
);

interface ApplyButtonProps extends ButtonProps {
  disabled?: boolean;
  children: React.ReactNode;
}

export const ApplyButton: React.FC<ApplyButtonProps> = ({ disabled = false, children, ...props }) => (
  <Button
    disabled={disabled}
    sx={{
      padding: '0.5rem 1.5rem',
      background: '#007bff',
      color: 'white',
      fontSize: '1rem',
      fontWeight: 500,
      borderRadius: '0.5rem',
      border: 'none',
      cursor: 'pointer',
      transition: 'background-color 0.2s ease',
      textTransform: 'none',
      '&:hover': {
        background: disabled ? '#d1d5db' : '#2563eb'
      },
      '&:disabled': {
        background: '#d1d5db',
        cursor: 'not-allowed',
        color: 'white'
      },
      '@media (max-width: 1280px)': {
        fontSize: '0.75rem'
      }
    }}
    {...props}
  >
    {children}
  </Button>
);