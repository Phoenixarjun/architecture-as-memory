import fs from 'fs-extra';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootDir = path.resolve(__dirname, '..');

async function runTests() {
  console.log('🧪 Running AAM Cross-Ecosystem Verification Matrix...\n');
  let failures = 0;

  const assertCondition = (desc, condition) => {
    if (condition) {
      console.log(`  ✓ [PASS] ${desc}`);
    } else {
      console.log(`  ❌ [FAIL] ${desc}`);
      failures++;
    }
  };

  // --- 1. SINGLE-RUNTIME & VERSION GOVERNANCE TESTS ---
  try {
    const cliPkg = await fs.readJson(path.join(rootDir, 'packages/cli/package.json'));
    const expectedVersion = cliPkg.version;
    let expectedPythonVersion = expectedVersion;
    if (expectedVersion.includes('-beta.')) {
      expectedPythonVersion = expectedVersion.replace('-beta.', 'b');
    }

    // Check Python manifest
    const pyProject = await fs.readFile(path.join(rootDir, 'packages/python/pyproject.toml'), 'utf8');
    assertCondition(
      'Python manifest version synchronized',
      pyProject.includes(`version = "${expectedPythonVersion}"`)
    );

    // Check PowerShell manifest
    const psManifest = await fs.readFile(path.join(rootDir, 'packages/powershell/AAM.psd1'), 'utf8');
    assertCondition(
      'PowerShell manifest version synchronized',
      psManifest.includes(`ModuleVersion = '${expectedVersion}'`)
    );

    // Check Rust manifest
    const cargoToml = await fs.readFile(path.join(rootDir, 'packages/rust/Cargo.toml'), 'utf8');
    assertCondition(
      'Rust manifest version synchronized',
      cargoToml.includes(`version = "${expectedVersion}"`)
    );
  } catch (err) {
    console.error('Error during Version Governance check:', err.message);
    failures++;
  }

  // --- 2. BUNDLED CORE VALIDITY & LEAN GOVERNANCE TESTS ---
  const checkBundledCore = async (wrapperName, jsDirPath) => {
    try {
      const exists = await fs.pathExists(jsDirPath);
      assertCondition(`${wrapperName}: Bundled 'js/' directory exists`, exists);
      
      if (exists) {
        const binExists = await fs.pathExists(path.join(jsDirPath, 'bin/aam.js'));
        assertCondition(`${wrapperName}: Core 'bin/aam.js' entrypoint present`, binExists);

        const templatesExists = await fs.pathExists(path.join(jsDirPath, 'templates/aam-skill.md'));
        assertCondition(`${wrapperName}: Templates present`, templatesExists);

        // Package size check: no duplicated viewers or build junk
        const viewerDistExists = await fs.pathExists(path.join(jsDirPath, 'viewer/dist'));
        assertCondition(`${wrapperName}: Viewer bundled assets present`, viewerDistExists);

        // Ensure no node_modules got compiled in
        const nmExists = await fs.pathExists(path.join(jsDirPath, 'node_modules'));
        assertCondition(`${wrapperName}: Lean governance (no duplicate node_modules)`, !nmExists);
      }
    } catch (err) {
      console.error(`Error checking bundled core for ${wrapperName}:`, err.message);
      failures++;
    }
  };

  await checkBundledCore('Python', path.join(rootDir, 'packages/python/src/aam/js'));
  await checkBundledCore('PowerShell', path.join(rootDir, 'packages/powershell/js'));
  await checkBundledCore('Rust', path.join(rootDir, 'packages/rust/js'));

  // --- 3. NODE.JS RUNTIME FUNCTIONAL TESTS ---
  try {
    console.log('\n🏃 Running local CLI functional integration dry-runs...');
    const validateOut = execSync('node packages/cli/bin/aam.js validate', { cwd: rootDir, encoding: 'utf8' });
    assertCondition('Local CLI "validate" dry-run returns output', validateOut.includes('VALIDATION SUMMARY'));

    const doctorOut = execSync('node packages/cli/bin/aam.js doctor', { cwd: rootDir, encoding: 'utf8' });
    assertCondition('Local CLI "doctor" dry-run executes successfully', doctorOut.includes('Health Diagnostics'));
  } catch (err) {
    console.error('Local CLI dry-run failed:', err.message);
    failures++;
  }

  // --- 4. PYTHON WRAPPER CODE INTEGRITY CHECKS ---
  try {
    const cliPy = await fs.readFile(path.join(rootDir, 'packages/python/src/aam/cli.py'), 'utf8');
    assertCondition('Python CLI locates JS entrypoint cleanly', cliPy.includes('"js", "bin", "aam.js"'));
    assertCondition('Python CLI propagates exit codes', cliPy.includes('subprocess.run') && cliPy.includes('sys.exit'));
  } catch (err) {
    console.error('Python wrapper validation failed:', err.message);
    failures++;
  }

  // --- 5. RUST WRAPPER RUNTIME INTEGRITY CHECKS ---
  try {
    const mainRs = await fs.readFile(path.join(rootDir, 'packages/rust/src/main.rs'), 'utf8');
    assertCondition('Rust wrapper resolves node path correctly', mainRs.includes('node_check.is_err'));
    assertCondition('Rust wrapper launches standard command subprocess', mainRs.includes('Command::new("node")'));
  } catch (err) {
    console.error('Rust wrapper validation failed:', err.message);
    failures++;
  }

  // --- SUMMARY ---
  console.log('\n======================================');
  if (failures === 0) {
    console.log('🎉 ALL CROSS-ECOSYSTEM TESTS PASSED SUCCESSFULLY!');
    process.exit(0);
  } else {
    console.log(`❌ CROSS-ECOSYSTEM MATRIX ENCOUNTERED ${failures} FAILURES.`);
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error('\nTesting engine crashed:', err.message);
  process.exit(1);
});
