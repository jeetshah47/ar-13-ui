import { Box, Chip } from "@mui/material";

type ChipsProps = {
  selected: string;
  onChange: (status: string) => void;
};

const Chips = ({ selected, onChange }: ChipsProps) => {
  const colorMaps = {
    success: { bg: "#E0F9F2", text: "#00D097" },
    pending: { bg: "rgba(125,133,146,14%)", text: "#7D8592" },
    progress: { bg: "rgba(63,140,255,11.99%)", text: "#3F8CFF" },
    review: { bg: "rgba(196,24,230,11%)", text: "#C418E6" },
  };

  const handleChangeStatus = (status: string) => {
    onChange(status);
  };

  return (
    <Box sx={{ display: "flex", gap: "10px", alignItems: "center" }}>
      <Chip
        label="Pending"
        sx={{
          color: selected === "pending" ? colorMaps["pending"].text : "",
          backgroundColor:
            selected === "pending" ? colorMaps["pending"].bg : "",
        }}
        variant={selected === "pending" ? "filled" : "outlined"}
        onClick={() => handleChangeStatus("pending")}
      />
      <Chip
        label="In Progress"
        sx={{
          color: selected === "progress" ? colorMaps["progress"].text : "",
          backgroundColor:
            selected === "progress" ? colorMaps["progress"].bg : "",
        }}
        variant={selected === "progress" ? "filled" : "outlined"}
        onClick={() => handleChangeStatus("progress")}
      />
      <Chip
        label="Success"
        sx={{
          color: selected === "success" ? colorMaps["success"].text : "",
          backgroundColor:
            selected === "success" ? colorMaps["success"].bg : "",
        }}
        variant={selected === "success" ? "filled" : "outlined"}
        onClick={() => handleChangeStatus("success")}
      />
      <Chip
        label="Review"
        sx={{
          color: selected === "review" ? colorMaps["review"].text : "",
          backgroundColor: selected === "review" ? colorMaps["review"].bg : "",
        }}
        variant={selected === "review" ? "filled" : "outlined"}
        onClick={() => handleChangeStatus("review")}
      />
    </Box>
  );
};

export default Chips;
