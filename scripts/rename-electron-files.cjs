// Rename .js files to .cjs for Electron (since package.json has "type": "module")
const fs = require('fs');
const path = require('path');

const distElectron = path.join(__dirname, '..', 'dist-electron');
const filesToRename = ['main.js', 'preload.js'];

filesToRename.forEach(file => {
  const oldPath = path.join(distElectron, file);
  const newPath = path.join(distElectron, file.replace('.js', '.cjs'));
  
  if (fs.existsSync(oldPath)) {
    fs.renameSync(oldPath, newPath);
    console.log(`Renamed ${file} to ${file.replace('.js', '.cjs')}`);
  } else {
    console.warn(`File not found: ${oldPath}`);
  }
});

