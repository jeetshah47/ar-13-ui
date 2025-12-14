export interface PageRequest {
  title: string;
}

export interface UpdatePageRequest {
  title?: string;
  isActive?: boolean;
}

export interface SectionRequest {
  id?: string;
  title: string;
  content: string;
  order: number;
}

export interface UpdateSectionsRequest {
  sections: SectionRequest[];
}

