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

export const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ children, ...props }, ref) => (
    <Box ref={ref} sx={{ position: 'relative' }} {...props}>
      {children}
    </Box>
  )
);

Container.displayName = 'Container';

// Trigger Button Components
interface TriggerButtonProps extends ButtonProps, BaseComponentProps {}

export const TriggerButton: React.FC<TriggerButtonProps> = ({ children, ...props }) => (
  <Button
    sx={(theme) => ({
      width: '100%',
      maxWidth: '28rem',
      padding: '6px 10px',
      background: theme.palette.background.paper,
      border: `2px solid ${theme.palette.grey[200]}`,
      borderRadius: '0.75rem',
      boxShadow: theme.shadows[3],
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      transition: 'all 0.2s ease',
      cursor: 'pointer',
      color: 'inherit',
      textTransform: 'none',
      '&:hover': {
        borderColor: theme.palette.primary.light,
        boxShadow: theme.shadows[4],
        background: theme.palette.background.paper
      },
      '&:focus': {
        outline: 'none'
      },
      '@media (max-width: 1280px)': {
        padding: '0.625rem 0.75rem'
      }
    })}
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
    sx={(theme) => ({
       fontSize: '14px',
      color: hasDate ? theme.palette.text.primary : theme.palette.text.secondary,
      fontWeight: 500,
      '@media (max-width: 1280px)': {
        fontSize: '12px'
      }
    })}
    {...props}
  >
    {children}
  </Typography>
);

interface ClearButtonProps extends IconButtonProps, BaseComponentProps {}

export const ClearButton: React.FC<ClearButtonProps> = ({ children, ...props }) => (
  <IconButton
    sx={(theme) => ({
      borderRadius: '9999px',
      transition: 'background-color 0.2s ease',
      border: 'none',
      background: 'transparent',
      fontSize:"14px",
      '&:hover': {
        backgroundColor: theme.palette.action.hover
      }
    })}
    {...props}
  >
    {children}
  </IconButton>
);

// Dropdown Components
interface PickerDropdownProps extends PaperProps, BaseComponentProps {}

export const PickerDropdown: React.FC<PickerDropdownProps> = ({ children, ...props }) => (
  <Paper
    sx={(theme) => ({
      position: 'absolute',
      top: '100%',
      right: 0,
      marginTop: '0.5rem',
      background: theme.palette.background.paper,
      border: `1px solid ${theme.palette.divider}`,
      borderRadius: '1rem',
      boxShadow: theme.shadows[6],
      zIndex: 50,
      animation: `${fadeIn} 0.2s ease`
    })}
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
    sx={(theme) => ({
      width: '12rem',
      background: theme.palette.grey[50],
      padding: '1rem',
      borderTopLeftRadius: '1rem',
      borderBottomLeftRadius: '1rem',
      borderRight: `1px solid ${theme.palette.divider}`
    })}
    {...props}
  >
    {children}
  </Box>
);

interface PresetTitleProps extends TypographyProps, BaseComponentProps {}

export const PresetTitle: React.FC<PresetTitleProps> = ({ children, ...props }) => (
  <Typography
    variant="h6"
    sx={(theme) => ({
      fontSize: '1rem',
      fontWeight: 600,
      color: theme.palette.text.primary,
      marginBottom: '0.75rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      '@media (max-width: 1280px)': {
        fontSize: '14px'
      }
    })}
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
    sx={(theme) => ({
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
            background: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
            '&:hover': {
              background: theme.palette.primary.main
            }
          }
        : {
            background: 'transparent',
            color: theme.palette.text.primary,
            '&:hover': {
              background: theme.palette.action.hover
            }
          }),
      '@media (max-width: 1280px)': {
        fontSize: '12px'
      }
    })}
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
      marginBottom: '1rem',
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
    sx={(theme) => ({
      padding: '0.5rem',
      borderRadius: '0.5rem',
      border: 'none',
      background: 'transparent',
      transition: 'background-color 0.2s ease',
      '&:hover': {
        background: theme.palette.action.hover
      }
    })}
    {...props}
  >
    {children}
  </IconButton>
);

interface MonthYearButtonProps extends ButtonProps, BaseComponentProps {}

export const MonthYearButton: React.FC<MonthYearButtonProps> = ({ children, ...props }) => (
  <Button
    sx={(theme) => ({
      fontSize: '1.125rem',
      fontWeight: 600,
      color: theme.palette.text.primary,
      padding: '0.5rem 1rem',
      borderRadius: '0.5rem',
      border: 'none',
      background: 'transparent',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      textTransform: 'none',
      '&:hover': {
        color: theme.palette.primary.main,
        background: theme.palette.action.hover
      },
      '@media (max-width: 1280px)': {
        fontSize: '0.9rem'
      }
    })}
    {...props}
  >
    {children}
  </Button>
);

// Year Picker Components
interface YearPickerProps extends BoxProps, BaseComponentProps {}

export const YearPicker: React.FC<YearPickerProps> = ({ children, ...props }) => (
  <Box
    sx={(theme) => ({
      marginBottom: '1.5rem',
      padding: '1rem',
      background: theme.palette.grey[50],
      borderRadius: '0.5rem',
      '@media (max-width: 1280px)': {
        marginBottom: '0.625rem'
      }
    })}
    {...props}
  >
    {children}
  </Box>
);

interface YearPickerTitleProps extends TypographyProps, BaseComponentProps {}

export const YearPickerTitle: React.FC<YearPickerTitleProps> = ({ children, ...props }) => (
  <Typography
    variant="h6"
    sx={(theme) => ({
      fontSize: '1rem',
      fontWeight: 500,
      color: theme.palette.text.primary,
      marginBottom: '0.75rem',
      '@media (max-width: 1280px)': {
        fontSize: '0.875rem'
      }
    })}
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
    sx={(theme) => ({
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
            background: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
            '&:hover': {
              background: theme.palette.primary.main
            }
          }
        : {
            background: 'transparent',
            color: theme.palette.text.primary,
            '&:hover': {
              background: theme.palette.action.hover
            }
          }),
      '@media (max-width: 1280px)': {
        fontSize: '0.875rem'
      }
    })}
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
      marginBottom: '0.2rem'
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
    sx={(theme) => ({
      fontSize: '0.875rem',
      fontWeight: 500,
      color: theme.palette.text.secondary,
      '@media (max-width: 1280px)': {
        fontSize: '0.75rem'
      }
    })}
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
      gap: '0.15rem',
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
      justifyContent: 'center',
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
  return (
    <Button
      sx={(theme) => {
        let buttonStyles: Record<string, unknown> = {};
        
        if (isRangeStart || isRangeEnd) {
          buttonStyles = {
            background: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
            '&:hover': {
              background: theme.palette.primary.dark
            }
          };
        } else if (isInRange) {
          buttonStyles = {
            background: theme.palette.primary.light,
            color: theme.palette.primary.main,
            '&:hover': {
              background: theme.palette.primary.light
            }
          };
        } else {
          buttonStyles = {
            background: 'transparent',
            color: theme.palette.text.primary,
            '&:hover': {
              background: theme.palette.action.hover,
              color: theme.palette.primary.main
            }
          };
        }

        return {
          width: '2.5rem',
          height: '2.5rem',
          borderRadius: '0.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '0.875rem',
          fontWeight: 500,
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          border: 'none',
          textTransform: 'none',
          minWidth: 'auto',
          ...buttonStyles,
          ...(isToday && {
            boxShadow: `0 0 0 2px ${theme.palette.primary.light}`
          }),
          '@media (max-width: 1280px)': {
            fontSize: '0.75rem',
            width: '2rem',
            height: '2rem'
          }
        };
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
    sx={(theme) => ({
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingTop: '1rem',
      borderTop: `1px solid ${theme.palette.divider}`
    })}
    {...props}
  >
    {children}
  </Box>
);

interface ClearActionButtonProps extends ButtonProps, BaseComponentProps {}

export const ClearActionButton: React.FC<ClearActionButtonProps> = ({ children, ...props }) => (
  <Button
    sx={(theme) => ({
      padding: '0.5rem 1rem',
      fontSize: '1rem',
      fontWeight: 500,
      color: theme.palette.text.secondary,
      border: 'none',
      background: 'transparent',
      borderRadius: '0.5rem',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      textTransform: 'none',
      '&:hover': {
        color: theme.palette.text.primary,
        background: theme.palette.action.hover
      },
      '@media (max-width: 1280px)': {
        fontSize: '0.75rem'
      }
    })}
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
    sx={(theme) => ({
      padding: '0.5rem 1.5rem',
      background: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
      fontSize: '1rem',
      fontWeight: 500,
      borderRadius: '0.5rem',
      border: 'none',
      cursor: 'pointer',
      transition: 'background-color 0.2s ease',
      textTransform: 'none',
      '&:hover': {
        background: disabled ? theme.palette.action.disabledBackground : theme.palette.primary.dark
      },
      '&:disabled': {
        background: theme.palette.action.disabledBackground,
        cursor: 'not-allowed',
        color: theme.palette.action.disabled
      },
      '@media (max-width: 1280px)': {
        fontSize: '0.75rem'
      }
    })}
    {...props}
  >
    {children}
  </Button>
);