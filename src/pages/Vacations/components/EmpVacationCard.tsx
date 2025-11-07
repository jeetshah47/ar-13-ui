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
        sx={(theme) => ({
          background: theme.palette.background.paper,
          boxShadow: theme.shadows[1],
          borderRadius: "24px",
          padding: "20px 28px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "20px",
          height: "91px",
        })}
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
              sx={(theme) => ({ 
                fontWeight: 700, 
                fontSize: "16px", 
                lineHeight: "24px",
                color: theme.palette.text.primary,
                marginBottom: "2px"
              })}
            >
              {employee.name}
            </Typography>
            <Typography 
              sx={(theme) => ({ 
                fontSize: "14px", 
                lineHeight: "19px",
                color: theme.palette.text.secondary
              })}
            >
              {employee.email}
            </Typography>
          </Box>
        </Box>
        
        <Box sx={{ display: "flex", gap: "48px", alignItems: "center" }}>
          <Box sx={{ textAlign: "center" }}>
            <Typography 
              sx={(theme) => ({ 
                fontSize: "14px", 
                lineHeight: "19px",
                color: theme.palette.text.secondary,
                marginBottom: "2px"
              })}
            >
              Vacations
            </Typography>
            <Typography 
              sx={(theme) => ({ 
                fontSize: "16px", 
                lineHeight: "24px",
                color: theme.palette.text.primary,
                fontWeight: 400
              })}
            >
              {employee.vacationStats.vacations}
            </Typography>
          </Box>
          
          <Box sx={{ textAlign: "center" }}>
            <Typography 
              sx={(theme) => ({ 
                fontSize: "14px", 
                lineHeight: "19px",
                color: theme.palette.text.secondary,
                marginBottom: "2px"
              })}
            >
              Sick Leave
            </Typography>
            <Typography 
              sx={(theme) => ({ 
                fontSize: "16px", 
                lineHeight: "24px",
                color: theme.palette.text.primary,
                fontWeight: 400
              })}
            >
              {employee.vacationStats.sickLeave}
            </Typography>
          </Box>
          
          <Box sx={{ textAlign: "center" }}>
            <Typography 
              sx={(theme) => ({ 
                fontSize: "14px", 
                lineHeight: "19px",
                color: theme.palette.text.secondary,
                marginBottom: "2px"
              })}
            >
              Work remotely
            </Typography>
            <Typography 
              sx={(theme) => ({ 
                fontSize: "16px", 
                lineHeight: "24px",
                color: theme.palette.text.primary,
                fontWeight: 400
              })}
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
      sx={(theme) => ({
        background: theme.palette.background.paper,
        boxShadow: theme.shadows[1],
        borderRadius: "24px",
        padding: "20px 28px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: "20px",
        height: "91px",
      })}
    >
      <Box sx={{ display: "flex", gap: "18px", alignItems: "center" }}>
        <Avatar sx={{ width: "50px", height: "50px" }}>RT</Avatar>
        <Box>
          <Typography 
            sx={(theme) => ({ 
              fontWeight: 700, 
              fontSize: "16px", 
              lineHeight: "24px",
              color: theme.palette.text.primary,
              marginBottom: "2px"
            })}
          >
            Ryan Thompson
          </Typography>
          <Typography 
            sx={(theme) => ({ 
              fontSize: "14px", 
              lineHeight: "19px",
              color: theme.palette.text.secondary
            })}
          >
            ryanthom@gmail.com
          </Typography>
        </Box>
      </Box>
      
      <Box sx={{ display: "flex", gap: "48px", alignItems: "center" }}>
        <Box sx={{ textAlign: "center" }}>
          <Typography 
            sx={(theme) => ({ 
              fontSize: "14px", 
              lineHeight: "19px",
              color: theme.palette.text.secondary,
              marginBottom: "2px"
            })}
          >
            Vacations
          </Typography>
          <Typography 
            sx={(theme) => ({ 
              fontSize: "16px", 
              lineHeight: "24px",
              color: theme.palette.text.primary,
              fontWeight: 400
            })}
          >
            15
          </Typography>
        </Box>
        
        <Box sx={{ textAlign: "center" }}>
          <Typography 
            sx={(theme) => ({ 
              fontSize: "14px", 
              lineHeight: "19px",
              color: theme.palette.text.secondary,
              marginBottom: "2px"
            })}
          >
            Sick Leave
          </Typography>
          <Typography 
            sx={(theme) => ({ 
              fontSize: "16px", 
              lineHeight: "24px",
              color: theme.palette.text.primary,
              fontWeight: 400
            })}
          >
            3
          </Typography>
        </Box>
        
        <Box sx={{ textAlign: "center" }}>
          <Typography 
            sx={(theme) => ({ 
              fontSize: "14px", 
              lineHeight: "19px",
              color: theme.palette.text.secondary,
              marginBottom: "2px"
            })}
          >
            Work remotely
          </Typography>
          <Typography 
            sx={(theme) => ({ 
              fontSize: "16px", 
              lineHeight: "24px",
              color: theme.palette.text.primary,
              fontWeight: 400
            })}
          >
            50
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default EmpVacationCard;
