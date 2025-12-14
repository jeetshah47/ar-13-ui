import type { DrawingCategory } from "../../types/DrawingList/DrawingCategory";
import type { DrawingType } from "../../types/DrawingList/DrawingType";

export interface DrawingListState {
  categories: DrawingCategory[];
  types: DrawingType[];
  selectedCategory: DrawingCategory | null;
  selectedType: DrawingType | null;
  totalCategories: number;
  totalTypes: number;
  
  // Category loading states
  categoriesLoading: boolean;
  categoriesError: string;
  
  // Type loading states
  typesLoading: boolean;
  typesError: string;
  
  // Category CRUD states
  categoryCreating: boolean;
  categoryUpdating: boolean;
  categoryDeleting: boolean;
  categoryError: string;
  
  // Type CRUD states
  typeCreating: boolean;
  typeUpdating: boolean;
  typeDeleting: boolean;
  typeError: string;
  
  // Single item loading states
  categoryLoading: boolean;
  typeLoading: boolean;
}

