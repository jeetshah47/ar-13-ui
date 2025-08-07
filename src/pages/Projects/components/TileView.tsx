import { Box } from "@mui/material";
import DragDropComponent from "./DragnDrop";
import { blurAnimation } from "../../../common/animation/cssAnimation";

const TileView = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexGrow: 1,
        height: "100%",
        ...blurAnimation,
      }}
    >
      {/* <Box
        sx={{
          backgroundColor: "white",
          boxShadow: "0px 6px 58px rgba(196, 203, 214, 0.103611)",
          borderRadius: "24px",
          padding: "20px",
        }}
      >
        <Typography color="secondary">TS0001245</Typography>
        <Typography>UX Drawings</Typography>
        <Box
          sx={{
            display: "flex",
            paddingTop: "30px",
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >
          <Typography
            color="secondary"
            sx={{ backgroundColor: "#F4F9FD", borderRadius: "8px", padding: "6px 10px" }}
          >
            4d
          </Typography>
          <Avatar sx={{ width: "24px", height: "24px" }} />
        </Box>
      </Box> */}
      <DragDropComponent />
    </Box>
  );
};

export default TileView;
