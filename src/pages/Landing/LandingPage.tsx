import { Box } from "@mui/material";
import Header from "../../common/components/Header/Header";
import { Route, Routes } from "react-router";
import { authRoutes } from "../../routes";

const LandingPage = () => {
  return (
    <Box sx={{ height: "100%" }}>
      <Header />
      <Box sx={{ padding: "28px"}}>
        <Routes>
          {authRoutes.map((route) => (
            <Route
              key={route.path}
              element={route.component}
              path={route.path}
            />
          ))}
        </Routes>
      </Box>
    </Box>
  );
};

export default LandingPage;
