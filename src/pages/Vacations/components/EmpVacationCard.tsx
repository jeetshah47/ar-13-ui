import { Avatar, Box, Typography } from "@mui/material";
import type { VacationResponse } from "../../../store/types/Vacation/VacationTypes";

interface EmpVacationCardProps {
  request?: VacationResponse;
  employee?: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    vacationStats: {
      vacations: number;
      sickLeave: number;
      workRemotely: number;
    };
  };
}

const EmpVacationCard = ({ employee }: EmpVacationCardProps) => {
  // If employee data provided, show employee vacation stats card (Figma design)
  if (employee) {
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
          height: "91px",
        }}
      >
        <Box sx={{ display: "flex", gap: "18px", alignItems: "center" }}>
          <Avatar 
            sx={{ width: "50px", height: "50px" }}
            src={employee.avatar}
          >
            {employee.name.split(' ').map(n => n[0]).join('')}
          </Avatar>
          <Box>
            <Typography 
              sx={{ 
                fontWeight: 700, 
                fontSize: "16px", 
                lineHeight: "24px",
                color: "#0A1629",
                marginBottom: "2px"
              }}
            >
              {employee.name}
            </Typography>
            <Typography 
              sx={{ 
                fontSize: "14px", 
                lineHeight: "19px",
                color: "#91929E"
              }}
            >
              {employee.email}
            </Typography>
          </Box>
        </Box>
        
        <Box sx={{ display: "flex", gap: "48px", alignItems: "center" }}>
          <Box sx={{ textAlign: "center" }}>
            <Typography 
              sx={{ 
                fontSize: "14px", 
                lineHeight: "19px",
                color: "#91929E",
                marginBottom: "2px"
              }}
            >
              Vacations
            </Typography>
            <Typography 
              sx={{ 
                fontSize: "16px", 
                lineHeight: "24px",
                color: "#0A1629",
                fontWeight: 400
              }}
            >
              {employee.vacationStats.vacations}
            </Typography>
          </Box>
          
          <Box sx={{ textAlign: "center" }}>
            <Typography 
              sx={{ 
                fontSize: "14px", 
                lineHeight: "19px",
                color: "#91929E",
                marginBottom: "2px"
              }}
            >
              Sick Leave
            </Typography>
            <Typography 
              sx={{ 
                fontSize: "16px", 
                lineHeight: "24px",
                color: "#0A1629",
                fontWeight: 400
              }}
            >
              {employee.vacationStats.sickLeave}
            </Typography>
          </Box>
          
          <Box sx={{ textAlign: "center" }}>
            <Typography 
              sx={{ 
                fontSize: "14px", 
                lineHeight: "19px",
                color: "#91929E",
                marginBottom: "2px"
              }}
            >
              Work remotely
            </Typography>
            <Typography 
              sx={{ 
                fontSize: "16px", 
                lineHeight: "24px",
                color: "#0A1629",
                fontWeight: 400
              }}
            >
              {employee.vacationStats.workRemotely}
            </Typography>
          </Box>
        </Box>
      </Box>
    );
  }

  // If no employee data, show placeholder with sample data
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
        height: "91px",
      }}
    >
      <Box sx={{ display: "flex", gap: "18px", alignItems: "center" }}>
        <Avatar sx={{ width: "50px", height: "50px" }}>RT</Avatar>
        <Box>
          <Typography 
            sx={{ 
              fontWeight: 700, 
              fontSize: "16px", 
              lineHeight: "24px",
              color: "#0A1629",
              marginBottom: "2px"
            }}
          >
            Ryan Thompson
          </Typography>
          <Typography 
            sx={{ 
              fontSize: "14px", 
              lineHeight: "19px",
              color: "#91929E"
            }}
          >
            ryanthom@gmail.com
          </Typography>
        </Box>
      </Box>
      
      <Box sx={{ display: "flex", gap: "48px", alignItems: "center" }}>
        <Box sx={{ textAlign: "center" }}>
          <Typography 
            sx={{ 
              fontSize: "14px", 
              lineHeight: "19px",
              color: "#91929E",
              marginBottom: "2px"
            }}
          >
            Vacations
          </Typography>
          <Typography 
            sx={{ 
              fontSize: "16px", 
              lineHeight: "24px",
              color: "#0A1629",
              fontWeight: 400
            }}
          >
            15
          </Typography>
        </Box>
        
        <Box sx={{ textAlign: "center" }}>
          <Typography 
            sx={{ 
              fontSize: "14px", 
              lineHeight: "19px",
              color: "#91929E",
              marginBottom: "2px"
            }}
          >
            Sick Leave
          </Typography>
          <Typography 
            sx={{ 
              fontSize: "16px", 
              lineHeight: "24px",
              color: "#0A1629",
              fontWeight: 400
            }}
          >
            3
          </Typography>
        </Box>
        
        <Box sx={{ textAlign: "center" }}>
          <Typography 
            sx={{ 
              fontSize: "14px", 
              lineHeight: "19px",
              color: "#91929E",
              marginBottom: "2px"
            }}
          >
            Work remotely
          </Typography>
          <Typography 
            sx={{ 
              fontSize: "16px", 
              lineHeight: "24px",
              color: "#0A1629",
              fontWeight: 400
            }}
          >
            50
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default EmpVacationCard;
