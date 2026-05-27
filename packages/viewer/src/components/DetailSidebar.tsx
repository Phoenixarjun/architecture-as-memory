import { useStore } from '../store';

export const DetailSidebar = ({ onClose }: { onClose: () => void }) => {
  const { 
    selectedNodeId, 
    domains, 
    features, 
    components, 
    relationships,
    invalidNodes
  } = useStore();

  if (!selectedNodeId) return null;

  const domainNode = domains.find(d => d.id === selectedNodeId);
  const featureNode = features.find(f => f.id === selectedNodeId);
  const componentNode = components.find(c => c.id === selectedNodeId);
  const invalidNode = invalidNodes ? invalidNodes.find(i => i.id === selectedNodeId) : null;

  const type = domainNode ? 'Domain' 
             : featureNode ? 'Feature Capability' 
             : componentNode ? 'Component Service' 
             : 'Malformed Cognition Node';

  // If this is an invalid node, render a specialized error diagnostic panel
  if (invalidNode) {
    return (
      <div className={`aam-sidebar open`} style={{ borderLeft: '2px solid #EF4444' }}>
        <div className="sidebar-header" style={{ borderBottom: '1px solid rgba(239, 68, 68, 0.2)' }}>
          <div className="sidebar-title-area">
            <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#EF4444', fontWeight: 600 }}>
              {type}
            </span>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 700, marginTop: '4px', color: '#EF4444' }}>
              {invalidNode.name}
            </h2>
            <code style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'rgba(239, 68, 68, 0.8)' }}>
              {invalidNode.file}
            </code>
          </div>
          <button className="sidebar-close-btn" onClick={onClose} style={{ color: '#EF4444' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div className="sidebar-body">
          {/* Diagnostic Exception Section */}
          <div className="sidebar-section">
            <span className="sidebar-section-title" style={{ color: '#EF4444' }}>Parsing Exception Diagnostics</span>
            <div className="sidebar-card" style={{
              background: 'rgba(239, 68, 68, 0.05)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              fontSize: '12px',
              fontFamily: 'monospace',
              lineHeight: '1.6',
              color: '#FCA5A5',
              padding: '12px',
              whiteSpace: 'pre-wrap'
            }}>
              {invalidNode.error}
            </div>
          </div>

          {/* Raw Contents Section */}
          {invalidNode.content && (
            <div className="sidebar-section">
              <span className="sidebar-section-title">Raw Content Stream</span>
              <div style={{
                background: '#07080A',
                border: '1px solid rgba(255,255,255,0.05)',
                borderRadius: '8px',
                padding: '12px',
                maxHeight: '300px',
                overflow: 'auto',
                fontSize: '11px',
                fontFamily: 'monospace',
                color: '#B8C0CC',
                lineHeight: '1.5'
              }}>
                <pre style={{ margin: 0 }}>
                  {invalidNode.content.split('\n').map((line, idx) => (
                    <div key={idx} style={{ display: 'flex' }}>
                      <span style={{ width: '28px', color: '#5C6675', userSelect: 'none', textAlign: 'right', paddingRight: '8px' }}>
                        {idx + 1}
                      </span>
                      <span>{line}</span>
                    </div>
                  ))}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  const node = domainNode || featureNode || componentNode;
  if (!node) return null;

  // 2. Aggregate direct relationships (incoming and outgoing)
  const incoming = relationships.filter(r => r.target === selectedNodeId);
  const outgoing = relationships.filter(r => r.source === selectedNodeId);

  // Status mapping
  const status = (node as any).status || {};

  return (
    <div className={`aam-sidebar ${selectedNodeId ? 'open' : ''}`}>
      <div className="sidebar-header">
        <div className="sidebar-title-area">
          <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#FF8A3D', fontWeight: 600 }}>
            {type}
          </span>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 700, marginTop: '4px' }}>
            {node.name}
          </h2>
          <code style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)' }}>
            {node.id}
          </code>
        </div>
        <button className="sidebar-close-btn" onClick={onClose}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      <div className="sidebar-body">
        {/* Cognitive Summary (Task 3) */}
        {node.summary && (
          <div className="sidebar-section">
            <span className="sidebar-section-title">Cognitive Summary (What)</span>
            <div className="sidebar-card" style={{ fontSize: '13px', lineHeight: '1.45', color: '#FFB067', fontStyle: 'italic', background: 'rgba(255, 138, 61, 0.03)', borderLeft: '3px solid #FF8A3D' }}>
              "{node.summary}"
            </div>
          </div>
        )}

        {/* Purpose (Why) Section */}
        <div className="sidebar-section">
          <span className="sidebar-section-title">Architectural Purpose (Why)</span>
          <div className="sidebar-card" style={{ fontSize: '13.5px', lineHeight: '1.5', color: 'var(--text-secondary)' }}>
            {node.purpose || <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>No purpose statement declared in YAML. Purpose validates WHY this node exists in cognitive space.</span>}
          </div>
        </div>

        {/* Description Section */}
        <div className="sidebar-section">
          <span className="sidebar-section-title">Cognitive Description</span>
          <div className="sidebar-card" style={{ fontSize: '13.5px', lineHeight: '1.5', color: 'var(--text-secondary)' }}>
            {node.description || <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>No descriptive summary declared.</span>}
          </div>
        </div>

        {/* Capabilities Section */}
        <div className="sidebar-section">
          <span className="sidebar-section-title">Operational Capabilities</span>
          <div className="sidebar-card">
            {(node as any).capabilities && (node as any).capabilities.length > 0 ? (
              <ul className="capabilities-list" style={{ margin: 0, paddingLeft: '16px', fontSize: '13px', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                {(node as any).capabilities.map((cap: string, i: number) => (
                  <li key={i} style={{ marginBottom: '4px' }}>{cap}</li>
                ))}
              </ul>
            ) : (
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontStyle: 'italic' }}>No active capability rules defined for this node yet.</div>
            )}
          </div>
        </div>

        {/* Knowledge Links Section */}
        <div className="sidebar-section">
          <span className="sidebar-section-title">Knowledge Links</span>
          {(node as any).knowledge_links && (node as any).knowledge_links.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {(node as any).knowledge_links.map((link: any, i: number) => (
                <a
                  key={i}
                  href={link.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="knowledge-link-item"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '12px',
                    color: '#FFB067',
                    textDecoration: 'none',
                    padding: '6px 8px',
                    borderRadius: '4px',
                    background: 'rgba(255,176,103,0.04)',
                    border: '1px solid rgba(255,176,103,0.08)',
                    transition: 'all 0.2s ease',
                    overflow: 'hidden'
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                  </svg>
                  <span style={{ fontWeight: 600, textTransform: 'uppercase', fontSize: '9px', color: '#FF8A3D', flexShrink: 0 }}>
                    {link.type}:
                  </span>
                  <span style={{ color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {link.path}
                  </span>
                </a>
              ))}
            </div>
          ) : (
            <div className="sidebar-card" style={{ fontSize: '12px', color: 'var(--text-muted)', fontStyle: 'italic' }}>
              No links or instruction mappings attached to this node.
            </div>
          )}
        </div>

        {/* Enhancements Section */}
        {(node as any).enhancements && (node as any).enhancements.length > 0 && (
          <div className="sidebar-section">
            <span className="sidebar-section-title">Technical Enhancements</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {(node as any).enhancements.map((enh: any, i: number) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '12px',
                    padding: '6px 8px',
                    borderRadius: '4px',
                    background: 'rgba(255,255,255,0.02)',
                    borderLeft: '3px solid #D98C3F'
                  }}
                >
                  <span style={{ color: 'var(--text-secondary)' }}>{enh.title}</span>
                  <span className={`badge badge-priority-${(enh.priority || 'medium').toLowerCase()}`} style={{ fontSize: '9px', textTransform: 'uppercase', padding: '1px 5px' }}>
                    {enh.priority || 'medium'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Multi-Dimensional States (Features & Components) */}
        {Object.keys(status).length > 0 && (
          <div className="sidebar-section">
            <span className="sidebar-section-title">Operational Cognition Matrix</span>
            <div className="sidebar-card">
              <table className="state-matrix">
                <tbody>
                  {status.lifecycle && (
                    <tr>
                      <td className="label">Lifecycle Stage</td>
                      <td className="value">
                        <span className={`badge badge-lifecycle-${status.lifecycle}`}>{status.lifecycle}</span>
                      </td>
                    </tr>
                  )}
                  {status.implementation && (
                    <tr>
                      <td className="label">Implementation</td>
                      <td className="value">
                        <span className="badge" style={{ background: 'rgba(255,255,255,0.05)', color: '#FFB067' }}>
                          {status.implementation}
                        </span>
                      </td>
                    </tr>
                  )}
                  {status.reliability && (
                    <tr>
                      <td className="label">System Reliability</td>
                      <td className="value">
                        <span className="badge" style={{ background: 'rgba(255,255,255,0.05)', color: status.reliability === 'hardened' ? '#D98C3F' : '#FFB067' }}>
                          {status.reliability}
                        </span>
                      </td>
                    </tr>
                  )}
                  {status.observability && (
                    <tr>
                      <td className="label">Observability Coverage</td>
                      <td className="value">
                        <span className="badge" style={{ background: 'rgba(255,255,255,0.05)', color: status.observability === 'complete' ? '#D98C3F' : '#7C8796' }}>
                          {status.observability}
                        </span>
                      </td>
                    </tr>
                  )}
                  {status.risk && (
                    <tr>
                      <td className="label">Operational Risk</td>
                      <td className="value">
                        <span className={`badge badge-risk-${status.risk}`}>{status.risk}</span>
                      </td>
                    </tr>
                  )}
                  {status.change_frequency && (
                    <tr>
                      <td className="label">Churn Rate</td>
                      <td className="value">
                        <span className="badge" style={{ background: 'rgba(255,255,255,0.04)', color: '#FF8A3D' }}>
                          {status.change_frequency}
                        </span>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Ownership Allocation */}
        {(node as any).ownership && (
          <div className="sidebar-section">
            <span className="sidebar-section-title">Ownership & Responsibility</span>
            <div className="sidebar-card" style={{ fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#FFB067' }}>
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
              <span>{(node as any).ownership}</span>
            </div>
          </div>
        )}

        {/* Operational Topology / Relationships */}
        <div className="sidebar-section">
          <span className="sidebar-section-title">Dependency Relationships</span>
          <div className="sidebar-card" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {/* Outgoing */}
            <div>
              <div style={{ fontSize: '11px', color: '#7C8796', marginBottom: '6px', fontWeight: 600 }}>Dependencies (Outbound)</div>
              {outgoing.length === 0 ? (
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontStyle: 'italic' }}>No outbound dependencies declared</div>
              ) : (
                outgoing.map((rel, idx) => (
                  <div key={idx} style={{ fontSize: '12.5px', marginBottom: '4px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <span style={{ color: '#FF8A3D' }}>→</span> <code style={{ color: 'var(--text-primary)' }}>{rel.target}</code>
                    </div>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{rel.type}</span>
                  </div>
                ))
              )}
            </div>

            {/* Incoming */}
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '10px' }}>
              <div style={{ fontSize: '11px', color: '#7C8796', marginBottom: '6px', fontWeight: 600 }}>Consumers (Inbound)</div>
              {incoming.length === 0 ? (
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontStyle: 'italic' }}>No inbound clients declared</div>
              ) : (
                incoming.map((rel, idx) => (
                  <div key={idx} style={{ fontSize: '12.5px', marginBottom: '4px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <span style={{ color: '#FFB067' }}>←</span> <code style={{ color: 'var(--text-primary)' }}>{rel.source}</code>
                    </div>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{rel.type}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
