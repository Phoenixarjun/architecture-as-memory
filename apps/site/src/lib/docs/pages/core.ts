export interface DocBlock {
  type: 'p' | 'h1' | 'h2' | 'code' | 'command' | 'callout' | 'warning' | 'diagram' | 'schema';
  content?: string;
  language?: string;
  title?: string;
  expectedOutput?: string;
  fields?: { name: string; type: string; required: boolean; desc: string }[];
  accent?: 'ember' | 'graphite' | 'critical';
}

export interface DocPage {
  slug: string;
  title: string;
  description: string;
  blocks: DocBlock[];
}

export const corePages: DocPage[] = [
  {
    slug: 'introduction',
    title: 'Introduction to AAM',
    description: 'An offline, local-first cognition scaffolding system designed to capture, visualize, and sustain architectural boundaries in AI-native software repositories.',
    blocks: [
      { type: 'h1', content: 'Architecture-As-Memory (AAM)' },
      { type: 'p', content: 'AAM acts as a living memory layer that anchors both human developers and AI agents to the structural boundaries of a system, preventing **architectural erosion** and **cognitive drift**.' },
      {
        type: 'callout',
        title: 'Cognitive Scaffolding',
        content: 'Unlike code generators, AAM does not write implementation code. It provides an offline, capabilities-first topological contract that prevents AI assistants from creating duplicate systems, circular loops, or unstructured flat files.',
        accent: 'ember'
      },
      { type: 'h2', content: 'Why AAM Exists' },
      { type: 'p', content: 'In AI-native repositories, code mutation occurs at unprecedented velocities. While AI agents can generate thousands of lines of code in seconds, the human mental model of the codebase degrades rapidly.' },
      { type: 'p', content: 'AAM resolves this asymmetric velocity by providing a local, declarative representation of system capabilities. By rendering this model transparently to both humans (via an interactive console) and AI engines (via bootstrap injection), AAM keeps all participants in sync.' }
    ]
  },
  {
    slug: 'cognitive-drift',
    title: 'Understanding Cognitive Drift',
    description: 'Why the velocity of AI-driven code generation inherently triggers architectural decay, and how to scientifically anchor intent.',
    blocks: [
      { type: 'h1', content: 'The Cognitive Drift Problem' },
      { type: 'p', content: 'As developers leverage advanced LLMs, the rate of code modification increases by orders of magnitude. Without a structured architectural contract, three critical failures occur:' },
      { type: 'warning', title: '1. Context Window Saturation', content: 'AI agents treat raw file directory listings as unstructured text blobs. As the file count grows, the system architecture becomes highly unstable, resulting in duplicative helper modules and bloated layers.', accent: 'graphite' },
      { type: 'warning', title: '2. Immediate Obsolescence', content: 'Traditional long-form markdown documentation falls out of sync the microsecond an agent refactors an API boundary. Humans spend hours tracing git diffs to figure out *why* a module was created.', accent: 'critical' },
      { type: 'h2', content: 'The Solution: Architecture-As-Memory' },
      { type: 'p', content: 'AAM establishes a local, static, validated representation of architectural intent. It forces a clear hierarchy: **System → Domains → Features → Components**. Every capability is mapped to the business logic it fulfills, preventing flat-structure fragmentation.' }
    ]
  },
  {
    slug: 'philosophy',
    title: 'Core Philosophy',
    description: 'The principles of local-first governance, capabilities-first maps, and dual-consumption interfaces.',
    blocks: [
      { type: 'h1', content: 'Architectural Design Principles' },
      { type: 'p', content: 'AAM is built on four core architectural tenets designed to withstand high-velocity code mutation:' },
      {
        type: 'callout',
        title: '1. Capabilities-First, Not File-First',
        content: 'File structures and AST imports change far too fast to serve as high-level mental models. AAM maps components directly to business capabilities (features), keeping the representation stable and concise.',
        accent: 'ember'
      },
      {
        type: 'callout',
        title: '2. Dual-Consumption Design',
        content: 'Documentation must be equally readable by a human engineer and a sub-agent. Free-form text is expensive and lossy for LLMs; structural YAML declarations are validated, highly compressed, and immediately actionable.',
        accent: 'graphite'
      },
      {
        type: 'callout',
        title: '3. Local-First, Zero-Dependency Offline Graph',
        content: 'No external databases, SaaS accounts, or internet calls are required. Cognition graphs hydrate dynamically in milliseconds directly from local YAML nodes in the repository, guaranteeing total privacy and offline reliability.',
        accent: 'ember'
      },
      {
        type: 'callout',
        title: '4. Non-Destructive Scaffolding',
        content: 'AAM never edits, mutates, or deletes physical application source code. It is non-destructive—providing active rules to AI assistants and validating system schemas with zero production risk.',
        accent: 'graphite'
      }
    ]
  },
  {
    slug: 'quick-start',
    title: 'Quick Start',
    description: 'Get AAM up and running in under 60 seconds inside your repository.',
    blocks: [
      { type: 'h1', content: 'Quick Start Guide' },
      { type: 'p', content: 'Initialize AAM directly inside your project root to scan for active AI systems, inject instruction scaffolds, and launch the interactive viewer:' },
      {
        type: 'command',
        title: 'Step 1: Bootstrap Cognition',
        content: 'npx @architecture-as-memory/aam@latest init',
        expectedOutput: `🔍 Running AI Provider Detection Engine...
  Found compatible files for Claude Code:
    - CLAUDE.md
  💡 Capabilities: Instruction Files [Yes], Hooks [No], Slash Commands [Yes]

🎉 Architecture-As-Memory successfully initialized!`
      },
      {
        type: 'command',
        title: 'Step 2: Start Watcher Server',
        content: 'npx @architecture-as-memory/aam dev',
        expectedOutput: `Starting AAM Watcher Server...
⏱ Local Telemetry: Hydrated 12 nodes and 9 relationships in 148ms.
📺 Visualizer dashboard live at: http://localhost:4200`
      }
    ]
  },
  {
    slug: 'installation',
    title: 'Installation',
    description: 'Detailed instructions on global execution, local installations, and framework dependencies.',
    blocks: [
      { type: 'h1', content: 'Installation' },
      { type: 'p', content: 'AAM is distributed as a lightweight, zero-dependency Node binary. You can run it on-demand or lock it down locally.' },
      { type: 'h2', content: 'Option A: On-Demand Execution (Recommended)' },
      { type: 'p', content: 'Run AAM without adding node dependencies directly to your package files. This is ideal for clean CI pipelines and lightweight microservice repos:' },
      { type: 'code', content: 'npx @architecture-as-memory/aam@latest init', language: 'bash' },
      { type: 'h2', content: 'Option B: Local Dev Dependency' },
      { type: 'p', content: 'Add AAM as a project development dependency to lock a specific version and enable faster CLI commands without the npx lookup overhead:' },
      { type: 'code', content: 'npm install -D @architecture-as-memory/aam', language: 'bash' },
      { type: 'p', content: 'Once installed locally, execute commands directly using your package runner:' },
      { type: 'code', content: 'npx aam dev', language: 'bash' }
    ]
  }
];
