import { DocPage } from './core';

export const extraPages: DocPage[] = [
  {
    slug: 'why-aam-exists',
    title: 'Why AAM Exists',
    description: 'The engineering breakdown and origin story that forced the design of persistent architectural memory.',
    blocks: [
      { type: 'h1', content: 'Why AAM Exists: Origin Analysis' },
      { type: 'p', content: 'In early 2026, the velocity of software development changed forever. Autonomous AI coding agents like Claude Code, Cursor, and Gemini CLI unlocked the ability to generate entire microservices, run tests, and refactor interfaces in single-turn loops. Initially, it felt magical. We were shipping software faster than ever.' },
      
      { type: 'h2', content: 'The Initial Excitement' },
      { type: 'p', content: 'For the first 14 days of building high-velocity projects, the leverage was unbelievable. Features that previously took weeks were generated in minutes. The developer felt like an orchestrator, simply passing technical prompts and approving terminal commits.' },

      {
        type: 'callout',
        title: 'The Invisible Tipping Point',
        content: 'Around week three, something shifted. The repository grew from 5,000 LOC to 45,000 LOC. Code changes started taking longer. The AI began hallucinating boundaries, generating duplicate utilities, and breaking legacy endpoints. The human developer stopped understanding the system.',
        accent: 'ember'
      },

      { type: 'h2', content: 'The Hidden Cost of AI Velocity' },
      { type: 'p', content: 'We realized a terrifying reality of high-frequency AI code mutation: **Claude could explain my system better than I could.**' },
      { type: 'p', content: 'Because the AI had consumed the context of every single file in the workspace, it held the structural memory. But when the context window saturated, or when the agent initialized a fresh session, that memory evaporated. The architecture began to fragment silently, leaving the team with a system they could neither reason about nor control.' },

      { type: 'h2', content: 'The Moment of Failure' },
      { type: 'p', content: 'The tipping point was a silent architectural collapse in a multi-agent billing system. Within 72 hours, three separate autonomous agent runs had generated:' },
      { type: 'warning', title: 'PaymentRetryManager', content: 'A custom retry handler injected in the backend microservice.', accent: 'graphite' },
      { type: 'warning', title: 'RetryPaymentManager', content: 'A duplicate, separate retry logic written inside a helper folder.', accent: 'graphite' },
      { type: 'warning', title: 'PaymentRecoveryService', content: 'A third recovery flow created in the payments domain.', accent: 'critical' },
      { type: 'p', content: 'All three services solved the exact same recovery logic. None of them shared states or interfaces. Because they were written in different directories under flat AST names, no one noticed for three days until circular memory loops crashed the production gateway. Flat structures and file-first tooling had collapsed human comprehension.' },

      { type: 'h2', content: 'Why Existing Tools Failed' },
      { type: 'p', content: 'Traditional developer visualizers and directory maps failed completely in this new ecosystem:' },
      {
        type: 'schema',
        title: 'Tooling Failure Analysis',
        fields: [
          { name: 'AST Import Graphs', type: 'Unusable', required: true, desc: 'Visualizers scanned every single import statement, rendering unreadable spaghetti lines of 2,000 code nodes.' },
          { name: 'Written Markdown', type: 'Stale', required: true, desc: 'Long-form wikis and README documents drifted out of sync the minute the AI executed a single structural patch.' },
          { name: 'Repository Maps', type: 'Too Low-Level', required: true, desc: 'Flat text directories presented raw file indices to LLMs without representing the core business boundaries or architectural intent.' }
        ]
      },

      { type: 'h2', content: 'The Core Insight' },
      { type: 'p', content: 'Humans and high-level agents do not reason about systems in terms of **folders, imports, or raw AST files**. We reason in terms of **capabilities, boundaries, and responsibilities**.' },
      { type: 'p', content: 'AAM was designed to bridge this cognitive gap. By providing a local, declarative representation of system capabilities that both humans and AI models consume, we anchor architectural intent permanently—ensuring structural integrity remains intact no matter how fast the code mutates.' }
    ]
  },
  {
    slug: 'when-to-use',
    title: 'When to Use AAM',
    description: 'A transparent, credibility-first assessment of when AAM is a game-changer versus when it is unnecessary.',
    blocks: [
      { type: 'h1', content: 'When Should You Adopt AAM?' },
      { type: 'p', content: 'AAM is not a generic silver bullet for every software project. To build genuine engineering trust, we clearly define when our cognitive scaffolding is essential, and when it is complete overkill.' },
      
      { type: 'h2', content: 'AAM is Highly Valuable When:' },
      {
        type: 'callout',
        title: '1. High-Frequency AI Code Mutation',
        content: 'Your repository is actively modified by autonomous CLI assistants (e.g. Claude Code, Cursor Composer, Gemini) that generate more than 1,000 LOC per day.',
        accent: 'ember'
      },
      {
        type: 'callout',
        title: '2. Multi-Domain Architecture',
        content: 'Your project features multiple logical domains (e.g. frontend, billing, ingestion) that must maintain strict architectural separation to prevent spaghetti coupling.',
        accent: 'graphite'
      },
      {
        type: 'callout',
        title: '3. Long-Running Collaborative Projects',
        content: 'Multiple developers and agents are editing the same codebase over months. Preserving the original architectural intent is critical to prevent gradual context rot.',
        accent: 'ember'
      },

      { type: 'h2', content: 'AAM is Probably Unnecessary For:' },
      { type: 'warning', title: 'Tiny Prototypes & Demos', content: 'If your repository is under 3,000 LOC, or represents a single-file script or weekend hackathon experiment, setting up AAM governance adds unnecessary friction.', accent: 'graphite' },
      { type: 'warning', title: 'Static, Slow-Moving Legacy Apps', content: 'If your system is fully mature, changes less than once a month, and is maintained solely by a single developer without AI assistance, you do not suffer from cognitive drift.', accent: 'graphite' }
    ]
  },
  {
    slug: 'anti-patterns',
    title: 'Architecture Anti-Patterns',
    description: 'Real-world visual failure patterns observed in high-velocity AI repositories.',
    blocks: [
      { type: 'h1', content: 'High-Velocity AI Anti-Patterns' },
      { type: 'p', content: 'When autonomous code-generation loops operate without a centralized cognition model, repositories rapidly decay into standard failure patterns. Here is how to diagnose them:' },
      
      { type: 'h2', content: '1. Helper Explosion (Flat File Proliferation)' },
      { type: 'p', content: 'Because AI agents search context windows for utility files and often fail to find them in deep hierarchies, they choose the path of least resistance: generating a fresh helper script in the immediate directory.' },
      {
        type: 'code',
        title: 'Typical Helper Proliferation',
        language: 'text',
        content: `auth-service/
├── auth-helper-final.js
├── auth-helper-final-fixed.js
├── auth-token-utils.js
└── auth-token-utils-new.js`
      },
      { type: 'p', content: 'Under AAM, features must map to a single immutable boundary ID (`FEAT-AUTHENTICATION`), ensuring any utility generated is contextually anchored to the feature contract rather than flat directories.' },

      { type: 'h2', content: '2. Context Collapse' },
      { type: 'p', content: 'When a developer prompts an AI assistant with a broad instruction (*"Add email logging"*), the agent lacks an architectural map. It silently couples the ingestion pipeline directly to the SMTP transport layer, bypassing domain isolation.' },
      {
        type: 'warning',
        title: 'The Result of Context Collapse',
        content: 'A spaghetti boundary where a simple helper change triggers massive downstream test failures across unrelated systems because dependencies were tightly coupled behind the scenes.',
        accent: 'critical'
      },

      { type: 'h2', content: '3. Repo Map Overload' },
      { type: 'p', content: 'Providing LLMs with flat list trees of 400 source files leads to context dilution. The model spends tokens reading import paths and file names instead of high-level business logic relationships, resulting in slower, lower-quality code generations.' }
    ]
  }
];
