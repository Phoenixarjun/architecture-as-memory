import path from 'path';
import fs from 'fs-extra';
import chalk from 'chalk';
import os from 'os';
import { fileURLToPath } from 'url';
import { detectProviders } from './provider-detector.js';
import { getProviderCapabilities } from './provider-capability-matrix.js';


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

  console.log(chalk.bold.cyan(`\nInitializing Architecture-As-Memory (AAM) in ${targetDir}...`));

  // 1. Create directory structure
  const subDirs = ['domains', 'features', 'components', 'enhancements', 'agents'];
  for (const dir of subDirs) {
    await fs.ensureDir(path.join(archDir, dir));
  }

  // 2. Safe-copy default minimal schemas and AI instruction file
  const copyMappings = [
    { src: 'schemas/architecture.index.yaml', dest: 'architecture.index.yaml' },
    { src: 'schemas/system.yaml', dest: 'system.yaml' },
    { src: 'schemas/relationships.yaml', dest: 'relationships.yaml' },
    { src: 'schemas/domains/frontend.yaml', dest: 'domains/frontend.yaml' },
    { src: 'schemas/domains/backend.yaml', dest: 'domains/backend.yaml' },
    { src: 'schemas/features/authentication.yaml', dest: 'features/authentication.yaml' },
    { src: 'schemas/components/login.yaml', dest: 'components/login.yaml' },
    { src: 'schemas/components/auth-service.yaml', dest: 'components/auth-service.yaml' },
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

  // Also verify /architecture/agents/slash-commands.md is copied/created if we have it in templates or create it programmatically
  const slashCommandsDest = path.join(archDir, 'agents/slash-commands.md');
  const slashCommandsSrc = path.join(templateDir, 'agents/slash-commands.md');
  
  if (await fs.pathExists(slashCommandsSrc)) {
    if (!(await fs.pathExists(slashCommandsDest))) {
      await fs.copy(slashCommandsSrc, slashCommandsDest);
      console.log(chalk.green('  ✓ Created: architecture/agents/slash-commands.md'));
    }
  } else {
    // If not in template dir yet, we'll create it later in Task 8, or now. Let's make sure we copy or create it.
  }

  // 3. Provider detection
  console.log(chalk.bold.cyan('\n🔍 Running AI Provider Detection Engine...'));
  const detected = await detectProviders(targetDir);

  // Output detection summary in terminal
  let totalDetected = 0;
  const categories = Object.keys(detected);
  
  for (const provider of categories) {
    const files = detected[provider];
    if (files.length > 0) {
      const caps = getProviderCapabilities(provider);
      console.log(chalk.white(`  Found compatible files for ${chalk.bold.green(caps.name)}:`));
      for (const file of files) {
        const displayPath = path.relative(targetDir, file).replace(/\\/g, '/');
        const globalTip = file.includes('.claude') && !file.startsWith(targetDir) ? ' (Global config, document support only)' : '';
        console.log(chalk.gray(`    - ${displayPath}${globalTip}`));
      }
      console.log(chalk.gray(`    💡 Capabilities: Instruction Files [${caps.instructionFiles ? 'Yes' : 'No'}], Hooks [${caps.hooks ? 'Yes' : 'No'}], Slash Commands [${caps.slashCommands ? 'Yes' : 'No'}]`));
      totalDetected += files.length;
    }
  }

  if (totalDetected === 0) {
    console.log(chalk.yellow('  No existing AI instruction files detected in the project root.'));
  }

  // 4. Safe marker-based injection
  const markerStart = '<!-- AAM START -->';
  const markerEnd = '<!-- AAM END -->';
  
  const aamSnippet = `\n${markerStart}

This repository uses Architecture-as-Memory (AAM).

Before implementing:
- Read /architecture/architecture.index.yaml
- Read affected feature and domain YAML files
- Maintain architectural cognition incrementally

After implementation:
- Update only affected architecture nodes
- Append relationships instead of regenerating globally
- Preserve stable IDs

Detailed operational rules:
- /architecture/agents/aam-skill.md

${markerEnd}\n`;

  console.log(chalk.bold.cyan('\n💉 Injecting lightweight bootstrap references...'));

  const homeDir = os.homedir();

  // Inject into all detected files (except home dir / global files)
  for (const provider of categories) {
    const files = detected[provider];
    for (const filePath of files) {
      // Check if it's a global file (outside project root)
      if (!filePath.startsWith(targetDir)) {
        continue;
      }

      try {
        let content = await fs.readFile(filePath, 'utf8');

        // Check for old AAM markers and remove them first to clean up
        const oldMarkerRegex = /\n*<!-- AAM-MARKER-START -->[\s\S]*?<!-- AAM-MARKER-END -->\n*/g;
        if (oldMarkerRegex.test(content)) {
          content = content.replace(oldMarkerRegex, '\n');
        }

        // Idempotency: check if new markers are already there
        if (content.includes(markerStart)) {
          console.log(chalk.yellow(`  - Reference already exists in: ${path.relative(targetDir, filePath)}`));
        } else {
          // Append AAM snippet at the end of the file safely
          content = content.trim() + '\n' + aamSnippet;
          await fs.writeFile(filePath, content, 'utf8');
          console.log(chalk.green(`  ✓ Injected AAM reference to: ${path.relative(targetDir, filePath)}`));
        }
      } catch (err) {
        console.error(chalk.red(`  Failed to inject into ${filePath}: ${err.message}`));
      }
    }
  }

  console.log(chalk.bold.green('\n🎉 Architecture-As-Memory successfully initialized!'));
  console.log(chalk.white('You can now run "aam dev" to start the local visual viewer.'));
}
