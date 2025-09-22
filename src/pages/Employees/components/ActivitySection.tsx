import React from "react";
import { Avatar, Box, Typography, CircularProgress, Alert } from "@mui/material";
import { useAppSelector } from "../../../store/store";
import type { EmployeeResponse } from "../../../store/types/Employee/EmployeeResponse";

interface EmpTrackCardProps {
  employee: EmployeeResponse;
}

const ActivitySection = () => {
  const { employees, loading, error } = useAppSelector(
    (state) => state.employeeReducer
  );

  const EmpTrackCard: React.FC<EmpTrackCardProps> = ({ employee }) => (
    <Box
      sx={{
        background: "#FFFFFF",
        boxShadow: "0px 6px 58px rgba(196, 203, 214, 0.103611)",
        borderRadius: "24px",
        padding: "8px",
        width: "265px",
      }}
    >
      <Box
        sx={{
          background: "#F4F9FD",
          borderRadius: "16px",
          padding: "16px 0px",
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <Avatar sx={{ width: "50px", height: "50px" }}>
          {employee.name.charAt(0).toUpperCase()}
        </Avatar>
        <Typography fontWeight={700} sx={{ textAlign: "center" }}>
          {employee.name}
        </Typography>
        <Typography sx={{ textAlign: "center", fontSize: "14px" }}>
          {employee.designation}
        </Typography>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 8px" }}>
        <Box sx={{textAlign: "center", flex: 1}}>
          <Typography variant="h6" color="warning.main" sx={{ fontWeight: 600 }}>
            {employee.backlogTasks}
          </Typography>
          <Typography color="secondary.main" fontSize={"12px"}>
            To Do
          </Typography>
        </Box>
        <Box sx={{textAlign: "center", flex: 1}}>
          <Typography variant="h6" color="info.main" sx={{ fontWeight: 600 }}>
            {employee.tasksInProgress}
          </Typography>
          <Typography color="secondary.main" fontSize={"12px"}>
            In Progress
          </Typography>
        </Box>
        <Box sx={{textAlign: "center", flex: 1}}>
          <Typography variant="h6" color="success.main" sx={{ fontWeight: 600 }}>
            {employee.tasksInReview}
          </Typography>
          <Typography color="secondary.main" fontSize={"12px"}>
            In Review
          </Typography>
        </Box>
      </Box>
    </Box>
  );

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", padding: "40px" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ margin: "20px 0" }}>
        {error}
      </Alert>
    );
  }

  if (employees.length === 0) {
    return (
      <Box sx={{ textAlign: "center", padding: "40px" }}>
        <Typography color="text.secondary">No employees found</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
      {employees.map((employee) => (
        <EmpTrackCard key={employee.userId} employee={employee} />
      ))}
    </Box>
  );
};

export default ActivitySection;
