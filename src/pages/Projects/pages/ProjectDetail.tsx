import {
  Avatar,
  AvatarGroup,
  Box,
  FormControl,
  InputLabel,
  Link,
  MenuItem,
  Select,
  SvgIcon,
  Typography,
} from "@mui/material";
import LeftIcon from "../../../assets/icons/general/left.svg?react";
import FilterIcon from "../../../assets/icons/general/calendar-5.svg?react";
import YellowArrow from "../../../assets/icons/general/calendar-23.svg?react";
import CalendarIcon from "../../../assets/icons/sidebar/calendar/inactive.svg?react";
import AttachmentIcon from "../../../assets/icons/general/calendar-19.svg?react";
import FilesIcon from "../../../assets/icons/general/calendar-20.svg?react";

const ProjectDetail = () => {
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
              height: "-webkit-fill-available",
              borderRadius: "24px",
              padding: "30px",
            }}
          >
            <Typography color="secondary.main">PN00000125</Typography>
            <Box
              sx={{
                paddingTop: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Typography variant="h6" fontWeight={"700"}>
                UX Login + Registration
              </Typography>
                <Select
                  sx={{
                    outline: "none",
                    border: "none",
                  }}
                  value={20}
                  displayEmpty
                  label="Age"
                >
                  <MenuItem value={10}>Ten</MenuItem>
                  <MenuItem value={20}>Twenty</MenuItem>
                  <MenuItem value={30}>Thirty</MenuItem>
                </Select>
            </Box>
          </Box>
        </Box>
        <Box
          sx={{
            width: "265px",
            background: "#FFFFFF",
            borderRadius: "24px",
            boxShadow: "0px 6px 58px rgba(196, 203, 214, 0.103611)",
            height: "100%",
          }}
        ></Box>
      </Box>
    </Box>
  );
};

export default ProjectDetail;
