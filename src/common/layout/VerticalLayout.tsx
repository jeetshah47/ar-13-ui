import { Box, Skeleton } from "@mui/material";
import MainSiderBar from "../components/Sidebar/MainSiderBar";
import LandingPage from "../../pages/Landing/LandingPage";
import { Suspense } from "react";

const VerticalLayout = () => {
  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        position: "relative",
        // height: "auto",
      }}
    >
      <Box
        sx={{
          position: "fixed",
          height: "100vh",
          width: "200px",
          top: 0,
          padding: "20px",
        }}
      >
        <MainSiderBar />
      </Box>
      <Box
        sx={{
          marginLeft: "230px",
          overflow: "auto",
          width: "100%",
          height: "100vh",
          padding: "20px",
          boxSizing: "border-box",
        }}
      >
        <Suspense fallback={<Skeleton variant="rectangular" />}>
          <LandingPage />
        </Suspense>
      </Box>
    </Box>
  );
};

export default VerticalLayout;
