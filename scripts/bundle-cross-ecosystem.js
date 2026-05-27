import path from 'path';
import fs from 'fs-extra';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootDir = path.resolve(__dirname, '..');
const cliDir = path.resolve(rootDir, 'packages/cli');

const targets = [
  {
    name: 'Python Wrapper',
    jsDir: path.resolve(rootDir, 'packages/python/src/aam/js')
  },
  {
    name: 'PowerShell Module',
    jsDir: path.resolve(rootDir, 'packages/powershell/js')
  },
  {
    name: 'Rust Crate',
    jsDir: path.resolve(rootDir, 'packages/rust/js')
  }
];

async function bundle() {
  console.log('🏗️  Starting AAM Cross-Ecosystem Bundler...\n');

  // Verify CLI is built
  const cliViewerDist = path.join(cliDir, 'viewer/dist');
  if (!(await fs.pathExists(cliViewerDist))) {
    throw new Error('CLI visualizer assets not found. Please run "npm run build:cli" first.');
  }

  // Files/folders to copy from packages/cli
  const copySources = ['bin', 'src', 'viewer', 'templates', 'package.json', 'README.md', 'LICENSE'];

  for (const target of targets) {
    console.log(`📦 Packaging for ${target.name}...`);
    
    // 1. Clean existing target js folder
    await fs.remove(target.jsDir);
    await fs.ensureDir(target.jsDir);

    // 2. Copy compiled CLI assets
    for (const source of copySources) {
      const srcPath = path.join(cliDir, source);
      const destPath = path.join(target.jsDir, source);
      
      if (await fs.pathExists(srcPath)) {
        await fs.copy(srcPath, destPath);
      }
    }
    
    console.log(`  ✓ Successfully bundled assets into: ${path.relative(rootDir, target.jsDir)}`);
  }

  console.log('\n🎉 Cross-ecosystem bundling completed successfully!');
}

bundle().catch((err) => {
  console.error('\n❌ Bundling failed:', err.message);
  process.exit(1);
});
