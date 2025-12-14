import { Box, Typography, Link } from "@mui/material";
import { useNavigate } from "react-router";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

interface BreadcrumbProps {
  path: string;
  onNavigate?: (path: string) => void;
}

const Breadcrumb = ({ path, onNavigate }: BreadcrumbProps) => {
  const navigate = useNavigate();

  const handlePathClick = (clickedPath: string) => {
    if (onNavigate) {
      onNavigate(clickedPath);
    } else {
      const encodedPath = encodeURIComponent(clickedPath);
      navigate(`/app/info-portal/folder?path=${encodedPath}`);
    }
  };

  const pathParts = path.split("/").filter((part) => part !== "");
  const breadcrumbItems = [
    { name: "Info Portal", path: "/" },
    ...pathParts.map((part, index) => ({
      name: part,
      path: "/" + pathParts.slice(0, index + 1).join("/"),
    })),
  ];

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: "4px",
        flexWrap: "wrap",
        marginBottom: "16px",
      }}
    >
      {breadcrumbItems.map((item, index) => (
        <Box key={item.path} sx={{ display: "flex", alignItems: "center", gap: "4px" }}>
          {index > 0 && (
            <ChevronRightIcon
              sx={{
                fontSize: "16px",
                color: (theme) => theme.palette.text.secondary,
                marginX: "4px",
              }}
            />
          )}
          {index === breadcrumbItems.length - 1 ? (
            <Typography
              sx={{
                fontSize: "14px",
                fontWeight: 500,
                color: (theme) => theme.palette.text.primary,
              }}
            >
              {item.name}
            </Typography>
          ) : (
            <Link
              component="button"
              onClick={() => {
                if (item.path === "/") {
                  navigate("/app/info-portal");
                } else {
                  handlePathClick(item.path);
                }
              }}
              sx={{
                fontSize: "14px",
                fontWeight: 400,
                color: (theme) => theme.palette.primary.main,
                textDecoration: "none",
                cursor: "pointer",
                "&:hover": {
                  textDecoration: "underline",
                },
              }}
            >
              {item.name}
            </Link>
          )}
        </Box>
      ))}
    </Box>
  );
};

export default Breadcrumb;


