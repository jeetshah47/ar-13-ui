import { Avatar, Box, SvgIcon, Typography } from "@mui/material";
import CalenderIcon from "../../../assets/icons/general/calendar.svg?react";
import YellowArrow from "../../../assets/icons/general/calendar-23.svg?react";
import type { ProjectResponse } from "../../../store/types/Project/ProjectResponse";

interface ProjectCardProps {
  project: ProjectResponse;
}

const ProjectCard = ({ project }: ProjectCardProps) => {
  // Format date from timestamp
  const formatDate = (timestamp: string | { _seconds: number; _nanoseconds: number } | undefined) => {
    if (!timestamp) return 'N/A';
    if (typeof timestamp === 'string') {
      const date = new Date(timestamp);
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      });
    }
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
    <Box sx={{ padding: { xs: "8px 0", sm: "12px 0" } }}>
      <Box
        sx={{
          borderRadius: { xs: "12px", sm: "20px", md: "24px" },
          boxShadow: (theme) => theme.shadows[1],
          backgroundColor: "background.paper",
        }}
      >
        <Box 
          sx={{ 
            display: "flex",
            flexDirection: { xs: "column", md: "row" }
          }}
        >
          <Box
            sx={{
              borderRight: { xs: "none", md: (theme) => `1px solid ${theme.palette.divider}` },
              borderBottom: { xs: (theme) => `1px solid ${theme.palette.divider}`, md: "none" },
              width: { xs: "100%", md: "50%" },
              padding: { xs: "16px", sm: "20px", md: "24px" },
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: { xs: "8px", sm: "12px" },
                paddingBottom: { xs: "12px", sm: "14px" },
              }}
            >
              <Avatar sx={{ width: { xs: 32, sm: 36, md: 40 }, height: { xs: 32, sm: 36, md: 40 } }}>
                {project.title.charAt(0).toUpperCase()}
              </Avatar>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography 
                  color="secondary"
                  sx={{ fontSize: { xs: "11px", sm: "12px", md: "14px" } }}
                >
                  {projectId}
                </Typography>
                <Typography 
                  variant="subtitle1" 
                  sx={{
                    fontWeight: "bold",
                    fontSize: { xs: "14px", sm: "16px", md: "18px" },
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap"
                  }}
                >
                  {project.title}
                </Typography>
              </Box>
            </Box>
            <Box 
              sx={{ 
                display: "flex", 
                justifyContent: "space-between",
                flexDirection: { xs: "column", sm: "row" },
                gap: { xs: "8px", sm: 0 }
              }}
            >
              <Box sx={{ display: "flex", gap: { xs: "4px", sm: "6px" }, alignItems: "center" }}>
                <SvgIcon 
                  component={CalenderIcon} 
                  sx={{ fontSize: { xs: "16px", sm: "20px" } }}
                />
                <Typography 
                  color="secondary"
                  sx={{ fontSize: { xs: "11px", sm: "12px", md: "14px" } }}
                >
                  Created {formatDate(project.created)}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", gap: { xs: "4px", sm: "4px" }, alignItems: "center" }}>
                <SvgIcon 
                  component={YellowArrow} 
                  sx={{ fontSize: { xs: "16px", sm: "20px" } }}
                />
                <Typography 
                  color="#FFBD21"
                  sx={{ fontSize: { xs: "11px", sm: "12px", md: "14px" } }}
                >
                  {project.deadLine ? 'High' : 'Medium'}
                </Typography>
              </Box>
            </Box>
          </Box>
          <Box 
            sx={{ 
              width: { xs: "100%", md: "50%" }, 
              padding: { xs: "16px", sm: "20px", md: "24px" } 
            }}
          >
            <Box sx={{ paddingBottom: { xs: "12px", sm: "14px" } }}>
              <Typography 
                sx={{
                  fontWeight: "bold",
                  fontSize: { xs: "14px", sm: "16px", md: "18px" }
                }}
              >
                Project Data
              </Typography>
            </Box>
            <Box 
              sx={{ 
                display: "flex", 
                justifyContent: { xs: "space-around", sm: "space-between" },
                gap: { xs: "8px", sm: 0 },
                flexWrap: { xs: "wrap", sm: "nowrap" }
              }}
            >
              <Box sx={{ textAlign: { xs: "center", sm: "left" } }}>
                <Typography 
                  color="secondary"
                  sx={{ fontSize: { xs: "11px", sm: "12px", md: "14px" } }}
                >
                  All Tasks
                </Typography>
                <Typography 
                  sx={{
                    fontWeight: "bold",
                    fontSize: { xs: "16px", sm: "18px", md: "20px" }
                  }}
                >
                  {Math.floor(Math.random() * 50) + 10}
                </Typography>
              </Box>
              <Box sx={{ textAlign: { xs: "center", sm: "left" } }}>
                <Typography 
                  color="secondary"
                  sx={{ fontSize: { xs: "11px", sm: "12px", md: "14px" } }}
                >
                  Active Tasks
                </Typography>
                <Typography 
                  sx={{
                    fontWeight: "bold",
                    fontSize: { xs: "16px", sm: "18px", md: "20px" }
                  }}
                >
                  {Math.floor(Math.random() * 20) + 5}
                </Typography>
              </Box>
              <Box sx={{ textAlign: { xs: "center", sm: "left" } }}>
                <Typography 
                  color="secondary"
                  sx={{ fontSize: { xs: "11px", sm: "12px", md: "14px" } }}
                >
                  Assignees
                </Typography>
                <Box sx={{ display: "flex", justifyContent: { xs: "center", sm: "flex-start" }, marginTop: { xs: "4px", sm: 0 } }}>
                  <Avatar sx={{ width: { xs: 20, sm: 22, md: 24 }, height: { xs: 20, sm: 22, md: 24 }, fontSize: { xs: "10px", sm: "11px", md: "12px" } }}>
                    {project.membersIds?.length || 1}
                  </Avatar>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ProjectCard;
