import { corePages, DocPage } from './pages/core';
import { cliPages } from './pages/cli';
import { advancedPages } from './pages/advanced';

export type { DocPage, DocBlock } from './pages/core';

export const allPages: DocPage[] = [
  ...corePages,
  ...cliPages,
  ...advancedPages
];

export interface SidebarCategory {
  title: string;
  links: { label: string; slug: string }[];
}

export const sidebarNavigation: SidebarCategory[] = [
  {
    title: 'Getting Started',
    links: [
      { label: 'Introduction to AAM', slug: 'introduction' },
      { label: 'Cognitive Drift', slug: 'cognitive-drift' },
      { label: 'Core Philosophy', slug: 'philosophy' },
      { label: 'Quick Start Guide', slug: 'quick-start' },
      { label: 'Installation', slug: 'installation' }
    ]
  },
  {
    title: 'Reference Manual',
    links: [
      { label: 'CLI Operations', slug: 'cli' },
      { label: 'YAML Schema Spec', slug: 'yaml-schema' }
    ]
  },
  {
    title: 'Advanced & Integrations',
    links: [
      { label: 'Interactive Console', slug: 'viewer' },
      { label: 'AI Agent Integrations', slug: 'ai-integrations' },
      { label: 'Multi-Agent Governance', slug: 'governance' }
    ]
  },
  {
    title: 'Blueprints',
    links: [
      { label: 'Examples & Blueprints', slug: 'examples' },
      { label: 'Product Roadmap', slug: 'roadmap' }
    ]
  }
];

export function getPageBySlug(slug: string): DocPage | undefined {
  if (slug === 'docs') {
    return allPages.find(p => p.slug === 'introduction');
  }
  return allPages.find(p => p.slug === slug);
}
