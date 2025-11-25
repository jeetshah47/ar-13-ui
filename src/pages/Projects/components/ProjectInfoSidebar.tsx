import { Avatar, AvatarGroup, Box, SvgIcon, Typography } from "@mui/material";
import FilterIcon from "../../../assets/icons/general/calendar-5.svg?react";
import CalendarIcon from "../../../assets/icons/sidebar/calendar/inactive.svg?react";
import AttachmentIcon from "../../../assets/icons/general/calendar-19.svg?react";
import FilesIcon from "../../../assets/icons/general/calendar-20.svg?react";
import YellowArrow from "../../../assets/icons/general/calendar-23.svg?react";
import EditIcon from "../../../assets/icons/general/gear.svg?react";
import PlusIcon from "../../../assets/icons/general/plus.svg?react";

interface ProjectInfoSidebarProps {
  projectTitle?: string;
  projectDescription?: string;
  reporter?: {
    name: string;
    avatar?: string;
  };
  assignes?: Array<{
    id: string;
    name: string;
    avatar: string;
  }>;
  priority?: string;
  deadline?: string;
  timeSpent?: string | null;
  agencyContact?: {
    contact_name?: string;
    contact_agency_type?: string;
  };
  onEditClick?: () => void;
  onAddAgencyContact?: () => void;
}

const ProjectInfoSidebar = ({
  projectTitle,
  projectDescription,
  reporter,
  assignes,
  priority,
  deadline,
  timeSpent,
  agencyContact,
  onEditClick,
  onAddAgencyContact,
}: ProjectInfoSidebarProps) => {
  return (
    <Box
      sx={{
        width: { xs: "100%", sm: "100%", md: "240px", lg: "265px" },
        background: "#FFFFFF",
        borderRadius: "24px",
        boxShadow: "0px 6px 58px rgba(196, 203, 214, 0.103611)",
        height: { xs: "auto", sm: "auto", md: "100%", lg: "100%" },
        padding: { xs: "16px", sm: "16px", md: "16px", lg: "18px" },
        flexShrink: 0,
        "@media (min-width: 1200px) and (max-width: 1600px)": {
          width: "240px",
          padding: "16px",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography color="secondary">{projectTitle || "Project"}</Typography>
        <Box sx={{ display: "flex", gap: "8px" }}>
          {onEditClick && (
            <Box
              onClick={onEditClick}
              sx={{
                backgroundColor: "#fff",
                display: "flex",
                padding: "10px",
                borderRadius: "14px",
                cursor: "pointer",
                transition: "all 0.2s ease",
                "&:hover": {
                  backgroundColor: "#f5f5f5",
                  transform: "scale(1.05)",
                },
              }}
            >
              <SvgIcon component={EditIcon} />
            </Box>
          )}
          <Box
            sx={{
              backgroundColor: "#F4F9FD",
              display: "flex",
              padding: "10px",
            }}
          >
            <SvgIcon component={FilterIcon} />
          </Box>
        </Box>
      </Box>
      <Box sx={{ paddingTop: "24px" }}>
        <Typography variant="h6">Description</Typography>
        <Typography color="secondary.main">
          {projectDescription || "No description available"}
        </Typography>
        <Box sx={{ paddingTop: "10px" }}>
          <Typography color="secondary.main" fontSize={"16px"}>
            Reporter
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <Avatar
              sx={{ width: "24px", height: "24px" }}
              src={reporter?.avatar || "/api/placeholder/24/24"}
            />
            <Typography>{reporter?.name || "Project Owner"}</Typography>
          </Box>
        </Box>
        <Box sx={{ paddingTop: "10px" }}>
          <Typography color="secondary.main">Assignes</Typography>
          <AvatarGroup sx={{ justifyContent: "start" }} spacing="medium">
            {assignes?.map((assigne) => (
              <Avatar
                key={assigne.id}
                sx={{ width: "24px", height: "24px" }}
                alt={assigne.name}
                src={assigne.avatar || "/api/placeholder/24/24"}
              />
            ))}
          </AvatarGroup>
        </Box>
        <Box sx={{ paddingTop: "10px" }}>
          <Typography color="secondary.main">Priority</Typography>
          <Box sx={{ display: "flex", gap: "4px" }}>
            <SvgIcon component={YellowArrow} />
            <Typography color="#FFBD21">{priority || "Medium"}</Typography>
          </Box>
        </Box>
        <Box sx={{ paddingTop: "10px" }}>
          <Typography color="secondary.main">Dead Line</Typography>
          <Typography>
            {deadline ? new Date(deadline).toLocaleDateString() : "No deadline set"}
          </Typography>
        </Box>
        <Box sx={{ paddingTop: "10px" }}>
          <Typography color="secondary.main">Agency Contact</Typography>
          {agencyContact?.contact_name ? (
            <Box sx={{ paddingTop: "4px" }}>
              <Typography>{agencyContact.contact_name}</Typography>
              {agencyContact.contact_agency_type && (
                <Typography color="secondary.main" fontSize="14px">
                  {agencyContact.contact_agency_type}
                </Typography>
              )}
            </Box>
          ) : (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                paddingTop: "4px",
              }}
            >
              <Typography color="secondary.main" fontSize="14px">
                No agency contact added
              </Typography>
              {onAddAgencyContact && (
                <Box
                  onClick={onAddAgencyContact}
                  sx={{
                    backgroundColor: "#F4F9FD",
                    display: "flex",
                    padding: "6px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      backgroundColor: "#e3f2fd",
                      transform: "scale(1.05)",
                    },
                  }}
                >
                  <SvgIcon component={PlusIcon} sx={{ fontSize: "16px" }} />
                </Box>
              )}
            </Box>
          )}
        </Box>
        {timeSpent && (
          <Box sx={{ paddingTop: "10px" }}>
            <Typography color="secondary.main">Time Spent</Typography>
            <Typography>{timeSpent}</Typography>
          </Box>
        )}
        <Box
          sx={{
            paddingTop: "10px",
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          <SvgIcon component={CalendarIcon} />
          <Typography variant="subtitle2" color="secondary.main">
            Created May 28, 2020
          </Typography>
        </Box>
        <Box
          sx={{
            paddingTop: "15px",
            display: "flex",
            gap: "16px",
          }}
        >
          <Box
            sx={{
              backgroundColor: "#6D5DD315",
              padding: "10px",
              borderRadius: "14px",
              display: "flex",
            }}
          >
            <SvgIcon component={AttachmentIcon} />
          </Box>
          <Box
            sx={{
              backgroundColor: "#6D5DD315",
              padding: "10px",
              borderRadius: "14px",
              display: "flex",
            }}
          >
            <SvgIcon component={FilesIcon} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ProjectInfoSidebar;
