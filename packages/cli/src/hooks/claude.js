import path from 'path';
import fs from 'fs-extra';
import chalk from 'chalk';

/**
 * Installs optional post-task hooks for Claude.
 * @param {string} targetDir - The project root directory.
 */
export async function installClaudeHook(targetDir = process.cwd()) {
  console.log(chalk.bold.cyan(`\nInstalling optional Claude post-task hooks in ${targetDir}...`));

  // 1. Mutate CLAUDE.md if it exists
  const claudeMdPath = path.join(targetDir, 'CLAUDE.md');
  const hasClaudeMd = await fs.pathExists(claudeMdPath);

  const markerStart = '<!-- AAM HOOK START -->';
  const markerEnd = '<!-- AAM HOOK END -->';
  
  const hookSnippet = `\n${markerStart}
## Post-Task Validation & Multi-Agent Governance Hook
After completing any implementation work:
- Sub-agents may analyze implementation details but must never mutate architecture cognition directly. Only the primary orchestration agent may write or update architecture YAML nodes.
- Run \`npx architecture-as-memory validate\` to check architectural integrity.
- Run \`npx architecture-as-memory doctor\` to audit cognition health.
- Remind the developer to review and commit AAM changes if cognitive drift or new files are detected.
${markerEnd}\n`;

  if (hasClaudeMd) {
    try {
      let content = await fs.readFile(claudeMdPath, 'utf8');
      if (content.includes(markerStart)) {
        console.log(chalk.yellow('  - Claude post-task hook already registered in CLAUDE.md.'));
      } else {
        content = content.trim() + '\n' + hookSnippet;
        await fs.writeFile(claudeMdPath, content, 'utf8');
        console.log(chalk.green('  ✓ Successfully registered post-task rules in CLAUDE.md.'));
      }
    } catch (err) {
      console.error(chalk.red(`  Failed to modify CLAUDE.md: ${err.message}`));
    }
  } else {
    console.log(chalk.yellow('  - CLAUDE.md not found in project root. Skipping instruction hook.'));
  }

  // 2. Install Git post-commit hook
  const gitDir = path.join(targetDir, '.git');
  const hasGit = await fs.pathExists(gitDir);

  if (hasGit) {
    const hooksDir = path.join(gitDir, 'hooks');
    await fs.ensureDir(hooksDir);
    
    const postCommitPath = path.join(hooksDir, 'post-commit');
    const hookScript = `#!/bin/sh
# AAM Post-Task Git Hook
echo "${chalk.bold.cyan('Running Architecture-As-Memory (AAM) validation...')}"
npx architecture-as-memory validate
npx architecture-as-memory doctor
`;

    try {
      await fs.writeFile(postCommitPath, hookScript, { encoding: 'utf8', mode: 0o755 });
      console.log(chalk.green('  ✓ Successfully installed Git post-commit validation hook.'));
    } catch (err) {
      console.error(chalk.red(`  Failed to write Git hook: ${err.message}`));
    }
  } else {
    console.log(chalk.yellow('  - Git repository not detected (.git/ missing). Skipping Git post-commit hook.'));
  }

  console.log(chalk.bold.green('\n🎉 Claude hook installation complete!'));
}
