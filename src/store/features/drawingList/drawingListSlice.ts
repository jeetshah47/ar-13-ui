import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { DrawingListState } from "./drawingListTypes";
import type {
  CategoryListResponse,
  CategoryResponse,
  TypeListResponse,
  TypeResponse,
  CategoriesWithTypesResponse,
  CategoryWithTypes,
} from "../../types/DrawingList/DrawingListResponse";
import type { DrawingCategory } from "../../types/DrawingList/DrawingCategory";
import type { DrawingType } from "../../types/DrawingList/DrawingType";

const initialState: DrawingListState = {
  categories: [],
  types: [],
  selectedCategory: null,
  selectedType: null,
  totalCategories: 0,
  totalTypes: 0,
  
  categoriesLoading: false,
  categoriesError: "",
  
  typesLoading: false,
  typesError: "",
  
  categoryCreating: false,
  categoryUpdating: false,
  categoryDeleting: false,
  categoryError: "",
  
  typeCreating: false,
  typeUpdating: false,
  typeDeleting: false,
  typeError: "",
  
  categoryLoading: false,
  typeLoading: false,
};

const drawingListSlice = createSlice({
  name: "drawingList",
  initialState,
  reducers: {
    // Get all categories
    getAllCategoriesRequest(state) {
      state.categoriesLoading = true;
      state.categoriesError = "";
    },
    getAllCategoriesSuccess(state, action: PayloadAction<CategoryListResponse>) {
      state.categoriesLoading = false;
      state.categories = action.payload.categories;
      state.totalCategories = action.payload.total;
      state.categoriesError = "";
    },
    getAllCategoriesFailed(state, action: PayloadAction<string>) {
      state.categoriesLoading = false;
      state.categoriesError = action.payload;
    },
    
    // Get category by ID
    getCategoryByIdRequest(state) {
      state.categoryLoading = true;
      state.categoryError = "";
    },
    getCategoryByIdSuccess(state, action: PayloadAction<CategoryResponse>) {
      state.categoryLoading = false;
      state.selectedCategory = action.payload.category;
      state.categoryError = "";
    },
    getCategoryByIdFailed(state, action: PayloadAction<string>) {
      state.categoryLoading = false;
      state.categoryError = action.payload;
    },
    
    // Create category
    createCategoryRequest(state) {
      state.categoryCreating = true;
      state.categoryError = "";
    },
    createCategorySuccess(state, action: PayloadAction<DrawingCategory>) {
      state.categoryCreating = false;
      state.categories.push(action.payload);
      state.totalCategories += 1;
      state.categoryError = "";
    },
    createCategoryFailed(state, action: PayloadAction<string>) {
      state.categoryCreating = false;
      state.categoryError = action.payload;
    },
    
    // Update category
    updateCategoryRequest(state) {
      state.categoryUpdating = true;
      state.categoryError = "";
    },
    updateCategorySuccess(state, action: PayloadAction<DrawingCategory>) {
      state.categoryUpdating = false;
      const index = state.categories.findIndex((cat) => cat.id === action.payload.id);
      if (index !== -1) {
        state.categories[index] = action.payload;
      }
      if (state.selectedCategory?.id === action.payload.id) {
        state.selectedCategory = action.payload;
      }
      state.categoryError = "";
    },
    updateCategoryFailed(state, action: PayloadAction<string>) {
      state.categoryUpdating = false;
      state.categoryError = action.payload;
    },
    
    // Delete category
    deleteCategoryRequest(state) {
      state.categoryDeleting = true;
      state.categoryError = "";
    },
    deleteCategorySuccess(state, action: PayloadAction<string>) {
      state.categoryDeleting = false;
      state.categories = state.categories.filter((cat) => cat.id !== action.payload);
      state.totalCategories -= 1;
      if (state.selectedCategory?.id === action.payload) {
        state.selectedCategory = null;
      }
      state.categoryError = "";
    },
    deleteCategoryFailed(state, action: PayloadAction<string>) {
      state.categoryDeleting = false;
      state.categoryError = action.payload;
    },
    
    // Get all types
    getAllTypesRequest(state) {
      state.typesLoading = true;
      state.typesError = "";
    },
    getAllTypesSuccess(state, action: PayloadAction<TypeListResponse>) {
      state.typesLoading = false;
      state.types = action.payload.types;
      state.totalTypes = action.payload.total;
      state.typesError = "";
    },
    getAllTypesFailed(state, action: PayloadAction<string>) {
      state.typesLoading = false;
      state.typesError = action.payload;
    },
    
    // Get type by ID
    getTypeByIdRequest(state) {
      state.typeLoading = true;
      state.typeError = "";
    },
    getTypeByIdSuccess(state, action: PayloadAction<TypeResponse>) {
      state.typeLoading = false;
      state.selectedType = action.payload.type;
      state.typeError = "";
    },
    getTypeByIdFailed(state, action: PayloadAction<string>) {
      state.typeLoading = false;
      state.typeError = action.payload;
    },
    
    // Get types by category
    getTypesByCategorySuccess(state, _action: PayloadAction<TypeListResponse>) {
      // This can be used to filter types in the UI
      state.typesError = "";
    },
    
    // Create type
    createTypeRequest(state) {
      state.typeCreating = true;
      state.typeError = "";
    },
    createTypeSuccess(state, action: PayloadAction<DrawingType>) {
      state.typeCreating = false;
      state.types.push(action.payload);
      state.totalTypes += 1;
      state.typeError = "";
    },
    createTypeFailed(state, action: PayloadAction<string>) {
      state.typeCreating = false;
      state.typeError = action.payload;
    },
    
    // Update type
    updateTypeRequest(state) {
      state.typeUpdating = true;
      state.typeError = "";
    },
    updateTypeSuccess(state, action: PayloadAction<DrawingType>) {
      state.typeUpdating = false;
      const index = state.types.findIndex((type) => type.id === action.payload.id);
      if (index !== -1) {
        state.types[index] = action.payload;
      }
      if (state.selectedType?.id === action.payload.id) {
        state.selectedType = action.payload;
      }
      state.typeError = "";
    },
    updateTypeFailed(state, action: PayloadAction<string>) {
      state.typeUpdating = false;
      state.typeError = action.payload;
    },
    
    // Delete type
    deleteTypeRequest(state) {
      state.typeDeleting = true;
      state.typeError = "";
    },
    deleteTypeSuccess(state, action: PayloadAction<string>) {
      state.typeDeleting = false;
      state.types = state.types.filter((type) => type.id !== action.payload);
      state.totalTypes -= 1;
      if (state.selectedType?.id === action.payload) {
        state.selectedType = null;
      }
      state.typeError = "";
    },
    deleteTypeFailed(state, action: PayloadAction<string>) {
      state.typeDeleting = false;
      state.typeError = action.payload;
    },
    
    // Get categories with types
    getCategoriesWithTypesSuccess(
      state,
      action: PayloadAction<CategoriesWithTypesResponse>
    ) {
      state.categories = action.payload.categories;
      state.totalCategories = action.payload.total;
      // Flatten types from all categories
      const allTypes: DrawingType[] = [];
      action.payload.categories.forEach((cat: CategoryWithTypes) => {
        allTypes.push(...cat.types);
      });
      state.types = allTypes;
      state.totalTypes = allTypes.length;
      state.categoriesError = "";
      state.typesError = "";
    },
    
    // Clear selections
    clearSelectedCategory(state) {
      state.selectedCategory = null;
    },
    clearSelectedType(state) {
      state.selectedType = null;
    },
    
    // Clear errors
    clearCategoryError(state) {
      state.categoryError = "";
      state.categoriesError = "";
    },
    clearTypeError(state) {
      state.typeError = "";
      state.typesError = "";
    },
  },
});

export const {
  getAllCategoriesRequest,
  getAllCategoriesSuccess,
  getAllCategoriesFailed,
  getCategoryByIdRequest,
  getCategoryByIdSuccess,
  getCategoryByIdFailed,
  createCategoryRequest,
  createCategorySuccess,
  createCategoryFailed,
  updateCategoryRequest,
  updateCategorySuccess,
  updateCategoryFailed,
  deleteCategoryRequest,
  deleteCategorySuccess,
  deleteCategoryFailed,
  getAllTypesRequest,
  getAllTypesSuccess,
  getAllTypesFailed,
  getTypeByIdRequest,
  getTypeByIdSuccess,
  getTypeByIdFailed,
  getTypesByCategorySuccess,
  createTypeRequest,
  createTypeSuccess,
  createTypeFailed,
  updateTypeRequest,
  updateTypeSuccess,
  updateTypeFailed,
  deleteTypeRequest,
  deleteTypeSuccess,
  deleteTypeFailed,
  getCategoriesWithTypesSuccess,
  clearSelectedCategory,
  clearSelectedType,
  clearCategoryError,
  clearTypeError,
} = drawingListSlice.actions;

export const drawingListReducer = drawingListSlice.reducer;

