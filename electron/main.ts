import { app, BrowserWindow, ipcMain, shell } from 'electron';
import { join } from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import os from 'os';
import fs from 'fs/promises';
import axios from 'axios';

// In CommonJS (compiled output), __filename and __dirname are available at runtime
// These declarations are for TypeScript - they'll be available when compiled to CommonJS
declare const __filename: string;
declare const __dirname: string;

const execAsync = promisify(exec);

// The built app is in dist-electron, we need to  point to the correct path
const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;

// Track mounted drives
interface MountInfo {
  path: string;
  driveLetter?: string;
  credentials: {
    nasIP: string;
    shareName: string;
    username: string;
    password: string;
  };
  mountedAt: Date;
}

const mountedDrives = new Map<string, MountInfo>();

// File size threshold for using mount vs download (500MB)
const LARGE_FILE_THRESHOLD = 500 * 1024 * 1024;

// Backend API base URL (default to localhost:3000)
// Note: VITE_ variables are not available in Electron main process
// This can be made configurable via app.getPath('userData') config file if needed
const getBackendBaseUrl = (): string => {
  // Try to get from environment, but fallback to default
  // In production, this should be configurable via a config file
  return process.env.API_BASE_URL?.replace('/api', '') || 'http://localhost:3000';
};

function createWindow() {
  // Get the correct paths for preload and HTML
  // Files are renamed to .cjs to work with "type": "module" in package.json
  // Both dev and production use .cjs since we compile and rename before running
  const preloadPath = join(__dirname, 'preload.cjs');
  
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: preloadPath,
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: true,
    },
    autoHideMenuBar: !isDev, // Show menu bar in dev, hide in production
    show: false, // Don't show until ready
  });

  // Show window when ready to prevent white flash
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Open DevTools in production for debugging (remove after fixing)
  if (!isDev) {
    mainWindow.webContents.openDevTools();
  }

  // Load the app
  if (isDev) {
    // In development, load from Vite dev server
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    // In production, load from the built files
    // In packaged app: resources/app/dist-electron/main.js and resources/app/dist/index.html
    const htmlPath = join(__dirname, '../dist/index.html');
    
    mainWindow.loadFile(htmlPath).catch((error) => {
      console.error('Failed to load file from:', htmlPath, error);
      // Try alternative path using app.getAppPath()
      const altPath = join(app.getAppPath(), 'dist', 'index.html');
      console.log('Trying alternative path:', altPath);
      mainWindow.loadFile(altPath).catch((altError) => {
        console.error('Failed to load alternative path:', altPath, altError);
        // Show error to user
        mainWindow.webContents.executeJavaScript(`
          document.body.innerHTML = '<div style="padding: 20px; font-family: Arial;">
            <h1>Error Loading Application</h1>
            <p>Failed to load application files.</p>
            <p>Expected path: ${htmlPath}</p>
            <p>Alternative path: ${altPath}</p>
            <p>App path: ${app.getAppPath()}</p>
            <p>__dirname: ${__dirname}</p>
          </div>';
        `);
      });
    });
  }
}

// This method will be called when Electron has finished initialization
app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    // On macOS, re-create a window when the dock icon is clicked
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Get available drive letter (Windows)
async function getAvailableDriveLetter(): Promise<string | null> {
  if (process.platform !== 'win32') {
    return null;
  }

  // Check used drive letters (A-Z)
  const usedLetters = new Set<string>();
  for (let i = 65; i <= 90; i++) { // A-Z
    const letter = String.fromCharCode(i);
    try {
      await fs.access(`${letter}:\\`);
      usedLetters.add(letter);
    } catch {
      // Drive not in use
    }
  }

  // Find first available letter (start from Z and go backwards)
  for (let i = 90; i >= 65; i--) {
    const letter = String.fromCharCode(i);
    if (!usedLetters.has(letter)) {
      return letter;
    }
  }

  throw new Error('No available drive letters');
}

// Mount NAS share (Windows)
async function mountNASShareWindows(credentials: {
  nasIP: string;
  shareName: string;
  username: string;
  password: string;
}): Promise<{ driveLetter: string; mountedPath: string }> {
  const { nasIP, shareName, username, password } = credentials;
  const driveLetter = await getAvailableDriveLetter();
  
  if (!driveLetter) {
    throw new Error('No available drive letters');
  }

  // Windows: net use Z: \\192.168.1.100\studio-work /user:username password /persistent:no
  // Escape password if it contains special characters
  const escapedPassword = password.replace(/"/g, '\\"');
  const command = `net use ${driveLetter}: \\\\${nasIP}\\${shareName} /user:${username} "${escapedPassword}" /persistent:no`;
  
  try {
    const { stderr } = await execAsync(command);
    if (stderr && !stderr.toLowerCase().includes('successfully')) {
      throw new Error(stderr);
    }
    
    const mountedPath = `${driveLetter}:\\`;
    mountedDrives.set(driveLetter, {
      path: mountedPath,
      driveLetter,
      credentials,
      mountedAt: new Date()
    });
    
    return { driveLetter, mountedPath };
  } catch (error: any) {
    throw new Error(`Failed to mount NAS share: ${error.message}`);
  }
}

// Mount NAS share (macOS)
async function mountNASShareMacOS(credentials: {
  nasIP: string;
  shareName: string;
  username: string;
  password: string;
}): Promise<{ mountedPath: string }> {
  const { nasIP, shareName, username, password } = credentials;
  const mountPoint = join(os.tmpdir(), 'nas-mount');
  
  await fs.mkdir(mountPoint, { recursive: true });
  
  // macOS: mount_smbfs //username:password@nas-ip/share-name /mount/point
  // Escape special characters in password
  const escapedPassword = encodeURIComponent(password);
  const smbUrl = `//${username}:${escapedPassword}@${nasIP}/${shareName}`;
  const command = `mount_smbfs "${smbUrl}" "${mountPoint}"`;
  
  try {
    await execAsync(command);
    mountedDrives.set('macos', {
      path: mountPoint,
      credentials,
      mountedAt: new Date()
    });
    
    return { mountedPath: mountPoint };
  } catch (error: any) {
    throw new Error(`Failed to mount NAS share: ${error.message}`);
  }
}

// Mount NAS share (Linux)
async function mountNASShareLinux(credentials: {
  nasIP: string;
  shareName: string;
  username: string;
  password: string;
}): Promise<{ mountedPath: string }> {
  const { nasIP, shareName, username, password } = credentials;
  const mountPoint = join(os.tmpdir(), 'nas-mount');
  
  await fs.mkdir(mountPoint, { recursive: true });
  
  // Linux: mount -t cifs //nas-ip/share-name /mount/point -o username=user,password=pass
  // Escape password for shell
  const escapedPassword = password.replace(/'/g, "'\\''");
  const command = `mount -t cifs //${nasIP}/${shareName} ${mountPoint} -o username=${username},password='${escapedPassword}'`;
  
  try {
    await execAsync(`sudo ${command}`);
    mountedDrives.set('linux', {
      path: mountPoint,
      credentials,
      mountedAt: new Date()
    });
    
    return { mountedPath: mountPoint };
  } catch (error: any) {
    throw new Error(`Failed to mount NAS share: ${error.message}`);
  }
}

// Get mount credentials from backend
async function getMountCredentials(accessToken: string, backendUrl?: string): Promise<{
  nasIP: string;
  shareName: string;
  smbPath: string;
  username: string;
  password: string;
  sid: string;
  expiresAt: string;
}> {
  const baseUrl = backendUrl || getBackendBaseUrl();
  const response = await axios.get(`${baseUrl}/api/nas/mount-credentials`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  });
  
  return response.data;
}

// IPC Handler: Mount NAS share
ipcMain.handle('mount-nas-share', async (_event, credentials) => {
  try {
    let result;
    
    if (process.platform === 'win32') {
      result = await mountNASShareWindows(credentials);
    } else if (process.platform === 'darwin') {
      result = await mountNASShareMacOS(credentials);
    } else if (process.platform === 'linux') {
      result = await mountNASShareLinux(credentials);
    } else {
      throw new Error(`Unsupported platform: ${process.platform}`);
    }
    
    return { success: true, ...result };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
});

// IPC Handler: Open remote file
ipcMain.handle('open-remote-file', async (_event, { filePath, fileSize, accessToken, backendUrl }) => {
  try {
    // For large files, use mount; for small files, can also use mount or download
    const useMount = fileSize && fileSize > LARGE_FILE_THRESHOLD;
    
    if (useMount) {
      // Get mount credentials from backend
      const credentials = await getMountCredentials(accessToken, backendUrl);
      
      // Mount NAS share (if not already mounted)
      let mountedPath: string;
      let mountKey: string;
      
      if (process.platform === 'win32') {
        // Check if already mounted
        const existingMount = Array.from(mountedDrives.entries()).find(
          ([_, info]) => info.driveLetter && 
          info.credentials.nasIP === credentials.nasIP &&
          info.credentials.shareName === credentials.shareName
        );
        
        if (existingMount) {
          mountedPath = existingMount[1].path;
          mountKey = existingMount[0];
        } else {
          const mountResult = await mountNASShareWindows({
            nasIP: credentials.nasIP,
            shareName: credentials.shareName,
            username: credentials.username,
            password: credentials.password
          });
          mountedPath = mountResult.mountedPath;
          mountKey = mountResult.driveLetter;
        }
      } else {
        mountKey = process.platform === 'darwin' ? 'macos' : 'linux';
        if (mountedDrives.has(mountKey)) {
          const mountInfo = mountedDrives.get(mountKey)!;
          // Check if credentials match
          if (mountInfo.credentials.nasIP === credentials.nasIP &&
              mountInfo.credentials.shareName === credentials.shareName) {
            mountedPath = mountInfo.path;
          } else {
            // Unmount old and mount new
            try {
              if (process.platform === 'darwin' || process.platform === 'linux') {
                await execAsync(`umount "${mountInfo.path}"`);
              }
            } catch (e) {
              // Ignore unmount errors
            }
            const mountResult = process.platform === 'darwin' 
              ? await mountNASShareMacOS({
                  nasIP: credentials.nasIP,
                  shareName: credentials.shareName,
                  username: credentials.username,
                  password: credentials.password
                })
              : await mountNASShareLinux({
                  nasIP: credentials.nasIP,
                  shareName: credentials.shareName,
                  username: credentials.username,
                  password: credentials.password
                });
            mountedPath = mountResult.mountedPath;
          }
        } else {
          const mountResult = process.platform === 'darwin' 
            ? await mountNASShareMacOS({
                nasIP: credentials.nasIP,
                shareName: credentials.shareName,
                username: credentials.username,
                password: credentials.password
              })
            : await mountNASShareLinux({
                nasIP: credentials.nasIP,
                shareName: credentials.shareName,
                username: credentials.username,
                password: credentials.password
              });
          mountedPath = mountResult.mountedPath;
        }
      }
      
      // Build local path
      // filePath from backend: "/folder/file.pdf"
      // Convert to Windows: "Z:\folder\file.pdf" or Unix: "/tmp/nas-mount/folder/file.pdf"
      let localPath: string;
      if (process.platform === 'win32') {
        // Remove leading slash and convert to Windows path
        const normalizedPath = filePath.replace(/^\//, '').replace(/\//g, '\\');
        localPath = join(mountedPath, normalizedPath);
      } else {
        // Remove leading slash for Unix
        const normalizedPath = filePath.replace(/^\//, '');
        localPath = join(mountedPath, normalizedPath);
      }
      
      // Open with default app
      await shell.openPath(localPath);
      
      return { success: true, localPath, method: 'mount' };
    } else {
      // Small file: could download or also use mount
      // For now, also use mount for consistency
      const credentials = await getMountCredentials(accessToken, backendUrl);
      
      // Mount if not already mounted (same logic as above)
      let mountedPath: string;
      
      if (process.platform === 'win32') {
        const existingMount = Array.from(mountedDrives.entries()).find(
          ([_, info]) => info.driveLetter && 
          info.credentials.nasIP === credentials.nasIP &&
          info.credentials.shareName === credentials.shareName
        );
        
        if (existingMount) {
          mountedPath = existingMount[1].path;
        } else {
          const mountResult = await mountNASShareWindows({
            nasIP: credentials.nasIP,
            shareName: credentials.shareName,
            username: credentials.username,
            password: credentials.password
          });
          mountedPath = mountResult.mountedPath;
        }
      } else {
        const mountKey = process.platform === 'darwin' ? 'macos' : 'linux';
        if (mountedDrives.has(mountKey)) {
          mountedPath = mountedDrives.get(mountKey)!.path;
        } else {
          const mountResult = process.platform === 'darwin' 
            ? await mountNASShareMacOS({
                nasIP: credentials.nasIP,
                shareName: credentials.shareName,
                username: credentials.username,
                password: credentials.password
              })
            : await mountNASShareLinux({
                nasIP: credentials.nasIP,
                shareName: credentials.shareName,
                username: credentials.username,
                password: credentials.password
              });
          mountedPath = mountResult.mountedPath;
        }
      }
      
      let localPath: string;
      if (process.platform === 'win32') {
        const normalizedPath = filePath.replace(/^\//, '').replace(/\//g, '\\');
        localPath = join(mountedPath, normalizedPath);
      } else {
        const normalizedPath = filePath.replace(/^\//, '');
        localPath = join(mountedPath, normalizedPath);
      }
      
      await shell.openPath(localPath);
      
      return { success: true, localPath, method: 'mount' };
    }
  } catch (error: any) {
    return { success: false, error: error.message };
  }
});

// IPC Handler: Unmount NAS share
ipcMain.handle('unmount-nas-share', async () => {
  try {
    if (process.platform === 'win32') {
      for (const [driveLetter] of mountedDrives) {
        try {
          await execAsync(`net use ${driveLetter}: /delete /yes`);
        } catch (e) {
          // Ignore errors if already unmounted
        }
      }
    } else {
      const mountKey = process.platform === 'darwin' ? 'macos' : 'linux';
      if (mountedDrives.has(mountKey)) {
        const mountInfo = mountedDrives.get(mountKey)!;
        try {
          await execAsync(`umount "${mountInfo.path}"`);
        } catch (e) {
          // Ignore errors if already unmounted
        }
      }
    }
    
    mountedDrives.clear();
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
});

// IPC Handler: Get mounted path
ipcMain.handle('get-mounted-path', async () => {
  if (process.platform === 'win32') {
    const mount = Array.from(mountedDrives.values())[0];
    return mount ? mount.path : null;
  } else {
    const mountKey = process.platform === 'darwin' ? 'macos' : 'linux';
    const mount = mountedDrives.get(mountKey);
    return mount ? mount.path : null;
  }
});

// Cleanup on app close
app.on('before-quit', async () => {
  // Unmount all drives
  if (process.platform === 'win32') {
    for (const [driveLetter] of mountedDrives) {
      try {
        await execAsync(`net use ${driveLetter}: /delete /yes`);
      } catch (e) {
        // Ignore errors
      }
    }
  } else {
    for (const mountInfo of mountedDrives.values()) {
      try {
        await execAsync(`umount "${mountInfo.path}"`);
      } catch (e) {
        // Ignore errors
      }
    }
  }
  mountedDrives.clear();
});

// Quit when all windows are closed, except on macOS
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

