import { Box, Typography } from "@mui/material";

const NoTaskMessage = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "60px 20px",
        textAlign: "center",
        height: "100%",
        minHeight: "400px",
      }}
    >
      <Box sx={{ marginBottom: "24px" }}>
        <img 
          src="/illustration/no-task.svg" 
          alt="No tasks illustration" 
          width={300} 
          height={250}
        />
      </Box>
      <Typography
        variant="h5"
        sx={{
          fontWeight: "bold",
          color: "#2C3E50",
          marginBottom: "8px",
        }}
      >
        No Tasks Found
      </Typography>
      <Typography
        variant="body1"
        sx={{
          color: "#7F8C8D",
          maxWidth: "400px",
          lineHeight: 1.6,
        }}
      >
        This project doesn't have any tasks yet. Click the "Add Task" button to create your first task and get started.
      </Typography>
    </Box>
  );
};

export default NoTaskMessage;
