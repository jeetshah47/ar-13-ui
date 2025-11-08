import { Box, Typography } from "@mui/material";
import CustomCard from "../../../common/components/Card/CustomCard";
import InfoPortalIllustration from "/illustration/info-portal-illustration.svg";

const Banner = () => {
  return (
    <CustomCard>
      <Box
        sx={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          minHeight: "186px",
          overflow: "hidden",
        }}
      >
        {/* Illustration */}
        <Box
          sx={{
            position: "absolute",
            right: "-38px",
            top: "-38px",
            width: "291px",
            height: "278px",
            zIndex: 1,
          }}
        >
          <InfoPortalIllustration
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
            maxWidth: "360px",
            paddingTop: "44px",
          }}
        >
          <Typography
            variant="h2"
            sx={(theme) => ({
              fontWeight: 700,
              fontSize: "22px",
              lineHeight: 1.364,
              color: theme.palette.text.primary,
              marginBottom: "16px",
            })}
          >
            Your project data warehouse
          </Typography>
          <Typography
            sx={(theme) => ({
              fontSize: "16px",
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
