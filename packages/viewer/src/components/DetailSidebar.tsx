import { useStore } from '../store';

export const DetailSidebar = ({ onClose }: { onClose: () => void }) => {
  const { 
    selectedNodeId, 
    domains, 
    features, 
    components, 
    relationships 
  } = useStore();

  if (!selectedNodeId) return null;

  // 1. Identify which record type is active
  const domainNode = domains.find(d => d.id === selectedNodeId);
  const featureNode = features.find(f => f.id === selectedNodeId);
  const componentNode = components.find(c => c.id === selectedNodeId);

  const node = domainNode || featureNode || componentNode;
  if (!node) return null;

  const type = domainNode ? 'Domain' : featureNode ? 'Feature Capability' : 'Component Service';

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
        {/* Description Section */}
        <div className="sidebar-section">
          <span className="sidebar-section-title">Cognitive Description</span>
          <div className="sidebar-card" style={{ fontSize: '13.5px', lineHeight: '1.5', color: 'var(--text-secondary)' }}>
            {node.description}
          </div>
        </div>

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
