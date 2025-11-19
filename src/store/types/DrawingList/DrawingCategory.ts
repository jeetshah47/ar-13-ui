export interface DrawingCategory {
  id: string;
  name: string;
  description?: string;
  order: number;
  isActive: boolean;
  created: string;
  updated?: string | null;
}

