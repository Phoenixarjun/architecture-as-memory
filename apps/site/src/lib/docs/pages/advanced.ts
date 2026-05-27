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
      { type: 'h1', content: 'AI Assistant Orchestration' },
      { type: 'p', content: 'AAM aligns with your AI developer tools by injectively binding lightweight bootstrap references directly into active rule files.' },
      { type: 'h2', content: 'How it works' },
      { type: 'p', content: 'During `aam init`, the engine scans up to depth 3 for instruction targets like `CLAUDE.md`, `.cursorrules`, or `AGENT.md`. It appends a clean, marker-guarded prompt directing the assistant to respect architectural YAML boundaries.' },
      {
        type: 'code',
        language: 'markdown',
        content: `<!-- AAM START -->
This repository uses Architecture-as-Memory (AAM).
Before implementing features:
  - Read /architecture/architecture.index.yaml
  - Respect defined component boundaries.
<!-- AAM END -->`
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
    description: 'Production-ready cognition graphs and architecture YAML models.',
    blocks: [
      { type: 'h1', content: 'Production Blueprints' },
      { type: 'p', content: 'Explore pre-configured architecture models that you can drop directly into new codebases.' },
      { type: 'h2', content: 'Fintech Microservices Blueprint' },
      { type: 'p', content: 'A standard architecture capturing Core Banking, Authentication, Visa Connectivity, and Fraud Detection pipelines.' }
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
