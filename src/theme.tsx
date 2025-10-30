import { createTheme } from "@mui/material";

const defaultTheme = createTheme({
  palette: {
    primary: {
      main: "#3F8CFF",
      light: "#3A81EB",
      dark: "#1F6DE0",
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#7D8592",
      light: "#91929E",
      dark: "#0A1629",
      contrastText: "#FFFFFF",
    },
    text: {
      primary: "#0A1629",
      secondary: "#7D8592",
      disabled: "#B2B8C2",
    },
    background: {
      default: "#F4F9FD",
      paper: "#FFFFFF",
    },
    error: {
      main: "#F65160",
      light: "rgba(246, 81, 96, 0.12)",
    },
    success: {
      main: "#00D097",
      light: "#E0F9F2",
    },
    warning: {
      main: "#FFBD21",
    },
    info: {
      main: "#3F8CFF",
      light: "rgba(63, 140, 255, 0.12)",
    },
    grey: {
      50: "#F4F9FD",
      100: "#E6EDF5",
      200: "#E6EBF5",
      300: "#D8E0F0",
      400: "#D8D8D8",
      500: "#CED5E0",
      600: "#B2B8C2",
      700: "#91929E",
      800: "#7D8592",
      900: "#0A1629",
    },
  },
  typography: {
    fontFamily: '"Nunito Sans", sans-serif',
    allVariants: {
      fontFamily: '"Nunito Sans", sans-serif',
      color: "#0A1629",
    },
    h1: { 
      fontWeight: 700, 
      fontSize: 36, 
      lineHeight: 1.364,
      color: "#0A1629",
    },
    h2: { 
      fontWeight: 700, 
      fontSize: 22, 
      lineHeight: 1.364,
      color: "#0A1629",
    },
    h3: { 
      fontWeight: 700, 
      fontSize: 20, 
      lineHeight: 1.2,
      color: "#0A1629",
    },
    h4: { 
      fontWeight: 700, 
      fontSize: 18, 
      lineHeight: 1.364,
      color: "#0A1629",
    },
    h5: { 
      fontWeight: 700, 
      fontSize: 16, 
      lineHeight: 1.364,
      color: "#0A1629",
    },
    h6: { 
      fontWeight: 700, 
      fontSize: 16, 
      lineHeight: 1.5,
      color: "#0A1629",
    },
    body1: { 
      fontSize: 16, 
      lineHeight: 1.5,
      fontWeight: 400,
      color: "#0A1629",
    },
    body2: { 
      fontSize: 14, 
      lineHeight: 1.363,
      fontWeight: 400,
      color: "#0A1629",
    },
    button: {
      fontWeight: 700,
      fontSize: 16,
      lineHeight: 1.364,
      textTransform: "none",
    },
    caption: {
      fontSize: 12,
      lineHeight: 1.333,
      fontWeight: 700,
      color: "#0A1629",
    },
  },
  shape: {
    borderRadius: 14,
  },
  shadows: [
    "none",
    "0px 6px 58px 0px rgba(196, 203, 214, 0.1)",
    "0px 6px 58px 0px rgba(196, 203, 214, 0.4)",
    "0px 1px 2px 0px rgba(184, 200, 224, 0.22)",
    "0px 6px 12px 0px rgba(63, 140, 255, 0.26)",
    "0px 6px 12px 0px rgba(63, 140, 255, 0.42)",
    "0px 6px 58px 0px rgba(121, 145, 173, 0.2)",
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
  ] as const,
  components: {
    MuiButton: {
      styleOverrides: {
        contained: {
          backgroundColor: "#3F8CFF",
          boxShadow: "0px 6px 12px 0px rgba(63, 140, 255, 0.26)",
          color: "#FFFFFF",
          "&:hover": {
            backgroundColor: "#3A81EB",
            boxShadow: "0px 6px 12px 0px rgba(63, 140, 255, 0.42)",
          },
          "&:active": {
            backgroundColor: "#1F6DE0",
          },
          "&:disabled": {
            backgroundColor: "#CED5E0",
            color: "#FFFFFF",
            boxShadow: "none",
          },
          "&:focus": {
            outline: "none",
          },
          "&:focus-visible": {
            outline: "none",
          },
          fontWeight: 700,
          borderRadius: "14px",
          fontFamily: '"Nunito Sans", sans-serif',
          fontSize: "16px",
          lineHeight: 1.364,
        },
        root: {
          textTransform: "none",
          borderRadius: "14px",
          padding: "13px 20px",
          fontFamily: '"Nunito Sans", sans-serif',
        },
        text: {
          color: "#3F8CFF",
          "&:hover": {
            backgroundColor: "transparent",
            textDecoration: "underline",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: "24px",
          boxShadow: "0px 6px 58px 0px rgba(196, 203, 214, 0.1)",
          backgroundColor: "#FFFFFF",
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: "14px",
          backgroundColor: "#FFFFFF",
          "& fieldset": {
            borderColor: "#D8E0F0",
            borderWidth: "1px",
          },
          "&:hover fieldset": {
            borderColor: "#D8E0F0",
          },
          "&.Mui-focused": {
            backgroundColor: "rgba(63, 140, 255, 0.118625)",
            "& fieldset": {
              borderColor: "#3F8CFF",
              borderWidth: "1px",
            },
          },
          "&.Mui-error": {
            "& fieldset": {
              borderColor: "#F65160",
            },
          },
          "&.Mui-disabled": {
            backgroundColor: "#F4F9FD",
            "& fieldset": {
              borderColor: "#CED5E0",
            },
          },
        },
        input: {
          fontSize: "14px",
          lineHeight: 1.714,
          color: "#0A1629",
          "&::placeholder": {
            color: "#7D8592",
            opacity: 1,
            fontSize: "14px",
          },
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          boxSizing: "border-box",
          borderRadius: "14px",
        },
        input: {
          "&::placeholder": {
            color: "#7D8592",
            opacity: 1,
            fontSize: "14px",
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontSize: "14px",
          fontWeight: 700,
          lineHeight: 1.714,
          color: "#7D8592",
          "&.Mui-focused": {
            color: "#7D8592",
          },
          "&.Mui-error": {
            color: "#F65160",
          },
        },
      },
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          fontSize: "12px",
          fontWeight: 600,
          lineHeight: 1.5,
          color: "#F65160",
          marginTop: "4px",
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          color: "#0A1629",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: "16px",
          backgroundColor: "#F4F9FD",
          color: "#0A1629",
          fontSize: "14px",
          fontWeight: 400,
          height: "32px",
        },
      },
    },
    MuiToggleButton: {
      styleOverrides: {
        root: {
          borderRadius: "20px",
          border: "none",
          backgroundColor: "transparent",
          color: "#0A1629",
          fontSize: "16px",
          fontWeight: 400,
          lineHeight: 1.364,
          padding: "9px 16px",
          "&.Mui-selected": {
            backgroundColor: "#3F8CFF",
            color: "#FFFFFF",
            fontWeight: 700,
            "&:hover": {
              backgroundColor: "#3F8CFF",
            },
          },
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: "#0A1629",
          "&.Mui-checked": {
            color: "#3F8CFF",
          },
        },
      },
    },
    MuiRadio: {
      styleOverrides: {
        root: {
          color: "#0A1629",
          "&.Mui-checked": {
            color: "#3F8CFF",
          },
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        switchBase: {
          "&.Mui-checked": {
            color: "#3F8CFF",
          },
        },
      },
    },
  },
});

export default defaultTheme;
