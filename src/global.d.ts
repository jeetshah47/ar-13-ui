// Electron API types
interface MountCredentials {
  nasIP: string;
  shareName: string;
  username: string;
  password: string;
}

interface OpenFileResult {
  success: boolean;
  localPath?: string;
  method?: string;
  error?: string;
}

interface MountResult {
  success: boolean;
  mountedPath?: string;
  driveLetter?: string;
  error?: string;
}

interface ElectronAPI {
  platform: string;
  versions: {
    node: string;
    chrome: string;
    electron: string;
  };
  openRemoteFile: (filePath: string, fileSize: number, accessToken: string, backendUrl?: string) => Promise<OpenFileResult>;
  mountNASShare: (credentials: MountCredentials) => Promise<MountResult>;
  unmountNASShare: () => Promise<{ success: boolean; error?: string }>;
  getMountedPath: () => Promise<string | null>;
}

declare global {
  interface Window {
    electronAPI?: ElectronAPI;
  }
}

export {};