import { Box } from "@mui/material";

const Tab = () => {
  return (
    <Box
      sx={{
        backgroundColor: "#E6EDF5",
        borderRadius: "24px",
        padding: "4px",
        display: "flex",
        alignItems: "center",
        minWidth: "400px",
      }}
    >
      <Box
        sx={{
          borderRadius: "20px",
          backgroundColor: "primary.main",
          color: "#fff",
          fontWeight: 700,
          textAlign: "center",
          padding: "8px",
          width: "100%",
          transition: "0.3s",
        }}
      >
        Employees’ vacations
      </Box>
      <Box
        sx={{
          textAlign: "center",
          padding: "8px",
          width: "100%",
          transition: "0.3s",
        }}
      >
        Calendar
      </Box>
    </Box>
  );
};

export default Tab;
