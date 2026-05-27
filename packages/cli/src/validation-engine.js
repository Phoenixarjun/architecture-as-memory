import path from 'path';
import fs from 'fs-extra';
import YAML from 'yaml';
import chalk from 'chalk';
import { execSync } from 'child_process';
import { generateDeterministicId } from './id-strategy.js';

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
 * Levenshtein distance calculation for string suggestions.
 */
function getLevenshteinDistance(s1, s2) {
  const m = s1.length;
  const n = s2.length;
  const d = [];
  for (let i = 0; i <= m; i++) d[i] = [i];
  for (let j = 0; j <= n; j++) d[0][j] = j;
  
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = s1[i - 1] === s2[j - 1] ? 0 : 1;
      d[i][j] = Math.min(
        d[i - 1][j] + 1,
        d[i][j - 1] + 1,
        d[i - 1][j - 1] + cost
      );
    }
  }
  return d[m][n];
}

/**
 * Recommends the nearest matching string from a list.
 */
function getNearestMatch(input, list) {
  let minDistance = Infinity;
  let recommendation = list[0];
  for (const item of list) {
    const dist = getLevenshteinDistance(input.toLowerCase(), item.toLowerCase());
    if (dist < minDistance) {
      minDistance = dist;
      recommendation = item;
    }
  }
  return recommendation;
}

/**
 * Task 7: Fetch the file content from the git HEAD baseline.
 */
function getGitHeadContent(targetDir, relPath) {
  try {
    // Normalise path separators to forward slashes for git lookup
    const gitPath = relPath.replace('architecture/', '');
    const command = `git show HEAD:"architecture/${gitPath}"`;
    return execSync(command, { cwd: targetDir, stdio: ['pipe', 'pipe', 'ignore'] }).toString();
  } catch {
    return null;
  }
}

/**
 * Validates the entire /architecture directory and prints a beautiful colorized report.
 * Supports ontology-driven, fully recursive, resilient verification.
 * @param {string} targetDir - The project root directory.
 * @param {boolean} silent - If true, returns issues silently instead of logging.
 * @returns {Promise<boolean|object>} True/false or results object if silent.
 */
export async function validateArchitecture(targetDir = process.cwd(), silent = false) {
  const archDir = path.join(targetDir, 'architecture');

  if (!silent) {
    console.log(chalk.bold.cyan(`\n🔍 Running AAM Architecture Validation Engine...\n`));
  }

  if (!(await fs.pathExists(archDir))) {
    console.error(chalk.red(`Error: Could not find '/architecture' directory at ${archDir}`));
    return false;
  }

  const errors = [];
  const warnings = [];

  const addError = (file, message, details = '') => errors.push({ file, message, details });
  const addWarning = (file, message, details = '') => warnings.push({ file, message, details });

  const yamlFiles = await getYamlFilesRecursively(archDir);
  
  let system = null;
  const domains = [];
  const features = [];
  const components = [];
  const enhancements = [];
  let relationships = [];
  
  const allLoadedNodes = new Map(); // id -> node

  // Step 1: Resilient Loading with Graceful Syntax Isolation (Task 15)
  for (const filePath of yamlFiles) {
    const relPath = path.relative(targetDir, filePath).replace(/\\/g, '/');
    try {
      if (!(await fs.pathExists(filePath))) continue;
      const content = await fs.readFile(filePath, 'utf8');
      const parsed = YAML.parse(content);
      if (!parsed || typeof parsed !== 'object') {
        addError(relPath, 'Parsed YAML content is empty or not an object');
        continue;
      }

      parsed._relPath = relPath;

      if (Array.isArray(parsed.relationships)) {
        relationships = [...relationships, ...parsed.relationships];
      }

      if (relPath.endsWith('relationships.yaml') || relPath.endsWith('architecture.index.yaml')) {
        continue;
      }

      const id = parsed.id;
      const type = parsed.type;

      if (type === 'system') {
        system = parsed;
        allLoadedNodes.set(id || 'SYS-AAM', parsed);
        continue;
      }

      if (id && type) {
        if (allLoadedNodes.has(id)) {
          addError(relPath, `Duplicate ID detected: '${id}' is already defined in ${allLoadedNodes.get(id)._relPath}`);
          continue;
        }
        allLoadedNodes.set(id, parsed);

        if (type === 'domain') {
          domains.push(parsed);
        } else if (type === 'feature') {
          features.push(parsed);
        } else if (type === 'component') {
          components.push(parsed);
        } else if (type === 'enhancement') {
          enhancements.push(parsed);
        }
      } else if (id && id.startsWith('SYS-')) {
        system = parsed;
        allLoadedNodes.set(id, parsed);
      } else {
        if (!id) addError(relPath, 'Node schema is missing the required "id" identifier field');
        if (!type) addError(relPath, 'Node schema is missing the required "type" ontology classifier field');
      }
    } catch (err) {
      addError(relPath, 'Malformed YAML Syntax', err.message);
    }
  }

  // Common Fields & Schema Checks
  const VALID_TYPES = new Set(['system', 'domain', 'feature', 'component', 'enhancement']);

  const checkCoreSchema = (node, expectedType) => {
    const relPath = node._relPath;
    
    // Type verification
    if (!node.type) {
      addError(relPath, 'Missing "type" ontology field');
    } else if (!VALID_TYPES.has(node.type)) {
      addError(relPath, `Invalid type value: '${node.type}'`, `Must be one of: ${[...VALID_TYPES].join(', ')}`);
    } else if (node.type !== expectedType) {
      addError(relPath, `Schema location/type mismatch: expected type '${expectedType}', got '${node.type}'`);
    }

    // Task 13: Schema compatibility & evolution checks
    if (node.schema_version === undefined) {
      addWarning(relPath, 'Missing schema_version field', 'It is highly recommended to specify schema_version: 1');
    } else if (Number(node.schema_version) !== 1) {
      addWarning(relPath, `Schema evolution mismatch: version '${node.schema_version}' detected. Current supported standard is schema_version: 1.`);
    }

    // Purpose checks
    if (!node.purpose) {
      addWarning(relPath, 'Missing "purpose" field explaining WHY this node exists in AAM architecture');
    }

    // Common fields
    if (!node.name) {
      addError(relPath, 'Missing "name" field');
    }
    if (!node.description) {
      addWarning(relPath, 'Missing "description" summary');
    }

    // Task 7: Protected Fields mutations safeguards (non-fatal warning)
    if (node.protected_fields && Array.isArray(node.protected_fields)) {
      const headContent = getGitHeadContent(targetDir, relPath);
      if (headContent) {
        try {
          const headParsed = YAML.parse(headContent);
          if (headParsed && typeof headParsed === 'object') {
            for (const field of node.protected_fields) {
              const currentVal = JSON.stringify(node[field]);
              const headVal = JSON.stringify(headParsed[field]);
              if (currentVal !== headVal) {
                addWarning(relPath, `Governance Violation: Protected field '${field}' mutated unexpectedly.`, `Mutated from: '${headParsed[field]}' to: '${node[field]}'`);
              }
            }
          }
        } catch {
          // Ignore baseline errors gracefully
        }
      }
    }

    // Deterministic ID alignment check
    if (node.id && node.type) {
      const expectedId = generateDeterministicId(node.type, node.name || node.id);
      if (node.id !== expectedId) {
        addWarning(relPath, `Non-deterministic ID pattern: '${node.id}'`, `To prevent ID conflicts, stable FNV-1a generated ID '${expectedId}' is recommended.`);
      }
    }
  };

  // State Matrix Allowed Values
  const VALID_LIFECYCLES = new Set(['proposed', 'active', 'evolving', 'stable', 'deprecated']);
  const VALID_IMPLEMENTATIONS = new Set(['partial', 'complete']);
  const VALID_RELIABILITIES = new Set(['unknown', 'unstable', 'reliable', 'hardened']);
  const VALID_OBSERVABILITIES = new Set(['missing', 'partial', 'complete']);
  const VALID_MATURITIES = new Set(['experimental', 'scaling', 'production', 'legacy']);
  const VALID_RISKS = new Set(['low', 'medium', 'high', 'critical']);
  const VALID_FREQUENCY = new Set(['low', 'moderate', 'high', 'volatile']);

  const validateStatusMatrix = (node) => {
    if (!node.status) return;
    const relPath = node._relPath;
    const s = node.status;

    if (s.lifecycle && !VALID_LIFECYCLES.has(s.lifecycle)) {
      addError(relPath, `Invalid status.lifecycle value: '${s.lifecycle}'`, `Allowed: ${[...VALID_LIFECYCLES].join(', ')}`);
    }
    if (s.implementation && !VALID_IMPLEMENTATIONS.has(s.implementation)) {
      addError(relPath, `Invalid status.implementation value: '${s.implementation}'`, `Allowed: ${[...VALID_IMPLEMENTATIONS].join(', ')}`);
    }
    if (s.reliability && !VALID_RELIABILITIES.has(s.reliability)) {
      addError(relPath, `Invalid status.reliability value: '${s.reliability}'`, `Allowed: ${[...VALID_RELIABILITIES].join(', ')}`);
    }
    if (s.observability && !VALID_OBSERVABILITIES.has(s.observability)) {
      addError(relPath, `Invalid status.observability value: '${s.observability}'`, `Allowed: ${[...VALID_OBSERVABILITIES].join(', ')}`);
    }
    if (s.maturity && !VALID_MATURITIES.has(s.maturity)) {
      addError(relPath, `Invalid status.maturity value: '${s.maturity}'`, `Allowed: ${[...VALID_MATURITIES].join(', ')}`);
    }
    if (s.risk && !VALID_RISKS.has(s.risk)) {
      addError(relPath, `Invalid status.risk value: '${s.risk}'`, `Allowed: ${[...VALID_RISKS].join(', ')}`);
    }
    if (s.change_frequency && !VALID_FREQUENCY.has(s.change_frequency)) {
      addError(relPath, `Invalid status.change_frequency value: '${s.change_frequency}'`, `Allowed: ${[...VALID_FREQUENCY].join(', ')}`);
    }
  };

  // Verify system metadata
  if (system) {
    checkCoreSchema(system, 'system');
  }

  // Verify domains
  for (const dom of domains) {
    checkCoreSchema(dom, 'domain');
  }

  // Verify features
  const referencedComponentIds = new Set();
  const referencedDomainIds = new Set();

  for (const feat of features) {
    checkCoreSchema(feat, 'feature');
    validateStatusMatrix(feat);

    if (!feat.capabilities || !Array.isArray(feat.capabilities) || feat.capabilities.length === 0) {
      addWarning(feat._relPath, 'Feature is missing capabilities array');
    }

    if (!feat.domains || !Array.isArray(feat.domains) || feat.domains.length === 0) {
      addError(feat._relPath, 'Feature is missing domains ownership array');
    } else {
      for (const domId of feat.domains) {
        referencedDomainIds.add(domId);
        if (!allLoadedNodes.has(domId)) {
          addError(feat._relPath, `Broken Reference: Feature maps to non-existent domain ID '${domId}'`);
        }
      }
    }

    if (feat.components && Array.isArray(feat.components)) {
      for (const compId of feat.components) {
        referencedComponentIds.add(compId);
        if (!allLoadedNodes.has(compId)) {
          addError(feat._relPath, `Broken Reference: Feature maps to non-existent component ID '${compId}'`);
        }
      }
    }
  }

  // Verify components
  for (const comp of components) {
    checkCoreSchema(comp, 'component');
    validateStatusMatrix(comp);

    if (!comp.capabilities || !Array.isArray(comp.capabilities) || comp.capabilities.length === 0) {
      addWarning(comp._relPath, 'Component is missing capabilities array');
    }

    if (!comp.domain) {
      addError(comp._relPath, 'Component is missing domain assignment field');
    } else {
      referencedDomainIds.add(comp.domain);
      if (!allLoadedNodes.has(comp.domain)) {
        addError(comp._relPath, `Broken Reference: Component maps to non-existent domain ID '${comp.domain}'`);
      }
    }
  }

  // Task 5: Relationship Ontology Registry
  const ALLOWED_RELATIONSHIP_TYPES = new Set([
    'depends_on',
    'consumes',
    'publishes_to',
    'communicates_with',
    'reads_from',
    'writes_to',
    'exposes',
    'owned_by',
    'triggers'
  ]);

  for (const rel of relationships) {
    if (!rel.source) {
      addError('relationships', 'Relationship missing source identifier');
      continue;
    }
    if (!rel.target) {
      addError('relationships', 'Relationship missing target identifier');
      continue;
    }
    if (!allLoadedNodes.has(rel.source)) {
      addError('relationships', `Broken Reference: Relationship source ID '${rel.source}' does not exist`);
    }
    if (!allLoadedNodes.has(rel.target)) {
      addError('relationships', `Broken Reference: Relationship target ID '${rel.target}' does not exist`);
    }

    // Type validation & suggestion (Task 5)
    if (!rel.type) {
      addError('relationships', `Relationship between '${rel.source}' and '${rel.target}' is missing the 'type' registry spec`);
    } else if (!ALLOWED_RELATIONSHIP_TYPES.has(rel.type)) {
      const nearest = getNearestMatch(rel.type, [...ALLOWED_RELATIONSHIP_TYPES]);
      addError('relationships', `Invalid relationship type '${rel.type}' between '${rel.source}' and '${rel.target}'`, `Semantic ontology drift detected. Did you mean '${nearest}'?`);
    }
  }

  if (silent) {
    return { errors, warnings };
  }

  // Print Validation Report
  const totalErrors = errors.length;
  const totalWarnings = warnings.length;

  console.log(chalk.bold('=== VALIDATION SUMMARY ==='));
  console.log(chalk.white(`Errors:   ${totalErrors > 0 ? chalk.red(totalErrors) : chalk.green('0')}`));
  console.log(chalk.white(`Warnings: ${totalWarnings > 0 ? chalk.yellow(totalWarnings) : chalk.green('0')}\n`));

  if (totalErrors > 0) {
    console.log(chalk.bold.red('CRITICAL ERRORS (Repair required):'));
    for (const err of errors) {
      console.log(`${chalk.red('[ERROR]')} in ${chalk.yellow(err.file)}: ${chalk.bold(err.message)}`);
      if (err.details) {
        console.log(chalk.gray(`  Details: ${err.details}`));
      }
    }
    console.log('');
  }

  if (totalWarnings > 0) {
    console.log(chalk.bold.yellow('WARNINGS (Cognitive drift / optimization suggestions):'));
    for (const warn of warnings) {
      console.log(`${chalk.yellow('[WARN]')} in ${chalk.yellow(warn.file)}: ${warn.message}`);
      if (warn.details) {
        console.log(chalk.gray(`  Details: ${warn.details}`));
      }
    }
    console.log('');
  }

  if (totalErrors === 0 && totalWarnings === 0) {
    console.log(chalk.bold.green('✓ Perfect Cognition! All AAM architecture schemas are perfectly structured and cohesive.\n'));
    return true;
  }

  return totalErrors === 0;
}
