import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
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

const SignIn = () => {
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
    <Box sx={{ display: "flex", height: "100%", width: "100%" }}>
      <Box
        sx={{
          width: "50%",
          backgroundColor: defaultTheme.palette.primary.main,
          p: 6,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography color="white" fontWeight={"bold"} variant="h3">
          Your place to work Plan. Create. Control.
        </Typography>
        <img width={"80%"} src="/illustration/workspace.svg" />
      </Box>
      <Box
        sx={{
          width: "50%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography variant="h6" fontWeight={"bold"}>
          Sign in to woorkroom
        </Typography>
        <form
          style={{ width: "100%", display: "flex", justifyContent: "center" }}
          onReset={formik.handleReset}
          onSubmit={formik.handleSubmit}
        >
          <Box sx={{ py: 2, width: "50%" }}>
            <TextField
              fullWidth
              label="Email"
              placeholder="Email"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              variant="outlined"
              error={Boolean(formik.errors.email?.length)}
              helperText={formik.errors.email}
              required
            />
            <Box sx={{ py: 2 }} />
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
            <Box sx={{ py: 2 }} />
            <Button sx={{width: "100%"}} size="large" variant="contained" type="submit">
              {authLoadingState ? (
                <FacebookCircularProgress size={"28px"} />
              ) : (
                "Login"
              )}
            </Button>
          </Box>
        </form>
      </Box>
    </Box>
  );
};

export default SignIn;
