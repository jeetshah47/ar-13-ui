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
import type { DrawingCategory } from "../../../store/types/DrawingList/DrawingCategory";
import { RequirePermission } from "../../../common/components/RBAC";

interface CategoriesListProps {
  categories: DrawingCategory[];
  loading: boolean;
  onEdit: (category: DrawingCategory) => void;
  onDelete: (category: DrawingCategory) => void;
}

const CategoriesList = ({
  categories,
  loading,
  onEdit,
  onDelete,
}: CategoriesListProps) => {
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

  if (categories.length === 0) {
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
            No categories yet
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
            Click the "+" button to create your first category.
          </Typography>
        </Box>
      </CustomCard>
    );
  }

  // Sort categories by order
  const sortedCategories = [...categories].sort((a, b) => a.order - b.order);

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
          maxHeight: { xs: "none", sm: "calc(100vh - 300px)" },
          overflowY: { xs: "visible", sm: "auto" },
          "&::-webkit-scrollbar": {
            width: "8px",
            height: "8px",
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: "transparent",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "rgba(0,0,0,0.2)",
            borderRadius: "4px",
            "&:hover": {
              backgroundColor: "rgba(0,0,0,0.3)",
            },
          },
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
              <TableCell sx={{ fontWeight: 600 }}>Description</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Order</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 600, textAlign: "center" }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedCategories.map((category) => (
              <TableRow
                key={category.id}
                sx={{
                  "&:hover": {
                    backgroundColor: (theme) => theme.palette.action.hover,
                  },
                }}
              >
                <TableCell>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {category.name}
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
                    {category.description || "-"}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">{category.order}</Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={category.isActive ? "Active" : "Inactive"}
                    color={category.isActive ? "success" : "default"}
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
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default CategoriesList;

