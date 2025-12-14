import {
  Box,
  Typography,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Tooltip,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import CustomCard from "../../../common/components/Card/CustomCard";
import type { DrawingType } from "../../../store/types/DrawingList/DrawingType";
import type { DrawingCategory } from "../../../store/types/DrawingList/DrawingCategory";
import { RequirePermission } from "../../../common/components/RBAC";

interface TypesListProps {
  types: DrawingType[];
  categories: DrawingCategory[];
  loading: boolean;
  onEdit: (type: DrawingType) => void;
  onDelete: (type: DrawingType) => void;
}

const TypesList = ({
  types,
  categories,
  loading,
  onEdit,
  onDelete,
}: TypesListProps) => {
  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "200px",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (types.length === 0) {
    return (
      <CustomCard>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            padding: "40px",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <Typography
            variant="h2"
            sx={(theme) => ({
              fontWeight: 700,
              fontSize: "22px",
              lineHeight: 1.364,
              color: theme.palette.text.primary,
            })}
          >
            No types yet
          </Typography>
          <Typography
            sx={(theme) => ({
              fontSize: "16px",
              fontWeight: 400,
              lineHeight: 1.5,
              color: theme.palette.text.primary,
              opacity: 0.7,
            })}
          >
            Click the "+" button to create your first drawing type.
          </Typography>
        </Box>
      </CustomCard>
    );
  }

  // Create a map of categories for quick lookup
  const categoryMap = new Map<string, DrawingCategory>();
  categories.forEach((cat) => {
    categoryMap.set(cat.id, cat);
  });

  // Sort types by order
  const sortedTypes = [...types].sort((a, b) => a.order - b.order);

  return (
    <Box
      sx={{
        padding: { xs: "20px", sm: "28px 0px" },
        paddingX: { xs: "20px", sm: 0 },
      }}
    >
      <TableContainer
        component={Paper}
        sx={{
          borderRadius: "24px",
          boxShadow: (theme) => theme.shadows[1],
          overflowX: "auto",
        }}
      >
        <Table>
          <TableHead>
            <TableRow
              sx={{
                backgroundColor: (theme) => theme.palette.grey[50],
              }}
            >
              <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Category</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Description</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Order</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 600, textAlign: "center" }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedTypes.map((type) => {
              const category = categoryMap.get(type.categoryId);
              return (
                <TableRow
                  key={type.id}
                  sx={{
                    "&:hover": {
                      backgroundColor: (theme) => theme.palette.action.hover,
                    },
                  }}
                >
                  <TableCell>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {type.name}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="primary.main">
                      {category?.name || "-"}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        maxWidth: "400px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {type.description || "-"}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{type.order}</Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={type.isActive ? "Active" : "Inactive"}
                      color={type.isActive ? "success" : "default"}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        gap: "8px",
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
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default TypesList;

