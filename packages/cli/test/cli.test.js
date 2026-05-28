import test from 'node:test';
import assert from 'node:assert';
import path from 'path';
import fs from 'fs-extra';
import { generateDeterministicId } from '../src/id-strategy.js';
import { validateArchitecture } from '../src/validation-engine.js';

test('Deterministic ID Strategy Generator', (t) => {
  // Test Prefix Assignment
  assert.strictEqual(generateDeterministicId('domain', 'User Auth').startsWith('DOM-'), true);
  assert.strictEqual(generateDeterministicId('feature', 'Secure Login').startsWith('FEAT-'), true);
  assert.strictEqual(generateDeterministicId('component', 'JWT Service').startsWith('COMP-'), true);
  assert.strictEqual(generateDeterministicId('enhancement', 'Multi Factor').startsWith('ENH-'), true);
  assert.strictEqual(generateDeterministicId('other', 'Random Node').startsWith('NODE-'), true);

  // Test Case Insensitivity & Determinism
  const id1 = generateDeterministicId('component', 'Login Form');
  const id2 = generateDeterministicId('component', 'login form');
  const id3 = generateDeterministicId('component', 'LOGIN FORM');
  assert.strictEqual(id1, id2);
  assert.strictEqual(id2, id3);

  // Test Special Characters Normalization
  const idWithSymbols = generateDeterministicId('feature', 'auth-service!!');
  const idClean = generateDeterministicId('feature', 'authservice');
  assert.strictEqual(idWithSymbols, idClean);
});

test('YAML Safe Governance & Cognitive Summaries Validation', async (t) => {
  const tempTestDir = path.resolve('./temp-validation-test');
  const archDir = path.join(tempTestDir, 'architecture');

  try {
    // 1. Setup clean directory structure
    await fs.remove(tempTestDir);
    await fs.ensureDir(path.join(archDir, 'domains'));

    // 2. Write a system YAML containing unquoted dangerous colon mapping pattern
    const badSystemYaml = `
type: system
schema_version: 1
id: SYS-AAM-TEST
name: Test System
summary: Contains unquoted colon like cache: ttl: 3min
purpose: Validates why system exists.
`;
    await fs.writeFile(path.join(archDir, 'system.yaml'), badSystemYaml, 'utf8');

    // 3. Write a domain YAML that is perfectly valid
    const goodDomainYaml = `
type: domain
schema_version: 1
id: DOM-D389
name: Frontend Domain
summary: Handles presentation logic.
description: Handles presentation logic.
purpose: Presentation separation.
`;
    await fs.writeFile(path.join(archDir, 'domains/frontend.yaml'), goodDomainYaml, 'utf8');

    // 4. Run the validation engine silently
    const results = await validateArchitecture(tempTestDir, true);

    // 5. Assertions
    assert.ok(results.warnings.length > 0, 'Should detect warnings');

    // Verify unquoted colon warning is registered
    const colonWarning = results.warnings.find(w => w.message.includes('Unsafe Unquoted Colon'));
    assert.ok(colonWarning, 'Should have flagged the unquoted colon pattern');
    assert.strictEqual(colonWarning.file, 'architecture/system.yaml');

  } finally {
    // Clean up
    await fs.remove(tempTestDir);
  }
});

test('Provider Reinforcement', async (t) => {
  const tempTestDir = path.resolve('./temp-reinforce-test');
  
  try {
    await fs.remove(tempTestDir);
    await fs.ensureDir(tempTestDir);

    const { reinforceProvider } = await import('../src/reinforcement-engine.js');

    // 1. Reinforce Claude (should create CLAUDE.md)
    await reinforceProvider('claude', tempTestDir);
    const claudePath = path.join(tempTestDir, 'CLAUDE.md');
    assert.ok(await fs.pathExists(claudePath), 'CLAUDE.md should exist');
    
    let content = await fs.readFile(claudePath, 'utf8');
    assert.ok(content.includes('<!-- AAM REINFORCEMENT START -->'), 'Should contain reinforcement start marker');
    assert.ok(content.includes('Architecture-As-Memory (AAM) Cognition Anchor'), 'Should contain cognition header');

    // 2. Reinforce Gemini (should create .gemini/GEMINI.md)
    await reinforceProvider('gemini', tempTestDir);
    const geminiPath = path.join(tempTestDir, '.gemini/GEMINI.md');
    assert.ok(await fs.pathExists(geminiPath), '.gemini/GEMINI.md should exist');
    
    // 3. Reinforce idempotent behavior (should not append twice)
    const initialSize = (await fs.stat(claudePath)).size;
    await reinforceProvider('claude', tempTestDir);
    const postSize = (await fs.stat(claudePath)).size;
    assert.strictEqual(initialSize, postSize, 'Size should remain identical for idempotent call');

  } finally {
    await fs.remove(tempTestDir);
  }
});

