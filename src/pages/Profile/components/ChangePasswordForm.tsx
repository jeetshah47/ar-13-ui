import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
  Alert,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useAppSelector } from "../../../store/store";
import { changePassword } from "../../../store/apis/userApis";
import toast from "react-hot-toast";
import type { ChangePasswordRequest } from "../../../store/apis/userApis";

type ChangePasswordFormProps = {
  forceChange?: boolean;
  onSuccess?: () => void;
};

const ChangePasswordForm = ({
  forceChange = false,
  onSuccess,
}: ChangePasswordFormProps) => {
  const [loading, setLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const uid = useAppSelector((s) => s.authReducer.api.uid);

  const formik = useFormik({
    initialValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      currentPassword: forceChange
        ? Yup.string()
        : Yup.string().required("Current password is required"),
      newPassword: Yup.string()
        .required("New password is required")
        .min(8, "Password must be at least 8 characters long")
        .matches(/[0-9]/, "Password must contain at least one number")
        .matches(/[a-zA-Z]/, "Password must contain at least one letter"),
      confirmPassword: Yup.string()
        .required("Please confirm your password")
        .oneOf([Yup.ref("newPassword")], "Passwords must match"),
    }),
    onSubmit: async (values) => {
      if (!uid) {
        toast.error("User ID not found");
        return;
      }

      setLoading(true);
      try {
        const request: ChangePasswordRequest = {
          userId: uid,
          currentPassword: forceChange ? undefined : values.currentPassword,
          newPassword: values.newPassword,
          forceChange: forceChange,
        };

        await changePassword(request);
        toast.success("Password changed successfully!");
        formik.resetForm();
        if (onSuccess) {
          onSuccess();
        }
      } catch (error: any) {
        const errorMessage =
          error?.response?.data?.error ||
          error?.response?.data?.message ||
          error?.message ||
          "Failed to change password";
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <Box sx={{ width: "100%" }}>
      {forceChange && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          <Typography variant="body2" fontWeight="bold">
            Password Change Required
          </Typography>
          <Typography variant="body2">
            You must change your password before continuing. Please set a new
            password below.
          </Typography>
        </Alert>
      )}

      <form onSubmit={formik.handleSubmit}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {/* Current Password - only show if not force change */}
          {!forceChange && (
            <TextField
              fullWidth
              label="Current Password"
              type={showCurrentPassword ? "text" : "password"}
              name="currentPassword"
              value={formik.values.currentPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={Boolean(
                formik.touched.currentPassword && formik.errors.currentPassword
              )}
              helperText={
                formik.touched.currentPassword && formik.errors.currentPassword
              }
              variant="outlined"
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      edge="end"
                    >
                      {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          )}

          {/* New Password */}
          <TextField
            fullWidth
            label="New Password"
            type={showNewPassword ? "text" : "password"}
            name="newPassword"
            value={formik.values.newPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={Boolean(
              formik.touched.newPassword && formik.errors.newPassword
            )}
            helperText={formik.touched.newPassword && formik.errors.newPassword}
            variant="outlined"
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    edge="end"
                  >
                    {showNewPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {/* Confirm Password */}
          <TextField
            fullWidth
            label="Confirm New Password"
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            value={formik.values.confirmPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={Boolean(
              formik.touched.confirmPassword && formik.errors.confirmPassword
            )}
            helperText={
              formik.touched.confirmPassword && formik.errors.confirmPassword
            }
            variant="outlined"
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    edge="end"
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {/* Submit Button */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 4 }}>
          <Button
            variant="contained"
            type="submit"
            disabled={loading || !formik.isValid}
            sx={{
              px: 4,
              py: 1.5,
            }}
          >
            {loading ? "Changing..." : "Change Password"}
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default ChangePasswordForm;

