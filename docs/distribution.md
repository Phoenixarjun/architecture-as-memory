# AAM Cross-Ecosystem Distribution & Wrapper Architecture

This document describes the architectural philosophy, deployment topology, and operational guidelines for distributing **Architecture-As-Memory (AAM)** across multiple native developer ecosystems.

---

## 1. The Core Philosophy: Single-Runtime Consistency

AAM is **not** a multi-language framework. It does not duplicate, fork, or rewrite its core ontology, parser, validator, or visualizer code inside each language ecosystem.

Instead, AAM is built as a **single, unified TypeScript/Node.js core runtime** that is distributed to other language environments using **extremely thin, lightweight wrappers**.

### Why Native Rewrites are Intentionally Avoided
*   **Ontology Protection**: A single minor discrepancy in schema validation, FNV-1a identifier calculation, or relationship syntax parsing across different ecosystem ports would lead to immediate **cross-language ontology drift**. An AI assistant using the Python validator would interpret boundaries differently than an agent running on Node.js.
*   **Zero Feature Duplication**: By maintaining exactly *one* core codebase, updates to layout rendering (ReactFlow visualizer), doctor diagnostic heuristics, and unquoted string sanitizers are immediately accessible by all ecosystem runners.
*   **Maintenance Simplicity**: Standardizing on wrappers avoids maintaining five separate implementations, five test suites, and five release pipelines. It prioritizes **absolute cognition consistency** over "native ecosystem vanity".

---

## 2. Supported Ecosystems & Installation Matrix

All official wrappers act as transparent CLI launchers that verify the system runtime environment, forward arguments, and cleanly propagate subprocess exit codes.

| Ecosystem | Registry | Installation Command | Execution Command | Wrapper Type |
| :--- | :--- | :--- | :--- | :--- |
| **npm / Node.js** | npmjs.com | `npm install -g @architecture-as-memory/aam` | `aam validate` | Direct Core JS CLI |
| **Python (PyPI)** | PyPI.org | `pip install architecture-as-memory` | `aam validate` | Thin Python Launcher |
| **PowerShell** | PSGallery | `Install-Module -Name AAM -Scope CurrentUser` | `Test-AAM` | Native Cmdlet Wrapper |
| **Rust Crate** | crates.io | `cargo install aam-cli` | `aam validate` | Thin Binary Launcher |
| **Docker** | Docker Hub | `docker pull aam` | `docker run -v $(pwd):/workspace aam` | Sealed Core Runtime |

---

## 3. Thin Ecosystem Wrapper Specifications

Every wrapper is governed by **strict minimalism rules**:
*   **Tiny Size**: No wrappers bundle their own static files, ReactFlow code, or schema definitions. They rely entirely on the shared, bundled core JS directory.
*   **Direct Subprocess Forwarding**: Wrappers only inspect user environments to ensure Node.js is present and forward command-line arguments directly to `js/bin/aam.js`.
*   **Flawless Exit-Code Propagation**: Subprocess exit codes (e.g., `0` for valid, `1` for validation failure) are returned to the shell immediately, allowing seamless integration with local CI/CD pipelines and post-commit hooks.

### 1. Python Wheel Wrapper (`packages/python`)
Uses Python's `shutil.which` to find `node` and executes `aam.js` using `subprocess.run()`. It is fully compatible with virtual environments (`venv`) on Windows, macOS, and Linux.

### 2. PowerShell Module Cmdlets (`packages/powershell`)
Exports native cmdlets using official Verb-Noun formats:
*   `Initialize-AAM` (wraps `aam init`)
*   `Test-AAM` (wraps `aam validate` and `aam doctor`)
*   `Start-AAMViewer` (wraps `aam dev`)

### 3. Rust Cargo Binary Crate (`packages/rust`)
A super-thin compiled binary launcher in Rust that uses the standard library `Command::new("node")` to execute AAM core logic.

---

## 4. Docker Mounted Repository Runner

For developers who do not have Node.js installed or require a completely isolated validation container, AAM provides a multi-stage, minimal Docker Alpine image.

### Running with Docker
Run validation on your local repository by mounting the current directory to `/workspace`:

```bash
docker run --rm \
  -v "$(pwd):/workspace" \
  aam validate
```

Run cognitive health diagnostics:
```bash
docker run --rm \
  -v "$(pwd):/workspace" \
  aam doctor
```

Export standalone visualizer bundle:
```bash
docker run --rm \
  -v "$(pwd):/workspace" \
  aam export
```
