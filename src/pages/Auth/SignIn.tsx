import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import defaultTheme from "../../theme";
import { useNavigate } from "react-router";
import { useFormik } from "formik";
import * as Yup from "yup";
import { authSignInActions } from "../../store/features/auth/authAction";
import {
  useAppDispatch,
  useAppSelector,
  type RootState,
} from "../../store/store";
import { FacebookCircularProgress } from "../../common/components/Progress/Progress";
import { useEffect, useState } from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import ARLOGO from "../../assets/logo/s.png";

const SignIn = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email").required("Email is required"),
      password: Yup.string()
        .required("Password is required")
        .min(8, "Password must be at least 8 characters long")
        .matches(/[0-9]/, "Password must contain at least one number")
        .matches(/[a-zA-Z]/, "Password must contain at least one letter"),
    }),
    onSubmit: (values) => {
      handleSubmit(values.email, values.password);
    },
  });

  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const authLoadingState = useAppSelector(
    (state: RootState) => state.authReducer.loading
  );

  const authState = useAppSelector(
    (state: RootState) => state.authReducer.common.isLogin
  );

  const handleSubmit = (email: string, password: string) => {
    dispatch(
      authSignInActions(email, password, () => navigate("/app/dashboard"))
    );
  };

  useEffect(() => {
    if (authState) {
      navigate("/app/dashboard");
    }
  }, [navigate, authState]);

  return (
    <Box 
      sx={{ 
        display: "flex", 
        flexDirection: { xs: "column", md: "row" },
        height: { xs: "auto", md: "100%" }, 
        minHeight: "100vh",
        width: "100%",
        backgroundColor: { xs: "#F4F9FD", md: "transparent" }
      }}
    >
      {/* Left Side - Illustration */}
      <Box
        sx={{
          width: { xs: "100%", md: "50%" },
          backgroundColor: defaultTheme.palette.primary.main,
          p: { xs: 3, sm: 4, md: 6 },
          display: { xs: "none", md: "flex" }, // Hide on mobile, show on desktop
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography 
          color="white" 
          fontWeight={"bold"} 
          variant="h3"
          sx={{
            fontSize: { md: "2.5rem", lg: "3rem" },
            textAlign: { xs: "center", md: "left" },
            mb: { xs: 2, md: 4 }
          }}
        >
          Your place to work Plan. Create. Control.
        </Typography>
        <Box
          component="img"
          src="/illustration/workspace.svg"
          alt="Workspace illustration"
          sx={{
            width: { md: "80%", lg: "70%" },
            maxWidth: "600px",
            height: "auto",
          }}
        />
      </Box>

      {/* Right Side - Sign In Form */}
      <Box
        sx={{
          width: { xs: "100%", md: "50%" },
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: { xs: "flex-start", md: "center" },
          padding: { xs: "54px 20px 20px", sm: "32px 20px", md: "40px" },
          backgroundColor: { xs: "#F4F9FD", md: "transparent" },
          boxSizing: "border-box",
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* Mobile: Logo at top */}
        {isMobile && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginBottom: "30px",
              width: "100%",
            }}
          >
            <Box
              sx={{
                width: { xs: "60px", sm: "70px" },
                paddingBottom: "6px",
              }}
            >
              <Box
                component="img"
                src={ARLOGO}
                alt="AR-13 Logo"
                sx={(theme) => ({
                  width: "100%",
                  filter: theme.palette.mode === "dark" 
                    ? "brightness(0) invert(1)" 
                    : "none",
                })}
              />
            </Box>
          </Box>
        )}

        {/* Form Card - Mobile specific styling */}
        <Box
          sx={{
            width: { xs: "100%", sm: "90%", md: "70%", lg: "50%" },
            maxWidth: { xs: "100%", sm: "400px" },
            backgroundColor: "white",
            borderRadius: { xs: "24px", md: "0px" },
            padding: { xs: "26px 20px", sm: "32px 24px", md: "0px" },
            boxShadow: { xs: "0px 6px 58px 0px rgba(196, 203, 214, 0.1)", md: "none" },
            boxSizing: "border-box",
          }}
        >
          <Typography 
            variant="h6" 
            fontWeight={"bold"}
            sx={{
              fontSize: { xs: "18px", sm: "22px", md: "28px" },
              marginBottom: { xs: "24px", sm: "28px", md: "32px" },
              textAlign: "center",
              width: "100%",
              color: "#0A1629",
            }}
          >
            Sign In to Woorkroom
          </Typography>
          <form
            style={{ 
              width: "100%", 
              display: "flex", 
              flexDirection: "column",
              maxWidth: "100%",
              boxSizing: "border-box"
            }}
            onReset={formik.handleReset}
            onSubmit={formik.handleSubmit}
          >
            <Box 
              sx={{ 
                width: "100%",
                boxSizing: "border-box",
              }}
            >
            <TextField
              fullWidth
              label="Email Address"
              placeholder="youremail@gmail.com"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              variant="outlined"
              error={Boolean(formik.errors.email?.length)}
              helperText={formik.errors.email}
              required
              sx={{
                width: "100%",
                maxWidth: "100%",
                marginBottom: { xs: "20px", sm: "24px" },
                "& .MuiOutlinedInput-root": {
                  fontSize: "14px",
                  borderRadius: "14px",
                  backgroundColor: "white",
                  boxShadow: "0px 1px 2px 0px rgba(184, 200, 224, 0.22)",
                  height: { xs: "48px", sm: "52px" },
                  "& fieldset": {
                    borderColor: "#D8E0F0",
                    borderWidth: "1px",
                  },
                  "&:hover fieldset": {
                    borderColor: "#D8E0F0",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: defaultTheme.palette.primary.main,
                    borderWidth: "1px",
                  },
                },
                "& .MuiInputLabel-root": {
                  fontSize: "14px",
                  fontWeight: 700,
                  color: "#7D8592",
                  "&.Mui-focused": {
                    color: defaultTheme.palette.primary.main,
                  },
                },
                "& .MuiOutlinedInput-input": {
                  padding: { xs: "14px 18px", sm: "16px 18px" },
                  fontSize: "14px",
                  color: "#0A1629",
                  "&::placeholder": {
                    color: "#7D8592",
                    opacity: 1,
                  },
                },
                "& .MuiFormHelperText-root": {
                  marginLeft: "6px",
                  fontSize: "12px",
                  marginTop: "4px",
                },
              }}
            />
            <TextField
              fullWidth
              label="Password"
              name="password"
              placeholder="••••••••"
              type={showPassword ? "text" : "password"}
              value={formik.values.password}
              onChange={formik.handleChange}
              variant="outlined"
              error={Boolean(formik.errors.password?.length)}
              helperText={formik.errors.password}
              required
              sx={{
                width: "100%",
                maxWidth: "100%",
                marginBottom: { xs: "20px", sm: "24px" },
                "& .MuiOutlinedInput-root": {
                  fontSize: "14px",
                  borderRadius: "14px",
                  backgroundColor: "white",
                  boxShadow: "0px 1px 2px 0px rgba(184, 200, 224, 0.22)",
                  height: { xs: "48px", sm: "52px" },
                  "& fieldset": {
                    borderColor: "#D8E0F0",
                    borderWidth: "1px",
                  },
                  "&:hover fieldset": {
                    borderColor: "#D8E0F0",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: defaultTheme.palette.primary.main,
                    borderWidth: "1px",
                  },
                },
                "& .MuiInputLabel-root": {
                  fontSize: "14px",
                  fontWeight: 700,
                  color: "#7D8592",
                  "&.Mui-focused": {
                    color: defaultTheme.palette.primary.main,
                  },
                },
                "& .MuiOutlinedInput-input": {
                  padding: { xs: "14px 18px", sm: "16px 18px" },
                  paddingRight: { xs: "50px", sm: "50px" },
                  fontSize: "14px",
                  color: "#0A1629",
                  "&::placeholder": {
                    color: "#7D8592",
                    opacity: 1,
                  },
                },
                "& .MuiFormHelperText-root": {
                  marginLeft: "6px",
                  fontSize: "12px",
                  marginTop: "4px",
                },
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      size="small"
                      sx={{ 
                        fontSize: "20px",
                        padding: "6px",
                        color: "#7D8592",
                        marginRight: "4px",
                        "&:hover": {
                          backgroundColor: "rgba(125, 133, 146, 0.08)",
                        },
                      }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button 
              sx={{
                width: "100%",
                maxWidth: "100%",
                fontSize: "16px",
                fontWeight: 700,
                padding: { xs: "12px 24px", sm: "14px 24px" },
                textTransform: "none",
                boxSizing: "border-box",
                borderRadius: "14px",
                backgroundColor: "#3F8CFF",
                boxShadow: "0px 6px 12px 0px rgba(63, 140, 255, 0.26)",
                "&:hover": {
                  backgroundColor: "#3F8CFF",
                  boxShadow: "0px 6px 12px 0px rgba(63, 140, 255, 0.4)",
                },
              }} 
              size="large" 
              variant="contained" 
              type="submit"
            >
              {authLoadingState ? (
                <FacebookCircularProgress size={isMobile ? "24px" : "28px"} />
              ) : (
                "Sign In"
              )}
            </Button>
          </Box>
        </form>
        </Box>
      </Box>
    </Box>
  );
};

export default SignIn;
