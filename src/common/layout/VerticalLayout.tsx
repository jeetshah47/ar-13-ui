import { Box, Skeleton } from "@mui/material";
import MainSiderBar from "../components/Sidebar/MainSiderBar";
import LandingPage from "../../pages/Landing/LandingPage";
import { Suspense } from "react";
import { NotificationProvider } from "../../contexts/NotificationContext";

const VerticalLayout = () => {
  return (
    <NotificationProvider>
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
        data-scroll-container
        sx={{
          marginLeft: "230px",
          overflow: "auto",
          width: "100%",
          height: "100vh",
          padding: "20px",
          boxSizing: "border-box",
          scrollBehavior: "smooth",
          WebkitOverflowScrolling: "touch",
        }}
      >
        <Suspense fallback={<Skeleton variant="rectangular" />}>
          <LandingPage />
        </Suspense>
      </Box>
    </Box>
    </NotificationProvider>
  );
};

export default VerticalLayout;
