import path from 'path';
import fs from 'fs-extra';
import chalk from 'chalk';

const PROVIDER_FILES = {
  claude: 'CLAUDE.md',
  gemini: '.gemini/GEMINI.md',
  codex: '.github/copilot-instructions.md',
  cursor: '.cursorrules',
  generic: 'AGENT.md'
};

const PROVIDER_NAMES = {
  claude: 'Claude Code / Claude Desktop',
  gemini: 'Gemini CLI / Workspace',
  codex: 'Codex / GitHub Copilot Chat',
  cursor: 'Cursor Editor',
  generic: 'Generic AI Assistant'
};

/**
 * Reinforces AAM architectural cognition for a specific AI provider.
 * @param {string} provider - The target provider (claude, gemini, codex, cursor, generic).
 * @param {string} targetDir - The project root directory.
 */
export async function reinforceProvider(provider, targetDir = process.cwd()) {
  const normalizedProvider = String(provider).toLowerCase();
  
  // Handle aliases
  let targetKey = normalizedProvider;
  if (normalizedProvider === 'copilot') {
    targetKey = 'codex';
  } else if (!PROVIDER_FILES[normalizedProvider]) {
    targetKey = 'generic';
  }

  const fileName = PROVIDER_FILES[targetKey];
  const providerName = PROVIDER_NAMES[targetKey];
  const filePath = path.join(targetDir, fileName);

  console.log(chalk.bold.cyan(`\nReinforcing AAM cognition context for ${chalk.green(providerName)}...`));

  const markerStart = '<!-- AAM REINFORCEMENT START -->';
  const markerEnd = '<!-- AAM REINFORCEMENT END -->';

  const reinforcementSnippet = `\n${markerStart}
## Architecture-As-Memory (AAM) Cognition Anchor
This repository uses AAM to persist architectural intent and prevent cognitive drift.
- Read /architecture/agents/aam-skill.md to align with active system topology.
- Maintain stable IDs (FNV-1a) and avoid global graph regeneration.
- Run \`aam validate\` / \`aam doctor\` after making changes to verify ontology.
- Already-running AI session? Reload cognition by manually reading the AAM skill file.
${markerEnd}\n`;

  try {
    // Ensure parent directory exists
    await fs.ensureDir(path.dirname(filePath));

    let content = '';
    const exists = await fs.pathExists(filePath);
    
    if (exists) {
      const stat = await fs.stat(filePath);
      if (stat.isFile()) {
        content = await fs.readFile(filePath, 'utf8');
      }
    }

    if (content.includes(markerStart)) {
      console.log(chalk.yellow(`  - Reinforcement already active in: ${fileName}`));
    } else {
      content = content.trim() + '\n' + reinforcementSnippet;
      await fs.writeFile(filePath, content, 'utf8');
      console.log(chalk.green(`  ✓ Successfully reinforced AAM reference in ${fileName}`));
    }
    
    console.log(chalk.bold.green('🎉 Reinforcement completed!'));
    console.log(chalk.white('To reactivate context in an already-running AI session, ask the AI:'));
    console.log(chalk.bold.cyan('  "Please read the AAM skill file /architecture/agents/aam-skill.md"\n'));
  } catch (err) {
    console.error(chalk.red(`  Failed to apply reinforcement: ${err.message}`));
    throw err;
  }
}
