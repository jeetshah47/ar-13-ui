import type { DrawingCategory } from "./DrawingCategory";
import type { DrawingType } from "./DrawingType";

// Category Responses
export interface CategoryListResponse {
  categories: DrawingCategory[];
  total: number;
}

export interface CategoryResponse {
  category: DrawingCategory;
}

export interface CategoryCreateResponse {
  message: string;
  category: DrawingCategory;
}

export interface CategoryUpdateResponse {
  message: string;
  category: DrawingCategory;
}

export interface CategoryDeleteResponse {
  message: string;
}

// Type Responses
export interface TypeListResponse {
  types: DrawingType[];
  total: number;
}

export interface TypeResponse {
  type: DrawingType;
}

export interface TypeCreateResponse {
  message: string;
  type: DrawingType;
}

export interface TypeUpdateResponse {
  message: string;
  type: DrawingType;
}

export interface TypeDeleteResponse {
  message: string;
}

// Combined Response
export interface CategoryWithTypes extends DrawingCategory {
  types: DrawingType[];
}

export interface CategoriesWithTypesResponse {
  categories: CategoryWithTypes[];
  total: number;
}

// Request Types
export interface CreateCategoryRequest {
  name: string;
  description?: string;
  order: number;
  isActive?: boolean;
}

export interface UpdateCategoryRequest {
  name: string;
  description?: string;
  order: number;
  isActive: boolean;
}

export interface CreateTypeRequest {
  categoryId: string;
  name: string;
  description?: string;
  order: number;
  isActive?: boolean;
}

export interface UpdateTypeRequest {
  categoryId: string;
  name: string;
  description?: string;
  order: number;
  isActive: boolean;
}

