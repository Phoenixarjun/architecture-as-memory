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

  // Helper to read file and run semantic heuristics to detect provider
  const getProviderFromContent = async (filePath) => {
    try {
      const content = await fs.readFile(filePath, 'utf8');
      const snippet = content.slice(0, 1500).toLowerCase();

      if (snippet.includes('claude code') || snippet.includes('claude-code')) {
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

      if (entry.isDirectory()) {
        if (IGNORED_DIRS.has(entryName.toLowerCase())) {
          continue;
        }
        await scanDir(fullPath, depth + 1);
      } else if (entry.isFile()) {
        const lowerName = entryName.toLowerCase();
        
        // Match rules by filename and case-normalized matching
        let matchedCategory = null;

        // --- Explicit Provider Matches (Filenames) ---
        if (lowerName === 'claude.md' && (depth === 1 || relativePath === '.claude/claude.md' || relativePath === '.claude/CLAUDE.md')) {
          matchedCategory = 'claude';
        } else if (lowerName === '.cursorrules' && depth === 1) {
          matchedCategory = 'cursor';
        } else if (lowerName.endsWith('.mdc') && relativePath.startsWith('.cursor/rules/')) {
          matchedCategory = 'cursor';
        } else if (lowerName === 'gemini.md' && (depth === 1 || relativePath === '.gemini/gemini.md' || relativePath === '.gemini/GEMINI.md')) {
          matchedCategory = 'gemini';
        } else if (relativePath === '.github/copilot-instructions.md' || lowerName === 'copilot-instructions.md') {
          matchedCategory = 'codex';
        } 
        
        // --- Fuzzy/Generic Filename Matches ---
        else if (
          (lowerName === 'agent.md' ||
           lowerName === 'agents.md' ||
           lowerName === 'ai_instructions.md' ||
           lowerName === 'ai-instructions.md' ||
           lowerName === 'instructions.md' ||
           lowerName === 'coder.md' ||
           lowerName === 'contributing.md') &&
          depth === 1
        ) {
          // Check semantic content to identify provider if any, fallback to generic
          const semanticProvider = await getProviderFromContent(fullPath);
          matchedCategory = semanticProvider || 'generic';
        }

        // If a category was matched, assign it!
        if (matchedCategory) {
          result[matchedCategory].push(fullPath);
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
