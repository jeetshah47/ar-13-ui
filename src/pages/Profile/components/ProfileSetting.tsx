import { Box, SvgIcon, Typography, Divider } from "@mui/material";
import LeftIcon from "../../../assets/icons/general/left.svg?react";
import { useAppDispatch, useAppSelector } from "../../../store/store";
import { getUserProfileAction } from "../../../store/features/user/userActions";
import ChangePasswordForm from "./ChangePasswordForm";

type ProfileSettingProps = {
  onBack?: () => void;
};

export const ProfileSetting = ({ onBack }: ProfileSettingProps) => {
  const dispatch = useAppDispatch();
  const { profile } = useAppSelector((s) => s.userReducer);
  const uid = useAppSelector((s) => s.authReducer.api.uid);
  const forceChangePassword = profile?.forceChangePassword || false;

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ display: "flex", gap: "18px", alignItems: "center", mb: 3 }}>
        {onBack && (
          <SvgIcon
            component={LeftIcon}
            onClick={onBack}
            sx={{ cursor: "pointer" }}
          />
        )}
        <Typography fontWeight={700} fontSize={"22px"}>
          Settings
        </Typography>
      </Box>
      <Box
        sx={{
          backgroundColor: "#fff",
          borderRadius: "24px",
          padding: "26px 22px",
        }}
      >
        <Typography
          variant="h6"
          sx={{ fontWeight: 600, mb: 1 }}
        >
          Change Password
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: "text.secondary", mb: 3 }}
        >
          {forceChangePassword
            ? "You must change your password to continue using the system."
            : "Update your password to keep your account secure."}
        </Typography>
        <Divider sx={{ mb: 3 }} />
        <ChangePasswordForm
          forceChange={forceChangePassword}
          onSuccess={() => {
            // Refresh profile data to get updated forceChangePassword flag
            if (uid) {
              dispatch(getUserProfileAction(uid));
            }
            // Clear forceChangePassword from localStorage
            localStorage.removeItem("forceChangePassword");
            // Small delay to ensure profile is refreshed, then go back
            if (onBack) {
              setTimeout(() => {
                onBack();
              }, 500);
            }
          }}
        />
      </Box>
    </Box>
  );
};
