# Architecture-As-Memory (AAM)

```
    ___    ___    ___  ___ 
   /   |  /   |  /   |/   |
  / /| | / /| | / /|   /| |
 / ___ |/ ___ |/ / |  / | |
/_/  |_/_/  |_/_/  |_/  |_|
  ARCHITECTURE-AS-MEMORY (AAM) v1.0.0
```

An offline, local-first cognition scaffolding system designed to capture, visualize, and sustain architectural boundaries in AI-native software repositories.

AAM acts as a living memory layer that anchors both human developers and AI agents to the structural boundaries of a system, preventing architectural erosion and cognitive drift.

---

## 1. The Core Philosophy

### The Cognitive Drift Problem
In AI-native repositories, code mutation occurs at unprecedented velocities. While AI agents can generate hundreds of lines of correct implementation code in seconds, the human mental model of the codebase degrades rapidly. 

Without a lightweight, structured anchor:
1. **Context Window Saturation**: Agents treat the entire codebase as an amorphous text block, leading to flat files, duplicate implementations, or circular dependencies.
2. **Mental Drift**: Human engineers lose track of *why* components are structured a certain way, leading to high architectural friction.
3. **Decay of Intent**: Critical design decisions are lost in transient chat windows instead of being persisted.

### How AAM Differs from Existing Tools

| Dimension | AAM | LLM Wiki Systems | Dependency Graphs |
| :--- | :--- | :--- | :--- |
| **Primary Unit** | Architectural Intent & Capability | Long-form Technical Prose | AST Imports / File Topology |
| **Main Consumer** | Dual (AI Agents & Humans) | Humans Only | Build Systems & Linters |
| **Mutation Rate** | Incremental / Low churn | Infrequent / Out of date | Volatile / Automated |
| **Focus** | "Why is this system here?" | "How do I configure this?" | "Which file imports another?" |

*   **Unlike a Dependency Graph**: AAM is *not* a file-to-file AST import parser. Physical imports change too rapidly and contain high noise. AAM represents a developer's high-level mental model.
*   **Unlike an LLM Wiki**: It is not written in free-form prose. Free-form prose is expensive for LLMs to read and difficult to validate. AAM uses structured, highly compressed YAML nodes that are immediately actionable.

---

## 2. The Architectural Cognition Model

AAM organizes codebase understanding into exactly four local, structured layers:

```
  System (system.yaml)
    → Domains (domains/*.yaml)
        → Features / Capabilities (features/*.yaml)
            → Components / Services (components/*.yaml)
```

1. **System**: The global, top-level identity, description, and stack characteristics of the repository.
2. **Domains**: High-level business or technical boundaries (e.g., `Frontend`, `Backend`, `Data-Ingestion`). 
3. **Features (The Capability Anchor)**: Cross-cutting business goals that developers actually reason about (e.g., `Authentication`, `Invoice-Generation`). Features are shared cognition units across domains.
4. **Components**: The modular units of service, UI views, databases, or frameworks that exist *solely to support features* (e.g., `login-ui-component`, `auth-api-service`).

Relationships are contextual, directional topologies (e.g. `communicates_with`, `consumes`, `publishes_to`) defined globally or locally.

---

## 3. CLI Reference & Installation

### Installation
Initialize AAM directly inside your project root:
```bash
# Initialize cognition folders and detect active AI systems
npx @architecture-as-memory/aam init
```

### CLI Commands

```bash
# Display a quick colorized operational heartbeat of repository cognition health
npx @architecture-as-memory/aam status

# Compile a unified health dashboard aggregating validation, doctor, git, and performance telemetry
npx @architecture-as-memory/aam health

# Validate AAM schema syntax, duplicate IDs, and broken references
npx @architecture-as-memory/aam validate

# Audit cognitive health (detect circular dependencies, feature explosion, naming synonym drift)
npx @architecture-as-memory/aam doctor

# Calculate a stable, format-insensitive SHA-256 signature of the current topology
npx @architecture-as-memory/aam hash

# Save a snapshot definition of the current topology under .aam/snapshots/
npx @architecture-as-memory/aam snapshot

# Export the current living architecture into a standalone, single-file offline visualizer bundle
npx @architecture-as-memory/aam export -o architecture-map.html

# Start the local YAML watcher server and open the interactive architecture map
npx @architecture-as-memory/aam dev
```

---

## 4. Multi-Agent Governance Model

In multi-agent environments or multi-tool runtimes (such as Claude Desktop sub-agents, Gemini multi-agent workflows, OpenCode task agents, or Codex runtimes), ontology consistency and graph stability are protected by a strict governance rule:

> ⚠️ **CRITICAL AI GOVERNANCE RULE**: ONLY THE PRIMARY ORCHESTRATION AGENT MAY WRITE OR UPDATE ARCHITECTURE COGNITION DIRECTLY. Sub-agents may analyze implementation details but must never mutate architecture YAML files. 

This prevents duplicate mutations, structural corruption, and ontology fragmentation during highly concurrent workspace operations.

---

## 5. AI-Native Integration Workflow

AAM is designed to sit alongside your AI assistant's system instructions seamlessly.

### Step 1: Lightweight Bootstrap Injection
During `aam init`, AAM scans your project (up to depth 3) for standard instruction files (`CLAUDE.md`, `.cursorrules`, `.gemini/GEMINI.md`, `AGENT.md`, etc.). It appends a lightweight, idempotent, marker-guarded reference pointing to AAM:

```markdown
<!-- AAM START -->

This repository uses Architecture-as-Memory (AAM).

Before implementing:
- Read /architecture/architecture.index.yaml
- Read affected feature and domain YAML files
- Maintain architectural cognition incrementally

After implementation:
- Sub-agents may analyze implementation details but must never mutate architecture cognition directly. Only the primary orchestration agent may write or update architecture YAML nodes.
- Update only affected architecture nodes
- Append relationships instead of regenerating globally
- Preserve stable IDs

Detailed operational rules:
- /architecture/agents/aam-skill.md

<!-- AAM END -->
```

### Step 2: Slash Command Protocol
When asking your assistant to build a feature, use custom slash commands or prompt triggers. This hydrates their context window with only the relevant architectural layers instead of dump-loading the whole project:

```
/aam FEAT-AUTHENTICATION Add password reset support via SMTP.
```

Your assistant is trained via `aam-skill.md` to:
1. Parse the target capability and its associated component schemas.
2. Formulate an implementation plan respecting existing design boundaries.
3. Complete the coding task.
4. Update affected AAM schemas incrementally (updating responsibilities, appending relationships, and maintaining stable IDs).

---

## 6. Hook Philosophy

AAM strictly adheres to a **Local-First, Capabilities-Based, Non-Destructive** hook paradigm:

- **No Silent Mutations**: Post-task hooks never auto-write code, preventing corrupt states.
- **Validation Filtering**: When running `aam hooks install claude`, it appends a post-task verification directive in `CLAUDE.md` and creates a local Git `post-commit` hook.
- **Developer Review Prompt**: The hook runs `validate` and `doctor` to identify semantic mismatches, presenting a colorized report prompting the engineer to keep the architectural representation in sync.

---

## 7. Interactive Operating Console

The AAM visual viewer (`aam dev`) offers a stunning, distraction-free graphite + ember cockpit:

- **Calm UI**: Designed for long engineering sessions under heavy cognitive load. No neon cyber-glow or resource-intensive 3D physics.
- **Interactive Tree State Preservation**: Zoom, pan coordinates, active inspector sidebars, and expanded tree layers are entirely preserved through incremental patching when live SSE reloads trigger.
- **Fuzzy Search Command Palette**: Triggered instantly with `Ctrl+K`. Indexes names, stable IDs, descriptions, capabilities, and technical enhancements. Center coordinates are targeted smoothly to keep orientation intact.
