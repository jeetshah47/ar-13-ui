import React from "react";
import { Avatar, Box, Typography, Chip } from "@mui/material";
import type { EmployeeResponse } from "../../../store/types/Employee/EmployeeResponse";

interface EmpCardProps {
  employee: EmployeeResponse;
}

const EmpCard: React.FC<EmpCardProps> = ({ employee }) => {
  return (
    <Box
      sx={{
        background: "#FFFFFF",
        boxShadow: "0px 6px 58px rgba(196, 203, 214, 0.103611)",
        borderRadius: "24px",
        padding: "20px 28px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: "20px",
        minHeight: "80px",
      }}
    >
      <Box sx={{ 
        display: "flex", 
        gap: "18px", 
        alignItems: "center",
        width: "280px",
        flex: "0 0 280px"
      }}>
        <Avatar sx={{ width: "50px", height: "50px", flexShrink: 0 }}>
          {employee.name.charAt(0).toUpperCase()}
        </Avatar>
        <Box sx={{ 
          minWidth: 0, 
          width: "100%",
          overflow: "hidden"
        }}>
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 600, 
              lineHeight: 1.2,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap"
            }}
          >
            {employee.name}
          </Typography>
          <Typography 
            color="secondary.main" 
            fontSize={"14px"} 
            sx={{ 
              lineHeight: 1.2,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap"
            }}
          >
            {employee.email}
          </Typography>
          <Typography 
            color="text.secondary" 
            fontSize={"12px"} 
            sx={{ 
              marginTop: "4px", 
              lineHeight: 1.2,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap"
            }}
          >
            {employee.designation}
          </Typography>
        </Box>
      </Box>
      
      <Box sx={{ 
        display: "flex", 
        flexDirection: "column", 
        alignItems: "center", 
        gap: "8px",
        minWidth: "80px",
        justifyContent: "center"
      }}>
        <Typography fontSize={"14px"} color="secondary.main" sx={{ textAlign: "center" }}>
          Role
        </Typography>
        <Chip 
          label={employee.role} 
          color={employee.role === "Admin" ? "primary" : "default"}
          size="small"
        />
      </Box>
      
      <Box sx={{ 
        display: "flex", 
        flexDirection: "column", 
        alignItems: "center", 
        gap: "8px",
        minWidth: "80px",
        justifyContent: "center"
      }}>
        <Typography fontSize={"14px"} color="secondary.main" sx={{ textAlign: "center" }}>
          To Do
        </Typography>
        <Typography variant="h6" color="warning.main" sx={{ textAlign: "center" }}>
          {employee.backlogTasks}
        </Typography>
      </Box>
      
      <Box sx={{ 
        display: "flex", 
        flexDirection: "column", 
        alignItems: "center", 
        gap: "8px",
        minWidth: "80px",
        justifyContent: "center"
      }}>
        <Typography fontSize={"14px"} color="secondary.main" sx={{ textAlign: "center" }}>
          In Progress
        </Typography>
        <Typography variant="h6" color="info.main" sx={{ textAlign: "center" }}>
          {employee.tasksInProgress}
        </Typography>
      </Box>
      
      <Box sx={{ 
        display: "flex", 
        flexDirection: "column", 
        alignItems: "center", 
        gap: "8px",
        minWidth: "80px",
        justifyContent: "center"
      }}>
        <Typography fontSize={"14px"} color="secondary.main" sx={{ textAlign: "center" }}>
          In Review
        </Typography>
        <Typography variant="h6" color="success.main" sx={{ textAlign: "center" }}>
          {employee.tasksInReview}
        </Typography>
      </Box>
      
      <Box sx={{ 
        display: "flex", 
        flexDirection: "column", 
        alignItems: "center", 
        gap: "8px",
        minWidth: "80px",
        justifyContent: "center"
      }}>
        <Typography fontSize={"14px"} color="secondary.main" sx={{ textAlign: "center" }}>
          Total
        </Typography>
        <Typography variant="h6" sx={{ fontWeight: 600, textAlign: "center" }}>
          {employee.totalTasks}
        </Typography>
      </Box>
    </Box>
  );
};

export default EmpCard;
