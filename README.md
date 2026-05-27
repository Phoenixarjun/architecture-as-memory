<div align="center">
  <img src="./apps/site/public/AAMLogo.png" width="160" alt="Architecture-as-Memory (AAM) Logo"/>

  <h1>Architecture-As-Memory (AAM)</h1>

  <p><b>An offline, local-first cognition scaffolding system designed to capture, visualize, and sustain architectural boundaries in high-velocity AI-native software repositories.</b></p>

  <p>
    <img src="https://img.shields.io/badge/System-AI--Native%20Cognition-6366F1?style=for-the-badge" />
    <img src="https://img.shields.io/badge/Scaffolding-Intent%20Preservation-8B5CF6?style=for-the-badge" />
    <img src="https://img.shields.io/badge/Privacy-Offline--First%20Graph-22C55E?style=for-the-badge" />
  </p>

  <p>
    <img src="https://img.shields.io/badge/CLI-TypeScript%20%2B%20Rust-ED8B00?style=flat-square&logo=typescript&logoColor=white" />
    <img src="https://img.shields.io/badge/Claude_Code-Optimized-black?style=flat-square&logo=anthropic&logoColor=white" />
    <img src="https://img.shields.io/badge/Cursor-Supported-00ADD8?style=flat-square" />
    <img src="https://img.shields.io/badge/Gemini_CLI-Compatible-4285F4?style=flat-square&logo=googlegemini&logoColor=white" />
  </p>

  <p>
    <img src="https://img.shields.io/badge/npm_package-1.0.0--beta.2-CB3837?style=flat-square&logo=npm&logoColor=white" />
    <img src="https://img.shields.io/badge/PyPI-wrapper-3776AB?style=flat-square&logo=python&logoColor=white" />
    <img src="https://img.shields.io/badge/Crates.io-binary-black?style=flat-square&logo=rust&logoColor=white" />
    <img src="https://img.shields.io/badge/Docker-validated-2496ED?style=flat-square&logo=docker&logoColor=white" />
  </p>

  <br/>

  <a href="#-why-this-project-exists">Why AAM Exists</a> •
  <a href="#%EF%B8%8F-how-it-works">How It Works</a> •
  <a href="#-before-vs-after-cognitive-scaffolding">Before vs. After</a> •
  <a href="#-high-velocity-ai-anti-patterns">AI Anti-Patterns</a> •
  <a href="#-declarative-yaml-schema-spec">YAML Schemas</a> •
  <a href="#-command-line-interface">CLI Specs</a> •
  <a href="#-quick-start">Quick Start</a>

</div>

---

> **"LLM Wiki gives your AI agent memory.**  
> **AAM gives YOU memory."**

In AI-native repositories, code modification occurs at machine speed. While autonomous agents can generate thousands of lines of code in seconds, the human mental model of the codebase degrades rapidly. AAM acts as a local-first architectural memory layer, anchoring both human developers and AI assistants to strict capability boundaries to prevent silent decay.

---

## 🎯 Why This Project Exists

Most software tools show the **happy path of AI code generation**. AAM was built to resolve what happens when autonomous execution scales.

The core engineering questions this project answers:
- **How do you maintain architectural coherence** when autonomous agents modify code faster than humans can review it?
- **How do you prevent context window saturation** where LLMs rewrite existing modules because they cannot see high-level logical domains?
- **How do you enforce spatial integrity** in a repository without using heavy cloud databases or complex visual setups?

### The Moment of Failure

Without a structured capability boundary, autonomous agents select the path of least resistance: generating duplicate utilities inside the nearest folder. In an unanchored repository, three separate autonomous agent runs generated three separate billing handlers within 72 hours:

*   `PaymentRetryManager` (Core backend API)
*   `RetryPaymentManager` (Helper script in utils)
*   `PaymentRecoveryService` (Checkout domain wrapper)

All three solved the exact same recovery logic. None shared state or interfaces. Because they sat under a flat AST file system, the duplication went unnoticed until circular memory cycles crashed the production gateway.

**AAM resolves this asymmetric velocity. It ensures that humans and agents reason about software at the capability scale—not flat files.**

---

## 🏗️ How It Works

AAM models repository architecture into four strict hierarchical layers: **System → Domains → Features → Components**. 

<div align="center">
  <br/>
  <h3>1. Core Topology Graph (Connected Layout)</h3>
  <img src="./apps/site/public/AAM1.png" alt="AAM Topology Graph" width="850" style="border-radius: 8px; border: 1px solid rgba(255,255,255,0.1);"/>
  <p><i>The visual watcher console (aam dev) displaying interactive modular relationships, capability shapes, and structural paths.</i></p>
  
  <br/>
  <h3>2. Focused Node Telemetry & Risk Overlays</h3>
  <img src="./apps/site/public/AAM2.png" alt="AAM Focused Node Details" width="850" style="border-radius: 8px; border: 1px solid rgba(255,255,255,0.1);"/>
  <p><i>Focused inspection overlay showing strict metadata fields, ownership parameters, and component dependencies dynamically scanned from local YAML models.</i></p>
  <br/>
</div>

### Dual-Consumption Scaffolding

1. **Declarative Contracts** — High-level architecture is declared in simple, validated local YAML nodes under the `/architecture` directory.
2. **Dynamic Ingestion** — During CLI compilation, AAM transforms these declarations into a unified memory graph.
3. **AI Rule Injection** — During `aam init`, lightweight bootstrap markers are injected into active assistant instructions (e.g. `CLAUDE.md`, `.cursorrules`), forcing the agent to query the index before mutating code.

---

## 🔀 Before vs. After (Cognitive Scaffolding)

### Without AAM: File-First Flat Chaos

LLMs reason about files as unstructured blobs of text. When context limits grow, circular couplings form silently:

```text
auth-service/
├── auth-helper-final.js
├── auth-helper-final-fixed.js
├── auth-token-utils.js
└── auth-token-utils-new.js
```
*Developer thought: "Which file is authenticating user transactions? Why did Claude generate an entirely new token generator in a subdirectory?"*

---

### With AAM: Declarative Boundary Anchor

AAM models the capability, separating physical file placement from transactional responsibilities:

```yaml
feature:
  id: FEAT-AUTHENTICATION
  purpose: Unified customer authentication boundary
  domains:
    - DOM-GATEWAY
  components:
    - COMP-AUTH-SERVICE
    - COMP-TOKEN-GENERATOR
```
*AI sub-agents instantly query `FEAT-AUTHENTICATION` to fetch context, identifying exactly where to inject updates without spawning files.*

---

## 🧩 High-Velocity AI Anti-Patterns

| Anti-Pattern | Core Symptom | AAM Prevention Mechanism |
|--------------|--------------|-------------------------|
| **Helper Explosion** | Proliferation of `utils-new`, `helper-final` inside sibling directories. | Mandatory component maps bound to strict feature IDs. |
| **Context Collapse** | AI couples the database layer directly to endpoints, bypassing business modules. | Dependency validation checks fail immediately during CLI compilation. |
| **Repo Map Overload** | Feeding LLMs flat 400-file directory listings, wasting tokens and diluting context. | Compressed, structured YAML capabilities sent to the agent's system prompt. |
| **Documentation Entropy** | Long-form wikis and markdown architecture specifications drift silently. | Local YAML schemas are validated offline against the active AST. |

---

## ⚙️ Declarative YAML Schema Spec

AAM structures system blueprints into single-responsibility YAML configurations under `/architecture`.

### 1. system.yaml (Global Parameters)
```yaml
id: SYS-ORCHESTRIX
name: Orchestrix Core Platform
description: Distributed multi-agent billing and transactional platform.
stack:
  - nextjs
  - spring-boot
  - python-fastapi
```

### 2. domains/checkout.yaml (Logical Boundaries)
```yaml
id: DOM-CHECKOUT
name: Transactional Checkout Domain
description: Handles cart processing, inventory ledger, and payments.
ownership: checkout-team
```

### 3. features/cart-management.yaml (Business Capabilities)
```yaml
id: FEAT-CART-MANAGEMENT
name: Shopper Cart Sessions
purpose: Real-time calculation and item locking of active buyer transactions.
domains:
  - DOM-CHECKOUT
components:
  - COMP-REDIS-CART-CACHE
  - COMP-CART-API-SERVICE
```

---

## 💻 Command Line Interface

AAM features a zero-dependency, local-first CLI tool to manage cognition graphs.

| Command | Action | Output / Behavior |
|---------|--------|-------------------|
| `aam init` | Bootstraps AAM, scans AI assistants, injects prompt scaffolds. | Detects rule files (`CLAUDE.md`, `AGENT.md`) and updates boundaries. |
| `aam dev` | Starts local watcher and hydrates interactive graph. | Launches graphical visual console at `http://localhost:4200` with telemetry. |
| `aam check` | Validates YAML schemas against structural constraints. | Errors out with line details on malformed YAML or broken relationships. |
| `aam doctor` | Self-diagnoses cognitive smells in active repository code. | Reports unmapped files, duplicate helpers, and boundary bypasses. |

---

## 🚀 Quick Start

Initialize and launch the interactive visual viewer inside your active repository in under 60 seconds.

### Prerequisites
* Node.js v18.0.0 or higher
* npm, yarn, or pnpm

### 1. Bootstrap Scaffolding
Run the initialization command in your repository root. AAM will automatically scan your project for active AI engines and set up lightweight rules:
```bash
npx @architecture-as-memory/aam@latest init
```
*Expected output:*
```text
🔍 Running AI Provider Detection Engine...
  Found compatible files for Claude Code:
    - CLAUDE.md
  💡 Capabilities: Instruction Files [Yes], Hooks [No], Slash Commands [Yes]

🎉 Architecture-As-Memory successfully initialized!
```

### 2. Launch Visualizer Dashboard
Start the repository watcher to map and track active files:
```bash
npx @architecture-as-memory/aam dev
```
*Expected output:*
```text
Starting AAM Watcher Server...
⏱ Local Telemetry: Hydrated 16 nodes and 12 relationships in 124ms.
📺 Visualizer dashboard live at: http://localhost:4200
```
Open **`http://localhost:4200`** in your browser to inspect your codebase's live visual cognitive topology.

---

## 🤖 AI Assistant Integration & Governance

### The Rule Injection Scaffold

When `aam init` is executed, the engine injects prompt constraints directly into your AI configuration files (e.g. `CLAUDE.md` or `.cursorrules`), enclosed in safety markers:

```markdown
<!-- AAM START -->
This repository uses Architecture-As-Memory (AAM) to prevent cognitive drift.
Before writing, refactoring, or generating files, you MUST:
  1. Inspect /architecture/architecture.index.yaml to read the capability domains.
  2. Map all new logic directly to defined components inside YAML nodes.
  3. Never create flat duplicate helper structures in utils or nested directories.
<!-- AAM END -->
```

### Strict Multi-Agent Governance

To guarantee absolute graph stability in complex developer environments, AAM enforces a strict role division:

*   **Primary AI Agents / Human Architects**: Permitted to mutate AAM declarative node specifications (`domains/*.yaml`, `features/*.yaml`) when capability requirements expand.
*   **Sub-Agents / Code Mutators**: Strictly read-only consumers. They read AAM contracts via bootstrap instructions to direct their generation paths, but are restricted from mutating index schemas.

---

## 🔗 Author & License

**Naresh B A** — Creator & Core Architect

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Naresh_B_A-0A66C2?style=flat-square&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/naresh-b-a-1b5331243)
[![GitHub](https://img.shields.io/badge/GitHub-Phoenixarjun-181717?style=flat-square&logo=github&logoColor=white)](https://github.com/Phoenixarjun)

Distributed under the MIT License. See [LICENSE](file:///d:/Arjuns%20Work/architecture-as-memory/LICENSE) for details.

---

<div align="center">
  <sub>Built to sustain human comprehension. Designed to anchor AI mutations.</sub>
</div>
