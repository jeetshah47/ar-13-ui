# Fix Vite EPERM Error on Windows

This error occurs when Vite/esbuild can't rename temporary directories due to file permissions or locked files.

## Quick Fixes

### Solution 1: Delete .vite Cache (Recommended)

**Stop the dev server first**, then:

```powershell
# Navigate to your project
cd D:\Projects\ar-13-ui

# Delete Vite cache
Remove-Item -Recurse -Force node_modules\.vite -ErrorAction SilentlyContinue

# Restart dev server
npm run dev
```

### Solution 2: Close All Processes

1. **Close all terminals/editors** that might be accessing the project
2. **Close VS Code/Cursor** if it's open
3. **Kill any Node processes:**
   ```powershell
   taskkill /F /IM node.exe
   ```
4. **Delete cache and restart:**
   ```powershell
   Remove-Item -Recurse -Force node_modules\.vite
   npm run dev
   ```

### Solution 3: Run as Administrator

1. **Close current terminal**
2. **Right-click PowerShell/Terminal** → **Run as Administrator**
3. **Navigate to project and restart:**
   ```powershell
   cd D:\Projects\ar-13-ui
   Remove-Item -Recurse -Force node_modules\.vite
   npm run dev
   ```

### Solution 4: Exclude from Antivirus

Windows Defender or antivirus might be locking files:

1. **Add to Windows Defender exclusions:**
   - Open **Windows Security** → **Virus & threat protection**
   - **Manage settings** → **Exclusions** → **Add or remove exclusions**
   - Add: `D:\Projects\ar-13-ui\node_modules`

2. **Or temporarily disable real-time protection** (not recommended for long-term)

### Solution 5: Use WSL (Windows Subsystem for Linux)

If you have WSL installed:

```bash
cd /mnt/d/Projects/ar-13-ui
rm -rf node_modules/.vite
npm run dev
```

## Permanent Fix: Update Vite Config

Add this to your `vite.config.js/ts`:

```javascript
export default defineConfig({
  // ... other config
  cacheDir: 'node_modules/.vite',
  server: {
    fs: {
      strict: false
    }
  },
  optimizeDeps: {
    force: false // Set to true if issues persist
  }
})
```

## Alternative: Use Different Cache Location

Create a `.vite` folder in project root instead of `node_modules`:

```javascript
// vite.config.js
export default defineConfig({
  cacheDir: '.vite', // Instead of node_modules/.vite
  // ... rest of config
})
```

Then add to `.gitignore`:
```
.vite
```

## Why This Happens

- **File locks:** Another process is using the files
- **Antivirus:** Scanning files while Vite tries to rename
- **Permissions:** Insufficient permissions to rename directories
- **Windows file system:** NTFS can be slower with many small files

## Prevention

1. **Always stop dev server properly** (Ctrl+C) before closing terminal
2. **Exclude node_modules from antivirus**
3. **Use WSL** for better file system performance
4. **Keep Node.js updated**

## If Nothing Works

1. **Delete entire node_modules:**
   ```powershell
   Remove-Item -Recurse -Force node_modules
   npm install
   npm run dev
   ```

2. **Clear npm cache:**
   ```powershell
   npm cache clean --force
   ```

3. **Restart your computer** (clears all file locks)

