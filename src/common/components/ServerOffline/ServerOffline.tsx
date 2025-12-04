import { Box, Typography, Button } from "@mui/material";
import { useNetworkError } from "../../../contexts/NetworkErrorContext";

const ServerOffline = () => {
  const { clearError } = useNetworkError();

  const handleRetry = () => {
    clearError();
    // Reload the page to retry
    window.location.reload();
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "60px 20px",
        textAlign: "center",
        height: "100vh",
        width: "100%",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 9999,
        backgroundColor: "background.default",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          maxWidth: "500px",
          width: "100%",
        }}
      >
        <Box sx={{ marginBottom: "24px", display: "flex", justifyContent: "center" }}>
          <img 
            src="/illustration/server-offline.svg" 
            alt="Server offline illustration" 
            width={300} 
            height={250}
          />
        </Box>
        <Typography
          variant="h4"
          sx={(theme) => ({
            fontWeight: "bold",
            color: theme.palette.text.primary,
            marginBottom: "8px",
            textAlign: "center",
            width: "100%",
          })}
        >
          Server Offline
        </Typography>
        <Typography
          variant="body1"
          sx={(theme) => ({
            color: theme.palette.text.secondary,
            maxWidth: "400px",
            lineHeight: 1.6,
            marginBottom: "24px",
            textAlign: "center",
            width: "100%",
            mx: "auto",
          })}
        >
          We're having trouble connecting to the server. Please check your internet connection and try again.
        </Typography>
        <Button
          variant="contained"
          onClick={handleRetry}
          sx={{
            padding: "10px 24px",
            borderRadius: "8px",
          }}
        >
          Retry Connection
        </Button>
      </Box>
    </Box>
  );
};

export default ServerOffline;

