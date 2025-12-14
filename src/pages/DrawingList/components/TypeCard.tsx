import { Box, Typography, Chip, IconButton, Tooltip } from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import CustomCard from "../../../common/components/Card/CustomCard";
import type { DrawingType } from "../../../store/types/DrawingList/DrawingType";
import type { DrawingCategory } from "../../../store/types/DrawingList/DrawingCategory";
import { RequirePermission } from "../../../common/components/RBAC";

interface TypeCardProps {
  type: DrawingType;
  category?: DrawingCategory;
  onEdit: (type: DrawingType) => void;
  onDelete: (type: DrawingType) => void;
}

const TypeCard = ({ type, category, onEdit, onDelete }: TypeCardProps) => {
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
              {type.name}
            </Typography>
            {category && (
              <Typography
                variant="body2"
                color="primary.main"
                sx={{
                  marginBottom: "8px",
                  fontWeight: 500,
                }}
              >
                Category: {category.name}
              </Typography>
            )}
            {type.description && (
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
                {type.description}
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
                label={type.isActive ? "Active" : "Inactive"}
                color={type.isActive ? "success" : "default"}
                size="small"
              />
              <Typography variant="body2" color="text.secondary">
                Order: {type.order}
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
              <Tooltip title="Edit Type">
                <IconButton
                  size="small"
                  onClick={() => onEdit(type)}
                  sx={{
                    color: "primary.main",
                  }}
                >
                  <Edit fontSize="small" />
                </IconButton>
              </Tooltip>
            </RequirePermission>
            <RequirePermission permission="drawingList:delete">
              <Tooltip title="Delete Type">
                <IconButton
                  size="small"
                  onClick={() => onDelete(type)}
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

export default TypeCard;

