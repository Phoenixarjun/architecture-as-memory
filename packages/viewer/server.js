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
 * Aggregates all YAML files in the architecture directory into a single hydrated JSON state.
 * Supports "Cognitive Auto-Hydration" (auto-discovers orphaned files).
 */
export async function getHydratedArchitecture(archDir) {
  const indexPath = path.join(archDir, 'architecture.index.yaml');
  const index = await parseYamlFile(indexPath) || {};

  // 1. Parse system metadata
  const systemPath = path.join(archDir, index.system || 'system.yaml');
  const system = await parseYamlFile(systemPath) || { id: 'SYS-AAM', name: 'AAM Project', description: 'System metadata missing.' };

  // Helper to safely load lists from both index mapping and filesystem discovery
  async function loadCategoryNodes(categoryName, subfolder) {
    const list = index[categoryName] || [];
    const nodesMap = new Map();

    // Load indexed items first
    for (const item of list) {
      if (item.path) {
        const fullPath = path.join(archDir, item.path);
        const parsed = await parseYamlFile(fullPath);
        if (parsed) {
          nodesMap.set(parsed.id || item.id, parsed);
        }
      }
    }

    // Auto-discover orphaned or newly added files in subfolders (Cognitive Auto-Hydration)
    const categoryDir = path.join(archDir, subfolder);
    if (await fs.pathExists(categoryDir)) {
      const files = await fs.readdir(categoryDir);
      for (const file of files) {
        if (file.endsWith('.yaml') || file.endsWith('.yml')) {
          const fullPath = path.join(categoryDir, file);
          const parsed = await parseYamlFile(fullPath);
          if (parsed && parsed.id && !nodesMap.has(parsed.id)) {
            nodesMap.set(parsed.id, parsed);
          }
        }
      }
    }

    return Array.from(nodesMap.values());
  }

  // 2. Load Domains, Features, Components, Enhancements
  const [domains, features, components, enhancements] = await Promise.all([
    loadCategoryNodes('domains', 'domains'),
    loadCategoryNodes('features', 'features'),
    loadCategoryNodes('components', 'components'),
    loadCategoryNodes('enhancements', 'enhancements')
  ]);

  // 3. Load global relationships
  const relPath = path.join(archDir, index.relationships || 'relationships.yaml');
  const rawRels = await parseYamlFile(relPath) || {};
  let relationships = rawRels.relationships || [];

  // Also collect local relationships defined inside feature nodes
  for (const feature of features) {
    if (Array.isArray(feature.relationships)) {
      relationships = [...relationships, ...feature.relationships];
    }
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
