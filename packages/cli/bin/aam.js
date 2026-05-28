#!/usr/bin/env node

import { program } from 'commander';
import chalk from 'chalk';
import path from 'path';
import fs from 'fs-extra';
import { exec } from 'child_process';
import { fileURLToPath } from 'url';
import { bootstrap } from '../src/scaffolder.js';
import { validateArchitecture } from '../src/validation-engine.js';
import { runDoctor } from '../src/doctor-engine.js';
import { installClaudeHook } from '../src/hooks/claude.js';
import { exportArchitecture } from '../src/exporter.js';
import { getHeartbeat } from '../src/status-engine.js';
import { runHashCommand } from '../src/hash-engine.js';
import { runSnapshotCommand } from '../src/snapshot-engine.js';
import { getUnifiedHealthReport } from '../src/health-engine.js';
import { reinforceProvider } from '../src/reinforcement-engine.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper to open the browser
function openBrowser(url) {
  const startCommand = process.platform === 'darwin' ? 'open' : process.platform === 'win32' ? 'start' : 'xdg-open';
  exec(`${startCommand} ${url}`, (err) => {
    if (err) {
      console.error(chalk.red(`Failed to open browser automatically: ${err.message}`));
    }
  });
}

// Helper to resolve the watcher server module path
async function getWatcherServerPath() {
  // Path 1: Production bundle (copied inside CLI package)
  const prodPath = path.resolve(__dirname, '../viewer/server.js');
  if (await fs.pathExists(prodPath)) {
    return prodPath;
  }

  // Path 2: Monorepo local development path
  const devPath = path.resolve(__dirname, '../../../packages/viewer/server.js');
  if (await fs.pathExists(devPath)) {
    return devPath;
  }

  const errorMessage = [
    `AAM Watcher Server could not be located.`,
    `------------------------------------------------------------------`,
    `Expected locations checked:`,
    `  1. Production Path : ${prodPath}`,
    `  2. Development Path: ${devPath}`,
    `------------------------------------------------------------------`,
    `Actionable Fixes:`,
    `  - If running in a local clone/dev workspace:`,
    `    Run: 'npm run build' or 'npm run bundle:all' to build all viewer static and server assets first.`,
    `  - If running globally or inside another project via 'npx':`,
    `    Your local npm cache might contain a stale or corrupted partial installation.`,
    `    Force clear the cache and fetch the latest official stable build:`,
    `    Run: 'npx @architecture-as-memory/aam@latest dev'`,
    `------------------------------------------------------------------`
  ].join('\n');

  throw new Error(errorMessage);
}

const pkg = fs.readJsonSync(path.resolve(__dirname, '../package.json'));
const version = pkg.version;

const banner = chalk.bold.rgb(255, 138, 61)(`
    ___    ___    ___  ___ 
   /   |  /   |  /   |/   |
  / /| | / /| | / /|   /| |
 / ___ |/ ___ |/ / |  / | |
/_/  |_/_/  |_/_/  |_/  |_|
`);
const subtitle = chalk.bold.gray(`  ARCHITECTURE-AS-MEMORY (AAM) v${version}\n`);

program
  .name('aam')
  .description('Architecture-As-Memory: Living cognitive architecture maps for AI coding assistants.')
  .version(version)
  .addHelpText('before', banner + subtitle);

export function showAamBanner() {
  console.log(banner + subtitle);
}

program
  .command('init')
  .description('Bootstrap the /architecture directory structure and register AI instruction hooks.')
  .action(async () => {
    try {
      await bootstrap(process.cwd());
    } catch (error) {
      console.error(chalk.red(`\nInitialization failed: ${error.message}`));
      process.exit(1);
    }
  });

program
  .command('validate')
  .description('Validate the structural integrity and references of the AAM architecture schemas.')
  .action(async () => {
    try {
      const isValid = await validateArchitecture(process.cwd());
      process.exit(isValid ? 0 : 1);
    } catch (error) {
      console.error(chalk.red(`\nValidation crashed: ${error.message}`));
      process.exit(1);
    }
  });

program
  .command('doctor')
  .description('Diagnose the cognition health and detect semantic drift in AAM architecture schemas.')
  .action(async () => {
    try {
      const completed = await runDoctor(process.cwd());
      process.exit(completed ? 0 : 1);
    } catch (error) {
      console.error(chalk.red(`\nCognitive doctor crashed: ${error.message}`));
      process.exit(1);
    }
  });

program
  .command('export')
  .description('Export the current living architecture into a standalone, single-file offline visualizer bundle.')
  .option('-o, --output <path>', 'Output file name', 'architecture-map.html')
  .action(async (options) => {
    try {
      await exportArchitecture(process.cwd(), options.output);
    } catch (error) {
      console.error(chalk.red(`\nExport failed: ${error.message}`));
      process.exit(1);
    }
  });

program
  .command('hooks <action> <provider>')
  .description('Install optional post-task instruction hooks. (Initially "install claude" is supported).')
  .action(async (action, provider) => {
    try {
      if (action !== 'install') {
        console.error(chalk.red(`\nError: Unsupported hook action '${action}'. Did you mean 'install'?`));
        process.exit(1);
      }
      if (provider !== 'claude') {
        console.error(chalk.red(`\nError: Unsupported hook provider '${provider}'. Initially only 'claude' is supported.`));
        process.exit(1);
      }
      await installClaudeHook(process.cwd());
    } catch (error) {
      console.error(chalk.red(`\nHook installation crashed: ${error.message}`));
      process.exit(1);
    }
  });

program
  .command('reinforce <provider>')
  .description('Reinforce AAM architectural context into a specific AI provider workflow (claude, gemini, codex, cursor, generic).')
  .action(async (provider) => {
    try {
      await reinforceProvider(provider, process.cwd());
    } catch (error) {
      console.error(chalk.red(`\nReinforcement failed: ${error.message}`));
      process.exit(1);
    }
  });

program
  .command('dev')
  .description('Start the local YAML watcher server and open the interactive architecture map.')
  .option('-p, --port <number>', 'Port to run the watcher server on', '4200')
  .action(async (options) => {
    const port = parseInt(options.port, 10);
    const archDir = path.resolve(process.cwd(), 'architecture');

    if (!(await fs.pathExists(archDir))) {
      console.error(chalk.red(`\nError: Could not find '/architecture' directory in ${process.cwd()}`));
      console.log(chalk.yellow('Please run "aam init" first to bootstrap your architecture schemas.\n'));
      process.exit(1);
    }

    try {
      const serverPath = await getWatcherServerPath();
      console.log(chalk.cyan(`\nStarting AAM Watcher Server...`));
      
      // Import the Express app start function dynamically
      const serverModule = await import(`file://${serverPath}`);
      
      if (typeof serverModule.startServer !== 'function') {
        throw new Error('Watcher server script does not export "startServer" function.');
      }

      // Determine where the static frontend assets are located
      let staticDir = path.resolve(__dirname, '../viewer/dist');
      if (!(await fs.pathExists(staticDir))) {
        // Fallback to local workspace development path
        staticDir = path.resolve(__dirname, '../../../packages/viewer/dist');
      }

      serverModule.startServer({
        port,
        archDir,
        staticDir,
        onStart: (serverUrl) => {
          console.log(chalk.bold.green(`\n🚀 Watcher running at: ${serverUrl}`));
          console.log(chalk.white(`Watching architecture files in ${chalk.yellow(archDir)}`));
          console.log(chalk.white('Press Ctrl+C to terminate.\n'));
          openBrowser(serverUrl);
        }
      });
    } catch (error) {
      console.error(chalk.red(`\nFailed to start server: ${error.message}`));
      process.exit(1);
    }
  });

program
  .command('status')
  .description('Display a quick colorized operational heartbeat of repository cognition health.')
  .action(async () => {
    try {
      showAamBanner();
      const completed = await getHeartbeat(process.cwd());
      process.exit(completed ? 0 : 1);
    } catch (error) {
      console.error(chalk.red(`\nStatus failed: ${error.message}`));
      process.exit(1);
    }
  });

program
  .command('hash')
  .description('Calculate a stable, deterministic SHA-256 signature of the current topology.')
  .action(async () => {
    try {
      await runHashCommand(process.cwd());
    } catch (error) {
      console.error(chalk.red(`\nHashing failed: ${error.message}`));
      process.exit(1);
    }
  });

program
  .command('snapshot')
  .description('Save a snapshot definition of the current topology under .aam/snapshots/.')
  .action(async () => {
    try {
      await runSnapshotCommand(process.cwd());
    } catch (error) {
      console.error(chalk.red(`\nSnapshot failed: ${error.message}`));
      process.exit(1);
    }
  });

program
  .command('health')
  .description('Compile a unified health dashboard aggregating validation, doctor, git, and performance telemetry.')
  .action(async () => {
    try {
      showAamBanner();
      const healthy = await getUnifiedHealthReport(process.cwd());
      process.exit(healthy ? 0 : 1);
    } catch (error) {
      console.error(chalk.red(`\nHealth compilation failed: ${error.message}`));
      process.exit(1);
    }
  });

program.parse(process.argv);
