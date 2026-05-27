# Architecture-as-Memory (AAM) — Complete System Document

> **Version:** `@architecture-as-memory/aam` 1.0.0-beta.5  
> **License:** MIT | **Author:** Naresh B A  
> **Repository:** https://github.com/Phoenixarjun/architecture-as-memory  
> **Branch:** `dev` (11 commits)  
> **Tagline:** *Persistent architectural cognition for AI-native software.*

---

## Table of Contents

1. [What is AAM?](#1-what-is-aam)
2. [The Cognitive Drift Problem](#2-the-cognitive-drift-problem)
3. [Core Philosophy](#3-core-philosophy)
4. [The Four Cognitive Layers](#4-the-four-cognitive-layers)
5. [Multi-Dimensional State System](#5-multi-dimensional-state-system)
6. [The Relationship Nervous System](#6-the-relationship-nervous-system)
7. [Ontology Contract & JSON Schema](#7-ontology-contract--json-schema)
8. [The Governance Layer (Validation Engine)](#8-the-governance-layer-validation-engine)
9. [The Sanity Check Layer (Doctor Engine)](#9-the-sanity-check-layer-doctor-engine)
10. [The Health Dashboard (Health Engine)](#10-the-health-dashboard-health-engine)
11. [The Status Heartbeat (Status Engine)](#11-the-status-heartbeat-status-engine)
12. [The Identity Layer (ID Strategy Engine)](#12-the-identity-layer-id-strategy-engine)
13. [The Hash Layer (Hash Engine)](#13-the-hash-layer-hash-engine)
14. [The Snapshot Layer (Snapshot Engine)](#14-the-snapshot-layer-snapshot-engine)
15. [The Export Layer (Exporter Engine)](#15-the-export-layer-exporter-engine)
16. [The Fallback Layer (Graceful Degradation)](#16-the-fallback-layer-graceful-degradation)
17. [The Provider Detection Layer](#17-the-provider-detection-layer)
18. [The Hook Layer (Claude Integration)](#18-the-hook-layer-claude-integration)
19. [The Scaffolder (Init System)](#19-the-scaffolder-init-system)
20. [CLI Reference](#20-cli-reference)
21. [Viewer Architecture (ReactFlow Graph)](#21-viewer-architecture-reactflow-graph)
22. [Layout Engine & Cognitive Edge Aggregation](#22-layout-engine--cognitive-edge-aggregation)
23. [Focus Filters & Search Neighborhood](#23-focus-filters--search-neighborhood)
24. [Graph Diffing & State Preservation](#24-graph-diffing--state-preservation)
25. [Visual Design System: Graphite & Ember](#25-visual-design-system-graphite--ember)
26. [Marketing Site (Next.js 16)](#26-marketing-site-nextjs-16)
27. [AI Agent Integration System](#27-ai-agent-integration-system)
28. [Multi-Agent Governance Model](#28-multi-agent-governance-model)
29. [Slash Command Protocol](#29-slash-command-protocol)
30. [YAML File Format Reference](#30-yaml-file-format-reference)
31. [Demo Architectures](#31-demo-architectures)
32. [Build & Development](#32-build--development)
33. [Key Design Decisions](#33-key-design-decisions)

---

## 1. What is AAM?

Architecture-as-Memory is a **persistent architectural cognition layer** for AI-native software engineering workflows. It solves the problem of developers losing mental models of their system as AI coding assistants mutate the codebase at machine speed.

**What it is NOT:**
- Not a documentation generator
- Not a static dependency visualizer
- Not a repo indexing tool
- Not a UML diagram tool
- Not a wiki system

**Core promise:** A developer returning after weeks away can re-understand the system within **two minutes** by looking at the AAM graph.

**Key architecture constraints:**
- Fully **local-first**, **offline-capable** — no backend, no cloud, no database, no AI API dependency
- Models **architectural cognition** (capabilities, boundaries) — not filesystem topology (imports, AST, files)
- Maintained primarily by **AI coding assistants** via incremental **patch mutations**
- Uses **YAML files** inside the repository as the persistence format
- Rendered as an **interactive ReactFlow graph** with progressive expansion

---

## 2. The Cognitive Drift Problem

In AI-native repositories, code mutation occurs at unprecedented velocities. AI agents can generate hundreds of lines of correct implementation code in seconds, while the human mental model of the codebase degrades rapidly.

Without a structured anchor:
1. **Context Window Saturation** — Agents treat the entire codebase as an amorphous text block, leading to flat files, duplicate implementations, or circular dependencies.
2. **Mental Drift** — Human engineers lose track of *why* components are structured a certain way, leading to high architectural friction.
3. **Decay of Intent** — Critical design decisions are lost in transient chat windows instead of being persisted.

AAM exists to anchor both human and AI cognition to a stable, structured architectural map.

---

## 3. Core Philosophy

### Cognition over Implementation

Most existing architecture tools fail because they visualize files, imports, AST relationships, dependency graphs, and folder hierarchies. Those systems become visually noisy because humans do not reason about software at the file level.

**Humans reason about capabilities:** authentication, payments, analytics, notifications, onboarding, search, deployment, observability, workflows, operational boundaries.

AAM therefore models **architectural cognition** — not filesystem topology.

### Rules of Cognition Compression

| Principle | Description |
|---|---|
| **Summary is WHAT** | 1-3 line explanation of what the node does (max 150 chars) |
| **Purpose is WHY** | Explains why this node exists strategically |
| **Strict Limits** | Keep all descriptions concise, avoid prose walls |

### The Success Metric

Not "complete graph accuracy." The real metric:

> *"Can a developer return after several weeks away and understand the system again within two minutes?"*

---

## 4. The Four Cognitive Layers

```
  System (system.yaml)
    → Domains (domains/*.yaml)
        → Features / Capabilities (features/*.yaml)
            → Components / Services (components/*.yaml)
```

### Layer 1: System
The top-level project identity, architecture style, runtime stack, and operational scope. One per repository.

**File:** `architecture/system.yaml`

### Layer 2: Domain
Major operational boundaries within the software system. Examples: Frontend, Backend, Core Banking, Infrastructure, Data Pipeline.

**File:** `architecture/domains/*.yaml`

### Layer 3: Feature (THE ANCHOR LAYER)
Cross-cutting architectural capabilities that humans actually care about. Features are shared cognition units that span multiple domains.

**Critical rule:** Features reference multiple implementation components distributed across multiple domains. Features are NOT duplicated under frontend/backend.

**File:** `architecture/features/*.yaml`

### Layer 4: Component
Implementation containers that support features. Components are the leaf nodes — they have no expandable children.

**Critical rule:** Components support features. Features do NOT support components. This keeps the model human-oriented.

**File:** `architecture/components/*.yaml`

### Enhancement (Optional 5th Layer)
Pre-staged or future architectural evolution tracks.

**File:** `architecture/enhancements/*.yaml`

---

## 5. Multi-Dimensional State System

AAM rejects simplistic states like "pending", "done", "todo". Instead, every feature and component tracks **seven dimensions** of operational cognition:

| Dimension | Values | What it communicates |
|---|---|---|
| **lifecycle** | proposed, active, evolving, stable, deprecated | Where is this in its lifespan? |
| **implementation** | partial, complete | How built is it? |
| **reliability** | unknown, unstable, reliable, hardened | Can we trust it in production? |
| **observability** | missing, partial, complete | Can we see what it's doing? |
| **maturity** | experimental, scaling, production, legacy | How proven is it? |
| **risk** | low, medium, high, critical | What's the downside if it fails? |
| **change_frequency** | low, moderate, high, volatile | How often does it change? |

**Example:** A feature with `lifecycle: active, implementation: complete, reliability: unstable, observability: partial, maturity: scaling, risk: high` communicates: "It exists and works, but it's unstable under production load and we can't see what's happening."

Enhancements use their own states: planned, researching, implementing, validating, blocked, deferred, completed.

---

## 6. The Relationship Nervous System

Relationships are the **nervous system** of the cognition graph. Without them, the graph is static metadata.

### 9 Canonical Relationship Verbs

| Verb | Meaning |
|---|---|
| `depends_on` | Direct operational coupling |
| `consumes` | Reads data, messages, or API endpoints |
| `publishes_to` | Pushes events or records to a queue/data-store |
| `communicates_with` | Synchronous RPC/network call |
| `reads_from` | Direct query or extraction source |
| `writes_to` | Mutation or direct save target |
| `exposes` | Offers a network socket or entry endpoint |
| `owned_by` | Assigns specific organization/team boundaries |
| `triggers` | Direct execution callback |

### Dual Relationship Sources

Relationships can be defined in **two places** (merged at hydration):

1. **Global** — `architecture/relationships.yaml` for cross-cutting connections
2. **Local** — Embedded inside feature YAML files under `relationships:` key

### Cognitive Edge Aggregation (Viewer)

When rendering, the viewer intelligently aggregates relationships based on visible nodes:

- **Scenario A:** Both source and target nodes visible → direct edge
- **Scenario B:** Components hidden, parent features visible → feature-level aggregated edge (dashed, amber)
- **Scenario C:** Only domains visible → domain-level aggregated edge (dotted, gold, labeled "coupling")

---

## 7. Ontology Contract & JSON Schema

### JSON Schema (`schema/aam.schema.json` — 184 lines)

Draft-07 JSON Schema with conditional validation (`allOf`):

**Core required fields:** `type`, `schema_version`, `id`, `name`, `summary`, `purpose`

**Node types enum:** `system`, `domain`, `feature`, `component`, `enhancement`

**Status sub-schema properties:**
- `lifecycle`: active, deprecated, evolving, proposed
- `maturity`: experimental, production, hardened
- `reliability`: unstable, reliable, hardened
- `observability`: none, partial, complete
- `risk`: low, medium, high, critical

**Type-specific conditional validation:**
- `system`: optional `architecture_style`, `runtime_stack`, `operational_maturity`, `repository`
- `domain`: optional `ownership`
- `feature`: **required** `domains` (min 1), optional `components`
- `component`: **required** `domain`, optional `tech_stack`

**`knowledge_links` contract:** Must be array of objects `{ type: string, path: string }`. Types: wiki, design, rfc, repository, other.

### Ontology Contract Doc (`docs/ontology-contract.md` — 135 lines)

Human reference document defining:
- Cognitive compression rules (summary ≤ 150 chars, description ≤ 250 chars)
- Node type contracts
- Unified field contracts table
- `knowledge_links` object contract
- Strict relationship governance (9 verbs only)
- YAML safety & escape rules (colons, angle brackets, backticks)
- Progressive AI mutation workflow

---

## 8. The Governance Layer (Validation Engine)

**File:** `packages/cli/src/validation-engine.js` — 465 lines  
**CLI command:** `aam validate`

This is the **architectural governance layer**. It enforces structural integrity of all YAML schemas.

### What it validates

| Check | Type | Description |
|---|---|---|
| YAML Syntax | Error | Malformed YAML detection |
| Duplicate IDs | Error | Same ID across multiple files |
| Missing Required Fields | Error | id, type, name, summary, purpose |
| Invalid Type Values | Error | Must be one of: system/domain/feature/component/enhancement |
| Schema Type Mismatch | Error | File in wrong directory for its type |
| Broken References | Error | Feature references non-existent domain/component IDs |
| Relationship Source/Target | Error | Missing or referencing non-existent IDs |
| Invalid Relationship Types | Error | Must be one of 9 canonical verbs (with Levenshtein suggestion) |
| knowledge_links Structure | Error | Must be array of `{type, path}` objects |
| Missing schema_version | Warning | Version tracking recommended |
| Summary too long | Warning | Above 150-character limit |
| Missing capabilities | Warning | Features/components should declare capabilities |
| Pattern Safety | Warning | Unquoted colons, angle brackets, backticks in values |
| Protected Field Governance | Warning | Checks git HEAD baseline for unexpected mutations |
| Non-deterministic IDs | Warning | IDs should match FNV-1a generated hash |
| Status enum violations | Error | Invalid lifecycle, maturity, risk, etc. values |

### Pattern Safety Checks (Task 7)

Detects unsafe YAML patterns that can cause parser drift:
- Unquoted colons (`:` followed by space) in values
- Unquoted angle brackets (`<`, `>`) for TypeScript generics
- Unquoted backticks for inline code

### Protected Fields Governance

Reads file content from `git HEAD` baseline and compares against current working state. Flags unexpected mutations on fields listed in `protected_fields` array.

### Levenshtein Suggestion Engine

When an invalid relationship type is found, the engine calculates the nearest valid match using Levenshtein distance and suggests the correct verb.

---

## 9. The Sanity Check Layer (Doctor Engine)

**File:** `packages/cli/src/doctor-engine.js` — 462 lines  
**CLI command:** `aam doctor`

This is the **cognitive health audit layer**. It goes beyond validation to detect architectural smells, cognitive drift, and semantic issues.

### What it diagnoses

| Diagnostic | Description |
|---|---|
| **Semantic Overlap** | Detects nodes with suspiciously similar names using synonym groups (auth/authentication, login/signin, db/database, user/account, api/service) |
| **Relationship Saturation** | Nodes with ≥15 relationships flagged as over-coupled |
| **Feature Explosion** | Features with >10 components — suggests dividing capabilities |
| **Oversized Domain** | Domains with >8 features — suggests splitting domains |
| **Weak Capability Density** | Nodes with ≥4 relationships but <2 capabilities listed |
| **Excessive Topology Centrality** | Nodes with ≥8 relationships flagged as central/coupling risk |
| **Graph Entropy Ratio** | System-wide relationship-to-node ratio > 3.5 flagged |
| **Circular Dependencies** | DFS cycle detection on feature-level relationships |
| **Empty Domains** | Domains with 0 associated features |
| **Missing Knowledge Links** | Nodes without knowledge_links |
| **Low Cognition Descriptions** | Descriptions under 25 characters |
| **Overly Verbose Cognition** | Descriptions over 250 characters |
| **Git Tracking Safety** | Checks if architecture is gitignored |
| **Malformed YAML Isolation** | Tracks files that fail to parse |

### Complexity Scoring (`computeComplexityScore`)

Dynamic heuristic scoring for each node:
- +2 per relationship connection
- +3 per pending enhancement
- +1.5 per capability
- +4 if `reliability: unstable`, +2 if `unknown`
- +3 if `lifecycle: evolving`, +2 if `proposed`

Classification: 0-5 = low, 6-11 = moderate, 12-19 = high, 20+ = critical

### Snapshot Metadata (`createSnapshotMetadata`)

Generates standardized metadata for point-in-time snapshots including:
- `schema_version`, `snapshot_version`, `timestamp`
- `architecture_hash` (SHA-256)
- `topology_summary` (counts of domains, features, components, relationships)

### Performance Telemetry

Measures and reports:
- Total hydration duration (ms)
- YAML parse duration (ms)
- Node and edge counts

---

## 10. The Health Dashboard (Health Engine)

**File:** `packages/cli/src/health-engine.js` — 90 lines  
**CLI command:** `aam health`

Compiles a **unified health dashboard** that aggregates all diagnostic engines into a single report:

1. **Deterministic Hash** — SHA-256 of current topology
2. **Validation Results** — Critical errors from `validateArchitecture()` (run silently)
3. **Doctor Results** — Cognitive smells from `runDoctor()` (run silently)
4. **Performance Telemetry** — Hydration time, parse time, node/edge counts
5. **Governance Status** — Overall HEALTHY or DEGRADED based on error count

Deduplicates warnings by file+message combination.

---

## 11. The Status Heartbeat (Status Engine)

**File:** `packages/cli/src/status-engine.js` — 164 lines  
**CLI command:** `aam status`

A fast, lightweight operational heartbeat that provides:
- Domain, feature, component, enhancement, relationship counts
- Validation health (errors/warnings)
- Cognitive smell assessment
- Graph health status
- Last architecture update time (just now, X seconds/minutes/hours/days ago)
- Stale enhancement count

Designed for speed — tolerates parse failures silently.

---

## 12. The Identity Layer (ID Strategy Engine)

**File:** `packages/cli/src/id-strategy.js` — 33 lines  

Deterministic ID generation using **FNV-1a 32-bit hashing** of normalized names.

### ID Prefixes

| Type | Prefix | Example |
|---|---|---|
| System | `SYS-` | `SYS-AURABANK` |
| Domain | `DOM-` | `DOM-FRONTEND` |
| Feature | `FEAT-` | `FEAT-AUTH-SECURE` |
| Component | `COMP-` | `COMP-GATEWAY-SERVICE` |
| Enhancement | `ENH-` | `ENH-OAUTH-SUPPORT` |

### Algorithm

```
type → normalized prefix (DOM-, FEAT-, COMP-, ENH-, NODE-)
name → lowercase, strip non-alphanumeric
hash = FNV-1a 32-bit (offset 2166136261, prime 16777619)
suffix = last 4 hex characters of hash
result = PREFIX + SUFFIX (e.g., COMP-A19F)
```

IDs are **stable** across name changes (only the suffix changes if the name changes). This ensures IDs never collide and remain deterministic.

---

## 13. The Hash Layer (Hash Engine)

**File:** `packages/cli/src/hash-engine.js` — 142 lines  
**CLI command:** `aam hash`

Computes a **deterministic SHA-256 signature** of the entire architecture topology.

### What it hashes

- All nodes sorted by ID, with temporal metadata filtered out (`created_at`, `updated_at`, `last_modified_by`, `_relPath`)
- All relationships (source, target, type only — descriptions excluded for structural focus)
- Format: `NODES:\n{node strings}\nRELATIONSHIPS:\n{relationship strings}`

### Why deterministic

Uses stable JSON serialization with sorted keys and sorted arrays. Two identical architectures at different times produce the same hash. Only structural/topological changes (new nodes, changed relationships, modified fields) alter the hash.

---

## 14. The Snapshot Layer (Snapshot Engine)

**File:** `packages/cli/src/snapshot-engine.js` — 101 lines  
**CLI command:** `aam snapshot`

Creates **point-in-time snapshots** of the current architecture state:

1. Recursively loads all YAML files
2. Computes the deterministic SHA-256 hash
3. Builds metadata via `createSnapshotMetadata()` (timestamp, node counts, hash)
4. Serializes all nodes + relationships to JSON
5. Saves to `.aam/snapshots/snapshot-{hash[:8]}.json`

Snapshots enable diffing architecture state over time — you can compare current topology against any historical snapshot.

---

## 15. The Export Layer (Exporter Engine)

**File:** `packages/cli/src/exporter.js` — 628 lines  
**CLI command:** `aam export -o architecture-map.html`

Generates a **standalone, single-file offline HTML visualizer** bundle with zero external runtime dependencies at view time.

### What it produces

An HTML file containing:
- **Vis.js network graph** (loaded via CDN at generation time, embedded in runtime)
- **Tailwind CSS** (CDN, dark mode)
- **Lucide icons** (CDN)
- **Complete embedded JSON payload** of all architecture data (system, domains, features, components, relationships, invalid nodes)
- **Complexity scores** computed dynamically for each node

### Interactive Features in Exported HTML

- **Focus Filter dropdown** — Filter by: high-risk, evolving, unstable, frontend-only, backend-only, deprecated, experimental
- **Search input** — Real-time filtering across names, IDs, descriptions
- **Left sidebar** — Categorized list of domains/features/components with live filtering
- **Right sidebar inspector** — Shows purpose, description, capabilities, status matrix, temporal metadata, complexity score
- **Vis.js physics** — ForceAtlas2Based layout with gravitational constants
- **Node highlighting** — Color-coded by type (domain=orange, feature=gold, component=cyan)
- **Dimming** — Non-matching nodes dim to 15% opacity during filtering
- **Header HUD** — System name, SHA hash, node counts

### Malformed Node Graceful Handling

If any YAML file fails to parse, the exporter:
1. Creates an `invalidNode` entry with mock ID, error message, and raw content
2. Includes it in the embedded JSON
3. Logs a warning but continues execution
4. The offline viewer will still render valid data

---

## 16. The Fallback Layer (Graceful Degradation)

AAM implements **graceful degradation at every level** to ensure the system never crashes on bad data.

### Viewer Fallbacks

| Failure Mode | Fallback Behavior |
|---|---|
| Malformed YAML file | Becomes `invalidNode` with red border, error message, raw content display |
| Missing system node | Synthetic default system is created (`SYS-AAM`, "Dynamic Architecture-as-Memory") |
| Duplicate IDs | First occurrence wins, subsequent are logged as warnings |
| Missing fields | Nodes rendered with partial data, warnings printed |
| API unreachable | Loading screen persists, no crash |
| SSE connection lost | `isSyncing` flag goes false, viewer remains functional with last data |
| Empty architecture directory | Falls back to defaults |

### CLI Fallbacks

| Failure Mode | Fallback Behavior |
|---|---|
| No `/architecture` dir | Clear error message directing user to `aam init` |
| Git not available | Falls back to reading `.gitignore` files recursively |
| Git HEAD not found | `protected_fields` check skipped gracefully |
| YAML parse failure in hash | File silently skipped |
| Home directory unavailable for Claude detection | Skipped gracefully |
| Symbolic links or permission errors | Ignored silently |

### Server Fallbacks

| Failure Mode | Fallback Behavior |
|---|---|
| Static dist not found | API endpoints still work (Vite dev proxy handles UI) |
| File watch error | Error logged, SSE broadcast skipped for that event |
| PORT in use | Express throws standard error |

### Export Fallbacks

| Failure Mode | Fallback Behavior |
|---|---|
| Malformed YAML in export | `invalidNode` entry created, export continues |
| Missing system | Synthetic default system created |
| Vis.js/Tailwind CDN unavailable | Viewer page loads but graph won't render (degraded) |

---

## 17. The Provider Detection Layer

**File:** `packages/cli/src/provider-detector.js` — 156 lines

Detects which AI coding assistant providers are configured in the project workspace.

### Providers Detected

| Provider | Detection Method |
|---|---|
| **Claude** | `CLAUDE.md` at root or `.claude/CLAUDE.md` or home dir `~/.claude/CLAUDE.md`, content heuristic for "Claude Code" |
| **Cursor** | `.cursorrules` at root or `.cursor/rules/*.mdc` files, content heuristic for "cursor rules" |
| **Gemini** | `.gemini/GEMINI.md` at root or subdir, content heuristic for "Gemini CLI" |
| **Codex/Copilot** | `.github/copilot-instructions.md`, content heuristic for "GitHub Copilot" |
| **Generic** | `AGENT.md`, `AGENTS.md`, `AI_INSTRUCTIONS.md`, `AI-INSTRUCTIONS.md`, `instructions.md`, `coder.md`, `contributing.md` at root (with content heuristic to identify provider) |

### Scan Algorithm

- Recursive scan up to depth 3
- Ignores `node_modules`, `.git`, `dist`, `build`, `out`, `.next`, `.nuxt`, `coverage`, `tmp`
- Supports both filename-based and content-based heuristics
- Deduplicates results

### Provider Capability Matrix

**File:** `packages/cli/src/provider-capability-matrix.js` — 52 lines

Maps each detected provider to its capabilities:

| Provider | Instruction Files | Hooks | Slash Commands | Primary File |
|---|---|---|---|---|
| Claude | ✓ | ✓ | ✓ | `CLAUDE.md` |
| Cursor | ✓ | ✗ | Partial | `.cursorrules` |
| Gemini | ✓ | ✗ | ✓ | `.gemini/GEMINI.md` |
| Codex | ✓ | ✗ | Partial | `.github/copilot-instructions.md` |
| Generic | ✓ | ✗ | ✓ | `AGENT.md` |

---

## 18. The Hook Layer (Claude Integration)

**File:** `packages/cli/src/hooks/claude.js` — 72 lines  
**CLI command:** `aam hooks install claude`

Installs optional post-task hooks specifically for Claude Code:

### 1. CLAUDE.md Instruction Hook

Appends marker-guarded (`<!-- AAM HOOK START -->` / `<!-- AAM HOOK END -->`) post-task validation directives:
- Sub-agents must not mutate architecture cognition directly
- Only the primary orchestration agent may write architecture YAML
- Run `aam validate` after implementation
- Run `aam doctor` to audit cognition health
- Remind developer to review and commit AAM changes

### 2. Git Post-Commit Hook

Creates `.git/hooks/post-commit` that automatically runs:
```
npx architecture-as-memory validate
npx architecture-as-memory doctor
```

After every git commit, providing instant feedback on architectural integrity.

---

## 19. The Scaffolder (Init System)

**File:** `packages/cli/src/scaffolder.js` — 113 lines  
**CLI command:** `aam init`

Bootstraps the complete `/architecture` directory structure:

### What it creates

```
/architecture/
├── architecture.index.yaml    # Routing manifest
├── system.yaml                # System metadata
├── relationships.yaml         # Global relationships
├── domains/                   # Domain YAML files
├── features/                  # Feature YAML files
├── components/                # Component YAML files
├── enhancements/              # Enhancement YAML files
└── agents/                    # AI instruction files
    ├── AI_INSTRUCTIONS.md
    └── aam-skill.md
```

All from template files in `packages/cli/templates/`.

### AI Instruction Hook Injection

Scans for existing AI instruction files: `CLAUDE.md`, `.cursorrules`, `AGENT.md`, `.gemini/GEMINI.md`, `AI-INSTRUCTIONS.md`

Appends an idempotent, marker-guarded (`<!-- AAM-MARKER-START -->` / `<!-- AAM-MARKER-END -->`) bootstrap reference:

```markdown
## Architecture As Memory (AAM)
This repository uses Architecture-As-Memory (AAM)...
- Before implementing features, read architecture files
- After completing work, update YAML configurations incrementally
- Refer to /architecture/agents/aam-skill.md
```

### Provider Detection During Init

Uses the provider-detector to identify which AI systems are active, enabling tailored hook injection.

---

## 20. CLI Reference

**Entry point:** `packages/cli/bin/aam.js` — 240 lines  
**Package name:** `@architecture-as-memory/aam`  
**Install:** `npx @architecture-as-memory/aam init`

### All Commands

| Command | Description | Engine |
|---|---|---|
| `aam init` | Bootstrap `/architecture` directory + inject AI hooks | Scaffolder |
| `aam dev` | Start YAML watcher server + open graph viewer | Express/Chokidar |
| `aam validate` | Validate schema integrity, references, and governance | Validation Engine |
| `aam doctor` | Audit cognitive health, smells, and semantic drift | Doctor Engine |
| `aam health` | Unified health dashboard (validate + doctor + telemetry) | Health Engine |
| `aam status` | Quick colorized operational heartbeat | Status Engine |
| `aam hash` | Deterministic SHA-256 topology signature | Hash Engine |
| `aam snapshot` | Save point-in-time snapshot to `.aam/snapshots/` | Snapshot Engine |
| `aam export -o <file>` | Export standalone offline HTML visualizer | Exporter Engine |
| `aam hooks install claude` | Install post-task hooks for Claude + Git post-commit | Hook Layer |

### CLI Banner

```
    ___    ___    ___  ___ 
   /   |  /   |  /   |/   |
  / /| | / /| | / /|   /| |
 / ___ |/ ___ |/ / |  / | |
/_/  |_/_/  |_/_/  |_/  |_|
  ARCHITECTURE-AS-MEMORY (AAM) v1.0.0
```

---

## 21. Viewer Architecture (ReactFlow Graph)

**Package:** `packages/viewer/`

### Technology Stack

| Layer | Technology |
|---|---|
| UI Framework | React 19 |
| Graph Rendering | ReactFlow 11 (with Background, Controls, Node Resizer) |
| State Management | Zustand 5 |
| Build Tool | Vite 8 |
| Server | Express 5 |
| File Watcher | Chokidar 5 |
| Language | TypeScript ~6.0 |

### Viewer Component Tree

```
App (ReactFlowProvider)
  └── ViewerCockpit
      ├── ReactFlow Canvas
      │   ├── Background (grid, #2A313D)
      │   └── Controls (zoom, bottom-left)
      ├── HUD Header (glassmorphic)
      │   ├── Brand (logo + title)
      │   ├── Project Context Badge (pulsing indicator)
      │   ├── Focus Filter Dropdown (7 filters)
      │   ├── Search Button (Ctrl+K trigger)
      │   └── Live Sync Status Indicator
      ├── DetailSidebar (slideover, 420px)
      ├── CommandPalette (Ctrl+K modal)
      ├── InstructionsModal (AI rules modal)
      └── Agent Rules Toggle (floating button)
```

### Node Types (4 custom + ReactFlow defaults)

| Node Type | CSS Class | Visual Style | Behavior |
|---|---|---|---|
| `DomainNode` | `.node-domain` | 320px, gradient bg, 4px color corridor left border, 2px border | "Explore"/"Collapse" button |
| `FeatureNode` | `.node-feature` | 280px, 3px dashed color corridor, orange-tinted border | "Implementation"/"Collapse" button, lifecycle+risk badges |
| `ComponentNode` | `.node-component` | 260px, 2px solid color corridor, dashed border (leaf) | Maturity+lifecycle badges, no expand |
| `InvalidNode` | `.node-invalid` | 280px, red border, red background | Error message, file path, raw content display |

All nodes use `domainColor` — a deterministic color assignment from 5 corridors (copper, deep-orange, gold, amber, coral) based on hash of domain ID.

### Server (`server.js` — 244 lines)

**`getHydratedArchitecture(archDir)`**:
1. Recursively discovers all `.yaml`/`.yml` files (ignoring dotfiles)
2. Parses each file with YAML library
3. Extracts relationships from both global `relationships.yaml` and per-feature arrays
4. Sorts nodes by `type` field into domains, features, components, enhancements
5. **Graceful malformed isolation** — failed parses become `invalidNodes`
6. Returns unified JSON: `{ system, domains, features, components, enhancements, relationships, invalidNodes }`

**SSE Live Reload:**
- `GET /api/events` — Server-Sent Events endpoint
- Maintains array of connected SSE clients
- 30-second keep-alive heartbeat
- Clean disconnect handling

**Chokidar File Watcher:**
- Recursive watch on `/architecture` directory
- Ignores dotfiles
- 100ms stability threshold (`awaitWriteFinish`)
- On any change → re-hydrates → broadcasts `update` event to all SSE clients

---

## 22. Layout Engine & Cognitive Edge Aggregation

**File:** `packages/viewer/src/layoutEngine.ts` — 425 lines

### Deterministic Tree Layout

```
Domain_1 (x:100)                Domain_2 (x:1000)                Domain_3 (x:1900)
  │                                │                                │
  ├── Feature_A (y:420)           ├── Feature_C (y:420)            └── Feature_E (y:420)
  │     │                         │     │
  │     ├── Comp_1 (x:360)        │     ├── Comp_3 (x:360)
  │     ├── Comp_2 (x:360)        │     └── Comp_4 (x:360)
  │     └── Comp_3 (x:360)        │
  │                              └── Feature_D (y:700)
  └── Feature_B (y:700)
        │
        └── Comp_4 (x:360)
```

**Positioning Constants:**
- `DOMAIN_GAP_X = 900` — horizontal spacing between domains
- `DOMAIN_START_X = 100`, `DOMAIN_START_Y = 320`
- Features: 20px right, 280px down from domain
- Components: 340px right, -40px + index*140px from feature (localized cluster)
- Dynamic collision prevention: feature Y tracks component cluster height

### Domain Color Corridors

5 deterministic color corridors assigned by hash of domain ID:
- `copper` (#D98C3F)
- `deep-orange` (#FF8A3D)
- `gold` (#FBBF24)
- `amber` (#F59E0B)
- `coral` (#FF6B6B)

Each node carries a 4px (domain), 3px dashed (feature), or 2px solid (component) left border in its domain's color.

### Node Chunking

If `domains.length > 20` and no node is selected, only the first 20 domains render to prevent performance degradation.

### Semantic Edge Rendering

| Scenario | Behavior |
|---|---|
| No node selected | Only edges between visible nodes, capped at 15 edges |
| Node selected | Only edges connected to the selection neighborhood |
| Node in focus | Full opacity edges |
| Node out of focus | 2% opacity edges (essentially invisible) |
| Direct selection | Active edge style: `#FF8A3D`, 2px, animated |

---

## 23. Focus Filters & Search Neighborhood

### Focus Filters

The viewer provides 7 focus filters for cognitive compression:

| Filter | Shows only nodes where... |
|---|---|
| `high-risk` | `status.risk === high` or `critical` |
| `evolving` | `status.lifecycle === evolving` |
| `unstable` | `status.reliability === unstable` |
| `frontend-only` | ID or domain contains "FRONTEND" |
| `backend-only` | ID or domain contains "BACKEND" |
| `deprecated` | `status.lifecycle === deprecated` |
| `experimental` | `status.maturity === experimental` |

Non-matching nodes are dimmed to **8% opacity** — not removed — preserving spatial context.

### Focus Neighborhood (Node Selection)

When a node is selected, the engine computes a **neighborhood** of related nodes:

- **Domain selected:** All its features + their components + their relationships
- **Feature selected:** Its parent domains + its components + their relationship targets
- **Component selected:** Its parent domain + parent features + their domains + relationship partners

Nodes outside the neighborhood drop to 8% opacity. This provides **contextual focus** without losing orientation.

### Search Matching

Applied alongside filters. Matches against `id`, `name`, `description`, `summary`. Non-matching nodes dim to 8% opacity.

### Priority Pipeline

```
isNodePrioritized(node) = inFilter && inSearch && inNeighborhood
```

All three conditions must be met for full opacity. If any fails, opacity drops to 8%.

---

## 24. Graph Diffing & State Preservation

**Implemented in:** `packages/viewer/src/store.ts` — 194 lines

### The Problem

When SSE hot-reloads trigger, the entire graph recomputes from scratch. Without diffing, user interactions (drag, zoom, panel state) would be lost.

### Node Diffing

On each `recomputeGraph()` call:
1. Build a `Map<id, Node>` from current (pre-reload) nodes
2. For each new node from layout engine:
   - If it existed before AND its expanded state didn't change → **preserve its current position** (user may have dragged it)
   - If it existed before AND its expanded state changed → use new computed position (tree changed)
   - If it's new → use computed position

### Edge Diffing

Similar approach: preserve edge positions (user-drawn or ReactFlow-assigned) while updating labels, styles, and animation states.

### What's preserved across SSE reloads

✅ Zoom level  
✅ Pan coordinates  
✅ Node positions (if not dragged into a different expansion state)  
✅ Expanded domains/features (Sets preserved in Zustand)  
✅ Selected node  
✅ Active focus filter  
✅ Search term  

### Zustand Store Architecture

```typescript
interface ArchitectureState {
  // Data
  system: System;
  domains: Domain[];
  features: Feature[];
  components: Component[];
  relationships: Relationship[];
  invalidNodes: InvalidNode[];
  
  // UI State
  isLoading: boolean;
  isSyncing: boolean;
  selectedNodeId: string | null;
  expandedDomainIds: Set<string>;
  expandedFeatureIds: Set<string>;
  searchTerm: string;
  activeFocusFilter: string | null;
  
  // ReactFlow
  nodes: Node[];
  edges: Edge[];
  
  // Actions
  fetchArchitecture: () => Promise<void>;
  setupEventSource: () => void;
  toggleDomain: (id: string) => void;
  toggleFeature: (id: string) => void;
  selectNode: (id: string | null) => void;
  setSearchTerm: (term: string) => void;
  setFocusFilter: (filter: string | null) => void;
  recomputeGraph: () => void;
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
}
```

---

## 25. Visual Design System: Graphite & Ember

### Design Tokens

| Token | Value | Usage |
|---|---|---|
| `--bg-primary` | `#0F1115` | Canvas background |
| `--bg-secondary` | `#171A21` | Panel background |
| `--panel-surface` | `#1E232D` | Card surface |
| `--border-surface` | `#2A313D` | Subtle borders |
| `--accent-primary` | `#FF8A3D` | Primary accent (warm orange) |
| `--accent-secondary` | `#D96B2B` | Deep amber |
| `--accent-highlight` | `#FFB067` | Soft highlight |
| `--state-critical` | `#FF5F56` | Red for critical states |
| `--state-warning` | `#F4B740` | Yellow for warnings |
| `--state-stable` | `#D98C3F` | Gold for stable states |
| `--text-primary` | `#F5F7FA` | Near-white text |
| `--text-secondary` | `#B8C0CC` | Light gray text |
| `--text-muted` | `#7C8796` | Dimmed text |
| `--edge-neutral` | `#5C6675` | Standard edge |
| `--edge-active` | `#FF8A3D` | Active edge |

### Typography

| Role | Font | Weights |
|---|---|---|
| UI | Inter | 300, 400, 500, 600, 700 |
| Display/Headings | Outfit | 400, 500, 600, 700 |
| Code/IDs | JetBrains Mono | 400, 500 |

### Why Not Blue/Green

- **Blue** is overloaded across developer tooling
- **Green** creates terminal/security associations
- AAM uses **warm tones** (orange, amber, gold) for a calm, architectural feel

### Color Corridors

5 domain-specific accent colors assigned deterministically via hash:
copper (#D98C3F), deep-orange (#FF8A3D), gold (#FBBF24), amber (#F59E0B), coral (#FF6B6B)

### Logo

Minimal architectural node system — layered geometric topology. No mascots, brains, robots, or AI clichés.

---

## 26. Marketing Site (Next.js 16)

**Package:** `apps/site/`  
**Framework:** Next.js 16.2.6 (App Router)  
**Styling:** Tailwind CSS 4

### Page Structure

Single-page marketing site (`src/app/page.tsx` — 221 lines):

1. **Header Navigation** — Sticky, glassmorphic, with GitHub link and "Get Started" CTA
2. **Hero Section** — CLI demo terminal simulation, tagline, install command (`npx architecture-as-memory init`), "Watch Simulator" button
3. **Philosophy Grid** — 2-column section: text explaining "Architecture is not Code Structure" + 4 philosophy cards (Cognition-First, Progressive Hydration, Multi-Dimensional, AI Maintainer)
4. **Feature Highlights** — 3 cards: Bounded Topology Map, Command Palette Quick Focus, Offline-First Syncing
5. **Footer** — MIT License, GitHub link

### Configuration

- `next.config.ts` — Default config
- `postcss.config.mjs` — Tailwind CSS v4 PostCSS plugin
- `eslint.config.mjs` — ESLint with `eslint-config-next`
- Fonts: Outfit + Inter via next/font/google

---

## 27. AI Agent Integration System

### How AI Agents Are Trained

AAM uses a **three-tier instruction architecture**:

#### Tier 1: Bootstrap Hook

Injected into existing AI instruction files (`CLAUDE.md`, `.cursorrules`, etc.) by `aam init`. Guarded by `<!-- AAM-MARKER-START -->` markers (idempotent).

Contains minimal instructions:
- Read architecture files before implementing
- Update incrementally after implementation
- Refer to centralized skill manual for details

#### Tier 2: Skill Manual (`aam-skill.md` — 163 lines)

The centralized operational manual deployed to `/architecture/agents/aam-skill.md`. Defines:

1. **Core Philosophy** — Cognition over implementation
2. **Immutable Mutation Rules:**
   - **Rule 1:** No global regeneration. Never rewrite the entire graph.
   - **Rule 2:** Patch semantics only. Append, don't replace.
   - **Rule 3:** Stable identifiers. Never change an ID once established.
   - **Rule 4:** Responsibilities > vague descriptions. Be specific.
3. **ID Naming Conventions** — DOM-*, FEAT-*, COMP-*, ENH-*
4. **Multi-Dimensional State Tracking** — All 7 dimensions
5. **Relationship Nervous System** — 9 canonical verbs
6. **Decision Memory** — Record architectural decisions with reasons and dates
7. **Standard Operating Procedure (6 Steps):**
   - Step 1: Hydrate Context (read index)
   - Step 2: Update Components
   - Step 3: Update/Create Features
   - Step 4: Map Relationships
   - Step 5: Update the Index
   - Step 6: Log Enhancements

#### Tier 3: AI Instructions (`AI_INSTRUCTIONS.md` — 22 lines)

Quick verification workflow:
1. Read index to comprehend system structure
2. Implement code changes
3. Apply patch mutations to YAML (no global rewrites)
4. Verify new boundaries/capabilities are recorded

### Conventional Instruction Files Targeted

`CLAUDE.md`, `.cursorrules`, `AGENT.md`, `.gemini/GEMINI.md`, `AI-INSTRUCTIONS.md`, `SKILL.md`, `AGENTS.md`

---

## 28. Multi-Agent Governance Model

In multi-agent environments (Claude Desktop sub-agents, Gemini multi-agent, OpenCode task agents, Codex runtimes), ontology consistency is protected by a strict governance rule:

> **CRITICAL RULE: ONLY THE PRIMARY ORCHESTRATION AGENT MAY WRITE OR UPDATE ARCHITECTURE COGNITION DIRECTLY.**

Sub-agents may:
- Analyze implementation details
- Read architecture files
- Report findings

Sub-agents must **never**:
- Mutate architecture YAML files
- Create new nodes
- Modify relationships
- Change IDs

This prevents duplicate mutations, structural corruption, and ontology fragmentation in highly concurrent workspace operations.

---

## 29. Slash Command Protocol

AAM defines a `/aam` slash command protocol for AI assistants across all supported providers:

### Syntax

```
/aam [FEATURE-ID or DOMAIN-ID] [task description]
```

### Example

```
/aam FEAT-AUTHENTICATION Add password reset support via SMTP.
```

The AI assistant is trained to:
1. Parse the target capability and associated component schemas
2. Formulate an implementation plan respecting existing boundaries
3. Complete the coding task
4. Update affected AAM schemas incrementally

### Provider-Specific Implementations

| Provider | Trigger | Integration Point |
|---|---|---|
| Claude | `/aam [id] [task]` | CLAUDE.md or Claude Desktop |
| Cursor | `/aam @file.yaml [task]` | .cursorrules or .cursor/rules/*.mdc |
| Gemini | `/aam [name] [details]` | .gemini/GEMINI.md |
| Codex/Copilot | `#aam [id] [task]` | .github/copilot-instructions.md |

### Workflow Loop

1. **Hydrate** — run `/aam [feature] [task]` to orient the assistant
2. **Build** — implement code changes safely
3. **Document** — modify component responsibilities in specific YAML files
4. **Validate** — run `aam validate` to check integrity

---

## 30. YAML File Format Reference

### Directory Layout

```
/architecture/
├── architecture.index.yaml     # Routing manifest
├── system.yaml                 # System metadata
├── relationships.yaml          # Global relationships
├── domains/                    # Domain nodes
├── features/                   # Feature nodes
├── components/                 # Component nodes
├── enhancements/               # Enhancement nodes
└── agents/                     # AI instructions
```

### architecture.index.yaml

The **routing layer**. Maps IDs to file paths for efficient loading:

```yaml
system: system.yaml
domains:
  - id: DOM-FRONTEND
    path: domains/frontend.yaml
features:
  - id: FEAT-AUTHENTICATION
    path: features/authentication.yaml
components:
  - id: COMP-LOGIN
    path: components/login.yaml
relationships: relationships.yaml
```

### system.yaml

```yaml
type: system
schema_version: 1
id: SYS-AURABANK
name: AuraBank Core Banking Platform
summary: Enterprise-grade microservices for banking
purpose: Global system boundary and stack specifications
description: An enterprise-grade, highly resilient microservices core...
architecture_style: Distributed Event-Driven Microservices
runtime_stack:
  language: Go / TypeScript / Java
  frameworks: [Spring Boot, Express, Gin, Kafka]
operational_maturity: enterprise
repository: https://github.com/example/aurabank
created_at: '2026-05-27T00:00:00Z'
updated_at: '2026-05-27T00:00:00Z'
last_modified_by: developer
```

### domain.yaml

```yaml
type: domain
schema_version: 1
id: DOM-USER-PLATFORM
name: User & Platform Operations
summary: Coordinates user-facing operations
purpose: Manage registration, authentication, and notification boundaries
description: Coordinates user registration, API gateways, session security...
ownership: Identity Core Team
capabilities:
  - handles user registration
  - manages API gateway routing
knowledge_links:
  - type: wiki
    path: ./wiki/user-platform.md
created_at: '2026-05-27T00:00:00Z'
updated_at: '2026-05-27T00:00:00Z'
last_modified_by: developer
```

### feature.yaml

```yaml
type: feature
schema_version: 1
id: FEAT-AUTH-SECURE
name: High-Security Customer Auth
summary: Multi-factor authentication system
purpose: Provide secure customer authentication across all platforms
domains:
  - DOM-USER-PLATFORM
components:
  - COMP-GATEWAY-SERVICE
  - COMP-AUTH-PROVIDER
  - COMP-USER-REGISTRY
status:
  lifecycle: stable
  implementation: complete
  reliability: hardened
  observability: complete
  risk: low
  change_frequency: low
capabilities:
  - validates user credentials
  - issues JWT session tokens
  - handles OAuth2 callbacks
knowledge_links:
  - type: design
    path: https://excalidraw.com/auth-flow
relationships:
  - source: COMP-AUTH-PROVIDER
    target: COMP-USER-REGISTRY
    type: communicates_with
    description: Validates credentials against user store
created_at: '2026-05-27T00:00:00Z'
updated_at: '2026-05-27T00:00:00Z'
last_modified_by: developer
```

### component.yaml

```yaml
type: component
schema_version: 1
id: COMP-GATEWAY-SERVICE
name: API Edge Gateway
summary: Reverse proxy and API routing layer
purpose: Provide unified ingress and security filtering
domain: DOM-USER-PLATFORM
status:
  lifecycle: stable
  maturity: production
  reliability: hardened
  observability: complete
  risk: low
capabilities:
  - inspects ingress tokens
  - rate limits IP blocks
  - routes requests to services
knowledge_links:
  - type: repository
    path: ./services/gateway/
created_at: '2026-05-27T00:00:00Z'
updated_at: '2026-05-27T00:00:00Z'
last_modified_by: developer
```

### relationships.yaml

```yaml
relationships:
  - source: COMP-GATEWAY-SERVICE
    target: COMP-AUTH-PROVIDER
    type: communicates_with
    description: Verifies session tokens
  - source: COMP-LEDGER-CORE
    target: COMP-FRAUD-DETECTOR
    type: communicates_with
    description: Sub-millisecond fraud score check
```

---

## 31. Demo Architectures

### Project's Own AAM (`architecture/`)

```
SYS-AAM-PROJECT (Minimal Architecture System)
├── DOM-FRONTEND (UI Layer)
│   └── FEAT-AUTHENTICATION (User Authentication)
│       ├── COMP-LOGIN (Login Form Component)
│       └── COMP-AUTH-SERVICE (Auth Service)
└── DOM-BACKEND (Service Layer)
    └── FEAT-AUTHENTICATION (same feature, cross-domain)
```

Relationships: `COMP-LOGIN → communicates_with → COMP-AUTH-SERVICE`

### architecture-demo/ (AuraBank — 18 YAML files)

Full banking platform:
- **2 Domains:** User & Platform Operations, Core Transactions & Auditing
- **3 Features:** High-Security Customer Auth, High-Throughput Transaction Core, Crypto Wealth & Robo Advisory
- **10 Components:** Gateway Service, Auth Provider, User Registry, Ledger Core, Clearing House, Visa Connector, Crypto Wallet, Fraud Detector, Audit Logger, Robo Solver
- **9 Relationships:** gRPC, HTTP, event-based

### architecture-test/ (Nexus Platform — 5 YAML files)

Simpler test example:
- **2 Domains:** UI, Backend
- **1 Feature:** Authentication
- **2 Components:** Login Page, Auth Service

---

## 32. Build & Development

### Monorepo Structure

```
architecture-as-memory/
├── packages/cli/           # @architecture-as-memory/aam (npm publishable)
├── packages/viewer/        # ReactFlow graph viewer (Vite)
├── apps/site/              # Public marketing site (Next.js)
├── schema/                 # JSON Schema
├── docs/                   # Documentation
├── architecture/           # Project's own AAM
├── architecture-demo/      # Demo (AuraBank)
└── architecture-test/      # Test fixture
```

### Root Scripts

| Command | Description |
|---|---|
| `npm run dev:viewer` | Start viewer Vite dev on :3000 |
| `npm run build:viewer` | `tsc -b && vite build` |
| `npm run dev:site` | Start Next.js dev server |
| `npm test` | Run workspace tests |

### CLI Build (`npm run build` in packages/cli)

`scripts/build.js` orchestrates:
1. Installs viewer npm dependencies
2. Runs viewer TypeScript compilation and Vite build
3. Copies viewer `dist/` into `packages/cli/viewer/` for bundled distribution

### CLI Test

`packages/cli/test/cli.test.js` — 4 tests:
1. `aam init` creates basic structure
2. `aam status` runs without error
3. `aam validate` finds no errors on clean init
4. `aam doctor` runs without error

### Package Publishing

```json
{
  "name": "@architecture-as-memory/aam",
  "version": "1.0.0-beta.5",
  "publishConfig": { "access": "public" },
  "files": ["bin", "src", "viewer", "templates", "LICENSE", "README.md"]
}
```

---

## 33. Key Design Decisions

| # | Decision | Rationale |
|---|---|---|
| 1 | **YAML over JSON/DB** | Human-readable, diffable, mergeable, no tooling required |
| 2 | **Index file as routing layer** | Avoids recursive filesystem scanning, enables efficient loading |
| 3 | **Progressive expansion** | Renders only visible nodes → scales to hundreds without slowdown |
| 4 | **Cognitive edge aggregation** | Preserves relationship visibility at any expansion level |
| 5 | **SSE over polling** | Instant updates, low overhead, real-time collaboration |
| 6 | **Patch semantics** | AI agents must never regenerate globally → prevents architecture corruption |
| 7 | **Stable IDs (FNV-1a)** | Entities referenced by ID, not name → survives renames without graph breakage |
| 8 | **Multi-dimensional status** | 7 axes of operational cognition → far richer than "done/todo" |
| 9 | **Dual relationship sources** | Global + per-feature → reduces merge conflicts on relationships.yaml |
| 10 | **No external deps after install** | Fully offline, private, secure |
| 11 | **Graceful degradation everywhere** | Malformed YAML never crashes viewer or CLI |
| 12 | **Graph diffing preserves state** | User interactions survive live reloads |
| 13 | **Deterministic color corridors** | Consistent visual identity per domain across sessions |
| 14 | **Focus dimming > removal** | 8% opacity preserves spatial context instead of hiding nodes |
| 15 | **Governance + Doctor separation** | Validation = structural integrity, Doctor = cognitive health |
| 16 | **Protected fields baseline** | Git HEAD comparison prevents unexpected mutations |
| 17 | **Snapshot system** | Enables architecture diffing over time |
| 18 | **SHA-256 hash** | Deterministic topology fingerprint for change detection |

---

## Appendix: Complete File Inventory

| Path | Lines | Role |
|---|---|---|
| `packages/cli/bin/aam.js` | 240 | CLI entry point (10 commands) |
| `packages/cli/src/scaffolder.js` | 113 | Init/bootstrap engine |
| `packages/cli/src/validation-engine.js` | 465 | Governance layer |
| `packages/cli/src/doctor-engine.js` | 462 | Sanity check layer |
| `packages/cli/src/health-engine.js` | 90 | Health dashboard |
| `packages/cli/src/status-engine.js` | 164 | Status heartbeat |
| `packages/cli/src/hash-engine.js` | 142 | Deterministic hashing |
| `packages/cli/src/snapshot-engine.js` | 101 | Snapshot system |
| `packages/cli/src/exporter.js` | 628 | Offline export |
| `packages/cli/src/id-strategy.js` | 33 | FNV-1a ID generation |
| `packages/cli/src/provider-detector.js` | 156 | AI provider detection |
| `packages/cli/src/provider-capability-matrix.js` | 52 | Provider capabilities |
| `packages/cli/src/hooks/claude.js` | 72 | Claude hook installer |
| `packages/cli/templates/aam-skill.md` | 163 | AI skill manual |
| `packages/cli/templates/AI_INSTRUCTIONS.md` | 22 | AI instructions |
| `packages/cli/templates/agents/slash-commands.md` | 111 | Slash command docs |
| `packages/viewer/server.js` | 244 | Express + Chokidar server |
| `packages/viewer/src/store.ts` | 194 | Zustand store |
| `packages/viewer/src/layoutEngine.ts` | 425 | Layout + edge aggregation |
| `packages/viewer/src/types.ts` | 141 | TypeScript interfaces |
| `packages/viewer/src/App.tsx` | 229 | Main viewer component |
| `packages/viewer/src/components/CustomNodes.tsx` | 208 | 4 custom ReactFlow nodes |
| `packages/viewer/src/components/DetailSidebar.tsx` | 189 | Detail panel |
| `packages/viewer/src/components/CommandPalette.tsx` | 145 | Ctrl+K search |
| `packages/viewer/src/components/InstructionsModal.tsx` | 124 | AI rules modal |
| `packages/viewer/src/index.css` | 632 | Design system |
| `schema/aam.schema.json` | 184 | JSON Schema |
| `docs/ontology-contract.md` | 135 | Ontology doc |
| `apps/site/src/app/page.tsx` | 221 | Marketing site |
| `AGENT.md` | 771 | Original AI build guide |
| `aam.md` | *this file* | Complete system document |
