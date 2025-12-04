import { Avatar, Box, SvgIcon, Typography, CircularProgress } from "@mui/material";
import CalenderIcon from "../../../assets/icons/general/calendar.svg?react";
import YellowArrow from "../../../assets/icons/general/calendar-23.svg?react";
import { useAppSelector } from "../../../store/store";

type AnyProject = {
  id?: string;
  code?: string;
  name?: string;
  title?: string;
  created?: string | { _seconds?: number };
  allTasksCount?: number;
  activeTasksCount?: number;
  priority?: string;
};

type ProjectSectionProps = {
  projects?: AnyProject[] | Record<string, AnyProject> | null;
  loading?: boolean;
};

const formatCreated = (created: AnyProject["created"]) => {
  if (!created) return "";
  if (typeof created === "string") return new Date(created).toDateString();
  return "";
};

const ProjectSection = ({ projects: projectsProp, loading: loadingProp }: ProjectSectionProps = {}) => {
  const { profile, profileLoading } = useAppSelector((s) => s.userReducer);
  
  // Use provided projects prop, otherwise fall back to profile projects
  const projectsRaw = projectsProp !== undefined 
    ? projectsProp 
    : (profile?.projects as unknown);
  
  const loading = loadingProp !== undefined ? loadingProp : profileLoading;
  
  const projects: AnyProject[] = Array.isArray(projectsRaw)
    ? (projectsRaw as AnyProject[])
    : projectsRaw && typeof projectsRaw === "object" && !Array.isArray(projectsRaw)
    ? (Object.values(projectsRaw as Record<string, AnyProject>) as AnyProject[])
    : [];

  const ProjectCard = (project: AnyProject) => (
    <Box sx={{ padding: "12px 0" }}>
      <Box
        sx={(theme) => ({
          borderRadius: "24px",
          boxShadow: theme.shadows[1],
          backgroundColor: theme.palette.background.paper,
        })}
      >
        <Box sx={{ display: "flex" }}>
          <Box
            sx={(theme) => ({
              borderRight: `1px solid ${theme.palette.divider}`,
              width: "50%",
              padding: "24px",
            })}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                paddingBottom: "14px",
              }}
            >
              <Avatar />
              <Box>
                <Typography color="secondary">{project.code || project.id || "-"}</Typography>
                <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                  {project.name || project.title || "Project"}
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Box sx={{ display: "flex", gap: "6px" }}>
                <SvgIcon component={CalenderIcon} />
                <Typography color="secondary">{formatCreated(project.created)}</Typography>
              </Box>
              <Box sx={{ display: "flex", gap: "4px" }}>
                <SvgIcon component={YellowArrow} />
                <Typography color="#FFBD21">{project.priority || "-"}</Typography>
              </Box>
            </Box>
          </Box>
          <Box sx={{ width: "50%", padding: "24px" }}>
            <Box sx={{ paddingBottom: "14px" }}>
              <Typography sx={{ fontWeight: "bold" }}>Project Data</Typography>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Box>
                <Typography color="secondary">All Tasks</Typography>
                <Typography sx={{ fontWeight: "bold" }}>{project.allTasksCount ?? "-"}</Typography>
              </Box>
              <Box>
                <Typography color="secondary">Active Tasks</Typography>
                <Typography sx={{ fontWeight: "bold" }}>{project.activeTasksCount ?? "-"}</Typography>
              </Box>
              <Box>
                <Typography color="secondary">Assignees</Typography>
                <Avatar />
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", padding: "40px" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {projects.length === 0 ? (
        <Box sx={{ padding: "20px", textAlign: "center" }}>
          <Typography color="text.secondary">No projects found</Typography>
        </Box>
      ) : (
        projects.map((p, idx) => <ProjectCard key={(p.id || p.code || idx).toString()} {...p} />)
      )}
    </Box>
  );
};

export default ProjectSection;
