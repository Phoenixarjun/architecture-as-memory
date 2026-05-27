import { useEffect, useState } from 'react';
import ReactFlow, { 
  Background, 
  Controls, 
  ReactFlowProvider,
  useReactFlow 
} from 'reactflow';
import 'reactflow/dist/style.css';

import { useStore } from './store';
import { DomainNode, FeatureNode, ComponentNode, InvalidNode } from './components/CustomNodes';
import { DetailSidebar } from './components/DetailSidebar';
import { CommandPalette } from './components/CommandPalette';
import { InstructionsModal } from './components/InstructionsModal';

const nodeTypes = {
  domainNode: DomainNode,
  featureNode: FeatureNode,
  componentNode: ComponentNode,
  invalidNode: InvalidNode
};

function ViewerCockpit() {
  const { 
    system, 
    nodes, 
    edges, 
    isLoading, 
    isSyncing, 
    activeFocusFilter,
    fetchArchitecture, 
    setupEventSource,
    selectNode,
    setFocusFilter,
    onNodesChange,
    onEdgesChange
  } = useStore();

  const { fitView } = useReactFlow();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // 1. Initial hydration from Express API
    fetchArchitecture().then(() => {
      // 2. Center/fit graph once loaded with wide bird's-eye view spacing
      setTimeout(() => fitView({ padding: 0.6, maxZoom: 0.65, duration: 600 }), 300);
    });

    // 3. Connect to Server-Sent Events (SSE) watcher stream
    setupEventSource();

    // 4. Register Ctrl+K / Cmd+K hotkey for quick search command palette
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (isLoading) {
    return (
      <div style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0F1115',
        color: '#F5F7FA',
        fontFamily: 'var(--font-sans)'
      }}>
        <div style={{ position: 'relative', marginBottom: '24px' }}>
          <img 
            src="/AAMLogo.png" 
            alt="AAM Logo" 
            style={{ 
              height: '52px', 
              width: 'auto', 
              animation: 'breath 2s infinite ease-in-out' 
            }} 
          />
        </div>
        <p style={{ fontSize: '13px', letterSpacing: '0.08em', color: '#B8C0CC', fontFamily: 'monospace', textTransform: 'uppercase' }}>
          Hydrating Cognitive Architecture...
        </p>
        <style>{`
          @keyframes breath {
            0%, 100% { opacity: 0.35; transform: scale(0.96); filter: drop-shadow(0 0 4px rgba(255, 138, 61, 0.1)); }
            50% { opacity: 1; transform: scale(1.04); filter: drop-shadow(0 0 16px rgba(255, 138, 61, 0.4)); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}>
      {/* 1. Interactive Graph Canvas */}
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onPaneClick={() => selectNode(null)}
        minZoom={0.2}
        maxZoom={2}
      >
        <Background color="#2A313D" gap={20} size={1} />
        <Controls showInteractive={false} position="bottom-left" />
      </ReactFlow>

      {/* 2. Floating Dashboard Chrome (HUD) */}
      <div className="aam-console">
        <header className="aam-header">
          <div className="aam-brand">
            <img src="/AAMLogo.png" alt="AAM Logo" className="aam-logo-img" />
            <div className="aam-brand-divider"></div>
            <div className="aam-brand-text">
              <span className="aam-brand-platform">Architecture As Memory</span>
              <span className="aam-brand-tag">CONSOLE</span>
            </div>
          </div>

          {/* Active Project Glassmorphic Context Badge */}
          <div className="aam-project-context">
            <div className="aam-project-pulse"></div>
            <div className="aam-project-info">
              <span className="aam-project-label">Active Memory Context</span>
              <h2 className="aam-project-name">{system.name || 'AuraBank Core Banking Platform'}</h2>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', pointerEvents: 'auto' }}>
            {/* Focus Filter Select (Task 9) */}
            <select
              value={activeFocusFilter || ''}
              onChange={(e) => setFocusFilter(e.target.value || null)}
              style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-surface)',
                color: 'var(--text-secondary)',
                padding: '8px 12px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '13px',
                outline: 'none',
                transition: 'all 0.2s',
                pointerEvents: 'auto'
              }}
              className="focus-filter-select"
            >
              <option value="">🎯 Focus: All Nodes</option>
              <option value="high-risk">⚠️ High Risk / Critical</option>
              <option value="evolving">🔄 Evolving Lifecycles</option>
              <option value="unstable">⚡ Unstable Reliability</option>
              <option value="frontend-only">🎨 Frontend Only</option>
              <option value="backend-only">⚙️ Backend Only</option>
              <option value="deprecated">🚫 Deprecated Nodes</option>
              <option value="experimental">🧪 Experimental Maturity</option>
            </select>

            {/* Search Trigger */}
            <button
              style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-surface)',
                color: 'var(--text-secondary)',
                padding: '8px 16px',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                fontSize: '13px',
                transition: 'all 0.2s'
              }}
              onClick={() => setIsSearchOpen(true)}
              className="search-trigger-btn"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <span>Search <kbd style={{ background: 'rgba(255,255,255,0.06)', padding: '2px 4px', borderRadius: '3px', marginLeft: '4px', fontSize: '10px' }}>Ctrl+K</kbd></span>
            </button>

            {/* Syncing Indicator Status */}
            <div className="aam-status-indicator">
              <div className={`status-dot ${isSyncing ? 'syncing' : ''}`}></div>
              <span>{isSyncing ? 'Synchronizing' : 'Live Sync active'}</span>
            </div>
          </div>
        </header>
      </div>

      {/* 3. Slideover Inspector Details Panel */}
      <DetailSidebar onClose={() => selectNode(null)} />

      {/* 4. Command Palette Dialog */}
      <CommandPalette isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* 5. Instruction Modal Dialog */}
      <InstructionsModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      {/* 6. Floating Agent Rules Toggle */}
      <button className="instructions-toggle-btn" onClick={() => setIsModalOpen(true)}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
          <line x1="12" y1="17" x2="12.01" y2="17"></line>
        </svg>
        <span>Agent Rules</span>
      </button>
    </div>
  );
}

export default function App() {
  return (
    <ReactFlowProvider>
      <ViewerCockpit />
    </ReactFlowProvider>
  );
}
