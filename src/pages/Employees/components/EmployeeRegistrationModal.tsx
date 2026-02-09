import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  IconButton,
  Paper,
} from "@mui/material";
import { Visibility, VisibilityOff, ContentCopy, Check } from "@mui/icons-material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { createEmployee } from "../../../store/apis/userApis";
import toast from "react-hot-toast";
import type { CreateEmployeeRequest } from "../../../store/apis/userApis";

type EmployeeRegistrationModalProps = {
  onClose: () => void;
  onSuccess?: () => void;
};

const EmployeeRegistrationModal = ({
  onClose,
  onSuccess,
}: EmployeeRegistrationModalProps) => {
  const [loading, setLoading] = useState(false);
  const [showTempPassword, setShowTempPassword] = useState(false);
  const [tempPassword, setTempPassword] = useState("");
  const [passwordCopied, setPasswordCopied] = useState(false);

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      role: "Standard" as "Admin" | "Standard",
      designation: "",
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
      phoneNumber: Yup.string()
        .matches(/^\+?[\d\s-()]+$/, "Invalid phone number format")
        .optional(),
      role: Yup.string()
        .oneOf(["Admin", "Standard"], "Role must be Admin or Standard")
        .required("Role is required"),
      designation: Yup.string().optional(),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const request: CreateEmployeeRequest = {
          name: `${values.firstName} ${values.lastName}`,
          email: values.email,
          phoneNumber: values.phoneNumber || undefined,
          role: values.role,
          designation: values.designation || undefined,
        };

        const response = await createEmployee(request);
        setTempPassword(response.tempPassword);
        // Store temp password in localStorage for later display on profile page
        if (response.tempPassword && response.user.id) {
          localStorage.setItem(`tempPassword_${response.user.id}`, response.tempPassword);
        }
        toast.success("Employee created successfully!");
        if (onSuccess) {
          onSuccess();
        }
      } catch (error: any) {
        const errorMessage =
          error?.response?.data?.error ||
          error?.response?.data?.message ||
          error?.message ||
          "Failed to create employee";
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
  });

  const handleCopyPassword = async () => {
    try {
      await navigator.clipboard.writeText(tempPassword);
      setPasswordCopied(true);
      toast.success("Password copied to clipboard!");
      setTimeout(() => setPasswordCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy password");
    }
  };

  // If temp password is shown, display success message
  if (tempPassword) {
    return (
      <Paper
        elevation={0}
        sx={{
          p: 4,
          borderRadius: "24px",
          maxWidth: "600px",
          width: "100%",
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
          Employee Created Successfully
        </Typography>
        <Alert severity="success" sx={{ mb: 3 }}>
          The employee has been created with a temporary password. Please share
          this password with them securely.
        </Alert>
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="body2"
            sx={{ mb: 1, fontWeight: 500, color: "text.secondary" }}
          >
            Temporary Password:
          </Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              p: 2,
              backgroundColor: "grey.50",
              borderRadius: "8px",
            }}
          >
            <Typography
              variant="body1"
              sx={{
                fontFamily: "monospace",
                flex: 1,
                letterSpacing: 1,
              }}
            >
              {showTempPassword ? tempPassword : "••••••••••"}
            </Typography>
            <IconButton
              onClick={() => setShowTempPassword(!showTempPassword)}
              size="small"
            >
              {showTempPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
            <IconButton onClick={handleCopyPassword} size="small" color="primary">
              {passwordCopied ? <Check /> : <ContentCopy />}
            </IconButton>
          </Box>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
          <Button variant="outlined" onClick={onClose}>
            Close
          </Button>
        </Box>
      </Paper>
    );
  }

  return (
    <Paper
      elevation={0}
      sx={{
        p: 4,
        borderRadius: "24px",
        maxWidth: "600px",
        width: "100%",
        maxHeight: "90vh",
        overflow: "auto",
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: "bold", mb: 4 }}>
        Add New Employee
      </Typography>

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
                error={Boolean(
                  formik.touched.firstName && formik.errors.firstName
                )}
                helperText={
                  formik.touched.firstName && formik.errors.firstName
                }
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
                error={Boolean(
                  formik.touched.lastName && formik.errors.lastName
                )}
                helperText={formik.touched.lastName && formik.errors.lastName}
                variant="outlined"
              />
            </Grid>
          </Grid>

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
            error={Boolean(
              formik.touched.phoneNumber && formik.errors.phoneNumber
            )}
            helperText={
              formik.touched.phoneNumber && formik.errors.phoneNumber
            }
            variant="outlined"
          />

          {/* Role */}
          <FormControl fullWidth required>
            <InputLabel>Role</InputLabel>
            <Select
              name="role"
              value={formik.values.role}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              label="Role"
              error={Boolean(formik.touched.role && formik.errors.role)}
            >
              <MenuItem value="Standard">Standard</MenuItem>
              <MenuItem value="Admin">Admin</MenuItem>
            </Select>
            {formik.touched.role && formik.errors.role && (
              <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.75 }}>
                {formik.errors.role}
              </Typography>
            )}
          </FormControl>

          {/* Designation */}
          <TextField
            fullWidth
            label="Designation"
            name="designation"
            placeholder="e.g. Software Engineer"
            value={formik.values.designation}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            variant="outlined"
          />
        </Box>

        {/* Submit Button */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 4 }}>
          <Button variant="outlined" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            variant="contained"
            type="submit"
            disabled={loading || !formik.isValid}
            sx={{
              px: 4,
              py: 1.5,
            }}
          >
            {loading ? "Creating..." : "Create Employee"}
          </Button>
        </Box>
      </form>
    </Paper>
  );
};

export default EmployeeRegistrationModal;

