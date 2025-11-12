import { Box, Button, SvgIcon, TextField, Typography } from "@mui/material";
import CrossIcon from "../../../assets/icons/general/calendar-6.svg?react";
import PlusIcon from "../../../assets/icons/general/plus.svg?react";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../store/store";
import { inviteEmployeeAction } from "../../../store/features/employees/employeeActions";
import { MSG_INVALID_EMAIL } from "../../../constants/messages";

type EmployeeCardProps = {
  onClose: () => void;
};

const EmployeeForm = ({ onClose }: EmployeeCardProps) => {
  const dispatch = useAppDispatch();
  const inviting = useAppSelector((s) => s.employeeReducer.inviting) ?? false;
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  const validateEmail = (emailValue: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(emailValue);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    
    // Clear error when user starts typing
    if (emailError) {
      setEmailError("");
    }
  };

  const handleEmailBlur = () => {
    if (email.trim() && !validateEmail(email.trim())) {
      setEmailError(MSG_INVALID_EMAIL);
    } else {
      setEmailError("");
    }
  };

  const handleInvite = () => {
    const trimmedEmail = email.trim();
    
    if (!trimmedEmail) {
      setEmailError("Email is required");
      return;
    }
    
    if (!validateEmail(trimmedEmail)) {
      setEmailError(MSG_INVALID_EMAIL);
      return;
    }
    
    setEmailError("");
    dispatch(inviteEmployeeAction(trimmedEmail, onClose));
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleInvite();
    }
  };
  return (
    <Box
      sx={(theme) => ({
        background: theme.palette.background.paper,
        boxShadow: theme.shadows[6],
        borderRadius: "24px",
        padding: "28px",
      })}
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
          sx={(theme) => ({
            background: theme.palette.grey[50],
            borderRadius: "14px",
            display: "flex",
            padding: "8px",
            cursor: "pointer",
          })}
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
            value={email}
            onChange={handleEmailChange}
            onBlur={handleEmailBlur}
            onKeyDown={handleKeyDown}
            error={Boolean(emailError)}
            helperText={emailError}
            type="email"
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
          <Button 
            variant="contained" 
            disabled={inviting || !email.trim() || Boolean(emailError)} 
            onClick={handleInvite}
          >
            {inviting ? "Sending..." : "Send Invite"}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default EmployeeForm;
