import { Box, Typography, Chip, IconButton, Tooltip } from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import CustomCard from "../../../common/components/Card/CustomCard";
import type { DrawingCategory } from "../../../store/types/DrawingList/DrawingCategory";
import { RequirePermission } from "../../../common/components/RBAC";

interface CategoryCardProps {
  category: DrawingCategory;
  onEdit: (category: DrawingCategory) => void;
  onDelete: (category: DrawingCategory) => void;
}

const CategoryCard = ({ category, onEdit, onDelete }: CategoryCardProps) => {
  return (
    <CustomCard>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          padding: "20px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: "16px",
          }}
        >
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                marginBottom: "8px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {category.name}
            </Typography>
            {category.description && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  marginBottom: "8px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                }}
              >
                {category.description}
              </Typography>
            )}
            <Box
              sx={{
                display: "flex",
                gap: "12px",
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <Chip
                label={category.isActive ? "Active" : "Inactive"}
                color={category.isActive ? "success" : "default"}
                size="small"
              />
              <Typography variant="body2" color="text.secondary">
                Order: {category.order}
              </Typography>
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              gap: "8px",
              flexShrink: 0,
            }}
          >
            <RequirePermission permission="drawingList:write">
              <Tooltip title="Edit Category">
                <IconButton
                  size="small"
                  onClick={() => onEdit(category)}
                  sx={{
                    color: "primary.main",
                  }}
                >
                  <Edit fontSize="small" />
                </IconButton>
              </Tooltip>
            </RequirePermission>
            <RequirePermission permission="drawingList:delete">
              <Tooltip title="Delete Category">
                <IconButton
                  size="small"
                  onClick={() => onDelete(category)}
                  sx={{
                    color: "error.main",
                  }}
                >
                  <Delete fontSize="small" />
                </IconButton>
              </Tooltip>
            </RequirePermission>
          </Box>
        </Box>
      </Box>
    </CustomCard>
  );
};

export default CategoryCard;

