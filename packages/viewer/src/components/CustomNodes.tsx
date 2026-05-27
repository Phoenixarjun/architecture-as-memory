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

  return (
    <div 
      className={`aam-node node-domain ${data.isActive ? 'aam-node-active' : ''}`}
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

  return (
    <div 
      className={`aam-node node-feature ${data.isActive ? 'aam-node-active' : ''}`}
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

  return (
    <div 
      className={`aam-node node-component ${data.isActive ? 'aam-node-active' : ''}`}
      style={{ width: '260px' }}
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
