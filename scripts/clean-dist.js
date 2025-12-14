import { rmSync, existsSync } from 'fs';
import { join } from 'path';

const distPath = join(process.cwd(), 'dist');

if (existsSync(distPath)) {
  console.log('Cleaning dist folder...');
  try {
    // Try to remove with retry options (Node 16.14+)
    rmSync(distPath, { 
      recursive: true, 
      force: true, 
      maxRetries: 3, 
      retryDelay: 1000 
    });
    console.log('✓ Cleaned dist folder');
  } catch (error) {
    // If cleanup fails, just warn and continue
    // Vite will try to empty the dir itself with emptyOutDir: true
    console.warn('⚠ Could not clean dist folder (files may be locked):', error.message);
    console.warn('⚠ Vite will attempt to clean it during build');
    console.warn('⚠ If build fails, please:');
    console.warn('   - Stop the dev server (Ctrl+C)');
    console.warn('   - Close file explorer windows showing dist folder');
    console.warn('   - Close any IDEs/editors with dist files open');
    // Don't exit with error - let vite handle it
  }
} else {
  console.log('✓ Dist folder does not exist, skipping clean');
}
