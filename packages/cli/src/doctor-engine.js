import path from 'path';
import fs from 'fs-extra';
import YAML from 'yaml';
import chalk from 'chalk';
import { execSync } from 'child_process';

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
 * Task 4: Git Tracking Safety Check
 */
function checkGitTracking(targetDir) {
  try {
    // Check if the directory is a git repository
    execSync('git rev-parse --is-inside-work-tree', { stdio: 'ignore', cwd: targetDir });
    
    // Check if the /architecture/system.yaml file is ignored
    const testPath = path.join(targetDir, 'architecture', 'system.yaml');
    try {
      const isIgnored = execSync(`git check-ignore "${testPath}"`, { cwd: targetDir }).toString().trim();
      if (isIgnored) {
        return 'WARNING: Architecture cognition directory is gitignored. Ensure cognitive layers are tracked.';
      }
    } catch {
      // Exit code non-zero means not ignored, which is healthy
      return null;
    }
  } catch (err) {
    // Git is not available, or directory is not in a git repo.
    // Fall back to reading `.gitignore` files recursively.
    let current = targetDir;
    while (current) {
      const gitignorePath = path.join(current, '.gitignore');
      if (fs.existsSync(gitignorePath)) {
        try {
          const content = fs.readFileSync(gitignorePath, 'utf8');
          const lines = content.split('\n').map(l => l.trim());
          const hasIgnore = lines.some(l => l === 'architecture' || l === 'architecture/' || l === '*.yaml' || l === '*.yml');
          if (hasIgnore) {
            return `WARNING: Architecture cognition directory matches ignore rules in ${path.relative(targetDir, gitignorePath)}`;
          }
        } catch {
          // Ignored reading errors
        }
      }
      const parent = path.dirname(current);
      if (parent === current) break;
      current = parent;
    }
  }
  return null;
}

/**
 * Task 10: Ontology Consistency & Synonym Drift Check
 */
function areSemanticDuplicates(name1, name2) {
  const clean1 = name1.toLowerCase().replace(/[^a-z0-9]/g, '');
  const clean2 = name2.toLowerCase().replace(/[^a-z0-9]/g, '');
  
  if (clean1 === clean2) return true;
  
  // Stem match check for medium terms
  if (clean1.length > 5 && clean2.length > 5) {
    if (clean1.startsWith(clean2) || clean2.startsWith(clean1)) return true;
  }

  // Synonym pairs check
  const synonyms = [
    ['auth', 'authentication'],
    ['login', 'signin', 'sign-in'],
    ['db', 'database', 'postgres', 'sql'],
    ['user', 'account', 'profile'],
    ['api', 'service', 'server']
  ];

  for (const group of synonyms) {
    for (const wordA of group) {
      for (const wordB of group) {
        if (wordA !== wordB) {
          const replaced1 = clean1.replace(wordA, wordB);
          if (replaced1 === clean2) return true;
        }
      }
    }
  }

  return false;
}

/**
 * Task 9: Dynamic Complexity Scoring Heuristic
 */
export function computeComplexityScore(node, relationships) {
  let score = 0;
  const nodeRels = relationships.filter(rel => rel.source === node.id || rel.target === node.id);
  
  score += nodeRels.length * 2; // connections
  
  if (node.enhancements && Array.isArray(node.enhancements)) {
    score += node.enhancements.length * 3; // pending technical debt
  }
  
  if (node.capabilities && Array.isArray(node.capabilities)) {
    score += node.capabilities.length * 1.5; // capability density
  }
  
  if (node.status) {
    if (node.status.reliability === 'unstable') score += 4;
    if (node.status.reliability === 'unknown') score += 2;
    if (node.status.lifecycle === 'evolving') score += 3;
    if (node.status.lifecycle === 'proposed') score += 2;
  }
  
  let classification = 'low complexity';
  if (score >= 20) classification = 'critical complexity';
  else if (score >= 12) classification = 'high complexity';
  else if (score >= 6) classification = 'moderate complexity';
  
  return { score: Math.round(score), classification };
}

/**
 * Task 8: Architecture Snapshot Metadata Abstraction
 */
export function createSnapshotMetadata(system, nodes, relationships, hash) {
  return {
    schema_version: 1,
    snapshot_version: 1,
    timestamp: new Date().toISOString(),
    architecture_hash: hash,
    system: {
      id: system?.id || 'SYS-AAM',
      name: system?.name || 'AAM System Snapshot'
    },
    topology_summary: {
      domains_count: nodes.filter(n => n.type === 'domain').length,
      features_count: nodes.filter(n => n.type === 'feature').length,
      components_count: nodes.filter(n => n.type === 'component').length,
      relationships_count: relationships.length
    }
  };
}

/**
 * Runs structural diagnostics and outputs dynamic analysis of architecture smells.
 */
export async function runDoctor(targetDir = process.cwd(), silent = false) {
  const perfStart = Date.now();
  let yamlParseDuration = 0;

  const archDir = path.join(targetDir, 'architecture');

  if (!silent) {
    console.log(chalk.bold.cyan(`\n🩺 Running AAM Cognitive Doctor Engine...\n`));
  }

  if (!(await fs.pathExists(archDir))) {
    console.error(chalk.red(`Error: Could not find '/architecture' directory at ${archDir}`));
    return false;
  }

  const yamlFiles = await getYamlFilesRecursively(archDir);
  
  let system = null;
  const domains = [];
  const features = [];
  const components = [];
  const enhancements = [];
  let relationships = [];
  
  const idMap = new Map();
  const malformedFiles = [];

  for (const filePath of yamlFiles) {
    const parseStart = Date.now();
    try {
      const content = await fs.readFile(filePath, 'utf8');
      const parsed = YAML.parse(content);
      yamlParseDuration += (Date.now() - parseStart);
      
      if (!parsed || typeof parsed !== 'object') continue;
      
      const relPath = path.relative(targetDir, filePath).replace(/\\/g, '/');
      parsed._relPath = relPath;

      if (Array.isArray(parsed.relationships)) {
        relationships = [...relationships, ...parsed.relationships];
      }

      const id = parsed.id;
      const type = parsed.type;

      if (type === 'system') {
        system = parsed;
        continue;
      }

      if (id && type) {
        if (idMap.has(id)) continue;
        idMap.set(id, relPath);

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
      }
    } catch (err) {
      malformedFiles.push({
        file: path.relative(targetDir, filePath).replace(/\\/g, '/'),
        error: err.message
      });
    }
  }

  const issues = [];
  const addIssue = (type, node, message) => {
    issues.push({ type, file: node._relPath || 'system.yaml', id: node.id, message });
  };

  const allNodes = [...domains, ...features, ...components];

  // Malformed isolation (Task 15)
  for (const malformed of malformedFiles) {
    addIssue('Malformed YAML Syntax', { id: 'MALFORMED', _relPath: malformed.file }, `Could not parse YAML file: ${malformed.error}`);
  }

  // --- Task 4: Git Tracking Safety ---
  const gitIssue = checkGitTracking(targetDir);
  if (gitIssue) {
    addIssue('Git Ignored Cognition', { id: 'GIT', _relPath: '.gitignore' }, gitIssue);
  }

  // Build relationships count metrics
  const nodeRelCount = new Map();
  allNodes.forEach(n => nodeRelCount.set(n.id, 0));
  relationships.forEach(rel => {
    if (nodeRelCount.has(rel.source)) nodeRelCount.set(rel.source, nodeRelCount.get(rel.source) + 1);
    if (nodeRelCount.has(rel.target)) nodeRelCount.set(rel.target, nodeRelCount.get(rel.target) + 1);
  });

  // --- Task 10: Ontology Duplicate Checks ---
  for (let i = 0; i < allNodes.length; i++) {
    for (let j = i + 1; j < allNodes.length; j++) {
      const nodeA = allNodes[i];
      const nodeB = allNodes[j];
      if (nodeA.type === nodeB.type && areSemanticDuplicates(nodeA.name, nodeB.name)) {
        addIssue('Ontology Semantic Overlap', nodeA, `Node '${nodeA.id}' shares suspicious naming overlap with '${nodeB.id}' (${nodeB._relPath}). Ensure semantic clarity.`);
      }
    }
  }

  // --- Task 3: Cognition Density & Smells ---
  // Relationship Saturation
  for (const node of allNodes) {
    const count = nodeRelCount.get(node.id) || 0;
    if (count >= 15) {
      addIssue('Relationship Saturation', node, `Node '${node.id}' is saturated with ${count} relationships (max 15 recommended). Refactor couplings.`);
    }
  }

  // Feature Explosion
  for (const feat of features) {
    const comps = feat.components || [];
    if (comps.length > 10) {
      addIssue('Feature Explosion', feat, `Feature '${feat.id}' has excessive component mapping (${comps.length} components mapped). Divide capabilities.`);
    }
  }

  // Oversized Domains
  for (const dom of domains) {
    const domFeatures = features.filter(f => f.domains && f.domains.includes(dom.id));
    if (domFeatures.length > 8) {
      addIssue('Oversized Domain', dom, `Domain '${dom.id}' has high cognitive saturation with ${domFeatures.length} features (max 8 recommended).`);
    }
  }

  // Weak Capability Density
  for (const node of [...features, ...components]) {
    const count = nodeRelCount.get(node.id) || 0;
    const caps = node.capabilities || [];
    if (count >= 4 && caps.length < 2) {
      addIssue('Weak Capability Density', node, `Node '${node.id}' lists only ${caps.length} capabilities despite having ${count} interactions. Document functional footprint.`);
    }
  }

  // Excessive Centrality / Coupling
  for (const node of allNodes) {
    const count = nodeRelCount.get(node.id) || 0;
    if (count >= 8) {
      addIssue('Excessive Topology Centrality', node, `Central element '${node.id}' has ${count} topological relationships. Susceptible to coupling issues.`);
    }
  }

  // Graph Entropy ratio
  const nodesCount = allNodes.length;
  if (nodesCount > 0) {
    const entropy = relationships.length / nodesCount;
    if (entropy > 3.5) {
      const dummyNode = { id: 'ENTROPY', _relPath: 'relationships.yaml' };
      addIssue('High Architecture Entropy', dummyNode, `System-wide relationship to node ratio is high (${entropy.toFixed(2)}). Preserving visual clarity is recommended.`);
    }
  }

  // Standard checks from earlier AAM iteration
  for (const dom of domains) {
    const domainFeatures = features.filter(f => f.domains && f.domains.includes(dom.id));
    if (domainFeatures.length === 0) {
      addIssue('Empty Domain', dom, `Domain '${dom.id}' contains 0 associated features.`);
    }
  }

  // Missing or Malformed knowledge links (Task 3)
  for (const node of allNodes) {
    if (!node.knowledge_links || !Array.isArray(node.knowledge_links) || node.knowledge_links.length === 0) {
      addIssue('Missing Knowledge Link', node, `Node '${node.id}' has no knowledge_links specified.`);
    } else {
      node.knowledge_links.forEach((link, idx) => {
        if (!link || typeof link !== 'object' || Array.isArray(link) || !link.type || !link.path) {
          addIssue('Malformed Knowledge Link', node, `Node '${node.id}' has a malformed knowledge link at index ${idx}. Must strictly be an object {type, path}.`);
        }
      });
    }
  }

  // Low description size
  for (const node of allNodes) {
    const desc = node.description || '';
    if (desc.trim().length < 25) {
      addIssue('Low Cognition Description', node, `Node '${node.id}' description is extremely brief (${desc.trim().length} chars).`);
    }
  }

  // Outdated Verbose Summary
  for (const node of allNodes) {
    const desc = node.description || '';
    if (desc.trim().length > 250) {
      addIssue('Overly Verbose Cognition', node, `Node '${node.id}' description is too verbose (${desc.trim().length} characters). Keep summaries compressed.`);
    }
  }

  // DFS Cycle detection for circular dependencies
  const featureRelations = new Map();
  features.forEach(f => featureRelations.set(f.id, new Set()));
  relationships.forEach(rel => {
    const srcId = rel.source;
    const tgtId = rel.target;
    const srcFeats = features.filter(f => f.id === srcId || (f.components && f.components.includes(srcId))).map(f => f.id);
    const tgtFeats = features.filter(f => f.id === tgtId || (f.components && f.components.includes(tgtId))).map(f => f.id);
    
    srcFeats.forEach(sf => {
      tgtFeats.forEach(tf => {
        if (sf !== tf) featureRelations.get(sf)?.add(tf);
      });
    });
  });

  const visited = new Set();
  const recStack = new Set();
  const featureCycles = [];
  
  function dfsFeature(nodeId, pathList = []) {
    if (recStack.has(nodeId)) {
      const startIdx = pathList.indexOf(nodeId);
      const cyclePath = [...pathList.slice(startIdx), nodeId];
      featureCycles.push(cyclePath);
      return;
    }
    if (visited.has(nodeId)) return;
    
    visited.add(nodeId);
    recStack.add(nodeId);
    
    const targets = featureRelations.get(nodeId) || [];
    for (const tgt of targets) {
      dfsFeature(tgt, [...pathList, nodeId]);
    }
    
    recStack.delete(nodeId);
  }

  features.forEach(f => {
    visited.clear();
    recStack.clear();
    dfsFeature(f.id);
  });

  const reportedSigs = new Set();
  for (const cycle of featureCycles) {
    const signature = [...cycle].sort().join('-');
    if (!reportedSigs.has(signature)) {
      reportedSigs.add(signature);
      const featNode = features.find(f => f.id === cycle[0]);
      addIssue('Circular Feature Relationship', featNode, `Circular dependency path: ${cycle.join(' -> ')}`);
    }
  }

  // --- Task 12: Internal Performance Telemetry ---
  const totalDuration = Date.now() - perfStart;
  const telemetry = {
    hydrationDurationMs: totalDuration,
    yamlParseDurationMs: yamlParseDuration,
    nodesCount: allNodes.length,
    edgesCount: relationships.length
  };

  if (silent) {
    return { issues, telemetry };
  }

  // Print results beautifully
  const totalIssues = issues.length;
  if (totalIssues === 0) {
    console.log(chalk.bold.green('✓ Cognition Doctor: Perfect health! No cognitive drift or architectural smells detected.\n'));
  } else {
    const grouped = {};
    for (const issue of issues) {
      if (!grouped[issue.type]) grouped[issue.type] = [];
      grouped[issue.type].push(issue);
    }

    console.log(chalk.bold.yellow(`Cognition Health Diagnostics (${totalIssues} issues to review):\n`));

    for (const type of Object.keys(grouped)) {
      console.log(chalk.bold.underline.yellow(`${type.toUpperCase()}:`));
      for (const issue of grouped[type]) {
        console.log(`  ${chalk.gray('-')} ${chalk.cyan(issue.file)}: ${issue.message}`);
      }
      console.log('');
    }
  }

  // Print Performance Telemetry
  console.log(chalk.bold.gray(`⏱ Local Telemetry: Hydrated ${telemetry.nodesCount} nodes and ${telemetry.edgesCount} relationships in ${telemetry.hydrationDurationMs}ms (YAML parse: ${telemetry.yamlParseDurationMs}ms).\n`));

  return true;
}
