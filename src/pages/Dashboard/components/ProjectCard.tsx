import { Avatar, Box, SvgIcon, Typography } from "@mui/material";
import CalenderIcon from "../../../assets/icons/general/calendar.svg?react";
import YellowArrow from "../../../assets/icons/general/calendar-23.svg?react";

const ProjectCard = () => {
  return (
    <Box sx={{ padding: "12px 0" }}>
      <Box
        sx={{
          borderRadius: "24px",
          boxShadow: "0px 6px 58px rgba(196, 203, 214, 0.103611)",
          backgroundColor: "white",
        }}
      >
        <Box sx={{ display: "flex" }}>
          <Box
            sx={{
              borderRight: "1px solid #E4E6E8",
              width: "50%",
              padding: "24px",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                paddingBottom: "14px",
              }}
            >
              <Avatar />
              <Box>
                <Typography color="secondary">PN0001265</Typography>
                <Typography variant="subtitle1" sx={{fontWeight: "bold"}}>
                  New Architect Project
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Box sx={{ display: "flex", gap: "6px" }}>
                <SvgIcon component={CalenderIcon} />
                <Typography color="secondary">Created Sep 12,2020</Typography>
              </Box>
              <Box sx={{ display: "flex", gap: "4px" }}>
                <SvgIcon component={YellowArrow} />
                <Typography color="#FFBD21">Medium</Typography>
              </Box>
            </Box>
          </Box>
          <Box sx={{ width: "50%", padding: "24px" }}>
            <Box sx={{ paddingBottom: "14px" }}>
              <Typography sx={{fontWeight: "bold"}}>Project Data</Typography>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Box>
                <Typography color="secondary">All Tasks</Typography>
                <Typography sx={{fontWeight: "bold"}}>34</Typography>
              </Box>
              <Box>
                <Typography color="secondary">Active Tasks</Typography>
                <Typography sx={{fontWeight: "bold"}}>34</Typography>
              </Box>
              <Box>
                <Typography color="secondary">Assignees</Typography>
                <Avatar />
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ProjectCard;
