import { Box, Button, SvgIcon, TextField, Typography } from "@mui/material";
import PageHeader from "../../../common/components/PageHeader/PageHeader";
import Icon1 from "../../../assets/icons/project/Image-1.svg?react";
import Icon2 from "../../../assets/icons/project/Image-2.svg?react";
import Icon3 from "../../../assets/icons/project/Image-3.svg?react";
import Icon4 from "../../../assets/icons/project/Image-4.svg?react";
import Icon5 from "../../../assets/icons/project/Image-5.svg?react";
import Icon6 from "../../../assets/icons/project/Image-6.svg?react";
import Icon7 from "../../../assets/icons/project/Image-7.svg?react";
import Icon8 from "../../../assets/icons/project/Image-8.svg?react";
import Icon9 from "../../../assets/icons/project/Image-9.svg?react";
import Icon10 from "../../../assets/icons/project/Image-10.svg?react";
import Icon from "../../../assets/icons/project/Image.svg?react";

const AddProject = () => {
  const arrayIcons = [
    Icon,
    Icon1,
    Icon2,
    Icon3,
    Icon4,
    Icon5,
    Icon6,
    Icon7,
    Icon8,
    Icon9,
    Icon10,
  ];
  return (
    <Box
      sx={{
        backgroundColor: "white",
        padding: "24px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <PageHeader title="Add Project" />
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyItems: "center",
          gap: "24px",
          width: "100%",
        }}
      >
        <Box sx={{ width: "50%", padding: "12px 16px" }}>
          <Box sx={{ width: "100%", paddingTop: "16px" }}>
            <Typography color="secondary" sx={{ fontWeight: "bold" }}>
              Project Name
            </Typography>
            <TextField
              sx={{ width: "100%" }}
              placeholder="Enter Project Name"
            />
          </Box>
          <Box sx={{ width: "100%", paddingTop: "16px" }}>
            <Typography color="secondary" sx={{ fontWeight: "bold" }}>
              Start Date
            </Typography>
            <TextField
              sx={{ width: "100%" }}
              placeholder="Enter Project Name"
            />
          </Box>
          <Box sx={{ width: "100%", paddingTop: "16px" }}>
            <Typography color="secondary" sx={{ fontWeight: "bold" }}>
              End Date
            </Typography>
            <TextField
              sx={{ width: "100%" }}
              placeholder="Enter Project Name"
            />
          </Box>
          <Box sx={{ width: "100%", paddingTop: "16px" }}>
            <Typography color="secondary" sx={{ fontWeight: "bold" }}>
              Priority
            </Typography>
            <TextField
              sx={{ width: "100%" }}
              placeholder="Enter Project Name"
            />
          </Box>
          <Box sx={{ width: "100%", paddingTop: "16px" }}>
            <Typography color="secondary" sx={{ fontWeight: "bold" }}>
              Description
            </Typography>
            <TextField
              sx={{ width: "100%" }}
              placeholder="Enter Project Name"
            />
          </Box>
        </Box>
        <Box
          sx={{
            background: "rgba(255, 255, 255, 0.118253)",
            border: "1px solid #CED5E0",
            borderRadius: "24px",
            padding: "24px",
            width: "30%",
          }}
        >
          <Typography sx={{ fontSize: "18px", fontWeight: "bold" }}>
            Select image
          </Typography>
          <Typography color="secondary" sx={{padding: "12px 0px"}}>
            Select or upload an avatar for the project (available formats: jpg,
            png)
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
            {arrayIcons.map((icon) => (
              <SvgIcon
                sx={{ width: "48px", height: "48px" }}
                component={icon}
              />
            ))}
          </Box>
        </Box>
      </Box>
      <Box>
        <Button variant="contained">Save Project</Button>
      </Box>
    </Box>
  );
};

export default AddProject;
