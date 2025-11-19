export interface DrawingType {
  id: string;
  categoryId: string;
  name: string;
  description?: string;
  order: number;
  isActive: boolean;
  created: string;
  updated?: string | null;
}

