import { Avatar, Box, Typography } from "@mui/material";
import type { UserResponse } from "../../../store/types/User/UserResponse";

interface EmployeeCardProps {
  employee: UserResponse;
}

const EmployeeCard = ({ employee }: EmployeeCardProps) => {
  // Generate initials from name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Box
      sx={{
        backgroundColor: "#F4F9FD",
        borderRadius: "24px",
        paddingY: "18px",
        paddingX: "36px",
        width: "160px",
        height: "120px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
      }}
    >
      <Avatar 
        sx={{ 
          width: 48, 
          height: 48, 
          fontSize: "16px", 
          fontWeight: "bold",
          backgroundColor: "#E0E0E0",
          color: "#666666"
        }}
      >
        {getInitials(employee.name)}
      </Avatar>
      <Typography 
        variant="subtitle1" 
        sx={{ 
          fontWeight: "bold", 
          textAlign: "center",
          fontSize: "14px",
          lineHeight: 1.2,
          maxWidth: "100%",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap"
        }}
      >
        {employee.name}
      </Typography>
      <Typography 
        variant="subtitle2" 
        sx={{ 
          textAlign: "center",
          fontSize: "12px",
          color: "#666666",
          lineHeight: 1.2,
          maxWidth: "100%",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap"
        }}
      >
        {employee.designation || employee.role}
      </Typography>
    </Box>
  );
};

export default EmployeeCard;
