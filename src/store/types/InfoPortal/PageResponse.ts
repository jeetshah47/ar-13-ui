import type { SectionResponse } from "./SectionResponse";
import type { AttachmentResponse } from "./AttachmentResponse";

export interface PageResponse {
  id: string;
  title: string;
  lastModified: string;
  isActive: boolean;
  folderId: string;
  createdAt: string;
  updatedAt: string;
  sections?: SectionResponse[];
  attachments?: AttachmentResponse[];
}

export interface PageDetailResponse {
  page: {
    id: string;
    title: string;
    lastModified: string;
    isActive: boolean;
    folderId: string;
    createdAt: string;
    updatedAt: string;
    sections: SectionResponse[];
    attachments: AttachmentResponse[];
  };
}

