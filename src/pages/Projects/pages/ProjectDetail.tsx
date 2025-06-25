import { Box, Link, SvgIcon } from "@mui/material";
import LeftIcon from "../../../assets/icons/general/left.svg?react";

const ProjectDetail = () => {
  return (
    <Box>
      <Link sx={{alignItems: 'center', display: "flex"}}>
        <SvgIcon component={LeftIcon} /> Back to Projects
      </Link>
    </Box>
  );
};

export default ProjectDetail;
