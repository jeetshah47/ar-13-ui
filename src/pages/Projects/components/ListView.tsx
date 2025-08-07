import { Avatar, Box, CircularProgress, Typography } from "@mui/material";
import StatusTag from "../../../common/components/StatusTag/StatusTag";
import { blurAnimation } from "../../../common/animation/cssAnimation";

const ListView = () => {
  return (
    <Box
      sx={{
        backgroundColor: "white",
        padding: "22px 26px",
        borderRadius: "24px",
        display: "flex",
        justifyContent: "space-between",
        ...blurAnimation,
      }}
    >
      <Box>
        <Typography color="secondary">Task Name</Typography>
        <Typography>Research</Typography>
      </Box>
      <Box>
        <Typography color="secondary">Estimate</Typography>
        <Typography>2d 4h</Typography>
      </Box>
      <Box>
        <Typography color="secondary">Spent Time</Typography>
        <Typography>1d 2h</Typography>
      </Box>
      <Box>
        <Typography color="secondary">Assignee</Typography>
        <Avatar sx={{ width: "24px", height: "24px" }} />
      </Box>
      <Box>
        <Typography color="secondary">Priority</Typography>
        <Typography>Medium</Typography>
      </Box>
      <Box>
        <StatusTag status="progress" />
      </Box>
      <Box>
        <CircularProgress variant="determinate" value={25} />
      </Box>
    </Box>
  );
};

export default ListView;
