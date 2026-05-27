# Architecture As Memory (AAM) - AI Agent Instructions

This repository uses Architecture-As-Memory (AAM) to maintain real-time architectural cognition. When working inside this codebase, you must adhere to the core operational manual to prevent cognitive drift.

---

## 1. Primary Operational Contract

All autonomous AI agents and pair-programming assistants must load, read, and strictly execute the rules defined in the AAM core operational skill manual:

`/architecture/agents/aam-skill.md`

This manual outlines the immutable rules of mutation, identifiers and naming conventions, multi-dimensional state tracking, relationships mapping, decision memory logs, and standard operating procedures.

---

## 2. Quick Verification Workflow

1. Read the index at `/architecture/architecture.index.yaml` to comprehend the system's structural domains, features, and components.
2. Implement your code changes in the active codebase workspace.
3. Apply patch mutations to the target YAML files inside `/architecture/` to accurately reflect your changes. Do not perform global rewrites or overwrite stable node IDs.
4. Verify that all newly introduced boundaries, capabilities, and dependencies are cleanly recorded.
