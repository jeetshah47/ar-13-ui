import { Box, Button, SvgIcon, TextField, Typography } from "@mui/material";
import CrossIcon from "../../../assets/icons/general/calendar-6.svg?react";
import PlusIcon from "../../../assets/icons/general/plus.svg?react";
type EmployeeCardProps = {
  onClose: () => void;
};

const EmployeeForm = ({ onClose }: EmployeeCardProps) => {
  return (
    <Box
      sx={{
        background: "#FFFFFF",
        boxShadow: "0px 6px 58px rgba(121, 145, 173, 0.195504)",
        borderRadius: "24px",
        padding: "28px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingY: "30px",
          width: "584px",
        }}
      >
        <Typography fontWeight={"bold"} variant="h6">
          Add Employee
        </Typography>
        <Box
          sx={{
            background: "#F4F9FD",
            borderRadius: "14px",
            display: "flex",
            padding: "8px",
            cursor: "pointer",
          }}
          // onClick={(handleCrossClick)}
        >
          <SvgIcon fontSize="small" component={CrossIcon} onClick={onClose} />
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <img src="/illustration/invite.svg" alt="invite member" />
      </Box>
      <Box>
        <Box sx={{ width: "100%", paddingTop: "10px" }}>
          <Typography
            color="secondary"
            sx={{ fontWeight: "bold", fontSize: "14px" }}
          >
            Member's Email
          </Typography>
          <TextField
            sx={{ width: "100%", paddingTop: "7px" }}
            placeholder="Enter Member's Email"
          />
        </Box>
        <Box sx={{ display: "flex", gap: "8px", paddingTop: "10px" }}>
          <SvgIcon sx={{ color: "primary.main" }} component={PlusIcon} />
          <Typography sx={{ color: "primary.main" }}>
            Add Other Members
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            flex: 1,
            justifyContent: "end",
            paddingY: "12px",
            alignItems: "center",
          }}
        >
          <Button variant="contained">Approve</Button>
        </Box>
      </Box>
    </Box>
  );
};

export default EmployeeForm;
