# Electron Integration Guide

This project has been integrated with Electron to run as a desktop application.

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Development mode:**
   Run the app in development mode with hot-reload:
   ```bash
   npm run electron:dev
   ```
   This will:
   - Start the Vite dev server on `http://localhost:5173`
   - Wait for the server to be ready
   - Launch Electron with the dev server

## Building for Production

### Build for all platforms:
```bash
npm run electron:build
```

### Build for specific platforms:
```bash
# Windows
npm run electron:build:win

# macOS
npm run electron:build:mac

# Linux
npm run electron:build:linux
```

The built applications will be in the `release/` directory.

## Project Structure

- `electron/main.ts` - Main Electron process (handles window creation, app lifecycle)
- `electron/preload.ts` - Preload script (bridge between main and renderer processes)
- `electron-builder.config.js` - Configuration for building distributable packages
- `dist-electron/` - Compiled Electron files (generated during build)
- `release/` - Built application packages (generated during build)

## Electron API

The Electron API is exposed to the renderer process through the `window.electronAPI` object. You can access it in your React components:

```typescript
if (window.electronAPI) {
  console.log('Platform:', window.electronAPI.platform);
  console.log('Versions:', window.electronAPI.versions);
}
```

## Adding Custom IPC Communication

To add custom IPC communication:

1. **In `electron/preload.ts`**, expose the API:
   ```typescript
   contextBridge.exposeInMainWorld('electronAPI', {
     // ... existing code
     send: (channel: string, data: any) => ipcRenderer.send(channel, data),
     receive: (channel: string, func: (...args: any[]) => void) => {
       ipcRenderer.on(channel, (event, ...args) => func(...args));
     },
   });
   ```

2. **In `electron/main.ts`**, handle IPC messages:
   ```typescript
   import { ipcMain } from 'electron';
   
   ipcMain.on('your-channel', (event, data) => {
     // Handle the message
   });
   ```

3. **In your React components**, use the API:
   ```typescript
   window.electronAPI?.send('your-channel', data);
   window.electronAPI?.receive('response-channel', (data) => {
     // Handle response
   });
   ```

## Configuration

### Electron Builder Configuration

The `electron-builder.config.js` file contains configuration for:
- App ID and product name
- Output directories
- Platform-specific settings (Windows, macOS, Linux)
- Icons and metadata

### Icons

Place application icons in the `build/` directory:
- `build/icon.ico` - Windows icon
- `build/icon.icns` - macOS icon
- `build/icon.png` - Linux icon

## Troubleshooting

### Build Issues

If you encounter build issues:
1. Make sure all dependencies are installed: `npm install`
2. Clear build directories: Delete `dist-electron/` and `release/` folders
3. Rebuild: `npm run electron:build`

### Development Issues

If Electron doesn't connect to the dev server:
1. Check that Vite is running on port 5173
2. Verify the `wait-on` package is installed
3. Check the console for connection errors

## Notes

- The app uses context isolation for security (Node.js APIs are not directly accessible in the renderer)
- All communication between main and renderer processes goes through the preload script
- The app automatically opens DevTools in development mode

