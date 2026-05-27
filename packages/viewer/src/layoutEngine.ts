import { type Node, type Edge, MarkerType } from 'reactflow';
import { type Domain, type Feature, type Component, type Relationship, type InvalidNode } from './types';

interface LayoutInput {
  domains: Domain[];
  features: Feature[];
  components: Component[];
  relationships: Relationship[];
  invalidNodes?: InvalidNode[];
  expandedDomainIds: Set<string>;
  expandedFeatureIds: Set<string>;
  selectedNodeId: string | null;
  activeFocusFilter?: string | null;
  searchTerm?: string;
}

// Deterministic Domain Color corridor signature mapping (Task 7)
const DOMAIN_COLORS = [
  { name: 'copper', hex: '#D98C3F', glow: 'rgba(217, 140, 63, 0.15)' },
  { name: 'deep-orange', hex: '#FF8A3D', glow: 'rgba(255, 138, 61, 0.15)' },
  { name: 'gold', hex: '#FBBF24', glow: 'rgba(251, 191, 36, 0.15)' },
  { name: 'amber', hex: '#F59E0B', glow: 'rgba(245, 158, 11, 0.15)' },
  { name: 'coral', hex: '#FF6B6B', glow: 'rgba(255, 107, 107, 0.15)' }
];

function getDomainColor(domainId: string) {
  let hash = 0;
  for (let i = 0; i < domainId.length; i++) {
    hash = domainId.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % DOMAIN_COLORS.length;
  return DOMAIN_COLORS[index];
}

export function computeGraphLayout({
  domains,
  features,
  components,
  relationships,
  invalidNodes = [],
  expandedDomainIds,
  expandedFeatureIds,
  selectedNodeId,
  activeFocusFilter,
  searchTerm
}: LayoutInput): { nodes: Node[]; edges: Edge[] } {
  const graphNodes: Node[] = [];
  const graphEdges: Edge[] = [];

  const visibleNodeIds = new Set<string>();

  // --- 1. Compute Focus/Priority & Search matching neighborhood (Task 5 & 9) ---
  const getSelectedNeighborhood = () => {
    const neighborhood = new Set<string>();
    if (!selectedNodeId) return null;
    
    neighborhood.add(selectedNodeId);
    
    // Direct relationships
    relationships.forEach(rel => {
      if (rel.source === selectedNodeId) neighborhood.add(rel.target);
      if (rel.target === selectedNodeId) neighborhood.add(rel.source);
    });
    
    // Domain selection neighborhood
    const dom = domains.find(d => d.id === selectedNodeId);
    if (dom) {
      features.forEach(f => {
        if (f.domains.includes(dom.id)) {
          neighborhood.add(f.id);
          f.components.forEach(cId => neighborhood.add(cId));
        }
      });
    }
    
    // Feature selection neighborhood
    const feat = features.find(f => f.id === selectedNodeId);
    if (feat) {
      feat.domains.forEach(dId => neighborhood.add(dId));
      feat.components.forEach(cId => {
        neighborhood.add(cId);
        relationships.forEach(rel => {
          if (rel.source === cId) neighborhood.add(rel.target);
          if (rel.target === cId) neighborhood.add(rel.source);
        });
      });
    }
    
    // Component selection neighborhood
    const comp = components.find(c => c.id === selectedNodeId);
    if (comp) {
      neighborhood.add(comp.domain);
      features.forEach(f => {
        if (f.components.includes(comp.id)) {
          neighborhood.add(f.id);
          f.domains.forEach(dId => neighborhood.add(dId));
        }
      });
    }
    
    return neighborhood;
  };

  const selectedNeighborhood = getSelectedNeighborhood();

  const isNodeInFocusFilter = (nodeId: string, nodeType: string, rawData: any): boolean => {
    if (!activeFocusFilter) return true;

    const isFrontendNode = () => {
      if (nodeType === 'domainNode') return nodeId.includes('FRONTEND');
      if (nodeType === 'featureNode') {
        return rawData.domains && rawData.domains.some((d: string) => d.includes('FRONTEND'));
      }
      if (nodeType === 'componentNode') {
        return rawData.domain && rawData.domain.includes('FRONTEND');
      }
      return false;
    };

    const isBackendNode = () => {
      if (nodeType === 'domainNode') return nodeId.includes('BACKEND');
      if (nodeType === 'featureNode') {
        return rawData.domains && rawData.domains.some((d: string) => d.includes('BACKEND'));
      }
      if (nodeType === 'componentNode') {
        return rawData.domain && rawData.domain.includes('BACKEND');
      }
      return false;
    };

    switch (activeFocusFilter) {
      case 'high-risk':
        return rawData.status?.risk === 'high' || rawData.status?.risk === 'critical';
      case 'evolving':
        return rawData.status?.lifecycle === 'evolving';
      case 'unstable':
        return rawData.status?.reliability === 'unstable';
      case 'frontend-only':
        return isFrontendNode();
      case 'backend-only':
        return isBackendNode();
      case 'deprecated':
        return rawData.status?.lifecycle === 'deprecated';
      case 'experimental':
        return rawData.status?.maturity === 'experimental';
      default:
        return true;
    }
  };

  const isSearchMatch = (id: string, name: string, desc: string, sum?: string): boolean => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase().trim();
    return id.toLowerCase().includes(term) || 
           name.toLowerCase().includes(term) || 
           desc.toLowerCase().includes(term) || 
           (sum ? sum.toLowerCase().includes(term) : false);
  };

  const isNodePrioritized = (id: string, type: string, rawData: any): boolean => {
    const inFilter = isNodeInFocusFilter(id, type, rawData);
    const inSearch = isSearchMatch(id, rawData.name || '', rawData.description || '', rawData.summary || '');
    const inNeighborhood = selectedNeighborhood ? selectedNeighborhood.has(id) : true;
    return inFilter && inSearch && inNeighborhood;
  };

  // --- 2. Isolated Malformed Cognition Nodes (Task 1) ---
  const DOMAIN_START_X = 100;
  const DOMAIN_START_Y = 320; // Lowered to leave generous space for isolated invalid nodes

  if (invalidNodes && invalidNodes.length > 0) {
    invalidNodes.forEach((inv, invIdx) => {
      const invX = DOMAIN_START_X + invIdx * 350;
      const invY = 60; // Clean, isolated header lane
      visibleNodeIds.add(inv.id);

      const isInvSelected = selectedNodeId === inv.id;
      const isPrioritized = selectedNodeId ? isInvSelected : true;

      graphNodes.push({
        id: inv.id,
        type: 'invalidNode',
        position: { x: invX, y: invY },
        style: {
          opacity: isPrioritized ? 1.0 : 0.08,
          transition: 'opacity 0.2s ease-in-out'
        },
        data: {
          ...inv,
          isActive: isInvSelected
        }
      });
    });
  }

  // --- 3. Deterministic Positioning Tree Layout with Dynamic Spacing (Task 4, 6 & 7) ---
  const DOMAIN_GAP_X = 900;
  const MAX_DOMAINS_RENDER = 20;
  const shouldChunk = domains.length > MAX_DOMAINS_RENDER && !selectedNodeId;
  const domainsToRender = shouldChunk ? domains.slice(0, MAX_DOMAINS_RENDER) : domains;

  domainsToRender.forEach((dom, domIdx) => {
    const domX = DOMAIN_START_X + domIdx * DOMAIN_GAP_X;
    const domY = DOMAIN_START_Y;

    const isDomExpanded = expandedDomainIds.has(dom.id);
    const domainColor = getDomainColor(dom.id);
    visibleNodeIds.add(dom.id);

    const isDomPrioritized = isNodePrioritized(dom.id, 'domainNode', dom);

    // Create Domain Node with left-glow color corridor accent
    graphNodes.push({
      id: dom.id,
      type: 'domainNode',
      position: { x: domX, y: domY },
      style: {
        opacity: isDomPrioritized ? 1.0 : 0.08,
        transition: 'opacity 0.2s ease-in-out'
      },
      data: {
        ...dom,
        domainColor,
        isExpanded: isDomExpanded,
        isActive: selectedNodeId === dom.id,
        isDimmed: !isDomPrioritized
      }
    });

    if (isDomExpanded) {
      // Find features belonging to this domain
      const domainFeatures = features.filter((feat) => feat.domains.includes(dom.id));
      
      // Dynamic collision prevention tracker
      let featY = domY + 280;

      domainFeatures.forEach((feat) => {
        const featX = domX + 20;
        const isFeatExpanded = expandedFeatureIds.has(feat.id);
        visibleNodeIds.add(feat.id);

        const isFeatPrioritized = isNodePrioritized(feat.id, 'featureNode', feat);

        // Create Feature Node
        graphNodes.push({
          id: feat.id,
          type: 'featureNode',
          position: { x: featX, y: featY },
          style: {
            opacity: isFeatPrioritized ? 1.0 : 0.08,
            transition: 'opacity 0.2s ease-in-out'
          },
          data: {
            ...feat,
            domainColor,
            isExpanded: isFeatExpanded,
            isActive: selectedNodeId === feat.id,
            isDimmed: !isFeatPrioritized
          }
        });

        const featComponents = components.filter((comp) => feat.components.includes(comp.id));

        if (isFeatExpanded) {
          featComponents.forEach((comp, compIdx) => {
            const compX = featX + 340; // Bounded tight corridor spacing
            const compY = featY - 40 + compIdx * 140; // Tight localized cluster
            visibleNodeIds.add(comp.id);

            const isCompPrioritized = isNodePrioritized(comp.id, 'componentNode', comp);

            // Create Component Node
            graphNodes.push({
              id: comp.id,
              type: 'componentNode',
              position: { x: compX, y: compY },
              style: {
                opacity: isCompPrioritized ? 1.0 : 0.08,
                transition: 'opacity 0.2s ease-in-out'
              },
              data: {
                ...comp,
                domainColor,
                isActive: selectedNodeId === comp.id,
                isDimmed: !isCompPrioritized
              }
            });

            // Feature -> Component Structural Link
            const featToCompFocus = isFeatPrioritized && isCompPrioritized;
            graphEdges.push({
              id: `feat-to-comp-${feat.id}-${comp.id}`,
              source: feat.id,
              target: comp.id,
              style: {
                stroke: domainColor.hex,
                strokeDasharray: '3,3',
                strokeWidth: 1,
                opacity: featToCompFocus ? 0.7 : 0.05
              },
              animated: featToCompFocus && !selectedNodeId
            });
          });
        }

        // Domain -> Feature Structural Link
        const domToFeatFocus = isDomPrioritized && isFeatPrioritized;
        graphEdges.push({
          id: `dom-to-feat-${dom.id}-${feat.id}`,
          source: dom.id,
          target: feat.id,
          style: {
            stroke: domToFeatFocus ? '#5C6675' : '#1E232B',
            strokeWidth: 1.5,
            opacity: domToFeatFocus ? 0.6 : 0.05
          },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: domToFeatFocus ? '#5C6675' : '#1E232B'
          }
        });

        // Dynamic coordinate summation to completely prevent features overlapping (Task 6)
        const clusterHeight = isFeatExpanded ? Math.max(1, featComponents.length) * 140 : 160;
        featY += clusterHeight + 80; // Sibling normalized spacing + gap
      });
    }
  });

  // --- 4. Progressive & Noise-Capped Semantic Relationship Engine (Task 8 & 11) ---
  const relationsCache = new Set<string>();
  let semanticEdgeCount = 0;
  const MAX_SEMANTIC_EDGES = 15;

  const isNodeIdPrioritized = (id: string): boolean => {
    const node = graphNodes.find(n => n.id === id);
    return node ? node.style?.opacity === 1.0 : false;
  };

  relationships.forEach((rel) => {
    const srcId = rel.source;
    const tgtId = rel.target;

    // Direct neighborhood display OR soft visible state loading
    const isDirectNeighborhood = selectedNodeId && (srcId === selectedNodeId || tgtId === selectedNodeId);
    const isBothNodesVisible = visibleNodeIds.has(srcId) && visibleNodeIds.has(tgtId);

    // Rule: Hide secondary edges under caps when no node is selected to keep graph clean
    if (!selectedNodeId) {
      if (!isBothNodesVisible) return;
      if (semanticEdgeCount >= MAX_SEMANTIC_EDGES) return; // Cap relationship clutter
    } else {
      // If a node IS selected, only hydrate relationships connected directly to the neighborhood
      if (!isDirectNeighborhood) return;
    }

    const edgeId = `edge-${srcId}-${tgtId}`;
    if (!relationsCache.has(edgeId)) {
      relationsCache.add(edgeId);
      semanticEdgeCount++;

      const isSrcPrioritized = isNodeIdPrioritized(srcId);
      const isTgtPrioritized = isNodeIdPrioritized(tgtId);
      const isEdgePrioritized = isSrcPrioritized && isTgtPrioritized;

      const isActive = selectedNodeId === srcId || selectedNodeId === tgtId;

      graphEdges.push({
        id: edgeId,
        source: srcId,
        target: tgtId,
        label: rel.description || rel.type,
        type: 'default',
        style: {
          stroke: isActive ? '#FF8A3D' : '#3E4856',
          strokeWidth: isActive ? 2 : 1.2,
          opacity: isEdgePrioritized ? (isActive ? 1.0 : 0.4) : 0.02
        },
        animated: isActive && isEdgePrioritized,
        className: isActive ? 'active' : '',
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: isActive ? '#FF8A3D' : (isEdgePrioritized ? '#3E4856' : 'rgba(62,72,86,0.05)')
        }
      });
    }
  });

  return { nodes: graphNodes, edges: graphEdges };
}

