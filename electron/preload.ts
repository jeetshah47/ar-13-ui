import { contextBridge } from 'electron';

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Example: Add any Electron APIs you want to expose to the renderer
  platform: process.platform,
  versions: {
    node: process.versions.node,
    chrome: process.versions.chrome,
    electron: process.versions.electron,
  },
  // Add more IPC methods as needed
  // send: (channel: string, data: any) => ipcRenderer.send(channel, data),
  // receive: (channel: string, func: (...args: any[]) => void) => {
  //   ipcRenderer.on(channel, (event, ...args) => func(...args));
  // },
});

