import { Box } from "@mui/material";

const Progress = () => {
  return (
    <Box
      sx={{
        borderRadius: "99px",
        backgroundColor: "#3F8CFF",
        width: "24px",
        height: "24px",
      }}
    >
      <Box
        sx={{
          borderRadius: "99px",
          backgroundColor: "#fff",
          width: "18px",
          height: "18px",
        }}
      />
    </Box>
  );
};

export default Progress;
