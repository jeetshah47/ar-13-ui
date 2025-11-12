import { Avatar, Box, Typography, useTheme, useMediaQuery } from "@mui/material";
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  
  // If employee data provided, show employee vacation stats card (Figma design)
  if (employee) {
    return (
      <Box
        sx={(theme) => ({
          background: theme.palette.background.paper,
          boxShadow: theme.shadows[1],
          borderRadius: { xs: "24px", md: "24px" },
          padding: { xs: "16px 18px", md: "20px 28px" },
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          justifyContent: { xs: "flex-start", md: "space-between" },
          alignItems: { xs: "flex-start", md: "center" },
          marginTop: { xs: "16px", md: "20px" },
          height: { xs: "auto", md: "91px" },
          gap: { xs: "16px", md: 0 },
        })}
      >
        <Box sx={{ display: "flex", gap: { xs: "12px", md: "18px" }, alignItems: "center", width: "100%" }}>
          <Avatar 
            sx={{ width: { xs: "40px", md: "50px" }, height: { xs: "40px", md: "50px" } }}
            src={employee.avatar}
          >
            {employee.name.split(' ').map(n => n[0]).join('')}
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography 
              sx={(theme) => ({ 
                fontWeight: 700, 
                fontSize: { xs: "14px", md: "16px" }, 
                lineHeight: { xs: "20px", md: "24px" },
                color: theme.palette.text.primary,
                marginBottom: "2px"
              })}
            >
              {employee.name}
            </Typography>
            <Typography 
              sx={(theme) => ({ 
                fontSize: { xs: "12px", md: "14px" }, 
                lineHeight: { xs: "16px", md: "19px" },
                color: theme.palette.text.secondary
              })}
            >
              {employee.email}
            </Typography>
          </Box>
        </Box>
        
        <Box sx={{ 
          display: "flex", 
          gap: { xs: "24px", md: "48px" }, 
          alignItems: "center",
          width: { xs: "100%", md: "auto" },
          justifyContent: { xs: "space-between", md: "flex-end" }
        }}>
          <Box sx={{ textAlign: "center", flex: { xs: 1, md: "none" } }}>
            <Typography 
              sx={(theme) => ({ 
                fontSize: { xs: "12px", md: "14px" }, 
                lineHeight: { xs: "16px", md: "19px" },
                color: theme.palette.text.secondary,
                marginBottom: "2px"
              })}
            >
              Vacations
            </Typography>
            <Typography 
              sx={(theme) => ({ 
                fontSize: { xs: "14px", md: "16px" }, 
                lineHeight: { xs: "20px", md: "24px" },
                color: theme.palette.text.primary,
                fontWeight: 400
              })}
            >
              {employee.vacationStats.vacations}
            </Typography>
          </Box>
          
          <Box sx={{ textAlign: "center", flex: { xs: 1, md: "none" } }}>
            <Typography 
              sx={(theme) => ({ 
                fontSize: { xs: "12px", md: "14px" }, 
                lineHeight: { xs: "16px", md: "19px" },
                color: theme.palette.text.secondary,
                marginBottom: "2px"
              })}
            >
              Sick Leave
            </Typography>
            <Typography 
              sx={(theme) => ({ 
                fontSize: { xs: "14px", md: "16px" }, 
                lineHeight: { xs: "20px", md: "24px" },
                color: theme.palette.text.primary,
                fontWeight: 400
              })}
            >
              {employee.vacationStats.sickLeave}
            </Typography>
          </Box>
          
          <Box sx={{ textAlign: "center", flex: { xs: 1, md: "none" } }}>
            <Typography 
              sx={(theme) => ({ 
                fontSize: { xs: "12px", md: "14px" }, 
                lineHeight: { xs: "16px", md: "19px" },
                color: theme.palette.text.secondary,
                marginBottom: "2px"
              })}
            >
              Work remotely
            </Typography>
            <Typography 
              sx={(theme) => ({ 
                fontSize: { xs: "14px", md: "16px" }, 
                lineHeight: { xs: "20px", md: "24px" },
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
        borderRadius: { xs: "24px", md: "24px" },
        padding: { xs: "16px 18px", md: "20px 28px" },
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        justifyContent: { xs: "flex-start", md: "space-between" },
        alignItems: { xs: "flex-start", md: "center" },
        marginTop: { xs: "16px", md: "20px" },
        height: { xs: "auto", md: "91px" },
        gap: { xs: "16px", md: 0 },
      })}
    >
      <Box sx={{ display: "flex", gap: { xs: "12px", md: "18px" }, alignItems: "center", width: "100%" }}>
        <Avatar sx={{ width: { xs: "40px", md: "50px" }, height: { xs: "40px", md: "50px" } }}>RT</Avatar>
        <Box sx={{ flex: 1 }}>
          <Typography 
            sx={(theme) => ({ 
              fontWeight: 700, 
              fontSize: { xs: "14px", md: "16px" }, 
              lineHeight: { xs: "20px", md: "24px" },
              color: theme.palette.text.primary,
              marginBottom: "2px"
            })}
          >
            Ryan Thompson
          </Typography>
          <Typography 
            sx={(theme) => ({ 
              fontSize: { xs: "12px", md: "14px" }, 
              lineHeight: { xs: "16px", md: "19px" },
              color: theme.palette.text.secondary
            })}
          >
            ryanthom@gmail.com
          </Typography>
        </Box>
      </Box>
      
      <Box sx={{ 
        display: "flex", 
        gap: { xs: "24px", md: "48px" }, 
        alignItems: "center",
        width: { xs: "100%", md: "auto" },
        justifyContent: { xs: "space-between", md: "flex-end" }
      }}>
        <Box sx={{ textAlign: "center", flex: { xs: 1, md: "none" } }}>
          <Typography 
            sx={(theme) => ({ 
              fontSize: { xs: "12px", md: "14px" }, 
              lineHeight: { xs: "16px", md: "19px" },
              color: theme.palette.text.secondary,
              marginBottom: "2px"
            })}
          >
            Vacations
          </Typography>
          <Typography 
            sx={(theme) => ({ 
              fontSize: { xs: "14px", md: "16px" }, 
              lineHeight: { xs: "20px", md: "24px" },
              color: theme.palette.text.primary,
              fontWeight: 400
            })}
          >
            15
          </Typography>
        </Box>
        
        <Box sx={{ textAlign: "center", flex: { xs: 1, md: "none" } }}>
          <Typography 
            sx={(theme) => ({ 
              fontSize: { xs: "12px", md: "14px" }, 
              lineHeight: { xs: "16px", md: "19px" },
              color: theme.palette.text.secondary,
              marginBottom: "2px"
            })}
          >
            Sick Leave
          </Typography>
          <Typography 
            sx={(theme) => ({ 
              fontSize: { xs: "14px", md: "16px" }, 
              lineHeight: { xs: "20px", md: "24px" },
              color: theme.palette.text.primary,
              fontWeight: 400
            })}
          >
            3
          </Typography>
        </Box>
        
        <Box sx={{ textAlign: "center", flex: { xs: 1, md: "none" } }}>
          <Typography 
            sx={(theme) => ({ 
              fontSize: { xs: "12px", md: "14px" }, 
              lineHeight: { xs: "16px", md: "19px" },
              color: theme.palette.text.secondary,
              marginBottom: "2px"
            })}
          >
            Work remotely
          </Typography>
          <Typography 
            sx={(theme) => ({ 
              fontSize: { xs: "14px", md: "16px" }, 
              lineHeight: { xs: "20px", md: "24px" },
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
