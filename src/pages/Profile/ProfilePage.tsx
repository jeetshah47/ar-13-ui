import {
  Avatar,
  Box,
  Button,
  SvgIcon,
  TextField,
  Typography,
} from "@mui/material";
import PageHeader from "../../common/components/PageHeader/PageHeader";
import Tab from "../../common/components/Tab/Tab";
import { useState } from "react";
import ProjectSection from "./components/ProjectSection";
import TeamSection from "./components/TeamSection";
import VacationSection from "./components/VacationSection";
import Modal from "../../common/components/Modal/Modal";
import VacationForm from "./components/VacationForm";
import { ProfileSetting } from "./components/ProfileSetting";

const tabList = ["Projects", "Team", "My Vacations"];

const ProfilePage = () => {
  const [currentTab, setCurrentTab] = useState("Projects");
  const [showModal, setShowModal] = useState(false);
  const [showSetting, setShowSetting] = useState(false);

  const handleOnCloseModal = () => {
    setShowModal(false);
  };
  const handleOnShowModal = () => {
    setShowModal(true);
  };

  const handleShowSetting = () => {
    setShowSetting(true);
    setCurrentTab("");
  };

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
          padding: "28px 0px",
          display: "flex",
          gap: "16px",
          height: "100%",
        }}
      >
        <Box
          sx={{
            width: "264px",
            height: "100%",
            backgroundColor: "white",
            borderRadius: "24px",
            padding: "24px 18px",
          }}
        >
          <Avatar sx={{ width: "64px", height: "64px" }} />
          <Typography fontWeight={700} fontSize={"18px"}>
            Allen Perkins
          </Typography>
          <Typography fontSize={"14px"} color="secondary.main">
            UI/UX Designer
          </Typography>
          <Box sx={{ borderTop: "1px solid #E4E6E8", paddingTop: "26px" }}>
            <Typography fontWeight={700}>Main Info</Typography>
            <Box sx={{ width: "100%", paddingTop: "10px" }}>
              <Typography
                color="secondary"
                sx={{ fontWeight: "bold", fontSize: "14px" }}
              >
                Position
              </Typography>
              <TextField
                sx={{ width: "100%", paddingTop: "7px" }}
                placeholder="Enter Position Name"
              />
            </Box>
            <Box sx={{ width: "100%", paddingTop: "10px" }}>
              <Typography
                color="secondary"
                sx={{ fontWeight: "bold", fontSize: "14px" }}
              >
                Company
              </Typography>
              <TextField
                sx={{ width: "100%", paddingTop: "7px" }}
                placeholder="Enter Company Name"
              />
            </Box>
            <Box sx={{ width: "100%", paddingTop: "10px" }}>
              <Typography
                color="secondary"
                sx={{ fontWeight: "bold", fontSize: "14px" }}
              >
                Location
              </Typography>
              <TextField
                sx={{ width: "100%", paddingTop: "7px" }}
                placeholder="Enter Position Name"
              />
            </Box>
            <Typography fontWeight={700}>Contact Info</Typography>
            <Box sx={{ width: "100%", paddingTop: "10px" }}>
              <Typography
                color="secondary"
                sx={{ fontWeight: "bold", fontSize: "14px" }}
              >
                Email
              </Typography>
              <TextField
                sx={{ width: "100%", paddingTop: "7px" }}
                placeholder="Enter Email"
              />
            </Box>
            <Box sx={{ width: "100%", paddingTop: "10px" }}>
              <Typography
                color="secondary"
                sx={{ fontWeight: "bold", fontSize: "14px" }}
              >
                Contact Number
              </Typography>
              <TextField
                sx={{ width: "100%", paddingTop: "7px" }}
                placeholder="Enter Number"
              />
            </Box>
          </Box>
        </Box>
        <Box
          sx={{
            borderRadius: "24px",
            padding: "24px 18px",
            width: "100%",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {!showSetting && (
              <>
                <Box sx={{ width: "50%" }}>
                  <Tab
                    tabList={tabList}
                    currentTab={currentTab}
                    onChangeTab={(tab) => setCurrentTab(tab)}
                  />
                </Box>

                {currentTab === "My Vacations" && (
                  <Button onClick={handleOnShowModal} variant="contained">
                    Add Request
                  </Button>
                )}
              </>
            )}
          </Box>
          {currentTab === "Projects" && <ProjectSection />}
          {currentTab === "Team" && <TeamSection />}
          {currentTab === "My Vacations" && <VacationSection />}
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
