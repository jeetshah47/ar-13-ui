import {
  Box,
  Button,
  SvgIcon,
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
} from "@mui/material";
import PageHeader from "../../../common/components/PageHeader/PageHeader";
import Icon1 from "../../../assets/icons/project/Image-1.svg?react";
import Icon2 from "../../../assets/icons/project/Image-2.svg?react";
import Icon3 from "../../../assets/icons/project/Image-3.svg?react";
import Icon4 from "../../../assets/icons/project/Image-4.svg?react";
import Icon5 from "../../../assets/icons/project/Image-5.svg?react";
import Icon6 from "../../../assets/icons/project/Image-6.svg?react";
import Icon7 from "../../../assets/icons/project/Image-7.svg?react";
import Icon8 from "../../../assets/icons/project/Image-8.svg?react";
import Icon9 from "../../../assets/icons/project/Image-9.svg?react";
import Icon10 from "../../../assets/icons/project/Image-10.svg?react";
import Icon from "../../../assets/icons/project/Image.svg?react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router";
import { useFormik } from "formik";
import * as Yup from "yup";
import { addProjectAction, updateProjectAction } from "../../../store/features/projects/projectAction";
import type { AppDispatch, RootState } from "../../../store/store";
import { getUsersAction } from "../../../store/features/user/userAction";
import type { SelectChangeEvent } from "@mui/material";
import type { ProjectDetailResponse } from "../../../store/types/Project/ProjectDetailResponse";

const steps = ["Basic Details", "Team Members"];

// Validation schema for step 1
const step1ValidationSchema = Yup.object({
  title: Yup.string()
    .trim()
    .required("Project name is required")
    .min(1, "Project name cannot be empty"),
  startDate: Yup.string()
    .required("Start date is required"),
  endDate: Yup.string()
    .required("End date is required")
    .test(
      "is-after-start",
      "End date must be after start date",
      function (value) {
        const { startDate } = this.parent;
        if (!startDate || !value) return true;
        const start = new Date(startDate + "T00:00:00");
        const end = new Date(value + "T23:59:59");
        return end >= start;
      }
    ),
  description: Yup.string(),
  logoUrl: Yup.string(),
});

const AddProject = () => {
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("lg"));
  
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();
  const { users } = useSelector((state: RootState) => state.userReducer);
  const [activeStep, setActiveStep] = useState(0);

  // Check if we're in edit mode
  const editData = location.state as { project: ProjectDetailResponse['projectDetails']; isEditMode: boolean } | null;
  const isEditMode = editData?.isEditMode ?? false;
  const projectData = editData?.project ?? null;
  const projectId = projectData?.id ?? null;

  useEffect(() => {
    dispatch(getUsersAction());
  }, [dispatch]);

  // Helper function to format ISO date to YYYY-MM-DD for date input
  const formatDateForInput = (isoDate: string | undefined): string => {
    if (!isoDate) return "";
    try {
      const date = new Date(isoDate);
      if (isNaN(date.getTime())) return "";
      return date.toISOString().split("T")[0];
    } catch {
      return "";
    }
  };

  // Get deadline date for initializing endDate
  const deadlineDate = projectData?.deadline || projectData?.deadLine;
  const endDateFromDeadline = deadlineDate ? formatDateForInput(deadlineDate) : "";

  const formik = useFormik({
    initialValues: {
      title: projectData?.title ?? "",
      description: projectData?.description ?? "",
      startDate: "", // ProjectResponse doesn't have startDate, so we'll leave it empty for edit
      endDate: endDateFromDeadline, // Initialize from deadLine if available
      deadLine: deadlineDate ? formatDateForInput(deadlineDate) : "",
      membersIds: (projectData?.membersIds ?? []) as string[],
      ownerId: projectData?.ownerId ?? localStorage.getItem("uid") ?? "",
      logoUrl: (projectData as any)?.logoUrl ?? "",
    },
    validationSchema: step1ValidationSchema,
    validateOnChange: true,
    validateOnBlur: true,
    enableReinitialize: true, // Allow form to reinitialize when projectData changes
    onSubmit: (values) => {
      // Format dates to ISO strings
      const start = values.startDate ? new Date(values.startDate + "T00:00:00") : null;
      const end = values.endDate ? new Date(values.endDate + "T23:59:59") : null;
      
      const finalFormData = {
        ...values,
        startDate: start ? start.toISOString() : (projectData as any)?.startDate ?? "",
        endDate: end ? end.toISOString() : (projectData as any)?.endDate ?? "",
        deadLine: end ? end.toISOString() : ((projectData?.deadline || projectData?.deadLine) ?? ""),
      };
      
      if (isEditMode && projectId) {
        dispatch(
          updateProjectAction(projectId, finalFormData, () => {
            navigate(`/app/projects/info/${projectId}`);
          })
        );
      } else {
        dispatch(
          addProjectAction(finalFormData, () => {
            navigate("/app/projects");
          })
        );
      }
    },
  });

  // Update deadline when endDate changes
  useEffect(() => {
    if (formik.values.endDate) {
      const end = new Date(formik.values.endDate + "T23:59:59");
      formik.setFieldValue("deadLine", end.toISOString(), false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formik.values.endDate]);

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

  const arrayIcons = [
    { name: "Icon", component: Icon },
    { name: "Icon1", component: Icon1 },
    { name: "Icon2", component: Icon2 },
    { name: "Icon3", component: Icon3 },
    { name: "Icon4", component: Icon4 },
    { name: "Icon5", component: Icon5 },
    { name: "Icon6", component: Icon6 },
    { name: "Icon7", component: Icon7 },
    { name: "Icon8", component: Icon8 },
    { name: "Icon9", component: Icon9 },
    { name: "Icon10", component: Icon10 },
  ];

  const handleIconClick = (iconName: string) => {
    formik.setFieldValue("logoUrl", iconName);
  };

  const handleMembersChange = (event: SelectChangeEvent<string[]>) => {
    formik.setFieldValue("membersIds", event.target.value);
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
                <Typography color="secondary" sx={{ fontWeight: "bold" }}>
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
                  disabled={isEditMode}
                />
              </Box>
              <Box sx={{ width: "100%", paddingTop: "16px" }}>
                <Typography color="secondary" sx={{ fontWeight: "bold" }}>
                  Start Date
                </Typography>
                <TextField
                  sx={{ width: "100%" }}
                  type="date"
                  name="startDate"
                  value={formik.values.startDate}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={Boolean(formik.touched.startDate && formik.errors.startDate)}
                  helperText={formik.touched.startDate && formik.errors.startDate}
                  required
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Box>
              <Box sx={{ width: "100%", paddingTop: "16px" }}>
                <Typography color="secondary" sx={{ fontWeight: "bold" }}>
                  End Date
                </Typography>
                <TextField
                  sx={{ width: "100%" }}
                  type="date"
                  name="endDate"
                  value={formik.values.endDate}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={Boolean(formik.touched.endDate && formik.errors.endDate)}
                  helperText={formik.touched.endDate && formik.errors.endDate}
                  required
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{
                    min: formik.values.startDate || undefined,
                  }}
                />
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
            <Box
              sx={(theme) => ({
                backgroundColor: theme.palette.background.paper,
                border: `1px solid ${theme.palette.grey[300]}`,
                borderRadius: "24px",
                padding: { xs: "16px", sm: "20px", md: "20px", lg: "24px" },
                width: { xs: "100%", sm: "100%", md: "45%", lg: "30%" },
                marginTop: { xs: "16px", sm: "20px", md: "0", lg: "0" },
              })}
            >
              <Typography sx={{ fontSize: "18px", fontWeight: "bold" }}>
                Select image
              </Typography>
              <Typography color="secondary" sx={{ padding: "12px 0px" }}>
                Select or upload an avatar for the project (available formats: jpg,
                png)
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: { xs: "12px", sm: "14px", md: "14px", lg: "16px" } }}>
                {arrayIcons.map((icon, index) => (
                  <SvgIcon
                    key={index}
                    sx={{
                      width: "48px",
                      height: "48px",
                      cursor: "pointer",
                      border:
                        formik.values.logoUrl === icon.name
                          ? "2px solid #3F8CFF"
                          : "none",
                    }}
                    component={icon.component}
                    onClick={() => handleIconClick(icon.name)}
                  />
                ))}
              </Box>
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
        backgroundColor: "background.paper",
        padding: { xs: "16px", sm: "20px", md: "24px", lg: "24px" },
        display: "flex",
        flexDirection: "column",
        maxWidth: { xs: "100%", sm: "100%", md: "100%", lg: "1400px" },
        margin: { xs: "0 auto", sm: "0 auto", md: "0 auto", lg: "0 auto" },
      }}
    >
      <PageHeader title={isEditMode ? "Edit Project" : "Add Project"} />
      
      <Stepper activeStep={activeStep} sx={{ mb: 4, mt: 2 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Box sx={{ width: "100%", minHeight: "400px" }}>
        {renderStepContent(activeStep)}
      </Box>

      <Box sx={{ display: "flex", justifyContent: "space-between", mt: { xs: 2, sm: 3, md: 3, lg: 4 }, flexDirection: { xs: "column-reverse", sm: "row", md: "row", lg: "row" }, gap: { xs: "12px", sm: "0", md: "0", lg: "0" } }}>
        <Button
          disabled={activeStep === 0}
          onClick={handleBack}
          sx={{ mr: { xs: 0, sm: 1, md: 1, lg: 1 }, width: { xs: "100%", sm: "auto", md: "auto", lg: "auto" } }}
        >
          Back
        </Button>
        <Box sx={{ width: { xs: "100%", sm: "auto", md: "auto", lg: "auto" } }}>
          {activeStep === steps.length - 1 ? (
            <Button 
              variant="contained" 
              onClick={handleSubmit}
              disabled={!formik.values.title.trim() || (!isEditMode && (!formik.values.startDate || !formik.values.endDate))}
              fullWidth={!isLargeScreen}
              sx={{ width: { xs: "100%", sm: "100%", md: "auto", lg: "auto" } }}
            >
              {isEditMode ? "Update Project" : "Save Project"}
            </Button>
          ) : (
            <Button 
              variant="contained" 
              onClick={handleNext}
              fullWidth={!isLargeScreen}
              sx={{ width: { xs: "100%", sm: "100%", md: "auto", lg: "auto" } }}
            >
              Next
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default AddProject;
