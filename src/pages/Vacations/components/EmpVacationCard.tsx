import { Avatar, Box, Typography } from "@mui/material";

const EmpVacationCard = () => {
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
      <Box sx={{ display: "flex", gap: "28px" }}>
        <Box>
          <Typography color="secondary.main" fontSize={"14px"}>
            Vacations
          </Typography>
          <Typography>12</Typography>
        </Box>
        <Box>
          <Typography color="secondary.main" fontSize={"14px"}>
            Sick leaves
          </Typography>
          <Typography>5</Typography>
        </Box>

        <Box>
          <Typography color="secondary.main" fontSize={"14px"}>
            Work remotely
          </Typography>
          <Typography>15</Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default EmpVacationCard;
