# Architecture-as-Memory (AAM) — Complete Analysis

> **Version:** 1.0.0 | **License:** MIT | **Author:** Naresh.B.A  
> **Repository:** https://github.com/Phoenixarjun/architecture-as-memory  
> **Tagline:** *Living cognitive architecture maps for AI coding assistants.*

---

## 1. Project Overview

Architecture-as-Memory (AAM) is a **persistent architectural cognition layer** designed for AI-native software engineering workflows. It solves the problem of developers losing mental models of their system as AI coding assistants (Claude, Cursor, Gemini, Codex) mutate the codebase at machine speed.

**What it is not:**
- Not a documentation generator
- Not a static dependency visualizer
- Not a wiki system
- Not a repo indexing tool
- Not a UML diagram tool

**Core promise:** A developer returning after weeks away can re-understand the system within **two minutes** by looking at the AAM graph.

**Key architectural principles:**
- Fully **local-first**, **offline-capable** — no backend, no cloud, no database, no AI API dependency
- Models **architectural cognition** (capabilities, boundaries) not filesystem topology (imports, AST, files)
- Maintained primarily by **AI coding assistants** via incremental patch mutations
- Uses **YAML files** stored inside the repository as the persistence format
- Rendered as an **interactive ReactFlow graph** with progressive expansion

---

## 2. Product Philosophy

The central insight: humans don't reason about software at the file level. They reason about **capabilities** — authentication, payments, analytics, search, notifications, onboarding, deployment.

Existing tools (dependency graphs, UML, import trees) fail because they visualize implementation detail. AAM instead models **four cognitive layers**:

| Layer | Purpose | Example |
|---|---|---|
| **System** | Project identity & architecture context | "AuraBank Core Banking Platform" |
| **Domain** | Major operational boundaries | Frontend, Backend, Core Banking |
| **Feature** | Cross-cutting architectural capabilities (the anchor layer) | Authentication, Core Ledger, Wealth Advisor |
| **Component** | Implementation containers supporting features | gateway-service, auth-provider, ledger-core |

**Key rule:** Features span multiple domains. Components support features. Features do NOT support components. This keeps the model human-oriented.

Success is not "graph accuracy" — it's **"can a developer re-understand the system within 2 minutes?"**

---

## 3. System Architecture

### High-Level Data Flow

```
AI Agent writes patch  ──►  /architecture/*.yaml  ──►  Chokidar file watcher
                                                           │
                                                           ▼
                                                    Express Server (port 4200)
                                                           │
                                              ┌────────────┼────────────┐
                                              ▼            ▼            ▼
                                        GET /api/   SSE /api/    Static Vite
                                        architecture  events     Frontend SPA
                                              │            │
                                              ▼            ▼
                                        Zustand Store ◄───┘
                                              │
                                              ▼
                                        Layout Engine (deterministic tree)
                                              │
                                              ▼
                                        ReactFlow Graph (React 19)
                                              │
                                    ┌─────────┼─────────┐
                                    ▼         ▼         ▼
                              DomainNode  FeatureNode  ComponentNode
                              (expandable) (expandable) (leaf node)
```

### Runtime Architecture

```
┌─────────────────────────────────────────────────────┐
│                   User Browser                        │
│  ┌───────────────────────────────────────────────┐   │
│  │  ReactFlow Canvas (App.tsx)                    │   │
│  │  ├── DomainNode (Explore/Collapse)             │   │
│  │  ├── FeatureNode (Implementation/Collapse)     │   │
│  │  ├── ComponentNode (leaf)                      │   │
│  │  ├── DetailSidebar (slideover panel)           │   │
│  │  ├── CommandPalette (Ctrl+K search)            │   │
│  │  ├── InstructionsModal (AI agent rules)         │   │
│  │  └── ReactFlow Background + Controls           │   │
│  └───────────────────────────────────────────────┘   │
│         ▲                                            │
│         │ Re-render on state change                   │
│         ▼                                            │
│  ┌───────────────────────────────────────────────┐   │
│  │  Zustand Store (store.ts)                     │   │
│  │  - Architecture data (system/domains/features │   │
│  │    /components/relationships)                  │   │
│  │  - expandedDomainIds / expandedFeatureIds      │   │
│  │  - selectedNodeId / searchTerm                 │   │
│  │  - nodes[] / edges[] (ReactFlow)               │   │
│  └───────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
         │
         │ HTTP + SSE
         ▼
┌─────────────────────────────────────────────────────┐
│              Express 5 Server (server.js)             │
│  - GET /api/architecture → hydrated YAML JSON       │
│  - GET /api/events → SSE live reload stream         │
│  - Serves static Vite build                         │
│  - Chokidar watches /architecture/**/*.{yaml,yml}   │
│  - Cognitive Auto-Hydration (auto-discovers files)  │
└─────────────────────────────────────────────────────┘
         │
         │ Reads
         ▼
┌─────────────────────────────────────────────────────┐
│              /architecture/ YAML files                │
│  architecture.index.yaml  (routing/hydration index)  │
│  system.yaml              (system metadata)          │
│  relationships.yaml       (global relationship edges)│
│  domains/*.yaml           (domain cognition nodes)    │
│  features/*.yaml          (feature capability nodes)  │
│  components/*.yaml        (implementation nodes)      │
│  enhancements/*.yaml      (future evolution plans)    │
│  agents/                  (AI instruction files)      │
└─────────────────────────────────────────────────────┘
```

---

## 4. Directory Structure

```
architecture-as-memory/
├── .gitignore
├── AGENT.md                          # 771-line master system blueprint / AI build guide
├── LICENSE                           # MIT License
├── package.json                      # Monorepo root (npm workspaces)
├── package-lock.json
│
├── apps/
│   └── site/                         # Public marketing website (Next.js 16)
│       ├── AGENTS.md                 # AI agent notes for Next.js 16
│       ├── CLAUDE.md                 # References AGENTS.md
│       ├── eslint.config.mjs
│       ├── next.config.ts
│       ├── postcss.config.mjs
│       ├── package.json              # next 16.2.6, react 19, tailwindcss 4
│       ├── tsconfig.json
│       ├── public/                   # Static SVG icons
│       └── src/
│           ├── app/
│           │   ├── globals.css       # Tailwind v4 + base theme variables
│           │   ├── layout.tsx        # Root layout (Geist fonts)
│           │   └── page.tsx          # Landing page (hero, philosophy, features, footer)
│
├── packages/
│   ├── cli/                          # CLI tool: `npx architecture-as-memory`
│   │   ├── package.json              # "bin": { "aam": "./bin/aam.js" }, type: module
│   │   ├── bin/
│   │   │   └── aam.js               # CLI entry: "aam init", "aam dev"
│   │   ├── src/
│   │   │   ├── index.js             # Re-exports bootstrap
│   │   │   └── scaffolder.js        # Scaffold logic (113 lines)
│   │   └── templates/               # Default templates for init
│   │       ├── AI_INSTRUCTIONS.md   # AI agent instructions template
│   │       ├── aam-skill.md         # Core operational skill manual (163 lines)
│   │       └── schemas/             # 18 default YAML schema files
│   │           ├── architecture.index.yaml
│   │           ├── system.yaml
│   │           ├── relationships.yaml
│   │           ├── domains/{user-platform,core-banking}.yaml
│   │           ├── features/{auth-secure,core-ledger,wealth-advisor}.yaml
│   │           └── components/{gateway-service,auth-provider,user-registry,
│   │                          ledger-core,clearing-house,visa-connector,
│   │                          crypto-wallet,fraud-detector,audit-logger,
│   │                          robo-solver}.yaml
│   │
│   └── viewer/                       # Local graph viewer (React + Vite)
│       ├── package.json              # reactflow, zustand, express, chokidar
│       ├── index.html                # Vite entry HTML
│       ├── vite.config.ts            # Vite config + proxy /api → :4200
│       ├── server.js                 # Express server (203 lines)
│       ├── tsconfig.json / tsconfig.app.json / tsconfig.node.json
│       ├── eslint.config.js
│       ├── public/
│       │   ├── AAMLogo.png           # Brand logo
│       │   ├── favicon.svg
│       │   └── icons.svg
│       └── src/
│           ├── main.tsx              # React entry point
│           ├── App.tsx               # Main app (200 lines)
│           ├── App.css               # Minor styles (not actively used)
│           ├── index.css             # Complete design system (632 lines)
│           ├── types.ts              # TypeScript interfaces (89 lines)
│           ├── store.ts              # Zustand store (142 lines)
│           ├── layoutEngine.ts       # Graph layout algorithm (211 lines)
│           ├── assets/               # Static images
│           └── components/
│               ├── CustomNodes.tsx        # DomainNode, FeatureNode, ComponentNode (150 lines)
│               ├── DetailSidebar.tsx      # Slideover detail panel (189 lines)
│               ├── CommandPalette.tsx     # Ctrl+K search (145 lines)
│               └── InstructionsModal.tsx  # AI agent instructions modal (124 lines)
│
├── architecture-demo/               # AuraBank demo (18 YAML files)
│   └── architecture/                # Full banking platform example
│
└── architecture-test/               # Minimal test architecture (simpler example)
    └── architecture/                # 2 domains, 1 feature, 2 components
```

---

## 5. Component Deep-Dives

### 5.1 CLI Package (`packages/cli/`)

**Entry point:** `bin/aam.js` — Commander-based CLI with two commands:

#### `aam init`
- Creates `/architecture/{domains,features,components,enhancements,agents}` directory structure
- Safely copies 18 template files (skips if already exist)
- Scans for existing AI instruction files (`CLAUDE.md`, `.cursorrules`, `AGENT.md`, `.gemini/GEMINI.md`, `AI-INSTRUCTIONS.md`)
- Appends AAM bootstrap hooks (guarded by `<!-- AAM-MARKER-START -->` markers, idempotent)
- Bootstrap hook tells AI to read architecture before coding, update YAML after

#### `aam dev`
- Validates `/architecture` directory exists
- Resolves watcher server path (supports both production bundle and monorepo dev)
- Starts Express server on configurable port (default 4200)
- Serves static Vite build from `viewer/dist/`
- Opens browser automatically (`start` on Windows, `open` on macOS, `xdg-open` on Linux)

**Scaffolder** (`src/scaffolder.js`):
- 113 lines of pure ESM
- Uses `fs-extra` for robust file operations
- Creates subdirectories with `ensureDir`
- Copies templates with `copy` (skips existing with `pathExists`)
- Injects marker-guarded bootstrap snippets

### 5.2 Viewer Package (`packages/viewer/`)

**Server** (`server.js` — 203 lines):
- **`getHydratedArchitecture(archDir)`** — Core function that:
  1. Reads `architecture.index.yaml` as the routing layer
  2. Parses system metadata from `system.yaml`
  3. Loads domains, features, components, enhancements from indexed paths
  4. **Cognitive Auto-Hydration** — auto-discovers orphaned `.yaml`/`.yml` files in subdirectories
  5. Loads global relationships from `relationships.yaml`
  6. Also collects local relationships defined inside feature YAML files
  7. Returns unified JSON: `{ system, domains, features, components, enhancements, relationships }`

- **SSE Live Reload:**
  - `GET /api/events` — Server-Sent Events endpoint
  - Maintains array of connected clients
  - 30-second keep-alive heartbeat
  - Clean disconnect handling

- **Chokidar File Watcher:**
  - Watches entire `/architecture` directory recursively
  - Ignores dotfiles
  - `awaitWriteFinish` with 100ms stability threshold
  - On any change → re-hydrates entire graph → broadcasts `update` event to all SSE clients

**Layout Engine** (`layoutEngine.ts` — 211 lines):

Deterministic tree layout with progressive expansion:

```
DOMAIN_1 (x=100)          DOMAIN_2 (x=1000)        DOMAIN_3 (x=1900)
    │                           │                        │
    ├── FEAT_1 (y=340)          ├── FEAT_3 (y=340)       └── FEAT_4 (y=340)
    │       │                   │       │
    │       ├── COMP_A          │       ├── COMP_D
    │       ├── COMP_B          │       └── COMP_E
    │       └── COMP_C          │
    │                           │
    └── FEAT_2 (y=600)          └── ...
```

Positioning constants:
- `DOMAIN_GAP_X = 900` — horizontal spacing between domains
- Features placed 20px right, 240px down from domain
- Components placed 360px right, 80px up relative to feature (staggered vertically)

**Cognitive Edge Aggregator Engine:**
- **Scenario A:** Both source and target nodes visible → direct edge
- **Scenario B:** Components hidden but parent features visible → aggregate to feature-feature edge (dashed, amber)
- **Scenario C:** Only domains visible → aggregate to domain-domain edge (dotted, gold, labeled "coupling")
- Deduplication via `relationsCache` Set
- Active selection highlights connected edges

**Zustand Store** (`store.ts` — 142 lines):

State shape:
```typescript
interface ArchitectureState {
  system: System;
  domains: Domain[];
  features: Feature[];
  components: Component[];
  relationships: Relationship[];
  isLoading: boolean;
  isSyncing: boolean;
  selectedNodeId: string | null;
  expandedDomainIds: Set<string>;
  expandedFeatureIds: Set<string>;
  searchTerm: string;
  nodes: Node[];
  edges: Edge[];
  // Actions:
  fetchArchitecture: () => Promise<void>;
  setupEventSource: () => void;           // SSE connection
  toggleDomain: (id: string) => void;      // Expand/collapse
  toggleFeature: (id: string) => void;
  selectNode: (id: string | null) => void;
  setSearchTerm: (term: string) => void;
  recomputeGraph: () => void;              // Calls layout engine
  onNodesChange: OnNodesChange;            // ReactFlow drag etc.
  onEdgesChange: OnEdgesChange;
}
```

Key behaviors:
- `fetchArchitecture` → calls `GET /api/architecture` → stores data → calls `recomputeGraph`
- `setupEventSource` → opens SSE to `/api/events` → listens for `update` events → updates data → calls `recomputeGraph`
- `toggleDomain`/`toggleFeature` → mutates expanded sets → calls `recomputeGraph`
- `recomputeGraph` → calls `computeGraphLayout` with current state → sets new `nodes`/`edges`
- Hot reload preserves expansion state, zoom level, selection

### 5.3 TypeScript Data Model (`types.ts`)

```typescript
interface System {
  id: string;                    // e.g., "SYS-AURABANK"
  name: string;
  description: string;
  architecture_style?: string;
  runtime_stack?: { language: string; frameworks: string[] };
  operational_maturity?: string;
  repository?: string;
}

interface Domain {
  id: string;                    // e.g., "DOM-USER-PLATFORM"
  name: string;
  description: string;
  ownership?: string;
}

interface Feature {
  id: string;                    // e.g., "FEAT-AUTH-SECURE"
  name: string;
  description: string;
  domains: string[];             // References Domain IDs
  components: string[];          // References Component IDs
  status?: MultiDimensionalStatus;
  relationships?: Relationship[]; // Local relationships
}

interface Component {
  id: string;                    // e.g., "COMP-GATEWAY-SERVICE"
  name: string;
  description: string;
  domain: string;                // References Domain ID
  status?: MultiDimensionalStatus;
}

interface MultiDimensionalStatus {
  lifecycle: 'proposed' | 'active' | 'evolving' | 'stable' | 'deprecated';
  implementation: 'partial' | 'complete';
  reliability: 'unknown' | 'unstable' | 'reliable' | 'hardened';
  observability: 'missing' | 'partial' | 'complete';
  maturity: 'experimental' | 'scaling' | 'production' | 'legacy';
  risk: 'low' | 'medium' | 'high' | 'critical';
  change_frequency: 'low' | 'moderate' | 'high' | 'volatile';
}

interface Relationship {
  source: string;                // Node ID
  target: string;                // Node ID
  type: string;                  // grpc | http | event | communicates_with | exposes | ...
  description?: string;
}
```

### 5.4 Custom ReactFlow Nodes (`CustomNodes.tsx`)

Three node types, all using CSS classes from the design system:

**DomainNode** (320px wide):
- Gradient background, 2px border
- Shows name, ID, description, ownership
- "Explore" / "Collapse" toggle button
- Calls `toggleDomain` on click

**FeatureNode** (280px wide):
- Orange-tinted border (`rgba(255,138,61,0.3)`)
- Shows lifecycle and risk badges
- Component count display
- "Implementation" / "Collapse" toggle button
- Calls `toggleFeature` on click

**ComponentNode** (260px wide):
- Dashed border style (implementation-level nodes)
- Shows maturity and lifecycle badges
- No expand button (leaf node)

All nodes have:
- Hover glow effect
- Active selection state (brighter border + glow)
- ReactFlow handles (source right, target left)
- `stopPropagation` to prevent ReactFlow from swallowing clicks

### 5.5 Detail Sidebar (`DetailSidebar.tsx`)

Slideover panel (420px wide) that appears when a node is selected:
- **Header:** Type badge, name, ID, close button
- **Cognitive Description:** Full description text
- **Operational Cognition Matrix:** Table of all status dimensions with color-coded badges
- **Ownership:** Team/owner display with user icon
- **Dependency Relationships:** Two sections — outbound (dependencies) and inbound (consumers) — each showing target/source IDs with relationship type

### 5.6 Command Palette (`CommandPalette.tsx`)

Ctrl+K search interface:
- Searches across all domains, features, and components
- Matches against name, ID, and description
- Keyboard navigation (arrow keys, Enter, Escape)
- **On selection:**
  1. Auto-expands parent domains/features (if not already expanded)
  2. Selects the node (opens details panel)
  3. Centers viewport with `setCenter` (1.1x zoom, 800ms animation)
  4. 150ms delay to allow ReactFlow to render expanded nodes first

### 5.7 Instructions Modal (`InstructionsModal.tsx`)

Modal dialog explaining AI agent integration:
- Centralized prompting rules
- Strict mutation rules (no global rewrites, stable IDs, record responsibilities)
- Reference AI rules snippet (code block)
- Acknowledge & Close button

---

## 6. YAML Schema Design

### Architecture Index (`architecture.index.yaml`)

The **routing and hydration layer** — central manifest that tells the viewer where to find all files:

```yaml
system: system.yaml
domains:
  - id: DOM-USER-PLATFORM
    path: domains/user-platform.yaml
  - id: DOM-CORE-BANKING
    path: domains/core-banking.yaml
features:
  - id: FEAT-AUTH-SECURE
    path: features/auth-secure.yaml
  # ...
components:
  - id: COMP-GATEWAY-SERVICE
    path: components/gateway-service.yaml
  # ...
relationships: relationships.yaml
```

### System YAML (`system.yaml`)

```yaml
id: SYS-AURABANK
name: AuraBank Core Banking Platform
description: Enterprise-grade, highly resilient microservices core...
architecture_style: Distributed Event-Driven Microservices
runtime_stack:
  language: Go / TypeScript / Java
  frameworks: [Spring Boot, Express, Gin, Kafka, React Flow]
operational_maturity: enterprise
repository: https://github.com/Phoenixarjun/aurabank-platform
```

### Domain YAML

```yaml
id: DOM-USER-PLATFORM
name: User & Platform Operations
description: Coordinates user registration, API gateways, session security...
ownership: Identity Core Team
```

### Feature YAML

```yaml
id: FEAT-AUTH-SECURE
name: High-Security Customer Auth
description: Coordinates API Gateway filters, secure JWT generation...
domains:
  - DOM-USER-PLATFORM
components:
  - COMP-GATEWAY-SERVICE
  - COMP-AUTH-PROVIDER
  - COMP-USER-REGISTRY
status:
  lifecycle: stable
  implementation: production-hardened
  reliability: hardened
  observability: complete
  risk: low
```

### Component YAML

```yaml
id: COMP-GATEWAY-SERVICE
name: API Edge Gateway
description: Reverse proxy layer based on Spring Cloud Gateway...
domain: DOM-USER-PLATFORM
status:
  lifecycle: completed
  maturity: production
  reliability: hardened
  observability: complete
  risk: low
```

### Relationships YAML (`relationships.yaml`)

```yaml
relationships:
  - source: COMP-GATEWAY-SERVICE
    target: COMP-AUTH-PROVIDER
    type: grpc
    description: Verifies access session tokens
  # ... 9 relationships in total for the demo
```

**Relationship types supported:** `depends_on`, `consumes`, `publishes_to`, `reads_from`, `writes_to`, `exposes`, `communicates_with`, `grpc`, `http`, `event`

---

## 7. AI Agent Integration

AAM is designed to be maintained primarily by AI coding assistants, not humans.

### Instruction Injection

When `aam init` runs, it appends this bootstrap snippet to existing AI instruction files:

```
<!-- AAM-MARKER-START -->
## Architecture As Memory (AAM)
This repository uses Architecture-As-Memory (AAM)...
- Before implementing, read '/architecture/architecture.index.yaml'
- After completing work, incrementally update '/architecture' YAML
- Refer to '/architecture/agents/aam-skill.md' for core operational rules
<!-- AAM-MARKER-END -->
```

### Core Operational Skill (`aam-skill.md` — 163 lines)

The most important file. Defines:

1. **Core Philosophy:** Cognition over implementation
2. **4 Cognitive Layers:** System → Domains → Features → Components
3. **Immutable Mutation Rules:**
   - Rule 1: No global regeneration
   - Rule 2: Patch semantics only
   - Rule 3: Stable identifiers never change
   - Rule 4: Responsibilities > vague descriptions
4. **ID Naming Conventions:** `DOM-*`, `FEAT-*`, `COMP-*`, `ENH-*`
5. **Multi-Dimensional State Tracking:** lifecycle, implementation, reliability, observability, maturity, risk, change_frequency
6. **Relationship Nervous System:** The `relationships.yaml` file
7. **Decision Memory:** Recording architectural decisions with reasons and dates
8. **Standard Operating Procedure (6 steps):**
   - Step 1: Hydrate Context (read index)
   - Step 2: Update Components (write new YAML or patch)
   - Step 3: Update/Create Features
   - Step 4: Map Relationships (append)
   - Step 5: Update Index (append new file entries)
   - Step 6: Log Enhancements (optional)

---

## 8. Visual Design System ("Graphite & Ember")

The design deliberately avoids blue (overused in dev tools) and green (terminal associations), instead using a warm, architectural palette.

### Design Tokens (`index.css` — 632 lines)

```css
--bg-primary: #0F1115;       // Deep charcoal (canvas background)
--bg-secondary: #171A21;     // Panel background
--panel-surface: #1E232D;    // Card surface
--border-surface: #2A313D;   // Subtle borders
--accent-primary: #FF8A3D;   // Warm orange (primary accent)
--accent-secondary: #D96B2B; // Deep amber
--accent-highlight: #FFB067; // Soft highlight
--state-critical: #FF5F56;   // Red for critical states
--state-warning: #F4B740;    // Yellow for warnings
--state-stable: #D98C3F;     // Gold for stable states
--text-primary: #F5F7FA;     // Near-white
--text-secondary: #B8C0CC;   // Light gray
--text-muted: #7C8796;       // Dimmed text
--edge-neutral: #5C6675;     // Standard edge color
--edge-active: #FF8A3D;      // Active/highlighted edge
```

### Typography
- **UI:** Inter (300-700 weights)
- **Display/Headings:** Outfit (400-700 weights)
- **Code/IDs:** JetBrains Mono (400-500 weights)

### Node Styling
- All nodes: 12px border radius, 1.5px border, shadow premium
- Domain nodes: Gradient background, 2px border, 320px wide
- Feature nodes: Orange-tinted border (0.3 opacity), 280px wide
- Component nodes: Dashed border, 260px wide
- Hover: Glow shadow + translateY(-2px)
- Active: Brighter border + 25px glow radius

### Status Badges
Color-coded per dimension:
- Lifecycle: proposed (muted), active (gold), evolving (orange), stable (gold+border), deprecated (red, faded)
- Risk: critical (red+border), high (red), medium (yellow), low (gold)

### Edge Styling
- Neutral edges: `#5C6675`, 1.5px
- Active edges: `#FF8A3D`, 2.5px, animated dash
- Aggregated feature edges: `#FFB067`, 1.2px, animated dashed
- Aggregated domain edges: `#D98C3F`, 1px, dotted, labeled "coupling"

---

## 9. Demo Architectures

### architecture-demo/ (AuraBank — 18 YAML files)

A full-fledged banking platform example with:
- **2 Domains:** User & Platform Operations, Core Transactions & Auditing
- **3 Features:** High-Security Customer Auth, High-Throughput Transaction Core, Crypto Wealth & Robo Advisory
- **10 Components:** Gateway Service, Auth Provider, User Registry, Ledger Core, Clearing House, Visa Connector, Crypto Wallet, Fraud Detector, Audit Logger, Robo Solver
- **9 Relationships:** gRPC, HTTP, and event-based connections

### architecture-test/ (Minimal — 5 YAML files)

A simpler test example:
- **2 Domains:** Frontend, Backend
- **1 Feature:** User Auth
- **2 Components:** Login Page, Auth Service
- Relationships between auth-service and login-page

---

## 10. Key Dependencies

### CLI (`packages/cli`)
| Package | Version | Purpose |
|---|---|---|
| chalk | ^4.1.2 | Terminal colors |
| commander | ^11.0.0 | CLI framework |
| fs-extra | ^11.1.1 | File system operations |
| yaml | ^2.3.1 | YAML parsing |

### Viewer (`packages/viewer`)
| Package | Version | Purpose |
|---|---|---|
| react | ^19.2.6 | UI framework |
| react-dom | ^19.2.6 | React DOM |
| reactflow | ^11.11.4 | Graph rendering |
| @reactflow/background | ^11.3.14 | Grid background |
| @reactflow/controls | ^11.2.14 | Zoom controls |
| @reactflow/node-resizer | ^2.2.14 | Node resize |
| zustand | ^5.0.13 | State management |
| express | ^5.2.1 | HTTP server |
| chokidar | ^5.0.0 | File watcher |
| cors | ^2.8.6 | CORS middleware |
| fs-extra | ^11.3.5 | File system |
| yaml | ^2.9.0 | YAML parsing |
| chalk | ^5.6.2 | Server terminal colors |

**Dev deps:** TypeScript ~6.0, Vite ^8.0, ESLint ^10.3, @vitejs/plugin-react ^6.0

### Site (`apps/site`)
| Package | Version | Purpose |
|---|---|---|
| next | 16.2.6 | React framework (App Router) |
| react | 19.2.4 | UI framework |
| react-dom | 19.2.4 | React DOM |
| tailwindcss | ^4 | CSS framework |
| @tailwindcss/postcss | ^4 | PostCSS integration |

---

## 11. Git History

- **Single branch:** `dev`
- **Remote tracked:** `origin/main`
- **Commits:** `031b00d` — Initial commit (monolithic first commit with entire codebase)
- Project is in early stages — single initial commit

---

## 12. Development Workflow

### Commands (from root `package.json`)

```bash
# Start viewer locally
npm run dev:viewer        # Vite dev on :3000, Express on :4200

# Start marketing site
npm run dev:site          # Next.js dev server

# Build
npm run build:viewer      # tsc -b && vite build
npm run build:cli         # Build CLI for distribution

# Test
npm test                  # npm test --workspaces
```

### Development Flow
1. Make changes to viewer source in `packages/viewer/src/`
2. Vite hot-reloads the React frontend on port 3000
3. Express server (manual start or via `aam dev`) serves API on port 4200
4. Change YAML files in any `/architecture` directory → Chokidar triggers SSE update → Graph auto-refreshes

---

## 13. File Summary

| Category | Count | Files |
|---|---|---|
| Root config | 3 | package.json, .gitignore, AGENT.md |
| CLI source | 3 | aam.js, index.js, scaffolder.js |
| CLI templates | 20 | 2 markdown + 18 YAML schemas |
| Viewer source | 11 | types.ts, store.ts, layoutEngine.ts, App.tsx, main.tsx, server.js, vite.config.ts, 4 components, index.css, App.css |
| Viewer config | 6 | package.json, index.html, tsconfig.json, tsconfig.app.json, tsconfig.node.json, eslint.config.js |
| Site source | 3 | page.tsx, layout.tsx, globals.css |
| Site config | 6 | package.json, tsconfig.json, next.config.ts, postcss.config.mjs, eslint.config.mjs, AGENTS.md |
| Demo YAML | 18 | 1 index + 1 system + 1 relationships + 2 domains + 3 features + 10 components |
| Test YAML | 5 | 1 index + 1 system + 1 relationships + 2 domains + 1 feature + 2 components |
| **Total** | **~75 files** | |

---

## 14. Key Design Decisions Summary

1. **YAML over JSON/DB:** Human-readable, diffable, mergeable, no tooling required
2. **Index file as routing layer:** Avoids recursive filesystem scanning, enables efficient loading
3. **Progressive expansion:** Renders only what's needed → scales to hundreds of nodes
4. **Cognitive edge aggregation:** Preserves relationship visibility at any expansion level
5. **SSE over polling:** Instant updates, low overhead, real-time collaboration possible
6. **Patch semantics:** AI agents must never regenerate globally → prevents architecture corruption
7. **Stable IDs:** Entities are referenced by ID, not name → survives renames
8. **Multi-dimensional status:** 7 axes of operational cognition → far richer than "done/todo"
9. **Local relationships in features:** Reduces merge conflicts on `relationships.yaml`
10. **No external dependencies after install:** Fully offline, private, secure
