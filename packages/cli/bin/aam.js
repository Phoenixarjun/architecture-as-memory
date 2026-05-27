#!/usr/bin/env node

import { program } from 'commander';
import chalk from 'chalk';
import path from 'path';
import fs from 'fs-extra';
import { exec } from 'child_process';
import { fileURLToPath } from 'url';
import { bootstrap } from '../src/scaffolder.js';

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

  throw new Error('AAM Watcher Server could not be located. Ensure the package is correctly installed or built.');
}

program
  .name('aam')
  .description('Architecture-As-Memory: Living cognitive architecture maps for AI coding assistants.')
  .version('1.0.0');

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

program.parse(process.argv);
