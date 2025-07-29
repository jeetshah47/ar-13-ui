import { useState } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  Grid,
  Paper,
  Alert,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  ArrowForward,
  Info,
} from "@mui/icons-material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useAuthStore } from "../../store/hooks/useAuthAction";
import { useNavigate } from "react-router";

// Custom theme to match the design
const theme = createTheme({
  palette: {
    primary: {
      main: "#4F46E5",
    },
    background: {
      default: "#F9FAFB",
    },
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: "8px",
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
          textTransform: "none",
          fontWeight: 500,
        },
      },
    },
  },
});

export default function PhoneValidationUI() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [smsCode, setSmsCode] = useState(["", "", "", ""]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [countryCode, setCountryCode] = useState("+91");

  const singup = useAuthStore((state) => state.signup);
  const navigate = useNavigate();
  const handleSmsCodeChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newCode = [...smsCode];
      newCode[index] = value;
      setSmsCode(newCode);
    }
  };

  const handleSubmit = async () => {
    try {
      singup(
        {
          email: email,
          first_name: firstName,
          last_name: lastName,
          password: password,
        },
        () => navigate("/auth/get-started")
      );
    } catch (err) {
      console.log(err);
    }
  };

  const steps = ["Valid your information"];

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: "100vh",
          backgroundColor: "background.default",
          display: "flex",
        }}
      >
        {/* Left Sidebar */}
        <Box
          sx={{
            width: 300,
            backgroundColor: "primary.main",
            color: "white",
            p: 4,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Logo */}
          <Box sx={{ display: "flex", alignItems: "center", mb: 6 }}>
            <Box
              sx={{
                width: 48,
                height: 48,
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mr: 2,
              }}
            >
              <Box
                sx={{
                  width: 24,
                  height: 24,
                  backgroundColor: "white",
                  borderRadius: 1,
                  opacity: 0.8,
                }}
              />
            </Box>
          </Box>

          <Typography variant="h5" sx={{ fontWeight: "bold", mb: 8 }}>
            Get started
          </Typography>

          {/* Custom Stepper */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {steps.map((step, index) => (
              <Box key={index} sx={{ display: "flex", alignItems: "center" }}>
                <Box
                  sx={{
                    width: 24,
                    height: 24,
                    borderRadius: "50%",
                    border: "2px solid",
                    borderColor:
                      index === 0 ? "white" : "rgba(255, 255, 255, 0.4)",
                    backgroundColor: index === 0 ? "white" : "transparent",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mr: 2,
                  }}
                >
                  {index === 0 && (
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        backgroundColor: "primary.main",
                        borderRadius: "50%",
                      }}
                    />
                  )}
                </Box>
                <Typography
                  variant="body1"
                  sx={{
                    color: index === 0 ? "white" : "rgba(255, 255, 255, 0.6)",
                    fontSize: "1rem",
                  }}
                >
                  {step}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Main Content */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            p: 4,
          }}
        >
          <Container maxWidth="sm">
            {/* Header */}
            <Box sx={{ textAlign: "right", mb: 4 }}>
              <Typography
                variant="overline"
                sx={{ color: "primary.main", fontWeight: 600 }}
              >
                STEP 1/4
              </Typography>
              <Typography
                variant="h6"
                sx={{ fontWeight: "bold", color: "text.primary", mt: 1 }}
              >
                Valid your information
              </Typography>
            </Box>

            <Paper elevation={0} sx={{ p: 0 }}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                {/* Name Fields */}
                <Grid container spacing={2}>
                  <Grid size={{ xs: 6 }}>
                    <TextField
                      fullWidth
                      label="First Name"
                      placeholder="First Name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <TextField
                      fullWidth
                      label="Last Name"
                      placeholder="Last Name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      variant="outlined"
                    />
                  </Grid>
                </Grid>

                {/* Mobile Number */}
                <Box>
                  <Typography
                    variant="body2"
                    sx={{ mb: 1, fontWeight: 500, color: "text.secondary" }}
                  >
                    Mobile Number
                  </Typography>
                  <Box sx={{ display: "flex", gap: 0 }}>
                    <FormControl sx={{ width: 100 }}>
                      <Select
                        value={countryCode}
                        onChange={(e) => setCountryCode(e.target.value)}
                        sx={{
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderTopRightRadius: 0,
                            borderBottomRightRadius: 0,
                            borderRight: "none",
                          },
                        }}
                      >
                        <MenuItem value="+91" selected>
                          +91
                        </MenuItem>
                      </Select>
                    </FormControl>
                    <TextField
                      fullWidth
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderTopLeftRadius: 0,
                          borderBottomLeftRadius: 0,
                        },
                      }}
                      slotProps={{
                        htmlInput: {
                          maxLength: 10,
                        },
                      }}
                    />
                  </Box>
                </Box>

                {/* SMS Code */}
                <Box>
                  <Typography
                    variant="body2"
                    sx={{ mb: 2, fontWeight: 500, color: "text.secondary" }}
                  >
                    Code from SMS
                  </Typography>
                  <Box sx={{ display: "flex", gap: 1.5, mb: 2 }}>
                    {smsCode.map((digit, index) => (
                      <TextField
                        key={index}
                        value={digit}
                        onChange={(e) =>
                          handleSmsCodeChange(index, e.target.value)
                        }
                        inputProps={{
                          maxLength: 1,
                          style: {
                            textAlign: "center",
                            fontSize: "1rem",
                            fontWeight: 600,
                          },
                        }}
                        sx={{
                          width: 56,
                          "& .MuiOutlinedInput-root": {
                            height: 56,
                          },
                        }}
                      />
                    ))}
                  </Box>
                  <Alert
                    icon={<Info />}
                    severity="info"
                    sx={{
                      backgroundColor: "rgba(79, 70, 229, 0.1)",
                      border: "none",
                      "& .MuiAlert-icon": {
                        color: "primary.main",
                      },
                      "& .MuiAlert-message": {
                        color: "primary.main",
                      },
                    }}
                  >
                    <Typography variant="body2">
                      SMS was sent to your number +1 345 673-56-67
                    </Typography>
                    <Typography variant="body2">
                      It will be valid for 01:25
                    </Typography>
                  </Alert>
                </Box>

                {/* Email */}
                <TextField
                  fullWidth
                  label="Email Address"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  variant="outlined"
                />

                {/* Password */}
                <TextField
                  fullWidth
                  label="Create Password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>

              {/* Next Button */}
              <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 6 }}>
                <Button
                  variant="contained"
                  size="small"
                  endIcon={<ArrowForward />}
                  onClick={handleSubmit}
                  sx={{
                    px: 4,
                    py: 1.5,
                    fontSize: "0.875rem",
                  }}
                >
                  Submit
                </Button>
              </Box>
            </Paper>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
