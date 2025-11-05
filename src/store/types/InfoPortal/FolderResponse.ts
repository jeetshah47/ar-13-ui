export interface FolderResponse {
  id: string;
  name: string;
  pageCount: number;
  color: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetFoldersResponse {
  folders: FolderResponse[];
  totalFolders: number;
}

export interface FolderDetailResponse {
  folder: {
    id: string;
    name: string;
    color: string;
    createdAt: string;
    updatedAt: string;
    pages: PageResponse[];
  };
}

