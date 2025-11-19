import { Box, Button, SvgIcon, TextField, Typography, Switch, FormControlLabel } from "@mui/material";
import CrossIcon from "../../../assets/icons/general/calendar-6.svg?react";
import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../store/store";
import {
  createCategoryAction,
  updateCategoryAction,
} from "../../../store/features/drawingList/drawingListActions";
import type { DrawingCategory } from "../../../store/types/DrawingList/DrawingCategory";

interface CategoryFormProps {
  onClose: () => void;
  category?: DrawingCategory | null;
}

const CategoryForm = ({ onClose, category }: CategoryFormProps) => {
  const dispatch = useAppDispatch();
  const { categoryCreating, categoryUpdating } = useAppSelector(
    (state) => state.drawingListReducer
  );

  const [name, setName] = useState(category?.name || "");
  const [description, setDescription] = useState(category?.description || "");
  const [order, setOrder] = useState(category?.order?.toString() || "1");
  const [isActive, setIsActive] = useState(category?.isActive ?? true);

  const [nameError, setNameError] = useState("");
  const [orderError, setOrderError] = useState("");

  useEffect(() => {
    if (category) {
      setName(category.name || "");
      setDescription(category.description || "");
      setOrder(category.order?.toString() || "1");
      setIsActive(category.isActive ?? true);
    }
  }, [category]);

  const validateForm = (): boolean => {
    let isValid = true;

    if (!name.trim()) {
      setNameError("Category name is required");
      isValid = false;
    } else {
      setNameError("");
    }

    const orderNum = parseInt(order, 10);
    if (isNaN(orderNum) || orderNum < 1) {
      setOrderError("Order must be a positive integer");
      isValid = false;
    } else {
      setOrderError("");
    }

    return isValid;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    const categoryData = {
      name: name.trim(),
      description: description.trim() || undefined,
      order: parseInt(order, 10),
      isActive,
    };

    if (category) {
      dispatch(
        updateCategoryAction(category.id, categoryData, () => {
          onClose();
        })
      );
    } else {
      dispatch(
        createCategoryAction(categoryData, () => {
          onClose();
        })
      );
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    if (nameError) {
      setNameError("");
    }
  };

  const handleOrderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOrder(e.target.value);
    if (orderError) {
      setOrderError("");
    }
  };

  const isSubmitting = categoryCreating || categoryUpdating;

  return (
    <Box
      sx={(theme) => ({
        background: theme.palette.background.paper,
        boxShadow: theme.shadows[6],
        borderRadius: "24px",
        padding: "28px",
        width: { xs: "90vw", sm: "584px" },
        maxWidth: "584px",
      })}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingY: "20px",
        }}
      >
        <Typography fontWeight={"bold"} variant="h6">
          {category ? "Edit Category" : "Add Category"}
        </Typography>
        <Box
          sx={(theme) => ({
            background: theme.palette.grey[50],
            borderRadius: "14px",
            display: "flex",
            padding: "8px",
            cursor: "pointer",
          })}
        >
          <SvgIcon fontSize="small" component={CrossIcon} onClick={onClose} />
        </Box>
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <Box>
          <Typography
            color="secondary"
            sx={{ fontWeight: "bold", fontSize: "14px", marginBottom: "7px" }}
          >
            Category Name *
          </Typography>
          <TextField
            sx={{ width: "100%" }}
            placeholder="Enter category name"
            value={name}
            onChange={handleNameChange}
            error={Boolean(nameError)}
            helperText={nameError}
            disabled={isSubmitting}
          />
        </Box>

        <Box>
          <Typography
            color="secondary"
            sx={{ fontWeight: "bold", fontSize: "14px", marginBottom: "7px" }}
          >
            Description
          </Typography>
          <TextField
            sx={{ width: "100%" }}
            placeholder="Enter description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            multiline
            rows={3}
            disabled={isSubmitting}
          />
        </Box>

        <Box>
          <Typography
            color="secondary"
            sx={{ fontWeight: "bold", fontSize: "14px", marginBottom: "7px" }}
          >
            Order *
          </Typography>
          <TextField
            sx={{ width: "100%" }}
            type="number"
            placeholder="Enter order number"
            value={order}
            onChange={handleOrderChange}
            error={Boolean(orderError)}
            helperText={orderError}
            disabled={isSubmitting}
            inputProps={{ min: 1 }}
          />
        </Box>

        <Box>
          <FormControlLabel
            control={
              <Switch
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                disabled={isSubmitting}
              />
            }
            label="Active"
          />
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            paddingTop: "12px",
            gap: "12px",
          }}
        >
          <Button variant="outlined" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={isSubmitting || !name.trim() || Boolean(nameError || orderError)}
          >
            {isSubmitting
              ? category
                ? "Updating..."
                : "Creating..."
              : category
                ? "Update"
                : "Create"}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default CategoryForm;

