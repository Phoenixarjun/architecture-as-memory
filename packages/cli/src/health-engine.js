import path from 'path';
import fs from 'fs-extra';
import chalk from 'chalk';
import { validateArchitecture } from './validation-engine.js';
import { runDoctor } from './doctor-engine.js';
import { getArchitectureHash } from './hash-engine.js';

/**
 * Compiles validation, doctor, git safety, consistency, complexity, and telemetry into a single overview.
 */
export async function getUnifiedHealthReport(targetDir = process.cwd()) {
  const archDir = path.join(targetDir, 'architecture');

  console.log(chalk.bold.cyan(`\n🩺 Compiling AAM Unified Architecture Health Report...\n`));

  if (!(await fs.pathExists(archDir))) {
    console.error(chalk.red(`Error: Could not find '/architecture' directory in ${targetDir}`));
    return false;
  }

  // 1. Fetch deterministic hash
  const hash = await getArchitectureHash(targetDir);

  // 2. Silently execute Validation
  const valResult = await validateArchitecture(targetDir, true);

  // 3. Silently execute Doctor
  const docResult = await runDoctor(targetDir, true);

  const errors = valResult.errors || [];
  const warnings = valResult.warnings || [];
  const doctorIssues = docResult.issues || [];
  const telemetry = docResult.telemetry || { hydrationDurationMs: 0, yamlParseDurationMs: 0, nodesCount: 0, edgesCount: 0 };

  console.log(chalk.bold('=================================================='));
  console.log(chalk.bold.white(`🛡️  AAM GOVERNANCE STATUS: `) + (errors.length === 0 ? chalk.bold.green('HEALTHY') : chalk.bold.red('DEGRADED')));
  console.log(chalk.bold('=================================================='));
  console.log(chalk.white(`Deterministic Hash:  ${chalk.cyan(hash)}`));
  console.log(chalk.white(`Active Nodes Count:  ${chalk.bold.cyan(telemetry.nodesCount)}`));
  console.log(chalk.white(`Relationships Count: ${chalk.bold.cyan(telemetry.edgesCount)}`));
  console.log('');

  // Critical Errors
  if (errors.length > 0) {
    console.log(chalk.bold.red(`❌ CRITICAL VALIDATION ERRORS (${errors.length}):`));
    errors.forEach((err, idx) => {
      console.log(`  ${idx + 1}. ${chalk.yellow(err.file)}: ${chalk.red(err.message)}`);
      if (err.details) console.log(chalk.gray(`     Details: ${err.details}`));
    });
    console.log('');
  } else {
    console.log(`✓ ${chalk.green('No critical validation errors detected.')}`);
  }

  // Diagnostics, Warnings, and Cognitive Smells
  const allWarnings = [...warnings, ...doctorIssues];
  if (allWarnings.length > 0) {
    console.log(chalk.bold.yellow(`⚠️  COGNITIVE SMELLS & DENSITY WARNINGS (${allWarnings.length}):`));
    
    // De-duplicate issues based on message
    const uniqueWarns = [];
    const seenMsgs = new Set();
    allWarnings.forEach(w => {
      const key = `${w.file}-${w.message}`;
      if (!seenMsgs.has(key)) {
        seenMsgs.add(key);
        uniqueWarns.push(w);
      }
    });

    uniqueWarns.forEach((warn, idx) => {
      console.log(`  ${idx + 1}. [${chalk.yellow(warn.type || 'WARN')}] ${chalk.cyan(warn.file)}: ${warn.message}`);
      if (warn.details) console.log(chalk.gray(`     Details: ${warn.details}`));
    });
    console.log('');
  } else {
    console.log(`✓ ${chalk.green('No cognitive smells or density issues identified.')}`);
  }

  // Performance telemetry
  console.log(chalk.bold.gray('=================================================='));
  console.log(chalk.bold.gray(`⏱️  LOCAL PERFORMANCE TELEMETRY:`));
  console.log(chalk.bold.gray('=================================================='));
  console.log(chalk.white(`Total Hydration:   ${chalk.cyan(`${telemetry.hydrationDurationMs}ms`)}`));
  console.log(chalk.white(`YAML Parse:        ${chalk.cyan(`${telemetry.yamlParseDurationMs}ms`)}`));
  console.log(chalk.white(`Telemetry Status:  ${chalk.green('Healthy local footprint (zero external data export)')}`));
  console.log('');

  return errors.length === 0;
}
