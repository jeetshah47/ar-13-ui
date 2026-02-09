import { http } from "../../config/http";
import { API_BASE_URL } from "../../config/api";

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
 * Uses direct filesystem access when backend is deployed on NAS
 * @param path - Optional path prefix (e.g., "/folder/subfolder"). Defaults to "" for root
 * @returns List of files and folders
 */
export async function listFiles(path: string = ""): Promise<ListFilesResponse> {
  // Use backend API which uses direct filesystem access
  const url = `${API_BASE_URL}/storage/files`;
  const result = await http.get<ListFilesResponse>(url, {
    params: { path: path || "" },
  });
  
  return result.data;
}

/**
 * Get a download URL for a file through backend API
 * Uses direct filesystem access when backend is deployed on NAS
 * @param path - Path to the file in storage
 * @param expiry - Expiry time in seconds (default: 3600)
 * @returns Download URL and metadata
 */
export async function getFileURL(
  path: string,
  expiry: number = 3600
): Promise<FileURLResponse> {
  // Use backend API which uses direct filesystem access
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
 * Browse folders and files in NAS storage through backend API
 * @deprecated Use listFiles instead - this function is kept for backward compatibility
 * @param path - Optional path prefix (e.g., "/folder/subfolder"). Defaults to "/" for root
 * @returns List of folders and files
 */
export async function browseNAS(path: string = "/"): Promise<BrowseResponse> {
  // Use backend API instead of direct FileBrowser service
  const response = await listFiles(path || "/");
  
  // Convert ListFilesResponse to BrowseResponse format for backward compatibility
  return {
    path: response.path,
    files: response.files.map(file => ({
      name: file.name,
      path: file.path,
      isFolder: file.isFolder,
      size: file.size,
      modified: file.lastModified,
      mimeType: file.contentType,
    })),
  };
}

// Backend API response types
export interface RenameFileResponse {
  message: string;
  path: string;
  newName: string;
}

export interface DeleteFileResponse {
  message: string;
  path: string;
}

export interface CreateFolderResponse {
  message: string;
  parentPath: string;
  folderName: string;
}

export interface MoveFileResponse {
  message: string;
  sourcePath: string;
  destinationPath: string;
}

/**
 * Rename a file or folder in NAS storage through backend API
 * @param path - Current path of the file or folder
 * @param newName - New name for the file or folder
 * @returns Rename response
 */
export async function renameItem(
  path: string,
  newName: string
): Promise<RenameFileResponse> {
  const url = `${API_BASE_URL}/storage/rename`;
  const result = await http.put<RenameFileResponse>(
    url,
    { newName },
    {
      params: { path },
    }
  );
  return result.data;
}

/**
 * Delete a file or folder from NAS storage through backend API
 * @param path - Path to the file or folder to delete
 * @returns Delete response
 */
export async function deleteItem(path: string): Promise<DeleteFileResponse> {
  const url = `${API_BASE_URL}/storage/delete`;
  const result = await http.delete<DeleteFileResponse>(url, {
    params: { path },
  });
  return result.data;
}

/**
 * Create a new folder in NAS storage through backend API
 * @param parentPath - Parent directory path (e.g., "/folder"). Defaults to "/"
 * @param folderName - Name of the folder to create
 * @returns Create folder response
 */
export async function createFolder(
  parentPath: string = "/",
  folderName: string
): Promise<CreateFolderResponse> {
  const url = `${API_BASE_URL}/storage/create-folder`;
  const result = await http.post<CreateFolderResponse>(
    url,
    { folderName },
    {
      params: { path: parentPath },
    }
  );
  return result.data;
}

/**
 * Move a file or folder to a new location in NAS storage through backend API
 * @param sourcePath - Current path of the file or folder
 * @param destinationPath - Destination path for the file or folder
 * @returns Move response
 */
export async function moveItem(
  sourcePath: string,
  destinationPath: string
): Promise<MoveFileResponse> {
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

/**
 * Download progress callback type
 */
export type DownloadProgressCallback = (progress: number) => void;

/**
 * Download a file from NAS storage through backend API
 * This function triggers a proper file download in the browser with authentication
 * @param path - Path to the file to download
 * @param filename - Optional filename for the download (defaults to file name from path)
 * @param onProgress - Optional callback function to track download progress (0-100)
 */
export async function downloadFile(
  path: string,
  filename?: string,
  onProgress?: DownloadProgressCallback
): Promise<void> {
  const url = `${API_BASE_URL}/storage/download`;
  
  try {
    // Use http client to download with proper authentication headers
    const response = await http.get(url, {
      params: { path },
      responseType: "blob", // Important: set response type to blob for file downloads
      onDownloadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress(percentCompleted);
        }
      },
    });
    
    // Report 100% completion
    if (onProgress) {
      onProgress(100);
    }
    
    // Create a blob URL from the response
    const blob = new Blob([response.data]);
    const blobUrl = window.URL.createObjectURL(blob);
    
    // Create a temporary anchor element to trigger download
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = filename || path.split("/").pop() || "download";
    link.style.display = "none";
    
    // Add to DOM, click, and remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up the blob URL after a short delay
    setTimeout(() => {
      window.URL.revokeObjectURL(blobUrl);
    }, 100);
  } catch (error) {
    console.error("Failed to download file:", error);
    throw error;
  }
}

