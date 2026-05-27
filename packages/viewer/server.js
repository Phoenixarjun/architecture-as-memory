import express from 'express';
import cors from 'cors';
import path from 'path';
import chokidar from 'chokidar';
import fs from 'fs-extra';
import YAML from 'yaml';
import chalk from 'chalk';

// Active SSE client connections
let clients = [];

/**
 * Safely reads and parses a YAML file. Returns null if error or doesn't exist.
 */
async function parseYamlFile(filePath) {
  try {
    if (!(await fs.pathExists(filePath))) return null;
    const content = await fs.readFile(filePath, 'utf8');
    return YAML.parse(content);
  } catch (error) {
    console.error(chalk.red(`Error parsing YAML file at ${filePath}: ${error.message}`));
    return null;
  }
}

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
 * Aggregates all YAML files in the architecture directory into a single hydrated JSON state.
 * Implements a fully dynamic discovery and schema-driven loading process.
 */
export async function getHydratedArchitecture(archDir) {
  const yamlFiles = await getYamlFilesRecursively(archDir);
  
  let system = null;
  const domains = [];
  const features = [];
  const components = [];
  const enhancements = [];
  let relationships = [];
  
  const idMap = new Map();

  for (const filePath of yamlFiles) {
    try {
      const content = await fs.readFile(filePath, 'utf8');
      const parsed = YAML.parse(content);
      if (!parsed || typeof parsed !== 'object') continue;
      
      const relPath = path.relative(archDir, filePath).replace(/\\/g, '/');
      parsed._relPath = relPath;

      // Extract relationships if present
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
        if (idMap.has(id)) {
          console.warn(chalk.yellow(`[AAM Discovery] Duplicate ID '${id}' detected in ${relPath}. First defined in ${idMap.get(id)}`));
          continue;
        }
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
      // Isolate malformed YAML files gracefully to maintain runtime resilience (Task 15)
      console.error(chalk.red(`[AAM Discovery] Gracefully isolated malformed file at ${filePath}: ${err.message}`));
    }
  }

  // Fallback defaults if no system node was discovered
  if (!system) {
    system = {
      id: 'SYS-AAM',
      type: 'system',
      schema_version: 1,
      name: 'Dynamic Architecture-as-Memory',
      description: 'Dynamic local system node initialized recursively.'
    };
  }

  return {
    system,
    domains,
    features,
    components,
    enhancements,
    relationships
  };
}

/**
 * Broadcasts an SSE message to all connected clients.
 */
function broadcast(event, data) {
  clients.forEach((client) => {
    client.write(`event: ${event}\n`);
    client.write(`data: ${JSON.stringify(data)}\n\n`);
  });
}

/**
 * Starts the Express server and begins directory watching.
 */
export function startServer({ port, archDir, staticDir, onStart }) {
  const app = express();

  app.use(cors());
  app.use(express.json());

  // 1. Serve static frontend assets in production
  if (staticDir && fs.pathExistsSync(staticDir)) {
    app.use(express.static(staticDir));
  }

  // 2. API Endpoint: Fetch unified hydrated graph JSON
  app.get('/api/architecture', async (req, res) => {
    try {
      const data = await getHydratedArchitecture(archDir);
      res.json(data);
    } catch (error) {
      console.error(chalk.red(`Failed to hydrated architecture: ${error.message}`));
      res.status(500).json({ error: error.message });
    }
  });

  // 3. API Endpoint: SSE Live Reload connection
  app.get('/api/events', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    clients.push(res);
    console.log(chalk.cyan(`  [SSE] Client connected. Total active clients: ${clients.length}`));

    // Keep-alive heartbeat
    const keepAlive = setInterval(() => {
      res.write(': keepalive\n\n');
    }, 30000);

    req.on('close', () => {
      clearInterval(keepAlive);
      clients = clients.filter((client) => client !== res);
      console.log(chalk.cyan(`  [SSE] Client disconnected. Total active clients: ${clients.length}`));
    });
  });

  // 4. Fallback route for SPA Routing (React Router / index.html)
  if (staticDir && fs.pathExistsSync(staticDir)) {
    app.get(/.*/, (req, res) => {
      res.sendFile(path.join(staticDir, 'index.html'));
    });
  }

  // 5. Initialize Chokidar Watcher
  const watcher = chokidar.watch(archDir, {
    ignored: /(^|[\/\\])\../, // ignore dotfiles
    persistent: true,
    ignoreInitial: true,
    awaitWriteFinish: {
      stabilityThreshold: 100,
      pollInterval: 100
    }
  });

  watcher.on('all', async (event, filePath) => {
    console.log(chalk.yellow(`  [Watcher] File ${event}: ${path.relative(archDir, filePath)}`));
    try {
      const data = await getHydratedArchitecture(archDir);
      broadcast('update', data);
    } catch (error) {
      console.error(chalk.red(`  [Watcher] Error broadcasting update: ${error.message}`));
    }
  });

  // Start HTTP Listener
  const server = app.listen(port, '0.0.0.0', () => {
    const url = `http://localhost:${port}`;
    if (onStart) {
      onStart(url);
    }
  });

  // Graceful shutdown
  process.on('SIGTERM', () => {
    watcher.close();
    server.close();
    process.exit(0);
  });

  return server;
}
