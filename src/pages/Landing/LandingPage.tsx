import { Box } from "@mui/material";
import Header from "../../common/components/Header/Header";
import { Route, Routes, useLocation } from "react-router";
import { authRoutes } from "../../routes";
import AnimatedPage from "../../common/components/AnimatedPage/AnimatedPage";

const LandingPage = () => {
  const location = useLocation();

  return (
    <Box sx={{ height: "100%", width: "100%"}}>
      <Header />
      <Box 
        sx={{ 
          padding: { xs: "12px", sm: "16px", md: "20px", lg: "28px" }, 
          minHeight: "100%",
          paddingTop: { xs: "60px", sm: "16px", md: "20px", lg: "28px" } // Extra top padding on mobile for menu button
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
