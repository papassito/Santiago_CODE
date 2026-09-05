import { useState, type FormEvent } from 'react';
import {
  Terminal,
  AlertCircle,
  GitBranch,
  Bug,
  ShieldCheck,
  BrainCircuit,
  Play,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Info,
  Maximize2,
  Minimize2,
  X,
  Sparkles,
  GitCommit as GitCommitIcon,
} from 'lucide-react';
import {
  BottomPanelTab,
  DiagnosticProblem,
  AuditLogEntry,
  GitCommit,
  GitFileStatus,
  DebuggerVariable,
  DebuggerBreakpoint,
} from '../types';
import { swarmSimulator } from '../services/mockDaemonSwarm';

interface BottomPanelProps {
  activeTab: BottomPanelTab;
  onSelectTab: (tab: BottomPanelTab) => void;
  onClose: () => void;
  problems: DiagnosticProblem[];
  onApplyQuickFix: (problem: DiagnosticProblem) => void;
  onOpenFileAtLine?: (filePath: string, line: number) => void;
}

export function BottomPanel({
  activeTab,
  onSelectTab,
  onClose,
  problems,
  onApplyQuickFix,
  onOpenFileAtLine,
}: BottomPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [terminalInput, setTerminalInput] = useState('go test -v ./tests/...');
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    'Santiago Sovereign Runner (:34822) PTY Session Ready',
    'Aislamiento de procesos: Linux Namespaces / Sandbox Local',
    'Escribe un comando o haz clic en las acciones rápidas arriba.',
  ]);
  const [isExecuting, setIsExecuting] = useState(false);

  // Git state
  const gitStatus = swarmSimulator.getGitStatus();
  const [commitMessage, setCommitMessage] = useState('');
  const [gitCommits, setGitCommits] = useState<GitCommit[]>(gitStatus.commits);

  // Debugger state
  const debuggerState = swarmSimulator.getDebuggerState();

  // Audit state
  const auditLogs = swarmSimulator.getAuditLogs();

  // RAG Query state
  const [ragQuery, setRagQuery] = useState('¿Dónde se autentica este usuario?');
  const [ragResult, setRagResult] = useState<any>(null);

  const handleRunCommand = async (cmdToRun?: string) => {
    const cmd = cmdToRun || terminalInput;
    if (!cmd.trim() || isExecuting) return;

    setIsExecuting(true);
    setTerminalLogs((prev) => [...prev, `\n$ ${cmd}`]);

    const res = await swarmSimulator.executeCommand(cmd);
    setTerminalLogs((prev) => [
      ...prev,
      res.stdout || res.stderr,
      `[Exit Code: ${res.exitCode}] • Duración: ${res.durationMs}ms • Verificado bajo Nivel 3`,
    ]);
    setIsExecuting(false);
  };

  const handleGitCommit = (e: FormEvent) => {
    e.preventDefault();
    if (!commitMessage.trim()) return;
    const newC = swarmSimulator.commitGit(commitMessage);
    setGitCommits([newC, ...gitCommits]);
    setCommitMessage('');
  };

  const handleRunRAGQuery = (queryText: string) => {
    setRagQuery(queryText);
    const res = swarmSimulator.queryRAG(queryText);
    setRagResult(res);
  };

  const errorCount = problems.filter((p) => p.severity === 'error').length;
  const warningCount = problems.filter((p) => p.severity === 'warning').length;

  return (
    <div
      className={`bg-[#141416] border-t border-[#27272a] text-zinc-200 flex flex-col transition-all duration-200 select-none ${
        isExpanded ? 'h-96' : 'h-64'
      }`}
    >
      {/* Tab Navigation Header */}
      <div className="h-9 bg-[#18181b] border-b border-[#27272a] flex items-center justify-between px-3 text-xs">
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
          <button
            onClick={() => onSelectTab('terminal')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-t font-medium transition-colors ${
              activeTab === 'terminal'
                ? 'bg-[#141416] text-blue-400 border-b-2 border-blue-500'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#202024]'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Terminal (Runner :34822)</span>
          </button>

          <button
            onClick={() => onSelectTab('problems')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-t font-medium transition-colors ${
              activeTab === 'problems'
                ? 'bg-[#141416] text-amber-400 border-b-2 border-amber-500'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#202024]'
            }`}
          >
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Problemas</span>
            {(errorCount > 0 || warningCount > 0) && (
              <span className="px-1.5 py-0.2 rounded-full bg-amber-950/60 text-amber-300 border border-amber-600/40 text-[10px]">
                {errorCount + warningCount}
              </span>
            )}
          </button>

          <button
            onClick={() => onSelectTab('git')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-t font-medium transition-colors ${
              activeTab === 'git'
                ? 'bg-[#141416] text-emerald-400 border-b-2 border-emerald-500'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#202024]'
            }`}
          >
            <GitBranch className="w-3.5 h-3.5" />
            <span>Git Local (Sin GitHub)</span>
          </button>

          <button
            onClick={() => onSelectTab('debugger')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-t font-medium transition-colors ${
              activeTab === 'debugger'
                ? 'bg-[#141416] text-purple-400 border-b-2 border-purple-500'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#202024]'
            }`}
          >
            <Bug className="w-3.5 h-3.5" />
            <span>Debugger (Go Delve)</span>
          </button>

          <button
            onClick={() => onSelectTab('rag_ast')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-t font-medium transition-colors ${
              activeTab === 'rag_ast'
                ? 'bg-[#141416] text-sky-400 border-b-2 border-sky-500'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#202024]'
            }`}
          >
            <BrainCircuit className="w-3.5 h-3.5" />
            <span>RAG Memory / AST (:34821)</span>
          </button>

          <button
            onClick={() => onSelectTab('audit')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-t font-medium transition-colors ${
              activeTab === 'audit'
                ? 'bg-[#141416] text-rose-400 border-b-2 border-rose-500'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#202024]'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Auditoría Soberana</span>
          </button>
        </div>

        {/* Panel controls */}
        <div className="flex items-center gap-2 text-zinc-400">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 hover:text-zinc-100 hover:bg-[#27272a] rounded transition-colors"
            title={isExpanded ? 'Restaurar tamaño' : 'Maximizar panel'}
          >
            {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={onClose}
            className="p-1 hover:text-zinc-100 hover:bg-[#27272a] rounded transition-colors"
            title="Cerrar panel inferior"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Tab Contents */}
      <div className="flex-1 overflow-auto p-3 font-mono text-xs">
        {/* 1. Terminal / Runner Tab */}
        {activeTab === 'terminal' && (
          <div className="flex flex-col h-full space-y-2">
            {/* Quick action bar */}
            <div className="flex items-center gap-2 pb-2 border-b border-zinc-800 text-[11px] font-sans">
              <span className="text-zinc-400">Comandos rápidos:</span>
              <button
                onClick={() => handleRunCommand('go test -v ./tests/...')}
                className="px-2 py-0.5 rounded bg-[#202024] hover:bg-[#2e2e34] border border-zinc-700 text-blue-300 font-mono text-[10px]"
              >
                go test ./tests/...
              </button>
              <button
                onClick={() => handleRunCommand('go build ./cmd/santiago/...')}
                className="px-2 py-0.5 rounded bg-[#202024] hover:bg-[#2e2e34] border border-zinc-700 text-emerald-300 font-mono text-[10px]"
              >
                go build ./...
              </button>
              <button
                onClick={() => handleRunCommand('git status')}
                className="px-2 py-0.5 rounded bg-[#202024] hover:bg-[#2e2e34] border border-zinc-700 text-zinc-300 font-mono text-[10px]"
              >
                git status
              </button>
              <button
                onClick={() => setTerminalLogs([])}
                className="ml-auto text-zinc-500 hover:text-zinc-300 text-[10px]"
              >
                Limpiar
              </button>
            </div>

            {/* Terminal logs */}
            <div className="flex-1 overflow-y-auto font-mono text-[11px] space-y-1 text-zinc-300 whitespace-pre-wrap leading-relaxed">
              {terminalLogs.map((line, idx) => (
                <div key={idx} className={line.startsWith('$') ? 'text-emerald-400 font-bold' : ''}>
                  {line}
                </div>
              ))}
            </div>

            {/* Prompt input */}
            <div className="flex items-center gap-2 pt-2 border-t border-zinc-800">
              <span className="text-emerald-400 font-bold">$</span>
              <input
                type="text"
                value={terminalInput}
                onChange={(e) => setTerminalInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleRunCommand();
                }}
                placeholder="Escribe comando para Santiago Runner..."
                className="flex-1 bg-transparent text-zinc-100 focus:outline-none font-mono text-xs"
              />
              <button
                onClick={() => handleRunCommand()}
                disabled={isExecuting}
                className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-sans text-xs transition-colors"
              >
                {isExecuting ? 'Ejecutando...' : 'Ejecutar'}
              </button>
            </div>
          </div>
        )}

        {/* 2. Problems Tab */}
        {activeTab === 'problems' && (
          <div className="space-y-2 font-sans">
            {problems.length === 0 ? (
              <div className="flex items-center gap-2 text-emerald-400 py-6 justify-center">
                <CheckCircle2 className="w-5 h-5" />
                <span>No se detectaron problemas en el workspace. 0 errores, 0 advertencias.</span>
              </div>
            ) : (
              problems.map((prob) => (
                <div
                  key={prob.id}
                  className="flex items-start justify-between p-3 rounded-lg bg-[#1a1a1e] border border-zinc-800 hover:border-zinc-700 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    {prob.severity === 'error' ? (
                      <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    ) : prob.severity === 'warning' ? (
                      <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    ) : (
                      <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <div className="text-zinc-200 font-medium text-xs flex items-center gap-2">
                        <span>{prob.message}</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400">
                          {prob.source} [{prob.code}]
                        </span>
                      </div>
                      <div
                        onClick={() => onOpenFileAtLine && onOpenFileAtLine(prob.filePath, prob.line)}
                        className="text-[11px] text-zinc-500 font-mono mt-1 hover:text-blue-400 cursor-pointer"
                      >
                        {prob.filePath}:{prob.line}:{prob.column}
                      </div>
                    </div>
                  </div>

                  {prob.quickFix && (
                    <button
                      onClick={() => onApplyQuickFix(prob)}
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/40 text-blue-300 text-xs font-medium transition-colors shrink-0"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                      <span>{prob.quickFix.label}</span>
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* 3. Git Local Tab */}
        {activeTab === 'git' && (
          <div className="space-y-4 font-sans">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
              <div className="flex items-center gap-2 text-xs">
                <GitBranch className="w-4 h-4 text-emerald-400" />
                <span className="text-zinc-300 font-semibold">Rama Local: main</span>
                <span className="text-zinc-500 text-[11px]">(Sin dependencia de GitHub / 100% Soberano)</span>
              </div>
            </div>

            {/* Commit Box */}
            <form onSubmit={handleGitCommit} className="flex gap-2">
              <input
                type="text"
                value={commitMessage}
                onChange={(e) => setCommitMessage(e.target.value)}
                placeholder="Mensaje de commit local..."
                className="flex-1 bg-[#1c1c20] border border-zinc-700/80 rounded-md px-3 py-1.5 text-xs text-zinc-100 focus:outline-none focus:border-emerald-500"
              />
              <button
                type="submit"
                disabled={!commitMessage.trim()}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-medium transition-colors"
              >
                <GitCommitIcon className="w-3.5 h-3.5" />
                <span>Commit Local</span>
              </button>
            </form>

            {/* Commit History */}
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Historial de Commits</h4>
              <div className="space-y-1.5">
                {gitCommits.map((c) => (
                  <div key={c.hash} className="p-2.5 rounded bg-[#1a1a1e] border border-zinc-800 text-xs flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-emerald-400 text-[11px]">{c.hash}</span>
                      <span className="text-zinc-200">{c.message}</span>
                    </div>
                    <span className="text-zinc-500 text-[11px]">{c.date}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 4. Debugger Tab */}
        {activeTab === 'debugger' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-sans">
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-zinc-400 uppercase">Variables en Memoria (Go Runtime)</h4>
              <div className="p-3 rounded-lg bg-[#1a1a1e] border border-zinc-800 space-y-1.5 font-mono text-xs">
                {debuggerState.variables.map((v) => (
                  <div key={v.name} className="flex justify-between border-b border-zinc-800/60 pb-1">
                    <span className="text-sky-300">{v.name}</span>
                    <span className="text-emerald-300">{v.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-zinc-400 uppercase">Call Stack & Breakpoints</h4>
              <div className="p-3 rounded-lg bg-[#1a1a1e] border border-zinc-800 space-y-1.5 font-mono text-[11px] text-zinc-300">
                {debuggerState.callStack.map((frame, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <span className="text-purple-300">{frame.func}</span>
                    <span className="text-zinc-500">{frame.file}:{frame.line}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 5. RAG Memory & AST Tab */}
        {activeTab === 'rag_ast' && (
          <div className="space-y-3 font-sans">
            <div className="flex flex-wrap gap-2 text-xs">
              {[
                '¿Dónde se autentica este usuario?',
                '¿Quién llama a esta función?',
                '¿Qué módulos dependen de este servicio?',
                '¿Qué puede romper este cambio?',
              ].map((q) => (
                <button
                  key={q}
                  onClick={() => handleRunRAGQuery(q)}
                  className="px-2.5 py-1 rounded-full bg-[#1e1e24] hover:bg-[#2b2b34] border border-zinc-700 text-sky-300 text-xs transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>

            {ragResult && (
              <div className="p-4 rounded-xl bg-[#1a1a1e] border border-sky-900/40 space-y-3 text-xs">
                <div className="font-semibold text-sky-400 flex items-center gap-1.5">
                  <BrainCircuit className="w-4 h-4" />
                  <span>Respuesta del Grafo AST Soberano (:34821)</span>
                </div>
                <p className="text-zinc-200 leading-relaxed">{ragResult.answer}</p>
                <div className="flex items-center gap-2 text-[11px] text-zinc-400 font-mono">
                  <span>Archivos vinculados:</span>
                  {ragResult.files.map((f: string) => (
                    <span key={f} className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300">
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 6. Audit Trail Tab */}
        {activeTab === 'audit' && (
          <div className="space-y-2 font-sans">
            <div className="text-[11px] text-zinc-400 mb-2">
              Registro inmutable de evidencia. Toda acción ejecutada por el agente o el usuario deja huella verificable.
            </div>
            <div className="space-y-1.5 font-mono text-[11px]">
              {auditLogs.map((entry) => (
                <div
                  key={entry.id}
                  className="p-2.5 rounded bg-[#1a1a1e] border border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="text-zinc-500">{entry.timestamp}</span>
                    <span className="px-1.5 py-0.5 rounded bg-blue-900/30 text-blue-300 text-[10px] font-semibold uppercase">
                      {entry.actor}
                    </span>
                    <span className="font-bold text-zinc-200">[{entry.action}]</span>
                    <span className="text-zinc-300 truncate">{entry.target}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-600/40">
                      {entry.verificationLevel}
                    </span>
                    <span className="text-zinc-400 text-[10px]">Exit: {entry.exitCode ?? 0}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
