import path from 'path';
import fs from 'fs-extra';
import YAML from 'yaml';
import crypto from 'crypto';
import chalk from 'chalk';

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
 * Computes a stable, sorted JSON representation of an object, filtering specific keys.
 */
function getStableObjectString(obj, keysToIgnore = new Set()) {
  if (obj === null || obj === undefined) return '';
  if (Array.isArray(obj)) {
    return '[' + obj.map(item => {
      if (typeof item === 'object') return getStableObjectString(item, keysToIgnore);
      return String(item);
    }).sort().join(',') + ']';
  }
  if (typeof obj === 'object') {
    const sortedKeys = Object.keys(obj).sort().filter(k => !keysToIgnore.has(k));
    const parts = sortedKeys.map(key => {
      const val = obj[key];
      let valStr = '';
      if (typeof val === 'object') {
        valStr = getStableObjectString(val, keysToIgnore);
      } else {
        valStr = String(val);
      }
      return `"${key}":${valStr}`;
    });
    return '{' + parts.join(',') + '}';
  }
  return String(obj);
}

/**
 * Deterministically computes the SHA-256 signature of the current AAM architecture map.
 */
export async function getArchitectureHash(targetDir = process.cwd()) {
  const archDir = path.join(targetDir, 'architecture');

  if (!(await fs.pathExists(archDir))) {
    throw new Error(`Could not locate '/architecture' directory in ${targetDir}`);
  }

  const yamlFiles = await getYamlFilesRecursively(archDir);
  
  const nodes = [];
  let relationships = [];
  
  const IGNORED_HASH_FIELDS = new Set([
    'created_at',
    'updated_at',
    'last_modified_by',
    '_relPath'
  ]);

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

      if (parsed.id && parsed.type) {
        nodes.push(parsed);
      }
    } catch {
      // Ignore reading failures to keep execution non-fatal
    }
  }

  // 1. Deterministically sort and stringify all nodes by ID
  const sortedNodes = nodes.sort((a, b) => String(a.id).localeCompare(String(b.id)));
  const nodesString = sortedNodes.map(node => getStableObjectString(node, IGNORED_HASH_FIELDS)).join('\n');

  // 2. Deterministically sort and stringify all relationships
  const cleanedRels = relationships.map(rel => {
    // Strip descriptive metadata for hashing to prioritize structural changes
    return {
      source: rel.source,
      target: rel.target,
      type: rel.type
    };
  });
  
  const sortedRels = cleanedRels.sort((a, b) => {
    const valA = `${a.source}-${a.target}-${a.type}`;
    const valB = `${b.source}-${b.target}-${b.type}`;
    return valA.localeCompare(valB);
  });
  
  const relsString = sortedRels.map(rel => `source:${rel.source},target:${rel.target},type:${rel.type}`).join('\n');

  // 3. Assemble and Hash
  const finalTopologyString = `NODES:\n${nodesString}\nRELATIONSHIPS:\n${relsString}`;
  
  const hash = crypto.createHash('sha256').update(finalTopologyString).digest('hex');
  return hash;
}

/**
 * CLI runner for hashing.
 */
export async function runHashCommand(targetDir = process.cwd()) {
  try {
    const hash = await getArchitectureHash(targetDir);
    console.log(chalk.bold.green(`✓ Deterministic Architecture Hash:`));
    console.log(chalk.cyan(hash));
    return hash;
  } catch (error) {
    console.error(chalk.red(`Failed to calculate architecture hash: ${error.message}`));
    process.exit(1);
  }
}
