import { Box } from "@mui/material";
import MainSiderBar from "../components/Sidebar/MainSiderBar";
import LandingPage from "../../pages/Landing/LandingPage";

const VerticalLayout = () => {
  return (
    <Box sx={{ display: "flex", width: "100%", position: "relative", height: "auto"}}>
      <Box
        sx={{ position: "fixed", height: "100vh", width: "200px", top: 0, padding: "20px" }}
      >
        <MainSiderBar />
      </Box>
      <Box sx={{ marginLeft: "230px", overflow: "hidden", width: "100%", minHeight: "100vh", padding: "20px"}}>
        <LandingPage />
      </Box>
    </Box>
  );
};

export default VerticalLayout;
