import { type Node, type Edge, MarkerType } from 'reactflow';
import { type Domain, type Feature, type Component, type Relationship } from './types';

interface LayoutInput {
  domains: Domain[];
  features: Feature[];
  components: Component[];
  relationships: Relationship[];
  expandedDomainIds: Set<string>;
  expandedFeatureIds: Set<string>;
  selectedNodeId: string | null;
  activeFocusFilter?: string | null;
}

export function computeGraphLayout({
  domains,
  features,
  components,
  relationships,
  expandedDomainIds,
  expandedFeatureIds,
  selectedNodeId,
  activeFocusFilter
}: LayoutInput): { nodes: Node[]; edges: Edge[] } {
  const graphNodes: Node[] = [];
  const graphEdges: Edge[] = [];

  // Focus Mode matching helper (Task 9)
  const isNodeInFocus = (nodeId: string, nodeType: string, rawData: any): boolean => {
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

  // --- 1. Deterministic Positioning Tree Layout ---
  const DOMAIN_GAP_X = 900;
  const DOMAIN_START_X = 100;
  const DOMAIN_START_Y = 100;

  const visibleNodeIds = new Set<string>();

  // Enterprise-Scale Graph Strategy (Task 10): Chunk-load/lazy-render first 20 domains
  const MAX_DOMAINS_RENDER = 20;
  const shouldChunk = domains.length > MAX_DOMAINS_RENDER && !selectedNodeId;
  const domainsToRender = shouldChunk ? domains.slice(0, MAX_DOMAINS_RENDER) : domains;

  domainsToRender.forEach((dom, domIdx) => {
    const domX = DOMAIN_START_X + domIdx * DOMAIN_GAP_X;
    const domY = DOMAIN_START_Y;

    const isDomExpanded = expandedDomainIds.has(dom.id);
    visibleNodeIds.add(dom.id);

    // Create Domain Node
    const isDomFocus = isNodeInFocus(dom.id, 'domainNode', dom);
    graphNodes.push({
      id: dom.id,
      type: 'domainNode',
      position: { x: domX, y: domY },
      style: { opacity: isDomFocus ? 1.0 : 0.15, transition: 'opacity 0.2s ease-in-out' },
      data: {
        ...dom,
        isExpanded: isDomExpanded,
        isActive: selectedNodeId === dom.id,
        isDimmed: !isDomFocus
      }
    });

    if (isDomExpanded) {
      // Find features belonging to this domain
      const domainFeatures = features.filter((feat) => feat.domains.includes(dom.id));
      
      domainFeatures.forEach((feat, featIdx) => {
        const featX = domX + 20;
        const featY = domY + 240 + featIdx * 260;
        const isFeatExpanded = expandedFeatureIds.has(feat.id);
        visibleNodeIds.add(feat.id);

        // Create Feature Node
        const isFeatFocus = isNodeInFocus(feat.id, 'featureNode', feat);
        graphNodes.push({
          id: feat.id,
          type: 'featureNode',
          position: { x: featX, y: featY },
          style: { opacity: isFeatFocus ? 1.0 : 0.15, transition: 'opacity 0.2s ease-in-out' },
          data: {
            ...feat,
            isExpanded: isFeatExpanded,
            isActive: selectedNodeId === feat.id,
            isDimmed: !isFeatFocus
          }
        });

        if (isFeatExpanded) {
          // Find components supporting this feature
          const featComponents = components.filter((comp) => feat.components.includes(comp.id));
          
          featComponents.forEach((comp, compIdx) => {
            const compX = featX + 360;
            const compY = featY - 80 + compIdx * 200;
            visibleNodeIds.add(comp.id);

            const isCompFocus = isNodeInFocus(comp.id, 'componentNode', comp);
            graphNodes.push({
              id: comp.id,
              type: 'componentNode',
              position: { x: compX, y: compY },
              style: { opacity: isCompFocus ? 1.0 : 0.15, transition: 'opacity 0.2s ease-in-out' },
              data: {
                ...comp,
                isActive: selectedNodeId === comp.id,
                isDimmed: !isCompFocus
              }
            });

            // Helper link Feature -> Component
            const featToCompFocus = isFeatFocus && isCompFocus;
            graphEdges.push({
              id: `feat-to-comp-${feat.id}-${comp.id}`,
              source: feat.id,
              target: comp.id,
              style: { stroke: '#FF8A3D', strokeDasharray: '3,3', strokeWidth: 1, opacity: featToCompFocus ? 1.0 : 0.1 },
              animated: featToCompFocus
            });
          });
        }

        // Helper link Domain -> Feature
        const domToFeatFocus = isDomFocus && isFeatFocus;
        graphEdges.push({
          id: `dom-to-feat-${dom.id}-${feat.id}`,
          source: dom.id,
          target: feat.id,
          style: { stroke: '#5C6675', strokeWidth: 1.5, opacity: domToFeatFocus ? 1.0 : 0.1 },
          markerEnd: { type: MarkerType.ArrowClosed, color: domToFeatFocus ? '#5C6675' : 'rgba(92,102,117,0.1)' }
        });
      });
    }
  });

  // --- 2. Cognitive Edge Aggregator Engine ---
  const relationsCache = new Set<string>();

  // Task 5: Contextual Edge Hydration Filter
  const hydratedRelationships = relationships.filter((rel) => {
    const srcId = rel.source;
    const tgtId = rel.target;

    // Rule 1: If a node is selected, show all its direct and neighboring relationships (within 1 hop)
    if (selectedNodeId) {
      if (srcId === selectedNodeId || tgtId === selectedNodeId) return true;
      
      const isNeighbor = (nodeId: string) => {
        const feat = features.find(f => f.id === nodeId);
        if (feat && (feat.components.includes(selectedNodeId) || feat.domains.includes(selectedNodeId))) return true;
        
        const comp = components.find(c => c.id === nodeId);
        if (comp && (comp.domain === selectedNodeId || features.find(f => f.id === selectedNodeId && f.components.includes(comp.id)))) return true;
        
        return false;
      };
      if (isNeighbor(srcId) || isNeighbor(tgtId)) return true;
    }

    // Rule 2: If no node is selected, only render edges where:
    // Either both source and target are physically visible on the canvas,
    // OR their parent domains/features are expanded (lazy loading on expansion)
    const isSrcVisible = visibleNodeIds.has(srcId);
    const isTgtVisible = visibleNodeIds.has(tgtId);

    if (isSrcVisible && isTgtVisible) return true;

    // Hydrate edges on expansion: if a parent domain/feature of either node is expanded
    const isParentExpanded = (nodeId: string) => {
      const comp = components.find(c => c.id === nodeId);
      if (comp) {
        if (expandedDomainIds.has(comp.domain)) return true;
        const parentFeat = features.find(f => f.components.includes(comp.id));
        if (parentFeat && expandedFeatureIds.has(parentFeat.id)) return true;
      }
      const feat = features.find(f => f.id === nodeId);
      if (feat) {
        return feat.domains.some(d => expandedDomainIds.has(d));
      }
      return false;
    };

    if (isParentExpanded(srcId) || isParentExpanded(tgtId)) return true;

    return false;
  });

  const isNodeIdDimmed = (id: string): boolean => {
    const node = graphNodes.find(n => n.id === id);
    return node ? !!node.data.isDimmed : false;
  };

  hydratedRelationships.forEach((rel) => {
    const srcId = rel.source;
    const tgtId = rel.target;

    // Scenario A: Both nodes visible
    if (visibleNodeIds.has(srcId) && visibleNodeIds.has(tgtId)) {
      const edgeId = `edge-${srcId}-${tgtId}`;
      if (!relationsCache.has(edgeId)) {
        relationsCache.add(edgeId);
        const isDimmed = isNodeIdDimmed(srcId) || isNodeIdDimmed(tgtId);
        const isActive = selectedNodeId === srcId || selectedNodeId === tgtId;
        graphEdges.push({
          id: edgeId,
          source: srcId,
          target: tgtId,
          label: rel.description || rel.type,
          type: 'default',
          style: { 
            stroke: isActive ? '#FF8A3D' : '#5C6675', 
            strokeWidth: isActive ? 2 : 1.5,
            opacity: isDimmed ? 0.1 : 1.0
          },
          animated: isActive && !isDimmed,
          className: isActive ? 'active' : '',
          markerEnd: { 
            type: MarkerType.ArrowClosed, 
            color: isActive ? '#FF8A3D' : '#5C6675' 
          }
        });
      }
      return;
    }

    // Scenario B: Aggregated to Features
    const srcFeatures = features.filter((feat) => feat.components.includes(srcId));
    const tgtFeatures = features.filter((feat) => feat.components.includes(tgtId));

    let mappedToFeature = false;

    for (const sf of srcFeatures) {
      for (const tf of tgtFeatures) {
        if (visibleNodeIds.has(sf.id) && visibleNodeIds.has(tf.id)) {
          const edgeId = `agg-edge-feat-${sf.id}-${tf.id}`;
          if (!relationsCache.has(edgeId)) {
            relationsCache.add(edgeId);
            const isDimmed = isNodeIdDimmed(sf.id) || isNodeIdDimmed(tf.id);
            graphEdges.push({
              id: edgeId,
              source: sf.id,
              target: tf.id,
              label: `(${rel.type})`,
              style: { stroke: '#FFB067', strokeWidth: 1.2, strokeDasharray: '4,4', opacity: isDimmed ? 0.1 : 1.0 },
              animated: !isDimmed,
              markerEnd: { type: MarkerType.ArrowClosed, color: isDimmed ? 'rgba(255,176,103,0.1)' : '#FFB067' }
            });
          }
          mappedToFeature = true;
        }
      }
    }

    if (mappedToFeature) return;

    // Scenario C: Aggregated to Domains
    const getParentDomainId = (nodeId: string): string | null => {
      const directComp = components.find((c) => c.id === nodeId);
      if (directComp) return directComp.domain;

      const feat = features.find((f) => f.id === nodeId);
      if (feat && feat.domains.length > 0) return feat.domains[0];

      return null;
    };

    const srcDomId = getParentDomainId(srcId);
    const tgtDomId = getParentDomainId(tgtId);

    if (srcDomId && tgtDomId && srcDomId !== tgtDomId) {
      if (visibleNodeIds.has(srcDomId) && visibleNodeIds.has(tgtDomId)) {
        const edgeId = `agg-edge-dom-${srcDomId}-${tgtDomId}`;
        if (!relationsCache.has(edgeId)) {
          relationsCache.add(edgeId);
          const isDimmed = isNodeIdDimmed(srcDomId) || isNodeIdDimmed(tgtDomId);
          graphEdges.push({
            id: edgeId,
            source: srcDomId,
            target: tgtDomId,
            label: 'coupling',
            style: { stroke: '#D98C3F', strokeWidth: 1, strokeDasharray: '6,6', opacity: isDimmed ? 0.1 : 1.0 },
            markerEnd: { type: MarkerType.ArrowClosed, color: isDimmed ? 'rgba(217,140,63,0.1)' : '#D98C3F' }
          });
        }
      }
    }
  });

  return { nodes: graphNodes, edges: graphEdges };
}
