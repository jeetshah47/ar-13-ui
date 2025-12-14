import type { AppDispatch } from "../../store";
import {
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
} from "./drawingListSlice";
import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  getAllTypes,
  getTypeById,
  getTypesByCategory,
  createType,
  updateType,
  deleteType,
  getCategoriesWithTypes,
} from "../../apis/drawingListApi";
import type { AxiosError } from "axios";
import type { DrawingListErrorResponse } from "../../types/DrawingList/DrawingListErrorResponse";
import type {
  CreateCategoryRequest,
  UpdateCategoryRequest,
  CreateTypeRequest,
  UpdateTypeRequest,
} from "../../types/DrawingList/DrawingListResponse";
import toast from "react-hot-toast";

// Category Actions
export const getAllCategoriesAction = () => async (dispatch: AppDispatch) => {
  dispatch(getAllCategoriesRequest());
  try {
    const response = await getAllCategories();
    dispatch(getAllCategoriesSuccess(response));
  } catch (error) {
    let errorMessage = "Failed to fetch categories";
    
    if (typeof error === "string") {
      errorMessage = error;
    } else if (error instanceof Error) {
      errorMessage = error.message || errorMessage;
    } else if (error && typeof error === "object" && "response" in error) {
      const axiosError = error as AxiosError<DrawingListErrorResponse>;
      errorMessage =
        axiosError.response?.data?.error ||
        axiosError.response?.data?.message ||
        axiosError.message ||
        errorMessage;
    }
    
    dispatch(getAllCategoriesFailed(errorMessage));
    
    if (!errorMessage.toLowerCase().includes("admin access required")) {
      toast.error(errorMessage);
    }
  }
};

export const getCategoryByIdAction = (id: string) => async (dispatch: AppDispatch) => {
  dispatch(getCategoryByIdRequest());
  try {
    const response = await getCategoryById(id);
    dispatch(getCategoryByIdSuccess(response));
  } catch (error) {
    let errorMessage = "Failed to fetch category";
    
    if (typeof error === "string") {
      errorMessage = error;
    } else if (error instanceof Error) {
      errorMessage = error.message || errorMessage;
    } else if (error && typeof error === "object" && "response" in error) {
      const axiosError = error as AxiosError<DrawingListErrorResponse>;
      errorMessage =
        axiosError.response?.data?.error ||
        axiosError.response?.data?.message ||
        axiosError.message ||
        errorMessage;
    }
    
    dispatch(getCategoryByIdFailed(errorMessage));
    
    if (!errorMessage.toLowerCase().includes("admin access required")) {
      toast.error(errorMessage);
    }
  }
};

export const createCategoryAction =
  (data: CreateCategoryRequest, cb?: () => void) => async (dispatch: AppDispatch) => {
    dispatch(createCategoryRequest());
    try {
      const response = await createCategory(data);
      dispatch(createCategorySuccess(response.category));
      toast.success(response.message || "Category created successfully");
      if (cb) cb();
    } catch (error) {
      let errorMessage = "Failed to create category";
      
      if (typeof error === "string") {
        errorMessage = error;
      } else if (error instanceof Error) {
        errorMessage = error.message || errorMessage;
      } else if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as AxiosError<DrawingListErrorResponse>;
        errorMessage =
          axiosError.response?.data?.error ||
          axiosError.response?.data?.message ||
          axiosError.message ||
          errorMessage;
      }
      
      dispatch(createCategoryFailed(errorMessage));
      toast.error(errorMessage);
    }
  };

export const updateCategoryAction =
  (id: string, data: UpdateCategoryRequest, cb?: () => void) =>
  async (dispatch: AppDispatch) => {
    dispatch(updateCategoryRequest());
    try {
      const response = await updateCategory(id, data);
      dispatch(updateCategorySuccess(response.category));
      toast.success(response.message || "Category updated successfully");
      if (cb) cb();
    } catch (error) {
      let errorMessage = "Failed to update category";
      
      if (typeof error === "string") {
        errorMessage = error;
      } else if (error instanceof Error) {
        errorMessage = error.message || errorMessage;
      } else if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as AxiosError<DrawingListErrorResponse>;
        errorMessage =
          axiosError.response?.data?.error ||
          axiosError.response?.data?.message ||
          axiosError.message ||
          errorMessage;
      }
      
      dispatch(updateCategoryFailed(errorMessage));
      toast.error(errorMessage);
    }
  };

export const deleteCategoryAction =
  (id: string, cb?: () => void) => async (dispatch: AppDispatch) => {
    dispatch(deleteCategoryRequest());
    try {
      await deleteCategory(id);
      dispatch(deleteCategorySuccess(id));
      toast.success("Category deleted successfully");
      if (cb) cb();
    } catch (error) {
      let errorMessage = "Failed to delete category";
      
      if (typeof error === "string") {
        errorMessage = error;
      } else if (error instanceof Error) {
        errorMessage = error.message || errorMessage;
      } else if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as AxiosError<DrawingListErrorResponse>;
        errorMessage =
          axiosError.response?.data?.error ||
          axiosError.response?.data?.message ||
          axiosError.message ||
          errorMessage;
      }
      
      dispatch(deleteCategoryFailed(errorMessage));
      toast.error(errorMessage);
    }
  };

// Type Actions
export const getAllTypesAction = () => async (dispatch: AppDispatch) => {
  dispatch(getAllTypesRequest());
  try {
    const response = await getAllTypes();
    dispatch(getAllTypesSuccess(response));
  } catch (error) {
    let errorMessage = "Failed to fetch types";
    
    if (typeof error === "string") {
      errorMessage = error;
    } else if (error instanceof Error) {
      errorMessage = error.message || errorMessage;
    } else if (error && typeof error === "object" && "response" in error) {
      const axiosError = error as AxiosError<DrawingListErrorResponse>;
      errorMessage =
        axiosError.response?.data?.error ||
        axiosError.response?.data?.message ||
        axiosError.message ||
        errorMessage;
    }
    
    dispatch(getAllTypesFailed(errorMessage));
    
    if (!errorMessage.toLowerCase().includes("admin access required")) {
      toast.error(errorMessage);
    }
  }
};

export const getTypeByIdAction = (id: string) => async (dispatch: AppDispatch) => {
  dispatch(getTypeByIdRequest());
  try {
    const response = await getTypeById(id);
    dispatch(getTypeByIdSuccess(response));
  } catch (error) {
    let errorMessage = "Failed to fetch type";
    
    if (typeof error === "string") {
      errorMessage = error;
    } else if (error instanceof Error) {
      errorMessage = error.message || errorMessage;
    } else if (error && typeof error === "object" && "response" in error) {
      const axiosError = error as AxiosError<DrawingListErrorResponse>;
      errorMessage =
        axiosError.response?.data?.error ||
        axiosError.response?.data?.message ||
        axiosError.message ||
        errorMessage;
    }
    
    dispatch(getTypeByIdFailed(errorMessage));
    
    if (!errorMessage.toLowerCase().includes("admin access required")) {
      toast.error(errorMessage);
    }
  }
};

export const getTypesByCategoryAction =
  (categoryId: string) => async (dispatch: AppDispatch) => {
    try {
      const response = await getTypesByCategory(categoryId);
      dispatch(getTypesByCategorySuccess(response));
    } catch (error) {
      let errorMessage = "Failed to fetch types by category";
      
      if (typeof error === "string") {
        errorMessage = error;
      } else if (error instanceof Error) {
        errorMessage = error.message || errorMessage;
      } else if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as AxiosError<DrawingListErrorResponse>;
        errorMessage =
          axiosError.response?.data?.error ||
          axiosError.response?.data?.message ||
          axiosError.message ||
          errorMessage;
      }
      
      if (!errorMessage.toLowerCase().includes("admin access required")) {
        toast.error(errorMessage);
      }
    }
  };

export const createTypeAction =
  (data: CreateTypeRequest, cb?: () => void) => async (dispatch: AppDispatch) => {
    dispatch(createTypeRequest());
    try {
      const response = await createType(data);
      dispatch(createTypeSuccess(response.type));
      toast.success(response.message || "Drawing type created successfully");
      if (cb) cb();
    } catch (error) {
      let errorMessage = "Failed to create type";
      
      if (typeof error === "string") {
        errorMessage = error;
      } else if (error instanceof Error) {
        errorMessage = error.message || errorMessage;
      } else if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as AxiosError<DrawingListErrorResponse>;
        errorMessage =
          axiosError.response?.data?.error ||
          axiosError.response?.data?.message ||
          axiosError.message ||
          errorMessage;
      }
      
      dispatch(createTypeFailed(errorMessage));
      toast.error(errorMessage);
    }
  };

export const updateTypeAction =
  (id: string, data: UpdateTypeRequest, cb?: () => void) =>
  async (dispatch: AppDispatch) => {
    dispatch(updateTypeRequest());
    try {
      const response = await updateType(id, data);
      dispatch(updateTypeSuccess(response.type));
      toast.success(response.message || "Drawing type updated successfully");
      if (cb) cb();
    } catch (error) {
      let errorMessage = "Failed to update type";
      
      if (typeof error === "string") {
        errorMessage = error;
      } else if (error instanceof Error) {
        errorMessage = error.message || errorMessage;
      } else if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as AxiosError<DrawingListErrorResponse>;
        errorMessage =
          axiosError.response?.data?.error ||
          axiosError.response?.data?.message ||
          axiosError.message ||
          errorMessage;
      }
      
      dispatch(updateTypeFailed(errorMessage));
      toast.error(errorMessage);
    }
  };

export const deleteTypeAction =
  (id: string, cb?: () => void) => async (dispatch: AppDispatch) => {
    dispatch(deleteTypeRequest());
    try {
      await deleteType(id);
      dispatch(deleteTypeSuccess(id));
      toast.success("Drawing type deleted successfully");
      if (cb) cb();
    } catch (error) {
      let errorMessage = "Failed to delete type";
      
      if (typeof error === "string") {
        errorMessage = error;
      } else if (error instanceof Error) {
        errorMessage = error.message || errorMessage;
      } else if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as AxiosError<DrawingListErrorResponse>;
        errorMessage =
          axiosError.response?.data?.error ||
          axiosError.response?.data?.message ||
          axiosError.message ||
          errorMessage;
      }
      
      dispatch(deleteTypeFailed(errorMessage));
      toast.error(errorMessage);
    }
  };

// Combined Action
export const getCategoriesWithTypesAction = () => async (dispatch: AppDispatch) => {
  dispatch(getAllCategoriesRequest());
  dispatch(getAllTypesRequest());
  try {
    const response = await getCategoriesWithTypes();
    dispatch(getCategoriesWithTypesSuccess(response));
  } catch (error) {
    let errorMessage = "Failed to fetch categories with types";
    
    if (typeof error === "string") {
      errorMessage = error;
    } else if (error instanceof Error) {
      errorMessage = error.message || errorMessage;
    } else if (error && typeof error === "object" && "response" in error) {
      const axiosError = error as AxiosError<DrawingListErrorResponse>;
      errorMessage =
        axiosError.response?.data?.error ||
        axiosError.response?.data?.message ||
        axiosError.message ||
        errorMessage;
    }
    
    dispatch(getAllCategoriesFailed(errorMessage));
    dispatch(getAllTypesFailed(errorMessage));
    
    if (!errorMessage.toLowerCase().includes("admin access required")) {
      toast.error(errorMessage);
    }
  }
};

