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

  recomputeGraph: () => {
    const {
      domains,
      features,
      components,
      relationships,
      expandedDomainIds,
      expandedFeatureIds,
      selectedNodeId
    } = get();

    const { nodes, edges } = computeGraphLayout({
      domains,
      features,
      components,
      relationships,
      expandedDomainIds,
      expandedFeatureIds,
      selectedNodeId
    });

    set({ nodes, edges });
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
