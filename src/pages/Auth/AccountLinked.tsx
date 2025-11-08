import { Box, Button, Typography } from "@mui/material";
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useAppDispatch } from "../../store/store";
import { getGoogleAccountStatusAction } from "../../store/features/googleAccount/googleAccountActions";

const AccountLinked = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const success = searchParams.get("success");
  const error = searchParams.get("error");

  useEffect(() => {
    // Refresh the account status after linking
    if (success === "true") {
      dispatch(getGoogleAccountStatusAction());
    }
  }, [success, dispatch]);

  const handleGoToProfile = () => {
    navigate("/app/profile");
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        flexDirection: "column",
        gap: "24px",
      }}
    >
      {success === "true" ? (
        <Box sx={{ textAlign: "center", maxWidth: "400px" }}>
          <Typography
            variant="h5"
            fontWeight={600}
            sx={{ marginBottom: "16px", color: "success.main" }}
          >
            Google Account Linked Successfully!
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ marginBottom: "24px" }}
          >
            Your Google account has been successfully linked to your profile.
          </Typography>
          <Button variant="contained" onClick={handleGoToProfile}>
            Go to Profile
          </Button>
        </Box>
      ) : (
        <Box sx={{ textAlign: "center", maxWidth: "400px" }}>
          <Typography
            variant="h5"
            fontWeight={600}
            sx={{ marginBottom: "16px", color: "error.main" }}
          >
            Failed to Link Google Account
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ marginBottom: "24px" }}
          >
            {error || "An error occurred while linking your Google account. Please try again."}
          </Typography>
          <Button variant="contained" onClick={handleGoToProfile}>
            Go to Profile
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default AccountLinked;

