# Architecture-as-Memory: Full Build & Launch Architect

## Purpose

You are being activated to help design, build, brand, and distribute a lightweight open-source package called Architecture-as-Memory (AAM).

The package exists to solve a very specific and increasingly painful problem in AI-native software development. Modern AI coding assistants such as Claude Code, Codex, Gemini CLI, Cursor, and similar systems are now capable of implementing features faster than human developers can maintain a mental model of their own architecture. The AI continuously expands the codebase while the developer slowly loses awareness of the system structure, service boundaries, dependency relationships, architectural intent, and operational evolution.

This package exists to solve that exact cognitive failure.

Architecture-as-Memory is not another documentation generator, static dependency visualizer, wiki system, or repo indexing tool. It is a persistent architectural cognition layer designed specifically for AI-native engineering workflows. The package continuously maintains a living memory graph of the software system as the project evolves.

The core idea is extremely simple.

Whenever an AI coding assistant completes a feature, modifies an architectural capability, introduces a new service, changes a dependency relationship, evolves a workflow, or expands a domain, the agent must also update the Architecture-as-Memory cognition layer.

That cognition layer is stored as structured YAML files inside the repository itself.

Those YAML files are then rendered into an interactive graph interface that allows developers to immediately understand:

* what exists
* why it exists
* what depends on what
* what state the system is currently in
* what is evolving
* what enhancements are planned
* what areas are operationally risky
* how the architecture is changing over time

The system must remain fully local-first and offline-capable after installation.

No backend.
No cloud APIs.
No databases.
No AI API dependency.
No synchronization layer.
No external service dependency.

The package should install using a simple NPX bootstrap command and become operational in under two minutes.

The viewer must feel lightweight, immediate, responsive, and cognitively stable even as the architecture grows.

The system is fundamentally about preserving orientation inside rapidly evolving AI-built software systems.

---

## Product Philosophy

The most important philosophical principle behind Architecture-as-Memory is that software architecture is not code structure.

Most existing architecture visualization tools fail because they model implementation detail instead of cognition.

They focus on:

* files
* imports
* AST relationships
* dependency graphs
* UML structures
* folder hierarchies

Those systems become visually noisy almost immediately because humans do not reason about software systems at the file level.

Humans reason about capabilities.

Humans think in terms of:

* authentication
* payments
* analytics
* notifications
* onboarding
* search
* deployment
* observability
* workflows
* operational boundaries

Architecture-as-Memory therefore models architectural cognition instead of filesystem topology.

The system should preserve architectural intent rather than implementation detail.

The graph itself is not the actual product.

The graph is merely the navigation layer.

The real product is the structured cognition model underneath.

The UI exists to help developers rapidly rebuild system understanding after architecture evolves.

The success metric is not “complete graph accuracy.”

The success metric is:

“Can a developer return after several weeks away from the repository and understand the system again within two minutes?”

That is the actual purpose of the product.

---

## Core Architecture Model

Architecture-as-Memory should operate using four major cognition layers.

The first layer is the System layer.

This represents the entire project identity and overall architecture context.

The second layer is the Domain layer.

Domains represent major operational boundaries within the software system.

Examples:

* frontend
* backend
* infrastructure
* ai-runtime
* observability
* payments
* authentication
* analytics

Domains are the first thing users see when opening the graph.

The third layer is the Feature layer.

This is the most important cognition layer in the entire system.

Features represent architectural capabilities.

Examples:

* authentication
* billing
* search
* notifications
* team invitations
* session management
* dashboard rendering
* deployment automation

Features are shared cognition units.

A feature can span multiple domains simultaneously.

For example:

Authentication may involve:

* frontend login pages
* backend auth services
* session middleware
* infrastructure secrets
* observability pipelines
* token refresh systems

Features should therefore not be duplicated separately under frontend and backend.

Instead, one feature references multiple implementation components distributed across multiple domains.

The fourth layer is the Component layer.

Components are implementation containers.

Examples:

* login-page
* auth-service
* jwt-middleware
* postgres-user-db
* analytics-worker
* stripe-webhook-service

Components support features.

Features do not support components.

This distinction is extremely important because it keeps the cognition model human-oriented instead of implementation-oriented.

---

## Graph Interaction Model

The graph interface should use progressive cognition expansion.

The system must never attempt to render the entire architecture simultaneously.

Global graph rendering becomes unusable at scale.

Instead, the graph progressively expands architecture based on interaction depth.

At the initial level, users should only see domains.

When a user clicks a domain, the viewer should reveal associated features.

When a user clicks a feature, the viewer should reveal implementation components participating in that capability.

Relationships should appear contextually instead of globally.

This is extremely important.

The UI must preserve cognitive clarity even when repositories contain:

* hundreds of services
* thousands of features
* large monorepos
* distributed microservice systems
* multiple engineering teams

The graph is not intended to become a complete dependency visualization.

It is intended to become a contextual cognition surface.

The graph should therefore behave more like:

* Figma navigation
* Linear issue relationships
* Notion structural exploration

rather than a traditional topology diagram.

---

## YAML Architecture System

Architecture-as-Memory stores its cognition model inside an /architecture directory at the root of the repository.

The structure should look conceptually like this:

/architecture
architecture.index.yaml
system.yaml
relationships.yaml

/domains
/features
/components
/enhancements
/agents

The architecture.index.yaml file is extremely important.

This file acts as the routing and hydration layer for the graph system.

Instead of recursively scanning thousands of YAML files continuously, the viewer can use the index file to efficiently load contextual cognition slices.

The system.yaml file contains high-level project metadata.

This includes:

* project identity
* architecture style
* runtime stack
* operational maturity
* repository metadata
* domain references

The domains directory stores domain cognition nodes.

The features directory stores architectural capability nodes.

The components directory stores implementation nodes.

The enhancements directory stores future evolution plans.

The agents directory stores AI instruction files.

Every architecture node must contain stable immutable identifiers.

Names are not stable enough.

Features evolve.
Services get renamed.
Domains split.
IDs must remain deterministic.

Example:

id: FEAT-AUTH-001
name: Authentication

This becomes critical at enterprise scale.

---

## Relationship Architecture

Relationship management is one of the most important architectural decisions in the entire system.

Naive architecture tools attempt to globally render all relationships simultaneously.

That approach completely collapses at scale.

Architecture-as-Memory instead treats relationships as bounded contextual topology.

Relationships should remain localized whenever possible.

Feature-level relationships should live near their associated cognition boundaries.

This significantly reduces:

* merge conflicts
* graph entropy
* cognitive overload
* AI mutation risk
* graph hydration complexity

The system must support relationships such as:

* depends_on
* consumes
* publishes_to
* reads_from
* writes_to
* owned_by
* exposes
* triggers
* communicates_with

Relationships are the nervous system of the cognition graph.

Without relationships, the graph becomes static metadata.

With relationships, the graph becomes operational memory.

---

## AI Agent Integration Philosophy

Architecture-as-Memory is not intended to be maintained manually by humans.

That approach does not scale.

Instead, AI coding assistants become the primary maintainers of architectural cognition.

When users install the package using NPX, the scaffold system should detect existing instruction systems such as:

* CLAUDE.md
* SKILL.md
* AGENTS.md
* .gemini/GEMINI.md
* .cursorrules
* AI-INSTRUCTIONS.md

The installer should never aggressively overwrite existing user instructions.

Instead, it should append lightweight bootstrap references pointing toward the centralized Architecture-as-Memory instruction system.

Example:

“This repository uses Architecture-as-Memory. Before implementing features, read the architecture cognition files inside /architecture. After completing work, update the relevant architecture nodes incrementally.”

The detailed behavioral instructions should remain centralized.

This reduces:

* duplicated prompts
* instruction drift
* token waste
* maintenance complexity

The AI instructions themselves must strongly enforce incremental mutation semantics.

AI agents must never regenerate architecture globally.

This rule is absolutely essential.

Instead, agents should only:

* update affected features
* append relationships
* modify impacted components
* evolve metadata
* add enhancements
* update operational states
* extend responsibilities

Small mutations preserve cognition stability.

Large rewrites create architecture corruption.

---

## State System Design

The system should avoid simplistic implementation-oriented states such as:

* pending
* done
* todo

Those states become meaningless at scale.

Instead, Architecture-as-Memory should model architectural state.

Recommended state categories:

lifecycle:

* proposed
* active
* evolving
* stable
* deprecated

implementation:

* partial
* complete

reliability:

* unknown
* unstable
* reliable

observability:

* missing
* partial
* complete

maturity:

* experimental
* scaling
* stable
* legacy

This gives the graph real operational cognition instead of superficial progress tracking.

---

## Search and Navigation

Search becomes critically important once repositories scale.

At enterprise scale, graph navigation alone becomes insufficient.

The system therefore requires a command-palette style search interface inspired by:

* VSCode
* Raycast
* Linear
* Notion quick search

Users should be able to instantly locate:

* features
* services
* components
* enhancements
* responsibilities
* operational risks
* dependency relationships

Selecting a search result should:

* center the graph
* preserve current UI state
* expand required cognition nodes
* open the detail panel
* hydrate related relationships dynamically

The viewer must preserve orientation continuously.

The graph should never hard reset when architecture changes.

---

## Hot Reloading and Runtime Behavior

The viewer should support live architecture updates.

When YAML files change, the graph should update automatically without resetting navigation state.

The UI must preserve:

* zoom level
* expanded domains
* selected nodes
* detail panel state
* graph position

The runtime architecture should therefore follow this flow:

file watcher
→ yaml parser
→ graph diff engine
→ incremental state patch
→ UI update

The system should use filesystem watching instead of aggressive polling.

Instant updates matter.

Responsiveness matters.

Cognitive continuity matters.

---

## Visual Identity and Branding Direction

Architecture-as-Memory should not visually resemble traditional enterprise architecture software.

Most existing systems feel bureaucratic, static, and corporate.

This product should instead feel like a living cognition console.

The visual direction should communicate:

* persistent memory
* topology
* architectural depth
* evolving systems
* operational intelligence

The strongest direction is a graphite-and-ember aesthetic.

Blue should be avoided.

Green should also be avoided.

Blue is overloaded across developer tooling.

Green creates strong associations with terminals, observability systems, and security tooling.

Architecture-as-Memory should instead feel warm, architectural, and cognitively grounded.

Recommended palette:

Primary Background: #0F1115
Secondary Background: #171A21
Panel Surface: #1E232D
Border Surface: #2A313D
Primary Accent: #FF8A3D
Secondary Accent: #D96B2B
Soft Highlight: #FFB067
Critical State: #FF5F56
Warning State: #F4B740
Stable State: #D98C3F
Text Primary: #F5F7FA
Text Secondary: #B8C0CC
Muted Text: #7C8796
Graph Edge Neutral: #5C6675
Graph Edge Active: #FF8A3D

The visual style should avoid neon cyberpunk aesthetics.

The interface should feel calm under heavy cognitive load.

The logo should avoid mascots, brains, robots, or AI clichés.

Instead, the logo should communicate:

* structured cognition
* persistent topology
* connected memory
* evolving architecture

The strongest logo direction is a minimal architectural node system built from layered geometric topology.

The product should feel like an architectural operating layer rather than a dashboard.

---

## Viewer and Website Separation

The public website and local viewer must remain separate systems.

The local viewer exists for operational cognition.

The public website exists for onboarding, explanation, screenshots, installation guidance, and adoption.

The local viewer should prioritize:

* performance
* responsiveness
* graph clarity
* offline capability
* continuous usage

The public website should prioritize:

* explaining the problem
* demonstrating the workflow
* showing architecture examples
* onboarding new developers
* presenting installation instructions

These systems should share visual language but not runtime responsibility.

---

## Technical Direction

Architecture-as-Memory should use:

* TypeScript-first architecture
* ReactFlow for graph rendering
* React for UI composition
* Zustand for graph state management
* Vite for local viewer runtime
* YAML as the persistent cognition format
* strict schema validation
* Node.js >= 18

The system must remain lightweight.

The viewer bundle must stay under the defined size constraints.

The installer must remain frictionless.

The project should aggressively resist unnecessary complexity.

No backend.
No server dependency.
No database.
No cloud synchronization.
No analytics.
No AI inference.

The product succeeds only if the cognitive layer remains simple enough to maintain continuously.

---

## Final Product Definition

Architecture-as-Memory is a persistent architectural cognition layer for AI-native software systems.

It continuously preserves human understanding while AI coding agents evolve software at machine speed.

The system is not documentation.

It is not a static graph.

It is not a repo map.

It is an operational memory layer designed to prevent developers from losing architectural orientation as their systems grow.

Every design decision should reinforce one core outcome:

help humans maintain deep architectural understanding while AI systems continuously expand and mutate software systems underneath them.
The system should avoid simplistic implementation-oriented states such as:

- pending
- done
- todo
- finished

Those states become meaningless once systems scale beyond a few isolated features because they communicate almost nothing about operational reality, architectural maturity, reliability, or lifecycle progression. A feature can be “done” from an implementation perspective while still being unstable, poorly observable, tightly coupled, operationally risky, or actively evolving underneath the surface.

Architecture-as-Memory should therefore model architectural state rather than task completion state.

The cognition graph is not intended to behave like a Kanban board or sprint tracker. It exists to preserve long-term system understanding. Because of that, state modeling must reflect operational and architectural truth instead of temporary development workflow labels.

The state system should therefore be multi-dimensional.

Instead of storing a single generic status value, every cognition node should maintain multiple state categories that collectively describe the actual health, maturity, lifecycle position, and operational condition of the capability.

Recommended state categories:

lifecycle:
- proposed
- active
- evolving
- stable
- deprecated

implementation:
- partial
- complete

reliability:
- unknown
- unstable
- reliable
- hardened

observability:
- missing
- partial
- complete

maturity:
- experimental
- scaling
- production
- legacy

risk:
- low
- medium
- high
- critical

change_frequency:
- low
- moderate
- high
- volatile

These distinctions become extremely valuable visually once rendered inside the graph viewer.

For example, a feature may be:

lifecycle: active
implementation: complete
reliability: unstable
observability: partial
maturity: scaling
risk: high

That immediately tells the developer something important:

the feature exists and is operational, but it is still unstable under production conditions and lacks sufficient operational visibility.

That level of cognition is impossible with simplistic “done” states.

The same philosophy applies to enhancements.

Enhancements should not simply exist as unchecked future tasks. They should communicate architectural intent and evolution trajectory.

Enhancements should therefore support states such as:

- planned
- researching
- implementing
- validating
- blocked
- deferred
- completed

This creates a visible evolution timeline for the architecture itself.

The graph should therefore communicate not only what the system currently is, but also where the system is heading.

This is one of the most important conceptual differences between Architecture-as-Memory and traditional documentation systems.

Traditional documentation describes static systems.

Architecture-as-Memory preserves evolving cognition.

The UI should visually reinforce these distinctions using subtle but meaningful visual indicators.

Examples:

- experimental systems may use softer ember outlines
- stable systems may use stronger structured borders
- deprecated systems may appear faded or partially desaturated
- high-risk systems may expose warning indicators
- incomplete observability may show visibility badges
- highly volatile systems may display active evolution indicators

These visual signals allow developers to rebuild operational understanding extremely quickly without reading large amounts of text.

The goal is cognitive compression.

A developer should be able to look at the graph for a few seconds and immediately understand:

- which systems are stable
- which systems are risky
- which systems are actively changing
- which systems lack visibility
- which systems are future-facing
- which systems are aging out
- which systems require attention

This transforms the graph from a passive architecture map into a continuously evolving operational cognition surface.