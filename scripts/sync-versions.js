import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootDir = path.resolve(__dirname, '..');

async function sync() {
  console.log('🔄 Starting AAM Cross-Ecosystem Version Synchronizer...\n');

  // 1. Read source of truth version from CLI package.json
  const cliPkgPath = path.join(rootDir, 'packages/cli/package.json');
  const cliPkg = await fs.readJson(cliPkgPath);
  const masterVersion = cliPkg.version;
  console.log(`Master Runtime Version detected: ${masterVersion}`);

  // 2. Parse version for Python (PEP 440 compatibility: e.g. "1.0.0-beta.5" -> "1.0.0b5")
  let pythonVersion = masterVersion;
  if (masterVersion.includes('-beta.')) {
    pythonVersion = masterVersion.replace('-beta.', 'b');
  } else if (masterVersion.includes('-alpha.')) {
    pythonVersion = masterVersion.replace('-alpha.', 'a');
  } else if (masterVersion.includes('-rc.')) {
    pythonVersion = masterVersion.replace('-rc.', 'rc');
  }

  // 3. Update Python pyproject.toml
  const pyProjectPath = path.join(rootDir, 'packages/python/pyproject.toml');
  if (await fs.pathExists(pyProjectPath)) {
    let content = await fs.readFile(pyProjectPath, 'utf8');
    content = content.replace(/version\s*=\s*".*?"/, `version = "${pythonVersion}"`);
    await fs.writeFile(pyProjectPath, content, 'utf8');
    console.log(`  ✓ Synced Python package version to: ${pythonVersion}`);
  }

  // 4. Update PowerShell Module Manifest AAM.psd1
  const psManifestPath = path.join(rootDir, 'packages/powershell/AAM.psd1');
  if (await fs.pathExists(psManifestPath)) {
    let content = await fs.readFile(psManifestPath, 'utf8');
    content = content.replace(/ModuleVersion\s*=\s*'.*?'/, `ModuleVersion = '${masterVersion}'`);
    await fs.writeFile(psManifestPath, content, 'utf8');
    console.log(`  ✓ Synced PowerShell module version to: ${masterVersion}`);
  }

  // 5. Update Rust Cargo.toml
  const cargoPath = path.join(rootDir, 'packages/rust/Cargo.toml');
  if (await fs.pathExists(cargoPath)) {
    let content = await fs.readFile(cargoPath, 'utf8');
    content = content.replace(/version\s*=\s*".*?"/, `version = "${masterVersion}"`);
    await fs.writeFile(cargoPath, content, 'utf8');
    console.log(`  ✓ Synced Rust crate version to: ${masterVersion}`);
  }

  console.log('\n🎉 All ecosystem package manifests are fully synchronized!');
}

sync().catch((err) => {
  console.error('\n❌ Version synchronization failed:', err.message);
  process.exit(1);
});
