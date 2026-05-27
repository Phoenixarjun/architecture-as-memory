# Architecture As Memory (AAM) - Core AI Operational Skill (v1)

This file is your core operational manual for maintaining this project's Architecture As Memory (AAM) system.

Your role extends beyond writing code. You are the maintainer of this system's persistent architectural cognition. As AI coding assistants dramatically accelerate implementation speed, the human developer's mental model inevitably degrades. Your job is to prevent "Cognitive Drift" by continuously updating a living, structured architectural map as you build.

Do not treat this as generating documentation. You are maintaining a highly structured, queryable graph of architectural intent, operational state, and component relationships.

---

## 1. The Core Philosophy: Cognition over Implementation

AAM stores cognitive architectural intent, not file-level topologies or AST imports.
Humans reason about capabilities (e.g., User Authentication, Invoice Generation), not filesystem paths (e.g., `src/utils/auth.ts`).

If you map the raw filesystem, the graph becomes noise. You must abstract the code into capabilities.

### The 4 Cognitive Layers
You must partition your understanding of the system into exactly four layers:
1. **System**: The top-level project identity, style, and purpose (`system.yaml`).
2. **Domains**: High-level, coarse technical boundaries (e.g., Frontend, Backend, Data Pipeline).
3. **Features**: Cross-cutting architectural capabilities that humans actually care about (e.g., Authentication, Billing). This is the key anchor.
4. **Components**: The actual implementations that support the features (e.g., login-page, auth-api-service, postgres-db). Components exist only to serve features.

---

## 2. Dynamic Discovery & Mutation Rules

AAM employs a fully recursive, dynamic node discovery system. Node categorization is based entirely on the internal metadata `type` field, NOT file locations, names, or a manually curated index.

> **RULE 1: No Global Regeneration.** Never rewrite or regenerate the entire architecture graph. Mutate specific nodes incrementally.
> **RULE 2: Zero Index Dependencies.** Do not assume or rely on a static index file. Write new node schemas anywhere recursively under `/architecture` and they will be auto-hydrated dynamically.
> **RULE 3: Immutable Stable IDs.** Once an ID is generated, it must remain permanently unchanged. Relationships depend on them.
> **RULE 4: Purpose & Tracing.** Every node must declare a clear `purpose` field (why it exists) and temporal headers (`created_at`, `updated_at`, `last_modified_by: agent-name`) to capture evolution.

---

## 3. Deterministic ID Strategy (FNV-1a Suffixes)

To prevent ID collisions and maintain clean, stable visual graph nodes, you must generate IDs using the deterministic FNV-1a 32-bit hashing strategy of the normalized entity name:

1. Normalize the entity name (lowercase, strip non-alphanumeric chars).
2. Hash using FNV-1a (FNV prime: `16777619`, FNV offset basis: `2166136261`).
3. Extract the last 4 uppercase hex characters as the suffix.

### Format Standards:
*   **Domains**: `DOM-[4-HEX]` (e.g., `DOM-E2B8`, `DOM-7C1F`)
*   **Features**: `FEAT-[4-HEX]` (e.g., `FEAT-3F9A`, `FEAT-B39C`)
*   **Components**: `COMP-[4-HEX]` (e.g., `COMP-D18A`, `COMP-F5C1`)
*   **Enhancements**: `ENH-[4-HEX]` (e.g., `ENH-A19D`)

Always compute and output this exact ID pattern when creating a node, ensuring it aligns perfectly with the validation CLI.

---

## 4. Required Schema Fields & Template

Every AAM YAML schema must include `schema_version: 1`, explicit `type`, dynamic `id`, `purpose`, and temporal tracing parameters.

### Standard Component Template:
```yaml
schema_version: 1
id: COMP-[4-HEX-FNV]
name: Unique Component Name
summary: Concise 1-3 line cognitive overview of WHAT the component does.
type: component
domain: DOM-[4-HEX-FNV]
purpose: Explains WHY this specific implementation node exists in the system topology.
status:
  lifecycle: proposed | active | evolving | stable | deprecated
  implementation: partial | complete
  reliability: unknown | unstable | reliable | hardened
  observability: missing | partial | complete
  maturity: experimental | scaling | production | legacy
  risk: low | medium | high | critical
  change_frequency: low | moderate | high | volatile
capabilities:
  - compact bullet explaining what it does
  - another concise capability
created_at: "YYYY-MM-DD"
updated_at: "YYYY-MM-DD"
last_modified_by: "agent-name"
responsibilities:
  - validates incoming JWT tokens
  - issues session records
```

---

## 5. Interactive Relationship Nervous System

Nodes are connected dynamically. You can define local relationships inside feature nodes or globally in `/architecture/relationships.yaml`.

Valid relationship types:
* `depends_on`: High-level structural dependency.
* `consumes`: Listens to an event or message queue.
* `publishes_to`: Emits an event to a broker.
* `reads_from`: Queries a database or cache.
* `writes_to`: Mutates a database or cache.
* `exposes`: Provides an API routing endpoint.
* `communicates_with`: Synchronous network request.

```yaml
relationships:
  - source: COMP-D18A
    target: COMP-F5C1
    type: communicates_with
    description: "Authenticates session handshake"
```

---

## 6. Provider Capability Awareness

When operating inside different client environments, degrade gracefully according to active integration limits:
*   **Claude Code / Claude Desktop**: Supports full instruction injection, custom terminal slash commands, and automated pre/post-task compilation hooks.
*   **Cursor / VSCode**: Leverages inline instruction reference (`.cursorrules`). Post-task CLI execution hooks are disabled; manually run `aam validate` to ensure cohesion.
*   **Gemini / Codex**: Utilizes markdown instructions documents. Execute validation commands manually inside your shell to verify graph health.

---

## 7. Focus Dimensions & Smells Diagnostics

AAM Visual Viewer supports Focus Filters to instantly isolate high-risk, unstable, or lifecycle boundaries. As an agent, keep your schemas clean to satisfy Focus filters.

Additionally, run `aam doctor` to detect senior architectural smells before completing a task:
*   **Circular Feature Dependencies**: Direct or transitive cycles (e.g. `FEAT-A -> FEAT-B -> FEAT-A`).
*   **Oversized Domains**: Any domain aggregating more than 8 features.
*   **Highly-Central Unstable Elements**: Saturated nodes with 5+ links but 'unstable' reliability.
*   **Disconnected Cognition Islands**: Active nodes with 0 links.
*   **Feature Explosion**: Features mapping to more than 10 components.
*   **Weakly-Described / Verbose Elements**: Description sizes outside the [40, 250] character bracket.
*   **Relationship Saturation**: Nodes with 15+ incoming or outgoing lines.

Keep your descriptions concise, link wiki sources, stabilize your IDs, and keep the cognitive graph alive!

---

## 8. Strict Governance Rules for Long-Term Evolution

To protect this living system from entropy under continuous AI mutations, you must adhere strictly to these structural constraints:

1. **Unquoted Colon Safety**: Never write unquoted colons followed by spaces inside text values (e.g. `cache policy (ttl: 3min)`). Doing so breaks YAML parser libraries. Wrap any string value containing colons or colon-space sequences inside double-quotes (e.g. `"cache policy (ttl: 3min)"`) to guarantee safe YAML parsing.
2. **Cognitive Summary vs Purpose**: Every schema MUST include both:
   - `summary`: A 1-3 line concise human cognitive compression explaining *what* the node does (under 150 characters).
   - `purpose`: Explaining *why* the node exists in the topological intent structure.
3. **Compressed Descriptions**: Descriptions must not exceed 250 characters. Keep summaries compressed to maintain a high cognitive density.
4. **Operational Capability Bullets**: Define components and features using short, action-oriented capabilities. Avoid long paragraphs.
5. **Immutable Node IDs**: Once generated via the deterministic FNV-1a strategy, never alter a node's ID. All global couplings depend on them.
6. **Approved Relationship Semantics**: Relationships must only map to the central registry:
   - `depends_on`, `consumes`, `publishes_to`, `communicates_with`, `reads_from`, `writes_to`, `exposes`, `owned_by`, `triggers`.
7. **Avoid Duplicate Features/Domains**: Check the graph before creating features or domains. Search for synonyms (e.g. "auth" vs "authentication") to prevent duplicate cognitive maps.
8. **Eliminate Relationship Spam**: Only document structural, core-level dependency relationships. Do not map every low-level utility import. Keep the topology understandable.
9. **Protected Fields Integrity**: Respect nodes declaring `protected_fields`. Do not mutate protected properties without explicitly aligning with baseline commits.
10. **Primary Orchestration Agent Only**: Sub-agents may analyze implementation details but must never mutate architecture cognition directly. Only the primary orchestration agent may write or update architecture YAML nodes. This prevents ontology fragmentation, duplicate mutations, and topology corruption across multi-agent runtimes (such as Claude Desktop sub-agents, Gemini multi-agent workflows, OpenCode task agents, or Codex runtimes).
