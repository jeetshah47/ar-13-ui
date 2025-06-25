import { Avatar, Box, Typography } from "@mui/material";

const EmployeeCard = () => {
  return (
    <Box
      sx={{
        backgroundColor: "#F4F9FD",
        borderRadius: "24px",
        paddingY: "18px",
        paddingX: "36px",
        width: "50%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Avatar sizes="48px" />
      <Typography variant="subtitle1" sx={{fontWeight: "bold"}}>Shawn Stone</Typography>
      <Typography variant="subtitle2">UI/UX Designer</Typography>
    </Box>
  );
};

export default EmployeeCard;
