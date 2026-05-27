import path from 'path';
import fs from 'fs-extra';
import YAML from 'yaml';
import chalk from 'chalk';
import { getArchitectureHash } from './hash-engine.js';
import { createSnapshotMetadata } from './doctor-engine.js';

/**
 * Helper to recursively search a folder for .yaml/.yml files, ignoring dotfiles.
 */
async function getYamlFilesRecursively(dir) {
  let results = [];
  if (!(await fs.pathExists(dir))) return results;
  const list = await fs.readdir(dir);
  for (const file of list) {
    if (file.startsWith('.')) continue; // ignore hidden/dotfiles
    const fullPath = path.join(dir, file);
    const stat = await fs.stat(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(await getYamlFilesRecursively(fullPath));
    } else if (file.endsWith('.yaml') || file.endsWith('.yml')) {
      results.push(fullPath);
    }
  }
  return results;
}

/**
 * Creates and stores a local baseline snapshot of the current architecture structure.
 */
export async function createSnapshot(targetDir = process.cwd()) {
  const archDir = path.join(targetDir, 'architecture');
  const snapshotsDir = path.join(targetDir, '.aam', 'snapshots');

  if (!(await fs.pathExists(archDir))) {
    throw new Error(`Could not find '/architecture' directory in ${targetDir}`);
  }

  // 1. Recursive load
  const yamlFiles = await getYamlFilesRecursively(archDir);
  
  let system = null;
  const nodes = [];
  let relationships = [];
  const hash = await getArchitectureHash(targetDir);

  for (const file of yamlFiles) {
    const relPath = path.relative(targetDir, file).replace(/\\/g, '/');
    try {
      const content = await fs.readFile(file, 'utf8');
      const parsed = YAML.parse(content);
      if (!parsed || typeof parsed !== 'object') continue;

      if (Array.isArray(parsed.relationships)) {
        relationships = [...relationships, ...parsed.relationships];
      }

      if (relPath.endsWith('relationships.yaml') || relPath.endsWith('architecture.index.yaml')) {
        continue;
      }

      if (parsed.type === 'system') {
        system = parsed;
      } else if (parsed.id && parsed.type) {
        nodes.push(parsed);
      }
    } catch {
      // Tolerate loading faults
    }
  }

  // 2. Build standard metadata (Task 8)
  const meta = createSnapshotMetadata(system, nodes, relationships, hash);
  
  const payload = {
    metadata: meta,
    nodes,
    relationships
  };

  // 3. Write snapshot
  await fs.ensureDir(snapshotsDir);
  const snapshotPath = path.join(snapshotsDir, `snapshot-${hash.substring(0, 8)}.json`);
  await fs.writeJson(snapshotPath, payload, { spaces: 2 });

  return snapshotPath;
}

/**
 * CLI command runner for taking a snapshot
 */
export async function runSnapshotCommand(targetDir = process.cwd()) {
  try {
    const snapshotPath = await createSnapshot(targetDir);
    console.log(chalk.bold.green(`✓ Baseline snapshot saved successfully!`));
    console.log(chalk.cyan(`Path: ${snapshotPath}`));
  } catch (error) {
    console.error(chalk.red(`Failed to save architecture snapshot: ${error.message}`));
    process.exit(1);
  }
}
