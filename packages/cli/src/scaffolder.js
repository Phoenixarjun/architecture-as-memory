import path from 'path';
import fs from 'fs-extra';
import chalk from 'chalk';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper to resolve template directory relative to this module
const getTemplateDir = () => {
  return path.resolve(__dirname, '../templates');
};

/**
 * Initializes the /architecture structure and updates AI instruction files.
 * @param {string} targetDir - The project root directory where AAM is initialized.
 */
export async function bootstrap(targetDir = process.cwd()) {
  const archDir = path.join(targetDir, 'architecture');
  const templateDir = getTemplateDir();

  console.log(chalk.cyan(`\nInitializing Architecture-As-Memory (AAM) in ${targetDir}...`));

  // 1. Create directory structure
  const subDirs = ['domains', 'features', 'components', 'enhancements', 'agents'];
  for (const dir of subDirs) {
    await fs.ensureDir(path.join(archDir, dir));
  }

  // 2. Safe-copy default schemas and AI instruction file
  const copyMappings = [
    { src: 'schemas/architecture.index.yaml', dest: 'architecture.index.yaml' },
    { src: 'schemas/system.yaml', dest: 'system.yaml' },
    { src: 'schemas/relationships.yaml', dest: 'relationships.yaml' },
    { src: 'schemas/domains/user-platform.yaml', dest: 'domains/user-platform.yaml' },
    { src: 'schemas/domains/core-banking.yaml', dest: 'domains/core-banking.yaml' },
    { src: 'schemas/features/auth-secure.yaml', dest: 'features/auth-secure.yaml' },
    { src: 'schemas/features/core-ledger.yaml', dest: 'features/core-ledger.yaml' },
    { src: 'schemas/features/wealth-advisor.yaml', dest: 'features/wealth-advisor.yaml' },
    { src: 'schemas/components/gateway-service.yaml', dest: 'components/gateway-service.yaml' },
    { src: 'schemas/components/auth-provider.yaml', dest: 'components/auth-provider.yaml' },
    { src: 'schemas/components/user-registry.yaml', dest: 'components/user-registry.yaml' },
    { src: 'schemas/components/ledger-core.yaml', dest: 'components/ledger-core.yaml' },
    { src: 'schemas/components/clearing-house.yaml', dest: 'components/clearing-house.yaml' },
    { src: 'schemas/components/visa-connector.yaml', dest: 'components/visa-connector.yaml' },
    { src: 'schemas/components/crypto-wallet.yaml', dest: 'components/crypto-wallet.yaml' },
    { src: 'schemas/components/fraud-detector.yaml', dest: 'components/fraud-detector.yaml' },
    { src: 'schemas/components/audit-logger.yaml', dest: 'components/audit-logger.yaml' },
    { src: 'schemas/components/robo-solver.yaml', dest: 'components/robo-solver.yaml' },
    { src: 'AI_INSTRUCTIONS.md', dest: 'agents/AI_INSTRUCTIONS.md' },
    { src: 'aam-skill.md', dest: 'agents/aam-skill.md' }
  ];

  for (const mapping of copyMappings) {
    const srcPath = path.join(templateDir, mapping.src);
    const destPath = path.join(archDir, mapping.dest);

    if (!(await fs.pathExists(destPath))) {
      await fs.copy(srcPath, destPath);
      console.log(chalk.green(`  ✓ Created: architecture/${mapping.dest}`));
    } else {
      console.log(chalk.yellow(`  - Exists (Skipped): architecture/${mapping.dest}`));
    }
  }

  // 3. Inject lightweight bootstrap reference to AI instruction systems
  const aiInstructionFiles = [
    'CLAUDE.md',
    '.cursorrules',
    'AGENT.md',
    '.gemini/GEMINI.md',
    'AI-INSTRUCTIONS.md'
  ];

  const markerStart = '\n<!-- AAM-MARKER-START -->';
  const markerEnd = '<!-- AAM-MARKER-END -->\n';
  const aamSnippet = `${markerStart}
## Architecture As Memory (AAM)
This repository uses Architecture-As-Memory (AAM) to preserve developer and AI agent orientation.
- Before implementing features, read '/architecture/architecture.index.yaml' to understand current capability mappings.
- After completing work, you MUST incrementally update '/architecture' YAML configurations (features, components, etc.).
- Refer to and execute the core operational skill manual inside '/architecture/agents/aam-skill.md' to preserve cognitive consistency.
${markerEnd}`;

  console.log(chalk.cyan('\nScanning for existing AI instruction hooks...'));

  for (const filename of aiInstructionFiles) {
    const filePath = path.join(targetDir, filename);
    
    // Ensure parent directories exist (like .gemini/)
    if (filename.includes('/')) {
      const parentDir = path.dirname(filePath);
      if (!(await fs.pathExists(parentDir))) {
        continue; // Don't create folders like .gemini just to dump instructions unless it exists
      }
    }

    if (await fs.pathExists(filePath)) {
      let content = await fs.readFile(filePath, 'utf8');
      
      if (content.includes('AAM-MARKER-START')) {
        console.log(chalk.yellow(`  - Hook already present in: ${filename}`));
      } else {
        content = content.trim() + '\n' + aamSnippet;
        await fs.writeFile(filePath, content, 'utf8');
        console.log(chalk.green(`  ✓ Appended AAM instruction reference to: ${filename}`));
      }
    }
  }

  console.log(chalk.bold.green('\n🎉 Architecture-As-Memory successfully initialized!'));
  console.log(chalk.white('You can now run "aam dev" to start the local visual viewer.'));
}
