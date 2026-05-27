import path from 'path';
import fs from 'fs-extra';
import os from 'os';

/**
 * Deterministically scans the target directory up to depth 3 for AI provider instruction files.
 * @param {string} targetDir - The project root directory to scan.
 * @returns {Promise<Object>} The detection result mapping provider names to lists of detected file paths.
 */
export async function detectProviders(targetDir = process.cwd()) {
  const result = {
    claude: [],
    cursor: [],
    codex: [],
    gemini: [],
    generic: []
  };

  // Helper to safely check and add file
  const addIfFileExists = async (filePath, providerKey) => {
    try {
      if (await fs.pathExists(filePath)) {
        const stat = await fs.stat(filePath);
        if (stat.isFile()) {
          result[providerKey].push(filePath);
          return true;
        }
      }
    } catch {
      // Ignore errors
    }
    return false;
  };

  // 1. Check home directory Claude config (~/.claude/CLAUDE.md)
  try {
    const homeDir = os.homedir();
    if (homeDir) {
      const homeClaude = path.join(homeDir, '.claude', 'CLAUDE.md');
      await addIfFileExists(homeClaude, 'claude');
    }
  } catch {
    // Ignore home dir resolution errors
  }

  // Define ignored directories to avoid traversing heavy / build folders
  const IGNORED_DIRS = new Set([
    'node_modules',
    '.git',
    'dist',
    'build',
    'out',
    '.next',
    '.nuxt',
    'coverage',
    'tmp',
    'temp'
  ]);

  // 2. Recursive scan up to depth 3
  async function scanDir(currentDir, depth) {
    if (depth > 3) return;

    let entries = [];
    try {
      entries = await fs.readdir(currentDir, { withFileTypes: true });
    } catch {
      return; // Ignore read errors
    }

    for (const entry of entries) {
      const entryName = entry.name;
      const fullPath = path.join(currentDir, entryName);
      const relativePath = path.relative(targetDir, fullPath).replace(/\\/g, '/');

      if (entry.isDirectory()) {
        if (IGNORED_DIRS.has(entryName.toLowerCase())) {
          continue;
        }
        await scanDir(fullPath, depth + 1);
      } else if (entry.isFile()) {
        const lowerName = entryName.toLowerCase();
        
        // --- Claude Checks ---
        if (entryName === 'CLAUDE.md' && (depth === 1 || relativePath === '.claude/CLAUDE.md')) {
          result.claude.push(fullPath);
        }
        
        // --- Cursor Checks ---
        else if (entryName === '.cursorrules' && depth === 1) {
          result.cursor.push(fullPath);
        } else if (lowerName.endsWith('.mdc') && relativePath.startsWith('.cursor/rules/')) {
          result.cursor.push(fullPath);
        }

        // --- Codex / OpenAI Checks ---
        else if (entryName === 'AGENTS.md' && depth === 1) {
          result.codex.push(fullPath);
        } else if (relativePath === '.github/copilot-instructions.md') {
          result.codex.push(fullPath);
        }

        // --- Gemini Checks ---
        else if (relativePath === '.gemini/GEMINI.md' || (entryName === 'GEMINI.md' && depth === 1)) {
          result.gemini.push(fullPath);
        }

        // --- Generic Checks ---
        else if (entryName === 'AI-INSTRUCTIONS.md' && depth === 1) {
          result.generic.push(fullPath);
        } else if (entryName === 'instructions.md' && depth === 1) {
          result.generic.push(fullPath);
        } else if (entryName === 'CODER.md' && depth === 1) {
          result.generic.push(fullPath);
        } else if (entryName === 'CONTRIBUTING.md' && depth === 1) {
          result.generic.push(fullPath);
        }
      }
    }
  }

  await scanDir(targetDir, 1);

  // Deduplicate files to avoid duplicate entries due to symbolic links or double checks
  for (const key of Object.keys(result)) {
    result[key] = [...new Set(result[key])];
  }

  return result;
}
