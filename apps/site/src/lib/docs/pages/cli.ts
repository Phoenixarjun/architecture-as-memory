import { DocPage } from './core';

export const cliPages: DocPage[] = [
  {
    slug: 'cli',
    title: 'CLI Command Reference',
    description: 'Comprehensive guide to the AAM command-line operations, flags, dry-runs, and diagnostic tools.',
    blocks: [
      { type: 'h1', content: 'AAM Command-Line Interface' },
      { type: 'p', content: 'The AAM binary provides an extensive suite of commands to scaffolding, validate, analyze, and visualize your repository boundaries.' },
      {
        type: 'command',
        title: 'aam status',
        content: 'npx @architecture-as-memory/aam status',
        expectedOutput: `🩺 Running AAM Cognitive Heartbeat...
⏱ Local Telemetry: Hydrated 12 nodes and 9 relationships in 148ms.

System Cognition Status:
  ● Domains    : 3 active (Frontend, Backend, Infrastructure)
  ● Features   : 5 capabilities mapped
  ● Components : 8 system components verified
  ● Health     : 100% stable (0 syntax errors, 0 broken relationships)`
      },
      {
        type: 'command',
        title: 'aam validate',
        content: 'npx @architecture-as-memory/aam validate',
        expectedOutput: `🔍 Running Schema Integrity Validation...
  ✓ Checked system.yaml
  ✓ Checked relationships.yaml
  ✓ Checked 3 domains
  ✓ Checked 5 features
  ✓ Checked 8 components

🎉 Schema validation passed with 0 errors!`
      },
      {
        type: 'command',
        title: 'aam doctor',
        content: 'npx @architecture-as-memory/aam doctor',
        expectedOutput: `🩺 Running AAM Cognitive Doctor Engine...

Cognition Health Diagnostics (2 warnings to review):

MISSING KNOWLEDGE LINK:
  - architecture/components/auth-service.yaml: Node 'COMP-AUTH-SERVICE' has no knowledge_links specified.
  - architecture/domains/frontend.yaml: Node 'DOM-FRONTEND' has no knowledge_links specified.

⏱ Local Telemetry: Hydrated 5 nodes and 1 relationships in 247ms.`
      },
      {
        type: 'command',
        title: 'aam health',
        content: 'npx @architecture-as-memory/aam health',
        expectedOutput: `📊 Aggregating Core Repository Cognition Metrics...
  ✓ Schema Syntax Integrity : PASS (100%)
  ✓ Structural Connectivity  : PASS (89% - 1 relationship warnings)
  ✓ AI Scaffolding Sync     : PASS (3/3 files synced)
  ✓ Offline Topology Hash   : 6cf670695a69e7f3be8786f4f50cd8376c17b5dd

🎉 AAM Repository Health is EXCELLENT!`
      },
      {
        type: 'command',
        title: 'aam snapshot',
        content: 'npx @architecture-as-memory/aam snapshot',
        expectedOutput: `📸 Capturing current architecture schema state...
  ✓ Captured snapshot: .aam/snapshots/snapshot-1716834000.json
  ✓ Saved active index signature: 6cf670695a69e7`
      },
      {
        type: 'command',
        title: 'aam export',
        content: 'npx @architecture-as-memory/aam export -o architecture-map.html',
        expectedOutput: `📦 Exporting living architecture topology...
  ✓ Read current active graph state
  ✓ Bundled ReactFlow console frame assets
  ✓ Wrote standalone offline visualizer html: architecture-map.html

🎉 Static dashboard successfully created! Open in any browser.`
      }
    ]
  }
];
