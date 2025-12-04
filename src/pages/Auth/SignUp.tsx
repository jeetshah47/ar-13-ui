import { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  Grid,
  Paper,
} from "@mui/material";
import { Visibility, VisibilityOff, ArrowForward } from "@mui/icons-material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useNavigate, useSearchParams } from "react-router";
import { useFormik } from "formik";
import * as Yup from "yup";
import { authSignUpActions, validateSignupTokenAction } from "../../store/features/auth/authAction";
import { useAppDispatch, useAppSelector } from "../../store/store";

type UserData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: string;
};

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
  const [showPassword, setShowPassword] = useState(false);
  const loading = useAppSelector((s) => s.authReducer.loading);
  const { isValidating, isValid, error: validationError, reason, email: tokenEmail } = useAppSelector(
    (s) => s.authReducer.tokenValidation
  );
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      phoneNumber: "",
    },
    validationSchema: Yup.object({
      firstName: Yup.string()
        .required("First name is required")
        .min(2, "First name must be at least 2 characters"),
      lastName: Yup.string()
        .required("Last name is required")
        .min(2, "Last name must be at least 2 characters"),
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      password: Yup.string()
        .required("Password is required")
        .min(8, "Password must be at least 8 characters long")
        .matches(/[0-9]/, "Password must contain at least one number")
        .matches(/[a-zA-Z]/, "Password must contain at least one letter"),
      phoneNumber: Yup.string()
        .matches(/^\+?[\d\s-()]+$/, "Invalid phone number format")
        .optional(),
    }),
    onSubmit: (values) => {
      handleSubmit(values);
    },
  });
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      dispatch(validateSignupTokenAction(token));
    }
  }, [token, dispatch]);

  // Pre-fill email when token is validated
  useEffect(() => {
    if (isValid && tokenEmail && !formik.values.email) {
      formik.setFieldValue("email", tokenEmail);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isValid, tokenEmail]);

  // Handle missing token - redirect to login after showing error
  useEffect(() => {
    if (!token) {
      const redirectTimer = setTimeout(() => {
        navigate("/auth/login");
      }, 3000); // Redirect after 3 seconds

      return () => clearTimeout(redirectTimer);
    }
  }, [token, navigate]);

  const handleSubmit = async (values: UserData) => {
    dispatch(
      authSignUpActions(
        {
          name:
            values.firstName && values.lastName
              ? `${values.firstName} ${values.lastName}`
              : "",
          email: values.email,
          password: values.password,
          role: "Standard",
          phoneNumber: values.phoneNumber,
        },
        token || undefined,
        () => navigate("/auth/login")
      )
    );
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
              {!token && (
                <Box
                  sx={{
                    textAlign: "center",
                    py: 6,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 3,
                  }}
                >
                  <Box sx={{ maxWidth: "400px" }}>
                    <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }} color="error">
                      Missing Signup Token
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      No signup token was provided. Please use a valid invitation link to sign up.
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Redirecting to login page in a few seconds...
                    </Typography>
                  </Box>
                </Box>
              )}
              {token && isValidating && (
                <Box sx={{ textAlign: "center", py: 4 }}>
                  <Typography>Validating token...</Typography>
                </Box>
              )}
              {token && !isValidating && isValid === false && reason === "Invitation already used" && (
                <Box
                  sx={{
                    textAlign: "center",
                    py: 6,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 3,
                  }}
                >
                  <Box
                    sx={{
                      width: "200px",
                      height: "200px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <img
                      src="/illustration/invite.svg"
                      alt="Invitation already used"
                      style={{ width: "100%", height: "100%", objectFit: "contain" }}
                    />
                  </Box>
                  <Box sx={{ maxWidth: "400px" }}>
                    <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                      Invitation Already Used
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      This invitation link has already been used. If you need to sign up, please
                      contact your administrator for a new invitation.
                    </Typography>
                  </Box>
                </Box>
              )}
              {token && !isValidating && isValid === false && reason !== "Invitation already used" && (
                <Box sx={{ textAlign: "center", py: 4 }}>
                  <Typography color="error">
                    {validationError || "Invalid or expired token. Please use a valid signup link."}
                  </Typography>
                </Box>
              )}
              {token && !isValidating && isValid === true && (
                <form onSubmit={formik.handleSubmit}>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                  {/* Name Fields */}
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 6 }}>
                      <TextField
                        fullWidth
                        label="First Name"
                        placeholder="First Name"
                        name="firstName"
                        value={formik.values.firstName}
                        required
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={Boolean(formik.touched.firstName && formik.errors.firstName)}
                        helperText={formik.touched.firstName && formik.errors.firstName}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                      <TextField
                        fullWidth
                        label="Last Name"
                        name="lastName"
                        placeholder="Last Name"
                        required
                        value={formik.values.lastName}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={Boolean(formik.touched.lastName && formik.errors.lastName)}
                        helperText={formik.touched.lastName && formik.errors.lastName}
                        variant="outlined"
                      />
                    </Grid>
                  </Grid>

                  {/* <Box>
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
                </Box> */}

                  {/* Email */}
                  <TextField
                    fullWidth
                    label="Email Address"
                    type="email"
                    name="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={Boolean(formik.touched.email && formik.errors.email)}
                    helperText={formik.touched.email && formik.errors.email}
                    variant="outlined"
                    required
                    disabled={isValid && Boolean(tokenEmail)}
                  />

                {/* Phone Number */}
                <TextField
                  fullWidth
                  label="Phone Number"
                  name="phoneNumber"
                  placeholder="e.g. +1 555 123 4567"
                  value={formik.values.phoneNumber}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={Boolean(formik.touched.phoneNumber && formik.errors.phoneNumber)}
                  helperText={formik.touched.phoneNumber && formik.errors.phoneNumber}
                  variant="outlined"
                />

                  {/* Password */}
                  <TextField
                    fullWidth
                    label="Create Password"
                    type={showPassword ? "text" : "password"}
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    name={"password"}
                    placeholder="••••••••"
                    required
                    error={Boolean(formik.touched.password && formik.errors.password)}
                    helperText={formik.touched.password && formik.errors.password}
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
                <Box
                  sx={{ display: "flex", justifyContent: "flex-end", mt: 6 }}
                >
                  <Button
                    variant="contained"
                    size="small"
                    type="submit"
                  disabled={loading || !formik.isValid}
                  endIcon={!loading ? <ArrowForward /> : undefined}
                    sx={{
                      px: 4,
                      py: 1.5,
                      fontSize: "0.875rem",
                    }}
                  >
                  {loading ? "Submitting..." : "Submit"}
                  </Button>
                </Box>
              </form>
              )}
            </Paper>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
