import { createTheme } from "@mui/material";
import type { Theme } from "@mui/material";

type ThemeMode = 'light' | 'dark';

const createAppTheme = (mode: ThemeMode): Theme => {
  const isDark = mode === 'dark';

  return createTheme({
    palette: {
      mode,
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
        primary: isDark ? "#E6EDF5" : "#0A1629",
        secondary: isDark ? "#B2B8C2" : "#7D8592",
        disabled: "#B2B8C2",
      },
      background: {
        default: isDark ? "#0A1629" : "#F4F9FD",
        paper: isDark ? "#1A2332" : "#FFFFFF",
      },
      divider: isDark ? "#3A4555" : "#E4E6E8",
      error: {
        main: "#F65160",
        light: isDark ? "rgba(246, 81, 96, 0.2)" : "rgba(246, 81, 96, 0.12)",
      },
      success: {
        main: "#00D097",
        light: isDark ? "rgba(0, 208, 151, 0.2)" : "#E0F9F2",
      },
      warning: {
        main: "#FFBD21",
      },
      info: {
        main: "#3F8CFF",
        light: isDark ? "rgba(63, 140, 255, 0.2)" : "rgba(63, 140, 255, 0.12)",
      },
      grey: {
        50: isDark ? "#1A2332" : "#F4F9FD",
        100: isDark ? "#252F3F" : "#E6EDF5",
        200: isDark ? "#2E3A4A" : "#E6EBF5",
        300: isDark ? "#3A4555" : "#D8E0F0",
        400: "#D8D8D8",
        500: isDark ? "#4A5565" : "#CED5E0",
        600: "#B2B8C2",
        700: "#91929E",
        800: "#7D8592",
        900: isDark ? "#E6EDF5" : "#0A1629",
      },
    },
    typography: {
      fontFamily: '"Nunito Sans", sans-serif',
      allVariants: {
        fontFamily: '"Nunito Sans", sans-serif',
        color: isDark ? "#E6EDF5" : "#0A1629",
      },
      h1: { 
        fontWeight: 700, 
        fontSize: 36, 
        lineHeight: 1.364,
        color: isDark ? "#E6EDF5" : "#0A1629",
      },
      h2: { 
        fontWeight: 700, 
        fontSize: 22, 
        lineHeight: 1.364,
        color: isDark ? "#E6EDF5" : "#0A1629",
      },
      h3: { 
        fontWeight: 700, 
        fontSize: 20, 
        lineHeight: 1.2,
        color: isDark ? "#E6EDF5" : "#0A1629",
      },
      h4: { 
        fontWeight: 700, 
        fontSize: 18, 
        lineHeight: 1.364,
        color: isDark ? "#E6EDF5" : "#0A1629",
      },
      h5: { 
        fontWeight: 700, 
        fontSize: 16, 
        lineHeight: 1.364,
        color: isDark ? "#E6EDF5" : "#0A1629",
      },
      h6: { 
        fontWeight: 700, 
        fontSize: 16, 
        lineHeight: 1.5,
        color: isDark ? "#E6EDF5" : "#0A1629",
      },
      body1: { 
        fontSize: 16, 
        lineHeight: 1.5,
        fontWeight: 400,
        color: isDark ? "#E6EDF5" : "#0A1629",
      },
      body2: { 
        fontSize: 14, 
        lineHeight: 1.363,
        fontWeight: 400,
        color: isDark ? "#B2B8C2" : "#0A1629",
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
        color: isDark ? "#B2B8C2" : "#0A1629",
      },
    },
    shape: {
      borderRadius: 14,
    },
    shadows: [
      "none",
      isDark ? "0px 6px 58px 0px rgba(0, 0, 0, 0.3)" : "0px 6px 58px 0px rgba(196, 203, 214, 0.1)",
      isDark ? "0px 6px 58px 0px rgba(0, 0, 0, 0.5)" : "0px 6px 58px 0px rgba(196, 203, 214, 0.4)",
      isDark ? "0px 1px 2px 0px rgba(0, 0, 0, 0.3)" : "0px 1px 2px 0px rgba(184, 200, 224, 0.22)",
      "0px 6px 12px 0px rgba(63, 140, 255, 0.26)",
      "0px 6px 12px 0px rgba(63, 140, 255, 0.42)",
      isDark ? "0px 6px 58px 0px rgba(0, 0, 0, 0.4)" : "0px 6px 58px 0px rgba(121, 145, 173, 0.2)",
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
              backgroundColor: isDark ? "#4A5565" : "#CED5E0",
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
            boxShadow: isDark ? "0px 6px 58px 0px rgba(0, 0, 0, 0.3)" : "0px 6px 58px 0px rgba(196, 203, 214, 0.1)",
            backgroundColor: isDark ? "#1A2332" : "#FFFFFF",
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: "14px",
            backgroundColor: isDark ? "#252F3F" : "#FFFFFF",
            "& fieldset": {
              borderColor: isDark ? "#3A4555" : "#D8E0F0",
              borderWidth: "1px",
            },
            "&:hover fieldset": {
              borderColor: isDark ? "#4A5565" : "#D8E0F0",
            },
            "&.Mui-focused": {
              backgroundColor: isDark ? "rgba(63, 140, 255, 0.15)" : "rgba(63, 140, 255, 0.118625)",
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
              backgroundColor: isDark ? "#1A2332" : "#F4F9FD",
              "& fieldset": {
                borderColor: isDark ? "#3A4555" : "#CED5E0",
              },
            },
          },
          input: {
            fontSize: "14px",
            lineHeight: 1.714,
            color: isDark ? "#E6EDF5" : "#0A1629",
            "&::placeholder": {
              color: isDark ? "#7D8592" : "#7D8592",
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
            color: isDark ? "#E6EDF5" : "#0A1629",
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: "16px",
            backgroundColor: isDark ? "#252F3F" : "#F4F9FD",
            color: isDark ? "#E6EDF5" : "#0A1629",
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
            color: isDark ? "#E6EDF5" : "#0A1629",
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
            color: isDark ? "#B2B8C2" : "#0A1629",
            "&.Mui-checked": {
              color: "#3F8CFF",
            },
          },
        },
      },
      MuiRadio: {
        styleOverrides: {
          root: {
            color: isDark ? "#B2B8C2" : "#0A1629",
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
};

// Export light theme as default for backward compatibility
const defaultTheme = createAppTheme('light');

export default defaultTheme;
export { createAppTheme };
