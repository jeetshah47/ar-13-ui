import { Avatar, Box, Typography } from "@mui/material";

const ActivitySection = () => {
  const EmpTrackCard = () => (
    <Box
      sx={{
        background: "#FFFFFF",
        boxShadow: "0px 6px 58px rgba(196, 203, 214, 0.103611)",
        borderRadius: "24px",
        padding: "8px",
        width: "265px",
      }}
    >
      <Box
        sx={{
          background: "#F4F9FD",
          borderRadius: "16px",
          padding: "16px 0px",
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <Avatar sx={{ width: "50px", height: "50px" }} />
        <Typography fontWeight={700}>Shawn Stone</Typography>
        <Typography>UI/UX</Typography>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Box sx={{textAlign: "center"}}>
          <Typography>0</Typography>
          <Typography color="secondary.main" fontSize={"14px"}>
            Backlog Tasks
          </Typography>
        </Box>
        <Box sx={{textAlign: "center"}}>
          <Typography>16</Typography>
          <Typography color="secondary.main" fontSize={"14px"}>
            Tasks In Progress
          </Typography>
        </Box>
        <Box sx={{textAlign: "center"}}>
          <Typography>5</Typography>
          <Typography color="secondary.main" fontSize={"14px"}>
            Task In Review
          </Typography>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
      <EmpTrackCard />
      <EmpTrackCard />
      <EmpTrackCard />
      <EmpTrackCard />
      <EmpTrackCard />
      <EmpTrackCard />
      <EmpTrackCard />
      <EmpTrackCard />
    </Box>
  );
};

export default ActivitySection;
