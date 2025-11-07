import { useState } from "react";
import { Box, Button, SvgIcon, TextField, Typography, Select, MenuItem, FormControl, OutlinedInput } from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";
import CloseIcon from "../../../assets/icons/general/close/blue.svg?react";

type SupportModalProps = {
  onClose: () => void;
};

const SupportModal = ({ onClose }: SupportModalProps) => {
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");

  const handleSubjectChange = (event: SelectChangeEvent) => {
    setSubject(event.target.value);
  };

  const handleDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(event.target.value);
  };

  const handleSendRequest = () => {
    // Handle send request logic here
    // TODO: Implement actual support request submission
    onClose();
  };

  return (
    <Box
      sx={(theme) => ({
        background: theme.palette.background.paper,
        boxShadow: theme.shadows[6],
        borderRadius: "24px",
        padding: "28px",
        width: "584px",
        height: "824px",
        position: "relative",
      })}
    >
      {/* Close Button */}
      <Box
        sx={{
          position: "absolute",
          top: "28px",
          right: "28px",
          background: (theme) => theme.palette.grey[50],
          borderRadius: "14px",
          display: "flex",
          padding: "8px",
          cursor: "pointer",
        }}
        onClick={onClose}
      >
        <SvgIcon fontSize="small" component={CloseIcon} />
      </Box>

      {/* Title */}
      <Typography
        sx={(theme) => ({
          fontFamily: "Nunito Sans",
          fontWeight: 700,
          fontSize: "22px",
          color: theme.palette.text.primary,
          marginTop: "30px",
          marginBottom: "8px",
        })}
      >
        Need some Help?
      </Typography>

      {/* Description */}
      <Typography
        sx={(theme) => ({
          fontFamily: "Nunito Sans",
          fontWeight: 400,
          fontSize: "16px",
          color: theme.palette.text.primary,
          opacity: 0.7,
          marginBottom: "32px",
        })}
      >
        Describe your question and our specialists will answer you within 24 hours.
      </Typography>

      {/* Request Subject Dropdown */}
      <Box sx={{ marginBottom: "24px" }}>
        <Typography
          sx={(theme) => ({
            fontFamily: "Nunito Sans",
            fontWeight: 600,
            fontSize: "14px",
            color: theme.palette.text.primary,
            marginBottom: "8px",
          })}
        >
          Request Subject
        </Typography>
        <FormControl sx={{ width: "100%" }}>
          <Select
            value={subject}
            onChange={handleSubjectChange}
            displayEmpty
            input={<OutlinedInput />}
            sx={{
              width: "100%",
              height: "56px",
              borderRadius: "14px",
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: (theme) => theme.palette.grey[300],
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: (theme) => theme.palette.grey[300],
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: (theme) => theme.palette.primary.main,
              },
            }}
          >
            <MenuItem value="">
              <em>Technical difficulties</em>
            </MenuItem>
            <MenuItem value="technical">Technical difficulties</MenuItem>
            <MenuItem value="billing">Billing issues</MenuItem>
            <MenuItem value="feature">Feature request</MenuItem>
            <MenuItem value="bug">Bug report</MenuItem>
            <MenuItem value="other">Other</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Description Text Field */}
      <Box sx={{ marginBottom: "32px" }}>
        <Typography
          sx={(theme) => ({
            fontFamily: "Nunito Sans",
            fontWeight: 600,
            fontSize: "14px",
            color: theme.palette.text.primary,
            marginBottom: "8px",
          })}
        >
          Description
        </Typography>
        <TextField
          multiline
          rows={6}
          value={description}
          onChange={handleDescriptionChange}
          placeholder="Add some description of the request"
          sx={{
            width: "100%",
            "& .MuiOutlinedInput-root": {
              borderRadius: "14px",
              "& fieldset": {
                borderColor: (theme) => theme.palette.grey[300],
              },
              "&:hover fieldset": {
                borderColor: (theme) => theme.palette.grey[300],
              },
              "&.Mui-focused fieldset": {
                borderColor: (theme) => theme.palette.primary.main,
              },
            },
            "& .MuiInputBase-input": {
              fontFamily: "Nunito Sans",
              fontSize: "14px",
              color: (theme) => theme.palette.text.primary,
            },
            "& .MuiInputBase-input::placeholder": {
              fontFamily: "Nunito Sans",
              fontSize: "14px",
              color: (theme) => theme.palette.text.secondary,
              opacity: 1,
            },
          }}
        />
      </Box>

      {/* Send Request Button */}
      <Button
        variant="contained"
        onClick={handleSendRequest}
        sx={{
          width: "100%",
          height: "56px",
          background: "#3F8CFF",
          borderRadius: "14px",
          boxShadow: "0px 6px 12px 0px rgba(63, 140, 255, 0.26)",
          fontFamily: "Nunito Sans",
          fontWeight: 600,
          fontSize: "16px",
          textTransform: "none",
          "&:hover": {
            background: "#2E7BFF",
          },
        }}
      >
        Send Request
      </Button>

      {/* Illustration */}
      <Box
        sx={{
          position: "absolute",
          bottom: "28px",
          right: "28px",
          width: "120px",
          height: "120px",
          background: (theme) => theme.palette.mode === "dark" 
            ? `linear-gradient(135deg, ${theme.palette.grey[50]} 0%, ${theme.palette.primary.light} 100%)`
            : "linear-gradient(135deg, #F4F9FD 0%, #E8F2FF 100%)",
          borderRadius: "20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography
          sx={{
            fontFamily: "Nunito Sans",
            fontWeight: 600,
            fontSize: "14px",
            color: "#3F8CFF",
            textAlign: "center",
          }}
        >
          Support
        </Typography>
      </Box>
    </Box>
  );
};

export default SupportModal;
