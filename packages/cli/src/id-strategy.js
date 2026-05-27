/**
 * Deterministic ID Strategy Generator
 * Employs FNV-1a 32-bit hashing of normalized names to produce short,
 * stable, collision-resistant, and highly readable uppercase IDs.
 *
 * Suffix format: 4 hex characters (e.g. DOM-A19F, FEAT-F3C2)
 */

export function generateDeterministicId(type, name) {
  const normalizedType = String(type).toLowerCase().trim();
  let prefix = 'NODE-';
  
  if (normalizedType === 'domain') prefix = 'DOM-';
  else if (normalizedType === 'feature') prefix = 'FEAT-';
  else if (normalizedType === 'component') prefix = 'COMP-';
  else if (normalizedType === 'enhancement') prefix = 'ENH-';

  // FNV-1a 32-bit hash implementation
  let hash = 2166136261;
  const cleanName = String(name).toLowerCase().replace(/[^a-z0-9]/g, '');
  
  for (let i = 0; i < cleanName.length; i++) {
    hash ^= cleanName.charCodeAt(i);
    // Multiply by FNV prime 16777619
    hash = Math.imul(hash, 16777619);
  }
  
  const hex = (hash >>> 0).toString(16).toUpperCase().padStart(8, '0');
  // Use last 4 characters for compact, readable suffix
  const suffix = hex.slice(-4);
  
  return `${prefix}${suffix}`;
}
