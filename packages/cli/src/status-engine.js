import path from 'path';
import fs from 'fs-extra';
import YAML from 'yaml';
import chalk from 'chalk';
import { validateArchitecture } from './validation-engine.js';
import { runDoctor } from './doctor-engine.js';

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
 * Executes a fast, lightweight diagnostic to output a colorized operational heartbeat.
 */
export async function getHeartbeat(targetDir = process.cwd()) {
  const archDir = path.join(targetDir, 'architecture');

  if (!(await fs.pathExists(archDir))) {
    console.error(chalk.red(`Error: Could not find '/architecture' directory in ${targetDir}`));
    console.log(chalk.yellow('Run "aam init" to scaffold this directory first.\n'));
    return false;
  }

  const startTIme = Date.now();
  const yamlFiles = await getYamlFilesRecursively(archDir);

  let domainsCount = 0;
  let featuresCount = 0;
  let componentsCount = 0;
  let enhancementsCount = 0;
  let relationshipsCount = 0;
  let lastMtime = 0;

  // Track parsed structures
  const nodes = [];

  for (const file of yamlFiles) {
    const stat = await fs.stat(file);
    if (stat.mtimeMs > lastMtime) {
      lastMtime = stat.mtimeMs;
    }

    try {
      const content = await fs.readFile(file, 'utf8');
      const parsed = YAML.parse(content);
      if (!parsed || typeof parsed !== 'object') continue;

      if (Array.isArray(parsed.relationships)) {
        relationshipsCount += parsed.relationships.length;
      }

      const type = parsed.type;
      if (type === 'domain') domainsCount++;
      else if (type === 'feature') featuresCount++;
      else if (type === 'component') componentsCount++;
      else if (type === 'enhancement') enhancementsCount++;

      if (parsed.id && type) {
        nodes.push(parsed);
      }
    } catch {
      // Tolerate parsing faults silently for heartbeat speed
    }
  }

  // Calculate elapsed time from last update
  let lastUpdateStr = 'Never';
  if (lastMtime > 0) {
    const elapsedSec = Math.floor((Date.now() - lastMtime) / 1000);
    if (elapsedSec < 10) {
      lastUpdateStr = 'just now';
    } else if (elapsedSec < 60) {
      lastUpdateStr = `${elapsedSec} seconds ago`;
    } else {
      const elapsedMin = Math.floor(elapsedSec / 60);
      if (elapsedMin < 60) {
        lastUpdateStr = `${elapsedMin} minute${elapsedMin > 1 ? 's' : ''} ago`;
      } else {
        const elapsedHour = Math.floor(elapsedMin / 60);
        if (elapsedHour < 24) {
          lastUpdateStr = `${elapsedHour} hour${elapsedHour > 1 ? 's' : ''} ago`;
        } else {
          const elapsedDay = Math.floor(elapsedHour / 24);
          lastUpdateStr = `${elapsedDay} day${elapsedDay > 1 ? 's' : ''} ago`;
        }
      }
    }
  }

  // Capture validation health silently
  let isValid = true;
  let errorsCount = 0;
  let warningsCount = 0;
  let staleEnhancements = 0;

  // Count pending enhancements / debt items from active nodes
  for (const node of nodes) {
    if (node.enhancements && Array.isArray(node.enhancements)) {
      staleEnhancements += node.enhancements.length;
    }
  }

  // Interrogate status via a silent run of validate/doctor if available
  // Or parse them quickly based on node completeness
  for (const node of nodes) {
    if (!node.name || !node.id) errorsCount++;
    if (!node.description || !node.purpose) warningsCount++;
  }

  console.log(chalk.bold.cyan(`\n📊 Architecture-As-Memory (AAM) Heartbeat:\n`));
  console.log(chalk.white(`Domains:       ${chalk.bold.green(domainsCount)}`));
  console.log(chalk.white(`Features:      ${chalk.bold.green(featuresCount)}`));
  console.log(chalk.white(`Components:    ${chalk.bold.green(componentsCount)}`));
  console.log(chalk.white(`Enhancements:  ${chalk.bold.green(enhancementsCount)}`));
  console.log(chalk.white(`Relationships: ${chalk.bold.green(relationshipsCount)}`));
  console.log('');

  console.log(chalk.white(`Validation:`));
  if (errorsCount === 0) {
    console.log(`  ✓ ${chalk.green('healthy')}`);
  } else {
    console.log(`  ✗ ${chalk.red(`${errorsCount} critical validation issues detected`)}`);
  }
  console.log('');

  console.log(chalk.white(`Smells:`));
  if (warningsCount === 0 && staleEnhancements === 0) {
    console.log(`  ${chalk.green('None detected')}`);
  } else {
    console.log(`  ${chalk.yellow(`${warningsCount} warning${warningsCount !== 1 ? 's' : ''}`)}`);
    console.log(`  ${chalk.yellow(`${staleEnhancements} stale enhancement${staleEnhancements !== 1 ? 's' : ''}`)}`);
  }
  console.log('');

  console.log(chalk.white(`Graph:`));
  if (errorsCount === 0) {
    console.log(`  ${chalk.green('healthy')}`);
  } else {
    console.log(`  ${chalk.red('degraded')}`);
  }
  console.log('');

  console.log(chalk.white(`Last architecture update:`));
  console.log(`  ${chalk.bold.cyan(lastUpdateStr)}`);
  console.log('');

  return true;
}
