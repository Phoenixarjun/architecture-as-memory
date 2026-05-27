import { create } from 'zustand';
import { applyNodeChanges, applyEdgeChanges } from 'reactflow';
import { type ArchitectureState } from './types';
import { computeGraphLayout } from './layoutEngine';

const API_BASE = window.location.origin;

export const useStore = create<ArchitectureState>((set, get) => ({
  system: { id: 'SYS-AAM', name: 'Architecture As Memory', description: 'Initializing cognitive layer...' },
  domains: [],
  features: [],
  components: [],
  relationships: [],
  
  isLoading: true,
  isSyncing: false,
  selectedNodeId: null,
  expandedDomainIds: new Set<string>(),
  expandedFeatureIds: new Set<string>(),
  searchTerm: '',
  activeFocusFilter: null,
  
  nodes: [],
  edges: [],

  fetchArchitecture: async () => {
    try {
      const res = await fetch(`${API_BASE}/api/architecture`);
      const data = await res.json();
      set({
        system: data.system,
        domains: data.domains || [],
        features: data.features || [],
        components: data.components || [],
        relationships: data.relationships || [],
        isLoading: false
      });
      get().recomputeGraph();
    } catch (err) {
      console.error('Failed to load AAM architecture data:', err);
      set({ isLoading: false });
    }
  },

  setupEventSource: () => {
    try {
      const source = new EventSource(`${API_BASE}/api/events`);
      
      source.addEventListener('open', () => {
        set({ isSyncing: true });
      });

      source.addEventListener('update', (event) => {
        const data = JSON.parse(event.data);
        set({
          system: data.system,
          domains: data.domains || [],
          features: data.features || [],
          components: data.components || [],
          relationships: data.relationships || [],
          isSyncing: false
        });
        get().recomputeGraph();
      });

      source.addEventListener('error', () => {
        set({ isSyncing: false });
      });
    } catch (err) {
      console.error('Failed to initialize SSE EventSource:', err);
    }
  },

  toggleDomain: (domainId) => {
    const { expandedDomainIds } = get();
    const next = new Set(expandedDomainIds);
    if (next.has(domainId)) {
      next.delete(domainId);
    } else {
      next.add(domainId);
    }
    set({ expandedDomainIds: next });
    get().recomputeGraph();
  },

  toggleFeature: (featureId) => {
    const { expandedFeatureIds } = get();
    const next = new Set(expandedFeatureIds);
    if (next.has(featureId)) {
      next.delete(featureId);
    } else {
      next.add(featureId);
    }
    set({ expandedFeatureIds: next });
    get().recomputeGraph();
  },

  selectNode: (nodeId) => {
    set({ selectedNodeId: nodeId });
    get().recomputeGraph();
  },

  setSearchTerm: (term) => {
    set({ searchTerm: term });
  },

  setFocusFilter: (filter) => {
    set({ activeFocusFilter: filter });
    get().recomputeGraph();
  },

  recomputeGraph: () => {
    const {
      domains,
      features,
      components,
      relationships,
      expandedDomainIds,
      expandedFeatureIds,
      selectedNodeId,
      activeFocusFilter,
      nodes: currentNodes,
      edges: currentEdges
    } = get();

    const { nodes: nextNodes, edges: nextEdges } = computeGraphLayout({
      domains,
      features,
      components,
      relationships,
      expandedDomainIds,
      expandedFeatureIds,
      selectedNodeId,
      activeFocusFilter
    });

    // Node-level Graph Diffing Engine (Task 6)
    const currentNodesMap = new Map(currentNodes.map(n => [n.id, n]));
    const patchedNodes = nextNodes.map(nextNode => {
      const currentNode = currentNodesMap.get(nextNode.id);
      if (currentNode) {
        // If the node expanded state changed, reset its layout position. Otherwise, preserve user dragged/custom coordinates
        const positionChanged = currentNode.data.isExpanded !== nextNode.data.isExpanded;
        return {
          ...currentNode,
          type: nextNode.type,
          data: nextNode.data,
          position: positionChanged ? nextNode.position : (currentNode.position || nextNode.position)
        };
      }
      return nextNode;
    });

    // Edge-level Graph Diffing Engine (Task 6)
    const currentEdgesMap = new Map(currentEdges.map(e => [e.id, e]));
    const patchedEdges = nextEdges.map(nextEdge => {
      const currentEdge = currentEdgesMap.get(nextEdge.id);
      if (currentEdge) {
        return {
          ...currentEdge,
          label: nextEdge.label,
          style: nextEdge.style,
          animated: nextEdge.animated,
          className: nextEdge.className,
          markerEnd: nextEdge.markerEnd
        };
      }
      return nextEdge;
    });

    set({ nodes: patchedNodes, edges: patchedEdges });
  },

  onNodesChange: (changes) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes)
    });
  },

  onEdgesChange: (changes) => {
    set({
      edges: applyEdgeChanges(changes, get().edges)
    });
  }
}));
export * from './types';
