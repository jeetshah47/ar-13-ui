import {
  Box,
  Button,
  TextField,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  OutlinedInput,
  Chip,
  Stepper,
  Step,
  StepLabel,
  useMediaQuery,
  useTheme,
  Paper,
} from "@mui/material";
import PageHeader from "../../../common/components/PageHeader/PageHeader";
import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { useFormik } from "formik";
import * as Yup from "yup";
import { addProjectAction } from "../../../store/features/projects/projectAction";
import type { AppDispatch, RootState } from "../../../store/store";
import { getUsersAction } from "../../../store/features/user/userAction";
import type { SelectChangeEvent } from "@mui/material";
import { useErrorHandler } from "../../../hooks/useErrorHandler";

const steps = ["Basic Details", "Team Members"];

// Validation schema for step 1
const step1ValidationSchema = Yup.object({
  title: Yup.string()
    .trim()
    .required("Project name is required")
    .min(1, "Project name cannot be empty"),
  productionDuration: Yup.number()
    .typeError("Production duration must be a number")
    .required("Production duration is required")
    .positive("Production duration must be a positive number")
    .integer("Production duration must be a whole number")
    .min(1, "Production duration must be at least 1 week"),
  siteDuration: Yup.number()
    .typeError("Site duration must be a number")
    .required("Site duration is required")
    .positive("Site duration must be a positive number")
    .integer("Site duration must be a whole number")
    .min(1, "Site duration must be at least 1 month"),
  description: Yup.string(),
  code: Yup.string(),
});

const AddProject = () => {
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("lg"));
  
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { users } = useSelector((state: RootState) => state.userReducer);
  const [activeStep, setActiveStep] = useState(0);
  const [productionDurationMode, setProductionDurationMode] = useState<"select" | "custom">("select");
  const [siteDurationMode, setSiteDurationMode] = useState<"select" | "custom">("select");
  const { handleFormError } = useErrorHandler();

  useEffect(() => {
    dispatch(getUsersAction());
  }, [dispatch]);

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      productionDuration: 1,
      siteDuration: 3,
      membersIds: [] as string[],
      ownerId: localStorage.getItem("uid") ?? "",
      code: "",
    },
    validationSchema: step1ValidationSchema,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: (values, { setFieldError }) => {
      const submitValues = {
        ...values,
        code: projectCode,
      };
      // Note: addProjectAction handles errors internally and shows toast
      // If backend returns field-specific errors, they would need to be handled here
      dispatch(
        addProjectAction(submitValues, () => {
          navigate("/app/projects");
        })
      );
    },
  });

  const handleNext = async () => {
    if (activeStep === 0) {
      // Validate step 1 fields
      const errors = await formik.validateForm();
      if (Object.keys(errors).length === 0) {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
      }
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSubmit = async () => {
    // Validate all fields before submitting
    const errors = await formik.validateForm();
    if (Object.keys(errors).length > 0) {
      // If validation fails, go back to step 1 to show errors
      setActiveStep(0);
      return;
    }
    
    formik.handleSubmit();
  };


  // Generate project code: YYMM-project_title
  const projectCode = useMemo(() => {
    if (!formik.values.title.trim()) return "";
    const now = new Date();
    const year = now.getFullYear().toString().slice(-2);
    const month = (now.getMonth() + 1).toString().padStart(2, "0");
    const titleSlug = formik.values.title
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    return `${year}${month}-${titleSlug}`;
  }, [formik.values.title]);

  // Calculate production dates
  const productionDates = useMemo(() => {
    if (!formik.values.productionDuration || formik.values.productionDuration <= 0) {
      return { startDate: "", endDate: "" };
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startDate = today.toISOString();
    const endDate = new Date(today);
    endDate.setDate(endDate.getDate() + formik.values.productionDuration * 7);
    return {
      startDate,
      endDate: endDate.toISOString(),
    };
  }, [formik.values.productionDuration]);

  // Calculate site dates
  const siteDates = useMemo(() => {
    if (!formik.values.siteDuration || formik.values.siteDuration <= 0) {
      return { startDate: "", endDate: "" };
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startDate = today.toISOString();
    const endDate = new Date(today);
    endDate.setMonth(endDate.getMonth() + formik.values.siteDuration);
    return {
      startDate,
      endDate: endDate.toISOString(),
    };
  }, [formik.values.siteDuration]);

  const handleMembersChange = (event: SelectChangeEvent<string[]>) => {
    formik.setFieldValue("membersIds", event.target.value);
  };

  const handleProductionDurationChange = (event: SelectChangeEvent<string>) => {
    const value = event.target.value;
    if (value === "custom") {
      setProductionDurationMode("custom");
      // Keep current value - don't change it when switching to custom mode
    } else {
      setProductionDurationMode("select");
      const numValue = parseInt(value, 10);
      if (!isNaN(numValue)) {
        formik.setFieldValue("productionDuration", numValue, true);
      }
    }
  };

  const handleSiteDurationChange = (event: SelectChangeEvent<string>) => {
    const value = event.target.value;
    if (value === "custom") {
      setSiteDurationMode("custom");
      // Keep current value - don't change it when switching to custom mode
    } else {
      setSiteDurationMode("select");
      const numValue = parseInt(value, 10);
      if (!isNaN(numValue)) {
        formik.setFieldValue("siteDuration", numValue, true);
      }
    }
  };
  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box
            sx={{
              display: "flex",
              alignItems: "flex-start",
              gap: { xs: "16px", sm: "20px", md: "20px", lg: "24px" },
              width: "100%",
              flexDirection: { xs: "column", sm: "column", md: "row", lg: "row" },
            }}
          >
            <Box sx={{ width: { xs: "100%", sm: "100%", md: "50%", lg: "50%" }, padding: { xs: "8px 12px", sm: "10px 14px", md: "12px 16px", lg: "12px 16px" } }}>
              <Box sx={{ width: "100%", paddingTop: "16px" }}>
                <Typography color="secondary" sx={{ fontWeight: "bold", mb: 1 }}>
                  Project Name
                </Typography>
                <TextField
                  sx={{ width: "100%" }}
                  placeholder="Enter Project Name"
                  name="title"
                  value={formik.values.title}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={Boolean(formik.touched.title && formik.errors.title)}
                  helperText={formik.touched.title && formik.errors.title}
                  required
                />
              </Box>
              <Box sx={{ width: "100%", paddingTop: "16px" }}>
                <Typography color="secondary" sx={{ fontWeight: "bold", mb: 1 }}>
                  Project Code
                </Typography>
                <TextField
                  sx={{ width: "100%" }}
                  placeholder="Project code will be auto-generated"
                  name="code"
                  value={projectCode}
                  disabled
                  helperText="Auto-generated from project name and current date"
                />
              </Box>
              <Box sx={{ width: "100%", paddingTop: "16px" }}>
                <Typography color="secondary" sx={{ fontWeight: "bold" }}>
                  Production Duration <span style={{ color: "red" }}>*</span>
                </Typography>
                {productionDurationMode === "select" && typeof formik.values.productionDuration === "number" && [1, 2, 3].includes(formik.values.productionDuration) ? (
                  <FormControl 
                    sx={{ width: "100%" }}
                    error={Boolean(formik.touched.productionDuration && formik.errors.productionDuration)}
                  >
                    <Select
                      value={formik.values.productionDuration.toString()}
                      onChange={handleProductionDurationChange}
                      onBlur={formik.handleBlur}
                      name="productionDuration"
                      displayEmpty
                      input={<OutlinedInput />}
                    >
                      <MenuItem value="1">1 week</MenuItem>
                      <MenuItem value="2">2 weeks</MenuItem>
                      <MenuItem value="3">3 weeks</MenuItem>
                      <MenuItem value="custom">Custom</MenuItem>
                    </Select>
                    {formik.touched.productionDuration && formik.errors.productionDuration && (
                      <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.75 }}>
                        {String(formik.errors.productionDuration)}
                      </Typography>
                    )}
                  </FormControl>
                ) : (
                  <Box sx={{ display: "flex", gap: 1, alignItems: "flex-start" }}>
                    <TextField
                      sx={{ flex: 1 }}
                      type="number"
                      name="productionDuration"
                      value={formik.values.productionDuration || ""}
                      onChange={(e) => {
                        const inputValue = e.target.value;
                        if (inputValue === "") {
                          formik.setFieldValue("productionDuration", "", false);
                        } else {
                          const numValue = parseInt(inputValue, 10);
                          if (!isNaN(numValue) && numValue > 0) {
                            formik.setFieldValue("productionDuration", numValue, true);
                          }
                        }
                      }}
                      onBlur={formik.handleBlur}
                      error={Boolean(formik.touched.productionDuration && formik.errors.productionDuration)}
                      helperText={(formik.touched.productionDuration && formik.errors.productionDuration ? String(formik.errors.productionDuration) : "Enter number of weeks")}
                      required
                      inputProps={{ min: 1, step: 1 }}
                      placeholder="Weeks"
                    />
                    <Button
                      sx={{ mt: 1 }}
                      size="small"
                      onClick={() => {
                        setProductionDurationMode("select");
                        const currentValue = formik.values.productionDuration;
                        if (![1, 2, 3].includes(currentValue)) {
                          formik.setFieldValue("productionDuration", 1, true);
                        }
                      }}
                    >
                      Cancel
                    </Button>
                  </Box>
                )}
              </Box>
              <Box sx={{ width: "100%", paddingTop: "16px" }}>
                <Typography color="secondary" sx={{ fontWeight: "bold" }}>
                  Site Duration <span style={{ color: "red" }}>*</span>
                </Typography>
                {siteDurationMode === "select" && typeof formik.values.siteDuration === "number" && [3, 6, 12].includes(formik.values.siteDuration) ? (
                  <FormControl 
                    sx={{ width: "100%" }}
                    error={Boolean(formik.touched.siteDuration && formik.errors.siteDuration)}
                  >
                    <Select
                      value={formik.values.siteDuration.toString()}
                      onChange={handleSiteDurationChange}
                      onBlur={formik.handleBlur}
                      name="siteDuration"
                      displayEmpty
                      input={<OutlinedInput />}
                    >
                      <MenuItem value="3">3 months</MenuItem>
                      <MenuItem value="6">6 months</MenuItem>
                      <MenuItem value="12">12 months</MenuItem>
                      <MenuItem value="custom">Custom</MenuItem>
                    </Select>
                    {formik.touched.siteDuration && formik.errors.siteDuration && (
                      <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.75 }}>
                        {String(formik.errors.siteDuration)}
                      </Typography>
                    )}
                  </FormControl>
                ) : (
                  <Box sx={{ display: "flex", gap: 1, alignItems: "flex-start" }}>
                    <TextField
                      sx={{ flex: 1 }}
                      type="number"
                      name="siteDuration"
                      value={formik.values.siteDuration || ""}
                      onChange={(e) => {
                        const inputValue = e.target.value;
                        if (inputValue === "") {
                          formik.setFieldValue("siteDuration", "", false);
                        } else {
                          const numValue = parseInt(inputValue, 10);
                          if (!isNaN(numValue) && numValue > 0) {
                            formik.setFieldValue("siteDuration", numValue, true);
                          }
                        }
                      }}
                      onBlur={formik.handleBlur}
                      error={Boolean(formik.touched.siteDuration && formik.errors.siteDuration)}
                      helperText={(formik.touched.siteDuration && formik.errors.siteDuration ? String(formik.errors.siteDuration) : "Enter number of months")}
                      required
                      inputProps={{ min: 1, step: 1 }}
                      placeholder="Months"
                    />
                    <Button
                      sx={{ mt: 1 }}
                      size="small"
                      onClick={() => {
                        setSiteDurationMode("select");
                        const currentValue = formik.values.siteDuration;
                        if (![3, 6, 12].includes(currentValue)) {
                          formik.setFieldValue("siteDuration", 3, true);
                        }
                      }}
                    >
                      Cancel
                    </Button>
                  </Box>
                )}
              </Box>
              <Box sx={{ width: "100%", paddingTop: "16px" }}>
                <Typography color="secondary" sx={{ fontWeight: "bold" }}>
                  Description
                </Typography>
                <TextField
                  sx={{ width: "100%" }}
                  placeholder="Enter Description"
                  name="description"
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  multiline
                  rows={4}
                />
              </Box>
            </Box>
            <Box sx={{ width: { xs: "100%", sm: "100%", md: "50%", lg: "50%" }, padding: { xs: "8px 12px", sm: "10px 14px", md: "12px 16px", lg: "12px 16px" } }}>
              <Paper
                elevation={0}
                sx={(theme) => ({
                  backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : theme.palette.grey[50],
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: "16px",
                  padding: { xs: "20px", sm: "24px", md: "24px", lg: "24px" },
                  mb: 2,
                })}
              >
                <Typography sx={{ fontSize: "15px", fontWeight: "600", mb: 2.5, color: "text.primary" }}>
                  Production Schedule
                </Typography>
                <Box sx={{ display: "flex", gap: 2, flexDirection: { xs: "column", sm: "row" } }}>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontWeight: 500 }}>
                      Start Date
                    </Typography>
                    <Box
                      sx={(theme) => ({
                        padding: "10px 14px",
                        borderRadius: "8px",
                        backgroundColor: theme.palette.background.paper,
                        border: `1px solid ${theme.palette.divider}`,
                        color: theme.palette.text.secondary,
                        fontSize: "14px",
                        minHeight: "40px",
                        display: "flex",
                        alignItems: "center",
                      })}
                    >
                      {productionDates.startDate ? new Date(productionDates.startDate).toDateString() : "—"}
                    </Box>
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontWeight: 500 }}>
                      End Date
                    </Typography>
                    <Box
                      sx={(theme) => ({
                        padding: "10px 14px",
                        borderRadius: "8px",
                        backgroundColor: theme.palette.background.paper,
                        border: `1px solid ${theme.palette.divider}`,
                        color: theme.palette.text.secondary,
                        fontSize: "14px",
                        minHeight: "40px",
                        display: "flex",
                        alignItems: "center",
                      })}
                    >
                      {productionDates.endDate ? new Date(productionDates.endDate).toDateString() : "—"}
                    </Box>
                  </Box>
                </Box>
              </Paper>
              <Paper
                elevation={0}
                sx={(theme) => ({
                  backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : theme.palette.grey[50],
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: "16px",
                  padding: { xs: "20px", sm: "24px", md: "24px", lg: "24px" },
                })}
              >
                <Typography sx={{ fontSize: "15px", fontWeight: "600", mb: 2.5, color: "text.primary" }}>
                  Site Schedule
                </Typography>
                <Box sx={{ display: "flex", gap: 2, flexDirection: { xs: "column", sm: "row" } }}>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontWeight: 500 }}>
                      Start Date
                    </Typography>
                    <Box
                      sx={(theme) => ({
                        padding: "10px 14px",
                        borderRadius: "8px",
                        backgroundColor: theme.palette.background.paper,
                        border: `1px solid ${theme.palette.divider}`,
                        color: theme.palette.text.secondary,
                        fontSize: "14px",
                        minHeight: "40px",
                        display: "flex",
                        alignItems: "center",
                      })}
                    >
                      {siteDates.startDate ? new Date(siteDates.startDate).toDateString() : "—"}
                    </Box>
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontWeight: 500 }}>
                      End Date
                    </Typography>
                    <Box
                      sx={(theme) => ({
                        padding: "10px 14px",
                        borderRadius: "8px",
                        backgroundColor: theme.palette.background.paper,
                        border: `1px solid ${theme.palette.divider}`,
                        color: theme.palette.text.secondary,
                        fontSize: "14px",
                        minHeight: "40px",
                        display: "flex",
                        alignItems: "center",
                      })}
                    >
                      {siteDates.endDate ? new Date(siteDates.endDate).toDateString() : "—"}
                    </Box>
                  </Box>
                </Box>
              </Paper>
            </Box>
          </Box>
        );
      case 1:
        return (
          <Box sx={{ width: "100%", padding: "12px 16px" }}>
            <Box sx={{ width: "100%", paddingTop: "16px" }}>
              <Typography color="secondary" sx={{ fontWeight: "bold" }}>
                Team Members
              </Typography>
              <FormControl sx={{ width: "100%", mt: 1 }}>
                <InputLabel>Team Members</InputLabel>
                <Select
                  multiple
                  value={formik.values.membersIds}
                  onChange={handleMembersChange}
                  input={<OutlinedInput label="Team Members" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip
                          key={value}
                          label={
                            users.find((user) => user.id === value)?.name ?? ""
                          }
                        />
                      ))}
                    </Box>
                  )}
                  name="membersIds"
                >
                  {users.map((user) => (
                    <MenuItem key={user.id} value={user.id}>
                      {user.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        minHeight: 0,
        overflow: "hidden",
        width: "100%",
        margin: { xs: "-12px", sm: "-16px", md: "-20px", lg: "-28px" },
        padding: { xs: "12px", sm: "16px", md: "20px", lg: "28px" },
      }}
    >
      <Paper
        elevation={0}
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          minHeight: 0,
          overflow: "hidden",
          width: "100%",
          backgroundColor: "background.paper",
          borderRadius: { xs: "16px", sm: "20px", md: "24px" },
          padding: 0,
        }}
      >
        <Box sx={{ flexShrink: 0, padding: { xs: "16px", sm: "20px", md: "24px", lg: "24px" }, paddingBottom: { xs: "12px", sm: "16px", md: "20px", lg: "20px" } }}>
          <PageHeader title="Add Project" />
        </Box>
        
        <Box sx={{ flexShrink: 0, paddingX: { xs: "16px", sm: "20px", md: "24px", lg: "24px" }, paddingBottom: { xs: "12px", sm: "16px", md: "20px", lg: "20px" } }}>
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

        <Box 
          sx={{ 
            flex: 1,
            minHeight: 0,
            overflowY: "auto",
            overflowX: "hidden",
            width: "100%",
            paddingX: { xs: "16px", sm: "20px", md: "24px", lg: "24px" },
            "&::-webkit-scrollbar": {
              width: "8px",
            },
            "&::-webkit-scrollbar-track": {
              backgroundColor: "transparent",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "rgba(0,0,0,0.2)",
              borderRadius: "4px",
              "&:hover": {
                backgroundColor: "rgba(0,0,0,0.3)",
              },
            },
          }}
        >
          <Box sx={{ width: "100%", minHeight: "400px", paddingBottom: { xs: "16px", sm: "20px", md: "24px", lg: "24px" } }}>
            {renderStepContent(activeStep)}
          </Box>
        </Box>

        <Box 
          sx={{ 
            flexShrink: 0,
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center",
            padding: { xs: "16px", sm: "20px", md: "24px", lg: "24px" },
            paddingTop: { xs: "12px", sm: "16px", md: "20px", lg: "20px" },
            borderTop: (theme) => `1px solid ${theme.palette.divider}`,
            flexDirection: { xs: "column-reverse", sm: "row", md: "row", lg: "row" }, 
            gap: { xs: "12px", sm: "12px", md: "0", lg: "0" },
            width: "100%",
            boxSizing: "border-box",
          }}
        >
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
            sx={{ 
              mr: { xs: 0, sm: 1, md: 1, lg: 1 }, 
              width: { xs: "100%", sm: "auto", md: "auto", lg: "auto" },
              minWidth: { xs: "auto", sm: "100px", md: "100px", lg: "100px" },
            }}
          >
            Back
          </Button>
          <Box sx={{ 
            width: { xs: "100%", sm: "auto", md: "auto", lg: "auto" },
            display: "flex",
            justifyContent: { xs: "stretch", sm: "flex-end", md: "flex-end", lg: "flex-end" },
          }}>
            {activeStep === steps.length - 1 ? (
              <Button 
                variant="contained" 
                onClick={handleSubmit}
                disabled={formik.isSubmitting || !formik.isValid || !formik.values.title.trim()}
                fullWidth={!isLargeScreen}
                sx={{ 
                  width: { xs: "100%", sm: "auto", md: "auto", lg: "auto" },
                  minWidth: { xs: "auto", sm: "140px", md: "140px", lg: "140px" },
                }}
              >
                Save Project
              </Button>
            ) : (
              <Button 
                variant="contained" 
                onClick={handleNext}
                fullWidth={!isLargeScreen}
                sx={{ 
                  width: { xs: "100%", sm: "auto", md: "auto", lg: "auto" },
                  minWidth: { xs: "auto", sm: "100px", md: "100px", lg: "100px" },
                }}
              >
                Next
              </Button>
            )}
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default AddProject;
