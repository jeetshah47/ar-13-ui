import {
  Box,
  Button,
  SvgIcon,
  TextField,
  Typography,
  Switch,
  FormControlLabel,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import CrossIcon from "../../../assets/icons/general/calendar-6.svg?react";
import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../store/store";
import {
  createTypeAction,
  updateTypeAction,
} from "../../../store/features/drawingList/drawingListActions";
import type { DrawingType } from "../../../store/types/DrawingList/DrawingType";

interface TypeFormProps {
  onClose: () => void;
  type?: DrawingType | null;
}

const TypeForm = ({ onClose, type }: TypeFormProps) => {
  const dispatch = useAppDispatch();
  const { typeCreating, typeUpdating, categories } = useAppSelector(
    (state) => state.drawingListReducer
  );

  const [categoryId, setCategoryId] = useState(type?.categoryId || "");
  const [name, setName] = useState(type?.name || "");
  const [description, setDescription] = useState(type?.description || "");
  const [order, setOrder] = useState(type?.order?.toString() || "1");
  const [isActive, setIsActive] = useState(type?.isActive ?? true);

  const [nameError, setNameError] = useState("");
  const [categoryError, setCategoryError] = useState("");
  const [orderError, setOrderError] = useState("");

  useEffect(() => {
    if (type) {
      setCategoryId(type.categoryId || "");
      setName(type.name || "");
      setDescription(type.description || "");
      setOrder(type.order?.toString() || "1");
      setIsActive(type.isActive ?? true);
    }
  }, [type]);

  const validateForm = (): boolean => {
    let isValid = true;

    if (!categoryId) {
      setCategoryError("Category is required");
      isValid = false;
    } else {
      setCategoryError("");
    }

    if (!name.trim()) {
      setNameError("Type name is required");
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

    const typeData = {
      categoryId: categoryId.trim(),
      name: name.trim(),
      description: description.trim() || undefined,
      order: parseInt(order, 10),
      isActive,
    };

    if (type) {
      dispatch(
        updateTypeAction(type.id, typeData, () => {
          onClose();
        })
      );
    } else {
      dispatch(
        createTypeAction(typeData, () => {
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

  const handleCategoryChange = (e: { target: { value: string } }) => {
    setCategoryId(e.target.value);
    if (categoryError) {
      setCategoryError("");
    }
  };

  const handleOrderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOrder(e.target.value);
    if (orderError) {
      setOrderError("");
    }
  };

  const isSubmitting = typeCreating || typeUpdating;
  const activeCategories = categories.filter((cat) => cat.isActive);

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
          {type ? "Edit Type" : "Add Type"}
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
        <FormControl fullWidth error={Boolean(categoryError)}>
          <InputLabel>Category *</InputLabel>
          <Select
            value={categoryId}
            onChange={handleCategoryChange}
            label="Category *"
            disabled={isSubmitting}
          >
            {activeCategories.map((category) => (
              <MenuItem key={category.id} value={category.id}>
                {category.name}
              </MenuItem>
            ))}
          </Select>
          {categoryError && (
            <Typography variant="caption" color="error" sx={{ marginTop: "4px", marginLeft: "14px" }}>
              {categoryError}
            </Typography>
          )}
        </FormControl>

        <Box>
          <Typography
            color="secondary"
            sx={{ fontWeight: "bold", fontSize: "14px", marginBottom: "7px" }}
          >
            Type Name *
          </Typography>
          <TextField
            sx={{ width: "100%" }}
            placeholder="Enter type name"
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
            disabled={
              isSubmitting ||
              !name.trim() ||
              !categoryId ||
              Boolean(nameError || categoryError || orderError)
            }
          >
            {isSubmitting
              ? type
                ? "Updating..."
                : "Creating..."
              : type
                ? "Update"
                : "Create"}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default TypeForm;

