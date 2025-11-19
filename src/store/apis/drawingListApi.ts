import { http } from "../../config/http";
import { API_BASE_URL } from "../../config/api";
import type {
  CategoryListResponse,
  CategoryResponse,
  CategoryCreateResponse,
  CategoryUpdateResponse,
  CategoryDeleteResponse,
  TypeListResponse,
  TypeResponse,
  TypeCreateResponse,
  TypeUpdateResponse,
  TypeDeleteResponse,
  CategoriesWithTypesResponse,
  CreateCategoryRequest,
  UpdateCategoryRequest,
  CreateTypeRequest,
  UpdateTypeRequest,
} from "../types/DrawingList/DrawingListResponse";

// Category APIs
export async function getAllCategories(): Promise<CategoryListResponse> {
  const url = `${API_BASE_URL}/drawing-list/categories`;
  const result = await http.get(url);
  return result.data;
}

export async function getCategoryById(id: string): Promise<CategoryResponse> {
  const url = `${API_BASE_URL}/drawing-list/categories/${id}`;
  const result = await http.get(url);
  return result.data;
}

export async function createCategory(
  data: CreateCategoryRequest
): Promise<CategoryCreateResponse> {
  const url = `${API_BASE_URL}/drawing-list/categories`;
  const result = await http.post(url, data);
  return result.data;
}

export async function updateCategory(
  id: string,
  data: UpdateCategoryRequest
): Promise<CategoryUpdateResponse> {
  const url = `${API_BASE_URL}/drawing-list/categories/${id}`;
  const result = await http.put(url, data);
  return result.data;
}

export async function deleteCategory(id: string): Promise<CategoryDeleteResponse> {
  const url = `${API_BASE_URL}/drawing-list/categories/${id}`;
  const result = await http.delete(url);
  return result.data;
}

// Type APIs
export async function getAllTypes(): Promise<TypeListResponse> {
  const url = `${API_BASE_URL}/drawing-list/types`;
  const result = await http.get(url);
  return result.data;
}

export async function getTypeById(id: string): Promise<TypeResponse> {
  const url = `${API_BASE_URL}/drawing-list/types/${id}`;
  const result = await http.get(url);
  return result.data;
}

export async function getTypesByCategory(
  categoryId: string
): Promise<TypeListResponse> {
  const url = `${API_BASE_URL}/drawing-list/types/category/${categoryId}`;
  const result = await http.get(url);
  return result.data;
}

export async function createType(data: CreateTypeRequest): Promise<TypeCreateResponse> {
  const url = `${API_BASE_URL}/drawing-list/types`;
  const result = await http.post(url, data);
  return result.data;
}

export async function updateType(
  id: string,
  data: UpdateTypeRequest
): Promise<TypeUpdateResponse> {
  const url = `${API_BASE_URL}/drawing-list/types/${id}`;
  const result = await http.put(url, data);
  return result.data;
}

export async function deleteType(id: string): Promise<TypeDeleteResponse> {
  const url = `${API_BASE_URL}/drawing-list/types/${id}`;
  const result = await http.delete(url);
  return result.data;
}

// Combined API
export async function getCategoriesWithTypes(): Promise<CategoriesWithTypesResponse> {
  const url = `${API_BASE_URL}/drawing-list/categories-with-types`;
  const result = await http.get(url);
  return result.data;
}

