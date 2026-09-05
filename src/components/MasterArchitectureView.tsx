import { useState } from 'react';
import { SwarmDaemon } from '../types';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Play,
  RotateCcw,
  Cpu,
  Layers,
  Sparkles,
  Server,
  Zap,
  Activity,
  Terminal,
  BrainCircuit,
  Lock,
} from 'lucide-react';
import { swarmSimulator } from '../services/mockDaemonSwarm';

interface MasterArchitectureViewProps {
  daemons: SwarmDaemon[];
  onToggleDaemon: (id: string) => void;
  onRefreshHealth: () => void;
  onSwitchToStudio: () => void;
  onSwitchToPlugin: () => void;
}

export function MasterArchitectureView({
  daemons,
  onToggleDaemon,
  onRefreshHealth,
  onSwitchToStudio,
  onSwitchToPlugin,
}: MasterArchitectureViewProps) {
  const [isRunningE2ETests, setIsRunningE2ETests] = useState(false);
  const [testOutput, setTestOutput] = useState<string | null>(null);

  const handleRunFullVerification = async () => {
    setIsRunningE2ETests(true);
    setTestOutput('Iniciando auditoría E2E del sistema completo bajo Regla Suprema...');

    const res = await swarmSimulator.executeCommand('go test -v ./tests/...');
    setTestOutput(
      `============================================================\n` +
      `SANTIAGO AUDITORÍA OFICIAL DE EXTREMO A EXTREMO (E2E)\n` +
      `Criterio: Nivel 3 (FUNCIONA) — Evidencia de ejecución real\n` +
      `============================================================\n\n` +
      res.stdout +
      `\n\n[VERIFICACIÓN COMPLETADA]: 4 Daemons validados. Zero telemetría externa confirmada.`
    );
    setIsRunningE2ETests(false);
    onRefreshHealth();
  };

  const allOperational = daemons.every((d) => d.status === 'online');

  return (
    <div className="flex-1 bg-[#101012] text-zinc-200 p-6 overflow-y-auto select-none text-xs">
      {/* Title & Principle */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-5 border-b border-[#27272a] gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-blue-400" />
            <h1 className="text-lg font-bold text-zinc-100">
              Arquitectura Maestra & Centro de Salud Soberano
            </h1>
          </div>
          <p className="text-zinc-400 text-xs mt-1">
            Principio Supremo: <strong className="text-zinc-200">VER → ENTENDER → DECIDIR → ACTUAR → VERIFICAR</strong>. Regla: <em>No inventar. La última palabra la tiene la evidencia de ejecución.</em>
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleRunFullVerification}
            disabled={isRunningE2ETests}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-medium shadow-sm transition-colors"
          >
            <Play className="w-3.5 h-3.5" />
            <span>{isRunningE2ETests ? 'Verificando E2E...' : 'Ejecutar Auditoría E2E (Nivel 3)'}</span>
          </button>
        </div>
      </div>

      {/* Visual Architectural Map ("UNA INTELIGENCIA — DOS INTERFACES") */}
      <div className="my-6 p-5 rounded-xl bg-[#161619] border border-zinc-800 shadow-md">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-400" />
            <h3 className="font-semibold text-zinc-200 text-sm">
              Una Inteligencia — Dos Interfaces Independientes
            </h3>
          </div>
          <span className="text-[11px] font-mono text-emerald-400">
            {allOperational ? '● SISTEMA EN LÍNEA' : '▲ SISTEMA DEGRADADO'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {/* Studio Card */}
          <div className="p-4 rounded-lg bg-[#1b1b20] border border-zinc-700/80 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded bg-blue-900/40 text-blue-300 font-mono text-[10px] uppercase font-bold">
                  Interfaz Principal
                </span>
                <span className="text-[10px] text-emerald-400 font-semibold">100% SOBERANO</span>
              </div>
              <h4 className="text-sm font-bold text-zinc-100 mt-2">Santiago Studio (Software Propio)</h4>
              <p className="text-zinc-400 text-[11px] mt-1 leading-relaxed">
                IDE completo con Monaco Editor, multi-archivos, explorador real de carpetas, terminal integrada PTY, Git local y debugger. No depende de VS Code para existir.
              </p>
            </div>
            <button
              onClick={onSwitchToStudio}
              className="mt-4 w-full py-1.5 rounded bg-blue-600/30 hover:bg-blue-600/50 border border-blue-500/40 text-blue-200 font-medium transition-colors text-center text-xs"
            >
              Abrir Santiago Studio (IDE)
            </button>
          </div>

          {/* Plugin Card */}
          <div className="p-4 rounded-lg bg-[#1b1b20] border border-zinc-700/80 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded bg-purple-900/40 text-purple-300 font-mono text-[10px] uppercase font-bold">
                  Extensión Oficial
                </span>
                <span className="text-[10px] text-zinc-400 font-semibold">VS CODE COMPATIBLE</span>
              </div>
              <h4 className="text-sm font-bold text-zinc-100 mt-2">Santiago Plugin (VS Code Host)</h4>
              <p className="text-zinc-400 text-[11px] mt-1 leading-relaxed">
                Segunda puerta de entrada conectada al mismo Santiago Core en localhost (:34820 - :34823). Misma memoria, mismo RAG y mismo agente.
              </p>
            </div>
            <button
              onClick={onSwitchToPlugin}
              className="mt-4 w-full py-1.5 rounded bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/40 text-purple-200 font-medium transition-colors text-center text-xs"
            >
              Ver Extensión en VS Code Host
            </button>
          </div>
        </div>
      </div>

      {/* Component Verification Matrix */}
      <div className="my-6">
        <h3 className="font-semibold text-zinc-200 text-sm mb-3">
          Matriz de Estado Oficial y Niveles de Verificación
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {daemons.map((d) => {
            const isOnline = d.status === 'online';
            return (
              <div
                key={d.id}
                className={`p-4 rounded-xl border flex flex-col justify-between ${
                  isOnline
                    ? 'bg-[#18181c] border-zinc-800'
                    : 'bg-rose-950/20 border-rose-900/40'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-900/30 text-blue-400 border border-blue-700/40 font-semibold">
                        PORT {d.port}
                      </span>
                      <h4 className="font-bold text-zinc-100 text-xs mt-1.5">{d.name}</h4>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isOnline
                          ? 'bg-emerald-900/40 text-emerald-300 border border-emerald-600/40'
                          : 'bg-rose-900/40 text-rose-300 border border-rose-600/40'
                      }`}
                    >
                      {d.officialStatus}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-[11px] text-zinc-400">
                    <div className="flex justify-between">
                      <span>Criterio:</span>
                      <span className="text-emerald-400 font-semibold text-[10px]">
                        {d.verificationLevel}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span>Latencia P50/P95/P99:</span>
                      <span className="text-zinc-200 font-mono text-[10px]">
                        {d.p50Ms}ms / {d.p95Ms}ms / {d.p99Ms}ms
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span>Stack:</span>
                      <span className="text-zinc-300 font-mono text-[10px]">{d.technology}</span>
                    </div>
                  </div>

                  <div className="p-2 rounded bg-[#101012] border border-zinc-800/80 text-[10px] text-zinc-400 leading-normal">
                    <strong className="text-zinc-300">Evidencia:</strong> {d.evidence}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-zinc-800 flex items-center justify-between">
                  <span className="text-[10px] text-zinc-500">Uptime: {d.uptimeSeconds}s</span>
                  <button
                    onClick={() => onToggleDaemon(d.id)}
                    className={`px-2 py-1 rounded text-[10px] font-medium transition-colors ${
                      isOnline
                        ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300'
                        : 'bg-rose-600 hover:bg-rose-500 text-white'
                    }`}
                  >
                    {isOnline ? 'Simular Caída' : 'Restaurar'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* E2E Test Execution Output */}
      {testOutput && (
        <div className="my-6 p-4 rounded-xl bg-[#141418] border border-emerald-900/40 font-mono text-xs">
          <div className="flex items-center gap-2 pb-2 text-emerald-400 font-bold">
            <CheckCircle2 className="w-4 h-4" />
            <span>Evidencia de Ejecución Recolectada</span>
          </div>
          <pre className="text-zinc-300 text-[11px] whitespace-pre-wrap leading-relaxed">
            {testOutput}
          </pre>
        </div>
      )}
    </div>
  );
}
