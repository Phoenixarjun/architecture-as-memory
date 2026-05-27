export const InstructionsModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  if (!isOpen) return null;

  return (
    <div 
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'rgba(10, 11, 14, 0.8)',
        backdropFilter: 'blur(6px)',
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'auto'
      }}
      onClick={onClose}
    >
      <div 
        style={{
          width: '650px',
          maxWidth: '90%',
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-surface)',
          borderRadius: '12px',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8), var(--shadow-glow)',
          padding: '30px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          fontFamily: 'var(--font-sans)'
        }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-surface)', paddingBottom: '15px' }}>
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)' }}>
              🤖 AI Agent Integration
            </h2>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
              How to instruct Claude, Cursor, and Gemini to maintain this cognitive map.
            </p>
          </div>
          <button 
            style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
            onClick={onClose}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '420px', overflowY: 'auto', paddingRight: '6px' }}>
          <div style={{ background: 'var(--panel-surface)', border: '1px solid var(--border-surface)', borderRadius: '8px', padding: '16px' }}>
            <h3 style={{ fontSize: '13px', textTransform: 'uppercase', color: '#FF8A3D', fontWeight: 600, marginBottom: '8px' }}>
              1. Centralized Prompting Rules
            </h3>
            <p style={{ fontSize: '13px', lineHeight: '1.5', color: 'var(--text-secondary)' }}>
              AAM has automatically appended lightweight bootstrap references to instruction files like <code>CLAUDE.md</code> or <code>.cursorrules</code>. They instruct AI agents to read <code>/architecture</code> files before building, and write small patches after coding.
            </p>
          </div>

          <div style={{ background: 'var(--panel-surface)', border: '1px solid var(--border-surface)', borderRadius: '8px', padding: '16px' }}>
            <h3 style={{ fontSize: '13px', textTransform: 'uppercase', color: '#FF8A3D', fontWeight: 600, marginBottom: '8px' }}>
              2. Strict Mutation Rules
            </h3>
            <ul style={{ fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: '1.6', paddingLeft: '20px' }}>
              <li><strong>NO Global Rewrites</strong>: Agents must never regenerate the entire folder. Small mutations preserve state stability and prevent conflicts.</li>
              <li><strong>Stable IDs</strong>: Keep IDs deterministic (e.g., <code>FEAT-USER-AUTH</code>, <code>COMP-AUTH-SERVICE</code>). Do not change IDs during feature refactoring.</li>
              <li><strong>Record Responsibilities</strong>: Focus on cataloging *intent* and *ownership* rather than parsing pure import trees.</li>
            </ul>
          </div>

          <div style={{ background: 'var(--panel-surface)', border: '1px solid var(--border-surface)', borderRadius: '8px', padding: '16px' }}>
            <h3 style={{ fontSize: '13px', textTransform: 'uppercase', color: '#FFB067', fontWeight: 600, marginBottom: '8px', fontFamily: 'monospace' }}>
              Reference AI Rules Snippet
            </h3>
            <pre 
              style={{
                background: '#0F1115',
                padding: '12px',
                borderRadius: '6px',
                fontSize: '11px',
                fontFamily: 'var(--font-mono)',
                color: 'var(--text-secondary)',
                overflowX: 'auto',
                border: '1px solid rgba(255,255,255,0.03)'
              }}
            >
{`1. When finishing a new capability, you MUST update /architecture files.
2. Use patch semantics. Only append new items or update states.
3. Keep IDs immutable to prevent graph link corruption.`}
            </pre>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
          <button 
            style={{
              background: 'linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%)',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              padding: '10px 20px',
              cursor: 'pointer',
              fontWeight: 600,
              boxShadow: 'var(--shadow-glow)',
              fontSize: '13px'
            }}
            onClick={onClose}
          >
            Acknowledge & Close
          </button>
        </div>
      </div>
    </div>
  );
};
