# Architecture-As-Memory (AAM) Ontology & Cognition Contract

This document serves as the canonical human reference for maintaining **Architecture-As-Memory (AAM)**. It defines the schemas, structural conventions, safety governance, and cognitive philosophy to prevent architectural context drift across AI and human operations.

---

## 1. Cognitive Philosophy

AAM is **not** a low-level repository file-mapper or automated infrastructure dependency tracker. It is a **living, persistent architectural cognition layer** that describes:
*   **What** boundaries do (via high-density human cognitive compression).
*   **Why** boundaries exist (intent and strategic capability boundaries).

### Rule of Cognition Compression
1.  **Summary is "WHAT"**: A concise 1-3 line explanation of WHAT the node does in human cognitive space (max 150 characters).
2.  **Purpose is "WHY"**: Explains WHY this node exists in the topological structure and its architectural intent.
3.  **Strict Limits**: Keep all summaries, capabilities, and descriptions concise and compressed. Avoid giant walls of prose.

---

## 2. Node Type Contracts

AAM supports five distinct node classifications:

### 1. `system` (Strategic Core)
Describes the overall repository boundary, architectural style, baseline runtime stacks, and operational scope.
*   **File Path**: `architecture/system.yaml`

### 2. `domain` (Bounded Cognition Space)
Lays out high-level bounded context corridors (e.g., frontend, backend, core banking).
*   **File Path**: `architecture/domains/*.yaml`

### 3. `feature` (User or Business Capability)
Encapsulates high-level functional behaviors bridging domains.
*   **File Path**: `architecture/features/*.yaml`

### 4. `component` (Operational Implementation Unit)
Represents physical implementations (microservices, React UI blocks, libraries) implementing features.
*   **File Path**: `architecture/components/*.yaml`

### 5. `enhancement` (Planned Evolution)
Pre-staged or future architectural evolution tracks.
*   **File Path**: `architecture/enhancements/*.yaml`

---

## 3. Unified Field Contracts

Every node file must satisfy this exact parameter shape derived from our JSON schema:

| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `type` | String | **Yes** | Node type (e.g. `feature`, `component`). |
| `schema_version` | Integer | **Yes** | Active schema iteration (currently `1`). |
| `id` | String | **Yes** | Deterministic FNV-1a uppercase identifier. |
| `name` | String | **Yes** | Title (e.g. `Authentication Service`). |
| `summary` | String | **Yes** | Concise WHAT summary (max 150 chars). |
| `purpose` | String | **Yes** | Strategic WHY definition. |
| `description` | String | No | Detailed context (max 250 chars). |
| `status` | Object | No | Contains `lifecycle`, `maturity`, `reliability`, `observability`, `risk`. |
| `capabilities` | Array | No | Short action-oriented capability bullets. |
| `responsibilities` | Array | No | Ownership boundaries. |
| `knowledge_links` | Array | No | Array of **object-structured links** (`{ type, path }`). |
| `created_at` | String | No | ISO Date-Time. |
| `updated_at` | String | No | ISO Date-Time. |
| `last_modified_by`| String | No | Author or agent ID. |

---

## 4. `knowledge_links` Object Contract

> [!IMPORTANT]
> `knowledge_links` must **never** be defined as plain strings. They must strictly follow this object structure:

```yaml
knowledge_links:
  - type: wiki
    path: ./wiki/security-policy.md
  - type: design
    path: https://excalidraw.com/some-saved-board
```

Supported Link Types:
*   `wiki`
*   `design`
*   `rfc`
*   `repository`
*   `other`

---

## 5. Strict Relationship Governance

To avoid synoynm confusion or relationship spam, only the following **9 canonical relationship verbs** are permitted. The validator and doctor will flag any custom verbs:

1.  **`depends_on`**: Direct operational coupling.
2.  **`consumes`**: Reads data, messages, or API endpoints.
3.  **`publishes_to`**: Pushes events or records to a queue or data-store.
4.  **`communicates_with`**: Synchronous RPC/network call.
5.  **`reads_from`**: Direct query or extraction source.
6.  **`writes_to`**: Mutation or direct save target.
7.  **`exposes`**: Offers a network socket or entry endpoint.
8.  **`owned_by`**: Assigns specific organization/team boundaries.
9.  **`triggers`**: Direct execution callback.

### Example Relationship Registry
Inside `architecture/relationships.yaml`:
```yaml
relationships:
  - source: COMP-AUTH-SERVICE
    target: COMP-USER-REGISTRY
    type: communicates_with
    description: "Verifies credentials on login"
```

---

## 6. YAML Safety & Escape Governance

Many YAML parser libraries fail to parse unquoted sequences containing characters that look like keys, templates, or types.

> [!WARNING]
> Any string field containing any of the following characters **MUST** be enclosed inside double-quotes:
> *   **Colons** (`:`) followed by spaces (e.g. `(ttl: 3min)` -> `"(ttl: 3min)"`)
> *   **Angle brackets** (`<`, `>`) representing TypeScript generics or templates (e.g. `Promise<T>` -> `"Promise<T>"`)
> *   **Backticks** (`` ` ``) used for inline code block highlights (e.g. `runs cmd` -> `"runs cmd"`)
> *   **Inline Mappings** (curly braces `{}` or square brackets `[]` that might look like JSON syntax)

---

## 7. Progressive AI Mutation Workflow (Task 8)

When writing or changing architecture schemas in a large codebase:
1.  **Validate Constantly**: Never write 50 nodes in a single shot. **Validate every 5 nodes** by running `aam validate`.
2.  **Inspect Smells**: Run `aam doctor` to catch missing fields, oversized domains, and unquoted syntax early before completing your work.
3.  **Sync Back**: Immediately merge baseline changes into dev and main to ensure absolute model harmony.
