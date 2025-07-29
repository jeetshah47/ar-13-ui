import { Box, Button, Typography } from "@mui/material";
import { useAuthStore } from "../../store/hooks/useAuthAction";

const AuthSuccess = () => {
  const isUserRegisted = useAuthStore((state) => state.isAuthenticated);
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
      }}
    >
      {isUserRegisted && (
        <Box>
          <img src="/illustration/workspace.svg" />
          <Typography textAlign={"center"} fontWeight={"600"}>
            You are successfully registered
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "center", py: "10px" }}>
            <Button variant="contained">Lets Start</Button>
          </Box>
        </Box>
      )}
      {!isUserRegisted && <Typography>Something is wrong</Typography>}
    </Box>
  );
};

export default AuthSuccess;
