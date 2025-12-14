import { Box, Typography } from "@mui/material";
import CustomCard from "../../../common/components/Card/CustomCard";

const Banner = () => {
  return (
    <CustomCard>
      <Box
        sx={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          minHeight: { xs: "186px", sm: "186px" },
          overflow: "hidden",
        }}
      >
        {/* Illustration */}
        <Box
          sx={{
            position: "absolute",
            right: { xs: "-20px", sm: "-38px" },
            top: { xs: "-20px", sm: "-38px" },
            width: { xs: "200px", sm: "291px" },
            height: { xs: "191px", sm: "278px" },
            zIndex: 1,
          }}
        >
          <img
            src="/illustration/info-portal-illustration.svg"
            alt="Info Portal illustration"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
            }}
          />
        </Box>

        {/* Content */}
        <Box
          sx={{
            position: "relative",
            zIndex: 2,
            maxWidth: { xs: "100%", sm: "360px" },
            paddingTop: { xs: "24px", sm: "44px" },
            paddingX: { xs: "20px", sm: 0 },
            paddingBottom: { xs: "20px", sm: 0 },
          }}
        >
          <Typography
            variant="h2"
            sx={(theme) => ({
              fontWeight: 700,
              fontSize: { xs: "18px", sm: "22px" },
              lineHeight: 1.364,
              color: theme.palette.text.primary,
              marginBottom: { xs: "12px", sm: "16px" },
            })}
          >
            Your project data warehouse
          </Typography>
          <Typography
            sx={(theme) => ({
              fontSize: { xs: "14px", sm: "16px" },
              fontWeight: 400,
              lineHeight: 1.5,
              color: theme.palette.text.primary,
              opacity: 0.7,
            })}
          >
            Add project data, create thematic pages, edit data, share information
            with team members
          </Typography>
        </Box>
      </Box>
    </CustomCard>
  );
};

export default Banner;
