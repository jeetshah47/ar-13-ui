import { Box, Button, Typography, SvgIcon } from "@mui/material";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../store/store";
import {
  getGoogleAccountStatusAction,
  unlinkGoogleAccountAction,
  initiateGoogleOAuthAction,
} from "../../../store/features/googleAccount/googleAccountActions";

const GoogleAccountLink = () => {
  const dispatch = useAppDispatch();
  const { link, linked, loading, unlinking, linking } = useAppSelector(
    (state) => state.googleAccountReducer
  );

  useEffect(() => {
    // Fetch current status
    dispatch(getGoogleAccountStatusAction());
  }, [dispatch]);

  const handleLinkGoogleAccount = async () => {
    // Check if user is authenticated
    const token = localStorage.getItem("authToken");
    if (!token) {
      alert("Please log in to link your Google account");
      return;
    }
    
    try {
      // Server-side OAuth flow:
      // 1. Make authenticated API call to get OAuth URL
      // 2. Backend authenticates user and generates Google OAuth URL
      // 3. Redirect user to Google OAuth page
      // 4. User authorizes on Google
      // 5. Google redirects to backend callback: /api/google-account/auth/callback
      // 6. Backend exchanges code for tokens and links account
      // 7. Backend redirects to frontend: {FRONTEND_URL}/account/linked?success=true
      
      await dispatch(initiateGoogleOAuthAction());
    } catch (error) {
      console.error("Error initiating Google OAuth:", error);
      // Error is already handled in the action
    }
  };

  const handleUnlinkGoogleAccount = () => {
    if (window.confirm("Are you sure you want to unlink your Google account?")) {
      dispatch(unlinkGoogleAccountAction());
    }
  };

  // Google Icon SVG Component
  const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );

  return (
    <Box
      sx={(theme) => ({
        borderTop: `1px solid ${theme.palette.divider}`,
        paddingTop: "26px",
        marginTop: "26px",
      })}
    >
      <Typography fontWeight={700} sx={{ marginBottom: "16px" }}>
        Linked Accounts
      </Typography>
      
      <Box
        sx={(theme) => ({
          padding: "12px",
          backgroundColor: theme.palette.grey[50],
          borderRadius: "8px",
          width: "100%",
          boxSizing: "border-box",
        })}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
          <SvgIcon
            component={GoogleIcon}
            sx={{
              width: "24px",
              height: "24px",
              flexShrink: 0,
            }}
          />
          <Box sx={{ flex: 1, minWidth: 0 }}>
            {linked && link ? (
              <>
                <Typography
                  fontSize="14px"
                  fontWeight={600}
                  sx={{ fontWeight: "bold" }}
                >
                  Google Account Linked
                </Typography>
                <Typography
                  fontSize="12px"
                  color="secondary.main"
                  sx={{ fontSize: "14px", paddingTop: "4px" }}
                >
                  {link.providerEmail}
                </Typography>
              </>
            ) : (
              <Typography
                fontSize="14px"
                color="secondary.main"
                sx={{ fontSize: "14px" }}
              >
                No Google account linked
              </Typography>
            )}
          </Box>
        </Box>
        {linked ? (
          <Button
            variant="outlined"
            color="error"
            size="small"
            onClick={handleUnlinkGoogleAccount}
            disabled={unlinking || loading}
            sx={{ 
              textTransform: "none",
              width: "100%",
            }}
          >
            {unlinking ? "Unlinking..." : "Unlink"}
          </Button>
        ) : (
          <Button
            variant="contained"
            size="small"
            onClick={handleLinkGoogleAccount}
            disabled={loading || linking}
            sx={{ 
              textTransform: "none",
              width: "100%",
            }}
          >
            {linking ? "Starting..." : "Link Google"}
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default GoogleAccountLink;

