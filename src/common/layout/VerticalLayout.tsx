import { Grid } from "@mui/material";
import MainSiderBar from "../components/Sidebar/MainSiderBar";
import LandingPage from "../../pages/Landing/LandingPage";

const VerticalLayout = () => {
  return (
    <Grid sx={{ padding: "20px" }} container>
      <Grid
        size={{ sm: 4, md: 2 }}
        sx={{ position: "relative", height: "100vh" }}
      >
        <MainSiderBar />
      </Grid>
      <Grid size={{ sm: 8, md: 10 }}>
        <LandingPage />
      </Grid>
    </Grid>
  );
};

export default VerticalLayout;
