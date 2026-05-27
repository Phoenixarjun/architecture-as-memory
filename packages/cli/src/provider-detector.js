import path from 'path';
import fs from 'fs-extra';
import os from 'os';

/**
 * Deterministically scans the target directory up to depth 3 for AI provider instruction files and directory markers.
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
          result[providerKey].push(path.resolve(filePath));
          return true;
        }
      }
    } catch {
      // Ignore errors
    }
    return false;
  };

  // 1. Check home directory Claude config (~/.claude/CLAUDE.md or ~/.claude/claude.md)
  try {
    const homeDir = os.homedir();
    if (homeDir) {
      const homeClaude1 = path.join(homeDir, '.claude', 'CLAUDE.md');
      const homeClaude2 = path.join(homeDir, '.claude', 'claude.md');
      await addIfFileExists(homeClaude1, 'claude');
      await addIfFileExists(homeClaude2, 'claude');
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

  // Helper to read file and run semantic heuristics to detect provider
  const getProviderFromContent = async (filePath) => {
    try {
      const content = await fs.readFile(filePath, 'utf8');
      const snippet = content.slice(0, 1500).toLowerCase();

      if (snippet.includes('claude code') || snippet.includes('claude-code') || snippet.includes('claudecode')) {
        return 'claude';
      }
      if (snippet.includes('cursor rules') || snippet.includes('cursorrules') || snippet.includes('cursor rule') || snippet.includes('.cursorrules')) {
        return 'cursor';
      }
      if (snippet.includes('gemini cli') || snippet.includes('gemini.md') || snippet.includes('gemini instructions')) {
        return 'gemini';
      }
      if (snippet.includes('github copilot') || snippet.includes('copilot-instructions') || snippet.includes('copilot instructions')) {
        return 'codex';
      }
    } catch {
      // Ignore read errors
    }
    return null;
  };

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
      const lowerName = entryName.toLowerCase();

      if (entry.isDirectory()) {
        if (IGNORED_DIRS.has(lowerName)) {
          continue;
        }

        // --- Directory Bounds Matching (.cursor/, .claude/, .gemini/, .opencode/) ---
        if (lowerName === '.cursor') {
          result.cursor.push(path.resolve(fullPath));
        } else if (lowerName === '.claude') {
          result.claude.push(path.resolve(fullPath));
        } else if (lowerName === '.gemini') {
          result.gemini.push(path.resolve(fullPath));
        } else if (lowerName === '.opencode') {
          result.generic.push(path.resolve(fullPath));
        }

        await scanDir(fullPath, depth + 1);
      } else if (entry.isFile()) {
        let matchedCategory = null;

        // --- Case-Insensitive Explicit Provider Matches ---
        if (
          lowerName === 'claude.md' || 
          relativePath.toLowerCase() === '.claude/claude.md' || 
          relativePath.toLowerCase() === '.claude/claude'
        ) {
          matchedCategory = 'claude';
        } else if (lowerName === '.cursorrules') {
          matchedCategory = 'cursor';
        } else if (lowerName.endsWith('.mdc') && relativePath.toLowerCase().includes('.cursor/rules/')) {
          matchedCategory = 'cursor';
        } else if (
          lowerName === 'gemini.md' || 
          relativePath.toLowerCase() === '.gemini/gemini.md' ||
          relativePath.toLowerCase() === '.gemini/gemini'
        ) {
          matchedCategory = 'gemini';
        } else if (
          relativePath.toLowerCase().includes('copilot-instructions') ||
          relativePath.toLowerCase().includes('copilot_instructions') ||
          lowerName.includes('copilot-instructions') ||
          lowerName.includes('copilot_instructions') ||
          lowerName.includes('copilot instructions')
        ) {
          matchedCategory = 'codex';
        } else if (
          lowerName === 'opencode.json' ||
          lowerName === 'opencode.yaml' ||
          lowerName === 'opencode.yml'
        ) {
          matchedCategory = 'generic';
        }
        
        // --- Fuzzy/Generic Filename Matches (including AGENT.md, AI_INSTRUCTIONS.md, etc.) ---
        else if (
          lowerName === 'agent.md' ||
          lowerName === 'agents.md' ||
          lowerName === 'ai_instructions.md' ||
          lowerName === 'ai-instructions.md' ||
          lowerName === 'instructions.md' ||
          lowerName === 'coder.md' ||
          lowerName === 'contributing.md'
        ) {
          // Check semantic content to identify provider if any, fallback to generic
          const semanticProvider = await getProviderFromContent(fullPath);
          matchedCategory = semanticProvider || 'generic';
        }

        // If a category was matched, assign resolved absolute path
        if (matchedCategory) {
          result[matchedCategory].push(path.resolve(fullPath));
        }
      }
    }
  }

  await scanDir(targetDir, 1);

  // Deduplicate files and clean absolute path arrays
  for (const key of Object.keys(result)) {
    result[key] = [...new Set(result[key])];
  }

  return result;
}
