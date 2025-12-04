import { http } from "../../config/http";
import { API_BASE_URL } from "../../config/api";
import type { GetFoldersResponse } from "../types/InfoPortal/FolderResponse";
import type { FolderDetailResponse } from "../types/InfoPortal/FolderResponse";
import type { FolderResponse } from "../types/InfoPortal/FolderResponse";
import type { FolderRequest } from "../types/InfoPortal/FolderRequest";
import type { UpdateFolderRequest } from "../types/InfoPortal/FolderRequest";
import type { PageDetailResponse } from "../types/InfoPortal/PageResponse";
import type { PageResponse } from "../types/InfoPortal/PageResponse";
import type { PageRequest } from "../types/InfoPortal/PageRequest";
import type { UpdatePageRequest } from "../types/InfoPortal/PageRequest";
import type { SectionsResponse } from "../types/InfoPortal/SectionResponse";
import type { UpdateSectionsRequest } from "../types/InfoPortal/PageRequest";
import type { AttachmentResponse } from "../types/InfoPortal/AttachmentResponse";
import type { StatisticsResponse } from "../types/InfoPortal/StatisticsResponse";

const BASE_URL = `${API_BASE_URL}/info-portal`;

// Folders
export async function getAllFolders(): Promise<GetFoldersResponse> {
  const url = `${BASE_URL}/folders`;
  const result = await http.get(url);
  return result.data;
}

export async function getFolderById(folderId: string): Promise<FolderDetailResponse> {
  const url = `${BASE_URL}/folders/${folderId}`;
  const result = await http.get(url);
  return result.data;
}

export async function createFolder(folder: FolderRequest): Promise<{ folder: FolderResponse }> {
  const url = `${BASE_URL}/folders`;
  const result = await http.post(url, folder);
  return result.data;
}

export async function updateFolder(
  folderId: string,
  folder: UpdateFolderRequest
): Promise<{ folder: FolderResponse }> {
  const url = `${BASE_URL}/folders/${folderId}`;
  const result = await http.put(url, folder);
  return result.data;
}

export async function deleteFolder(folderId: string): Promise<{ message: string }> {
  const url = `${BASE_URL}/folders/${folderId}`;
  const result = await http.delete(url);
  return result.data;
}

// Pages
export async function getPageById(pageId: string): Promise<PageDetailResponse> {
  const url = `${BASE_URL}/pages/${pageId}`;
  const result = await http.get(url);
  return result.data;
}

export async function createPage(
  folderId: string,
  page: PageRequest
): Promise<{ page: PageResponse }> {
  const url = `${BASE_URL}/folders/${folderId}/pages`;
  const result = await http.post(url, page);
  return result.data;
}

export async function updatePage(
  pageId: string,
  page: UpdatePageRequest
): Promise<{ page: PageResponse }> {
  const url = `${BASE_URL}/pages/${pageId}`;
  const result = await http.put(url, page);
  return result.data;
}

export async function deletePage(pageId: string): Promise<{ message: string }> {
  const url = `${BASE_URL}/pages/${pageId}`;
  const result = await http.delete(url);
  return result.data;
}

// Page Sections
export async function updatePageSections(
  pageId: string,
  sections: UpdateSectionsRequest
): Promise<SectionsResponse> {
  const url = `${BASE_URL}/pages/${pageId}/sections`;
  const result = await http.put(url, sections);
  return result.data;
}

// Attachments
export async function uploadAttachment(
  pageId: string,
  file: File,
  name?: string
): Promise<{ attachment: AttachmentResponse }> {
  const url = `${BASE_URL}/pages/${pageId}/attachments`;
  const formData = new FormData();
  formData.append("file", file);
  if (name) {
    formData.append("name", name);
  }
  const result = await http.post(url, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return result.data;
}

export async function deleteAttachment(attachmentId: string): Promise<{ message: string }> {
  const url = `${BASE_URL}/attachments/${attachmentId}`;
  const result = await http.delete(url);
  return result.data;
}

// Statistics
export async function getStatistics(): Promise<StatisticsResponse> {
  const url = `${BASE_URL}/statistics`;
  const result = await http.get(url);
  return result.data;
}

