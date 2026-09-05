import { useState, type FormEvent } from 'react';
import { SwarmDaemon } from '../types';
import { swarmSimulator } from '../services/mockDaemonSwarm';
import {
  Server,
  Activity,
  Terminal,
  Shield,
  Search,
  Power,
  RefreshCw,
  Cpu,
  CheckCircle2,
  XCircle,
  AlertTriangle,
} from 'lucide-react';

interface SwarmDaemonsPanelProps {
  daemons: SwarmDaemon[];
  onToggleDaemon: (id: string) => void;
  onRefreshHealth: () => void;
}

export function SwarmDaemonsPanel({
  daemons,
  onToggleDaemon,
  onRefreshHealth,
}: SwarmDaemonsPanelProps) {
  const [commandInput, setCommandInput] = useState('npm test');
  const [commandOutput, setCommandOutput] = useState<string | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [logs, setLogs] = useState(swarmSimulator.getLogs());

  const handleRunCommand = async (e: FormEvent) => {
    e.preventDefault();
    if (!commandInput.trim() || isExecuting) return;

    setIsExecuting(true);
    const output = await swarmSimulator.executeRunnerCommand(commandInput);
    setCommandOutput(output);
    setIsExecuting(false);
    setLogs(swarmSimulator.getLogs());
  };

  const refreshLogs = () => {
    setLogs(swarmSimulator.getLogs());
    onRefreshHealth();
  };

  return (
    <div className="flex-1 bg-[#141416] text-zinc-200 p-6 overflow-y-auto select-none text-xs">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-[#27272a]">
        <div>
          <div className="flex items-center gap-2">
            <Server className="w-5 h-5 text-blue-400" />
            <h2 className="text-base font-bold text-zinc-100">
              Enjambre Soberano de Micro-Daemons (Go Localhost)
            </h2>
          </div>
          <p className="text-zinc-400 text-xs mt-1">
            4 daemons nativos en Go vinculados a puertos locales. Toda la inferencia y almacenamiento se realizan dentro de la máquina del usuario.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={refreshLogs}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#202024] hover:bg-[#2c2c32] border border-zinc-700 text-zinc-200 text-xs font-medium transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refrescar Swarm</span>
          </button>
        </div>
      </div>

      {/* 4 Daemons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 my-6">
        {daemons.map((daemon) => {
          const isOnline = daemon.status === 'online';
          return (
            <div
              key={daemon.id}
              className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                isOnline
                  ? 'bg-[#1a1a1e] border-zinc-800 shadow-lg shadow-black/40'
                  : 'bg-rose-950/20 border-rose-900/40'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-900/30 text-blue-400 border border-blue-700/40 font-semibold">
                      PORT {daemon.port}
                    </span>
                    <h3 className="font-semibold text-zinc-100 text-sm mt-1.5">
                      {daemon.name.split(' ')[0]} {daemon.name.split(' ')[1]}
                    </h3>
                  </div>
                  <div
                    className={`flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                      isOnline
                        ? 'bg-emerald-900/30 text-emerald-400 border border-emerald-700/40'
                        : 'bg-rose-900/30 text-rose-400 border border-rose-700/40'
                    }`}
                  >
                    {isOnline ? (
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <XCircle className="w-3 h-3 text-rose-400" />
                    )}
                    <span>{daemon.status.toUpperCase()}</span>
                  </div>
                </div>

                <div className="space-y-1 text-[11px] text-zinc-400">
                  <div className="flex justify-between">
                    <span>Rol:</span>
                    <span className="text-zinc-200 font-medium text-right">{daemon.role}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Stack:</span>
                    <span className="text-zinc-300 font-mono text-[10px]">{daemon.technology}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Latencia:</span>
                    <span className="text-emerald-400 font-mono">{daemon.latencyMs}ms</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Endpoint:</span>
                    <span className="text-blue-400 font-mono text-[10px]">{daemon.endpoint}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-zinc-800 flex items-center justify-between">
                <span className="text-[10px] text-zinc-500">Uptime: {daemon.uptimeSeconds}s</span>
                <button
                  onClick={() => onToggleDaemon(daemon.id)}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
                    isOnline
                      ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300'
                      : 'bg-rose-600 hover:bg-rose-500 text-white'
                  }`}
                >
                  <Power className="w-3 h-3" />
                  <span>{isOnline ? 'Simular Caída' : 'Reiniciar'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Runner Daemon Interactive Sandbox Terminal */}
      <div className="bg-[#1a1a1e] border border-zinc-800 rounded-xl p-4 my-6">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-emerald-400" />
            <h3 className="font-semibold text-zinc-100 text-sm">
              Runner Daemon (:34822) — Shell Sandbox Aislado
            </h3>
          </div>
          <span className="text-[11px] text-zinc-400 font-mono">PTY Isolation: active</span>
        </div>

        <form onSubmit={handleRunCommand} className="flex gap-2 mt-3">
          <div className="flex-1 flex items-center gap-2 bg-[#121214] border border-zinc-700/80 rounded-md px-3 py-1.5 font-mono text-xs">
            <span className="text-emerald-400 font-bold">$</span>
            <input
              type="text"
              value={commandInput}
              onChange={(e) => setCommandInput(e.target.value)}
              placeholder="Ej: npm test, santiago --status, git status"
              className="w-full bg-transparent text-zinc-100 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={isExecuting}
            className="px-4 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-medium text-xs transition-colors"
          >
            {isExecuting ? 'Ejecutando...' : 'Ejecutar'}
          </button>
        </form>

        {commandOutput && (
          <div className="mt-3 p-3 rounded bg-[#0e0e10] border border-zinc-800 font-mono text-[11px] text-zinc-300 whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto">
            {commandOutput}
          </div>
        )}
      </div>

      {/* Live Swarm Request Event Log */}
      <div className="bg-[#1a1a1e] border border-zinc-800 rounded-xl p-4">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-blue-400" />
            <h3 className="font-semibold text-zinc-100 text-sm">
              Registro de Tráfico y Telemetría Local (Sub-100ms)
            </h3>
          </div>
          <button
            onClick={() => {
              swarmSimulator.clearLogs();
              setLogs([]);
            }}
            className="text-[11px] text-zinc-400 hover:text-zinc-200"
          >
            Limpiar logs
          </button>
        </div>

        <div className="mt-3 space-y-1.5 font-mono text-[11px] max-h-60 overflow-y-auto">
          {logs.map((log) => (
            <div
              key={log.id}
              className="flex items-center gap-2 py-1 px-2 rounded bg-[#121214] border border-zinc-800/60"
            >
              <span className="text-zinc-500 shrink-0">{log.timestamp}</span>
              <span
                className={`font-semibold shrink-0 uppercase text-[10px] px-1.5 py-0.2 rounded ${
                  log.daemon === 'gateway'
                    ? 'bg-blue-900/40 text-blue-300'
                    : log.daemon === 'rag'
                    ? 'bg-cyan-900/40 text-cyan-300'
                    : log.daemon === 'runner'
                    ? 'bg-emerald-900/40 text-emerald-300'
                    : 'bg-purple-900/40 text-purple-300'
                }`}
              >
                {log.daemon}
              </span>
              <span className="text-zinc-300 truncate">{log.message}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
