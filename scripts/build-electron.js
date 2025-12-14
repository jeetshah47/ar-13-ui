import { build } from 'vite';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Build the React app
console.log('Building React app...');
await build();

// Build Electron main process
console.log('Building Electron main process...');
execSync(
  'tsc -p tsconfig.node.json --outDir dist-electron',
  { stdio: 'inherit', cwd: resolve(__dirname, '..') }
);

console.log('Electron build complete!');

