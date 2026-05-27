import { Handle, Position } from 'reactflow';
import { useStore } from '../store';

// Helper to render state badges
const renderLifecycleBadge = (lifecycle?: string) => {
  if (!lifecycle) return null;
  return <span className={`badge badge-lifecycle-${lifecycle}`}>{lifecycle}</span>;
};

const renderRiskBadge = (risk?: string) => {
  if (!risk) return null;
  return <span className={`badge badge-risk-${risk}`}>risk: {risk}</span>;
};

export const DomainNode = ({ data }: { data: any }) => {
  const toggleDomain = useStore((state) => state.toggleDomain);
  const selectNode = useStore((state) => state.selectNode);

  const domainColor = data.domainColor || { hex: '#FF8A3D', glow: 'rgba(255,138,61,0.1)' };
  const borderStyle = {
    borderLeft: `4px solid ${domainColor.hex}`,
    boxShadow: data.isActive ? `0 0 18px ${domainColor.hex}` : `0 4px 12px rgba(0,0,0,0.25)`
  };

  return (
    <div 
      className={`aam-node node-domain ${data.isActive ? 'aam-node-active' : ''}`}
      style={borderStyle}
      onClick={(e) => {
        e.stopPropagation();
        selectNode(data.id);
      }}
    >
      <Handle type="target" position={Position.Left} style={{ background: '#5c6675', width: 8, height: 8 }} />
      
      <div className="aam-node-header">
        <span className="aam-node-title">{data.name}</span>
        <span className="aam-node-id">{data.id}</span>
      </div>

      <div className="aam-node-desc">{data.description}</div>

      <div className="aam-node-footer">
        <span style={{ color: '#7C8796' }}>Owner: {data.ownership || 'Platform'}</span>
        <button
          style={{
            background: data.isExpanded ? 'rgba(255, 138, 61, 0.15)' : 'rgba(255, 255, 255, 0.05)',
            border: `1px solid ${data.isExpanded ? '#FF8A3D' : '#2A313D'}`,
            color: data.isExpanded ? '#FFB067' : '#B8C0CC',
            padding: '4px 10px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '11px',
            fontWeight: 500,
            transition: 'all 0.2s'
          }}
          onClick={(e) => {
            e.stopPropagation();
            toggleDomain(data.id);
          }}
        >
          {data.isExpanded ? 'Collapse' : 'Explore'}
        </button>
      </div>

      <Handle type="source" position={Position.Right} style={{ background: '#FF8A3D', width: 8, height: 8 }} />
    </div>
  );
};

export const FeatureNode = ({ data }: { data: any }) => {
  const toggleFeature = useStore((state) => state.toggleFeature);
  const selectNode = useStore((state) => state.selectNode);

  const domainColor = data.domainColor || { hex: '#FF8A3D', glow: 'rgba(255,138,61,0.1)' };
  const borderStyle = {
    borderLeft: `3px dashed ${domainColor.hex}`,
    boxShadow: data.isActive ? `0 0 18px ${domainColor.hex}` : `0 4px 12px rgba(0,0,0,0.25)`
  };

  return (
    <div 
      className={`aam-node node-feature ${data.isActive ? 'aam-node-active' : ''}`}
      style={borderStyle}
      onClick={(e) => {
        e.stopPropagation();
        selectNode(data.id);
      }}
    >
      <Handle type="target" position={Position.Left} style={{ background: '#5c6675', width: 6, height: 6 }} />
      
      <div className="aam-node-header">
        <span className="aam-node-title" style={{ fontSize: '15px' }}>{data.name}</span>
        <span className="aam-node-id">{data.id}</span>
      </div>

      <div className="aam-node-desc" style={{ fontSize: '11.5px', minHeight: '30px' }}>{data.description}</div>

      <div style={{ display: 'flex', gap: '6px', marginBottom: '10px', flexWrap: 'wrap' }}>
        {renderLifecycleBadge(data.status?.lifecycle)}
        {renderRiskBadge(data.status?.risk)}
      </div>

      <div className="aam-node-footer">
        <span style={{ color: '#7C8796' }}>{data.components?.length || 0} Components</span>
        <button
          style={{
            background: data.isExpanded ? 'rgba(255, 138, 61, 0.15)' : 'rgba(255, 255, 255, 0.05)',
            border: `1px solid ${data.isExpanded ? '#FF8A3D' : '#2A313D'}`,
            color: data.isExpanded ? '#FFB067' : '#B8C0CC',
            padding: '3px 8px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '10px',
            transition: 'all 0.2s'
          }}
          onClick={(e) => {
            e.stopPropagation();
            toggleFeature(data.id);
          }}
        >
          {data.isExpanded ? 'Collapse' : 'Implementation'}
        </button>
      </div>

      <Handle type="source" position={Position.Right} style={{ background: '#FF8A3D', width: 6, height: 6 }} />
    </div>
  );
};

export const ComponentNode = ({ data }: { data: any }) => {
  const selectNode = useStore((state) => state.selectNode);

  const domainColor = data.domainColor || { hex: '#FF8A3D', glow: 'rgba(255,138,61,0.1)' };
  const borderStyle = {
    borderLeft: `2px solid ${domainColor.hex}`,
    boxShadow: data.isActive ? `0 0 18px ${domainColor.hex}` : `0 4px 12px rgba(0,0,0,0.25)`,
    width: '260px'
  };

  return (
    <div 
      className={`aam-node node-component ${data.isActive ? 'aam-node-active' : ''}`}
      style={borderStyle}
      onClick={(e) => {
        e.stopPropagation();
        selectNode(data.id);
      }}
    >
      <Handle type="target" position={Position.Left} style={{ background: '#5c6675', width: 6, height: 6 }} />
      
      <div className="aam-node-header">
        <span className="aam-node-title" style={{ fontSize: '13.5px', color: '#FFB067' }}>{data.name}</span>
        <span className="aam-node-id">{data.id}</span>
      </div>

      <div className="aam-node-desc" style={{ fontSize: '11px', color: '#B8C0CC', minHeight: '26px' }}>{data.description}</div>

      <div className="aam-node-footer" style={{ fontSize: '10px', borderTop: 'none', paddingTop: 0 }}>
        <span className="badge" style={{ background: 'rgba(255,255,255,0.04)', color: '#7C8796' }}>
          {data.status?.maturity || 'production'}
        </span>
        <span style={{ color: '#7C8796', fontSize: '9px', fontFamily: 'monospace' }}>
          {data.status?.lifecycle || 'active'}
        </span>
      </div>

      <Handle type="source" position={Position.Right} style={{ background: '#FF8A3D', width: 6, height: 6 }} />
    </div>
  );
};

export const InvalidNode = ({ data }: { data: any }) => {
  const selectNode = useStore((state) => state.selectNode);

  return (
    <div 
      className={`aam-node node-invalid ${data.isActive ? 'aam-node-active' : ''}`}
      style={{
        border: '1px solid #EF4444',
        background: 'rgba(239, 68, 68, 0.05)',
        boxShadow: data.isActive ? '0 0 16px rgba(239, 68, 68, 0.4)' : '0 0 8px rgba(239, 68, 68, 0.1)',
        width: '280px'
      }}
      onClick={(e) => {
        e.stopPropagation();
        selectNode(data.id);
      }}
    >
      <div className="aam-node-header" style={{ borderBottom: '1px solid rgba(239, 68, 68, 0.2)', paddingBottom: '6px' }}>
        <span className="aam-node-title" style={{ fontSize: '13.5px', color: '#EF4444', display: 'flex', alignItems: 'center', gap: '6px' }}>
          ⚠️ Malformed Cognition
        </span>
        <span className="aam-node-id" style={{ color: '#EF4444', opacity: 0.8 }}>{data.name}</span>
      </div>

      <div className="aam-node-desc" style={{ fontSize: '11px', color: '#EF4444', minHeight: '26px', marginTop: '6px', fontFamily: 'monospace' }}>
        {data.error ? data.error.substring(0, 100) + '...' : 'Syntax Error'}
      </div>

      <div className="aam-node-footer" style={{ fontSize: '10px', borderTop: 'none', paddingTop: 0 }}>
        <span style={{ color: '#EF4444', opacity: 0.8, fontSize: '9px', fontFamily: 'monospace' }}>
          {data.file}
        </span>
      </div>
    </div>
  );
};
