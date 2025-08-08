import {
  Avatar,
  AvatarGroup,
  Box,
  Link,
  SvgIcon,
  Typography,
} from "@mui/material";
import LeftIcon from "../../../assets/icons/general/left.svg?react";
import FilterIcon from "../../../assets/icons/general/calendar-5.svg?react";
import YellowArrow from "../../../assets/icons/general/calendar-23.svg?react";
import CalendarIcon from "../../../assets/icons/sidebar/calendar/inactive.svg?react";
import AttachmentIcon from "../../../assets/icons/general/calendar-19.svg?react";
import FilesIcon from "../../../assets/icons/general/calendar-20.svg?react";
import UploadIcon from "../../../assets/icons/general/upload.svg?react";
import Chips from "../../../common/components/Chips/Chips";
import { useState } from "react";
import defaultTheme from "../../../theme";

const ProjectDetail = () => {
  const [currentStatus, setCurrentStatus] = useState("pending");
  return (
    <Box sx={{ height: "100%" }}>
      <Link sx={{ alignItems: "center", display: "flex" }}>
        <SvgIcon component={LeftIcon} /> Back to Projects
      </Link>
      <Box
        sx={{
          paddingTop: "28px",
          display: "flex",
          gap: "28px",
          height: "100%",
        }}
      >
        <Box
          sx={{
            width: "265px",
            background: "#FFFFFF",
            borderRadius: "24px",
            boxShadow: "0px 6px 58px rgba(196, 203, 214, 0.103611)",
            height: "100%",
            padding: "18px",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography color="secondary">Project Number</Typography>
            <Box
              sx={{
                backgroundColor: "#F4F9FD",
                display: "flex",
                padding: "10px",
              }}
            >
              <SvgIcon component={FilterIcon} />
            </Box>
          </Box>
          <Box sx={{ paddingTop: "24px" }}>
            <Typography variant="h6">Description</Typography>
            <Typography color="secondary.main">
              App for maintaining your medical record, making appointments with
              a doctor, storing prescriptions
            </Typography>
            <Box sx={{ paddingTop: "10px" }}>
              <Typography color="secondary.main" fontSize={"16px"}>
                Reporter
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <Avatar sx={{ width: "24px", height: "24px" }} />
                <Typography>Evan Yates</Typography>
              </Box>
            </Box>
            <Box sx={{ paddingTop: "10px" }}>
              <Typography color="secondary.main">Assignes</Typography>
              <AvatarGroup sx={{ justifyContent: "start" }} spacing="medium">
                <Avatar
                  sx={{ width: "24px", height: "24px" }}
                  alt="Remy Sharp"
                  src="/static/images/avatar/1.jpg"
                />
                <Avatar
                  sx={{ width: "24px", height: "24px" }}
                  alt="Travis Howard"
                  src="/static/images/avatar/2.jpg"
                />
                <Avatar
                  sx={{ width: "24px", height: "24px" }}
                  alt="Cindy Baker"
                  src="/static/images/avatar/3.jpg"
                />
              </AvatarGroup>
            </Box>
            <Box sx={{ paddingTop: "10px" }}>
              <Typography color="secondary.main">Priority</Typography>
              <Box sx={{ display: "flex", gap: "4px" }}>
                <SvgIcon component={YellowArrow} />
                <Typography color="#FFBD21">Medium</Typography>
              </Box>
            </Box>
            <Box sx={{ paddingTop: "10px" }}>
              <Typography color="secondary.main">Dead Line</Typography>
              <Typography>Feb 23,2025</Typography>
            </Box>
            <Box
              sx={{
                paddingTop: "10px",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <SvgIcon component={CalendarIcon} />
              <Typography variant="subtitle2" color="secondary.main">
                Created May 28, 2020
              </Typography>
            </Box>
            <Box
              sx={{
                paddingTop: "15px",
                display: "flex",
                gap: "16px",
              }}
            >
              <Box
                sx={{
                  backgroundColor: "#6D5DD315",
                  padding: "10px",
                  borderRadius: "14px",
                  display: "flex",
                }}
              >
                <SvgIcon component={AttachmentIcon} />
              </Box>
              <Box
                sx={{
                  backgroundColor: "#6D5DD315",
                  padding: "10px",
                  borderRadius: "14px",
                  display: "flex",
                }}
              >
                <SvgIcon component={FilesIcon} />
              </Box>
            </Box>
          </Box>
        </Box>
        <Box sx={{ width: "100%" }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              pb: "24px",
            }}
          >
            <Typography>Task Details</Typography>
            <Box
              sx={{
                backgroundColor: "#fff",
                display: "flex",
                padding: "10px",
                borderRadius: "14px",
              }}
            >
              <SvgIcon component={FilterIcon} />
            </Box>
          </Box>
          <Box
            sx={{
              backgroundColor: "#fff",
              height: "100%",
              borderRadius: "24px",
              padding: "30px",
            }}
          >
            <Typography color="secondary.main">PN00000125</Typography>
            <Box
              sx={{
                paddingTop: "4px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Typography variant="h6" fontWeight={"700"}>
                UX Login + Registration
              </Typography>
              <Box sx={{}}>
                <Chips
                  selected={currentStatus}
                  onChange={(status) => setCurrentStatus(status)}
                />
              </Box>
            </Box>
            <Box sx={{ paddingTop: "16px" }}>
              <Typography>
                Think over UX for Login and Registration, create a flow using
                wireframes. Upon completion, show the team and discuss. Attach
                the source to the task.
              </Typography>
              <Typography color="secondary.main" fontWeight={"700"}>
                Task Attachment
              </Typography>
              <Box
                sx={{
                  paddingTop: "8px",
                  display: "flex",
                  alignContent: "center",
                  gap: "16px",
                }}
              >
                <Box
                  sx={{
                    width: "156px",
                    height: "144px",
                    backgroundImage: "url(/src/assets/attachment/image.png)",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                    borderRadius: "14px",
                  }}
                >
                  <Box
                    sx={{
                      backgroundColor: "#2155A316",
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      position: "relative",
                      borderRadius: "14px",
                    }}
                  >
                    <Box
                      sx={{
                        backgroundColor: "#F5F8FC",
                        padding: "10px",
                        borderRadius: "14px",
                        display: "flex",
                        position: "absolute",
                        margin: "5px",
                        top: 0,
                        right: 0,
                      }}
                    >
                      <SvgIcon component={AttachmentIcon} />
                    </Box>
                    <Box
                      sx={{
                        position: "absolute",
                        bottom: "1px",
                        left: 0,
                        backgroundColor: "#fff",
                        borderRadius: "12px",
                        width: "100%",
                        textAlign: "center",
                      }}
                    >
                      <Typography fontSize={"12px"} fontWeight={"700"}>
                        wireframes.png
                      </Typography>
                      <Typography fontSize={"12px"} color="secondary.main">
                        Sep 22, 2020 | 10:52 AM
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                <Box
                  sx={{
                    width: "156px",
                    height: "144px",
                    backgroundImage: "url(/src/assets/attachment/image-2.png)",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                    borderRadius: "14px",
                  }}
                >
                  <Box
                    sx={{
                      backgroundColor: "#2155A316",
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      position: "relative",
                      borderRadius: "14px",
                    }}
                  >
                    <Box
                      sx={{
                        backgroundColor: "#F5F8FC",
                        padding: "10px",
                        borderRadius: "14px",
                        display: "flex",
                        position: "absolute",
                        margin: "5px",
                        top: 0,
                        right: 0,
                      }}
                    >
                      <SvgIcon component={AttachmentIcon} />
                    </Box>
                    <Box
                      sx={{
                        position: "absolute",
                        bottom: "1px",
                        left: 0,
                        backgroundColor: "#fff",
                        borderRadius: "12px",
                        width: "100%",
                        textAlign: "center",
                      }}
                    >
                      <Typography fontSize={"12px"} fontWeight={"700"}>
                        site screens.png
                      </Typography>
                      <Typography fontSize={"12px"} color="secondary.main">
                        Sep 19, 2020 | 10:52 AM
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Box>
            <Box
              sx={{
                borderTop: "1px solid #E4E6E8",
                marginTop: "16px",
                paddingTop: "28px",
              }}
            >
              <Typography fontWeight={700}>Recent Activity</Typography>
              <Box>
                <Box sx={{ display: "flex", gap: "16px", paddingY: "12px" }}>
                  <Avatar sx={{ width: "50px", height: "50px" }} />
                  <Box>
                    <Typography fontWeight={700}>Oscar Holloway</Typography>
                    <Typography color="secondary.main">
                      UI/UX Designer
                    </Typography>
                  </Box>
                </Box>
                <Box
                  sx={{
                    background: "#F4F9FD",
                    borderRadius: "14px",
                    padding: "15px 20px",
                    width: "fit-content",
                    display: "flex",
                    marginTop: "12px",
                  }}
                >
                  <SvgIcon component={UploadIcon} />
                  <Typography>
                    Updated the status of Mind Map task to{" "}
                    <span
                      style={{
                        color: defaultTheme.palette.primary.main,
                        fontWeight: 700,
                      }}
                    >
                      {" "}
                      In Progress
                    </span>
                  </Typography>
                </Box>
                <Box
                  sx={{
                    background: "#F4F9FD",
                    borderRadius: "14px",
                    padding: "15px 20px",
                    width: "fit-content",
                    display: "flex",
                    marginTop: "12px",
                  }}
                >
                  <SvgIcon component={AttachmentIcon} />
                  <Typography>Attach Files To Mind Map task to </Typography>
                </Box>
              </Box>
              <Box>
                <Box sx={{ display: "flex", gap: "16px", paddingY: "12px" }}>
                  <Avatar sx={{ width: "50px", height: "50px" }} />
                  <Box>
                    <Typography fontWeight={700}>Emily Tyler</Typography>
                    <Typography color="secondary.main">
                      UI/UX Designer
                    </Typography>
                  </Box>
                </Box>
                <Box
                  sx={{
                    background: "#F4F9FD",
                    borderRadius: "14px",
                    padding: "15px 20px",
                    width: "fit-content",
                    display: "flex",
                    marginTop: "12px",
                  }}
                >
                  <SvgIcon component={UploadIcon} />
                  <Typography>
                    Updated the status of Mind Map task to{" "}
                    <span
                      style={{
                        color: defaultTheme.palette.primary.main,
                        fontWeight: 700,
                      }}
                    >
                      {" "}
                      In Progress
                    </span>
                  </Typography>
                </Box>
                <Box
                  sx={{
                    background: "#F4F9FD",
                    borderRadius: "14px",
                    padding: "15px 20px",
                    width: "fit-content",
                    display: "flex",
                    marginTop: "12px",
                  }}
                >
                  <SvgIcon component={AttachmentIcon} />
                  <Typography>Attach Files To Mind Map task to </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
        {/* <Box
          sx={{
            width: "265px",
            background: "#FFFFFF",
            borderRadius: "24px",
            boxShadow: "0px 6px 58px rgba(196, 203, 214, 0.103611)",
            height: "100%",
          }}
        ></Box> */}
      </Box>
    </Box>
  );
};

export default ProjectDetail;
