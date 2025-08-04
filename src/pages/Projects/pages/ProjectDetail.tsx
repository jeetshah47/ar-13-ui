import { Box, Link, SvgIcon } from "@mui/material";
import LeftIcon from "../../../assets/icons/general/left.svg?react";

const ProjectDetail = () => {
  return (
    <Box sx={{ height: "100%"}}>
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
          }}
        ></Box>
        <Box sx={{ backgroundColor: "#fff", width: "100%"}}>
s
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
