import {
  Box,
  Typography,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
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
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Edit, Delete } from "@mui/icons-material";
import CustomCard from "../../../common/components/Card/CustomCard";
import type { DrawingCategory } from "../../../store/types/DrawingList/DrawingCategory";
import type { DrawingType } from "../../../store/types/DrawingList/DrawingType";
import { RequirePermission } from "../../../common/components/RBAC";

interface CombinedViewProps {
  categories: DrawingCategory[];
  types: DrawingType[];
  loading: boolean;
  onEditCategory: (category: DrawingCategory) => void;
  onDeleteCategory: (category: DrawingCategory) => void;
  onEditType: (type: DrawingType) => void;
  onDeleteType: (type: DrawingType) => void;
}

const CombinedView = ({
  categories,
  types,
  loading,
  onEditCategory,
  onDeleteCategory,
  onEditType,
  onDeleteType,
}: CombinedViewProps) => {
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

  // Group types by category
  const typesByCategory = new Map<string, DrawingType[]>();
  types.forEach((type) => {
    if (!typesByCategory.has(type.categoryId)) {
      typesByCategory.set(type.categoryId, []);
    }
    typesByCategory.get(type.categoryId)!.push(type);
  });

  // Sort categories by order
  const sortedCategories = [...categories].sort((a, b) => a.order - b.order);

  return (
    <Box
      sx={{
        padding: { xs: "20px", sm: "28px 0px" },
        paddingX: { xs: "20px", sm: 0 },
      }}
    >
      {sortedCategories.map((category) => {
        const categoryTypes = typesByCategory.get(category.id) || [];
        // Sort types by order
        const sortedTypes = [...categoryTypes].sort((a, b) => a.order - b.order);

        return (
          <Accordion
            key={category.id}
            defaultExpanded
            sx={{
              marginBottom: "16px",
              borderRadius: "12px",
              "&:before": {
                display: "none",
              },
              boxShadow: (theme) => theme.shadows[1],
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              sx={{
                backgroundColor: (theme) => theme.palette.background.paper,
                borderRadius: "12px",
                padding: "16px 20px",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: "100%",
                  paddingRight: "16px",
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {category.name}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ marginLeft: "16px" }}
                >
                  {sortedTypes.length} {sortedTypes.length === 1 ? "type" : "types"}
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails
              sx={{
                padding: "20px",
                backgroundColor: (theme) => theme.palette.grey[50],
              }}
            >
              {sortedTypes.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  No types in this category
                </Typography>
              ) : (
                <TableContainer
                  component={Paper}
                  sx={{
                    borderRadius: "12px",
                    boxShadow: "none",
                    backgroundColor: "transparent",
                    overflowX: "auto",
                  }}
                >
                  <Table size="small">
                    <TableHead>
                      <TableRow
                        sx={{
                          backgroundColor: (theme) => theme.palette.background.paper,
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
                      {sortedTypes.map((type) => (
                        <TableRow
                          key={type.id}
                          sx={{
                            backgroundColor: (theme) => theme.palette.background.paper,
                            "&:hover": {
                              backgroundColor: (theme) => theme.palette.action.hover,
                            },
                          }}
                        >
                          <TableCell>
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                              {type.name}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{
                                maxWidth: "300px",
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
                                    onClick={() => onEditType(type)}
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
                                    onClick={() => onDeleteType(type)}
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
              )}
            </AccordionDetails>
          </Accordion>
        );
      })}
    </Box>
  );
};

export default CombinedView;

