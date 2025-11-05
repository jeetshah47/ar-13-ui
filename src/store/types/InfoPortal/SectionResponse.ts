export interface SectionResponse {
  id: string;
  title: string;
  content: string;
  order: number;
  pageId: string;
  createdAt: string;
  updatedAt: string;
}

export interface SectionsResponse {
  sections: SectionResponse[];
}

