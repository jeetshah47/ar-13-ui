import React from "react";
import { Avatar, Box, Typography, CircularProgress, Alert } from "@mui/material";
import { useNavigate } from "react-router";
import { useAppSelector } from "../../../store/store";
import type { EmployeeResponse } from "../../../store/types/Employee/EmployeeResponse";

interface EmpTrackCardProps {
  employee: EmployeeResponse;
}

const ActivitySection = () => {
  const { employees, loading, error } = useAppSelector(
    (state) => state.employeeReducer
  );
  const navigate = useNavigate();

  const handleCardClick = (userId: string) => {
    navigate(`/app/employees/${userId}`);
  };

  const EmpTrackCard: React.FC<EmpTrackCardProps> = ({ employee }) => (
    <Box
      onClick={() => handleCardClick(employee.userId)}
      sx={(theme) => ({
        background: theme.palette.background.paper,
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: "16px",
        padding: "20px",
        width: "300px",
        transition: "all 0.2s ease",
        cursor: "pointer",
        "&:hover": {
          borderColor: theme.palette.primary.main,
          boxShadow: theme.shadows[4],
          transform: "translateY(-2px)",
        },
      })}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
        <Avatar 
          sx={{ 
            width: "56px", 
            height: "56px",
            fontSize: "20px",
            fontWeight: 600,
          }}
        >
          {employee.name.charAt(0).toUpperCase()}
        </Avatar>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography 
            variant="subtitle1" 
            sx={{ 
              fontWeight: 600, 
              fontSize: "15px",
              lineHeight: 1.3,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {employee.name}
          </Typography>
          <Typography 
            variant="body2"
            sx={{ 
              color: "text.secondary",
              fontSize: "13px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {employee.designation}
          </Typography>
        </Box>
      </Box>
      
      <Box 
        sx={{ 
          display: "flex", 
          justifyContent: "space-between",
          gap: "8px",
        }}
      >
        <Box sx={{ textAlign: "center", flex: 1 }}>
          <Typography 
            variant="h6" 
            color="warning.main" 
            sx={{ 
              fontWeight: 600,
              fontSize: "20px",
              lineHeight: 1.2,
              marginBottom: "4px",
            }}
          >
            {employee.backlogTasks}
          </Typography>
          <Typography 
            variant="caption" 
            color="text.secondary"
            sx={{ fontSize: "11px" }}
          >
            To Do
          </Typography>
        </Box>
        
        <Box sx={{ textAlign: "center", flex: 1 }}>
          <Typography 
            variant="h6" 
            color="info.main" 
            sx={{ 
              fontWeight: 600,
              fontSize: "20px",
              lineHeight: 1.2,
              marginBottom: "4px",
            }}
          >
            {employee.tasksInProgress}
          </Typography>
          <Typography 
            variant="caption" 
            color="text.secondary"
            sx={{ fontSize: "11px" }}
          >
            In Progress
          </Typography>
        </Box>
        
        <Box sx={{ textAlign: "center", flex: 1 }}>
          <Typography 
            variant="h6" 
            color="success.main" 
            sx={{ 
              fontWeight: 600,
              fontSize: "20px",
              lineHeight: 1.2,
              marginBottom: "4px",
            }}
          >
            {employee.tasksInReview}
          </Typography>
          <Typography 
            variant="caption" 
            color="text.secondary"
            sx={{ fontSize: "11px" }}
          >
            In Review
          </Typography>
        </Box>
        
        <Box sx={{ textAlign: "center", flex: 1 }}>
          <Typography 
            variant="h6" 
            color="text.secondary" 
            sx={{ 
              fontWeight: 600,
              fontSize: "20px",
              lineHeight: 1.2,
              marginBottom: "4px",
            }}
          >
            {employee.pendingTasks}
          </Typography>
          <Typography 
            variant="caption" 
            color="text.secondary"
            sx={{ fontSize: "11px" }}
          >
            Pending
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
    <Box 
      sx={{ 
        display: "flex", 
        gap: "16px", 
        flexWrap: "wrap",
      }}
    >
      {employees.map((employee) => (
        <EmpTrackCard key={employee.userId} employee={employee} />
      ))}
    </Box>
  );
};

export default ActivitySection;
