import React, { useState, useEffect, useRef } from 'react';
import { useReactFlow } from 'reactflow';
import { useStore } from '../store';

export const CommandPalette = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const { domains, features, components, expandedDomainIds, expandedFeatureIds, toggleDomain, toggleFeature, selectNode } = useStore();
  const { setCenter } = useReactFlow();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Aggregate all nodes into searchable entries
  const searchEntries: Array<{ id: string; name: string; type: 'domain' | 'feature' | 'component'; desc: string }> = [];
  
  domains.forEach(d => searchEntries.push({ id: d.id, name: d.name, type: 'domain', desc: d.description }));
  features.forEach(f => searchEntries.push({ id: f.id, name: f.name, type: 'feature', desc: f.description }));
  components.forEach(c => searchEntries.push({ id: c.id, name: c.name, type: 'component', desc: c.description }));

  const filtered = searchEntries.filter(entry => 
    entry.name.toLowerCase().includes(query.toLowerCase()) ||
    entry.id.toLowerCase().includes(query.toLowerCase()) ||
    entry.desc.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (entry: typeof searchEntries[0]) => {
    // 1. Expand the tree paths so the target node becomes visible
    if (entry.type === 'feature') {
      // Find parent domains of the feature and expand them
      const feat = features.find(f => f.id === entry.id);
      if (feat) {
        feat.domains.forEach(domId => {
          if (!expandedDomainIds.has(domId)) {
            toggleDomain(domId);
          }
        });
      }
    } else if (entry.type === 'component') {
      // Find the feature referencing this component
      const feat = features.find(f => f.components.includes(entry.id));
      if (feat) {
        // Expand the feature
        if (!expandedFeatureIds.has(feat.id)) {
          toggleFeature(feat.id);
        }
        // Expand the domain of the feature
        feat.domains.forEach(domId => {
          if (!expandedDomainIds.has(domId)) {
            toggleDomain(domId);
          }
        });
      }
    }

    // 2. Select the node to hydrate the details panel
    selectNode(entry.id);

    // 3. Center viewport on the node (delayed slightly to allow ReactFlow to render newly expanded nodes)
    setTimeout(() => {
      // We can search for the node element or estimate position.
      // Since our positioning tree layout is deterministic, we can look up coordinates:
      const storeNodes = useStore.getState().nodes;
      const targetNode = storeNodes.find(n => n.id === entry.id);
      if (targetNode) {
        setCenter(targetNode.position.x + 140, targetNode.position.y + 60, { zoom: 1.1, duration: 800 });
      }
    }, 150);

    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % Math.max(1, filtered.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + filtered.length) % Math.max(1, filtered.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered[selectedIndex]) {
        handleSelect(filtered[selectedIndex]);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="aam-command-palette-backdrop" onClick={onClose}>
      <div className="aam-command-palette" onClick={e => e.stopPropagation()}>
        <div className="palette-input-wrapper">
          <svg className="palette-search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            ref={inputRef}
            type="text"
            className="palette-input"
            placeholder="Search domains, capabilities, services..."
            value={query}
            onChange={e => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
          />
        </div>

        <div className="palette-results">
          {filtered.length === 0 ? (
            <div style={{ padding: '24px', textAlign: 'center', color: '#7C8796', fontSize: '14px' }}>
              No architectural records found
            </div>
          ) : (
            filtered.map((entry, idx) => (
              <div
                key={entry.id}
                className={`palette-result-item ${idx === selectedIndex ? 'selected' : ''}`}
                onClick={() => handleSelect(entry)}
                onMouseEnter={() => setSelectedIndex(idx)}
              >
                <div className="result-meta">
                  <span className="result-title">{entry.name}</span>
                  <span className="result-id">{entry.id}</span>
                </div>
                <span className="result-type">{entry.type}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
