import {
  Box,
  Button,
  SvgIcon,
  Fab,
  Alert,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import PlusIcon from "../../assets/icons/general/plus.svg?react";
import PageHeader from "../../common/components/PageHeader/PageHeader";
import { useState, useEffect } from "react";
import Tab from "../../common/components/Tab/Tab";
import Modal from "../../common/components/Modal/Modal";
import CategoryForm from "./components/CategoryForm";
import TypeForm from "./components/TypeForm";
import CategoriesList from "./components/CategoriesList";
import TypesList from "./components/TypesList";
import CombinedView from "./components/CombinedView";
import { RequirePermission } from "../../common/components/RBAC";
import { useAppDispatch, useAppSelector } from "../../store/store";
import {
  getAllCategoriesAction,
  getAllTypesAction,
  deleteCategoryAction,
  deleteTypeAction,
} from "../../store/features/drawingList/drawingListActions";
import type { DrawingCategory } from "../../store/types/DrawingList/DrawingCategory";
import type { DrawingType } from "../../store/types/DrawingList/DrawingType";

const tabList = ["Categories", "Types", "Combined View"];

const DrawingListPage = () => {
  const [currentTab, setCurrentTab] = useState("Categories");
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showTypeModal, setShowTypeModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<DrawingCategory | null>(null);
  const [selectedType, setSelectedType] = useState<DrawingType | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{
    type: "category" | "type";
    item: DrawingCategory | DrawingType;
  } | null>(null);

  const dispatch = useAppDispatch();
  const {
    categories,
    types,
    totalCategories,
    totalTypes,
    categoriesLoading,
    typesLoading,
    categoriesError,
    typesError,
    categoryDeleting,
    typeDeleting,
  } = useAppSelector((state) => state.drawingListReducer);

  useEffect(() => {
    dispatch(getAllCategoriesAction());
    dispatch(getAllTypesAction());
  }, [dispatch]);

  const handleAddCategory = () => {
    setSelectedCategory(null);
    setShowCategoryModal(true);
  };

  const handleAddType = () => {
    setSelectedType(null);
    setShowTypeModal(true);
  };

  const handleEditCategory = (category: DrawingCategory) => {
    setSelectedCategory(category);
    setShowCategoryModal(true);
  };

  const handleEditType = (type: DrawingType) => {
    setSelectedType(type);
    setShowTypeModal(true);
  };

  const handleDeleteCategory = (category: DrawingCategory) => {
    setItemToDelete({ type: "category", item: category });
    setDeleteConfirmOpen(true);
  };

  const handleDeleteType = (type: DrawingType) => {
    setItemToDelete({ type: "type", item: type });
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (!itemToDelete) return;

    if (itemToDelete.type === "category") {
      dispatch(
        deleteCategoryAction(itemToDelete.item.id, () => {
          setDeleteConfirmOpen(false);
          setItemToDelete(null);
        })
      );
    } else {
      dispatch(
        deleteTypeAction(itemToDelete.item.id, () => {
          setDeleteConfirmOpen(false);
          setItemToDelete(null);
        })
      );
    }
  };

  const handleCloseCategoryModal = () => {
    setShowCategoryModal(false);
    setSelectedCategory(null);
    // Refresh data after modal closes
    dispatch(getAllCategoriesAction());
  };

  const handleCloseTypeModal = () => {
    setShowTypeModal(false);
    setSelectedType(null);
    // Refresh data after modal closes
    dispatch(getAllTypesAction());
  };

  const getAddButton = () => {
    if (currentTab === "Categories") {
      return (
        <RequirePermission permission="drawingList:write">
          <Button
            onClick={handleAddCategory}
            variant="contained"
            disabled={!!categoriesError || categoriesLoading}
            startIcon={<SvgIcon component={PlusIcon} />}
            sx={{
              display: { xs: "none", sm: "flex" },
            }}
          >
            Add Category
          </Button>
        </RequirePermission>
      );
    } else if (currentTab === "Types") {
      return (
        <RequirePermission permission="drawingList:write">
          <Button
            onClick={handleAddType}
            variant="contained"
            disabled={!!typesError || typesLoading}
            startIcon={<SvgIcon component={PlusIcon} />}
            sx={{
              display: { xs: "none", sm: "flex" },
            }}
          >
            Add Type
          </Button>
        </RequirePermission>
      );
    }
    return null;
  };

  const getFloatingActionButton = () => {
    if (currentTab === "Categories") {
      return (
        <RequirePermission permission="drawingList:write">
          <Fab
            onClick={handleAddCategory}
            disabled={!!categoriesError || categoriesLoading}
            color="primary"
            sx={{
              position: "fixed",
              bottom: { xs: "24px", sm: "32px" },
              right: { xs: "20px", sm: "32px" },
              display: { xs: "flex", sm: "none" },
              zIndex: (theme) => theme.zIndex.speedDial,
              boxShadow: "0px 6px 12px 0px rgba(63, 140, 255, 0.26)",
              "&:hover": {
                boxShadow: "0px 8px 16px 0px rgba(63, 140, 255, 0.35)",
              },
            }}
          >
            <SvgIcon component={PlusIcon} sx={{ color: "#fff" }} />
          </Fab>
        </RequirePermission>
      );
    } else if (currentTab === "Types") {
      return (
        <RequirePermission permission="drawingList:write">
          <Fab
            onClick={handleAddType}
            disabled={!!typesError || typesLoading}
            color="primary"
            sx={{
              position: "fixed",
              bottom: { xs: "24px", sm: "32px" },
              right: { xs: "20px", sm: "32px" },
              display: { xs: "flex", sm: "none" },
              zIndex: (theme) => theme.zIndex.speedDial,
              boxShadow: "0px 6px 12px 0px rgba(63, 140, 255, 0.26)",
              "&:hover": {
                boxShadow: "0px 8px 16px 0px rgba(63, 140, 255, 0.35)",
              },
            }}
          >
            <SvgIcon component={PlusIcon} sx={{ color: "#fff" }} />
          </Fab>
        </RequirePermission>
      );
    }
    return null;
  };

  const getPageTitle = () => {
    if (currentTab === "Categories") {
      return `Drawing Categories (${totalCategories})`;
    } else if (currentTab === "Types") {
      return `Drawing Types (${totalTypes})`;
    }
    return "Drawing List Master Data";
  };

  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: { xs: "#F4F9FD", sm: "transparent" },
        minHeight: 0,
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          padding: { xs: "20px", sm: "0 0 20px 0", md: "0 0 20px 0", lg: "0 0 20px 0" },
          paddingX: { xs: "20px", sm: 0, md: 0, lg: 0 },
          flexShrink: 0,
        }}
      >
        <PageHeader
          title={getPageTitle()}
          endElement={
            <>
              <Box
                sx={{
                  width: { xs: "100%", sm: "100%", md: "35%", lg: "30%" },
                  marginBottom: { xs: "16px", sm: "16px", md: 0, lg: 0 },
                  order: { xs: -1, sm: -1, md: 0, lg: 0 },
                }}
              >
                <Tab
                  tabList={tabList}
                  currentTab={currentTab}
                  onChangeTab={(tab) => setCurrentTab(tab)}
                />
              </Box>
              {getAddButton()}
            </>
          }
        />
      </Box>

      {/* Error Display */}
      {categoriesError && currentTab === "Categories" && (
        <Box sx={{ padding: { xs: "0 20px", sm: "0" }, flexShrink: 0 }}>
          <Alert
            severity="error"
            sx={{
              margin: "20px 0",
              borderRadius: "12px",
              "& .MuiAlert-message": {
                width: "100%",
              },
            }}
          >
            <Typography variant="body1" component="div">
              {categoriesError}
            </Typography>
          </Alert>
        </Box>
      )}

      {typesError && (currentTab === "Types" || currentTab === "Combined View") && (
        <Box sx={{ padding: { xs: "0 20px", sm: "0" }, flexShrink: 0 }}>
          <Alert
            severity="error"
            sx={{
              margin: "20px 0",
              borderRadius: "12px",
              "& .MuiAlert-message": {
                width: "100%",
              },
            }}
          >
            <Typography variant="body1" component="div">
              {typesError}
            </Typography>
          </Alert>
        </Box>
      )}

      {/* Tab Content - Scrollable */}
      <Box sx={{ 
        flex: 1, 
        minHeight: 0, 
        overflowY: "auto", 
        overflowX: "hidden",
        paddingBottom: { xs: "100px", sm: "0" },
        "&::-webkit-scrollbar": {
          width: "8px",
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
      }}>
        {currentTab === "Categories" && !categoriesError && (
          <CategoriesList
            categories={categories}
            loading={categoriesLoading}
            onEdit={handleEditCategory}
            onDelete={handleDeleteCategory}
          />
        )}

        {currentTab === "Types" && !typesError && (
          <TypesList
            types={types}
            categories={categories}
            loading={typesLoading}
            onEdit={handleEditType}
            onDelete={handleDeleteType}
          />
        )}

        {currentTab === "Combined View" && !categoriesError && !typesError && (
          <CombinedView
            categories={categories}
            types={types}
            loading={categoriesLoading || typesLoading}
            onEditCategory={handleEditCategory}
            onDeleteCategory={handleDeleteCategory}
            onEditType={handleEditType}
            onDeleteType={handleDeleteType}
          />
        )}
      </Box>

      {getFloatingActionButton()}

      {/* Category Modal */}
      <Modal show={showCategoryModal} onClose={handleCloseCategoryModal}>
        <CategoryForm
          onClose={handleCloseCategoryModal}
          category={selectedCategory}
        />
      </Modal>

      {/* Type Modal */}
      <Modal show={showTypeModal} onClose={handleCloseTypeModal}>
        <TypeForm onClose={handleCloseTypeModal} type={selectedType} />
      </Modal>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this{" "}
            {itemToDelete?.type === "category" ? "category" : "type"}? This action
            cannot be undone.
            {itemToDelete?.type === "category" &&
              " Note: Categories with associated types cannot be deleted."}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
          <Button
            onClick={confirmDelete}
            color="error"
            variant="contained"
            disabled={categoryDeleting || typeDeleting}
          >
            {categoryDeleting || typeDeleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DrawingListPage;

