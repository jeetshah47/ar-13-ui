import {
  Box,
  CircularProgress,
  Typography,
  type CircularProgressProps,
} from "@mui/material";
import StatusTag from "../../../common/components/StatusTag/StatusTag";

const VacationSection = () => {
  const CircularProgressCust = (
    props: CircularProgressProps & { value: number }
  ) => (
    <Box sx={{ position: "relative", display: "inline-flex" }}>
      <CircularProgress variant="determinate" size={"72px"} {...props} />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography
          variant="caption"
          component="div"
          sx={{ color: "text.secondary" }}
        >{`${props.value}`}</Typography>
      </Box>
    </Box>
  );

  const VacationCard = () => (
    <Box
      sx={{
        backgroundColor: "#fff",
        borderRadius: "24px",
        padding: "24px",
        width: "100%",
      }}
    >
      <CircularProgressCust value={15} />
      <Typography>Vacation</Typography>
      <Typography color="secondary.main">12/16 days available</Typography>
    </Box>
  );

  const RequestCard = () => (
    <Box
      sx={{
        display: "flex",
        borderRadius: "24px",
        padding: "22px 28px",
        backgroundColor: "#fff",
        justifyContent: "space-between",
        marginTop: "10px",
      }}
    >
      <Box>
        <Typography fontSize={"14px"} color="secondary.main">
          Request Type
        </Typography>
        <Typography fontWeight={700}>Sick Leave</Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          width: "70%",
        }}
      >
        <Box>
          <Typography fontSize={"14px"} color="secondary.main">
            Duration
          </Typography>
          <Typography>3 Days</Typography>
        </Box>
        <Box>
          <Typography fontSize={"14px"} color="secondary.main">
            Start Day
          </Typography>
          <Typography>Sep 13, 2025</Typography>
        </Box>
        <Box>
          <Typography fontSize={"14px"} color="secondary.main">
            End Day
          </Typography>
          <Typography>Sep 16, 2025</Typography>
        </Box>
        <Box>
          <StatusTag status="pending" />
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ padding: "12px 0px" }}>
      <Box
        sx={{
          gap: "16px",
          display: "flex",
        }}
      >
        <VacationCard />
        <VacationCard />
        <VacationCard />
      </Box>
      <Box sx={{ paddingY: "16px" }}>
        <Typography fontSize={"22px"} fontWeight={700}>
          My Requests
        </Typography>
        <RequestCard />
        <RequestCard />
      </Box>
    </Box>
  );
};

export default VacationSection;
