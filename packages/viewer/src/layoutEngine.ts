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
}

export function computeGraphLayout({
  domains,
  features,
  components,
  relationships,
  expandedDomainIds,
  expandedFeatureIds,
  selectedNodeId
}: LayoutInput): { nodes: Node[]; edges: Edge[] } {
  const graphNodes: Node[] = [];
  const graphEdges: Edge[] = [];

  // --- 1. Deterministic Positioning Tree Layout ---
  const DOMAIN_GAP_X = 900;
  const DOMAIN_START_X = 100;
  const DOMAIN_START_Y = 100;

  const visibleNodeIds = new Set<string>();

  domains.forEach((dom, domIdx) => {
    const domX = DOMAIN_START_X + domIdx * DOMAIN_GAP_X;
    const domY = DOMAIN_START_Y;

    const isDomExpanded = expandedDomainIds.has(dom.id);
    visibleNodeIds.add(dom.id);

    // Create Domain Node
    graphNodes.push({
      id: dom.id,
      type: 'domainNode',
      position: { x: domX, y: domY },
      data: {
        ...dom,
        isExpanded: isDomExpanded,
        isActive: selectedNodeId === dom.id
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
        graphNodes.push({
          id: feat.id,
          type: 'featureNode',
          position: { x: featX, y: featY },
          data: {
            ...feat,
            isExpanded: isFeatExpanded,
            isActive: selectedNodeId === feat.id
          }
        });

        if (isFeatExpanded) {
          // Find components supporting this feature
          const featComponents = components.filter((comp) => feat.components.includes(comp.id));
          
          featComponents.forEach((comp, compIdx) => {
            const compX = featX + 360;
            const compY = featY - 80 + compIdx * 200;
            visibleNodeIds.add(comp.id);

            graphNodes.push({
              id: comp.id,
              type: 'componentNode',
              position: { x: compX, y: compY },
              data: {
                ...comp,
                isActive: selectedNodeId === comp.id
              }
            });

            // Helper link Feature -> Component
            graphEdges.push({
              id: `feat-to-comp-${feat.id}-${comp.id}`,
              source: feat.id,
              target: comp.id,
              style: { stroke: '#FF8A3D', strokeDasharray: '3,3', strokeWidth: 1 },
              animated: true
            });
          });
        }

        // Helper link Domain -> Feature
        graphEdges.push({
          id: `dom-to-feat-${dom.id}-${feat.id}`,
          source: dom.id,
          target: feat.id,
          style: { stroke: '#5C6675', strokeWidth: 1.5 },
          markerEnd: { type: MarkerType.ArrowClosed, color: '#5C6675' }
        });
      });
    }
  });

  // --- 2. Cognitive Edge Aggregator Engine ---
  const relationsCache = new Set<string>();

  relationships.forEach((rel) => {
    const srcId = rel.source;
    const tgtId = rel.target;

    // Scenario A: Both nodes visible
    if (visibleNodeIds.has(srcId) && visibleNodeIds.has(tgtId)) {
      const edgeId = `edge-${srcId}-${tgtId}`;
      if (!relationsCache.has(edgeId)) {
        relationsCache.add(edgeId);
        graphEdges.push({
          id: edgeId,
          source: srcId,
          target: tgtId,
          label: rel.description || rel.type,
          type: 'default',
          style: { 
            stroke: selectedNodeId === srcId || selectedNodeId === tgtId ? '#FF8A3D' : '#5C6675', 
            strokeWidth: selectedNodeId === srcId || selectedNodeId === tgtId ? 2 : 1.5 
          },
          animated: selectedNodeId === srcId || selectedNodeId === tgtId,
          className: selectedNodeId === srcId || selectedNodeId === tgtId ? 'active' : '',
          markerEnd: { 
            type: MarkerType.ArrowClosed, 
            color: selectedNodeId === srcId || selectedNodeId === tgtId ? '#FF8A3D' : '#5C6675' 
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
            graphEdges.push({
              id: edgeId,
              source: sf.id,
              target: tf.id,
              label: `(${rel.type})`,
              style: { stroke: '#FFB067', strokeWidth: 1.2, strokeDasharray: '4,4' },
              animated: true,
              markerEnd: { type: MarkerType.ArrowClosed, color: '#FFB067' }
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
          graphEdges.push({
            id: edgeId,
            source: srcDomId,
            target: tgtDomId,
            label: 'coupling',
            style: { stroke: '#D98C3F', strokeWidth: 1, strokeDasharray: '6,6' },
            markerEnd: { type: MarkerType.ArrowClosed, color: '#D98C3F' }
          });
        }
      }
    }
  });

  return { nodes: graphNodes, edges: graphEdges };
}
