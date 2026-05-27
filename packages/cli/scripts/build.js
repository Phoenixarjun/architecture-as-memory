import path from 'path';
import fs from 'fs-extra';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootDir = path.resolve(__dirname, '../../..');
const cliViewerDir = path.resolve(rootDir, 'packages/cli/viewer');
const viewerServerFile = path.resolve(rootDir, 'packages/viewer/server.js');
const viewerDistDir = path.resolve(rootDir, 'packages/viewer/dist');

async function build() {
  console.log('🏗️  Bundling AAM Viewer assets into CLI package...');

  // Ensure clean target viewer directory
  await fs.remove(cliViewerDir);
  await fs.ensureDir(cliViewerDir);

  // 1. Copy watcher server
  if (await fs.pathExists(viewerServerFile)) {
    await fs.copy(viewerServerFile, path.join(cliViewerDir, 'server.js'));
    console.log('  ✓ Bundled viewer server');
  } else {
    throw new Error(`Could not find viewer server at: ${viewerServerFile}. Ensure packages/viewer is built.`);
  }

  // 2. Copy compiled static frontend dist
  if (await fs.pathExists(viewerDistDir)) {
    await fs.copy(viewerDistDir, path.join(cliViewerDir, 'dist'));
    console.log('  ✓ Bundled compiled visualizer assets');
  } else {
    throw new Error(`Could not find compiled viewer dist at: ${viewerDistDir}. Run build:viewer first.`);
  }

  console.log('🎉 CLI bundling completed successfully!\n');
}

build().catch((err) => {
  console.error('❌ Build script failed:', err.message);
  process.exit(1);
});
