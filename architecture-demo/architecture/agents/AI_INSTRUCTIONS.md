# Architecture As Memory (AAM)

This repository uses Architecture-As-Memory (AAM) to maintain real-time architectural cognition. When working inside this codebase, you must adhere to the following cognitive principles and modification rules.

---

## 🧠 Core Philosophy
AAM stores cognitive architectural intent, not file-level topologies or imports. Humans reason about **capabilities** (e.g., payments, user invitations) rather than filesystem paths. You must maintain this human-oriented perspective.

We partition our understanding into four key layers:
1. **System**: The global system overview and runtime stack.
2. **Domains**: Coarse boundary mappings (e.g., `frontend`, `backend`, `infrastructure`).
3. **Features**: High-level, cross-cutting architectural capabilities (e.g., `authentication`, `billing`).
4. **Components**: Real implementations supporting features (e.g., `login-page` UI, `auth-service` API, `postgres-db`).

---

## 🤖 AI Agent Rules & Mutations

> [!IMPORTANT]
> **RULE 1**: NEVER globally regenerate or overwrite existing YAML files.
> **RULE 2**: After creating/modifying a capability, you MUST update AAM configuration files.
> **RULE 3**: Use ONLY patch semantics. Append new relationships, update operational states, or insert new components. Do not overwrite or remove stable identifiers.

### 1. Naming & Identifiers
Ensure all IDs are stable, deterministic, and unique.
- Domains: `DOM-XXXX` (e.g., `DOM-FRONTEND`)
- Features: `FEAT-XXXX` (e.g., `FEAT-USER-AUTH`)
- Components: `COMP-XXXX` (e.g., `COMP-JWT-SERVICE`)
- Enhancements: `ENH-XXXX` (e.g., `ENH-OAUTH-SUPPORT`)

### 2. Multi-Dimensional States
Always use rich, multi-dimensional states rather than binary "done" statuses. Apply these attributes to features and components:

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

### 3. Relationships Mapping
AAM maps operational memory using relationships. When defining relationships in `/architecture/relationships.yaml`, support the following semantics:
- `depends_on`: High-level service dependency.
- `consumes`: Event or message bus subscription.
- `publishes_to`: Event emission.
- `reads_from`: Database or storage read.
- `writes_to`: Database or storage write.
- `owned_by`: Team ownership mapping.
- `exposes`: API routing exposure.
- `communicates_with`: Peer service network request.

---

## 📝 Modification Procedure
1. **Read AAM Index**: Before implementing, read `/architecture/architecture.index.yaml` and related `/architecture/features` or `/architecture/domains` files.
2. **Implement Feature**: Develop your changes in the codebase.
3. **Update Cognition Layer**:
   - Insert new features in `/architecture/features/FEAT-*.yaml`.
   - Update component attributes in `/architecture/components/COMP-*.yaml`.
   - Document any new connections in `/architecture/relationships.yaml`.
   - Reflect changes back into `/architecture/architecture.index.yaml`.
