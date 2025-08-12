import { Box, SvgIcon, Typography } from "@mui/material";
import LeftIcon from "../../../assets/icons/general/left.svg?react";

export const ProfileSetting = () => {
  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ display: "flex", gap: "18px", alignItems: "center" }}>
        <SvgIcon component={LeftIcon} />
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
        
      </Box>
    </Box>
  );
};
