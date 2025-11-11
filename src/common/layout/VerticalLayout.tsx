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
          position: "relative",
        }}
      >
        {/* Mobile Menu Button */}
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
              "&:hover": {
                backgroundColor: "action.hover",
              },
            }}
          >
            <MenuIcon />
          </IconButton>
        )}

        {/* Desktop Sidebar */}
        {!isMobile && (
          <Box
            sx={{
              position: "fixed",
              height: "100vh",
              width: `${sidebarWidth}px`,
              top: 0,
              left: 0,
              padding: { xs: "12px", sm: "16px", md: "20px" },
              zIndex: (theme) => theme.zIndex.drawer,
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
            keepMounted: true, // Better open performance on mobile.
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

        {/* Main Content Area */}
        <Box
          data-scroll-container
          sx={{
            marginLeft: { xs: 0, md: `${sidebarWidth}px` },
            overflow: "auto",
            width: { xs: "100%", md: `calc(100% - ${sidebarWidth}px)` },
            height: "100vh",
            padding: { xs: "12px", sm: "16px", md: "20px" },
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
