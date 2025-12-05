import { http } from '../../config/http';
import { API_BASE_URL, SERVER_BASE_URL } from '../../config/api';

export interface MountCredentials {
  nasIP: string;
  shareName: string;
  smbPath: string;
  username: string;
  password: string;
  sid: string;
  expiresAt: string;
}

export interface OpenFileResult {
  success: boolean;
  localPath?: string;
  method?: string;
  error?: string;
}

export interface MountResult {
  success: boolean;
  mountedPath?: string;
  driveLetter?: string;
  error?: string;
}

/**
 * Get mount credentials from backend API
 * @returns Mount credentials for SMB share
 */
export async function getMountCredentials(): Promise<MountCredentials> {
  const url = `${API_BASE_URL}/nas/mount-credentials`;
  const response = await http.get<MountCredentials>(url);
  return response.data;
}

/**
 * Open a file with the default application using Electron API
 * For large files (>500MB), mounts NAS share and opens directly
 * @param filePath - Path to the file on NAS (e.g., "/folder/file.pdf")
 * @param fileSize - Size of the file in bytes
 * @returns Result of the open operation
 */
export async function openFileWithDefaultApp(
  filePath: string,
  fileSize: number
): Promise<OpenFileResult> {
  // Check if running in Electron
  if (!window.electronAPI) {
    return {
      success: false,
      error: 'Not running in Electron. This feature requires the Electron app.',
    };
  }

  // Get access token from localStorage
  const accessToken = localStorage.getItem('authToken');
  if (!accessToken) {
    return {
      success: false,
      error: 'No authentication token found. Please log in again.',
    };
  }

  try {
    // Pass backend URL to main process (without /api suffix)
    const backendUrl = SERVER_BASE_URL;
    const result = await window.electronAPI.openRemoteFile(
      filePath,
      fileSize,
      accessToken,
      backendUrl
    );
    return result;
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to open file',
    };
  }
}

/**
 * Mount NAS share using Electron API
 * @param credentials - Mount credentials
 * @returns Result of the mount operation
 */
export async function mountNASShare(
  credentials: {
    nasIP: string;
    shareName: string;
    username: string;
    password: string;
  }
): Promise<MountResult> {
  if (!window.electronAPI) {
    return {
      success: false,
      error: 'Not running in Electron. This feature requires the Electron app.',
    };
  }

  try {
    const result = await window.electronAPI.mountNASShare(credentials);
    return result;
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to mount NAS share',
    };
  }
}

/**
 * Unmount NAS share using Electron API
 * @returns Result of the unmount operation
 */
export async function unmountNASShare(): Promise<{ success: boolean; error?: string }> {
  if (!window.electronAPI) {
    return {
      success: false,
      error: 'Not running in Electron. This feature requires the Electron app.',
    };
  }

  try {
    const result = await window.electronAPI.unmountNASShare();
    return result;
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to unmount NAS share',
    };
  }
}

/**
 * Get the currently mounted path (if any)
 * @returns Mounted path or null
 */
export async function getMountedPath(): Promise<string | null> {
  if (!window.electronAPI) {
    return null;
  }

  try {
    return await window.electronAPI.getMountedPath();
  } catch (error) {
    return null;
  }
}

