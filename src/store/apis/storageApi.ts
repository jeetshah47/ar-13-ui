import { http } from "../../config/http";
import { API_BASE_URL } from "../../config/api";
import { filebrowserHttp } from "../../config/filebrowserHttp";

export interface StorageObject {
  name: string;
  path: string;
  isFolder: boolean;
  size: number;
  lastModified: string;
  contentType?: string;
}

export interface ListFilesResponse {
  files: StorageObject[];
  path: string;
}

// FileBrowser API types
export interface FileBrowserItem {
  name: string;
  path: string;
  isFolder: boolean;
  size: number;
  modified: string;
  mimeType?: string;
}

export interface BrowseResponse {
  path: string;
  files: FileBrowserItem[];
}

export interface FileURLResponse {
  url: string;
  path: string;
  expiry: number;
}

export interface UploadFileResponse {
  message: string;
  objectName: string;
  path: string;
  size: number;
}

/**
 * List files and folders in NAS storage through backend API
 * @param path - Optional path prefix (e.g., "/folder/subfolder"). Defaults to "" for root
 * @returns List of files and folders
 */
export async function listFiles(path: string = ""): Promise<ListFilesResponse> {
  // Use backend API which proxies to filebrowser service
  const url = `${API_BASE_URL}/storage/files`;
  const result = await http.get<ListFilesResponse>(url, {
    params: { path: path || "" },
  });
  
  return result.data;
}

/**
 * Get a download URL for a file through backend API
 * @param path - Path to the file in storage
 * @param expiry - Expiry time in seconds (default: 3600)
 * @returns Download URL and metadata
 */
export async function getFileURL(
  path: string,
  expiry: number = 3600
): Promise<FileURLResponse> {
  // Use backend API which proxies to filebrowser service
  const url = `${API_BASE_URL}/storage/file-url`;
  const result = await http.get<FileURLResponse>(url, {
    params: { 
    path: path,
      expiry: expiry,
    },
  });
  
  return result.data;
}

/**
 * Get direct download URL for a file (convenience function)
 * @param path - Path to the file in storage
 * @param expiry - Expiry time in seconds (default: 3600)
 * @returns Direct download URL
 */
export async function getFileDownloadUrl(
  path: string,
  expiry: number = 3600
): Promise<string> {
  const response = await getFileURL(path, expiry);
  return response.url;
}

/**
 * Upload a file to NAS storage
 * @param file - File to upload
 * @param path - Optional path prefix (e.g., "/folder")
 * @returns Upload response with file metadata
 */
export async function uploadFile(
  file: File,
  path: string = ""
): Promise<UploadFileResponse> {
  const url = `${API_BASE_URL}/storage/upload`;
  const formData = new FormData();
  formData.append("file", file);
  if (path) {
    formData.append("path", path);
  }
  const result = await http.post(url, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return result.data;
}

/**
 * Browse folders and files in NAS storage using FileBrowser service
 * @param path - Optional path prefix (e.g., "/folder/subfolder"). Defaults to "/" for root
 * @returns List of folders and files
 */
export async function browseNAS(path: string = "/"): Promise<BrowseResponse> {
  const url = "/api/browse";
  const result = await filebrowserHttp.get<BrowseResponse>(url, {
    params: { path: path || "/" },
  });
  return result.data;
}

// FileBrowser service response types
export interface RenameFileResponse {
  name: string;
  path: string;
  isFolder: boolean;
  size: number;
  modified: string;
  mimeType?: string;
}

export interface DeleteFileResponse {
  path: string;
  deletedAt: string;
}

export interface CreateFolderResponse {
  path: string;
  createdAt: string;
}

export interface MoveFileResponse {
  message: string;
  sourcePath: string;
  destinationPath: string;
}

/**
 * Rename a file or folder in NAS storage using FileBrowser service
 * @param path - Current path of the file or folder
 * @param newName - New name for the file or folder
 * @returns Rename response
 */
export async function renameItem(
  path: string,
  newName: string
): Promise<RenameFileResponse> {
  const url = "/api/rename";
  const result = await filebrowserHttp.put<RenameFileResponse>(
    url,
    { newName },
    {
      params: { path },
    }
  );
  return result.data;
}

/**
 * Delete a file or folder from NAS storage using FileBrowser service
 * @param path - Path to the file or folder to delete
 * @returns Delete response
 */
export async function deleteItem(path: string): Promise<DeleteFileResponse> {
  const url = "/api/delete";
  const result = await filebrowserHttp.delete<DeleteFileResponse>(url, {
    params: { path },
  });
  return result.data;
}

/**
 * Create a new folder in NAS storage using FileBrowser service
 * @param parentPath - Parent directory path (e.g., "/folder"). Defaults to "/"
 * @param folderName - Name of the folder to create
 * @returns Create folder response
 */
export async function createFolder(
  parentPath: string = "/",
  folderName: string
): Promise<CreateFolderResponse> {
  const url = "/api/create-folder";
  const result = await filebrowserHttp.post<CreateFolderResponse>(
    url,
    { folderName },
    {
      params: { path: parentPath },
    }
  );
  return result.data;
}

/**
 * Move a file or folder to a new location in NAS storage
 * Note: The filebrowser service doesn't have a move endpoint yet.
 * This function is kept for compatibility but will need backend implementation
 * or a move endpoint added to the filebrowser service.
 * @param sourcePath - Current path of the file or folder
 * @param destinationPath - Destination path for the file or folder
 * @returns Move response
 */
export async function moveItem(
  sourcePath: string,
  destinationPath: string
): Promise<MoveFileResponse> {
  // TODO: FileBrowser service doesn't have a move endpoint yet
  // For now, use backend API as fallback
  const url = `${API_BASE_URL}/storage/move`;
  const result = await http.put<MoveFileResponse>(
    url,
    { destinationPath },
    {
      params: { sourcePath },
    }
  );
  return result.data;
}

