/**
 * Provider Capability Matrix
 * Configures capabilities supported by each AI provider dynamically,
 * allowing AAM CLI and integrations to gracefully degrade.
 */
export const ProviderCapabilityMatrix = {
  claude: {
    name: 'Claude Code / Claude Desktop',
    instructionFiles: true,
    hooks: true,
    slashCommands: true,
    primaryInstructionFile: 'CLAUDE.md'
  },
  cursor: {
    name: 'Cursor Editor',
    instructionFiles: true,
    hooks: false,
    slashCommands: true, // partial via .cursorrules
    primaryInstructionFile: '.cursorrules'
  },
  gemini: {
    name: 'Gemini CLI / Workspace',
    instructionFiles: true,
    hooks: false,
    slashCommands: true,
    primaryInstructionFile: '.gemini/GEMINI.md'
  },
  codex: {
    name: 'Codex / GitHub Copilot Chat',
    instructionFiles: true,
    hooks: false,
    slashCommands: true, // partial via .github/copilot-instructions.md
    primaryInstructionFile: '.github/copilot-instructions.md'
  },
  generic: {
    name: 'Generic AI Assistant',
    instructionFiles: true,
    hooks: false,
    slashCommands: true,
    primaryInstructionFile: 'AGENT.md'
  }
};

/**
 * Returns capabilities for a given provider key.
 * @param {string} providerKey 
 * @returns {object}
 */
export function getProviderCapabilities(providerKey) {
  const normalizedKey = String(providerKey).toLowerCase();
  return ProviderCapabilityMatrix[normalizedKey] || ProviderCapabilityMatrix.generic;
}
