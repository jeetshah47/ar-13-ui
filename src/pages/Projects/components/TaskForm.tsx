import { Box, IconButton, TextField, Typography } from "@mui/material";
import Crossicon from "../../../assets/icons/general/close/blue.svg?react";

const TaskForm = () => {
  return (
    <Box
      sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        backgroundColor: "white",
        p: 4,
        boxShadow: "0px 6px 58px rgba(121, 145, 173, 0.195504)",
        borderRadius: "24px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography sx={{ fontWeight: "bold" }}>Add task</Typography>
        <IconButton>
          <Crossicon />
        </IconButton>
      </Box>
      <Box sx={{ height: "80%", overflowY: "auto", display: "flex", flexDirection: "column" }}>
        <Box>
          <Box sx={{ width: "100%", paddingTop: "16px" }}>
            <Typography
              color="secondary"
              sx={{ fontWeight: "bold", fontSize: "14px" }}
            >
              Task Name
            </Typography>
            <TextField
              sx={{ width: "100%" }}
              placeholder="Enter Project Name"
            />
          </Box>
          <Box sx={{ width: "100%", paddingTop: "16px" }}>
            <Typography
              color="secondary"
              sx={{ fontWeight: "bold", fontSize: "14px" }}
            >
              Task Name
            </Typography>
            <TextField
              sx={{ width: "100%" }}
              placeholder="Enter Project Name"
            />
          </Box>
        </Box>
        <Box sx={{ display: "flex", gap: "16px" }}>
          <Box sx={{ width: "100%", paddingTop: "16px" }}>
            <Typography
              color="secondary"
              sx={{ fontWeight: "bold", fontSize: "14px" }}
            >
              Estimate
            </Typography>
            <TextField
              sx={{ width: "100%" }}
              placeholder="Enter Project Name"
            />
          </Box>
          <Box sx={{ width: "100%", paddingTop: "16px" }}>
            <Typography
              color="secondary"
              sx={{ fontWeight: "bold", fontSize: "14px" }}
            >
              Dead Line
            </Typography>
            <TextField
              sx={{ width: "100%" }}
              placeholder="Enter Project Name"
            />
          </Box>
        </Box>
        <Box>
          <Box sx={{ width: "100%", paddingTop: "16px" }}>
            <Typography
              color="secondary"
              sx={{ fontWeight: "bold", fontSize: "14px" }}
            >
              Task Name
            </Typography>
            <TextField
              sx={{ width: "100%" }}
              placeholder="Enter Project Name"
            />
          </Box>
          <Box sx={{ width: "100%", paddingTop: "16px" }}>
            <Typography
              color="secondary"
              sx={{ fontWeight: "bold", fontSize: "14px" }}
            >
              Task Name
            </Typography>
            <TextField
              sx={{ width: "100%" }}
              placeholder="Enter Project Name"
            />
          </Box>
          <Box sx={{ width: "100%", paddingTop: "16px" }}>
            <Typography
              color="secondary"
              sx={{ fontWeight: "bold", fontSize: "14px" }}
            >
              Task Name
            </Typography>
            <TextField
              sx={{ width: "100%" }}
              placeholder="Enter Project Name"
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
/* elm/card/main */

export default TaskForm;
