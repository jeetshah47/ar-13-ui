import { IconButton, Tooltip } from "@mui/material";
import { Brightness4, Brightness7 } from "@mui/icons-material";
import { useTheme } from "../../../contexts/ThemeContext";

const ThemeToggle = () => {
  const { mode, toggleTheme } = useTheme();

  return (
    <Tooltip title={mode === "light" ? "Switch to dark mode" : "Switch to light mode"}>
      <IconButton
        onClick={toggleTheme}
        sx={{
          color: "text.primary",
          "&:hover": {
            backgroundColor: "action.hover",
          },
        }}
      >
        {mode === "light" ? <Brightness4 /> : <Brightness7 />}
      </IconButton>
    </Tooltip>
  );
};

export default ThemeToggle;

