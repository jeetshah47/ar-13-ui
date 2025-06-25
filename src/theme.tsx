import { createTheme } from "@mui/material";

const defaultTheme = createTheme({
  palette: {
    primary: {
      main: "#3F8CFF",
    },
    secondary: {
      main: "#7D8592",
    },
  },
  typography: {
    allVariants: {
      fontFamily: '"Nunito Sans", sans-serif',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        contained: {
          backgroundColor: "#3F8CFF",
          boxShadow: "0 6px 58px rgba(63, 140, 255, 0.26)",
          "&:hover": {
            backgroundColor: "#3F8CFF",
            boxShadow: "0 6px 12px rgba(63, 140, 255, 0.4)",
          },
          "&:active": {
            backgroundColor: "#1F6DE0",
          },
          "&:focus": {
            outline: "none",
          },
          "&:focus-visible": {
            outline: "none",
          },
          fontWeight: "bold",
          borderRadius: "12px",
          fontFamily: '"Nunito Sans", sans-serif',
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: "14px",
          "& fieldset": {
            borderColor: "#D8E0F0",
          },
          "&:hover fieldset": {
            borderColor: "#D8E0F0",
          },
          "&.Mui-focused fieldset": {
            borderColor: "#D8E0F0",
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
  },
});

export default defaultTheme;
