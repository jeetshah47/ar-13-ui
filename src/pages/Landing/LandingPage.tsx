import { Box } from "@mui/material";
import Header from "../../common/components/Header/Header";
import { Route, Routes, useLocation } from "react-router";
import { authRoutes } from "../../routes";
import AnimatedPage from "../../common/components/AnimatedPage/AnimatedPage";

const LandingPage = () => {
  const location = useLocation();

  return (
    <Box sx={{ height: "100%", width: "100%", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <Box sx={{ flexShrink: 0 }}>
        <Header />
      </Box>
      <Box 
        sx={{ 
          padding: { xs: "12px", sm: "16px", md: "20px", lg: "28px" }, 
          flex: 1,
          minHeight: 0,
          overflow: "auto",
          paddingTop: { xs: "60px", sm: "16px", md: "20px", lg: "28px" }, // Extra top padding on mobile for menu button
          display: "flex",
          flexDirection: "column",
          "&::-webkit-scrollbar": {
            width: "8px",
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: "transparent",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "rgba(0,0,0,0.2)",
            borderRadius: "4px",
            "&:hover": {
              backgroundColor: "rgba(0,0,0,0.3)",
            },
          },
        }}
      >
        <AnimatedPage>
          <Routes location={location} key={location.pathname}>
            {authRoutes.map((route) => (
              <Route
                key={route.path}
                element={route.component}
                path={route.path}
              />
            ))}
          </Routes>
        </AnimatedPage>
      </Box>
    </Box>
  );
};

export default LandingPage;
