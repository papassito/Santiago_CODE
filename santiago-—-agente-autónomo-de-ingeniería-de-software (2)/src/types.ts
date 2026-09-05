export type SectionKey =
  | 'overview'
  | 'tactical-console'
  | 'autofix-loop'
  | 'local-rag'
  | 'kri-metrics'
  | 'jesus-dna'
  | 'bunker-crypto'
  | 'multimodal-installer'
  | 'antigravity-vscode'
  | 'project-tree'
  | 'components'
  | 'go-interfaces'
  | 'data-flow'
  | 'memory-model'
  | 'tools-model'
  | 'permissions-model'
  | 'audit-model'
  | 'ollama-strategy'
  | 'test-strategy'
  | 'technical-risks'
  | 'dependencies'
  | 'acceptance-criteria'
  | 'expert-problem-solving'
  | 'objectivity-rigor'
  | 'programmability'
  | 'windows-optimization'
  | 'simulator-policy'
  | 'simulator-protocol';

export type PermissionLevel =
  | 'READ_ONLY'
  | 'ANALYZE'
  | 'PROPOSE'
  | 'MODIFY'
  | 'EXECUTE'
  | 'ADMIN';

export type RiskLevel = 'SAFE' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface SpecSection {
  id: SectionKey;
  number: number | string;
  title: string;
  shortDesc: string;
  category: 'Operativa Táctica' | 'Core Architecture' | 'Intelligence & Execution' | 'Security & Platform' | 'Certification';
  badge?: string;
}

export interface GoFileRecord {
  path: string;
  name: string;
  package: string;
  description: string;
  code: string;
}

export interface AuditRecord {
  id: string;
  timestamp: string;
  projectId: string;
  operation: string;
  actor: string;
  tool: string;
  target: string;
  risk: 'SAFE' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  permRequired: string;
  userAuthorized: boolean;
  result: 'SUCCESS' | 'FAILED' | 'BLOCKED' | 'ROLLED_BACK';
  evidenceStatus: 'VERIFIED' | 'INFERENCE' | 'HYPOTHESIS' | 'UNKNOWN' | 'INSUFFICIENT_EVIDENCE';
}
