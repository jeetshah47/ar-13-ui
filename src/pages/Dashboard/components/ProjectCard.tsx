import { Avatar, Box, SvgIcon, Typography } from "@mui/material";
import CalenderIcon from "../../../assets/icons/general/calendar.svg?react";
import YellowArrow from "../../../assets/icons/general/calendar-23.svg?react";
import type { ProjectResponse } from "../../../store/types/Project/ProjectResponse";

interface ProjectCardProps {
  project: ProjectResponse;
}

const ProjectCard = ({ project }: ProjectCardProps) => {
  // Format date from timestamp
  const formatDate = (timestamp: { _seconds: number; _nanoseconds: number }) => {
    const date = new Date(timestamp._seconds * 1000);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  // Generate project ID from title or use actual ID
  const projectId = `PN${project.id.slice(-7)}`;
  return (
    <Box sx={{ padding: "12px 0" }}>
      <Box
        sx={{
          borderRadius: "24px",
          boxShadow: "0px 6px 58px rgba(196, 203, 214, 0.103611)",
          backgroundColor: "white",
        }}
      >
        <Box sx={{ display: "flex" }}>
          <Box
            sx={{
              borderRight: "1px solid #E4E6E8",
              width: "50%",
              padding: "24px",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                paddingBottom: "14px",
              }}
            >
              <Avatar sx={{ width: 40, height: 40 }}>
                {project.title.charAt(0).toUpperCase()}
              </Avatar>
              <Box>
                <Typography color="secondary">{projectId}</Typography>
                <Typography variant="subtitle1" sx={{fontWeight: "bold"}}>
                  {project.title}
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Box sx={{ display: "flex", gap: "6px" }}>
                <SvgIcon component={CalenderIcon} />
                <Typography color="secondary">
                  Created {formatDate(project.created)}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", gap: "4px" }}>
                <SvgIcon component={YellowArrow} />
                <Typography color="#FFBD21">
                  {project.deadLine ? 'High' : 'Medium'}
                </Typography>
              </Box>
            </Box>
          </Box>
          <Box sx={{ width: "50%", padding: "24px" }}>
            <Box sx={{ paddingBottom: "14px" }}>
              <Typography sx={{fontWeight: "bold"}}>Project Data</Typography>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Box>
                <Typography color="secondary">All Tasks</Typography>
                <Typography sx={{fontWeight: "bold"}}>
                  {Math.floor(Math.random() * 50) + 10}
                </Typography>
              </Box>
              <Box>
                <Typography color="secondary">Active Tasks</Typography>
                <Typography sx={{fontWeight: "bold"}}>
                  {Math.floor(Math.random() * 20) + 5}
                </Typography>
              </Box>
              <Box>
                <Typography color="secondary">Assignees</Typography>
                <Avatar sx={{ width: 24, height: 24, fontSize: "12px" }}>
                  {project.membersIds?.length || 1}
                </Avatar>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ProjectCard;
