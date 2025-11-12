import {
  Avatar,
  Box,
  Button,
  TextField,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import PageHeader from "../../common/components/PageHeader/PageHeader";
import Tab from "../../common/components/Tab/Tab";
import { useEffect, useState } from "react";
import ProjectSection from "./components/ProjectSection";
import TeamSection from "./components/TeamSection";
import VacationSection from "./components/VacationSection";
import PermissionsSection from "./components/PermissionsSection";
import Modal from "../../common/components/Modal/Modal";
import VacationForm from "./components/VacationForm";
import { ProfileSetting } from "./components/ProfileSetting";
import GoogleAccountLink from "./components/GoogleAccountLink";
import { useAppDispatch, useAppSelector, type RootState } from "../../store/store";
import { getUserProfileAction } from "../../store/features/user/userActions";
import { usePermissions } from "../../store/hooks/usePermissions";

// Helper function to generate initials from name
const getInitials = (name: string | null | undefined): string => {
  if (!name) return "U";
  const parts = name.trim().split(" ");
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

const ProfilePage = () => {
  const [currentTab, setCurrentTab] = useState("Projects");
  const [showModal, setShowModal] = useState(false);
  const [showSetting, ] = useState(false);
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const uid = useAppSelector((s) => s.authReducer.api.uid);
  const { profile, profileLoading } = useAppSelector((s) => s.userReducer);
  const { checkPermission } = usePermissions();
  
  // Filter tab list based on permissions
  const baseTabList = ["Projects", "Team", "My Vacations", "Permissions"];
  const tabList = baseTabList.filter(tab => {
    if (tab === "My Vacations") {
      return checkPermission("vacation:read");
    }
    return true;
  });
  
  // If current tab is not available, switch to first available tab
  useEffect(() => {
    if (!tabList.includes(currentTab) && tabList.length > 0) {
      setCurrentTab(tabList[0]);
    }
  }, [tabList, currentTab]);
  
  // Get auth state user data as fallback
  const authUserName = useAppSelector((state: RootState) => state.authReducer.user.name);
  const authUserEmail = useAppSelector((state: RootState) => state.authReducer.user.email);
  
  // Use profile data or fallback to auth state
  const displayName = profile?.name || authUserName || "-";
  const displayEmail = profile?.email || authUserEmail || "";
  const avatarInitials = getInitials(profile?.name || authUserName);

  useEffect(() => {
    if (uid) {
      dispatch(getUserProfileAction(uid));
    }
  }, [uid, dispatch]);

  //

  const handleOnCloseModal = () => {
    setShowModal(false);
  };
  const handleOnShowModal = () => {
    setShowModal(true);
  };

  // const handleShowSetting = () => {
  //   setShowSetting(true);
  //   setCurrentTab("");
  // };

  return (
    <Box sx={{ height: "100%" }}>
      <PageHeader
        title="Employee's Profile"
        // endElement={
        //   <Box
        //     onClick={handleShowSetting}
        //     sx={{
        //       backgroundColor: "#fff",
        //       borderRadius: "14px",
        //       padding: "12px",
        //       display: "flex",
        //     }}
        //   >
        //     <SvgIcon component={SettingIcon} />
        //   </Box>
        // }
      />
      <Box
        sx={{
          padding: { xs: "10px", sm: "20px", md: "28px 0px" },
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: { xs: "16px", md: "16px" },
          height: "100%",
        }}
      >
        <Box
          sx={(theme) => ({
            width: { xs: "100%", md: "264px" },
            height: { xs: "auto", md: "100%" },
            backgroundColor: theme.palette.background.paper,
            borderRadius: { xs: "24px", md: "24px" },
            padding: { xs: "20px 18px", md: "24px 18px" },
            boxShadow: theme.shadows[1],
          })}
        >
          <Avatar 
            sx={(theme) => ({ 
              width: { xs: "64px", md: "64px" }, 
              height: { xs: "64px", md: "64px" },
              bgcolor: theme.palette.grey[300],
              color: theme.palette.text.secondary,
              fontSize: { xs: "24px", md: "24px" },
              fontWeight: "bold",
            })}
          >
            {avatarInitials}
          </Avatar>
          <Typography fontWeight={700} fontSize={{ xs: "18px", md: "18px" }} sx={{ mt: { xs: 1, md: 0 } }}>
            {profileLoading ? "Loading..." : displayName}
          </Typography>
          <Typography fontSize={{ xs: "14px", md: "14px" }} color="secondary.main">
            UI/UX Designer
          </Typography>
          <Box sx={(theme) => ({ borderTop: `1px solid ${theme.palette.divider}`, paddingTop: { xs: "20px", md: "26px" }, mt: { xs: "20px", md: 0 } })}>
            <Typography fontWeight={700} fontSize={{ xs: "16px", md: "18px" }}>Main Info</Typography>
            <Box sx={{ width: "100%", paddingTop: "10px" }}>
              <Typography
                color="secondary"
                sx={{ fontWeight: "bold", fontSize: { xs: "13px", md: "14px" } }}
              >
                Position
              </Typography>
              <TextField
                sx={{ width: "100%", paddingTop: "7px" }}
                placeholder="Enter Position Name"
                size={isMobile ? "small" : "medium"}
              />
            </Box>
            <Box sx={{ width: "100%", paddingTop: "10px" }}>
              <Typography
                color="secondary"
                sx={{ fontWeight: "bold", fontSize: { xs: "13px", md: "14px" } }}
              >
                Company
              </Typography>
              <TextField
                sx={{ width: "100%", paddingTop: "7px" }}
                placeholder="Enter Company Name"
                size={isMobile ? "small" : "medium"}
              />
            </Box>
            <Box sx={{ width: "100%", paddingTop: "10px" }}>
              <Typography
                color="secondary"
                sx={{ fontWeight: "bold", fontSize: { xs: "13px", md: "14px" } }}
              >
                Location
              </Typography>
              <TextField
                sx={{ width: "100%", paddingTop: "7px" }}
                placeholder="Enter Position Name"
                size={isMobile ? "small" : "medium"}
              />
            </Box>
            <Typography fontWeight={700} fontSize={{ xs: "16px", md: "18px" }} sx={{ marginTop: { xs: "16px", md: "20px" } }}>Contact Info</Typography>
            <Box sx={{ width: "100%", paddingTop: "10px" }}>
              <Typography
                color="secondary"
                sx={{ fontWeight: "bold", fontSize: { xs: "13px", md: "14px" } }}
              >
                Email
              </Typography>
              <TextField
                sx={{ width: "100%", paddingTop: "7px" }}
                placeholder="Enter Email"
                value={displayEmail}
                InputProps={{ readOnly: true }}
                size={isMobile ? "small" : "medium"}
              />
            </Box>
            <Box sx={{ width: "100%", paddingTop: "10px" }}>
              <Typography
                color="secondary"
                sx={{ fontWeight: "bold", fontSize: { xs: "13px", md: "14px" } }}
              >
                Contact Number
              </Typography>
              <TextField
                sx={{ width: "100%", paddingTop: "7px" }}
                placeholder="Enter Number"
                value={profile?.phoneNumber || ""}
                InputProps={{ readOnly: true }}
                size={isMobile ? "small" : "medium"}
              />
            </Box>
            <GoogleAccountLink />
          </Box>
        </Box>
        <Box
          sx={{
            borderRadius: { xs: "24px", md: "24px" },
            padding: { xs: "16px 12px", sm: "20px 16px", md: "24px 18px" },
            width: "100%",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: { xs: "wrap", md: "nowrap" },
              gap: { xs: "12px", md: 0 },
            }}
          >
            {!showSetting && (
              <>
                <Box sx={{ width: { xs: "100%", md: "50%" } }}>
                  <Tab
                    tabList={tabList}
                    currentTab={currentTab}
                    onChangeTab={(tab) => setCurrentTab(tab)}
                  />
                </Box>

                {currentTab === "My Vacations" && checkPermission("vacation:write") && (
                  <Button 
                    onClick={handleOnShowModal} 
                    variant="contained"
                    sx={{ 
                      width: { xs: "100%", md: "auto" },
                      mt: { xs: 1, md: 0 }
                    }}
                  >
                    Add Request
                  </Button>
                )}
              </>
            )}
          </Box>
          {currentTab === "Projects" && <ProjectSection />}
          {currentTab === "Team" && <TeamSection />}
          {currentTab === "My Vacations" && checkPermission("vacation:read") && <VacationSection />}
          {currentTab === "Permissions" && <PermissionsSection />}
          {showSetting && <ProfileSetting />}
        </Box>
      </Box>
      <Modal onClose={handleOnCloseModal} show={showModal}>
        <VacationForm onClose={handleOnCloseModal} />
      </Modal>
    </Box>
  );
};

export default ProfilePage;
