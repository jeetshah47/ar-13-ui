import { Box, Typography } from "@mui/material";
import ProjectBoard from "./ProjectBoard";
import { useAppSelector } from "../../../store/store";

const TileView = () => {
  const projectListState = useAppSelector(
    (state) => state.projectListReducer
  );
  
  const selectedProjectId = projectListState.common.selectedProjectId;

  return (
    <>
      <Box
        sx={{
          background: "#E6EDF5",
          borderRadius: "14px",
          padding: "10px",
          textAlign: "center",
          marginTop: "12px",
        }}
      >
        <Typography sx={{ fontWeight: "bold" }}>Active Tasks</Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexGrow: 1,
          height: "100%",
        }}
      >
        {selectedProjectId ? (
          <ProjectBoard projectId={selectedProjectId} />
        ) : (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              height: "100%",
            }}
          >
            <Typography color="text.secondary">
              Please select a project to view tasks
            </Typography>
          </Box>
        )}
      </Box>
    </>
  );
};

export default TileView;
