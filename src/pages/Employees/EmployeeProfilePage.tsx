import {
  Avatar,
  Box,
  TextField,
  Typography,
  CircularProgress,
  Alert,
} from "@mui/material";
import PageHeader from "../../common/components/PageHeader/PageHeader";
import Tab from "../../common/components/Tab/Tab";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import ProjectSection from "../Profile/components/ProjectSection";
import TeamSection from "../Profile/components/TeamSection";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { getEmployeeByIdAction } from "../../store/features/employees/employeeActions";
import { clearSelectedEmployee, clearEmployeeStats } from "../../store/features/employees/employeeSlice";
import { getUserProfileAction } from "../../store/features/user/userActions";
import StatsSection from "./components/StatsSection";

// Helper function to generate initials from name
const getInitials = (name: string | null | undefined): string => {
  if (!name) return "U";
  const parts = name.trim().split(" ");
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

const tabList = ["Projects", "Team", "Statistics"];

const EmployeeProfilePage = () => {
  const { userId } = useParams<{ userId: string }>();
  const [currentTab, setCurrentTab] = useState("Projects");
  const dispatch = useAppDispatch();
  
  const { selectedEmployee, loading, error } = useAppSelector(
    (state) => state.employeeReducer
  );
  const { profile, profileLoading } = useAppSelector(
    (state) => state.userReducer
  );

  useEffect(() => {
    if (userId) {
      dispatch(getEmployeeByIdAction(userId));
      dispatch(getUserProfileAction(userId));
    }
    
    return () => {
      dispatch(clearSelectedEmployee());
      dispatch(clearEmployeeStats());
    };
  }, [userId, dispatch]);

  const avatarInitials = getInitials(selectedEmployee?.name);
  const displayName = selectedEmployee?.name || profile?.name || "Loading...";
  const displayEmail = selectedEmployee?.email || profile?.email || "";
  const displayDesignation = selectedEmployee?.designation || "";

  if ((loading || profileLoading) && !selectedEmployee) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", padding: "40px" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error && !selectedEmployee) {
    return (
      <Box sx={{ padding: "20px" }}>
        <Alert severity="error" sx={{ marginBottom: "20px" }}>
          {error}
        </Alert>
      </Box>
    );
  }

  if (!selectedEmployee) {
    return (
      <Box sx={{ padding: "20px" }}>
        <Alert severity="info">Employee not found</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ height: "100%" }}>
      <PageHeader title={`${displayName}'s Profile`} />
      <Box
        sx={{
          padding: "28px 0px",
          display: "flex",
          gap: "16px",
          height: "100%",
        }}
      >
        <Box
          sx={(theme) => ({
            width: "264px",
            height: "100%",
            backgroundColor: theme.palette.background.paper,
            borderRadius: "24px",
            padding: "24px 18px",
            boxShadow: theme.shadows[1],
          })}
        >
          <Avatar 
            sx={(theme) => ({ 
              width: "64px", 
              height: "64px",
              bgcolor: theme.palette.grey[300],
              color: theme.palette.text.secondary,
              fontSize: "24px",
              fontWeight: "bold",
            })}
          >
            {avatarInitials}
          </Avatar>
          <Typography fontWeight={700} fontSize={"18px"}>
            {displayName}
          </Typography>
          <Typography fontSize={"14px"} color="secondary.main">
            {displayDesignation}
          </Typography>
          <Box sx={(theme) => ({ borderTop: `1px solid ${theme.palette.divider}`, paddingTop: "26px" })}>
            <Typography fontWeight={700}>Main Info</Typography>
            <Box sx={{ width: "100%", paddingTop: "10px" }}>
              <Typography
                color="secondary"
                sx={{ fontWeight: "bold", fontSize: "14px" }}
              >
                Position
              </Typography>
              <TextField
                sx={{ width: "100%", paddingTop: "7px" }}
                placeholder="Enter Position Name"
                value={displayDesignation}
                InputProps={{ readOnly: true }}
              />
            </Box>
            <Box sx={{ width: "100%", paddingTop: "10px" }}>
              <Typography
                color="secondary"
                sx={{ fontWeight: "bold", fontSize: "14px" }}
              >
                Role
              </Typography>
              <TextField
                sx={{ width: "100%", paddingTop: "7px" }}
                value={selectedEmployee.role}
                InputProps={{ readOnly: true }}
              />
            </Box>
            <Typography fontWeight={700} sx={{ marginTop: "20px" }}>Contact Info</Typography>
            <Box sx={{ width: "100%", paddingTop: "10px" }}>
              <Typography
                color="secondary"
                sx={{ fontWeight: "bold", fontSize: "14px" }}
              >
                Email
              </Typography>
              <TextField
                sx={{ width: "100%", paddingTop: "7px" }}
                placeholder="Enter Email"
                value={displayEmail}
                InputProps={{ readOnly: true }}
              />
            </Box>
          </Box>
          <Box sx={(theme) => ({ borderTop: `1px solid ${theme.palette.divider}`, paddingTop: "26px", marginTop: "20px" })}>
            <Typography fontWeight={700} sx={{ marginBottom: "16px" }}>Task Statistics</Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography color="secondary" fontSize={"14px"}>To Do</Typography>
                <Typography fontWeight={600} color="warning.main">{selectedEmployee.backlogTasks}</Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography color="secondary" fontSize={"14px"}>In Progress</Typography>
                <Typography fontWeight={600} color="info.main">{selectedEmployee.tasksInProgress}</Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography color="secondary" fontSize={"14px"}>In Review</Typography>
                <Typography fontWeight={600} color="success.main">{selectedEmployee.tasksInReview}</Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography color="secondary" fontSize={"14px"}>Pending</Typography>
                <Typography fontWeight={600} color="text.secondary">{selectedEmployee.pendingTasks}</Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between", paddingTop: "8px", borderTop: `1px solid ${theme => theme.palette.divider}` }}>
                <Typography color="secondary" fontSize={"14px"} fontWeight={600}>Total</Typography>
                <Typography fontWeight={700} fontSize={"16px"}>{selectedEmployee.totalTasks}</Typography>
              </Box>
            </Box>
          </Box>
        </Box>
        <Box
          sx={{
            borderRadius: "24px",
            padding: "24px 18px",
            width: "100%",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box sx={{ width: "50%" }}>
              <Tab
                tabList={tabList}
                currentTab={currentTab}
                onChangeTab={(tab) => setCurrentTab(tab)}
              />
            </Box>
          </Box>
          {currentTab === "Projects" && <ProjectSection />}
          {currentTab === "Team" && <TeamSection />}
          {currentTab === "Statistics" && userId && <StatsSection userId={userId} />}
        </Box>
      </Box>
    </Box>
  );
};

export default EmployeeProfilePage;

