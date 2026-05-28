import { DocPage } from './core';

export const advancedPages: DocPage[] = [
  {
    slug: 'yaml-schema',
    title: 'YAML Schema & Topology',
    description: 'Detailed schema specification of AAM declarative configuration models.',
    blocks: [
      { type: 'h1', content: 'Declarative YAML Schemas' },
      { type: 'p', content: 'AAM models architecture into four semantic layers using static, checked, local YAML nodes.' },
      { type: 'h2', content: '1. system.yaml' },
      { type: 'p', content: 'Declares global repository specifications, identity, ownership, and tech stack parameters.' },
      {
        type: 'schema',
        title: 'system.yaml Fields',
        fields: [
          { name: 'id', type: 'string', required: true, desc: 'Global system slug ID (e.g. SYS-ORCHESTRIX).' },
          { name: 'name', type: 'string', required: true, desc: 'Human-readable system title.' },
          { name: 'description', type: 'string', required: true, desc: 'Detailed explanation of the system purposes.' },
          { name: 'stack', type: 'string[]', required: false, desc: 'Tech stack tags.' }
        ]
      },
      {
        type: 'code',
        language: 'yaml',
        content: `id: SYS-ORCHESTRIX
name: Orchestrix Core Platform
description: LangGraph multi-agent orchestration service with NVIDIA embeddings.
stack:
  - nextjs
  - spring-boot
  - python-fastapi`
      },
      { type: 'h2', content: '2. domains/*.yaml' },
      { type: 'p', content: 'Establishes high-level business or technical boundaries (e.g. Backend, Frontend, Data Platform).' },
      {
        type: 'code',
        language: 'yaml',
        content: `id: DOM-BACKEND
name: Backend Platform
description: Core transactional APIs, microservices, and databases.
ownership: Backend-Team`
      },
      { type: 'h2', content: '3. features/*.yaml' },
      { type: 'p', content: 'Cross-cutting capabilities that capture real business value (e.g. Authentication, Ledger Services).' },
      {
        type: 'code',
        language: 'yaml',
        content: `id: FEAT-AUTHENTICATION
name: Secure Authentication
description: End-to-end OAuth2 and JWT credentials validation.
domains:
  - DOM-BACKEND
  - DOM-FRONTEND
components:
  - COMP-AUTH-SERVICE
  - COMP-API-GATEWAY`
      }
    ]
  },
  {
    slug: 'viewer',
    title: 'Interactive Viewer',
    description: 'Overview of the distraction-free graphite + ember visual architecture console.',
    blocks: [
      { type: 'h1', content: 'AAM Interactive Console' },
      { type: 'p', content: 'The visual viewer (`aam dev`) offers a stunning, calming developer dashboard to navigate complex systems in real-time.' },
      { type: 'h2', content: 'Core Visual Interface' },
      { type: 'p', content: 'Designed for long engineering sessions, AAM rejects resource-intensive glow or 3D animations in favor of strict, structural graphite layouts with restrained ember accents.' },
      {
        type: 'callout',
        title: 'State Preservation',
        content: 'Zoom coordinates, inspection panel sidebars, and expanded tree branches are fully preserved during real-time watcher updates, maintaining visual continuity under continuous code mutations.',
        accent: 'ember'
      }
    ]
  },
  {
    slug: 'ai-integrations',
    title: 'AI Agent Integrations',
    description: 'How to interface AAM with Claude Code, Cursor, Gemini CLI, and Codex.',
    blocks: [
      { type: 'h1', content: 'AI Assistant Orchestration & Reinforcement' },
      { type: 'p', content: 'AAM protects repositories against architectural erosion by implementing a multi-layered cognition reinforcement pipeline. Rather than force-feeding an LLM the entire codebase, AAM structures developer intent across four modular layers.' },
      { type: 'h2', content: 'The 4 Cognitive Reinforcement Layers' },
      
      { type: 'p', content: '**Layer 1: Persistent Target Detection (Idempotent Anchors)**' },
      { type: 'p', content: 'During AAM initialization (`aam init`), the scaffolder scans the root workspace up to a depth of 3 for active AI provider instructions. It safely appends a non-invasive, lightweight cognition marker referencing AAM into: `CLAUDE.md`, `.gemini/GEMINI.md`, `.cursorrules`, `.github/copilot-instructions.md`, and `AGENT.md` (as well as detecting `.claude/`, `.cursor/`, and `.gemini/` directories).' },
      {
        type: 'code',
        language: 'markdown',
        content: `<!-- AAM REINFORCEMENT START -->
## Architecture-As-Memory (AAM) Cognition Anchor
This repository uses AAM to persist architectural intent and prevent cognitive drift.
- Read /architecture/agents/aam-skill.md to align with active system topology.
- Maintain stable IDs (FNV-1a) and avoid global graph regeneration.
- Run \`aam validate\` / \`aam doctor\` after making changes to verify ontology.
- Already-running AI session? Reload cognition by manually reading the AAM skill file.
<!-- AAM REINFORCEMENT END -->`
      },

      { type: 'p', content: '**Layer 2: Slash Command Context Protocol (On-Demand Hydration)**' },
      { type: 'p', content: 'To keep context windows lightweight and cost-efficient, AAM supports selective context hydration. When prompting your assistant, use the slash command trigger followed by the target capability:' },
      {
        type: 'code',
        language: 'bash',
        content: `/aam FEAT-AUTHENTICATION Add password reset support via SMTP.`
      },
      { type: 'p', content: 'This immediately injects only the related YAML files (domains, features, and components) matching that specific capability, bypassing irrelevant code files and preventing cognitive overload.' },

      { type: 'p', content: '**Layer 3: Local-First Non-Destructive Hooks (Verify on Tasks)**' },
      { type: 'p', content: 'AAM registers Git post-commit hooks and post-task instruction hooks. For instance, running `aam hooks install claude` registers a post-task verification hook. Before any changes are committed or after an AI task completes, the engine runs `aam validate` and `aam doctor` in the background, rendering a clear visual warning report to the developer if a mutation breaks architectural boundaries.' },

      { type: 'p', content: '**Layer 4: CLI Success Reinforcement Alert (Live Session Recovery)**' },
      { type: 'p', content: 'Already running an active AI chat session when installing AAM? To reactivate architectural context instantly, the CLI outputs a concise 2-line recovery nudge encouraging the engineer to ask the running agent to read \`/architecture/agents/aam-skill.md\` manually. This forces the active LLM context window to instantly align with AAM schemas.' },
      
      { type: 'h2', content: 'Injecting Reinforcement Manually' },
      { type: 'p', content: 'You can manually inject the AAM cognition anchors at any time for specific platforms:' },
      {
        type: 'code',
        language: 'bash',
        content: `# Reinforce AAM rules for Claude Code and Claude Desktop
npx @architecture-as-memory/aam reinforce claude

# Reinforce rules for Gemini Workspace
npx @architecture-as-memory/aam reinforce gemini`
      }
    ]
  },
  {
    slug: 'governance',
    title: 'Multi-Agent Governance',
    description: 'Ontology consistency and graph validation rules for multi-agent software environments.',
    blocks: [
      { type: 'h1', content: 'Ontology Governance' },
      { type: 'p', content: 'In multi-agent environments (such as Claude sub-agents or nested workflows), graph stability is protected by a strict operational guideline:' },
      {
        type: 'warning',
        title: 'CRITICAL GOVERNANCE RULE',
        content: 'ONLY the primary orchestration agent may edit or mutate the AAM architectural YAML node definitions directly. Sub-agents may scan implementation details but must never rewrite files.',
        accent: 'critical'
      }
    ]
  },
  {
    slug: 'examples',
    title: 'Examples & Blueprints',
    description: 'Production-ready cognition graphs, BEFORE vs AFTER comparisons, and real AI agent failure cases.',
    blocks: [
      { type: 'h1', content: 'Production Case Studies & Blueprints' },
      { type: 'p', content: 'Explore how Architecture-as-Memory (AAM) translates abstract cognitive boundaries into operational repository layouts. We look at direct BEFORE vs AFTER comparisons, real agent failure logs, and standard microservice blueprints.' },
      
      { type: 'h2', content: '1. BEFORE vs. AFTER (Cognitive Structuring)' },
      { type: 'p', content: 'Consider a typical high-velocity authorization service modified repeatedly by multiple developers and AI assistants:' },
      {
        type: 'code',
        title: 'Without AAM: File-First Flat Chaos',
        language: 'text',
        content: `auth-service/
├── auth-service-v2/
├── auth-helper-final/
├── auth-helper-final-fixed/
├── auth-token-utils/
└── auth-token-utils-new/`
      },
      { type: 'p', content: 'Developer thought: *"Why do we have four authentication structures? Which one is the active system?"* The AI agent, having no index, simply duplicates whichever folder is nearest to its current working directory.' },
      
      { type: 'p', content: 'Here is the exact same system structured under the AAM capabilities contract:' },
      {
        type: 'code',
        title: 'With AAM: Declarative Boundary Anchor',
        language: 'yaml',
        content: `feature:
  id: FEAT-AUTHENTICATION
  purpose: Unified customer authentication boundary
  domains:
    - DOM-GATEWAY
  components:
    - COMP-AUTH-SERVICE
    - COMP-TOKEN-GENERATOR`
      },
      { type: 'p', content: 'By establishing a stable, checked YAML contract, the architecture gains an immutable identity. AI sub-agents instantly query `FEAT-AUTHENTICATION` to fetch context, preventing flat directory duplication.' },

      { type: 'h2', content: '2. Real-World AI Agent Failure Logs' },
      { type: 'p', content: 'In high-velocity repos without structured boundaries, context collapse occurs quietly. Here is an authentic failure path recorded in an unanchored payments repository:' },
      {
        type: 'warning',
        title: 'Context Collapse & Helper Proliferation Log',
        content: 'Claude generated three distinct systems to solve a single payments retry task: PaymentRetryManager (backend API), RetryPaymentManager (helper script), and PaymentRecoveryService (checkout domain). Because no schema bound them to a shared domain contract, the duplications went unnoticed for 3 days until circular memory leaks brought down the payment gateway.',
        accent: 'critical'
      },

      { type: 'h2', content: '3. E-Commerce Platform Blueprint' },
      { type: 'p', content: 'A complete, production-ready hierarchy modeling a standard microservices e-commerce application using the System → Domains → Features → Components mapping:' },
      {
        type: 'code',
        title: 'system.yaml',
        language: 'yaml',
        content: `id: SYS-ECOMMERCE
name: E-Commerce Retail Core
description: Cloud-native retail platform with distributed inventory.
stack:
  - nextjs
  - spring-boot
  - postgresql`
      },
      {
        type: 'code',
        title: 'domains/checkout.yaml',
        language: 'yaml',
        content: `id: DOM-CHECKOUT
name: Transactional Checkout Domain
description: Manages active billing pipelines, cart calculations, and shipping.
ownership: checkout-platform-team`
      },
      {
        type: 'code',
        title: 'features/cart-management.yaml',
        language: 'yaml',
        content: `id: FEAT-CART-MANAGEMENT
name: Persistent Cart Management
purpose: Real-time calculation and session locking of shopper items.
domains:
  - DOM-CHECKOUT
components:
  - COMP-REDIS-CART-CACHE
  - COMP-CART-API-SERVICE`
      }
    ]
  },
  {
    slug: 'roadmap',
    title: 'Product Roadmap',
    description: 'Upcoming features, integrations, and enhancements for AAM.',
    blocks: [
      { type: 'h1', content: 'Product Roadmap' },
      { type: 'p', content: 'Upcoming features and evolutionary stages for the AAM platform:' },
      {
        type: 'callout',
        title: 'Q3 2026: IDE Extensions',
        content: 'Native VSCode and JetBrains sidebar panels displaying living topology graphs side-by-side with active files.',
        accent: 'graphite'
      }
    ]
  }
];
