import { contextBridge, ipcRenderer } from 'electron';

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  platform: process.platform,
  versions: {
    node: process.versions.node,
    chrome: process.versions.chrome,
    electron: process.versions.electron,
  },
  // NAS mounting and file operations
  openRemoteFile: (filePath: string, fileSize: number, accessToken: string, backendUrl?: string) =>
    ipcRenderer.invoke('open-remote-file', { filePath, fileSize, accessToken, backendUrl }),
  
  mountNASShare: (credentials: {
    nasIP: string;
    shareName: string;
    username: string;
    password: string;
  }) => ipcRenderer.invoke('mount-nas-share', credentials),
  
  unmountNASShare: () => ipcRenderer.invoke('unmount-nas-share'),
  
  getMountedPath: () => ipcRenderer.invoke('get-mounted-path'),
});

