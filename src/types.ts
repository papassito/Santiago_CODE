export type InterfaceMode = 'studio' | 'plugin' | 'architecture';

export type BottomPanelTab = 'terminal' | 'problems' | 'git' | 'debugger' | 'audit' | 'rag_ast';

export type OfficialStatus =
  | 'DECLARADO'
  | 'DISEÑADO'
  | 'IMPLEMENTADO'
  | 'CONECTADO'
  | 'VERIFICADO'
  | 'OPERACIONAL'
  | 'FALLIDO'
  | 'DESCONOCIDO';

export type VerificationLevel = 'NIVEL_1_EXISTE' | 'NIVEL_2_EJECUTA' | 'NIVEL_3_FUNCIONA';

export interface ComponentHealth {
  id: string;
  name: string;
  subsystem: 'Gateway' | 'RAG' | 'Runner' | 'Vault' | 'Voice' | 'Agent';
  port?: number;
  status: 'online' | 'offline' | 'degraded';
  officialStatus: OfficialStatus;
  verificationLevel: VerificationLevel;
  p50Ms: number;
  p95Ms: number;
  p99Ms: number;
  uptimeSeconds: number;
  lastVerified: string;
  verificationEvidence: string;
}

export interface SwarmDaemon {
  id: string;
  name: string;
  port: number;
  role: string;
  technology: string;
  status: 'online' | 'offline' | 'degraded';
  officialStatus: OfficialStatus;
  verificationLevel: VerificationLevel;
  latencyMs: number;
  p50Ms: number;
  p95Ms: number;
  p99Ms: number;
  uptimeSeconds: number;
  endpoint: string;
  evidence: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  codeBlocks?: Array<{
    language: string;
    code: string;
  }>;
  isStreaming?: boolean;
  agentSteps?: AgentPlanStep[];
  metadata?: {
    daemon?: string;
    tokens?: number;
    latencyMs?: number;
    evidenceVerified?: boolean;
    exitCode?: number;
  };
}

export interface AgentPlanStep {
  id: string;
  phase: 'VER' | 'ENTENDER' | 'DECIDIR' | 'ACTUAR' | 'VERIFICAR';
  label: string;
  detail: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  command?: string;
  exitCode?: number;
  stdout?: string;
  changedFiles?: string[];
  verificationLevel?: VerificationLevel;
}

export interface EditorFile {
  id: string;
  name: string;
  path: string;
  language: string;
  content: string;
  isModified?: boolean;
  folder?: string;
}

export interface DiagnosticProblem {
  id: string;
  fileId: string;
  filePath: string;
  line: number;
  column: number;
  severity: 'error' | 'warning' | 'info';
  source: 'go-compiler' | 'golangci-lint' | 'typescript-checker' | 'santiago-runner';
  code: string;
  message: string;
  quickFix?: {
    label: string;
    suggestedCode: string;
  };
}

export interface GitFileStatus {
  path: string;
  status: 'modified' | 'untracked' | 'staged' | 'deleted';
  diff?: string;
}

export interface GitCommit {
  hash: string;
  author: string;
  date: string;
  message: string;
  filesCount: number;
}

export interface DebuggerBreakpoint {
  id: string;
  fileId: string;
  line: number;
  enabled: boolean;
  condition?: string;
}

export interface DebuggerVariable {
  name: string;
  value: string;
  type: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actor: 'User' | 'Santiago-Agent' | 'Runner-Daemon' | 'Vault-Daemon' | 'RAG-Indexer';
  action: 'INSPECT' | 'EDIT' | 'COMPILE' | 'TEST' | 'VERIFY' | 'EXECUTE_PTY' | 'VAULT_SECRET_READ';
  target: string;
  reason: string;
  input: string;
  result: string;
  exitCode?: number;
  filesChanged?: string[];
  verificationLevel: VerificationLevel;
  verified: boolean;
}

export interface ExtensionDeliverableFile {
  path: string;
  title: string;
  description: string;
  language: string;
  content: string;
}

export interface AutocompleteContext {
  prefix: string;
  suffix: string;
  language: string;
  filePath: string;
  line: number;
  column: number;
}

export interface AutocompleteResponse {
  completion: string;
  latencyMs: number;
  p50: number;
  p95: number;
  p99: number;
  model: string;
  cached: boolean;
}
