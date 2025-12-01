import { Box, Skeleton, Drawer, IconButton, useMediaQuery, useTheme } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import MainSiderBar from "../components/Sidebar/MainSiderBar";
import LandingPage from "../../pages/Landing/LandingPage";
import { Suspense, useState } from "react";
import { NotificationProvider } from "../../contexts/NotificationContext";

const VerticalLayout = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const sidebarWidth = 240;
  const drawerWidth = 240;

  return (
    <NotificationProvider>
      <Box
        sx={{
          display: "flex",
          width: "100%",
        }}
      >
        {/* Desktop Sidebar */}
        {!isMobile && (
          <Box
            sx={{
              width: `${sidebarWidth}px`,
              flexShrink: 0,
              padding: "20px",
            }}
          >
            <MainSiderBar onNavigate={() => {}} />
          </Box>
        )}

        {/* Mobile Drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              padding: "20px",
            },
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "flex-end", padding: "8px" }}>
            <IconButton onClick={handleDrawerToggle}>
              <CloseIcon />
            </IconButton>
          </Box>
          <MainSiderBar onNavigate={handleDrawerToggle} />
        </Drawer>

        {/* Menu Toggle Button - Mobile only */}
        {isMobile && (
          <IconButton
            onClick={handleDrawerToggle}
            sx={{
              position: "fixed",
              top: "16px",
              left: "16px",
              zIndex: (theme) => theme.zIndex.drawer + 1,
              backgroundColor: "background.paper",
              boxShadow: 2,
            }}
          >
            <MenuIcon />
          </IconButton>
        )}

        {/* Main Content Area */}
        <Box
          data-scroll-container
          sx={{
            flexGrow: 1,
            overflow: "auto",
            height: "100vh",
            padding: { xs: "12px", sm: "16px", md: "20px" },
            boxSizing: "border-box",
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
