import { Avatar, Box, Typography } from "@mui/material";

const EmpCard = () => {
  return (
    <Box
      sx={{
        background: "#FFFFFF",
        boxShadow: "0px 6px 58px rgba(196, 203, 214, 0.103611)",
        borderRadius: "24px",
        padding: "20px 28px",
        display: "flex",
        justifyContent: "space-between",
        marginTop: "20px",
      }}
    >
      <Box sx={{ display: "flex", gap: "18px" }}>
        <Avatar sx={{ width: "50px", height: "50px" }} />
        <Box>
          <Typography>Ryan Thompson</Typography>
          <Typography color="secondary.main" fontSize={"14px"}>
            jeet.shah@vayana.com
          </Typography>
        </Box>
      </Box>
      <Box sx={{ gap: "20px" }}>
        <Typography fontSize={"14px"} color="secondary.main">
          Gender
        </Typography>
        <Typography>Male</Typography>
      </Box>
      <Box sx={{ gap: "20px" }}>
        <Typography fontSize={"14px"} color="secondary.main">
          Birthday
        </Typography>
        <Typography>Male</Typography>
      </Box>
      <Box sx={{ gap: "20px" }}>
        <Typography fontSize={"14px"} color="secondary.main">
          Full age
        </Typography>
        <Typography>Male</Typography>
      </Box>
      <Box sx={{ gap: "20px" }}>
        <Typography fontSize={"14px"} color="secondary.main">
          Position
        </Typography>
        <Typography>Male</Typography>
      </Box>
    </Box>
  );
};

export default EmpCard;
