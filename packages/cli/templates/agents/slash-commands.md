# Architecture As Memory (AAM) - Slash Command Context Hydration

To prevent cognitive drift, AI assistants must build a clear mental model of the system architecture *before* modifying code. You can use standard slash commands (or custom markdown command triggers) to load the appropriate cognitive layers into your assistant's context.

Before implementing any feature or technical enhancement, use one of the provider-specific slash commands below to hydrate your assistant with the architecture map.

---

## 1. Claude (CLAUDE.md / Claude Desktop)

In your conversation or within `CLAUDE.md`, run:

### Command
```markdown
/aam [capability-or-domain-id] [task-details]
```

### Example
```markdown
/aam FEAT-AUTHENTICATION Add support for OAuth2 authentication via GitHub.
```

### Context Hydration Prompt
If you do not have direct slash command integration, paste this system bootstrap prompt:
```markdown
Read the Architecture-As-Memory (AAM) skill instructions in /architecture/agents/aam-skill.md.
Analyze the target capability: FEAT-AUTHENTICATION
Read the component states:
- /architecture/components/login.yaml
- /architecture/components/auth-service.yaml
Understand relationships in /architecture/relationships.yaml.
Propose the implementation plan respecting existing boundaries and stable IDs.
```

---

## 2. Cursor (.cursorrules / Cursor Rules)

Cursor supports referencing files using `@`. Hydrate context easily with:

### Command
```markdown
/aam @architecture.index.yaml @[feature].yaml [task-details]
```

### Example
```markdown
/aam @architecture.index.yaml @authentication.yaml Implement rate limiting for API login route.
```

### System Instruction
In your `.cursor/rules/*.mdc` rules or `.cursorrules`, add:
```markdown
When I type `/aam [feature-id] [task]`:
1. Open and review /architecture/agents/aam-skill.md
2. Load the YAML files listed under the corresponding feature ID in /architecture/architecture.index.yaml
3. Detail the components that will be affected and the new relationships to be created
4. Ask for user confirmation before writing code
```

---

## 3. Gemini (.gemini/GEMINI.md)

Gemini reads `.gemini/GEMINI.md` to establish project directives. 

### Trigger Command
```markdown
/aam [feature-name] [enhancement-details]
```

### Context Hydration Protocol
Add this command routing to your `GEMINI.md`:
```markdown
- **Slash Trigger `/aam`**: When initiated, immediately search the `/architecture` directory for the feature matching the search terms, read the `aam-skill.md` operational manual, and identify the required component changes to complete the request.
```

---

## 4. Codex / GitHub Copilot Chat (.github/copilot-instructions.md)

Copilot uses custom system prompts to instruct agents.

### Command
```markdown
#aam [feature-id] [task]
```

### Example
```markdown
#aam FEAT-AUTHENTICATION Add password reset email token flow.
```

### Configuration
In `.github/copilot-instructions.md`, add:
```markdown
### AAM Protocol
If the user references `#aam` or `/aam`:
- Stop and read /architecture/architecture.index.yaml first.
- Locate the related feature and its corresponding component YAML files.
- Align your code modifications with the documented architecture.
- Complete the task and remind the user to run "aam validate" and update the architecture nodes.
```

---

## The Workflow Loop
1. **Hydrate**: run `/aam [feature] [task]` to orient the assistant.
2. **Build**: implement code changes safely.
3. **Document**: modify component responsibilities in specific `/architecture` YAML files.
4. **Validate**: run `aam validate` on the command line to check integrity.
