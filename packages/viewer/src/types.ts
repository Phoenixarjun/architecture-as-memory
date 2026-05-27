import { type Node, type Edge, type OnNodesChange, type OnEdgesChange } from 'reactflow';

export interface System {
  id: string;
  name: string;
  description: string;
  architecture_style?: string;
  runtime_stack?: {
    language: string;
    frameworks: string[];
  };
  operational_maturity?: string;
  repository?: string;
}

export interface Domain {
  id: string;
  name: string;
  description: string;
  ownership?: string;
}

export interface Feature {
  id: string;
  name: string;
  description: string;
  domains: string[];
  components: string[];
  status?: {
    lifecycle?: string;
    implementation?: string;
    reliability?: string;
    observability?: string;
    maturity?: string;
    risk?: string;
    change_frequency?: string;
  };
  relationships?: Relationship[];
}

export interface Component {
  id: string;
  name: string;
  description: string;
  domain: string;
  status?: {
    lifecycle?: string;
    implementation?: string;
    reliability?: string;
    observability?: string;
    maturity?: string;
    risk?: string;
  };
}

export interface Relationship {
  source: string;
  target: string;
  type: string;
  description?: string;
}

export interface ArchitectureState {
  system: System;
  domains: Domain[];
  features: Feature[];
  components: Component[];
  relationships: Relationship[];
  
  isLoading: boolean;
  isSyncing: boolean;
  selectedNodeId: string | null;
  expandedDomainIds: Set<string>;
  expandedFeatureIds: Set<string>;
  searchTerm: string;
  
  nodes: Node[];
  edges: Edge[];
  
  fetchArchitecture: () => Promise<void>;
  setupEventSource: () => void;
  toggleDomain: (domainId: string) => void;
  toggleFeature: (featureId: string) => void;
  selectNode: (nodeId: string | null) => void;
  setSearchTerm: (term: string) => void;
  recomputeGraph: () => void;
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
}
