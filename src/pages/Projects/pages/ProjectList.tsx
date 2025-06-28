import { Avatar, Box, Button, SvgIcon, Typography } from "@mui/material";
import PageHeader from "../../../common/components/PageHeader/PageHeader";
import PlusIcon from "../../../assets/icons/general/plus.svg?react";
import ListViewIcon from "../../../assets/icons/general/list-view.svg?react";
import CardViewIcon from "../../../assets/icons/general/card-view.svg?react";
import TimeLineViewIcon from "../../../assets/icons/general/timline-view.svg?react";

const ProjectList = () => {
  const AddButton = (
    <Button variant="contained" startIcon={<SvgIcon component={PlusIcon} />}>
      Add Project
    </Button>
  );

  return (
    <Box sx={{ height: "100%" }}>
      <PageHeader title="Projects" endElement={AddButton} />
      <Box
        sx={{
          paddingTop: "28px",
          display: "flex",
          gap: "28px",
          height: "100%",
        }}
      >
        <Box
          sx={{
            width: "20%",
            background: "#FFFFFF",
            borderRadius: "24px",
            boxShadow: "0px 6px 58px rgba(196, 203, 214, 0.103611)",
            height: "100%",
          }}
        >
          <Box sx={{ padding: "20px 22px", borderBottom: "1px solid #E4E6E8" }}>
            <Typography sx={{ fontWeight: "bold" }}>
              Current Projects
            </Typography>
          </Box>
          <Box>
            <Box
              sx={{
                padding: "8px",
                borderRight: "4px solid #3F8CFF",
                borderRadius: "2px",
                background: "#F4F9FD",
              }}
            >
              <Typography color="secondary">PN0001245</Typography>
              <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                New Site Project
              </Typography>
              <Typography color="primary" sx={{ fontWeight: "600" }}>
                View Details
              </Typography>
            </Box>
            <Box
              sx={{
                padding: "8px",
              }}
            >
              <Typography color="secondary">PN0001245</Typography>
              <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                New Site Project
              </Typography>
            </Box>
          </Box>
        </Box>
        <Box sx={{ width: "80%" }}>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Box>
              <Typography sx={{ fontWeight: "bold" }}>Tasks</Typography>
            </Box>
            <Box sx={{ display: "flex", gap: "16px" }}>
              <Box
                sx={{
                  backgroundColor: "white",
                  borderRadius: "14px",
                  padding: "12px",
                  display: "flex",
                }}
              >
                <SvgIcon component={ListViewIcon} />
              </Box>
              <Box
                sx={{
                  backgroundColor: "white",
                  borderRadius: "14px",
                  padding: "12px",
                  display: "flex",
                }}
              >
                <SvgIcon component={CardViewIcon} />
              </Box>
              <Box
                sx={{
                  backgroundColor: "white",
                  borderRadius: "14px",
                  padding: "12px",
                  display: "flex",
                }}
              >
                <SvgIcon component={TimeLineViewIcon} />
              </Box>
            </Box>
            <Box>FilterIcons</Box>
          </Box>
          <Box
            sx={{
              background: "#E6EDF5",
              borderRadius: "14px",
              padding: "10px",
              textAlign: "center",
              marginTop: "12px",
            }}
          >
            <Typography sx={{ fontWeight: "bold" }}>Active Task</Typography>
          </Box>
          <Box>
            <Box
              sx={{
                backgroundColor: "white",
                padding: "22px 26px",
                borderRadius: "24px",
                display: "flex",
                justifyContent: "space-between"
              }}
            >
                <Box>
                    <Typography color="secondary">Task Name</Typography>
                    <Typography>Research</Typography>
                </Box>
                <Box>
                    <Typography color="secondary">Estimate</Typography>
                    <Typography>2d 4h</Typography>
                </Box>
                <Box>
                    <Typography color="secondary">Spent Time</Typography>
                    <Typography>1d 2h</Typography>
                </Box>
                <Box>
                    <Typography color="secondary">Assignee</Typography>
                    <Avatar sx={{width: "24px", height: "24px"}} />
                </Box>
                <Box>
                    <Typography color="secondary">Priority</Typography>
                    <Typography>Medium</Typography>
                </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ProjectList;
