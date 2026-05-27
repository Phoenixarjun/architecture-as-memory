# Architecture As Memory (AAM) - Core Operational Skill

This file is your core operational manual for maintaining this project's Architecture As Memory (AAM).

Your role here extends beyond writing code. You are the maintainer of this system's persistent architectural cognition. As AI coding assistants dramatically accelerate implementation speed, the human developer's mental model inevitably degrades. Your job is to prevent "Cognitive Drift" by continuously updating a living, structured architectural map as you build.

Do not treat this as generating documentation. You are maintaining a highly structured, queryable graph of architectural intent, operational state, and component relationships.

---

## 1. The Core Philosophy: Cognition over Implementation

AAM stores cognitive architectural intent, not file-level topologies or AST imports.
Humans reason about capabilities (e.g., User Authentication, Invoice Generation), not filesystem paths (e.g., `src/utils/auth.ts`).

If you map the raw filesystem, the graph becomes noise. You must abstract the code into capabilities.

### The 4 Cognitive Layers
You must partition your understanding of the system into exactly four layers:
1. **System**: The top-level project identity and purpose (`system.yaml`).
2. **Domains**: High-level, coarse business or technical boundaries (e.g., Frontend, Backend, Data Pipeline).
3. **Features (The Anchor)**: Cross-cutting architectural capabilities that humans actually care about (e.g., Authentication, Billing). This is the most important layer.
4. **Components**: The actual implementations that support the features (e.g., login-page, auth-api-service, postgres-db). Components exist only to serve features.

---

## 2. The Immutable Rules of Mutation

When maintaining the AAM files inside the `/architecture` directory, you must obey these constraints absolutely:

> **RULE 1: No Global Regeneration.** Never attempt to rewrite or regenerate the entire architecture graph. You lack the context window to do this safely.
> **RULE 2: Patch Semantics Only.** You are appending knowledge, updating specific states, or inserting new nodes. You are mutating a database, not writing an essay.
> **RULE 3: Stable Identifiers.** Every entity must have an immutable ID. Never change an ID once it is established, as `relationships.yaml` depends on them.
> **RULE 4: Responsibilities > Descriptions.** Never write vague descriptions like "Handles authentication." Write actionable responsibilities like "- validates JWT tokens" and "- revokes compromised sessions".

---

## 3. Identifiers and Naming Conventions

Whenever you create a new entity, you must assign it a deterministic, unique ID. Do not use human names as primary keys.

*   **Domains**: `DOM-[NAME]` (e.g., `DOM-FRONTEND`, `DOM-CORE-API`)
*   **Features**: `FEAT-[NAME]` (e.g., `FEAT-USER-AUTH`, `FEAT-CHECKOUT`)
*   **Components**: `COMP-[NAME]` (e.g., `COMP-JWT-MIDDLEWARE`, `COMP-STRIPE-WORKER`)
*   **Enhancements**: `ENH-[NAME]` (e.g., `ENH-OAUTH-SUPPORT`)

---

## 4. Multi-Dimensional State Tracking

Architecture does not have a binary "done" state. Systems fail operationally, not just functionally. When defining or updating a Feature or Component, you must use this exact multi-dimensional state object:

```yaml
status:
  lifecycle: proposed | active | evolving | stable | deprecated
  implementation: partial | complete
  reliability: unknown | unstable | reliable | hardened
  observability: missing | partial | complete
  maturity: experimental | scaling | production | legacy
  risk: low | medium | high | critical
  change_frequency: low | moderate | high | volatile
```

*Note: If a feature is just an idea, use `lifecycle: proposed`. Never use ambiguous terms like "pending".*

---

## 5. The Relationship Nervous System

The file `/architecture/relationships.yaml` is the nervous system of the project. It connects the nodes. When you build a feature that connects two components, you must append that relationship here.

Valid relationship types:

* `depends_on`: High-level structural dependency.
* `consumes`: Listens to an event or message queue.
* `publishes_to`: Emits an event to a broker.
* `reads_from`: Queries a database, cache, or file system.
* `writes_to`: Mutates a database, cache, or file system.
* `exposes`: Provides an API routing endpoint.
* `communicates_with`: Synchronous peer-to-peer service network request.

**Format:**

```yaml
- from: COMP-LOGIN-PAGE
  to: COMP-AUTH-SERVICE
  type: communicates_with
```

---

## 6. Decision Memory (The "Why")

Humans forget why architectures evolved. Code tells you how, AAM tells you why. When you make a significant architectural decision (e.g., switching from Redis to PostgreSQL for session storage), you must record it in the relevant Component or Feature YAML.

```yaml
decisions:
  - decision: Switched from Redis to PostgreSQL for session storage.
    reason: Reduce infrastructure complexity; session invalidation volume is low enough for Postgres to handle.
    date: YYYY-MM-DD
```

---

## 7. The Standard Operating Procedure (SOP)

You must execute this workflow every time you complete a coding task, build a new feature, or refactor a module. Do not wait for the user to ask you to update the architecture.

### Step 1: Hydrate Context (Read)

Before writing, read `/architecture/architecture.index.yaml` to understand the current topology. If you are modifying an existing feature, read its specific YAML file in `/architecture/features/`.

### Step 2: Update Components (Write)

If you created a new service, database, or UI view, create a new file in `/architecture/components/COMP-[NAME].yaml`. Include its ID, Name, Domain, multi-dimensional Status, and specific Responsibilities.

### Step 3: Update/Create Features (Write)

Link your components to a Feature in `/architecture/features/FEAT-[NAME].yaml`. Ensure the feature lists the components that support it. If this is a brand new feature, create the file.

### Step 4: Map Relationships (Append)

Open `/architecture/relationships.yaml`. Append any new connections you created (e.g., the UI calling the new API, the API writing to the DB). Ensure you use exact IDs.

### Step 5: Update the Index (Append)

If you created new files, register them in `/architecture/architecture.index.yaml` so the local viewer and future agents can find them instantly without scanning the whole repository.

### Step 6: Log Enhancements (Optional)

If during your work you or the user identify technical debt, missing observability, or planned future work, create an entry in the `enhancements` array of the relevant node.

---

## Example Component Schema (For Reference)

```yaml
id: COMP-AUTH-SERVICE
name: Authentication API Service
type: component
domain: DOM-BACKEND
status:
  lifecycle: evolving
  implementation: complete
  reliability: stable
  observability: partial
  maturity: production
  risk: medium
  change_frequency: low
responsibilities:
  - validates incoming user credentials against bcrypt hashes
  - issues signed JWT session tokens with 15-minute expirations
  - handles OAuth2 callbacks for Google and GitHub providers
decisions:
  - decision: Separated from core-api into standalone service.
    reason: Allows independent scaling during login spikes.
    date: 2026-05-10
enhancements:
  - title: Add Prometheus metrics for token validation latency
    priority: medium
```

*Final Reminder: You are building a cognitive map. Prioritize clarity, exact IDs, and human-readable responsibilities. Keep the map alive.*
