import { useState } from "react";
import {
  Box,
  Button,
  SvgIcon,
  TextField,
  Typography,
  FormControl,
  OutlinedInput,
  MenuItem,
  Select,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";
import CloseIcon from "../../../assets/icons/general/close/blue.svg?react";

type AddFolderFormProps = {
  onClose: () => void;
  onAddFolder: (name: string, color: string) => void;
};

const folderColors = [
  { label: "Yellow/Beige", value: "#FFF7E3" },
  { label: "Green/Cyan", value: "#C1FFEE" },
  { label: "Purple", value: "#E7E3FD" },
  { label: "Blue/Cyan", value: "#C7F2FB" },
];

const AddFolderForm = ({ onClose, onAddFolder }: AddFolderFormProps) => {
  const [folderName, setFolderName] = useState("");
  const [selectedColor, setSelectedColor] = useState("#FFF7E3");
  const [error, setError] = useState("");

  const handleColorChange = (event: SelectChangeEvent) => {
    setSelectedColor(event.target.value);
  };

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFolderName(event.target.value);
    // Clear error when user starts typing
    if (error) {
      setError("");
    }
  };

  const handleSubmit = () => {
    if (!folderName.trim()) {
      setError("Folder name is required");
      return;
    }

    setError("");
    onAddFolder(folderName.trim(), selectedColor);
    onClose();
  };

  const handleClose = () => {
    setFolderName("");
    setSelectedColor("#FFF7E3");
    setError("");
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
        position: "relative",
      })}
    >
      {/* Close Button */}
        <Box
        sx={(theme) => ({
          position: "absolute",
          top: "28px",
          right: "28px",
          background: theme.palette.grey[50],
          borderRadius: "14px",
          display: "flex",
          padding: "8px",
          cursor: "pointer",
        })}
        onClick={handleClose}
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
          marginBottom: "32px",
        })}
      >
        Add Folder
      </Typography>

      {/* Folder Name Input */}
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
          Folder Name
        </Typography>
        <TextField
          value={folderName}
          onChange={handleNameChange}
          placeholder="Enter folder name"
          error={Boolean(error)}
          helperText={error}
          required
          sx={(theme) => ({
            width: "100%",
            "& .MuiOutlinedInput-root": {
              borderRadius: "14px",
              "& fieldset": {
                borderColor: theme.palette.grey[300],
              },
              "&:hover fieldset": {
                borderColor: theme.palette.grey[300],
              },
              "&.Mui-focused fieldset": {
                borderColor: theme.palette.primary.main,
              },
            },
            "& .MuiInputBase-input": {
              fontFamily: "Nunito Sans",
              fontSize: "14px",
              color: theme.palette.text.primary,
            },
            "& .MuiInputBase-input::placeholder": {
              fontFamily: "Nunito Sans",
              fontSize: "14px",
              color: theme.palette.text.secondary,
              opacity: 1,
            },
          })}
        />
      </Box>

      {/* Color Selection */}
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
          Folder Color
        </Typography>
        <FormControl sx={{ width: "100%" }}>
          <Select
            value={selectedColor}
            onChange={handleColorChange}
            input={<OutlinedInput />}
            sx={(theme) => ({
              width: "100%",
              height: "56px",
              borderRadius: "14px",
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: theme.palette.grey[300],
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: theme.palette.grey[300],
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: theme.palette.primary.main,
              },
            })}
            renderValue={(value) => {
              const color = folderColors.find((c) => c.value === value);
              return (
                <Box sx={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <Box
                    sx={{
                      width: "24px",
                      height: "24px",
                      borderRadius: "8px",
                      backgroundColor: value,
                      border: (theme) => `1px solid ${theme.palette.grey[300]}`,
                    }}
                  />
                  <Typography sx={{ fontFamily: "Nunito Sans", fontSize: "14px" }}>
                    {color?.label || "Select color"}
                  </Typography>
                </Box>
              );
            }}
          >
            {folderColors.map((color) => (
              <MenuItem key={color.value} value={color.value}>
                <Box sx={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <Box
                    sx={{
                      width: "24px",
                      height: "24px",
                      borderRadius: "8px",
                      backgroundColor: color.value,
                      border: (theme) => `1px solid ${theme.palette.grey[300]}`,
                    }}
                  />
                  <Typography sx={{ fontFamily: "Nunito Sans", fontSize: "14px" }}>
                    {color.label}
                  </Typography>
                </Box>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Action Buttons */}
      <Box
        sx={{
          display: "flex",
          gap: "12px",
          justifyContent: "flex-end",
        }}
      >
        <Button
          variant="outlined"
          onClick={handleClose}
          sx={{
            borderRadius: "14px",
            padding: "13px 20px",
            fontFamily: "Nunito Sans",
            fontWeight: 700,
            fontSize: "16px",
            textTransform: "none",
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!folderName.trim()}
          sx={{
            borderRadius: "14px",
            padding: "13px 20px",
            fontFamily: "Nunito Sans",
            fontWeight: 700,
            fontSize: "16px",
            textTransform: "none",
            boxShadow: (theme) => theme.shadows[4],
          }}
        >
          Create Folder
        </Button>
      </Box>
    </Box>
  );
};

export default AddFolderForm;
