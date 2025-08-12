import { Avatar, Box, Typography } from "@mui/material";

const TeamSection = () => {
  const TeamMemberCard = () => (
    <Box
      sx={{
        backgroundColor: "#fff",
        borderRadius: "24px",
        paddingY: "18px",
        paddingX: "36px",
        // width: "180px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Avatar sizes="48px" />
      <Typography
        variant="subtitle1"
        sx={{ fontWeight: "bold", paddingY: "3px" }}
      >
        Shawn Stone
      </Typography>
      <Typography variant="subtitle2">UI/UX Designer</Typography>
      <Box
        sx={{
          border: "1px solid #7D8592",
          borderRadius: "4px",
          padding: "3px",
        }}
      >
        <Typography fontSize={"12px"} color="secondary.main">
          Middle
        </Typography>
      </Box>
    </Box>
  );
  return (
    <Box sx={{ display: "flex", gap: "16px", flexWrap: "wrap", padding: "12px 0" }}>
      <TeamMemberCard />
      <TeamMemberCard />
      <TeamMemberCard />
      <TeamMemberCard />
      <TeamMemberCard />
    </Box>
  );
};

export default TeamSection;
