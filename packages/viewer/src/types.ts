import { type Node, type Edge, type OnNodesChange, type OnEdgesChange } from 'reactflow';

export interface System {
  id: string;
  name: string;
  description: string;
  type?: string;
  schema_version?: number;
  purpose?: string;
  architecture_style?: string;
  runtime_stack?: {
    language: string;
    frameworks: string[];
  };
  operational_maturity?: string;
  repository?: string;
  created_at?: string;
  updated_at?: string;
  last_modified_by?: string;
}

export interface Domain {
  id: string;
  name: string;
  description: string;
  type?: string;
  schema_version?: number;
  purpose?: string;
  ownership?: string;
  capabilities?: string[];
  knowledge_links?: Array<{ type: string; path: string }>;
  enhancements?: Array<{ title: string; priority: string }>;
  created_at?: string;
  updated_at?: string;
  last_modified_by?: string;
}

export interface Feature {
  id: string;
  name: string;
  description: string;
  type?: string;
  schema_version?: number;
  purpose?: string;
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
  capabilities?: string[];
  knowledge_links?: Array<{ type: string; path: string }>;
  enhancements?: Array<{ title: string; priority: string }>;
  created_at?: string;
  updated_at?: string;
  last_modified_by?: string;
}

export interface Component {
  id: string;
  name: string;
  description: string;
  type?: string;
  schema_version?: number;
  purpose?: string;
  domain: string;
  status?: {
    lifecycle?: string;
    implementation?: string;
    reliability?: string;
    observability?: string;
    maturity?: string;
    risk?: string;
  };
  capabilities?: string[];
  knowledge_links?: Array<{ type: string; path: string }>;
  enhancements?: Array<{ title: string; priority: string }>;
  created_at?: string;
  updated_at?: string;
  last_modified_by?: string;
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
  activeFocusFilter: string | null; // high-risk | evolving | unstable | frontend-only | backend-only | deprecated | experimental
  
  nodes: Node[];
  edges: Edge[];
  
  fetchArchitecture: () => Promise<void>;
  setupEventSource: () => void;
  toggleDomain: (domainId: string) => void;
  toggleFeature: (featureId: string) => void;
  selectNode: (nodeId: string | null) => void;
  setSearchTerm: (term: string) => void;
  setFocusFilter: (filter: string | null) => void;
  recomputeGraph: () => void;
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
}
