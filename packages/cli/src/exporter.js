import path from 'path';
import fs from 'fs-extra';
import chalk from 'chalk';
import YAML from 'yaml';
import { getArchitectureHash } from './hash-engine.js';
import { computeComplexityScore } from './doctor-engine.js';

/**
 * Helper to recursively search a folder for .yaml/.yml files, ignoring dotfiles.
 */
async function getYamlFilesRecursively(dir) {
  let results = [];
  if (!(await fs.pathExists(dir))) return results;
  const list = await fs.readdir(dir);
  for (const file of list) {
    if (file.startsWith('.')) continue; // ignore hidden/dotfiles
    const fullPath = path.join(dir, file);
    const stat = await fs.stat(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(await getYamlFilesRecursively(fullPath));
    } else if (file.endsWith('.yaml') || file.endsWith('.yml')) {
      results.push(fullPath);
    }
  }
  return results;
}

/**
 * Aggregates AAM YAMLs and exports a standalone offline visualizer HTML file.
 */
export async function exportArchitecture(targetDir = process.cwd(), outputFilename = 'architecture-map.html') {
  const archDir = path.join(targetDir, 'architecture');
  const outputPath = path.resolve(targetDir, outputFilename);

  console.log(chalk.bold.cyan(`\n📦 Packaging Offline Standalone Visualizer Bundle...`));

  if (!(await fs.pathExists(archDir))) {
    throw new Error(`Could not find '/architecture' directory in ${targetDir}`);
  }

  // 1. Recursive discovery and loading
  const yamlFiles = await getYamlFilesRecursively(archDir);
  
  let system = null;
  const domains = [];
  const features = [];
  const components = [];
  const enhancements = [];
  let relationships = [];
  const invalidNodes = [];
  const idMap = new Map();

  for (const filePath of yamlFiles) {
    const relPath = path.relative(targetDir, filePath).replace(/\\/g, '/');
    try {
      const content = await fs.readFile(filePath, 'utf8');
      const parsed = YAML.parse(content);
      if (!parsed || typeof parsed !== 'object') {
        throw new Error('YAML parsed but returned empty or non-object content');
      }

      parsed._relPath = relPath;

      if (Array.isArray(parsed.relationships)) {
        relationships = [...relationships, ...parsed.relationships];
      }

      const id = parsed.id;
      const type = parsed.type;

      if (type === 'system') {
        system = parsed;
        continue;
      }

      if (id && type) {
        if (idMap.has(id)) continue;
        idMap.set(id, relPath);

        if (type === 'domain') {
          domains.push(parsed);
        } else if (type === 'feature') {
          features.push(parsed);
        } else if (type === 'component') {
          components.push(parsed);
        } else if (type === 'enhancement') {
          enhancements.push(parsed);
        }
      } else if (id && id.startsWith('SYS-')) {
        system = parsed;
      }
    } catch (err) {
      const mockId = 'invalid-' + relPath.replace(/[^a-zA-Z0-9]/g, '-');
      invalidNodes.push({
        id: mockId,
        type: 'invalid',
        name: path.basename(filePath),
        file: relPath,
        error: err.message,
        content: await fs.readFile(filePath, 'utf8').catch(() => '')
      });
      console.warn(chalk.yellow(`[AAM Export] Gracefully isolated malformed file: ${filePath} (${err.message})`));
    }
  }

  if (!system) {
    system = {
      id: 'SYS-AAM',
      type: 'system',
      name: 'Dynamic Architecture-as-Memory',
      description: 'Exported local system nodes.'
    };
  }

  // Calculate dynamic deterministic hash
  const hash = await getArchitectureHash(targetDir);

  // Compute complexity point metrics dynamically for nodes (Task 9 & 11)
  const allNodesList = [...domains, ...features, ...components];
  allNodesList.forEach(node => {
    const scoreObj = computeComplexityScore(node, relationships);
    node.complexity_score = scoreObj.score;
    node.complexity_classification = scoreObj.classification;
  });

  const payload = {
    metadata: {
      hash,
      exported_at: new Date().toISOString()
    },
    system,
    domains,
    features,
    components,
    enhancements,
    relationships,
    invalidNodes
  };

  // 2. Generate standalone offline HTML Viewer content
  const htmlContent = `<!DOCTYPE html>
<html lang="en" class="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Architecture-as-Memory Standalone Map - ${system.name}</title>
  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <!-- Vis.js CDN for interactive network graphs -->
  <script type="text/javascript" src="https://unpkg.com/vis-network/standalone/umd/vis-network.min.js"></script>
  <!-- Lucide Icons -->
  <script src="https://unpkg.com/lucide@latest"></script>
  <!-- Custom Styling -->
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
    
    :root {
      --font-sans: 'Outfit', sans-serif;
      --font-mono: 'JetBrains Mono', monospace;
    }
    
    body {
      font-family: var(--font-sans);
      background-color: #0B0D11;
      color: #F5F7FA;
    }
    
    .glass {
      background: rgba(18, 22, 28, 0.7);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.05);
    }
    
    ::-webkit-scrollbar {
      width: 6px;
      height: 6px;
    }
    ::-webkit-scrollbar-track {
      background: rgba(0, 0, 0, 0.1);
    }
    ::-webkit-scrollbar-thumb {
      background: rgba(255, 138, 61, 0.2);
      border-radius: 4px;
    }
    ::-webkit-scrollbar-thumb:hover {
      background: rgba(255, 138, 61, 0.4);
    }
  </style>
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          colors: {
            brand: '#FF8A3D',
            brandDark: '#D96E26',
            surface: '#12161C',
            borderSurface: 'rgba(255, 255, 255, 0.05)'
          }
        }
      }
    }
  </script>
</head>
<body class="w-screen h-screen overflow-hidden flex flex-col">

  <!-- Header Banner (HUD) -->
  <header class="h-16 shrink-0 glass flex items-center justify-between px-6 z-20">
    <div class="flex items-center gap-4">
      <div class="flex items-center gap-2">
        <div class="h-8 w-8 rounded-lg bg-gradient-to-tr from-brand to-yellow-500 flex items-center justify-center font-bold text-white shadow-lg">M</div>
        <div>
          <h1 class="text-sm font-semibold tracking-wider text-white">ARCHITECTURE-AS-MEMORY</h1>
          <span class="text-[10px] text-brand tracking-widest font-mono uppercase font-bold">SHA: ${hash.substring(0, 8)}</span>
        </div>
      </div>
      <div class="h-6 w-[1px] bg-white/10"></div>
      <div>
        <span class="text-[11px] text-gray-400 block font-mono">SYSTEM VIEW</span>
        <h2 class="text-xs font-medium text-white">${system.name}</h2>
      </div>
    </div>

    <!-- Active Filters & Search Info -->
    <div class="flex items-center gap-4">
      <select id="focus-filter" class="bg-surface border border-white/10 rounded-lg px-3 py-1.5 text-xs text-gray-300 focus:outline-none focus:border-brand cursor-pointer">
        <option value="">🎯 Focus: All Nodes</option>
        <option value="high-risk">⚠️ High Risk / Critical</option>
        <option value="evolving">🔄 Evolving Lifecycles</option>
        <option value="unstable">⚡ Unstable Reliability</option>
        <option value="frontend-only">🎨 Frontend Only</option>
        <option value="backend-only">⚙️ Backend Only</option>
        <option value="deprecated">🚫 Deprecated Nodes</option>
        <option value="experimental">🧪 Experimental Maturity</option>
      </select>
      
      <div class="text-[11px] text-gray-400 bg-white/5 border border-white/5 rounded-full px-3 py-1 font-mono">
        ${domains.length} Domains • ${features.length} Features • ${components.length} Components
      </div>
    </div>
  </header>

  <!-- Main View Area -->
  <div class="flex-1 flex overflow-hidden relative">

    <!-- Left Sidebar: Search & Explorer -->
    <aside class="w-80 glass border-t-0 border-b-0 border-l-0 border-r shrink-0 flex flex-col z-10">
      <div class="p-4 border-b border-white/5 shrink-0">
        <div class="relative">
          <i data-lucide="search" class="absolute left-3 top-2.5 h-4 w-4 text-gray-400"></i>
          <input type="text" id="search-input" placeholder="Search architecture memory..." class="w-full bg-surface border border-white/10 rounded-lg pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-brand" />
        </div>
      </div>

      <!-- Scrollable List -->
      <div class="flex-1 overflow-y-auto p-4 space-y-4" id="nodes-list">
        <!-- Rendered dynamically -->
      </div>
    </aside>

    <!-- Center Canvas -->
    <div class="flex-1 h-full relative" id="network-container">
      <!-- Vis.js canvas loads here -->
    </div>

    <!-- Right Sidebar: Inspector -->
    <aside class="w-96 glass border-t-0 border-b-0 border-l border-r-0 shrink-0 flex flex-col z-10 transition-transform duration-300 translate-x-0 overflow-y-auto" id="inspector">
      <div class="p-6 border-b border-white/5 flex items-center justify-between shrink-0">
        <div>
          <span id="inspect-type" class="text-[10px] uppercase font-mono tracking-widest px-2 py-0.5 rounded bg-brand/20 text-brand">System</span>
          <h2 id="inspect-title" class="text-lg font-bold text-white mt-2">${system.name}</h2>
        </div>
      </div>

      <div class="p-6 space-y-6 flex-1">
        <div>
          <h3 class="text-xs font-semibold text-gray-400 tracking-wider uppercase font-mono mb-2">Purpose</h3>
          <p id="inspect-purpose" class="text-xs text-brand leading-relaxed font-mono">${system.purpose || 'Living architectural memory model.'}</p>
        </div>

        <div>
          <h3 class="text-xs font-semibold text-gray-400 tracking-wider uppercase font-mono mb-2">Description</h3>
          <p id="inspect-desc" class="text-xs text-gray-300 leading-relaxed">${system.description}</p>
        </div>

        <!-- Dynamic properties mapping -->
        <div id="inspect-extra" class="space-y-6">
          <!-- Populated on node click -->
        </div>
      </div>
    </aside>

  </div>

  <script>
    // Embed parsed raw JSON
    const data = ${JSON.stringify(payload, null, 2)};

    let network = null;
    let selectedNodeId = null;

    // Search and Node matching state
    document.getElementById('search-input').addEventListener('input', updateView);
    document.getElementById('focus-filter').addEventListener('change', updateView);

    function updateView() {
      const searchTerm = document.getElementById('search-input').value.toLowerCase();
      const filter = document.getElementById('focus-filter').value;
      
      renderList(searchTerm, filter);
      renderGraph(searchTerm, filter);
    }

    // Dynamic Lists builder
    function renderList(search = '', filter = '') {
      const container = document.getElementById('nodes-list');
      container.innerHTML = '';

      // Match check helper
      const matchesFilter = (node, type) => {
        if (!filter) return true;
        if (filter === 'high-risk') return node.status?.risk === 'high' || node.status?.risk === 'critical';
        if (filter === 'evolving') return node.status?.lifecycle === 'evolving';
        if (filter === 'unstable') return node.status?.reliability === 'unstable';
        if (filter === 'frontend-only') return node.id.includes('FRONTEND') || node.domain?.includes('FRONTEND');
        if (filter === 'backend-only') return node.id.includes('BACKEND') || node.domain?.includes('BACKEND');
        if (filter === 'deprecated') return node.status?.lifecycle === 'deprecated';
        if (filter === 'experimental') return node.status?.maturity === 'experimental';
        return true;
      };

      const categories = [
        { name: 'Domains', items: data.domains, type: 'domain', color: 'text-brand' },
        { name: 'Features', items: data.features, type: 'feature', color: 'text-yellow-500' },
        { name: 'Components', items: data.components, type: 'component', color: 'text-cyan-500' }
      ];

      categories.forEach(cat => {
        const matched = cat.items.filter(item => {
          const matchesSearch = item.name.toLowerCase().includes(search) || item.id.toLowerCase().includes(search);
          return matchesSearch && matchesFilter(item, cat.type);
        });

        if (matched.length > 0) {
          const section = document.createElement('div');
          section.className = 'space-y-2';
          section.innerHTML = \`<h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wider">\${cat.name} (\${matched.length})</h3>\`;
          
          const ul = document.createElement('ul');
          ul.className = 'space-y-1';
          matched.forEach(item => {
            const li = document.createElement('li');
            li.className = \`p-2.5 rounded-lg border border-white/5 bg-white/[0.01] hover:bg-brand/5 hover:border-brand/30 cursor-pointer text-xs transition-all flex items-center justify-between \${selectedNodeId === item.id ? 'border-brand/40 bg-brand/5' : ''}\`;
            li.onclick = () => selectNode(item.id);
            li.innerHTML = \`
              <div>
                <span class="font-semibold text-white block">\${item.name}</span>
                <span class="text-[10px] text-gray-500 font-mono">\${item.id}</span>
              </div>
              <span class="text-[9px] uppercase font-mono px-1.5 py-0.5 rounded bg-white/5 text-gray-400">\${cat.type}</span>
            \`;
            ul.appendChild(li);
          });
          section.appendChild(ul);
          container.appendChild(section);
        }
      });
    }

    // Vis.js Graph Rendering
    function renderGraph(search = '', filter = '') {
      const container = document.getElementById('network-container');
      
      const nodesArray = [];
      const edgesArray = [];
      
      // Match helper
      const matchesFilter = (node, type) => {
        if (!filter) return true;
        if (filter === 'high-risk') return node.status?.risk === 'high' || node.status?.risk === 'critical';
        if (filter === 'evolving') return node.status?.lifecycle === 'evolving';
        if (filter === 'unstable') return node.status?.reliability === 'unstable';
        if (filter === 'frontend-only') return node.id.includes('FRONTEND') || node.domain?.includes('FRONTEND');
        if (filter === 'backend-only') return node.id.includes('BACKEND') || node.domain?.includes('BACKEND');
        if (filter === 'deprecated') return node.status?.lifecycle === 'deprecated';
        if (filter === 'experimental') return node.status?.maturity === 'experimental';
        return true;
      };

      // Add Domains
      data.domains.forEach(d => {
        const active = matchesFilter(d, 'domain');
        nodesArray.push({
          id: d.id,
          label: d.name,
          shape: 'box',
          color: {
            background: selectedNodeId === d.id ? '#FF8A3D' : '#12161C',
            border: '#FF8A3D',
            highlight: { background: '#FF8A3D', border: '#FF8A3D' }
          },
          font: { color: selectedNodeId === d.id ? '#0B0D11' : '#FFFFFF', size: 13, face: 'Outfit' },
          borderWidth: 2,
          margin: 12,
          opacity: active ? 1.0 : 0.15
        });
      });

      // Add Features
      data.features.forEach(f => {
        const active = matchesFilter(f, 'feature');
        nodesArray.push({
          id: f.id,
          label: f.name,
          shape: 'box',
          color: {
            background: selectedNodeId === f.id ? '#FBBF24' : '#12161C',
            border: '#FBBF24',
            highlight: { background: '#FBBF24', border: '#FBBF24' }
          },
          font: { color: selectedNodeId === f.id ? '#0B0D11' : '#FFFFFF', size: 12, face: 'Outfit' },
          borderWidth: 1.5,
          margin: 10,
          opacity: active ? 1.0 : 0.15
        });

        // Link to parent domains
        f.domains.forEach(domId => {
          edgesArray.push({
            from: domId,
            to: f.id,
            arrows: 'to',
            color: { color: '#5C6675', opacity: active ? 0.6 : 0.1 },
            dashes: true
          });
        });
      });

      // Add Components
      data.components.forEach(c => {
        const active = matchesFilter(c, 'component');
        nodesArray.push({
          id: c.id,
          label: c.name,
          shape: 'box',
          color: {
            background: selectedNodeId === c.id ? '#06B6D4' : '#12161C',
            border: '#06B6D4',
            highlight: { background: '#06B6D4', border: '#06B6D4' }
          },
          font: { color: selectedNodeId === c.id ? '#0B0D11' : '#FFFFFF', size: 11, face: 'Outfit' },
          borderWidth: 1.2,
          margin: 8,
          opacity: active ? 1.0 : 0.15
        });
        
        // Link to domain
        edgesArray.push({
          from: c.domain,
          to: c.id,
          arrows: 'to',
          color: { color: '#5C6675', opacity: active ? 0.4 : 0.1 },
          dashes: true
        });
      });

      // Add Custom Relationships
      data.relationships.forEach(rel => {
        const isDim = !matchesFilter({ id: rel.source }, '') || !matchesFilter({ id: rel.target }, '');
        edgesArray.push({
          from: rel.source,
          to: rel.target,
          arrows: 'to',
          label: rel.description || rel.type,
          font: { size: 9, color: '#9CA3AF', face: 'JetBrains Mono' },
          color: { color: '#FF8A3D', opacity: isDim ? 0.1 : 0.7 },
          width: 1.5
        });
      });

      const graphData = {
        nodes: new vis.DataSet(nodesArray),
        edges: new vis.DataSet(edgesArray)
      };

      const options = {
        physics: {
          solver: 'forceAtlas2Based',
          forceAtlas2Based: {
            gravitationalConstant: -50,
            centralGravity: 0.01,
            springLength: 100,
            springConstant: 0.08
          }
        },
        interaction: {
          hover: true,
          tooltipDelay: 200
        }
      };

      if (network) network.destroy();
      network = new vis.Network(container, graphData, options);

      // Node selection click handler
      network.on('click', function(params) {
        if (params.nodes.length > 0) {
          selectNode(params.nodes[0]);
        }
      });
    }

    function selectNode(id) {
      selectedNodeId = id;
      
      // Update sidebar lists highlights
      const search = document.getElementById('search-input').value.toLowerCase();
      const filter = document.getElementById('focus-filter').value;
      renderList(search, filter);

      // Find node object
      const node = data.domains.find(n => n.id === id) || 
                   data.features.find(n => n.id === id) || 
                   data.components.find(n => n.id === id);

      const inspectType = document.getElementById('inspect-type');
      const inspectTitle = document.getElementById('inspect-title');
      const inspectPurpose = document.getElementById('inspect-purpose');
      const inspectDesc = document.getElementById('inspect-desc');
      const inspectExtra = document.getElementById('inspect-extra');

      if (!node) {
        // Reset to system
        inspectType.textContent = 'System';
        inspectTitle.textContent = data.system.name;
        inspectPurpose.textContent = data.system.purpose || 'Living architectural memory model.';
        inspectDesc.textContent = data.system.description;
        inspectExtra.innerHTML = '';
        return;
      }

      const type = data.domains.some(n => n.id === id) ? 'domain' :
                   data.features.some(n => n.id === id) ? 'feature' : 'component';

      inspectType.textContent = type;
      inspectTitle.textContent = node.name;
      inspectPurpose.textContent = node.purpose || 'No purpose declared.';
      inspectDesc.textContent = node.description;

      let extraHtml = '';

      // Task 11: Render Complexity metrics directly in the offline HTML inspector panel
      if (node.complexity_classification) {
        extraHtml += \`
          <div>
            <h3 class="text-xs font-semibold text-gray-400 tracking-wider uppercase font-mono mb-2">Cognitive Complexity</h3>
            <div class="bg-white/[0.02] border border-white/5 rounded-lg p-3">
              <span class="text-[10px] uppercase text-gray-500 block font-mono">Score: \${node.complexity_score}</span>
              <span class="text-xs font-bold text-white uppercase">\${node.complexity_classification}</span>
            </div>
          </div>
        \`;
      }

      // Render Capabilities
      if (node.capabilities && node.capabilities.length > 0) {
        extraHtml += \`
          <div>
            <h3 class="text-xs font-semibold text-gray-400 tracking-wider uppercase font-mono mb-2">Capabilities</h3>
            <ul class="space-y-1.5">
              \${node.capabilities.map(cap => \`
                <li class="text-xs text-gray-300 flex items-start gap-2">
                  <span class="text-brand mt-0.5">•</span>
                  <span>\${cap}</span>
                </li>
              \`).join('')}
            </ul>
          </div>
        \`;
      }

      // Render Status Matrix
      if (node.status) {
        extraHtml += \`
          <div>
            <h3 class="text-xs font-semibold text-gray-400 tracking-wider uppercase font-mono mb-2">Status Metrics</h3>
            <div class="grid grid-cols-2 gap-2">
              \${Object.entries(node.status).map(([k, v]) => \`
                <div class="bg-white/[0.02] border border-white/5 rounded-lg p-2">
                  <span class="text-[9px] uppercase text-gray-500 block font-mono">\${k.replace('_', ' ')}</span>
                  <span class="text-xs font-semibold text-white uppercase">\${v}</span>
                </div>
              \`).join('')}
            </div>
          </div>
        \`;
      }

      // Render Temporal metadata
      if (node.created_at || node.updated_at) {
        extraHtml += \`
          <div>
            <h3 class="text-xs font-semibold text-gray-400 tracking-wider uppercase font-mono mb-2">Evolution Timeline</h3>
            <div class="space-y-1 text-[11px] text-gray-400 font-mono">
              \${node.created_at ? \`<div>Created: \${node.created_at}</div>\` : ''}
              \${node.updated_at ? \`<div>Updated: \${node.updated_at}</div>\` : ''}
              \${node.last_modified_by ? \`<div>By Agent: \${node.last_modified_by}</div>\` : ''}
            </div>
          </div>
        \`;
      }

      inspectExtra.innerHTML = extraHtml;
    }

    // Init Lucide
    lucide.createIcons();
    
    // Initial Render
    updateView();
  </script>
</body>
</html>`;

  await fs.writeFile(outputPath, htmlContent, 'utf8');
  console.log(chalk.bold.green(`✓ Visualizer map successfully packaged offline: ${outputFilename}\n`));
}
